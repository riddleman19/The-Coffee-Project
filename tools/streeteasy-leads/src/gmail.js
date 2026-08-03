// Gmail API helpers shared by both CLIs.

export const INQUIRY_QUERY =
  'from:noreply@email.streeteasy.com subject:"StreetEasy Inquiry From"';

/** List all message IDs matching a Gmail search query (handles pagination). */
export async function listMessageIds(gmail, query) {
  const ids = [];
  let pageToken;
  do {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 100,
      pageToken,
    });
    for (const m of res.data.messages ?? []) ids.push(m);
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return ids;
}

function b64decode(data) {
  return Buffer.from(data, 'base64url').toString('utf8');
}

/** Walk a message payload and collect the text/plain and text/html parts. */
export function extractBodies(payload) {
  let plain = '';
  let html = '';
  const stack = [payload];
  while (stack.length) {
    const part = stack.pop();
    if (!part) continue;
    if (part.parts) stack.push(...part.parts);
    if (part.body?.data) {
      if (part.mimeType === 'text/plain') plain += b64decode(part.body.data);
      else if (part.mimeType === 'text/html') html += b64decode(part.body.data);
    }
  }
  return { plain, html };
}

export function getHeader(payload, name) {
  const h = (payload.headers ?? []).find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  );
  return h ? h.value : '';
}

/** Find-or-create a label by name; returns its ID. */
export async function ensureLabel(gmail, name) {
  const res = await gmail.users.labels.list({ userId: 'me' });
  const existing = res.data.labels.find((l) => l.name === name);
  if (existing) return existing.id;
  const created = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
    },
  });
  return created.data.id;
}

/** Build a raw RFC 2822 reply message, base64url-encoded for the Gmail API. */
export function buildReply({ to, from, subject, inReplyTo, references, body }) {
  const headers = [
    `To: ${to}`,
    from ? `From: ${from}` : null,
    `Subject: ${subject.startsWith('Re:') ? subject : `Re: ${subject}`}`,
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : null,
    references ? `References: ${references}` : null,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
  ].filter(Boolean);
  const raw = headers.join('\r\n') + '\r\n\r\n' + body;
  return Buffer.from(raw).toString('base64url');
}

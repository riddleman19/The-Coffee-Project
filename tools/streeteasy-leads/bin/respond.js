#!/usr/bin/env node
// Auto-respond to new StreetEasy inquiries.
//
// Safe by default: creates DRAFTS in the same thread so you can review before
// sending. Pass --send to send replies immediately. Threads you've already
// replied to (or that were already auto-processed) are skipped, and leads
// older than --max-age-days are ignored so a first run never blasts old leads.
//
// Usage:
//   node bin/respond.js                  # draft replies for inquiries < 3 days old
//   node bin/respond.js --send           # actually send them
//   node bin/respond.js --max-age-days 7 --template mytemplate.txt

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { getGmail } from '../src/auth.js';
import { parseLead } from '../src/parser.js';
import {
  INQUIRY_QUERY,
  buildReply,
  ensureLabel,
  extractBodies,
  getHeader,
  listMessageIds,
} from '../src/gmail.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PROCESSED_LABEL = 'StreetEasy Auto-Replied';

const { values: opts } = parseArgs({
  options: {
    send: { type: 'boolean', default: false },
    'max-age-days': { type: 'string', default: '3' },
    template: { type: 'string', default: path.join(ROOT, 'template.txt') },
  },
});

function render(template, lead) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => lead[key] ?? '');
}

const maxAgeDays = Number(opts['max-age-days']);
const template = await fs.readFile(opts.template, 'utf8');
const gmail = await getGmail();
const labelId = await ensureLabel(gmail, PROCESSED_LABEL);

const query = `${INQUIRY_QUERY} newer_than:${maxAgeDays}d`;
const messages = await listMessageIds(gmail, query);
console.log(`Found ${messages.length} inquiry message(s) in the last ${maxAgeDays} day(s).`);

const seenThreads = new Set();
let handled = 0;

for (const { id, threadId } of messages) {
  if (seenThreads.has(threadId)) continue;
  seenThreads.add(threadId);

  const thread = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
    format: 'full',
  });
  const msgs = thread.data.messages;

  const alreadyReplied = msgs.some(
    (m) => m.labelIds?.includes('SENT') || m.labelIds?.includes(labelId)
  );
  if (alreadyReplied) {
    console.log(`- skip ${threadId}: already replied/processed`);
    continue;
  }

  const inquiry = msgs.find((m) => m.id === id) ?? msgs[0];
  const { plain, html } = extractBodies(inquiry.payload);
  const lead = parseLead({
    subject: getHeader(inquiry.payload, 'Subject'),
    html,
    plain,
    date: getHeader(inquiry.payload, 'Date'),
  });
  if (!lead?.email) {
    console.log(`- skip ${threadId}: could not parse a lead email address`);
    continue;
  }

  const messageId = getHeader(inquiry.payload, 'Message-ID');
  const raw = buildReply({
    to: lead.email,
    subject: getHeader(inquiry.payload, 'Subject'),
    inReplyTo: messageId,
    references: messageId,
    body: render(template, lead),
  });

  if (opts.send) {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw, threadId },
    });
    console.log(`- SENT reply to ${lead.name} <${lead.email}> re: ${lead.listingAddress}`);
  } else {
    await gmail.users.drafts.create({
      userId: 'me',
      requestBody: { message: { raw, threadId } },
    });
    console.log(`- drafted reply to ${lead.name} <${lead.email}> re: ${lead.listingAddress}`);
  }

  await gmail.users.threads.modify({
    userId: 'me',
    id: threadId,
    requestBody: { addLabelIds: [labelId] },
  });
  handled++;
}

console.log(
  `Done. ${handled} repl${handled === 1 ? 'y' : 'ies'} ${opts.send ? 'sent' : 'drafted (review them in Gmail > Drafts)'}.`
);

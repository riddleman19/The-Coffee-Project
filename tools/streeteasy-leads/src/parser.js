// Parses a StreetEasy inquiry notification email into a structured lead.
//
// StreetEasy embeds machine-readable metadata in the HTML head of every
// inquiry email, e.g.:
//   <meta name="lead_name" content="MARY KIDWELL">
//   <meta name="lead_email" content="maryvoo786@gmail.com">
//   <meta name="lead_phone" content="+13476224823">
//   <meta name="lead_property_address" content="72-30 45th Avenue #411 Woodside, NY, 11377">
// We read those first and fall back to regex extraction from the subject and
// plain-text body if they're ever missing.

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'" };

function decodeEntities(s) {
  return s.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (m) => ENTITIES[m]);
}

function extractMetaTags(html) {
  const meta = {};
  const re = /<meta\s+name="(lead_[a-z_]+)"\s+content="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    meta[m[1]] = decodeEntities(m[2]).trim();
  }
  return meta;
}

/**
 * @param {object} args
 * @param {string} args.subject  e.g. "72-30 45th Avenue #411 StreetEasy Inquiry From MARY KIDWELL"
 * @param {string} args.html     full HTML body
 * @param {string} args.plain    plain-text body
 * @param {string} args.date     RFC date of the message
 * @returns {object|null} lead, or null if this isn't an inquiry email
 */
export function parseLead({ subject = '', html = '', plain = '', date = '' }) {
  const subjectMatch = subject.match(/^(?:Re:\s*)?(.*?)\s*StreetEasy Inquiry From\s+(.+)$/i);
  if (!subjectMatch && !html.includes('lead_information_version')) return null;

  const meta = extractMetaTags(html);
  const text = plain || html.replace(/<[^>]+>/g, ' ');

  const name = meta.lead_name || (subjectMatch ? subjectMatch[2].trim() : '');
  const email =
    meta.lead_email ||
    (text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/) || [''])[0];
  const phone =
    meta.lead_phone ||
    (text.match(/\+?1?[\s.(-]*\d{3}[\s.)-]*\d{3}[\s.-]*\d{4}/) || [''])[0].trim();
  const message = (meta.lead_message || '').replace(/^Message:\s*/i, '');

  return {
    name,
    firstName: name.split(/\s+/)[0] || '',
    email: email.toLowerCase(),
    phone,
    address: meta.lead_property_address || (subjectMatch ? subjectMatch[1].trim() : ''),
    listingAddress: meta.lead_tag || (subjectMatch ? subjectMatch[1].trim() : ''),
    price: meta.lead_property_price || '',
    bedrooms: meta.lead_property_bedrooms || '',
    listingUrl: meta.lead_property_url || '',
    message,
    inquiryDate: date,
  };
}

/** Escape a value for a CSV cell. */
export function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(leads) {
  const header = [
    'name', 'email', 'phone', 'property_address', 'price',
    'bedrooms', 'inquiry_date', 'message', 'listing_url',
  ];
  const rows = leads.map((l) =>
    [l.name, l.email, l.phone, l.address, l.price, l.bedrooms, l.inquiryDate, l.message, l.listingUrl]
      .map(csvCell)
      .join(',')
  );
  return [header.join(','), ...rows].join('\n') + '\n';
}

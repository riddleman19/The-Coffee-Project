#!/usr/bin/env node
// Export every StreetEasy lead's contact info (name, email, phone, listing,
// message) to a CSV file, deduplicated by email address.
//
// Usage:
//   node bin/export-csv.js                       # writes leads.csv
//   node bin/export-csv.js --out mylist.csv
//   node bin/export-csv.js --since 2025/01/01    # only inquiries after a date

import fs from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { getGmail } from '../src/auth.js';
import { parseLead, toCsv } from '../src/parser.js';
import {
  INQUIRY_QUERY,
  extractBodies,
  getHeader,
  listMessageIds,
} from '../src/gmail.js';

const { values: opts } = parseArgs({
  options: {
    out: { type: 'string', default: 'leads.csv' },
    since: { type: 'string' },
  },
});

const gmail = await getGmail();
const query = opts.since ? `${INQUIRY_QUERY} after:${opts.since}` : INQUIRY_QUERY;
const messages = await listMessageIds(gmail, query);
console.log(`Found ${messages.length} inquiry message(s).`);

// Dedupe by email, keeping the most recent inquiry per person.
const byEmail = new Map();

for (const { id } of messages) {
  const res = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
  const { plain, html } = extractBodies(res.data.payload);
  const lead = parseLead({
    subject: getHeader(res.data.payload, 'Subject'),
    html,
    plain,
    date: getHeader(res.data.payload, 'Date'),
  });
  if (!lead?.email) continue;

  const existing = byEmail.get(lead.email);
  if (!existing || new Date(lead.inquiryDate) > new Date(existing.inquiryDate)) {
    byEmail.set(lead.email, lead);
  }
}

const leads = [...byEmail.values()].sort(
  (a, b) => new Date(b.inquiryDate) - new Date(a.inquiryDate)
);
await fs.writeFile(opts.out, toCsv(leads));
console.log(`Wrote ${leads.length} unique lead(s) to ${opts.out}`);

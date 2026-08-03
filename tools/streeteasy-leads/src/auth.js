import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// gmail.modify covers reading, drafting, sending, and labeling —
// everything both tools need, without full account access.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TOKEN_PATH = path.join(ROOT, 'token.json');
const CREDENTIALS_PATH = path.join(ROOT, 'credentials.json');

async function loadSavedClient() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    return google.auth.fromJSON(JSON.parse(content));
  } catch {
    return null;
  }
}

async function saveClient(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  await fs.writeFile(
    TOKEN_PATH,
    JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    })
  );
}

/** Returns an authenticated Gmail API client. First run opens a browser for OAuth consent. */
export async function getGmail() {
  let client = await loadSavedClient();
  if (!client) {
    client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
    if (client.credentials) await saveClient(client);
  }
  return google.gmail({ version: 'v1', auth: client });
}

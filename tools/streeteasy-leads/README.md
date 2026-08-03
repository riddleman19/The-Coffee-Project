# StreetEasy Lead Tools

Two small CLIs that connect to your Gmail account:

1. **`npm run respond`** — finds new StreetEasy inquiry emails and replies to each
   lead using a template. Creates **drafts by default** so you can review before
   anything goes out; add `--send` to send automatically.
2. **`npm run export`** — extracts every lead's **name, email, phone, listing,
   price, and message** into a deduplicated CSV.

Both work off StreetEasy's inquiry notification emails
(`noreply@email.streeteasy.com`, subject `... StreetEasy Inquiry From <name>`),
which embed structured `lead_*` metadata in the HTML — so extraction is exact,
not guesswork.

## One-time setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/), create a
   project, and enable the **Gmail API**.
2. Configure the OAuth consent screen (External, add your own Gmail address as a
   test user).
3. Create an **OAuth client ID** of type **Desktop app**, download the JSON, and
   save it as `credentials.json` in this folder.
4. Install and run:

   ```bash
   cd tools/streeteasy-leads
   npm install
   npm run export        # first run opens a browser to authorize your Gmail
   ```

   The auth token is cached in `token.json` (both files are gitignored).

## Auto-responder

```bash
npm run respond                        # draft replies for inquiries < 3 days old
npm run respond -- --send              # send immediately instead of drafting
npm run respond -- --max-age-days 7    # look further back
npm run respond -- --template my.txt   # custom template
```

Safety rails:

- Skips any thread you've already replied to (checks for sent messages).
- Tags processed threads with a `StreetEasy Auto-Replied` Gmail label so a
  thread is never handled twice.
- Ignores inquiries older than `--max-age-days` (default 3), so the first run
  won't message months-old leads.

Edit `template.txt` to change the reply. Available placeholders: `{{firstName}}`,
`{{name}}`, `{{address}}`, `{{listingAddress}}`, `{{price}}`, `{{message}}`.

To run it automatically, add a cron entry (e.g. every 15 minutes):

```cron
*/15 * * * * cd /path/to/tools/streeteasy-leads && node bin/respond.js --send
```

## CSV export

```bash
npm run export                         # writes leads.csv
npm run export -- --out list.csv --since 2025/01/01
```

Columns: `name, email, phone, property_address, price, bedrooms, inquiry_date,
message, listing_url`. Deduplicated by email (most recent inquiry kept).

## A note before sharing lead data with third parties

These contacts reached out to you about an apartment. Before handing the CSV to
an outside caller to pitch unrelated services (internet/Wi-Fi, etc.), be aware:

- **TCPA**: telemarketing calls/texts to cell phones generally require the
  person's prior express consent, and numbers on the Do-Not-Call registry are
  off-limits. Fines apply per call.
- StreetEasy/Zillow's terms restrict using leads for purposes unrelated to the
  inquiry.

A safer pattern is to offer the referral yourself as part of the move-in
conversation ("want help setting up internet?") and pass along only the people
who say yes.

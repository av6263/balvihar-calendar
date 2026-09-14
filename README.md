# Chinmaya Mission Boston - Newton Chapter Calendar

A small, portable calendar web app designed to replace the manual Canva editing process.

## What it does
- Generates the full school-year calendar automatically
- Highlights the normal weekly class day
- Supports special events, online classes, Andover dates, and no-class dates
- Generates Fall and Spring event lists automatically
- Includes a simple Admin view for editing
- Prints cleanly / can be saved as PDF from the browser
- Works on phones and desktops
- Supports JSON export/import for easy handoff

## Run it
This version has no build step and no application-server dependency.

### Mac - easiest option
1. Unzip the folder.
2. Double-click **Launch Calendar - Mac.command**.
3. Your browser opens automatically at `http://127.0.0.1:8765`.
4. Keep the Terminal window open while using the calendar.
5. Close the Terminal window when finished.

If macOS blocks the launcher the first time, Control-click it, choose **Open**, then **Open** again. See **START HERE - Mac.txt**.

### Manual option
If you prefer to start it yourself, open Terminal in this folder and run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765`.

Click **Admin** to make changes. Your changes are saved in that browser using localStorage.

## Handoff
Before handing the app to someone else:
1. Open **Admin > Backup / Handoff**.
2. Click **Export Calendar Data**.
3. Give the new owner this entire folder and the exported JSON file.
4. They open the app and use **Import Calendar Data**.

## Hosting
Because the app is static, it can be hosted almost anywhere, including:
- AWS S3 + CloudFront
- AWS Amplify
- Netlify
- Vercel
- GitHub Pages

## Important limitation of this first version
The data is saved in the browser only. If multiple people need to edit the same live calendar from different devices, the next step is to connect this UI to a small shared database (for example Supabase, Firebase, or AWS DynamoDB/API Gateway).

## Files
- `index.html` - page structure
- `styles.css` - appearance and print layout
- `app.js` - all calendar logic and admin features

No framework or package installation is required, which makes the app easy to transfer and maintain.

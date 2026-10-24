# Northstar personal finance

A responsive, local-first finance dashboard for tracking income, expenses, recurring bills, debts, payments and monthly spending.

## Run it

Serve this folder from a local web server, then open its address in a browser. For example, from this directory:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`. The app has no build step or package dependencies.

## Data and calculations

- Records are saved in this browser with `localStorage`; they stay on this device and browser profile.
- JSON export/import provides a portable backup. CSV export includes the financial records.
- Income and expenses can be one-time or recurring weekly, monthly or yearly entries.
- Enabled bills reserve their scheduled amount in the selected budget period. Marking a bill paid creates a linked expense and removes the matching reserve.
- Debt balances are derived from the original balance less recorded payments. A payment appears once in outflow and in transaction history.
- Unpaid minimum debt payments are reserved for the period they are due; recording a payment offsets that reserve.
- The monthly start preference supports the 1st, 15th or 25th of the month.

## Files

- `index.html` — app shell and navigation
- `styles.css` — responsive dark and light themes
- `app.js` — local data model, calculations, screens and interactions

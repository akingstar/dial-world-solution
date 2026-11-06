# Dial World Solution — Termux se live karne ka guide

## Project mein kya hai
- `index.html` — premium responsive website
- `assets/style.css` — dark premium UI
- `assets/app.js` — currency switcher, mobile menu, enquiry form
- `google-apps-script/Code.gs` — Google Sheets lead receiver

## A. Google Sheet connect karo
1. Google Sheets mein ek nayi spreadsheet banao: `Dial World Solution Leads`.
2. URL mein `/d/` aur `/edit` ke beech ka ID copy karo.
3. `google-apps-script/Code.gs` kholo; `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` ko apne Sheet ID se replace karo.
4. Sheet mein Extensions → Apps Script kholo. Code.gs ka poora code paste karke Save karo.
5. Deploy → New deployment → Select type: Web app.
6. Execute as: Me. Who has access: Anyone. Deploy karo aur Google permissions authorize karo.
7. Jo URL `https://script.google.com/macros/s/.../exec` par khatam hota hai use copy karo.
8. `assets/app.js` mein `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` ko us URL se replace karo.
9. Test ke liye website se ek enquiry submit karo. Google Sheet ke `Enquiries` tab mein row check karo.

Security note: Web App ko Anyone access dene se public form submissions accept honge. Is sheet ko public share mat karna. Spam aane par endpoint ko disable/redeploy karo; production scale par CAPTCHA/rate limiting aur stronger server-side validation add karna.

## B. Publish karne se pehle apni details lagao
`index.html` mein:
- `YOUR_EMAIL@example.com` ko business email se replace karo.
- Footer mein legal/business details add kar sakte ho.
- WhatsApp number abhi add nahi kiya gaya; apna business number confirm hone ke baad hi add karo.
- Pricing, deliverables, support hours aur refund terms ko apni real capacity ke hisaab se confirm karo.

## C. GitHub repo Termux se banao
GitHub account par ek NEW public repository banao, naam: `dial-world-solution`.
Repository ko empty rakho (README/license/gitignore add mat karo).

Termux mein ZIP extract karne ke baad project folder mein:
```bash
pkg update -y
pkg install git unzip -y
cd ~/storage/downloads
unzip dial-world-solution.zip
cd dial-world-solution
git init
git add .
git commit -m "Launch Dial World Solution website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dial-world-solution.git
git push -u origin main
```
`YOUR_GITHUB_USERNAME` ko apne GitHub username se badlo. GitHub authentication prompt aaye to GitHub password use mat karo; Personal Access Token ya GitHub-supported browser sign-in use karo. Token kisi ke saath share mat karo.

## D. Free hosting: Cloudflare Pages + GitHub
1. Cloudflare account banao/login karo.
2. Workers & Pages → Create → Pages → Connect to Git.
3. GitHub connect karke `dial-world-solution` repo select karo.
4. Framework preset: None. Build command: blank. Build output directory: `/` (or root directory, depending on dashboard field).
5. Deploy. Cloudflare tumhe `*.pages.dev` URL dega.
6. Har `git push` ke baad Cloudflare Pages automatically redeploy karega.

GitHub repository source-code store karegi; Cloudflare Pages site serve karega. GitHub Pages ko commercial SaaS/business storefront hosting ke roop mein use karne ke bajay ye setup use karo.

## E. Important launch checks
- Mobile par form, menu aur pricing switch test karo.
- Google Sheet mein test lead aayi ya nahi verify karo.
- Contact email placeholder replace karo.
- Prices ko final quote samajhkar guarantee mat karo; server, carrier, minutes, phone numbers, taxes aur third-party costs separate rakho.
- Customer se passwords, OTPs ya card details form par kabhi mat maango.
- VICIdial name/logo use karte waqt independent-provider disclaimer rehne do. Apne aap ko official VICIdial partner tabhi likho jab written authorization ho.

## Troubleshooting
- Form sheet mein nahi aa raha: Apps Script deployment ko new version ke saath redeploy karo; URL `/exec` hona chahiye; Sheet ID check karo.
- `git push` reject: repo empty hona chahiye, remote URL sahi check karo.
- Cloudflare build fail: framework preset None, build command blank, output root `/`.

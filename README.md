KOLATHUR THANGA MALIGAI (KTM) — Static website

Setup
1. Open the `ktm-web` folder and open `index.html` in a browser (or serve with a static server).

Google Sheets contact integration
1. Create a Google Sheet and go to Extensions → Apps Script.
2. Replace the script with the code below, save and Deploy → New deployment → select "Web app" and "Anyone".
3. Copy the web app URL and paste it into `js/main.js` replacing `REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL`.

Apps Script snippet (paste into new project):

function doPost(e){
  try{
    const ss = SpreadsheetApp.openById('YOUR_SHEET_ID'); // or use openByUrl
    const sheet = ss.getSheetByName('Sheet1');
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([new Date(), data.name||'', data.phone||'', data.email||'', data.article||'']);
    // Optionally send reply email
    return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({status:'error',message:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

Notes
- Replace placeholder images in `js/data.js` with real product photos.
- Article pages are `article.html?id=G001` etc.
- I can wire the Apps Script for you if you grant the script details; otherwise follow steps above.

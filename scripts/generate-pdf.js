const puppeteer = require('puppeteer-core');
const path = require('path');

const RESUME_HTML = path.resolve(__dirname, '..', 'public', 'resume.html');
const OUTPUT_PDF = path.resolve(__dirname, '..', 'public', 'Abdullah Al Mamun Resume.pdf');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file://' + RESUME_HTML, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    margin: { top: '5mm', right: '8mm', bottom: '5mm', left: '8mm' },
    displayHeaderFooter: false,
    printBackground: true
  });

  await browser.close();
  console.log('PDF generated: ' + OUTPUT_PDF);
})();

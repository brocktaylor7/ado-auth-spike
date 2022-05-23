import puppeteer from 'puppeteer';
import 'dotenv/config';

export async function run() {
    await puppeteer.launch({ headless: true, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();

        await authenticate(page);

        console.log('Navigating to office.com to demo Single Sign-on...');
        await page.goto('https://office.com', { waitUntil: 'networkidle0' });
        console.log('success!');
    });
}

async function authenticate(page: puppeteer.Page, attemptNumber: number = 1): Promise<void> {
    await page.goto('https://portal.azure.com');
    await page.waitForSelector('input[name="loginfmt"]');
    await page.type('input[name="loginfmt"]', process.env.SERVICE_ACCT_USER!);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#FormsAuthentication');
    await page.click('#FormsAuthentication');
    await page.type('input[type="password"]', process.env.SERVICE_ACCT_PASS!);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    if (!page.url().match('^https://ms.portal.azure.com')) {
        if (attemptNumber > 4) {
            console.error(`Attempted authentication ${attemptNumber} times and ultimately failed.`);

            return;
        }
        const errorText: string | null = await page.$eval('#errorText', (el) => el.textContent);
        if (errorText !== undefined) {
            console.warn(`Authentication failed with error: ${errorText}`);
        }
        await authenticate(page, attemptNumber + 1);

        return;
    }
    console.info('Authentication succeeded');
}

run();

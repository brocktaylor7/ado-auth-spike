import puppeteer from 'puppeteer';
import 'dotenv/config';

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const authPage = await browser.newPage();
        await authenticate(authPage);
        authPage.close();

        const authenticatedPage = await browser.newPage();
        console.log('Navigating to office.com to demo Single Sign-on...');
        await authenticatedPage.goto('https://office.com', { waitUntil: 'networkidle0' });
        console.log('success!');
        browser.close();
    });
}

async function authenticate(page: puppeteer.Page, attemptNumber: number = 1): Promise<void> {
    await page.goto('https://portal.azure.com');

    if (authenticationSucceeded(page)) {
        return;
    }
    await page.waitForSelector('input[name="loginfmt"]');
    await page.type('input[name="loginfmt"]', process.env.SERVICE_ACCT_USER!);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.keyboard.press('Enter')]);

    await page.waitForSelector('#FormsAuthentication');
    await page.click('#FormsAuthentication');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', process.env.SERVICE_ACCT_PASS!);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.keyboard.press('Enter')]);
    const errorTextExists = await page.$eval('#errorText', () => true).catch(() => false);
    if (errorTextExists) {
        const errorText: string | null = await page.$eval('#errorText', (el) => el.textContent);
        if (errorText !== undefined) {
            throw new Error(`Authentication failed with error: ${errorText}`);
        }
    }

    try {
        await page.waitForSelector('#web-container', { timeout: 10000 });
    } catch {
        console.log('death');
    }

    if (!authenticationSucceeded(page)) {
        if (attemptNumber > 4) {
            console.error(`Attempted authentication ${attemptNumber} times and ultimately failed.`);

            return;
        }

        console.info('Retrying Authentication...');
        await authenticate(page, attemptNumber + 1);

        return;
    }
}

function authenticationSucceeded(page: puppeteer.Page) {
    const currentUrl = page.url();
    if (!currentUrl.match('^https://ms.portal.azure.com')) {
        return false;
    }
    console.info('Authentication succeeded.');
    return true;
}

run();

import puppeteer from 'puppeteer';
import 'dotenv/config';

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();

        // await page.goto(
        //     'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=69398c47-a1ae-4414-a19c-56e1c803e890&redirect_uri=https%3A%2F%2Faccessibilityinsights.io&scope=openid%20profile%20user.read',
        //     { waitUntil: 'networkidle0' },
        // );

        await attemptAuthentication(page);

        console.log('Navigating to Azure Portal to demo Single Sign-on...');
        await page.goto('https://portal.azure.com', { waitUntil: 'networkidle0' });
    });
}

async function attemptAuthentication(page: puppeteer.Page, attemptNumber: number = 1) {
    if (attemptNumber == 1) {
        console.log('Attempting Authentication...');
    } else {
        console.log(`Authentication Attempt #${attemptNumber}...`);
    }

    await page.goto('https://login.microsoftonline.com', { waitUntil: 'networkidle0' });

    await page.type('input[name="loginfmt"]', process.env.SERVICE_ACCT_USER!);
    await page.click('input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#FormsAuthentication');
    await page.click('#FormsAuthentication');
    await page.type('#passwordInput', process.env.SERVICE_ACCT_PASS!);
    await page.click('#submitButton');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    if (page.url().match('^https://(msft.sts.microsoft.com|login.microsoftonline.com)')) {
        if (attemptNumber > 4) {
            console.log('Authentication Failed!');
            return;
        }
        await attemptAuthentication(page, ++attemptNumber);
        return;
    }
    console.log('Authentication Successful');
}

run();

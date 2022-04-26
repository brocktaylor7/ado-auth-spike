import puppeteer from 'puppeteer';
import 'dotenv/config';

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();

        page.on('console', (message) => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`));

        await page.goto(
            'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=69398c47-a1ae-4414-a19c-56e1c803e890&redirect_uri=https%3A%2F%2Faccessibilityinsights.io&scope=openid%20profile%20user.read&response_mode=form_post',
        );
        await page.waitForTimeout(1000);
        await page.type('input[name="loginfmt"]', process.env.SERVICE_ACCT_USER!);
        await page.click('input[type="submit"]');
        await page.waitForNavigation();
        await page.waitForSelector('#FormsAuthentication');
        await page.click('#FormsAuthentication');
        await page.type('#passwordInput', process.env.SERVICE_ACCT_PASS!);
        await page.click('#submitButton');

        await page.waitForNavigation();
        await page.waitForTimeout(1000);

        await page.goto('https://manage.privacy.microsoft.com');
        await page.waitForNavigation();
    });
}

run();

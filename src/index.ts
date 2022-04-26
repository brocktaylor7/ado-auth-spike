import puppeteer from 'puppeteer';
import 'dotenv/config';
import * as msal from '@azure/msal-node';

// async function importLibsToPage(page: Page): Promise<void> {
//     await page.addScriptTag({
//         path: path.resolve('dist/browser-imports.js'),
//     });
// }

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();

        page.on('console', (message) => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`));

        const config: msal.Configuration = {
            auth: {
                clientId: process.env.AZURE_APPLICATION_ID!,
                clientSecret: process.env.AZURE_APPLICATION_CLIENT_SECRET!,
                authority: 'https://login.microsoftonline.com/organizations/',
            },
        };

        const cca = new msal.PublicClientApplication(config);

        const loginRequest: msal.UsernamePasswordRequest = {
            scopes: ['user.read'],
            username: process.env.SERVICE_ACCT_USER!,
            password: process.env.SERVICE_ACCT_PASS!,
        };

        cca.acquireTokenByUsernamePassword(loginRequest).then((tokenResponse) => {
            console.log(tokenResponse);
        });

        //https://login.microsoftonline.com/microsoft.com/oauth2/authorize?client_id=69398c47-a1ae-4414-a19c-56e1c803e890&response_type=code&prompt=consent

        // await page.goto('https://microsoft.sharepoint.com/sites/infopedia');
        // await page.goto(
        //     'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4765445b-32c6-49b0-83e6-1d93765276ca&redirect_uri=https%3A%2F%2Fwww.office.com%2Flandingv2&response_type=code%20id_token&scope=openid%20profile%20https%3A%2F%2Fwww.office.com%2Fv2%2FOfficeHome.All&response_mode=form_post&nonce=637860867886150092.MjJjM2Y0M2EtMjNlYi00Mzc3LTk0OTktNWU4NmIyZTYxNzdjY2JmOGVjZjEtNzY3Ni00ZTE5LWExNzItNzc2YWFiNjNiOGIx&ui_locales=en-US&mkt=en-US&state=_iwPGhFAPfEehh6cxpNYSZ6WSWMlXaFA_UaDE_tijjeaUzBp2VDJVpAucLTKsUZKN0ZFeWpaRkdldxxXOX2Gxb24DbUShJAzyImRg0MS5vZAJnen-cB486OTZhRdE4lo90saCcUv1gcXRZXBcA59tEqWizmfQ4pKX63D6P4kGA-Xz5t5nGlrG21XsGytSJ4gtZm-mFylzYaT9QOCl0ny0cNWLBq80S4HA6yMB8w6OCsxedcrUhgci8TZhl64QS1zOzg4XR3e9TZnbWOusB68Eg&x-client-SKU=ID_NETSTANDARD2_0&x-client-ver=6.12.1.0&sso_reload=true',
        // );

        // await page.waitForTimeout(1000);

        // await page.type('input[name="loginfmt"]', process.env.SERVICE_ACCT_USER!);
        // await page.click('input[type="submit"]');
        // await page.waitForNavigation();
        // await page.waitForSelector('#FormsAuthentication');
        // await page.click('#FormsAuthentication');
        // await page.type('#passwordInput', process.env.SERVICE_ACCT_PASS!);
        // await page.click('#submitButton');
        // await importLibsToPage(page);

        let data = {
            testData: 'test',
        };
        console.log(data);
    });
}

run();

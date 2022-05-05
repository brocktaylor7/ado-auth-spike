import puppeteer from 'puppeteer';
import 'dotenv/config';
import * as msal from '@azure/msal-node';

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

        const pca = new msal.PublicClientApplication(config);

        const loginRequest: msal.UsernamePasswordRequest = {
            scopes: ['user.read'],
            username: process.env.SERVICE_ACCT_USER!,
            password: process.env.SERVICE_ACCT_PASS!,
        };

        pca.acquireTokenByUsernamePassword(loginRequest).then((tokenResponse) => {
            console.log(tokenResponse);
        });
    });
}

run();

import puppeteer, { Page } from 'puppeteer';
import path from 'path';
import 'dotenv/config';
import * as msaltest from '@azure/msal-browser';

async function importLibsToPage(page: Page): Promise<void> {
    await page.addScriptTag({
        path: path.resolve('dist/browser-imports.js'),
    });
}

export async function run() {
    await puppeteer.launch({ headless: false, defaultViewport: null }).then(async (browser) => {
        const page = await browser.newPage();

        page.on('console', (message) => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`));

        await page.goto('file:///' + path.resolve('src/index.html'));

        await importLibsToPage(page);

        const puppeteerContextVars = {
            azureApplicationClientId: process.env.AZURE_APPLICATION_ID!,
            serviceAccountUsername: process.env.SERVICE_ACCT_USER!,
            serviceAccountPassword: process.env.SERVICE_ACCT_PASS!,
        };

        await page.evaluate((puppeteerContextVars) => {
            const config = {
                auth: {
                    clientId: puppeteerContextVars.azureApplicationClientId,
                    authority: 'https://login.microsoftonline.com/organizations/',
                },
            };

            // @ts-ignore
            const pca: msaltest.PublicClientApplication = new injectedLibraries.msalbrowser.PublicClientApplication(config);

            const loginRequest: msaltest.SilentRequest = {
                scopes: ['user.read'],
            };

            pca.getAccountByUsername;

            // @ts-ignore
            pca.acquireTokenSilent(loginRequest).then((tokenResponse) => {
                console.log(tokenResponse);
            });
        }, puppeteerContextVars);
    });
}

run();

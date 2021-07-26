import { IServerStatus } from '@providers/IServerStatus'
import puppeteer from 'puppeteer'

const ServersList: any = {
    0: 'US_EAST',
    1: 'EU_CENTRAL',
    2: 'SA_EAST',
    3: 'AP_SOUTHEAST',
    4: 'US_WEST'
}

export class ServerStatus implements IServerStatus {
    private browser: puppeteer.Browser;

    async startBrowser(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        })
    }

    async getServerStatus(): Promise<any> {
        const payload: any = {}
        const page = await this.browser.newPage()
        await page.goto('https://www.newworld.com/en-us/support/server-status')
        const locationList = await page.$('.ags-ServerStatus-content-responses')
        if (!locationList) return
        const locations = await locationList.$$('.ags-ServerStatus-content-responses-response')
        const locationsMap = locations.map(async (location) => {
            const locationId = await page.evaluate(el => el.getAttribute('data-index'), location)
            const locationName: any = ServersList[locationId]
            const serverList = await location.$$('.ags-ServerStatus-content-responses-response-server')

            const serverListMap = serverList.map(async (server) => {
                const serverName = await server.$eval('.ags-ServerStatus-content-responses-response-server-name', el => el.textContent?.trim())
                const serverStatus = await server.$eval('.ags-ServerStatus-content-responses-response-server-status', el => el.className.includes('ags-ServerStatus-content-responses-response-server-status--up'))

                if (!serverName) return

                if (payload[locationName]) {
                    payload[locationName].push({ serverName, serverStatus })
                } else {
                    payload[locationName] = []
                    payload[locationName].push({ serverName, serverStatus })
                }
            })

            await Promise.all(serverListMap)
        })

        await Promise.all(locationsMap)

        page.close()

        return payload
    }
}

import { ServerStatus } from '@providers/implements/ServerStatus'
import express, { Express, Router } from 'express'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { Logger } from 'tslog'

export class Services {
    private servers: any = {}
    private serverStatus: ServerStatus
    private app: Express
    private isUpdatingStatus: boolean = false
    private cronStatus: cron.ScheduledTask
    private log: Logger = new Logger()

    constructor() {
        dotenv.config()
        this.serverStatus = new ServerStatus()
        this.app = express()
        this.app.use(express.json())
        this.app.get('/', (req, res) => res.json({ status: 'running' }))
        this.app.use('/api/v1', this.routersOne())
    }

    public async start() {
        await this.serverStatus.startBrowser()
        await this.getStatuses()
        this.app.listen(process.env.PORT || 8080)

        this.cronStatus = cron.schedule('*/10 * * * * *', async () => this.getStatuses())
    }

    private async getStatuses() {
        if (this.isUpdatingStatus === false) {
            this.isUpdatingStatus = true
            this.servers = await this.serverStatus.getServerStatus()
            this.isUpdatingStatus = false
            this.log.info('Information collected from New World statuses')
        }
    }

    private routersOne(): Router {
        const router = Router()
        router.get('/status', (req, res) => res.status(200).json(this.servers))
        return router
    }
}

export interface IServerStatus {
    startBrowser(): Promise<void>
    getServerStatus(): Promise<any>
}

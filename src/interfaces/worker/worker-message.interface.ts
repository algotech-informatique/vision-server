export interface WorkerMessage {
    cmd: string;
    broadcast: boolean;
    data: any;
}

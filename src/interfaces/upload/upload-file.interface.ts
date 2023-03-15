export interface UploadFile {
    buffer?: Buffer;
    base64?: string;
    originalname: string;
    mimetype: string;
    size?: number;
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    public chunk(str: string, size = 255) {
        if (typeof str === 'string') {
            const length = str.length;
            const chunks = Array(Math.ceil(length / size));
            for (let i = 0, index = 0; index < length; i++) {
                chunks[i] = str.slice(index, index += size);
            }
            return chunks;
        }
    }

    public join(chunks: string[]) {
        return chunks.join('');
    }

    public toBase64(str) {
        // create a buffer
        const buff = Buffer.from(str, 'utf-8');

        // decode buffer as Base64
        return buff.toString('base64');
    }

    public toPlainText(base64) {
        const buff = Buffer.from(base64, 'base64');

        // decode buffer as UTF-8
        return buff.toString('utf-8');
    }

    getFileNameToUTF8(file) {
        return Buffer.from(file.originalname, 'latin1').toString('utf8')
    }

    public strToBool(value: any) {
        return [
            'yes',
            'true',
            true,
            'y',
            1,
            '1'
        ].includes(value);
    }
}

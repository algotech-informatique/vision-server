import { Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesHead {
    constructor(
        private readonly fileService: FilesService,
    ) { }

    readFile(id: string, download: boolean, res) {
        this.fileService.readFile(id, download, res);
    }
}

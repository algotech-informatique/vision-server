import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { I18nService } from './i18n.service';

@Injectable()
export class I18nHead {
    constructor(
        private readonly i18nService: I18nService,
    ) { }

    import(customerKey: string, file: Buffer): Observable<boolean> {
        return this.i18nService.import(customerKey, file);
    }

    export(customerKey: string): Observable<Buffer> {
        return this.i18nService.export(customerKey);
    }
}

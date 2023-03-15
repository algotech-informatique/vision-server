import { Injectable } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import { Observable } from 'rxjs';
import { PlayerManifest } from 'interfaces';

@Injectable()
export class ManifestHead {
    constructor(private readonly manifestService: ManifestService) { }

    get(customerKey: string): Observable<PlayerManifest> {
        return this.manifestService.get(customerKey);
    }
}

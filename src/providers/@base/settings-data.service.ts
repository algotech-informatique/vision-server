import { Injectable } from '@nestjs/common';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentityRequest, SettingsData, WorkerMessage } from '../../interfaces';
import { ApplicationModelsHead } from '../application-models/application-models.head';
import { EnvironmentHead } from '../environment/environment.head';
import { GenericListsHead } from '../glists/glists.head';
import { GroupHead } from '../groups/groups.head';
import { SettingsHead } from '../settings/settings.head';
import { SmartModelsHead } from '../smart-models/smart-models.head';

@Injectable()
export class SettingsDataService {

    private data: SettingsData;

    constructor(
        private settingsHead: SettingsHead,
        private appsHead: ApplicationModelsHead,
        private smartModels: SmartModelsHead,
        private groupsHead: GroupHead,
        private gLists: GenericListsHead,
        private environmentHead: EnvironmentHead) {

        // Receive messages from the master process.
        process.on('message', (msg: WorkerMessage) => {
            if (msg.cmd === 'clear-data-cache') {
                this.clear();
            }
        });
    }

    getContext(): Observable<SettingsData> {
        const identity: IdentityRequest = {
            customerKey: process.env.CUSTOMER_KEY,
            groups: ['sadmin'],
            login: 'sadmin'
        }
        if (this.data) {
            return of(this.data);
        }
        return zip(
            this.appsHead.find({ identity }),
            this.smartModels.find({ identity }),
            this.gLists.getAll({ identity }),
            this.groupsHead.findAll({ identity }),
            this.settingsHead.findOne({ identity }),
            this.environmentHead.findOne({ identity })
        ).pipe(
            map((values: any[]) => {
                this.data = {
                    apps: values[0],
                    smartmodels: values[1],
                    glists: values[2],
                    groups: values[3],
                    settings: values[4],
                    environment: values[5],
                }

                return this.data;
            })
        )
    }

    clear() {
        this.data = null;
    }
}

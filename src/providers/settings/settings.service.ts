import { Model } from 'mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { DefaultSettings } from './default-settings';
import { BaseService } from '../@base/base.service';
import { CustomerInit, CustomerInitResult, Settings } from '../../interfaces';

@Injectable()
export class SettingsService extends BaseService<Settings> {

    constructor(
        @InjectModel('Setting') private readonly settingsModel: Model<Settings>,
    ) {
        super(settingsModel);
    }

    init(customer: CustomerInit): Observable<CustomerInitResult> {
        const result: CustomerInitResult = {
            key: 'settings',
            value: 'ko',
        };
        return this.create(customer.customerKey, DefaultSettings.defaultSettings).pipe(
            map((setting) => {
                Logger.log('settings/init');
                if (setting) {
                    result.value = 'ok';
                } else {
                    result.value = 'ko';
                }
                return result;
            }),
            catchError(() => {
                result.value = 'ko';
                throw new InternalServerErrorException(result);
            }));
    }

    create(customerKey: string, setting: Settings): Observable<Settings> {
        // Si le name existe
        const find$: Observable<Settings> = from(
            this.settingsModel.findOne({ customerKey, deleted: false }));

        return find$.pipe(mergeMap((findSetting: Settings) => {
            if (findSetting !== null) {
                throw new BadRequestException('Setting already exist');
            } else {
                // Créer et enregistre le nouveau group
                return super.create(customerKey, setting);
            }
        }));
    }
    findOneByCustomerKey(customerKey: string): Observable<Settings> {
        return from(
            this.settingsModel.findOne({ customerKey, deleted: false }).lean(),
        ).pipe(
            mergeMap((setting: Settings) => {
                if (setting) {
                    return of(setting);
                } else {
                    throw new BadRequestException(`Setting name unknown ${customerKey}`);
                }
            }),
        );
    }

    findAllCustomers(): Observable<Settings[]> {
        return from(
            this.settingsModel.find<Settings[]>(),
        ).pipe(
            mergeMap((settings: Settings[]) => {
                if (settings) {
                    return of(settings);
                } else {
                    throw new BadRequestException(`No settings found`);
                }
            }),
        );
    }
}

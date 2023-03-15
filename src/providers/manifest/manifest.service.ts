import { mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { SettingsService } from './../settings/settings.service';
import { PlayerManifestIcon, PlayerManifest, Settings } from '../../interfaces';
import { FilesService } from './../files/files.service';
import { IconsPlayer } from './default-icons';
import * as _ from 'lodash';

@Injectable()
export class ManifestService {

    constructor(private settingsService: SettingsService, private fileService: FilesService) { }

    get(customerKey: string): Observable<PlayerManifest> {

        return this.settingsService.findOneByCustomerKey(customerKey).pipe(
            mergeMap((settings: Settings) => {
                if (!settings) {
                    throw new BadRequestException('settings unknown');
                } else {
                    // default player
                    const player: PlayerManifest = {
                        name: settings?.player?.name ? settings?.player?.name : 'Vision player',
                        short_name: settings?.player?.short_name ? settings?.player?.short_name : "Vision",
                        gcm_sender_id: settings?.player?.gcm_sender_id ? settings?.player?.gcm_sender_id : '103953800507',
                        theme_color: settings?.player?.theme_color ? settings?.player?.theme_color : '#e17a40',
                        background_color: settings?.player?.background_color ? settings?.player?.background_color : '#222428',
                        display: settings?.player?.display ? settings?.player?.display : 'standalone',
                        orientation: settings?.player?.orientation ? settings?.player?.orientation : 'portrait-primary',
                        id: `${process.env.DOMAIN_NAME}/player/`,
                        start_url: `${process.env.DOMAIN_NAME}/player/`,
                        scope: `${process.env.DOMAIN_NAME}/player/`,
                        icons: [],
                        related_applications: [
                            {
                                platform: "webapp",
                                url: `${process.env.DOMAIN_NAME}/api/manifest`
                            }
                        ]
                    };
                    Object.assign(settings, { player });

                    return this.fileService.getFilesByUuid(/^player/).pipe(
                        mergeMap((files: any[]) => {

                            // get icons list from databases
                            let icons: PlayerManifestIcon[] = _.reduce(files, (results, f) => {
                                if (_.startsWith(f.metadata.uuid, 'player_icon-')) {
                                    const sizes = f.metadata.uuid.replace('player_icon-', '');
                                    const icon: PlayerManifestIcon = {
                                        src: `files/player/${f.metadata.uuid}`,
                                        sizes,
                                        type: f.contentType,
                                        purpose: 'any'
                                    };
                                    results.push(icon);
                                }
                                return results;
                            }, []);

                            // get icons list from assets/players/icons
                            if (icons && icons.length === 0) {
                                icons = IconsPlayer;
                            }
                            Object.assign(settings.player, { icons });
                            return of(settings.player);
                        })
                    );
                }
            })
        )
    }
}

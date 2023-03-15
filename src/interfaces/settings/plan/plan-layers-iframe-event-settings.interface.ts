import { Lang } from '../../lang/lang.interface';

export interface PlanLayersIframeEventSettings {
    readonly displayName: Lang[];
    readonly triggers: Array<{
        path: string;
        value: string
    }>;
    readonly behaviors: {
        details: {
            from: 'smartobject' | 'smartflow';
            smartobject?: {
                valueFromPath: string;
                smartPropertyKey: string;
            }
            smartflow?: {
                uuid: string;
                key: string;
                variables: Array<{
                    key: string;
                    valueFromPath: string;
                }>;
            };
        };
    };
}

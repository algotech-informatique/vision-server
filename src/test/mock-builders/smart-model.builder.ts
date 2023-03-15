import { ATSkillsActive, Lang, SmartModel, SmartPermissions, SmartPropertyModel } from '../../interfaces';
import { MockBuilder } from './mock-builder';

export class SmartModelBuilder extends MockBuilder<SmartModel> {
    constructor(
        private key: string = 'smart-model',
        private system: boolean = false,
        private displayName: Lang[] = [{ lang: 'fr-FR', value: 'Smart Model'}],
        private uniqueKeys: string[] = [],
        private domainKey: string = 'domain-key',
        private properties: SmartPropertyModel[] = [],
        private skills: ATSkillsActive = {
            atGeolocation: false,
            atDocument: false,
            atSignature: false,
            atTag: false,
            atMagnet: false
        },
        private permissions: SmartPermissions = null
    ) { super(); }

    withKey(key: string): SmartModelBuilder {
        this.key = key;
        return this;
    }

    withProperties(properties: SmartPropertyModel[]): SmartModelBuilder {
        this.properties = properties;
        return this;
    }

    withSkills(skills: ATSkillsActive): SmartModelBuilder {
        this.skills = skills;
        return this;
    }
}
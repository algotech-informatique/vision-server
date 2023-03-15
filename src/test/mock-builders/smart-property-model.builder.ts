import { Lang, SmartPermissions, SmartPropertyModel } from '../../interfaces';
import { MockBuilder } from './mock-builder';

export class SmartPropertyModelBuilder extends MockBuilder<SmartPropertyModel> {
    constructor(
        private uuid: string = '123456',
        private key: string = 'smart-property',
        private displayName: Lang[] = [{ lang: 'fr-FR', value: 'Propriété'}],
        private keyType: string = 'property-type',
        private multiple: boolean = false,
        private items: string|string[] = [],
        private composition: boolean = false,
        private defaultValue: any = {},
        private required: boolean = false,
        private system: boolean = false,
        private hidden: boolean = false,
        private validations: string[] = [],
        private permissions: SmartPermissions = null
    ) { super(); }

    withKeyAndType(key: string, keyType: string): SmartPropertyModelBuilder {
        this.key = key;
        this.keyType = keyType;
        return this;
    }

    withMultiple(multiple: boolean): SmartPropertyModelBuilder {
        this.multiple = multiple;
        return this;
    }
}
export class OpenAPIUtils {
    private constructor() { } // static class

    public static orderObjectKeys(object: any, keepFirst?: string[]) {
        return Object.entries(object)
            .sort(([k1, v1], [k2, v2]) => {
                if (keepFirst && keepFirst.includes(k1)) {
                    return 1;
                } else {
                    return k1.localeCompare(k2);
                }
            }).reduce((obj, [k, v]) => ({
                ...obj,
                [k]: v
            }), {});
    }

    public static isAnySO(modelKey: string): boolean {
        return modelKey === 'so:*';
    }

    public static isSO(modelKey: string): boolean {
        return modelKey.startsWith('so:');
    }

    public static isSK(modelKey: string): boolean {
        return modelKey.startsWith('sk:');
    }

    public static isSmartType(modelKey: string): boolean {
        return this.isSO(modelKey) || this.isSK(modelKey);
    }

    public static toArray<T>(input: T | T[]): T[] {
        if (!Array.isArray(input)) {
            input = [input];
        }
        return input;
    }

    public static toObject<T>(input: T | T[]): T {
        if (Array.isArray(input)) {
            input = input[0];
        }
        return input;
    }
}
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ATSkills } from '../../../interfaces';
export class OpenapiSkillSchemas {
    public static readonly SKILLS: ATSkills = { // expected to fail at compilation if ATSkills has been modified but not this class
        atGeolocation: {
            geo: [{
                uuid: 'uuid',
                layerKey: 'string',
                geometries: [{
                    type: 'string',
                    coordinates: ['object']
                }],
            }],
        },
        atDocument: {
            documents: ['string']
        },
        atSignature: {
            signatureID: 'uuid',
            date: 'string',
            userID: 'uuid'
        },
        atTag: {
            tags: ['string']
        },
        atMagnet: {
            zones: [{
                appKey: 'string',
                magnetsZoneKey: 'string',
                boardInstance: 'string',
                position: {
                    x: 0,
                    y: 0
                },
                order: 0,
            }]
        }
    };
    private static readonly DEPTH_LIMIT = 10; // allowed depth limit in the recursive object to schema cast

    private constructor() { } // static class

    public static addSkillsSchema(properties: any, ...skillNames: string[]) {
        if (skillNames.length > 0) {
            const supportedSkillNames = Object.keys(this.SKILLS);
            skillNames = skillNames.map(sk => sk.startsWith('sk:') ? sk.slice(3) : sk);
            const unknownSkills = skillNames.filter(sk => !supportedSkillNames.includes(sk) && sk != '*');
            if (unknownSkills.length > 0) {
                throw new Error(`Found unsupported skills to process: [${unknownSkills.join(',')}]`);
            }

            properties['skills'] = {
                type: 'object',
                properties: this.objectToSpec(this.SKILLS)
            };

            // filter out skills that have not been requested
            if (!skillNames.includes('*')) {
                supportedSkillNames.forEach((skillName) => {
                    if (!skillNames.includes(skillName)) {
                        delete properties['skills']['properties'][skillName];
                    }
                })
            }            
        }
    }

    private static objectToSpec(obj: any, arrayItem = false, depth = 0): SchemaObject {
        if (depth > this.DEPTH_LIMIT) {
            throw new Error(`Recursive depth limit [${this.DEPTH_LIMIT}] reached while trying to cast typescript object to openapi schema`);
        }

        if (typeof obj === 'string') {
            if (obj === 'string') {
                return { type: 'string' };
            } else if (obj === 'uuid') {
                return { type: 'string', format: 'uuid' };
            } else {
                return {};
            }
        } else if (typeof obj === 'number') {
            return { type: 'number' };
        } else {
            const props = {};
            Object.entries(obj).forEach((p) => {
                if (Array.isArray(p[1])) {
                    props[p[0]] = {
                        type: 'array',
                        items: this.objectToSpec(p[1][0], true, depth+1)
                    };
                } else {
                    if (typeof p[1] === 'string' || typeof p[1] === 'number') {
                        props[p[0]] = this.objectToSpec(p[1], false, depth+1);
                    } else {
                        props[p[0]] = {
                            type: 'object',
                            properties: this.objectToSpec(p[1], false, depth+1)
                        }
                    }
                }
            });
            if (arrayItem) {
                return {
                    type: 'object',
                    properties: props
                }
            } else {
                return props;
            }
        }
    }
}
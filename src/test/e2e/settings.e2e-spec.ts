import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils';
import { PatchPropertyDto } from '@algotech/core';
import { settings } from '../fixtures/settings';

declare const describe, jasmine, expect, beforeAll, afterAll, it: any;

const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]/value',
    value: 'Un équipement électrique',
};

const patchUpdateLang: PatchPropertyDto = {
    op: 'replace',
    path: '/plan/poi/[0]/displayName/[lang:es-ES]',
    value:
    {
        lang: 'es-ES',
        value: 'Equipo Electrico',
    },
};

const patchSetError: PatchPropertyDto = {
    op: 'add',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]/caption',
    value: 'Version',
};

const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/plan/poi/[0]/display/[lang:fr-FR]/test',
    value: 'Version',
};

const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/plan/poi/[0]/displayName/[lang:fr-FR]',
};

const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/plan/general',
};

const settingsPatched = {
    displayName: [
        {
            lang: 'en-US',
            value: 'Electrical equipement',
        },
        {
            lang: 'es-ES',
            value: 'Equipo Electrico',
        },
    ],
};

describe('SettingsController (e2e)', () => {
    const request = require('supertest');
    let app: INestApplication;

    const utils: TestUtils = new TestUtils();

    // Initialisation
    beforeAll(() => {
        return utils.InitializeApp().then((nestApp) => {
        app = nestApp;
        return utils.Before(app, 'settings', request);});
    });

    // Finalisation
    afterAll(() => {
        return utils.After();
    });

    // Test de la recuperation d'un settings global
    it('/settings (GET)', () => {
        return request(app.getHttpServer())
            .get('/settings')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const retourSettings: object[] = utils.clearDates(response.body);
                expect(retourSettings).toEqual(settings);
            });
    });

    // Test de l'ajout de settings avec settings déja en base
    it('/settings/ - nom existant (POST)', () => {
        return request(app.getHttpServer())
            .post('/settings/')
            .set('Authorization', utils.authorizationJWT)
            .send(settings)
            .expect(400);
    });

    // Test les patchs
    it('/settings PATCH', () => {
        return request(app.getHttpServer())
            .patch('/settings/' + settings.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSet,
                patchUpdateLang,
                patchPull,
                patchRemove])

            .expect(200)
            .then(response => {

                expect(utils.clearDates(response.body)).toEqual(
                    [
                        patchSet,
                        patchUpdateLang,
                        patchPull,
                        patchRemove]);
            });
    });

    // Test l'échec des patchs
    it('/PATCH /settings', () => {
        return request(app.getHttpServer())
            .patch('/settings/' + settings.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetError])
            .expect(400);
    });

    // Test l'échec des patchs
    it('/PATCH settings', () => {
        return request(app.getHttpServer())
            .patch('/settings/' + settings.uuid)
            .set('Authorization', utils.authorizationJWT)
            .send([
                patchSetNoRespectModel])
            .expect(400);
    });

    // Vérifie que l'objet a bien été modifié
    it('/GET settings/name (modified)', () => {
        return request(app.getHttpServer())
            .get('/settings/')
            .set('Authorization', utils.authorizationJWT)
            .expect(200)
            .then((response) => {
                const plans = utils.clearDates(response.body).plan;
                expect(plans.poi[0]).toEqual(jasmine.objectContaining(settingsPatched));
            });
    });

});

import { CustomerInit } from '../../interfaces';

const protocolMappers = [
    {
        name: 'groups',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-group-membership-mapper',
        consentRequired: false,
        config: {
            'full.path': 'false',
            'id.token.claim': 'true',
            'access.token.claim': 'true',
            'claim.name': 'groups',
            'userinfo.token.claim': 'true',
        },
    },
    {
        name: 'mobileToken',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-usermodel-attribute-mapper',
        consentRequired: false,
        config: {
            'user.attribute': 'mobileToken',
            'id.token.claim': 'true',
            'access.token.claim': 'true',
            'claim.name': 'mobileToken',
            'jsonType.label': 'String',
            'userinfo.token.claim': 'true',
        },
    },
];

const domain_name = process.env.DOMAIN_NAME ? process.env.DOMAIN_NAME : '';

export const clients = [
    { baseUrl: '/studio', id: 'pwa-studio', bearerOnly: false, publicClient: true, protocolMappers, serviceAccountsEnabled: false, redirectUris: ["/studio/*"], rootUrl: domain_name, directAccessGrantsEnabled: true },
    { baseUrl: '/', id: 'pwa-player', bearerOnly: false, publicClient: true, protocolMappers, serviceAccountsEnabled: false, redirectUris: ["/*"], rootUrl: domain_name, directAccessGrantsEnabled: true },
    { baseUrl: '/', id: 'vision-mobile-app', bearerOnly: false, publicClient: true, protocolMappers, serviceAccountsEnabled: false, redirectUris: ["http://localhost"], rootUrl: 'http://localhost', webOrigins: ["http://localhost"], directAccessGrantsEnabled: true },
    { baseUrl: '/', id: 'vision-server', bearerOnly: true, publicClient: false, protocolMappers, serviceAccountsEnabled: true },
];

export const addRealm = (customer: CustomerInit) => {
    const languages = customer.languages.map((l) => l.lang.split('-')[0]);
    return {
        url: '/admin/realms',
        method: 'POST',
        data: {
            id: 'vision',
            enabled: true,
            realm: 'vision',
            revokeRefreshToken: false,
            displayName: 'Vision',
            internationalizationEnabled: true,
            resetPasswordAllowed: true,
            loginTheme: 'algotech',
            emailTheme: 'algotech',
            supportedLocales: languages,
            defaultLocale: languages.length > 0 ? languages[0] : '',
            displayNameHtml: `<div class=\"kc-logo-text\"><span>Vision</span></div>`,
            actionTokenGeneratedByUserLifespan: 172800,
            actionTokenGeneratedByAdminLifespan: 259200,
            clients,
            smtpServer: {
                password: process.env.SMTP_PASS,
                auth: true,
                ssl: process.env.SMTP_SECURE === 'true',
                port: process.env.SMTP_PORT,
                host: process.env.SMTP_HOST,
                from: process.env.SMTP_FROM,
                user: process.env.SMTP_USER,
                fromDisplayName: 'Vision',
            },
        },
    };
};

export const revokeOfflineToken = (realm: string, userId: string, clientId: string) => ({
    url: `/admin/realms/${realm}/users/${userId}/consents/${clientId}`,
    method: 'DELETE',
    data: {},
});

export const generateSecret = (customer, realm, clientId) => ({
    url: `/admin/realms/${realm}/clients/${clientId}/client-secret`,
    method: 'POST',
    data: {},
});

export const sendEmailAfterRegister = (customer, realm, userId: string, lifespan = 259200) => ({
    url: `/admin/realms/${realm}/users/${userId}/execute-actions-email?lifespan=${lifespan}&client_id=pwa-player&redirect_uri=${encodeURI(
        process.env.DOMAIN_NAME,
    )}`,
    method: 'PUT',
    data: ['UPDATE_PASSWORD'],
});

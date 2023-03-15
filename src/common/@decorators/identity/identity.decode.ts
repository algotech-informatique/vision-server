import * as jwt from 'jsonwebtoken';
import { IdentityRequest } from '../../../interfaces';

export function identityDecode(req): IdentityRequest {

    try {
        const ir: IdentityRequest =
        {
            login: req.user && req.user.preferred_username ? req.user.preferred_username : '',
            customerKey: process.env.CUSTOMER_KEY ? process.env.CUSTOMER_KEY : 'vision',
            groups: req.user.groups,
            sessionId: req.user.nonce,
            azp: req.user.azp,
        };
        return ir;
    } catch (err) {
        return null;
    }
}
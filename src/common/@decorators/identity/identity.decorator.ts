import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { identityDecode } from './identity.decode';

export const Identity = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return identityDecode(req);
});
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdentityJwt = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.headers.authorization.replace('Bearer ', '');
});
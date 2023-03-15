import { SetMetadata } from '@nestjs/common';

export const ActionCode = (actionCode: string) => SetMetadata('actionCode', actionCode);
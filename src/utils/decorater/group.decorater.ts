import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GroupId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return parseInt(request.params.groupId, 10);
  },
);

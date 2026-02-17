import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PUBLIC_KEY = 'public';
export const Public = SetMetadata(PUBLIC_KEY, true);

export const isPublic = (context: ExecutionContext, reflector: Reflector) => {
  const _isPublic = reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
    context.getClass(),
    context.getHandler(),
  ]);
  return _isPublic;
};

import { Request, Response } from 'express';

export const cookieLib = (req: Request, res: Response) => {
  const get = (name: string) => {
    return req.cookies[name];
  };
  const set = (name: string, value: string, cookieOptions: any) => {
    res.cookie(name, value, cookieOptions);
  };
  const remove = (name: string) => {
    res.clearCookie(name);
  };

  return {
    get,
    set,
    remove,
  };
};

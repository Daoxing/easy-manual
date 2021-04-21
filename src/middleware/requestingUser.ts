import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';

export const requestingUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtToken = req.headers.authorization.substr(7); // Remove 'Bearer '

  if (!jwtToken.length) {
    return next(new Error('Token Required!'));
  }
  const parsedResult = jwt.verify(jwtToken, 'serectkey');
  _.set(req, 'user', parsedResult);
  return next();
};

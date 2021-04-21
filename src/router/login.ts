import { message } from '../constants';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { ISchemaResult } from '../types';
import { Request, Response } from 'express';
const defaultLoginResult: ISchemaResult = {
  success: false,
  result: '',
  message: message.INTERNAL_ERROR,
};

export default async function loginController(
  req: Request,
  res: Response,
  next: any,
) {
  try {
    const { account = '' } = req.body;
    const result = await UserService.login(account);
    defaultLoginResult.success = true;
    defaultLoginResult.result = `${jwt.sign(
      JSON.stringify(result),
      'serectkey',
    )}`;
    defaultLoginResult.message = message.LOGIN_SUCCESS;
  } catch (error) {
    console.error(error);
    defaultLoginResult.success = false;
    defaultLoginResult.message = error.message
      ? error.message
      : message.INTERNAL_ERROR;
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(defaultLoginResult));
}

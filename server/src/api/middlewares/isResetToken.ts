import DIContainer from '@/container';
import { IPasswordResetToken } from '@/interfaces/IPasswordResetToken';
import { PasswordResetTokenRepository } from '@/repositories/passwordResetTokenRepository';
import { NextFunction, Request, Response } from 'express';

const verifyToken = async (token: string) => {
  const passwordResetRepository = DIContainer.resolve(PasswordResetTokenRepository);
  const reset_token_record = await passwordResetRepository.getResetPasswordToken(token);
  if (!reset_token_record) throw 'Invalid reset link';
  if (reset_token_record.used) throw 'Invalid reset link';
  const now = new Date();

  if (reset_token_record.token_expiry < now) throw 'Invalid reset link';
  return reset_token_record;
};

const isResetToken = async (req: Request & { token: IPasswordResetToken }, res: Response, next: NextFunction) => {
  try {
    const token = await verifyToken(req.body.token);
    req.token = token;
    next();
  } catch (e) {
    return next(e);
  }
};

export default isResetToken;

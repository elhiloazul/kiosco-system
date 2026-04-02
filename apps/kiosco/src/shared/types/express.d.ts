import { JwtPayload } from '../../security/guards/current-admin.decorator';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

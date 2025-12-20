import { SessionPayload } from '../auth/infrastructure/services/session.service';

declare global {
  namespace Express {
    interface Request {
      user: SessionPayload | null;
    }
  }
}

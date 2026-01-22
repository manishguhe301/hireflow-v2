import { Role } from '@prisma/client';

export type AppSession = {
  user: {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
  };
};

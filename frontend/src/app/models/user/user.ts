export class User {
  uuid: number;
  name: string;
  email: string;
  tfaEnabled: boolean;
  tfaSecret?: string;
  tfaUrl?: string;
  tfaToken?: string;
  pwd?: string;
}

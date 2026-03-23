export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  provider: 'google' | 'github' | 'guest';
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

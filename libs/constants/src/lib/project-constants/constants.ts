export enum Role {
  CLIENT = 'client',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

export enum ServicesClient {
  AUTH = 'AUTH-CLIENT',
  USER = 'USER-CLIENT',
  IO = 'IO-CLIENT',
  PRODUCT = 'PRODUCT-CLIENT',
  ORDER = 'ORDER-CLIENT',
  UPLOAD = 'UPLOAD-CLIENT',
  STRIPE = 'STRIPE-CLIENT',
}

export enum TaskQueues {
  UPLOAD = 'UPLOAD',
  EMAIL = 'EMAIL',
  USER = 'USER',
}

export const AuthConstants = {
  jwtSecret: 'jwtSecret',
  jwtExpireAt: 3600000,
  otpSecret: 'otpSecret',
  otpExpireAt: 36000,
  refreshSecret: 'refreshSecret',
  refreshExpireAt: 360000000,
  resetSecret: 'resetSecret',
  resetExpireAt: 3600,
};

export type InvalidError = {
  error: { message: any; error: string };
  'error-code': string;
  message: string;
  statusCode: number;
  status: string;
};

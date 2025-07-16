export interface TSuccessResponse<T> {
  success: true;
  data: T;
}

export interface TErrorResponse {
  success: false;
  error: {
    status: number;
    message: string;
  };
}

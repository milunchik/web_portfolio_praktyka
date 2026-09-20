export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface RequestOptions extends RequestInit {
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined>;
}

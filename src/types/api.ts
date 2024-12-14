export type Pagination = {
  page: number;
  countPerPage: number;
  totalCount: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
};

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: 'name' | 'age' | 'location';
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    last_page?: number; // Optional field for last page number
  };
}

export interface UsersPaginatedResponse extends PaginatedResponse<UserInterface> {}

// Import this in other files
import { UserInterface } from './User';
export * from './User';

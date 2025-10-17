import { apiClient } from './apiClient';

// By exporting the apiClient, the entire application will now use the live backend
// for all data operations instead of the local mock data.
export const api = apiClient;

import { apiClient } from './apiClient';

// The application is now configured to run with the live backend.
// All API calls are directed to the apiClient service.
export const api = apiClient;
import { mockApi } from './mockApi';

// By exporting the mockApi, the entire application will now use the mock data
// instead of making real HTTP requests. This effectively reverts the application
// to its previous state before the backend was integrated.
export const api = mockApi;

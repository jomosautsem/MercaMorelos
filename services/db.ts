import Dexie, { Table } from 'dexie';
import { User } from '../types';

// Define the structure for an offline registration request
export type PendingRegistration = Omit<User, 'id' | 'role'> & { password: string; };

export class MercaMorelosDB extends Dexie {
  // Define the table for pending registrations
  pendingRegistrations!: Table<PendingRegistration & { id?: number }>;

  constructor() {
    super('MercaMorelosDB');
    // FIX: Cast `this` to Dexie to resolve the type error "Property 'version' does not exist on type 'MercaMorelosDB'".
    // This explicitly tells TypeScript to use the `version` method from the base Dexie class.
    (this as Dexie).version(1).stores({
      // '++id' creates an auto-incrementing primary key.
      // 'email' is an index to allow quick lookups if needed.
      pendingRegistrations: '++id, email',
    });
  }
}

// Export a singleton instance of the database
export const db = new MercaMorelosDB();
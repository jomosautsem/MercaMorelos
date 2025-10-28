const { createClient } = require('@supabase/supabase-js');

// These variables should be in your .env file in the backend directory
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key must be provided in the .env file.');
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabase,
  // Maintain compatibility with existing code that uses pool.query or pool.getClient
  // Note: These are now simplified wrappers around the supabase client.
  query: (text, params) => {
    // This is a very basic translation and might not cover all pg features.
    // It's better to refactor code to use supabase.from(...).select(...) directly.
    console.warn("Usage of db.query is deprecated. Please refactor to use Supabase client methods.");
    // This is a placeholder and would need a proper SQL parser to be robust.
    // For now, we assume simple queries. This part needs careful refactoring in the routes.
    return Promise.reject("db.query is not safely implemented for Supabase yet.");
  },
  getClient: async () => {
    // Supabase client manages its own connections, so this is just for compatibility.
    console.warn("Usage of db.getClient is not necessary with Supabase client.");
    return {
      query: (text, params) => supabase.rpc('execute_sql', { sql: text, params }), // Requires a custom SQL execution function in Supabase
      release: () => {},
      // Add BEGIN, COMMIT, ROLLBACK for transaction compatibility if needed
      ...
    };
  }
};
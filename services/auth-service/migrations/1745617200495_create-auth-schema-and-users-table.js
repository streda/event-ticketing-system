export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  // 1. Create the schema for the auth service
  pgm.createSchema('auth_schema', { ifNotExists: true });
  console.log('Created schema: auth_schema');

  // 2. Create the users table within that schema
  pgm.createTable({ schema: 'auth_schema', name: 'users' }, {
    // Define columns
    id: { 
      type: 'SERIAL', // Auto-incrementing integer
      primaryKey: true 
    },
    email: { 
      type: 'VARCHAR(255)', 
      notNull: true, 
      unique: true // Ensure emails are unique
    },
    password_hash: { 
      type: 'VARCHAR(255)', 
      notNull: true 
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP') // Default to current time
    },
    // Add updated_at if needed later
  });
  console.log('Created table: auth_schema.users');

  // Optional: Add an index on email for faster lookups
  pgm.createIndex({ schema: 'auth_schema', name: 'users' }, 'email');
  console.log('Created index on auth_schema.users(email)');
}


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  // Reverse the operations in reverse order

  // 3. Drop the index (if created)
  pgm.dropIndex({ schema: 'auth_schema', name: 'users' }, 'email');
  console.log('Dropped index on auth_schema.users(email)');

  // 2. Drop the users table
  pgm.dropTable({ schema: 'auth_schema', name: 'users' });
  console.log('Dropped table: auth_schema.users');

  // 1. Drop the schema
  pgm.dropSchema('auth_schema');
  console.log('Dropped schema: auth_schema');
}
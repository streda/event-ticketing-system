/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;
// migrations/<timestamp>_add_name_to_users_table.js

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  console.log("Adding 'name' column to auth_schema.users table...");
  // Adding the 'name' column to the existing 'users' table within 'auth_schema'
  pgm.addColumn(
    { schema: 'auth_schema', name: 'users' }, // Target table
    { // New column definition
      name: { 
        type: 'VARCHAR(255)',
        default: ''
      }
    }
  );
  console.log("'name' column added.");
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  console.log("Removing 'name' column from auth_schema.users table...");
  // Drop the 'name' column to revert the change
  pgm.dropColumn({ schema: 'auth_schema', name: 'users' }, 'name');
  console.log("'name' column removed.");
};
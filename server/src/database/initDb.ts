import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

export async function initializeDatabase() {
  console.log('🔄 Initializing ARAN Database tables...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  // Split SQL statements by semicolon, ignoring empty lines
  const statements = schemaSql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const statement of statements) {
      if (statement.length > 0) {
        await connection.query(statement);
      }
    }
    await connection.commit();
    console.log('✅ Database schema initialized successfully!');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

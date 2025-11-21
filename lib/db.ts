import mysql from 'mysql2/promise';

export const pool = mysql.createPool(process.env.DATABASE_URL || '');

// Funzione di utilità per eseguire query
export async function query<T>(sql: string, values: any[] = []): Promise<T> {
  const [rows] = await pool.execute(sql, values);
  return rows as T;
}
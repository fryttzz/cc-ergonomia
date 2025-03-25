import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS measures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sugarLevel TEXT NOT NULL,
                date TEXT NOT NULL,
                time REAL NOT NULL,
                description TEXT,
                userId INTEGER NOT NULL
            );
            INSERT INTO users (name, email, password) VALUES ('Matheus Santos', 'admin', 'admin');
        `)
}
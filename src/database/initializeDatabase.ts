import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cpf TEXT NOT NULL,
                birthdate TEXT NOT NULL,
                email TEXT NOT NULL,
                cep TEXT NOT NULL,
                street TEXT NOT NULL,
                district TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
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
            INSERT INTO users (name, cpf, birthdate, email, cep, street, district, city, state, password ) VALUES ('Matheus Santos', '116.984.749-89', '24/01/2001', 'admin', '88521-340', 'Rua Ilheu da Coroa Vermelha', 'Guarujá', 'Lages', 'Santa Catarina', 'admin');
        `)
}
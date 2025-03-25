import { useSQLiteContext } from "expo-sqlite";

export type UserDatabase = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export function useUserDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<UserDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO users (name, email, password) VALUES ($name, $email, $password)"
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $email: data.email,
        $password: data.password,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getUserById(id: string) {
    try {
      const query = `SELECT * FROM users WHERE id = ${id}`;

      const response = await database.getFirstAsync<UserDatabase>(
        query,
        `%${id}%`
      );
      console.log(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // async function list() {
  //   try {
  //     const query = "SELECT * FROM users ORDER BY id DESC";

  //     const response = await database.getAllAsync<UserDatabase>(query);

  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function update(data: UserDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE users SET name = $name, email = $email, password = $password WHERE id = $id"
    );

    try {
      const result = await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $email: data.email,
        $password: data.password,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    create,
    getUserById,
    update,
  };
}

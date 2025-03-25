import { useAuthContext } from "@/hooks/useAuthContext";
import { useSQLiteContext } from "expo-sqlite";

export type MeasureDatabase = {
  id: number;
  sugarLevel: string;
  date: string;
  time: string;
  description: string;
  userId: number;
};

export function useMeasureDatabase() {
  const database = useSQLiteContext();
  const { user } = useAuthContext();

  async function create(data: Omit<MeasureDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO measures (sugarLevel, date, time, description, userId) VALUES ($sugarLevel, $date, $time, $description, $userId)"
    );

    try {
      const result = await statement.executeAsync({
        $sugarLevel: data.sugarLevel,
        $date: data.date,
        $time: data.time,
        $description: data.description,
        $userId: data.userId,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // async function searchByCod(sugarLevel: string) {
  //   try {
  //     const query = "SELECT * FROM measures WHERE name LIKE ?";

  //     const response = await database.getAllAsync<MeasureDatabase>(
  //       query,
  //       `%${sugarLevel}%`
  //     );

  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function getMeasureById(id: string) {
    try {
      const query = `SELECT * FROM measures WHERE id = ${id}`;

      const response = await database.getFirstAsync<MeasureDatabase>(
        query,
        `%${id}%`
      );
      console.log(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function list() {
    try {
      const query = `SELECT * FROM measures WHERE userId = ${user?.id} ORDER BY date DESC`;

      const response = await database.getAllAsync<MeasureDatabase>(
        query,
        `%${user?.id}%`
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function update(data: MeasureDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE measures SET sugarLevel = $sugarLevel, date = $date, time = $time, description = $description, userId = $userId WHERE id = $id"
    );

    try {
      const result = await statement.executeAsync({
        $id: data.id,
        $sugarLevel: data.sugarLevel,
        $date: data.date,
        $time: data.time,
        $description: data.description,
        $userId: data.userId,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function deleteMeasure(id: string) {
    const statement = await database.prepareAsync(
      "DELETE FROM measures WHERE id = $id"
    );
    try {
      const result = await statement.executeAsync({
        $id: id,
      });
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    getMeasureById,
    update,
    list,
    deleteMeasure,
  };
}

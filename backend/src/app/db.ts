import { Client } from "pg";
import { log } from "console";

// let db: Client = st.getItem("client");
// export default db;

class DB {
  /**
   * Connects to the PostgreSLQ DB
   */
  private async dbConnect() {
    log("Connecting to DB");
    DB.theClient = new Client({
      user: process.env.EDM_DB_USER,
      host: process.env.EDM_DB_HOST,
      database: process.env.EDM_DB_DB,
      password: process.env.EDM_DB_PWD,
      port: parseInt(process.env.EDM_DB_PORT),
      ssl: process.env.EDM_DB_SSL === "true",
    });
    await DB.theClient.connect();
    log("Connected to the DB");
  }

  private static theClient: Client;

  public async getDbClient(): Promise<Client> {
    if (DB.theClient == null) {
      await this.dbConnect();
    }

    return DB.theClient;
  }
}

export default async function db(): Promise<Client> {
  return await new DB().getDbClient();
}

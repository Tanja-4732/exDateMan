import { Client } from "pg";
import * as st from "sessionstorage";

export default function client(): Client {
  return st.getItem("client");
}

// let db: Client = st.getItem("client");
// export default db;

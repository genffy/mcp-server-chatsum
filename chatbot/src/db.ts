import { ChatMessage } from "./types";
import Database from "better-sqlite3";

let db: Database.Database | null = null;

export async function saveChatMessage(msg: ChatMessage) {
  try {
    const database = getDb();
    if (!database) {
      throw new Error("db is not connected");
    }

    const {
      msg_type,
      msg_id,
      created_at,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      url_title,
      url_desc,
      url_link,
      url_thumb,
    } = msg;

    const sql = `INSERT INTO chat_messages(
      created_at,
      msg_id,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      msg_type,
      url_title,
      url_desc,
      url_link,
      url_thumb
    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    database.prepare(sql).run(
      created_at,
      msg_id,
      room_id,
      room_name,
      room_avatar,
      talker_id,
      talker_name,
      talker_avatar,
      content,
      msg_type,
      url_title,
      url_desc,
      url_link,
      url_thumb
    );

    console.log("save message ok");
  } catch (error) {
    console.error("save message failed: ", error);
    throw error;
  }
}

export function getDb(): Database.Database {
  if (db) return db;
  
  const dbName = process.env.CHAT_DB_PATH || "";
  if (!dbName) {
    throw new Error("CHAT_DB_PATH is not set");
  }

  try {
    db = new Database(dbName, { verbose: console.log });
    return db;
  } catch (err) {
    console.error("chat db connect failed: ", dbName, err);
    throw err;
  }
}

import { json } from "./utils/response.js";
import { getNotes, addNote, updateNote, deleteNote } from "./routes/notes.js";

export async function main(event) {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  if (method === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (path === "/notes" && method === "GET") {
    return getNotes();
  }

  if (path === "/notes" && method === "POST") {
    return addNote(event);
  }

  if (path.startsWith("/notes/") && method === "PUT") {
    const id = path.split("/")[2];
    return updateNote(event, id);
  }

  if (path.startsWith("/notes/") && method === "DELETE") {
    const id = path.split("/")[2];
    return deleteNote(id);
  }

  return json(404, { error: "Not Found" });
}

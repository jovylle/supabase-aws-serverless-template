import { json } from "./utils/response.js";
import { getNotes, addNote, updateNote, deleteNote } from "./routes/notes.js";

export async function main(event) {
  const method = event.requestContext.http.method;
  const stage =
    event.requestContext.stage || event.requestContext.http?.stage;
  console.log("handler receives", { stage, rawPath: event.rawPath });

  let rawPath = event.rawPath ?? "/";
  if (stage && rawPath.startsWith(`/${stage}`)) {
    rawPath = rawPath.slice(stage.length + 1);
  } else if (rawPath.startsWith("/")) {
    const segments = rawPath.split("/");
    if (segments.length > 1) {
      rawPath = `/${segments.slice(2).join("/")}`;
    }
  }

  const path = rawPath || "/";

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

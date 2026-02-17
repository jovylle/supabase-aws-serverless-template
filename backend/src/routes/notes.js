import { supabaseAdmin } from "../supabaseAdmin.js";
import { json } from "../utils/response.js";
import { parseBody } from "../utils/parseBody.js";

export async function getNotes() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return json(500, { error });

  return json(200, data);
}

export async function addNote(event) {
  const supabase = supabaseAdmin();
  const body = parseBody(event);

  if (!body.title) return json(400, { error: "title is required" });

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title: body.title, content: body.content || "" }])
    .select();

  if (error) return json(500, { error });

  return json(200, data[0]);
}

export async function updateNote(event, id) {
  const supabase = supabaseAdmin();
  const body = parseBody(event);

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: body.title,
      content: body.content
    })
    .eq("id", id)
    .select();

  if (error) return json(500, { error });

  return json(200, data[0]);
}

export async function deleteNote(id) {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) return json(500, { error });

  return json(200, { success: true });
}

import axios from "axios";
import type { Note, FetchNotesResponse } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

interface RawNote {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  tag: Note["tag"];
  createdAt: string;
  updatedAt: string;
}

interface RawFetchResponse {
  notes?: RawNote[];
  data?: RawNote[];
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<RawFetchResponse>("/notes", {
    params: { page, perPage, search },
  });

  const rawNotes: RawNote[] = data.notes ?? data.data ?? [];

  const notes: Note[] = rawNotes.map((n) => ({
    id: n._id ?? n.id ?? "",
    title: n.title,
    content: n.content,
    tag: n.tag,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  }));

  return {
    data: notes,
    page: data.page ?? page,
    perPage: data.perPage ?? perPage,
    total: data.total ?? notes.length,
    totalPages: data.totalPages ?? 1,
  };
}

export async function createNoteApi(payload: {
  title: string;
  content?: string;
  tag: Note["tag"];
}): Promise<Note> {
  const { data } = await api.post<RawNote>("/notes", payload);

  return {
    id: data._id ?? data.id ?? "",
    title: data.title,
    content: data.content,
    tag: data.tag,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function deleteNoteApi(id: string): Promise<{ message?: string }> {
  const { data } = await api.delete<{ message?: string }>(`/notes/${id}`);
  return data;
}

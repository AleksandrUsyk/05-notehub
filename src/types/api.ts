// src/types/api.ts
import type { Note } from "./note";

export interface FetchNotesResponse {
  data: Note[]; // массив заметок
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

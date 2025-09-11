// src/types/note.ts
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[]; // raw response field name from backend may vary — adjust if API uses another key
  totalPages: number; // number of pages
}

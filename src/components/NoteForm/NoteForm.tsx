import { useState } from "react";
import type { NoteTag } from "../../types/note";
import { createNoteApi } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function NoteForm({ onClose, onSuccess }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNoteApi({ title, content, tag });
      await onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error creating note");
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          name="title"
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          name="content"
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="note-tag">Tag</label>
        <select
          id="note-tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton}>
          Create Note
        </button>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

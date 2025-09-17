import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNoteApi } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().min(3, "Min 3").max(50, "Max 50").required("Required"),
  content: Yup.string().max(500, "Max 500"),
  tag: Yup.mixed<NoteTag>().oneOf(
    ["Todo", "Work", "Personal", "Meeting", "Shopping"],
    "Invalid tag"
  ),
});

export default function NoteForm({ onClose, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { title: string; content?: string; tag: NoteTag }) =>
      createNoteApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await onSuccess();
    },
  });

  return (
    <div>
      <h2>Create note</h2>
      <Formik
        initialValues={{ title: "", content: "", tag: "Todo" as NoteTag }}
        validationSchema={NoteSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            await mutation.mutateAsync(values);
          } catch (err) {
            console.error(err);
            alert("Failed to create note");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <ErrorMessage
                name="title"
                component="div"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="div"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="div" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                ref={submitRef}
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving…" : "Create note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

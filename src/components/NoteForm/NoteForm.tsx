// src/components/NoteForm/NoteForm.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";
import { createNoteApi } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onClose, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: { title: string; content?: string; tag: string }) =>
      createNoteApi(payload),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["notes"]);
        onSuccess?.();
      },
    }
  );

  return (
    <div className={css.wrapper}>
      <h2>Create note</h2>
      <Formik
        initialValues={{ title: "", content: "", tag: "Todo" }}
        validationSchema={NoteSchema}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field id="title" name="title" className={css.input} />
              <FormikError component="div" className={css.error} name="title" />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={6}
                className={css.textarea}
              />
              <FormikError
                component="div"
                className={css.error}
                name="content"
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
              <FormikError component="div" className={css.error} name="tag" />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                Create note
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

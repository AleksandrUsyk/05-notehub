import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebouncedValue } from "../../utils/useDebouncedValue";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebouncedValue(search, 300);

  // Скидаємо сторінку на 1 при зміні пошукового запиту
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    staleTime: 1000 * 60, // 1 хв
    // keepPreviousData більше не потрібно
    // placeholderData можна використовувати, якщо хочемо "заглушку"
  });

  const notes = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleNoteCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes.</p>}
        {!isLoading && !isError && <NoteList notes={notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={async () => {
              await handleNoteCreated();
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
}

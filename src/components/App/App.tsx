// src/components/App/App.tsx
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { fetchNotesApi } from "../../services/noteService";
import { useDebouncedValue } from "../../utils/useDebouncedValue";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // debounce search term (300ms)
  const debouncedSearch = useDebouncedValue(search, 300);

  // useQuery in NoteList (we will fetch in NoteList component) — but we can also centralize.
  // Here, NoteList will receive page and debouncedSearch and internally use useQuery.
  const onCreated = async () => {
    // invalidate notes cache: refetch current list (page+search)
    await queryClient.invalidateQueries(["notes"]);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <button
          className={css.button}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Create note +
        </button>
      </header>

      <NoteList
        page={page}
        perPage={12}
        search={debouncedSearch}
        onPageChange={setPage}
      />

      {/* Pagination handled inside NoteList or separate component below - we show below too */}
      <Pagination
        page={page}
        setPage={setPage}
        perPage={12}
        search={debouncedSearch}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={async () => {
              await onCreated();
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
}

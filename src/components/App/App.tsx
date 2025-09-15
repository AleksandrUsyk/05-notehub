import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebouncedValue } from "../../utils/useDebouncedValue";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedValue(search, 300);

  const onCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        <Pagination
          page={page}
          setPage={setPage}
          perPage={12}
          search={debouncedSearch}
        />

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList
        page={page}
        perPage={12}
        search={debouncedSearch}
        onPageChange={setPage}
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

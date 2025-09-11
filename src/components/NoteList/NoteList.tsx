import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteCard from "../NoteCard/NoteCard";
import Pagination from "../Pagination/Pagination";
import type { Note } from "../../types/note";

export default function NoteList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    keepPreviousData: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <>
      <div className="grid">
        {data?.data.map((note: Note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
}

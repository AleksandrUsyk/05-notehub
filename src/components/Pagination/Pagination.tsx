// src/components/Pagination/Pagination.tsx
import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNotesApi } from "../../services/noteService";

interface PaginationProps {
  page: number;
  setPage: (p: number) => void;
  perPage?: number;
  search?: string;
}

export default function Pagination({
  page,
  setPage,
  perPage = 12,
  search = "",
}: PaginationProps) {
  // Get totalPages using same key as NoteList
  const { data } = useQuery(
    ["notes", page, perPage, search],
    () => fetchNotesApi({ page, perPage, search }),
    {
      // we only need totalPages; keep previous data okay
      keepPreviousData: true,
    }
  );

  const totalPages = data?.totalPages ?? 0;
  if (totalPages <= 1) return null;

  return (
    <div className={css.wrapper}>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousLabel="←"
        nextLabel="→"
        previousClassName={css.pageItem}
        nextClassName={css.pageItem}
        breakLabel="…"
        breakClassName={css.pageItem}
        breakLinkClassName={css.pageLink}
      />
    </div>
  );
}

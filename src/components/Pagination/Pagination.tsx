import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./Pagination.module.css";

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
  const { data } = useQuery({
    queryKey: ["notes", page, perPage, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    staleTime: 1000 * 60,
  });

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

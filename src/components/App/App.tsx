import { useState } from "react";
import ReactPaginate from "react-paginate";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useFetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useFetchMovies(query, page);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toast("Please enter your search query.");
      return;
    }
    setQuery(trimmedQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main className={css.app}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && data && (
          <>
            {data.total_pages > 1 && (
              <ReactPaginate
                pageCount={data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                previousLabel="←"
                nextLabel="→"
                previousClassName={css.prevArrow}
                nextClassName={css.nextArrow}
              />
            )}

            <MovieGrid movies={data.results} onSelect={setSelected} />
          </>
        )}
      </main>
      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

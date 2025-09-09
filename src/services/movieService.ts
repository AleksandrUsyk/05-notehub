import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export interface FetchMoviesParams {
  query: string;
  page?: number;
  includeAdult?: boolean;
  language?: string;
}

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMoviesApi({
  query,
  page = 1,
}: FetchMoviesParams): Promise<FetchMoviesResponse> {
  const { data } = await api.get<FetchMoviesResponse>("/search/movie", {
    params: { query, page, include_adult: false, language: "en-US" },
  });
  return data;
}

export const useFetchMovies = (query: string, page: number) => {
  return useQuery<FetchMoviesResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMoviesApi({ query, page }),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
};

export function buildImageUrl(path: string | null, size: "w500" | "original") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

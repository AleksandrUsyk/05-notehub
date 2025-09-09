export function posterUrl(
  path: string | null,
  size: "w185" | "w342" | "w500" = "w500"
) {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

export function backdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "original"
) {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

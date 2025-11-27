// src/utils/pagination.js
/**
 * parse pagination params with safe defaults
 * returns skip, limit, page, sort object
 */
export function parsePagination(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10)); // cap 100 per page
  const skip = (page - 1) * limit;

  // sort param example: sort=createdAt:desc or sort=title:asc
  let sort = { createdAt: -1 };
  if (query.sort) {
    const [key, ord] = String(query.sort).split(":");
    if (key) sort = { [key]: ord === "asc" ? 1 : -1 };
  } else if (query.orderBy && query.order) {
    sort = { [query.orderBy]: query.order === "asc" ? 1 : -1 };
  }

  return { page, limit, skip, sort };
}

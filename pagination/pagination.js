const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows } = data;
  const totalItems = count;
  const items = rows;
  const currentPage = page ? parseInt(page) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};
module.exports = { getPagingData, getPagination };

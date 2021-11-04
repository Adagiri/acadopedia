const DEFAULT_QUERY_LIMIT = 0

function getPagination(query) {
  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || DEFAULT_QUERY_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}


module.exports = {
    getPagination
}
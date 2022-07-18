const paginate = (query, data, serializer = null) => {
    const size = query.pageSize ? parseInt(query.pageSize, 10) : 20;
    const page = query.page ? parseInt(query.page, 10) : 1;
    let maxPage = data.length / size;
    if (data.length % size !== 0) {
        maxPage = Math.floor(maxPage) + 1;
    }
    const start = size * (page - 1);
    const end = size * page;
    const result = data.slice(start, end);
    return {
        data: serializer ? result.map((item) => serializer(item)) : result,
        meta: {
            totalData: data.length,
            totalPage: maxPage,
            pageSize: size,
            page,
        },
    };
};

module.exports = {
    paginate,
};

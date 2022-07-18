const pagination = require('../../utils/pagination');

test('Should return paginted data', () => {
    const data = [{ id: 1, name: 'Abdul Muis' }];
    const paginated = pagination.paginate({}, data);

    expect(paginated).toHaveProperty('data');
    expect(paginated).toHaveProperty('meta');
    expect(paginated.data).toHaveLength(1);
    expect(paginated.data[0]).toEqual(data[0])
    expect(paginated.meta.totalData).toEqual(1);
    expect(paginated.meta.totalPage).toEqual(1);
    expect(paginated.meta.pageSize).toEqual(20);
    expect(paginated.meta.page).toEqual(1);
});

test('Should return paginated with serialier', () => {
    const serializer = (item) => {
        const data = {
            id: item.id,
            name: item.name,
        };
        return data;
    };
    const data = [
        { id: 1, name: 'Harry Potter and The Chamber of Secret', isDeleted: false, review: 10 },
        { id: 1, name: 'Harry Potter and The Prisoner of Azkaban', isDeleted: false, review: 20 },
        { id: 1, name: 'Harry Potter and Order of The Phoenix', isDeleted: false, review: 40 },
    ];
    const paginated = pagination.paginate({}, data, serializer);

    expect(paginated).toHaveProperty('data');
    expect(paginated).toHaveProperty('meta');
    expect(paginated.data[0]).not.toHaveProperty('isDeleted');
    expect(paginated.data[0]).not.toHaveProperty('review');
});
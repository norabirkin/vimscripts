Ext.define('OSS.store.Languages', {
    extend: 'Ext.data.ArrayStore',
    fields: ['id','name'],
    data: [['ru', 'Russian'], ['en', 'English']]
});

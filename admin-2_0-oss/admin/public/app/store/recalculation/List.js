Ext.define('OSS.store.recalculation.List', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: [
        'OSS.model.recalculation.List'
    ],
    model: 'OSS.model.recalculation.List',
    proxy: {
        type: 'rest',
        url: 'api/recalculation',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

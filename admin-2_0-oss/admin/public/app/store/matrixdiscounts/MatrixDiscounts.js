Ext.define('OSS.store.matrixdiscounts.MatrixDiscounts', {
    extend: 'OSS.ux.data.store.JAPI',
    
    requires: [
        'OSS.model.matrixdiscounts.MatrixDiscounts'
    ],
    
    model: 'OSS.model.matrixdiscounts.MatrixDiscounts',
    proxy: {
        type: 'rest',
        url: 'api/matrixdiscounts',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

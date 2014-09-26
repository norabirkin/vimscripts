Ext.define('OSS.store.OperatorsList', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.Operators',
    requires: [ 'OSS.model.Operators' ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl( 'api/operators' ),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

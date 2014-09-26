Ext.define('OSS.store.searchtemplates.Grid', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.searchtemplate.Grid',
    model: 'OSS.model.searchtemplate.Grid'/*,
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/billingmediation'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
    */
});

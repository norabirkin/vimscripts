Ext.define('OSS.store.printingformsstat.Documents', {
    extend: 'Ext.data.Store',
    model: 'OSS.model.printingformsstat.Documents',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    constructor: function(config) {
        this.callParent(arguments);
        this.proxy.extraParams = {
            on_fly: '0,1,3,4,5,6'
        };
    },
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/documents'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});

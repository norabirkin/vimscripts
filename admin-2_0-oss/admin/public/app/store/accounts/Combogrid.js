Ext.define('OSS.store.accounts.Combogrid', {
    extend: 'OSS.ux.data.store.JAPI',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.Account',
    model: 'OSS.model.Account',
    proxy: {
        type: 'rest',
        url: 'api/vgroup', 
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});

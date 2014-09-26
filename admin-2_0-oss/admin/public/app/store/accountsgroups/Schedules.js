Ext.define('OSS.store.accountsgroups.Schedules', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: 'OSS.model.accountsgroups.Schedules',
    model: 'OSS.model.accountsgroups.Schedules',
    proxy: {
        type: 'rest',
        url: 'api/accountsgroupsschedule', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

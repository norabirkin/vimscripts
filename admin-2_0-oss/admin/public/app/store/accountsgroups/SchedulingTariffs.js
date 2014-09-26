Ext.define('OSS.store.accountsgroups.SchedulingTariffs', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: 'OSS.model.accountsgroups.SchedulingTariffs',
    model: 'OSS.model.accountsgroups.SchedulingTariffs',
    proxy: {
        type: 'rest',
        url: 'api/tariffsFreeStaff', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

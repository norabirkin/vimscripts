Ext.define('OSS.store.Settings.Common', {
    extend: 'OSS.ux.data.store.JAPI',
    fields: [
        'gid',
        'gdescr',
        'descr', 
        'name', 
        'type',
        'value',
        'valuedescr'
    ],
    groupField: 'gid',
    licid: 'settings',
    proxy: {
        type: 'rest',
        groupParam: 'grp',
        url: 'api/settings',
        reader: {
            type: 'json',
            root: 'results'
        },
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});

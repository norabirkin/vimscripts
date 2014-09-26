Ext.define('OSS.model.documenttemplates.UserGroups', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'groupid', type: 'int' }, 
        { name: 'name', type: 'string' }, 
        { name: 'description', type: 'string' },
        { name: 'usercnt', type: 'int'},
        { name: 'fread', type: 'int'},
        { name: 'fwrite', type: 'int'},
        { name: 'promiseallow', type: 'bool'},
        { name: 'promiseblockdays', type: 'int'},
        { name: 'promisecurr', type: 'int'},
        { name: 'promiselimit', type: 'float'},
        { name: 'promisemax', type: 'float'},
        { name: 'promisemin', type: 'float'},
        { name: 'promiseondays', type: 'int'},
        { name: 'promiserent', type: 'bool'},
        { name: 'promisetill', type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/usergroups'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

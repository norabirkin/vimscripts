Ext.define('OSS.model.authlog.Data', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'auth_id', type: 'int' }, 
        { name: 'comment', type: 'string' },
        { name: 'dt', type: 'string' },
        { name: 'duration', type: 'int' },
        { name: 'ip', type: 'string' },
        { name: 'mac', type: 'string' },
        { name: 'nas_id', type: 'int' },
        { name: 'nas_ip', type: 'string' },
        { name: 'result', type: 'int' },
        { name: 'session_id', type: 'string' },
        { name: 'vg_login', type: 'string' }        
    ],
    proxy: {
        autoLoad: false,                  
        type: 'rest',  
        url: Ext.Ajax.getRestUrl('api/authLog'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

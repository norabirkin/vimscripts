Ext.define('OSS.model.promotions.List', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'archive', type: 'int' }, 
        { name: 'available', type: 'boolean' }, 
        { name: 'date_from_end', type: 'date', dateFormat: 'Y-m-d' }, 
        { name: 'date_from_start', type: 'date', dateFormat: 'Y-m-d' }, 
        { name: 'date_to', type: 'date', dateFormat: 'Y-m-d' }, 
        { name: 'day_count', type: 'int' }, 
        { name: 'descr', type: 'string' }, 
        { name: 'for_corporation', type: 'boolean' }, 
        { name: 'for_individual', type: 'boolean' },
        { name: 'link', type: 'string' }, 
        { name: 'modify_above', type: 'boolean' }, 
        { name: 'modify_rent', type: 'boolean' }, 
        { name: 'modify_shape', type: 'boolean' }, 
        { name: 'name', type: 'string' }, 
        { name: 'not_blocked_1', type: 'boolean' }, 
        { name: 'object', type: 'int' }, 
        { name: 'positive_balance', type: 'boolean' }, 
        { name: 'record_id', type: 'int' },
        { name: 'script', type: 'string' }, 
        { name: 'type', type: 'int' }, 
        { name: 'uuid', type: 'string' }
    ]
});
                
           
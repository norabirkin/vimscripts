Ext.define('OSS.model.packets.List', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'packet_id', type: 'int' }, 
        { name: 'name', type: 'string' }, 
        { name: 'descr', type: 'string'}, 
        { name: 'created', type: 'string', dateFormat: 'Y-m-d H:i:s' }, 
        { name: 'modified', type: 'date', dateFormat: 'Y-m-d H:i:s' }, 
        { name: 'date_from', type: 'date', dateFormat: 'Y-m-d' }, 
        { name: 'date_to', type: 'date', dateFormat: 'Y-m-d' }, 
        { name: 'date_end', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'state', type: 'int' }, 
        { name: 'person_id', type: 'int' }, 
        { name: 'discount', type: 'float' }, 
        { name: 'rate', type: 'float' }, 
        { name: 'block_state', type: 'int' }
    ]
});
                
           
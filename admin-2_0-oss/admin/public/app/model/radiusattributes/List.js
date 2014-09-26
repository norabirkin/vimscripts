Ext.define('OSS.model.radiusattributes.List', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'attr_id', type: 'int' }, 
        { name: 'cat_descr', type: 'string' }, 
        { name: 'cat_idx', type: 'int' }, 
        { name: 'description', type: 'string' }, 
        { name: 'dev_group_id', type: 'int' }, 
        { name: 'dict_name', type: 'string' }, 
        { name: 'group_id', type: 'int' }, 
        { name: 'id', type: 'int' }, 
        { name: 'nas_id', type: 'int'},
        { name: 'owner_descr', type: 'string' }, 
        { name: 'radius_code', type: 'int' }, 
        { name: 'record_id', type: 'int' }, 
        { name: 'service', type: 'string' }, 
        { name: 'service_for_list', type: 'int' }, 
        { name: 'shape', type: 'int' }, 
        { name: 'tag', type: 'int' }, 
        { name: 'tar_id', type: 'int' }, 
        { name: 'time_mark', type: 'object' },
        { name: 'value', type: 'string' }, 
        { name: 'vg_id', type: 'int' }, 
        { name: 'link', type: 'int' }
    ],
    idProperty: 'record_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/radiusattributeslist'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
                
           
Ext.define('OSS.model.printingformsstat.Documents', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'doc_id', type: 'int'},
        { name: 'client_allowed', type: 'int'},
        { name: 'cur_id', type: 'int'},
        { name: 'detail', type: 'int'},
        { name: 'document_period', type: 'int'},
        { name: 'file_naming', type: 'int'},
        { name: 'group_id', type: 'int'},
        { name: 'group_type', type: 'int'},
        { name: 'hidden', type: 'int'},
        { name: 'nds_above', type: 'int'},
        { name: 'on_fly', type: 'int'},
        { name: 'payable', type: 'int'},
        { name: 'user_group_id', type: 'int'},
        { name: 'doc_template', type: 'string'},
        { name: 'g_name', type: 'string'},
        { name: 'group_path', type: 'string'},
        { name: 'name', type: 'string'},
        { name: 'penalty_interval', type: 'string'},
        { name: 'penalty_period', type: 'string'},
        { name: 'save_path', type: 'string'},
        { name: 'symbol', type: 'string'},
        { name: 'ug_name', type: 'string'},
        { name: 'upload_ext', type: 'string'},
        { name: 'penalty_cost', type: 'float'},
        { name: 'penalty_limit', type: 'float'}
        
    ],
    idProperty: 'doc_id'
});
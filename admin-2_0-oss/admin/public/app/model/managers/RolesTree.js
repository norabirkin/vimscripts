/**
 * Элемент дерева правил
 */
Ext.define('OSS.model.managers.RolesTree', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'text',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'enabled',
        type: 'boolean'
    }, {
        name: 'value_create',
        type: 'boolean'
    }, {
        name: 'value_delete',
        type: 'boolean'
    }, {
        name: 'value_read',
        type: 'boolean'
    }, {
        name: 'value_update',
        type: 'boolean'
    }, {
        name: 'max_value_create',
        type: 'boolean'
    }, {
        name: 'max_value_delete',
        type: 'boolean'
    }, {
        name: 'max_value_read',
        type: 'boolean'
    }, {
        name: 'max_value_update',
        type: 'boolean'
    }]
});

/**
 * Модель валюты
 */
Ext.define('OSS.model.searchtemplate.Currency', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'cur_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'symbol',
            type: 'string'
        }
    ]
});

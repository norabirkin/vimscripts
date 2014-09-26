/**
 * Модель кода услуги
 */
Ext.define('OSS.model.tariffs.ServiceCode', {
    extend: 'Ext.data.Model',
    idProperty: 'record_id',
    fields: [{
        name: 'record_id',
        type: 'int'
    }, {
        name: 'gaap',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'unit',
        type: 'string'
    }, {
        name: 'unit_mult',
        type: 'int'
    }, {
        name: 'mod_person',
        type: 'int'
    }]
});

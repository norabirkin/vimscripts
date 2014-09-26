/**
 * Модификаторы категорий
 */
Ext.define('OSS.model.account.tariff.Modifiers', {
    extend: 'Ext.data.Model',
    fields: [],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/catmodifiers'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});

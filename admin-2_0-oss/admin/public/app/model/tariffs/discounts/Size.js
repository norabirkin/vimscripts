/**
 * Модель скидки по объему в категориях тарифа
 */
Ext.define('OSS.model.tariffs.discounts.Size', {
    extend: 'Ext.data.Model',
    idProperty: 'dis_id',
    fields: [{
        name: 'dis_id',
        type: 'int'
    }, {
        name: 'tar_id',
        type: 'int'
    }, {
        name: 'cat_idx',
        type: 'int'
    }, {
        name: 'type',
        type: 'int'
    }, {
        name: 'amount',
        type: 'int'
    }, {
        name: 'discount',
        type: 'float'
    }, {
        name: 'bonus',
        type: 'float'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/sizeDiscounts'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});

/**
 * Хранилище скидок по объему в категориях тарифа
 */
Ext.define('OSS.store.tariffs.discounts.Size', {
    extend: 'Ext.data.Store',
    lazy: true,
    model: 'OSS.model.tariffs.discounts.Size',
    requires: 'OSS.model.tariffs.discounts.Size'
});

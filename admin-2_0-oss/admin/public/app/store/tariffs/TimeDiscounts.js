/**
 * Хранилище для таблицы "Скидки по времени"
 */
Ext.define('OSS.store.tariffs.TimeDiscounts', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.tariffs.TimeDiscounts',
    model: 'OSS.model.tariffs.TimeDiscounts'
});

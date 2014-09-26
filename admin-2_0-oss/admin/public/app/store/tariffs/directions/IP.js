/**
 * Хранилище направлений категорий интернет тарифа
 */
Ext.define('OSS.store.tariffs.directions.IP', {
    extend: 'Ext.data.Store',
    validity: 'ipzone',
    model: 'OSS.model.tariffs.directions.IP',
    requires: 'OSS.model.tariffs.directions.IP',
    lazy: true
});

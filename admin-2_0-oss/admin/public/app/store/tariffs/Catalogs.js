/**
 * Хранилище для комбогрида каталогов в форме категорий тарифа
 */
Ext.define('OSS.store.tariffs.Catalogs', {
    extend: 'Ext.data.Store',
    lazy: true,
    model: 'OSS.model.tariffs.TariffCatalog',
    requires: 'OSS.model.tariffs.TariffCatalog',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tariffs/catalogs'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});

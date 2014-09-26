Ext.define('OSS.store.tariffs.TariffsList', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.tariffs.TariffsList',
    model: 'OSS.model.tariffs.TariffsList',
    remoteSort: true
});

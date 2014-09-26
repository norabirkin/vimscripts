/**
 * Хранилище для таблицы "В зависимости от объема" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.store.tariffs.bandpass.Size', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.tariffs.bandpass.Size',
    model: 'OSS.model.tariffs.bandpass.Size'
});

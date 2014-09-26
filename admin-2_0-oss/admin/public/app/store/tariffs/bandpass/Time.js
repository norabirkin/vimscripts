/**
 * Хранилище таблицы "В зависимости от дня и времени" вкладки "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.store.tariffs.bandpass.Time', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.tariffs.bandpass.Time',
    model: 'OSS.model.tariffs.bandpass.Time'
});

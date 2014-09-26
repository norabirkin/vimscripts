/**
 * Хранилище платформ
 */
Ext.define('OSS.store.Platforms', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.Platform',
    model: 'OSS.model.Platform'
});

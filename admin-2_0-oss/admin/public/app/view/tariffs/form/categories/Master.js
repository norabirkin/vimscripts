/**
 * Комбогрид "Мастер-категория" для формы категорий тарифов
 */
Ext.define('OSS.view.tariffs.form.categories.Master', {
    extend: 'OSS.ux.form.field.ComboGrid',
    fieldLabel: i18n.get('Master category'),
    width: 100,
    tartypes: [3,4],
    name: 'cat_idx_master',
    data: 'master',
    displayField: 'descr',
    valueField: 'cat_idx',
    columns: [{
        header: i18n.get('Name'),
        flex: 1,
        dataIndex: 'descr'
    }, {
        header: i18n.get('ID of external service'),
        flex: 1,
        dataIndex: 'uuid'
    }],
    store: 'tariffs.MasterCategory',
    anchor: '100%'
});

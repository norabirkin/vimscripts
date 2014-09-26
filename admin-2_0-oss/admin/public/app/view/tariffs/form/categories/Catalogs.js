/**
 * Комбогрид каталогов для формы категорий тарифа
 */
Ext.define('OSS.view.tariffs.form.categories.Catalogs', {
    extend: 'OSS.ux.form.field.ComboGrid',
    store: 'tariffs.Catalogs',
    valueField: 'catalog_id',
    displayField: 'name',
    columns: [{
        header: i18n.get('Name'),
        flex: 1,
        dataIndex: 'name'
    }, {
        header: i18n.get('Operator'),
        dataIndex: 'operator_name'
    }, {
        xtype: 'storecolumn',
        store: 'catalog.Types',
        header: i18n.get('Type'),
        dataIndex: 'type'
    }]
});

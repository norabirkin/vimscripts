/**
 * Комбогрид "Код услуги" из формы тарифов
 */
Ext.define('OSS.view.tariffs.form.servicecode.ComboGrid', {
    extend: 'OSS.ux.form.field.ComboGrid',
    name: 'sale_dictionary_id',
    data: 'service_code',
    store: 'tariffs.ServiceCodes',
    valueField: 'record_id',
    displayField: 'name',
    columns: [{
        header: i18n.get('Name'),
        dataIndex: 'name',
        flex: 1
    }, {
        header: i18n.get('Unit of m.'),
        dataIndex: 'unit',
        width: 80
    }, {
        header: i18n.get('Code'),
        dataIndex: 'gaap'
    }]
});

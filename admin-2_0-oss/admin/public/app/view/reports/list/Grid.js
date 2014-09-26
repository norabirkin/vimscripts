/**
 * Таблица отчетов
 */
Ext.define('OSS.view.reports.list.Grid', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: 'widget.templateslist',
    name: 'doc_id',
    width: 615,
    fieldLabel: i18n.get('Document template'),
    store: 'reports.ReportsDocuments',
    loadOnRender: false,
    valueField: 'doc_id',
    displayField: 'name',
    columns: [{
        header: i18n.get('ID'),
        dataIndex: 'doc_id',
        width: 50 
    }, {
        header: i18n.get('Name of user report'),
        dataIndex: 'name',
        flex: 1
    }, {
        header: i18n.get('Main file of user report'),
        dataIndex: 'doc_template',
        width: 200
    }]
});

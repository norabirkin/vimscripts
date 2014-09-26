Ext.define('OSS.view.accounts.item.IPCombo', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: 'widget.ipcombo',
    name: 'ip',
    loadOnRender: false,
    valueField: 'network',
    displayField: 'network',
    flex: 1,
    store: 'accounts.Networks',
    columns: [{
        header: i18n.get('IP address'),
        dataIndex: 'network',
        flex: 1 
    }]
});
Ext.define('OSS.view.printforms.AccountsComboGrid', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: 'widget.accountsComboGrid',
    name: 'vg_id',
    width: '100%',
    store: 'accounts.Combogrid',
    fieldLabel: i18n.get('Account'),
    loadOnRender: false,
    valueField: 'vg_id',
    displayField: 'login',
    columns: [{
        header: i18n.get('ID'),
        dataIndex: 'vg_id',
        width: 50 
    }, {
        header: i18n.get('Login'),
        dataIndex: 'login',
        flex: 1
    }]
});

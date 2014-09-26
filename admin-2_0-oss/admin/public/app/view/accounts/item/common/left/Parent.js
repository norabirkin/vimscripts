Ext.define('OSS.view.accounts.item.common.left.Parent', {
    extend: 'OSS.ux.form.field.ComboGrid',
    alias: "widget.vgroupscmbgrid",
    width: 500,
    displayField: 'login',
    valueField: 'vg_id',
    padding: '5 0 0 0',
    initComponent: function() {
        this.store = Ext.create('OSS.store.accounts.Combogrid');
        this.callParent(arguments);
    },
    columns: [{
        header: i18n.get('Login'),
        dataIndex: 'login'
    }, {
        header: i18n.get('Agreement'),
        dataIndex: 'agrm_num'
    }, {
        header: i18n.get('Person full name'),
        dataIndex: 'user_name',
        flex: 1
    }]
});
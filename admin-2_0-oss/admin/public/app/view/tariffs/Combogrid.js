Ext.define('OSS.view.tariffs.Combogrid', {
    extend: 'OSS.ux.form.field.combogrid.WithSearchToolbar',
    fieldLabel: i18n.get('Tariff'),
    toolbar: {
        value: -1,
        data: [{
            name: -1,
            descr: i18n.get('All')
        }, {
            name: 0,
            descr: i18n.get('Leased line')
        }, {
            name: 1,
            descr: 'Dialup (' + i18n.get('by size') + ')'
        }, {
            name: 2,
            descr: 'Dialup (' + i18n.get('by time') + ')'
        }, {
            name: 3,
            descr: i18n.get('Telephony')
        }, {
            name: 4,
            descr: 'IP ' + i18n.get('Telephony')
        }, {
            name: 5,
            descr: i18n.get('Services')
       }]
    },
    initComponent: function() {
        this.store = Ext.create('OSS.store.Tariffs');
        this.callParent(arguments);
    },
    width: 700,
    displayField: 'descr',
    valueField: 'tar_id',
    columns: [{
        header: i18n.get('ID'),
        dataIndex: 'tar_id'
    }, {
        header: i18n.get('Description'),
        dataIndex: 'descr',
        flex: 1
    }, {
        header: i18n.get('Write rent off'),
        dataIndex: 'type'
    }, {
        header: i18n.get('Rent'),
        dataIndex: 'rent'
    }, {
        header: i18n.get('Accounts'),
        dataIndex: 'ext_vg_count'
    }]
});

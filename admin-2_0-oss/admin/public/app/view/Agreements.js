Ext.define('OSS.view.Agreements', {
    extend: 'OSS.ux.form.field.combogrid.WithSearchToolbar',
    itemId: 'agreements',
    width: 500,
    fieldLabel: OSS.Localize.get('Agreement'), 
    labelWidth: 50,
    displayField: 'agrm_num',
    valueField: 'agrm_id',
    toolbar: {
        value: 'agrm_num',
        data: [{
            name: 'agrm_num',
            descr: i18n.get('Agreement number')
        }, {
            name: 'name',
            descr: i18n.get('User name')
        }, {
            name: 'login',
            descr: i18n.get('User login')
        }, {
            name: 'vg_login',
            descr: i18n.get('Account login')
        }]
    },
    columns: [
        {
            dataIndex: 'agrm_num',
            header: i18n.get('Number'),
            flex: 2
        },
        {
            dataIndex: 'user_name',
            header: i18n.get('User name'),
            flex: 1
        },
        {
            dataIndex: 'balance',
            header: i18n.get('Balance'),
            renderer: function( value, meta, record ) {
                return  Ext.Number.toFixed(value, 2) + ' (' + record.get('symbol') + ')';
            }
        }
    ],
    storeClassName: function() {
        return 'OSS.store.Agreements';
    }
});

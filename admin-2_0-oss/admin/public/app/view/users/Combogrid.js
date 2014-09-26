Ext.define('OSS.view.users.Combogrid', {
    extend: 'OSS.ux.form.field.combogrid.WithSearchToolbar',
    name: 'uid',
    requires: 'OSS.view.users.Select',
    alias: 'widget.userscombogrid',
    width: 476,
    displayField: 'name',
    valueField: 'uid',
    params: {
        property: 'property',
        value: 'search'
    },
    toolbar: {
        value: 'name',
        data: [{
            name: 'name',
            descr: i18n.get('Person full name')
        }, {
            name: 'agrm_num',
            descr: i18n.get('Agreement')
        }, {
            name: 'pay_code',
            descr: i18n.get('Payment code')
        }, {
            name: 'login',
            descr: i18n.get('User login')
        }, {
            name: 'vg_login',
            descr: i18n.get('Account login')
        }, {
            name: 'email',
            descr: i18n.get('E-mail')
        }, {
            name: 'phone',
            descr: i18n.get('Phone')
        }, {
            name: 'address',
            descr: i18n.get('Address')
        }, {
            name: 'address_code',
            descr: i18n.get('Similar addresses')
        }]
    },
    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('OSS.store.users.Combogrid');
        }
        if (!this.columns || !this.columns.length) {
            this.columns = [{
                header: i18n.get('Person full name'),
                dataIndex: 'name',
                flex: 1
            }, 
            Ext.create('OSS.view.users.TypeColumn'),
            {
                header: i18n.get('Phone'),
                dataIndex: 'phone'
            }, {
                header: 'E-mail',
                dataIndex: 'email'
            }];
        }
        this.callParent(arguments);
    }
});

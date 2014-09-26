Ext.define( 'OSS.view.users.Adresses', {
    extend: 'Ext.window.Window',
    title: OSS.Localize.get('Addresses'),
    width: 700,
    resizable: false,
    height: 125,
    initComponent: function() {
        var store = Ext.create( 'Ext.data.Store', {
            fields: [
                { name: 'address', type: 'string' },
                { name: 'descr', type: 'string' },
                { name: 'code', type: 'string' },
                { name: 'type', type: 'int' },
                { name: 'usertype', type: 'int' },
                { name: 'uid', type: 'int' }
            ]
        }),
            i,
            address,
            me = this;
        for (i = 1; i <= 3; i ++) {
            address = this.user.get( 'address_' + i );
            if ( address && address != '' ) {
                store.add({ 
                    type: (i - 1),
                    address: address,
                    code: this.user.get( 'address_code_' + i ),
                    descr: this.user.get( 'address_descr_' + i ),
                    usertype: this.user.get( 'type' ),
                    uid: this.user.get( 'uid' )
                });
            } else {
                store.add({
                    type: (i - 1),
                    address: '',
                    code: '',
                    descr: '',
                    usertype: this.user.get( 'type' ),
                    uid: this.user.get( 'uid' )
                });
            }
        }
        /*var edit = Ext.create( 'Ext.grid.column.Action', {
            header: '&nbsp',
            itemId: 'edit',
            width: 30,
            tooltip: OSS.Localize.get( 'Edit' ),
            align: 'center',
            getClass: function() { return 'x-ibtn-def x-ibtn-edit'; }
        });
        edit.on( 'click', function() {
            Ext.app.Application.instance.getController('Address').openWindow({
                address: {
                    address: arguments[5].get('descr'),
                    code: arguments[5].get('code'),
                    type: arguments[5].get('type'),
                    uid: arguments[5].get('uid')
                },
                onSave: Ext.app.Application.instance.getController('Users').saveAddress,
                scope: Ext.app.Application.instance.getController('Users')
            });
        }, this);*/
        this.items = [{
            xtype: 'gridpanel',
            layout: 'anchor',
            columns: [
                /*edit,*/
                { 
                    header: OSS.Localize.get('Address'),
                    dataIndex: 'address',
                    flex: 2
                },
                { 
                    header: OSS.Localize.get('Type'),
                    dataIndex: 'type',
                    flex: 1,
                    renderer: function() { return me.getAddressName( (arguments[2].get('type') + 1), arguments[2].get('usertype') ); }
                }
            ],
            store: store
        }];
        this.callParent( arguments );
    },
    getAddressName: function( addesstype, usertype ) {
        return Ext.app.Application.instance.getController('Address').getAddressName( addesstype, usertype );
    }
});

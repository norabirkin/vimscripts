Ext.define('OSS.view.users.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.users_list',
    store: 'Users',
    initComponent: function() {
        this.selModel = Ext.create("Ext.selection.CheckboxModel", { checkOnly: true });
        this.bbar = {
            xtype: 'pagingtoolbar',
            store: this.store
        };
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'splitbutton', 
                text: OSS.Localize.get( 'Actions' ),
                itemId: 'actions', 
                handler: function(Btn) {
                    Btn.showMenu();
                },
                menu: [{
                    itemId: 'userCreateBtn', 
                    text: i18n.get('Create'), 
                    iconCls: 'x-ibtn-add'
                }, {
                    itemId: 'remove', 
                    disabled: true,
                    text: i18n.get('Delete'), 
                    iconCls: 'x-ibtn-def-dis x-ibtn-delete'
                }, {
                    xtype: 'menucheckitem',
                    itemId: 'advancedSearchBox', 
                    disabled: true,
                    text: i18n.get('Advanced search')
                }]
            }, '-' , {
                xtype: 'combobox',
                width: 180,
                itemId: 'searchType',
                name: 'property',
                valueField: 'name',
                displayField: 'descr',
                value: 'name',
                store: Ext.create( "Ext.data.Store", {
                    fields: ['descr', 'name'],
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
                })
            }, {
                xtype: 'searchtext',
                itemId: 'searchField',
                width: 200,
                name: 'search',
                parentContainerType: 'container',
                searchButton: 'findUserBtn'
            }, {
                xtype: 'button',
                text: i18n.get('Show'),
                itemId: 'findUserBtn',
                iconCls: 'x-ibtn-search'
            }]
        }];
        this.columns = [
            {
                itemId: 'editUserBtn',
                width: 20,
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get('Edit'),
                iconCls: 'x-ibtn-def x-ibtn-edit'
            },
            {
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get( 'Payments' ), 
                itemId: 'payments',
                iconCls: 'x-ibtn-def x-ibtn-money',
                width: 20
            },
            { dataIndex: 'name', header: OSS.Localize.get( 'User name' ), flex: 1 },
            { dataIndex: 'login', header: OSS.Localize.get( 'Login' ) },
            { dataIndex: 'mobile', header: OSS.Localize.get( 'Mobile' ), width: 180 },
            { dataIndex: 'phone', header: OSS.Localize.get( 'Phone' ), hidden: true },
            { dataIndex: 'email', header: OSS.Localize.get( 'E-Mail' ), hidden: true },
            Ext.create('OSS.view.users.TypeColumn'),            
            {
                dataIndex: 'category',
                hidden: true,
                header: OSS.Localize.get( 'Category' ),
                renderer: function( value ) {
                    var store = Ext.data.StoreManager.lookup( 'users.Categories' );
                    var record = store.findRecord( 'id', value );
                    if (!record) {
                        return store.findRecord( 'id', 0 ).get('name');
                    }
                    return record.get('name');
                }
            },
            { dataIndex: 'descr', header: OSS.Localize.get( 'Description' ), hidden: true },
            {
                header: OSS.Localize.get( 'Address' ), 
                itemId: 'address',
                flex: 2,
                renderer: function() {
                    var record = arguments[2];
                        address = '';
                    this.iterateAddresses( record, function(a) {
                        address = a;
                        return true;
                    });
                    if (address !== '') {
                        arguments[1].tdCls = 'oss-objects-users-list-address';
                    }
                    record.set( 'address', address );
                    return address;
                }
            },           
            {
                xtype: 'actioncolumn',
                tooltip: OSS.Localize.get( 'Rent charges' ), 
                itemId: 'rent_charges',
                iconCls: 'x-ibtn-def x-ibtn-chart',
                width: 20
            }
        ];
        this.callParent( arguments );
        this.on( 'viewready', this.bindAddressTooltips, this );
    },
    bindAddressTooltips: function() {
        var view = this.getView(),
            grid = this,
            i,
            cells;
        if (view.el) {
            cells = view.el.query('.oss-objects-users-list-address');
            for (i = 0; i < cells.length; i ++) {
                this.createToolTip( Ext.get(cells[i]), grid, view );
            }
        }
        if (!this.getStore().addressTooltipBinderAdded) {
            this.getStore().on( 'load', this.bindAddressTooltips, this );
            this.getStore().addressTooltipBinderAdded = true;
        }
    },
    createToolTip: function( target, grid, view ) {
        var record = view.getRecord( target.up('tr').dom );
        Ext.create( 'Ext.tip.ToolTip', {
            target: target,
            trackMouse: true,
            renderTo: Ext.getBody(),
            maxWidth: 2000,
            showDelay: 100,
            hideDelay: 0,
            shrinkWrap: true,
            listeners: {
                beforeshow: function(tip) {
                    var data = [];
                    grid.iterateAddresses( record, function( address, i ) {
                        data.push({ name: grid.getAddressName(i, record), value: address });
                    });
                    this.update( new Ext.XTemplate('<table><tpl for="."><tr><td style="text-align: right; padding-right: 10px;">{name}:</td><td>{value}</td></tr></tpl></table>').apply(data) );
                }
            }
        });
    },
    getAddressName: function( i, record ) {
        return Ext.app.Application.instance.getController('Address').getAddressName( i, record.get('type') );
    },
    iterateAddresses: function( record, callback ) {
        var i,
            a,
            address = '';
        for (i = 1; i <= 3; i ++) {
            a = record.get('address_' + i);
            if ( a !== '') { 
                if (callback(a, i)) {
                    break;
                } 
            }
        }
    }
});

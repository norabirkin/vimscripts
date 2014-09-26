Ext.define( 'OSS.view.payments.BSO', {
    extend: 'Ext.Window',
    alias: 'widget.bso',
    title: OSS.Localize.get('Choose SRF'),
    width: 850,
    height: 700,
    layout: 'fit',
    modal: true,
    initComponent: function() {
        var store = Ext.create( 'Ext.data.Store', {
            fields: [
                { name: 'record_id', type: 'int' },
                { name: 'number', type: 'string' },
                { name: 'created', type: 'string' },
                { name: 'p_data', type: 'string' }
            ],
            setItemId: function( id ) {
                this.proxy.url = Ext.Ajax.getRestUrl('api/bsodocs/' + id);
            },
            proxy: {
                type: 'rest',
                url: Ext.Ajax.getRestUrl('api/bsodocs'),
                reader: {
                    type: 'json',
                    root: 'results',
                    totalProperty: 'total'
                }
            },
            pageSize: 100
        });
        var getBSOItemLabel = function( key ) {
            var labels = {
                agrm: 'Agreement number',
                amount: 'Sum',
                uname: 'Client',
                paydate: 'Payment date'
            };
            return OSS.Localize.get( labels[key] );
        };
        var renderBSOItem = function( value ) {
            var result = [],
                i;
            for (var i in value) {
                result.push( getBSOItemLabel(i) + ': ' + value[i] );
            }
            return result.join( '<br/>' );
        };
        this.items = [{
            xtype: 'gridpanel',
            bbar: [
                { xtype: 'button', itemId: 'choose', text: OSS.Localize.get('Choose') },
                { xtype: 'button', itemId: 'cancel', text: OSS.Localize.get('Cancel') }
            ],
            tbar: [
                {
                    xtype: 'combo',
                    name: 'set',
                    fieldLabel: OSS.Localize.get('Billhead serial'),
                    labelWidth: 'auto',
                    displayField: 'number',
                    valueField: 'record_id',
                    padding: '0 20 0 0',
                    store: Ext.create( 'Ext.data.Store', {
                        fields: [{ name: 'record_id', type: 'int' }, { name: 'number', type: 'string' }],
                        proxy: {
                            type: 'rest',
                            url: Ext.Ajax.getRestUrl('api/bsosets'),
                            reader: {
                                type: 'json',
                                root: 'results'
                            }
                        }
                    })
                },
                {
                    xtype: 'textfield',
                    fieldLabel: OSS.Localize.get('Billhead number'),
                    labelWidth: 'auto',
                    name: 'number'
                },
                { xtype: 'find' }
            ],
            dockedItems: [{ xtype: 'pagingtoolbar', store: store }],
            columns: [
                {
                    header: OSS.Localize.get('Number'),
                    flex: 1,
                    dataIndex: 'number',
                    renderer: function( value ) {
                        return Ext.app.Application.instance.getController( 'Payments' ).getNumberColumnText( value );
                    }
                },
                {
                    header: OSS.Localize.get('Info about attached payment'),
                    dataIndex: 'p_data',
                    flex: 1,
                    renderer: function( value ) {
                        var result = [],
                            i;
                        if (!value || value == '') {
                            return '';
                        }
                        value = Ext.JSON.decode( value );
                        for (i = 0; i < value.length; i ++) {
                            result.push( renderBSOItem(value[i]) );
                        }
                        return result.join( '<hr/>' );
                    }
                },
                {
                    header: OSS.Localize.get('Creation date'),
                    dataIndex: 'created',
                    width: 120
                }
            ],
            store: store
        }];
        this.callParent( arguments );
    }

});

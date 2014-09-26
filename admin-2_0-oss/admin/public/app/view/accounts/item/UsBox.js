/**
 * Суперкласс для вкладок <Периодические услуги> и <Разовые услуги> формы редактирования учетной записи
 */
Ext.define('OSS.view.accounts.item.UsBox', {
    extend: 'OSS.ux.grid.editor.Window',
    usboxTab: true,
    validate: true,
    toolbarClassName: 'OSS.view.accounts.item.Toolbar',
    deleteConfirm: {
        title: i18n.get('Info'), 
        msg: i18n.get('Money that were written off will be returned to account back') + '<br/>' + i18n.get('Information about service will be deleted')
    },
    winConfig: {
        params: {
            usboxTab: true
        },
        title: {
            create: i18n.get('Add service'),
            update: i18n.get('Update service')
        },
        editForm: [{
            xtype: 'datetime',
            fieldLabel: i18n.get('Since'),
            labelWidth: 150,
            allowBlank: false,
            name: 'time_from',
            defaultDate: null
        }, {
            fieldLabel: i18n.get('Service'),
            showId: true,
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            name: 'cat_idx',
            allowBlank: false,
            displayField: 'descr',
            valueField: 'cat_idx',
            editable: false,
            store: 'tariffs.Categories'
        }, {
            fieldLabel: i18n.get('Quantity'),
            labelWidth: 150,
            width: 500,
            xtype: 'numberfield',
            name: 'mul',
            value: 1
        }, {
            fieldLabel: i18n.get('Comment'),
            labelWidth: 150,
            width: 500,
            xtype: 'textfield',
            name: 'comment'
        }, {
            fieldLabel: i18n.get('Discount type'),
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            name: 'disctype',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            value: 'rate',
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'string'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: 'discount',
                    name: i18n.get('Absolute')
                }, {
                    id: 'rate',
                    name: i18n.get('Coefficient')
                }]
            })
        }, {
            xtype: 'container',
            layout: 'card',
            itemId: 'discount_fields',
            items: [{
                fieldLabel: i18n.get('Ratio'),
                labelWidth: 150,
                width: 500,
                xtype: 'numberfield',
                name: 'rate',
                itemId: 'rate',
                decimalPrecision: 5,
                value: 1
            }, {
                fieldLabel: i18n.get('Discount'),
                labelWidth: 150,
                width: 500,
                xtype: 'numberfield',
                name: 'discount',
                itemId: 'discount',
                decimalPrecision: 5,
                value: 0
            }]
        }]
    },
    columns: [{
        header: i18n.get('Description'),
        dataIndex: 'cat_descr',
        flex: 1
    }, {
        header: i18n.get('Date'),
        xtype: 'datecolumn',
        width: 125,
        format: 'Y-m-d H:i:s',
        dataIndex: 'time_from'
    }, {
        header: i18n.get('Quant.'),
        dataIndex: 'mul'
    }, {
        header: i18n.get('Price'),
        dataIndex: 'cat_above'
    }, {
        header: i18n.get('Discount'),
        dataIndex: 'rate'
    }, {
        header: i18n.get('Total'),
        renderer: function() {
            if (
                arguments[2].get('rate') == 1 &&
                arguments[2].get('discount') > 0
            ) {
                return (
                    Math.ceil(
                        arguments[2].get('mul') *
                        arguments[2].get('cat_above') *
                        10
                    ) / 10
                ) - arguments[2].get('discount');
            } else if (arguments[2].get('discount') === 0) {
                return Math.ceil(
                    arguments[2].get('mul') *
                    arguments[2].get('cat_above') *
                    arguments[2].get('rate') *
                    10
                ) / 10;
            }
            
        }
    }, {
        header: i18n.get('Assigned by'),
        dataIndex: 'person_name'
    }, {
        header: i18n.get('Comment'),
        flex: 1,
        dataIndex: 'comment'
    }],
    /**
     * Возвращает массив полей, которые должны быть readOnly при редактировании
     */
    readOnlyOnEdit: function() {
        return [
            'cat_idx',
            'mul',
            'comment'
        ];
    },
    initComponent: function() {
        this.bbar = {
            xtype: 'pagingtoolbar',
            store: this.store
        };
        this.callParent(arguments);
    }
});

Ext.define('OSS.view.printingformsstat.Form', {
    extend: 'OSS.view.Filter',
    width: 430,
    minWidth: 400,
    itemId: 'printingStatForm',
    actions: [{
        iconCls: 'x-ibtn-search',
        itemId: 'showBtn',
        text: i18n.get('Show')
    }, {
        iconCls: 'x-ibtn-save',
        itemId: 'uploadBtn',
        text: i18n.get('Export'),
        menu: [{
            itemId: 'uploadSelectedBtn',
            text: i18n.get('Selected')
        }, {
            itemId: 'uploadPageBtn',
            text: i18n.get('Current page')
        }, {
            itemId: 'uploadAllBtn',
            text: i18n.get('All')
        }]
    }],
    items: [{
        xtype: 'fieldset',
        title: i18n.get('Filter'),
        items: [{
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            items: [{
                xtype: 'templateslist',
                itemId: 'templateslist',
                store: 'printingformsstat.Documents',
                name: 'doc_id',
                value: 0,
                labelWidth: 100
            }]
        }, {
            xtype: 'fieldcontainer',
            defaults: { margin: '0 5 0 0' },
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            fieldLabel: i18n.get('Month'),
            items: [{
                xtype: 'radio',
                name: 'periodrb',
                checked: true,
                inputValue: 0,
                fieldLabel: '',
                boxLabel: '',
                itemId: 'monthRadioEl'
            }, {
                xtype: 'datefield',
                name: 'period',
                value: Ext.Date.format(new Date(), 'Y-m-01'),
                width: 130,
                fieldLabel: '',
                labelWidth: 20,
                hideEmptyLabel: false
            }]
        }, {
            xtype: 'fieldcontainer',
            defaults: { margin: '0 5 0 0' },
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            fieldLabel: i18n.get('Period'),
            items: [{
                xtype: 'radio',
                name: 'periodrb',
                fieldLabel: '',
                inputValue: 1,
                boxLabel: '',
                itemId: 'periodRadioEl'
            }, {
                xtype: 'datefield',
                disabled: true,
                name: 'date_from',
                width: 130,
                fieldLabel: i18n.get('Since'),
                labelWidth: 20
            }, {
                xtype: 'datefield',
                disabled: true,
                name: 'date_to',
                margin: 0,
                width: 130,
                fieldLabel: i18n.get('To'),
                labelWidth: 30
            }]
        }, {
            xtype: 'combobox',
            fieldLabel: i18n.get('Operator'),
            store: 'printingformsstat.Operators',
            name: 'oper_id',
            valueField: 'uid',
            displayField: 'name',
            anchor: '100%'
        }, {
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            items: [{
                xtype: 'combogrid1',
                alias: 'widget.accountgroupsgrid',
                name: 'user_group_id',
                width: 100,
                anchor: '100%',
                store: 'documenttemplates.AccountsGroups',
                fieldLabel: i18n.get('User group'),
                itemId: 'ugroupslist',
                labelWidth: 100,
                loadOnRender: false,
                valueField: 'group_id',
                displayField: 'name',
                columns: [{
                    header: i18n.get('ID'),
                    dataIndex: 'group_id',
                    width: 50
                }, {
                    header: i18n.get('Name'),
                    dataIndex: 'name',
                    flex: 1
                }, {
                    header: i18n.get('Description'),
                    dataIndex: 'descr',
                    flex: 2
                }]
            }]
        },
        {
            xtype: 'combo',
            name: 'searchtype',
            valueField: 'id',
            displayField: 'name',
            fieldLabel: i18n.get('Search'),
            anchor: '100%',
            value: 0,
            store: [
                [0, i18n.get('User')],
                [1, i18n.get('Agreement')],
                [2, i18n.get('Account login')]
            ]
        },
        {
            xtype: 'textfield',
            anchor: '100%',
            name: 'searchvalue',
            hideEmptyLabel: false
        }]
    }, {
        xtype: 'fieldset',
        defaults: {
            labelWidth: 80
        },
        title: i18n.get('Payment2'),
        items: [{
            xtype: 'radio',
            inputValue: -1,
            name: 'payed',
            fieldLabel: i18n.get('All'),
            itemId: 'allPayRadioEl',
            checked: true,
            boxLabel: '',
            anchor: '100%'
        }, 
        {
            xtype: 'fieldcontainer',
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            fieldLabel: i18n.get('Without pay'),
            items: [{
            xtype: 'radio',
                //fieldLabel: i18n.get('Without pay'),
                inputValue: 0,
                itemId: 'withoutpayRadioEl',
                name: 'payed',
                fieldLabel: '',
                boxLabel: ''
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            fieldLabel: i18n.get('Paid2'),
            items: [{
                xtype: 'radio',
                inputValue: 1,
                name: 'payed',
                fieldLabel: '',
                itemId: 'payedRadioEl',
                boxLabel: ''
            }, {
                xtype: 'datefield',
                width: 160,
                fieldLabel: i18n.get('Month'),
                disabled: true,
                name: 'pay_date',
                labelWidth: 40,
                margins: '0 0 0 5'
            }]
        }]
    }]
});

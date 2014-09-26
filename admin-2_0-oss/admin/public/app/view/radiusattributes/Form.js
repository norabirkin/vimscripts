Ext.define("OSS.view.radiusattributes.Form", {
    extend: 'Ext.form.Panel',
    alias: "widget.radiusattributes_form",
    itemId: 'attributsForm',
    region: 'east',
    split: true, 
    collapsible: false,
    minWidth: 500,
    width: 500,
    bodyPadding: 10,
    disabled: true,
    frame: true,
    items: [{
        xtype: 'fieldset',
        title: i18n.get('Properties'),                                
        autoScroll: true,
        defaults: {
            labelWidth: 160,
            anchor: '100%'
        },
        items: [{
            xtype: 'hidden',
            name: 'record_id'
        }, {
            xtype: 'textfield',
            name: 'description',
            allowBlank: false,
            fieldLabel: i18n.get('Description')
        }, {
            xtype: 'combo',
            name: 'id',
            fieldLabel: i18n.get('Agent'),
            editable: false,
            allowBlank: false,
            store: 'radiusattributes.RadiusAgents',
            valueField: 'id',
            displayField: 'descr'
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel:  i18n.get('Nas'),
            labelWidth: 160,
            items: [{
                xtype: 'combo',
                editable: false,
                name: 'nas_id',
                store: 'radiusattributes.RnasList',
                displayField: 'rnas',
                valueField: 'nas_id',
                disabled: true,
                flex: 1
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'combo',
                editable: false,
                name: 'dev_group_id',
                store: 'radiusattributes.DeviceGroups',
                displayField: 'name',
                valueField: 'group_id',
                flex: 1
            }]
        },
        {
            xtype: 'combo',
            fieldLabel: i18n.get('RADIUS Code'),
            allowBlank: false,
            value: 2,
            editable: false,
            name: 'radius_code',
            valueField: 'id',
            displayField: 'name',
            store: [
                [2, i18n.get('Access-Accept')],
                [3, i18n.get('Access-Reject')]
            ]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel:  i18n.get('Attribute'),
            allowBlank: false,
            labelWidth: 160,
            items: [{
                xtype: 'combo',
                editable: false,
                flex: 1,
                name: 'attr_id',
                allowBlank: false,
                valueField: 'record_id',
                displayField: 'name',
                store: 'radiusattributes.Dictionary'
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'numberfield',
                name: 'tag',
                disabled: true,
                width: 100
            }]
        }, {
            xtype: 'textarea',
            fieldLabel: i18n.get('Value'),
            name: 'value'
        }]
    }, {
        xtype: 'fieldset',
        title: i18n.get('Assigned to'),    
        autoScroll: true,
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            labelWidth: 0,
            items: [{
                xtype: 'radio',
                name: 'link',
                inputValue: '1',
                itemId: 'agentLink',
                width: 165,
                boxLabel: i18n.get('Agent') + ':'
            }, {
                xtype: 'textfield',
                name: 'service',
                disabled: true,
                flex: 1
            }, {
                xtype: 'tbspacer',
                width: 35
            },{
                xtype: 'checkbox',
                name: 'service_for_list',
                boxLabel: i18n.get('List'),
                disabled: true,
                width: 100
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            labelWidth: 0,
            items: [{
                xtype: 'radio',
                name: 'link',
                inputValue: '2',
                itemId: 'accountgroupLink',
                width: 165,
                boxLabel: i18n.get('Accounts group') + ':'
            }, {
                xtype: 'combo',
                name: 'group_id',
                editable: false,
                store: 'radiusattributes.AccountsGroups',
                allowBlank: false,
                valueField: 'group_id',
                displayField: 'name',
                disabled: true,
                flex: 1
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            labelWidth: 0,
            items: [{
                xtype: 'radio',
                name: 'link',
                inputValue: '3',
                itemId: 'tariffLink',
                width: 165,
                boxLabel: i18n.get('Tariff') + ':'
            }, {
                xtype: 'container',
                layout: 'fit',
                flex: 1,
                items:[{
                    xtype: 'tarcmbgrid',
                    allowBlank: false,
                    labelWidth: 0,
                    disabled: true,
                    fieldLabel: '',
                    loadOnRender: false,
                    name: 'tar_id'
                }]
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'combo',
                fieldLabel: i18n.get('Category'),
                editable: false,
                name: 'cat_idx',
                store: 'radiusattributes.Categories',
                valueField: 'cat_idx',
                disabled: true,
                displayField: 'descr',
                disabled: 'true',
                labelWidth: 70,
                flex: 1
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            labelWidth: 0,
            items: [{
                xtype: 'radio',
                name: 'link',
                inputValue: '4',
                itemId: 'accountLink',
                width: 165,
                boxLabel: i18n.get('Account') + ':'
            }, {
                xtype: 'container',
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype: 'vgroupscmbgrid',
                    loadOnRender: false,
                    disabled: true,
                    allowBlank: false,
                    name: 'vg_id',
                    labelWidth: 0
                }]
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            labelWidth: 0,
            items: [{
                xtype: 'radio',
                name: 'link',
                inputValue: '5',
                itemId: 'shapeLink',
                width: 165,
                boxLabel: i18n.get('Shape') + ':'
            }, {
                xtype: 'numberfield',
                allowDecimals: false,
                allowBlank: false,
                disabled: true,
                minValue: 1,
                name: 'shape',
                flex: 1
            }]
        }]
    }]
    
});
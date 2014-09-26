Ext.define('OSS.view.RadiusAttributes', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.radisuattributes',
    title: OSS.Localize.get("RADIUS-attributes"),
    frame: true,
    plain: true,
    layout: 'border',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: OSS.Localize.get( 'Operations' ),
            itemId: 'actions',
            menu:[{
                iconCls: 'x-ibtn-add',
                itemId: 'addBtn',
                text: OSS.Localize.get( 'Add new attrubute' )
            }, {
                iconCls: 'x-ibtn-save',
                itemId: 'saveBtn',
                disabled: true,
                text: OSS.Localize.get( 'Save' )
            }, {
                iconCls: 'x-ibtn-delete',
                itemId: 'deleteBtn',
                disabled: true,
                text: OSS.Localize.get( 'Delete' )
            }]
        }, '-',
        i18n.get('Type') + ':&nbsp;', 
        {
            xtype: 'combobox',
            width: 180,
            hideLabel: true,
            itemId: 'type',
            valueField: 'id',
            displayField: 'name',
            triggerAction: 'all',
            value: 0,
            mode: 'local',
            store: [
                [0, i18n.get('All')],
                [1, i18n.get('Agent')],
                [3, i18n.get('Tariff')],
                [5, i18n.get('Shape')],
                [2, i18n.get('Accounts groups')],
                [6, i18n.get('Accounts')]
            ]
        }, {
            xtype: 'searchtext',
            itemId: 'searchField',
            width: 200,
            parentContainerType: 'toolbar',
            searchButton: 'searchAttributes',
            hideLabel: true
        }, {
            xtype: 'button',
            iconCls: 'x-ibtn-search',
            itemId: 'searchAttributes',
            text: i18n.get('Show')
        }]
    }],
    items: [{
        xtype: 'radiusattributes_grid',
        region: 'center'
    }, {
        xtype: 'radiusattributes_form'
    }]
});

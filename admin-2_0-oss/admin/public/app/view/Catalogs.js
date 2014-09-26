Ext.define('OSS.view.Catalogs', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.osscatalogs',
    title: OSS.Localize.get( 'Catalogues' ),
    layout: { type: 'border' },
    initComponent: function() {
        this.tbar = [
            { 
                xtype: 'button', 
                text: OSS.Localize.get( 'Actions' ),
                itemId: 'actions', 
                menu: [
                    { text: OSS.Localize.get( 'New', 'catalogue' ), itemId: 'createBtn', iconCls: 'x-ibtn-add' },
                    { text: OSS.Localize.get( 'Delete' ), itemId: 'removeBtn', disabled: true, iconCls: 'x-ibtn-def-dis x-ibtn-delete' },
                    { text: OSS.Localize.get( "Zone classes" ), itemId: "classes" },
                    {
                        text: i18n.get('Clone catalog'),
                        itemId: 'clone',
                        disabled: true,
                        menu: {
                            xtype: 'dinamicmenu',
                            valueField: 'uid',
                            store: 'OperatorsList'
                        }
                    }
                ]
            },
            { xtype: 'tbseparator' },
            { 
                xtype: 'tbtext', 
                text: OSS.Localize.get( "Search" ), 
                style: {
                    padding: '0px 10px 0px 0px'
                }
            },
            Ext.create( "OSS.view.catalog.Types", {
                itemId: "types",
                fieldLabel: null,
                showAllTypesOption: true
            }),
            { xtype: 'textfield', itemId: "name", name: "text" },
            { xtype: 'button', text: OSS.Localize.get( 'Find' ), itemId: "searchBtn", iconCls: 'x-ibtn-search' }
        ];
        this.callParent( arguments );
    },
    items: [ { xtype: 'osscatalogstree' } ]
});

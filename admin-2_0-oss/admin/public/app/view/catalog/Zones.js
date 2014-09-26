Ext.define('OSS.view.catalog.Zones', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    region: "center",
    validity: null,
    initComponent: function() {
        this.addEvents({
            beforeaddtomainpanel: true
        });
        this.callParent();
    },
    newRecordParams: function() {
        return {
            catalog_id: this.getStore().proxy.extraParams[ "catalog_id" ]
        };
    },
    statics: {
        factory: function( type ) {
            switch (type) {
                case 1:
                    return Ext.widget('osscatalogipzones');
                    break;
                case 2:
                    return Ext.widget('osscatalogaszones');
                    break;
                case 3: 
                    return Ext.widget('osscatalogtelzones');
                    break;
                default: 
                    return null;
            }
        }
    },
    actions: [
        { itemId:"importBtn", text: OSS.Localize.get( 'Import' ) },
        { itemId:"exportBtn", text: OSS.Localize.get( 'Export' ) }
    ],
    addBtnText: OSS.Localize.get( 'New zone' ),
    tbar: [
        { xtype: 'tbseparator' }, 
        { 
            xtype: 'tbtext', 
            text: OSS.Localize.get( "Search" ), 
            style: {
                padding: '0px 10px 0px 0px'
            }
        },
        {
            xtype: 'combo',
            store: Ext.create('Ext.data.Store', {
                fields: ['text', 'name'],
                data: []
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'name'
        },
        { xtype: 'textfield', itemId: "searchText" },
        { xtype: 'button', text: OSS.Localize.get( 'Find' ), itemId: "searchBtn", iconCls: 'x-ibtn-search' }
    ],
    alias: 'widget.osscatalogzones',
    flex: 1
});

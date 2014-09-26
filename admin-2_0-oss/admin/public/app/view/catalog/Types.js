Ext.define("OSS.view.catalog.Types", {
    extend: 'Ext.form.ComboBox',
    name: 'type', 
    fieldLabel: OSS.Localize.get( 'Catalogue type' ),
    displayField: 'name',
    queryMode: 'local',
    valueField: 'id',
    showAllTypesOption: false,
    initComponent: function() {
        this.callParent();
        this.store = Ext.create("OSS.store.catalog.Types");
        if ( this.showAllTypesOption ) {
            this.store.add({name: OSS.Localize.get( "All" ), id: 0});
            this.setValue(0);
        }
        this.store.sort('id', 'ASC');
    }
});

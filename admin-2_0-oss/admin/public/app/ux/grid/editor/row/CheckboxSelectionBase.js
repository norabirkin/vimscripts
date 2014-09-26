/**
 * Редактор с чекбокс-выделением
 */
Ext.define('OSS.ux.grid.editor.row.CheckboxSelectionBase', {
    extend: "Ext.grid.Panel",
    requires: ['OSS.helpers.DeleteList'],
    
    confirmRemove: false,
    
    viewConfig: { markDirty : false },
    
    dontSelectRow: function() {
        var fn = function() {
            this.getSelectionModel().un( "beforeselect", fn, this );
            return false;
        };
        this.getSelectionModel().on( "beforeselect", fn, this );
    },
    columnClickCanInitRowEditing: function( column ) {
        return true;
    },
    dontEditIfCheckBoxColumnIsClicked: function( editor, options ) {
        if (options.column.dataIndex == "" || !this.columnClickCanInitRowEditing(options.column)) {
            return false;
        } else {
            this.dontSelectRow();
        }
    },
    addRowEditing: function() {
        if (!this.plugins) {
            this.plugins = [];
        }
        this.plugins.push( Ext.create( "Ext.grid.plugin.RowEditing", {
            ptype: "rowediting", 
            clicksToEdit: 2,
            saveBtnText: OSS.Localize.get( 'Update' ),
            cancelBtnText: OSS.Localize.get( 'Cancel' ),
            errorSummary: false
        }));
    },
    deleteNewItem: function( p1, options ) {
        var record = options.record;
        var store = options.store;
        if (record.getId() == 0) {
            store.remove(record);
        }
    },
    deleteConfirm: {
        title: i18n.get("Confirm items remove"), 
        msg: i18n.get("Do you realy want to remove items?")
    },
    removeItems: function( button ) {
        Ext.create('OSS.helpers.DeleteList', {
            panel: this,
            confirmation: this.confirmRemove ? this.deleteConfirm : null
        }).run();
    },
    newRecordParams: function() {
        return {};
    },
    onNewNodeCreated: function( node ) {
    },
    addItemForRowEditing: function() {
        var store = this.getStore();
        var node = new store.model( this.newRecordParams() );
        this.onNewNodeCreated( node );
        store.add( node );
        var row = this.getView().getNode( node );
        var col = Ext.get( row ).child("td:nth-child(2)");
        col.fireEvent("dblclick");
    },
    saveItem: function() {
        var record = arguments[0].context.record;
        this.getStore().sync({ scope: this, callback: function() {
            this.fireEvent( "itemsaved" );
            this.getStore().reload({
                force: true
            });
            this.fireEvent('aftersave', record, this);
        }});
    },
    setRemoveBtnState: function( component, selections ) {
        this.removeBtn.setDisabled( selections.length == 0 );
        this.removeBtn.setIconCls( selections.length == 0 ? 'x-ibtn-def-dis x-ibtn-delete' : 'x-ibtn-def x-ibtn-delete' );
    },
    initComponent: function() {
        var store = this.store;
        if (typeof store == "string") {
            store = Ext.data.StoreManager.lookup(store);
        }
        this.addRowEditing();
        this.initGridSettings();
        this.selModel = Ext.create("Ext.selection.CheckboxModel", { checkOnly: true });
        this.on( "beforeedit", this.dontEditIfCheckBoxColumnIsClicked, this );
        this.on( "edit", this.saveItem, this);
        this.on( "canceledit", this.deleteNewItem, this );
        this.callParent();
    },
    initGridSettings: function() {
    },
    onRemoveButtonClick: function() {
        this.removeItems();
    }
});

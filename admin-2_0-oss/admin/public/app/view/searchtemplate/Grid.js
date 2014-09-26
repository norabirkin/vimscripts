Ext.define('OSS.view.searchtemplate.Grid', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    getParametersStore: function() { throw 'define getParametersStore'; },
    getConditionsStore: function() { throw 'define getConditionsStore'; },
    getLogicStore: function() { throw 'define getLogicStore'; },
    defaultLogic: null,
    initComponent: function() {
        this.columnStores = {
            parameters: this.getParametersStore(),
            conditions: this.getConditionsStore(),
            logic: this.getLogicStore()
        };
        this.valueColumn = Ext.create('Ext.grid.column.Column', {
            dataIndex: 'value', 
            sortable: false, 
            header: OSS.Localize.get('Value'), 
            flex: 1, 
            editor: { xtype: "textfield" },
            renderer: Ext.bind(this.valueRenderer, this)
        });
        this.parametersEditor = Ext.create( 'Ext.form.field.ComboBox', {
            displayField: "descr",
            valueField: 'name',
            queryMode: "local",
            store: this.columnStores.parameters
        });
        this.columns = [
            {
                dataIndex: 'parameter', 
                sortable: false,
                header: OSS.Localize.get('Parameter'), 
                flex: 1,
                renderer: function( value ) {
                    var record = this.columnStores.parameters.findRecord( "name", value );
                    if (!record) {
                        return value;
                    }
                    return record.get( "descr" );
                },
                editor: this.parametersEditor
            },
            {
                dataIndex: 'condition', 
                sortable: false,
                header: OSS.Localize.get('Condition'), 
                flex: 1,
                renderer: function( value ) {
                    return this.columnStores.conditions.findRecord( "name", value ).get( "descr" );
                },
                editor: {
                    xtype: "combobox",
                    displayField: "descr",
                    valueField: 'name',
                    queryMode: "local",
                    store: this.columnStores.conditions
                }
            },
            this.valueColumn,
            { 
                dataIndex: 'logic', 
                sortable: false,
                header: OSS.Localize.get('Logic'), 
                flex: 1,
                renderer: function( value ) {
                    var record;
                    if (!value || value == "") {
                        value = "none";
                    }
                    record = this.columnStores.logic.findRecord( "name", value );
                    if (!record) {
                        return value;
                    }
                    return record.get( "descr" );
                },
                editor: {
                    xtype: "combobox",
                    displayField: "descr",
                    value: this.defaultLogic,
                    valueField: 'name',
                    queryMode: "local",
                    store: this.columnStores.logic
                }
            }
        ];
        this.callParent( arguments );
    },
    valueRenderer: function( value ) {
        return value;
    },
    removeItems: function() {
        me = this;
        this.getSelectionModel().selected.each(function( record ){
            me.getStore().remove( record );
        });
    },
    saveItem: function() {
        this.getStore().data.each(function( record ) {
            record.isNewRecord = false;
        });
        return true;
    },
    deleteNewItem: function( p1, options ) {
        var record = options.record;
        var store = options.store;
        if ("isNewRecord" in record && record.isNewRecord == true) {
            store.remove(record);
        }
    },
    onNewNodeCreated: function( node ) {
        node.isNewRecord = true;
    }
});

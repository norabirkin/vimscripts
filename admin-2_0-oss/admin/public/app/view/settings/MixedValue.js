Ext.define( "OSS.view.settings.MixedValue", {
    extend: "Ext.grid.column.Column",
    
    requires: [
        'OSS.ux.grid.column.Renderer',
        'OSS.ux.form.field.date.Month'
    ],
    
    alias: "widget.settings.mixedvalue",
    header: i18n.get( 'Value' ),
    dataIndex: 'value',
    flex: 1,
    
    editor: {
        xtype: 'textfield'
    },
    
    getListSettingsStore: function( name ) {
        var store = this.settingTypes.list.stores[name];
        if (typeof store == "string") {
            return Ext.data.StoreManager.lookup(store);
        } else {
            return store;
        }
    },
    
    getListSettingsCombo: function( record ) {
        var name = record.get('name'),
            store = this.getListSettingsStore( name ),
            idx;
        
        if((idx = store.find('id', record.get( "value" ))) < 0) {
            store.add( { name: record.get("valuedescr"), id: record.get( "value" ) } );
        }
        
        var combo = this.createField("Ext.form.field.ComboBox", {
            editable: false,
            queryMode: 'remote',
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'id',
            store: store,
            listeners: {
                select: function(combo, records) {                              
                    record.set('valuedescr', records[0].get('name'));
                }
            }
        });
        return combo;
    },
    
    onCheckboxClick: function( record ) {
        var value = record.get("value") == '1' ? '' : '1';
        record.set( "value", value ); 
        this.onCellEdit( record );
    },
    
    createField: function( classname, __config ) {
        var config = __config || {};
        if (this.validator) {
            config.validator = this.validator;
        }
        return Ext.create( classname, config );
    },
    
    settingTypes: {
        bool: {
            onBeforeEdit: function( editor, event ) {
                return false;
            },
            renderer: function(value, metadata, record) {
                return OSS.ux.grid.column.Renderer.render(value);
            }
        },
        month: {
            onBeforeEdit: function( editor, event ) {
                event.column.setEditor(Ext.create('OSS.ux.form.field.date.Month'));    
            },
            renderer: function(value, metadata, record) {
                return Ext.Date.format(Ext.Date.parse(value, 'Y-m-d'), 'F Y');   
            },
            processValue: function(value) {
                return Ext.Date.format(value, 'Y-m-01');
            }
        },
        text: {
            onBeforeEdit: function( editor, event ) {
                event.column.setEditor( event.column.createField( "Ext.form.field.Text" ) );    
            },
            renderer: function(value, metadata, record) {
                return value;   
            }
        },
        numeric: {
            limits: {
                cerber_port: {
                    minValue: 1,
                    maxValue: 65555
                }   
            },
            onBeforeEdit: function( editor, event ) {
                var limits = event.column.settingTypes.numeric.limits[ event.record.get( "name" ) ];
                var config = {};
                if ( limits ) {
                    if (limits.minValue) {
                        config.minValue = limits.minValue;
                    }
                    if (limits.maxValue) {
                        config.maxValue = limits.maxValue;
                    }
                }
                event.column.setEditor( event.column.createField( "Ext.form.field.Number", config ) );  
            },
            renderer: function(value, metadata, record) {
                return value;   
            }
        },
        list: {
            stores: {
                default_operator: 'Settings.Operators', 
                default_country: 'Settings.Countries', 
                default_legal: 'Settings.Documents',
                default_physical: 'Settings.Documents',
                export_character: Ext.create( "Ext.data.Store", {
                    fields: [
                        { name: "name", type: "string" },
                        { name: "id", type: "string" }
                    ],
                    data: [
                        { name: "UTF-8", id: "UTF-8" }, 
                        { name: "CP1251", id: "CP1251" },
                        { name: "KOI8-R", id: "KOI8-R" }
                    ]
                })
            },
            onBeforeEdit: function( editor, event ) {
                event.column.setEditor( event.column.getListSettingsCombo( event.record ) );    
            },
            renderer: function(value, metadata, record) {
                return record.get( "valuedescr" ) ? record.get( "valuedescr" ) : record.get( "value" ) ;
            }
        }
    },
    
    listeners: {
        render: function() {
            var grid = this.up("gridpanel");
            grid.on( "beforeedit", function( editor, event ) {
                return event.column.settingTypes[ event.record.get( "type" ) ].onBeforeEdit( editor, event );
            },grid);
            grid.on( "edit",  function( editor, event ) {
                if (event.column.settingTypes[ event.record.get( "type" ) ].processValue) {
                    event.record.set(
                        'value',
                        event.column.settingTypes[ event.record.get( "type" ) ].processValue(event.value)
                    );
                }
                event.column.onCellEdit( event.record );
            },grid);
        },
        click: function( p1, p2, p3, p4, p5, record ) {
            if (record.get("type") == "bool") {
                this.onCheckboxClick(record);
            }
        }   
    },
    
    onCellEdit: function(record) {
        record.save({
            url: Ext.Ajax.getRestUrl('api', 'settings', 'update'),
            success: Ext.bind(Ext.app.Application.instance.getController('Settings').onSettingSave, Ext.app.Application.instance.getController('Settings'))
        });
    },
    
    defaultRenderer: function( value, metadata, record ){
        return this.settingTypes[ record.get( "type" ) ].renderer( value, metadata, record );
    }
});

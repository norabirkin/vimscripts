Ext.define( 'OSS.view.users.searchtemplate.Grid', {
    extend: 'OSS.view.searchtemplate.Grid',
    height: 500,
    defaultActions: function() {
        return [{
            text: i18n.get('Save'),
            disabled: true,
            itemId: 'save',
            iconCls: 'x-ibtn-save'
        }, {
            text: i18n.get('Apply'),
            disabled: true,
            itemId: 'apply'
        }].concat(this.callParent(arguments));
    },
    defaultLogic: 'OR',
    saveItem: function() {
        this.callParent(arguments);
        this.enableButtons();
    },
    enableButtons: function() {
        this.down('toolbar > #actions > menu > #save').enable();
        this.down('toolbar > #actions > menu > #apply').enable();
    },
    disableButtons: function() {
        this.down('toolbar > #actions > menu > #save').disable();
        this.down('toolbar > #actions > menu > #apply').disable();
    },
    removeItems: function( button ) {
        this.callParent(arguments);
        if ((typeof button == 'string') && button != "yes") {
            return;
        }
        if (this.getStore().getCount() === 0) {
            this.disableButtons();
        }
    },
    initComponent: function() {
        this.store = Ext.create('OSS.store.searchtemplates.Grid');
        this.valueStores = {
            relation: {
                'accounts.type': 'OSS.store.users.searchtemplates.Types',
                'agreements.balance_status': 'OSS.store.users.searchtemplates.Deptors',
                'vgroups.id': 'OSS.store.users.searchtemplates.Modules',
                'vgroups.blocked': 'OSS.store.users.searchtemplates.Blocking',
                'vgroups.tar_id': 'OSS.store.users.searchtemplates.Tariffs',
                'vgroups.archive': 'OSS.store.users.searchtemplates.Archive',
                'currency.id': 'OSS.store.users.searchtemplates.Currencies',
                'agreements.oper_id': 'OSS.store.users.searchtemplates.Operators',
                'agreements_groups': 'OSS.store.users.searchtemplates.AgrmGroups'
            },
            data: {}
        };
        this.getParametersStore = function() { return Ext.create( 'OSS.store.users.searchtemplates.Parameters' ); };
        this.getConditionsStore = function() { return Ext.create( 'OSS.store.users.searchtemplates.Conditions' ); };
        this.getLogicStore = function() { return Ext.create( 'OSS.store.users.searchtemplates.Logic' ); };
        this.callParent( arguments );
        this.loadParameters();
        this.on( 'beforeedit', this.onEditStarted, this );
        this.parametersEditor.on( 'change', this.onParameterChanged, this );
    },
    tbar: [{ 
        xtype: 'textfield', 
        labelWidth: 70,
        fieldLabel: OSS.Localize.get('Title'), 
        value: OSS.Localize.get('Search template'),
        name: 'tpl_name' 
    }],
    doGetTemplates: function() {
        var i;
        this.store.removeAll();
        this.templatesTmp = [];
        this.storesLoaded = [];
        if (!this.combo) {
            return;
        }
        this.getView().loadMask.show();
        this.combo.eachRule( this.addTemplate, this);
        if (this.storesLoaded.length == 0) {
            this.onAllStoresLoaded();
        } else {
            for (i = 0; i < this.storesLoaded.length; i ++) {
                this.loadValueStore(this.storesLoaded[i]);
            }
        }
        if (this.getStore().getCount() > 0) {
            this.enableButtons();
        } else {
            this.disableButtons();
        }
    },
    getTemplates: function() {
        var func;
        if (this.addonsLoaded) {
            this.doGetTemplates();
        } else { 
            func = function() {
                this.doGetTemplates();
                this.getAccountAddonsStore().un('load', func, this);
            };
            this.getAccountAddonsStore().on('load', func, this);
        }
    },
    onValueStoreLoaded: function( store ) {
        var i,
            allstoresloaded = true;
        store.isLoaded = true;
        for (i = 0; i < this.storesLoaded.length; i ++) {
            if (!this.storesLoaded[i].isLoaded) { 
                allstoresloaded = false; break; 
            }
        }
        if (allstoresloaded) {
            this.onAllStoresLoaded();
        }
    },
    loadValueStore: function( store ) {
        store.load({
            callback: Ext.bind(this.onValueStoreLoaded, this, [store])
        }); 
    },
    onAllStoresLoaded: function() {
        this.getView().loadMask.hide();
        this.store.add( this.templatesTmp );
    },
    storeShouldBeLoaded: function( store ) {
        return store && store.proxy.type != 'memory' && store.getCount() === 0;
    },
    addValueStore: function( parameter ) {
        var store = this.getValueStore( parameter );
        if (this.storeShouldBeLoaded(store)) {
            this.storesLoaded.push(store);
        }
    },
    addTemplate: function( rule ) {
        var parameter = rule.table_name + '.' + rule.field;
        this.addValueStore( parameter );
        this.templatesTmp.push({
            parameter: parameter,
            value: rule.value,
            condition: rule.condition,
            logic: rule.logic
        });
    },
    getRequestData: function( record ) {
        var parameter = record.get( 'parameter' ).split('.');
        var result = {
            table_name: parameter[0],
            field: parameter[1],
            value: record.get('value'),
            condition: record.get('condition'),
            logic: (record.get('logic') == 'none') ? '' : record.get('logic')
        };
        return result;
    },
    getConditionsArray: function() {
        var data = [];
        if ( this.store.getCount() > 0 ) {
            this.store.data.each(function( record ) {
                data.push( this.getRequestData(record) );
            }, this);
            return data;
        } else {
            return null;
        }
    },
    valueRenderer: function( value ) {
        var row = arguments[2],
            store = this.getValueStore( row.get('parameter') ),
            record;
        if (!store) {
            return value;
        }
        record = store.findRecord( 'id', value, 0, false, true, true );
        if (!record) {
            return value;
        }
        return record.get( 'name' );
    },
    getAccountAddonsStore: function() {
        if (!this.accountAddonsStore) {
            this.accountAddonsStore = Ext.create('OSS.store.users.searchtemplates.AccountsAddons');
        }
        return this.accountAddonsStore;
    },
    addRelation: function( record ) {
        var values = Ext.JSON.decode( record.get('values') ),
            i;
        this.valueStores.relation[ record.get('name') ] = true;
        this.valueStores.data[ record.get('name') ] = Ext.create( 'Ext.data.Store', {
            fields: [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' }
            ]
        });
        for (i = 0; i < values.length; i ++) { 
            this.valueStores.data[ record.get('name') ].add({ 
                id: values[i].idx, 
                name: values[i].value 
            }); 
        }
    },
    loadParameters: function() {
        this.getAccountAddonsStore().load({
            callback: function( records ) {
                for (var i = 0; i < records.length; i ++) {
                    this.columnStores.parameters.add( records[i] );
                    if (records[i].get('values') !== '') {
                        this.addRelation(records[i]);
                    }
                }
                this.addonsLoaded = true;
            },
            scope: this
        });
    },
    onEditStarted: function() {
        this.setValueEditor( arguments[1].record.get('parameter') );
    },
    onParameterChanged: function() {
        this.setValueEditor( arguments[1] );
    },
    getValueStore: function( key ) {
        var classname = this.valueStores.relation[key];
        if ( classname ) {
            if (!this.valueStores.data[key]) {
                this.valueStores.data[key] = Ext.create(classname);
            }
            return this.valueStores.data[key];
        } else {
            return null;
        }
    },
    setValueEditor: function( key ) {
        var editor,
            store = this.getValueStore( key );
        if ( store ) {
            editor = Ext.create( 'Ext.form.field.ComboBox', {
               displayField: 'name',
               valueField: 'id',
               store:  store,
               queryMode: 'local',
               typeAhead: true
            });
        } else {
            editor = Ext.create('Ext.form.field.Text');
        }
        if ( this.storeShouldBeLoaded(store) ) {
            this.valueColumn.getEditor().disable();
            store.load({
                callback: function() {
                    this.valueColumn.setEditor(editor);
                },
                scope: this
            }); 
        } else {
            this.valueColumn.setEditor(editor);
        }
    }
});

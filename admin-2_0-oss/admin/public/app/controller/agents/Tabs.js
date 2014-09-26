/**
 * Comment for this file
 */
Ext.define( 'OSS.controller.agents.Tabs', {
    extend: 'Ext.app.Controller',
    views: [],
    stores: [],

    refs: [{
        selector: 'agents',
        ref: 'mainPanel'
    },{
        selector: 'agents > tabpanel > #common > #type_and_description > combobox',
        ref: 'typeCombo'
    },{
        selector: 'agents > tabpanel',
        ref: 'tabs'
    },{
        selector: 'agents > tabpanel > #common',
        ref: 'commonSettingsForm'
    }],

    init: function() {
        this.specificSettings = Ext.create( "OSS.helpers.agents.SpecificSettings" );
        this.control({
            'agents > gridpanel #edit': {
                click: this.onEditButtonClicked
            },
            'agents > gridpanel > toolbar > #actions > menu > #create': {
                click: this.onCreateAgentButtonClicked
            },
            'agents > tabpanel > panel > toolbar > #actions > menu > #finish': {
                click: this.submitData
            },
            'agents > tabpanel': {
                tabchange: this.onTabChange
            },
            "agents > tabpanel > #common": {
                render: this.watchCommonSettingsChanging
            },
            "agents > tabpanel > form": {
                formvaluechanged: this.formValueChanged
            }
        });
    },

    agent: {},
    editMode: false,
    dontHandleCommonSettingsChanging: false,

    param: function( name ) {
        return this.agent[ name ];
    },

    formValueChanged: function( step, valid ) {
        if (valid) {
            this.enableTabs( step );
        } else {
            this.disableTabs( step );
        }
    },
    
    getSaveButton: function() {
        return Ext.ComponentQuery.query('agents > tabpanel > panel > toolbar > #actions > menu > #finish');
    },

    enableSaveButton: function() {
        var buttons = this.getSaveButton(),
            i;
        for (i = 0; i < buttons.length; i ++) {
            buttons[i].enable();
        }
    },

    disableSaveButton: function() {
        var buttons = this.getSaveButton(),
            i;
        for (i = 0; i < buttons.length; i ++) {
            buttons[i].disable();
        }
    },

    watchCommonSettingsChanging: function() {
        var fields = this.getCommonSettingsForm().query( "field" );
        for (var i = 0; i < fields.length; i ++) {
            fields[i].on( "change", function( field, newValue, oldValue ) {
                if (this.dontHandleCommonSettingsChanging) {
                    return;
                }
                var valid = this.getCommonSettingsForm().getForm().isValid();
                if ( this.getCommonSettingsForm().lastValidation !== valid ) { 
                    this.getCommonSettingsForm().lastValidation = valid;
                    if (valid) {
                        this.enableTabs(0);
                    } else { 
                        this.disableTabs(0); 
                        this.disableSaveButton();
                    }
                }
                var name = field.getName();
                var value = field.getValue();
                this.agent[ name ] = value;
                if (name == "type") {
                    this.rebuildTabs();
                }
            }, this);
        }
    },

    enableTabs: function( step ) {
        var count = 0;
        this.getTabs().items.each( function( tab ) {
            count ++;
            if ( tab.step == (step + 1) ) { 
                tab.enable(); 
                tab.fireEvent( "tabenable" );
            }
        });
        if (count == 1) {
            this.enableSaveButton();
        }
    },

    disableTabs: function( step ) {
        this.getTabs().items.each( function( tab ) {
            if (tab.step > step) {
                tab.disable();
            }
        });
    },

    setAgent: function( record ) {
        this.originalAgent = Ext.apply({}, record.data);
        this.agent = {};
        Ext.apply( this.agent, record.data );
        this.setCommonSettingsFormValues();
        this.rebuildTabs();
    },

    /**
     * Проверяет были ли изменены какие-либо параметры агента
     */
    isDirty: function() {
        var dirty = false;
        Ext.Object.each(this.agent, function(k, v) {
            var original = this.originalAgent[k];
            if (typeof original == 'undefined') {
                return;
            }
            if (String(original) !== String(v)) {
                dirty = true;
            }
        }, this);
        return dirty;
    },
    
    onEditButtonClicked: function() {
        this.editMode = true;
        this.setAgent( arguments[5] );
    },

    onCreateAgentButtonClicked: function() {
        this.editMode = false;
        this.setAgent(this.newAgentRecord());
    },

    newAgentRecord: function() {
        var record =  Ext.create('OSS.model.Agent'),
            store = this.getController('Agents').getAgentsTypesStore();
        store.load();
        if (store.findExact('id', record.get('type')) == -1) {
            record.set('type', store.getAt(0).get('id'));
        }
        return record;
    },

    setCommonSettingsFormValues: function() {
        this.dontHandleCommonSettingsChanging = true;
        this.getCommonSettingsForm().getForm().setValues( this.agent );
        this.dontHandleCommonSettingsChanging = false;
    },

    rebuildTabs: function() {
        var beforetabsrebuild = { go_on: true, delegateBack: Ext.bind( this.doRebuildTabs, this ) };
        this.getController('Agents').beforeTabsRebuild( beforetabsrebuild );
        if (beforetabsrebuild.go_on) {
            this.doRebuildTabs();
        }
    },

    doRebuildTabs: function() {
        this.getMainPanel().getLayout().setActiveItem(1);
        this.removeTabs();
        this.addTabs();
    },
    
    removeTabs: function() {
        this.getTabs().items.each( function( tab ) {
            if (tab.getItemId() != "common") {
                this.getTabs().remove(tab);
            }
        }, this);
    },

    addTabs: function() {
        var validate = { valid: this.getCommonSettingsForm().getForm().isValid(), step: 0 };
        this.specificSettings.tabs( this.param("type"), this.editMode ).each( function(panel) {
            if (this.editMode) {
                panel.fireEvent( "editagent", this.agent, validate );
            } else {
                panel.fireEvent( "createagent", this.agent, validate );
            }
            this.getTabs().add( panel );
            if (!validate.valid && validate.step < panel.step) {
                panel.disable();
            }
            panel.fireEvent( "addedtotabs", panel, this.agent );
        }, this);
    },

    onTabChange: function() {
        arguments[1].fireEvent( "tabactivated", this.agent );
    },

    deleteIdPropertyIfNeccesary: function() {
        var data;
        if (this.agent.id) {
            return this.agent;
        }
        data = Ext.apply({}, this.agent);
        delete(data.id);
        return data;
    },

    submitData: function() {
        this.addAgentOptionsData();
        this.getTabs().items.each( function(tab) { tab.fireEvent( "finishediting" ); });
        Ext.create( 'OSS.model.Agent', this.deleteIdPropertyIfNeccesary(this.agent) ).save({
            scope: this,
            msg: i18n.get('Agent was successfully saved'),
            callback: this.onAgentSave
        });
    },

    onAgentSave: function( record, operation ) {
        if ( !this.editMode ) {
            var id = Ext.JSON.decode( operation.response.responseText ).results;
            record.set( "id", id );
            this.onEditButtonClicked( null, null, null, null, null, record );
        } else {
            this.getMainPanel().getLayout().setActiveItem(0);
        }
        this.getMainPanel().down("gridpanel").getStore().reload();
        OSS.component.StoreValidity.setInvalid('agents');
        this.getController('Tariffs').isDtvAgentExists = null;
    }, 

    addAgentOptionsData: function() {
        var fields = this.specificSettings.optionsFields[ this.param("type") ];
        if (!fields) {
            return;
        }
        var options = {};
        var hasOptions = false;
        for (var i = 0; i < fields.length; i ++) {
            if ( this.param(fields[i]) !== undefined ) { 
                hasOptions = true;
                options[fields[ i ]] = this.param( fields[i] ); 
            }
        }
        if (hasOptions) {
            this.agent.options = Ext.JSON.encode(options);
        }
    }
});

Ext.define("OSS.controller.Agents", {
    extend: 'Ext.app.Controller',
    
    requires: [
        'Ext.form.*',
        'Ext.grid.*',
        'Ext.tab.*',
        'OSS.helpers.agents.*',
        'OSS.controller.agents.*'
    ],

    views: [
        'agents.Platforms',
        'agents.FormTabBase',
        'agents.Toolbar',
        'Agents',
        'agents.common.KeepDetail',
        'agents.*',
        'agents.internet.*',
        'agents.internet.Interfaces',
        'agents.internet.NetworkManagement',
        'agents.internet.radius.Nas',
        'agents.internet.radius.Dictionary',
        'agents.phone.Replaces'
    ],
    
    view: 'Agents',
    
    stores: [
        'agents.Platforms',
        'Agents',
        'agents.Types',
        'agents.internet.IgnoreNetworks',
        'agents.internet.Interfaces',
        'agents.internet.radius.EmulateAgents', 
        'agents.internet.NetworkManagement',
        'agents.internet.Vlans',
        'agents.internet.rnas.Combo',
        'agents.internet.Devicegroups',
        'agents.internet.radius.Rnas',
        'agents.internet.Rnas',
        'agents.internet.radius.Attributes',
        'agents.dictionary.Types',
        'agents.dictionary.Combo',
        'agents.internet.IPAndPrefixSize',
        'agents.phone.BillingMediation',
        'agents.phone.Replaces',
        'agents.phone.ReplaceWhatDescrs'
    ],
    
    refs: [{
        selector: 'agents',
        ref: 'mainPanel'
        },{
        selector: 'agents > tabpanel > #common > #options > #timeout',
        ref: 'timeoutCombo'
    },{
        selector: 'agents > tabpanel > #dictionary > #rnas',
        ref: 'rnasMenu'
    },{
        selector: 'form > fieldset > numberfield[name=l_trim]',
        ref: 'ltrimField'
    },{
        selector: 'form > fieldset > textfield[name=old_number]',
        ref: 'oldnumberField'
    },{
        selector: 'agents > tabpanel > #segments > toolbar > #searchField',
        ref: 'segmentsSearchCombo'
    },{
        selector: 'agents > tabpanel > #segments > toolbar > #ip',
        ref: 'ipSearchField'
    },{
        selector: 'agents > tabpanel > #segments > toolbar > #vlan',
        ref: 'vlanSearchField'
    },{
        selector: 'agents > tabpanel > #segments',
        ref: 'segmentsGrid'
    },{
        selector: 'agents > tabpanel > #radius',
        ref: 'radiusSettings'
    },{
        selector: 'agents > tabpanel > #nas > toolbar > #ip',
        ref: 'nasIPSearchField'
    },{
        selector: 'agents > tabpanel > #radius > toolbar > #ip',
        ref: 'nasIPSearchField'
    },{
        selector: 'agents > tabpanel > #radius > #dhcp',
        ref: 'DHCPFieldset'
    }, {
        selector: 'agents > tabpanel > #nas > toolbar > #actions > menu > #removeDevice',
        ref: 'nasRemoveDevice'
    }, {
        selector: 'agents > tabpanel > #nas > toolbar > #actions > menu > #addDevice',
        ref: 'nasAddDevice'
    }, {
        selector: 'agents > tabpanel > #nas',
        ref: 'nasTab'
    }, {
        selector: 'agents > tabpanel > #dictionary',
        ref: 'radiusAttributesDictionary'
    }, {
        selector: 'agents > tabpanel > #platforms',
        ref: 'platforms'
    }],
        
    init: function() {
        this.tabsController = this.getController( 'OSS.controller.agents.Tabs' );
        this.control({
            'agents': {
                render: this.loadAgents
            },
            'agents > tabpanel > panel > toolbar > #back': {
                click: this.activateListCard
            },
            'agents > gridpanel': {
                typecolrender: this.getTypeDescription
            },
            'agents > gridpanel #remove': {
                click: this.removeAgent
            },
            'form > fieldset > #group_substitution': {
                change: this.enableLtrimField
            },
            'agents > tabpanel > #segments > toolbar > #find': {
                click: this.findSegments
            },
            'agents > tabpanel > #segments > toolbar > #searchField': {
                change: this.changeSegmentSearchField,
                specialkey: this.applyFilterOnEnterPressed
            },
            'agents > tabpanel > #segments > toolbar > #ip': {
                specialkey: this.applyFilterOnEnterPressed
            },
            'agents > tabpanel > #segments > toolbar > #vlan': {
                specialkey: this.applyFilterOnEnterPressed
            },
            'agents > tabpanel > #nas > toolbar > #ip': {
                specialkey: this.applyNasFilterOnEnterPressed
            },
            'agents > tabpanel > #radius > fieldset > textfield[name=dhcpd_port]': {
                blur: this.showOrHideDHCPSettings
            },
            'agents > tabpanel > #segments': {
                itemedit: this.setComboValues,
                valuesset: this.loadRnasComboStore,
                itemsave: this.setIPMask,
                addedtotabs: this.onSegmentsGridAddedToTabs,
                beforewindowshow: this.loadRnasStoreIfNeccessary,
                tabactivated: this.loadSegmentsStore
            },
            'agents > tabpanel > #radius > fieldset > container > combobox[name=remulate_on_naid]': {
                beforequery: this.onEmulationClick,
                change: this.onEmulationModeChanded
            },
            'agents > tabpanel > #radius > fieldset > container > checkbox[name=raddrpool]': {
                change: this.setBindedToRaddrpoolCheckboxesState
            },
            'agents > tabpanel > #radius': {
                addedtotabs: this.onRadiusSettingsAddedToTabs,
                optionsloaded: this.showOrHideDHCPSettings
            },
            'agents > tabpanel > #nas': {
                tabactivated: this.loadRnasStore,
                addedtotabs: this.setRnasExtraParams,
                itemsaved: this.setRadiusDictionaryNasMenuDataInvalid,
                itemsremoved: this.setRadiusDictionaryNasMenuDataInvalid,
                selectionchange: this.onNasSelectionChange
            },
            'agents > tabpanel > #nas > toolbar > #find': {
                click: this.findNasByIP
            },
            'agents > tabpanel > #dictionary': {
                addedtotabs: this.loadRnasComboStore,
                tabactivated: this.radiusDictionaryTabActivated
            },
            'agents > tabpanel > #dictionary > #rnas': {
                afterrender: this.selectFirstItemInRnasMenu,
                select: this.loadDictionary
            },
            'agents > tabpanel > #dictionary > #attributes': {
                newitemcreated: this.onNewAttributeCreating,
                rendertypecol: this.renderTypeCol,
                beforeitemedit: this.buildReplaceRadiusAttributeComboStore,
                render: this.radiusAttributesRender
            },
            'agents > tabpanel > #phonereplaces': {
                addedtotabs: this.setPhoneReplacesExtraParams,
                tabactivated: this.loadPhoneReplacesStores,
                finishediting: this.savePhoneFilter
            },
            'agents > tabpanel > #platforms': {
                addedtotabs: this.setPlatformParams,
                tabactivated: this.loadPlatforms
            },
            'agents > tabpanel > #phonereplaces > grid_with_edit_window': {
                replacewhatcolumnrender: this.getReplaceWhatDescr,
                itemedit: this.checkGroupSubstitution
            },
            'agents > tabpanel > #nas > toolbar > #actions > menu > #removeDevice': {
                click: 'nasRemoveDevice'
            },
            'agents > tabpanel > #nas > toolbar > #actions > menu > #addDevice': {
                click: 'nasAddDevice'
            }
        });
    },

    tabsController: null,
    dictionaryComboLoaded: false,

    param: function( name ) {
        return this.tabsController.agent[ name ];
    },

    setPlatformParams: function() {
        this.getPlatforms().getStore().addExtraParams({
            agent_id: this.param('id')
        });
    },

    loadPlatforms: function() {
        this.getPlatforms().getStore().load();
    },

    radiusAttributesRender: function(grid) {
        grid.addToolbar(this.getRadiusAttributesDictionary());
    },

    onNasDevicesChange: function() {
        this.getAgentsInternetRnasStore().reload({
            callback: this.onNasSelectionChange,
            scope: this
        });
    },

    onNasSelectionChange: function() {
        var selection = this.getNasTab().getSelectionModel().getSelection(),
            store = this.getNasTab().getStore(),
            record,
            index;
        if (selection.length == 1) {
            record = selection[0];
            index = store.findExact('id', record.get('id'));
            if (index != -1) {
                record = store.getAt(index);
            }
        }
        if (record) {
            this.getNasRemoveDevice()[record.get('device_id') > 0 ? 'enable' :  'disable']();
            this.getNasAddDevice()[record.get('device_id') > 0 ? 'disable' :  'enable']();
        } else {
            this.getNasRemoveDevice().disable();
            this.getNasAddDevice().disable();
        }
    },

    nasRemoveDevice: function() {
        var record = this.getNasTab().getSelectionModel().getSelection()[0];
        ajax.request({
            url: 'rnas/removedevice',
            params: {
                id: record.get('id')
            },
            scope: this,
            confirmation: i18n.get('Do you realy want to remove device'),
            success: this.onNasDevicesChange
        });
    },

    nasAddDevice: function() {
        var record = this.getNasTab().getSelectionModel().getSelection()[0];
        ajax.request({
            url: 'rnas/adddevice',
            params: {
                id: record.get('id'),
                ip: record.get('rnas')
            },
            scope: this,
            success: this.onNasDevicesChange
        });
    },

    removeAgent: function() {
        var record = arguments[5];
        if (record.get("vgroups") > 0) {
            return;
        }
        var win = Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Do you really want to remove selected agent" ) + '?',
            function( button ) {
                if (button != "yes") {
                    return;
                }
                record.destroy({
                    scope: this,
                    callback: function() {
                        this.getAgentsStore().reload();
                        OSS.component.StoreValidity.setInvalid('agents');
                        this.getController('Tariffs').isDtvAgentExists = null;
                    }
                });
            },
            this
        );
    },

    savePhoneFilter: function() {
        var result = [];
        this.getAgentsPhoneBillingMediationStore().data.each(function( record ){
            result.push( record.data );
        }, this);
        var filter = Ext.JSON.encode( result );
        Ext.Ajax.request({
            url: "index.php/api/billingmediation/setfilter",
            params: {
                agent_id: this.param("id"),
                flt: filter
            },
            scope: this
        });
    },

    onSegmentsGridAddedToTabs: function() {
        this.setSegmentStoreExtraParams();
        this.setSegmentsGridTitle();
        this.loadRnasComboStore();
    },

    loadPhoneReplacesStores: function() {
        this.getAgentsPhoneBillingMediationStore().loadIfNeccessary();
        this.getAgentsPhoneReplacesStore().loadIfNeccessary();
    },

    setPhoneReplacesExtraParams: function() {
        this.getAgentsPhoneBillingMediationStore().setExtraParams({ agent_id: this.param('id') });
        this.getAgentsPhoneReplacesStore().setExtraParams({ agent_id: this.param('id') });
    },

    loadRnasComboStore: function() {
        this.getAgentsInternetRadiusRnasStore().setExtraParams({ agent_id: this.param('id'), alldata: true });
    },

    loadSegmentsStore: function() {
        this.getAgentsInternetNetworkManagementStore().loadIfNeccessary();
    },

    getEmulatedAgentID: function() {
        if (this.param("type") != 6) {
            return 0;
        } else {
            return this.param("remulate_on_naid");
        }
    },

    setSegmentStoreExtraParams: function() {
        var remulate_on_naid = this.getEmulatedAgentID();
        if (remulate_on_naid == 0) {
            var id = this.param("id");
        } else {
            var id = remulate_on_naid
        }
        this.getAgentsInternetNetworkManagementStore().setExtraParams({ agent_id: id });
    },

    getEmulatedAgentName: function( id ) {
        var record = this.getAgentsInternetRadiusEmulateAgentsStore().findRecord( "id", id );
        if (record) {
            return record.get("name");
        } else {
            return "";
        }
    },

    setSegmentsGridTitle: function() {
        var remulate_on_naid = this.getEmulatedAgentID();
        var title = remulate_on_naid > 0 ? ( i18n.get( "Network management" ) + " (" + i18n.get( "emulation mode" ) + " \"" + this.getEmulatedAgentName( remulate_on_naid ) + "\")" ) : i18n.get("Network management");
        this.getSegmentsGrid().setTitle( title );
    },

    onEmulationModeChanded: function( combobox, value ) {
        var msg = value > 0 ? (i18n.get('RADIUS will manage accounts of the selected module') + ' "' + this.getEmulatedAgentName( value ) + '"') : i18n.get('RADIUS will manage own accounts');
        Ext.Msg.showInfo({
            msg: msg, 
            title: i18n.get('Info')  
        });

        if (this.param("id") > 0) {
            this.onSegmentsGridAddedToTabs();
        }
    },
    
    onEmulationClick: function(e) {
        e.combo.expand();
        e.combo.store.load();
        return false; 
    },
    
    onRadiusSettingsAddedToTabs: function() {
        this.setBindedToRaddrpoolCheckboxesState();
        this.showOrHideDHCPSettings();
    },

    setBindedToRaddrpoolCheckboxesState: function() {
        panel = this.getRadiusSettings();
        var raddrpool = panel.down( "fieldset > container > checkbox[name=raddrpool]" );
        var savestataddr = panel.down( "fieldset > container > checkbox[name=save_stat_addr]" );
        var nobroadcast = panel.down( "fieldset > container > checkbox[name=ignorelocal]" );
        if ( raddrpool.getValue() ) {
            savestataddr.enable();
            nobroadcast.enable();
        } else {
            savestataddr.disable();
            nobroadcast.disable();
        }
    },

    showOrHideDHCPSettings: function() {
        var fieldset = this.getDHCPFieldset();
        var value = fieldset.down( "numberfield[name=dhcpd_port]" ).getValue();
        if (value && value != "" && value > 0) {
            var visibility = true;
        } else {
            var visibility = false;
        }
        fieldset.items.each( function(item) {
            if (item.getName() == "dhcpd_port" || item.getName() == "dhcpd_ip") {
                return;
            }
            if (visibility) {
                item.show();
            } else {
                item.hide();
            }
        }, this);
    },

    setRnasExtraParams: function() {
        this.getAgentsInternetRnasStore().setExtraParams({ 
            agent_id: this.param( "id" )
        });
    },

    loadRnasStore: function() {
        this.getAgentsInternetRnasStore().loadIfNeccessary();
    },

    setComboValues: function( data ) {
        data.values.mask = this.getAgentsInternetIPAndPrefixSizeStore().findRecord( "ip", data.values.mask ).get("prefix_size");

        if (data.values.vlan_id == 0) {
            var vlan_name = "...";
        } else {
            var vlan_name = data.values.vlan_name;
        }
        this.setComboText({
            combo: data.form.down("combobox[name=vlan_id]"),
            value: data.values.vlan_id,
            display: vlan_name
        });
        
        if (data.values.device_group_id == 0) {
            var device_name = i18n.get("No");
        } else {
            var device_name = data.values.device_group_name;
        }
        this.setComboText({
            combo: data.form.down("combobox[name=device_group_id]"),
            value: data.values.device_group_id,
            display: device_name
        });
    },

    changeSegmentSearchField: function() {
        var field = this.getSegmentsSearchCombo().getValue();
        var ip = this.getIpSearchField();
        var vlan = this.getVlanSearchField();
        if ( field == "ip" ) {
            ip.show();
            vlan.hide();
        } else {
            ip.hide();
            vlan.show();
        }
    },

    findSegments: function() {
        var store = this.getAgentsInternetNetworkManagementStore();
        var field = this.getSegmentsSearchCombo().getValue();
        
        if (field == "ip") {
            var value = this.getIpSearchField().getValue();
        } else {
            var value = this.getVlanSearchField().getValue();
        }

        var params = {};
        Ext.apply( params, store.proxy.extraParams );

        for (var i in params) {
            if (i == "ip" || i == "vlan") {
                delete(params[i]);
            }
        }

        params[ field ] = value;
        store.setExtraParams( params );
        store.loadIfNeccessary();
    },

    loadRnasStoreIfNeccessary: function( eventData ) {
        if (this.getAgentsInternetRadiusRnasStore().loadIfNeccessary({ scope: this, callback: function() {
            this.buildAgentsRnasComboStore();
            this.selectFirstItemInRnasMenu();
            eventData.delegateBack();
        }})) {
            eventData.go_on = false;
        } else {
            this.buildAgentsRnasComboStore();
        }
    },

    buildReplaceRadiusAttributeComboStore: function() {
        var store = this.getAgentsDictionaryComboStore();
        if (store.allreadyBuilt == true) {
            return;
        }
        this.getAgentsInternetRadiusAttributesStore().data.each( function( record ) {
            if (record.get('nas_id') == 0) {
                store.add( record );
            }
        });
        store.insert( 0, Ext.create('OSS.model.agent.internet.radius.Attribute', { id: 0, name: i18n.get("No") }) );
        store.allreadyBuilt = true;
    },

    buildAgentsRnasComboStore: function() {
        var store = this.getAgentsInternetRnasComboStore();
        store.removeAll();
        this.getAgentsInternetRadiusRnasStore().data.each( function( record ) {
            store.add( record );
        }, this);
        store.insert(0, Ext.create( 'OSS.model.agent.internet.Rnas', {
              id: 0,
              rnas: i18n.get('All')
        }));
        store.insert(0, Ext.create( 'OSS.model.agent.internet.Rnas', {
              id: -1,
              rnas: i18n.get('Not use')
        }));
    },

    findNasByIP: function() {
        var store = this.getAgentsInternetRnasStore();
        var params = {};
        Ext.apply( params, store.proxy.extraParams );
        params.ip = this.getNasIPSearchField().getValue();
        store.setExtraParams( params );
        store.loadIfNeccessary();
    },

    applyFilterOnEnterPressed: function(){
        if (arguments[1].getKey() == arguments[1].ENTER) {
            this.findSegments();
        }
    },

    applyNasFilterOnEnterPressed: function(){
        if (arguments[1].getKey() == arguments[1].ENTER) {
            this.findNasByIP();
        }
    },

    setRadiusDictionaryNasMenuDataInvalid: function() {
        this.getAgentsInternetRadiusRnasStore().setDataInvalid();
    },

    radiusDictionaryTabActivated: function() {
        this.getAgentsInternetRadiusRnasStore().loadIfNeccessary({ scope: this, callback: this.selectFirstItemInRnasMenu });    
    },

    selectFirstItemInRnasMenu: function() {
        if (this.param("type") != 6 && this.param("type") != 12) {
            return;
        }
        if (this.getAgentsInternetRadiusRnasStore().getCount() > 0) {
            this.getRnasMenu().getSelectionModel().select(0);
        } else {
            this.getAgentsInternetRadiusAttributesStore().removeAll();
        }
    },

    loadDictionary: function() {
        var record = arguments[1];
        var store = this.getAgentsInternetRadiusAttributesStore();
        store.setExtraParams({ nas_id: record.get("id") });
        store.loadIfNeccessary();
    },

    renderTypeCol: function( data ) {
        data.value = this.getAgentsDictionaryTypesStore().findRecord("id", data.value).get("name");
    },

    onNewAttributeCreating: function( record ) {
        this.buildReplaceRadiusAttributeComboStore();
        record.set( "nas_id", this.getRnasMenu().getSelectionModel().getSelection()[0].get("id") );
    },

    loadEmulateAgentsStore: function( data ) {
        if (this.param("type") != 6) {
            return;
        }
        var store = this.getAgentsInternetRadiusEmulateAgentsStore();
        if (!store.loadIfNeccessary({ callback: function() {
            data.delegateBack();
        }})) {
            return;
        }
        data.go_on = false;
    },

    hideOrShowTimeoutCombo: function() {
        var timeout = this.getTimeoutCombo();
        if (this.param("type") < 7) {
            timeout.show();
        } else {
            timeout.hide();
        }
    },

    beforeTabsRebuild: function( data ) {
        this.hideOrShowTimeoutCombo();
        this.loadEmulateAgentsStore( data );
    },

    setComboText: function( params ) {
        var combo = params.combo;
        var value = params.value;
        var display = params.display;
        var store = combo.getStore();
        if ( !store.findRecord(combo.valueField, value) ) { 
            var data = {};
            data[ combo.valueField ] = value;
            data[ combo.displayField ] = display;
            var record = new store.model( data );
            store.add( record ); 
        }
    },

    getReplaceWhatDescr: function( data ) {
        data.value = this.getAgentsPhoneReplaceWhatDescrsStore().findRecord( "id", data.record.get("replace_what") ).get( "name" );
    },

    enableLtrimField: function() {
        var checked = arguments[1];
        if (checked) { 
            var field = this.getLtrimField();
            field.setMinValue(1);
            if (field.getValue() < 1) {
                field.setValue(1);
            }
            field.show(); 
            this.getOldnumberField().setFieldLabel( i18n.get("Internal ATS number template") );
        } else { 
            var field = this.getLtrimField();
            field.setMinValue(-1);
            field.setValue(-1);
            field.hide(); 
            this.getOldnumberField().setFieldLabel( i18n.get("Internal ATS number") );
        }
    },

    checkGroupSubstitution: function( data ) {
        if (data.values.ltrim > 0) {
            data.form.down("#group_substitution").setValue( true );
        } else {
            data.form.down("#group_substitution").setValue(false);
        }
    },

    setIPMask: function( data ) {
        data.values.mask = this.getAgentsInternetIPAndPrefixSizeStore().findRecord( "prefix_size", data.values.mask ).get("ip");
    },

    getTypeDescription: function( type ) {
        var typerecord = this.getAgentsTypesStore().findRecord( "id", type.id );
        if (typerecord) {
            type.name = typerecord.get( "name" );
        }
    },
    

    loadAgents: function() {
        this.getAgentsStore().load();
    },

    activateListCard: function() {
        this.getMainPanel().getLayout().setActiveItem(0);
    },

    programActivated: function() {
        var card = this.getMainPanel().getLayout().getActiveItem();
        if (card.getId() == 'agentstabs') {
            this.tabsController.onTabChange(card, card.getActiveTab());
        }
    },

    getMaskTarget: function() {
        return this.getMainPanel();
    }
});

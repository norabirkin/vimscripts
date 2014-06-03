/**
 * Billing system Inventory functions and objects
 *
 * Repository information:
 * $Date: 2009-12-01 12:46:43 $
 * $Revision: 1.1.2.9 $
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.apply(Ext.QuickTips.getQuickTip(), {
        maxWidth: 300,
        minWidth: 100,
        showDelay: 20
    });
});


/**
 * Loading data from Store to field and tpls
 * @param {Object} vgid
 */
function show_vgid_port(vgid){
	
	Ext.Ajax.request({
		url: 'config.php',
		method: 'POST',
		callback: function(opt, success, res) {
			try {
				if(success && res.responseText != '') {
					var data = Ext.decode(res.responseText);
					Ext.getCmp("dev_id").setValue(data['device'][0]["deviceid"]);
					Ext.getCmp("port_id").setValue(data['device'][0]["portid"]);  
					Ext.getCmp("device_name").setValue(data['device'][0]["devicename"]);                
					Ext.getCmp("device_port").setValue(data['device'][0]["name"]);
					Ext.getCmp("port_vlan").setValue(data['device'][0]["vlan"]);
					Ext.getCmp("port_comment").setValue(data['device'][0]["comment"]);
					Ext.getCmp("unbind_account_to_port_btn").enable();
					var dtpl = new Ext.Template('<div style="margin-top:3px;width:16px;height:16px;background-image:url({devicefg})"></div>');
					var ptpl = new Ext.Template('<div style="margin-top:3px;width:16px;height:16px;background-image:url({portfg})"></div>');
						
					var flag_device = function(obj) {
						dtpl.append('flagDevice', obj);
					}				
					var flag_port = function(obj) {
						ptpl.append('flagPort', obj);
					}
							
							
					if(data['device'][0]["device_status"] == 1) {
						flag_device({ devicefg : 'images/states/flag_green.gif' });
					} else if(data['device'][0]["device_status"] == 0) {
						flag_device({ devicefg : 'images/states/flag_red.gif' });
					} else {
						flag_device({ devicefg : 'images/states/flag_white.gif' });
					}   
								  
					flag_port({ portfg : data['device'][0]["port_status"] });
					if(data['device'][0]["policy_name"]) {
						Ext.getCmp("policy_name").setValue(data['device'][0]["policy_name"]);
					} 
				}
			}
			catch(e) {
				Ext.Msg.error(e);
			}					
		},
		params: {
			async_call: 1,
			devision: 207,
			check_vgid: 1,
			vg_id: document.getElementById('vgid').value
		}
	});
}


/**
 * Widget to choose device port and call vgroup update 
 * @param {Object} vgid
 */
function bind_account(vgid) {
    new Ext.Window({
        title: Ext.app.Localize.get('Devices') + ' / ' + Ext.app.Localize.get('Ports'),
        width: 800,
        height: 440,
        id: 'devices_wnd',
        layout: 'border',
        constrain: true,
        modal: true,
        buttonAlign: 'center',
        buttons: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Choose'),
            handler: function(Btn) {
                var record = Btn.findParentByType('window').get('portList').getSelectionModel().getSelected();
                
                if(record) {
                    bind_account_to_port(record, vgid, record.store.baseParams.device_id, function(){
                        show_vgid_port(this.vgid);
                        
                        this.store.reload({
                            params: {
                                start: 0
                            }
                        });
                        
                        var free_segments = Ext.getCmp('_freeSegments');
                        if (free_segments) {
                            free_segments.destroy();            
                        }   
                        var signed_segments = Ext.getCmp('_signedSegments');
                        if (signed_segments) {
                            signed_segments.destroy();
                        }
                        showIPTransport('_ipTransportUsed', '_ipTransportFree', '_ifIndex');
                        this.win.close();
                    }.createDelegate({
                        vgid: vgid,
                        store: record.store,
                        win: Btn.findParentByType('window')
                    }));
                }
            }
        }],
        items: [{
            xtype: 'grid',
            title: Ext.app.Localize.get('Devices'),
            region: 'west',
            collapsible: false,
            split: true, 
            minSize: 220,
            maxSize: 600,
            width: 550,
            PAGELIMIT: 100,
            autoExpandColumn: 'col-dev-name-exp',
            loadMask: true,
            listeners: {
                beforerender: function(grid) {
                    grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                    var bbar = grid.getBottomToolbar();
                    bbar.pageSize = grid.PAGELIMIT;
                    bbar.bindStore(grid.store);
                    bbar.add(['-', {
                        xtype: 'combo',
                        width: 70,
                        displayField: 'id',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all',
                        value: grid.PAGELIMIT,
                        editable: false,
                        store: {
                            xtype: 'arraystore',
                            data: [[20], [50], [100], [500]],
                            fields: ['id']
                        },
                        listeners: {
                            select: function(c){
                                this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
                                this.store.reload({
                                    params: {
                                        limit: this.PAGELIMIT
                                    }
                                });
                            }.createDelegate(grid)
                        }
                    }]);
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
                },
                rowclick: function(grid, idx, ev) {
                    var record = grid.getStore().getAt(idx);
                    grid.findParentByType('window').get('portList').getStore().setBaseParam('device_id', record.get('id')).reload({
                        params: {
                            start: 0
                        }
                    });
                }
            },
            tbar: [{
                xtype: 'combo',
                mode: 'local',
                triggerAction: 'all',
                width: 150,
                valueField: 'id',
                displayField: 'name',
                name: 'searchtype',
                editable: false,
                value: 0,
                listeners: {
                    select: function(combo, record) {
                        combo.ownerCt.get('searchFld')[record.get('id') > 2 ? 'enable' : 'disable']();
                        if(record.get('id') < 3) {
                            combo.ownerCt.get('searchFld').setValue(null);
                        }
                    }
                },
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [
                        [0, Ext.app.Localize.get('All')],
                        [1, Ext.app.Localize.get('Nearest on street')],
                        [2, Ext.app.Localize.get('Nearest in building')],
                        [3, 'IP ' + Ext.app.Localize.get('Address')],
                        [4, Ext.app.Localize.get('Name')]
                    ]
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'textfield',
                itemId: 'searchFld',
                width: 150,
                name: 'search',
                disabled: true,
                listeners: {
                    afterrender: function() {
                            this.on('specialkey', function(f, e){
                            if (e.getKey() == e.ENTER) {
                                var Btn = this.ownerCt.get('searchBtn');
                                Btn.handler(Btn);
                            }
                        }, this);
                    }
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Show'),
                iconCls: 'ext-search',
                itemId: 'searchBtn',
                handler: function(Btn) {
                    Btn.findParentByType('grid').getStore().reload({
                        params: {
                            start: 0
                        }
                    });
                }
            }],
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
            columns: [{
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name',
                width: 100
            }, {
                header: Ext.app.Localize.get('Address'),
                dataIndex: 'address',
                id: 'col-dev-name-exp'
            }],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            store: {
                xtype: 'jsonstore',
                root: 'devices',
                totalProperty: 'amount',
                fields: [
                    { name: 'id', type: 'int' }, 
                    { name: 'name', type: 'string' },
                    { name: 'address', type: 'string' },
                    { name: 'address_idx', type: 'string' }
                ],
                baseParams: {
                    async_call: 1,
                    devision: 207,
                    get_devices: 1,
                    vgid: vgid
                }
            }
        }, {
            region: 'center',
            itemId: 'portList',
            xtype: 'grid',
            title: Ext.app.Localize.get('Ports'),
            autoExpandColumn: 'col-port-name-exp',
            loadMask: true,
            listeners: {
                beforerender: function(grid) {
                    var model = grid.getColumnModel();
                    model.config.unshift(grid.getSelectionModel())
                    model.setConfig(model.config);
                    // Add filter check
                    grid.getStore().on('load', function(store){
                        this.pressed ? store.filter([{
                            fn: function(record) {
                                return !record.get('vg_id') && !record.get('connected_device_id');
                            }
                        }]) : store.clearFilter();
                    }, grid.getTopToolbar().get('occBtn'));
                }
            },
            tbar: [{
                xtype: 'button',
                itemId: 'occBtn',
                text: Ext.app.Localize.get('Hide occupied'),
                enableToggle: true,
                toggleHandler: function(Btn, state) {
                    state ? Btn.findParentByType('grid').getStore().filter([{
                        fn: function(record) {
                            return !record.get('vg_id') && !record.get('connected_device_id');
                        }
                    }]) : Btn.findParentByType('grid').getStore().clearFilter();
                }
            }],
            viewConfig: {
                emptyText: Ext.app.Localize.get('Select any device')
            },
            sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: true }),
            columns: [{
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name',
                id: 'col-port-name-exp'
            }, {
                header: Ext.app.Localize.get('Vlan'),
                width: 60,
                dataIndex: 'vlan'
            }, {
                header: Ext.app.Localize.get('Account') + '/' + Ext.app.Localize.get('Device'),
                width: 150,
                dataIndex: 'login',
                renderer: function(value, meta, record){
                    if (record.get("vg_id")) {
                        return record.get("login");
                    }
                    else if (record.get("connected_device_id")) {
                        return record.get("connected_device_name") + ". " + Ext.app.Localize.get('Port') + ": " + record.get("connected_port_name");
                    }
                }
            }, {
                header: Ext.app.Localize.get('Comment'),
                width: 90,
                dataIndex: 'comment'
            }],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                fields: [
                    { name: 'id', type: 'int' }, 
                    { name: 'name', type: 'string' }, 
                    { name: 'speed', type: 'string' }, 
                    { name: 'media', type: 'string' }, 
                    { name: 'vlan', type: 'string' }, 
                    { name: 'vlanid', type: 'int' },  
                    { name: 'prototype_id', type: 'int' }, 
                    { name: 'vg_id', type: 'int' }, 
                    { name: 'port_number', type: 'int' }, 
                    { name: 'login', type: 'string' }, 
                    { name: 'comment', type: 'string' }, 
                    { name: 'policy_id', type: 'int' }, 
                    { name: 'connected_port_id', type: 'int' },
                    { name: 'connected_device_id', type: 'int' }, 
                    { name: 'connected_port_name', type: 'string' }, 
                    { name: 'connected_device_name', type: 'string' }, 
                    { name: 'connected_device_is_parent', type: 'int' },
                    { name: 'choose', type: 'bool' }
                ],
                baseParams: {
                    devision: 207,
                    async_call: 1,
                    get_ports: 1,
                    device_id: 0
                }
            }
        }]
    }).show(null, function(win){
        win.get(0).getStore().reload({
            params: {
                start: 0
            }
        });
    });
}

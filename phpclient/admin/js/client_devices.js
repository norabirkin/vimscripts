/**
 * Run when document is already loaded
 *
 */
Ext.onReady(function() {
    Ext.QuickTips.init();
    // Show catalogue control Panel to edit catalog and and or modify its entries
    renderDevicesPanel('ClientDevicesPanel');
}); // end Ext.onReady()


/**
 * Render device panel to the html element
 * @param    object
 */
function renderDevicesPanel( id ) {
    var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }

    var panel = getDevicesPanel({
        title: Ext.app.Localize.get('Client devices')
    });

    panel.render(id);
    panel.setHeight(744);
    panel.setWidth(900);
} // end renderDevicePanel()





function addDeviceWithService(config, win, row, eqrow) {
	if(!config.disableEquipments) {
		config.window = 1;
		config.equipid = eqrow.get('id');
		if(!config.notassign) {
			showUseReglament(config); 
		} else {
			win.close();	
		}
	} else {
		config.window = 0;
		config.smserial = row.get('serial');
		config.complect = 0;
			// Call method to check is smcard in complect or not
		Ext.Ajax.request({
			url: 'config.php',
			method: 'POST',
			timeout: 380000,
			params: Ext.apply({
				async_call: 1,
				devision: 27,
				checkcomplect: row.get('id'),
				smserial: row.get('serial')
			}),
			callback: function(opt, success, res) {
				try {
					var result = Ext.decode(res.responseText);
					if(!result.success && result.error) {
						throw(result.error);
					}
					if(result.result['complect'] == 1 && config.parentagrmid > 0) {
						config.equipid = result.result['equipid'];
						config.complect = 1;
						showUseReglament(config);
					}					
				}
				catch(e) {
					Ext.Msg.error(e);
				}
			}
		});	
		win.close();			
	}
}


/**
 * Show device panel as window
 */
function showDevicesPanel(config)
{
    var config = config || {};

    new Ext.Window({
        title: Ext.app.Localize.get('Equipment'),
        id: 'eqipwindow',
        layout: 'fit',
        width: 900,
        height: 600,
        modal: config.modal || false,
        items: getDevicesPanel(Ext.apply({
            title: null
        }, config)),
        buttonAlign: 'center',
        buttons: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Assign'),
            handler: function(Btn) {
				var win = Btn.findParentByType('window');
				var row = Ext.getCmp('smcards').getSelectionModel().getSelected();
				var eqrow = Ext.getCmp('equipment').getSelectionModel().getSelected();
				var callback = this.callback;
				
				if(!Ext.isEmpty(row) && row.get('vgid') > 0) {
					Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Smartcard already assigned'));
					return false;
				}				
				if(!Ext.isEmpty(eqrow)) {
					config.serial = Ext.getCmp('equipment').getSelectionModel().getSelected().get('serial');
				}
				if(!Ext.isEmpty(eqrow) && eqrow.get('agrmid')>0 && !config.notassign) {
					if(!config.vgid) {
						Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Equipment already linked to another agreement'), function(Btn){
							if(Btn != 'yes') {
								return false;
							}
							Ext.Ajax.request({
				                url: 'config.php',
				                method: 'POST',
				                timeout: 380000,
				                scope: this,
				                params: Ext.apply({
				                    async_call: 1,
				                    devision: 27,
				                    setagrmequip: 1,
				                    equipid: Ext.getCmp('equipment').getSelectionModel().getSelected().get('id'),
									agrmid: 0,
				                    reason: ''
				                }),
				                callback: function(opt, success, res) {
				                    try {
				                        var data = Ext.decode(res.responseText);
				                        if(!data.success) {
				                            throw(data.error);
				                        }
										
										if(callback) callback(win.get(0).getActiveTab());
										addDeviceWithService(config, win, row, eqrow);
				                    }
				                    catch(e) {
				                        Ext.Msg.error(e);
				                    }
				                }
				            });
				            
						});
					} else {
						if(this.callback) this.callback(win.get(0).get(1));
					}
				} else {
					if(!config.vgid) {
						if(this.callback) this.callback(win.get(0).getActiveTab());
						addDeviceWithService(config, win, row, eqrow);
					} else {
						if(this.callback) this.callback(win.get(0).get(1));
					}
				}
				
            }.createDelegate(config)
        }]
    }).show();
} // end showDevicesPanel()



/**
 * 	Remove the service while unlink device
 * @param   object
 */
function unlinkService ( config ) {
	var config = config || {};
	Ext.Ajax.request({
		url: 'config.php',
		method: 'POST',
		timeout: 380000,
		scope: this,
		params: Ext.apply({
			async_call: 1,
			devision: 27,
			setservid: 1,
			equipid: config.equipid,
			reason: 'Refusal of Service',
			unlinkdevice: 1
		}),
		callback: function(opt, success, res) {
			try {
				var data = Ext.decode(res.responseText);
				if(!data.success) {
					throw(data.error);
				}
			}
			catch(e) {
				Ext.Msg.error(e);
			}
		}
	});	
}

/**
 * Prepare device panel to render it to the html element or
 * show as stand along window
 * @param   object
 */
function getDevicesPanel( config )
{
    var config = config || {
        title: null,
        activeItem: 0
    };

    var SmBtnEdit = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Edit'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-edit'
    });
    
    var SmHistory = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('History') + ' / ' + Ext.app.Localize.get('Accounts'),
        width: 22,
        dataIndex: 'id',	
        iconCls: 'ext-history'
    });    
	
	
	var SmEquipHistory = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('History') + ' / ' + Ext.app.Localize.get('Smart cards'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-history2'
    }); 

    var EquipHistory = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('History') + ' / ' + Ext.app.Localize.get('Agreements'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-history'
    });

    var DevBtnEdit = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Edit'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-edit'
    });
    
    var Panel = new Ext.TabPanel({
        activeItem: config.activeItem || 0,
        deferredRender: true,
        plain: true,
        setPB: function(grid) {
            // Add selection
            var model = grid.getColumnModel();
            model.config.unshift(grid.getSelectionModel())
            model.setConfig(model.config);
            // Set paging bar
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
        },
        items: [{
            xtype: 'grid',
            title: Ext.app.Localize.get('Smart cards'),
            PAGELIMIT: 100,
            stateful: true,
            stateId: 'smcards',
            id: 'smcards', 
            autoExpandColumn: 'sm-card-col-exp',
            loadMask: true,
            disabled: config.disableSmartCards || false,
            enableHdMenu: false,
            listeners: {
                afterrender: function(grid) {
                    grid.getStore().load();
                },
                beforerender: function(grid) {
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
                    grid.ownerCt.setPB(grid);
                }
            },
              
            tbar: new Ext.Toolbar({
			id: 'smcard-tbar',
			items: [{
				xtype: 'container',
				id: 'smcards-container',
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: 
				[{      	
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('New smart card'),
					handler: function(Btn) {
						setSmartCard({
							store: Btn.findParentByType('grid').getStore()
						});
					}
				}, {
					xtype: 'tbspacer',
					width: 5
				}, {
					xtype: 'button',
					iconCls: 'ext-drop',
					tooltip: Ext.app.Localize.get('Remove Smart cards'),
					text: Ext.app.Localize.get('Remove'),
					handler: function(Btn) {
						Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
							if(Btn != 'yes') {
								return;
							};
	
							var list = {};
							this.getSelectionModel().each(function(record){
								this.list['smcard[' + record.get('id') + '][serial]'] = record.get('serial');
								this.list['smcard[' + record.get('id') + '][name]'] = record.get('name');
							}, {
								list: list
							});
	
							Ext.Ajax.request({
								url: 'config.php',
								method: 'POST',
								timeout: 380000,
								params: Ext.apply({
									async_call: 1,
									devision: 27,
									removesmcards: 1
								}, list),
								scope: {
									grid: this
								},
								callback: function(opt, success, res){
									try {
										var data = Ext.decode(res.responseText);
	
										if(!data.success) {
											throw(data.error);
										}
	
										this.grid.getStore().reload();
									}
									catch(e) {
										Ext.Msg.error(e);
									}
								}
							})
						}, Btn.findParentByType('toolbar').ownerCt);
					}
				}, {
					xtype: 'tbspacer',
					width: 5
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Upload'),
					iconCls: 'ext-upcsv',
					handler: function(Btn) {
						uploadCSV({
							modelHide: true,
							typeHide: true, 
							formatHide: true, 
						   // warrantyHide: true,
							dataType: 'smartcard',
							callback: function() {
								this.getStore().reload();
							}.createDelegate(Btn.findParentByType('grid'))
						});
					}
					}, {
					xtype: 'tbseparator',
					width: 5
				}, {
					xtype: 'textfield',
					name: 'smfullsearch',
					id: 'smfullsearch',
					width: 200,
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
					iconCls: 'ext-search',
					itemId: 'searchBtn',
					text: Ext.app.Localize.get('Show'),
					handler: function(Btn) {
						Btn.findParentByType('grid').getStore().reload({
							params: {
								start: 0,
								fullsearch: this.ownerCt.get('smfullsearch').getValue() 
							}
						});
					}
				},{
					xtype: 'tbseparator',
					width: 10
				}, { 
					xtype: 'button',
					text: Ext.app.Localize.get('Scan bar code'),
					iconCls: 'ext-scanbarcode', 
					handler: function(Btn){
						Btn.findParentByType('toolbar').get('scan-smcards-container').show();
						Btn.ownerCt.hide();	
						this.ownerCt.get('smfullsearch').setValue('');
						Ext.getCmp('scan-sm-serial').setValue('');
						Ext.getCmp('scan-sm-serial').focus();
						Ext.getCmp('scan-sm-serial').on('blur', blurhandler, null, { delay: 500 });
					}
				}]			
			},{
				xtype: 'container',
				id: 'scan-smcards-container',
				//width: 975,
				hidden: true,
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [
					{
						xtype: 'tbtext',
						text: Ext.app.Localize.get('Scan smartcard serial') + ': ',
						style: 'font-weight:bold;'
					},
					{
		                xtype: 'tbspacer',
		                width: 5
		            }, 
					{
						xtype: 'textfield',
					    id: 'scan-sm-serial',
					    validateOnBlur: false,
					    width: 210,
					    readOnly: false,
					    enableKeyEvents: true,
						maxLength: 29,
		            	maskRe: new RegExp('[0-9]'),
		    		    validator: function(v){
						  var checkval = new RegExp('^[0-9]');
						  if (checkval.test(v)) return true;
						  else
						  return false;
						}
					},
					{
		                xtype: 'tbseparator',
		                width: 10
		            }, 
					{
						xtype: 'button',
						id: 'scan-hide-btn',
						text: Ext.app.Localize.get('End to scan'),
						//hidden: true,
						iconCls: 'ext-scanbarcode',
						handler: function(Btn){
							Btn.findParentByType('toolbar').get('smcards-container').show();
							Btn.ownerCt.hide();
							Ext.getCmp('scan-sm-serial').removeListener('blur', blurhandler);
							Ext.getCmp('smcards').getStore().setBaseParam('cardserial','');
							Ext.getCmp('smcards').getStore().setBaseParam('fullsearch:', '');
						}
					}
					]
			}]
            }),
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            plugins: [SmBtnEdit, SmHistory],
            sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: config.SMSingle || false }),
            columns: [SmBtnEdit, SmHistory, {
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name'
            }, {
                header: Ext.app.Localize.get('Serial number'),
                dataIndex: 'serial'
            }, {
                header: Ext.app.Localize.get('Account login'),
                dataIndex: 'vglogin',
                width: 140
            }, {
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'descr',
                id: 'sm-card-col-exp'
            },{
                header: Ext.app.Localize.get('Warranty to'),
                dataIndex: 'garantee',
                renderer: function(value) {
            		if(value) return value.format('d.m.Y');
	            }
            }
            ],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'string' },
                    { name: 'descr', type: 'string' },
                    { name: 'serial', type: 'string' },
                    { name: 'vglogin', type: 'string' },
                    { name: 'vgid', type: 'int' },
                    { name: 'reason', type: 'string' },
                    { name: 'garantee', type: 'date', dateFormat: 'Y-m-d' }
                ],
                baseParams: {
                    async_call: 1,
                    getsmcards: 1,
                    devision: 27,
                    fullsearch: null,
                    cardserial: null,
                    start: 0,
                    limit: 100
                }
            }
        }, {
            xtype: 'grid',
            title: Ext.app.Localize.get('Customer equipment'),
            PAGELIMIT: 100,
            stateful: true,
            id: 'equipment',
            stateId: 'clidevs',
            autoExpandColumn: 'cli-dev-col-exp',
            loadMask: true,
            disabled: config.disableEquipments || false,
            listeners: {
                afterrender: function(grid) {
                    grid.getStore().load();
                },
                beforerender: function(grid) {
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
                    grid.ownerCt.setPB(grid);
                }
            },
            
            tbar: new Ext.Toolbar({
				id: 'equip-toolbar',
				items: [{
					xtype: 'container',
					id: 'equip-container',
					//width: 975,
					layout: 'toolbar',
					getGrid: function() {
						return this.ownerCt.ownerCt;
					},
					items: 
						[{
			                xtype: 'splitbutton',
			                iconCls: 'ext-add',
			                text: Ext.app.Localize.get('New equipment'),
			                handler: function(Btn) {
			                    setClientDevice({
			                        store: Btn.ownerCt.findParentByType('grid').getStore()
			                    });
			                },
			                menu: [{
			                    text: Ext.app.Localize.get('New model'),
			                    handler: function(Btn) {
			                        setModel();
			                    }
			                }]
			            }, {
			                xtype: 'tbspacer',
			                width: 5
			            }, {
			                xtype: 'button',
			                iconCls: 'ext-drop',
			                tooltip: Ext.app.Localize.get('Remove device'),
			                text: Ext.app.Localize.get('Remove'),
			                handler: function(Btn) {
			                    Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
			                        if(Btn != 'yes') {
			                            return;
			                        };
			
			                        var list = {};
			                        this.getSelectionModel().each(function(record){
			                            this.list['clidev[' + record.get('id') + '][serial]'] = record.get('serial');
			                            this.list['clidev[' + record.get('id') + '][name]'] = record.get('name');
			                        }, {
			                            list: list
			                        });
			
			                        Ext.Ajax.request({
			                            url: 'config.php',
			                            method: 'POST',
			                            timeout: 380000,
			                            params: Ext.apply({
			                                async_call: 1,
			                                devision: 27,
			                                removeclidevs: 1
			                            }, list),
			                            scope: {
			                                grid: this
			                            },
			                            callback: function(opt, success, res){
			                                try {
			                                    var data = Ext.decode(res.responseText);
			
			                                    if(!data.success) {
			                                        throw(data.error);
			                                    }
			
			                                    this.grid.getStore().reload();
			                                }
			                                catch(e) {
			                                    Ext.Msg.error(e);
			                                }
			                            }
			                        })
			                    }, Btn.findParentByType('toolbar').ownerCt);
			                }
			            }, {
			                xtype: 'tbspacer',
			                width: 5
			            }, {
			                xtype: 'button',
			                text: Ext.app.Localize.get('Upload'),
			                iconCls: 'ext-upcsv',
			                handler: function(Btn) {
			                    uploadCSV({
			                        dataType: 'equipment',
			                        callback: function() {
			                            this.getStore().reload();
			                        	Ext.getCmp('smcards').store.reload();  
			                        
			                        }.createDelegate(Btn.findParentByType('grid'))
			                    });
			                }
			            }, {
			                xtype: 'tbseparator',
			                width: 5
			            }, {
			                xtype: 'textfield',
			                name: 'eqfullsearch',
			                id: 'eqfullsearch',
			                width: 200,
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
			                iconCls: 'ext-search',
			                itemId: 'searchBtn',
			                text: Ext.app.Localize.get('Show'),
			                handler: function(Btn) {
			                    Btn.findParentByType('grid').getStore().reload({
			                        params: {
			                            start: 0,
			                            fullsearch: this.ownerCt.get('eqfullsearch').getValue() 
			                        }
			                    });
			                }
			            }, {
			                xtype: 'tbseparator',
			                width: 5
			            }, { 
							xtype: 'button',
							text: Ext.app.Localize.get('Scan bar code'),
							iconCls: 'ext-scanbarcode', 
							handler: function(Btn){
								Btn.findParentByType('toolbar').get('scan-equip-container').show();
								Btn.ownerCt.hide();	
								this.ownerCt.get('eqfullsearch').setValue(''); 
								Ext.getCmp('scan-equip-serial').setValue('');
								Ext.getCmp('scan-equip-serial').focus();
								Ext.getCmp('scan-equip-serial').on('blur', blurequiphandler, null, { delay: 500 });
								
							}
						}
					] 
				},{
					xtype: 'container',
					id: 'scan-equip-container',
					//width: 975,
					layout: 'toolbar',
					hidden: true,
					getGrid: function() {
						return this.ownerCt.ownerCt;
					},
					items: 
					[{
						xtype: 'tbtext',
						id: 'scan-equip-serial-label',
						text: Ext.app.Localize.get('Scan equip serial') + ': ',
						style: 'font-weight:bold;'
					}, {
						xtype: 'tbspacer',
						width: 5
					}, {
						xtype: 'textfield',
					    //ref: 'defaultButton',
					    id: 'scan-equip-serial',
					    //name: 'orderid',
					    validateOnBlur: false,
					    width: 210,
					   // hidden: true,
					    readOnly: false,
					    enableKeyEvents: true,
						maxLength: 29,
						//autoCreate: {tag: 'input', type: 'text', size: '29', autocomplete: 'off', maxlength: '29'},
		            	maskRe: new RegExp('[0-9]'),
		    		    validator: function(v){
							var checkval = new RegExp('^[0-9]');
							if (checkval.test(v)) return true;
						      else
						      return false;
						    }
					}, {
						xtype: 'tbseparator',
						width: 10
					}, {
						xtype: 'button',
						id: 'scan-hide-equip-btn',
						text: Ext.app.Localize.get('End to scan'),
						iconCls: 'ext-scanbarcode',
						handler: function(Btn){
							Btn.findParentByType('toolbar').get('equip-container').show();
							Btn.ownerCt.hide();
							Ext.getCmp('scan-equip-serial').removeListener('blur', blurequiphandler);
							Ext.getCmp('equipment').getStore().setBaseParam('equipserial','');
							Ext.getCmp('equipment').getStore().setBaseParam('fullsearch:', '');
						}
					}
				]}]
            }),
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            plugins: [DevBtnEdit, SmEquipHistory, EquipHistory], // 
            sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: config.EQSingle || false }),
            columns: [DevBtnEdit, EquipHistory, SmEquipHistory, {
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name'
            }, {
                header: Ext.app.Localize.get('Serial number'),
                dataIndex: 'serial'
            }, {
                header: Ext.app.Localize.get('Model'),
                dataIndex: 'modelname'
            }, {
                header: Ext.app.Localize.get('Agreement'),
                dataIndex: 'agrmnum'
            }, {
                header: Ext.app.Localize.get('Account login'),
                dataIndex: 'vglogin'
            }, {
                header: Ext.app.Localize.get('Smart card'),
                dataIndex: 'cardserial'
            }, {
                header: Ext.app.Localize.get('Mac'),
                dataIndex: 'mac'
            }, {
                header: Ext.app.Localize.get('Chip ID'),
                dataIndex: 'chipid'
            }, {
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'descr',
                id: 'cli-dev-col-exp'
            }, {
            	header: Ext.app.Localize.get('Warranty to'),
            	dataIndex: 'garantee',
            	renderer: function(value) {
            		if(value) return value.format('d.m.Y');
	            }
            }
            ],
            store: {
                xtype: 'jsonstore',
                url: 'config.php',
                method: 'POST',
                root: 'results',
                totalProperty: 'total',
                fields: [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'string' },
                    { name: 'descr', type: 'string' },
                    { name: 'serial', type: 'string' },
                    { name: 'agrmnum', type: 'string' },
                    { name: 'vglogin', type: 'string' },
                    { name: 'agrmid', type: 'int' },
                    { name: 'cardid', type: 'int' },
                    { name: 'cardserial', type: 'string' },
                    { name: 'modelid', type: 'int' },
                    { name: 'modelname', type: 'string' },
                    { name: 'vgid', type: 'int' },
                    { name: 'serialformat', type: 'int' }, 
					{ name: 'mac', type: 'string' }, 
					{ name: 'chipid', type: 'string' }, 
                    { name: 'garantee', type: 'date', dateFormat: 'Y-m-d' }
                ],
                baseParams: Ext.apply({
                    async_call: 1,
                    getcldevices: 1,
                    devision: 27,
                    fullsearch: null,
                    equipserial: null,
                    start: 0,
                    limit: 100
                }, config.EQFilter || {})
            }
        }] 
    });
    
    Ext.getCmp('scan-sm-serial').on('valid', function() {
    	Ext.getCmp('smcards').getStore().reload({
			params: {
				fullsearch: null,
				cardserial: Ext.getCmp('scan-sm-serial').getValue()
			}});
 
    	Ext.getCmp('scan-sm-serial').setValue('');

	});
	
	Ext.getCmp('scan-equip-serial').on('valid', function() {
    	Ext.getCmp('equipment').getStore().reload({
			params: {
				fullsearch: null,
				equipserial: Ext.getCmp('scan-equip-serial').getValue()
			}});

    	Ext.getCmp('scan-equip-serial').setValue('');
	});
	
	function blurequiphandler() {
		Ext.getCmp('scan-equip-serial').focus(); 
	};
    
    function blurhandler() {
		Ext.getCmp('scan-sm-serial').focus(); 
	};
	
    SmBtnEdit.on('action', function(grid, record, rowIndex) {
        setSmartCard({
			smcardid: grid.getStore().getAt(rowIndex).get('id'),
            data: record.data,
            store: grid.getStore()
        });
    });
    
    
    SmHistory.on('action', function(grid, record, rowIndex) {
        showEquipmentHistory({
			header: 'Account', 
			type: 1,
            data: record.data,
            store: grid.getStore()
        });
    });
    
    
    EquipHistory.on('action', function(grid, record, rowIndex) {
        showEquipmentHistory({
			header: 'Agreement', 
			type: 0,
            data: record.data,
            store: grid.getStore()
        });
    });

	SmEquipHistory.on('action', function(grid, record, rowIndex) {
        showEquipmentHistory({
			header: 'Serial number', 
			type: 2,
            data: record.data,
            store: grid.getStore()
        });
    });

    DevBtnEdit.on('action', function(grid, record, rowIndex) {
        setClientDevice({
            data: record.data,
            store: grid.getStore()
        });
    });
    return Panel;
} // end getDevicesPanel()


function submitSmcardForm ( form , data, textreason, config)
{	
	if(textreason)
		form.getForm().setValues({reason: textreason});
	
	form.getForm().submit({
        url: 'config.php',
        method: 'POST',
        scope: {
            win: form.ownerCt,
            data: data
        },
        waitTitle: Ext.app.Localize.get('Connecting'),
        waitMsg: Ext.app.Localize.get('Sending data') + '...',
        success: function(form, action) {
			form.findField('id').setValue(action.result.ret);
			if(config.issmcard) {
				showUseReglament(config);
			} else {
				this.win.close();
				if(this.data.store) {
					this.data.store.reload();
					if(Ext.getCmp('equipment')) Ext.getCmp('equipment').getStore().reload();
				}
			}
        },
        failure: function(form, action) {
			form.findField('id').setValue(action.result.ret);
            Ext.Msg.error(action.result.error);
        }
    });
}


function submitAssignService ( form , data, config )
{	
	form.getForm().submit({
        url: 'config.php',
        method: 'POST',
        params: {
			async_call: 1,
			saveubservice: data.vgid,
			devision: 106,
			tarid: data.tarid,
			serial: data.serial,
			disctype: 2
		},
        scope: {
            wins: form.ownerCt
        },
        waitTitle: Ext.app.Localize.get('Connecting'),
        waitMsg: Ext.app.Localize.get('Sending data') + '...',
        success: function(form, action) {
        	
        	if(config.issmcard != 1 && action.result.id!=undefined && config.complect != 1){
        		// Update equipment -> set ServId parameter
				Ext.Ajax.request({
	                url: 'config.php',
	                method: 'POST',
	                timeout: 380000,
	                scope: this,
	                params: Ext.apply({
	                    async_call: 1,
	                    devision: 27,
	                    setagrmequip: 1,
						agrmid: config.parentagrmid,
	                    equipid: config.equipid,
	                    servid: (action.result.id > 0) ? action.result.id : 0
	                }),
	                callback: function(opt, success, res) {
	                    try {
	                        var data = Ext.decode(res.responseText);
	                        if(!data.success) {
	                            throw(data.error);
	                        }
							if(Ext.getCmp('equipment')) Ext.getCmp('equipment').getStore().reload();
							if(Ext.getCmp('gridagrmwin')) Ext.getCmp('gridagrmwin').getStore().reload();
	                    }
	                    catch(e) {
	                        Ext.Msg.error(e);
	                    }
	                }
	            });	
        	}
        	
			var win = (config.window == 0) ? Ext.getCmp('smcards') : Ext.getCmp('eqipwindow');
			if(typeof config.callbackok == 'function') {				
				config.callbackok(config.window.findByType('grid')[0]); // Callback to assign equip from Inventory->Equipment
				var selMode = 1;
			}
			Ext.getCmp('setusboxwin').destroy(); // Close dialog with services
			if(config.issmcard != 1) {
				if(selMode != 1 && Ext.getCmp('eqipwindow')) Ext.getCmp('eqipwindow').close(); // if used eqip window
				else if(config.window) config.window.close(); // if window is agrm_list
			} else {
				Ext.getCmp('smcardusbox').destroy(); // close after complect is assigned
				Ext.getCmp('smcards').getStore().reload();
			}
        }.createDelegate(config),
        failure: function(form, action) {
            var msg = !Ext.isEmpty(action.result.error) ? action.result.error : action.result.reason;
            Ext.Msg.error(msg);
        }
    });
}

/**
 * Add new smart card or edit existing
 * @param   object
 */
function setSmartCard( data )
{
    var data = data || {};
    
    var oldvgid = 0;
    try{
    	oldvgid = data.data.vgid;
    }
    catch (e) {}

    new Ext.Window({
        modal: true,
        width: 500,
        title: Ext.app.Localize.get('Smart card'),
        layout: 'fit',
        height: 300,
        id: 'smcardusbox',
        //height: 'auto',
        items: [{
            xtype: 'form',
            monitorValid: true,
            frame: true,
            url: 'config.php',
            labelWidth: 120,
            defaults: {
                xtype: 'hidden',
                anchor: '100%'
            },
            items: [{
                name: 'devision',
                value: 27
            }, {
                name: 'async_call',
                value: 1
            }, {
                name: 'id',
                value: 0
            },  {
                name: 'setsmcard',
                value: 1
            }, {
                name: 'vgid',
                value: 0
            }, {
                name: 'parentagrmid',
                value: 0
            }, {
                xtype: 'hidden',
                name: 'oldvgid',
                value: oldvgid
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Serial number'),
                name: 'serial'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Name'),
                name: 'name'
            }, {
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Description'),
                name: 'descr'
            }, {
            	xtype: 'datefield',
            	fieldLabel: Ext.app.Localize.get('Warranty expired'),
                name: 'garantee',
                format: 'Y-m-d'
            },
            
            	{
                xtype: 'container',
                fieldLabel: Ext.app.Localize.get('Link with account'),
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    iconCls: 'ext-ugroup',
                    tooltip: Ext.app.Localize.get('Accounts'),
                    handler: function(Btn){
                        showAccounts({
                            filter: {
                                usedtv: 1
                            },
                            sm: true,
                            callbackok: function(grid) {
								var record = grid.getSelectionModel().getSelected(),
								vals = this.getForm().getValues();	

								if(vals.oldvgid!=0 && vals.vgid!=record.get('vgid'))
								{
									Ext.MessageBox.minPromptWidth = 380;
									Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
									    if (btn == 'ok')
									    {																						
									    	this.getForm().setValues({ reason : text }); 
									    }
		                            }, this);
								}
							
								this.getForm().setValues({
									vgid: record.get('vgid'),
									vglogin: record.get('login'),
									parentagrmid: record.get('agrmid')
								});		
                            }.createDelegate(Btn.findParentByType('form'))
                        });
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    iconCls: 'ext-erase',
                    tooltip: Ext.app.Localize.get('Reset'),
                    handler: function(Btn) {
                    	var form = Btn.findParentByType('form');
                    	if(form.getForm().getValues().vgid==0)
                    		return;
                    	
                    	if(form.getForm().getValues().oldvgid!=0)
                    	{

							    Ext.MessageBox.minPromptWidth = 380;
                                Ext.MessageBox.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
							    if (btn == 'ok')
							    {
							    	form.getForm().setValues({ reason : text});
							    }
	                        }, this);
                    	}

                        form.getForm().setValues({
                            vgid: 0,
                            vglogin: null,
                            reasonType: 2
                        });
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'textfield',
                    name: 'vglogin',
                    readOnly: true,
                    cls: 'textfield-body-hide',
                    flex: 1
                }]
            },{
            	fieldLabel: Ext.app.Localize.get('Reason of change/return'),
                name: 'reason'
            }],
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                formBind: true,
                text: Ext.app.Localize.get('Save'),
                handler: function(Btn) {
					Btn.disable(); 
                	
					// Call method to check is smcard in complect or not
					Ext.Ajax.request({
						url: 'config.php',
						method: 'POST',
						timeout: 380000,
						params: Ext.apply({
							async_call: 1,
							devision: 27,
							checkcomplect: data.smcardid,
							smserial: Btn.findParentByType('form').getForm().findField('serial').getValue()
						}),
						callback: function(opt, success, res) {
							try {
								var result = Ext.decode(res.responseText);
								if(!result.success && result.error) {
									throw(result.error);
								}

								var record = Btn.findParentByType('form').getForm().findField('parentagrmid').getValue();					
								var config = {};
								
								var form = Btn.findParentByType('form');
								if(!form.getForm().isValid()) {
									return;
								}
								
								if(!Ext.isEmpty(result.result)) {
									if(result.result['complect'] == 1 && record > 0) {
										config.equipid = result.result['equipid'];
										config.parentagrmid = record;
										config.issmcard = 1;
									}
								}
								
								Btn.enable();

								if(form.getForm().getValues().reasonType > 0)
								{
									Ext.MessageBox.minPromptWidth = 380;
									Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
										if (btn == 'ok') {
											submitSmcardForm  ( form , data , text, config);
										} else {
											form.ownerCt.close();
										}
									});
								}
								else {
									var t = '';
									submitSmcardForm  ( form , data, t, config);
								}												
							}
							catch(e) {
								Ext.Msg.error(e);
							}
						}
					});				
                }
            }]
        }]
    }).show(null, function(win) {
        if(!this.data) {
            return;
        }

        if(this.data) {
            win.get(0).getForm().setValues(this.data);
        }
    }, data);
} // end setSmartCard()


function submitDeviceForm ( form , data)
{
	form.getForm().submit({
        url: 'config.php',
        method: 'POST',
		timeout: 380000,
        scope: {
            win: form.ownerCt,
            data: data
        },
        params: {
            async_call: 1,
            devision: 27,
            setclientdevice: 1
        },
        waitTitle: Ext.app.Localize.get('Connecting'),
        waitMsg: Ext.app.Localize.get('Sending data') + '...',
        success: function(form, action) {
            this.win.close();
            if(this.data.store) {
                this.data.store.reload();
            }
            if(!Ext.isEmpty(data.data)) {
				if(!Ext.isEmpty(action.result.ret) && Ext.isEmpty(data.data.equipid))  data.data.equipid = action.result.ret;
				if(data.data.usboxReglament == 'true') { showUseReglament(data.data); }
			}
        },
        failure: function(form, action) {
            Ext.Msg.error(action.result.error);
        }
   
    });
}


/**
 * Show history for selected equipment item
 * @param   object
 */
function showEquipmentHistory( data )
{
    var data = data || {};
    new Ext.Window({
        modal: true,
        width: 620,
        title: Ext.app.Localize.get('History'),
        layout: 'fit',
        height: 300,
        items: [{
			xtype: 'grid',
			itemId: 'equipgrid',
			loadMask: true,
			columns: [{
					header: Ext.app.Localize.get(data.header),
					itemId: 'eqname',
					dataIndex: 'name',
					width: 150		
				}, {
					header: Ext.app.Localize.get('Since'),
					dataIndex: 'timefrom',
					width: 150
				}, {
					header: Ext.app.Localize.get('To'),
					dataIndex: 'timeto',
					width: 150
				}, {
					header: Ext.app.Localize.get('Reason'),
					dataIndex: 'reason',
					width: 150
				}],
			store: {
                    xtype: 'jsonstore',
                    method: 'POST',
                    root: 'results',
                    autoLoad: true,
                    fields: ['recordid', 'name', 'timefrom', 'timeto', 'reason'],
                    baseParams: {
                        async_call: 1,
                        devision: 27,
                        getequipmenthistory: 1,
                        type: data.type,
                        id: data.data.id
                    }
                }			
			}]
    }).show(null, function(win) {
        //if(!this.data) {
            //return;
        //}
    }, data);
} // end showEquipmentHistory()



/**
 * Add new client device or edit existing
 * @param   object
 */
function setClientDevice( data , store)
{
    var data = data || {
        type: 0
    };
    
    var oldagrmid = 0;
    try{
    	oldagrmid = data.data.agrmid;
    }
    catch (e) {}

    new Ext.Window({
        modal: true,
        width: 500,
        height: 360,
        title: Ext.app.Localize.get('Customer equipment'),
        layout: 'fit',
        items: [{
            xtype: 'form',
            monitorValid: true,
            frame: true,
            url: 'config.php',
            labelWidth: 120,
			monitorValid: true,
            defaults: {
                xtype: 'hidden',
                anchor: '100%'
            },
            items: [{
                name: 'id',
                value: (!Ext.isEmpty(data.data) && data.data.id > 0) ? data.data.id : 0 
            }, {
                name: 'agrmid'
            },{
                name: 'equipid'
            },{
                name: 'usboxReglament'
            },{
                name: 'callbackok'
            },{
                name: 'is_equipment_set'
            }, {
                name: 'cardid'
            },{
                name: 'vgid'
            },{
                name: 'vglogin'
            },{
                name: 'oldagrmid',
                xtype: 'hidden',
                value: oldagrmid
            },{
                xtype: 'combo',
                fieldLabel: Ext.app.Localize.get('Model'),
                itemId: 'model',
                tpl: '<tpl for="."><div class="x-combo-list-item">{name} {[ values.descr ? "(" + values.descr + ")" : "" ]}</div></tpl>',
                hiddenName: 'modelid',
                mode: 'local',
                triggerAction: 'all',
                valueField: 'modelid',
                displayField: 'name',
                editable: false,
                value: null,
                allowBlank: false,
                store: {
                    xtype: 'jsonstore',
                    url: 'config.php',
                    method: 'POST',
                    root: 'results',
                    autoLoad: true,
                    fields: ['modelid', 'name', 'descr', 'identitytype'],
                    baseParams: {
                        async_call: 1,
                        devision: 27,
                        getmodels: 1
                    }
                },
				listeners: {
					select: function(combo, record, idx) {
						var form = combo.findParentByType('form').getForm(),
							chipid = form.findField('chipid'),
							mac = form.findField('mac'),
							serial = form.findField('serial');
							
						//restore default parameters
						chipid.allowBlank = true; mac.allowBlank = true; serial.allowBlank = true;
						
						//set false to allowBlank
						switch(record.get('identitytype')) {
							case 0: chipid.allowBlank = false; break;
							case 1: mac.allowBlank = false; break;
							case 2: serial.allowBlank = false; break;
						}						
						// validate fields
						chipid.validate(); mac.validate(); serial.validate();
					}
				}
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Name'),
                name: 'name'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Serial number'),
                name: 'serial',
				itemId: 'serial'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('MAC'),
                name: 'mac',
				itemId: 'mac'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Chip ID'),
                name: 'chipid',
				itemId: 'chipid'
            }, {
                xtype: 'checkbox', 
                boxLabel: Ext.app.Localize.get('x16 Format'),
                name: 'serialformat' 
            },{
                xtype: 'datefield', 
                format: 'Y-m-d',
                fieldLabel: Ext.app.Localize.get('Warranty expired'),
                name: 'garantee' 
            },{
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Comment'),
                name: 'descr'
            }, {
                xtype: 'container',
                fieldLabel: Ext.app.Localize.get('Link with agreement'),
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    iconCls: 'ext-agreement',
                    tooltip: Ext.app.Localize.get('Agreements'),
                    handler: function(Btn){
                        selectAgreements({
                            sm: true,
                            usboxReglament: true,
                            callbackok: function(grid) {
									var record = grid.getSelectionModel().getSelected(),
                                    vals = this.getForm().getValues();
		                            if(vals.oldagrmid!=0 && vals.agrmid!=record.get('agrmid'))
		                            {	
		                            	Ext.MessageBox.minPromptWidth = 380;
		                            	Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'),  function(btn, text){
												if (btn == 'ok')
												{
													this.getForm().setValues({ reason : text }); 
												}
					                        }, this);
		                            }

								this.getForm().setValues({
									is_equipment_set: (vals.agrmid==0 && vals.vgid==0 && vals.cardid!=0) ? true : false, 
									agrmid: record.get('agrmid'),
									agrmnum: record.get('number'),
									vgid: vals.agrmid != record.get('agrmid') ? 0 : vals.vgid,
									vglogin: vals.agrmid != record.get('agrmid') ? null : vals.vglogin,
									cardid: vals.agrmid != record.get('agrmid') ? 0 : vals.cardid,
									equipid: Btn.findParentByType('form').getForm().getValues().id,
									usboxReglament: true,
									callbackok: this.callbackok
                                });
                            }.createDelegate(Btn.findParentByType('form'))
                        });
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    iconCls: 'ext-erase',
                    tooltip: Ext.app.Localize.get('Reset'),
                    handler: function(Btn) {
                    	var form = Btn.findParentByType('form');
                    	if(form.getForm().getValues().agrmid==0)
                    		return;
                    		
                    	if(form.getForm().getValues().oldagrmid!=0)
                            {
                            	Ext.MessageBox.minPromptWidth = 380;
                            	Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
									if (btn == 'ok')
									{	
										form.getForm().setValues({ reason : text}); 
																										
										Ext.Ajax.request({
							                url: 'config.php',
							                method: 'POST',
							                timeout: 380000,
							                scope: this,
							                params: Ext.apply({
							                    async_call: 1,
							                    devision: 27,
							                    setagrmequip: 1,
							                    equipid: form.getForm().getValues().id,
												agrmid: 0,
							                    reason: form.getForm().findField('reason').getValue()
							                }),
							                callback: function(opt, success, res) {
							                    try {
							                        var data = Ext.decode(res.responseText);
							                        if(!data.success) {
							                            throw(data.error);
							                        }
													form.getForm().findField('agrmnum').setValue(null)
							                    }
							                    catch(e) {
							                        Ext.Msg.error(e);
							                    }
							                }
							            });	
										
									}
								}, this);								
                            }
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'textfield',
                    name: 'agrmnum',
                    readOnly: true,
                    cls: 'textfield-body-hide',
                    flex: 1
                }]
            },{
                name: 'reason',
                xtype: 'hidden'
            }],
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                bindForm: true,
                text: Ext.app.Localize.get('Save'),
                handler: function(Btn) {
                    var form = Btn.findParentByType('form');
                    
                    if(!form.getForm().isValid()) {
                        return;
                    }

					if(!Ext.isEmpty(data.data)) {
						data.data = {};
						data.data.parentagrmid = form.getForm().findField('agrmid').getValue();
						data.data.equipid = form.getForm().findField('equipid').getValue();
						data.data.usboxReglament = form.getForm().findField('usboxReglament').getValue();
						data.data.callbackok = form.getForm().findField('callbackok').getValue();
						data.data.serial = form.getForm().findField('serial').getValue();
					}

                    var vals = form.getForm().getValues();
                    
                    if("true" == vals.is_equipment_set) 
                    {
                		Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('The set of equipment will be broken when assigning contract. Continue?'), function(Btn){
			            	if(Btn != 'yes')
			            		form.ownerCt.close();
			            	 else 
			            	 	submitDeviceForm(form, data);			               
                		});
                    }
	              	else {
						if(vals.agrmid > 0 && vals.id == 0 ) data.data = { parentagrmid: vals.agrmid, usboxReglament: 'true' }
	              		submitDeviceForm(form, data);
					}
                }
            }]
        }]
    }).show(null, function(win) {
        if(!this.data) {
            return
        }

        if(this.data) {
            win.get(0).getForm().setValues(this.data);
        };

        // Repair combo
        var form = win.get(0);
        form.get('model').setValue(this.data.modelid);
        form.get('model').setRawValue(this.data.modelname);
    }, data);
} // end setClientDevice()


/**
 * Manage models
 * @param   object
 */
function setModel( data )
{
    var data = data || {};

    var RmModel = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Remove model'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-drop'
    });

    new Ext.Window({
        title: Ext.app.Localize.get('Models'),
        modal: true,
        layout: 'anchor',
        width: 600,
        height: 530,
        items: [{
            xtype: 'form',
            url: 'config.php',
            frame: true,
            anchor:'100% 40%',
            monitorValid: true,
            defaults: {
                anchor: '100%',
                xtype: 'hidden'
            },
            items: [{
                name: 'modelid',
                value: 0
            }, {
                xtype: 'combo',
                fieldLabel: Ext.app.Localize.get('Type'),
                editable: false,
                value: null,
                valueField: 'id',
                displayField: 'name',
                hiddenName: 'type',
                mode: 'local',
                triggerAction: 'all',
                allowBlank: false,
                store: {
                    xtype: 'jsonstore',
                    url: 'config.php',
                    method: 'POST',
                    root: 'results',
                    fields: ['id', 'name'],
                    autoLoad: true,
                    baseParams: {
                        async_call: 1,
                        devision: 27,
                        getmodeltypes: 1
                    }
                }
            },{
                xtype: 'combo',
                fieldLabel: Ext.app.Localize.get('Equipment identifier'),
                editable: false,
                value: null,
                valueField: 'id',
                displayField: 'name',
                hiddenName: 'identitytype',
                mode: 'local',
                triggerAction: 'all',
                allowBlank: false,
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [
                        [0, Ext.app.Localize.get('Chip ID')],
                        [1, Ext.app.Localize.get('MAC')],
                        [2, Ext.app.Localize.get('Serial number')]
                    ]
                }
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Name'),
                name: 'name',
                allowBlank: false,
                value: null
            }, {
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Description'),
                name: 'descr',
                value: null
            }],
            buttons: [{
                text: Ext.app.Localize.get('New model'),
                itemId: 'newItem',
                iconCls: 'ext-add',
                disabled: true,
                handler: function(Btn) {
                    var form = Btn.findParentByType('form');
                    form.getForm().reset();
                    form.ownerCt.get(1).getSelectionModel().clearSelections();
                    Btn.disable();
                }
            }, {
                text: Ext.app.Localize.get('Save'),
                handler: function(Btn) {
                    var form = Btn.findParentByType('form');

                    if(!form.getForm().isValid()) {
                        return;
                    }

                    form.getForm().submit({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            async_call: 1,
                            devision: 27,
                            setmodel: 1
                        },
                        scope: {
                            grid: form.ownerCt.get(1)
                        },
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action) {
                            this.grid.getStore().reload();
                        },
                        failure: function(form, action) {
                            Ext.Msg.error(action.result.error);
                        }
                    });
                }
            }]
        }, {
            xtype: 'grid',
            anchor:'100% 60%',
            enableHdMenu: false,
            autoExpandColumn: 'model-type-descr-exp',
            loadMask: true,
            listeners: {
                rowclick: function(grid, idx) {
                    var record = grid.getStore().getAt(idx);
                    var form = grid.findParentByType('window').get(0);

                    form.getForm().setValues(record.data);
                    form.getFooterToolbar().get('newItem').enable();
                }
            },
            columns: [{
                header: Ext.app.Localize.get('Type'),
                dataIndex: 'type',
                renderer: function(value, meta, record) {
                    return record.get('strtype');
                }
            }, {
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name'
            }, {
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'descr',
                id: 'model-type-descr-exp'
            }, RmModel],
            plugins: [RmModel],
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
            bbar: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Reload'),
                handler: function(Btn) {
                    Btn.findParentByType('grid').getStore().reload();
                }
            }],
            store: {
                xtype: 'jsonstore',
                url: 'config.php',
                method: 'POST',
                root: 'results',
                autoLoad: true,
                fields: ['modelid', 'type', 'strtype', 'name', 'descr', 'identitytype'],
                baseParams: {
                    async_call: 1,
                    devision: 27,
                    getmodels: 1
                }
            }
        }]
    }).show();

    RmModel.on('action', function(grid, record, rowIndex) {
        Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };

            var list = {};

            list['modeltypes[' + this.record.get('modelid') + '][strtype]'] = this.record.get('strtype');

            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: Ext.apply({
                    async_call: 1,
                    devision: 27,
                    delmodel: 1
                }, list),
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);

                        if(!data.success) {
                            throw(data.error);
                        }

                        this.grid.getStore().reload();
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record,
            idx: rowIndex
        });
    });
} // end setModel()


/**
 * Form to load CSV data to the server
 */
function uploadCSV(config) {
    var config = config || {
        dataType: 'equipment'
    };

    if(config.dataType != 'equipment' && config.dataType != 'smartcard') {
        config.dataType = 'equipment';
    }

    if(config.modelHide == true) {
        config.modelDisabled = true;
    }
    
    if(config.typeHide == true) {
        config.typeDisabled = true;
    }
    
    if(config.formatHide == true) {
        config.formatDisabled = true;
    }
    
    if(config.warrantyHide == true) {
        config.warrantyDisabled = true;
    }


    new Ext.Window({
        title: Ext.app.Localize.get('Upload'),
        width: 337,
        modal: true,
        items: [{
            xtype: 'form',
            url: 'config.php',
            autoHeight: true,
            fileUpload: true,
            labelWidth: 70,
            monitorValid: true,
            listeners: {
                beforerender: function(form) {
                    if(config.modelHide) {
                        form.get('model').destroy();
                    }
                    if(config.typeHide) {
                        form.get('type').destroy(); 
                    }
                    if(config.formatHide) {
                        form.get('serialformat').destroy(); 
                    }                    
                }
            },
            defaults: {
                anchor: '100%',
                xtype: 'hidden',
                allowBlank: false
            },
            frame: true,
            items: [{
                name: 'devision',
                value: 27
            }, {
                name: 'async_call',
                value: 1
            }, {
                name: 'identitytype',
                value: null
            }, {
                name: 'setfromfile',
                value: config.dataType || 'equipment'
            }, {
                xtype: 'combo',
                itemId: 'type',
                fieldLabel: Ext.app.Localize.get('Type'),
                hidden: config.typeHide || false,
                disabled: config.typeDisabled || false,
                editable: false,
                valueField: 'equipmenttype',
                displayField: 'name',
                mode: 'local',
                triggerAction: 'all',
                hiddenName: 'equipmenttype',
                allowBlank: false,
                store: {
                    xtype: 'arraystore',
                    fields: ['equipmenttype', 'name'],
                    data: [
                        [0, Ext.app.Localize.get('Equipment')],
                        [1, Ext.app.Localize.get('Equipment set')]
                    ]
                }
            },{
                xtype: 'combo',
                itemId: 'model',
                fieldLabel: Ext.app.Localize.get('Model'),
                hidden: config.modelHide || false,
                disabled: config.modelDisabled || false,
                editable: false,
                valueField: 'modelid',
                displayField: 'name',
                mode: 'remote',
                triggerAction: 'all',
                hiddenName: 'modelid',
                allowBlank: false,
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    fields: ['modelid', 'name', 'descr', 'identitytype'],
                    baseParams: {
                        async_call: 1,
                        devision: 27,
                        getmodels: 1
                    }
                },
				listeners: {
					select: function(combo, record, idx) {
						combo.findParentByType('form').getForm().findField('identitytype').setValue(record.get('identitytype'));
					}
				}
            }, {
                xtype: 'fileuploadfield',
                emptyText: Ext.app.Localize.get('Select file'),
                fieldLabel: Ext.app.Localize.get('File'),
                name: 'upcontent',
                allowBlank: false,
                buttonCfg: {
                    text: '',
                    iconCls: 'ext-upload'
                }
            },{
                xtype: 'checkbox', 
                valueField: 'hexformat',
                boxLabel: Ext.app.Localize.get('x16 Format'),
                hidden: config.formatHide || false,
                disabled: config.formatDisabled || false,
                itemId: 'serialformat',
                name: 'serialformat'
            }, { 
                xtype: 'datefield', 
                fieldLabel: Ext.app.Localize.get('Warranty expired'),
                name: 'garantee',
                format: 'Y-m-d'
            }],
            buttons: [{
                text: Ext.app.Localize.get('Upload'),
                formBind: true,
                handler: function(Btn) {
                    var form = Btn.findParentByType('form');

                    if(!form.getForm().isValid()) {
                        return false;
                    }

                    form.getForm().submit({
                        params: {
							
                        },
                        scope: {
                            form: form,
                            config: config
                        },
                        success: function(form, action) {
                            try {
                                if(this.config.callback) {
                                    this.config.callback(form, action);
                                }
                                this.form.findParentByType('window').close();
                            }
                            catch(e) {
                                Ext.Msg.error(e);
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.error(action.result.error);
                        }
                    });
                }
            }]
        }]
    }).show();
} // end uploadCatCSV()

/**
 * Set vgroup equipment
 *
 */
function setVgEquipment( config )
{
    var config = config || {
        data: null
    };

    if(!config.data.vgid) {
        Ext.Msg.error(Ext.app.Localize.get("Data mismatch"));
        return false;
    }

    var UnlinkDev = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Remove'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-drop'
    });
    
    var UnlinkEquip = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Remove'),
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-drop'
    });

    new Ext.Window({
        title: Ext.app.Localize.get('Equipment'),
        modal: true,
        width: 700,
        height: 600,
        resizable: false,
        constrain: true,
        layout: 'fit',
        setPB: function(grid) {
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
                submitValue: false,
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
        },
        items: {
            xtype: 'panel',
            plain: true,
			layout: 'card',
            activeItem: (config.data.usecas > 0) ? 0 : 1,
            items: [{ // card 1
                url: 'config',
                xtype: 'form',
                frame: true,
                labelWidth: 140,
                defaults: {
                    anchor: '100%',
                    xtype: 'hidden'
                },
                smartStatus: function( stop ) {
                    if(this.TaskRun) {
                        if(stop) {
                            this.TaskRun.stopAll();
                            delete this.TaskRun;
                            return;
                        }
                    }
                    else {
                        this.TaskRun = new Ext.util.TaskRunner(),
                        this.TaskRun.start({
                            run: function() {
                                Ext.Ajax.request({
                                    url: 'config.php',
                                    timeoute: 380000,
                                    params: {
                                        async_call: 1,
                                        devision: 27,
                                        getsmartstatus: 1,
                                        id: this.data.id
                                    },
                                    scope: {
                                        form: this.form
                                    },
                                    callback: function(options, success, response) {
                                        try {
                                            var data = Ext.decode(response.responseText);

                                            if(!data['success']) {
                                                throw(data['error'] || null);
                                            }

                                            if(!Ext.isEmpty(data.data.status)) {
                                                this.form.getForm().setValues({
                                                    status: data.data.status,
                                                    message: data.data.message
                                                });

                                                throw(null);
                                            }
                                        }
                                        catch(e) {
                                            if(e) {
                                                Ext.Msg.error(Ext.app.Localize.get('Unknown smartcard status') + ': ' + e);
                                            }
                                            this.form.smartStatus(true);
                                        }
                                    }
                                });
                            }.createDelegate({
                                data: this.getForm().getValues(),
                                form: this
                            }),
                            interval: 5000
                        });
                    }
                },
                loadForm: function(config) {
                    if(config.data && config.data.usecas > 0) {
                        this.load({
                            url: 'config.php',
                            method: 'POST',
                            params: {
                                async_call: 1,
                                devision: 27,
                                getvgsmartcard: 1,
                                vgid: config.data.vgid || -1
                            },
                            scope: {
                                form: this,
                                grid: this.get('devs'),
                                config: config
                            },
                            success: function(form, action) {
                                if(action.result.data.id) {
                                    this.grid.getStore().setBaseParam('cardid', action.result.data.id).setBaseParam('agrmid', this.config.data.agrmid).reload();
                                    if(Ext.isEmpty(action.result.data.status)) {
                                        this.form.smartStatus();
                                    }
                                }
                                this.grid.getTopToolbar().get('linkItem')[action.result.exceeded || !action.result.data.id ? 'disable' : 'enable']();
                                //this.grid.getTopToolbar().get('activatesmcard')[action.result.exceeded || !action.result.data.id ? 'disable' : 'enable']();
                            },
                            failure: function(form, action) {
                                Ext.Msg.error(action.result.error);
                            }
                        });
                    }
                },
                listeners: {
                    afterrender: function(form) {
                        form.loadForm(config);
                    }
                },
                items: [{
                    name: 'id',
                    value: 0
                }, {
                    name: 'vgid',
                    value: 0
                }, {
                    name: 'name',
                    value: null
                }, {
                    name: 'descr',
                    value: null
                }, {
                    name: 'serviceid'
                }, {
                    name: 'status',
                    value: null
                },{
                    name: 'reason',
                    value: null
                }, {
                    xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Smart card'),
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-smartcard',
                        handler: function(Btn) {
							var f = Btn.ownerCt.ownerCt.getForm();
                            showDevicesPanel({
								parentagrmid: config.data.agrmid,
                                modal: true,
                                activeItem: 0,
                                disableEquipments: true,
                                SMSingle: true,
                                callback: function(grid) {
                                    var record = grid.getSelectionModel().getSelected(),
                                        vals = this.getForm().getValues();
					
                                    if(record) {
                                    	var existedCard = f.findField('serial').getValue();
                                        record.data.vgid = vals.vgid;
                                        this.getForm().LastFormData = this.getForm().getValues();
										
										if(f.findField('id').getValue() > 0) {
											/*
											* Link smartcard with account entry
											*/
											if(Ext.isEmpty(existedCard)) {
												Ext.Ajax.request({
													url: 'config.php',
													timeout: 380000,
													method: 'POST',									
													params: Ext.apply({
														async_call: 1,
														devision: 27,
														setvgcard: 1,
														id: record.get('id'),
														vgid: Ext.get('vgid').getValue()
													}),
													callback: function(opt, success, res) {
														try {
															var data = Ext.decode(res.responseText);
															if(!data.success && data.error) {
																throw(data.error);
															}
														} 
														catch(e) {
															Ext.Msg.error(e);
														}
													}			
												});												
											} else {
												/*
												* Replace existed smartcard
												*/
					                            Ext.MessageBox.minPromptWidth = 380;
					                            Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
												    if (btn != 'ok')
												    	return;
												    if (btn == 'ok')
												    {
														Ext.Ajax.request({
															url: 'config.php',
															timeout: 380000,
															method: 'POST',									
															params: Ext.apply({
																async_call: 1,
																devision: 27,
																replacesmartcard: 1,
																id: record.get('id'),
																vgid: Ext.get('vgid').getValue(),
																reason: text
															}),
															callback: function(opt, success, res) {
																try {
																	var data = Ext.decode(res.responseText);
																	if(!data.success && data.error) {
																		throw(data.error);
																	}
																}
																catch(e) {
																	Ext.Msg.error(e);
																}
															}
														});
												    }
												});
											}											
										} else {
											this.getForm().submit({
												url: 'config.php',
												timeout: 380000,
												method: 'POST',
												params: {
													async_call: 1,
													devision: 27,
													setsmcard: 1
												},
												scope: {
													form: this,
													grid: this.get('devs'),
													data: record.data
												},
												waitTitle: Ext.app.Localize.get('Connecting'),
												waitMsg: Ext.app.Localize.get('Sending data') + '...',
												success: function(form, action) {
													this.form.smartStatus();
													this.grid.getTopToolbar().get('linkItem').enable();
													this.grid.getTopToolbar().get('activatesmcard').enable();
													this.grid.getStore().setBaseParam('cardid', this.data.id || -1).reload();
												},
												failure: function(form, action) {
													form.setValues(form.LastFormData);
													Ext.Msg.error(action.result.error);
												}
											});
										}    
										
										this.getForm().setValues({
                                            id: record.get('id'),
                                            serial: record.get('serial'),
                                            name: record.get('name'),
                                            descr: record.get('descr'),
                                            status: null,
                                            message: Ext.app.Localize.get('Unknown')
                                        });                                   
                                    }
                                }.createDelegate(Btn.findParentByType('form'))
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'button',
                        iconCls: 'ext-erase',
                        handler: function(Btn) {
                            var form = Btn.findParentByType("form"),
                                vals = form.getForm().getValues();
                                
                            if(!vals.id || vals.id==0) {
                                return;
                            }
                            Ext.MessageBox.minPromptWidth = 380;
                            Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
							    if (btn != 'ok')
							    	return;
							    if (btn == 'ok')
							    {
							    										
							        form.getForm().setValues({
		                                vgid: 0,
		                                status: null,
		                                message: Ext.app.Localize.get('Unknown'),
		                                reason: text
		                            });
		
									form.smartStatus(true);

									
		                            form.getForm().submit({
		                                url: 'config.php',
		                                method: 'POST',
		                                timeout: 380000,
		                                params: {
		                                    async_call: 1,
		                                    devision: 27,
		                                    setvgcard: 1
		                                },
		                                scope: {
		                                    grid: form.get('devs'),
		                                    data: vals
		                                },
		                                waitTitle: Ext.app.Localize.get('Connecting'),
		                                waitMsg: Ext.app.Localize.get('Sending data') + '...',
		                                success: function(form, action) {
		                                    form.reset();
		                                    form.setValues({
		                                        vgid: this.data.vgid
		                                    });
		                                    this.grid.getTopToolbar().get('linkItem').disable();
		                                    this.grid.getTopToolbar().get('activatesmcard').disable();
											this.grid.getStore().setBaseParam('cardid', -1).setBaseParam('vgid', this.data.vgid).reload();
		                                },
		                                failure: function(form, action) {
		                                    Ext.Msg.error(action.result.error);
		                                }
		                            });
							    }
							});

                            
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'textfield',
                        name: 'serial',
                        id: 'assignedserial',
                        readOnly: true,
                        cls: 'textfield-body-hide',
                        flex: 1
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Charge by category'),
                    name: 'servicename',
                    cls: 'textfield-body-hide',
                    readOnly: true,
                    submitValue: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Status'),
                    name: 'message',
                    cls: 'textfield-body-hide',
                    value: Ext.app.Localize.get('Unknown'),
                    readOnly: true,
                    submitValue: false
                }, {
                    xtype: 'grid',
                    height: 502,
                    PAGELIMIT: 100,
                    border: false,
                    itemId: 'devs',
                    id: 'devsgrd',
                    autoExpandColumn: 'eqp-card-item-col-exp',
                    loadMask: true,
                    listeners: {
                        beforerender: function(grid) {
                            grid.store.on('load', function(store){
                            	grid.getTopToolbar().get('linkItem')[true == store.reader.jsonData.exceeded ? 'disable' : 'enable']();
                            }, grid);
                        }
                    },
                    tbar: [{
                        xtype: 'button',
                        iconCls: 'ext-add',
                        text: Ext.app.Localize.get('Link with equipment'),
                        itemId: 'linkItem',
                        handler: function(Btn) {
                            if(!config.data.agrmid) {
                                Ext.Msg.error(Ext.app.Localize.get("Undefined") + ": " + Ext.app.Localize.get("Agreement"));
                                return;
                            }

                            showDevicesPanel({
								parentagrmid: config.data.agrmid,
								notassign: true,
                                modal: true,
                                activeItem: 1,
                                disableSmartCards: true,
                                EQSingle: true,
                                EQFilter: {
                                    agrmid: config.data.agrmid
                                },
                                callback: function(grid) {
                                    var record = grid.getSelectionModel().getSelected(),
										form = Btn.findParentByType('form'),
										vals = Btn.findParentByType('form').getForm().getValues(),
										grid = Btn.findParentByType('grid');
                                   
                                    if(!record) {
                                        return;
                                    }
                                    
                                    if(record.data.cardid > 0) {

												Ext.Ajax.request({
													url: 'config.php',
													method: 'POST',
													scope: this,
													timeout: 380000,
													params: Ext.applyIf({
														async_call: 1,
														devision: 27,
														setcardequip: 1,
														tarusbox: config.data.tarid || 0,
														cardid: vals.id,
														equipid: record.get('id')
													}),
													callback: function(opt, success, res) {
														try {
															grid.getStore().reload();
															
															var data = Ext.decode(res.responseText);
															if(!data.success && data.error) {
																throw(data.error);
															}
															
															if(data.callusbox) {
																showUBAddControl({
																	tarid: config.data.tarid,
																	common: 1,
																	categoryFilter: {
																		uuid: data.tag
																	},
																	servdata: {
																		data: {
																			vgid: config.data.vgid
																		}
																	},
																	success: function(form, action) {
																		form.ownerCt.close();
																	}.createDelegate(this)
																});
															}
														}
														catch(e) {
															Ext.Msg.error(e);
														}
													}
												});								

									} else {
										Ext.Ajax.request({
											url: 'config.php',
											method: 'POST',
											scope: this,
											timeout: 380000,
											params: Ext.applyIf({
												async_call: 1,
												devision: 27,
												setcardequip: 1,
												cardid: vals.id,
												equipid: record.get('id'),
												tarusbox: config.data.tarid || 0,
											}),
											callback: function(opt, success, res) {
												try {
													grid.getStore().reload();
													
													var data = Ext.decode(res.responseText);
													if(!data.success && data.error) {
														throw(data.error);
													}
													
													if(data.callusbox) {
														showUBAddControl({
															tarid: config.data.tarid,
															common: 1,
															categoryFilter: {
																uuid: data.tag
															},
															servdata: {
																data: {
																	vgid: config.data.vgid
																}
															},
															success: function(form, action) {
																form.ownerCt.close();
															}.createDelegate(this)
														});
													}
												}
												catch(e) {
													Ext.Msg.error(e);
												}
											}
										});
									}
                                }.createDelegate({
                                    grid: Btn.findParentByType('grid'),
                                    form: Btn.findParentByType('form'),
                                    vals: Btn.findParentByType('form').getForm().getValues(),
                                    config: config
                                })
                            });
                        }
                    }, '-', {
						xtype: 'button',
                        iconCls: 'ext-smartcard-green',
                        text: Ext.app.Localize.get('Activate smartcard'),
                        itemId: 'activatesmcard',
                        handler: function(Btn) {
							Ext.Ajax.request({
								url: 'config.php',
								method: 'POST',
								timeout: 380000,
								params: Ext.applyIf({
									async_call: 1,
									devision: 27,
									activatesmcard: Btn.findParentByType('form').getForm().findField('id').getValue()
								}),
								callback: function(opt, success, res) {
									try {
										
										var data = Ext.decode(res.responseText);
										if(success && data.success && data['success'] != false) {
											Ext.Msg.alert(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Smartcard activated'));
										}
										else {
											Ext.Msg.error(Ext.app.Localize.get(data.error));
										}
										if(!data.success && Ext.isEmpty(data.error)) {
											Ext.Msg.error(Ext.app.Localize.get('Unknown error'));
										}
									}
									catch(e) {
										Ext.Msg.error(Ext.app.Localize.get(e));
									}
								}
							});
						}
					}, '-', {
						xtype: 'button',
                        iconCls: 'ext-hand',
                        text: Ext.app.Localize.get('PIN reset'),
                        handler: function (Btn) {
                            var form = Btn.findParentByType('form'),
                                smartcardnumber = form.getForm().findField('serial').getValue(),
                                vals = form.getForm().getValues();
                            new Ext.Window({
                                modal: true,
                                title: Ext.app.Localize.get('PIN reset'),
                                width: 300,
                                layout: 'fit',
                                items: [{
                                    xtype: 'form',
                                    frame: true,
                                    autoHeight: true,
                                    monitorValid: true,
                                    defaults: {
                                        anchor: '100%'
                                    },
                                    items: [{
                                        xtype: 'hidden',
                                        name: 'smartcardnumber',
                                        value: smartcardnumber
                                    }, {
                                        xtype: 'textfield',
                                        width: 200,
                                        name: 'newpin',
                                        fieldLabel: Ext.app.Localize.get('New PIN'),
                                        regex: new RegExp('^[0-9]{4,4}$'),
                                        value: '0000',
                                        allowBlank: false,
                                        toggleButton: function(disable){
                                            this.findParentByType('window').buttons[0].setDisabled(disable);
                                        },
                                        listeners: {
                                            valid: function(field) {
                                                field.toggleButton(false);
                                            },
                                            invalid: function(field) {
                                                field.toggleButton(true);
                                            }
                                        }
                                    }]
                                }],
                                
                                buttonAlign: 'center',
                                buttons: [{
                                    xtype: 'button',
                                    text: Ext.app.Localize.get('Send'),
                                    formBind: true,
                                    handler: function(Btn) {
                                        var form = Btn.findParentByType('window').get(0).getForm();
                                        
                                        if(!form.isValid()) {
                                            return;
                                        }
                                        
                                        form.submit({
                                            url: 'config.php',
                                            waitTitle: Ext.app.Localize.get('Connecting'),
                                            waitMsg: Ext.app.Localize.get('Sending data') + '...',
                                            params: {
                                                async_call: 1, 
                                                devision: 27,
                                                resetpin: 1
                                            },
                                            scope: {
                                                win: Btn.findParentByType('window')
                                            },
                                            success: function(form, action) {
                                                console.log('[SUCCESS]');
                                                return;
                                                this.win.close();
                                                grid.store.reload();
                                            },
                                            failure: function(form, action) {
                                                if(action.result.error) {
                                                    Ext.Msg.error(Ext.app.Localize.get(action.result.error));
                                                }
                                            }
                                        });
                                    }
                                }]
                            }).show();
                        }
                    }],
                    plugins: [UnlinkDev],
                    columns: [{
                        header: Ext.app.Localize.get('Name'),
                        dataIndex: 'name'
                    }, {
                        header: Ext.app.Localize.get('Serial number'),
                        dataIndex: 'serial'
                    }, {
                        header: Ext.app.Localize.get('Chip ID'),
                        dataIndex: 'chipid'
                    },{
                        header: Ext.app.Localize.get('MAC'),
                        dataIndex: 'mac'
                    }, {
                        header: Ext.app.Localize.get('Description'),
                        dataIndex: 'descr',
                        id: 'eqp-card-item-col-exp'
                    }, UnlinkDev],
                    store: {
                        xtype: 'jsonstore',
                        root: 'results',
                        totalProperty: 'total',
                        fields: [
                            { name: 'id', type: 'int' },
                            { name: 'name', type: 'string' },
                            { name: 'descr', type: 'string' },
                            { name: 'serial', type: 'string' },
                            { name: 'agrmnum', type: 'string' },
                            { name: 'vglogin', type: 'string' },
                            { name: 'agrmid', type: 'int' },
                            { name: 'cardid', type: 'int' },
                            { name: 'modelid', type: 'int' },
                            { name: 'modelname', type: 'string' },
                            { name: 'vgid', type: 'int' },
                            { name: 'serialformat', type: 'int' },
							{ name: 'chipid', type: 'string' }, 
							{ name: 'mac', type: 'string' }, 
                            { name: 'garantee', type: 'date', dateFormat: 'Y-m-d' } 
                        ],
                        baseParams: {
                            async_call: 1,
                            devision: 27,
                            getcldevices: 1,
                            cardid: config.data.cardid || -1,
                            start: 0,
                            limit: 100,
                            singlecards: 1
                        }
                    }
                }]
            }, {
            	// card 2
				xtype: 'grid',
				anchor: '100%',
				id: 'equipToVgroup',
				tbar: new Ext.Toolbar({
					items: [{
						xtype: 'container',
						layout: 'toolbar',
						getGrid: function() {
							return this.ownerCt.ownerCt;
						},
						items: [{
							xtype: 'button',
							text: Ext.app.Localize.get('Add'),
							iconCls: 'ext-add',
							handler: function(Btn) {
								showDevicesPanel({
									vgid: config.data.vgid,
	                                modal: true,
	                                activeItem: 1,
	                                disableSmartCards: true,
	                                EQSingle: true,
	                                EQFilter: {
	                                    agrmid: config.data.agrmid
	                                },
	                                callback: function(grid) {
	                                    var record = grid.getSelectionModel().getSelected(),
											grid = Btn.findParentByType('grid');

	                                    if(!record) {
	                                        return;
	                                    }

										Ext.Ajax.request({
											url: 'config.php',
											method: 'POST',
											scope: this,
											timeout: 380000,
											params: Ext.applyIf({
												async_call: 1,
												devision: 27,
												setvgequip: 1,
												equipid: record.get('id'),
												vgid: config.data.vgid
											}, record.data),
											callback: function(opt, success, res) {
												try {
													var data = Ext.decode(res.responseText);
													if(!data.success && data.error) {
														throw(data.error);
													}
													Ext.getCmp('eqipwindow').close();
													grid.getStore().reload();
												}
												catch(e) {
													Ext.Msg.error(e);
												}
											}
										});	
									
									}.createDelegate({
										grid: Btn.findParentByType('grid'),
										config: config
									})
								});
								
							}
						}]
					}]
				}),
				plugins: [UnlinkEquip],
                columns: [{
                    header: Ext.app.Localize.get('Name'),
                    dataIndex: 'name'
                }, {
                    header: Ext.app.Localize.get('Serial number'),
                    dataIndex: 'serial'
                }, {
                    header: Ext.app.Localize.get('Model'),
                    dataIndex: 'modelname',
                }, {
                    header: Ext.app.Localize.get('Chip ID'),
                    dataIndex: 'chipid',
                }, {
                    header: Ext.app.Localize.get('MAC'),
                    dataIndex: 'mac',
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'descr',
                }, UnlinkEquip],
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    totalProperty: 'total',
					autoLoad: true,
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'name', type: 'string' },
                        { name: 'descr', type: 'string' },
                        { name: 'serial', type: 'string' },
                        { name: 'agrmnum', type: 'string' },
                        { name: 'vglogin', type: 'string' },
                        { name: 'agrmid', type: 'int' },
                        { name: 'cardid', type: 'int' },
                        { name: 'modelid', type: 'int' },
                        { name: 'modelname', type: 'string' },
                        { name: 'vgid', type: 'int' },
                        { name: 'serialformat', type: 'int' },
						{ name: 'chipid', type: 'string' }, 
						{ name: 'mac', type: 'string' }, 
                        { name: 'garantee', type: 'date', dateFormat: 'Y-m-d' } 
                    ],
                    baseParams: {
                        async_call: 1,
                        devision: 27,
                        getcldevices: 1,
                        vgid: config.data.vgid || -1,
                        start: 0,
                        limit: 100
                    }
				}
            }]
        }
    }).show();
	
	
	UnlinkEquip.on('action', function(grid, record) {	
        Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
		    if (btn != 'ok')
		    	return;
		    if (btn == 'ok')
		    {			
				Ext.Ajax.request({
					url: 'config.php',
					method: 'POST',
					scope: this,
					timeout: 380000,
					params: Ext.applyIf({
						async_call: 1,
						devision: 27,
						setvgequip: 1,
						equipid: record.get('id'),
						vgid: 0,
						reason: text
					}, record.data),
					callback: function(opt, success, res) {
						try {
							var data = Ext.decode(res.responseText);
							if(!data.success && data.error) {
								throw(data.error);
							}
							grid.getStore().reload();
						}
						catch(e) {
							Ext.Msg.error(e);
						}
					}
				});
			}
		});
	});

    UnlinkDev.on('action', function(grid, record) {
        var form = grid.findParentByType('form'),
            vals = form.getForm().getValues();

        Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
			
            form.getEl().mask(Ext.app.Localize.get('Wait for complete') + "...");
            
			Ext.Ajax.request({
				url: 'config.php',
				method: 'POST',
				scope: this,
				timeout: 380000,
				params: Ext.applyIf({
					async_call: 1,
					devision: 27,
					setcardequip: 1,
					cardid: 0,
					equipid: record.get('id')
				}),
				callback: function(opt, success, res) {
					try {
						form.getEl().unmask();

						var data = Ext.decode(res.responseText);
						if(!data.success && data.error) {
							throw(data.error);
						}
						try {grid.getStore().reload();} catch(e){}
						
					}
					catch(e) {
						Ext.Msg.error(e);
					}
				}
			});
        }, {
            grid: grid,
            vals: vals,
            form: form,
            record: record,
            config: config
        });
    });
    
} // end setVgEquipment()


function closeReglamentWin(config) {
	var config = config || {};
	
	// unlink device
	Ext.Ajax.request({
		url: 'config.php',
		method: 'POST',
		scope: this,
		timeout: 380000,
		params: Ext.applyIf({
			async_call: 1,
			devision: 27,
			setcardequip: 1,
			cardid: 0,
			equipid: config.equipid || 0
		}),
		callback: function(opt, success, res) {
			try {
				var data = Ext.decode(res.responseText);
				if(!data.success && data.error) {
					throw(data.error);
				}
				
			}
			catch(e) {
				Ext.Msg.error(e);
			}
		}
	});
	
	
	if(Ext.getCmp('equipment')) Ext.getCmp('equipment').getStore().reload();
	if(Ext.getCmp('devsgrd')) Ext.getCmp('devsgrd').getStore().reload();
	if(Ext.getCmp('gridagrmwin')) Ext.getCmp('gridagrmwin').getStore().reload();
	Ext.Msg.alert(Ext.app.Localize.get('Notice'), Ext.app.Localize.get('Service not selected'));
}
/**
 * Show window: select reglament of equipment rent/sell
 */
function showUseReglament(config)
{
    var config = config || {};
	new Ext.Window({
        modal: true,
		width: 400,
		height: 210,
		title: Ext.app.Localize.get('Equipment use reglament'), 
		id: 'setusboxwin',
		layout: 'fit',
		items: [{
			xtype: 'form',
			url: 'config.php',
			monitorValid: true,
			labelWidth: 150,
            frame: true,
			defaults: {
				anchor: '100%',
				xtype: 'hidden'
			},			
			items: [{
				xtype: 'hidden',
				name: 'equip',
				value: 1
			}, {
				xtype: 'combo',
				id: 'vgidusbox',
				fieldLabel: Ext.app.Localize.get('Account'),
				hiddenName: 'vgid',
				displayField: 'vglogin',
				valueField: 'vgid',
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				store: {
					xtype: 'jsonstore',
					root: 'results',
					fields: ['vgid', 'vglogin', 'tarid'],
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 106,
						agrmid: config.parentagrmid,
						getubvgroups: 1
					}
				},
				listeners: {
					select: function(combo,store,index) {
						if(combo.getValue() > 0) Ext.getCmp('regusbox').enable();
					}
				}
			}, {
				xtype: 'combo',							
				itemId: 'reglament',
				id: 'regusbox',
				fieldLabel: Ext.app.Localize.get('Type of transaction'),
				hiddenName: 'regtype',
				mode: 'local',
				triggerAction: 'all',
				valueField: 'id',
				displayField: 'name',
				disabled: true,
				editable: false,
				store: {
					xtype: 'arraystore',
					autoLoad: false,
					fields: ['id', 'name'],
					data: [
						[2, Ext.app.Localize.get('Rent')],
						[1, Ext.app.Localize.get('Sell')],
						[0, '"' + Ext.app.Localize.get('Service') + '" ' + Ext.app.Localize.get('or') + ' "' + Ext.app.Localize.get('Temporarily use') + '"']
					]
				},
				listeners: {
					beforeselect: function(combo, record) {
						var item = Ext.getCmp('signusbox');
						item.setRawValue(); 
						item.setValue();
						item.getStore().removeAll();
						item.getStore().reload({
							params: {
								vgid: Ext.getCmp('vgidusbox').getValue(),
								getcategories: 0,
								getcategoriesvgid: record.data.id
							}
						});
					},
					select: function (combo) {
						if(Ext.getCmp('regusbox').getValue() == 0) {
							combo.findParentByType('form').buttons[0].enable();
							Ext.getCmp('signusbox').disable();
							combo.findParentByType('form').getForm().findField('installmentplan').disable();
						} else {
							combo.findParentByType('form').getForm().findField('installmentplan')[ (Ext.getCmp('regusbox').getValue() == 1) ? 'enable' : 'disable']();
							Ext.getCmp('signusbox').enable();
						}
					}
				}
			}, {
				xtype: 'combo',
				itemId: 'installmentplan',
				hiddenName: 'planid',
				disabled: true,
				width: 210,
				displayField: 'name',
				valueField: 'planid',
				typeAhead: false,
				mode: 'local',
				triggerAction: 'all',
				fieldLabel: Ext.app.Localize.get('Installment plan'),
				tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{[Ext.util.Format.htmlEncode(values.name)]}">{planid}. {[Ext.util.Format.ellipsis(values.name, 36)]}</div></tpl>',
				editable: false,
				store: {
					xtype: 'jsonstore',
					root: 'results',
					autoLoad: true,
					totalProperty: 'total',
					fields: ['planid', 'name'],
					baseParams: {
						async_call: 1,
						devision: 29,
						getinstallments: 1
					}
				},
				listeners: {
					afterrender: function(combo) {
						var store = combo.getStore();
						store.on('load', function() {
							store.insert(0, new store.recordType({
								planid: 0,
								name: Ext.app.Localize.get('No')
							}))
						})
					}
				}
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Service'),
				hiddenName: 'catidx',
				id: 'signusbox',
				displayField: 'name',
				valueField: 'id',
				mode: 'local',
				triggerAction: 'all',
				disabled: true,
				editable: false,
				store: {
					xtype: 'jsonstore',
					root: 'results',
					fields: ['id', 'name'],
					autoLoad: false,
					baseParams: {
						async_call: 1,
						devision: 106,
						agrmid: config.parentagrmid
					}
				},
				listeners: {
					select: function(combo,store,index) {
						Ext.Ajax.request({
							url: 'config.php',
							method: 'POST',
							timeout: 380000,
							scope: this,
							params: Ext.apply({
								async_call: 1,
								devision: 106,
								getcatrate: 1,
								tarid: Ext.getCmp('vgidusbox').store.getAt(Ext.getCmp('vgidusbox').selectedIndex).get('tarid'),
								vgid: combo.findParentByType('form').getForm().findField('vgid').getValue(),
								catidx: combo.findParentByType('form').getForm().findField('catidx').getValue()
							}),
							callback: function(opt, success, res) {
								try {
									var data = Ext.decode(res.responseText);
									if(!data.success && data.error) {
										throw(data.error);
									}
									combo.findParentByType('form').buttons[0].enable();
									combo.findParentByType('form').getForm().findField('ratio').setValue(data.results.double);
									combo.findParentByType('form').getForm().findField('ratio').enable();
								}
								catch(e) {
									Ext.Msg.error(e);
								}
							}
						});
					}
				}
			}, {
				xtype: 'numberfield',
				fieldLabel: Ext.app.Localize.get('Ratio'),
				itemId: 'ratio',
				name: 'rate',
				disabled: true,
				minValue: 0,
				maxValue: 9,
				decimalPrecision: 6
			}],	
			buttonAlign: 'center',
			buttons: [{
				xtype: 'button',
				disabled: true,
				text: Ext.app.Localize.get('Save'),
				handler: function(Btn) {
					
					if(Ext.getCmp('regusbox').getValue() != 0 && Ext.getCmp('signusbox').getValue() === '') {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Empty data') + ' "' + Ext.app.Localize.get('Service') + '"');
						return false;
					}
					
					var combo = Ext.getCmp('vgidusbox');
					
					if(combo.getValue() == '') {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Empty data'));
						Btn.disable();
						return;
					}
					
					var form = Btn.findParentByType('form'),
						store =  combo.getStore().getAt(combo.selectedIndex);
						
					var data = {
						vgid: store.get('vgid'),
						tarid: store.get('tarid'),
						serial: config.serial
					}
					submitAssignService( form, data, config ); // Send data to parent window
					
				}.createDelegate(config)
			}]
		}],
		listeners: {
			beforeclose: function() {
				closeReglamentWin(config);
			}
		}
	}).show();
} // end showUseReglament()

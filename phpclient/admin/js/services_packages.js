/**
 * Common services packages widgets
 */

Ext.onReady(function() {
    Ext.QuickTips.init();
    // Show catalogue control Panel to edit catalog and and or modify its entries
    getServPacksGridPanel('ServPacksPanel');
}); // end Ext.onReady()


/**
 * Show device panel as window
 */
function showPacketsWindow(config)
{
    var config = config || {
    	grid: {}
    };

    new Ext.Window({
        title: Ext.app.Localize.get('Services packages'),
        layout: 'fit',
        width: 900,
        height: 600,
        modal: config.modal || false,
        items: getServPacksGrid(Ext.apply({
            title: null
        }, config.grid)),
        buttonAlign: 'center',
        buttons: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Assign'),
            handler: function(Btn) {
                var win = Btn.findParentByType('window');
                if(this.callback) {
                    this.callback(win.get(0).getLayout().activeItem);
                }
                win.close();
            }.createDelegate(config)
        }]
    }).show();
} // end showDevicesPanel()



/**
 * Show users with packet [pid]
 * usersBnt handler
 */

function showPacketUsers(pid) {	
    new Ext.Window({
        title: Ext.app.Localize.get('Services packages'),
        layout: 'fit',
        width: 600,
        height: 600,
        modal: true,
        items: [{
			xtype: 'grid',
			itemId: 'usersGrid',
			name: 'usersGrid',
			loadMask: true,
			PAGELIMIT: 100,
			columns: [{
					header: Ext.app.Localize.get('Account'),
					width: 250,
					sortable: true,
					dataIndex: 'vglogin'						
				}, {
					header: Ext.app.Localize.get('Since'),
					width: 150,
					sortable: true,
					dataIndex: 'datefrom'						
				}, {
					header: Ext.app.Localize.get('To'),
					width: 150,
					sortable: true,
					dataIndex: 'dateto'						
			}],
			listeners: {
                beforerender: function(grid) {
                    grid.setPagePanel();
                },
                show: function(grid) {
                	if(grid.getStore().getCount() == 0) {
                		grid.getStore().reload({
                			params: {
                				start: 0
                			}
                		});
                	}
                }
            },
			bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
			store: {
				xtype: 'jsonstore',
				root: 'results',
				fields: ['vglogin', 'datefrom', 'dateto'],
				baseParams: Ext.apply({
					async_call: 1,
					devision: 5,
					getpackageusers: pid,
					limit: 100
				})
			}					
		}]
    }).show(null, function(win) {
    	win.get('usersGrid').getStore().reload({
    	   params: {
                start: 0
    	   }
    	});
    });
} //end showPacketUsers()







/**
 * Get common panel to render it to the document body
 *
 */
function getServPacksGridPanel( id )
{
	var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }
    
    getServPacksGrid({
        cookie: 'node5',
        editBtn: true,
        usersBtn: true,
        rmPack: true,
        panel: {
            title: Ext.app.Localize.get('Services packages'),
            width: 900,
            height: 750
        }
    }).render(id);
} // end 


/**
 * Get services packages grid
 * @param   object, configuration data
 * 
 * @return  object (not rendered)
 */
function getServPacksGrid (config)
{
    var config = config || {}, 
        filter = config['filter'] || {},
        cookie = config['cookie'] || null,
        sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: (!Ext.isDefined(config['sm']) || !config['sm']) ? false : true }),
        
        editBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Edit'),
            width: 22,
            iconCls: 'ext-edit'
        }),
        
        usersBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Assigned'),
            width: 25,
            iconCls: 'ext-ugroup'
        }),
        
        rmPack = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Remove'),
            width: 25,
            iconCls: function(record) {
                return (record.get('state') == 0 || record.get('state') == 3 ? 'ext-drop' : 'ext-drop-dis');
                
            }
        }),
        // Tarif list
        tarStaff = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Tarifs list'),
            width: 22,
            iconCls: 'ext-tariff'
        }),
        // Remove template from packet
        rmPackTpl = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Remove'),
            width: 22,
            iconCls: function(record) {
                return (record.get('state') == 0 ? 'ext-drop' : 'ext-drop-dis');
            }
        });
        // Remove tariff from template
        rmPackTar = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Remove'),
            width: 22,
            iconCls: function(record) {
                return (record.get('state') == 0 ? 'ext-drop' : 'ext-drop-dis');
            }
        });
    
    config.toolbar = config.toolbar || {};
    
    if(config['filter']) {
        delete config.filter;
    }
    
    if(config['cookie']) {
        delete config.cookie;
    }
    
    config.editBtn = !Ext.isDefined(config['editBtn']) ? true : config['editBtn'];
    config.usersBtn = !Ext.isDefined(config['usersBtn']) ? true : config['usersBtn'];
    config.rmPack = !Ext.isDefined(config['rmPack']) ? true : config['rmPack'];
    config.sm = !Ext.isDefined(config['sm']) ? null : config['sm'];
    
    // Action listener for the edit button
    editBtn.on('action', function(grid, record) {
        var panel = grid.findParentByType('panel'),
            layout = panel.getLayout();
            
        layout.setActiveItem(1);
        panel.changeToolbar();
        layout.activeItem.loadRecord(record);
    });
    // Action listeners view users pack added to
    usersBtn.on('action', function(grid, record) {
		showPacketUsers(record.get('packetid'));
    });
    
    // Action listener to edit tariff staff
    tarStaff.on('action', function(grid, record) {
        var tpls = grid.ownerCt,
            tarGrid = tpls.get('tpls-tars');
        
        tpls.getLayout().setActiveItem(1);
        tarGrid.getStore().setBaseParam('packetid', grid.getStore().baseParams.packetid).setBaseParam('packetentryid', record.get('packetentryid')).reload({
            params: {
                start: 0
            }
        })
    });
    // Action listener to remove packet
    rmPack.on('action', function(grid, record) {
        if(record.get('state') > 0 && record.get('state') < 3) {
            return;
        }
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                method: 'POST',
                params: Ext.copyTo({
                    async_call: 1,
                    devision: 5,
                    delpacket: 1
                }, record.data, 'packetid'),
                scope: this,
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);
                                        
                        if(!data.success) {
                            throw(data.error);
                        }
                        
                        this.grid.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record
        });
    });
    // Action listener to remove template from packet
    rmPackTpl.on('action', function(grid, record) {
        if(record.get('state') > 0) {
            return;
        }
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };

            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                method: 'POST',
                params: Ext.apply({
                    async_call: 1,
                    devision: 5,
                    delpackettpl: 1
                }, record.data),
                scope: this,
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);
                                        
                        if(!data.success) {
                            throw(data.error);
                        }
                        
                        this.grid.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record
        });
    });
    // Action listener to remove tariff from tamplate
    rmPackTar.on('action', function(grid, record) {
        if(record.get('state') > 0) {
            return;
        }
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                method: 'POST',
                params: Ext.apply({
                    async_call: 1,
                    devision: 5,
                    delpackettarif: 1
                }, record.data),
                scope: this,
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);
                                        
                        if(!data.success) {
                            throw(data.error);
                        }
                        
                        this.grid.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record
        });
    });
    
    var columns = [{
        header: Ext.app.Localize.get('ID'),
        width: 80,
        sortable: true,
        dataIndex: 'packetid'
    }, {
        header: Ext.app.Localize.get('Name'),
        dataIndex: 'name',
        sortable: true,
        id: 'servpack-descr-col-exp'
    }, {
    	header: Ext.app.Localize.get('Discount'),
    	width: 100,
    	dataIndex: 'discount',
    	renderer: function(value, meta, record) {
    		return value + (record.get('disctype') == 0 ? '%' : '');
    	}
    }, {
        header: Ext.app.Localize.get('Period'),
        dataIndex: 'datefrom',
        width: 160,
        renderer: function(value, meta, record) {
            var str = '';
            if(Ext.isDate(value) && value.format('Y') > 1900) {
            	str += Ext.app.Localize.get('Since') + ' ' + value.format('d.m.Y');
            }
            if(Ext.isDate(record.get('dateto')) && record.get('dateto').format('Y') > 1900) {
                str += ' ' + Ext.app.Localize.get('Till') + ' ' + record.get('dateto').format('d.m.Y');
            }
            return str;
        }
    }, {
        header: Ext.app.Localize.get('Turn off package') + ' (' + Ext.app.Localize.get('Date') + ')',
        dataIndex: 'dateend',
        width: 120,
        renderer: function(value) {
        	return Ext.isDate(value) ? (value.format('Y') < 1900 ? '' : value.format('d.m.Y')) : '';
        }
    }, {
    	header: Ext.app.Localize.get('Status'),
    	dataIndex: 'state',
    	width: 120,
    	renderer: function(value) {
            switch(value) {
                case 0: return Ext.app.Localize.get('Available') + ', ' + Ext.app.Localize.get('not assigned');
                case 1: return Ext.app.Localize.get('Is acting') + ', ' + Ext.app.Localize.get('available');
                case 2: return Ext.app.Localize.get('Is acting') + ', ' + Ext.app.Localize.get('not available');
                case 3: return Ext.app.Localize.get('Not available') + ', ' + Ext.app.Localize.get('completed');
                case 4: return Ext.app.Localize.get('Removed');
            }
        }
    }];
    
    if(config.editBtn) {
        columns.unshift(editBtn);
    }
    
    if(config.usersBtn) {
        columns.push(usersBtn);
    }
    
    if(config.sm) {
        columns.unshift(sm);
        delete config.sm;
    }
    
    if(config.rmPack) {
        columns.push(rmPack);
    }
    
    var panel = new Ext.Panel(Ext.apply({
    	frame: false,
    	border: false,
        layout: 'card',
        activeItem: 0,
        layoutConfig: {
            deferredRender: true
        },
        tbar: [{
        	xtype: 'button',
        	itemId: 'on-serv-pack-btn-add',
        	text: Ext.app.Localize.get('Add'),
        	iconCls: 'ext-add',
        	disabled: !config['editBtn'] ? true : false,
        	handler: function(Btn) {
        		var panel = Btn.findParentByType('panel'),
                    layout = panel.getLayout();
        		
        		layout.setActiveItem(1);
        		panel.changeToolbar();
        		layout.activeItem.loadRecord();
        	}
        }, {
            xtype: 'button',
            itemId: 'on-serv-form-btn-cancel',
            iconCls: 'ext-arrow-left',
            text: Ext.app.Localize.get('Go back to list'),
            hidden: true,
            handler: function(Btn) {
            	var panel = Btn.findParentByType('panel'),
                    layout = panel.getLayout();
                
                layout.setActiveItem(0);
                layout.activeItem.getStore().reload();
                panel.changeToolbar();
            }
        }],
        changeToolbar: function() {
        	var tab = this.getLayout().activeItem;
        	this.getTopToolbar().items.each(function(item) {
                if(item.itemId && /^on-/.test(item.itemId)) {
                    if(!this.regx) {
                        item.hide();
                    }
                    else {
                        item[!this.regx.test(item.itemId) ? 'hide' : 'show']();
                    }
                }
            }, {
                tab: tab,
                regx: tab.itemId ? new RegExp('^on-' + tab.itemId) : false
            });
        },
        items: [Ext.apply({
        	xtype: 'grid',
            PAGELIMIT: 100,
            loadMask: true,
            autoExpandColumn: 'servpack-descr-col-exp',
            stateful: true,
            stateId: 'ServPackGrid',
            itemId: 'serv-pack',
            id: 'serv-pack-grid',
            listeners: {
                beforerender: function(grid) {
                    grid.setPagePanel();
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        return Ext.apply(this.getStore().baseParams, this.findParentByType('panel').getTopToolbar().getToolValues());
                    }.createDelegate(grid);
                },
                show: function(grid) {
                	if(grid.getStore().getCount() == 0) {
                		grid.getStore().reload({
                			params: {
                				start: 0
                			}
                		});
                	}
                }
            },
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            columns: columns,
            plugins: [editBtn, usersBtn, rmPack],
            sm: sm,
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: [
                    'packetid','state','name','descr','discount','disctype',
                    { name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'datefrom', type: 'date', dateFormat: 'Y-m-d' },
                    { name: 'dateto', type: 'date', dateFormat: 'Y-m-d' },
                    { name: 'dateend', type: 'date', dateFormat: 'Y-m-d' }
                ],
                remoteSort: true,
                sortInfo: {
                    field: 'descr',
                    direction: 'ASC'
                },
                baseParams: Ext.apply({
                    async_call: 1,
                    devision: 5,
                    getservpacks: 1,
                    limit: 100
                }, filter)
            }
        }, config.grid || {}), {
            xtype: 'container',
            layout: 'anchor',
            itemId: 'serv-form',
            border: false,
            loadRecord: function(record) {
            	if(record) {
                    this.get('form-main').load({
                        url: 'config.php',
                        timeout: 380000,
                        scope: this,
                        params: Ext.apply({
                            async_call: 1,
                            devision: 5,
                            getpacket: 1
                        }, record.data),
                        success: function(form, action) {
                            var tpls = this.get('tpls-items'),
                                grid = tpls.get('tpls-entry'),
                                state = action.result.data.state;
                            form.setValues({
                            	datefrom: Date.parseDate(action.result.data.datefrom, "Y-m-d"), 
                            	dateto: Date.parseDate(action.result.data.dateto, "Y-m-d"), 
                            	dateend: Date.parseDate(action.result.data.dateend, "Y-m-d") 
                            })
                            
                            if(state == 3 || state == 4) {
								Ext.getCmp('form-save-btn').disable();
								//Ext.get
							}
                            
                            tpls.getLayout().setActiveItem(0);
                            grid.enable();
                            grid.getTopToolbar().get('add-btn')[state == 0 ? 'enable' : 'disable']();
                            grid.getStore().setBaseParam('packetid', action.result.data.packetid).reload();
                        },
                        failure: function(form, action) {
                            
                        }
                    });
            	}
            	else {
            		this.get('form-main').getForm().reset();
            		var tpls = this.get('tpls-items');
            		if(tpls.rendered) {
                		tpls.getLayout().setActiveItem(0);
                        tpls.get('tpls-entry').getStore().removeAll();
                        tpls.get('tpls-entry').disable();
                    }
            	}
            },
            listeners: {
            	hide: function(panel) {
            		panel.loadRecord();
            	}
            },
            items: [{
                xtype: 'form',
                url: 'config.php',
                frame: true,
                itemId: 'form-main',
                id: 'form-main-id',
                monitorValid: true,
                defaults: {
                    anchor: '100%'
                },
                buttons: [{
                    xtype: 'button',
                    formBind: true,
                    id: 'form-save-btn',
                    text: Ext.app.Localize.get('Save'),
                    handler: function(Btn) {
                    	var form = Btn.findParentByType('form');
                    	
                    	if(!form.getForm().isValid()) {
                    		return false;
                    	}
                    	
                    	var config = {
                    		url: 'config.php',
                            waitTitle: Ext.app.Localize.get('Connecting'),
                            waitMsg: Ext.app.Localize.get('Sending data') + '...',
                            scope: {
                            	panel: form.ownerCt
                            },
                            params: {
                            	async_call: 1,
                            	devision: 5,
                            	setpack: 1
                            },
                            success: function(form, action) {
                                try {
                                	if(action.result.data) {
                                        this.panel.loadRecord({
                                            data: action.result.data
                                	    });
                                	}
                                }
                                catch(e) {
                                	Ext.Msg.error(e);
                                }
                    	    },
                    	    failure: function(form, action) {
                                Ext.Msg.error(action.result.error);
                    	    }
                    	};
                    	
                    	// Look through entries to find discount
                    	var entryDisc = form.ownerCt.get('tpls-items').get('tpls-entry').getStore().findBy(function(record, id) {
                            return record.get('discount') > 0 ? true : false;
                    	}),
                    	    formDisc = form.getForm().getValues().discount;
                    	
                    	//if(entryDisc == -1 && formDisc == 0) {
                            //Ext.Msg.error(Ext.app.Localize.get('Package or templates discounts are undefined'));
                            //return false;
                    	//} else
                    	 if(entryDisc != -1 && formDisc > 0) {
                    		Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Discounts in templates will be removed') + '<br>' + Ext.app.Localize.get('Continue') + '?', function(Btn) {
                                if(Btn !== 'yes') {
                                	return;
                                }
                                
                                this.form.getForm().submit(this.config);
                    		}, {
                    			form: form,
                    			config: config
                    		});
                    	}
                    	else {
                    		form.getForm().submit(config);
                    	}
                    }
                }],
                items: [{
                    xtype: 'hidden',
                    name: 'packetid'
                }, {
                	xtype: 'hidden',
                	name: 'state'
                }, {
                    xtype: 'fieldset',
                    border: false,
                    anchor: '55%',
                    bodyStyle: 'pdding:0px;',
                    labelWidth: 150,
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: Ext.app.Localize.get('Name'),
                        name: 'name',
                        allowBlank: false
                    }, {
                    	xtype: 'container',
                    	layout: 'hbox',
                    	fieldLabel: Ext.app.Localize.get('Discount'),
                    	items: [{
                            xtype: 'numberfield',
                            name: 'discount',
                            flex: 1,
                            value: 0,
                            allowBlank: false,
                            listeners: {
                            	beforerender: function(field) {
                            		field.validator = function(value) {
                            			this.field.setReadOnly(this.state.getValue() > 0 ? true : false);
                            		}.createDelegate({
                                        field: field,
                                        state: field.findParentByType('form').getForm().findField('state')
                            		})
                            	}
                            }
                        }, {
                            xtype: 'tbspacer',
                            width: 5
                        }, {
                            xtype: 'combo',
                            hiddenName: 'disctype',
                            width: 100,
                            valueField: 'id',
                            displayField: 'name',
                            editable: false,
                            mode: 'local',
                            triggerAction: 'all',
                            listeners: {
                                beforerender: function(field) {
                                    field.validator = function(value) {
                                        this.field.setReadOnly(this.state.getValue() > 0 ? true : false);
                                    }.createDelegate({
                                        field: field,
                                        state: field.findParentByType('form').getForm().findField('state')
                                    })
                                }
                            },
                            store: {
                            	xtype: 'arraystore',
                            	fields: ['id', 'name'],
                            	data: [[0, '%'], [1, Ext.app.Localize.get('Absolute')]]
                            }
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        fieldLabel: Ext.app.Localize.get('Available for assignment'),
                        items: [{
                        	xtype: 'tbtext',
                        	text: Ext.app.Localize.get('Since'),
                        	style: 'padding: 3 5 0 0;'
                        }, {
                            xtype: 'datefield',
                            flex: 1,
                            name: 'datefrom',
                            allowBlank: false,
                            itemId: 'dateF'
                        }, {
                            xtype: 'tbspacer',
                            width: 10
                        }, {
                        	xtype: 'tbtext',
                            text: Ext.app.Localize.get('Till'),
                            style: 'padding: 3 5 0 0;'
                        }, {
                            xtype: 'datefield',
                            flex: 1,
                            name: 'dateto',
                            allowBlank: true,
                            itemId: 'dateT'
                        }],
                        listeners: {
							afterrender: function(form) {
								form.get('dateF').setValue(Date("Y-m-d H:i:s"));
							}
						}
                    }, {
                        xtype: 'datefield',
                        fieldLabel: Ext.app.Localize.get('Turn off package'),
                        anchor: '60%',
                        allowBlank: true,
                        name: 'dateend'
                    }, {
                        xtype: 'textarea',
                        fieldLabel: Ext.app.Localize.get('Description'),
                        name: 'descr'
                    }]
                }]
            }, {
                xtype: 'panel',
                border: false,
                anchor: '100% 67%',
                itemId: 'tpls-items',
                layout: 'card',
                layoutConfig: {
                    deferredRender: true
                },
                activeItem: 0,
                items: [{
                    xtype: 'editorgrid',
                    itemId: 'tpls-entry',
                    title: Ext.app.Localize.get('Templates'),
                    clicksToEdit: 1,
                    autoExpandColumn: 'packtpl-name-col-exp',
                    loadMask: true,
                    PAGELIMIT: 100,
                    listeners: {
                    	/**
                    	 * @param  Object
                    	 * grid - This grid
                         * record - The record being edited
                         * field - The field name being edited
                         * value - The value for the field being edited.
                         * row - The grid row index
                         * column - The grid column index
                         * cancel - Set this to true to cancel the edit or return false from your handler.
                    	 */
                    	beforeedit: function(ev) {
                    		ev.cancel = ev.record.get('state') > 0 && ev.field != 'name' ? true : false;
                    	},
                    	beforerender: function(grid) {
                    	    grid.setPagePanel();
                    	    grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                            // Store event
                    		grid.getStore().on('update', function(store, record, action) {
                                if(action == Ext.data.Record.EDIT) {
                                	// Look through entries to find discount
                                    var entryDisc = store.findBy(function(record, id) {
                                        return record.get('discount') > 0 ? true : false;
                                    }),
                                        formDisc = this.ownerCt.ownerCt.get('form-main').getForm().getValues().discount;
                                    
                                    var config = {
                                        url: 'config.php',
                                        timeout: 3800000,
                                        method: 'POST',
                                        params: Ext.apply(record.data, {
                                            async_call: 1,
                                            devision: 5,
                                            setpackentry: 1
                                        }),
                                        scope: {
                                        	form: this.ownerCt.ownerCt.get('form-main').getForm(),
                                            record: record,
                                            store: store
                                        },
                                        callback: function(opt, success, resp){
                                            try {
                                                // Decode JSON data
                                                var data = Ext.util.JSON.decode(resp.responseText)
                                                
                                                if(!data['success']) {
                                                    throw(data);
                                                }
                                                
                                                if(opt.params.packetentryid <= 0) {
                                                    this.record.data.packetentryid = data.results.packetentryid;
                                                }
                                                this.record.data.state = data.results.state
                                                
                                                this.store.commitChanges();
                                                
                                                var entryDisc = store.findBy(function(record, id) {
                                                    return record.get('discount') > 0 ? true : false;
                                                });
                                                
                                                if(entryDisc > -1) {
                                                    this.form.setValues({
                                                        discount: 0
                                                    });
                                                }
                                            }
                                            catch(e) {
                                                if(!Ext.isDefined(e['authorize'])) {
                                                    Ext.Msg.error(e.error);
                                                }
                                            }
                                        }
                                    };
                                    
                                    //if(entryDisc == -1 && formDisc == 0) {
                                        //Ext.Msg.error(Ext.app.Localize.get('Package or templates discounts are undefined'));
                                        //return false;
                                    //} else
                                     if(entryDisc != -1 && formDisc > 0) {
                                        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Discounts in package will be removed') + '<br>' + Ext.app.Localize.get('Continue') + '?', function(Btn) {
                                            if(Btn !== 'yes') {
                                            	this.record.reject();
                                                return;
                                            }
                                            
                                            Ext.Ajax.request(this.config)
                                        }, {
                                            config: config,
                                            record: record
                                        });
                                    }
                                    else {
                                        Ext.Ajax.request(config);
                                    }
                                }
                    		}, grid);
                    	}
                    },
                    tbar: [{
                        xtype: 'button',
                        iconCls: 'ext-add',
                        text: Ext.app.Localize.get('Add'),
                        itemId: 'add-btn',
                        handler: function(Btn) {
							var formDisc = Ext.getCmp('form-main-id').getForm().getValues().discount;
							if(formDisc >= 0) { 
								var store = Btn.findParentByType('editorgrid').store;                        	
								store.insert(0, new store.recordType({
									packetentryid: 0,
									name: null,
									packetid: store.baseParams.packetid,
									discount: 0,
									disctype: 0,
									state: 0
								}));                        	
								store.getAt(0).set('name', Ext.app.Localize.get("New template"));
							} 
                        }
                    }],
                    bbar: {
                        xtype: 'paging',
                        pageSize: 0,
                        displayInfo: true
                    },
                    plugins: [tarStaff, rmPackTpl],
                    columns: [{
						header: 'ID',
						width: 40,
						dataIndex: 'packetentryid'						
					}, {
                    	header: Ext.app.Localize.get('Name'),
                    	id: 'packtpl-name-col-exp',
                    	dataIndex: 'name',
                    	editor: {
                    		xtype: 'textfield',
                    		allowBlank: false
                    	}
                    }, tarStaff, {
                        header: Ext.app.Localize.get('Discount'),
                        dataIndex: 'discount',
                        editor: {
                        	xtype: 'numberfield'
                        }
                    }, {
                        header: Ext.app.Localize.get('Type'),
                        dataIndex: 'disctype',
                        renderer: function(value) {
                        	return value == 0 ? '%' : Ext.app.Localize.get('Absolute');
                        },
                        editor: {
                        	xtype: 'combo',
                            valueField: 'id',
                            displayField: 'name',
                            editable: false,
                            mode: 'local',
                            triggerAction: 'all',
                            store: {
                                xtype: 'arraystore',
                                fields: ['id', 'name'],
                                data: [[0, '%'], [1, Ext.app.Localize.get('Absolute')]]
                            }
                        }
                    }, rmPackTpl],
                    store: {
                    	xtype: 'jsonstore',
                    	root: 'results',
                    	totalProperty: 'total',
                    	fields: ['packetentryid','packetid','name','discount','disctype','state'],
                    	baseParams: {
                    		async_call: 1,
                    		devision: 5,
                    		getpackentries: 1
                    	}
                    }
                }, {
                    xtype: 'grid',
                    title: Ext.app.Localize.get('Tarifs'),
                    itemId: 'tpls-tars',
                    autoExpandColumn: 'packtar-name-col-exp',
                    loadMask: true,
                    PAGELIMIT: 100,
                    listeners: {
                        beforerender: function(grid) {
                            grid.setPagePanel();
                            grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                        }
                    },
                    tbar: [{
                        xtype: 'button',
                        iconCls: 'ext-arrow-left',
                        text: Ext.app.Localize.get('Go back to list'),
                        handler: function(Btn) {
                            var panel = Btn.findParentByType('panel'),
                                layout = panel.getLayout();
                            
                            layout.setActiveItem(0);
                        }
                    }, {
                        xtype: 'tbseparator',
                        width: 5
                    }, {
                        iconCls: 'ext-add',
                        text: Ext.app.Localize.get('Add'),
                        itemId: 'add-btn',
                        handler: function(Btn) {
                            var store = Btn.findParentByType('grid').store;
                            
                            getTarifGridWindow({
								grid: {
									sm: false
								},
                                win: {
                                    callback: function(grid) {
										var record0 = grid.getSelectionModel().getSelected();
                                        var record = grid.getSelectionModel().getSelections();
                                        if(!record) {
                                            return;
                                        }
                                                                                
                                        var rec = [];
                                        for(i=0;i<record.length;i++) {
											rec.push(record[i].data.tarid);
										}

                                        Ext.Ajax.request({
                                            url: 'config.php',
                                            timeout: 380000,
                                            method: 'POST',
                                            params: Ext.copyTo(Ext.copyTo({
                                                async_call: 1,
                                                devision: 5,
                                                setpackettarif: 1,
                                                tarid: rec.toString()
                                            }), this.baseParams, 'packetid,packetentryid'),
                                            scope: this,
                                            callback: function(opt, success, res) {
                                                try {
                                                    var data = Ext.decode(res.responseText);
                                                                    
                                                    if(!data.success) {
                                                        throw(data.error);
                                                    }
                                                    
                                                    this.reload({
                                                        params: {
                                                            start: 0
                                                        }
                                                    });
                                                }
                                                catch(e) {
                                                    Ext.Msg.error(e);
                                                }
                                            }
                                        });
                                    }.createDelegate(store)
                                }
                            });
                        }
                    }],
                    bbar: {
                        xtype: 'paging',
                        pageSize: 0,
                        displayInfo: true
                    },
                    plugins: [rmPackTar],
                    columns: [{
                        header: Ext.app.Localize.get('ID'),
                        width: 80,
                        dataIndex: 'tariffid'
                    }, {
                        header: Ext.app.Localize.get('Tarif'),
                        id: 'packtar-name-col-exp',
                        dataIndex: 'tarname'
                    }, rmPackTar],
                    store: {
                        xtype: 'jsonstore',
                        root: 'results',
                        totalProperty: 'total',
                        fields: ['recordid','packetentryid','tariffid','tarname','state'],
                        baseParams: {
                            async_call: 1,
                            devision: 5,
                            getpackettars: 1
                        }
                    }
                }]
            }]
        }]
    }, config.panel || {}));
    
    return panel;
} // end getServPacksGrid()


/**
 * Show window with available packages for the selected account
 * @param   object, config data
 */
function showAccountPackages( config )
{
    var config = config || {},
    
        editBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Edit'),
            width: 25,
            iconCls: 'ext-edit'
        }),
        
        
        rmUserPacket = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Remove'),
            width: 22,
            iconCls: 'ext-drop'
        }),
        
        vgBtn = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Choose account'),
            width: 22,
            iconCls: function(record) {
            	return ((record.get('state') > 0 && record.get('state') < 2 && record.get('userpacketentryid')) || record.get('state') > 1) ? 'ext-ugroup-dis' : 'ext-ugroup';
            }
        });
    
       
      rmUserPacket.on('action', function(grid, record) {
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                timeout: 380000,
                method: 'POST',
                params: Ext.copyTo({
                    async_call: 1,
                    devision: 5,
                    deluserpacket: 1
                }, record.data, 'userpacketid'),
                scope: this,
                callback: function(opt, success, res) {
                    try {
                        var data = Ext.decode(res.responseText);
                                        
                        if(!data.success) {
                            throw(data.error);
                        }
                        
                        this.grid.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            });
        }, {
            grid: grid,
            record: record
        });
    });
    
    
    config.filter = config.filter || { userid: -1 };
    
    if(!Ext.isDefined(config.filter.userid)) {
    	config.filter.userid = -1;
    }
    
    // Action listener
    editBtn.on('action', function(grid, record) {
    	var panel = grid.ownerCt;
    	
    	panel.getLayout().setActiveItem(1);
        panel.changeToolbar();
        
        panel.get('packet-form').loadData({
        	userpacketid: record.get('userpacketid'),
        	userid: record.store.baseParams.userid,
            packetid: record.get('packetid')
        });
    });
    // Action listener
    vgBtn.on('action', function(grid, record) {
    	if((record.get('state') > 0 && record.get('state') < 2 && record.get('userpacketentryid')) || record.get('state') > 1) {
    		return false;
    	}
        var vgids = grid.getStore().collect('vgid', false, true);
        
        showAccounts({
        	hideToolbar: true,
        	filter: {
        		vguserid: grid.findParentByType('form').getForm().getValues().userid,
        		packetentryid: record.get('packetentryid'),
                packetvgids: vgids.join(',')
        	},
        	callbackok: function(grid) {
        		var record = grid.getSelectionModel().getSelected();
        		
        		if(record) {
        			this.set('vgid', record.get('vgid'));
        			this.set('vglogin', record.get('login'));
        		}
        	}.createDelegate(record)
        });
    });
    
    new Ext.Window({
        title: Ext.app.Localize.get('Assigned services packages'),
        modal: true,
        layout: 'card',
        width: 700,
        height: 600,
        resizable: false,
        activeItem: 0,
        layoutConfig: {
            deferredRender: true
        },
        tbar: [{
        	xtype: 'button',
            itemId: 'on-packet-form-btn-cancel',
            iconCls: 'ext-arrow-left',
            text: Ext.app.Localize.get('Go back to list'),
            hidden: true,
            handler: function(Btn) {
                var panel = Btn.findParentByType('window'),
                    layout = panel.getLayout();
                
                layout.setActiveItem(0);
                layout.activeItem.getStore().reload();
                panel.changeToolbar();
            }
        }, {
        	xtype: 'button',
            itemId: 'on-packets-btn',
            iconCls: 'ext-add',
            text: Ext.app.Localize.get('Build package'),
            handler: function(Btn) {
                var panel = Btn.findParentByType('window'),
                    layout = panel.getLayout();
                
                layout.setActiveItem(1);
                panel.changeToolbar();
                
                panel.get('packet-form').loadData({
                	userpacketid: 0,
                	packetid: 0,
                    userid: panel.get('packets').getStore().baseParams.userid
                });
            }
        }],
        changeToolbar: function() {
            var tab = this.getLayout().activeItem;
            this.getTopToolbar().items.each(function(item) {
                if(item.itemId && /^on-/.test(item.itemId)) {
                    if(!this.regx) {
                        item.hide();
                    }
                    else {
                        item[!this.regx.test(item.itemId) ? 'hide' : 'show']();
                    }
                }
            }, {
                tab: tab,
                regx: tab.itemId ? new RegExp('^on-' + tab.itemId) : false
            });
        },
        items: [{
            xtype: 'grid',
            itemId: 'packets',
            loadMask: true,
            PAGELIMIT: 100,
            autoExpandColumn: 'packet-name-col-exp',
            listeners: {
            	beforerender: function(grid) {
            		grid.setPagePanel();
            	}
            },
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            plugins: [editBtn, rmUserPacket],
            columns: [editBtn, {
				header: Ext.app.Localize.get('ID'),
                dataIndex: 'userpacketid',
                width: 35
            }, {
                header: Ext.app.Localize.get('Package'),
                dataIndex: 'packetname',
                id: 'packet-name-col-exp'
            }, {
                header: Ext.app.Localize.get('Period'),
                dataIndex: 'datefrom',
                width: 180,
                renderer: function(value, meta, record) {
                    var str = '';
                    if(Ext.isDate(value) && value.format('Y') > 1900) {
                        str += Ext.app.Localize.get('Since') + ' ' + value.format('d.m.Y');
                    }
                    if(Ext.isDate(record.get('dateto')) && record.get('dateto').format('Y') > 1900) {
                        str += ' ' + Ext.app.Localize.get('Till') + ' ' + record.get('dateto').format('d.m.Y');
                    }
                    return str;
                }
            }, {
                header: Ext.app.Localize.get('Status'),
                dataIndex: 'state',
                renderer: function(value) {
                	switch(value) {
                		case 0: return Ext.app.Localize.get('Available');
                		case 1: return Ext.app.Localize.get('Is acting');
                		case 2: return Ext.app.Localize.get('Completed');
                	}
                }
            }, rmUserPacket],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                fields: [
                    'userpacketid','packetid','state','packetname',
                    { name: 'datefrom', type: 'date', dateFormat: 'Y-m-d' },
                    { name: 'dateto', type: 'date', dateFormat: 'Y-m-d' }
                ],
                baseParams: Ext.apply({
                    async_call: 1,
                    devision: 5,
                    getuserpackets: 1
                }, config.filter)
            }
        }, {
            xtype: 'form',
            url: 'config.php',
            itemId: 'packet-form',
            frame: true,
            paramsAsHash: true,
            monitorvalid: true,
            defaults: {
                anchor: '100%'
            },
            loadData: function( data ) {
            	var data = data || {};
            	
            	if(data.userpacketid) {
                	this.load({
                		url: 'config.php',
                        method: 'POST',
                        scope: {
                        	form: this,
                        	grid: this.get('packet-tpls')
                        },
                        params: Ext.apply({
                        	async_call: 1,
                        	devision: 5,
                        	getuserpackets: 1
                        }, data),
                        success: function(form, action) {
                        	this.form.get('packet-item').get('packet-add').disable();
                        	this.form.get('packet-tpls').getStore().
                        	       setBaseParam('getuserpackets', 1, ['getpackentries', 'onlyenries', 'packetid', 'userpacketid']).
                        	       setBaseParam('userpacketid', action.result.data.userpacketid).
                        	       setBaseParam('onlyenries', 1).
                        	reload({
                        	    params: {
                                    start: 0
                        	    }
                        	});
                        }
                	});
            	}
            	else {
            		this.getForm().reset();
            		this.getForm().setValues(data);
            		this.get('packet-item').get('packet-add').enable();
            		this.get('packet-tpls').getStore().setBaseParam('', null, ['getpackentries', 'onlyenries', 'packetid', 'userpacketid', 'getuserpackets']).removeAll();
            	}
            },
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                handler: function(Btn) {
                	var panel = Btn.findParentByType('form'),
                	    form = panel.getForm();
                	
                	if(!form.isValid()) {
                		return false;
                	}

                	if(form.findField('packetname').getValue()==''){
                		Ext.Msg.error(Ext.app.Localize.get('Empty field') + ': ' + Ext.app.Localize.get('Package'));
                		return false;
                	}
                	
                	var entries = {
                        found: true,
                        items: {}
                	};
                	
                	panel.get('packet-tpls').getStore().each(function(record, idx) {
                		if(!record.get('vgid') && this.found) {
                			this.found = false;
                		}
                        this.items['entries[' + idx + ']'] = Ext.encode(Ext.copyTo({}, record.data, 'packetentryid,vgid'));
                	}, entries);
                	
                	if(!entries.found) {
                		Ext.Msg.error(Ext.app.Localize.get('There is template without account'));
                		return false;
                	}
                	
                	form.submit({
                		url: 'config.php',
                		scope: panel,
                		paramsAsHash: true,
                		waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                		params: Ext.apply({
                			async_call: 1,
                			devision: 5,
                			setuserpacket: 1
                		}, entries.items || {}),
                		success: function(form, action) {
                			if(form.getValues().userpacketid == 0) {
                				form.setValues({
                				    userpacketid: action.result.data.userpacketid
                				});
                			}
                			this.get('packet-tpls').getStore().commitChanges();
                		},
                		failure: function(form, action) {
                			Ext.Msg.error(action.result.error);
                		}
                	});
                }
            }],
            items: [{
                xtype: 'hidden',
                name: 'userid'
            }, {
            	xtype: 'hidden',
            	name: 'packetid'
            }, {
                xtype: 'hidden',
            	name: 'userpacketid'
            }, {
            	xtype: 'hidden',
            	name: 'state',
            	value: 0
            }, {
                xtype: 'container',
                itemId: 'packet-item',
                fieldLabel: Ext.app.Localize.get('Package'),
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    iconCls: 'ext-add',
                    itemId: 'packet-add',
                    handler: function(Btn) {
                    	var form = Btn.findParentByType('form');
                    	
                    	showPacketsWindow({
                            modal: true,
                            grid: {
                            	editBtn: false,
                            	usersBtn: false,
                            	rmPack: false,
                            	sm: true,
                            	filter: {
                            		userid: form.getForm().getValues().userid
                            	}
                            },
                            callback: function(grid) {
                            	var model = grid.getSelectionModel(),
                            	    record;
                            	
                            	if(record = model.getSelected()) {
                            		this.form.getForm().setValues({
                                        packetid: record.get('packetid'),
                                        packetname: record.get('name')
                            		});
                            		
                            		this.grid.getStore().setBaseParam('getpackentries', 1).setBaseParam('packetid', record.get('packetid')).reload({
                                        params: {
                                        	start: 0
                                        }
                            		});
                            	}
                            }.createDelegate({
                                form: form,
                                grid: form.get('packet-tpls')
                            })
                    	});
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'textfield',
                    name: 'packetname',
                    readOnly: true,
                    cls: 'textfield-body-hide',
                    flex: 1
                }]
            }, {
                xtype: 'container',
                fieldLabel: Ext.app.Localize.get('Date'),
                layout: 'hbox',
                items: [{
                    xtype: 'tbtext',
                    text: Ext.app.Localize.get('Since') + ': ',
                    style: 'padding: 5 0 0 0;'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'datefield',
                    name: 'datefrom',
                    value: new Date(),
                    listeners: {
                    	beforerender: function(field) {
                    		field.validator = function(value) {
                    			this.field.setReadOnly(this.state.getValue() > 0 ? true : false);
                    		}.createDelegate({
                    			field: field,
                    			state: field.findParentByType('form').getForm().findField('state')
                    		})
                    	}
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'tbtext',
                    text: Ext.app.Localize.get('Till') + ': ',
                    style: 'padding: 5 0 0 0;'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'datefield',
                    name: 'dateto',
                    listeners: {
                        beforerender: function(field) {
                            field.validator = function(value) {
                                this.field.setReadOnly(this.state.getValue() > 1 ? true : false);
                            }.createDelegate({
                                field: field,
                                state: field.findParentByType('form').getForm().findField('state')
                            })
                        }
                    }
                }]
            }, {
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Comments'),
                name: 'comment'
            }, {
                xtype: 'grid',
                itemId: 'packet-tpls',
                loadMask: true,
                PAGELIMIT: 100,
                autoExpandColumn: 'packet-tpl-name-col-exp',
                height: 370,
                plugins: [vgBtn],
                columns: [{
					header: Ext.app.Localize.get('ID'),
					dataIndex: 'userpacketentryid',
					width: 35
				},{
                    header: Ext.app.Localize.get('Templates'),
                    id: 'packet-tpl-name-col-exp',
                    dataIndex: 'name',
                    renderer: function(value, meta, record) {
                    	return value || record.get('entryname');
                    }
                }, vgBtn, {
                    header: Ext.app.Localize.get('Account'),
                    dataIndex: 'vglogin',
                    width: 120
                }],
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    totalProperty: 'total',
                    fields: ['userpacketentryid', 'userpacketid', 'packetid', 'packetentryid', 'vgid', 'entryname', 'vglogin', 'state', 'name'],
                    baseParams: {
                        async_call: 1,
                        devision: 5,
                        getpackentries: 1
                    }
                }
            }]
        }]
    }).show(null, function(win) {
    	win.get('packets').getStore().reload({
    	   params: {
                start: 0
    	   }
    	});
    });
} // end showAccountPackages()

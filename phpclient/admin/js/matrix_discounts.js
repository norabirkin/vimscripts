// Auto render
Ext.onReady(function() {
    Ext.QuickTips.init();
    
    renderMDPanel('MDPanel');
});


/**
 * Render matrix discounts panel
 * @param   string, dom element ot render to
 * 
 */
function renderMDPanel( id ) {
    var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }

    var panel = getMDiscPanel({
        title: Ext.app.Localize.get('Matrix discounts')
    });
    
    panel.render(id);
    panel.setHeight(800);
    panel.setWidth(900);
} // end renderMDPanel()


/**
 * Get promotion panel element with the list of elements
 * @param    
 */
function getMDiscPanel( config )
{
	var config = config || {};
	var PAGELIMIT = 100;
	config.rulesGrid = config['rulesGrid'] || {};
	config.ruleItemGrid = config['ruleItemGrid'] || {};
	
	if(!Ext.isDefined(config['title'])) {
        config.title = Ext.app.Localize.get('Matrix discounts');
    }
    
    var rmBtn = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('Remove'),
        width: 22,
        iconCls: 'ext-drop'
    });
    
    rmBtn.on('action', function(grid, record) {
        Ext.Msg.confirm(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Do You really want to remove selected record'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 124,
                    delrule: 1,
                    recordid: record.get('id')
                },
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
            record: record,
            grid: grid
        });
    });
    
    var grid = new Ext.grid.EditorGridPanel(
    	Ext.apply({
            xtype: 'editorgrid',
            id: 'matrixgrid',
            loadMask: true,
    		itemId: 'ruleItemGrid',
    		autoExpandColumn: 'rule-item-name-exp',
    		clicksToEdit: 1,
    		PAGELIMIT: 100,
    		listeners: {
    			beforerender: function(grid) {			
    				grid.getStore().on('load', function(store){
                        this.tbar.persDisc[grid.getStore().find('type', 3) > -1 ? 'disable' : 'enable']();
    				}, {
                        tbar: {
                            persDisc: grid.getTopToolbar().get('discountModels').menu.get('personalDiscount')
                        }
                    });
                    
    				grid.getStore().on('update', function(store, record, action) {
    					this.tbar.persDisc[grid.getStore().find('type', 3) > -1 ? 'disable' : 'enable']();
    					
                        if(action != Ext.data.Record.EDIT) {
                        	return;
                        }
                        
                        var params = Ext.copyTo({}, record.data);

                        Ext.Ajax.request({
                            url: 'config.php',
                            timeout: 3800000,
                            method: 'POST',
                            params: Ext.apply({
                                async_call: 1,
                                devision: 124,
                                setrule: 1,
                            }, record.data),
                            scope: {
                                record: record,
                                store: store
                            },
                            callback: function(opt, success, resp){
                                try {
                                    // Decode JSON data
                                    var data = Ext.decode(resp.responseText)
                                    
                                    if(!data['success']) {
                                        throw(data.error);
                                    }
                                    
                                    this.store.commitChanges();
                                    
                                    //Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                                }
                                catch(e) {
                                    Ext.Msg.error(e);
                                }
                            }
                        });
    				}, {
    					tbar: {
                            persDisc: grid.getTopToolbar().get('discountModels').menu.get('personalDiscount')
    					}
    				});
    			}
    		},
    		tbar: [{
                xtype: 'button',
                iconCls: 'ext-add',
                text: Ext.app.Localize.get('Add'),
                itemId: 'discountModels',
                setRuleItem: function(config) {
                	var config = config || {},
                	    grid = this.findParentByType('editorgrid'),
                	    store = grid.getStore();
                
                	store.insert(0, new store.recordType(Ext.applyIf(config, {
                        id: null,
                        type: 1,
                        descr: null,
                        method: 0,
                        serviceid: 0
                	})));
                	
                	store.getAt(0).set(id, 0);
                },
                menu: [{
                    text: Ext.app.Localize.get('Promotion'),
                    handler: function(item) {
                    	showPrmotionPanel({
                    		modal: true,
                    		win: {
                    			callback: function(grid) {
                    				var record = grid.getSelectionModel().getSelected();
                    				
                    				this.setRuleItem({
                    					type: 1,
                    					serviceid: record.get('recordid'),
                    					descr: record.get('name')
                    				})
                    			}.createDelegate(item.findParentByType('button'))
                    		},
                            grid: {
                            	title: null,
                            	tbarHidden: true,
                            	singleSelect: true
                            }
                    	});
                    }
                }, {
                	text: Ext.app.Localize.get('Package'),
                	handler: function(item) {
                		showPacketsWindow({
                			modal: true,
                			callback: function(grid) {
                                var record = grid.getSelectionModel().getSelected();
                                
                                this.setRuleItem({
                                    type: 2,
                                    serviceid: record.get('packetid'),
                                    descr: record.get('name')
                                })
                            }.createDelegate(item.findParentByType('button')),
                			grid: {
                				title: null,
                				editBtn: false,
                				rmPack: false,
                				sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: true })
                			}
                		});
                    }
                }, {
                    text: Ext.app.Localize.get('Personal discount'),
                    itemId: 'personalDiscount',
                    handler: function(item) {
                        item.findParentByType('button').setRuleItem({
                            type: 3
                        })
                    }
                }]
    		}],
    		bbar: {
				xtype: 'paging',
				pageSize: 100,
				store: this.store,
				displayInfo: true,
				items: ['-', {
					xtype: 'combo',
					width: 70,
					displayField: 'id',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: PAGELIMIT,
					editable: false,
					store: new Ext.data.ArrayStore({
						data: [
							['50'],
							['100'],
							['500'],
							['1000']
						],
						fields: ['id']
					}),
					listeners: {
						select: function(){
							PAGELIMIT = this.getValue() * 1;
							this.ownerCt.pageSize = PAGELIMIT;
							Ext.getCmp('matrixgrid').getStore().reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			}, 
    		plugins: [rmBtn],
            columns: [],
            store: {
            	xtype: 'jsonstore',
            	root: 'results',
            	totalProperty: 'total',
            	autoLoad: true,
            	fields: ['id', 'type', 'descr', 'method', 'serviceid'],
            	baseParams: {
            		async_call: 1,
            		devision: 124,
            		getmatrix: 1
            	}
            }
    	}, config)
    );
    
    var cm = [{
        header: Ext.app.Localize.get('Type'),
        dataIndex: 'type',
        itemId: 'type',
        width: 120,
        renderer: function(value) {
            switch(value) {
                case 1: return Ext.app.Localize.get('Promotion');
                case 2: return Ext.app.Localize.get('Package');
                case 3: return Ext.app.Localize.get('Personal discount');
            }
        }
    }, {
        header: Ext.app.Localize.get('Name'),
        dataIndex: 'descr',
        itemId: 'descr',
        id: 'rule-item-name-exp',
        renderer: function(value, meta, record) {
            return !record.get('descr') ? '---' : value;
        }
    }, {
        header: Ext.app.Localize.get('Action'),
        dataIndex: 'method',
        width: 120,
        editor: {
            xtype: 'combo',
            hiddenName: 'method',
            triggerAction: 'all',
            valueField: 'id',
            displayField: 'name',
            editable: false,
            mode: 'local',
            store: {
                xtype: 'arraystore',
                fields: ['id', 'name'],
                data: [
					[0, Ext.app.Localize.get('Sum')],
                    [1, Ext.app.Localize.get('Do not sum')]
                ]
            }
        },
        renderer: function(value) {
            return (value == 1) ? Ext.app.Localize.get('Do not sum') : Ext.app.Localize.get('Sum');
        }
    }];
    
    if(!Ext.isDefined(config['rmBtn']) || (Ext.isDefined(config['rmBtn']) && config.rmBtn)) {
        cm.push(rmBtn);
    }
    
    grid.getColumnModel().setConfig(cm);
    
    return grid;
} // end getMDiscPanel()

/**
 * This widget shows information about rent charges, balance history and
 * locks for the selected user account
 * To activate services history show be passed module type
 *
 * Repository information:
 * $Date: 2009-11-30 10:54:33 $
 * $Revision: 1.1.2.3 $
 */

function Charges( obj )
{
    if (!Ext.isEmpty(Ext.getCmp('ChargesPanel'))){
        return
    }

	Ext.QuickTips.init();
	var PAGELIMIT = 100;
    var obj = obj || {};
	obj.module = Ext.isDefined(obj['module']) ? obj.module : 0;
	obj.moduletype = Ext.isDefined(obj['moduletype']) ? obj.moduletype : null;

    formatDate = function(value, format){
		var format = format || 'd.m.Y H:i';
        try {
            if (value.format('Y') <= 1970 || value.format('Y') >= 9000) {
                return '-';
            }
            else {
                return value.format(format);
            }
        }
        catch (e) {
            return '-';
        }
    }

    var S = {
        rent: new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total'
            }, [{ name: 'period', type: 'date', dateFormat: 'Y-m-d' },
				{ name: 'dateofcharge', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'agrm_id', type: 'int' },
				{ name: 'uid', type: 'int' },
				{ name: 'vg_id', type: 'int' },
				{ name: 'cur_id', type: 'int' },
				{ name: 'curr_symbol', type: 'string' },
				{ name: 'vg_login', type: 'string' },
				{ name: 'agrm_num', type: 'string' },
				{ name: 'user_name', type: 'string' },
				{ name: 'amount', type: 'float' }
			]),
            baseParams: {
                async_call: 1,
                devision: 2,
                rentgrid: 1,
				vgid: obj.vgid || 0,
				agrmid: obj.agrmid || 0,
				emptyamount: 1,
                datefrom: new Date().format('Y-m-01'),
                datetill: new Date().add(Date.MONTH, 1).format('Y-m-01')
            },
            sortInfo: {
                field: 'period',
                direction: "DESC"
            }
        }),
        balance: new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total'
            }, [{
                name: 'dt',
                type: 'date',
                dateFormat: 'Y-m-d H:i:s'
            }, {
                name: 'agrm_id',
                type: 'int'
            }, {
                name: 'uid',
                type: 'int'
            }, {
                name: 'vg_id',
                type: 'int'
            }, {
                name: 'cur_id',
                type: 'int'
            }, {
                name: 'curr_symbol',
                type: 'string'
            }, {
                name: 'vg_login',
                type: 'string'
            }, {
                name: 'agrm_num',
                type: 'string'
            }, {
                name: 'user_name',
                type: 'string'
            }, {
                name: 'balance',
                type: 'float'
            }]),
            baseParams: {
                async_call: 1,
                devision: 2,
                balancegrid: 1,
				vgid: obj.vgid || 0,
				agrmid: obj.agrmid || 0,
                datefrom: new Date().format('Y-m-01'),
                datetill: new Date().add(Date.MONTH, 1).format('Y-m-01')
            },
            sortInfo: {
                field: 'dt',
                direction: "DESC"
            }
        }),
		locks: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST'
			}),
			reader: new Ext.data.JsonReader({
				root: 'results',
				totalProperty: 'total'
			}, [{
				name: 'timefrom',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'timeto',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'block_type',
				type: 'int'
			}, {
				name: 'agrm_num',
				type: 'string'
			}, {
				name: 'vg_login',
				type: 'string'
			}, {
				name: 'manager_name',
				type: 'string'
			}]),
			baseParams: {
				async_call: 1,
				devision: 2,
				agrmid: obj.agrmid || 0,
				historylocks: obj.vgid || 0,
				datefrom: new Date().add(Date.MONTH, -3).format('Y-m-01'),
				datetill: new Date().add(Date.MONTH, 1).format('Y-m-01')
			},
			sortInfo: {
				field: 'timeto',
				direction: "DESC"
			}
		}),
		usbox: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST',
				timeout: 380000
			}),
			reader: new Ext.data.JsonReader({
				root: 'results',
				totalProperty: 'total'
			}, [{ name: 'dt', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'period', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'agrm_id', type: 'int' },
				{ name: 'vg_id', type: 'int' },
				{ name: 'agent_id', type: 'int' },
				{ name: 'agent_type', type: 'int' },
				{ name: 'agent_descr', type: 'string' },
				{ name: 'tar_descr', type: 'string' },
				{ name: 'cat_descr', type: 'string' },
				{ name: 'curr_symbol', type: 'string' },
				{ name: 'user_name', type: 'string' },
				{ name: 'agrm_num', type: 'string' },
				{ name: 'vg_login', type: 'string' },
				{ name: 'tar_id', type: 'int' },
				{ name: 'volume', type: 'float' },
				{ name: 'amount', type: 'float' }]),
			baseParams: {
				async_call: 1,
				devision: 104,
				getserv: 3,
				groupitem: 1,
				emptyamount: 1,
				module: obj.module,
				datefrom: new Date().add(Date.MONTH, -3).format('Y-m-01'),
				datetill: new Date().add(Date.MONTH, 1).format('Y-m-01'),
				vgid: obj.vgid,
				agrmid: obj.agrmid,
				start: 0,
				limit: PAGELIMIT
			},
			sortInfo: {
				field: 'period',
				direction: "DESC"
			}
		})
    }
    
    new Ext.Window({
        title: Ext.app.Localize.get('Rent charges') + ' / ' + Ext.app.Localize.get('Balance history') + ' / ' + Ext.app.Localize.get('Locks'),
        id: 'ChargesPanel',
        width: 960,
        layout: 'fit',
        viewConfig: {forceFit: true},
        constrain: true,
        tbar: [Ext.app.Localize.get('Since') + ':&nbsp;', {
            xtype: 'datefield',
            id: 'DFROM_Field',
            allowBlank: false,
            format: 'Y-m-d',
            value: new Date().format('Y-m-01')
        }, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
            xtype: 'datefield',
            id: 'DTILL_Field',
            allowBlank: false,
            format: 'Y-m-d',
            value: new Date().add(Date.MONTH, 1).format('Y-m-01')
        }, '&nbsp;', {
            xtype: 'button',
            iconCls: 'ext-search',
            handler: function(){
				var g = this.ownerCt.ownerCt.items.first().getActiveTab();
				g.store.baseParams.datefrom = this.ownerCt.find('id', 'DFROM_Field')[0].getValue().format('Y-m-d');
                g.store.baseParams.datetill = this.ownerCt.find('id', 'DTILL_Field')[0].getValue().format('Y-m-d');
                g.store.reload({
                    params: {
                        start: 0,
                        limit: PAGELIMIT
                    }
                })
            }
        }, '-', Ext.app.Localize.get('Hide empty charges') + ':&nbsp;', {
			xtype: 'checkbox',
			handler: function(C, S){
				var P = C.ownerCt.ownerCt.items.first();
				if(P.getActiveTab().getId() == 'RentGrid' || P.getActiveTab().getId() == 'USBoxGrid') {
					P.getActiveTab().getStore().baseParams.emptyamount = (S) ? 1 : 0;
				}
			}
		}],
        items: [{
			xtype: 'tabpanel',
			activeTab: (obj.moduletype == 13) ? 3 : 0,
			listeners: {
				tabchange: function(t, g){
					t.ownerCt.getTopToolbar().findByType('checkbox')[0][(g.getId() == 'RentGrid' || g.getId() == 'USBoxGrid') ? 'enable' : 'disable']()
					t.ownerCt.getTopToolbar().findByType('checkbox')[0].setValue((g.getStore().baseParams['emptyamount'] == 1) ? true : false);

					if (Ext.isDefined(g.store.baseParams.datefrom) && !Ext.isEmpty(g.store.baseParams.datefrom)) {
						this.ownerCt.getTopToolbar().find('id', 'DFROM_Field')[0].setValue(g.store.baseParams.datefrom);
					}
					else {
						g.store.baseParams.datefrom = this.ownerCt.getTopToolbar().find('id', 'DFROM_Field')[0].getValue().format('Y-m-d');
					}

					if (Ext.isDefined(g.store.baseParams.datetill) && !Ext.isEmpty(g.store.baseParams.datetill)) {
						this.ownerCt.getTopToolbar().find('id', 'DTILL_Field')[0].setValue(g.store.baseParams.datetill);
					}
					else {
						g.store.baseParams.datetill = this.ownerCt.getTopToolbar().find('id', 'DTILL_Field')[0].getValue().format('Y-m-d');
					}
					g.store.reload({
						params: {
							start: 0,
							limit: PAGELIMIT
						}
					})
	            }
			},
			items: [{
				title: Ext.app.Localize.get('Rent charges'),
	            xtype: 'grid',
				disabled: (obj.moduletype == 13) ? true : false,
	            id: 'RentGrid',
	            width: 766,
	            height: 380,
	            cm: new Ext.grid.ColumnModel([{
	                header: Ext.app.Localize.get('Date'),
	                dataIndex: 'period',
	                width: 87,
	                renderer: function(value){
						return formatDate(value, 'd.m.Y');
					}
	            }, {
					header: Ext.app.Localize.get('Date of charge'),
	                dataIndex: 'dateofcharge',
	                width: 116,
	                renderer: function(value){
						return formatDate(value, 'd.m.Y H:i');
					}
				}, {
	                header: Ext.app.Localize.get('User'),
	                dataIndex: 'user_name',
	                id: 'UserNameCol'
	            }, {
	                header: Ext.app.Localize.get('Agreement'),
	                dataIndex: 'agrm_num',
	                width: 150
	            }, {
	                header: Ext.app.Localize.get('Amount'),
	                dataIndex: 'amount',
	                width: 120
	            }, {
	                header: Ext.app.Localize.get('Currency'),
	                dataIndex: 'curr_symbol',
	                width: 60
	            }]),
	            store: S.rent,
	            loadMask: true,
	            autoExpandColumn: 'UserNameCol',
	            bbar: new Ext.PagingToolbar({
	                pageSize: PAGELIMIT,
	                store: S.rent,
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
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								S.rent.reload({ params: { limit: PAGELIMIT } });
							}
						}
					}]
	            })
	        }, {
				title: Ext.app.Localize.get('Balance history'),
				xtype: 'grid',
				id: 'BalanceGrid',
	            width: 766,
	            height: 380,
	            cm: new Ext.grid.ColumnModel([{
	                header: Ext.app.Localize.get('Date'),
	                dataIndex: 'dt',
	                width: 100,
	                renderer: function(value){
						return formatDate(value, 'd.m.Y H:i');
					}

	            }, {
	                header: Ext.app.Localize.get('User'),
	                dataIndex: 'user_name',
	                id: 'UserNameCol'
	            }, {
	                header: Ext.app.Localize.get('Agreement'),
	                dataIndex: 'agrm_num',
	                width: 150
	            }, {
					header: Ext.app.Localize.get('Account login'),
					dataIndex: 'vg_login',
					width: 110,
                    hidden: !obj.vgid ? true: false
				}, {
	                header: Ext.app.Localize.get('Balance'),
	                dataIndex: 'balance',
	                width: 120,
					tooltip: Ext.app.Localize.get('Balances on start'),
					renderer: function(v){
                        try {
                            return v.toFixed(2)
                        }
                        catch (e) {
                        }
					}
	            }, {
	                header: Ext.app.Localize.get('Currency'),
	                dataIndex: 'curr_symbol',
	                width: 60
	            }]),
	            store: S.balance,
	            loadMask: true,
	            autoExpandColumn: 'UserNameCol',
	            bbar: new Ext.PagingToolbar({
	                pageSize: PAGELIMIT,
	                store: S.balance,
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
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								S.balance.reload({ params: { limit: PAGELIMIT } });
							}
						}
					}]
	            })
			}, {
				xtype: 'grid',
				title: Ext.app.Localize.get('Locks'),
				id: 'LocksGrid',
				width: 766,
				cm: new Ext.grid.ColumnModel([{
					header: Ext.app.Localize.get('Lock set'),
					dataIndex: 'timefrom',
					width: 155,
	                renderer: function(value){
						return formatDate(value, 'd.m.Y H:i');
					}

				}, {
					header: Ext.app.Localize.get('Lock removed'),
					dataIndex: 'timeto',
					width: 125,
	                renderer: function(value){
						return formatDate(value, 'd.m.Y H:i');
					}

				}, {
					header: Ext.app.Localize.get('Login'),
					dataIndex: 'vg_login',
					width: 150
				}, {
					header: Ext.app.Localize.get('Manager'),
					dataIndex: 'manager_name',
					width: 120
				}, {
					header: Ext.app.Localize.get('Lock type'),
					dataIndex: 'block_type',
					id: 'LockTypeCol',
					renderer: function(v) {
						switch(v) {
							case 1: case 4: return '(' + v + ') ' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance');
							case 2: return '(' + v + ') ' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client');
							case 3: return '(' + v + ') ' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager');
							case 5: return '(' + v + ') ' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('bytraffic');
							case 10: return '(' + v + ') ' + Ext.app.Localize.get('Turned off');
							default: return '(' + v + ') ' + Ext.app.Localize.get('Active');
						}
					}
				}]),
				store: S.locks,
				loadMask: true,
				autoExpandColumn: 'LockTypeCol',
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: S.locks,
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
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								S.locks.reload({ params: { limit: PAGELIMIT } });
							}
						}
					}]
				})
			}, {
				xtype: 'grid',
				title: Ext.app.Localize.get('Services history') + " (UsBox)",
				id: 'USBoxGrid',
				disabled: (obj.moduletype == 13 || obj.agrmid) ? false : true,
				width: 766,
				height: 380,
				cm: new Ext.grid.ColumnModel({
					columns: [{
						header: Ext.app.Localize.get('Date'),
						dataIndex: 'period',
						width: 90,
						renderer: function(value, metaData, record) {
							try {
								metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
								return value.format('d.m.Y');
							}
							catch(e) {
								return value;
							}
						}
					}, {
						header: Ext.app.Localize.get('Date of charge-off'),
						dataIndex: 'dt',
						width: 100,
						renderer: function(value, metaData, record) {
							try {
								metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
								return value.format('d.m.Y');
							}
							catch(e) {
								return value;
							}
						}
					}, {
						header: Ext.app.Localize.get('Account'),
						dataIndex: 'vg_login',
						id: 'usboxlogin'
					}, {
						header: Ext.app.Localize.get('Category'),
						dataIndex: 'cat_descr',
						width: 160
					}, {
						header: Ext.app.Localize.get('Quantity'),
						dataIndex: 'volume',
						width: 75
					}, {
						header: Ext.app.Localize.get('Write-off'),
						dataIndex: 'amount',
						width: 110,
						renderer: function(value, metaData, record) {
							var v = value * 1;
							return (Ext.isNumber(value) ? v.toFixed(2) : v) + ' ' + record.data.curr_symbol;
						}
					}],
					defaults: {
						menuDisabled: true
					}
				}),
				store: S.usbox,
				loadMask: true,
				autoExpandColumn: 'usboxlogin',
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: S.usbox,
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
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.pageSize = PAGELIMIT;
								S.usbox.reload({ params: { limit: PAGELIMIT } });
							}
						}
					}]
				})
			}, {
			    xtype: 'grid',
                title: Ext.app.Localize.get('Discounts'),
                itemId: 'DiscGrid',
                width: 766,
                height: 380,
                PAGELIMIT: 100,
                loadMask: true,
                disabled: !obj.vgid ? true: false,
                autoExpandColumn: 'tarname-col-exp',
                listeners: {
                    beforerender: function(grid) {
                        grid.store.setBaseParam('limit', grid.PAGELIMIT);
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
                                data: [['50'], ['100'], ['500']],
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
                    }
                },
                bbar: {
                    xtype: 'paging',
                    pageSize: 0,
                    displayInfo: true
                },
                columns: [{
                    header: Ext.app.Localize.get('Name'),
                    dataIndex: 'name'
                }, {
                    header: Ext.app.Localize.get('Tarif'),
                    id: 'tarname-col-exp',
                    width: 300,	
                    dataIndex: 'tar_name' 
                }, {
					header: Ext.app.Localize.get('Category'),
					width: 200,	
					dataIndex: 'category'
				}, {
                    header: Ext.app.Localize.get('Since'),
                    dataIndex: 'timefrom',
                    renderer: function(value) {
                        try {
                            return value.format('d.m.Y H:i');
                        }
                        catch(e){ }
                        return value;
                    },
                    width: 120
                }, {
                    header: Ext.app.Localize.get('Till'),
                    dataIndex: 'timeto',
                    renderer: function(value) {
                        try {
                            return value.format('d.m.Y H:i');
                        }
                        catch(e){ }
                        return value;
                    },
                    width: 120
                }, 
                {
					header: Ext.app.Localize.get('Cost with discount'),
					dataIndex: 'costwithdisc',
					width: 170
				}],
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    totalProperty: 'total',
                    fields: ['name', 'tar_name', 
							//'rent', 'block_rent', 'rate', 
							'costwithdisc', 'category',
                        { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                        { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
                    ],
                    baseParams: {
                        async_call: 1,
                        devision: 2,
                        getdiscountsstat: 1,
                        vgid: obj.vgid || 0
                    }
                }
			}, 
 
			/*
			* Рассрочки платежей / installment plans
			*/
			{
				xtype: 'grid',
				title: Ext.app.Localize.get('Repayment installments'),
				id: 'installmentsVgGrid',
				disabled: (obj.moduletype == 13 || obj.agrmid) ? false : true,
				width: 766,
				height: 380,
				cm: new Ext.grid.ColumnModel({
					columns: [{
						header: Ext.app.Localize.get('Installment plan'),
						dataIndex: 'planname',
						width: 220
					}, {
						header: Ext.app.Localize.get('Service'),
						dataIndex: 'servname',
						width: 220
					}, {
						header: Ext.app.Localize.get('Periodical payment'),
						dataIndex: 'amount',
						width: 180
					}, {
						header: Ext.app.Localize.get('Pay date'),
						dataIndex: 'dt',
						width: 180
					}],
					defaults: {
						sortable: true,
						menuDisabled: true
					}
				}),					
	            store: {
	            	xtype: 'jsonstore',
	                root: 'results',
					autoLoad: true,
	                totalProperty: 'total',
	                fields: ['planid', 'servid', 'amount', 'dt', 'processedtime', 'planname', 'servname'],
	                baseParams: {
	                    async_call: 1,
	                    devision: 29,
	                    getvginstallments: 1,
						vgid: obj.vgid,
						limit: PAGELIMIT,
						start: 0
	                },
					remoteSort: true,
					sortInfo: {
						field: 'dt',
						direction: "ASC"
					},
	            },
				loadMask: true,
				bbar: new Ext.PagingToolbar({
					xtype: 'paging',
					pageSize: PAGELIMIT,
					displayInfo: true
				}),
				listeners: {
					beforerender: function(grid) {
	                    // Set paging bar
	                    grid.getStore().setBaseParam('limit', PAGELIMIT);
	                    var bbar = grid.getBottomToolbar();
	                    bbar.pageSize = PAGELIMIT;
	                    bbar.bindStore(grid.store);
	                    // Synchronize filter with store
	                    grid.getStore().syncStore = function() {
	                        return this.getStore().baseParams;
	                    }.createDelegate(grid);
	                }
				}
			}]
		}]
    }).show();
} // end Charges()

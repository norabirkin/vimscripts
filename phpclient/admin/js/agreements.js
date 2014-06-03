/**
 * JavaScript engine for the system agreements
 *
 * Repository information:
 * @date		$Date: 2011-07-13 18:26:05 +0400 (Срд, 13 Июл 2011) $
 * @revision	$Revision: 15349 $
 */

Ext.onReady(function(){
	Ext.QuickTips.init();
	// Show agreement panel
	showAgrmPanel('AgrmPanelPlace');
});

/**
 * Global function to build and render to document parent panel
 * @param {Object} renderTo
 */
function showAgrmPanel(renderTo) {
	// View Cookie name
	var COOKIE = 'node24';
	// Let it be global define for the page limit
	var PAGELIMIT = 100;
	// Global variable to customize common grids height
	var GRIDHEIGHT = 750;
	// Auto load
	//AUTOLOAD = true;

	new Ext.grid.EditorGridPanel({
		xtype: 'editorgrid',
		id: 'AgrmsGrid',
		clicksToEdit: 1,
		title: Ext.app.Localize.get('Agreements'),
		renderTo: renderTo,
		height: GRIDHEIGHT,
		loadMask: true,
		autoExpandColumn: 'oper-exp-col',
		listeners: {
			afterrender: function() {
				if (Ext.app.DefaultView.exists(COOKIE)) {
					var data = Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x1', false));
					if (data === true) {
						this.getTopToolbar().isAutoCh.setValue(data);
					}
					var data = Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false));
					if (data === true) {
						this.getTopToolbar().AdvSrch.setValue(data);
					}
				}
				if(!this.getTopToolbar().AdvSrch.getValue() && AUTOLOAD) {
					new Ext.util.DelayedTask(function(){
						this.getStore().reload({
							params: {
								start: 0
							}
						});
					}.createDelegate(this)).delay(Ext.isGeko ? 160 : 90);
				}
			},
			beforerender: function(grid) {
				// Set bottom page bar
				grid.getStore().setBaseParam('limit', PAGELIMIT);
				var bbar = grid.getBottomToolbar();
				bbar.pageSize = PAGELIMIT;
				bbar.bindStore(grid.store);
				bbar.add(['-', {
					xtype: 'combo',
					width: 70,
					displayField: 'id',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: PAGELIMIT,
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
									limit: PAGELIMIT
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

				// Build column model before render
				grid.getColumnModel().setConfig([{
					header: 'UID',
					hidden: true,
					dataIndex: 'uid'
				}, {
					header: Ext.app.Localize.get('Operator'),
					dataIndex: 'operid',
					id: 'oper-exp-col',
					renderer: function(value, meta, record) {
						var idx = -1;
						if((idx = this.getEditor().getStore().find('uid', value)) > -1) {
							return this.getEditor().getStore().getAt(idx).get('name');
						}
						return Ext.app.Localize.get('Undefined');
					},
					editor: new Ext.form.ComboBox({
						xtype: 'combo',
						displayField: 'name',
						valueField: 'uid',
						mode: 'local',
						triggerAction: 'all',
						value: 0,
						editable: false,
						store: {
							xtype: 'jsonstore',
							url: 'config.php',
							method: 'POST',
							timeout: 3800000,
							root: 'results',
							autoLoad: true,
							fields: [
								{ name: 'uid', type: 'int' },
								{ name: 'name', type: 'string' },
								{ name: 'descr', type: 'string' }
							],
							baseParams: {
								async_call: 1,
								devision: 24,
								getopers: 1
							}
						}
					})
				}, {
					header: Ext.app.Localize.get('Agreement'),
					dataIndex: 'number',
					width: 120,
					renderer: function(value, meta, record) {
						if(record.get('closedon'))
						{
							meta.style += "color:grey;"; 
						}
						return (value || Ext.app.Localize.get('Undefined'));
					}
				}, {
					header: Ext.app.Localize.get('Paycode'),
					dataIndex: 'code',
					editor: new Ext.form.TextField({})
				}, {
					header: Ext.app.Localize.get('Balance'),
					dataIndex: 'balance',
					width: 110,
					renderer: function(value, meta, record) {
						if(record.get('balancestatus') > 1) {
							meta.css += record.get('balancestatus') == 2 ? " x-type-deptor-disconnect " : " x-type-deptor-terminate ";
						}
						if(value > 0) {
							meta.style += "color:green;";
						}
						if(value < 0) {
							meta.style += record.get('balancestatus') > 1 ? "color:white;" : "color:red;";
						}
						return value.toFixed(2);
					}
				}, {
					header: Ext.app.Localize.get('Currency'),
					dataIndex: 'curid',
					renderer: function(value, meta, record) {
						var idx = -1;
						if((idx = this.getEditor().getStore().find('id', value)) > -1) {
							return this.getEditor().getStore().getAt(idx).get('symbol');
						}
						return Ext.app.Localize.get('Undefined');
					},
					editor: new Ext.form.ComboBox({
						xtype: 'combo',
						displayField: 'symbol',
						valueField: 'id',
						mode: 'local',
						triggerAction: 'all',
						value: 0,
						editable: false,
						store: {
							xtype: 'jsonstore',
							url: 'config.php',
							method: 'POST',
							timeout: 3800000,
							autoLoad: true,
							root: 'results',
							fields: [
								{ name: 'id', type: 'int' },
								{ name: 'def', type: 'int' },
								{ name: 'symbol', type: 'string' },
								{ name: 'name', type: 'string' }
							],
							baseParams: {
								async_call: 1,
								devision: 24,
								getcurr: 1
							}
						}
					})
				}, {
					header: Ext.app.Localize.get('Credit'),
					dataIndex: 'credit',
					editor: new Ext.form.NumberField({})
				}, grid.plugins[0], {
					header: Ext.app.Localize.get('Remind'),
					dataIndex: 'blimit',
					width: 70,
					editor: new Ext.form.NumberField({})
				}]);
			},
			cellclick: function(grid, rowIdx, colIdx, e) {
				var record = grid.getStore().getAt(rowIdx);

				switch(grid.getColumnModel().getDataIndex(colIdx)) {
					case 'operid':
					case 'curid':
						if(record.get('agrmid') > 0) {
							return false;
						}
					break;

					case 'blimit':
						if(record.get('bnotify') < 1) {
							return false;
						}
					break;

					// awful hint to be compatible with existing number/addons widget
					case 'number':
						var params = [];

						// Prepare main items
						Ext.iterate(record.data, function(key, item, data){
							var name;

							switch(key) {
								case 'number':
									name = 'num';
								break;

								case 'operid':
									name = 'oper';
								break;

								default: name = key;
							}

							this.push({
								xtype: 'hidden',
								name: 'agrms[' + data.agrmid + '][' + name + ']',
								value: item
							});
						}, params);

						// Build addon fields
						Ext.each(record.json.addons, function(item){
							this.push({
								xtype: 'hidden',
								name: 'aaddons[' + record.json.agrmid + '][' + item.name + ']',
								listeners: {
									afterrender: function(field){
										field.el.dom.setAttribute('value', item.type ? item.idx : item.strvalue);
										field.el.dom.setAttribute('fieldname', this.fieldname);
									}.createDelegate({
										fieldname: item.name
									})
								}
							});
						}, params);

						// Remove previous form with was not destroyed
						if(Ext.getCmp('AAformBuff')) {
							Ext.getCmp('AAformBuff').destroy();
						}

						var form = new Ext.form.FormPanel({
							id: 'AAformBuff',
							frame: false,
							renderTo: Ext.getBody(),
							items: params
						});

						AgrmProperties(form.getForm().id, record.get('agrmid'), function(){
							var data = this.form.getForm().getValues();

							// Compare and fill the main data structure
							Ext.iterate(this.record.data, function(key, item){
								var name;

								switch(key) {
									case 'number':
										name = 'num';
									break;

									case 'operid':
										name = 'oper';
									break;

									default: name = key;
								}

								if (Ext.isDefined(this.data['agrms[' + this.record.get('agrmid') + '][' + name + ']']) && this.record.fields.map[key]) {
									this.record.data[key] = this.record.fields.map[key].type.convert(this.data['agrms[' + this.record.get('agrmid') + '][' + name + ']']);
								}
							}, {
								record: this.record,
								data: data
							});

							// Compare and fill addons
							var addons = [];
							Ext.iterate(data, function(key, item){
								if (this.tpl.test(key)) {
									this.addons.push({
										agmid: this.record.get('agrmid'),
										name: key.replace(this.tpl, '$1'),
										strvalue: item,
										idx: isNaN(item) ? null : (item * 1)
									});
								}
							}, {
								record: record,
								addons: addons,
								tpl: /^aaddons\[[0-9]+\]\[(.*)\]/i
							});

							this.record.json.addons = addons;

							this.record.set('update', 1);
							this.form.destroy();
						}.createDelegate({
							form: form,
							record: record
						}));
					break;

					// Change balance
					case 'balance':
						setPayment({
							uid: record.get('uid'),
							agrmid: record.get('agrmid'),
				            vgid: null,
				            onpayment: function(o){
				                this.getStore().reload();
				            },
				            onpromised: function(o){
				                this.getStore().reload();
				            },
				            scope: grid
				        });
					break;
				}
			},
			render: function(grid) {
				var store = grid.getStore();
				var view = grid.getView();
				/*grid.tip = new Ext.ToolTip({
					target: view.mainBody,
					delegate: '.x-grid3-row',
					trackMouse: true,
					renderTo: document.body,
					maxWidth: 500,
					tpl: new Ext.XTemplate('<div style="color: back; font-weight: bold; width: 200px;">{[Ext.app.Localize.get("Additional information")]}:</div><ul>',
						'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Deptor")]}:</span> ',
						'<tpl if="balancestatus == 2">{[Ext.app.Localize.get("Disconnection")]}</tpl>',
						'<tpl if="balancestatus == 3">{[Ext.app.Localize.get("Termination")]}</tpl>',
						'<tpl if="balancestatus &lt; 2">{[Ext.app.Localize.get("None")]}</tpl>',
						'</li>',
						'<tpl if="isauto &gt; 0"><li style="padding-top: 3px"><span style="color:black">{[Ext.app.Localize.get("Contract was created automatically")]}</span></li></tpl>',
						'</ul>'
					),
					listeners: {
						beforeshow: function updateTipBody(tip) {
							var rowIndex = view.findRowIndex(tip.triggerElement);
							tip.tpl.overwrite(tip.body, store.getAt(rowIndex).data);
						}
					}
				});*/
			}
		},
		// Function to compose storage base params for server list filtering
		// @param	boolean, if pass true to function than call storage load
		// @param	boolean, reset list
		advSearch: function(l,r){
			var c = Ext.getCmp('advSearchList');
			var n = new RegExp('searchtpl','i');
			var s = {};
			var l = l || false;
			if(r === true){
				c.setValue('');
			}
			var Store = this.getStore();
			for(var i in Store.baseParams){
				if(!n.test(i)) {
					s[i] = Store.baseParams[i];
				}
			}
			Store.baseParams = s;
			if(c.mainStore.find('tplname', c.getValue()) > -1) {
				c.mainStore.each(function(r,idx){
					if(r.data.tplname != this.tplname) {
						return;
					}
					for(var i in r.data) {
						if(i == 'tplname') {
							continue;
						}
						this.store.baseParams['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
					}
				}, { store: Store, tplname: c.getValue() });
			}
			if(l) {
				Store.load({ params: { start: 0, limit: this.PAGELIMIT } });
			}
		},
		tbar: [	Ext.app.Localize.get('Autocreated') + ':&nbsp;', {
			xtype: 'checkbox',
			name: 'isauto',
			ref: 'isAutoCh',
			handler: function(box, state) {
				Ext.app.DefaultView.set(COOKIE, {
					x1: state ? 1 : 0
				});
				box.findParentByType('editorgrid').getStore().setBaseParam('isauto', state ? 1 : 0);
			}
		}, Ext.app.Localize.get('Advanced search') + ':&nbsp;', {
			xtype: 'checkbox',
			ref: 'AdvSrch',
			checked: false,
			handler: function(A, B){
				A.ownerCt.items.eachKey(function(A,B,C) {
					if(this.tpl.test(B.id)) {
						B[this.checked ? 'show' : 'hide']();
					}
					if(this.tpl2.test(B.id)) {
						if(this.checked && Ext.isDefined(B['hasSearch']) && B['hasSearch']) {
							B.onTrigger1Click();
						}
						B[this.checked ? 'hide' : 'show']();
					}
				}, {
					checked: B,
					tpl: new RegExp('advSearch'),
					tpl2: new RegExp('SmplSearch')
				});

				Ext.app.DefaultView.set(COOKIE, {
					x5: B ? 1 : 0
				});

				if(!B){
					Ext.app.DefaultView.remove(COOKIE, 'x6');
					A.findParentByType('editorgrid').advSearch(true, true);
				}
				else {
					Ext.app.DefaultView.remove(COOKIE, 'x8');
				}
			}
		}, {
			xtype: 'combo',
			hidden: true,
			id: 'advSearchList',
			width: 194,
			displayField: 'tplname',
			valueField: 'tplname',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: true,
			listeners: {
				select: function() {
					if(Ext.app.DefaultView.exists(COOKIE)) {
						Ext.app.DefaultView.set(COOKIE, {
							x6: this.getRawValue()
						})
					}
				}
			},
			store: {
				xtype: 'arraystore',
				fields: [{ name: 'tplname', type: 'string' }],
				data: []
			},
			mainStore: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [
					{ name: 'tplname', type: 'string' },
					{ name: 'property', type: 'string' },
					{ name: 'condition', type: 'string' },
					{ name: 'date', type: 'date', dateFormat: 'd-m-Y' },
					{ name: 'value', type: 'string' },
					{ name: 'logic', type: 'string' }
				]),
				baseParams: {
					async_call: 1,
					devision: 42,
					getallsearchtpl: ''
				},
				autoLoad: true,
				listeners: {
					add: function(s,r,i){
						var C = Ext.getCmp('advSearchList');
						Ext.each(r, function(A){
							if(this.store.find('tplname', A.data.tplname) < 0) {
								this.store.add(A);
							}
							if(this.cookie && this.cookieData == A.data.tplname) {
								this.element.setValue(A.data.tplname);
								new Ext.util.DelayedTask(function(){
									this.advSearch(AUTOLOAD);
								}.createDelegate(Ext.getCmp('AgrmsGrid'))).delay(Ext.isGeko ? 160 : 90);
							}
						}, {
							element: C,
							store: C.store,
							mainStore: C.mainStore,
							cookie: Ext.app.DefaultView.exists(COOKIE),
							cookieData: Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false)) ? Ext.app.DefaultView.get(COOKIE, 'x6') : null
						});
					},
					load: function(s,r,i){
						s.events.add.listeners[0].fn(s,r,i);
					},
					remove: function(s,r,i){
						var C = Ext.getCmp('advSearchList');
						var f = C.store.find('tplsname', r.data.tplname);
						if(f > -1) {
							C.store.remove(C.store.getAt(f));
						}
					}
				}
			})
		}, {
			xtype: 'tbspacer',
			hidden: true,
			id: 'advSearchSpacer2',
			width: 5
		}, {
			xtype: 'button',
			id: 'advSearchStart',
			hidden: true,
			text: Ext.app.Localize.get('Search'),
			iconCls: 'ext-search',
			handler: function(Btn){
				Btn.findParentByType('editorgrid').advSearch(true);
			}
		}, {
			xtype: 'button',
			id: 'advSearchEdit',
			text: Ext.app.Localize.get('Change') + '&nbsp;' + Ext.app.Localize.get('rules') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
			hidden: true,
			handler: function(){
				fn = function(A){
					var C = Ext.getCmp('advSearchList');
					C.mainStore.each(function(r){
						if(r.data.tplname == this.tplname) {
							this.store.remove(r);
						}
					}, { store: C.mainStore, tplname: A.tplname});
					if(A.data.length > 0) {
						Ext.each(A.data, function(A){
							this.add(new this.recordType(A))
						}, C.mainStore);
						if(!Ext.isEmpty(A.data[0].tplname)) {
							C.setValue(A.data[0].tplname);
						}
					}
					else {
						var i = C.store.find('tplname', A.tplname);
						if(i > -1) {
							C.store.remove(C.store.getAt(i));
						}
						C.setValue('');
					}
				};
				var C = Ext.getCmp('advSearchList');
				var rules = [];
				C.mainStore.each(function(R){
					if(this.tplname == R.data.tplname){
						this.rules.push(R.data);
					}
				}, { rules: rules, tplname: C.getValue() });
				new SearchTemplate.show({
					tplname: C.getValue(),
					onsearch: fn,
					onsave: fn,
					onSaveClose: true,
					rules: rules
				})
			}
		}, {
			xtype: 'tbtext',
			id: 'SmplSearch0',
			text: Ext.app.Localize.get('Search') + ':&nbsp;'
		}, {
			xtype: 'combo',
			id: 'SmplSearch1',
			name: 'searchtype',
			width: 160,
			displayField: 'name',
			valueField: 'id',
			mode: 'local',
			triggerAction: 'all',
			value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x2', 0) : 0,
			editable: false,
			store: {
				xtype: 'arraystore',
				data: [
					['0', Ext.app.Localize.get('Person full name')],
					['1', Ext.app.Localize.get('Agreement')],
					['6', Ext.app.Localize.get('Paycode')],
					['2', Ext.app.Localize.get('User login')],
					['3', Ext.app.Localize.get('Account login')],
					['4', 'E-mail'],
					['5', Ext.app.Localize.get('Phone')],
					['7', Ext.app.Localize.get('Address')]
				],
				fields: ['id', 'name']
			},
			listeners: {
				select: function(combo) {
					Ext.app.DefaultView.set(COOKIE, {
						x2: combo.getValue()
					});
				}
			}
		}, {
			xtype: 'tbspacer',
			id: 'SmplSearch2',
			width: 5
		}, {
			xtype: 'textfield',
			id: 'SmplSearch3',
			name: 'fullsearch',
			value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3', '') : '',
			width: 180,
			listeners: {
				afterrender: function() {
					this.on('specialkey', function(f, e){
						if (e.getKey() == e.ENTER) {
							this.ownerCt.ownerCt.getStore().reload({
								params: {
									start: 0
								}
							})
						}
					}, this);
				},
				change: function(field, value) {
					Ext.app.DefaultView.set(COOKIE, {
						x3: value
					});
				}
			}
		}, {
			xtype: 'tbspacer',
			id: 'SmplSearch4',
			width: 5
		}, {
			xtype: 'button',
			id: 'SmplSearch5',
			text: Ext.app.Localize.get('Show'),
			iconCls: 'ext-search',
			handler: function(Btn) {
				Btn.ownerCt.ownerCt.getStore().reload({
					params: {
						start: 0
					}
				})
			}
		}],
		bbar: {
			xtype: 'paging',
			pageSize: 0,
			displayInfo: true
		},
		plugins: [
			new Ext.grid.CheckColumn({
				header: '&nbsp;',
				width: 30,
				dataIndex: 'bnotify',
				inputValue: 1
			})
		],
		view: new Ext.grid.GroupingView({
			groupTextTpl: '&nbsp;{[values.rs[0].data.username]}',
			getRowClass: function(record, rowIndex, rowParams, store){
				// Let us use blue style from the payments to indicate agreements those were created in auto mode
				if(record.get('isauto') > 0) {
					return 'x-type-payment-edited';
				}
				return '';
			}
		}),
		columns: [],
		store: {
			xtype: 'groupingstore',
			timeout: 380000,
			url: 'config.php',
			method: 'POST',
			id: 'allagrstore',
			totalProperty: 'total',
			groupField: 'uid',
			reader: new Ext.data.JsonReader({
				root: 'results'
			}, [
				{ name: 'agrmid', type: 'int' },
				{ name: 'uid', type: 'int' },
				{ name: 'username', type: 'string' },
				{ name: 'operid' , type: 'int' },
				{ name: 'bnotify', type: 'int' },
				{ name: 'blimit', type: 'int' },
				{ name: 'balance', type: 'float' },
				{ name: 'number', type: 'string' },
				{ name: 'idx', type: 'int' },
				{ name: 'credit', type: 'float' },
				{ name: 'code', type: 'string' },
				{ name: 'curid', type: 'int' },
				{ name: 'symbol', type: 'string' },
				{ name: 'date' },
				{ name: 'update', type: 'int' },
				{ name: 'penaltymethod', type: 'int' },
				{ name: 'isauto', type: 'int' },
				{ name: 'balancestatus', type: 'int' },
				{ name: 'closedon', type: 'date' },
				{ name: 'paymentmethod', type: 'int' },
				{ name: 'installments', type: 'int' },
				{ name: 'ownerid', type: 'int' },
				{ name: 'ablocktype', type: 'int' },
				{ name: 'ablockvalue', type: 'int' }
			]),
			baseParams: {
				async_call: 1,
				devision: 24,
				getagrms: 1
			},
			listeners: {
				update: function(store, record, action){
					if (action == Ext.data.Record.EDIT) {
						var data = Ext.apply(record.data, {
							async_call: 1,
							devision: 24,
							setagrm: record.data.agrmid
						});

						Ext.each(record.json.addons, function(item){
							var res = item.idx ? item.idx : '';
							this['agrmaddons[' + item.name + ']'] = res;
						}, data);

						Ext.Ajax.request({
							url: 'config.php',
							timeout: 3800000,
							method: 'POST',
							params: data,
							scope: {
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

									if(opt.params.agrmid <= 0) {
										this.record.data.agrmid = data.results.agrmid;
									}
									this.store.reload () ;
									this.record.data.update = 0;
									this.store.commitChanges();
									
								}
								catch(e) {
									Ext.Msg.error(e.error);
								}
							}
						});
					}
				}
			}
		}
	});
}

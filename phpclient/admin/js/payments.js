/**
 * JS engine to view history, select unit for pay or call to print receipt document
 *
 * Repository information:
 * @date		$Date: $
 * @revision	$Revision: $
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	showPanel('_PaymentsPanel');
});

/**
 * Control panel to join grids with agreements list and payments history list
 * @param	string, HTMLElement id to render to
 */
function showPanel( renderTo ) {
	if(!Ext.isDefined(renderTo) || !Ext.get(renderTo)) {
		return false;
	}
	var PAGELIMIT = 100;
	var PPAGELIMIT = 100;
	var Store = new Ext.data.GroupingStore({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST',
			timeout: 380000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'uid', type: 'int' },
			{ name: 'istemplate', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'balance', type: 'float' },
			{ name: 'agrmid', type: 'int' },
			{ name: 'agrmnum', type: 'string' },
			{ name: 'symbol', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'email', type: 'string' },
			{ name: 'phone', type: 'string' },
			{ name: 'addrtype', type: 'int' },
			{ name: 'addrcode', type: 'string' },
			{ name: 'address', type: 'string' },
			{ name: 'vgcnt', type: 'int' },
			{ name: 'login', type: 'string' },
			{ name: 'type', type: 'int' },
			{ name: 'address_1', type: 'string' },
			{ name: 'address_2', type: 'string' },
			{ name: 'address_3', type: 'string' },
			{ name: 'ppdebt', type: 'float' },
			{ name: 'category', type: 'int' },
			{ name: 'code', type: 'string' },
			{ name: 'opername', type: 'string' }
		]),
		sm: new Ext.grid.RowSelectionModel({
			singleSelect: true
		}),
		groupField: 'uid',
		baseParams:{
			async_call: 1,
			devision: 	22,
			getusers: 	0,
			listext: 	1,
			searchtype: 0,
			category: 	0,
			start: 		0,
			istemplate: 0,
			limit: 		PAGELIMIT
		},
		remoteSort: true,
		sortInfo: {
			field: 		'name',
			direction: 	'ASC'
		},
		autoLoad: AUTOLOAD,
		getUserCatName: function(cat) {
			switch(cat) {
				case 1: return Ext.app.Localize.get('Operator');
				case 2: return Ext.app.Localize.get('Dealer');
				case 3: return Ext.app.Localize.get('LegalOwner');
				case 4: return Ext.app.Localize.get('Advertiser');
				case 5: return Ext.app.Localize.get('Partner');
				case 6: return Ext.app.Localize.get('Agent');
				default: return Ext.app.Localize.get('Subscriber');
			}
		}
	});

	var UGroups = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'id', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'descr', type: 'string' }
		]),
		baseParams: {
            async_call: 1,
            devision: 22,
            getgroups: 1,
			limit: PPAGELIMIT
		},
		sortInfo: {
			field: 'id',
			direction: 'ASC'
		},
		autoLoad: true
	});

    var PStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams: {
			async_call: 1,
			devision: 199,
			getpayhistory: 0,
			start: 0,
			limit: PPAGELIMIT
        },
		reader: new Ext.data.JsonReader({
			root: 'results'
        }, [
			{ name: 'amount', type: 'float' },
			{ name: 'currid', type: 'int' },
			{ name: 'symbol', type: 'string' },
			{ name: 'ordernum', type: 'string' },
			{ name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'recipe', type: 'string' },
			{ name: 'comment', type: 'string' },
			{ name: 'registries', type: 'string' },
			{ name: 'mgr', type: 'string' },
			{ name: 'recordid', type: 'int' },
			{ name: 'uid', type: 'int' },
			{ name: 'classid', type: 'int' },
			{ name: 'classname', type: 'string'},
			{ name: 'localdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'agrmid', type: 'int' },
			{ name: 'lock_period', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'revisions', type: 'int' },
			{ name: 'revno', type: 'int' },
			{ name: 'fromagrmid', type: 'int' },
			{ name: 'canceldate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'orig_payment', type: 'float' },
			{ name: 'orig_agrm', type: 'int' },
			{ name: 'bsodoc', type: 'array' },
			{ name: 'use_bso', type: 'int' },
			{ name: 'isuprs', type: 'int' },
			{ name: 'uprsinfo', type: 'string' },
			{ name: 'paymentordernumber', type: 'string' }
		]),
		//sortInfo: {
		//	field: 'localdate',
		//	direction: "DESC"
		//},
		autoLoad: false
    });


	var RStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams: {
			async_call: 1,
			devision: 199,
			getdoctpls: 3
		},
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'docid', type: 'int' },
			{ name: 'name', type: 'string'}
		]),
		autoLoad: true
	});

	var PButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Save payment'),
		width: 22,
		dataIndex: 'agrmid',
		iconCls: function(record){
			if(record.get('istemplate')) {
				return 'ext-pay-dis';
			}
			else {
				return 'ext-payhistory'
			}
		}
	});

	var RButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Print a receipt'),
		width: 22,
		iconCls: 'ext-table'
	});

	var CButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		width: 22,
		iconCls: 'ext-edit',
		menuDisabled: true
	});
	
	var DButton = new Ext.grid.RowButton({ 
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Payment information'),
		width: 22,
		iconCls: function(record,x,c){
            if (record.get('isuprs')==1)
                return 'ext-text';
            return '';
        }
	});

	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
		width: 280,
		initComponent: function(){
			Ext.app.SearchField.superclass.initComponent.call(this);
			this.on('specialkey', function(f, e){
				if (e.getKey() == e.ENTER) {
					this.onTrigger2Click();
				}
            }, this);
        },
        validationEvent: false,
        validateOnBlur: false,
        trigger1Class: 'x-form-clear-trigger',
        trigger2Class: 'x-form-search-trigger',
        hideTrigger1: true,
        hasSearch: false,
        paramName: 'search',
        onTrigger1Click: function(){
            PStore.removeAll();
            if (this.hasSearch) {
                this.el.dom.value = '';
                var o = {
                    start: 0,
                    limit: PAGELIMIT
                };
                this.store.baseParams = this.store.baseParams ||{};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({
                    params: o
                });
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click: function(){
            PStore.removeAll();
            var v = this.getRawValue();

            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            }
            var o = {
                start: 0,
                limit: PAGELIMIT
            };
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({
                params: o
            });
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });

	// Function to compose storage base params for server list filtering
	// @param	boolean, if pass true to function than call storage load
	// @param	boolean, reset list
	advSearch = function(l,r){
		var c = Ext.getCmp('advSearchList');
		var n = new RegExp('searchtpl','i');
		var s = {};
		var l = l || false;
		if(r == true){
			c.setValue('');
		}
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
			Store.reload({ params: { start: 0, limit: PAGELIMIT } });
		}
	}

	new Ext.Panel({
		renderTo: renderTo,
		height: 850,
		width: 980,
		items: [{
			xtype: 'grid',
			title: Ext.app.Localize.get('Users') + ' / ' + Ext.app.Localize.get('Agreements'),
			height: 500,
			store: Store,
			loadMask: true,
			id: '_userAgreementsList',
			tbar: [{
				xtype: 'combo',
				id: '_usergrpsCombo',
				width: 200,
				tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				store: UGroups,
				listeners: {
					select: function() {
						Store.baseParams.getusers = this.getValue();
						Store.reload({ params: { start: 0, limit: PAGELIMIT }});
					}
				}
			}, {
				xtype: 'tbspacer',
				width: 5
			}, {
				xtype: 'combo',
				id: '_categoryCombo',
				width: 180,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: 0,
				editable: false,
				store: new Ext.data.ArrayStore({
					data: [
						['-1', 1, Ext.app.Localize.get('All')],
						['0', 1, Ext.app.Localize.get('Subscriber')],
						['1', 1, Ext.app.Localize.get('Operator')],
						['2', 1, Ext.app.Localize.get('Dealer')],
						['3', 1, Ext.app.Localize.get('LegalOwner')],
						['4', 1, Ext.app.Localize.get('Advertiser')],
						['5', 1, Ext.app.Localize.get('Partner')],
						['6', 1, Ext.app.Localize.get('Agent')]
					],
					fields: ['id', 'perm', 'name']
				}),
				listeners: {
					render: function(){
						Ext.Ajax.request({
							url: 'config.php',
							scope: this,
							success: function(a){
								var p = Ext.util.JSON.decode(a.responseText);
								var o = this.store.getAt(this.store.find('id', 1));

								if(p.filterperm[1] < 1) {
									o.data.perm = 0;
								}
							},
							params: { async_call: 1, devision: 22, filterperm: 0 }
						});
					},
					beforeselect: function(c, r, i){
						if(r.data.perm < 1) {
							Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Access restricted') + '!');
							return false;
						}
						return true;
					},
					select: function(){
						Store.baseParams.category = this.getValue();
						Store.reload({ params: { category: this.getValue() }});
					}
				}
			}, {
				xtype: 'tbseparator',
				style: {
					paddingLeft: '3px',
					paddingRight: '3px'
				}
			}, {
				xtype: 'checkbox',
				width: 23,
				height:23,
				checked: false,
				listeners: {
					render: function() {
						var qtip = document.createAttribute("ext:qtip");
						qtip.value = Ext.app.Localize.get('Advanced search');
						this.getEl().dom.attributes.setNamedItem(qtip);
					}
				},
				handler: function(A, B){
					A.ownerCt.items.eachKey(function(A,B,C) {
						if(this.checked) {
							if(this.tplA.test(B.id)) {
								B.show();
							}
							if(this.tplS.test(B.id)) {
								if(Ext.isDefined(B['hasSearch']) && B['hasSearch']) {
									B.onTrigger1Click();
								}
								B.hide();
							}
						}
						else {
							if(this.tplA.test(B.id)) {
								B.hide();
							}
							if(this.tplS.test(B.id)) {
								B.show();
							}
						}
					}, {
						checked: B,
						tplA: new RegExp('advSearch'),
						tplS: new RegExp('SmplSearch')
					});

					if(!B){
						advSearch(true, true);
					}
				}
			}, {
				xtype: 'combo',
				id: 'SmplSearchCombo',
				width: 164,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: 0,
				editable: false,
				store: new Ext.data.ArrayStore({
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
				}),
				listeners: {
					select: function(){
						Store.baseParams.searchtype = this.getValue();
					}
				}
			}, {
				xtype: 'tbspacer',
				width: 5
			}, new Ext.app.SearchField({
				id: 'SmplSearchField',
				store: Store,
				params: {
				    start: 0,
				    limit: PAGELIMIT
				},
				width: 227
			}), {
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
				store: new Ext.data.ArrayStore({
					fields: [{ name: 'tplname', type: 'string' }],
					data: []
				}),
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
							}, { store: C.store, mainStore: C.mainStore });
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
				width: 5
			}, {
				xtype: 'button',
				id: 'advSearchStart',
				hidden: true,
				text: Ext.app.Localize.get('Search'),
				iconCls: 'ext-search',
				handler: function(){
					advSearch(true);
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
			}],
			listeners: {
				render: function(grid) {
					var store = grid.getStore();
					var view = grid.getView();
					grid.tip = new Ext.ToolTip({
						target: view.mainBody,
						delegate: '.x-grid3-row',
						trackMouse: true,
						renderTo: document.body,
						maxWidth: 500,
						tpl: new Ext.XTemplate('<p style="color: back; font-weight: bold">{[Ext.app.Localize.get("Additional information")]}:</p><ul>',
							'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("User name")]}:</span> {name}</li>',
							'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Description")]}:</span> {descr}</li>',
							'<li style="padding-top: 3px"><span style="color: black">E-mail:</span> {email}</li>',
							'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Phone")]}:</span> {phone}</li>',
							'<li style="padding-top: 3px"><span style="color: black"><tpl if="type == 2">{[Ext.app.Localize.get("Registered address")]}</tpl><tpl if="type == 1">{[Ext.app.Localize.get("Legal address")]}</tpl>:</span> {address_1}</li>',
							'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Post address")]}:</span> {address_2}</li>',
							'<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Address to deliver invoice")]}:</span> {address_3}</li>',
							'</ul><br><p style="color: back; font-weight: bold">{[Ext.app.Localize.get("To see payment history, click on this row")]}</p>'
						),
						listeners: {
							beforeshow: function updateTipBody(tip) {
								var rowIndex = view.findRowIndex(tip.triggerElement);
								tip.tpl.overwrite(tip.body, store.getAt(rowIndex).data);
							}
						}
					})
				},
				rowclick: function(grid, rowIndex, e) {
					if(Store.getAt(rowIndex)) {
						PStore.baseParams.getpayhistory = Store.getAt(rowIndex).data.agrmid;
						PStore.baseParams.datefrom = Ext.getCmp('PFROM').getValue().format('Y-m-d');
						PStore.baseParams.datetill = Ext.getCmp('PTILL').getValue().format('Y-m-d');
						PStore.reload({ params: { limit: PPAGELIMIT } });
					}
				}
			},
			view: new Ext.grid.GroupingView({
				forceFit: true,
				enableGroupingMenu: false,
				groupTextTpl: '<span style="color:black">&nbsp;{[values.rs[0].data.name]} {[values.rs[0].data.email.length > 0 ? "&nbsp;::&nbsp;" + values.rs[0].data.email : ""]} {[values.rs[0].data.descr.length > 0 ? "&nbsp;::&nbsp;" + values.rs[0].data.descr : ""]}</span>'
			}),
			cm: new Ext.grid.ColumnModel({
				columns: [{
					header: 'UID',
					dataIndex: 'uid',
					width: 30,
					hidden: true
				}, PButton, {
					header: Ext.app.Localize.get('Agreement number'),
					width: 180,
					dataIndex: 'agrmnum'
				}, {
					header: Ext.app.Localize.get('Operator'),
					dataIndex: 'opername'
				}, {
					header: Ext.app.Localize.get('Paycode'),
					width: 80,
					dataIndex: 'code'
				}, {
					header: Ext.app.Localize.get('Balance'),
					dataIndex: 'balance',
					width: 110,
					renderer: function(value, metaData, record) {
						if (value < 0) {
							metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + '"'
							return '<span style="color:red">' + value + '</span> ' + record.get('symbol');
						}
						else {
							return value + ' ' + record.get('symbol');
						}
					}
				}, {
					header: Ext.app.Localize.get('Promised payment'),
					dataIndex: 'ppdebt',
					width: 115,
					sortable: false,
					renderer: function(value, metaData, record) {
							metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + ' ' + (value == 0 ? '(' + Ext.app.Localize.get('Empty data') + ')' : '') + '"';
							return value + ' ' + record.get('symbol');
					}
				}],
				defaults: {
					sortable: true,
					menuDisabled: true
				}
			}),
			plugins: [ PButton ],
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: Store,
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
							Store.reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			})
		}, {
			xtype: 'grid',
			title: Ext.app.Localize.get('Payments history'),
			height: 350,
			store: PStore,
			loadMask: true,
			id: '_paymentsHistory',
			autoExpandColumn: 'ordernumid',

			enableHdMenu: false,
			disableSelection: true,


			tbar: [
                Ext.app.Localize.get('Since') + ':&nbsp;',
                {
                    xtype: 'datefield',
                    id: 'PFROM',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: new Date().format('Y-m-01')
                }, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
                    xtype: 'datefield',
                    id: 'PTILL',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: new Date().add(Date.MONTH, 1).format('Y-m-01')
                }, '&nbsp;', {
                    xtype: 'button',
                    iconCls: 'ext-search',
                    handler: function(){
                        if (PStore.baseParams.getpayhistory > 0) {
                            PStore.baseParams.datefrom = this.ownerCt.find('id', 'PFROM')[0].getValue().format('Y-m-d');
                            PStore.baseParams.datetill = this.ownerCt.find('id', 'PTILL')[0].getValue().format('Y-m-d');
                            PStore.reload({
                                params: {
                                    start: 0,
                                    limit: PPAGELIMIT
                                }
                            })
                        }
                    }
                }, {
                    xtype: 'tbseparator',
                    style: {
                        paddingLeft: '3px',
                        paddingRight: '3px'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'ext-print',
                    qtip: Ext.app.Localize.get('Print'),
                    handler: function(){
                        Print(this.ownerCt.ownerCt);
                    }
                }, {
                    xtype: 'tbseparator',
                    style: {
                        paddingLeft: '3px',
                        paddingRight: '3px'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'ext-downcsv',
                    text: Ext.app.Localize.get('Download'),
                    menu: [{
                        text: Ext.app.Localize.get('Current page'),
                        handler: function() {
                            var M = this.ownerCt.findParentByType('grid').getVisibleModel();
                            PStore.baseParams.datefrom = Ext.getCmp('PFROM').getValue().format('Y-m-d');
                            PStore.baseParams.datetill = Ext.getCmp('PTILL').getValue().format('Y-m-d');
                            if(PStore.getCount() == 0) {
                                return;
                            }
                            var O = {
                                clm: M.getString('col').trim(),
                                clmnames: Ext.urlEncode({ X: M.getString('names') }).substr(2).trim()
                            }
                            for(var i in PStore.baseParams) {
                                O[i] = PStore.baseParams[i];
                            }
                            Download(O);
                        }
                    }, {
                        text: Ext.app.Localize.get('All') + ' ' + Ext.app.Localize.get('pages'),
                        handler: function() {
                            var M = this.ownerCt.findParentByType('grid').getVisibleModel();
                            PStore.baseParams.datefrom = Ext.getCmp('PFROM').getValue().format('Y-m-d');
                            PStore.baseParams.datetill = Ext.getCmp('PTILL').getValue().format('Y-m-d');
                            if(PStore.getCount() == 0) {
                                return;
                            }
                            var O = {
                                clm: M.getString('col').trim(),
                                clmnames: Ext.urlEncode({ X: M.getString('names') }).substr(2).trim()
                            }
                            for(var i in PStore.baseParams) {
                                if (i != 'start' && i != 'limit') {
                                    O[i] = PStore.baseParams[i];
                                }
                            }
                            Download(O);
                        }
                    }]
                }
            ],
			plugins: [ RButton, CButton, DButton ],
			cm:  new Ext.grid.ColumnModel({
				columns: [
                    RButton,
                    CButton,
                    DButton,
                    {
                        header: Ext.app.Localize.get('Sum'),
                        dataIndex: 'amount',
                        width: 60,
                        renderer: function(value, metaData, record){
                            try {
                                metaData.attr = 'ext:qtip="' + value.toFixed(2) + ' ' + record.get('symbol') + '"'
                                return value.toFixed(2) + ' ' + record.get('symbol');
                            }
                            catch(e) { return value; }
                        }
                    },
                    {
                        header: Ext.app.Localize.get('Invoice number'),
                        dataIndex: 'ordernum',
                        id: 'ordernumid',
                        width: 90
                    },
                    {
                        header: Ext.app.Localize.get('Payment date'),
                        dataIndex: 'date',
                        width: 77,
                        renderer: function(value, metaData, record) {
                            try {
                                metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
                                return value.format('d.m.Y');
                            }
                            catch(e){ if(!Ext.isEmpty(value)) return value.format('d.m.Y'); }
                        }
                    },
                    {
                        header: Ext.app.Localize.get('Payment commited'),
                        dataIndex: 'localdate',
                        width: 84,
                        renderer: function(value, metaData, record) {
                            try {
                                metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
                                return value.format('d.m.Y');
                            }
                            catch(e){ if(!Ext.isEmpty(value)) return value.format('d.m.Y'); }
                        }
                    },
                    {
                        header: Ext.app.Localize.get('Class of payment'),
                        dataIndex: 'classname',
                        width: 100
                    },
                    {
                        header: Ext.app.Localize.get('Payment order number'),
                        dataIndex: 'paymentordernumber',
                        width: 174
                    },
                    {
                        header: Ext.app.Localize.get('Pay document number'),
                        dataIndex: 'recipe',
                        width: 174
                    },
                    {
                        header: Ext.app.Localize.get('Manager'),
                        dataIndex: 'mgr',
                        width: 100
                    },
                    {
                        header: Ext.app.Localize.get('Comment'),
                        id: 'commentcol',
                        dataIndex: 'comment',
                        width: 120
                    },
                    {
                        header: Ext.app.Localize.get('Registry'),
                        id: 'registries',
                        dataIndex: 'registries',
                        width: 80
                    },

                    {
                        header: Ext.app.Localize.get('Strict reporting form'),
                        id: 'bsodocid',
                        dataIndex: 'bsodoc',
                        renderer: function(value, metaData, record) {
                            try {
                                if (value.recordid > 0){
                                    return value.setnumber + '/' + value.number;
                                }else{
                                    return '';
                                }
                            }
                            catch(e){ return ''; }
                        },
                        width: 160
                    }
				],
				defaults: {
					menuDisabled: false
				}
			}),
			listeners: {
				rowDblclick: function(grid, rowIndex, e) {
					var store = grid.getStore();
					var view = grid.getView();
					/**
					 * Вызов окошка с историей корректировок
					 */
                    correctHistory( store.getAt(rowIndex).data );
				}
			},
			viewConfig: {
				/**
				 * Проверяем, редактировался ли ранее платеж
				 * выделяем цветом в зависимости от этого
				 */
				getRowClass: function(record, index) {
                    return colorizeRowClass(record.get('revisions'), record.get('revno'), record.get('canceldate'), record.get('fromagrmid'), record.get('bsodoc').recordid);
				}
			},
			bbar: new Ext.PagingToolbar({
				pageSize: PPAGELIMIT,
				store: PStore,
				displayInfo: true,
				items: ['-', {
					xtype: 'combo',
					width: 70,
					displayField: 'id',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: PPAGELIMIT,
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
							PPAGELIMIT = this.getValue();
							this.ownerCt.pageSize = PPAGELIMIT;
							PStore.reload({ params: { limit: PPAGELIMIT } });
						}
					}
				},
				/**
				 * Легенда. Свойства->Платежи
				 */
				'-',
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Revoked'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-payment-canceled'
				},
				'-',
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Correction'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-payment-corrected'
				},
				'-',
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Corrected'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-payment-edited'
				},
				'-',
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Transfered'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-payment-transfer'
				},
				'-',
				{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Pay SRF'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-payment-bso'
				}
				]
			}),
			getVisibleModel: function(){
				var B = {
					col: [],
					names: [],
					getString: function(item){
						if(!this[item]) {
							return '';
						}
						else {
							return this[item].join(';');
						}
					}
				};
				var A  = this.getColumnModel().getColumnsBy(function(C){
					if(!C.hidden){
						return true
					}
					return false
				});
				for(var i = 0, off = A.length; i < off; i++){
					if(Ext.isEmpty(A[i].dataIndex)) {
						continue;
					}
					B.col.push(A[i].dataIndex);
					B.names.push(A[i].header.replace('&nbsp;', ' '));
				}
				return B
			}
		}]
	});

	/**
	 * Действие на кнопку корректирования платежей.
	 *
	 * 1: перенос средств между лицевыми счетами
	 * 2: исправление суммы платежа
	 * 4: аннулирование платежа
	 * 5: Восстановление ранее аннулированного платежа
	 * 6: Работа с БСО
	 */
	var correctMenu = new Ext.menu.Menu({
		enableScrolling: false,
		items: [
			{
				text: Ext.app.Localize.get('Transfer payment to another agreement'), // Перенос платежа на другой Л.С.
				handler: function() {
					correctPaymentWindow(1,this.ownerCt.record);
				},
				id: 'correct_transfer'
			},
			{
				text: Ext.app.Localize.get('Correction of the payment amount'), //Корректировать сумму платежа
				handler: function() {
					correctPaymentWindow(2,this.ownerCt.record);
				},
				id: 'correct_correct'
			},
			{
				text: Ext.app.Localize.get('Cancel Payment'),
				handler: function() {
					correctPaymentWindow(4,this.ownerCt.record);
				},
				id: 'correct_cancel'
			},
			{
				text: Ext.app.Localize.get('Recover Payment'),
				handler: function() {
					correctPaymentWindow(5,this.ownerCt.record);
				},
				id: 'correct_uncancel'
			},
			{
				text: Ext.app.Localize.get('Correction history'),
				handler: function() {
					correctHistory( this.ownerCt.record.data );
				},
				id: 'correct_history'
			},
			{
				text: Ext.app.Localize.get('Link strict reporting form'),
				handler: function() {
                    var pay_id = this.ownerCt.record.data.recordid;
                    searchBsoDoc(null,null,null,
                        function(){
                            grid = Ext.getCmp('_bsoSetDocs');
                            if (Ext.isEmpty(grid.getSelectionModel().getSelected())) {
                                return false;
                            } else var record = grid.getSelectionModel().getSelected();
                            try {
                                Ext.Ajax.request({
                                    url: 'config.php',
                                    method: 'POST',
                                    params: {
                                        devision: 18,
                                        async_call: 1,
                                        addPayment: pay_id,
                                        bsoDocId: record.data.recordid
                                    },
                                    scope: {
                                        load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                                    },
                                    callback: function(opt, success, res) {
                                        this.load.hide();
                                        if(!success) {
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                                            return false;
                                        }
                                        if (Ext.isDefined(res['responseText'])) {
                                            var data = Ext.util.JSON.decode(res.responseText);
                                            if ( data.success ){
                                                Ext.getCmp('_paymentsHistory').store.reload();
                                                Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Payment was bound to SRF") + " (" + record.data.number + ")");
                                            }else{
                                                Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                            }
                                        }
                                      return false;
                                    }
                                });
                            } catch(e) {
                                console.warn( e );
                                return false;
                            }
                            Ext.getCmp('getBsoDocWin').close();
                        }
                    );
				},
				id: 'add_bso_number'
			},
			{
				text: Ext.app.Localize.get('Unbind SRF'),
				handler: function() {
                    var row_data = this.ownerCt.record.data;
                    Ext.MessageBox.show({
                        title: Ext.app.Localize.get('Unbind payment'),
                        msg: Ext.app.Localize.get('Unbind SRF from payment') + "?",
                        width:400,
                        buttons: Ext.MessageBox.OKCANCEL,
                        multiline: false,
                        fn: function( btn ){
                            if (btn == 'cancel') return;
                            Ext.Ajax.request({
                                url: 'config.php',
                                method: 'POST',
                                params: {
                                    devision: 18,
                                    async_call: 1,
                                    cancelPayment: row_data.bsodoc.recordid,
									precordid: row_data.recordid
                                },
                                scope: {
                                    load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                                },
                                callback: function(opt, success, res) {
                                    this.load.hide();
                                    if(!success) {
                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                                        return false;
                                    }
                                    if (Ext.isDefined(res['responseText'])) {
                                        var data = Ext.util.JSON.decode(res.responseText);
                                        if ( data.success ){
                                            Ext.getCmp('_paymentsHistory').store.reload();
                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Payment was unlinked"));
                                        }else{
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                        }
                                    }
                                  return false;
                                }
                            });
                        }
                    });
				},
				id: 'del_bso_number'
			},
			{
				text: Ext.app.Localize.get('Reprint check'),
				handler: function() {
					var row_data = this.ownerCt.record.data;
                    Ext.Ajax.request({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            devision: 199,
                            async_call: 1,
                            repeatSalesCheck: row_data.recordid
                        },
                        scope: {
                            load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                        },
                        callback: function(opt, success, res) {
                            this.load.hide();
                            if(!success) {
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                                return false;
                            }
                            if (Ext.isDefined(res['responseText'])) {
                                var data = Ext.util.JSON.decode(res.responseText);
                                if ( data.success ){
                                    printReceipt(
                                        row_data.agrmid,
                                        row_data.amount,
                                        data.data.extid,
                                        row_data.recordid,
                                        row_data.mgr,
                                        row_data.orig_agrm,
                                        data.data.registerfolder
                                    )
                                }else{
                                    Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                }
                            }
                          return false;
                        }
                    });
				},
				id: 'repeat_sales_print'
			}
		],
		listeners: {
			beforeshow: function(menu) {
				menu.items.each(function(item, key){
                    /**
					 * Оригинальный платеж или последняя версия корректированного платежа
					 *
					 */

					if (this.ownerCt.record.data.revno == 0 && (this.ownerCt.record.data.agrmid == this.ownerCt.record.data.orig_agrm)) {
						/**
						 * Аннулированный платеж
						 * разрешаем только восстановление
						 */
                        if (this.ownerCt.record.data.canceldate != null){
							switch(key) {
								case 3: case 4: item.show(); break;
								default: item.hide();
							}
						}else{ // Оригинальный или последняя версия корректированного
                            switch(key) {
								case 0: case 1: case 2: case 4: case 7:
                                    item.show();
                                break;
								default: item.hide();
							}
                            if ( key == 5 ){
                                if (this.ownerCt.record.data.bsodoc.recordid == 0 && this.ownerCt.record.data.use_bso == 2)
                                    item.show();
                                else
                                    item.hide();
                            }
                            if ( key == 6 ){
                                if (this.ownerCt.record.data.bsodoc.recordid != 0  && this.ownerCt.record.data.use_bso == 2)
                                    item.show();
                                else
                                    item.hide();
                            }
						}
					}else{
						/**
						 * Если платеж промежуточный (из истории корректировок), то позволяем только просматривать историю
						 */
						switch(key) {
							case 4: item.show(); break;
							default: item.hide();
						}
					}
				});
			}
		}
	});

	CButton.on('action', function(grid, record, rowIndex, e) {
		this.record = record;
		this.showAt(e.getXY());
	}.createDelegate( correctMenu ));

	PButton.on('action', function(grid, record, rowIndex){
		if(record.data.istemplate) {
			return;
		}
		setPayment({
			uid: record.data.uid,
            agrmid: record.data.agrmid,
            onpayment: function(o){
                grid.store.reload();
            },
            onpromised: function(o){
                grid.store.reload();
            },
            scope: grid
        })
	});

	RButton.on('action', function(g, r, idx, e){
		ReceiptForm.grid = g;
		ReceiptForm.record = r;
		ReceiptForm.idx = idx;
		switch(RStore.getCount()) {
			case 0:
				Ext.Msg.alert('Stop', Ext.app.Localize.get('There is no available document template'));
			break;

			default:
				ReceiptForm.setPosition(e.getXY()[0] + 8, e.getXY()[1] + 6);
				ReceiptForm.isVisible() ? ReceiptForm.fireEvent('show') : ReceiptForm.show();
		}
	});
	
	DButton.on('action', function(grid, record, rowIndex){
		if(record.data.isuprs != 1) {
			return;
		}
		
		var uprsInfo = Ext.util.JSON.decode(record.get('uprsinfo'));
		
		var getCaption = function (value) {
			switch (value){
				case 'paymentdate': 
					return 'Payment date';
				case 'agentaccepteddate':
					return 'Operation date';
				case 'accepteddate':
					return 'Payment acceptance date';
				case 'agentoperationid':
					return 'Operation Id';
				case 'paymenttooltype':
					return 'Payment tool type';
				case 'paymenttoolnumber':
					return 'Payment tool number';
				case 'checknumber':
					return 'Receipt number';
				case 'terminalnumber':
					return 'Terminal number';
				case 'agentsystemcode':
					return 'EPS code';
				case 'uprscurrency':
					return 'Currency';
				case 'agentname':
					return 'EPS name';
				case 'subscriberid':
					return 'Account number';
				default: return 'Undefined';
			}
		}
		
		var fields = [];
		for(var property in uprsInfo) {
			var field = {
				xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get(getCaption(property)),
                readOnly: true,
                cls: 'textfield-body-hide',
                width: 150,
                value: uprsInfo[property]
			}
			fields.push(field);
		}
		
		new Ext.Window({
	        title: Ext.app.Localize.get('Payment information'),
	        height: 390,
	        width: 290,
	        layout: 'fit',
	        modal: true,
	        items: [{
	        	xtype: 'form',
	        	url: 'config.php',
                method: 'POST',
                frame: true,
                items: fields
	        }]
		}).show();

	});

    var ReceiptForm = new Ext.Window({
		title: Ext.app.Localize.get('Print a receipt') + ' / ' + Ext.app.Localize.get('Documents templates'),
		header: false,
		width: 370,
		closable: false,
		resizable: false,
		orderTpl: '',
		orderRegExp: '',
		grid: null,
		record: null,
		idx: null,
		items: [{
			xtype: 'form',
			url: 'config.php',
			labelWidth: 135,
			monitorValid: true,
			frame: true,
			buttonAlign: 'center',
			buttons: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Print'),
				formBind: true,
				handler: function(B){
					B.findParentByType('form').getForm().submit({
						method: 'POST',
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						success: function(f, a){
							var A = Ext.util.JSON.decode(a.response.responseText);
							Download({
								devision: 199,
								docid: A.docid,
								getrcptfile: A.fileid
							});
							ReceiptForm.hide();
						},
						failure: function(f, a){
							if (a.failureType == 'server') {
								obj = Ext.util.JSON.decode(a.response.responseText);
								Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', obj.errors.reason);
							}
						}
					})
				}
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Cancel'),
				handler: function(B){
					var F = B.findParentByType('form').findParentByType('window').hide()
				}
			}],
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 199
			}, {
				xtype: 'hidden',
				id: 'receiptid',
				value: 0
			}, {
				xtype: 'hidden',
				id: 'receiptdate',
				value: ''
			}, {
				xtype: 'hidden',
				id: 'receiptsum',
				value: 0
			}, {
				xtype: 'hidden',
				id: 'receiptnum',
				value: 0
			}, {
				xtype: 'hidden',
				id: 'receiptuid',
				value: 0
			}, {
				xtype: 'hidden',
				id: 'receiptagrm',
				value: 0
			}, {
				xtype: 'combo',
				id: 'getrpt',
				width: 200,
				hiddenValue: 'docid',
				lazyRender: true,
				hiddenName: 'getreceipt',
				fieldLabel: Ext.app.Localize.get('Documents templates'),
				allowBlank: false,
				store: RStore,
				displayField: 'name',
				valueField: 'docid',
				editable: false,
				mode: 'local',
				value: this.lastValue || null,
				triggerAction: 'all',
				listeners: {
					select: function() {
						this.lastValue = this.getValue()
					}
				}
			}]
		}],
		listeners: {
			show: function(f){
				Ext.getCmp('receiptid').setValue(ReceiptForm.record.data.recordid);
				Ext.getCmp('receiptsum').setValue(ReceiptForm.record.data.amount);
				Ext.getCmp('receiptnum').setValue(ReceiptForm.record.data.recipe);
				Ext.getCmp('receiptdate').setValue(!Ext.isPrimitive(ReceiptForm.record.data.date) ? ReceiptForm.record.data.date.format('Y-m-d H:i:s') : ReceiptForm.record.data.date);
				Ext.getCmp('receiptuid').setValue(ReceiptForm.record.data.uid);
				Ext.getCmp('receiptagrm').setValue(ReceiptForm.record.data.agrmid);
            }
        }
    });
}

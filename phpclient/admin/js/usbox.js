/**
 * JS Engine to view and control vgroups (accounts) list
 *
 * Repository information:
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load List object for the specified devision
	showUsBoxServicePanel('UsBoxServList');
	// Load List object for the selected vgroup item.
	showShortUBServicePanel('vgUBServices');
});


/**
 * Show panel with assigned service
 * @param	string, DOM Element id to render thie to
 */
function showUsBoxServicePanel( A )
{
    if (!document.getElementById(A)) {
        return;
    }
	var PAGELIMIT = 100;

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

	var OSelModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	var PSelModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	var f_date = function(v){
		d = new Date();
		r = d.add(Date.DAY, v);
		return r.format('d.m.Y');
	}

    var S = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [
			{ name: 'servid', type: 'int' },
			{ name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'username', type: 'string' },
			{ name: 'vglogin', type: 'string' },
			{ name: 'agrmnumber', type: 'string' },
			{ name: 'catidx', type: 'int' },
			{ name: 'catdescr', type: 'string' },
			{ name: 'personname', type: 'string' },
			{ name: 'mul', type: 'float' },
			{ name: 'personid', type: 'int' },
			{ name: 'common', type: 'int' },
			{ name: 'used', type: 'int' },
			{ name: 'vgid', type: 'int' },
			{ name: 'tarid', type: 'int' },
			{ name: 'comment', type: 'string' },
			{ name: 'rate', type: 'float' },
			{ name: 'realrate', type: 'float' },
			{ name: 'discount', type: 'float' },
			{ name: 'accondate', type: 'date', dateFormat: 'Y-m-d H:i:s'  },
			{ name: 'activated', type: 'date', dateFormat: 'Y-m-d H:i:s'  },
			{ name: 'disctimefrom', type: 'date', dateFormat: 'Y-m-d H:i:s'  },
			{ name: 'disctimeto', type: 'date', dateFormat: 'Y-m-d H:i:s'  }
		]),
        baseParams: {
            async_call: 1,
            devision: 106,
            getserv: 0,
            timefrom: f_date(0),
            timeto: 0,
            tarid: 0,
			catid: -1,
            searchtype: 0,
            search: '',
			start: 0,
			limit: PAGELIMIT
        }
    });

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Change') + ' ' + Ext.app.Localize.get('period'),
        width: 22,
        dataIndex: 'vgid',
        iconCls: 'ext-edit'
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove') + '. ' + Ext.app.Localize.get('RollbackBalance'),
        dataIndex: 'servid',
        width: 22,
        iconCls: 'ext-drop'
    });

	new Ext.TabPanel({
		renderTo: A,
		activeTab: 0,
		plain: true,
		width: 980,
		deferredRender: false,
		listeners: {
			tabchange: function(A, B){
				if (B.getId() == 'OneTime') {
					S.baseParams.getserv = 0;
					A.getTopToolbar().findById('editbutton').disable();
				};
				if (B.getId() == 'PeriodicTime') {
					S.baseParams.getserv = 1;
					A.getTopToolbar().findById('editbutton').enable();
				};
				S.reload({
					params: {
						start: 0,
						limit: PAGELIMIT
					}
				});
			}
		},
		tbar: new Ext.Toolbar({
			layout: 'form',
			items: [{
				xtype: 'container',
				layout: 'toolbar',
				width: 977,
				style: {
					paddingTop: '1px'
				},
				getGrid: function() {
					return this.ownerCt.ownerCt.getActiveTab();
				},
				applyFilter: function() {
					S.baseParams.timefrom = Ext.isPrimitive(Ext.getCmp('timefrom').getValue()) ? '' : Ext.getCmp('timefrom').getValue().format('d.m.Y');
					S.baseParams.timeto = Ext.isPrimitive(Ext.getCmp('timeto').getValue()) ? '' : Ext.getCmp('timeto').getValue().format('d.m.Y');
					S.baseParams.catid = !Ext.isNumber(Ext.getCmp('category').getValue()) ? -1 : Ext.getCmp('category').getValue();
					S.reload({ params: { start: 0 } });
				},
				items: [
				{
					xtype: 'tbtext',
					//width: 25,
					style: {
						paddingLeft: '4px'
					},
					text: Ext.app.Localize.get('End date of service') + ':'
				},
				{
					xtype: 'tbtext',
					width: 20,
					style: {
						paddingLeft: '8px' //4
					},
					text: Ext.app.Localize.get('Since')
				}, {
					xtype: 'datefield',
					width: 100,
					id: 'timefrom',
					format: 'd.m.Y',
					value: f_date(0),
					listeners: {
						//blur: function() {
						//	if ((Ext.isPrimitive(this.getValue()) && this.getValue() != S.baseParams.timefrom) || (!Ext.isPrimitive(this.getValue()) && this.getValue().format('d.m.Y') != S.baseParams.timefrom))
						//	{
						//		this.ownerCt.applyFilter();
						//	}
						//}
					}
				}, {
					xtype: 'tbtext',
					width: 30,
					style: {
						paddingLeft: '8px'
					},
					text: Ext.app.Localize.get('Till')
				}, {
					xtype: 'datefield',
					width: 100,
					id: 'timeto',
					format: 'd.m.Y',
					listeners: {
						//blur: function() {
						//	if ((Ext.isPrimitive(this.getValue()) && this.getValue() != S.baseParams.timeto) ||
						//		(!Ext.isPrimitive(this.getValue()) && this.getValue().format('d.m.Y') != S.baseParams.timeto))
						//	{
						//		this.ownerCt.applyFilter();
						//	}
						//}
					}
				}, {
					xtype: 'tbtext',
					width: 50,
					style: {
						paddingLeft: '8px'
					},
					text: Ext.app.Localize.get('Tarif') + ': '
				}, {
					xtype: 'combo',
					id: 'tariffs',
					width: 200,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]} {[(values.id > 0) ? "(" + values.symbol + ")" : "" ]}</div></tpl>',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'id', type: 'int' },
							{ name: 'name', type: 'string' },
							{ name: 'symbol', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 106,
							gettarifs: 0
						},
						sortInfo: {
							field: 'id',
							direction: "ASC"
						},
						listeners: {
							load: function(store){
								store.insert(0, new store.recordType({
									name: Ext.app.Localize.get('All'),
									id: 0
								}));
								Ext.getCmp('tariffs').setValue(0);
							}
						}
					}),
					listeners: {
						select: function(){
							S.baseParams.searchtarif = this.getValue();
							var C = Ext.getCmp('category');
							C[(this.getValue() <= 0) ? 'disable' : 'enable']();
							C.store.baseParams.getctgrs = this.getValue();
							C.store.reload();
						}
					}
				}, {
					xtype: 'tbtext',
					width: 70,
					style: {
						paddingLeft: '8px'
					},
					text: Ext.app.Localize.get('Category') + ': '
				}, {
					xtype: 'combo',
					id: 'category',
					width: 200,
					displayField: 'descr',
					valueField: 'catidx',
					typeAhead: true,
					disabled: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{[Ext.util.Format.htmlEncode(values.descr)]}">{[(values.catidx < 0) ? "-" : values.catidx]}. {[Ext.util.Format.ellipsis(values.descr, 34)]}</div></tpl>',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'catidx', type: 'int' },
							{ name: 'descr', type: 'string' },
							{ name: 'tarid', type: 'int' },
							{ name: 'common', type: 'int' }
						]),
						baseParams: {
							async_call: 1,
							devision: 106,
							getctgrs: 0
						},
						sortInfo: {
							field: 'catidx',
							direction: "ASC"
						},
						listeners: {
							load: function(store) {
								store.insert(0, new store.recordType({
									descr: Ext.app.Localize.get('All'),
									tarid: 0,
									catidx: -1
								}));
								Ext.getCmp('category').setValue(-1);
							}
						}
					}),
					listeners: {
						//select: function() {
						//	this.ownerCt.applyFilter();
						//},
						//enable: function() {
						//	this.ownerCt.applyFilter();
						//},
						disable: function() {
							this.setValue(-1);
							this.ownerCt.applyFilter();
						}
					}
				},{
					xtype: 'tbspacer',
					width: 5
				},{
					xtype: 'button',
					id: 'search_btn',
					iconCls: 'ext-search',
					text: Ext.app.Localize.get('Show'),
					handler: function() {
						// MaxS //
						this.ownerCt.applyFilter();
					}
				}


				]
			},
			// ************  SECOND MENU-ROW  *******************//
			{
				xtype: 'container',
				layout: 'toolbar',
				width: 977,
				style: {
					paddingTop: '3px'
				},
				getGrid: function() {
					return this.ownerCt.ownerCt.getActiveTab();
				},
				items: [{
					xtype: 'tbtext',
					width: 45,
					style: {
						paddingLeft: '4px'
					},
					text: Ext.app.Localize.get('Search') + ': '
				}, {
					xtype: 'combo',
					id: 'searchParams',
					width: 164,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('Person full name')],
							['1', Ext.app.Localize.get('Agreement')],
							['2', Ext.app.Localize.get('Login')],
							['3', Ext.app.Localize.get('ServiceDescription')]
						],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function(){
							S.baseParams.searchtype = this.getValue();
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 5
				}, new Ext.app.SearchField({
					id: 'SmplSearchField',
					store: S,
					params: {
					    start: 0,
					    limit: PAGELIMIT
					},
					width: 227
				}), {
					xtype: 'tbseparator',
					width: 15,
					style: {
						paddingRight: '15px'
					}
				}, {
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('service-y'),
					handler: function() {
						var G = this.ownerCt.getGrid();
						var M = G.getSelectionModel();
						var C = Ext.getCmp('category');
						var T = Ext.getCmp('tariffs');
						if(M.getCount() > 0) {
							if (M.getCount() > 1 && (C.getValue() < 0 || T.getValue() < 1)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Change group of services is allowed if they have common tariff and category') + '.<br>' +
									Ext.app.Localize.get('Use filter to group'));
								return;
							}
							
							showUBAddControl({
								edit: false,
								tarid: M.getSelected().data.tarid,
								accondate: M.getSelected().data.accondate,
								servdata: (M.getCount() > 1) ? M.getSelections() : M.getSelected(),
								common: (this.ownerCt.getGrid().getId() == 'PeriodicTime') ? 1 : 0,
								filterClass: true,
								closeOnSuccess: true,
								success: function(){
									this.store.reload();
								}.createDelegate(G)
							});
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 5
				}, {
					xtype: 'button',
					id: 'editbutton',
					iconCls: 'ext-edit',
					text: Ext.app.Localize.get('Edit') + ' ' + Ext.app.Localize.get('service-y'),
					handler: function() {
						var G = this.ownerCt.getGrid();
						var M = G.getSelectionModel();
						var C = Ext.getCmp('category');
						var T = Ext.getCmp('tariffs');
						if(M.getCount() > 0) {
							if (M.getCount() > 1 && (C.getValue() < 0 || T.getValue() < 1)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Change group of services is allowed if they have common tariff and category') + '.<br>' +
									Ext.app.Localize.get('Use filter to group'));
								return;
							}
							showUBAddControl({
								edit: true,
								tarid: M.getSelected().data.tarid, 
								servdata: (M.getCount() > 1) ? M.getSelections() : M.getSelected(),
								common: (this.ownerCt.getGrid().getId() == 'PeriodicTime') ? 1 : 0,
								filterClass: true,
								closeOnSuccess: true,
								success: function(){
									this.store.reload();
								}.createDelegate(G)
							});
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 5
				}, {
					xtype: 'button',
					iconCls: 'ext-remove',
					text: Ext.app.Localize.get('Cancel') + ' ' + Ext.app.Localize.get('service-y'),
					form: new Ext.form.FormPanel({
						frame: false,
						url: 'config.php',
						items: [{
							xtype: 'hidden',
							name: 'async_call',
							value: 1
						}, {
							xtype: 'hidden',
							name: 'devision',
							value: 106
						}],
						renderTo: Ext.getBody(),
						clearLocks: function() {
							var items = this.findByType('hidden');
							if(items.length > 0) {
								Ext.each(items, function(item){
									if (this.name.test(item.name)) {
										this.form.remove(item);
									}
								}, { form: this, name: new RegExp('delservice') });
								this.doLayout();
							}
						}
					}),
					submitObject: {
						method:'POST',
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
								this.store.reload();
							}.createDelegate(this.grid));
							this.form.clearLocks();
						},
						failure: function(form, action){
							var O = Ext.util.JSON.decode(action.response.responseText);
							if(!Ext.isArray(O.reason)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
									this.store.reload()
								}.createDelegate(this.grid));
							}
							else {
								try {
									var store = new Ext.data.ArrayStore({
										autoDestroy: true,
										idIndex: 0,
										data: O.reason,
										fields: [{
											name: 'id',
											type: 'int'
										}, {
											name: 'login',
											type: 'string'
										}, {
											name: 'catdescr',
											type: 'string'
										}, {
											name: 'reason',
											type: 'string'
										}]
									});

									new Ext.Window({
										modal: true,
										title: Ext.app.Localize.get('Error'),
										width: 600,
										items: [{
											xtype: 'grid',
											store: store,
											height: 200,
											autoExpandColumn: 'nonedelreason',
											cm: new Ext.grid.ColumnModel({
												columns: [{
													header: Ext.app.Localize.get('Login'),
													dataIndex: 'login',
													width: 120
												}, {
													header: Ext.app.Localize.get('Category'),
													dataIndex: 'catdescr',
													width: 180
												}, {
													header: Ext.app.Localize.get('Reason'),
													dataIndex: 'reason',
													id: 'nonedelreason'
												}],
												defaults: {
													sortable: true,
													menuDisabled: true
												}
											})
										}],
										listeners: {
											close: function(){
												this.store.reload()
											}.createDelegate(this.grid)
										}
									}).show();
								}
								catch(e) { }
							}
							this.form.clearLocks();
						}
					},
					handler: function(){
						var G = this.ownerCt.getGrid();
						var M = G.getSelectionModel();
						if (M.getCount() > 0) {
							Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Money that were written off will be returned to account back') + '<br>' +
									Ext.app.Localize.get('Information about service will be deleted'),
								function(B){
								if(B != 'yes') {
									return;
								}
								this.sm.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'delservice[' + record.data.servid + '][vglogin]',
										value: record.data.vglogin
									});

									this.add({
										xtype: 'hidden',
										name: 'delservice[' + record.data.servid + '][catdescr]',
										value: record.data.catdescr
									});
								}, this.Button.form);

								this.Button.form.doLayout();

								if(!Ext.isDefined(this.Button.submitObject['scope'])) {
									this.Button.submitObject.scope = {
										form: this.Button.form,
										grid: this.Grid
									}
								}

								this.Button.form.getForm().submit(this.Button.submitObject);
							}, {
								sm: M,
								Button: this,
								Grid: G
							});
						}
					}
				}]
			}]
		}),
		items: [{
			title: Ext.app.Localize.get('Periodic-e') + ' ' + Ext.app.Localize.get('services'),
			id: 'PeriodicTime',
			height: 700,
			xtype: 'grid',
			loadMask: true,
			border: false,
			store: S,
			sm: PSelModel,
			autoExpandColumn: 'p_service_description',
			cm: new Ext.grid.ColumnModel([PSelModel, {
				header: Ext.app.Localize.get('Begin of period'),
				dataIndex: 'timefrom',
				width: 105,
				renderer: function(A){
					return A.format('d.m.Y')
				}
			}, {
				header: Ext.app.Localize.get('End of period'),
				dataIndex: 'timeto',
				width: 100,
				renderer: function(A){
					try {
						if(A.format('Y') != 9999) {
							return A.format('d.m.Y');
						}
						else {
							return '';
						}
					}
					catch(e){
						return '';
					}
				}
			}, {
				header: Ext.app.Localize.get('User'),
				dataIndex: 'username',
				width: 135
			}, {
				header: Ext.app.Localize.get('Agreement'),
				dataIndex: 'agrmnumber',
				width: 90
			}, {
				header: Ext.app.Localize.get('Account'),
				dataIndex: 'vglogin',
				width: 110
			}, {
				header: Ext.app.Localize.get('Description'),
				dataIndex: 'catdescr',
				id: 'p_service_description'
			}, {
				header: Ext.app.Localize.get('Quantity'),
				dataIndex: 'mul',
				width: 55
			}, {
				header: Ext.app.Localize.get('Write-off'),
				dataIndex: 'common',
				width: 100,
				renderer: function(A){
					switch (A) {
						case 2:
							return Ext.app.Localize.get('daily');
						case 3:
							return Ext.app.Localize.get('daily') + ', ' + Ext.app.Localize.get('equal parts');
						default:
							return Ext.app.Localize.get('monthly');
					}
				}
			}, {
				header: Ext.app.Localize.get('Assigned by'),
				dataIndex: 'personid',
				width: 135,
				renderer: function(A, B, C){
					if (A == 'null') {
						return C.data.username
					}
					else {
						return C.data.personname
					}
				}
			}]),
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: S,
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
							S.reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			})
		}, {
			title: Ext.app.Localize.get('One-time-e') + ' ' + Ext.app.Localize.get('services'),
			id: 'OneTime',
			height: 700,
			xtype: 'grid',
			loadMask: true,
			border: false,
			store: S,
			autoExpandColumn: 'o_service_description',
			sm: OSelModel,
			cm: new Ext.grid.ColumnModel([OSelModel, {
				header: Ext.app.Localize.get('Date'),
				dataIndex: 'timefrom',
				width: 100,
				renderer: function(A){
					return A.format('d.m.Y H:i')
				}
			}, {
				header: Ext.app.Localize.get('User'),
				dataIndex: 'username',
				width: 145
			}, {
				header: Ext.app.Localize.get('Agreement'),
				dataIndex: 'agrmnumber',
				width: 90
			}, {
				header: Ext.app.Localize.get('Account'),
				dataIndex: 'vglogin',
				width: 110
			}, {
				header: Ext.app.Localize.get('Description'),
				dataIndex: 'catdescr',
				id: 'o_service_description'
			}, {
				header: Ext.app.Localize.get('Quantity'),
				dataIndex: 'mul',
				width: 55
			}, {
				header: Ext.app.Localize.get('Assigned by'),
				dataIndex: 'personid',
				width: 145,
				renderer: function(A, B, C){
					if (A == 'null') {
						return C.data.username
					}
					else {
						return C.data.personname
					}
				}
			}]),
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: S,
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
							S.reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			})
		}]
	});

	Edit.on('action', function(grid, record, rowIndex, e){
		showUBAddControl({
			vgid: record.data.vgid,
			tarid: record.data.tarid,
			servdata: record,
			timefrom: record.data.timefrom.format('d.m.Y'),
			login: record.data.vglogin,
			common: record.data.common,
			accondate: record.data.accondate,
			filterClass: true,
			success: function(){
				Ext.getCmp('p_grid').store.reload();
			}
		})
	});

    Remove.on('action', function(grid, record, rowIndex, e){
        compactForm([{
            xtype: 'hidden',
            name: 'delservice',
            value: record.data.servid
        }], grid.store)
    });
} // end showUsBoxServicePanel()


/**
 * Symple tabpanel with small size and light functional logic to view services
 * in account form (vgroup)
 * @param	string, DOM Element id to render thie to
 */
function showShortUBServicePanel( A )
{
    if (!document.getElementById(A)) {
        return;
    }
    if (!document.getElementById('_vgid_') || document.getElementById('_vgid_').value == 0) {
        return false;
    }
    else {
        var vgid = document.getElementById('_vgid_').value;
    }
    if (!document.getElementById('_tarid_') || Ext.isEmpty(document.getElementById('_tarid_').value)) {
        var tarid = 0
    }
    else {
        var tarid = document.getElementById('_tarid_').value;
    }
    try {
        var vglogin = document.getElementById('_login_').value;
    }
    catch (e) {
        var vglogin = '';
    }

	var PAGELIMIT = 100;

    var S = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [
			{ name: 'servid', type: 'int' },
			{ name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'username', type: 'string' },
			{ name: 'vglogin', type: 'string' },
			{ name: 'agrmnumber', type: 'string' },
			{ name: 'catidx', type: 'int' },
			{ name: 'catdescr', type: 'string' },
			{ name: 'catabove', type: 'float' },
			{ name: 'personname', type: 'string' },
			{ name: 'mul', type: 'float' },
			{ name: 'personid', type: 'int' },
			{ name: 'common', type: 'int' },
			{ name: 'used', type: 'int' },
			{ name: 'vgid', type: 'int' },
			{ name: 'tarid', type: 'int' },
			{ name: 'needcalc', type: 'int' },
			{ name: 'externaldata', type: 'string' },
			{ name: 'disctimefrom', type: 'date', dateFormat: 'd.m.Y' },
			{ name: 'disctimeto', type: 'date', dateFormat: 'd.m.Y' },
			{ name: 'accondate', type: 'date', dateFormat: 'Y-m-d H:i:s'  },
			{ name: 'activated', type: 'date', dateFormat: 'Y-m-d H:i:s'  },
			{ name: 'comment', type: 'string' },
			{ name: 'rate', type: 'string' }
		]),
        baseParams: {
            async_call: 1,
            devision: 106,
            getserv: 0,
            vgid: vgid,
			start: 0,
			limit: PAGELIMIT
        }
    });

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.Change + ' ' + Localize.period,
        width: 22,
        dataIndex: 'vgid',
        iconCls: 'ext-edit'
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.Remove + '. ' + Localize.RollbackBalance,
        dataIndex: 'servid',
        width: 22,
        iconCls: 'ext-drop'
    });

    compactForm = function(items, store){
        if (Ext.isEmpty(items)) {
            return false;
        };
        items[items.length] = {
            xtype: 'hidden',
            name: 'devision',
            value: 106
        };
        items[items.length] = {
            xtype: 'hidden',
            name: 'async_call',
            value: 1
        };
        var form = new Ext.form.FormPanel({
            id: 'compactForm',
            renderTo: Ext.getBody(),
            url: 'config.php',
            items: items
        });
        form.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
                store.reload();
                form.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.reason);
                }
                form.destroy();
            }
        })
    };
    new Ext.Panel({
        id: 'usboxPanel',
        frame: false,
        bodyStyle: 'padding:0px',
        border: false,
        layout: 'fit',
        width: 613,
		height: 405,
        renderTo: A,
        items: [{
            xtype: 'tabpanel',
            id: 'UBTabs',
            frame: true,
            width: 556,
            activeTab: 1,
            plain: true,
            deferredRender: true,
            listeners: {
                tabchange: function(A, B){
                    if (B.getId() == 'OneTime') {
                        S.baseParams.getserv = 0
                    };
                    if (B.getId() == 'PeriodicTime') {
                        S.baseParams.getserv = 1
                    };
                    S.reload({
                        params: {
                            start: 0,
                            limit: 50
                        }
                    });
                }
            },
            items: [{
                title: Ext.app.Localize.get('One-time-e') + ' ' + Ext.app.Localize.get('services'),
                id: 'OneTime',
                items: {
                    xtype: 'grid',
                    id: 'o_grid',
                    height: 379,
                    width: 611,
                    loadMask: true,
                    autoWidth: true,
                    enableHdMenu: false,
                    border: false,
                    autoScroll: true,
                    tbar: [{
                        xtype: 'button',
                        id: 'o_add',
                        disabled: (tarid == 0) ? true : false,
                        text: Localize.Add,
                        iconCls: 'ext-add',
                        handler: function(B){
                            showUBAddControl({
                                edit: false,
                                tarid: tarid,
								servdata: {
									data: {
										vgid: vgid
									}
								},
                                login: vglogin,
                                common: (Ext.getCmp('UBTabs').getActiveTab().getId() == 'PeriodicTime') ? 1 : 0,
                                filterClass: true,
                                success: function(){
                                    Ext.getCmp(Ext.getCmp('UBTabs').getActiveTab().getComponent(0).getId()).store.reload();
                                }
                            })
                        }
                    }],
                    sm: new Ext.grid.CheckboxSelectionModel({
                        singleSelect: true
                    }),
                    store: S,
                    cm: new Ext.grid.ColumnModel([
					{
                        header: Ext.app.Localize.get('Description'),
                        dataIndex: 'catdescr',
                        id: 'o_service_description',
						width: 200
                    }, {
						header: Ext.app.Localize.get('The readings'),
						dataIndex: 'externaldata',
						width: 105,
						hidden: Ext.get('zkh_configuration') ? false : true
					}, {
                        header: Ext.app.Localize.get('Quant.'),
                        dataIndex: 'mul',
                        width: 50
                    }, {
						header: Ext.app.Localize.get('Price'),
						dataIndex: 'catabove',
						width: 65
					},{
						header: Ext.app.Localize.get('Rat.'),
						qtip: Ext.app.Localize.get('Ratio'),
						dataIndex: 'rate',
						width: 55,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                            if (value == 0) {
                                return '<i>---</i>';
                            }
                            else {
                                return value;
                            }
                        }
					}, {
                        header: Ext.app.Localize.get('Date'),
                        dataIndex: 'timefrom',
                        width: 100,
                        renderer: function(A){
                            return A.format('d.m.Y H:i')
                        }
                    }, {
						header: Ext.app.Localize.get('Comment'),
						dataIndex: 'comment',
						width: 100
					}, {
                        header: Ext.app.Localize.get('Assigned by'),
                        dataIndex: 'personid',
                        width: 145,
                        renderer: function(A, B, C){
                            if (A == 'null') {
                                return C.data.username
                            }
                            else {
                                return C.data.personname
                            }
                        }
                    }, Remove]),
					viewConfig: {
						// Return CSS class to apply to rows depending upon data values
						getRowClass: function(record, index) {
							var c = record.get('needcalc');
							if (c > 0) {
								return 'ext-row-red';
							}
						}
					},
                    plugins: Remove,
                    bbar: new Ext.PagingToolbar({
						pageSize: PAGELIMIT,
						store: S,
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
									S.reload({ params: { limit: PAGELIMIT } });
								}
							}
						}]
					}),
                    listeners: {
                        rowclick: function(A, B){
                            Ext.getCmp('o_add').enable();
                        }
                    }
                }
            }, {
                title: Localize.PeriodicServices,
                id: 'PeriodicTime',
                items: {
                    xtype: 'grid',
                    id: 'p_grid',
                    height: 379,
                    width: 611,
                    loadMask: true,
                    autoWidth: true,
                    enableHdMenu: false,
                    border: false,
                    autoScroll: true,
                    tbar: [
						{
							xtype: 'button',
							id: 'p_add',
							disabled: (tarid == 0) ? true : false,
							text: Localize.Add,
							iconCls: 'ext-add',
							handler: function(B){
								showUBAddControl({
									edit: false,
									tarid: tarid,
									servdata: {
										data: {
											vgid: vgid
										}
									},
									closeOnSuccess: true,
									common: (Ext.getCmp('UBTabs').getActiveTab().getId() == 'PeriodicTime') ? 1 : 0,
									filterClass: true,
									success: function(){
										Ext.getCmp(Ext.getCmp('UBTabs').getActiveTab().getComponent(0).getId()).store.reload();
									}
								})
							}
						}
					],
                    sm: new Ext.grid.CheckboxSelectionModel({
                        singleSelect: true
                    }),
                    store: S,
                    cm: new Ext.grid.ColumnModel(
					[
						Edit,
						{
							header: Ext.app.Localize.get('Description'),
							dataIndex: 'catdescr',
							id: 'p_service_description',
							width: 129
						},
						{
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'timefrom',
							width: 75,
							renderer: function(A){
								return A.format('d.m.Y')
							}
						}, {
							header: Ext.app.Localize.get('End of period'),
							dataIndex: 'timeto',
							width: 100,
							renderer: function(A){
								try {
									if(A.format('Y') != 9999) {
										return A.format('d.m.Y');
									}
									else {
										return '';
									}
								}
								catch(e){
									return '';
								}
							}
						}, {
							header: Ext.app.Localize.get('Quant.'),
							dataIndex: 'mul',
							width: 50
						}, {
							header: Ext.app.Localize.get('Price'),
							dataIndex: 'catabove',
							width: 65
						}, {
							header: Ext.app.Localize.get('Rat.'),
							qtip: Ext.app.Localize.get('Ratio'),
							dataIndex: 'rate',
							width: 55,
							renderer: function(value, metaData, record, rowIndex, colIndex, store) {
								if (value == 0) {
									return '<span style="color:#777;">---</span>';
								}
								else {
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Total'),
							width: 55,
							renderer: function(value, metaData, record, rowIndex, colIndex, store) {
								if (record.data.rate >= 0) 
									return record.data.mul * record.data.catabove * record.data.rate;
								else return record.data.mul * record.data.catabove;
							}
						}, {
							header: Ext.app.Localize.get('Write-off'),
							dataIndex: 'common',
							width: 100,
							renderer: function(A){
								switch (A) {
									case 2:
										return Ext.app.Localize.get('daily');
									case 3:
										return Ext.app.Localize.get('daily')+ ',<br/>' + Ext.app.Localize.get('equal parts');
									default:
										return Ext.app.Localize.get('monthly');
								}
							}
						}, {
							header: Ext.app.Localize.get('Assigned by'),
							dataIndex: 'personid',
							width: 145,
							renderer: function(A, B, C){
								if (A == 'null') {
									return C.data.username
								}
								else {
									return C.data.personname
								}
							}
						}, {
							header: Ext.app.Localize.get('Comment'),
							dataIndex: 'comment',
							width: 100
						},
						Remove
					]),
					viewConfig: {
						// Return CSS class to apply to rows depending upon data values
						getRowClass: function(record, index) {
							var c = record.get('needcalc');
							if (c > 0) {
								return 'ext-row-red';
							}
						}
					},
                    plugins: [Edit, Remove],
                    bbar: new Ext.PagingToolbar({
						pageSize: PAGELIMIT,
						store: S,
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
									S.reload({ params: { limit: PAGELIMIT } });
								}
							}
						}]
					}),
                    listeners: {
                        rowclick: function(A, B){
							Ext.getCmp('p_add').enable();
                        }
                    }
                }
            }]
        }]
    });

	Edit.on('action', function(grid, record, rowIndex, e){
		showUBAddControl({
			edit: true,
			tarid: record.data.tarid,
			servdata: record,
			accondate: record.data.accondate,
			common: (Ext.getCmp('UBTabs').getActiveTab().getId() == 'PeriodicTime') ? 1 : 0,
			filterClass: true,
			closeOnSuccess: true,
			success: function(){
				Ext.getCmp(Ext.getCmp('UBTabs').getActiveTab().getComponent(0).getId()).store.reload();
			}
		})
	});

    Remove.on('action', function(grid, record, rowIndex, e){
		Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Money that were written off will be returned to account back') + '<br>' +
				Ext.app.Localize.get('Information about service will be deleted'),
			function(B) {
				if(B != 'yes') {
					return;
				}
				compactForm([{
					xtype: 'hidden',
					name: 'delservice[' + this.record.data.servid + '][vglogin]',
					value: this.record.data.vglogin
				}], this.grid.store);
		}, { grid: grid, record: record });
	});
} // end showShortUBServicePanel()


/**
 * Show control to add new service for the selected vgroup
 * @param	objec, that contains values to assign
 * 		edit - true if need to do changes to exiting records, else add new
 * 		tarid  - vgroup item tarif id value
 * 		common - service class (One-time or periodic ...)
 * 		login - vgroup item login (optional)
 * 		servdata - Mixed, array or sing record object generated by grid constructor. Requires object hash representing the "data" for this Record.
 * 					Every field name in the Record definition is represented by a property of that name in this object.
 * 					servdata.data = [Object] or servdata = Array[ Record Objects ]
 * 		timefrom - optional field to set specific date for the new service, not for already exiting
 * 		timeto - optional field to set form value to end the new service
 * 		devision - devision id to send form data
 * 		filterClass - use filter while requesting tarif categories
 * 		closeOnSuccess - close object on success sace action
 * 		success - execute function on success
 */
function showUBAddControl(A)
{
    if (!Ext.isEmpty(Ext.get('UBServAdd'))) {
        return;
    }
	// Check
    if (Ext.isEmpty(A) || Ext.isEmpty(A.tarid) || Ext.isEmpty(A.common) || Ext.isPrimitive(A.servdata)) {
        return false;
    }
	// Check if new record add
	A.edit = A['edit'] || false;
	// Check if there is group change request
	A.mutiple = Ext.isArray(A.servdata) ? true : false;
	// Check request goal
	A.devision = Ext.isEmpty(A.devision) ? 106 : A.devision;
	// Check if exists success function
	A.success = Ext.isFunction(A.success) ? A.success : function() {}
	// Check optional begin date
	A.timefrom = A['timefrom'] || new Date();
	A.activated = A['activated'] || new Date();
	// Check close flag
	A.closeOnSuccess = A['closeOnSuccess'] || false;
	
	// discounts
	A.rate =  (!Ext.isEmpty(A.servdata.data) && !Ext.isEmpty(A.servdata.data.rate))  ? A.servdata.data.rate || 1 : 1;
	A.realrate =  (!Ext.isEmpty(A.servdata.data) && !Ext.isEmpty(A.servdata.data.realrate))  ? A.servdata.data.realrate || 1 : 1;
	A.discount = (!Ext.isEmpty(A.servdata.data) && !Ext.isEmpty(A.servdata.data.discount)) ? A.servdata.data.discount || 0 : 0;
	
    if (Ext.isEmpty(A.filterClass)) {
        A.filterClass = false
    }

    if (A.filterClass == true) {
        if (A.common > 0) {
            A.filterClass = 2;
        }
        else
            if (A.common == 0) {
                A.filterClass = 1
            }
            else {
                A.filterClass = 0;
            }
    }

	var firston = null;
	if((firston = Ext.get('_accondatefirst_'))) {
		try {
			firston = Date.parseDate(firston.getValue(), 'd.m.Y');
		}
		catch(e) {
			firston = null;
		}
	}

	new Ext.Window({
        id: 'UBServAdd',
        title: (A.edit ? (Ext.app.Localize.get('Change') + ': ' + (A.mutiple ? A.servdata[0].data.catdescr : A.servdata.data.catdescr)) : Ext.app.Localize.get('Add')) + (!A.edit ? (' ' +
				Ext.app.Localize.get('service-y')) : ''),
        width: 348,
        modal: true,
		autoHeight: true,
		resizable: false,
        items: [{
            xtype: 'form',
            monitorValid: true,
            url: 'config.php',
            frame: true,
			buttonAlign: 'center',
            items: [
				{ xtype: 'hidden', name: 'async_call', value: 1 },
				{ xtype: 'hidden', name: 'devision', value: A.devision},
				{ xtype: 'hidden', name: 'common', value: A.common },
				{ xtype: 'hidden', name: 'tarid', value: A.tarid },
				{ xtype: 'hidden', name: 'externaldata', value: A.mutiple ? '' : A.servdata.data.externaldata },
				{
				    xtype: 'container',
				    fieldLabel: Ext.app.Localize.get('Since'),
				    layout: 'hbox',
				    items: [{
						xtype: 'datefield',
						name: 'timefrom',
						id: '_timefrom',
						fieldLabel: Ext.app.Localize.get('Since'),
						width: 100,
						format: 'd.m.Y',
						disabled: (A.mutiple && A.edit) ? true : false,
						allowBlank: false,
						value: A.edit ? (A.mutiple ? '' : A.servdata.data.timefrom) : (A['timefrom'] || ''),
						validator: function(value) {
							if(!Ext.isEmpty(firston) && Date.parseDate(value, 'd.m.Y') < firston) {
								return false;
							}
							return true;
						},
						listeners: {
							select: function() {
								if(!A.edit) Ext.getCmp('disctimefrom').setValue(this.getValue());
								this.ownerCt.ownerCt.find('name', 'timeto')[0].setMinValue(A.edit ? (A.mutiple ? '' : this.getValue()) : (this.getValue() || ''));
								Ext.getCmp('tarupon').setMinValue(this.getValue());
								Ext.getCmp('tarupon').setValue(this.getValue());
								Ext.getCmp('disctimefrom').setMinValue(this.getValue());
							},
							change: function() {
								if(!A.edit) Ext.getCmp('disctimefrom').setValue(this.getValue());
								this.ownerCt.ownerCt.find('name', 'timeto')[0].setMinValue(A.edit ? (A.mutiple ? '' : this.getValue()) : (this.getValue() || ''));
								Ext.getCmp('disctimefrom').setMinValue(this.getValue());
								Ext.getCmp('disctimeto').setMinValue(this.getValue());
								Ext.getCmp('tarupon').setMinValue(this.getValue());
								Ext.getCmp('tarupon').setValue(this.getValue());								
							},
							afterrender: function() {
								Ext.getCmp('disctimefrom').setMinValue(A.edit ? (A.mutiple ? '' : this.getValue()) : (this.getValue() || ''));
								Ext.getCmp('disctimeto').setMinValue(A.edit ? (A.mutiple ? '' : this.getValue()) : (this.getValue() || ''));
								Ext.getCmp('disctimefrom').setMinValue(this.getValue());
							}
						}
					},		
				    {
				        xtype: 'tbspacer',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        disabled: (A.mutiple && A.edit) ? true : false,
				        name: 'timefromhour',
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        editable: false,
				        value: 0,
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 24; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isPrimitive(A.servdata.data.timefrom) && A.servdata.data.timefrom.format('Y') != 0000) {
										this.setValue(A.servdata.data.timefrom.format('H'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }, {
				        xtype: 'tbtext',
				        text: ':',
				        style: 'padding: 4 0 0 1',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        name: 'timefrommin',
				        disabled: (A.mutiple && A.edit) ? true : false,
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        editable: false,
				        value: 0,
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 60; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isPrimitive(A.servdata.data.timefrom) && A.servdata.data.timefrom.format('Y') != 0000) {
										this.setValue(A.servdata.data.timefrom.format('i'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }]
				}, {
				    xtype: 'container',
				    fieldLabel: Ext.app.Localize.get('Till'),					
				    layout: 'hbox',
					listeners: {
						afterrender: function(){
							if(A.common == 0) {
								this.hideContainer();
							}
						}
					},
				    items: [{
						xtype: 'datefield',
						name: 'timeto',
						width: 100,
						format: 'd.m.Y',
						hideContainer: true,
						disabled: (A.common == 0) ? true : false,
						validator: function(value){
							if(Ext.isEmpty(value)) {
								return true;
							}
							if (!A.mutiple) {
								try {
									if (Date.parseDate(value, 'd.m.Y') >= this.ownerCt.ownerCt.find('name', 'timefrom')[0].getValue()) {
										return true;
									} else {
										return false;
									}
								} catch (e) { return false; }
							} else { 
								return true;
							}							
						},
						listeners: {
							select: function() {
								if(!A.edit) Ext.getCmp('disctimeto').setValue(this.getValue());
								if(!A.mutiple) { 
									Ext.getCmp('tarupon').enable();
								}
								if(this.getValue() < Ext.getCmp('tarupon').getValue()) {
									Ext.getCmp('tarupon').setValue(this.getValue());
								}
								Ext.getCmp('tarupon').setMaxValue(this.getValue());
								Ext.getCmp('disctimeto').setMaxValue(this.getValue()); 
							},
							change: function() {
								if(!A.edit) Ext.getCmp('disctimeto').setValue(this.getValue());
								if(!A.mutiple) { 
									Ext.getCmp('tarupon').enable();
								}
								if(this.getValue() < Ext.getCmp('tarupon').getValue() && this.getValue() != "") {
									Ext.getCmp('tarupon').setValue(this.getValue());
								}
								Ext.getCmp('tarupon').setMaxValue(this.getValue());
								Ext.getCmp('disctimeto').setMaxValue(this.getValue()); 
							},
							afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isPrimitive(A.servdata.data.timeto) && A.servdata.data.timeto.format('Y') != 9999) {
										this.setValue(A.servdata.data.timeto.format('d.m.Y'));
									}
								}
								this.setMinValue(A.edit ? (A.mutiple ? '' : A.servdata.data.timefrom.format('d.m.Y')) : (A['timefrom'] || ''));
								if(A.edit && !A.mutiple) { 
									Ext.getCmp('tarupon').enable();
								}
							}
						}
					},			
				    {
				        xtype: 'tbspacer',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        name: 'timetohour',
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        editable: false,
				        value: 0,
				        disabled: (A.common == 0) ? true : false,
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 24; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isPrimitive(A.servdata.data.timeto) && A.servdata.data.timeto.format('Y') != 9999) {
										this.setValue(A.servdata.data.timeto.format('H'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }, {
				        xtype: 'tbtext',
				        text: ':',
				        style: 'padding: 4 0 0 1',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        name: 'timetomin',
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        disabled: (A.common == 0) ? true : false,
				        editable: false,
				        value: 0,
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 60; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isPrimitive(A.servdata.data.timeto) && A.servdata.data.timeto.format('Y') != 9999) {
										this.setValue(A.servdata.data.timeto.format('i'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }]
				}, {
				    xtype: 'container',
				    fieldLabel: Ext.app.Localize.get('Tariff upon'),
				    layout: 'hbox',
					listeners: {
						afterrender: function(){
							if(A.common == 0) {
								this.hideContainer();
							}
						}
					},
				    items: [{
						xtype: 'datefield',
						name: 'activated',
						id: 'tarupon',
						width: 100,
						format: 'd.m.Y',
						allowBlank: false,
						typeAhead: false,
						editable: false,
						disabled: (A.common == 0) ? true : (A.edit && A.mutiple ? true : false),
						value: A.edit ? (A.mutiple ? '' : A.servdata.data.activated) : (A['activated'] || ''),
						validator: function(value){
							if(Ext.isEmpty(value)) {
								return true;
							}
							if(Date.parseDate(value, 'd.m.Y') < firston) {
								return false;
							}
							return true;
						},
						listeners: {
							afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isEmpty(A.servdata.data.activated) &&!Ext.isPrimitive(A.servdata.data.activated) && A.servdata.data.activated.format('Y') != 9999) {
										this.setValue(A.servdata.data.activated.format('d.m.Y'));
									}
								}
								this.setMinValue(A.edit ? (A.mutiple ? '' : A.servdata.data.timefrom.format('d.m.Y')) : (A['timefrom'] || ''));
								this.setMaxValue(A.edit ? (A.mutiple ? '' : A.servdata.data.timeto.format('d.m.Y')) : (A['timeto'] || ''));
							},
							select: function() {
								//Ext.getCmp('disctimeto').setValue(this.getValue());
							}
						}
					},			
				    {
				        xtype: 'tbspacer',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        name: 'activatedhour',
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        editable: false,
				        value: 0,
				        disabled: (A.common == 0) ? true : (A.edit && A.mutiple ? true : false), 
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 24; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
								if(!A.mutiple && A.edit){
									if(!Ext.isEmpty(A.servdata.data.activated) &&!Ext.isPrimitive(A.servdata.data.activated) && A.servdata.data.activated.format('Y') != 9999) {
										this.setValue(A.servdata.data.activated.format('H'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }, {
				        xtype: 'tbtext',
				        text: ':',
				        style: 'padding: 4 0 0 1',
				        width: 5
				    }, {
				        xtype: 'combo',
				        width: 25,
				        name: 'activatedmin',
				        triggerAction: 'all',
				        hideTrigger: true,
				        mode: 'local',
				        valueField: 'id',
				        displayField: 'id',
				        disabled: (A.common == 0) ? true : (A.edit && A.mutiple ? true : false),
				        editable: false,
				        value: 0,
				        listeners: {
				            beforerender: function(combo) {
				                var data = [];
				                for(var i = 0; i < 60; i++) {
				                    data.push([i < 10 ? '0' + i : i]);
				                }
				                combo.getStore().loadData(data);
				            },
				            afterrender: function(){
				            	if(!A.mutiple && A.edit){
									if(!Ext.isEmpty(A.servdata.data.activated) &&!Ext.isPrimitive(A.servdata.data.activated) && A.servdata.data.activated.format('Y') != 9999) {
										this.setValue(A.servdata.data.activated.format('i'));
									}
								}
							}
				        },
				        store: {
				            xtype: 'arraystore',
				            fields: ['id']
				        }
				    }]
				}, {
					xtype: 'combo',
					allowBlank: false,
					hiddenName: 'catidx',
					id: 'tarif_catidx',
					width: 210,
					displayField: 'name',
					valueField: 'id',
					fieldLabel: Ext.app.Localize.get('Service'),
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{[Ext.util.Format.htmlEncode(values.name)]}">{id}. {[Ext.util.Format.ellipsis(values.name, 33)]}</div></tpl>',
					editable: false,
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [{
							name: 'id',
							type: 'int'
						}, {
							name: 'name',
							type: 'string'
						}]),
						autoLoad: true,
						baseParams: Ext.applyIf({
							async_call: 1,
							devision: 106,
							getcategories: A.tarid,
							categoryfilter: A.filterClass
						}, A.categoryFilter || {}),
						sortInfo: {
							field: 'id',
							direction: "ASC"
						}
					}),
					listeners: {
						afterrender: function(){
							if (A.edit) {
								if (Ext.isArray(A.servdata)) {
									var R = A.servdata[0];
								}
								else {
									var R = A.servdata;
								}

								this.setValue(R.data.catidx);
								this.setRawValue(R.data.catidx + '. ' + Ext.util.Format.ellipsis(R.data.catdescr, 33));
								this.on('beforeselect', function(){
									return false;
								});
								this.setDisabled(true); 
							}
						}, 
						select: function(combo, store, record){
							Ext.Ajax.request({
								url: 'config.php',
								method: 'POST',
								params: Ext.apply({
									async_call: 1,
									devision: 106,
									getcatrate: 1,
									catidx: store.data.id,
									tarid: A.tarid,
									vgid: A.servdata.data.vgid
								}),
								callback: function(opt, success, res) {
									try {
										var result = Ext.decode(res.responseText);
										var rf = combo.findParentByType('form').getForm();
										
										if(!result.success && result.error) {
											rf.findField('discvalue').setValue('1');
										} else {
											rf.findField('disctype').setValue(2);
											rf.findField('discvalue').setValue(result.results.double);
										}
									}		
									catch(e) {
										Ext.Msg.error(e);
									}
								}
							});							
						}
					}
				}, {
					xtype: 'container',
					hidden: (A.common > 0) ? true: false,
					layout: 'form',
					items: [{
						xtype: 'combo',
						hiddenName: 'planid',
						width: 210,
						displayField: 'name',
						valueField: 'planid',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						fieldLabel: Ext.app.Localize.get('Installment plan'),
						tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{[Ext.util.Format.htmlEncode(values.name)]}">{planid}. {[Ext.util.Format.ellipsis(values.name, 33)]}</div></tpl>',
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
					}]
				}, {
					xtype: 'numberfield',
					name: 'mul',
					fieldLabel: Ext.app.Localize.get('Quantity'),
					disabled: (A.mutiple && A.edit) ? true : false,
					width: 100,
					value: 1,
					listeners: {
						afterrender: function(){
							if (A.edit) {
								if (Ext.isArray(A.servdata)) {
									var R = A.servdata[0];
								}
								else {
									var R = A.servdata;
								}

								if (!A.mutiple) {
									this.setValue(R.data.mul);
								}
								this.setReadOnly(true);
								this.setDisabled(true);
							}
						}
					}
				}, {
					xtype: 'textfield',
					name: 'comment',
					fieldLabel: Ext.app.Localize.get('Comment'),
					width: 210,
					listeners: {
						afterrender: function(){
							if (A.edit) {
								if (Ext.isArray(A.servdata)) {
									var R = A.servdata[0];
								}
								else {
									var R = A.servdata;
								}

								if (!A.mutiple) {
									this.setValue(R.data.comment);
								}
							}
						}
					}
				},
				{
					xtype: 'checkbox',
					name: 'noduplicate',
					fieldLabel: Ext.app.Localize.get('Not duplicate'),
					listeners: {
						afterrender: function() {
							this.getEl().up('.x-form-item').setDisplayed((A.mutiple && !A.edit) ? true : false)
						}
					}
				}, 
				{
					xtype: 'container',
					itemId: 'timedisccont',
					layout: 'form',
					hidden: (A.common < 1) ? true: false,
					items: [{
						xtype: 'tbtext',
						width: 220,
						style: {
							padding: '5px 0 5px 8px'
						},
						text: Ext.app.Localize.get('The period of the discount')
					}, {
						xtype: 'datefield',
						name: 'disctimefrom',
						id: 'disctimefrom',
						fieldLabel: Ext.app.Localize.get('Since'),
						width: 100,
						format: 'd.m.Y',
						disabled: (A.mutiple && A.edit) ? true : false,
						allowBlank: true,
						value: A.edit ? (A.mutiple ? '' : A.servdata.data.disctimefrom) : A['timefrom'],
						validator: function(value) {
							if(!Ext.isEmpty(firston) && Date.parseDate(value, 'd.m.Y') < firston) {
								return false;
							}
							return true;
						},
						listeners: {
							'afterrender': function(){
								this.setMinValue(A.edit ? (A.mutiple ? '' : A.servdata.data.timefrom.format('d.m.Y')) : (A['timefrom'] || ''));
							}
						}
					}, {
						xtype: 'datefield',
						name: 'disctimeto',
						id: 'disctimeto',
						fieldLabel: Ext.app.Localize.get('Till'),
						width: 100,
						format: 'd.m.Y',
						disabled: (A.mutiple && A.edit) ? true : false,
						listeners: {
							afterrender: function(){
								if (A.edit) {
									if (Ext.isArray(A.servdata)) {
										var R = A.servdata[0];
									}
									else {
										var R = A.servdata;
									}
									if(!Ext.isEmpty(R.data.disctimeto) && !Ext.isPrimitive(R.data.disctimeto) && R.data.disctimeto.format('Y') != 9999) {
										this.setValue(R.data.disctimeto.format('d.m.Y'));
									} else {
										this.setValue('');
									}
								}
								this.setMaxValue(A.edit ? (A.mutiple ? '' : A.servdata.data.timeto.format('d.m.Y')) : (A['timeto'] || ''));

							}
						}
					}]
				}, {
					xtype: 'combo',
					hiddenName: 'disctype',
					width: 210,
					displayField: 'name',
					valueField: 'id',
					typeAhead: false,
					mode: 'local',
					triggerAction: 'all',
					fieldLabel: Ext.app.Localize.get('Discount type'),
					editable: false,
					value: A.edit ? (A.discount > 0 ? 1 : 2) : '',
		            store: {
		            	xtype: 'arraystore',
		                fields: ['id', 'name'],
		                data: [
							[1, Ext.app.Localize.get('Absolute')],
							[2, Ext.app.Localize.get('Coefficient')]
						]
		            },
					listeners: {
						select: function(combo, record) {
							if(record.get('id')==1) {
								combo.ownerCt.get('discvalue').setLabel(Ext.app.Localize.get('Discount'));
							} else {
								combo.ownerCt.get('discvalue').setLabel(Ext.app.Localize.get('Ratio'));
							}
						}
					}
				}, {
					xtype: 'numberfield',
					name: 'rate',
					itemId: 'discvalue',
					disabled: (A.mutiple && A.edit) ? true : false,
					allowNegative: true,
					autoStripChars: true,
					decimalPrecision: 5,
					fieldLabel: Ext.app.Localize.get('Ratio'),
					//readOnly: (A.common < 1) ? true : false,
					width: 100,
					value: 1,
					listeners: {
						afterrender: function(){
							if (A.edit) {
								if (Ext.isArray(A.servdata)) {
									var R = A.servdata[0];
								}
								else {
									var R = A.servdata;
								}
								this.setValue(R.data.discount > 0 ? R.data.discount : R.data.realrate);
							}
						}
					}
				}		
			],
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                formBind: true,
				sendData: function(B, A){
					var params = {}; 
					if( true === B.getForm().findField("mul").disabled){
						params['mul'] = B.getForm().findField("mul").getValue();
					}
					
					B.getForm().submit({
                        method: 'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        params: params, 
                        success: function(form, action){
							this.A.success(form, action);
							Ext.getCmp('UBServAdd').close();
                        }.createDelegate({ A: A }),
                        failure: function(form, action){
                            if (action.failureType == 'server') {
								var O = Ext.util.JSON.decode(action.response.responseText);
								if(!Ext.isArray(O.reason)) {
									Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
								}
								else {

									try {
										var store = new Ext.data.ArrayStore({
											autoDestroy: true,
											idIndex: 0,
											data: O.reason,
											fields: [
												{ name: 'id', type: 'int' },
												{ name: 'login', type: 'string' },
												{ name: 'catdescr', type: 'string' },
												{ name: 'reason', type: 'string' }
											]
										});

										new Ext.Window({
											modal: true,
											title: Ext.app.Localize.get('Error'),
											width: 600,
											items: [{
												xtype: 'grid',
												store: store,
												height: 200,
												autoExpandColumn: 'nonedelreason',
												cm: new Ext.grid.ColumnModel({
													columns: [{
														header: Ext.app.Localize.get('Login'),
														dataIndex: 'login',
														width: 140
													}, {
														header: Ext.app.Localize.get('Reason'),
														dataIndex: 'reason',
														id: 'nonedelreason'
													}],
													defaults: {
														sortable: true,
														menuDisabled: true
													}
												})
											}]
										}).show();
									}
									catch(e) { }
								}
                            }
                        }
                    });
				},
                handler: function(B){
                    var B = B.findParentByType('form');
					if (A.mutiple && A.edit) {
						var timeto = B.find('name', 'timeto')[0];
						var comm = B.find('name', 'comment')[0];
						Ext.Msg.confirm(Ext.app.Localize.get('Info'), (Ext.isPrimitive(timeto.getValue()) ?
										Ext.app.Localize.get('Date of the end will be reset for all selected services') : Ext.app.Localize.get('Date of the end will be changed for all selected services')) +
										((comm.getValue().length > 0) ? '<br>' + Ext.app.Localize.get('Comment will be changed for all selected services') : ''),
						function(B)
						{
							if(B == 'yes') {
								this.button.sendData(this.form, this.A);
							}
						}, {
							button: this,
							form: B,
							A: A
						});
					}
					else {
						this.sendData(B, A);
					}

                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Cancel'),
                handler: function(){
                    Ext.getCmp('UBServAdd').close();
                }
            }],
			listeners: {
				afterrender: function() {
					if(!A.mutiple) {
						var L = [A.servdata];
					}
					else {
						var L = A.servdata;
					}

					Ext.each(L, function(item, idx){
						for (var i in item.data) {

							switch(i) {
								case 'vgid':
								case 'servid':
								case 'common':
								
								case 'mul':
								case 'comment':
								case 'catdescr':
								case 'vglogin':
								case 'rate':
								{
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][' + i + ']',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('d.m.Y') : item.data[i])
									});
									continue;
								}
								case 'timefrom': 
								{
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][' + i + ']',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('d.m.Y') : item.data[i])
									});
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][timefromhour]',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('H') : item.data[i])
									});
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][timefrommin]',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('i') : item.data[i])
									});
									continue;
								}
								case 'activated': 
								{
									if(item.data[i] == null) {
										continue;
									} 
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][' + i + ']',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('d.m.Y') : item.data[i])
									});
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][activatedhour]',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('H') : item.data[i])
									});
									this.add({
										xtype: 'hidden',
										name: 'saveubservice[' + idx + '][activatedmin]',
										value: (i == 'servid' && !A.edit) ? -1 : (!Ext.isPrimitive(item.data[i]) ? item.data[i].format('i') : item.data[i])
									});
									continue;
								}

								default:
									continue;
							}
						}
					}, this);

					this.doLayout();
				}
			}
        }]
    }).show();
} // end showUBAddControl()

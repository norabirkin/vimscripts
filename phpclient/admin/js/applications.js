/**
 * View and control "Would-be customers" list
 * 
 * Repository information:
 * @date		$Date: 2013-07-08 17:06:24 +0400 (Пн., 08 июля 2013) $
 * @revision	$Revision: 35301 $
 */

Ext.onReady(function(){
	// Load Quick tips class to parse extra tags
	Ext.QuickTips.init();
	// Start rendering grid
	showApplicationsList('_BeCustomersList');
});


/**
 * To render grid to main body table
 * @param	string, HTMLElement to render to
 */
function showApplicationsList(renderTo)
{
	if(!Ext.get(renderTo)) {
		return false;
	}
	
	var COOKIE = 'node110';
	// Let it be global define for the page limit
	var PAGELIMIT = 100;
	
	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php', 
			method: 'POST', 
			timeout: 380000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results', 
			totalProperty: 'total' 
		}, [
			{ name: 'recordid', type: 'int' },
			{ name: 'authorid', type: 'int' },
			{ name: 'statusid', type: 'int' },
			{ name: 'apptypeid', type: 'int' },
			{ name: 'authorname', type: 'string' },
			{ name: 'uid', type: 'int' },
			{ name: 'username', type: 'string' },
			{ name: 'address', type: 'string' },
			{ name: 'responsible', type: 'string' },
			{ name: 'responsibleid', type: 'int' },
			{ name: 'executestart', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'executefinal', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'executetime', type: 'int' },
			{ name: 'task', type: 'string' },
			{ name: 'alreadydone', type: 'int' },
			{ name: 'statusdescr', type: 'string' },
			{ name: 'statuscolor', type: 'string' },
			{ name: 'classdescr', type: 'string' },
			{ name: 'classcolor', type: 'string' }
		]),
		// Advance reload, call synchronization before send data
		reload : function(options){
			this.syncStore();
			this.load(Ext.applyIf(options||{}, this.lastOptions));
		},
		// Advanced function to store data to base params store
		// @param	string, key name to modify or add
		// @param	Mixed, Value to store or modify
		// @param	array, array of keys to remove from base params store
		setBaseParam : function (name, value, remove){
			this.baseParams = this.baseParams || {};
			this.baseParams[name] = value;
			
			if(Ext.isDefined(remove)) {
				var params = {};
				
				if(!Ext.isArray(remove)) {
					var remove = [remove];
				}
				
				if (remove.length > 0) {
					for (var i in this.baseParams) {
						if (remove.indexOf(i) > -1) {
							continue;
						}
						
						params[i] = this.baseParams[i];
					}
					
					this.baseParams = params;
				}
			}
		},
		// Synchronize filter with store
		syncStore: function() {
			var panel = Ext.getCmp('applications').getTopToolbar();
			if(Ext.isObject(panel['extfilter'])) {
				panel.extfilter.saveParams();
			}
			panel.syncToolStore();
			return this.baseParams;
		},
		baseParams: {
			async_call: 1,
			devision: 110,
			getapplications: 1,
			apptypeid: -1,
			statuses: -1,
			start: 0,
			limit: PAGELIMIT,
			searchtype: 0,
			searchfield: '',
			responsible: '',
			dtfrom: '',
			dtto: ''
		}
	});
	
	// Checkbox selection model
	var Checkbox = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});
	
	// Row button to edit application item
	// Column button, which will be embed  to column model of the services grid
	var ApplEdit = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Edit'),
		width: 22,
		dataIndex: 'recordid',
		iconCls: 'ext-edit'
	});
	
	ApplEdit.on('action', function(grid, record, rowIndex){
		Application(record);
	});
	
	// Row button to edit application comments
	// Column button, which will be embed  to column model of the services grid
	var CoomentEdit = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Comments'),
		width: 22,
		dataIndex: 'recordid',
		iconCls: 'ext-table'
	});
	
	CoomentEdit.on('action', function(grid, record, rowIndex){
		Ext.Ajax.request({
			url: 'config.php',
			method: 'POST',
			scope: record,
			params: {
				async_call: 1,
				devision: 110,
				getcomments: record.get('recordid')
			},
			success: function(result) {
				var data = eval(result.responseText)
				Comments(data, this.get('recordid'));
			},
			failure: function(result) {
				
			}
		});
	});
	
	new Ext.grid.GridPanel({
		title: Ext.app.Localize.get('Applications'),
		renderTo: renderTo,
		id: 'applications',
		frame: true,
		height: 750,
		loadMask: true,
		listeners: {
			afterrender: function() {
				var T = this.getTopToolbar()
				T.syncToolView();
				if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
					Application();
				}
			}
		},
		tbar: new Ext.Toolbar({
			layout: 'anchor',
			// Restore Storage values to filter
			syncToolView: function() {
				Ext.each(this.findByType('textfield'), function(item){ 
					if(Ext.isDefined(this.baseParams[item.getId()])) {
						item.setValue(this.baseParams[item.getId()])
					}
				}, this.ownerCt.getStore());
				Ext.each(this.findByType('combo'), function(item){ 
					if(Ext.isDefined(this.baseParams[item.getId()])) {
						item.setValue(this.baseParams[item.getId()])
					}
				}, this.ownerCt.getStore());				
			},
			// Save filter data to store
			syncToolStore: function() {
				var store = this.ownerCt.getStore();
				// Save date values to store
				//store.setDate('from', this.ownerCt.period.from);
				//store.setDate('till', this.ownerCt.period.till);
				// Save combo values to store
				Ext.each(this.findByType('textfield'), function(item){ 
					switch(item.getId()) {
						case 'searchfield':
							this.setBaseParam(item.getId(), item.getValue());
						break;
					}
				}, store);
			},
			items: [{
				// Top line of the panel tool bar
				xtype: 'container',
				layout: 'toolbar',
				width: 950,
				style: {
					paddingTop: '1px'
				},
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Add'),
					iconCls: 'ext-add',
					handler: Application
				}, {
					xtype: 'tbseparator',
					style: {
						paddingRight: '15px'
					}
				}, {
					xtype: 'combo',
					id: 'SearchCombo',
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
							['0', Ext.app.Localize.get('User')], 
							['2', Ext.app.Localize.get('User login')], 
							['3', Ext.app.Localize.get('Account login')], 
							['4', 'E-mail'], 
							['5', Ext.app.Localize.get('Phone')],
							['6', Ext.app.Localize.get('Address')],
							['7', Ext.app.Localize.get('Application number')]
						],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function(){
							this.ownerCt.getGrid().store.setBaseParam('searchtype', this.getValue());
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'textfield',
					width: 220,
					id: 'searchfield',
					listeners: {
						afterrender: function() {
							this.on('specialkey', function(f, e){
								if (e.getKey() == e.ENTER) {
									this.ownerCt.getGrid().getStore().reload({ 
										params: {
											start: 0
										}
									})
								}
							}, this);
						}
					}
				}, {
					xtype: 'container',
					style: {
						paddingLeft: '12px'
					},
					html: Ext.app.Localize.get('Application type') + ':&nbsp;'
				}, {
					xtype: 'combo',
					tpl: '<tpl for="."><div class="x-combo-list-item" style="color:#{values.color}">{[values.id < 1 ? "" : values.id + "."]} {[Ext.util.Format.ellipsis(values.descr, 32)]}</div></tpl>',
					displayField: 'descr',
					id: 'appsearch',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					width: 190,
					listeners: {
						select: function() {
							this.ownerCt.getGrid().getStore().setBaseParam('apptypeid', this.getValue());
						}
					},
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'id', type: 'int' },
							{ name: 'descr', type: 'string' },
							{ name: 'color', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 111,
							getappltypes: 1
						},
						listeners: {
							load: function(store) {
								store.insert(0, new store.recordType({
									id: -1,
									descr: Ext.app.Localize.get('All'),
									color: '000000'
								}))
							}
						}
					})
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Filter'),
					icon: 'images/filter.gif',
					iconAlign: 'right',
					width: 80,
					enableToggle: true,
					handler: function() {
						if (!Ext.isObject(this.ownerCt.ownerCt['extfilter'])) {
							this.ownerCt.ownerCt.extfilter = ExtendedFilter(this);
							this.ownerCt.ownerCt.extfilter.panel = this.ownerCt.ownerCt.ownerCt;
							if(!this.ownerCt.ownerCt.extfilter) {
								return false;
							}
						}
						if(this.ownerCt.ownerCt.extfilter) {
							if(this.pressed) {
								this.ownerCt.ownerCt.extfilter.show();
							}
							else {
								this.ownerCt.ownerCt.extfilter.hide();
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'splitbutton',
					text: Ext.app.Localize.get('Show'),
					iconCls: 'ext-search',
					handler: function() {
						this.ownerCt.getGrid().getStore().reload({
							params: {
								start: 0
							}
						})
					},
					menu: [{
						text: Ext.app.Localize.get('Print'),
						handler: function() {
							PrintMenu(this.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt);
						}
					}, {
						text: Ext.app.Localize.get('Exceptions'),
						handler: function() {
							limitsExceptions(this.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt)
						}
					}]
				}]
			}]
		}),
		sm: Checkbox,
		viewConfig: {
			enableRowBody: true,
			forceFit: true,
			// Return CSS class to apply to rows depending upon data values
			getRowClass: function(record, index, rowBody) {
				rowBody.body = '<div style="border: solid 1px #e0e0e0; background-color: #f9f9f9; padding: 3px 20px;">' + 
					'<ul class="line"><li><b>' + Ext.app.Localize.get('Already done') + ' (%):</b></li>' + 
						'<li style="padding-top: 2px; padding-left: 5px;"><div class="progress-wrap" title="' + (record.get('alreadydone') * 1) + '%">' +
						'<div class="progress-value" style="background-color: #9DC293; width: ' + 
						(record.get('alreadydone') * 1) + 
						'%;"></div>' +  
						'</div></li>' +
					'</ul>' +
					'<p style="clear: both;"><b>' + Ext.app.Localize.get('Address') + ':</b> ' + record.get('address') + '</p>' +  
					'<p><b>' + Ext.app.Localize.get('Task') + ':</b> ' + record.get('task') + '</p>' +
					'</div>';
			}
		},
		plugins: [ApplEdit, CoomentEdit],
		cm: new Ext.grid.ColumnModel({
			columns: [Checkbox, ApplEdit, CoomentEdit, {
				header: Ext.app.Localize.get('Number'),
				dataIndex: 'recordid',
				width: 75
			}, {
				header: Ext.app.Localize.get('User name'),
				dataIndex: 'username',
				width: 190
			}, {
				header: Ext.app.Localize.get('Status'),
				dataIndex: 'statusdescr',
				width: 120,
				renderer: function(value, metaData, record) {
					var sc = record.get('statuscolor');
					if (sc.length > 0) {
						metaData.style = "color: #" + record.get('statuscolor') + ';';
					}
					return value;
				}
			}, {
				header: Ext.app.Localize.get('Responsible'),
				dataIndex: 'responsible',
				width: 150
			}, {
				header: Ext.app.Localize.get('Beginning'),
				dataIndex: 'executestart',
				width: 100,
				renderer: function(value, metaData, record) {
					try {
						if(!Ext.isEmpty(value) && value.format('Y') < 1900) {
							return '';
						}
						return value.format('d.m.Y H:i');
					}
					catch(e) {
						return value
					}
				}
			}, {
				header: Ext.app.Localize.get('End'),
				dataIndex: 'executefinal',
				width: 100,
				renderer: function(value, metaData, record) {
					try {
						if(value.format('Y') > 9000) {
							return '';
						}
						return value.format('d.m.Y H:i');
					}
					catch(e) {
						return value
					}
				}
			}]
		}),
		store: Store,
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
	})
} // end showApplicationsList


/**
 * Form to add new application to the list or edit existing
 * @param	object, object that contains load data 
 */
function Application(data)
{
	// Global name of cookie to take settings from
	var COOKIE = 'node110';
	
	// Check if there is record pass to edit data
	var data = data || {};
	var EDIT = data['data'] ? true : false;
	
	// Class to create my trigger field
	// Global
	Ext.ns('Ext.ux.form');
	// Class constructor
	Ext.ux.form.Twin = Ext.extend(Ext.form.TwinTriggerField, {
		initComponent : function(){
			Ext.ux.form.Twin.superclass.initComponent.call(this);
			this.on('afterrender', function(field){
				if(!Ext.isEmpty(this.linkField) && Ext.isPrimitive(this.linkField)) {
					this.linkField = Ext.getCmp(this.linkField);
				}
				if(!Ext.isEmpty(this.value)) {
					if(!Ext.isPrimitive(this.linkField) && !Ext.isEmpty(this.linkField.getValue())) {
						this.onTrigger2Click();
					}
				}
			});
		},
		
		linkField: null,
		trigger1Class: 'x-form-clear-trigger',
		trigger2Class: 'x-form-edit-trigger',
		hideTrigger1: true,
		hideTrigger2: true,
		showEdit: false,
		width: 180,
		
		handler: function() {
			
		},
		
		trigger1Handler: function() {
			
		},
		
		// Clear value and free field for input
		onTrigger1Click : function(){
			this.el.dom.value = '';
			if(this.el.dom.readOnly == true) {
				this.el.dom.readOnly = false;
			}
			if(Ext.isObject(this.linkField)) {
				this.linkField.setValue(-1);
			}
			this.triggers[0].hide();
			this.triggers[1].hide();
			
			this.trigger1Handler(this.linkField);
		},
		
		// This function fire when field value is set
		onTrigger2Click : function(edit) {
			if (!edit) {
				if (!this.el.dom.readOnly) {
					this.el.dom.readOnly = true;
				}
				this.triggers[0].show();
				if (this.showEdit && Ext.isObject(this.linkField) && this.linkField.getValue() > 0) {
					this.triggers[1].show();
				}
			}
			else {
				this.handler(this.linkField)
			}
		}
	});
	
	var AWin = new Ext.Window({
		title: Ext.app.Localize.get('Application'),
		id: 'application',
		modal: true,
		width: 532,
		resizable: false,
		items: [{
			xtype: 'form',
			frame: true,
			labelWidth: 140,
			url: 'config.php',
			monitorValid: true,
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 110
			}, {
				xtype: 'hidden',
				name: 'recordid',
				value: EDIT ? data.get('recordid') : 0
			}, {
				xtype: 'hidden',
				id: 'uid-twin',
				name: 'uid',
				value: EDIT ? data.get('uid') : 0
			}, {
				xtype: 'hidden',
				id: 'responsibleid-twin',
				name: 'responsibleid',
				value: EDIT ? data.get('responsibleid') : 0
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Application type'),
				tpl: '<tpl for="."><div class="x-combo-list-item" style="color:#{values.color}">{[values.id < 1 ? "" : values.id + "."]} {[Ext.util.Format.ellipsis(values.descr, 32)]}</div></tpl>',
				displayField: 'descr',
				hiddenName: 'apptypeid',
				name: 'apptypeid',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				width: 350,
				allowBlank: false,
				value: EDIT ? data.get('apptypeid') : null,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results'
					}, [
						{ name: 'id', type: 'int' },
						{ name: 'archive', type: 'int' },
						{ name: 'descr', type: 'string' },
						{ name: 'color', type: 'string' }
					]),
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 111,
						getappltypes: 1,
						checktype: EDIT ? 1 : 0
					},
					listeners: {
						load: function(store) {
							if (EDIT && data['data']) {
								store.each(function(item, idx){
									if(item.get('archive')>0 && item.get('id') != data.get('apptypeid')) {
										store.remove(item);
									}
								});
								Ext.getCmp('application').items.first().find('name', 'apptypeid')[0].setValue(EDIT ? data.get('apptypeid') : null);
							}
						}
					}
				}),
				listeners: {
					beforeselect:  function(combo, record, index) {
						if (EDIT && data['data']) {
							if(combo.getStore().getAt(index).get('archive')>0) {	
								return false;
							}
						}
					}
				}
			}, {
				xtype: 'container',
				fieldLabel: Ext.app.Localize.get('Client'),
				id: 'username_composite',
				layout: 'anchor',
				items: [new Ext.ux.form.Twin({
					width: 350,
					name: 'username',
					linkField: 'uid-twin',
					allowBlank: false,
					showEdit: true,
					value: EDIT ? data.get('username') : '',
					handler: function(field) {
						field.ownerCt.findById('createuser').handler();
					},
					trigger1Handler: function(field) {
						field.ownerCt.findById('createuser').enable();
					}
				}), {
					xtype: 'container',
					height: 27,
					style: {
						paddingTop: '3px'
					},
					layout: 'hbox',
					items: [{
						xtype: 'button',
						text: Ext.app.Localize.get('Create users objects'),
						id: 'createuser',
						flex: 1,
						handler: function() {
							var form = Ext.getCmp('application').items.first();
							form.getForm().submit({
								clientValidation: false,
								method:'POST', 
								waitTitle: Ext.app.Localize.get('Connecting'), 
								waitMsg: Ext.app.Localize.get('Sending data') + '...',
								scope: form,
								params: {
									applcache: 1
								},
								success: function(form, action) {
									var O = Ext.util.JSON.decode(action.response.responseText);
									Ext.app.DefaultView.set('node110', {
										r0: 1
									}, true);
									var uid = this.findById('uid-twin').getValue();
									submitForm('StartNewUser', 'uid', (uid > 0) ? uid : 0);
								},
								failure: function(form, action){
									var O = Ext.util.JSON.decode(action.response.responseText);
									Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
								}
							})
						}
					}, {
						xtype: 'tbspacer',
						width: 5
					}, {
						xtype: 'button',
						text: Ext.app.Localize.get('Attach to user'),
						flex: 1,
						handler: function() {
							showUsers({
								callbackok: function(grid) {
									var md = grid.getSelectionModel()
									if (md.getCount() > 0) {
										this.find('name', 'uid')[0].setValue(md.getSelected().get('uid'));
										var un = this.findById('username_composite').items.first();
										un.setValue(md.getSelected().get('name'));
										un.onTrigger2Click();
									}
								}.createDelegate(Ext.getCmp('application').findByType('form')[0])
							})
						}
					}]
				}]
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Status'),
				tpl: '<tpl for=".">' +
					'<div class="x-combo-list-item {[values.defaultanswer == 1 ? \'x-combo-item-locked\' : \'\']}" style="padding-left: 20px; color:#{values.color};">{values.descr}</div>' +
					'</tpl>',
				displayField: 'descr',
				hiddenName: 'statusid',
				name: 'statusid',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				width: 350,
				allowBlank: false,
				lazyRender: true,
				value: EDIT ? data.get('statusid') : null,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results'
					}, [
						{ name: 'id', type: 'int' },
						{ name: 'descr', type: 'string' },
						{ name: 'defaultanswer', type: 'int' },
						{ name: 'color', type: 'string' }
					]),
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 110,
						getstatuses: 1
					},
					listeners: {
						load: function(store) {
							if (EDIT && data['data']) {
								Ext.getCmp('application').items.first().find('name', 'statusid')[0].setValue(EDIT ? data.get('statusid') : null);
							}
						}
					}
				})
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Responsible'),
				id: 'men_composite',
				items: [new Ext.ux.form.Twin({
					width: 255,
					name: 'responsible',
					linkField: 'responsibleid-twin',
					value: EDIT ? data.get('responsible') : ''
				}), {
					xtype: 'button',
					text: Ext.app.Localize.get('Managers'),
					flex: 1,
					handler: function() {
						showManagers({
							callbackok: function(grid) {
								var md = grid.getSelectionModel()
								if (md.getCount() > 0) {
									this.find('name', 'responsibleid')[0].setValue(md.getSelected().get('responsibleid'));
									var un = this.findById('men_composite').items.first();
									un.setValue(md.getSelected().get('name'));
									un.onTrigger2Click();
								}
							}.createDelegate(Ext.getCmp('application').findByType('form')[0])
						})
					}
				}]
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Beginning'),
				items: [{
					xtype: 'datefield',
					width: 110,
					format: 'Y-m-d',
					name: 'executestart',
					value: EDIT ? ((data.get('executestart').format('Y') > 1900) ? data.get('executestart').format('Y-m-d') : '') : null
				}, {
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Time')
				}, {
					xtype: 'combo',
					width: 60,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					name: 'executestart_hh',
					hiddenName: 'executestart_hh',
					value: EDIT ? ((data.get('executestart').format('Y') > 1900) ? data.get('executestart').format('H') : '') : null,
					store: new Ext.data.ArrayStore({
						data: [],
						fields: ['id', 'name' ]
					}),
					listeners: {
						beforerender: function() {
							for(var i = 0, off = 23; i <= off; i++) {
								this.store.add(new this.store.recordType({
									id: i,
									name: (i < 10) ? ('0' + i) : i 
								}))
							}
						}
					}
				}, {
					xtype: 'displayfield',
					value: ':'
				}, {
					xtype: 'combo',
					width: 60,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					name: 'executestart_mm',
					hiddenName: 'executestart_mm',
					value: EDIT ? ((data.get('executestart').format('Y') > 1900) ? data.get('executestart').format('i') : '') : null,
					store: new Ext.data.ArrayStore({
						data: [],
						fields: ['id', 'name']
					}),
					listeners: {
						beforerender: function(){
							for (var i = 0, off = 59; i <= off; i++) {
								this.store.add(new this.store.recordType({
									id: i,
									name: (i < 10) ? ('0' + i) : i
								}))
							}
						}
					}
				}]
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('End'),
				items: [{
					xtype: 'datefield',
					format: 'Y-m-d',
					width: 110,
					name: 'executefinal',
					value: EDIT ? ((data.get('executefinal').format('Y') < 9000) ? data.get('executefinal').format('Y-m-d') : '') : null
				}, {
					xtype: 'displayfield', 
					value: Ext.app.Localize.get('Time')
				}, {
					xtype: 'combo',
					width: 60,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					name: 'executefinal_hh',
					hiddenName: 'executefinal_hh',
					value: EDIT ? ((data.get('executestart').format('Y') > 1900) ? data.get('executefinal').format('H') : '') : null,
					store: new Ext.data.ArrayStore({
						data: [],
						fields: ['id', 'name' ]
					}),
					listeners: {
						beforerender: function() {
							for(var i = 0, off = 23; i <= off; i++) {
								this.store.add(new this.store.recordType({
									id: i,
									name: (i < 10) ? ('0' + i) : i 
								}))
							}
						}
					}
				}, {
					xtype: 'displayfield',
					value: ':'
				}, {
					xtype: 'combo',
					width: 60,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					name: 'executefinal_mm',
					hiddenName: 'executefinal_mm',
					value: EDIT ? ((data.get('executestart').format('Y') > 1900) ? data.get('executefinal').format('i') : '') : null,
					store: new Ext.data.ArrayStore({
						data: [],
						fields: ['id', 'name' ]
					}),
					listeners: {
						beforerender: function() {
							for(var i = 0, off = 59; i <= off; i++) {
								this.store.add(new this.store.recordType({
									id: i,
									name: (i < 10) ? ('0' + i) : i 
								}))
							}
						}
					}
				}, {
					xtype: 'button',
					icon: 'images/cal.gif',
					tooltip: Ext.app.Localize.get('Schedule'),
					handler: function() {
						TimeSheet(Ext.getCmp('application').items.first());
					}
				}]
			}, {
				xtype: 'numberfield',
				fieldLabel: Ext.app.Localize.get('Estimated time') + ' (' + Ext.app.Localize.get('H') + ')',
				width: 90,
				name: 'executetime',
				value: EDIT ? data.get('executetime') : null
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Already done') + ' (%)',
				tpl: '<tpl for="."><div class="x-combo-list-item">{id}%</div></tpl>',
				width: 90,
				name: 'alreadydone',
				hiddenName: 'alreadydone',
				displayField: 'id',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				value: EDIT ? data.get('alreadydone') : null,
				store: new Ext.data.ArrayStore({
					data: [
						['0'], 
						['10'], 
						['20'],
						['30'],
						['40'],
						['50'],
						['60'],
						['70'],
						['80'],
						['90'],
						['100']
					],
					fields: ['id']
				})
			}, {
				xtype: 'textarea',
				fieldLabel: Ext.app.Localize.get('Task'),
				width: 350,
				height: 40,
				allowBlank: false,
				name: 'task',
				value: EDIT ? data.get('task') : null
			}],
			buttonAlign: 'center',
			buttons: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Save'),
				formBind: true,
				handler: function() {
					var form = this.ownerCt.ownerCt;
					
					form.getForm().submit({
						method:'POST', 
						waitTitle: Ext.app.Localize.get('Connecting'), 
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						params: {
							saveapplication: EDIT ? data.get('recordid') : 0
						},
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
								if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
									Ext.app.DefaultView.remove(COOKIE, 'r0');
								}
								try {
									var dd = this.data['store'] || this.data['findParentByType']('grid');
								}
								catch(e){
									var dd = Ext.getCmp('applications');
								}
								if(Ext.isDefined(dd) && Ext.isObject(dd)) {
									if(dd['reload']) {
										dd.reload()
									}
									else if(dd['store']) {
										dd.store.reload();
									}
								}
								this.window.close();
							}.createDelegate({
								data: data,
								window: Ext.getCmp('application')
							}));
						},
						failure: function(f, action){
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
											fields: [{
												name: 'descr',
												type: 'string'
											}, {
												name: 'reason',
												type: 'string'
											}]
										});
								
										new Ext.Window({
											modal: true,
											width: 600,
											resizable: false,
											title: Ext.app.Localize.get('Error'),
											items: [{
												xtype: 'grid',
												store: store,
												height: 200,
												autoExpandColumn: 'nonedelreason',
												cm: new Ext.grid.ColumnModel({
													columns: [{
														header: Ext.app.Localize.get('Name'),
														dataIndex: 'descr',
														width: 210
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
													this.items.each(function(item){
														if(item.getXType() == 'editorgrid') {
															item.store.reload();
														}
													})
												}.createDelegate({
													items: form.ownerCt.items
												})
											}
										}).show();
									}
									catch(e) { }
								}
							}
						})
				}
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Cancel'),
				handler: function() {
					if (Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
						this.ownerCt.ownerCt.getForm().submit({
							clientValidation: false,
							method: 'POST',
							waitTitle: Ext.app.Localize.get('Connecting'), 
							waitMsg: Ext.app.Localize.get('Sending data') + '...',
							params: {
								applclearcache: 1
							},
							success: function(form, action) {
								this.close();
							}.createDelegate(this.ownerCt.ownerCt.ownerCt),
							failuer: function(form, action) {
								
							}
						});
					}
					else {
						this.ownerCt.ownerCt.ownerCt.close()
					}
				}
			}]
		}]
	});
	
	if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
		AWin.items.first().getForm().load({
			url: 'config.php',
			method: 'POST',
			scope: AWin,
			params: {
				async_call: 1,
				devision: 110,
				applrestorecache: 1
			},
			success: function(form, action) {
				if(!this.isVisible()) {
					this.show();
				}
				var ff = this.items.first();
				if (action.result.data.uid > 0) {
					if (action.result.data.recordid == 0 && action.result.data['template'] == 2) {
						ff.findById('createuser').disable();
					}
					ff.findById('username_composite').items.first().onTrigger2Click();
				}
				ff.getForm().setValues(action.result.data);
				Ext.app.DefaultView.remove(COOKIE, 'r0');
			},
			failure: function() {
				if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'r0', 0) > 0) {
					Ext.app.DefaultView.remove(COOKIE, 'r0');
				}
				this.close();
			}
		});
	}
	else {
		AWin.show();
	}
} // end Application()


/**
 * Show comments panel to view existing history, comments 
 * @param	object, that was passed from server with comments list
 * @param	integer, application record id
 */
function Comments(data, app)
{
	if(!app) {
		return false;
	}
	
	// Check if there is data
	var DATA_OK = (!data['data'] || Ext.isEmpty(data['data'])) ? false : true;
	
	// Remove function
	
	new Ext.Window({
		title: Ext.app.Localize.get('Comments'),
		id: 'comments',
		constrain: true,
		modal: true,
		autoHeight: true,
		resizable: false,
		width: 600,
		tbar: [{
			xtype: 'button',
			text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('Comment'),
			iconCls: 'ext-add',
			handler: function(A, B) {
				var form = this.ownerCt.ownerCt.findByType('form')[0];
				if(Ext.isPrimitive(A)) {
					form.find('name', 'recordid')[0].setValue(A);
					form.find('name', 'comments')[0].setValue(Ext.get('comment-' + A).dom.innerHTML);
				}
				form.show();
				this.ownerCt.ownerCt.updateBox(this.ownerCt.ownerCt.getBox());
			}
		}],
		items:[{
			xtype: 'container',
			autoScroll: true,
			data: DATA_OK ? data.data : null,
			tpl: '<div style="overflow: auto;"><table width="100%" class="table_comm">' +
				'<tpl for="."><tr><td class="td_comm" style="padding:10px;">' +
				'<tpl if="!Ext.isArray(comments)"><div style="float:right;">' +
					'<a href="#" title="{[ Ext.app.Localize.get("Edit") ]}" onclick="Ext.getCmp(\'comments\').getTopToolbar().items.first().handler(\'{values.recordid}\')"><img src="images/edit16.gif"></a>' +
					'&nbsp;&nbsp;' +
					'<a href="#" title="{[ Ext.app.Localize.get("Remove") ]}" onclick="Ext.getCmp(\'comments\').findByType(\'form\')[0].buttons[0].handler(\'-1\', \'{values.recordid}\')"><img src="images/delete.gif"></a>' + 
				'</div></tpl>' +
				'<div>{created}</div>' +  
				'<tpl if="Ext.isArray(comments)">' +
					'<b style="color: #0B2C78;">{[ Ext.app.Localize.get("Manager")]} "{authorname}" {[ Ext.app.Localize.get("made change to") ]}:</b>' + 
					'<ul style="color:#a9a9a9;"><tpl for="comments"><li>' + 
						'<b>{name}</b>:&nbsp;' +
						'<strike><tpl if="Ext.isEmpty(oldvalue)">{[ Ext.app.Localize.get("Undefined") ]}</tpl><tpl if="!Ext.isEmpty(oldvalue)">{oldvalue}</tpl></strike> =>' +
						'{newvalue}' + 
					'</li></tpl></ul>' +
				'</tpl>' +
				'<tpl if="!Ext.isArray(comments)">' +
					'<b style="color: #0B2C78;">{[ Ext.app.Localize.get("Manager")]} "{authorname}" {[ Ext.app.Localize.get("made comment") ]}:</b>' + 
					'<div id="comment-{values.recordid}" style="padding-left: 10px;">{comments}</div>' +
				'</tpl>' +
				'</td></tr></tpl></table></div>',
			html: DATA_OK ? '' : '<table width="100%" height="100"><tr><td valign="middle" align="center">' + Ext.app.Localize.get('No data') + '</td></tr></table>',
			listeners: {
				afterrender: function() {
					if(this.getBox().height > 400) {
						this.container.first().dom.firstChild.style.height = 400 + 'px';
					}
				}
			}
		}, {
			xtype: 'form',
			frame: true,
			url: 'config.php',
			hidden: true,
			buttonAlign: 'center',
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 110
			}, {
				xtype: 'hidden',
				name: 'recordid',
				value: 0
			}, {
				xtype: 'hidden',
				name: 'appid',
				value: app
			}, {
				xtype: 'htmleditor',
				name: 'comments',
				autoWidth: true,
				height: 200,
				hideLabel: true,
				enableColors: false,
				enableAlignments: false
			}],
			buttons: [{
				text: Ext.app.Localize.get('Save'),
				handler: function(A, B) {
					var form = this.ownerCt.ownerCt;
					form.getForm().submit({
						method: 'POST',
						scope: form.ownerCt.items.first(),
						waitTitle: Ext.app.Localize.get('Connecting'), 
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						params: {
							saveappcomm: Ext.isPrimitive(A) ? A : 1,
							delappcomm: Ext.isPrimitive(A) ? B : 0
						},
						success: function(form, action) {
							var data = eval(action.response.responseText);
							if(data['data'] && !Ext.isEmpty(data['data'])) {
								this.update(data['data']);
								if(this.getBox().height > 400) {
									this.container.first().dom.firstChild.style.height = 400 + 'px';
								}
							}
						},
						failure: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
						}
					});
				}
			}, {
				text: Ext.app.Localize.get('Cancel'),
				handler: function() {
					var form = this.ownerCt.ownerCt;
					form.find('name', 'recordid')[0].setValue(0);
					form.find('name', 'comments')[0].setValue('');
					this.ownerCt.ownerCt.hide();
					form.ownerCt.updateBox(form.ownerCt.getBox());
				}
			}]
		}]
	}).show();
} // end Comments()


/**
 * This function creates extened filter for global usage
 * @param	Object, to link this created
 */
function ExtendedFilter(caller)
{
	if(!Ext.isDefined(caller)) {
		return false;
	}
	
	if(Ext.getCmp('ExtFilter')) {
		return Ext.getCmp('ExtFilter');
	}
	
	return (new Ext.Window({
		title: Ext.app.Localize.get('Filter'),
		id: 'ExtFilter',
		closable: false,
		minimizable: true,
		resizable: false,
		collapsible: true,
		monitorResize: true,
		width: 600,
		autoHeight: true,
		saveParams: function() {
			this.panel.store.baseParams.statuses = '';
			Ext.iterate(this.items.first().form.getValues(), function(key, value) {
				if(key.substr(0, 9) == 'statuses_') {
					var st_id = key.split('_'),
						st = [];
					if (!Ext.isEmpty(this.baseParams.statuses)) {
						st = this.baseParams.statuses.split(',');
					}
					st.push(st_id[1]);
					this.setBaseParam('statuses', st.join(','));
				}
				else if (key.substr(0, 3) != 'ext') {
					this.setBaseParam(key, value);
				}
			}, this.panel.store);
		},
		restoreParams: function() {
			//this.items.first().getForm().setValues(this.panel.store.baseParams);
			this.items.first().form.setValues(this.panel.store.baseParams);
			if(this.panel.store.baseParams.statuses != -1 && !Ext.isEmpty(this.panel.store.baseParams.statuses)) {
				if(Ext.isNumber(this.panel.store.baseParams.statuses)) {
					this.panel.store.baseParams.statuses = new String(this.panel.store.baseParams.statuses);
				}
				var st = this.panel.store.baseParams.statuses.split(','),
					st_list = {};
				Ext.each(st, function(item){
					this['statuses_' + item] = item;
				}, st_list);
				this.items.first().form.setValues(st_list);
			}
		},
		listeners: {
			beforerender: function(panel) {
				Ext.Ajax.request({
					url: 'config.php',
					method: 'POST',
					params: {
						async_call: 1,
						devision: 110,
						getstatuses: 1
					},
					scope: panel,
					callback: function(options, success, response) {
						if(Ext.isDefined(response['responseText'])) {
							var data = Ext.util.JSON.decode(response.responseText);
							var form = this.items.first();
							var el = {
								xtype: 'checkboxgroup',
								fieldLabel: Ext.app.Localize.get('Statuses'),
								id: 'status_list',
								columns: 3,
								listeners: {
									change: function(group, boxes) {
										var params = [];
										Ext.each(boxes, function(item){
											this.push(item.value)
										}, params);
										this.ownerCt.panel.store.setBaseParam('statuses', params.join(','));
									}.createDelegate(form)
								},
								items: []
							};
							
							Ext.each(data.results, function(item){
								if(item.group == 1) {
									this.items.push({
										boxLabel: '<span style="color:#' + item.color + ';">' + Ext.util.Format.ellipsis(item.descr, 15) + '</span>', 
										name: 'statuses_' + item.id,
										checked: item.displaydefault ? true : false,
										value: item.id,
										qtip: item.descr
									})
								}
							}, el);
							
							if (el.items.length > 0) {
								form.insert(1, el);
								form.doLayout();
							}
							form.ownerCt.updateBox(form.ownerCt.getBox());
						}
					}
				})
			},
			minimize: function(win){
				this.toggle(false, true);
				win.hide();
			}.createDelegate(caller),
			hide: function() {
				this.saveParams();
			},
			show: function(win) {
				this.restoreParams();
			}
		},
		items: {
			xtype: 'form',
			frame: true,
			autoHeight: true,
			labelWidth: 130,
			items: [{
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('End'),
				msgTarget: 'under',
				items: [{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Since')
				}, {
					xtype: 'datefield',
					format: 'Y-m-d',
					name: 'dtfrom'
				}, {
					xtype: 'displayfield',
					value: '&nbsp;' + Ext.app.Localize.get('Till')					
				}, {
					xtype: 'datefield',
					format: 'Y-m-d',
					name: 'dtto'
				}]
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Responsible'),
				id: 'men_flt_composite',
				items: [{
					xtype: 'textfield',
					name: 'responsible',
					width: 255,
					value: ''
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Managers'),
					flex: 1,
					handler: function() {
						showManagers({
							callbackok: function(grid) {
								var md = grid.getSelectionModel()
								if (md.getCount() > 0) {
									var un = this.findById('men_flt_composite').items.first();
									un.setValue(md.getSelected().get('name'));
									un.setReadOnly(true);
								}
							}.createDelegate(Ext.getCmp('ExtFilter').findByType('form')[0])
						})
					}
				}]
			}]
		}
	}));
} // end ExtendedFilter()


/**
 * Get managers list. The result of this function is Window with grid. 
 * Returns grid object
 * @param	object: 
 * 			callbackok: fuction to call on pressed OK button, this pass
 * 			callbackcl: function to call on CANCEL button, this pass
 */
function showManagers( A )
{
	if(!Ext.isEmpty(Ext.getCmp('menListWin'))){ 
		return 
	}
	if(Ext.isEmpty(A)) { 
		A = { sm: true, callbackok: false, callbackcl: false } 
	}
	
	var Store = new Ext.data.Store({ 
		proxy: new Ext.data.HttpProxy({ 
			url: 'config.php', 
			method: 'POST'
		}), 
		reader: new Ext.data.JsonReader({ 
			root: 'results', 
			totalProperty: 'total' 
		}, [
			{ name: 'personid', type: 'int' }, 
			{ name: 'name', type: 'string' }, 
			{ name: 'login', type: 'string' },
			{ name: 'descr', type: 'string' }
		]),
		autoLoad: true, 
		baseParams: { 
			async_call: 1, 
			devision: 110, 
			getmanagers: 1
		}, 
		sortInfo: { 
			field: 'name', 
			direction: "ASC" 
		}
	});
	
	var sm = new Ext.grid.CheckboxSelectionModel({ 
		singleSelect: true 
	});
	
	var Btn = new Array();
	if(!Ext.isEmpty(A.callbackok)){ 
		Btn.push({ 
			xtype: 'button', 
			text: Ext.app.Localize.get('Add'), 
			handler: function(button){ 
				var parent = button.findParentByType('window'); 
				if(typeof A.callbackok == 'function') { 
					A.callbackok(parent.findByType('grid')[0]); 
				} 
				parent.close(); 
			}
		}) 
	};
	
	Btn.push({ 
		xtype: 'button', 
		text: Ext.app.Localize.get('Cancel'), 
		handler: function(button){ 
			parent = button.findParentByType('window'); 
			if(typeof A.callbackcl == 'function') { 
				A.callbackcl(parent.findByType('grid')[0]); 
			}; 
			parent.close(); 
		}
	});
	
	new Ext.Window({ 
		title: Ext.app.Localize.get('Managers'), 
		resizable: false,
		id: 'menListWin', 
		buttonAlign: 'center', 
		width: 550, 
		modal: true,
		items:[{ 
			xtype: 'grid', 
			id: '_Users', 
			height: 400, 
			store: Store, 
			cm: new Ext.grid.ColumnModel({
				columns: [sm, {
					header: Ext.app.Localize.get('Manager'),
					id: 'ext-userName',
					dataIndex: 'name'
				}, {
					header: Ext.app.Localize.get('Description'),
					dataIndex: 'descr',
					width: 200
				}]
			}), 
			loadMask: true, 
			autoExpandColumn: 'ext-userName', 
			sm: sm
		}], 
		buttons: Btn 
	}).show();
} // end showManagers()


/**
 * Timesheet widget
 * @param	object, who calles this function, default undefined
 */
function TimeSheet(caller)
{
	new Ext.Window({
		title: Ext.app.Localize.get('Timesheet'),
		id: 'timesheet',
		resizable: false,
		width: 965,
		tbar: [{
			xtype: 'tbtext',
			text: Ext.app.Localize.get('Period') + ': '
		}, {
			xtype: 'combo',
			id: 'time-year',
			width: 75,
			displayField: 'name',
			valueField: 'name',
			typeAhead: true,
			mode: 'local',
			value: new Date().format('Y'),
			triggerAction: 'all',
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [],
				fields: [ 'name' ]
			}),
			listeners: {
				beforerender: function() {
					for(var i = new Date().format('Y') - 3, off = new Date().format('Y') + 3; i <= off; i++) {
						this.store.add(new this.store.recordType({
							name: i
						}))
					}
				}
			}
		}, {
			xtype: 'tbspacer'
		}, {
			xtype: 'combo',
			id: 'time-month',
			width: 85,
			displayField: 'name',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [],
				fields: [ 'id', 'name' ]
			}),
			listeners: {
				beforerender: function() {
					for(var i = 0, off = 12; i < off; i++) {
						this.store.add(new this.store.recordType({
							id: (i < 10) ? '0' + (i+1) : (i+1),
							name: Ext.app.Localize.get(new Date(new Date().setMonth(i)).format('F'))
						}))
					}
				},
				afterrender: function() {
					var d = new Date().format('n');
					this.setValue(((d < 10) ? '0' + d : d))
				}
			}
		}, {
			xtype: 'tbspacer'
		}, {
			xtype: 'combo',
			id: 'time-apptypeid',
			tpl: '<tpl for="."><div class="x-combo-list-item" style="color:#{values.color}">{[values.id < 1 ? "" : values.id + "."]} {[Ext.util.Format.ellipsis(values.descr, 32)]}</div></tpl>',
			displayField: 'descr',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			width: 190,
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [
					{ name: 'id', type: 'int' },
					{ name: 'descr', type: 'string' },
					{ name: 'color', type: 'string' }
				]),
				autoLoad: true,
				baseParams: {
					async_call: 1,
					devision: 111,
					getappltypes: 1
				},
				listeners: {
					load: function(store) {
						store.insert(0, new store.recordType({
							id: -1,
							descr: Ext.app.Localize.get('All'),
							color: '000000'
						}))
					}
				}
			})
		}, {
			xtype: 'tbspacer',
			width: 5
		}, {
			xtype: 'tbtext',
			text: Ext.app.Localize.get('Responsible') + ': '
		}, {
			xtype: 'textfield',
			id: 'time-responsible',
			width: 150
		}, {
			xtype: 'tbspacer',
			width: 5
		}, {
			xtype: 'button',
			iconCls: 'ext-search',
			text: Ext.app.Localize.get('Show'),
			handler: function() {
				this.ownerCt.ownerCt.tip.hide();
				Ext.Ajax.request({
					url: 'config.php',
					method: 'POST',
					nocache: true,
					scope: this.ownerCt.ownerCt,
					params: {
						async_call: 1,
						devision: 110,
						getworkcalendar: this.ownerCt.findById('time-year').getValue() + '' + this.ownerCt.findById('time-month').getValue(),
						apptypeid: this.ownerCt.findById('time-apptypeid').getValue(),
						responsible: this.ownerCt.findById('time-responsible').getValue()
					},
					success: function(result) {
						var data = eval(result.responseText);
						this.store = data.results;
						
						var items = [{
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Mon') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Tue') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Wed') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Thu') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Fri') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;color:red">' + Ext.app.Localize.get('Sat') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;color:red">' + Ext.app.Localize.get('Sun') + '<\div>'
						}];
						
						Ext.each(data.results, function(item, key){
							item.item = Date.parseDate(item.item, 'YmdHis');
							this.items.push({
								xtype: 'container',
								tpl: new Ext.XTemplate(
									'<div id="c-idx-', key, '" class="app-calendar-cell {[values.tasks.length > 0 ? \'app-calendar-cell-work\' : \'\']}">',
										'<table width="100%">',
											'<tr><td {[ !this.isMonthNow(values.item) ? "style=\'color:#c0c0c0;\'" : "" ]}>{[ values.item.format("d") ]}. {[ Ext.app.Localize.get(values.item.format("F")) ]}</td>', 
												'<td width="18%">',
													'<tpl if="this.isCaller() && (this.getRestriction(values.item) &lt;= 0 || this.getRestriction(values.item) &gt; values.tasks.length)"><button type="button" ext:qtip="{[ Ext.app.Localize.get(\'Send in the calendar\') ]}" onclick="Ext.getCmp(\'timesheet\').setCalendar(\'{[ values.item ]}\')"><img src="images/ext-add.gif"></button></tpl>',
													'<tpl if="!this.isCaller()">&nbsp;</tpl>',
												'</td></tr>',
											'<tpl if="this.isAppType()">',
												'<tr><td colspan="2" class="app-calendar-cell-restr" {[ (this.getRestriction(values.item) > 0 && this.getRestriction(values.item) <= values.tasks.length) ? "style=\'color:red;\'" : "" ]}>{[ Ext.app.Localize.get("Restriction") ]}: {[ this.getRestriction(values.item) ]}</td><tr>',
											'</tpl>',
											'<tpl if="values.tasks.length &gt; 0">',
												'<tr><td colspan="2">{[ Ext.app.Localize.get("Scheduled task") ]}: {[ values.tasks.length ]}</td></tr>', 
											'</tpl>',
										'</table>',
									'</div>',
									{
										isnow: this.now,
										caller: this.caller,
										isCaller: function() {
											return Ext.isObject(this['caller']);
										},
										isMonthNow: function(v) {
											try {
												if(v.format('n') == this.isnow.format('n')) {
													return true;
												}
											}
											catch(e) { }
											return false;
										},
										getRestriction: this.getRestriction,
										isAppType: this.isAppType
									}
								),
								data: item
							})
						}, {
							items: items,
							caller: caller,
							now: Date.parseDate(data.workcalendar + '01', 'Ymd'),
							isAppType: function() {
								try {
									if (!Ext.isDefined(this['apptypeid'])) {
										if (!Ext.isObject(this['caller'])) {
											this.apptypeid = 0;
										}
										if (this.caller.getXType() == 'form') {
											this.apptypeid = this.caller.find('name', 'apptypeid')[0].getValue()
											if(Ext.isEmpty(this.apptypeid)) {
												this.apptypeid = 0;
											}
										}
									}
									return this.apptypeid;
								}
								catch(e) {
									return 0;
								}
							}.createDelegate({
								caller: caller
							}),
							getRestriction: function(d) {
								try {
									if (!Ext.isDefined(this['apptypeid'])) {
										if (!Ext.isObject(this['caller'])) {
											this.apptypeid = 0;
										}
										if (this.caller.getXType() == 'form') {
											this.apptypeid = this.caller.find('name', 'apptypeid')[0].getValue();
											if(Ext.isEmpty(this.apptypeid)) {
												this.apptypeid = 0;
											}
										}
									}
									else if(this.apptypeid == 0) {
										return -1;
									}
									if(this.items[this.apptypeid] && !Ext.isPrimitive(d)) {
										if( Ext.isDefined(this.items[this.apptypeid][(d.format('N') -1)]) ) {
											return this.items[this.apptypeid][(d.format('N') - 1)];
										}
										else {
											return -1;
										}
									}
									else {
										return -1;
									}
								}
								catch(e) {
									return -1;
								}
							}.createDelegate({
								caller: caller,
								items: data.typeRestrict
							})
						});
						
						this.removeAll();
						this.add(items);
						this.doLayout();
						this.updateBox(this.getBox());
					}
				})
			}
		}],
		layout:'table',
		defaults: {
			bodyStyle:'text-align:center;border:solid 1px #f3f3f3;background-color:#f9f9f9;"'
		},
		layoutConfig: {
			columns: 7
		},
		items: [{
			colspan: 7,
			width: "960",
			html: '<table width="100%" height="120"><tr><td align="center" valign="middle">' + Ext.app.Localize.get('No data') + '</td></tr></table>'
		}],
		listeners: {
			render: function(win) {
				this.tip = new Ext.ToolTip({
					target: this.body,
					delegate: '.app-calendar-cell-work',
					autoHide: false,
					closable: true,
					renderTo: document.body,
					autoScroll: true,
					maxWidth: 500,
					tpl: new Ext.XTemplate(
						'<table>',
						'<tr style="font-weight:bold;">',
							'<td width="50">{[ Ext.app.Localize.get("Time") ]}</td>',
							'<td width="140">{[ Ext.app.Localize.get("Responsible") ]}</td>',
							'<td width="160">{[ Ext.app.Localize.get("Task") ]}</td>',
							'<td width="170">{[ Ext.app.Localize.get("Address") ]}</td>', 
						'</tr>',
						'<tpl for=".">',
							'<tr>',
								'<td>{[ this.getTime(values.executefinal) ]}</td>',
								'<td>{responsible}</td>',
								'<td>{task}</td>',
								'<td>{address}</td>', 
							'</tr>',
						'</tpl>',
						'</table>',
						{
							getTime: function(v) {
								return Date.parseDate(v, 'Y-m-d H:i:s').format('H:s');
							}
						}
					), 
					listeners: {
						beforeshow: function updateTipBody(tip) {
							var idx_pref = 'c-idx-';
							var idx = tip.triggerElement.id.substr(idx_pref.length);
							tip.tpl.overwrite(tip.body, this.store[idx].tasks);
						}.createDelegate(win)
					}
				})
			},
			close: function() {
				this.tip.destroy();
			}
		},
		setCalendar: function(data) {
			if(!Ext.isObject(caller)) {
				return false;
			}
			
			data = new Date(data);
			
			if(caller.getXType() == 'form') {
				caller.form.setValues({
					executefinal: data.format('Y-m-d'),
					executefinal_hh: data.format('H'),
					executefinal_mm: data.format('i')
				});
			}
			
			this.close()
		}
	}).show();
} // end TimeSheet()


/**
 * Show print menu 
 * @param	object, Ext panel object
 */
function PrintMenu( panel )
{
	new Ext.Window({
		title: Ext.app.Localize.get('Print'),
		id: 'printmenu',
		modal: true,
		resizable: false,
		width: 420,
		items: [{
			xtype: 'form',
			frame: true,
			url: 'config.php',
			labelWidth: 150,
			monitorValid: true,
			buttonAlign: 'center',
			items: [{
				xtype: 'hidden',
				name: 'devision',
				value: 110
			}, {
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'combo',
				fieldLabel: Ext.app.Localize.get('Documents templates'),
				tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{name}">{docid}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
				width: 230,
				height: 80,
				name: 'getdocument',
				hiddenName: 'getdocument',
				displayField: 'name',
				valueField: 'docid',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				allowBlank: false,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results'
					}, [
						{ name: 'docid', type: 'int' },
						{ name: 'name', type: 'string' }
					]),
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 110,
						gettempldocs: 1
					}
				})
			}, {
				xtype: 'radiogroup',
				id: 'printway-group',
				hideLabel: true,
				items: [{
					boxLabel: Ext.app.Localize.get('All') + ' ' + Ext.app.Localize.get('checked'), 
					name: 'printway',
					value: 1
				}, {
					boxLabel: Ext.app.Localize.get('Page'), 
					name: 'printway',
					value: 2,
					checked: true
				}, {
					boxLabel: Ext.app.Localize.get('All') + ' ' + Ext.app.Localize.get('pages'),
					name: 'printway',
					value: 3
				}]
			}],
			buttons: [{
				text: Ext.app.Localize.get('Save'),
				formBind: true,
				handler: function() {
					if(panel.getStore().getCount() == 0) {
						return;
					}
					
					var params = {}
					
					switch(this.ownerCt.ownerCt.findById('printway-group').getValue().value) {
						case 1:
							var rows = panel.getSelectionModel().getSelections();
							Ext.each(rows, function(item, index){
								this['records[' + index + ']'] = item.get('recordid');
							}, params);
						break;
						
						case 2:
							Ext.iterate(panel.getStore().baseParams, function(key, item){
								switch(key) {
									case 'getapplications':
									case 'async_call':
									case 'devision':
										return;
									
									default: this[key] = item;
								}
							}, params);
						break;
						
						case 3:
							Ext.iterate(panel.getStore().baseParams, function(key, item){
								switch(key) {
									case 'getapplications':
									case 'async_call':
									case 'devision':
										return;
									
									default: this[key] = item;
								}
							}, params);
							
							params['limit'] = 0;
							params['start'] = 0;  
						break;
					}
					
					this.ownerCt.ownerCt.getForm().submit({
						method: 'POST',
						waitTitle: Ext.app.Localize.get('Connecting'), 
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						params: params,
						success: function(form, action) {
							var data = eval(action.response.responseText);
							if(data['file'] && !Ext.isEmpty(data['file'])) {
								Download({
									devision: 110,
									file: data['file'],
									name: data['name'],
									ext: data['ext']
								}, true);
							}
							else {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Can not get access file on server'));
							}
						},
						failure: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
						}
					});
				}
			}, {
				text: Ext.app.Localize.get('Cancel'),
				handler: function() {
					this.ownerCt.ownerCt.ownerCt.close();
				}
			}]
		}]
	}).show();
} // end PrintMenu()


/**
 * Show calendar border to set exceptions for the application
 * limits on day
 * @param		object, panel
 */
function limitsExceptions( caller )
{
		// Class to create my trigger field
	// Global
	Ext.ns('Ext.ux.form');
	// Class constructor
	Ext.ux.form.TwinExcept = Ext.extend(Ext.form.TwinTriggerField, {
		initComponent : function(){
			Ext.ux.form.TwinExcept.superclass.initComponent.call(this);
		},
		
		linkField: null,
		trigger1Class: 'x-form-clear-trigger',
		trigger2Class: 'x-form-edit-trigger',
		hideTrigger1: false,
		hideTrigger2: false,
		showEdit: false,
		width: 180,
		
		handler: function() {
			
		},
		
		restoreView: function(field) {
			field.ownerCt.hide();
			
			Ext.iterate(field.childs, function(key, item){
				if(Ext.isObject(item)) {
					switch(key) {
						case 'wrap': item.setVisibilityMode(Ext.Element.DISPLAY).setVisible(this.value < 0 ? false : true); break;
						case 'formCell': item.setVisibilityMode(Ext.Element.DISPLAY).setVisible(false); break;
					}
				}
			}, field);
			
			field.ownerCt.destroy();
		},
		
		// Cancel this field for the input
		onTrigger1Click : function(){
			this.restoreView(this);
		},
		
		// This function fire when field value is set
		onTrigger2Click : function(edit) {
			this.ownerCt.getForm().submit({
				method: 'POST',
				scope: this,
				success: function(form, action) {
					var B = Ext.getCmp('exceptions').getTopToolbar().findById('exc-show');
					B.handler(B);
					this.restoreView(this);
				},
				failure: function(form, action) {
					var O = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
					this.restoreView(this);
				}
			})
		}
	});
	
	new Ext.Window({
		title: Ext.app.Localize.get('Timesheet exceptions'),
		id: 'exceptions',
		resizable: false,
		width: Ext.isIE ? 925 : 965,
		tbar: [{
			xtype: 'tbtext',
			text: Ext.app.Localize.get('Period') + ': '
		}, {
			xtype: 'combo',
			id: 'exc-year',
			width: 75,
			displayField: 'name',
			valueField: 'name',
			typeAhead: true,
			mode: 'local',
			value: new Date().format('Y'),
			triggerAction: 'all',
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [],
				fields: [ 'name' ]
			}),
			listeners: {
				beforerender: function() {
					for(var i = new Date().format('Y') - 3, off = new Date().format('Y') + 3; i <= off; i++) {
						this.store.add(new this.store.recordType({
							name: i
						}))
					}
				}
			}
		}, {
			xtype: 'tbspacer'
		}, {
			xtype: 'combo',
			id: 'exc-month',
			width: 85,
			displayField: 'name',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [],
				fields: [ 'id', 'name' ]
			}),
			listeners: {
				beforerender: function() {
					for(var i = 0, off = 12; i < off; i++) {
						this.store.add(new this.store.recordType({
							id: (i < 10) ? '0' + (i+1) : (i+1),
							name: Ext.app.Localize.get(new Date(new Date().setMonth(i)).format('F'))
						}))
					}
				},
				afterrender: function() {
					var d = new Date().format('n');
					this.setValue(((d < 10) ? '0' + d : d))
				}
			}
		}, {
			xtype: 'tbspacer'
		}, {
			xtype: 'combo',
			id: 'exc-apptypeid',
			tpl: '<tpl for="."><div class="x-combo-list-item" style="color:#{values.color}">{[values.id < 1 ? "" : values.id + "."]} {[Ext.util.Format.ellipsis(values.descr, 32)]}</div></tpl>',
			displayField: 'descr',
			valueField: 'id',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			width: 190,
			listeners: {
				beforerender: function(combo) {
					try {
						var C = this.getTopToolbar().findById('appsearch');
						C.getStore().each(function(record){
							if (record.get('id') > 0) {
								this.add(record);
							}
						}, combo.getStore());
						if(C.getValue() > 0) {
							combo.setValue(C.getValue())
						}
						else {
							if (combo.getStore().getCount() > 0) {
								combo.setValue(combo.getStore().getAt(0).get('id'));
							}
						}
					}
					catch(e) {
						combo.store.load({
							params: {
								async_call: 1,
								devision: 111,
								getappltypes: 1
							}
						})
					}
				}.createDelegate(caller || {})
			},
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [
					{ name: 'id', type: 'int' },
					{ name: 'descr', type: 'string' },
					{ name: 'color', type: 'string' }
				]),
				listeners: {
					load: function(store) {
						try {
							var C = this.getTopToolbar().findById('appsearch');
							if(C.getValue() > 0) {
								Ext.getCmp('exc-apptypeid').setValue(C.getValue());
								return;
							}
						}
						catch(e) { }
						if (store.getCount() > 0) {
							Ext.getCmp('exc-apptypeid').setValue(store.getAt(0).get('id'));
						}
					}.createDelegate(caller || {})
				}
			})
		}, {
			xtype: 'tbspacer',
			width: 5
		}, {
			xtype: 'button',
			iconCls: 'ext-search',
			id: 'exc-show',
			text: Ext.app.Localize.get('Show'),
			handler: function(B) {
				Ext.Ajax.request({
					url: 'config.php',
					method: 'POST',
					nocache: true,
					scope: B.ownerCt.ownerCt,
					params: {
						async_call: 1,
						devision: 110,
						getexccalendar: B.ownerCt.findById('exc-year').getValue() + '' + B.ownerCt.findById('exc-month').getValue(),
						apptypeid: B.ownerCt.findById('exc-apptypeid').getValue()
					},
					success: function(result) {
						var data = eval(result.responseText);
						this.store = data.results;
						
						var items = [{
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Mon') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Tue') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Wed') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Thu') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;">' + Ext.app.Localize.get('Fri') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;color:red">' + Ext.app.Localize.get('Sat') + '<\div>'
						}, {
							html: '<div style="font-weight:bold;padding:5px;color:red">' + Ext.app.Localize.get('Sun') + '<\div>'
						}];
						
						Ext.each(data.results, function(item, key){
							item.item = Date.parseDate(item.item, 'YmdHis');
							this.items.push({
								xtype: 'container',
								tpl: new Ext.XTemplate(
									'<div id="c-idx-', key, '" class="app-calendar-cell {[values.limits.length > 0 ? \'app-calendar-cell-work\' : \'\']}">',
										'<table width="100%">',
											'<tr><td {[ !this.isMonthNow(values.item) ? "style=\'color:#c0c0c0;\'" : "" ]}>{[ values.item.format("d") ]}. {[ Ext.app.Localize.get(values.item.format("F")) ]}</td>', 
												'<td width="18%">',
													'<tpl if="this.isCaller()"><button type="button" ext:qtip="{[ Ext.app.Localize.get(\'Edit\') + \' \' + Ext.app.Localize.get(\'Exception\') ]}" onclick="Ext.getCmp(\'exceptions\').setException(\{ \'item\': \'{[ values.item ]}\', \'\appid\': \'{[ values.appid ]}\', \'except\': \'{[ values.limits.except ]}\' })"><img src="images/edit16.gif"></button></tpl>',
													'<tpl if="!this.isCaller()">&nbsp;</tpl>',
												'</td>',
											'</tr>',
											'<tpl if="this.isAppType()">',
												'<tr><td colspan="2" class="app-calendar-cell-restr">{[ Ext.app.Localize.get("Default") ]}: {[ (values.limits.defaultValue > 0) ? values.limits.defaultValue : Ext.app.Localize.get("Unlimited") ]}</td><tr>',
											'</tpl>',
											'<tr id="exc-wrap-{[ values.item.format(\'Ymd\') ]}" style="color:#782E11;display: {[ (values.limits.except > -1) ? \'\' : \'none\' ]}"><td colspan="2" class="app-calendar-cell-restr">{[ Ext.app.Localize.get("Exception") ]}: {[ (values.limits.except > -1) ? values.limits.except : Ext.app.Localize.get(\'Unlimited\') ]}</td><tr>',
											'<tr id="exc-tr-{[ values.item.format(\'Ymd\') ]}" style="display:none"><td colspan="2" id="exc-td-{[ values.item.format(\'Ymd\') ]}"></td><tr>',
										'</table>',
									'</div>',
									{
										isnow: this.now,
										caller: this.caller,
										isCaller: function() {
											return Ext.isObject(this['caller']);
										},
										isMonthNow: function(v) {
											try {
												if(v.format('n') == this.isnow.format('n')) {
													return true;
												}
											}
											catch(e) { }
											return false;
										},
										getRestriction: this.getRestriction,
										isAppType: this.isAppType
									}
								),
								data: item
							});
						}, {
							items: items,
							caller: caller,
							now: Date.parseDate(data.workcalendar + '01', 'Ymd'),
							isAppType: function() {
								try {
									if (!Ext.isDefined(this['apptypeid'])) {
										if (!Ext.isObject(this['caller'])) {
											this.apptypeid = 0;
										}
										if (this.caller.getXType() == 'window') {
											this.apptypeid = this.caller.getTopToolbar().findById('exc-apptypeid').getValue();
											if(Ext.isEmpty(this.apptypeid)) {
												this.apptypeid = 0;
											}
										}
									}
									return this.apptypeid;
								}
								catch(e) {
									return 0;
								}
							}.createDelegate({
								caller: this
							})
						});
						
						this.removeAll();
						this.add(items);
						this.doLayout();
						this.updateBox(this.getBox());
					}
				})
			}
		}],
		layout:'table',
		defaults: {
			bodyStyle:'text-align:center;border:solid 1px #f3f3f3;background-color:#f9f9f9;"'
		},
		layoutConfig: {
			columns: 7
		},
		items: [{
			colspan: 7,
			width: "960",
			html: '<table width="100%" height="120"><tr><td align="center" valign="middle">' + Ext.app.Localize.get('No data') + '</td></tr></table>'
		}],
		listeners: {
			show: function(w) {
				// Filter ready
				var filter = {
					ready: false,
					button: null
				};
				w.getTopToolbar().items.each(function(item){
					switch(item.getId()) {
						case 'exc-year':
						case 'exc-month':
						case 'exc-apptypeid':
							if(item.getValue() > 0) {
								this.ready = true;
							}
							else {
								this.ready = false;
							}
						break;
						
						case 'exc-show':
							this.button = item;
						break;
					}
				}, filter);
				if(filter.ready && filter.button){
					filter.button.handler(filter.button);
				}
			}
		},
		setException: function(data) {
			data.item = new Date(data.item);
			Ext.get('exc-wrap-' + data.item.format('Ymd')).setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
			Ext.get('exc-tr-' + data.item.format('Ymd')).setVisibilityMode(Ext.Element.DISPLAY).setVisible(true);
			
			var form = new Ext.form.FormPanel({
				renderTo: Ext.get('exc-td-' + data.item.format('Ymd')),
				url: 'config.php',
				border: false,
				hideLabels: true,
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 110
				}, {
					xtype: 'hidden',
					name: 'appid',
					value: data.appid
				}, {
					xtype: 'hidden',
					name: 'saveexcept',
					value: data.item.format('Y-m-d')
				}, new Ext.ux.form.TwinExcept({
					fieldLabel: 1,
					width: Ext.isIE ? 118 : 124,
					name: 'restriction',
					childs: {
						wrap: Ext.get('exc-wrap-' + data.item.format('Ymd')),
						formCell: Ext.get('exc-tr-' + data.item.format('Ymd'))
					},
					value: data.except,
					listeners: {
						afterrender: function(el) {
							if(el.getValue() < 0) {
								el.setRawValue('');
							}
						}
					}
				})]
			})
		}
	}).show();
} // end limitsExceptions()

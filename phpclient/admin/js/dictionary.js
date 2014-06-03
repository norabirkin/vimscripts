/**
 * JS Engine to modify dictionary for the selected NAS server
 *
 * Repository information:
 * $Date: 2009-11-24 12:06:43 $
 * $Revision: 1.1.2.6 $
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load Panel to control NAS dictionaries
	showDictionaryPanel('_dictPanel');
});


/**
 * Show Panel
 * @param	string, render this to DOM id
 */
function showDictionaryPanel( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0; }

	renderType = function(value) { switch(value){ case 0: return 'int'; case 1: return 'string'; case 2: return 'avpair'; case 3: return 'ipaddr'; case 5: return 'url'; case 6: return 'octet'; case 7: return 'sublist'; }}
	rmIconStatus = function(record, row, col, object) { if(record.get('nasid') > 0) { return 'ext-drop' } else { return 'ext-drop-dis' } }
	var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'recordid', width: 22, iconCls: rmIconStatus });
	var Edit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Edit, width: 22, dataIndex: 'recordid', iconCls: 'ext-edit' })
	new Ext.Panel({
		id: 'extDictPanel',
		frame: false,
		bodyStyle:'padding:0px',
		border: false,
		layout: 'column',
		height: 700,
		width: 960,
		renderTo: renderTo,
		listeners: {
			afterrender: function(){
				this.find('id', 'attribGrid')[0].setHeight(this.getHeight())
			}
		},
		items:[{
			columnWidth: 0.24,
			layout: 'fit',
			title: Localize.NAS,
			items: {
				xtype: 'treepanel',
				id: 'nasList',
				autoScroll: true,
				animate: true,
				border: false,
				width: 214,
				height: 690,
				containerScroll: true,
				selModel: new Ext.tree.DefaultSelectionModel(),
				rootVisible: false,
				root: new Ext.tree.AsyncTreeNode({ iconCls: 'ext-server' }),
				loader: new Ext.tree.TreeLoader({
					requestMethod: 'POST',
					url: 'config.php',
					baseParams: { async_call: 1, devision: 69, getnases: moduleId }, listeners: { load: selectLeaf }
				}),
				listeners: { click: selectLeaf }
			}
		}, {
			columnWidth: 0.76,
			title: Localize.RADATTR,
			xtype: 'grid',
			id: 'attribGrid',
			frame: false,
			border: true,
			width: 'auto',
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [{
					name: 'recordid',
					type: 'int'
				}, {
					name: 'nasid',
					type: 'int'
				}, {
					name: 'name',
					type: 'string'
				}, {
					name: 'radiustype',
					type: 'int'
				}, {
					name: 'vendor',
					type: 'int'
				}, {
					name: 'valuetype',
					type: 'int'
				}, {
					name: 'replaceid',
					type: 'int'
				}, {
					name: 'tagged',
					type: 'int'
				}, {
					name: 'tohistory',
					type: 'int'
				}]),
				baseParams: {
					async_call: 1,
					devision: 69,
					getattributes: 0
				},
				sortInfo: {
					field: 'radiustype',
					direction: "ASC"
				}
			}),
			cm: new Ext.grid.ColumnModel([ Edit, { header: Localize.Name, id: 'radname', dataIndex: 'name', sortable: true }, { header: Localize.Number + ' / VSA', id: 'radtype', dataIndex: 'radiustype', width: 100, sortable: true }, { header: Localize.Vendor, dataIndex: 'vendor', width: 80, sortable: true }, { header: Localize.Type, dataIndex: 'valuetype', width: 80, sortable: true, renderer: renderType }, Remove]),
			loadMask: true,
			plugins: [ Edit, Remove ],
			autoExpandColumn: 'radname',
			tbar: [{ xtype: 'button', iconCls: 'ext-add', text: Localize.AddNewRecord, handler: function(){ showAttrForm(Ext.getCmp('attribGrid')); } }]
		}]
	});

	Edit.on('action', showAttrForm );
	Remove.on('action', function(grid, record, rowIndex, e) { if(record.data.nasid == 0) { return }; var form = new Ext.FormPanel({ id: 'delAttr', renderTo: Ext.getBody(), url: 'config.php', items:[{ xtype: 'hidden', name: 'async_call', value: 1 }, { xtype: 'hidden', name: 'devision', value: 69 }, { xtype: 'hidden', name: 'delete', value: record.data.recordid }] }); form.getForm().submit({ method: 'POST', waitTitle: Localize.Connecting, waitMsg: Localize.SendingData + '...', success: function(form, action) { Ext.getCmp('attribGrid').store.reload(); form.destroy(); }, failure: function(form, action){ if(action.failureType == 'server') { obj = Ext.util.JSON.decode(action.response.responseText); Ext.Msg.alert(Localize.Error + '!', obj.errors.reason); form.destroy(); }; }}) })
} // end showDictionaryPanel()


/**
 * Show window to modify RADIUS attribute
 * @param	object, grid
 * @pram	object, selected record
 * @param	integer, selected row index
 * @param	object, event target
 */
function showAttrForm( grid, record, rowIndex, e )
{
	if (!Ext.isEmpty(Ext.getCmp('radiusAttr'))) {
		return
	}
	if (Ext.isEmpty(record)) {
		var record = new grid.store.recordType({
			recordid: 0,
			name: 'Attribute',
			nasid: 0,
			radiustype: 0,
			vendor: 0,
			valuetype: 0,
			replaceid: 0
		});
	}
	sendData = function(button) {
		var form = button.findParentByType('form');
		form.getForm().submit({
			method: 'POST',
			waitTitle: Localize.Connecting,
			waitMsg: Localize.SendingData + '...',
			success: function(form, action) {
				Ext.getCmp('attribGrid').store.reload();
				button.findParentByType('window').close();
			},
			failure: function(form, action) {
				if (action.failureType == 'server') {
					obj = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
				};
				Win.close();
			}
		});
	}
	var Win = new Ext.Window({
		title: ((record.data.nasid > 0) ? Localize.Edit : Localize.Create) + ': ' + record.data.name,
		constrain: true,
		id: 'radiusAttr',
		width: 320,
		items: [{
			xtype: 'form',
			url: 'config.php',
			monitorValid: true,
			frame: true,
			width: 306,
			buttonAlign: 'center',
			labelWidth: 120,
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 69
			}, {
				xtype: 'hidden',
				name: 'saverecord',
				value: (record.data.nasid == 0) ? 0 : record.data.recordid
			}, {
				xtype: 'hidden',
				name: 'nasid',
				value: grid.store.baseParams.getattributes
			}, {
				xtype: 'textfield',
				fieldLabel: Localize.Name,
				maskRe: new RegExp('[a-zA-Z0-9\-\_\#\:]+'),
				name: 'name',
				width: 160,
				allowBlank: false,
				value: record.data.name
			}, {
				xtype: 'numberfield',
				id: '_radiustype',
				name: 'radiustype',
				maxValue: 65535,
				minValue: 0,
				fieldLabel: Localize.Number,
				width: 160,
				allowBlank: false,
				value: record.data.radiustype
			}, {
				xtype: 'textfield',
				id: '_vendor',
				name: 'vendor',
				fieldLabel: Localize.Vendor,
				width: 160,
				value: record.data.vendor
			}, {
				xtype: 'combo',
				hiddenName: 'valuetype',
				fieldLabel: Localize.Type,
				width: 160,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: record.data.valuetype,
				editable: false,
				store: new Ext.data.SimpleStore({
					data: [
						['0', 'int'],
						['1', 'string'],
						['2', 'avpair'],
						['3', 'ipaddr'],
						['5', 'url'],
						['6', 'octet'],
						['7', 'sublist']
					],
					fields: ['id', 'name']
				})
			}, {
				xtype: 'combo',
				hiddenName: 'replaceid',
				fieldLabel: Localize.ReplaceAttribute,
				id: 'ReplaceAttr',
				width: 160,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
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
					baseParams: {
						async_call: 1,
						devision: 69,
						getattributes: 0
					},
					sortInfo: {
						field: 'name',
						direction: "ASC"
					},
					listeners: {
						load: function(store) {
							store.each(function(record) {
								record.data.name = Ext.util.Format.ellipsis(record.data.name, 33);
							});
							store.insert(0, new store.recordType({
								id: 0,
								name: Localize.Undefined
							}));
							Ext.getCmp('ReplaceAttr').setValue(record.data.replaceid);
						}
					}
				})
			},
			{
				xtype: 'checkbox',
				id: 'tagged',
				name: 'tagged',
				fieldLabel: Ext.app.Localize.get('Tagged attribute'),
				checked: (record.data.tagged) ? true : false
			},
			{
				xtype: 'checkbox',
				id: 'tohistory',
				name: 'tohistory',
				fieldLabel: Ext.app.Localize.get('Save in to the history'),
				checked: (record.data.tohistory) ? true : false
			}

			],
			buttons: [{
				xtype: 'button',
				text: Localize.Save,
				formBind: true,
				handler: sendData
			}, {
				xtype: 'button',
				text: Localize.Cancel,
				handler: function(B) {
					B.findParentByType('window').close();
				}
			}]
		}]
	}).show();
} // end showAttrForm()


/**
 * Select leaf. if there is no passed arguments than frist valid child group
 * @param	object, child node to select
 */
function selectLeaf( child )
{
	try {
		var child = child;
		if(Ext.isEmpty(child.attributes)) { Ext.getCmp('nasList').root.eachChild(function(node){ if(node.attributes.id >= 0) { child = node; node.select(); return false; } }) };
		if(Ext.isEmpty(child)) { return false }
		grid = Ext.getCmp('attribGrid');
		grid.store.baseParams.getattributes = child.attributes.id;
		grid.store.reload();
	}
	catch(e){ Ext.Msg.alert(Localize.Error + '!', Localize.UndfGatewayServers); }
} // end selectLeaf()

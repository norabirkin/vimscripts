/**
 * JS Engine to view events log
 *
 * Repository information:
 * @date		$Date: 2014-01-14 10:30:48 +0400 (Вт., 14 янв. 2014) $
 * @revision	$Revision: 40965 $
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load List object
	showLogPanel('LogsList');
});


/**
 * Show log table panel
 * @param	string, DOM element id to render to
 */
function showLogPanel( renderTo )
{
	var PAGELIMIT = 100;

	var obj   =  document.getElementById( '_uid_' );
	var uid   =  ( obj ) ? obj.value : 0;
		obj   =  document.getElementById( '_user_' );
	var user  =  ( obj ) ? obj.value : "";


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
			{ name: 'record_id', type: 'int' },
			{ name: 'dt', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'isclnt', type: 'int' },
			{ name: 'evt_descr', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'login', type: 'string' },
			{ name: 'name', type: 'string' },
			{ name: 'object', type: 'string' },
			{ name: 'more', type: 'string' }
		]),
		baseParams:{
			async_call: 1,
			devision: 19,
			getlogs: 0,
			code: 0,
			type: 0,
			personid: 0,
			dtfrom: new Date().add(Date.MONTH, -1).format('Y-m-01'),
			dtto: new Date().add(Date.MONTH, 1).format('Y-m-01'),
			start: 0,
			limit: PAGELIMIT,
			userid: 0,
			operid: 0
		},
		remoteSort: true,
		sortInfo: {
			field: 'dt',
			direction: "ASC"
		}
	});

	var MoreButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		tplModel: true,
		qtip: Ext.app.Localize.get('Details'),
		width: 22,
		dataIndex: 'more',
		menuDisabled: true,
		iconCls: function(record){
			var s = record.get('more');
			if(s.length > 0) {
				return 'ext-info';
			}
			else {
				return 'ext-info-dis';
			}
		}
	});


	new Ext.grid.GridPanel({
		renderTo: renderTo,
		title: Ext.app.Localize.get('Events log'),
		height: 800,
		width: 960,
		tbar: new Ext.Toolbar({
			layout: 'form',
			height: 48,
			items: [{
				xtype: 'container',
				width: 975,
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [{
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '4px',
						textAlign: 'left'
					},
					html: Ext.app.Localize.get('Since') + ':'
				}, {
					xtype: 'datefield',
					id: 'dtfrom',
					format: 'Y-m-d',
					value: new Date().add(Date.MONTH, -1).format('Y-m-01')
				}, {
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Till') + ':'
				}, {
					xtype: 'datefield',
					id: 'dtto',
					format: 'Y-m-d',
					value: new Date().add(Date.MONTH, 1).format('Y-m-01')
				}, {
					xtype: 'container',
					width: 'auto',
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Initiator') + ':'
				}, {
					xtype: 'combo',
					id: 'typecombo',
					width: 90,
					displayField: 'name',
					valueField: 'type',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: ( ( uid ) ? 3 : 0 ),
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('All')],
							['1', Ext.app.Localize.get('Managers')],
							['2', Ext.app.Localize.get('Clients')],
							['3', Ext.app.Localize.get('Client')]
						],
						fields: ['type', 'name'],
						listeners: {
							load: function(store){
								var combo = Ext.getCmp('typecombo');
								store.each(function(record)
								{

									if( uid ) {	if(record.data.type != 3 ) { store.remove(this,record,record.data.type); } }
									else
									{
										if(record.data.type == 3 ) { store.remove(this,record,3); }
									}

								}, combo);
							}
						}
					})
				}, {
					xtype: 'tbspacer',
					width: 2
				}, {
					xtype: 'combo',
					id: 'mancombo',
					width: 210,
					displayField: 'name',
					valueField: 'personid',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
	                tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name}">{[values.personid >=0 ? values.personid + ". " : ""]}{[Ext.util.Format.ellipsis(values.name, 27)]}</div></tpl>',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader(
							{ root: 'results' }, [
							{ name: 'personid', type: 'int' },
							{ name: 'name', type: 'string' },
							{ name: 'selected', type: 'int' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 19,
							getmen: 0
						},
						listeners: {

							load: function(store){
								var row = Ext.data.Record.create([{
									name: 'name',
									type: 'string'
								}, {
									name: 'id',
									type: 'int'
								}]);


								if( uid )
								{
									store.removeAll(); store.insert(uid, new row({ name: user, personid: uid }));

									var combo = Ext.getCmp('mancombo');
									store.each(function(record)
									{
										this.setValue(record.data.personid);
									}, combo);
								} 
								else
								{
									store.insert(0, new row({ name: Ext.app.Localize.get('All'), personid: -1	}));

									var combo = Ext.getCmp('mancombo');
									store.each(function(record)
									{
										if(record.data.selected == 1 ) {
											this.setValue(record.data.personid);
										}
									}, combo);

									if(!combo.getValue() && combo.getValue() != 0) {
										combo.setValue(-1);
									}
								}
							}
						}
					})
				}, {
					xtype: 'container',
					width: 64,
					style: {
						paddingRight: '5px',
						paddingLeft: '8px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Events') + ':'
				}, {
					xtype: 'combo',
					id: 'codecombo',
					width: 200,
					displayField: 'name',
					valueField: 'code',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: '2,3,4,5',
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('All')],
							['2,3,4,5', Ext.app.Localize.get('Hide messages about viewing')],
							['2', Ext.app.Localize.get('Authorizations')],
							['3,4', Ext.app.Localize.get('Create') + ' / ' + Ext.app.Localize.get('Edit')],
							['5', Ext.app.Localize.get('Remove')]
						],
						fields: ['code', 'name']
					})
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Show'),
					handler: function() {
						this.ownerCt.getGrid().store.baseParams.dtfrom    =  Ext.getCmp( 'dtfrom'    ).getValue().format('Y-m-d');
						this.ownerCt.getGrid().store.baseParams.dtto      =  Ext.getCmp( 'dtto'      ).getValue().format('Y-m-d');
						this.ownerCt.getGrid().store.baseParams.code      =  Ext.getCmp( 'codecombo' ).getValue();
						this.ownerCt.getGrid().store.baseParams.type      =  Ext.getCmp( 'typecombo' ).getValue();
						this.ownerCt.getGrid().store.baseParams.personid  =  Ext.getCmp( 'mancombo'  ).getValue();
						this.ownerCt.getGrid().store.baseParams.operid    =  Ext.getCmp( 'operlist'  ).getValue();

						this.ownerCt.getGrid().store.reload({
							params: {
								start: 0
							}
						})
					}
				}]
			},
			{
				xtype: 'container',
				width: 975,
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [ {
						xtype: 'container',
						width: 64,
						style: {
							paddingRight: '0px',
							paddingLeft: '0px',
							textAlign: 'left'
						},
						html: Ext.app.Localize.get('Operators') + ':'
					}, {
					xtype: 'combo',
					width: 200,
					fieldLabel: Ext.app.Localize.get( "Operators" ),
					pid: 'operid',
					displayField: 'name',
					valueField: 'id',
					id: 'operlist',
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
					baseParams: {
						async_call: 1,
						devision: 105,
						getoperators: 1
					},
					sortInfo: {
						field: 'id',
						direction: 'ASC'
					},
					autoLoad: true,
					listeners: {
						load: function(store){
						store.each(function(record){
							record.data.name = Ext.util.Format.ellipsis(record.data.name, 26);
						});

						if( !uid ) { store.removeAll(); }

						store.insert(0, new store.recordType({ id: 0, name: Ext.app.Localize.get( "All" )}));
						Ext.getCmp('operlist').setValue(0);
						}
					}
					}),
					editable: false,
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all'
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Filter'),
					handler: function() {
						this.ownerCt.getGrid().store.baseParams.dtfrom    =  Ext.getCmp( 'dtfrom'    ).getValue().format('Y-m-d');
						this.ownerCt.getGrid().store.baseParams.dtto      =  Ext.getCmp( 'dtto'      ).getValue().format('Y-m-d');
						this.ownerCt.getGrid().store.baseParams.code      =  Ext.getCmp( 'codecombo' ).getValue();
						this.ownerCt.getGrid().store.baseParams.type      =  Ext.getCmp( 'typecombo' ).getValue();
						this.ownerCt.getGrid().store.baseParams.personid  =  Ext.getCmp( 'mancombo'  ).getValue();
						this.ownerCt.getGrid().store.baseParams.operid    =  Ext.getCmp( 'operlist'  ).getValue();

						this.ownerCt.getGrid().store.reload({
							params: {
								start: 0
							}
						})
					}
				}]
			}]

		}),
		store: Store,
		cm: new Ext.grid.ColumnModel({
			columns: [{
				header: Ext.app.Localize.get('Date'),
				dataIndex: 'dt',
				width: 110,
				renderer: function(value, metaData, record) {
					try {
						return value.format('d.m.Y H:i');
					}
					catch(e) {
						return value;
					}
				}
			}, {
				header: Ext.app.Localize.get('Event initiator'),
				dataIndex: 'isclnt',
				width: 130,
				renderer: function(value, metaData, record) {
					if(value == 0) {
						return Ext.app.Localize.get('Manager');
					}
					else {
						return Ext.app.Localize.get('Client');
					}
				}
			}, {
				header: Ext.app.Localize.get('Initiator name'),
				dataIndex: 'name',
				width: 130
			}, {
				header: Ext.app.Localize.get('Events'),
				id: 'descr_col',
				dataIndex: 'evt_descr',
				renderer: function(value, metaData, record) {
					if(record.get('descr')) {
						return value + ' (' + record.get('descr') + ')'
					}
					return value
				}
			}, MoreButton],
			defaults: {
				sortable: true,
				menuDisabled: false
			}
		}),
		plugins: MoreButton,
		loadMask: true,
		autoExpandColumn: 'descr_col',
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
	});

	MoreButton.on('action', function(grid, record, rowIndex){
		if(record.get('more').length <= 0) {
			return;
		}
		new Ext.Window({
			modal: true,
			constrain: true,
			autoScroll: true,
			width: 650,
			height: 330,
			loadMask: true,
			resizable: true,
			//autoHeight: true,
			title: Ext.app.Localize.get('Details'),
			tpl: new Ext.XTemplate(
				'<table width="100%" class="table_comm">',
				'<tr><td width="25%" class="td_head">' + Ext.app.Localize.get('Table') + '</td>',
				'<td width="25%" class="td_head">' + Ext.app.Localize.get('Field') + '</td>',
				'<td width="25%" class="td_head">' + Ext.app.Localize.get('New value') + '</td>',
				'<td width="25%" class="td_head">' + Ext.app.Localize.get('Previous value') + '</td></tr>',
				'<tpl for="results">',
				'<tr><td class="td_comm">{table}</td>',
				'<td class="td_comm">{field}</td>',
				'<td class="td_comm">{new}</td>',
				'<td class="td_comm">{old}</td></tr>',
				'</tpl>',
				'</table>'
			),
			listeners: {
				render: function(W) {
					Ext.Ajax.request({
						url: 'config.php',
						method: 'POST',
						params: {
							async_call: 1,
							devision: 19,
							getlogdetail: this.get('record_id')
						},
						scope: W,
						callback: function(options, success, response) {
							if(success == true) {
								try {
									this.update(Ext.util.JSON.decode(response.responseText));
									this.updateBox(this.getBox());
								}
								catch(e) {
									return false;
								}
							}
						}
					})
				}.createDelegate(record)
			},
			html: '<div align="center" width="100%" style="height: 30px;margin-top: 20px;">&nbsp;' + Ext.app.Localize.get('Please wait.. Loading...') + '&nbsp;</div>'
		}).show();
	});
} // end showLogPanel()

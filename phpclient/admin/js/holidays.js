/**
 * Widget to manage holidays during the month
 *
 * @date		$Date: 2013-05-31 16:56:04 +0400 (Пт., 31 мая 2013) $
 * @revision	$Revision: 34248 $
 */


function holidayMonthPanel() {
	if(Ext.getCmp('HolWidget')) {
		return;
	}

	Ext.QuickTips.init();

	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST',
			timeout: 380000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'item', type: 'date', dateFormat: 'YmdHis' },
			{ name: 'day', type: 'string' },
			{ name: 'flag', type: 'int' }
		]),
		autoLoad: true,
		baseParams: {
			async_call: 1,
			devision: 4,
			getholidays: new Date().format('Ym')
		},
		listeners: {
			load: function(store){
				var items = [];
				this.each(function(record) {
					var St = '<span style="';
					if(record.data.item.format('n') == this.now.format('n')) {
						St += 'font-weight: bold;';
						if(record.get('flag') == 1 || (record.get('flag') < 0 && record.get('item').format('N') > 5)) {
							St += 'color:red;';
						}
					}
					else {
						if(record.get('flag') == 1 || (record.get('flag') < 0 && record.get('item').format('N') > 5)) {
							St += 'color:red;';
						}
						else {
							St += 'color:#a5a5a5;';
						}
					}
					St += '">';
					this.items.push({
						xtype: 'checkbox',
						boxLabel: St + record.data.item.format('d') + '</span>',
						name: 'saveholidays[' + record.data.item.format('Ymd') + ']',
						value: 1,
						checked: (record.get('flag') == 1 || (record.get('flag') < 0 && record.get('item').format('N') > 5)) ? true : false
					});
				}, {
					items: items,
					now: Date.parseDate(store.baseParams.getholidays, 'Ym')
				});

				var form = Ext.getCmp('HolForm');

				if(Ext.getCmp('HolChkGroup')) {
					form.remove(Ext.getCmp('HolChkGroup'));
				}

				form.add(new Ext.form.CheckboxGroup({
					xtype: 'checkboxgroup',
					columns: 7,
					id: 'HolChkGroup',
					items: items
				}));

				form.doLayout();
				form.findParentByType('window').syncSize();
			}
		}
	});

	new Ext.Window({
		title: Ext.app.Localize.get('Calendar holidays'),
		id: 'HolWidget',
		width: 380,
		tbar: [ Ext.app.Localize.get('Period') + ':&nbsp;', {
			xtype: 'combo',
			id: 'year',
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
					},
					select: function() {
						var D = Date.parseDate(Store.baseParams.getholidays, 'Ym');
						D.setYear(this.getValue());
						Store.baseParams.getholidays = D.format('Ym')
						Store.reload();
					}
				}
			}, {
				xtype: 'tbspacer'
			}, {
				xtype: 'combo',
				id: 'month',
				width: 75,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				value: new Date().format('n') - 1,
				triggerAction: 'all',
				editable: false,
				store: new Ext.data.SimpleStore({
					data: [],
					fields: [ 'name' ]
				}),
				listeners: {
					beforerender: function() {
						for(var i = 0, off = 12; i < off; i++) {
							this.store.add(new this.store.recordType({
								id: i,
								name: Ext.app.Localize.get(new Date(2000, i, 1).format('F'))
							}))
						}	
					},
					select: function() {
						var D = Date.parseDate(Store.baseParams.getholidays, 'Ym');
						var DD  = new Date(D.format('Y'), this.getValue(), 1);				
						Store.baseParams.getholidays = DD.format('Ym')
						Store.reload();
					}
				}
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			text: Ext.app.Localize.get('Save'),
			handler: function() {
				var params = {}

				Ext.each(Ext.getCmp('HolChkGroup').items.items, function(item){
					if(!item.getValue()) {
						this[item.name] = 0;
					}
				}, params);

				this.ownerCt.ownerCt.findById('HolForm').getForm().submit({
					method:'POST',
					waitTitle: Ext.app.Localize.get('Connecting'),
					waitMsg: Ext.app.Localize.get('Sending data') + '...',
					params: params,
					success: function(form, action) {
						var O = Ext.util.JSON.decode(action.response.responseText);
						Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason);
					},
					failure: function(form, action) {
						if (action.failureType == 'server') {
							var O = Ext.util.JSON.decode(action.response.responseText);
							if (!Ext.isArray(O.reason)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
							}
							else {
								try {
									var Store = new Ext.data.ArrayStore({
										autoDestroy: true,
										idIndex: 0,
										data: O.reason,
										fields: [{
											name: 'date',
											type: 'date',
											dateFormat: 'Ymd'
										}, {
											name: 'reason',
											type: 'string'
										}]
									});

									new Ext.Window({
										modal: true,
										width: 600,
										title: Ext.app.Localize.get('Error'),
										items: [{
											xtype: 'grid',
											store: Store,
											height: 200,
											autoExpandColumn: 'nonedelreason',
											cm: new Ext.grid.ColumnModel({
												columns: [{
													header: Ext.app.Localize.get('Description'),
													dataIndex: 'date',
													width: 200
												}, {
													header: Ext.app.Localize.get('Reason'),
													dataIndex: 'reason',
													id: 'nonedelreason'
												}],
												defaults: {
													sortable: true,
													menuDisabled: false
												}
											})
										}]
									}).show();
								}
								catch (e) { }
							}
						}
					}
				})
			}
		}],
		items: {
			xtype: 'form',
			id: 'HolForm',
			url: 'config.php',
			frame: true,
			hideLabels: true,
			autoHeight: true,
			items: [{
				xtype: 'hidden',
				name: 'devision',
				value: 4
			}, {
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'container',
				autoWidth: true,
				tpl: new Ext.XTemplate(
					'<table style="width: auto"><tr>',
						'<tpl for="."><td style="width: 48px; font-weight: bold;">{name}</td></tpl>',
					'</tr></table>'
				),
				data: [
					{ name: Ext.app.Localize.get('Mon') },
					{ name: Ext.app.Localize.get('Tue') },
					{ name: Ext.app.Localize.get('Wed') },
					{ name: Ext.app.Localize.get('Thu') },
					{ name: Ext.app.Localize.get('Fri') },
					{ name: Ext.app.Localize.get('Sat') },
					{ name: Ext.app.Localize.get('Sun') }
				]
			}]
		}
	}).show();
} // end holidayMonthPanel()

/**
 * Recalculation engine
 * 
 * @date		$Date: 2014-04-23 10:35:53 +0400 (Ср., 23 апр. 2014) $
 * @revision	$Revision: 42821 $
 */

Ext.onReady(function(){
	// Load Quick tips class to parse extra tags
	Ext.QuickTips.init();
	// Start rendering grid
	showRecalcForm('_RecalcForm');
});


/**
 * Form to activate recalculation process
 * @param	string, HTMLElement id to render to this form
 */
function showRecalcForm( renderTo )
{
	new Ext.Panel({
		renderTo: renderTo,
		id: 'RecalcPanel',
		title: Ext.app.Localize.get('Re-count'),
		frame: true,
		items: [{
			xtype: 'form',
			frame: true,
			url: 'config.php',
			monitorValid: true,
			labelWidth: 75,
			getRef: function() {
				var v = this.form.getValues();
				
				if (!this['refStore']) {
					this.refStore = {};
					
					this.items.each(function(item){
						if(item.getXType() != 'compositefield') {
							this.fn(item, this.form);
						}
						else {
							item.items.each(function(i){
								this.fn(i, this.form);
							}, this)
						}
					}, {
						form: this,
						fn: function(el, form){
							switch(el.getXType()) {
								case 'hidden':
								case 'combo':
								case 'textfield':
								case 'numberfield':
								case 'datefield':
								case 'checkbox':
									form.refStore[el.name || el.id] = el;
							}
						}
					});
				}
				return this.refStore;
			},
			listeners: {
				clientValidation: function(form, valid){
					form.recalc[valid ? "enable" : "disable"]();
				}
			},
			tbar: [{
				xtype: 'button',
				disabled: true,
				ref: '../recalc',
				icon: 'images/recalc.png',
				text: '&nbsp;' + Ext.app.Localize.get('Start'),
				handler: function() {
					var form = this.ownerCt.ownerCt;
					
					form.getForm().submit({
						method: 'POST',
						waitTitle: Ext.app.Localize.get('Connecting'), 
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						scope: form,
						params: {
							setrecalc: 1
						},
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							var m = this.getRef()['module'];
							// Clear current module value from the list
							m.store.remove(m.store.getAt(m.store.find('id', m.getValue())));
							m.setValue(null);
							m.setRawValue("");
							
							// Let us find grid and reload its
							this.ownerCt.findByType('grid')[0].getStore().reload();
							
						},
						failure: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
						}
					});
				}
			}],
			items: [{
				xtype: 'container',
				flex: 1,
				hidden: true,
				id: 'stat-alert',
				style: {
					textAlign: 'center',
					height: '22px',
					fontWeight: 'bold',
					color: 'red'
				},
				html: '<div>' + Ext.app.Localize.get('Rollback alert') + '</div>'
			}, {
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 67
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Module'),
				width: 840,
				items: [{
					xtype: 'combo',
					tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
					hiddenName: 'module',
					name: 'module',
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					width: 260,
					allowBlank: false,
					recIndex: null,
					getModuleType: function() {
						if(this.getValue() > 0) {
							var idx = null;
							if((idx = this.store.find('id',this.getValue())) > -1) {
								return this.store.getAt(idx).get('type');
							}
						}
						return null;
					},
					listeners: {
						select: function(combo, record, index) {
							combo.recIndex = index;
							var ref = Ext.getCmp('RecalcPanel').items.first().getRef();
							if(ref['stat'].getValue() == -1) {
								ref['stat'].setValue(1);
							}					
							ref['stat'].fireEvent('select');							
							ref['rent'].fireEvent('select');
							ref['rent'][combo.getModuleType() != 13 ? "enable" : "disable"]();
							if(combo.getModuleType() == 13) {
								Ext.getCmp('statownerchk').setValue(false);
								Ext.getCmp('statownerchk').disable();
								Ext.getCmp('stattarifchk').setValue(false);
								Ext.getCmp('stattarifchk').disable();
							}
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
							{ name: 'name', type: 'string' },
							{ name: 'type', type: 'int' },
							{ name: 'descr', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 67,
							getmodules: 0
						}
					})
				}, {
					xtype: 'displayfield',
					style: {
						paddingLeft: '9px'
					},
					value: Ext.app.Localize.get('Date') + ': '
				}, {
					xtype: 'datefield',
					format: 'd.m.Y',
					allowBlank: false,
					name: 'period',
					value: new Date().format('01.m.Y')
				}, {
					xtype: 'displayfield',
					style: {
						paddingLeft: '9px'
					},
					value: Ext.app.Localize.get('Union') + ': '
				}, {
					xtype: 'combo',
					tpl: '<tpl for="."><div class="x-combo-list-item">{[values.id > 0 ? values.id + "." : "" ]} {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
					displayField: 'name',
					hiddenName: 'union',
					name: 'union',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					flex: 1,
					allowBlank: false,
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'id', type: 'int' },
							{ name: 'name', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 67,
							getunions: 0
						},
						listeners: {
							load: function(){
								Ext.getCmp('RecalcPanel').items.first().getRef()['union'].setValue(-1);
							}
						}
					})
				}]
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Statistics'),
				items: [{
					xtype: 'combo',
					width: 120,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					name: 'stat',
					hiddenName: 'stat',
					value: 0,
					listeners: {
						beforeselect: function(combo, record) {
							if(record.get('id') == -1 && Ext.getCmp('RecalcPanel').items.first().getRef()['module'].getModuleType() == 13) {
								return false;
							}
						},
						select: function(combo, record, index) {
							var ref = Ext.getCmp('RecalcPanel').items.first().getRef();
							Ext.getCmp('stat-alert')[this.getValue() == -1 ? "show" : "hide"]();
							if(ref['module'].getModuleType() != 13) {
								if(this.getValue() == 1 && ref['module'].getModuleType() != 13) {
									ref['statowner'].enable();
									if(ref['module'].getModuleType() == 6) {
										ref['statowner'].setValue(true);
									}
								}
								else {
									ref['statowner'].setValue(false);
									ref['statowner'].disable();
								}
							}
						}
					},
					store: new Ext.data.ArrayStore({
						data: [
							[0, Ext.app.Localize.get('None')],
							[1, Ext.app.Localize.get('Re-count')],
							[-1, Ext.app.Localize.get('Rollback')]
						],
						fields: ['id', 'name']
					})
				}, {
					xtype: 'displayfield',
					style: {
						paddingLeft: '9px'
					},
					value: Ext.app.Localize.get('Save owner') + ': '
				}, {
					xtype: 'checkbox',
					name: 'statowner',
					id: 'statownerchk',
					disabled: true,
					inputValue: 1,
					handler: function(box, st) {
						var ref = Ext.getCmp('RecalcPanel').items.first().getRef();
						if( ref['module'].getModuleType() != 13) {
							if(st && ref['module'].getModuleType() != 13) {
								ref['stattarif'].enable();
							}
							else if(!st && ref['stat'].getValue() == 1 && ref['module'].getModuleType() == 6) {
								box.setValue(true);
							}
							else {
								ref['stattarif'].setValue(false);
								ref['stattarif'].disable();
							}
						}
					}
				}, {
					xtype: 'displayfield',
					style: {
						paddingLeft: '9px'
					},
					value: Ext.app.Localize.get('Save') + ' ' + Ext.app.Localize.get('tarif') + ': '
				}, {
					xtype: 'checkbox',
					name: 'stattarif',
					id: 'stattarifchk',
					inputValue: 1,
					disabled: true
				}]
			}, {
				xtype: 'compositefield',
				fieldLabel: Ext.app.Localize.get('Rent'),
				items: [{
					xtype: 'combo',
					width: 120,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					itemId: 'combo-rent',
					name: 'rent',
					hiddenName: 'rent',
					value: 0,
					listeners: {
						select: function(combo, record, index) {
							var ref = Ext.getCmp('RecalcPanel').items.first().getRef();
						}
					},
					store: new Ext.data.ArrayStore({
						data: [
							[0, Ext.app.Localize.get('None')],
							[1, Ext.app.Localize.get('Re-count')]
						],
						fields: ['id', 'name']
					})
				}]
			}]
		}, {
			xtype: 'grid',
			title: Ext.app.Localize.get('Executing') + '...',
			hidden: true,
			width: 950,
			maxHeight: 150,
			autoHeight: true,
			loadMask: true,
			autoExpandColumn: 'col-union',
			tbar: [{
				xtype: 'button',
				timeout: 0,
				timeoutId: null,
				text: Ext.app.Localize.get('Reload data'),
				handler: function(B) {
					if(B && !Ext.isEmpty(this.timeoutId)) {
						clearTimeout(this.timeoutId);
						this.timeoutId = null;
					}
					if(this.timeout > 0) {
						this.setText(this.textOriginal + ' (' +  this.timeout + ')')
						this.timeout--;
						
						if (!B && !this.timeoutId) {
							this.timeoutId = setTimeout(function(){
								this.timeoutId = null;
								this.handler()
							}.createDelegate(this), 1000);
						}
					}
					else {
						this.setText(this.textOriginal)
					}
					
					if(this.timeout == 0 || B) {
						this.ownerCt.ownerCt.getStore().reload();
					}
				},
				listeners: {
					beforerender: function() {
						this.textOriginal = this.getText()
					}
				}
			}],
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php', 
					method: 'POST', 
					timeout: 380000
				}),
				reader: new Ext.data.JsonReader({
					root: 'results', 
					totalProperty: 'total' 
				}, [
					{ name: 'id', type: 'int' },
					{ name: 'recalcdate', type: 'date', dateFormat: 'Y-m-d' },
					{ name: 'recalcgroup', type: 'int' },
					{ name: 'recalcstat', type: 'int' },
					{ name: 'recalcrent', type: 'int' },
					{ name: 'recalcpercent', type: 'int' },
					{ name: 'agentname', type: 'string' },
					{ name: 'groupname', type: 'string' }
				]),
				autoLoad: true,
				baseParams: {
					async_call: 1,
					devision: 67,
					getrecalc: 0
				},
				listeners: {
					load: function(store) {
						var cc = store.getCount();
						if(!store['lastCount']) {
							store.lastCount = cc;
						}
						if(store.lastCount != cc) {
							Ext.getCmp('RecalcPanel').items.first().getRef()['module'].getStore().load(); 
						}
						
						var g = Ext.getCmp('RecalcPanel').findByType('grid')[0];
						g[cc > 0 ? "show" : "hide"]();
						if(cc > 0) {
							g.getTopToolbar().items.first().timeout = 15;
							g.getTopToolbar().items.first().handler()
						}
						
						store.lastCount = cc;
					}
				}
			}),
			cm: new Ext.grid.ColumnModel({
				columns: [{
					header: 'ID',
					dataIndex: 'id',
					width: 50
				}, {
					header: Ext.app.Localize.get('Module'),
					dataIndex: 'agentname',
					width: 260
				}, {
					header: Ext.app.Localize.get('Date'),
					dataIndex: 'recalcdate',
					width: 120,
					renderer: function(value) {
						try {
							if(value.format('Y') > 1900) {
								return value.format('d.m.Y');
							}
						}
						catch(e){ }
						return value;
					}
				}, {
					header: Ext.app.Localize.get('Union'),
					dataIndex: 'recalcgroup',
					id: 'col-union',
					renderer: function(value, metaData, record) {
						if(value <= 0) {
							return '-';
						}
						return record.get('groupname');
					}
				}, {
					header: '%',
					dataIndex: 'recalcpercent',
					width: 145,
					renderer: function(value, metaData, record) {
						return (
							'<ul class="line">' +
							'<li><div class="progress-wrap" style="padding:0;margins:0;" title="' + (value * 1) + '%">' +
							'<div class="progress-value" style="background-color: #9DC293; width: ' + 
							(value * 1) + '%;"></div>' +  
							'</div></li>' +
							'</ul>'
						);
					}
				}]
			}),
			viewConfig: {
				enableRowBody: true,
				// Return CSS class to apply to rows depending upon data values
				getRowClass: function(record, index, rowBody) {
					rowBody.body = '';
					if(record.get('recalcstat') != 0) {
						rowBody.body = '<div style="color:#0E1796;"><span style="font-weight:bold;">' + Ext.app.Localize.get('Statistics') + ':</span> ';
						switch(record.get('recalcstat')) {
							case -1:
								rowBody.body += Ext.app.Localize.get('Removing statistics rollback balance');
							break;
							
							case 1:
								rowBody.body += Ext.app.Localize.get('Re-count reinitialze traffic owner');
							break;
							
							case 2:
								rowBody.body += Ext.app.Localize.get('Re-count, store traffic owner');
							break;
							
							case 3:
								rowBody.body += Ext.app.Localize.get('Re-count store traffic owner and tarif at charge moment');
							break;
						}
						rowBody.body += '</div>';
					}
					if(record.get('recalcrent') != 0) {
						rowBody.body += '<div style="color:#5E3409;"><span style="font-weight:bold;">' + Ext.app.Localize.get('Rent') + ':</span> ';
						switch(record.get('recalcrent')) {
							case -1:
								rowBody.body += Ext.app.Localize.get('Removing statistics rollback balance');
							break;
							
							case 1:
								rowBody.body += Ext.app.Localize.get('Re-count current tarif');
							break;
							
							case 2:
								rowBody.body += Ext.app.Localize.get('Re-count store tarif at charge moment');
							break;
						}
						rowBody.body += '</div>';
					}
				}
			}
		}]
	});
} // end showRecalcForm()

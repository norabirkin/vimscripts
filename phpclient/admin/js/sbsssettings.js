/**
 * View and control SBSS settings
 * 
 * Repository information:
 * @date		$Date: 2013-12-18 17:57:10 +0400 (Ср., 18 дек. 2013) $
 * @revision	$Revision: 40469 $
 */

Ext.onReady(function(){
	// Load Quick tips class to parse extra tags
	Ext.QuickTips.init();
	// Start rendering grid
	showSBSS_Settings('_SBSS_Settings');
	
	Ext.override(Ext.grid.CheckColumn, {
		getValue: function () {
		    return this.checked ? 1 : 0;
		}
	 });

});


/**
 * To render grid to main body table
 * @param	string, HTMLElement to render to
 */
function showSBSS_Settings(renderTo){
	if(!Ext.get(renderTo)) {
		return false;
	}
	
	var MenStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'id', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'login', type: 'string' },
			{ name: 'itsme', type: 'int' }
		]),
		autoLoad: true,
		baseParams: {
			async_call: 1,
			devision: 111,
			getmenlist: 1
		}
	});
	
	// Common success function
	var Success = function(form, action) {
		var O = Ext.util.JSON.decode(action.response.responseText);
		Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
			this.items.each(function(item){
				if(item.getXType() == 'editorgrid' || item.getXType() == 'grid') {
					item.store.reload();
				}
			})
		}.createDelegate({
			items: this.ownerCt.items
		}));
	};
	
	// Common failure function
	var Failure = function(form, action){
		var O = Ext.util.JSON.decode(action.response.responseText);
		if(!Ext.isArray(O.reason)) {
			Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
				this.items.each(function(item){
					if(item.getXType() == 'editorgrid' || item.getXType() == 'grid') {
						item.store.reload();
					}
				})
			}.createDelegate({
				items: this.ownerCt.items
			}));
		}
		else {
			try {
				var store = new Ext.data.ArrayStore({
					autoDestroy: true,
					idIndex: 0,
					data: O.reason,
					fields: [
						{ name: 'descr', type: 'string'	}, 
						{ name: 'reason', type: 'string' }
					]
				});
				
				new Ext.Window({
					modal: true,
					width: 600,
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
								if(item.getXType() == 'editorgrid' || item.getXType() == 'grid') {
									item.store.reload();
								}
							})
						}.createDelegate({
							items: this.ownerCt.items
						})
					}
				}).show();
			}
			catch(e) { 
				Ext.Msg.alert(Ext.app.Localize.get('Error'), 'Cannot compile error message: ' + e.toString());
			}
		}
	};
	
	var DelReqBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		width: 22,
		dataIndex: 'id',
		iconCls: 'ext-drop'
	});
	
	DelReqBtn.on('action', function(grid, record, idx){
		grid.stopEditing();
		if (record.get('id') == 0) {
			grid.store.remove(record);
		}
		else {
			record.set('archive', 1);
			record.commit();
			grid.store.filter('archive', new RegExp('^(?!1$)'));
		}
	});

	var DelATypeBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		width: 22,
		dataIndex: 'id',
		iconCls: 'ext-drop'
	});
	
	DelATypeBtn.on('action', function(grid, record, idx){
		grid.stopEditing();
		if (record.get('id') == 0) {
			grid.store.remove(record);
		}
		else {
			record.set('archive', 1);
			record.commit();
			grid.store.filter('archive', new RegExp('^(?!1$)'));
		}
	});
	
	// Set archive helpdesk status
	var DelHStatusBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		width: 22,
		dataIndex: 'id',
		iconCls: 'ext-drop'
	});
	
	DelHStatusBtn.on('action', function(grid, record, idx){
		grid.stopEditing();
		if (record.get('id') == 0) {
			grid.store.remove(record);
		}
		else {
			record.set('archive', 1);
			record.commit();
			grid.store.filter('archive', new RegExp('^(?!1$)'));
		}
	});
	
	var DelCategBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		width: 22,
		dataIndex: 'id',
		iconCls: function(record){
			if(record.get('unremovable') == 1 ) {
            	return 'ext-drop-dis';
            }
            if (record.get('isdefault') == 0) {
            	return 'ext-drop';
            }
            return 'ext-drop-dis';
        }
	});
	
	DelCategBtn.on('action', function(grid, record, idx){
		
		if (record.get('isdefault') == 1) {
			return;
		}
		
		grid.stopEditing();
		if (record.get('id') == 0) {
			grid.store.remove(record);
			return;
		}

		var processRequest = function() {
			Ext.Ajax.request({
				url: 'config.php',
				timeout: 380000,
				method: 'POST',
				params: {
					async_call: 1,
					devision: 111,
					delcategory: record.get('id')
				},
				scope: grid,
				callback: function(opt, success, resp) {
					try {
						var data = Ext.util.JSON.decode(resp.responseText);

						if(!data['success']) {
							throw(data);
						}

						this.getStore().reload();
					}
					catch(e) {
						Ext.Msg.show({
							title: Ext.app.Localize.get('Error'),
							msg: '<b>' + Ext.app.Localize.get('Error') + ':</b><br>' + e['error'] || e || Ext.app.Localize.get('Unknown error') + '<br>',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});
					}
				}
			});
		}
		
		Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to delete selected item'), function(Btn){
			if(Btn != 'yes') {
				return;
			}
			if (record.get('messages') > 0) {
				Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Category is not empty. Assigned messages also be deleted on delete category. Are you sure to continue'), function(Btn){
					if(Btn != 'yes') {
						return;
					}		
					processRequest();
				}, this);
			}
			else {
				processRequest();
			}
		}, this);
	
	});
	
	 var checkDefaulsColumn = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('Default'),
		width: 100, 
		dataIndex: 'isdefault',
		getValue: function() {
	        return this.checked ? 1 : 0;
	    }
	 });
	
	// Edit ACL for the application type
	var ALimitBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Restrictions'),
		width: 22,
		dataIndex: 'id',
		iconCls: 'ext-rules'
	});
	
	ALimitBtn.on('action', function(grid, record, idx){
		new Ext.Window({
			title: Ext.app.Localize.get('Restrictions'),
			modal: true,
			width: 160,
			resizable: false,
			items: {
				xtype: 'form',
				frame: true,
				labelWidth: 40,
				buttonAlign: 'center',
				listeners: {
					beforerender: function(form) {
						Ext.each(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], function(item, idx) {
							this.form.add({
								xtype: 'numberfield',
								id: 'wdays_' + idx,
								width: 80,
								value: Ext.isDefined(this.wdays[idx]) ? this.wdays[idx] : 0,
								fieldLabel: Ext.app.Localize.get(item)
							})
						}, {
							form: form,
							wdays: this.get('rules').split(',')
						});
					}.createDelegate(record)
				},
				buttons: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					handler: function(B) {
						var R = []
						Ext.iterate(B.ownerCt.ownerCt.getForm().getValues(), function(key, item){
							var A = key.split('_');
							if(A[0] && A[0] == 'wdays') {
								R[A[1]] = item;
							}
						}, R);
						this.set('rules', R.join(','));
						this.commit();
						B.ownerCt.ownerCt.ownerCt.close();
					}.createDelegate(record)
				}]
			}
		}).show();
	});
	
	// Set archive application status
	var DelAStatusBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		width: 22,
		dataIndex: 'id',
		iconCls: 'ext-drop'
	});
	
	DelAStatusBtn.on('action', function(grid, record, idx){
		grid.stopEditing();
		if (record.get('id') == 0) {
			grid.store.remove(record);
		}
		else {
			record.set('archive', 1);
			record.commit();
			grid.store.filter('archive', new RegExp('^(?!1$)'));
		}
	});

	var EditNoticeButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Edit notice'),
		width: 22,
		iconCls: 'ext-edit'
	});

    var NoticeOptionsStore = new Ext.data.ArrayStore({
        data: [
            [1, Ext.app.Localize.get('All')],
            [0, Ext.app.Localize.get('Disabled')],
            [2, Ext.app.Localize.get('New request')],
            [3, Ext.app.Localize.get('Answer status')]
        ],
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }]
    });

    var NoticeOptionsStoreCopy = new Ext.data.ArrayStore({
        data: [],
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }]
    });
    
    var NoticesStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            idProperty: 'idx'
        }, [{
            name: 'name',
            type: 'string'
        }, {
            name: 'id',
            type: 'string'
        }, {
            name: 'options',
            type: 'int'
        }, {
            name: 'theme',
            type: 'string'
        }, {
            name: 'body',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 111,
            getnotices: 0
        },
        autoLoad: true
    });

    var NoticeSave = function(record, callback) {
        if (!callback) {
            callback = function(){};
        }
        Ext.Ajax.request({
            url: 'config.php',
            method: "POST",
            params: Ext.apply({
                async_call: 1,
                devision: 111,
                setnotice: 0
            }, record.data),
            callback: function(){
                NoticesStore.load();
                callback();
            },
            scope: this
        });
    };

	EditNoticeButton.on('action', function() {
        var record = arguments[1],
            form = new Ext.form.FormPanel({
                frame: true,
                labelWidth: 100,
                buttonAlign: 'center',
                items: [{
                    xtype: 'textfield',
                    name: 'name',
                    width: '100%',
                    fieldLabel: Ext.app.Localize.get('Name')
                }, {
                    xtype: 'textarea',
                    width: '100%',
                    name: 'theme',
                    fieldLabel: Ext.app.Localize.get('Theme')
                }, {
                    xtype: 'textarea',
                    height: 300,
                    width: '100%',
                    name: 'body',
                    fieldLabel: Ext.app.Localize.get('Body')
                }],
                buttons: [{
                    xtype: 'button',
                    text: Ext.app.Localize.get('Save'),
                    handler: function() {
                        var values = form.getForm().getValues(),
                            i;
                        for (i in values) {
                            record.set(i, values[i]);
                        }
                        NoticeSave(record, function() {
                            win.close();
                        });
                    }
                }]
            }),
            win = new Ext.Window({
                title: Ext.app.Localize.get('Notice'),
                modal: true,
                width: 850,
                resizable: false,
                items: [form]
            });
        win.show();
        form.getForm().setValues(record.data);
	});
	
	new Ext.TabPanel({
		renderTo: renderTo,
		id: 'statpanel',
		activeTab: 0,
		plain: true,
		width: 850,
		deferredRender: true,
		autoHeight: true,
		listeners: {
			tabchange: function(panel, active) {
				if (active.items.first().getXType() == 'form') {
					active.items.first().getForm().load({
						url: 'config.php',
						method: 'POST',
						params: {
							async_call: 1,
							devision: 111,
							getsbssoptions: 1
						}
					});
				}
				
				if (active.items.first().getXType() == 'grid' || active.items.first().getXType() == 'editorgrid') {
					active.items.first().store.load();
				}
			}
		},
		items: [{
			// SBSS common configuration
			title: Ext.app.Localize.get('Common'),
			autoHeight: true,
			items: [{
				xtype: 'form',
				frame: true,
				labelWidth: 380,
				url: 'config.php',
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					iconCls: 'ext-save',
					handler: function() {
						var form = this.ownerCt.ownerCt,
							params = {};
						
						form.ownerCt.items.each(function(item){
							if(item.getXType() == 'editorgrid') {
								item.getStore().each(function(record){
									for (var i in record.data) {
										if(typeof i == 'undefined') {
											continue;
										}
										this.params['save' + this.name + '[' + this.line + '][' + i + ']'] = record.data[i];
									}
									this.line++;
								}, {
									params: this,
									name: item.getId(),
									line: 0
								});
								if(item.getStore().isFiltered()) {
									item.getStore().snapshot.each(function(record){
										if (record.get('archive') > 0) {
											for (var i in record.data) {
												if(typeof i == 'undefined') {
													continue;
												}
												this.params['save' + this.name + '[' + this.line + '][' + i + ']'] = record.data[i];
											}
											this.line++;
										}
									}, {
										params: this,
										name: item.getId(),
										line: 0
									});
								}
							}
						}, params);
						
						form.getForm().submit({
							method:'POST', 
							waitTitle: Ext.app.Localize.get('Connecting'), 
							waitMsg: Ext.app.Localize.get('Sending data') + '...',
							scope: form,
							params: params,
							success: Success,
							failure: Failure
						})
					}
				}],
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 111
				}, {
					xtype: 'hidden',
					name: 'savesbsscommon',
					value: 1
				}, {
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Path for storing the attached files to the user') + ' (CRM)',
					name: 'sbss_crm_files',
					width: 300
				}, {
					xtype: 'textfield',
					name: 'sbss_ticket_files',
					fieldLabel: Ext.app.Localize.get('Path for storing the attached files to tickets') ,
					width: 300
				}, {
					xtype: 'combo',
					fieldLabel: Ext.app.Localize.get('Responsible on request') + ' HelpDesk (' + Ext.app.Localize.get('Default') + ')',
					tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
					displayField: 'name',
					name: 'sbss_ticket_superviser',
					hiddenName: 'sbss_ticket_superviser',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					width: 300,
					store: MenStore
				}]
			}, {
				xtype: 'editorgrid',
				title: Ext.app.Localize.get('Query classes'),
				id: 'reqclasses',
				height: 250,
				frame: true,
				autoExpandColumn: 'expandcol1',
				clicksToEdit: 1,
				disableSelection: true,
				loadMask: true,
				tbar: [{
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
							id: 0,
							responsibleman: 0,
							color: 'ffffff'
						}));
					}
				}],
				cm: new Ext.grid.ColumnModel({
					columns: [{
						header: Ext.app.Localize.get('Name'),
						id: 'expandcol1',
						dataIndex: 'descr',
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Responsible person'),
						width: 300,
						dataIndex: 'responsibleman',
						renderer: function(value, metaData, record) {
							var mid = -1;
							if((mid = MenStore.find('id', value)) > -1) {
								return MenStore.getAt(mid).get('name')
							}
							return value;
						},
						editor: new Ext.form.ComboBox({
							tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							width: 300,
							store: MenStore
						})
					}, {
						header: Ext.app.Localize.get('Color'),
						width: 150,
						dataIndex: 'color',
						renderer: function(value, metaData) {
							metaData.style = 'color:#' + value + ';';
							return value;
						},
						editor: new Ext.form.TextField({})
					}, DelReqBtn]
				}),
				plugins: [DelReqBtn],
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
						{ name: 'responsibleman', type: 'string' },
						{ name: 'color', type: 'string' },
						{ name: 'archive', type: 'int' }
					]),
					listeners: {
						load: function(store) {
							store.filter('archive', new RegExp('^(?!1$)'));
						}
					},
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 111,
						getreqlist: 1
					}
				}),
				listeners: {
					cellclick: function(grid, rowIndex, columnIndex, e) {
						if(grid.getColumnModel().getDataIndex(columnIndex) != 'color') {
							return;
						}
						new Ext.menu.ColorMenu({
							listeners: {
								render: function(menu) {
									if (menu.items.first().colors.indexOf(this.record.get('color')) < 0) {
										menu.items.first().colors.push(this.record.get('color'));
									}
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								}),
								show: function(){
									this.grid.startEditing(this.rowIndex, this.columnIndex)
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex),
									rowIndex: rowIndex,
									columnIndex: columnIndex
								}),
								select: function(menu, color) {
									this.record.set('color', color);
									this.record.commit();
									this.grid.stopEditing();
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								})
							}
						}).show(e.target);
					}
				}
			}, {
				xtype: 'editorgrid',
				id: 'statuses',
				title: Ext.app.Localize.get('Statuses'),
				height: 300,
				frame: true,
				clicksToEdit: 1,
				disableSelection: true,
				loadMask: true,
				autoExpandColumn: 'exphname',
				tbar: [{
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						this.ownerCt.ownerCt.store.add(new this.ownerCt.ownerCt.store.recordType({
							id: 0,
							group: 0,
							type: 0,
							color: 'ffffff',
							descr: Ext.app.Localize.get('Name'),
							active: 1,
							displaydefault: 1,
							clientmodifyallow: 0,
							defaultnew: 0,
							defaultanswer: 0
						}));
					}
				}],
				plugins: [DelHStatusBtn],
				cm: new Ext.grid.ColumnModel({
					defaults: {
						menuDisabled: true
					},
					columns: [{
						header: Ext.app.Localize.get('Name'),
						dataIndex: 'descr',
						id: 'exphname',
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Type'),
						dataIndex: 'type',
						width: 130,
						renderer: function(value, metaData, record) {
							switch(value*1) {
								case 3: return Ext.app.Localize.get('For user');
								case 2: return Ext.app.Localize.get('For manager');
								default: return Ext.app.Localize.get('For all')
							}
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('For all')], 
									['2', Ext.app.Localize.get('For manager')], 
									['3', Ext.app.Localize.get('For user')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('Color'),
						width: 60,
						dataIndex: 'color',
						renderer: function(value, metaData) {
							metaData.style = metaData.style + 'color:#' + value + ';';
							return value;
						},
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Available'),
						dataIndex: 'active',
						width: 80,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('By default in the list').lineBreak(2),
						dataIndex: 'displaydefault',
						width: 105,
						tooltip: Ext.app.Localize.get('Tickets list includes records with this status by default'),
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('Allow to reply').lineBreak(1),
						dataIndex: 'clientmodifyallow',
						width: 90,
						tooltip: Ext.app.Localize.get('Allow client to reply on ticket with this status'),
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('New request').lineBreak(1),
						dataIndex: 'defaultnew',
						width: 70,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('Status Reply').lineBreak(1),
						dataIndex: 'defaultanswer',
						width: 70,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, DelHStatusBtn]
				}),
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results',
						idPropert: 'idx'
					}, [
						{ name: 'id', type: 'int' },
						{ name: 'group', type: 'int' },
						{ name: 'type', type: 'int' }, 
						{ name: 'color', type: 'string' },
						{ name: 'descr', type: 'string' },
						{ name: 'active', type: 'int' },
						{ name: 'displaydefault', type: 'int' },
						{ name: 'clientmodifyallow', type: 'int' },
						{ name: 'defaultnew', type: 'int' },
						{ name: 'defaultanswer', type: 'int' },
						{ name: 'archive', type: 'int' }
					]),
					baseParams: {
						async_call: 1,
						devision: 111,
						getstatuses: 0
					},
					sortInfo: { 
						field: 'group', 
						direction: "ASC" 
					},
					autoLoad: true
				}),
				listeners: {
					afteredit: function(e) {
						if(e.field == 'defaultnew' || e.field == 'defaultanswer') {
							e.grid.store.query(e.field, 1).each(function(item){
								if(item.get('group') == this.record.get('group') && this.record.id != item.id) {
									item.set(e.field, 0);
									item.commit();
								}
							}, {
								store: e.grid.store,
								record: e.record
							});
						}
					},
					cellclick: function(grid, rowIndex, columnIndex, e) {
						if(grid.getColumnModel().getDataIndex(columnIndex) != 'color') {
							return;
						}
						new Ext.menu.ColorMenu({
							listeners: {
								render: function(menu) {
									if (menu.items.first().colors.indexOf(this.record.get('color')) < 0) {
										menu.items.first().colors.push(this.record.get('color'));
									}
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								}),
								show: function(){
									this.grid.startEditing(this.rowIndex, this.columnIndex)
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex),
									rowIndex: rowIndex,
									columnIndex: columnIndex
								}),
								select: function(menu, color) {
									this.record.set('color', color);
									this.record.commit();
									this.grid.stopEditing();
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								})
							}
						}).show(e.target);
					}
				}
			}, {
				xtype: 'editorgrid',
                title: Ext.app.Localize.get('Notices'),
                autoExpandColumn: 'nameCol',
                height: 300,
                listeners: {
                    afteredit: function(params) {
                        NoticeSave(params.record);
                    },
                    beforeedit: function(params) {
                        var config = {
                                'requests.clientreply': [3],
                                'requests.managercopy': [2,3],
                                'requests.managerreply': [2],
                                'requests.responsibleman': [2,3]
                            };
                            exclude = config[params.record.get('id')];
                        NoticeOptionsStoreCopy.removeAll();
                        NoticeOptionsStore.each(function(record) {
                            var i,
                                inArray = false;
                            for (i = 0; i < exclude.length; i ++) {
                                if (record.get('id') == exclude[i]) {
                                    inArray = true;
                                    break;
                                }
                            }
                            if (!inArray) {
                                NoticeOptionsStoreCopy.add(new NoticeOptionsStoreCopy.recordType(record.data));
                            }
                        });
                    }
                },
                columns: [EditNoticeButton, {
                    header: Ext.app.Localize.get('Name'),
                    editor: {
                        xtype: 'textfield'
                    },
                    id: 'nameCol',
                    dataIndex: 'name'
                }, {
                    header: Ext.app.Localize.get('ID'),
                    width: 140,
                    dataIndex: 'id'
                }, {
                    header: Ext.app.Localize.get('Options'),
                    dataIndex: 'options',
                    editor: {
                        xtype: 'combo',
                        displayField: 'name',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        store: NoticeOptionsStoreCopy
                    },
                    renderer: function(value) {
                        var index = NoticeOptionsStore.findExact('id', value);
                        if (index == -1) {
                            return value;
                        }
                        return NoticeOptionsStore.getAt(index).get('name');
                    }
                }],
                plugins: [EditNoticeButton],
                store: NoticesStore
            }]
		}, {
			// Applications settings
			title: Ext.app.Localize.get('Applications'),
			id: 'applications',
			autoHeight: true,
			items: [{
				xtype: 'form',
				frame: true,
				labelWidth: 380,
				url: 'config.php',
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					iconCls: 'ext-save',
					handler: function() {
						var form = this.ownerCt.ownerCt,
							global = {
								params: {},
								name: null,
								line: 0
							};
						
						form.ownerCt.items.each(function(item){
							if(item.getXType() == 'editorgrid') {
								// This variable needs to keep global counting, global id, and params
								this.line = 0;
								this.name = item.getId();
								
								item.getStore().each(function(record){
									for (var i in record.data) {
										if(typeof i == 'undefined') {
											continue;
										}
										this.params['save' + this.name + '[' + this.line + '][' + i + ']'] = record.data[i];
									}
									this.line++;
								}, this);
								if(item.getStore().isFiltered()) {
									item.getStore().snapshot.each(function(record){
										if (record.get('archive') > 0) {
											for (var i in record.data) {
												if(typeof i == 'undefined') {
													continue;
												}
												this.params['save' + this.name + '[' + this.line + '][' + i + ']'] = record.data[i];
											}
											this.line++;
										}
									}, this);
								}
							}
						}, global);
						
						form.getForm().submit({
							method:'POST', 
							waitTitle: Ext.app.Localize.get('Connecting'), 
							waitMsg: Ext.app.Localize.get('Sending data') + '...',
							params: global.params,
							scope: form,
							success: Success,
							failure: Failure
						})
					}
				}],
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 111
				}, {
					xtype: 'hidden',
					name: 'savesbsscommon',
					value: 1
				}]
			}, {
				xtype: 'editorgrid',
				id: 'appltypes',
				title: Ext.app.Localize.get('Application types'),
				height: 250,
				frame: true,
				clicksToEdit: 1,
				disableSelection: true,
				loadMask: true,
				autoExpandColumn: 'expappl',
				plugins: [ALimitBtn, DelATypeBtn],
				tbar: [{
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
							id: 0,
							descr: Ext.app.Localize.get('Name'),
							color: 'ffffff',
							rules: '0,0,0,0,0,0,0',
							archive: 0
						}));
					}
				}],
				cm: new Ext.grid.ColumnModel({
					columns: [ALimitBtn, {
						header: Ext.app.Localize.get('Name'),
						id: 'expappl',
						dataIndex: 'descr',
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Restrictions'),
						dataIndex: 'rules',
						width: 360,
						renderer: function(value) {
							try {
								var str = [];
								Ext.each(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], function(item, idx){
									this.str.push(Ext.app.Localize.get(item) + ': ' + this.val[idx]);
								}, {
									val: value.split(','),
									str: str
								});
								return str.join(', ');
							}
							catch(e) {
								return value
							}
						}
					}, {
						header: Ext.app.Localize.get('Color'),
						widthh: 150,
						dataIndex: 'color',
						renderer: function(value, metaData) {
							metaData.style = 'color:#' + value + ';';
							return value;
						},
						editor: new Ext.form.TextField({})
					}, DelATypeBtn]
				}),
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
						{ name: 'color', type: 'string' },
						{ name: 'rules', type: 'string' },
						{ name: 'archive', type: 'int' }
					]),
					listeners: {
						load: function(store) {
							store.filter('archive', new RegExp('^(?!1$)'));
						}
					},
					autoLoad: true,
					baseParams: {
						async_call: 1,
						devision: 111,
						getappltypes: 1,
						skiparchive: 1
					}
				}),
				listeners: {
					cellclick: function(grid, rowIndex, columnIndex, e) {
						if(grid.getColumnModel().getDataIndex(columnIndex) != 'color') {
							return;
						}
						new Ext.menu.ColorMenu({
							listeners: {
								render: function(menu) {
									if (menu.items.first().colors.indexOf(this.record.get('color')) < 0) {
										menu.items.first().colors.push(this.record.get('color'));
									}
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								}),
								show: function(){
									this.grid.startEditing(this.rowIndex, this.columnIndex)
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex),
									rowIndex: rowIndex,
									columnIndex: columnIndex
								}),
								select: function(menu, color) {
									this.record.set('color', color);
									this.record.commit();
									this.grid.stopEditing();
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								})
							}
						}).show(e.target);
					}
				}
			}, {
				xtype: 'editorgrid',
				id: 'astatuses',
				title: Ext.app.Localize.get('Statuses'),
				height: 300,
				frame: true,
				clicksToEdit: 1,
				disableSelection: true,
				loadMask: true,
				autoExpandColumn: 'expaname',
				tbar: [{
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						this.ownerCt.ownerCt.store.add(new this.ownerCt.ownerCt.store.recordType({
							id: 0,
							group: 1,
							type: 2,
							color: '000000',
							descr: Ext.app.Localize.get('Name'),
							active: 1,
							displaydefault: 1,
							clientmodifyallow: 0,
							defaultnew: 0,
							defaultanswer: 0
						}));
					}
				}],
				plugins: [DelAStatusBtn],
				cm: new Ext.grid.ColumnModel({
					defaults: {
						menuDisabled: true
					},
					columns: [{
						header: Ext.app.Localize.get('Name'),
						dataIndex: 'descr',
						id: 'expaname',
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Color'),
						width: 80,
						dataIndex: 'color',
						renderer: function(value, metaData) {
							metaData.style = 'color:#' + value + ';';
							return value;
						},
						editor: new Ext.form.TextField({})
					}, {
						header: Ext.app.Localize.get('Available'),
						dataIndex: 'active',
						width: 90,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('By default in the list').lineBreak(2),
						dataIndex: 'displaydefault',
						width: 120,
						tooltip: Ext.app.Localize.get('Tickets list includes records with this status by default'),
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('New request').lineBreak(1),
						dataIndex: 'defaultnew',
						width: 80,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, {
						header: Ext.app.Localize.get('Status Done').lineBreak(1),
						dataIndex: 'defaultanswer',
						width: 100,
						renderer: function(value, metaData, record){
							if(value == 1) {
								return Ext.app.Localize.get('Yes')
							}
							return Ext.app.Localize.get('None')
						},
						editor: new Ext.form.ComboBox({
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('None')], 
									['1', Ext.app.Localize.get('Yes')]
								],
								fields: ['id', 'name']
							})
						})
					}, DelAStatusBtn]
				}),
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results',
						idPropert: 'idx'
					}, [
						{ name: 'id', type: 'int' },
						{ name: 'group', type: 'int' },
						{ name: 'type', type: 'int' }, 
						{ name: 'color', type: 'string' },
						{ name: 'descr', type: 'string' },
						{ name: 'active', type: 'int' },
						{ name: 'displaydefault', type: 'int' },
						{ name: 'clientmodifyallow', type: 'int' },
						{ name: 'defaultnew', type: 'int' },
						{ name: 'defaultanswer', type: 'int' },
						{ name: 'archive', type: 'int' }
					]),
					baseParams: {
						async_call: 1,
						devision: 111,
						getstatuses: 1
					},
					sortInfo: { 
						field: 'group', 
						direction: "ASC" 
					},
					autoLoad: true
				}),
				listeners: {
					afteredit: function(e) {
						if(e.field == 'defaultnew' || e.field == 'defaultanswer') {
							e.grid.store.query(e.field, 1).each(function(item){
								if(item.get('group') == this.record.get('group') && this.record.id != item.id) {
									item.set(e.field, 0);
									item.commit();
								}
							}, {
								store: e.grid.store,
								record: e.record
							});
						}
					},
					cellclick: function(grid, rowIndex, columnIndex, e) {
						if(grid.getColumnModel().getDataIndex(columnIndex) != 'color') {
							return;
						}
						new Ext.menu.ColorMenu({
							listeners: {
								render: function(menu) {
									if (menu.items.first().colors.indexOf(this.record.get('color')) < 0) {
										menu.items.first().colors.push(this.record.get('color'));
									}
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								}),
								show: function(){
									this.grid.startEditing(this.rowIndex, this.columnIndex)
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex),
									rowIndex: rowIndex,
									columnIndex: columnIndex
								}),
								select: function(menu, color) {
									this.record.set('color', color);
									this.record.commit();
									this.grid.stopEditing();
								}.createDelegate({
									grid: grid,
									record: grid.getStore().getAt(rowIndex)
								})
							}
						}).show(e.target);
					}
				}
			}]
		}, {
			// Email connector settings
			title: Ext.app.Localize.get('Module settings to control e-mail correspondence'),
			id: 'emailconn',
			autoHeight: true,
			items: [{
				xtype: 'form',
				frame: true,
				labelWidth: 380,
				url: 'config.php',
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					iconCls: 'ext-save',
					handler: function() {
						var form = this.ownerCt.ownerCt;
						form.getForm().submit({
							method:'POST', 
							waitTitle: Ext.app.Localize.get('Connecting'), 
							waitMsg: Ext.app.Localize.get('Sending data') + '...',
							scope: form,
							success: Success,
							failure: Failure
						})
					}
				}],
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 111
				}, {
					xtype: 'hidden',
					name: 'savesbsscommon',
					value: 1
				}, {
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Path to save messages of the email correspondence'),
					width: 300,
					name: 'crm_email_filepath'
				}, {
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Maximum message size for CRM system'),
					width: 300,
					name: 'crm_email_size'
				}, {
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Check E-mail every') + ' (' + Ext.app.Localize.get('sec-s') + ')',
					width: 300,
					name: 'crm_email_flush'
				}, {
					xtype: 'combo',
					fieldLabel: Ext.app.Localize.get('Enable debuging mode'),
					name: 'crm_email_debug',
					hiddenName: 'crm_email_debug',
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					width: 100,
					store: new Ext.data.ArrayStore({
						data: [
							['0', Ext.app.Localize.get('None')], 
							['1', Ext.app.Localize.get('Yes')]
						],
						fields: ['id', 'name']
					})
				}, {
					xtype: 'fieldset',
					title: Ext.app.Localize.get('Incoming mail server'),
					labelWidth: 370,
					items: [{
						xtype: 'combo',
						fieldLabel: Ext.app.Localize.get('Protocol'),
						name: 'crm_email_getproto',
						hiddenName: 'crm_email_getproto',
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						width: 100,
						store: new Ext.data.ArrayStore({
							data: [
								['0', 'POP3'], 
								['1', 'IMAP']
							],
							fields: ['id', 'name']
						})
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Server name'),
						width: 300,
						name: 'crm_email_gethost'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Port'),
						width: 300,
						name: 'crm_email_getport'
					}, {
						xtype: 'combo',
						fieldLabel: Ext.app.Localize.get('Use TLS'),
						name: 'crm_email_gettls',
						hiddenName: 'crm_email_gettls',
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						width: 100,
						store: new Ext.data.ArrayStore({
							data: [
								['0', Ext.app.Localize.get('None')], 
								['1', Ext.app.Localize.get('Yes')]
							],
							fields: ['id', 'name']
						})
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Account'),
						width: 300,
						name: 'crm_email_getuser'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Password'),
						width: 300,
						name: 'crm_email_getpass'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Email box for CRM system'),
						width: 300,
						name: 'crm_email_box'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Folder name where IMAP server saves messages'),
						width: 300,
						name: 'crm_email_imapfolder'
					}]
				}, {
					xtype: 'fieldset',
					title: Ext.app.Localize.get('Outgoing mail server'),
					labelWidth: 370,
					items: [{
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Server name'),
						width: 300,
						name: 'crm_email_smtphost'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Port'),
						width: 300,
						name: 'crm_email_smtpport'
					}, {
						xtype: 'combo',
						fieldLabel: Ext.app.Localize.get('Use TLS'),
						name: 'crm_email_smtptls',
						hiddenName: 'crm_email_smtptls',
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						width: 100,
						store: new Ext.data.ArrayStore({
							data: [
								['0', Ext.app.Localize.get('None')], 
								['1', Ext.app.Localize.get('Yes')]
							],
							fields: ['id', 'name']
						})
					}, {
						xtype: 'combo',
						fieldLabel: Ext.app.Localize.get('Authorization method for SMTP'),
						name: 'crm_email_smtpmethod',
						hiddenName: 'crm_email_smtpmethod',
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						width: 100,
						store: new Ext.data.ArrayStore({
							data: [
								['0', Ext.app.Localize.get('None')], 
								['1', 'PLAIN'],
								['2', 'LOGIN'],
								['3', 'CRAM / MD5']
							],
							fields: ['id', 'name']
						})
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Account'),
						width: 300,
						name: 'crm_email_smtpuser'
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Password'),
						width: 300,
						name: 'crm_email_smtppass'
					}]
				}]
			}]
		}, {
			// Message settings that are sent with invoices
			title: Ext.app.Localize.get('E-mail template to send document'),
			id: 'emailnotif',
			autoHeight: true,
			items: [{
				xtype: 'form',
				frame: true,
				labelWidth: 120,
				url: 'config.php',
								tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					iconCls: 'ext-save',
					handler: function() {
						var form = this.ownerCt.ownerCt;
						form.getForm().submit({
							method:'POST', 
							waitTitle: Ext.app.Localize.get('Connecting'), 
							waitMsg: Ext.app.Localize.get('Sending data') + '...',
							scope: form,
							success: Success,
							failure: Failure
						})
					}
				}],
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 111
				}, {
					xtype: 'hidden',
					name: 'savesbsscommon',
					value: 1
				}, {
					xtype: 'container',
					fieldLabel: Ext.app.Localize.get('Variables'),
					height: 80,
					html: '<ul>' +
						 	'<li>{username} - ' + Ext.app.Localize.get('User name') + '</li>' +
							'<li>{ordernum} - ' + Ext.app.Localize.get('Invoice number') + '</li>' +
							'<li>{agrmnum} - ' + Ext.app.Localize.get('Agreement number') + '</li>' +
							'<li>{period} - ' + Ext.app.Localize.get('Period') + '</li>' +
							'<li>{opername} - ' + Ext.app.Localize.get('Operator') + '</li>'
							+ '<ul>'
				}, {
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Subject'),
					name: 'sbss_subject',
					width: 690
				}, {
					xtype: 'textarea',
					fieldLabel: Ext.app.Localize.get('Text'),
					name: 'sbss_message',
					width: 690,
					height: 80
				}]
			}]
		}, {
			// SBSS categories configuration
			title: Ext.app.Localize.get('Messages categories'),
			autoHeight: true,
			items: [{
				xtype: 'editorgrid',
				height: 620,
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Save'),
					iconCls: 'ext-save',
					handler: function() {
						var store = this.ownerCt.ownerCt.getStore(),
							categories = [];
						if(!store.getCount()){
					        return;
						}
						
						var params = {
					    	async_call: 1,
					        devision: 111,
					        savecategories: 1
					    };
						
						var line = 0;
					    store.each(function(record) {
					        if (record.get("id") == 0 || record.get("isdefault") == 1 || record.dirty) {
					        	for (var i in record.data) {
									if(typeof i == 'undefined') {
										continue;
									}
									params['categories[' + line + '][' + i + ']'] = record.data[i];
								}
					        	line++;
					        }
					        
					    }, this);
					    
					    Ext.Ajax.request({
					        url: 'config.php',
					        method: "POST",
					        params: params,
					        callback: function(options, success, response){
					        	store.load();
					        },
					        scope: this
					    });
					}
				},{
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
							id: 0,
							name: Ext.app.Localize.get('New category'),
							isdefault: 0,
							messages: 0
						}));
					}
				}],
				store: {
	                xtype: 'jsonstore',
	                url: 'config.php',
	                method: 'POST',
	                root: 'results',
	                totalProperty: 'total',
	                updateLock: false,
	                fields: [
	                    { name: 'id', type: 'int' },
	                    { name: 'name', type: 'string' },
	                    { name: 'isdefault', type: 'int' },
	                    { name: 'unremovable', type: 'int' },
	                    { name: 'messages', type: 'int' },
	                    { name: 'archive', type: 'int' }
	                ],
	                baseParams: {
	                    async_call: 1,
	                    devision: 111,
	                    getcategories: 1
	                }
	            },
	            sm: new Ext.grid.RowSelectionModel({
					singleSelect: true
				}),
				autoExpandColumn: 'autoexpcol-name',
				plugins: [DelCategBtn, checkDefaulsColumn],
				columns: [{
					header: Ext.app.Localize.get('ID'),
					dataIndex: 'id',
					width: 50
				}, {
					header: Ext.app.Localize.get('Name'),
					dataIndex: 'name',
					id: 'autoexpcol-name',
					editor: {
						xtype: 'textfield',
						allowBlank: false
					}
				}, checkDefaulsColumn, DelCategBtn],
				listeners: {
					'afterrender': function(){
						var onUpdateMainStore = function(store, record, event){
							if(!store.updateLock) {
								
								store.updateLock = true;
								if (record.get('isdefault') == 1 ) {
									var records = store.getRange();
									for (var i = 0; i < records.length; ++i) {
										if(records[i] != record) {
											records[i].set('isdefault', 0);
											if(records[i].hasOwnProperty('modified') && Object.keys(records[i].modified).length == 1) {
												records[i].commit();
											}
										}
									}	
								}
								else {
									record.set('isdefault', 1);
								}
								store.updateLock = false;
							}
						}
						this.store.on('update', onUpdateMainStore, this);
					}
				}
			}]
		}]
	});
} // end showSBSS_Settings()

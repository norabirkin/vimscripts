/**
 * Accounts groups javascript engine
 * There's requiment to recieve in the data array key vgid
 */


Ext.onReady(function(){
	Ext.QuickTips.init();
	// Build group panel
	showGroupsPanel('GrPanelPlace');
});


/**
 * Build and show groups panel
 * @param	string, DOMElement to render to
 */
function showGroupsPanel(renderTo)
{
	var S = new Ext.data.Store({
	    proxy: new Ext.data.HttpProxy({
		url: 'config.php', 
		timeout: 380000,
		method: 'POST'
	    }),
	    reader: new Ext.data.JsonReader({
		root: 'results'
	    }, [{ name: 'groupid', type: 'int' },
		{ name: 'name', type: 'string' },
		{ name: 'vgroups', type: 'int' },
		{ name: 'descr', type: 'string' },
		{ name: 'agents', type: 'string' },
		{ name: 'curid', type: 'int' },
		{ name: 'symbol', type: 'string' }
	    ]),
	    autoLoad: true,
	    baseParams: {
		async_call: 1,
		devision: 16,
		getunions: 0
	    },
	    sortInfo: {
		field: 'groupid',
		direction: "ASC"
	    },
		listeners: {
			load: function(store) {
				store.rejectChanges()
			}
		}
	});
	var compactForm = function(items, object){
		if (Ext.isEmpty(items)) {
		    return false;
		};

		items.push({
			xtype: 'hidden',
			name: 'devision',
			value: 16
		});
		items.push({
			xtype: 'hidden',
			name: 'async_call',
			value: 1
		});

		// Remove form object with the same id
		try {
			Ext.getCmp('compactForm').destroy();
		}
		catch(e){ }

		// Create my
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
				if (!Ext.isEmpty(object)) {
					if (!Ext.isArray(object)) {
						object = [object];
					};
					for (var i = 0, off = object.length; i < off; i++) {
						object[i].reload();
					}
				};
				form.destroy();
			},
			failure: function(form, action){
				if (action.failureType == 'server') {
					obj = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert('Error!', obj.errors.reason);
				}
				form.destroy();
			}
		})
	};

	var activeTab = function(){
		switch (Ext.getCmp('UnionTabs').getActiveTab().getId()) {
			case 'AccUnion': return 0;
			case 'TarUnion': return 1;
			case 'ModUnion': return 2;
		};
		return null;
	}
	var Edit = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.Edit,
		width: 22,
		dataIndex: 'vgid',
		iconCls: 'ext-edit'
	});
	var Schedule = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.Schedule,
		width: 22,
		dataIndex: 'vgid',
		iconCls: function(record) {
            return (record.get('vgroups') == 0) ? 'ext-schedule-dis' : 'ext-schedule'; 
        }
	});
	var Assign = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.Assign,
		width: 22,
		dataIndex: 'vgid',
		iconCls: 'ext-add'
	});
	var Remove = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.DeleteUser,
		dataIndex: 'vgid',
		width: 22,
		iconCls: 'ext-drop'
	});

	new Ext.Panel({
		title: Localize.Unions,
		id: 'UnionPanel',
		width: 850,
		height: 648,
		renderTo: renderTo,
		tbar: [{
		    xtype: 'button',
		    id: 'AccGrpSave',
		    text: Ext.app.Localize.get('Save'),
		    iconCls: 'ext-save',
		    handler: function(B){
			if (activeTab() != 0) {
			    B.disable();
			    Ext.getCmp('AccGrpSave').disable();
			    return false;
			};
			var items = [];
			var M = S.getModifiedRecords();
			if (!Ext.isEmpty(M)) {
			    for (var i = 0, off = M.length; i < off; i++) {
				items.push({
				    xtype: 'hidden',
				    name: 'savegrp[' + i + '][groupid]',
				    value: M[i].data.groupid
				});
				items.push({
				    xtype: 'hidden',
				    name: 'savegrp[' + i + '][name]',
				    value: M[i].data.name
				});
				items.push({
				    xtype: 'hidden',
				    name: 'savegrp[' + i + '][descr]',
				    value: M[i].data.descr
				});
			    };
			    S.each(function(r){
				if (r.data.groupid == 0 && r.dirty == false) {
				    items.push({
					xtype: 'hidden',
					name: 'savegrp[' + this.iter + '][groupid]',
					value: r.data.groupid
				    });
				    items.push({
					xtype: 'hidden',
					name: 'savegrp[' + this.iter + '][name]',
					value: r.data.name
				    });
				    items.push({
					xtype: 'hidden',
					name: 'savegrp[' + this.iter + '][descr]',
					value: r.data.descr
				    });
				    this.iter++;
				}
			    }, {
				items: items,
				iter: i
			    });
			    compactForm(items, S)
			}
		    }
		}, {
		    xtype: 'button',
		    id: 'AccGrpAdd',
		    text: Localize.Add,
		    iconCls: 'ext-add',
		    handler: function(B){
			if (activeTab() != 0) {
			    B.disable();
			    Ext.getCmp('AccGrpSave').disable();
			    return false;
			};
			S.insert(0, new S.recordType({
			    groupid: 0,
			    name: Localize.NewUnion,
			    vgroups: 0,
			    descr: Localize.NewUnion,
			    agents: ''
			}));
		    }
		}],
		items: [{
		    xtype: 'tabpanel',
		    id: 'UnionTabs',
		    style: 'padding-top: 7px',
		    frame: true,
		    width: 848,
		    activeTab: 0,
		    autoHeight: true,
		    plain: true,
		    deferredRender: false,
		    items: [{
			title: Localize.UnionsAccounts,
			id: 'AccUnion',
			height: 570,
			items: [{
			    xtype: 'editorgrid',
			    id: 'AccUnionGrid',
			    border: false,
			    height: 562,
			    width: 847,
			    clicksToEdit: 1,
			    cm: new Ext.grid.ColumnModel([Edit, Schedule, /*Assign,*/ {
				header: 'ID',
				dataIndex: 'groupid',
				width: 80
			    }, {
				header: Localize.Name,
				dataIndex: 'name',
				width: 210,
				sortable: true,
				editor: new Ext.form.TextField({
				    allowBlank: false
				})
			    }, {
				header: Localize.Description,
				dataIndex: 'descr',
				sortable: true,
				id: 'descr_col',
				editor: new Ext.form.TextField({
				    allowBlank: false
				})
			    }, {
				header: Localize.Accounts,
				dataIndex: 'vgroups',
				width: 130
			    }, Remove]),
			    loadMask: true,
			    store: S,
			    plugins: [Edit, Schedule, Assign, Remove],
			    autoExpandColumn: 'descr_col'
			}]
		    }, {
			title: Localize.UnionsTarifs,
			id: 'TarUnion',
			height: 570,
			items: [{
			    xtype: 'grid',
			    border: false,
			    height: 562,
			    width: 847,
			    cm: new Ext.grid.ColumnModel([Edit, Schedule, {
				header: 'ID',
				dataIndex: 'groupid',
				sortable: true,
				width: 80
			    }, {
				header: Localize.Description,
				dataIndex: 'descr',
				sortable: true,
				id: 'descr_col'
			    }, {
				header: Localize.Accounts,
				dataIndex: 'vgroups',
				width: 130
			    }]),
			    loadMask: true,
			    sortable: true,
			    store: S,
			    plugins: [Edit, Schedule],
			    autoExpandColumn: 'descr_col'
			}]
		    }, {
			title: Localize.UnionsModules,
			id: 'ModUnion',
			height: 570,
			items: [{
			    xtype: 'grid',
			    border: false,
			    height: 560,
			    width: 847,
			    cm: new Ext.grid.ColumnModel([Edit, Schedule, {
				header: 'ID',
				dataIndex: 'groupid',
				width: 80
			    }, {
				header: Localize.Description,
				sortable: true,
				dataIndex: 'descr',
				id: 'descr_col'
			    }, {
				header: Localize.Accounts,
				dataIndex: 'vgroups',
				width: 130
			    }]),
			    loadMask: true,
			    store: S,
			    plugins: [Edit, Schedule],
			    autoExpandColumn: 'descr_col'
			}]
		    }],
		    listeners: {
			tabchange: function(panel, currTab){
			    switch (currTab.getId()) {
				case 'AccUnion':
				    S.baseParams.getunions = 0;
				    S.load();
				    Ext.getCmp('AccGrpSave').enable();
				    Ext.getCmp('AccGrpAdd').enable();
				    break;
				case 'TarUnion':
				    S.baseParams.getunions = 1;
				    S.load();
				    Ext.getCmp('AccGrpSave').disable();
				    Ext.getCmp('AccGrpAdd').disable();
				    break;
				case 'ModUnion':
				    S.baseParams.getunions = 2;
				    S.load();
				    Ext.getCmp('AccGrpSave').disable();
				    Ext.getCmp('AccGrpAdd').disable();
				    break;
			    }
			}
		    }
		}]
	});
	Schedule.on('action', function(grid, record, rowIndex){
		if(record.get('vgroups') == 0) return false;
	    if (record.data.groupid == 0) {
		alert(Localize.BeforeSaveUnion);
		return false;
	    };
	    var A = 0;
	    switch (Ext.getCmp('UnionTabs').getActiveTab().getId()) {
		case 'AccUnion':
		    A = 0;
		    break;
		case 'TarUnion':
		    A = 1;
		    break;
		case 'ModUnion':
		    A = 2;
		    break;
	    };
	    ScheduleControl(A, record);
	});
	Edit.on('action', function(grid, record, rowIndex){
	    if (record.data.groupid == 0) {
		alert(Localize.BeforeSaveUnion);
		return false;
	    };
	    var A = 0;
	    switch (Ext.getCmp('UnionTabs').getActiveTab().getId()) {
		case 'AccUnion':
		    A = 0;
		    break;
		case 'TarUnion':
		    A = 1;
		    break;
		case 'ModUnion':
		    A = 2;
		    break;
	    };
	    editUnion(A, record);
	});
	Assign.on('action', function(grid, record, rowIndex){
	    if (record.data.groupid == 0) {
		alert(Localize.BeforeSaveUnion);
		return false;
	    };
	    var A = 0;
	    switch (Ext.getCmp('UnionTabs').getActiveTab().getId()) {
		case 'AccUnion':
		    A = 0;
		    break;
		case 'TarUnion':
		    A = 1;
		    break;
		case 'ModUnion':
		    A = 2;
		    break;
	    };
	    AssignControl(A, record);
	});
	Remove.on('action', function(grid, record, index){
	    if (record.data.groupid == 0) {
		S.remove(record);
		return;
	    };
	    compactForm([{
		xtype: 'hidden',
		name: 'delgrp',
		value: record.data.groupid
	    }], S)
	});
} // end showGroupsPanel()


/**
 * Control to add, modify scheduling for the specified item type
 * @param	integer, scheduling for: 0 - accounts unions, 1 - tarifs unions, modules unions
 * @param	object, data
 */
function ScheduleControl(schType, record)
{
	if (!Ext.isEmpty(Ext.getCmp('ScheduleWin'))) {
	    return
	};
	if (!Ext.isEmpty(Ext.getCmp('UnionEdit'))) {
	    return
	}
	var Remove = new Ext.grid.RowButton({
	    header: '&nbsp;',
	    qtip: Localize.DeleteUser,
	    dataIndex: 'vgid',
	    width: 22,
	    iconCls: 'ext-drop'
	});

	var Droped = [];

	var T = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
		reader: new Ext.data.JsonReader({ root: 'results' }, [
			{ name: 'id', type: 'int' },
			{ name: 'type', type: 'int' },
			{ name: 'name', type: 'string' },
			{ name: 'curid', type: 'int' },
			{ name: 'symbol', type: 'string' }
		]),
		autoLoad: true,
		ellipsis: false,
		baseParams: { async_call: 1, devision: 16, getunions: 1, unavail: 0 },
		sortInfo: { field: 'id', direction: "ASC" },
		listeners: {
			load: function (){
				Ext.getCmp('scheduleGrid').getView().refresh();
			}
		}
	});

	var compactForm = function(items){
		if (Ext.isEmpty(items)) {
		    return false;
		};

		items.push({
			xtype: 'hidden',
			name: 'devision',
			value: 16
		});

		items.push({
			xtype: 'hidden',
			name: 'async_call',
			value: 1
		});
		
		items.push({
			xtype: 'hidden',
			name: 'override',
			value: 0
		});

		// Remove form object with the same id
		try {
			Ext.getCmp('compactForm').destroy();
		}
		catch(e){ }

		// Create my
		var form = new Ext.form.FormPanel({
			id: 'compactForm',
			renderTo: Ext.getBody(),
			url: 'config.php',
			items: items
		});
		
		var submitCfg = {
			method: 'POST',
			waitTitle: Localize.Connecting,
			waitMsg: Localize.SendingData + '...',
			success: function(form, action){
				form.destroy();
				if(!Ext.isEmpty(Ext.getCmp('ScheduleWin'))) {
					Ext.getCmp('ScheduleWin').close()
				}
			},
			scope: {
                config: this,
                submitCfg: null,
                win: Ext.getCmp('ScheduleWin')
            },
			failure: function(form, action){
				/*if (action.failureType == 'server') {
					obj = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert('Error!', obj.errors.reason);
				}
				form.destroy();*/
				try {
            		if(action.result.override) {
            			Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get(action.result.error), function(B){
                            if (B != 'yes') {
                                return;
                            }
                            
                            form.setValues({override: 1});
                            form.submit(this.submitCfg);
            			}, this);
            		}
            		else {
            			throw(action.result.error);
            		}
            	}
            	catch(e) {
                    Ext.Msg.error(e);
            	}
				
			}
		}
		submitCfg.scope.submitCfg = submitCfg;
		form.getForm().submit(submitCfg);
		
	}
	var W = new Ext.Window({
	    title: Localize.Schedule + ': ' + ((Ext.util.Format.trim(record.data.name) != '') ? record.data.name : record.data.descr),
	    id: 'ScheduleWin',
	    width: 729,
	    height: 415,
	    layout: 'anchor',
	    tbar: [Localize.Module + ':', '&nbsp;', {
			xtype: 'combo',
			id: 'modulesCombo',
			width: 210,
			displayField: 'name',
			valueField: 'id',
			tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 33)]}</div></tpl>',
			mode: 'local',
			triggerAction: 'all',
			typeAhead: true,
			editable: false,
			store: new Ext.data.Store({
			    proxy: new Ext.data.HttpProxy({
				url: 'config.php', 
				timeout: 380000,
				method: 'POST'
			    }),
			    reader: new Ext.data.JsonReader({
				root: 'results'
			    }, [
					{ name: 'id', type: 'int' },
					{ name: 'type', type: 'int' },
					{ name: 'name', type: 'string' }
				]),
			    autoLoad: true,
			    baseParams: {
					async_call: 1,
					devision: 16,
					getunions: 2
			    },
			    sortInfo: {
					field: 'id',
					direction: "ASC"
			    }
			}),
			listeners: {
			    expand: function(combo){
					combo.store.clearFilter();
					if(Ext.isEmpty(this.get('agents'))) {
						Ext.Msg.alert(Localize.Info, Localize.UnionEmptyOrServices);
					}
					combo.store.filter('id', new RegExp('^(' + (this.data.agents.split(',').join('|')) + ')$'));
			    }.createDelegate(record || {})
			}
	    }, '&nbsp;', {
		xtype: 'button',
		iconCls: !Ext.isIE8 ? 'ext-add' : '',
		text: Ext.isIE8 ?('<img align=middle src=./images/ext-add.gif> '+Localize.AddNewRecord) : '',
		handler: function(){
		    if (Ext.isEmpty(Ext.getCmp('modulesCombo').getValue())) {
			alert(Localize.NeedModule + '!');
			return false;
		    }
		    var A = Ext.getCmp('scheduleGrid');
		    var D = new Date().add(Date.MONTH, 1);
		    D.setDate(1);
		    var M = Ext.getCmp('modulesCombo');
		    A.store.insert(0, new A.store.recordType({
			recordid: 0,
			changedate: D,
			agentid: M.getValue(),
			agenttype: (M.store.getAt(M.store.find('id', M.getValue())).data.type),
			changetime: '00:00:00',
			taridnew: null,
			tarnewname: '',
			taridold: (schType == 1) ? record.data.groupid : 0,
			taroldname: ((schType == 1) ? record.data.descr : ''),
			taroldcurid: record.data.curid
		    }));
		}
	    }],
	    items: [{
		xtype: 'editorgrid',
		id: 'scheduleGrid',
		width: 715,
		height: 320,
		anchor: '100% 100%',
		clicksToEdit: 1,
		cm: new Ext.grid.ColumnModel([{
		    header: Localize.Date,
		    dataIndex: 'changedate',
		    width: 110,
		    renderer: function(value){
			if (typeof value == 'object') {
			    return value.format('Y-m-d');
			}
			else {
			    value
			}
		    },
		    editor: new Ext.form.DateField({
			allowBlank: false,
			format: 'Y-m-d'
		    })
		}, {
		    header: Localize.Time,
		    dataIndex: 'changetime',
		    width: 110,
		    editor: new Ext.form.TextField({
			allowBlank: false
		    })
		}, {
		    header: Localize.CurrentTarif,
		    dataIndex: 'taroldname',
		    width: 210,
		    renderer: function(value, meta, r){
			if (Ext.util.Format.trim(value) == '') {
			    return Localize.Undefined;
			}
			else {
			    return value + ' (' + (!Ext.isEmpty(r.data.taroldsymbol) ? r.data.taroldsymbol : record.data.symbol) + ')';
			}
		    }
		}, {
		    header: Localize.Scheduled + ' ' + Localize.tarif,
		    dataIndex: 'taridnew',
		    width: 240,
		    sortable: true,
		    renderer: function(value, meta, record){
			if (T.find('id', value) > -1) {
			    var A = T.getAt(T.find('id', value));
			    return A.data.name + ' (' + A.data.symbol + ')'
			}
			else {
			    return record.data.tarnewname;
			}
		    },
		    editor: new Ext.form.ComboBox({
			id: '_tarifCombo',
			width: 210,
			displayField: 'name',
			valueField: 'id',
			mode: 'local',
			triggerAction: 'all',
			tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 33)]} ({symbol})</div></tpl>',
			editable: false,
			store: T,
			listeners: {
				expand: function(combo){
					combo.store.clearFilter();
					var R = combo.events.blur.listeners[0].scope.record;
					allowedTarTypes = function(A){
						var B = null;
						switch (A) {
							case 1: case 2: case 3: case 4: case 5:
								B = 0;
							break;
							case 6:
								B = '1|2';
							break;
							case 7: case 8: case 9: case 10: case 11:
								B = 3;
							break;
							case 12:
								B = 4;
							break;
							case 13:
								B = 5;
							break;
						}
						return new RegExp('^' + B + '$');
					};
					combo.store.filterBy(function(C){
						var B = allowedTarTypes(R.data.agenttype);
						if (B.test(C.data.type)) {
							if (R.data.taridold > 0) {
								if (R.data.taroldcurid == C.data.curid) {
									return true
								}
								else {
									return false
								}
							}
							else {
								return true
							}
						}
						return false;
					});
				}
			    }
		    })
		}, Remove]),
		store: new Ext.data.Store({
		    proxy: new Ext.data.HttpProxy({
			url: 'config.php', 
			timeout: 380000,
			method: 'POST'
		    }),
		    reader: new Ext.data.JsonReader({
			root: 'results'
		    }, [
			{ name: 'recordid', type: 'int' },
			{ name: 'agentid', type: 'int' },
			{ name: 'agenttype', type: 'int' },
			{ name: 'changedate', type: 'date', dateFormat: 'Y-m-d' },
			{ name: 'changetime', type: 'string' },
			{ name: 'taridnew', type: 'int' },
			{ name: 'tarnewname', type: 'string' },
			{ name: 'tarnewcurid', type: 'int' },
			{ name: 'taridold', type: 'int' },
			{ name: 'taroldcurid', type: 'int' },
			{ name: 'taroldname', type: 'string' },
			{ name: 'tarnewsymbol', type: 'string' },
			{ name: 'taroldsymbol', type: 'string' }
		    ]),
		    autoLoad: true,
		    baseParams: {
			async_call: 1,
			devision: 16,
			getrasp: schType,
			getitemid: record.data.groupid
		    },
		    sortInfo: {
			field: 'changedate',
			direction: "ASC"
		    }
		}),
		loadMask: true,
		plugins: Remove
	    }],
	    buttonAlign: 'center',
	    buttons: [{
		xtype: 'button',
		text: Localize.Save,
		handler: function(){
		    var B = Ext.getCmp('scheduleGrid').store.getModifiedRecords();

		    var items = [{
			xtype: 'hidden',
			name: 'saverasp',
			value: schType
		    }];

		    if (!Ext.isEmpty(B)) {
			for (var i = 0, off = B.length; i < off; i++) {
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][setitemid]',
				value: record.data.groupid
			    });
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][agentid]',
				value: B[i].data.agentid
			    });
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][recordid]',
				value: B[i].data.recordid
			    });
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][taridnew]',
				value: B[i].data.taridnew
			    });
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][changedate]',
				value: B[i].data.changedate.format('Y-m-d')
			    });
			    items.push({
				xtype: 'hidden',
				name: 'updrasp[' + i + '][changetime]',
				value: B[i].data.changetime
			    });
			};
		    }

		    if (Droped.length > 0) {
			for (var i = 0, off = Droped.length; i < off; i++) {
			    items.push({
				xtype: 'hidden',
				name: 'delrasp[' + i + '][recordid]',
				value: Droped[i].data.recordid
			    });
			}
		    }

		    if(items.length > 1) {
			  compactForm(items);
		    }
		}
	    }]
	}).show();
	Remove.on('action', function(grid, record, rowIndex){
	    if (record.data.recordid > 0) {
		Droped.push(record);
	    };
	    grid.store.remove(record);
	});
}


/**
 * Control to add, modify assign for the specified item type
 * @param	integer, assign for: 0 - accounts unions, 1 - tarifs unions, modules unions
 * @param	object, data
 */
function AssignControl(schType, record)
{

	if (!Ext.isEmpty(Ext.getCmp('ScheduleWin'))) {
	    return
	};
	if (!Ext.isEmpty(Ext.getCmp('UnionEdit'))) {
	    return
	}

	var W = new Ext.Window({
		title: Localize.Assign,
	    id: 'AssignWin',
		modal: true,
		width: 380,
		resizable: false,
	    tbar: [ {
			xtype: 'combo',
			id: 'AssignCombo',
			width: 330,
			displayField: 'name',
			valueField: 'id',
			tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 33)]}</div></tpl>',
			mode: 'local',
			triggerAction: 'all',
			typeAhead: true,
			editable: false,
			store: new Ext.data.SimpleStore({
				data: [
					['0', Localize.ReCount],
					['1', Localize.Tarif],
					['2', Localize.Suspension],
					['3', Localize.ServiceY]
				],
				fields: ['id', 'name']
			}),
			listeners: {
			    select: function()
				{
					var v = this.getValue();
					if( v == 0 ) 
					{
						var rp = Ext.getCmp('InfoPanelRecount');    rp.hidden = false; rp.show(); 
						var sp = Ext.getCmp('InfoPanelSuspension'); sp.hide(); 
						var tp = Ext.getCmp('InfoPanelTarif');      tp.hide(); 
						var ep = Ext.getCmp('InfoPanelService');    ep.hide(); 
					}
					if( v == 1 ) 
					{ 
						var tp = Ext.getCmp('InfoPanelTarif');      tp.hidden = false; tp.show(); 
						var sp = Ext.getCmp('InfoPanelSuspension'); sp.hide(); 
						var rp = Ext.getCmp('InfoPanelRecount');    rp.hide(); 
						var ep = Ext.getCmp('InfoPanelService');    ep.hide(); 
					}
					if( v == 2 ) 
					{
						var sp = Ext.getCmp('InfoPanelSuspension'); sp.hidden = false; sp.show();  
						var tp = Ext.getCmp('InfoPanelTarif');      tp.hide(); 
						var rp = Ext.getCmp('InfoPanelRecount');    rp.hide();
						var ep = Ext.getCmp('InfoPanelService');    ep.hide(); 						
					}
					if( v == 3 ) 
					{
						var ep = Ext.getCmp('InfoPanelService');    ep.hidden = false; ep.show();
						var tp = Ext.getCmp('InfoPanelTarif');      tp.hide(); 
						var rp = Ext.getCmp('InfoPanelRecount');    rp.hide();
						var sp = Ext.getCmp('InfoPanelSuspension'); sp.hide(); 						
					}
				}
			}

	    }, '&nbsp;', {
			xtype: 'button',
			iconCls: !Ext.isIE8 ? 'ext-add' : '',
			toolTip: Localize.Assign,
			store: new Ext.data.Store({
			    proxy: new Ext.data.HttpProxy({ 
				url: 'config.php',
				timeout: 380000,
				method: 'POST'
			    }),
			    reader: new Ext.data.JsonReader({ root: 'results' }, [ { name: 'text', type: 'string' } ]),
			    autoLoad: true,
			    baseParams: { async_call: 1, devision: 7, assign: -1, tarid: 0, groupid: 0, changedatetar: 0, changetimetar: 0, changedatesusstart: 0, changetimesusstart: 0, changedatesusend: 0, changetimesusend: 0, changedaterecstart: 0, changetimerecstart: 0, changedaterecend: 0, changetimerecend: 0, changedateser: 0, changetimeser: 0, servid: 0 } }),
			listeners: {
			    click: function()
				{
					var s    = this.store;
					var ac   = Ext.getCmp('AssignCombo');
					var t    = Ext.getCmp('AssignTarif');
					var cd   = Ext.getCmp('changedatetar');
					var ct   = Ext.getCmp('changetimetar');
					var cdst = Ext.getCmp('changedatesusstart');
					var ctst = Ext.getCmp('changetimesusstart');
					var cdse = Ext.getCmp('changedatesusend');
					var ctse = Ext.getCmp('changetimesusend');
					var cdrt = Ext.getCmp('changedaterecstart');
					var ctrt = Ext.getCmp('changetimerecstart');
					var cdre = Ext.getCmp('changedaterecend');
					var ctre = Ext.getCmp('changetimerecend');
					var cds  = Ext.getCmp('changedateser');
					var cts  = Ext.getCmp('changetimeser');
					var ser  = Ext.getCmp('AssignService');

					s.baseParams.groupid        =  record.data.groupid;
					s.baseParams.tarid          =  ( t ) ? t.getValue() : 0;
					s.baseParams.changedatetar  =  ( cd ) ? cd.getValue() : 0; 
					s.baseParams.changetimetar	=  ( ct ) ? ct.getValue() : 0;
					s.baseParams.assign         =  ac.getValue();
					s.baseParams.changedatesusstart  =  ( cdst ) ? cdst.getValue() : 0;  
					s.baseParams.changetimesusstart  =  ( ctst ) ? ctst.getValue() : 0;
					s.baseParams.changedatesusend    =  ( cdse ) ? cdse.getValue() : 0;
					s.baseParams.changetimesusend    =  ( ctse ) ? ctse.getValue() : 0;
					s.baseParams.changedaterecstart  =  ( cdrt ) ? cdrt.getValue() : 0;  
					s.baseParams.changetimerecstart  =  ( ctrt ) ? ctrt.getValue() : 0;
					s.baseParams.changedaterecend    =  ( cdre ) ? cdre.getValue() : 0;
					s.baseParams.changetimerecend    =  ( ctre ) ? ctre.getValue() : 0;
					s.baseParams.changedateser  =  ( cds ) ? cds.getValue() : 0;
					s.baseParams.changetimeser  =  ( cts ) ? cts.getValue() : 0;
					s.baseParams.tarid          =  ( ser ) ? ser.getValue() : 0;


					if( ac.getValue() == 0 )
					{
							Ext.Msg.confirm( Localize.SendingData, Localize.Assign + '?' , function( btn ){
									if( btn == 'yes' ) {
										s.load(); W.close();
									} 
							} );
					}

					if( ac.getValue() == 1 )
					{
						if( t.getValue() == 0 ) { alert( Localize.PleaseSpecify + ' ' + Localize.Tarif + '!!!' ); }
						else
						{						
							Ext.Msg.confirm( Localize.SendingData, Localize.Assign + '?' , function( btn ){
									if( btn == 'yes' ) {
										s.load(); W.close();
									} 
							} );
						}
					}

					if( ac.getValue() == 2 )
					{
							Ext.Msg.confirm( Localize.SendingData, Localize.Assign + '?' , function( btn ){
									if( btn == 'yes' ) {
										s.load(); W.close();
									} 
							} );
					}

					if( ac.getValue() == 3 )
					{
							Ext.Msg.confirm( Localize.SendingData, Localize.Assign + '?' , function( btn ){
									if( btn == 'yes' ) {
										s.load(); W.close();
									} 
							} );
					}

				}
			}
	    }], items: [
			{				
				hidden: true,
				id: 'InfoPanelTarif',
				layout: 'form',
				items: [ {
					xtype: 'datefield',
					fieldLabel: Localize.Date,
					value: new Date(),
					id: 'changedatetar',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimetar',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}, {
					xtype: 'combo',
					fieldLabel: Localize.Tarif,
					ref: 'tarif',
					id: 'AssignTarif',
					allowBlank: false,
					width: 250,
					displayField: 'name',
					valueField: 'tarid',
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name} ({symbol})">{tarid}. {[Ext.util.Format.ellipsis(values.name, 27)]} ({symbol})</div></tpl>',
					editable: false,
					typeAhead: true,
					triggerAction: 'all',
					mode: 'local',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}),
						reader: new Ext.data.JsonReader({ root: 'results' }, [
							{ name: 'tarid', type: 'int' },
							{ name: 'name', type: 'string' },
							{ name: 'symbol', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 7,
							unavail: 0,
							gettarifs: 6
						},
						sortInfo: { field: 'tarid', direction: "ASC" }
					}),
					listerners:
					{
						load: function(store) {}
					}

				}]			
			},
		    {
				hidden: true,
				id: 'InfoPanelSuspension',
				layout: 'form',
				items: [ {
					xtype: 'datefield',
					fieldLabel: Localize.Date + ' ' + Localize.start,
					value: new Date(),
					id: 'changedatesusstart',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimesusstart',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}, {
					xtype: 'datefield',
					fieldLabel: Localize.Date + ' ' + Localize.end,
					value: new Date(),
					id: 'changedatesusend',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimesusend',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}]
			},
		    {
				hidden: true,
				id: 'InfoPanelRecount',
				layout: 'form',
				items: [ 
				{
				  xtype: 'panel',
				  title: Localize.MessageOfRecount,
				  height: 2
				}, {
					xtype: 'datefield',
					fieldLabel: Localize.Date + ' ' + Localize.start,
					value: new Date(),
					id: 'changedaterecstart',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimerecstart',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}, {
					xtype: 'datefield',
					fieldLabel: Localize.Date + ' ' + Localize.end,
					value: new Date(),
					id: 'changedaterecend',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimerecend',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}]
			},			
			{				
				hidden: true,
				id: 'InfoPanelService',
				layout: 'form',
				items: [ {
					xtype: 'datefield',
					fieldLabel: Localize.Date,
					value: new Date(),
					id: 'changedateser',
					format: 'd.m.Y',
					width: 120
				}, {
					xtype: 'textfield',
					id: 'changetimeser',
					width: 120,
					value: '00:00',
					fieldLabel: Localize.Time + ' (' + Localize.HH + ':' + Localize.MM + ')',
					maskRe: new RegExp("[0-9\:]"),
					validator: function(value) {
						if(/^\d{2,2}\:\d{2,2}$/.test(value)) {
							var t = value.split(':');
							for(var i = 0, off = t.length; i < off; i++) {
								if (i == 0) {
									if (t[i] < 0 || t[i] > 23) {
										return false;
									}
								}
								else {
									if (t[i] < 0 || t[i] > 59) {
										return false;
									}
								}
							}
							return true;
						}
					}
				}, {
					xtype: 'combo',
					fieldLabel: Localize.Tarif,
					ref: 'tarif',
					id: 'AssignService',
					allowBlank: false,
					width: 250,
					displayField: 'name',
					valueField: 'tarid',
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name} ({symbol})">{tarid}. {[Ext.util.Format.ellipsis(values.name, 27)]} ({symbol})</div></tpl>',
					editable: false,
					typeAhead: true,
					triggerAction: 'all',
					mode: 'local',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}),
						reader: new Ext.data.JsonReader({ root: 'results' }, [
							{ name: 'tarid', type: 'int' },
							{ name: 'name', type: 'string' },
							{ name: 'symbol', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 7,
							unavail: 0,
							gettarifs: 5
						},
						sortInfo: { field: 'tarid', direction: "ASC" }
					}),
					listerners:
					{
						load: function(store) {}
					}

				}]			
			}
				
				]
	}).show();
}


/**
 *
 * @param	integer, scheduling for: 0 - accounts unions, 1 - tarifs unions, modules unions
 * @param	object, data
 */
function editUnion(schType, record)
{
	if(!Ext.isEmpty(Ext.getCmp('ScheduleWin'))){ return }; if(!Ext.isEmpty(Ext.getCmp('UnionEdit'))){ return }
	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
		width:280,
		initComponent : function(){
            Ext.app.SearchField.superclass.initComponent.call(this);
            this.on('specialkey', function(f, e){
                if (e.getKey() == e.ENTER) {
                    this.onTrigger2Click();
                }
            }, this);

			if(!this['params']) {
				this.params = {};
			}
		},
		validationEvent: false,
		validateOnBlur: false,
		trigger1Class: 'x-form-clear-trigger',
		trigger2Class:'x-form-search-trigger',
		hideTrigger1: true,
		hasSearch : false,
		paramName : 'search',
		searchValue: '',
		onTrigger1Click : function(){
			if(this.hasSearch){
				this.el.dom.value = '';
				this.searchValue = '';

				if(!Ext.isEmpty(this.filterBy) && typeof this.filterBy == 'function'){
					this.store.clearFilter();
				}
				else {
					this.store.baseParams = this.store.baseParams || {};
					this.store.baseParams[this.paramName] = '';

					this.params['start'] = 0;
					this.params[this.paramName] = '';

					this.store.reload({
						params: Ext.apply({
							start: 0
						}, this.params)
					});
				}

				this.triggers[0].hide();
				this.hasSearch = false;
			}
		},
		onTrigger2Click : function(){
			var v = this.getRawValue();
			if(v.length < 1){
				this.onTrigger1Click();
				return;
			};
			this.searchValue = v;
			if(!Ext.isEmpty(this.filterBy) && typeof this.filterBy == 'function'){
				this.store.filterBy(this.filterBy, this);
			}
			else {
				this.store.baseParams = this.store.baseParams || {};
				this.store.baseParams[this.paramName] = this.searchValue;

				this.params['start'] = 0;
				this.params[this.paramName] = this.searchValue;

				this.store.reload({
					params: Ext.apply({
						start: 0
					}, this.params)
				});
			}
			this.hasSearch = true;
			this.triggers[0].show();
		}
	});

    var compactForm = function(items, object){
        if (Ext.isEmpty(items)) {
            return false;
        };
        items.push({
            xtype: 'hidden',
            name: 'devision',
            value: 16
        });
        items.push({
            xtype: 'hidden',
            name: 'async_call',
            value: 1
        });
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
                if (!Ext.isEmpty(object)) {
                    if (!Ext.isArray(object)) {
                        object = [object];
                    };
                    for (var i = 0, off = object.length; i < off; i++) {
                        object[i].reload();
                    }
                };
                form.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.errors.reason);
                }
                form.destroy();
            }
        })
    }

	var S = {
		grpstaff: new Ext.data.Store({ 
			proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}), 
			reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [{ name: 'vgid', type: 'int' }, { name: 'groupid', type: 'int' }, { name: 'vglogin', type: 'string' }, { name: 'agrmnum', type: 'string' }, { name: 'username', type: 'string' }]), 
			baseParams: { async_call: 1, devision: 16, getgrpstaff: record.data.groupid, searchtype: 0, search_ex: 0 }, 
			sortInfo: { 
				field: 'vglogin', 
				direction: "ASC" 
			},
			remoteSort: true
		}),
		grpfree: new Ext.data.Store({ 
			proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}), 
			reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [{ name: 'vgid', type: 'int' }, { name: 'groupid', type: 'int' }, { name: 'vglogin', type: 'string' }, { name: 'agrmnum', type: 'string' }, { name: 'username', type: 'string' }]), 
			baseParams: { async_call: 1, devision: 16, getvgroups: record.data.groupid, searchtype: 0, search_ex: 0 }, 
			sortInfo: { 
				field: 'vglogin', 
				direction: "ASC" 
			},
			remoteSort: true
		}),
		tarstaff: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'groupid', type: 'int' }, { name: 'grouptarid', type: 'int' }, { name: 'groupmoduleid', type: 'int' }, { name: 'tarid', type: 'int' }, { name: 'tartype', type: 'int' }, { name: 'tarname', type: 'string' }, { name: 'tarcurid', type: 'int' }, { name: 'tarsymbol', type: 'string' }]), autoLoad: true, baseParams: { async_call: 1, devision: 16, gettarstaff: schType, getitemid: record.data.groupid }, sortInfo: { field: 'tarid', direction: "ASC" } }),
		freetars: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'tarid', type: 'int' }, { name: 'tartype', type: 'int' }, { name: 'tarname', type: 'string' }, { name: 'tarcurid', type: 'int' }, { name: 'tarsymbol', type: 'string' }]), autoLoad: true, baseParams: { async_call: 1, devision: 16, getfreetarstaff: schType, getitemid: record.data.groupid, modules: record.data.agents }, sortInfo: { field: 'tarid', direction: 'ASC' } })
	}

	var PanelItems = [];
	var RemoveTarStaff = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'tarid', width: 22, iconCls: 'ext-drop' });
	var RemoveGrpStaff = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'vgid', width: 22, iconCls: 'ext-drop' });

	if(schType == 0) {
		PanelItems.push({ columnWidth: 0.5, title: Localize.Assigned + ' ' + Localize.accounts, layout: 'fit', border: false, 
			items: [{ xtype: 'grid', id: 'aGrpStaff', height: 304, enableDragDrop: true, ddGroup: 'bGrpStaffDD', 
					  tbar: [ { xtype: 'button', tooltip: Localize.RemoveAll, text: Ext.isIE8 ? ('<img align=middle src=./images/accept.gif> '+Localize.RemoveAll) : '',
			          iconCls: !Ext.isIE8 ? 'ext-drop' : '', 
			          handler: function(){ 

								Ext.getCmp('aGrpStaff').getSelectionModel().selectAll();
								Ext.Msg.confirm( Localize.Message, Localize.RemoveAll + '?' , function( btn ){
									if( btn == 'yes' ) 
									{
										var items = [{ xtype: 'hidden', name: 'savegrpstaff', value: record.data.groupid }]; 
										var A = Ext.getCmp('aGrpStaff').getSelectionModel().getSelections(); 
										for(var i = 0, off = A.length; i < off; i++)
										{ 
											items.push({ xtype: 'hidden', name: 'delgrpstaff[]', value: A[i].data.vgid}); 
											compactForm(items, [Ext.getCmp('bGrpStaff').store, Ext.getCmp('aGrpStaff').store]); 
										}; 
									}
									else
									{
										Ext.getCmp('aGrpStaff').getSelectionModel().clearSelections();
									}
							} );
		  
					  } }, '-', Localize.Search, ':&nbsp;', { xtype: 'combo', id: 'searchBCombo', width: 138, displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', value: 0, editable: false, 
					  store: new Ext.data.SimpleStore({ 
						  data: [['0', Localize.User],
							     ['1', Localize.Agreement], 
							     ['2', Localize.Login],
								 ['7', Localize.Address],
							     ['8', Localize.Tarif],
								 ['9', Localize.Status],
								 ['10', Localize.Agent]
								], fields: ['id', 'name'] }), 
						  listeners: {
							  select: function() 
							  { 
								  var v = this.getValue();
								  if( 8 > v || v > 10 ) { Ext.getCmp( 'SearchFieldB' ).setValue( '' ); }
								  if( v == 8 ) { var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'tarifcombo',	width: 355,	displayField: 'name', valueField: 'id',	mode: 'local', triggerAction: 'all', editable: false, tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]} {[(values.id > 0) ? "(" + values.symbol + ")" : "" ]}</div></tpl>',	listeners: { select: function(){} }, store: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST' }), reader: new Ext.data.JsonReader( { root: 'results' }, [	{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'symbol', type: 'string' } ]), autoLoad: true, baseParams: { async_call: 1, devision: 7, gettarifs: 0 }, sortInfo: {	field: 'id', direction: "ASC" }, listeners: { load: function(store){ var row = Ext.data.Record.create([{ name: 'name', type: 'string' }, { name: 'id', type: 'int' }]); } } }), listeners: { select: function()	{ var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldB').setValue( r.data[this.displayField] ); } S.grpstaff.baseParams.search_ex = this.getValue(); W.close(); } } } ], items: { hidden: true, id: 'InfoPanelService', layout: 'form' } }); W.show(); }
								  if( v == 9 ) { var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'statecombo', width: 355, displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', value: 0, editable: false, store: new Ext.data.SimpleStore({ data: [ ['0', Ext.app.Localize.get('All')], ['1', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')], ['2', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client')], ['3', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager')], ['5', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic')], ['10', Ext.app.Localize.get('Turned off')] ], fields: ['id', 'name'] }), listeners: { select: function() { var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldB').setValue( r.data[this.displayField] ); } S.grpstaff.baseParams.search_ex = this.getValue(); W.close(); } }} ], items: { hidden: true, id: 'InfoPanelService', layout: 'form' } } ); W.show(); }
								  if( v == 10 ){ var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'modulesCombo',	width: 355,	displayField: 'name', tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',	valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', editable: false, store: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({	url: 'config.php', timeout: 380000, method: 'POST' }), reader: new Ext.data.JsonReader({	root: 'results'	}, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string'	}, { name: 'descr', type: 'string' }]),	baseParams: { async_call: 1, devision: 7, getmodules: 1	}, sortInfo: { field: 'id',	direction: "ASC" }, autoLoad: true }), listeners: { select: function() { var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldB').setValue( r.data[this.displayField] ); } S.grpstaff.baseParams.search_ex = this.getValue(); W.close(); } } } ], items: {	hidden: true, id: 'InfoPanelService', layout: 'form' } }); W.show(); }
								  S.grpstaff.baseParams.searchtype = v;	
							  } 
						  } 
						  }, '&nbsp;', new Ext.app.SearchField({ id: 'SearchFieldB', store: S.grpstaff, params: { start: 0, limit: 50 }, width: 190 })], 
						  cm: new Ext.grid.ColumnModel({
							  columns: [{
									  header: Localize.Account, 
									  dataIndex: 'vglogin', 
									  width: 100 
								  }, { 
									  header: Localize.Agreement, 
									  dataIndex: 'agrmnum', 
									  width: 100 
								  }, { 
									  header: Localize.User, 
									  dataIndex: 'username', 
									  id: 'descrGrpAcol' 
								  }, RemoveGrpStaff
							  ],
							  defaults: {
								sortable: true,
								menuDisabled: false
							  }
						  }), 
						  store: S.grpstaff, loadMask: true, autoExpandColumn: 'descrGrpAcol', plugins: RemoveGrpStaff, bbar: new Ext.PagingToolbar({ pageSize: 50, store: S.grpstaff, displayInfo: true }) }] });
		
		PanelItems.push({ columnWidth: 0.5, title: Localize.Free + ' ' + Localize.accounts, layout: 'fit', border: false, 
			items: [{ xtype: 'grid', id: 'bGrpStaff', height: 304, enableDragDrop: true, ddGroup: 'aGrpStaffDD', 
			          tbar: [
					  { xtype: 'button', tooltip: Localize.Choose+' / '+Localize.SelectAll, text: Ext.isIE8 ? ('<img align=middle src=./images/accept.gif> '+Localize.Add) : '', 
			               iconCls: !Ext.isIE8 ? 'ext-accept' : '', 
			               handler: function(){ 
				
								   Ext.getCmp('bGrpStaff').getSelectionModel().selectAll();
								   Ext.Msg.confirm( Localize.Message, Localize.SelectAll + '?' , function( btn ){
								   if( btn == 'yes' ) 
								   {
									   var items = [{ xtype: 'hidden', name: 'savegrpstaff', value: record.data.groupid }]; 
									   var A = Ext.getCmp('bGrpStaff').getSelectionModel().getSelections(); 
									   for(var i = 0, off = A.length; i < off; i++){ items.push({ xtype: 'hidden', name: 'updgrpstaff[]', value: A[i].data.vgid}); }; 
									   compactForm(items, [Ext.getCmp('bGrpStaff').store, Ext.getCmp('aGrpStaff').store]); 
								   }
								   else
								   {
									   Ext.getCmp('bGrpStaff').getSelectionModel().clearSelections();
								   }
			  	 		    } ); 
				 	   } }, 

					  '-', Localize.Search, ':&nbsp;', 
					  { xtype: 'combo', id: 'searchACombo', width: 118, displayField: 'name', valueField: 'id', typeAhead: true, 
						  mode: 'local', triggerAction: 'all', value: 0, editable: false, 
						  store: new Ext.data.SimpleStore({ 
						  data: [['0', Localize.User],
							     ['1', Localize.Agreement], 
							     ['2', Localize.Login],
								 ['7', Localize.Address],
							     ['8', Localize.Tarif],
								 ['9', Localize.Status],
								 ['10', Localize.Agent]
							  ], fields: ['id', 'name'] }), 
						  listeners: { 
							  select: function() 
								  { 
									  var v = this.getValue();
									  if( 8 > v || v > 10 ) { Ext.getCmp( 'SearchFieldA' ).setValue( '' ); }
									  if( v == 8 ) { var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'tarifcombo',	width: 355,	displayField: 'name', valueField: 'id',	mode: 'local', triggerAction: 'all', editable: false, tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]} {[(values.id > 0) ? "(" + values.symbol + ")" : "" ]}</div></tpl>',	listeners: { select: function(){} }, store: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', timeout: 380000, method: 'POST' }), reader: new Ext.data.JsonReader( { root: 'results' }, [	{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'symbol', type: 'string' } ]), autoLoad: true, baseParams: { async_call: 1, devision: 7, gettarifs: 0 }, sortInfo: {	field: 'id', direction: "ASC" }, listeners: { load: function(store){	var row = Ext.data.Record.create([{	name: 'name', type: 'string' }, { name: 'id', type: 'int' }]); } } }), listeners: { select: function()	{ var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldA').setValue( r.data[this.displayField] ); } S.grpfree.baseParams.search_ex = this.getValue(); W.close(); } } } ], items: { hidden: true, id: 'InfoPanelService', layout: 'form' } }); W.show(); }
									  if( v == 9 ) { var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'statecombo', width: 355, displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', value: 0, editable: false, store: new Ext.data.SimpleStore({ data: [ ['0', Ext.app.Localize.get('All')], ['1', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')], ['2', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client')], ['3', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager')], ['5', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic')], ['10', Ext.app.Localize.get('Turned off')] ], fields: ['id', 'name'] }), listeners: { select: function() { var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldA').setValue( r.data[this.displayField] ); } S.grpfree.baseParams.search_ex = this.getValue(); W.close(); } }} ], items: { hidden: true, id: 'InfoPanelService', layout: 'form' } } ); W.show(); }
									  if( v == 10 ){ var W = new Ext.Window({ title: Localize.PleaseSpecify, id: 'AssignWin', modal: true, width: 380, resizable: false, tbar: [ { xtype: 'combo', id: 'modulesCombo',	width: 355,	displayField: 'name', tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',	valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', editable: false, store: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({	url: 'config.php', timeout: 380000, method: 'POST' }), reader: new Ext.data.JsonReader({	root: 'results'	}, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string'	}, { name: 'descr', type: 'string' }]),	baseParams: { async_call: 1, devision: 7, getmodules: 1	}, sortInfo: { field: 'id',	direction: "ASC" }, autoLoad: true }), listeners: { select: function() { var r = this.findRecord( this.valueField, this.getValue() ); if( r ) { Ext.getCmp('SearchFieldA').setValue( r.data[this.displayField] ); } S.grpfree.baseParams.search_ex = this.getValue(); W.close(); } } } ], items: {	hidden: true, id: 'InfoPanelService', layout: 'form' } }); W.show(); }
									  S.grpfree.baseParams.searchtype = v;									  
								  } 
							  } 
						  }, '&nbsp;', new Ext.app.SearchField({ id: 'SearchFieldA', store: S.grpfree, params: { start: 0, limit: 50 }, width: 180 })], 
						  cm: new Ext.grid.ColumnModel({
							  columns: [{
								  header: Localize.Account, 
								  dataIndex: 'vglogin', 
								  width: 100 
							  }, { 
								  header: Localize.Agreement, 
								  dataIndex: 'agrmnum', 
								  width: 100 
							  }, { 
								  header: Localize.User, 
								  dataIndex: 'username', 
								  id: 'descrGrpBcol' 
							  }],
							  defaults: {
								sortable: true,
								menuDisabled: false
							  }
						  }), 
						  store: S.grpfree, 
						  loadMask: true, autoExpandColumn: 'descrGrpBcol', bbar: new Ext.PagingToolbar({ pageSize: 50, store: S.grpfree, displayInfo: true }) }] });
	}

	PanelItems.push({ columnWidth: 0.5, title: Localize.AllowedToSchedule, layout: 'fit', border: false, items: [{ xtype: 'grid', id: 'aTarStaff', height: 304, enableDragDrop: true, ddGroup: 'bTarStaffDD', tbar: [{ xtype: 'button', tooltip: Localize.Save, text: Ext.isIE8 ? ('<img align=middle src=./images/fileexport.gif> '+Localize.Save) : '', iconCls: !Ext.isIE8 ? 'ext-save' : '', handler: function(){ var A = Ext.getCmp('aTarStaff'); var items = [{ xtype: 'hidden', name: 'savetarstaff', value: schType }, { xtype: 'hidden', name: 'tarstaffgroup', value: record.data.groupid }]; Ext.getCmp('aTarStaff').store.each(function(record){ this.push({ xtype: 'hidden', name: 'updtarstaff[]', value: record.data.tarid }); }, items); compactForm(items); } }, '-', Localize.Search + ': ', '&nbsp;', new Ext.app.SearchField({ store: S.tarstaff, filterBy: function(C, D){ if(new RegExp(this.searchValue).test(C.data.tarname)){ return true }; return false; }, width: 200 })], cm: new Ext.grid.ColumnModel([{ header: 'ID', dataIndex: 'tarid', width: 60 }, { header: Localize.Tarif, dataIndex: 'tarname', id: 'descrAcol', renderer: function(value, meta, record){ return value + ' (' + record.data.tarsymbol + ')'; } }, RemoveTarStaff]), store: S.tarstaff, loadMask: true, autoExpandColumn: 'descrAcol', plugins: RemoveTarStaff }] });
	PanelItems.push({ columnWidth: 0.5, title: Localize.Free + ' ' + Localize.tarifs, layout: 'fit', border: false, items: [{ xtype: 'grid', id: 'bTarStaff', height: 304, enableDragDrop: true, ddGroup: 'aTarStaffDD', tbar: [{ xtype: 'button', tooltip: Localize.Add, text:Ext.isIE8 ? ('<img align=middle src=./images/accept.gif> '+Localize.Add) : '', iconCls:!Ext.isIE8 ? 'ext-accept' : '', handler: function(){ var B = Ext.getCmp('bTarStaff'); Ext.each(B.getSelectionModel().getSelections(), modifyRow, { target: Ext.getCmp('aTarStaff'), source: B }); } }, '-', Localize.Search + ': ', '&nbsp;', new Ext.app.SearchField({ store: S.freetars, filterBy: function(C, D){ if(new RegExp(this.searchValue).test(C.data.tarname)){ return true }; return false; }, width: 200 })], cm: new Ext.grid.ColumnModel([{ header: 'ID', dataIndex: 'tarid', width: 60 }, { header: Localize.Tarif, id: 'descrFcol', dataIndex: 'tarname', renderer: function(value, meta, record){ return value + ' (' + record.data.tarsymbol + ')'; } }]), store: S.freetars, loadMask: true, autoExpandColumn: 'descrFcol' }] });

	var W = new Ext.Window({ title: Localize.Union + ': ' + ((Ext.util.Format.trim(record.data.name) != '') ? record.data.name : record.data.descr), width: 850, constrain: true, id: 'UnionEdit', items: [{ xtype: 'panel', layout: 'column', border: false, autoHeight: true, height: 325, items: PanelItems }], listeners: { close: function(){ if(schType == 0){ Ext.getCmp('AccUnionGrid').store.reload(); } } } }).show();

	modifyRow = function(record, index){ var F = this.target.store.find('tarid', new RegExp('^'+record.data.tarid+'$')); if(F == -1){ this.target.store.add(record); this.target.store.sort('tarid', 'ASC'); this.source.store.remove(record); } };
	RemoveTarStaff.on('action', function(grid, record, index){ Ext.each([record], modifyRow, { target: Ext.getCmp('bTarStaff'), source: grid }); });
	var aTarStaffDDEl =  Ext.getCmp('aTarStaff').getView().el.dom.childNodes[0].childNodes[1];
	var aTarStaffDDTarget = new Ext.dd.DropTarget(aTarStaffDDEl, { ddGroup: 'aTarStaffDD', copy: true, notifyDrop: function(ddSource, e, data){ Ext.each(ddSource.dragData.selections, modifyRow, { target: Ext.getCmp('aTarStaff'), source: Ext.getCmp('bTarStaff') }); return(true); } });
	var bTarStaffDDEl =  Ext.getCmp('bTarStaff').getView().el.dom.childNodes[0].childNodes[1];
	var bTarStaffDDTarget = new Ext.dd.DropTarget(bTarStaffDDEl, { ddGroup: 'bTarStaffDD', copy: true, notifyDrop: function(ddSource, e, data){ Ext.each(ddSource.dragData.selections, modifyRow, { target: Ext.getCmp('bTarStaff'), source: Ext.getCmp('aTarStaff') }); return(true); } });
	if(schType == 0) {
		S.grpstaff.reload({ params: { start: 0, limit: 50 } }); S.grpfree.reload({ params: { start: 0, limit: 50 } });
		RemoveGrpStaff.on('action', function(g, r){ var items = [{ xtype: 'hidden', name: 'savegrpstaff', value: record.data.groupid }]; items.push({ xtype: 'hidden', name: 'delgrpstaff[]', value: r.data.vgid }); compactForm(items, [g.store, Ext.getCmp('bGrpStaff').store]); });
		var aGrpStaffDDEl =  Ext.getCmp('aGrpStaff').getView().el.dom.childNodes[0].childNodes[1];
		var aGrpStaffDDTarget = new Ext.dd.DropTarget(aGrpStaffDDEl, { ddGroup: 'aGrpStaffDD', copy: true, notifyDrop: function(ddSource, e, data){ var items = [{ xtype: 'hidden', name: 'savegrpstaff', value: record.data.groupid }]; for(var i = 0, off = ddSource.dragData.selections.length; i < off; i++){ items.push({ xtype: 'hidden', name: 'updgrpstaff[]', value: ddSource.dragData.selections[i].data.vgid }); }; compactForm(items, [Ext.getCmp('aGrpStaff').store, Ext.getCmp('bGrpStaff').store]); return(true); } });
		var bGrpStaffDDEl =  Ext.getCmp('bGrpStaff').getView().el.dom.childNodes[0].childNodes[1];
		var bGrpStaffDDTarget = new Ext.dd.DropTarget(bGrpStaffDDEl, { ddGroup: 'bGrpStaffDD', copy: true, notifyDrop: function(ddSource, e, data){ var items = [{ xtype: 'hidden', name: 'savegrpstaff', value: record.data.groupid }]; for(var i = 0, off = ddSource.dragData.selections.length; i < off; i++){ items.push({ xtype: 'hidden', name: 'delgrpstaff[]', value: ddSource.dragData.selections[i].data.vgid }); }; compactForm(items, [Ext.getCmp('aGrpStaff').store, Ext.getCmp('bGrpStaff').store]); return(true); } });
	}
} // end editUnion()

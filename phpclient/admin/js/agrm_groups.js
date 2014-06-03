/**
 * Agreements groups:
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	showAgrmGroupsPanel('AgrmGroupsPanel');
});

function showAgrmGroupsPanel(A) {
    if (!document.getElementById(A)) {
        return;
    }
	var PAGELIMIT = 100;
	
	// CARD 0: Grid buttons
	var fcDelete = new Ext.grid.RowButton({ 
		header: '&nbsp;', 
		qtip: Ext.app.Localize.get('Remove'), 
		width: 22, 
		iconCls: 'ext-drop'
	});
	
	var fcEdit = new Ext.grid.RowButton({ 
		header: '&nbsp;', 
		qtip: Ext.app.Localize.get('Edit'), 
		width: 22, 
		iconCls: 'ext-edit'
	});
	
	var fcPayment = new Ext.grid.RowButton({ 
		header: '&nbsp;', 
		qtip: Ext.app.Localize.get('DD and CD charges'), 
		width: 26, 
		iconCls: 'ext-add-many'
	});
	
	var fcAddons = new Ext.grid.RowButton({ 
		header: '&nbsp;', 
		qtip: Ext.app.Localize.get('Assign additional field'), 
		width: 22, 
		iconCls: 'ext-mainleaf'
	});
	
	// Button actions
    fcEdit.on('action', function(grid, record, idx) {
        grid.findParentByType('panel').getLayout().setActiveItem(1);
		grid.findParentByType('panel').get(1).get(0).get('name').setValue(record.get('name'));
		grid.findParentByType('panel').get(1).get(0).get('descr').setValue(record.get('descr'));
		loadGridPanel(record.get('groupid'));
    });
	
    fcDelete.on('action', function(grid, record, idx) {		
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('DelConfirm'), function(B){
            if (B != 'yes') { return; }
			Ext.Ajax.request({
				url: 'config.php',
				method: 'POST',
				timeout: 380000,
				params: Ext.apply({
					async_call: 1,
					devision: 28,
					delagrmgroup: record.get('groupid')
				}),
				callback: function(opt, success, res) {
					try {
						var result = Ext.decode(res.responseText);
						if(!result.success && result.error) {
							throw(result.error);
						}
						grid.getStore().reload();
					}
					catch(e) {
						Ext.Msg.error(e);
					}
				}
			});
        });		
    });		
	
    fcPayment.on('action', function(grid, record, idx) {
		PayWin.get(0).getForm().findField('groupid').setValue(record.get('groupid'));
		PayWin.show();
    });
	
    fcAddons.on('action', function(grid, record, idx) {
		Addons.get(0).getForm().findField('groupid').setValue(record.get('groupid'));
		Addons.show();
    });
	
	// END card 0 grid buttons
	
	/**
	*	Mass payments window
	*/
    var PayWin = new Ext.Window({
    	modal: true,
		width: '380',
		title: Ext.app.Localize.get('DD and CD charges'),
		closeAction: 'hide',
		listeners: {
			beforeshow: function(win) {
				win.get(0).getForm().findField('payclass').getStore().reload();
			},
			hide: function(win) {
				var form = win.get(0).getForm();
				form.reset();
			}
		},
		items: [{
			xtype: 'form',
			frame: true,
			layout: 'form',
			labelWidth: 120,
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 28
			}, {
				xtype: 'hidden',
				name: 'candeldebt',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'groupid',
				value: 0
			}, {
				xtype: 'combo',
				itemId: 'payclass',
				hiddenName: 'payclass',
				triggerAction: 'all',
				anchor: '98%',
				fieldLabel: Ext.app.Localize.get('Class of payments'),
				mode: 'local',
				allowBlank: false,
				editable: false,
				valueField: 'classid',
				displayField: 'classname',
				store: {
					xtype: 'jsonstore',
					root: 'results',
					baseParams: {
						async_call: 1,
						devision: 331, // settings.php
						getpayclass: 1
					},
					fields: ['classid', 'classname']
				}
			}, {
				xtype: 'datefield',
				fieldLabel: Ext.app.Localize.get('Date'),
				name: 'paydate',
				anchor: '98%',
				format: 'Y-m-d',
				editable: false
			}, {
				xtype: 'textfield',
				fieldLabel: Ext.app.Localize.get('Comment'),
				name: 'paycomment',
				anchor: '98%'
			}],
			buttonAlign: 'center',
			buttons: [{
				text: Ext.app.Localize.get('Apply'),
				handler: function(Btn) {
					var form = Btn.findParentByType('form').getForm();
					if(form.findField('groupid') == 0) { return; }
					 // submiting form
					form.submit({
                        method: 'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action){
							var result = Ext.decode(action.response.responseText);
							if(!result.success && result.error) {
								throw(result.error);
							}
							form.reset();
                            Btn.findParentByType('window').hide();
                        },
                        failure: function(form, action){
                            if (action.failureType == 'server') {
                                obj = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', Ext.app.Localize.get(obj.error));
                            }
                        }
                    }); // end submit
					
				}
			}, {
				text: Ext.app.Localize.get('Cancel'),
				handler: function(Btn) {
					var form = Btn.findParentByType('form').getForm();
					form.reset();
                    Btn.findParentByType('window').hide();
				}
			}]
		}]
    });
	
	/**
	*	Assing agrm addons to agrm group
	*/
    var Addons = new Ext.Window({
    	modal: true,
		width: '360',
		title: Ext.app.Localize.get('Assign additional field'),
		closeAction: 'hide',
		listeners: {
			beforeshow: function(win) {
				win.get(0).getForm().findField('ftype').getStore().reload();
			},
			hide: function(win) {
				Ext.getCmp('addonSubmitBtn').disable();
				var form = win.get(0).getForm();
				form.reset();
			}
		},
		items: [{
			xtype: 'form',
			frame: true,
			layout: 'form',
			labelWidth: 100,
			items: [{
				xtype: 'hidden',
				name: 'async_call',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'devision',
				value: 28
			}, {
				xtype: 'hidden',
				name: 'setgroupaddon',
				value: 1
			}, {
				xtype: 'hidden',
				name: 'idx',
				value: 0
			}, {
				xtype: 'hidden',
				name: 'addonvalue'
			}, {
				xtype: 'hidden',
				name: 'addonname'
			}, {
				xtype: 'hidden',
				name: 'groupid',
				value: 0
			}, {
				xtype: 'combo',
				itemId: 'ftype',
				triggerAction: 'all',
				width: 220,
				fieldLabel: Ext.app.Localize.get('Field'),
				mode: 'local',
				allowBlank: false,
				editable: false,
				valueField: 'name',
				displayField: 'descr',
				store: {
					xtype: 'jsonstore',
					root: 'results',
					fields: ['type', 'name', 'descr'],
					baseParams: {
						async_call: 1,
						devision: 22,
						getafrmfds: 0
					}
				},
				listeners: {
					select: function(combo, record) {
						var cnt = combo.ownerCt.get('fCnt');
						combo.findParentByType('form').getForm().findField('addonname').setValue(record.get('name'));
						
						switch(record.get('type')) {
						case 0:
							cnt.get('flist').hide(); cnt.get('flist').disable();
							cnt.get('ftext').show();
							cnt.get('ftext').enable();
							Ext.getCmp('addonSubmitBtn').enable();
						break;
						case 1:
							cnt.get('ftext').hide(); cnt.get('ftext').disable();
							cnt.get('flist').show();
							cnt.get('flist').enable();
							cnt.get('flist').setRawValue(null); 
							cnt.get('flist').setValue(null);
							cnt.get('flist').getStore().setBaseParam('fname', record.get('name')).reload();
						break;
						}
					} 
				}
			}, {
				xtype: 'container',
				itemId: 'fCnt',
				fieldLabel: Ext.app.Localize.get('Value'),
				anchor: '98%',
				items: [{
					xtype: 'combo',
					itemId: 'flist',
					triggerAction: 'all',
					width: 220,
					hidden: true,
					mode: 'local',
					allowBlank: false,
					editable: false,
					valueField: 'idx',
					displayField: 'value',
					store: {
						xtype: 'jsonstore',
						root: 'results',
						fields: ['idx', 'name', 'value'],
						baseParams: {
							async_call: 1,
							devision: 28,
							getagrmaddons: 1
						}
					},
					listeners: {
						select: function(combo, record) {
							var form = combo.findParentByType('form').getForm();
							form.findField('idx').setValue(record.get('idx'));
							form.findField('addonvalue').setValue(record.get('value'));
							Ext.getCmp('addonSubmitBtn').enable();
						}
					}
				}, {
					xtype: 'textfield',
					itemId: 'ftext',
					width: 220,
					disabled: true,
					name: 'nametext'
				}]
			}],
			buttonAlign: 'center',
			buttons: [{
				text: Ext.app.Localize.get('Assign'),
				disabled: true,
				id: 'addonSubmitBtn',
				handler: function(Btn) {
					var form = Btn.findParentByType('form').getForm();
					 // submiting form
					form.submit({
                        method: 'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action){
							var result = Ext.decode(action.response.responseText);
							if(!result.success && result.error) {
								throw(result.error);
							}
							form.reset();
                            Btn.findParentByType('window').hide();
                        },
                        failure: function(form, action){
                            if (action.failureType == 'server') {
                                obj = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', Ext.app.Localize.get(obj.error));
                            }
                        }
                    }); // end submit
					
				}
			}, {
				text: Ext.app.Localize.get('Cancel'),
				handler: function(Btn) {
					var form = Btn.findParentByType('form').getForm();
					form.reset();
                    Btn.findParentByType('window').hide();
				}
			}]
		}]
    });
	
	/**
	 * Making of: Two grids with drag'n'drop data replacing method
	 */

	var firstGridStore = new Ext.data.JsonStore({
		root: 'results',
		totalProperty: 'total',
		baseParams: {
			async_call: 1,
			devision: 28,
			getagrmlist: 1,
			start: 0,
			limit: PAGELIMIT
		},
		fields: ['agrmid', 'number']
	});

	var secondGridStore = new Ext.data.JsonStore({
		root: 'results',
		totalProperty: 'total',
		baseParams: {
			async_call: 1,
			devision: 28,
			getagrmlist: 1,
			start: 0,
			limit: PAGELIMIT
		},
		fields: ['agrmid', 'number']
	});

	var cols = [{ 
		id:'uid',
		header:'ID',
		width: 40,
		dataIndex: 'agrmid'
	}, {
		id:'name',
		header: Ext.app.Localize.get('Agreement number'),
		width: 210,
		sortable: true,
		dataIndex: 'number'
	}];

	/*
	 * firstGrid of agreements groups
	 */
	var firstGrid = new Ext.grid.GridPanel({
		id:'firstgrid',
		title: Ext.app.Localize.get('Used'),
		ddGroup: 'secondGridDDGroup',
		enableDragDrop: true,
		store: firstGridStore,
		loadMask: { msg: Ext.app.Localize.get('Loading') },
		border: true,
		columns: cols,
		stripeRows: true,
		autoExpandColumn: 'name',
		tbar: [{xtype:'button',text:Ext.app.Localize.get('To applay the filter'),iconCls: 'ext-search',handler:function(){reloadGrid(firstGrid,Ext.get('groupid').getValue());}}],
		bbar: new Ext.PagingToolbar({ pageSize:100, store:firstGridStore, displayInfo: true }),
		height: 340
	});
	//end firstGrid

	/*
	 * secondGrid of agreements groups
	 */
	var secondGrid = new Ext.grid.GridPanel({
		id:'secondgrid',
		title: Ext.app.Localize.get('Free'),
		ddGroup: 'firstGridDDGroup',
		enableDragDrop: true,
		store: secondGridStore,
		loadMask: { msg: Ext.app.Localize.get('Loading') },
		border: true,
		columns: cols,
		stripeRows: true,
		autoExpandColumn : 'name',
		tbar:[{xtype:'button',text:Ext.app.Localize.get('To applay the filter'),iconCls: 'ext-search',handler:function(){reloadGrid(secondGrid,Ext.get('groupid').getValue());}}],
		bbar: new Ext.PagingToolbar({ pageSize:100, store:secondGridStore, displayInfo: true}),
		height: 340
	});
	//end secondGrid

	//Begin of dndGridsPanel
	var dndGridsPanel = new Ext.Panel({
		id: 'dndGridsPanel',
		disabled: Ext.get('groupid')>0 ? 0 : 1,
		border: false,
		height: 385,
		layout: 'hbox',
		defaults: { flex : 1 },
		layoutConfig: { align : 'stretch' },
		items: [ firstGrid,	secondGrid ]
	});
	//End of dndGridsPanel
	
	
	var uploadWin = new Ext.Window({
		id: 'uploadWin',
		title: Ext.app.Localize.get('Upload file'),
		width: 340,
		closeAction: 'hide',
		items: {
			xtype: 'form',
			url: 'config.php',
			width: 320,
			autoHeight: true,
			fileUpload: true,
			bodyStyle: 'padding: 3px 3px 0 3px;',
			labelWidth: 35,
			defaults: {
				anchor: '95%',
				allowBlank: false
			},
			frame: true,
			items: [
				{ xtype: 'hidden', name: 'devision',        value: 28 },
				{ xtype: 'hidden', name: 'async_call',      value: 1 },
				{ xtype: 'hidden', name: 'fromfile',      value: 1 },
				{ xtype: 'hidden', name: 'groupid', value: Ext.get('groupid').getValue() },
				{ xtype: 'hidden', name: 'setagrmgroupstaff', value: 1 },
				{
					xtype: 'fileuploadfield',
					allowBlank: false,
					fieldLabel: Ext.app.Localize.get('File'),
					name: 'upcontent',
					id: 'upcontent',
					buttonCfg: {
						text: '',
						iconCls: 'ext-upload'
					}
				}
			],
			buttons: [{
				text: Ext.app.Localize.get('Upload'),
				handler: sendData
			}, {
				text: Ext.app.Localize.get('Cancel'),
				handler: function(){
					uploadWin.hide();
				}
			}]
		}
	});
	
	
	
	/*
	 * Generate main panel
	 */
	new Ext.Panel({
		id: 'mainAgrmGroupsPanel',
	    frame: false,
	    bodyStyle: 'padding:0px',
	    border: false,
	    layout: 'card',
	    width: 900,
		height: 500,
	    renderTo: A,
		activeItem: 0,
	    items: [{ // First card start here
			xtype: 'grid',
			title: Ext.app.Localize.get('Agreements groups'),
			anchor: '100%',
			tbar: [{
				xtype: 'button',
				iconCls: 'ext-add',
				text: Ext.app.Localize.get('Add'),
				handler: function(Btn) {
					Btn.findParentByType('panel').getLayout().setActiveItem(1);
					firstGridStore.removeAll();
					secondGridStore.removeAll();
					dndGridsPanel.disable();
				}
			}],
			plugins: [fcEdit, fcDelete, fcPayment, fcAddons],
			columns: [fcEdit, fcPayment, fcAddons, {
				header: 'ID',
				dataIndex: 'groupid',
				width: 40
			}, {
				header: Ext.app.Localize.get('Agreements'),
				dataIndex: 'agrms',
				width: 120
			}, {
				header: Ext.app.Localize.get('Name'),
				dataIndex: 'name',
				width: 260
			}, {
				header: Ext.app.Localize.get('Description'),
				dataIndex: 'descr',
				width: 430
			}, fcDelete],
            store: {
                xtype: 'jsonstore',
				autoLoad: true,
                root: 'results',
                fields: ['groupid', 'agrms', 'name', 'descr'],
                baseParams: {
                	async_call: 1,
                	devision: 28,
                	getagrmgroups: 1
                }
            }
		}, // First card end
		
		// Second card start here
		{
			xtype: 'panel',
			title: Ext.app.Localize.get('Agreements groups'),
			anchor: '100%',
			fileUpload: true,
			tbar: [{
				xtype: 'button',
				iconCls: 'ext-arrow-left',
				text: Ext.app.Localize.get('Go back'),
				handler: function(Btn) {
					Ext.get('groupid').set({value: 0});
					Btn.findParentByType('panel').get(0).get('name').setValue(null);
					Btn.findParentByType('panel').get(0).get('descr').setValue(null);
					Ext.getCmp('mainAgrmGroupsPanel').getLayout().setActiveItem(0);
					Ext.getCmp('mainAgrmGroupsPanel').get(0).getStore().reload();
				}
			}, '|' ,{
				xtype: 'button',
				iconCls: 'ext-save',
				text: Ext.app.Localize.get('Save'),
				handler: function(Btn) {
					var fieldName = Btn.findParentByType('panel').get(0).get('name').getValue(),
						fieldDescr = Btn.findParentByType('panel').get(0).get('descr').getValue();
						
					if(Ext.isEmpty(fieldName)) return;
											
					Ext.Ajax.request({
						url: 'config.php',
						method: 'POST',
						timeout: 380000,
						params: Ext.apply({
							async_call: 1,
							devision: 28,
							setagrmgroup: 1,
							groupid: Ext.get('groupid').getValue(),
							name: fieldName,
							descr: fieldDescr
						}),
						callback: function(opt, success, res) {
							try {
								var result = Ext.decode(res.responseText);
								if(!result.success && result.error) {
									throw(result.error);
								}
								if(!Ext.isEmpty(result.results) && result.results>0) {
									loadGridPanel( result.results );
									Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Data is successfully saved'));
								} 
							}
							catch(e) {
								Ext.Msg.error(e);
							}
						}
					});					
				}
			}, '|' , {
				xtype: 'button',
				id: 'fileUploadBtn',
				text: Ext.app.Localize.get('Upload file'),
				disabled: true,
				iconCls: 'ext-upload',
				handler: function(Btn) {
					uploadWin.show();
				}
			}],
			items: [{
				xtype: 'panel',
				cls: 'x-form',
				anchor: '100%',
				frame: true,
				layout: 'hbox',
				items: [
				{ xtype: 'tbspacer', width: 40 },
				{ xtype: 'tbtext', text: Ext.app.Localize.get('Name') + ':', style: 'margin-top: 3px;'},
				{ xtype: 'tbspacer', width: 5 },
				{ xtype: 'textfield', width: 220, itemId: 'name', allowBlank: false }, 
				{ xtype: 'tbspacer', width: 50 },
				{ xtype: 'tbtext', text: Ext.app.Localize.get('Description') + ':', style: 'margin-top: 3px;' },
				{ xtype: 'tbspacer', width: 5 },
				{ xtype: 'textfield', width: 350, itemId: 'descr' } 
				]
			}, dndGridsPanel ] // Drag'n'Drop grids panel
		}]
	});	 // end of main panel
	
	
	
	/*
	 * Drag'n'Drop grids actions
	 */
	var firstGridDropTargetEl = firstGrid.getView().scroller.dom; // This will make sure we only drop to the view scroller element
	var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
		ddGroup: 'firstGridDDGroup',
		notifyDrop: function(ddSource, e, data){
			var records = ddSource.dragData.selections;
			Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
			firstGrid.store.add(records);
			firstGrid.store.sort('name', 'ASC');
			// start data inserting to first grid
			
			var agrmdata = '';
			Ext.each(records,function(r){
				var item = r.data.number;
				agrmdata = agrmdata + item + ',';
			});
			
			Ext.Ajax.request({
				url: 'config.php',
				method: 'POST',
				timeout: 380000,
				params: Ext.apply({
					async_call: 1,
					devision: 28,
					setagrmgroupstaff: 1,
					groupid: Ext.get('groupid').getValue(),
					number: agrmdata
				}),
				callback: function(opt, success, res) {
					try {
						var result = Ext.decode(res.responseText);
						if(!result.success && result.error) {
							throw(result.error);
						}
					}
					catch(e) {
						Ext.Msg.error(e);
					}
				}
			});	
			// end data inserting
			return true;
		}
	});


	
	var secondGridDropTargetEl = secondGrid.getView().scroller.dom; // This will make sure we only drop to the view scroller element
	var secondGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
		ddGroup: 'secondGridDDGroup',
		notifyDrop: function(ddSource, e, data){
			var records = ddSource.dragData.selections;
			Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
			secondGrid.store.add(records);
			secondGrid.store.sort('name', 'ASC');
			// start data inserting to second grid
			var agrmdata = '';
			Ext.each(records,function(r){
				var item = r.data.number;
				agrmdata = agrmdata + item + ',';
			});
			
			Ext.Ajax.request({
				url: 'config.php',
				method: 'POST',
				timeout: 380000,
				params: Ext.apply({
					async_call: 1,
					devision: 28,
					delagrmgroupstaff: 1,
					groupid: Ext.get('groupid').getValue(),
					number: agrmdata
				}),
				callback: function(opt, success, res) {
					try {
						var result = Ext.decode(res.responseText);
						if(!result.success && result.error) {
							throw(result.error);
						}
						secondGrid.getStore().reload();
					}
					catch(e) {
						Ext.Msg.error(e);
					}
				}
			});		
			// end data inserting
			return true;
		}
	});
		
} // end showAgrmGroupsPanel()


// Loading D'n'D grids panel
function loadGridPanel( groupid ) {
	var gridPanel = Ext.getCmp('dndGridsPanel');
	Ext.get('groupid').set({'value': groupid});
	Ext.getCmp('fileUploadBtn').enable();
	gridPanel.enable();
	gridPanel.get(0).getStore().setBaseParam('groupid', groupid).reload();
	gridPanel.get(1).getStore().setBaseParam('notgroup', groupid).reload();
} 



function reloadGrid(grid,groupid){
	groupid = groupid.value;
	if (grid.id=='firstgrid')  var p =	{async_call: 1, devision: 28, getagrmlist:1, groupid: groupid, limit:100, start:0};
	if (grid.id=='secondgrid') var p =	{async_call: 1, devision: 28, getagrmlist:1, notgroup: groupid, limit:100, start:0};
	grid.store.baseParams=p;
	grid.store.baseParams.start=0;
	grid.store.load();
}



// sendData() - upload data from file
function sendData(button){
	var form = button.findParentByType('form');
	var gridPanel = Ext.getCmp('dndGridsPanel');
	if(Ext.isEmpty(Ext.getCmp('upcontent').getValue())) { return; }
	form.getForm().findField('groupid').setValue(Ext.get('groupid').getValue());
	form.getForm().submit({
		method: 'POST',
		waitTitle: Ext.app.Localize.get('Connecting'),
		waitMsg: Ext.app.Localize.get('Sending data') + '...',
		success: function(form, action){
			var data = Ext.util.JSON.decode(action.response.responseText);
			if (!Ext.isEmpty(data.failedAgrmIds) && data.failedAgrmIds.length > 0) {
				var failedAgrmString = data.failedAgrmIds.join(', ');
				Ext.Msg.alert(
					Ext.app.Localize.get('Information'), 
					Ext.app.Localize.get('Agreement data have been successfully uploaded except for numbers not found in the system') + ': ' + failedAgrmString
				);
			}
			gridPanel.get(0).getStore().reload();
			gridPanel.get(1).getStore().reload();
			Ext.getCmp('uploadWin').hide();
		},
		failure: function(form, action){
            if (action.failureType == 'server') {
				var res = Ext.util.JSON.decode(action.response.responseText);
				if(Ext.isEmpty(res.error)) {
					gridPanel.get(0).getStore().reload();
					gridPanel.get(1).getStore().reload();
				}
				if (!Ext.isArray(res.error)) {
					Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(res.error));
				}
				else {
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
				}
				Ext.getCmp('uploadWin').hide();
			}
		}
	});
} // end sendData()

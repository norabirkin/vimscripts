/**
 * Storages collection object
 * Before save call function extract in this object
 * Result there will be created hidden elements
 */


/**
 * Run when document is already loaded
 *
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	// Show catalogue control Panel to edit catalog and and or modify its entries
	showCatPanel('cataloguePanel');
}); // end Ext.onReady()


/**
 * Show catalog control panel to create new record ot modify existing
 * @param	string, render to DOM element
 */
function showCatPanel( renderTo )
{
	if(!document.getElementById(renderTo))  { return; }
	
	checkIdSave = function(store) { return; var modified =  false; if(store.getCount() > 0) { if(store.find('zoneid', 0) != -1) { modified = true; } else if(store.getModifiedRecords().length > 0) { modified = true } }; if(Drop.data.length > 0) { modified = true; }; if(modified == true) { Ext.getCmp('catGrid').stopEditing(); saveCatContent(Store, Drop, false); Drop.data = []; } }
	
	var Drop = { data: [] };
	var Rows = Ext.data.Record.create([
		{ name: 'catid', type: 'int' }, 
		{ name: 'zoneid', type: 'int' }, 
		{ name: 'zoneas', type: 'int' }, 
		{ name: 'descr', type: 'string' }, 
		{ name: 'zoneip', type: 'string' }, 
		{ name: 'zonemask', type: 'int' }, 
		{ name: 'proto', type: 'int' }, 
		{ name: 'port', type: 'int' }, 
		{ name: 'zoneclass', type: 'int' }, 
		{ name: 'zonenum', type: 'string' }
	]);
	
	var Store = new Ext.data.Store({ 
		proxy: new Ext.data.HttpProxy({ 
			url: 'config.php', 
			method: 'POST' 
		}), 
		reader: new Ext.data.JsonReader({ 
			root: 'results', 
			totalProperty: 'total' 
		}, Rows), 
		baseParams: { 
			async_call: 1, 
			devision: 17, 
			getcontent: 0, 
			cattype: 0, 
			searchtype: 0 
		}, 
		listeners: { 
			beforeload: checkIdSave 
		} 
	});
	
	var Oper = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'nameelipse', type: 'string' } ]), baseParams: { async_call: 1, devision: 17, operators: 1 }, autoLoad: true, listeners: { load: function(store){ store.each(function(record){ record.data.nameelipse = Ext.util.Format.ellipsis(record.data.name, 30) }) }} });
	var Classes = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'nameelipse', type: 'string' } ]), baseParams: { async_call: 1, devision: 17, gettelclass: 1 }, autoLoad: true, listeners: { load: function(store){ store.each(function(record){ record.data.nameelipse = Ext.util.Format.ellipsis(record.data.name, 20) }) }} });
	
	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
		width:280, initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); },
		validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search',
		onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } },
		onTrigger2Click : function(){ var v = this.getRawValue(); if(v.length < 1){ this.onTrigger1Click(); return; } var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); }
	});
	
	renderClass = function(value, meta, record) { 
		var storeData = Classes.getRange();
		var classRec = -1;
		for(var i = 0; i < storeData.length; i++){
			if(storeData[i].id == value){
				classRec = i;
				break;
			}
		}
		if(classRec > -1){ 
			return Classes.getAt(classRec).data.nameelipse;
		} else { 
			return value;
		} 
	}
	var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'zoneid', width: 22, sortable: false, iconCls: 'ext-drop' });
	var colModel = new Ext.grid.ColumnModel([
		{ header: "IP", dataIndex: 'zoneip', width: 120, sortable: true, hidden: true, editor: new Ext.form.TextField({ allowBlank: false, maskRe: new RegExp("[0-9|\.]") })}, 
		{ header: Localize.Mask, dataIndex: 'zonemask', width: 55, hidden: true, editor: new Ext.form.NumberField({ allowBlank: false, allowNegative: false, maxValue: 32 })}, 
		{ header: Localize.Protocol, dataIndex: 'proto', width: 95, sortable: true, hidden: true, editor: new Ext.form.NumberField({ allowBlank: false, allowNegative: false, maxValue: 255 })}, 
		{ header: Localize.Port, dataIndex: 'port', width: 95, sortable: true, hidden: true, editor: new Ext.form.NumberField({ allowBlank: false, allowNegative: false, maxValue: 65535 })}, 
		{ header: Localize.Number, dataIndex: 'zoneas', width: 150, sortable: true, hidden: true, editor: new Ext.form.NumberField({ allowBlank: false, allowNegative: false, maxValue: 65000 })}, 
		{ header: Localize.Number, dataIndex: 'zonenum', width: 150, sortable: true, hidden: true, editor: new Ext.form.TextField({ allowBlank: false })},
		{ header: Localize.DirClass, dataIndex: 'zoneclass', width: 130, sortable: true, hidden: true, renderer: renderClass, editor: new Ext.form.ComboBox({  displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', lazyRender: true, store: Classes })},
		{ header: Localize.Description, id: 'descr', dataIndex: 'descr', sortable: true, editor: new Ext.form.TextField({allowBlank: false })}, 
		
		{ header: Ext.app.Localize.get('Service name'), id: 'servicename', hidden: true, flex: 1,  dataIndex: 'servicename', sortable: true, editor: new Ext.form.TextField({allowBlank: false })}, 
		{ header: Ext.app.Localize.get('Charge type'), id: 'common', hidden: true,  dataIndex: 'common', sortable: true, editor: new Ext.form.TextField({allowBlank: false })}, 
		{ header: Ext.app.Localize.get('Text code'), id: 'code', hidden: true,  dataIndex: 'code', sortable: true, editor: new Ext.form.TextField({allowBlank: false })},
		{ header: Ext.app.Localize.get('Service type'), id: 'servtype', hidden: true, dataIndex: 'servtype', sortable: true, editor: new Ext.form.TextField({allowBlank: false })},
		
	Remove]);
	
	addRecord = function() { 
		try {
			var row = new Rows({ catid: Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.catid, zoneid: 0, zoneas: 0, descr: Localize.Description, zoneip: '127.0.0.1', zonemask: 32, proto: 0, port: 0, zoneclass: 0, zonenum: ''}); var grid = Ext.getCmp('catGrid'); grid.stopEditing(); 
			grid.store.insert(0, row); 
		}
		catch(e){ 
			
		}
	}
	
	removeCat = function(){
		sendForm = function() {
			var form = new Ext.FormPanel({
				id: 'delCat',
				renderTo: Ext.getBody(),
				url: 'config.php',
				items: [{ xtype: 'hidden', name: 'async_call', value: 1 }, 
				{ xtype: 'hidden', name: 'devision', value: 17 }, 
				{ xtype: 'hidden', name: 'catdelete', value: Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.catid }]
			});
			
			form.getForm().submit({
				method: 'POST',
				waitTitle: Localize.Connecting,
				waitMsg: Localize.SendingData + '...',
				success: function(form, action){
					Ext.getCmp('catList').root.reload();
					form.destroy();
				},
				failure: function(form, action){
					if (action.failureType == 'server') {
						obj = Ext.util.JSON.decode(action.response.responseText);
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
						form.destroy();
					};
				}
			});
		}
		
		if(Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.used > 0) {
			Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Catalogue data is in use'), 
				function(B) {
					if(B == 'yes') {
						sendForm();
					}
				}
			);
		}
		else {
			sendForm();
		}
	};
	
    removeRec = function(grid, record, rowIndex, e){
		Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Delete direction in any case, if it is used in the tarif')+'?', function(B){
			if(B == 'yes') {
		        grid.stopEditing();
		        if (record.data.zoneid > 0) {
		            Drop.data[Drop.data.length] = record.data;
		        };
		        grid.store.remove(record);
			} else {
				return;
			}
			
		});
       
    }
	
	var dirClasses = function(b){
        var Remove = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Localize.Remove,
            dataIndex: 'id',
            width: 22,
            sortable: false,
            iconCls: 'ext-drop'
        });
		
		Remove.on('action', function(g,r,idx){
			if(r.data.id > 0){
				g.removed.push(r.data.id);
			}
			g.store.remove(r)
		});
		
		new Ext.Window({
			title: Localize.DirClasses,
			width: 500,
			constrain: true,
			modal: true,
			items: {
				xtype: 'editorgrid',
				loadMask: true,
				height: 300,
				autoExpandColumn: 'dirClassDescr',
				loadMask: true,
				clicksToEdit: 1,
				removed: [],
				tbar: [{
					xtype: 'button',
					text: Localize.Save,
					iconCls: 'ext-save',
					handler: function(b){
						var items = [];
						if(b.ownerCt.ownerCt.removed.length > 0){
							Ext.each(b.ownerCt.ownerCt.removed, function(item){
								this.push({ xtype: 'hidden', name: 'savetelclass[removed][]', value: item })
							}, items)
						}
						b.ownerCt.ownerCt.removed = [];
						var modif = b.ownerCt.ownerCt.store.getModifiedRecords();
						if(!Ext.isEmpty(modif)){
							Ext.each(modif, function(item, idx){
								this.push({ xtype: 'hidden', name: 'savetelclass[modified][' + idx + '][id]', value: item.data.id });
								this.push({ xtype: 'hidden', name: 'savetelclass[modified][' + idx + '][name]', value: item.data.name });
								this.push({ xtype: 'hidden', name: 'savetelclass[modified][' + idx + '][descr]', value: item.data.descr });
							}, items)
						}
						if(items.length > 0){
							items.push({ xtype: 'hidden', name: 'async_call', value: 1 });
							items.push({ xtype: 'hidden', name: 'devision', value: 17 });
							var form = new Ext.form.FormPanel({
								renderTo: Ext.getBody(),
								url: 'config.php',
								items: items
							});
					        form.getForm().submit({
					            method: 'POST',
					            waitTitle: Localize.Connecting,
					            waitMsg: Localize.SendingData + '...',
								scope: b.ownerCt.ownerCt,
					            success: function(form, action){
									this.store.rejectChanges();
									this.store.reload();
					                form.destroy();
					            },
					            failure: function(form, action){
					                if (action.failureType == 'server') {
					                    obj = Ext.util.JSON.decode(action.response.responseText);
					                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
					                };
					                form.destroy();
					            }
					        });
						}
					}
				}, {
					xtype: 'button',
					text: Localize.Add,
					iconCls: 'ext-add',
					handler: function(){
						this.ownerCt.ownerCt.stopEditing()
						this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({ id: -1, name: '', descr: '' }));
					}
				}],
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
						{ name: 'descr', type: 'string' }
					]),
					baseParams: {
					    async_call: 1,
					    devision: 17,
					    gettelclass: 1
					},
					sortInfo: {
					    field: 'name',
					    direction: 'ASC'
					},
					autoLoad: true
				}),
				cm: new Ext.grid.ColumnModel({
					defaults: {
						sortable: true,
						menuDisabled: true
					}, 
					columns: [{
						header: 'Name',
						dataIndex: 'name',
						width: 160,
						editor: new Ext.form.TextField({
							allowBlank: false
						})
					}, {
						header: 'Description',
						id: 'dirClassDescr',
						dataIndex: 'descr',
						editor: new Ext.form.TextField({
							allowBlank: false
						})
					}, Remove]
				}),
				plugins: Remove
			},
			listeners: {
				close: function(){
					try {
						Classes.reload()
					}
					catch(e){}
				}
			}
		}).show()
	}
	
	
	
	var servTypes = function(b){
        var Remove = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Localize.Remove,
            dataIndex: 'id',
            width: 22,
            sortable: false,
            iconCls: 'ext-drop'
        });
		
		Remove.on('action', function(g,r,idx){
			if(r.data.id > 0){
				g.removed.push(r.data.id);
			}
			g.store.remove(r)
		});
		
	    var Edit = new Ext.grid.RowButton({
	        header: '&nbsp;',
	        qtip: Ext.app.Localize.get('Edit'),
	        dataIndex: 'name',
	        width: 22,
	        iconCls: 'ext-edit'
	    });
		
		new Ext.Window({
			title: Ext.app.Localize.get('Types of services'),
			width: 800,
			height: 400,
			modal: true,
			resizable: false,
			layout: 'fit',
			items: [{
				xtype: 'panel',
				layout: 'column',
				items: [{
					xtype: 'grid',
					height: 366,
					columnWidth: 0.6,
					columns: [Edit, {
						header: Ext.app.Localize.get('Name'),
						dataIndex: 'name',
						width: 205,
						flex: 1
					}, {
						header: Ext.app.Localize.get('Scope'),
						dataIndex: 'scope', 
						width: 205
					}, Remove],
					store: {
						xtype: 'arraystore',
						fields: ['name',  'scope'],
						data: [ ['Элемент 1', 'Интернет, Телефония'], ['Элемент 2', 'Телефония, Услуги'] ]
					}
				}, {
					xtype: 'panel',
					height: 366,
					columnWidth: 0.4,
					layout: 'fit',
					items: [{
						xtype: 'form',
						border: false,
						frame: true,
						padding: 7,
						defaults: {
							anchor: '100%',
							labelWidth: 80
						},
						buttons: [{
							xtype: 'button',
							text: Ext.app.Localize.get('Save')
						}, {
							xtype: 'button',
							text: Ext.app.Localize.get('Clear')
						}],
						buttonAlign: 'center',
						items: [{
							xtype: 'textfield',
							fieldLabel: Ext.app.Localize.get('Name'),
							name: 'name',
							allowBlank: false
						}, {
							xtype: 'checkboxgroup',
							fieldLabel: Ext.app.Localize.get('Scope'),
							columns: 1,
							items: [
								{boxLabel: Ext.app.Localize.get('Leased line'), name: 'netflow', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('Dialup') + '(' + Ext.app.Localize.get('by time') + ')', name: 'radiustime', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('Dialup') + '(' + Ext.app.Localize.get('by size') + ')', name: 'radiussize', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('Telephony'), name: 'pcdr', inputValue: 1},
								{boxLabel: 'IP ' + Ext.app.Localize.get('Telephony'), name: 'voip', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('Services'), name: 'usbox', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('D-TV'), name: 'dtv', inputValue: 1},
								{boxLabel: Ext.app.Localize.get('K-TV'), name: 'ktv', inputValue: 1}
							]
						}]
					}]
				}]
			}],
			
			listeners: {
				close: function(){
					
				}
			}
		}).show();
	}
	
    new Ext.Panel({
        id: 'catPanel',
        frame: false,
        bodyStyle: 'padding:0px',
        border: false,
        layout: 'column',
        height: 744,
        width: 900,
        renderTo: renderTo,
        tbar: [{
            xtype: 'button',
            text: Localize.newCat,
            iconCls: 'ext-add',
            handler: function(){
                Catalogue(null, Oper)
            }
        }, {
            xtype: 'button',
            text: Localize.Change + ' ' + Localize.cat,
            iconCls: 'ext-edit',
            id: 'editBtn',
            disabled: true,
            handler: function(){
                Catalogue(Ext.getCmp('catList').getSelectionModel().getSelectedNode(), Oper)
            }
        }, {
            xtype: 'button',
            id: 'dropBtn',
            text: Localize.Remove + ' ' + Localize.cat,
            iconCls: 'ext-remove',
            disabled: true,
            handler: removeCat
        }, {
			xtype: 'button',
			id: 'dirClasses',
			text: Localize.DirClasses,
			iconCls: 'ext-book',
			disabled: true,
			handler: dirClasses
		}, {
			xtype: 'button',
			id: 'servTypes',
			text: Ext.app.Localize.get('Types of services'),
			iconCls: 'ext-list',
			disabled: true,
			handler: servTypes
		}],
        items: [{
            columnWidth: 0.26,
            layout: 'fit',
            title: Localize.Catalogues,
            items: {
                xtype: 'treepanel',
                id: 'catList',
                autoScroll: true,
                animate: true,
                border: false,
                width: 214,
                height: 690,
                containerScroll: true,
                selModel: new Ext.tree.DefaultSelectionModel(),
                rootVisible: false,
                root: new Ext.tree.AsyncTreeNode({
                    iconCls: 'ext-book'
                }),
                loader: new Ext.tree.TreeLoader({
                    requestMethod: 'POST',
                    url: 'config.php',
                    baseParams: {
                        async_call: 1,
                        devision: 17,
                        getcatlist: 1
                    },
                    listeners: {
                        load: parseLeaves
                    }
                }),
                listeners: {
                    click: selectLeaf
                }
            }
        }, {
            columnWidth: 0.74,
            xtype: 'editorgrid',
            id: 'catGrid',
            frame: false,
            border: true,
            width: 'auto',
            autoExpandColumn: 'descr',
            store: Store,
            cm: colModel,
            clicksToEdit: 1,
            loadMask: true,
            plugins: Remove,
			listeners: {
				afterrender: function() {
					this.setHeight(this.ownerCt.getHeight()-27)
				}
			},
            tbar: [{
                xtype: 'button',
                text: Localize.Save,
                iconCls: 'ext-save',
                handler: function(){
                    try {
                        Ext.getCmp('catGrid').stopEditing();
                        saveCatContent(Store, Drop);
                        Drop.data = [];
                    } 
                    catch (e) {
                    }
                }
            }, {
                xtype: 'button',
                text: Localize.Add,
                iconCls: 'ext-add',
                handler: addRecord
            }, '-', {
                xtype: 'button',
                iconCls: 'ext-downcsv',
                tooltip: Localize.Download + ' ' + Localize.cat,
                handler: function(){
                    var A = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
                    if (!document.getElementById('_DownFrame')) {
                        var B = document.createElement("IFRAME");
                        B.id = '_DownFrame';
                        B.style.display = "none";
                        document.body.appendChild(B);
                    };
                    if (typeof B != 'object') {
                        var B = document.getElementById('_DownFrame');
                    };
                    B.src = './config.php?devision=17&async_call=1&download=1&downcatcode=' + A.attributes.catid + '&downcattype=' + A.attributes.cattype;
                }
            }, {
                xtype: 'button',
                iconCls: 'ext-upcsv',
                tooltip: Localize.Upload + ' ' + Localize.cat,
                handler: function(){
                    uploadCatCSV(Ext.getCmp('catList').getSelectionModel().getSelectedNode());
                }
            }, '-', Localize.Search + ':&nbsp;', {
                xtype: 'combo',
                id: 'searchCombo',
                width: 120,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                lazyRender: true,
                editable: false,
                store: new Ext.data.SimpleStore({
                    data: [['10', Localize.Description]],
                    fields: ['id', 'name']
                }),
                listeners: {
                    select: function(){
                        Store.baseParams.searchtype = this.getValue();
                    }
                }
            }, '&nbsp;', new Ext.app.SearchField({
                store: Store,
                params: {
                    start: 0,
                    limit: 50
                },
                width: 227
            })],
            bbar: new Ext.PagingToolbar({
                pageSize: 50,
                store: Store,
                displayInfo: true
            })
        }]
    });
	
	Remove.on('action', removeRec);
} // end showCatPanel()


/**
 * Parse Tree node and apply passed properties
 * @param	object, Tree store
 * @param	object, tree node model
 * @param	object, data
 */
function parseLeaves( store, node, data ) {
	node.eachChild(function(child) { child.setText(Ext.util.Format.ellipsis(child.attributes.text, 34)) });
	selectLeaf();
} // end parseLeaves()


/**
 * Select leaf. if there is no passed arguments than frist valid child group
 * @param	object, child node to select
 */
function selectLeaf( child )
{
	var child = child;
    
    if(Ext.isEmpty(child)) {
        Ext.getCmp('catList').root.eachChild(function(node){
            if(node.attributes.operid == 0 && node.hasChildNodes()) {
                node.expand();
                child = node.firstChild;
                node.firstChild.select();
            }
        })
    };
    
    if(Ext.isEmpty(child) || !Ext.isEmpty(child.attributes.group)) {
        return false;
    }
    redesignPanel(child);
    Ext.getCmp('editBtn').enable();
	if(child.attributes.cattype == 3){
		Ext.getCmp('dirClasses').enable();
		Ext.getCmp('servTypes').enable();
	}
	else {
		Ext.getCmp('dirClasses').disable();
		Ext.getCmp('servTypes').disable();
	}
    if(child.attributes.used == 1) {
        Ext.getCmp('dropBtn').disable();
    }
    else {
        Ext.getCmp('dropBtn').enable();
    }
    var store = Ext.getCmp('catGrid').store;
    store.baseParams.getcontent = child.attributes.catid;
    store.baseParams.cattype = child.attributes.cattype;
    store.reload({
        params: {
            start: 0,
            limit: 50
        }
    });
} // end selectLeaf()

/**
 * Change Panel view according to the selected tree child
 * @param	object, child node
 */
function redesignPanel( child )
{
	var grid = Ext.getCmp('catGrid');
	var colModel = grid.getColumnModel();
	// If there was call without passed child
	var child = child;
	if(Ext.isEmpty(child)) { Ext.getCmp('_vgroupsList').root.eachChild(function(node){ if(node.attributes.id >= 0) { child = node; node.select(); return false; } }); }
	// Use this views to change
	var views = {   1: ['zoneid', 'zoneip', 'zonemask', 'proto', 'port', 'descr'],
			2: ['zoneid', 'zoneas', 'descr'],
			3: ['zoneid', 'zonenum', 'zoneclass', 'descr'],
			4: ['zoneid', 'servicename', 'common', 'code', 'servtype'],
			type: child.attributes.cattype,
			indexOf: function(dataIndex) { try { var item = this[this.type]; if(item.indexOf(dataIndex) >= 0) { return true; } else { return false;} } catch(e) { return false; } }}
	
	for(var i = 0, off = colModel.getColumnCount(); i < off; i++)
	{
		var dataIndex = colModel.getDataIndex(i);
		if(views.indexOf(dataIndex)) { colModel.setHidden(i, false); } else { colModel.setHidden(i, true) }
	}
	
	// Rebuild combo view 
	comboView = {   1: [['1', 'IP ' + Localize.Address],['2', Localize.Protocol], ['3', Localize.Port], ['10', Localize.Description]],
			2: [['4', Localize.Number], ['10', Localize.Description]],
			3: [['5', Localize.Number], ['10', Localize.Description]],
			store: false,
			indexOf: function(catType, store) { try { var item = this[catType]; if(typeof item == 'object') { this.store = store; this.store.removeAll(); Ext.each(item, this.create, this); }} catch(e) { return false; } }, 
			create: function(item, index) { var row = Ext.data.Record.create([{name: 'id', type: 'int'}, {name: 'name', type: 'string'}]); this.store.add(new row({id: item[0], name: item[1]})) } }
	
	Ext.getCmp('searchCombo').clearValue();
	comboView.indexOf(views.type, Ext.getCmp('searchCombo').store);
	Ext.getCmp('searchCombo').setValue(comboView.store.getAt(0).data.id);
	grid.store.baseParams.searchtype = comboView.store.getAt(0).data.id;
} // end redesignPanel()


/**
 * Send Catalogue chenged content to the server to save or drop
 * @param	object, Ext storage with present data information
 * @param	object, simple local storage with dropped records
 * @param	boolean, if need to reload storage
 */
function saveCatContent( present, dropped, reload )
{
    
    if (Ext.isEmpty(present) || Ext.isEmpty(dropped)) {
        return false
    }
    if (Ext.isEmpty(reload)) 
        var reload = true;
    var items = [{
        xtype: 'hidden',
        name: 'async_call',
        value: 1
    }, {
        xtype: 'hidden',
        name: 'devision',
        value: 17
    }, {
        xtype: 'hidden',
        name: 'cattype',
        value: Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.cattype
    }, {
        xtype: 'hidden',
        name: 'catid',
        value: Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.catid
    }];
	
    present.each(function(record, rowIndex){
        if (record.dirty == true || record.data.zoneid == 0) {
            for (var i in record.data) {
                items[items.length] = {
                    xtype: 'hidden',
                    name: 'zonesave[' + rowIndex + '][' + i + ']',
                    value: record.data[i]
                }
            }
        }
    });
	
    Ext.each(dropped.data, function(item, key, array){
		// Add catalog identification to delete from
		items.push({
			xtype: 'hidden',
			name: 'zonedelete[' + key + '][catid]',
			value: item.catid
        });
		// Add zone identification to delete
		items.push({
            xtype: 'hidden',
            name: 'zonedelete[' + key + '][zoneid]',
            value: item.zoneid
        });
		// Add zone description to explain if there should be error
		items.push({
            xtype: 'hidden',
            name: 'zonedelete[' + key + '][descr]',
            value: item.descr
        });
    });
    
    if (items.length > 0) {
        var form = new Ext.form.FormPanel({
            renderTo: Ext.getBody(),
            url: 'config.php',
            items: items
        });
		
		var submiting = function(form) {
			form.getForm().submit({
				method: 'POST',
				scope: this,
				waitTitle: Ext.app.Localize.get('Connecting'),
				waitMsg: Ext.app.Localize.get('Sending data') + '...',
				success: function(form, action){
					if (this.reload) {
						this.present.reload();
	                };
	                form.destroy();
	            },
	            failure: function(form, action){
	                var O = Ext.util.JSON.decode(action.response.responseText);
					if(!Ext.isArray(O.reason)) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(O.reason));
					}
					else {
						try {
							var store = new Ext.data.ArrayStore({
								autoDestroy: true,
								idIndex: 0,
								data: O.reason,
								fields: [{
									name: 'zonedescr',
									type: 'string'
								}, {
									name: 'actions',
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
											header: Ext.app.Localize.get('Direction'),
											dataIndex: 'zonedescr',
											width: 140
										}, {
											header: Ext.app.Localize.get('Actions'),
											dataIndex: 'actions',
											width: 90
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
	                if (reload) {
	                    present.reload();
	                };
	                form.destroy();
	            }
	        });
		}.createDelegate({
			reload: reload,
			present: present
		})
		
		submiting(form);

    }
} // end saveCatContent()


/**
 * Window object to create new catalogue or modify exiting
 * @param	string, form id
 * @param	boolean, true edit existing, false create new
 */
function Catalogue( record, operators )
{
    
    if (!Ext.isEmpty(Ext.getCmp('winCat'))) {
        return
    }
    if (Ext.isEmpty(operators)) {
        return false;
    }
    
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
                Ext.getCmp('catList').root.reload();
                Win.close();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
                };
                Win.close();
            }
        });
    }
    var Win = new Ext.Window({
        title: (Ext.isEmpty(record) ? Localize.newCat : Localize.Change + ' ' + Localize.cat),
        id: 'winCat',
        width: 337,
        plain: true,
        items: [{
            xtype: 'form',
			buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame: true,
            labelWidth: 120,
            width: 320,
            items: [{
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 17
            }, {
                xtype: 'hidden',
                id: 'saveCat',
                name: 'savecat',
                value: (Ext.isEmpty(record) ? 0 : record.attributes.catid)
            }, {
                xtype: 'textfield',
                name: 'catname',
                id: 'CatName',
                width: 180,
                fieldLabel: Localize.CatName,
                allowBlank: false,
                listeners: {
                    render: function(){
                        if (!Ext.isEmpty(record)) {
                            this.setValue(record.attributes.catname)
                        }
                    }
                }
            }, {
                xtype: 'combo',
                fieldLabel: Localize.Type,
                hiddenName: 'cattype',
                width: 180,
                displayField: 'name',
                allowBalnk: false,
                valueField: 'id',
                typeAhead: true,
                value: 3,
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.SimpleStore({
                    data: [['1', 'IP ' + Localize.cat], ['2', 'AS ' + Localize.cat], ['3', Localize.PhoneCat], ['4', Ext.app.Localize.get('Services')]],
                    fields: ['id', 'name']
                }),
                listeners: {
                    render: function(){
                        if (!Ext.isEmpty(record)) {
                            this.setValue(record.attributes.cattype)
                        }
                    },
					select: function(combo, record) {
						if(combo.getValue() == 4) {
							
							Ext.Ajax.request({
								url: 'config.php',
								method: 'POST',
								timeout: 380000,
								scope: this,
								params: Ext.apply({
									async_call: 1,
									devision: 17,
									getdefoper: 1
								}),
								callback: function(opt, success, res) {
									try {
										var result = Ext.decode(res.responseText);
										if(!result.success && result.error) {
											throw(result.error);
										}
										var data = result.results[0];
										
										Ext.getCmp('CatOper').setReadOnly(true);
										Ext.getCmp('CatOper').setValue(data.value);
									}
									catch(e) {
										Ext.Msg.error(e);
									}
								}
							}, combo);
							
						} else {
							Ext.getCmp('CatOper').setReadOnly(false);
						}
					}
                }
            }, {
                xtype: 'combo',
                id: 'CatOper',
                fieldLabel: Localize.Operator,
                hiddenName: 'operid',
                width: 180,
                displayField: 'nameelipse',
                valueField: 'id',
                typeAhead: true,
                allowBlank: false,
                mode: 'local',
                triggerAction: 'all',
                lazyRender: true,
                editable: false,
				tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.htmlDecode(values.name)]}</div></tpl>',
                store: operators,
                listeners: {
                    render: function(){
                        if (!Ext.isEmpty(record)) {
                            this.setValue(record.attributes.operid)
                        }
                    }
                }
            }],
            buttons: [{
                xtype: 'button',
                text: Localize.Save,
                formBind: true,
                handler: sendData
            }, {
                xtype: 'button',
                text: Localize.Cancel,
                handler: function(){
                    Win.close()
                }
            }]
        }],
		listeners: {
			show: function() {
				
				
				
			}
		}
    });
    Win.show();
} // end Catalogue()


/**
 * Form to load catalogue from CSV file to server and put it to DB
 * @param	object, catalogue tree leaf
 */
function uploadCatCSV( record )
{
	if(!Ext.isEmpty(Ext.getCmp('winUpCsv'))) { return }
	var formText = new Ext.Template('<div style="padding-top: 8px">' + Localize.CSVformatDescr + '</div><div style="padding-bottom: 8px; color: red;">' + Localize.Format + ': ' + '{format}</dv>');
	catCol = function(A){ switch(A){ case 1: return 6; case 2: return 3; case 3: return 4; }}
	lineFormat = function(A){ switch(A){ case 1: return 'ID; IP; ' + Localize.Mask + '; ' + Localize.Protocol + '; ' + Localize.Port + '; ' + Localize.Description; case 2: return 'ID; AS; ' + Localize.Description; case 3: return 'ID; ' + Localize.Number + '; ' + Localize.DirClass + '; ' + Localize.Description; }}
	sendData = function(button) { 
		var form = button.findParentByType('form'); 
		form.getForm().submit({ 
			method: 'POST', 
			timeout: 600000, 
			waitTitle: Localize.Connecting, 
			waitMsg: Localize.SendingData + '...', 
			success: function(form, action) { 
				Ext.getCmp('catGrid').store.reload(); 
				Win.close(); 
			}, 
			failure: function(form, action){ 
				if(action.failureType == 'server') { 
					obj = Ext.util.JSON.decode(action.response.responseText); 
					if(!Ext.isEmpty(obj.errors) &&!Ext.isEmpty(obj.errors.reason)){
						errors(obj.errors.reason, obj.errors.detail);
					}
					else{
						Ext.Msg.error(obj.reason);
					}
				}; 
				Win.close(); 
			}
		}); 
	};
	errors = function(A, B){ if(Ext.isEmpty(B)){ var B = '';}; switch(parseInt(A)){ default: Ext.Msg.alert(Localize.Error, Localize.ErrorUndef); }}
	var Win = new Ext.Window({ title: Localize.UplFile, id: 'winUpCsv', width: 337, items: { xtype: 'form', url: 'config.php', width: 320, autoHeight: true, fileUpload: true, bodyStyle: 'padding: 3px 3px 0 3px;', labelWidth: 35, defaults: { anchor: '95%', allowBlank: false }, frame: true, html: formText.applyTemplate({ catalogue: record.attributes.catname , column: catCol(record.attributes.cattype), format: lineFormat(record.attributes.cattype) }), items: [{ xtype: 'hidden', name: 'devision', value: 17 }, { xtype: 'hidden', name: 'async_call', value: 1 }, { xtype: 'hidden', name: 'upcatcode', value: record.attributes.catid }, { xtype: 'hidden', name: 'upcattype', value: record.attributes.cattype }, { xtype: 'fileuploadfield', emptyText: Localize.SelectFile, fieldLabel: Localize.File, name: 'upcontent', buttonCfg: { text: '', iconCls: 'ext-upload' } }], buttons: [{ text: Localize.Upload, handler: sendData }, { text: Localize.Cancel, handler: function(){ Win.close(); } }] } });
	Win.show();
} // end uploadCatCSV()

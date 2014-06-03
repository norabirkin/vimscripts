// WorkSpace.getGrid().store.setBaseParam('exactorderid',0);

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Show catalogue control Panel to edit catalog and and or modify its entries
	showCatPanel('TarCatPanelPlace');
}); // end Ext.onReady()


/**
 * @param	string, render to DOM element
 */
function showCatPanel( renderTo )
{
	if(!document.getElementById(renderTo))  { return; }

	var Drop = { data: [] };

    var MasterCategory = new Ext.data.Store({
        id: 'MasterCategoryStore',
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            {name: 'catidx',type: 'int'},
            {name: 'catid',type: 'int'},
            {name: 'descr',type: 'string'},
            {name: 'uuid',type: 'string'}
           ]
        ),
        baseParams: {
            async_call: 1,
            devision: 25,
            getmastercategory: 0
        },
        autoLoad: false
    });

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
						Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.errors.reason);
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
        grid.stopEditing();
        if (record.data.zoneid > 0) {
            Drop.data[Drop.data.length] = record.data;
        };
        grid.store.remove(record);
    }

    var btnShow = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('View edit category'), width: 22, iconCls: 'ext-table' });
    btnShow.on('action', function(g, r, i) {
        telGrid = Ext.getCmp('MasterCategoryTelGrid');
        telGrid.store.setBaseParam('getMasterCategoryList',r.data.catidx);
        telGrid.store.setBaseParam('catid',r.data.catid);
        telGrid.store.setBaseParam('descr',r.data.descr);
        telGrid.store.setBaseParam('uuid',r.data.uuid);
        telGrid.store.load();


        g.ownerCt.getLayout().setActiveItem(1);
    });

    var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('View'), width: 22, iconCls: 'ext-drop' });
    btnDel.on('action', function(g, r, i) {
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Remove tariff category'),
            msg: Ext.app.Localize.get('Are you sure you want to remove tariff category'),
            width:400,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: {
                        devision: 25,
                        async_call: 1,
                        delMasterCategory: r.data.catidx
                    },
                    scope: {
                        load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                    },
                    callback: function(opt, success, res) {
                        this.load.hide();
                        if(!success) {
                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                            return false;
                        }
                        if (Ext.isDefined(res['responseText'])) {
                            var data = Ext.util.JSON.decode(res.responseText);
                            if ( data.success ){
                                MasterCategory.removeAll();
                                MasterCategory.load();
                                Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Category was successfully deleted"));
                            }else{
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                            }
                        }
                      return false;
                    }
                });
            }
        });
    });

    var masterCatList = new Ext.grid.GridPanel({
        columnWidth: 0.74,
        xtype: 'grid',
        id: 'catGrid',
        frame: false,
        border: true,
        width: 'auto',
        height: 'auto',
        autoExpandColumn: 'descr',
        store: MasterCategory,
        stateful: true,
        stateId: 'masterCatListx',
        cm: new Ext.grid.ColumnModel({
            columns: [
                btnShow,
                {header: Ext.app.Localize.get('ID'), dataIndex: 'catidx', width: 50},
                //{header: Ext.app.Localize.get('Catalog ID'), dataIndex: 'catid' },
                {header: Ext.app.Localize.get('Description'), dataIndex: 'descr', id: 'descr' },
                {header: Ext.app.Localize.get('Identifier'), dataIndex: 'uuid', width: 200},
                btnDel
                // кнопки изменения
            ]
        }),
        plugins: [btnShow,btnDel],
        viewConfig: {
            deferEmptyText: false,
            emptyText:Ext.app.Localize.get('Not selected directory or not to create a master category')
        },

        clicksToEdit: 1,
        loadMask: true,
        title: '',
        listeners: {
            afterrender: function() {
                this.setHeight(this.ownerCt.getHeight()-27)
            }
        },
        tbar: [
        {
            xtype: 'button',
            iconCls: 'ext-add',
            id: 'addNewCat',
            text: Ext.app.Localize.get('Add category'),
            disabled: true,
            handler: function(){
                Catalogue(Ext.getCmp('catList').getSelectionModel().getSelectedNode());
            }
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: MasterCategory,
            displayInfo: true
        })
    });


	var MasterCategoryTelStore = new Ext.data.Store({
		id: 'MasterCategoryTelStore',
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
		reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
        [
			{ name: 'zoneid',        type: 'int' },
			{ name: 'catid',         type: 'int' },
			{ name: 'zoneclass',     type: 'int' },
			{ name: 'zoneip',        type: 'string' },
			{ name: 'zoneas',        type: 'int' },
			{ name: 'zonemask',      type: 'int' },
			{ name: 'port',          type: 'int' },
			{ name: 'proto',         type: 'int' },
			{ name: 'descr',         type: 'string' },
			{ name: 'zonenum',       type: 'string' },
			{ name: 'descr',         type: 'string' },
			{ name: 'zonedescr',     type: 'string' },
            { name: 'direction',     type: 'int' }
		]),
        autoLoad: false,
		baseParams:{
			async_call: 1,
			devision: 25,
			getMasterCategoryList: 0
		},
		sortInfo: {
			field: "zoneid",
			direction: "ASC"
		}
	});
    var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'zoneid', width: 22, sortable: false, iconCls: 'ext-drop' });

    var CatGrid = new Ext.grid.GridPanel({
        id: 'MasterCategoryTelGrid',
        tbar: [
            {
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                iconCls: 'ext-save',
                scope: this,
                handler: function(){
                    directions = [];
                    Ext.getCmp('MasterCategoryTelGrid').store.each(function(rec){
                        directions.push(rec.data.zoneid + ':' + rec.data.direction);
                    },directions)
                    param   = Ext.getCmp('MasterCategoryTelGrid').store.baseParams;
                    tarCat  = param.getMasterCategoryList;
                    catid   = param.catid;
                    descrTC = param.descr;
                    uuidTC  = param.uuid;
                    try {
                        Ext.Ajax.request({
                            url: 'config.php',
                            method: 'POST',
                            params: {
                                devision: 25,
                                async_call: 1,
                                catid: catid,
                                directions: /*Ext.util.JSON.encode(*/directions.join(';')/*)*/,
                                tarcat: tarCat,
                                descr: descrTC,
                                uuid: uuidTC
                            },
                            scope: {
                                load: Ext.Msg.wait(Ext.app.Localize.get('Loading') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
                            },
                            callback: function(opt, success, res) {
                                this.load.hide();
                                if(!success) {
                                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown error'));
                                    return false;
                                }
                                if (Ext.isDefined(res['responseText'])) {
                                    var data = Ext.util.JSON.decode(res.responseText);
                                    if ( data.success ){
                                        try {
                                            Ext.Msg.alert(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Data is successfully saved'));
                                        }
                                        catch(e) { console.log(e) }
                                    }else{
                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                    }
                                }
                              return false;
                            }
                        });


                    }
                    catch (e) {

                        consile.warn(e);

                    }
                }
            },
            '-',
            {
                xtype: 'splitbutton',
                width: 73,
                id: 'menu_btn',
                iconCls: 'ext-add',
                text: Ext.app.Localize.get('Add'),
                handler: function(){
                    this.menu.show(this.getEl());
                },
                menu: [{
                    text: '&uarr; ' + Ext.app.Localize.get('Incoming-e'),
                    id: 'addIncoming',
                    handler: function(){
                        getCatalogContent(0);
                    }
                }, {
                    text: '&darr; ' + Ext.app.Localize.get('Outgoing-e'),
                    id: 'addOutgoing',
                    handler: function(){
                        getCatalogContent(1);
                    }
                }]
            },
            //'-',
            //{
            //    xtype: 'button',
            //    text: Ext.app.Localize.get('Set start date'),
            //    iconCls: 'ext-table',
            //    handler: function(){
            //        planRasp();
            //    }//addRecord
            //},
            '->',
            {
                xtype: 'button',
                text: '',
                iconCls: 'ext-levelup',
                handler: function () {
                    Ext.getCmp('cardMasterPanel').getLayout().setActiveItem(0);
                }
            }
        ],
        enableHdMenu: false,
        loadMask: true,
        autoExpandColumn: 'descr',
        sm: new Ext.grid.CheckboxSelectionModel(),
        store: MasterCategoryTelStore,
        cm: new Ext.grid.ColumnModel(
            [
                {
                    header: 'ID',
                    dataIndex: 'zoneid',
                    width: 50
                },
                {
                    header: Ext.app.Localize.get('Number'),
                    dataIndex: 'zonenum',
                    width: 120
                },
                {
                    header: Ext.app.Localize.get('Direction class'),
                    dataIndex: 'zoneclass',
                    width: 120
                },
                {
                    header: Ext.app.Localize.get('Direction'),
                    dataIndex: 'direction',
                    width: 90,
                    renderer: function(value){
                        if (value == 1)
                            return  Ext.app.Localize.get("Out.");
                        else
                        	return  Ext.app.Localize.get("In.");
                    }
                },
                {
                    header: Ext.app.Localize.get('Description'),
                    id: 'descr',
                    name: 'descr',
                    dataIndex: 'descr'
                },
                Remove
            ]
        ),
        plugins: Remove
    });
    Remove.on('action', removeRec);


    var planRasp = function() {
        if (!Ext.isEmpty(Ext.getCmp('winRasp'))) { return; }
        sendData = function(button){
            var form = button.findParentByType('form');
            form.getForm().submit({
                method: 'POST',
                waitTitle: Ext.app.Localize.get('Connecting'),
                waitMsg: Ext.app.Localize.get('Sending data') + '...',
                success: function(form, action){
                    Win.destroy();
                },
                failure: function(form, action){
                    if (action.failureType == 'server') {
                        obj = Ext.util.JSON.decode(action.response.responseText);
                        Ext.Msg.alert('Error!', obj.errors.reason);
                    };
                    Win.destroy();
                }
            });
        }
        var Win = new Ext.Window({
            title: Ext.app.Localize.get('Start date of category'),
            id: 'winRasp',
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
                items: [
                    { xtype: 'hidden', name: 'async_call', value: 1 },
                    { xtype: 'hidden', name: 'devision', value: 25 },
                    {
						xtype: 'datefield',
						autoWidth: true,
						id: 'tarCatStartUsing',
						name: 'tarCatStartUsing',
						allowBlank: false,
						readOnly: true,
						fieldLabel: Ext.app.Localize.get('Start date'),
						format: 'Y-m-d',
						width: 200,
						maskRe: new RegExp('[0-9\-]'),
						formBind: true,
						value: new Date()
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
                    handler: function(){
                        Win.close();
                    }
                }]
            }]
        });
        Win.show();
    } // end Catalogue()


    new Ext.Panel({
        id: 'catPanel',
        frame: false,
        bodyStyle: 'padding:0px',
        title: Ext.app.Localize.get('Master categories'),
        border: false,
        layout: 'column',
        height: 744,
        width: 900,
        renderTo: renderTo,
        items: [
            {
                columnWidth: 0.26,
                layout: 'fit',
                title: Ext.app.Localize.get('Catalogues'),
                items: {
                    xtype: 'treepanel',
                    id: 'catList',
                    autoScroll: true,
                    animate: true,
                    border: false,
                    width: 214,
                    height: 692,
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
                            devision: 25,
                            getCatList: 1
                        },
                        listeners: {
                            load: parseLeaves
                        }
                    }),
                    listeners: {
                        click: selectLeaf
                    }
                }
            },
            {
                id: 'cardMasterPanel',
                region: 'center',
                layout: 'card',
                activeItem: 0,
                columnWidth: 0.74,
                height: 720,
                title: Ext.app.Localize.get('List of master categories'),
                autoDestroy: false,
                defaults: {
                    border: false
                },
                items: [masterCatList, CatGrid]
            }
        ]
    });

}


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
        return false
    }

    Ext.getCmp('addNewCat').enable();
    Ext.getCmp('cardMasterPanel').getLayout().setActiveItem(0);
    var store = Ext.getCmp('catGrid').store;
    store.baseParams.getmastercategory = child.attributes.catid;
    store.baseParams.cattype = child.attributes.cattype;
    store.reload({
        params: {
            start: 0,
            limit: 50
        }
    });
} // end selectLeaf()



/**
 * Window object to create new tar category
 * @param	object, catalog
 */
function Catalogue( catalog/*, gridStore */)
{
    if (!Ext.isEmpty(Ext.getCmp('winCat'))) {
        return;
    }
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            //scope: gridStore,
            success: function(form, action){
                //gridStore.reload();
                Ext.getCmp('catGrid').getStore().reload();
                Win.close();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.errors.reason);
                };
                Win.close();
            }
        });
    }
    var Win = new Ext.Window({
        title: Ext.app.Localize.get("Create new category"),
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
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 25 },
                { xtype: 'hidden', name: 'catid', value: catalog.attributes.catid },
                { xtype: 'hidden', id: 'addMasterCategory', name: 'addMasterCategory', value: 1 },
                {
                    xtype: 'textfield',
                    name: 'catname',
                    id: 'CatName',
                    width: 180,
                    fieldLabel: Ext.app.Localize.get('Category name'),
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'catUnicUid',
                    id: 'catUnicUid',
                    width: 180,
                    fieldLabel: Ext.app.Localize.get('Unique identifier'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9a-zA-Z]")
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
                handler: function(){
                    Win.close()
                }
            }]
        }]
    });
    Win.show();
} // end Catalogue()



function getCatalogContent(direction)
{
	var child = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
    catIdx = child.attributes.catid;
	var catContentStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php', method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'zoneid',        type: 'int' },
			{ name: 'catid',         type: 'int' },
			{ name: 'zoneclass',     type: 'int' },
			{ name: 'zoneip',        type: 'string' },
			{ name: 'zoneas',        type: 'int' },
			{ name: 'zonemask',      type: 'int' },
			{ name: 'port',          type: 'int' },
			{ name: 'proto',         type: 'int' },
			{ name: 'descr',         type: 'string' },
			{ name: 'zonenum',       type: 'string' },
			{ name: 'descr',         type: 'string' },
			{ name: 'zonedescr',     type: 'string' },
            { name: 'direction',     type: 'int' }

		]),
		baseParams:{
			async_call: 1,
			devision: 4,
			catcontent: child.attributes.catid,
			cattype: 3,
			searchtype: 10,
            unavail : 1,
            direction: direction
		},
		sortInfo: {
			field: "zoneid",
			direction: "ASC"
		}
	});
	catContentStore.reload({params: { start: 0, limit: 50 }});

	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, { width:280, initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); }, validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search', onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } }, onTrigger2Click : function(){ var v = this.getRawValue(); if(v.length < 1){ this.onTrigger1Click(); return; } var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); } });
    var CatGrid = new Ext.grid.EditorGridPanel({
        tbar: [Localize.Search + ':&nbsp;', {
            xtype: 'combo',
            id: 'searchCombo',
            width: 120,
            displayField: 'name',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            lazyRender: true,
            value: 10,
            editable: false,
            store: new Ext.data.SimpleStore({
                data: [
                    ['5',  Ext.app.Localize.get('Number')],
                    ['10', Ext.app.Localize.get('Description')]
                ],
                fields: ['id', 'name']
            }),
            listeners: {
                select: function(){
                    catContentStore.baseParams.searchtype = this.getValue();
                }
            }
        }, '&nbsp;', new Ext.app.SearchField({
            store: catContentStore,
            params: {
                start: 0,
                limit: 50
            },
            width: 227
        })],
        bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: catContentStore,
            displayInfo: true
        }),
        enableHdMenu: false,
        loadMask: true,
        cm: new Ext.grid.ColumnModel([
            new Ext.grid.CheckboxSelectionModel(),
            { header: 'ID', dataIndex: 'zoneid', width: 50, sortable: true },
            { header: Ext.app.Localize.get('Number'), dataIndex: 'zonenum', width: 120, sortable: true },
            //{ header: Ext.app.Localize.get('Direction class'), dataIndex: 'zoneclass', width: 120, sortable: false },
            { header: Ext.app.Localize.get('Description'), id: 'descr', dataIndex: 'descr', sortable: true } 
        ]),
        autoExpandColumn: 'descr',
        sm: new Ext.grid.CheckboxSelectionModel(),
        store: catContentStore
    });

	var CatForm = new Ext.form.FormPanel({
		frame: false,
		url: 'config.php',
//		items: [
//            { xtype: 'hidden', name: 'async_call', value: 1 },
//            { xtype: 'hidden', name: 'devision', value: 4 },
//            { xtype: 'hidden', name: 'catidx', value: catIdx },
//        ],
		buttonAlign: 'center',
		buttons: [{
			text: Ext.app.Localize.get('Add') + ((direction != 1) ? " " + Ext.app.Localize.get("incoming-e") : " " + Ext.app.Localize.get("outgoing-e")),
			handler: function() {
				var rows = CatGrid.selModel.getSelections();
                Ext.each(rows,function(val){
                    Ext.apply(val.data,{direction: this.direction});
                    this.store.insert(0,val);
                },{direction:direction,store:Ext.getCmp('MasterCategoryTelGrid').store});
                //Ext.getCmp('MasterCategoryTelGrid').store.insert(0,rows);
                Win.destroy();
			}
		}, {
			text: Localize.Cancel,
			handler: function() {
				Win.destroy();
			}
		}]
	});
	var Win = new Ext.Window({ 
		id: 'dirWin', 
		modal: true, 
		title: Localize.Catalogue, 
		plain: true, 
		width: 600, 
		defaults: { labelWidth: 140 }, 
		layout: 'fit',
		items: [ CatGrid, CatForm ] }); 
	Win.show();
}

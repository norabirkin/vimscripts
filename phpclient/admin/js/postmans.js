/**
 * JavaScript engine for the billing postmans interface
 *
 * TODO: Add Russian translation
 *
 */


	Ext.onReady(function(){
		Ext.QuickTips.init();
		postmansList('postmansPlace');
	});


	/**
	 *
	 *
	 */
	function postmansList(renderTo) {
		if (!Ext.isEmpty(Ext.getCmp('postmansGrid'))) {
			Ext.getCmp('postmansGrid').show();
			Ext.getCmp('postmansGrid').store.reload();
			return;
		}
		var Edit = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Edit'),
			dataIndex: 'postmanId',
			width: 22,
			iconCls: 'ext-edit'
		});
		var Remove = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Remove'),
			dataIndex: 'postmanId',
			width: 22,
			iconCls: 'ext-drop'
		});

		new Ext.grid.GridPanel({
			title: Ext.app.Localize.get('Postmans'),
			renderTo: renderTo,
			id: 'postmansGrid',
			width: 730,
			height: 600,
			tbar: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Create'),
				iconCls: 'ext-add',
				handler: function() {
					var g = Ext.getCmp('postmansGrid');
					g.hide();
					postmanForm(g.initialConfig.renderTo, {'postmanId':-1})
				}
			}],
			cm: new Ext.grid.ColumnModel([
				Edit,
				{ header: 'ID', dataIndex: 'postmanId', width: 60 },
				{ header: Ext.app.Localize.get('Name of user'), dataIndex: 'postmanFio', width: 600 },
				Remove
			]),
			plugins: [Edit, Remove],
			loadMask: true,
			store: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader(
					{root: 'results'},
					[
						{name: 'postmanId',type: 'int'},
						{name: 'postmanFio',type: 'string'}
					]
				),
				autoLoad: true,
				baseParams: {
					async_call: 1,
					devision: 15,
					getpostmans: 1
				}
			})
		});

		Edit.on('action', function(g, r, i) {
			g.hide();
			postmanForm(g.initialConfig.renderTo, {'postmanId': r.data.postmanId,'postmanFio': r.data.postmanFio})
		});
		Remove.on('action', function(g, r, i) {
			compactFormX([
					{xtype: 'hidden',name: 'async_call',value: 1},
					{xtype: 'hidden',name: 'devision',value: 15},
					{xtype: 'hidden',name: 'delpostman',value: r.data.postmanId}
				],{
					grid: g,
					record: r,
					success: function() {
						this.grid.store.remove(this.record)
					}
				}
			);
		});
	}


function compactFormX(items, object) {
	if (Ext.isEmpty(items)) { return false; };
	var form = new Ext.form.FormPanel({
		id: 'compactFormX',
		renderTo: Ext.getBody(),
		url: 'config.php',
		items: items
	});
	form.getForm().submit({
		method: 'POST',
		waitTitle: Ext.app.Localize.get('Connecting'),
		waitMsg: Ext.app.Localize.get('Sending data') + '...',
		success: function(form, action) {
			if (!Ext.isEmpty(object)) {
				try {
					object.success(action);
				} catch (e) {}
			};
			form.destroy();
		},
		failure: function(form, action) {
			if (action.failureType == 'server') {
				obj = Ext.util.JSON.decode(action.response.responseText);
				Ext.Msg.alert('Error!', obj.errors.reason);
			}
			form.destroy();
		}
	})
	return true;
}



/**
 * Edit selected postman
 */

function postmanForm(renderTo, postman) {
    if (postman.postmanId == -1) {
        formTitle = 'Create new postman';
    } else {
        formTitle = Ext.app.Localize.get('Edit postman') + ': ' + postman.postmanFio;
    }

	apply = function(A, B){
		try {
			if (A.code[5] != 0){
				/**
				 * Если указали дом
				 */
				if (A.code[6] != 0){
					var recordData = {
						id:A.code[6],
						name:(A.full[5]+', '+A.full[6]),
						rtype:1
					};
				}else{ // Указана улица
					var recordData = {
						id:A.code[5],
						name:A.full[5],
						rtype:0
					};
				}
				B.store.insert(0,new B.store.reader.recordType(recordData));
			}else alert(Ext.app.Localize.get('Street or builing are not selected'))
        }
        catch (e) {
            alert(e.toString())
        }
    }

	var Remove = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		dataIndex: 'postmanId',
		width: 22,
		iconCls: 'ext-drop'
	});

	 var lgrid = new Ext.grid.GridPanel({
        title: formTitle,
        renderTo: renderTo,
		id: 'postmanForm',
        width: 730,
        height: 600,
        tbar: [
			{
				xtype: 'button',
				text: Ext.app.Localize.get('Save'),
				iconCls: 'ext-save',
				handler: function (A,B) {
					lgrid.store.baseParams.postmanFio = Ext.getCmp('fio').getValue();
					lgrid.store.baseParams.save = 1;
					var records = new Array()
					var jarr = lgrid.getStore().each(function(rec,rnum){
						var tmpRec = '{"id":'+rec.data.id+',"name":"'+rec.data.name+'","rtype":'+rec.data.rtype+'}';
						records.push(tmpRec);
					})
					var jsonDataArr = '[' + records.join(',') + ']';
					lgrid.store.baseParams.addrList = jsonDataArr;
					lgrid.store.reload({
						'callback':function(a,b,c){
							lgrid.store.baseParams.insUpdPostman = lgrid.store.reader.jsonData.insUpdPostman;
						 }
					});
				}

			},
			{
				xtype: 'button',
				text: Ext.app.Localize.get('Add address'),
				iconCls: 'ext-add',
				handler: function () {
					address(apply, {
						code: '1,0,0,0,0,0,0,0',
						string: ',,,,,,,,'
					}, lgrid);
				}
			}, '-', Ext.app.Localize.get('Name of postman') + ':&nbsp;',
			{
				xtype: 'textfield',
				id: 'fio',
				width: 180,
				fieldLabel: Ext.app.Localize.get('Person full name'),
				value: (postman.postmanId == -1) ? Ext.app.Localize.get('Input name of postman') : postman.postmanFio,
				initEvents: Ext.form.Field.prototype.initEvents,
				onFocus: Ext.form.Field.prototype.onFocus,
				listeners: {
					initialize: function(ed){
						Ext.EventManager.on(ed.getWin(), 'focus', ed.onFocus, ed);
						Ext.EventManager.on(ed.getWin(), 'blur', ed.onBlur, ed);
					},
					focus: function(){
						if (this.getValue() == Ext.app.Localize.get('Input name of postman')) this.setValue('');
					},
					blur: function(){
						if(Ext.isEmpty(this.getValue().split(' ').join(''))) this.setValue(Ext.app.Localize.get('Input name of postman'));
					}
				},
				renderTo: Ext.getBody()
			},
			'->',
			{
				xtype: 'button',
				text: '',
				iconCls: 'ext-levelup',
				handler: function () {
					var F = Ext.getCmp('postmanForm');
					F.hide();
					postmansList(F.initialConfig.renderTo);
					F.destroy();
				}
			}
		],
		bbar: [
			'&nbsp;',
			{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Street'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-postman-street'
			},
			'&nbsp;',
			{
					xtype: 'displayfield',
					value: Ext.app.Localize.get('Building'),
					hideLabel: true,
					style: 'font-weight:bold;padding:3px;border:1px solid gray;',
					ctCls: 'x-type-postman-building'
			}
		],
        cm: new Ext.grid.ColumnModel({
			columns: [
				{header: 'ID',dataIndex: 'id',width: 60},
				{header: Ext.app.Localize.get('Street') + ' / ' + Ext.app.Localize.get('Building'),dataIndex: 'name',width: 628},
				Remove
	        ],
			defaults: { sortable: true, menuDisabled: true }
		}),
		plugins: [Remove],
        loadMask: true,
		viewConfig:{
			getRowClass: function(record, index) {
				if (record.get('rtype') == 0){ return 'x-type-postman-street'; }
				else if (record.get('rtype') == 1){ return 'x-type-postman-building'; }
				else return '';
			}
		},
		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
			reader: new Ext.data.JsonReader({root: 'results'},[
				{ name: 'id',    type: 'int',    id: 'idcolumn' },
				{ name: 'name',  type: 'string', id: 'namecolumn' },
				{ name: 'rtype', type: 'hidden', id: 'rtype' }
			]),
			autoLoad: false,
			autoSave: false,
			baseParams: {
				async_call: 1,
				devision: 15,
				insUpdPostman: (postman.postmanId) ? postman.postmanId : -1,
				addrList: false
			}
		})
	});

	/**
	 * DELETE ADDR
	 */
	Remove.on('action', function(g, r, i) {
		g.getStore().remove(r);
	});

	if (postman.postmanId >= 0 )
		lgrid.store.load();

} // end postmanForm()

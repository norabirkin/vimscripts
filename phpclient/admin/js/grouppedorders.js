/**
 * JavaScript engine for the groupped billing financial documents
 */

Ext.onReady(function(){
	Ext.QuickTips.init();
	showPanel('ordPanelPlace');
});

var WorkSpace = {
	getPanel: function(){
		if (Ext.isEmpty(this.panel)) {
			this.panel = Ext.getCmp('docPanel');
		}
		return this.panel;
	},
	getGrid: function(){
	    return this.getPanel().items.get(0)
	},
	filter: {
	    items: [],
	    joinParams: function(){
		var B = {};
		if (Ext.isEmpty(this.items)) {
		    this.items = WorkSpace.findPanelChild('all');
		}
		for (i = 0, off = this.items.length; i < off; i++) {
		    try {
			var G = this.isGroupItem(this.items[i].pid, this.items[i]);
			if (!Ext.isEmpty(G)) {
			    if (typeof G == 'object') {
				B[G.name] = G.value;
			    }
			}
			else {
			    B[this.items[i].pid] = this.items[i].getValue();
			}
			if (typeof B[this.items[i].pid] == 'object') {
			    B[this.items[i].pid] = B[this.items[i].pid].format('Y-m-d');
			}
		    }
		    catch (e) {
		    }
		}
		return B
	    },
	    isGroupItem: function(A, B){
		var C = new RegExp('^paidgroup_');
		if (C.test(A)) {
		    if (B.getValue() == true) {
			return {
			    name: 'paidgroup',
			    value: A.replace(C, '')
			}
		    }
		    else {
			return false
		    }
		}
		return null;
	    }
	},
	setFilterItem: function(A){
	    if (Ext.isEmpty(A)) {
		return;
	    };
	    for (var i in A) {
		if (i == A[i]) {
		    continue
		};
		if (A[i] == null) {
		    continue;
		};
		this.filter[i] = A[i]
	    }
	},
	findPanelChild: function(A, T){
	    if (Ext.isEmpty(A)) {
		return []
	    };
	    if (Ext.isEmpty(T) || typeof T != 'object' || T.length == 0) {
		T = ['hidden', 'combo', 'textfield', 'numberfield', 'radio', 'checkbox', 'datefield'];
	    }
	    if (typeof A != 'object') {
		var A = [A];
	    }
	    var B = this.getPanel().getTopToolbar().items.first();
	    var C = B.findBy(function(A){
		try {
		    if (this.types.indexOf(A.xtype) >= 0) {
			if (this.is(A.pid) || this.is(A.name)) {
			    return true
			}
		    }
		}
		catch (e) {
		};
		return false;
	    }, {
		name: A,
		types: T,
		is: function(A){
		    for (i = 0, off = this.name.length; i < off; i++) {
			if (this.name[i] == A || this.name[i] == 'all') {
			    return true
			}
		    }
		}
	    });
	    C['get'] = function(A){
		for (i = 0, off = this.length; i < off; i++) {
		    try {
			if (this[i].pid == A) {
			    return this[i];
			}
		    }
		    catch (e) {
			return null;
		    }
		}
		return null;
	    };
	    C['getIndex'] = function(A){
		for (i = 0, off = this.length; i < off; i++) {
		    try {
			if (this[i].pid == A) {
			    return i
			}
		    }
		    catch (e) {
			return null;
		    }
		}
		return null;
	    };
	    return C;
	},
	findPanelContainer: function(A){
	    return this.findPanelChild(A, ['container', 'button', 'fieldset'])
	},
	unCheckGroup: function(A){
	    var B = this.findPanelChild(A);
	    for (var i = 0, off = B.length; i < off; i++) {
		B[i].setValue(false);
	    }
	},
	load: function(){
	    var T = this.getGrid().store;
	    var B = this.filter.joinParams();
	    for (var i in B) {
			T.baseParams[i] = B[i];
	    };
		T.baseParams = this.advSearch(T.baseParams);
	    T.reload({
			params: {
			    start: 0,
			    limit: 100
			}
	    })
	},
	// Function to compose storage base parameters for server list filtering
	// @param	object of parameters from storage (usually [Storage].baseParams)
	// @param	boolean, if pass true to function than call storage load
	// @return	object with parameters and their values
	advSearch: function(a,r){
		var c = this.findPanelChild('advSearchList').get('advSearchList');
		var n = new RegExp('searchtpl','i');

		if(r == true){
			c.setValue('');
		}

		if(Ext.isEmpty(a)) {
			var a = {};
		}
		else {
			var s = {};
			for (var i in a) {
				if (!n.test(i)) {
					s[i] = a[i];
				}
			}
			a = s;
		}


		return a;
	}
} // end WorkSpace object

function showInfoPanel( renderTo )
{
	var infoPanel = new Ext.Panel({
		title: Ext.app.Localize.get('Document'),
		id: '_infoPanel',
		preventBodyReset: false,
		renderTo: renderTo,
		width: 600,
		height: 195,
	    listeners: {
        'afterlayout': {
            fn: function(p){
	                p.hide();
	            },
	            single: true // important, as many layouts can occur
        	}
    	}
	});
}

/**
 * show panel
 * @param	string, DOM Element render to
 */
function showPanel( renderTo )
{
	if(Ext.isEmpty(Ext.get(renderTo))){
		return false
	}

	var S = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
		paramNames: { limit: 'limit', sortdir: 'sortdir', sortfield: 'sortfield', limit: 'limit' },
		reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
				[{ name: 'orderid', type: 'int' },
				{ name: 'docid', type: 'int' },
				{ name: 'period', type: 'date', dateFormat: 'Y-m-d' },
				{ name: 'creationdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'docname', type: 'string' },
				{ name: 'filename', type: 'string' },
				{ name: 'comment', type: 'string' }
			]),
		baseParams: { async_call: 1, devision: 120, getdocument: 0, exactorderid: 0 }
	});

	compactForm = function(items, object) {
		if (Ext.isEmpty(items)) {
			return false;
		};
		items.push({
			xtype: 'hidden',
			name: 'devision',
			value: 120
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
			timeout: 380000,
			items: items
		});
		form.getForm().submit({
			method: 'POST',
			waitTitle: Ext.app.Localize.get('Connecting'),
			waitMsg: Ext.app.Localize.get('SendingData') + '...',
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
	};
	var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:true });
	var dp = new Ext.Panel({
	    title: Ext.app.Localize.get('Groupped accounting documents'),
	    id: 'docPanel',
	    width: 960,
	    autoHeight: true,
	    renderTo: renderTo,
	    tbar: [{
		xtype: 'panel',
		header: false,
		layout: 'table',
		autoHeight: true,
		defaults: {
		    height: 24
		},
		layoutConfig: { columns: 1 },
		plain: true,
		bodyStyle: 'background: none',
		frame: false,
		border: false,
		width: 954,
		items: [{
		    xtype: 'container',
		    autoEl: 'div',
		    width: 954,
		    layout: 'column',
				items: [
				{
					xtype: 'fieldset',
					width: 211 + (Ext.isIE ? 2 : 0),
					height: 24,
					border: false,
					style: 'padding: 0px; border: none',
					items: [{
						xtype: 'datefield',
						fieldLabel: Ext.app.Localize.get('Reporting period'),
						pid: 'datefor',
						width: 98,
						format: 'Y-m-d',
						maskRe: new RegExp('[0-9\-]'),
						value: new Date().format('Y-m-01')
					}]
				},
				{
				xtype: 'fieldset',
				width: 314,
				height: 24,
				border: false,
				style: 'padding: 0px; border: none',
					items: {
						xtype: 'combo',
						width: 200,
						fieldLabel: Ext.app.Localize.get('Documents types'),
						tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 42)]}</div></tpl>',
						listWidth: 300,
						pid: 'getdocument',
						displayField: 'name',
						lastValue: 0,
						valueField: 'id',
						store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [{ name: 'id', type: 'int' }, { name: 'name', type: 'string' }, { name: 'type', type: 'int' }]),
						baseParams: {
							async_call: 1,
							devision: 120,
							getdoctypes: 1
						},
						sortInfo: {
							field: 'id',
							direction: 'ASC'
						},
						autoLoad: true
						}),
						editable: false,
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						listeners: {
							select: function(C, R){
								if (C.lastValue > 0 && C.lastValue != C.getValue()) {
									Ext.getCmp('ordersGrid').store.filter('orderid', 'A');
								} else {
									Ext.getCmp('ordersGrid').store.clearFilter();
								}
							}
						},
						setLastValue: function(){
							this.lastValue = this.getValue()
						}
					}
				},{
				xtype: 'container',
				width: 79,
				autoEl: 'div',
					items: {
						xtype: 'button',
						text: Ext.app.Localize.get('Show'),
						iconCls: 'ext-table',
						handler: function(){
							var C = WorkSpace.findPanelChild('getdocument');
							if (C.get('getdocument').getValue() <= 0) {
								return false
							}
							C.get('getdocument').setLastValue();
							//WorkSpace.getGrid().store.setBaseParam('exactorderid',0);
							WorkSpace.load();
						}
					}
				},{
				xtype: 'container',
				autoEl: 'div',
				width: 88,
					items: [{
						xtype: 'button',
						text: Ext.app.Localize.get('Download'),
						iconCls: 'ext-save',
						handler: function(){
							var C = WorkSpace.findPanelChild('getdocument');
							if (C.get('getdocument').getValue() <= 0) {
								return false
							}
							var S = WorkSpace.getGrid().getSelectionModel();
							if (S.getCount() > 1) {
								var I = [];
								var B = WorkSpace.filter.joinParams();
								B = WorkSpace.advSearch(B);
								for (var i in B) {
									if (typeof B[i] == 'undefined' || typeof B[i] == 'function' || typeof B[i] == 'object') {
										continue;
									};
									(i == 'getdocument') ? n = 'getmultiord' : n = i;
									I.push({
										xtype: 'hidden',
										name: n,
										value: B[i]
									})
								};
								var B = WorkSpace.advSearch();
								S.each(function(A){
								  this.push({
									  xtype: 'hidden',
									  name: 'filesarray[]',
									  value: A.data.orderid
								  })
								}, I);
								I.push({
								xtype: 'hidden',
								name: 'start',
								value: WorkSpace.getGrid().store.lastOptions.params.start
								});
								compactForm(I, {
								success: function(A){
									var C = Ext.util.JSON.decode(A.response.responseText);
									if (!Ext.isEmpty(C.file.file)) {
									if (!document.getElementById('_DownFrame')) {
										var B = document.createElement("IFRAME");
										B.id = '_DownFrame';
										B.style.display = "none";
										document.body.appendChild(B);
									};
									if (typeof B != 'object') {
										var B = document.getElementById('_DownFrame');
									};
									B.src = './config.php?devision=120&async_call=1&download=1&getmultifile=' + C.file.file + '&name=' + C.file.name + '&ext=' + C.file.ext;
									}
								}
							});
						}
						else
							if (S.getCount() == 1) {
								if (!document.getElementById('_DownFrame')) {
									var B = document.createElement("IFRAME");
									B.id = '_DownFrame';
									B.style.display = "none";
									document.body.appendChild(B);
								};
								if (typeof B != 'object') {
									var B = document.getElementById('_DownFrame');
								};
								B.src = './config.php?devision=120&async_call=1&download=1&getsingleord=' + S.getSelected().data.orderid + '&getsinglepath=' + S.getSelected().data.filename;
							}
						}
					}]
				}

			]
		}
		]
	    }],


		items: [{
			xtype: 'grid',
			width: 959,
			height: 800,
			id: 'ordersGrid',
			loadMask: true,
			sm: sm,
			store: S,
			bbar: new Ext.PagingToolbar({
				pageSize: 100,
				store: S,
				displayInfo: true,
				listeners: {
					beforechange: function(p, o){
						if(!Ext.isEmpty(p.store.lastOptions)) {
							for(var i in p.store.lastOptions.params)
							{
								switch(i){
									case 'sortdir':
									case 'sortfield':
										o[i] = p.store.lastOptions.params[i];
									break;
								}
							}
						}
					}
				}
			}),
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: true,
					menuDisabled: true
				},
				columns: [sm, {
					header: Ext.app.Localize.get('Document name'),
					dataIndex: 'filename',
					width: 375,
					sortable: true
				}, {
					header: Ext.app.Localize.get('Period'),
					dataIndex: 'period',
					width: 110,
					sortable: false,
					renderer: function(v) {
						try {
							if (v.format('Y') > 1980) {
								return v.format('Y-m-d')
							} else {
								return ''
							}
						} catch (e) {
							return false;
						}
					}
				},
				{
					header: Ext.app.Localize.get('Creation date'),
					dataIndex: 'creationdate',
					sortable: true,
					width: 120,
					renderer: function(v){
						try {
							if (v.format('Y') > 1980) {
								return v.format('Y-m-d')
							}
							else {
								return 'n/a'
							}
						}
						catch (e) {
							return false;
						}
					}
				},{
					header: Ext.app.Localize.get('Comment'),
					dataIndex: 'comment',
					width: 310
				}]
			})
			//,listeners: {
				//sortchange: function(g, o){
				//	if(g.store.getCount() > 0){
				//		if(g.store.getTotalCount() > g.store.lastOptions.params.limit) {
				//			g.store.reload({ params: {
				//				start: g.store.lastOptions.params.start,
				//				limit: g.store.lastOptions.params.limit,
				//				sortdir: o.direction,
				//				sortfield: o.field
				//			} })
				//		}
				//	}
				//}
			//}
		}
		]
	});

} // end showPanel()

/*
o_order_id
d_doc_id
o_period
o_file_name
o_comment
d_name
o_creation_date"
*/
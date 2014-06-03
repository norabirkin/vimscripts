/**
 * JS Engine to view and control vgroups (accounts) list

 *
 * Repository information:
 */

// Any global storage Storage object
var Store = {
	extract: function(){
		formatDate = function(value) {
			try {
				return value.format('Ymd');
			} catch(e) { return value; }
		};
		for(var i in this) {
			if(typeof this[i] != 'object') {
				continue;
			};
			if(!Ext.isFunction(this[i]['checkRecord'])) {
				this[i]['checkRecord'] = function() {
					return true;
				}
			}
			this[i].each(function(record, rowIndex){
				for(var r in record.data){
					if(this.store.checkRecord(record) === false) {
						continue;
					}
					createHidOrUpdate('_Vgroups', this.name + '[' + rowIndex + '][' + r + ']', formatDate(record.data[r]));
				}
			}, {
				store: this[i],
				name: i
			});
		}
		if(Ext.getCmp('checkduplicates')) {
			createHidOrUpdate('_Vgroups', 'checkduplicates', Ext.getCmp('checkduplicates').getValue() ? 1 : 0);
		}
	}
};


Ext.onReady(function() {
	Ext.QuickTips.init();
	// Load List object
	showVgroupsList('_UsersList');
	// Vgroup phone multitarif
	showMultitarif('_multitarif');
	// Vgroup item blocks
	showVgBlocks('_vgblocks');
	// IP Transport
	showIPTransport('_ipTransportUsed', '_ipTransportFree', '_ifIndex');
	// AS Transport
	showASTransport('_asTransportUsed');
	// MAC Transport
	showMACTransport('_macTransport');
	// Phone Transport
	showPhoneTransport('_phoneTransport');
	// Dialin Services
	showDialinServices('vgDialinServices');	
	// Show VgroupPanel
	showVgroupPanel('VgroupPanel');
});


/**
 * Update balance visual block on selector change
 * @param	object, DOMElement
 * @param	string, block id write to
 */
function updVgBalance(o, id)
{
	var A = null;
	for(var i = 0, off = o.options.length; i < off; i++)
	{
		if(o.options[i].selected) {
			A = o.options[i];
			break;
		}
	}

	if(!Ext.isEmpty(A))
	{
		Ext.each(A.attributes, function(i){
			if(i.nodeName == 'agrmbal') {
				try {
					document.getElementById(this.id).innerHTML = Ext.util.Format.numberFormat(i.nodeValue, 2, ',', ' ');
				}
				catch(e){}
			}
		}, { id: id })
	}
} // end updVgBalance()


/**
 * Update balance value after success payment transaction
 * @param	object
 */
function setNewVgBalance(b)
{
	try {
		this.span.innerHTML = Ext.util.Format.numberFormat(b.newBalance, 2, ',', ' ');
	}
	catch(e){ }

	if(!Ext.isEmpty(this.select))
	{
		var o = document.getElementById(this.select);
		var A = null;
		for(var i = 0, off = o.options.length; i < off; i++)
		{
			if(o.options[i].selected) {
				A = o.options[i];
				break;
			}
		}

		if(!Ext.isEmpty(A))
		{
			Ext.each(A.attributes, function(i){
				if(i.nodeName == 'agrmbal') {
					try {
						i.nodeValue = b.newBalance;
					}
					catch(e){}
				}
			}, { id: id })
		}
	}
} // end setNewVgBalance()


/**
 * Go to view this account statistics
 * @param object, HTML element object
 */
function viewStatistics(form)
{	
	var module = form.findField('moduleid');
	var data = module.findRecord('id', module.getValue());
	var M = {
		id: data.data.id, 
		name: data.data.name, 
		type: data.data.type
	}	
	Ext.app.DefaultView.set('node104', {  //set this to nodeTmp
		x0: M.type,
		x1: M.id,
		x2: new Date().format('Y-m-01'),
		x3: new Date().add(Date.DAY, 1).format('Y-m-d'),
		x4: 3,
		x5: form.findField('login').getValue(),
		a0: 1,
		rm: 1
	}, true);
	submitForm(form.id, 'devision', 104);
} // end viewStatistics()


/**
 * Get page selected module
 *
 */
function getSelectedModule()
{
	var B = {
		id: null,
		type: null,
		name: null
	};
	try {
		var A = Ext.get('moduleid');
		Ext.each(A.dom.options, function(I){
			var C = nodeAttributes(I);
			if(I.selected) {
				B.id = C.value;
				B.type = C.type;
				B.name = I.text;
				return false;
			}
		}, B);
	}
	catch(e) { }
	return B;
} // end getSelectedModule()


/**
 * To start submiting form need validate important data:
 * 1. If there is tariff exept template item (Schedule storage)
 * 2. Conforming if there is not set agreement
 * @param	object, html element object
 * @param	object, contains call back function and scope in to execute
 */
function validateOnSave(form, obj) {
	if(!Ext.isDefined(obj)) {
		return false;
	}
	else {
		if (!Ext.isObject(obj['scope'])) {
			obj['scope'] = this;
		}

		if(!Ext.isFunction(obj['callback'])) {
			obj['callback'] = function() {
				return;
			}
		}
		else {
			obj.callback = obj.callback.createDelegate(obj.scope);
		}
	}

	try {
		var vgid = document.getElementById('_vgid_').value
	}
	catch(e) {
		var vgid = 0
	}

	try {
		var templ = document.getElementById('_templ_').value
	}
	catch(e) {
		var templ = 0
	}

	try {
		var agrmid = document.getElementById('_agrmid_').value
	}
	catch(e) {
		var agrmid = 0
	}

	try {
		var schedule = Store.schedule.getCount()
	}
	catch(e) {
		var schedule = 0
	}

	if(vgid == 0 && templ == 0 && schedule == 0) {
		Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('There should be assigned tarif'));
		return false;
	}

	if (templ == 0) {
		blkcheck = {
			unlock: 0,
			check: true
		};
		Store.vgblocks.each(function(record){
			if(record.get('blkreq') == 0) {
				this.unlock++;
			}
			if (!Ext.isDate(record.get('changedate')) || !/^([0-1][0-9]|[2][0-3])\:([0-5][0-9]{1,2})$/.test(record.get('changetime'))) {
				this.check = false;
				return false;
			}
		}, blkcheck);
		if (!blkcheck.check || (blkcheck.unlock < 1 && vgid < 1)) {
			if (blkcheck.unlock < 1) {
				Ext.Msg.error(Ext.app.Localize.get('Locks') + ': ' + Ext.app.Localize.get('Specify account activation date'));
			}
			else {
				Ext.Msg.error(Ext.app.Localize.get('Locks') + ': ' + Ext.app.Localize.get('Wrong date or time format'));
			}
			return false;
		}

	}

	if(agrmid == 0 && templ == 0) {
		Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Undefined') + ' ' + Ext.app.Localize.get('agreement') + '!');
		return false;
	}

	if(form) {
		var A = nodeAttributes(form);
		var M = getSelectedModule();

		// Start CerberCrypt check process
		Ext.Ajax.request({
			url: 'config.php',
			method: 'POST',
			form: form,
			scope: obj,
			success: function(response) {
				var obj = Ext.decode(response.responseText);
				if(!Ext.isDefined(obj['success'])) {
					Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unknown server error'));
					return false;
				}

				if(obj.success == true) {
					this.callback();
				}
				else {
					if (Ext.isDefined(obj.errors['fatal']) && obj.errors.fatal == true) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.errors.reason);
					}
					else {
						Ext.Msg.confirm(Ext.app.Localize.get('Warning'), obj.errors.reason, function(B){
							if (B == 'yes') {
								if (Ext.isDefined(obj.errors['resetcard']) && obj.errors.resetcard == true) {
									var elements = this.scope.form.getElementsByTagName('INPUT');
									for (var i = 0, off = elements.length; i < off; i++) {
										if (elements[i].name == 'cuid') {
											elements[i].value = 0;
											break;
										}
									}
								}

								if(Ext.isDefined(obj.errors['accoff'])) {
									var elements = this.scope.form.getElementsByTagName('SELECT');
									for (var i = 0, off = elements.length; i < off; i++) {
										if(form.vgid.value == 0 && /^on[mdyh]/.test(elements[i].name)) {
											elements[i].value = -1;
										}
										if(form.vgid.value > 0 && obj.errors.accoff[elements[i].name]) {
											elements[i].value = obj.errors.accoff[elements[i].name];
										}
									}
								}

								this.callback();
							}
						}, this);
					}
				}
			},
			failure: function(){
				// The function to be called upon failure of the request
			},
			params: {
				async_call: 1,
				agenttype: M.type,
				validateform: 1
			}
		});

		return false;
	}

	obj.callback()
	return true;
} // end validateOnSave()


/**
 * Widget to view users accounts list and control them
 * @param	string, render this to DOM id
 */
function showVgroupsList( renderTo )
{
	if (!Ext.get(renderTo)) {
		return;
	}
	else {
		var el  = Ext.get('_Vgroups');
		if (!el) {
			var USECERBER = false;
		}
		else {
			if(nodeAttributes(el.dom)['usecerber'] == 1) {
				var USECERBER = true;
			}
			else {
				var USECERBER = false;
			}
		}
	}

	// View Cookie name
	var COOKIE = 'node7';
	// Let it be global define for the page limit
	var PAGELIMIT = 100;

	Store.vglist = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST',
			timeout: 380000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'vgid', type: 'int' },
			{ name: 'username', type: 'string' },
			{ name: 'userid', type: 'int' },
			{ name: 'agrmid', type: 'int' },
			{ name: 'balance', type: 'float' },
			{ name: 'agrmnum', type: 'string' },
			{ name: 'symbol', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'login', type: 'string' },
			{ name: 'blkreq', type: 'int' },
			{ name: 'blocked', type: 'int' },
			{ name: 'blockdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'accondate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'accoffdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'canmodify', type: 'int' },
			{ name: 'agenttype', type: 'int' },
			{ name: 'agentdescr', type: 'string' },
			{ name: 'tarifdescr', type: 'string' },
			{ name: 'ccrypt', type: 'int' },
			{ name: 'creationdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'ppdebt', type: 'float' },
			{ name: 'dirty', type: 'int' }
		]),
		baseParams:{
			async_call: 1,
			devision: 7,
			getvgroups: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x1', 0) : 0,
			searchtype: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x7', 0) : 0,
			blocked: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3', 0) : 0,
			tarid: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x2', 0) : 0,
			istamplate: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x4') : 0,
			start: 0,
			limit: PAGELIMIT
		},
		remoteSort: true,
		sortInfo: {
			field: 'login',
			direction: "ASC"
		},
		autoLoad: AUTOLOAD
	});

	var Modules = new Ext.data.Store({
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
		}, {
			name: 'descr',
			type: 'string'
		}]),
		baseParams: {
            async_call: 1,
            devision: 7,
            getmodules: 1
		},
		sortInfo: {
			field: 'id',
			direction: "ASC"
		},
		autoLoad: true,
		listeners: {
			load: function(store){
				if(Ext.app.DefaultView.exists(COOKIE)) {
					if(store.find('id', 0) == -1) {
						store.insert(0, new store.recordType({
                            id: 0,
                            name: Ext.app.Localize.get('All'),
                            descr: Ext.app.Localize.get('All')
						}))
					}
					var data = Ext.app.DefaultView.get(COOKIE, 'x1');
					if(!Ext.isEmpty	(data)) {
						Ext.getCmp('modulesCombo').setValue(data);
					}
				}
			}
		}
	});

	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
		width:280,
		initComponent : function(){
			Ext.app.SearchField.superclass.initComponent.call(this);
			this.on('specialkey', function(f, e){
				if(e.getKey() == e.ENTER) {
					this.onTrigger2Click();
				}
			}, this);
		},
		validationEvent:false,
		validateOnBlur:false,
		trigger1Class:'x-form-clear-trigger',
		trigger2Class:'x-form-search-trigger',
		hideTrigger1:true,
		hasSearch : false,
		paramName : 'search',
		onTrigger1Click : function(){
			if(this.hasSearch){
				this.el.dom.value = '';
				var o = {
					start: 0,
					limit: PAGELIMIT
				};
				this.store.baseParams = this.store.baseParams || {};
				this.store.baseParams[this.paramName] = '';
				this.store.reload({params:o});
				this.triggers[0].hide();
				this.hasSearch = false;
				Ext.app.DefaultView.remove(COOKIE, 'x8');
			}
		},
		onTrigger2Click : function(forceReload){
			var v = this.getRawValue();
			if(v.length < 1){
				this.hasSearch = true;
				this.onTrigger1Click();
				return;
			}
			var o = {
				start: 0,
				limit: PAGELIMIT
			};
			this.store.baseParams = this.store.baseParams || {};
			this.store.baseParams[this.paramName] = v;
			if(forceReload != true) {
				this.store.reload({
                	params: o
	            });
			}
			this.hasSearch = true;
			this.triggers[0].show();
			Ext.app.DefaultView.set(COOKIE, {
				x8: v
			});
		}
	});

	var EButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		tplModel: true,
		qtip: Ext.app.Localize.get('Edit account'),
		width: 22,
		dataIndex: 'vgid',
		menuDisabled: true,
		iconCls: 'ext-edit'
	});

	var PButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Save payment'),
		width: 22,
		menuDisabled: true,
		dataIndex: 'vgid',
		iconCls: function(record){
			return 'ext-payhistory'
		}
	});

	var HButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Rent charges') + ' / ' + Ext.app.Localize.get('Balance history'),
		width: 22,
		dataIndex: 'vgid',
		menuDisabled: true,
		iconCls: function(record){
			return 'ext-charts'
		}
	});

	var TButton = new Ext.grid.RowButton({
		header: '&nbsp;',
		tplModel: true,
		qtip: Ext.app.Localize.get('Create account using template'),
		width: 22,
		dataIndex: 'vgid',
		hidden: true,
		iconCls: 'ext-tpl-user-add'
	});

	var SelectionModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});

	// Function to compose storage base params for server list filtering
	// @param	boolean, if pass true to function than call storage load
	// @param	boolean, reset list
	advSearch = function(l,r){
		var c = Ext.getCmp('advSearchList');
		var n = new RegExp('searchtpl','i');
		var s = {};
		var l = l || false;
		if(r == true){
			c.setValue('');
		}
		for(var i in Store.vglist.baseParams){
			if(!n.test(i)) {
				s[i] = Store.vglist.baseParams[i];
			}
		}
		Store.vglist.baseParams = s;
		if(c.mainStore.find('tplname', c.getValue()) > -1) {
			c.mainStore.each(function(r,idx){
				if(r.data.tplname != this.tplname) {
					return;
				}
				for(var i in r.data) {
					if(i == 'tplname') {
						continue;
					}
					this.store.baseParams['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
				}
			}, { store: Store.vglist, tplname: c.getValue() });
		}
		if(l) {
			Store.vglist.reload({ params: { start: 0, limit: PAGELIMIT } });
		}
	}

    var StateCookie = Ext.util.Cookies.get("ys-vgfullist");

	new Ext.grid.GridPanel({
        height: 800,
        width: 980,
		renderTo: renderTo,
		stateful: true,
		stateId: 'vgfullist',
		listeners: {
			afterrender: function() {
				if (Ext.app.DefaultView.exists(COOKIE)) {
					var data = Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x4', false));
					if (data === true) {
						this.getTopToolbar().findById('tplcheckbox').setValue(data);
					}
					var data = Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false));
					if (data === true) {
						this.getTopToolbar().findById('srchcheckbox').setValue(data);
					}
				}
			}
		},
		tbar: new Ext.Toolbar({
			layout: 'form',
			height: 50,
			items: [{
				xtype: 'container',
				width: 975,
				layout: 'toolbar',
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [{
					xtype: 'container',
					width: 42,
					style: {
						paddingRight: '5px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Module') + ': '
				}, {
					xtype: 'combo',
					id: 'modulesCombo',
					hiddenName: 'modCMB',
					width: 200,
					displayField: 'name',
					tpl: '<tpl for="."><div class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					store: Modules,
					listeners: {
						select: function() {
							Store.vglist.baseParams.getvgroups = this.getValue();
							var tarlist = this.ownerCt.get('tarifcombo');
							if(tarlist.getValue() > 0) {
							    tarlist.setValue(0);
							    tarlist.getStore().setBaseParam('gettarifs', this.getValue()).reload();
							    tarlist.fireEvent('select');
							}
							else {
                                tarlist.getStore().setBaseParam('gettarifs', this.getValue()).reload();
                                Store.vglist.reload({ params: { start: 0, limit: PAGELIMIT }});
							}
							Ext.app.DefaultView.set(COOKIE, {
								x1: Store.vglist.baseParams.getvgroups
							});
						}
					}
				}, {
					xtype: 'hidden',
					id: 'moduleidx'
				}, {
					xtype: 'container',
					width: 51,
					style: {
						paddingRight: '5px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Tarif') + ': '
				}, {
					xtype: 'combo',
					id: 'tarifcombo',
					width: 260,
					displayField: 'name',
					valueField: 'id',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					tpl: '<tpl for="."><div ext:qtip="{[values.name]}" class="x-combo-list-item">{id}. {[Ext.util.Format.ellipsis(values.name, 32)]} {[(values.id > 0) ? "(" + values.symbol + ")" : "" ]}</div></tpl>',
					listeners: {
						select: function(){
							Store.vglist.baseParams.tarid = this.getValue();
							Store.vglist.reload({params: { start: 0, limit: PAGELIMIT }});
							Ext.app.DefaultView.set(COOKIE, {
								x2: Store.vglist.baseParams.tarid
							});
						}
					},
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader(
							{ root: 'results' }, [
							{ name: 'id', type: 'int' },
							{ name: 'name', type: 'string' },
							{ name: 'symbol', type: 'string' }
						]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 7,
							gettarifs: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x1', 0) : 0
						},
						sortInfo: {
							//field: 'id',
							field: 'name',
							direction: "ASC"
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
								store.insert(0, new row({
									name: Ext.app.Localize.get('All'),
									id: 0
								}));
								if (Ext.app.DefaultView.exists(COOKIE)) {
									Ext.getCmp('tarifcombo').setValue(Ext.app.DefaultView.get(COOKIE, 'x2', 0));
								}
								else {
									Ext.getCmp('tarifcombo').setValue(0);
								}
							}
						}
					})
				}, {
					xtype: 'container',
					width: 73,
					style: {
						paddingRight: '5px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Status') + ': '
				}, {
					xtype: 'combo',
					id: 'statecombo',
					width: 175,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3', 0) : 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('All')],
							['1', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')],
							['2', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client')],
							['3', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager')],
							['5', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic')],
							['10', Ext.app.Localize.get('Turned off')]
						],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function(combo){
							Store.vglist.baseParams.blocked = combo.getValue();
							Store.vglist.reload({ params: { start: 0, limit: PAGELIMIT } });
							Ext.app.DefaultView.set(COOKIE, {
								x3: Store.vglist.baseParams.blocked
							});
						}
					}
				}, {
					xtype: 'button',
					id: 'lockbutton',
					style: {
						marginLeft: '6px'
					},
					text: Ext.app.Localize.get('Locks'),
					tooltip: Ext.app.Localize.get('Lock management'),
					form: new Ext.form.FormPanel({
						frame: false,
						url: 'config.php',
						items: [{
							xtype: 'hidden',
							name: 'async_call',
							value: 1
						}, {
							xtype: 'hidden',
							name: 'devision',
							value: 7
						}],
						renderTo: Ext.getBody(),
						clearLocks: function() {
							var items = this.findByType('hidden');
							if(items.length > 0) {
								Ext.each(items, function(item){
									if (this.name.test(item.name)) {
										this.form.remove(item);
									}
								}, { form: this, name: new RegExp('lockcommand') });
								this.doLayout();
							}
						}
					}),
					submitObject: {
						method:'POST',
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
								this.store.reload();
							}.createDelegate(this.grid));
							this.form.clearLocks();
						},
						failure: function(form, action){
							var O = Ext.util.JSON.decode(action.response.responseText);
							if(!Ext.isArray(O.reason)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
									this.store.reload()
								}.createDelegate(this.grid));
							}
							else {
								try {
									var store = new Ext.data.ArrayStore({
										autoDestroy: true,
										idIndex: 0,
										data: O.reason,
										fields: [{
											name: 'login',
											type: 'string'
										}, {
											name: 'tardescr',
											type: 'string'
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
											store: store,
											height: 200,
											autoExpandColumn: 'nonedelreason',
											cm: new Ext.grid.ColumnModel({
												columns: [{
													header: Ext.app.Localize.get('Login'),
													dataIndex: 'login',
													width: 140
												}, {
													header: Ext.app.Localize.get('Tarif'),
													dataIndex: 'tardescr',
													width: 200
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
							this.form.clearLocks();
						}
					},
					menu: [{
						text: Ext.app.Localize.get('Block up'),
						handler: function() {
							this.ownerCt.ownerCt.form.clearLocks();
							var G = this.ownerCt.ownerCt.ownerCt.getGrid();
							var Sel = G.getSelectionModel();
							if(Sel.getCount() > 0) {
								Sel.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][state]',
										value: record.data.blocked
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][login]',
										value: record.data.login
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
										value: record.data.tarifdescr
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][action]',
										value: 'lock'
									});
								}, this.ownerCt.ownerCt.form);

								this.ownerCt.ownerCt.form.doLayout();

								if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
									this.ownerCt.ownerCt.submitObject.scope = {
										form: this.ownerCt.ownerCt.form,
										grid: G
									}
								}

								this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
							}
						}
					}, {
						text: Ext.app.Localize.get('Turn off'),
						handler: function() {
							this.ownerCt.ownerCt.form.clearLocks();
							var G = this.ownerCt.ownerCt.ownerCt.getGrid();
							var Sel = G.getSelectionModel();
							if(Sel.getCount() > 0) {
								Sel.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][state]',
										value: record.data.blocked
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][login]',
										value: record.data.login
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
										value: record.data.tarifdescr
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][action]',
										value: 'off'
									});
								}, this.ownerCt.ownerCt.form);

								this.ownerCt.ownerCt.form.doLayout();

								if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
									this.ownerCt.ownerCt.submitObject.scope = {
										form: this.ownerCt.ownerCt.form,
										grid: G
									}
								}

								this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
							}
						}
					}, {
						text: Ext.app.Localize.get('Turn on'),
						handler: function() {
							this.ownerCt.ownerCt.form.clearLocks();
							var G = this.ownerCt.ownerCt.ownerCt.getGrid();
							var Sel = G.getSelectionModel();
							if(Sel.getCount() > 0) {
								Sel.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][state]',
										value: record.data.blocked
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][login]',
										value: record.data.login
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
										value: record.data.tarifdescr
									});

									this.add({
										xtype: 'hidden',
										name: 'lockcommand[' + record.data.vgid + '][action]',
										value: 'unlock'
									});
								}, this.ownerCt.ownerCt.form);

								this.ownerCt.ownerCt.form.doLayout();

								if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
									this.ownerCt.ownerCt.submitObject.scope = {
										form: this.ownerCt.ownerCt.form,
										grid: G
									}
								}

								this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
							}
						}
					}]
				}, {
					xtype: 'button',
					iconCls: 'ext-remove',
					style: {
						marginLeft: '4px'
					},
					form: new Ext.form.FormPanel({
						frame: false,
						url: 'config.php',
						items: [{
							xtype: 'hidden',
							name: 'async_call',
							value: 1
						}, {
							xtype: 'hidden',
							name: 'devision',
							value: 7
						}],
						renderTo: Ext.getBody(),
						clearLocks: function() {
							var items = this.findByType('hidden');
							if(items.length > 0) {
								Ext.each(items, function(item){
									if (this.name.test(item.name)) {
										this.form.remove(item);
									}
								}, { form: this, name: new RegExp('delvgid') });
								this.doLayout();
							}
						}
					}),
					submitObject: {
						method:'POST',
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
								this.store.reload();
							}.createDelegate(this.grid));
							this.form.clearLocks();
						},
						failure: function(form, action){
							var O = Ext.util.JSON.decode(action.response.responseText);
							if(!Ext.isArray(O.reason)) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
									this.store.reload()
								}.createDelegate(this.grid));
							}
							else {
								try {
									var store = new Ext.data.ArrayStore({
										autoDestroy: true,
										idIndex: 0,
										data: O.reason,
										fields: [{
											name: 'login',
											type: 'string'
										}, {
											name: 'tardescr',
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
													header: Ext.app.Localize.get('Login'),
													dataIndex: 'login',
													width: 140
												}, {
													header: Ext.app.Localize.get('Tarif'),
													dataIndex: 'tardescr',
													width: 200
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
							this.form.clearLocks();
						}
					},
					text: Ext.app.Localize.get('Remove'),
					handler: function() {
						this.form.clearLocks();
						var G = this.ownerCt.getGrid();
						var Sel = G.getSelectionModel();
						if(Sel.getCount() > 0) {
							Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Remove selected') + ' ' + Ext.app.Localize.get('accounts') + '?', function(B){
								if(B != 'yes') {
									return false;
								}
								this.sm.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'delvgid[' + record.data.vgid + '][login]',
										value: record.data.login
									});

									this.add({
										xtype: 'hidden',
										name: 'delvgid[' + record.data.vgid + '][tarifdescr]',
										value: record.data.tarifdescr
									});
								}, this.Button.form);

								this.Button.form.doLayout();

								if(!Ext.isDefined(this.Button.submitObject['scope'])) {
									this.Button.submitObject.scope = {
										form: this.Button.form,
										grid: this.Grid
									}
								}

								this.Button.form.getForm().submit(this.Button.submitObject);
							}, {
								sm: Sel,
								Button: this,
								Grid: G
							});
						}
					}
				}]
			}, {
				xtype: 'container',
				width: 975,
				layout: 'toolbar',
				style: {
					paddingTop: '2px'
				},
				getGrid: function() {
					return this.ownerCt.ownerCt;
				},
				items: [{
					xtype: 'container',
					width: 134,
					style: {
						paddingRight: '2px',
						textAlign: 'right'
					},
					html: Ext.app.Localize.get('Account template') + ': '
				}, {
					xtype: 'checkbox',
					width: 23,
					height:23,
					id: 'tplcheckbox',
					value: 1,
					checked: false,
					handler: function(A, B){
						Ext.app.DefaultView.set(COOKIE, {
							x4: B ? 1 : 0
						});
						// Lock panel controls
						if(B) {
							Ext.getCmp('statecombo').setValue(0);
							Store.vglist.baseParams.blocked = 0;
							Ext.app.DefaultView.remove(COOKIE, 'x3')
						}
						Ext.getCmp('statecombo')[B ? 'disable' : 'enable']();
						Ext.getCmp('lockbutton')[B ? 'disable' : 'enable']();

						var G = this.ownerCt.getGrid();
						var Col = G.getColumnModel();

						if(!Ext.isDefined(G['cmDefaults'])) {
							G.cmDefaults = [];
						}

						Ext.each(Col.columns, function(C, idx){
							if (idx > 1) {
								if(!Ext.isDefined(this.grid.cmDefaults[idx])) {
									this.grid.cmDefaults[idx] = {
										hidden: !Ext.isDefined(this.cm.config[idx].hidden) ? false : this.cm.config[idx].hidden,
										width: this.cm.config[idx].width
									};
								}

								if (this.isTpl) {
									this.cm.config[idx]['hidden'] = Ext.isDefined(C['tplModel']) ? false : true;
									if(C.dataIndex == 'descr') {
										var free = this.grid.getInnerWidth() - 20 - this.cm.getTotalWidth();
										if(free > 0) {
											this.cm.setColumnWidth(idx, this.cm.columns[idx].width + free);
										}
									}
								}
								else {
									this.cm.config[idx]['hidden'] = Ext.isDefined(C['tplModel']) ? true : this.grid.cmDefaults[idx].hidden;
									if (C.dataIndex == 'descr') {
										this.cm.setColumnWidth(idx, this.grid.cmDefaults[idx].width);
									}
								}
							}
						}, {
							grid: G,
							cm: Col,
							isTpl: B
						});

						// Rebuild config
						Col.setConfig(Col.config);

						// Recalculate width
						Col.getColumnsBy(function(C){
  							if(C.dataIndex == 'descr') {
								var idx = this.cm.getIndexById(C.id);
								if(this.isTpl) {
									var free = this.grid.getInnerWidth() - 20 - this.cm.getTotalWidth();
									if (free > 0) {
										this.cm.setColumnWidth(idx, this.cm.columns[idx].width + free);
									}
								}
								else {
									this.cm.setColumnWidth(idx, this.grid.cmDefaults[idx].width);
								}
							}
						}, {
							grid: G,
							cm: Col,
							isTpl: B
						});

						Store.vglist.baseParams.istemplate = B ? 1 : 0
						Store.vglist.reload({ params: { start: 0, limit: PAGELIMIT } });
					}
				}, {
					xtype: 'tbseparator',
					style: {
						paddingRight: '15px'
					}
				}, {
					xtype: 'container',
					style: {
						paddingLeft: '2px'
					},
					html: Ext.app.Localize.get('Advanced search') + ': '
				}, {
					xtype: 'checkbox',
					id: 'srchcheckbox',
					width: 23,
					height:23,
					checked: false,
					handler: function(A, B){
						A.ownerCt.items.eachKey(function(A,B,C) {
							if(this.tpl.test(B.id)) {
								B[this.checked ? 'show' : 'hide']();
							}
							if(this.tpl2.test(B.id)) {
								if(this.checked && Ext.isDefined(B['hasSearch']) && B['hasSearch']) {
									B.onTrigger1Click();
								}
								B[this.checked ? 'hide' : 'show']();
							}
						}, {
							checked: B,
							tpl: new RegExp('advSearch'),
							tpl2: new RegExp('SmplSearch')
						});

						Ext.app.DefaultView.set(COOKIE, {
							x5: B ? 1 : 0
						});

						if(!B){
							Ext.app.DefaultView.remove(COOKIE, 'x6');
							advSearch(true, true);
						}
						else {
							Ext.app.DefaultView.remove(COOKIE, 'x8');
						}
					}
				}, {
					xtype: 'tbspacer',
					id: 'advSearchSpacer1',
					hidden: true,
					width: 5
				}, {
					xtype: 'combo',
					hidden: true,
					id: 'advSearchList',
					width: 194,
					displayField: 'tplname',
					valueField: 'tplname',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					editable: true,
					listeners: {
						select: function() {
							if(Ext.app.DefaultView.exists(COOKIE)) {
								Ext.app.DefaultView.set(COOKIE, {
									x6: this.getRawValue()
								})
							}
						}
					},
					store: new Ext.data.ArrayStore({
						fields: [{ name: 'tplname', type: 'string' }],
						data: []
					}),
					mainStore: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [
							{ name: 'tplname', type: 'string' },
							{ name: 'property', type: 'string' },
							{ name: 'condition', type: 'string' },
							{ name: 'date', type: 'date', dateFormat: 'd-m-Y' },
							{ name: 'value', type: 'string' },
							{ name: 'logic', type: 'string' }
						]),
						baseParams: {
							async_call: 1,
							devision: 42,
							getallsearchtpl: ''
						},
						autoLoad: true,
						listeners: {
							add: function(s,r,i){
								var C = Ext.getCmp('advSearchList');
								Ext.each(r, function(A){
									if(this.store.find('tplname', A.data.tplname) < 0) {
										this.store.add(A);
									}
									if(this.cookie && this.cookieData == A.data.tplname) {
										this.element.setValue(A.data.tplname);
										advSearch(AUTOLOAD);
									}
								}, {
									element: C,
									store: C.store,
									mainStore: C.mainStore,
									cookie: Ext.app.DefaultView.exists(COOKIE),
									cookieData: Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false)) ? Ext.app.DefaultView.get(COOKIE, 'x6') : null
								});
							},
							load: function(s,r,i){
								s.events.add.listeners[0].fn(s,r,i);
							},
							remove: function(s,r,i){
								var C = Ext.getCmp('advSearchList');
								var f = C.store.find('tplsname', r.data.tplname);
								if(f > -1) {
									C.store.remove(C.store.getAt(f));
								}
							}
						}
					})
				}, {
					xtype: 'tbspacer',
					hidden: true,
					id: 'advSearchSpacer2',
					width: 5
				}, {
					xtype: 'button',
					id: 'advSearchStart',
					hidden: true,
					text: Ext.app.Localize.get('Search'),
					iconCls: 'ext-search',
					handler: function(){
						advSearch(true);
					}
				}, {
					xtype: 'button',
					id: 'advSearchEdit',
					text: Ext.app.Localize.get('Change') + '&nbsp;' + Ext.app.Localize.get('rules') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
					hidden: true,
					handler: function(){
						fn = function(A){
							var C = Ext.getCmp('advSearchList');
							C.mainStore.each(function(r){
								if(r.data.tplname == this.tplname) {
									this.store.remove(r);
								}
							}, { store: C.mainStore, tplname: A.tplname});
							if(A.data.length > 0) {
								Ext.each(A.data, function(A){
									this.add(new this.recordType(A))
								}, C.mainStore);
								if(!Ext.isEmpty(A.data[0].tplname)) {
									C.setValue(A.data[0].tplname);
								}
							}
							else {
								var i = C.store.find('tplname', A.tplname);
								if(i > -1) {
									C.store.remove(C.store.getAt(i));
								}
								C.setValue('');
							}
						};
						var C = Ext.getCmp('advSearchList');
						var rules = [];
						C.mainStore.each(function(R){
							if(this.tplname == R.data.tplname){
								this.rules.push(R.data);
							}
						}, { rules: rules, tplname: C.getValue() });
						new SearchTemplate.show({
							tplname: C.getValue(),
							onsearch: fn,
							onsave: fn,
							onSaveClose: true,
							rules: rules
						})
					}
				}, {
					xtype: 'tbspacer',
					id: 'SmplSearchSpacer1',
					width: 5
				}, {
					xtype: 'combo',
					width: 200,
					id: 'SmplSearchCombo',
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x7', 0) : 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('Person full name')],
							['1', Ext.app.Localize.get('Agreement')],
							['6', Ext.app.Localize.get('Paycode')],
							['2', Ext.app.Localize.get('Login')],
							['4', 'IP ' + Ext.app.Localize.get('address')],
							['5', Ext.app.Localize.get('Phone')],
							['7', Ext.app.Localize.get('Description')],
							['8', Ext.app.Localize.get('Address')],
							['11', Ext.app.Localize.get('Smartcard serial')],
							['12', Ext.app.Localize.get('Equipment serial')],
							['13', Ext.app.Localize.get('Equipment MAC-address')],
							['14', Ext.app.Localize.get('Equipment Chip id')]
						],
						fields: ['id', 'name']
					}),
					listeners: {
						render: function() {
							if(USECERBER) {
								this.store.add(new this.store.recordType({ id: 10, name: Ext.app.Localize.get('Card') + ' CerberCrypt' }));
							}
						},
						select: function(){
							Store.vglist.baseParams.searchtype = this.getValue();
							Ext.app.DefaultView.set(COOKIE, {
								x7: this.getValue()
							});
						}
					}
				}, {
					xtype: 'container',
					id: 'SmplSearchSpacer2',
					width: 7,
					html: '&nbsp;'
				}, new Ext.app.SearchField({
					store: Store.vglist,
					id: 'SmplSearchField',
					params: {
						start: 0,
						limit: PAGELIMIT
					},
					width: 227,
					listeners: {
						afterrender: function(field) {
							if(Ext.isIE8) {
							     field.getEl().setStyle('top', '0px');
							} 
							
							if(Ext.app.DefaultView.exists(COOKIE)) {
								var data = Ext.app.DefaultView.get(COOKIE, 'x8');
								if(!Ext.isEmpty(data)) {
									this.setValue(data);
									this.onTrigger2Click(true);
								}
							}
						}
					}
				})]
			}]
		}),
		cm: new Ext.grid.ColumnModel({
			columns: [SelectionModel, EButton, TButton, PButton, HButton, {
				header: Ext.app.Localize.get('Login'),
				dataIndex: 'login',
				width: 105
			}, {
				header: Ext.app.Localize.get('Card') + ' CC',
				dataIndex: 'ccrypt',
				hidden: !StateCookie ? (USECERBER ? false : true) : undefined,
				width: 50
			}, {
				header: Ext.app.Localize.get('Agreement'),
				id: 'agrmcolumn',
				dataIndex: 'agrmnum'
			}, {
				header: Ext.app.Localize.get('Balance'),
				dataIndex: 'balance',
				width: 70,
				renderer: function(value, metaData, record) {
					if (value < 0) {
						metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + '"'
						return '<span style="color:red">' + value + '</span> ' + record.get('symbol');
					}
					else {
						return value + ' ' + record.get('symbol');
					}
				}
			}, {
				header: Ext.app.Localize.get('Promised payment'),
				dataIndex: 'ppdebt',
				width: 105,
				hidden: !StateCookie ? true : undefined,
				sortable: false,
				renderer: function(value, metaData, record) {
						metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + ' ' + (value == 0 ? '(' + Ext.app.Localize.get('Empty data') + ')' : '') + '"';
						return value + ' ' + record.get('symbol');
				}
			}, {
				header: Ext.app.Localize.get('Creation date'),
				dataIndex: 'creationdate',
				tplModel: true,
				width: 115,
				hidden: !StateCookie ? true : undefined,
				renderer: function(value, metaData) {
					try {
						metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
						return value.format('d.m.Y H:i');
					}
					catch(e){
						return value;
					}
				}
			}, {
				header: Ext.app.Localize.get('Date to turn on'),
				dataIndex: 'accondate',
				width: 113,
				renderer: function(value, metaData) {
					try {
						if (!Ext.isEmpty(value) && value.format('Y') <= 1900) {
							return '-';
						}
						else {
							metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
							return value.format('d.m.Y H:i');
						}
					}
					catch(e){
						return value;
					}
				}
			}, {
				header: Ext.app.Localize.get('Date to turn off'),
				dataIndex: 'accoffdate',
				width: 107,
				renderer: function(value, metaData) {
					try {
						if (!Ext.isEmpty(value) && value.format('Y') <= 1900) {
							return '-';
						}
						else {
							metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
							return value.format('d.m.Y H:i');
						}
					}
					catch(e){
						return value;
					}
				}
			}, {
				header: '&nbsp;',
				tooltip: Ext.app.Localize.get('Status'),
				dataIndex: 'blocked',
				menuDisabled: true,
				width: 24,
				renderer: function(value, metaData, record) {
					if (value > 0) {
						metaData.css = 'ext-blocked-grid';
					}
					else {
						metaData.css = 'ext-activate';
					}
					switch(value) {
						case 1:
						case 4:
							metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
							return Ext.app.Localize.get('B');

						case 10:
							metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Turned off') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
							return 'O';

						case 3:
							metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
							return 'A';

						case 5:
							metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
							return 'T';

						case 2:
							metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by user') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
							return Ext.app.Localize.get('U');
					}
				}
			}, {
				header: Ext.app.Localize.get('Date'),
				tooltip: Ext.app.Localize.get('Date state was changed'),
				dataIndex: 'blockdate',
				width: 105,
				renderer: function(value) {
					try {
						return value.format('d.m.Y H:i');
					}
					catch(e) {
						return value
					}
				}
			}, {
				header: '&nbsp;',
				tooltip: Ext.app.Localize.get('Module'),
				dataIndex: 'agentdescr',
				width: 21,
				tplModel: true,
				menuDisabled: true,
				renderer: function(value, metaData, record) {
					switch(record.get('agenttype')) {
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							metaData.css = "ext-leased";
						break;

						case 6:
							metaData.css = "ext-radius";
						break;

						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							metaData.css = "ext-cdrpabx";
						break;

						case 12:
							metaData.css = "ext-voip";
						break;

						case 13:
							metaData.css = "ext-usbox";
						break;
					}

					if (record.get('agenttype') == 13 && record.get('dirty') > 0) {
						metaData.attr = 'ext:qtip="' + value + ' :: ' + Ext.app.Localize.get('Account is waiting to be recalculated') + '..."';
						return '<img src="images/warning_small.png" border="0" width="10" height="10" style="margin-top: 3px; margin-left: 3px;">'
					}
					else {
						metaData.attr = 'ext:qtip="' + value + '"';
						return '&nbsp;';
					}
				}
			}, {
				header: Ext.app.Localize.get('Person full name'),
				dataIndex: 'username',
				width: 140
			}, {
				header: Ext.app.Localize.get('Tarif'),
				width: 200,
				tplModel: true,
				dataIndex: 'tarifdescr'
				//,hidden: !StateCookie ? true : undefined
			}, {
				header: Ext.app.Localize.get('Description'),
				width: 150,
				tplModel: true,
				dataIndex: 'descr',
				hidden: !StateCookie ? true : undefined
			}],
			defaults: {
				sortable: true,
				menuDisabled: false
			}
		}),
		sm: SelectionModel,
		plugins: [ EButton, TButton, PButton, HButton ],
		autoExpandColumn: 'agrmcolumn',
		loadMask: true,
		store: Store.vglist,
		bbar: new Ext.PagingToolbar({
			pageSize: PAGELIMIT,
			store: Store.vglist,
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
						Store.vglist.reload({ params: { limit: PAGELIMIT } });
					}
				}
			}]
		})
	});

	EButton.on('action', function(grid, record, rowIndex) {
		submitForm('_Vgroups', 'vgid', record.data.vgid)
	});

	HButton.on('action', function(grid, record, rowIndex) {
		if(record.data.istemplate) {
			return;
		}
		
		Charges({
			vgid: record.data.vgid,
			module: record.data.id,
			moduletype: record.data.agenttype
		});
	});

	PButton.on('action', function(grid, record, rowIndex){
		if(record.data.istemplate) {
			return;
		}
		setPayment({
			uid: record.data.userid,
			agrmid: record.data.agrmid,
            vgid: record.data.vgid,
            onpayment: function(o){
                grid.store.reload();
            },
            onpromised: function(o){
                grid.store.reload();
            },
            scope: grid
        })
	});

	TButton.on('action', function(grid, record, rowIndex){
		submitForm('_Vgroups', 'vgroupbytpl', record.data.vgid);
	});
}; // end showVgroupsList()


/**
 * Initialize agreements data according to selected user
 * @param	object, for the direct call there should be null
 * @param	string, select id
 * @param	string, dom element id to set user name
 * @param	string, dom element id to set user id
 * @param	string, form dom element id
 */
function initUserAgrms( grid, renderId, User, UserId, UserForm )
{
	if(Ext.isEmpty(grid)) {
		showUsers({ sm: true, callbackok: initUserAgrms, renderId: renderId, User: { name: User, id: UserId, form: UserForm, userCatField: 'usercategory' } });
	}
	else
	{
		if(Ext.isEmpty(grid.getSelectionModel().getSelected())) {
			return false;
		}
		else var record = grid.getSelectionModel().getSelected();

		try { var sel = document.getElementById(this.renderId); } catch(e) { return false; }
		try { document.getElementById(this.User.name).innerHTML = record.data.name; } catch(e) { return false; }
		createHidOrUpdate(this.User.form, this.User.id, record.data.uid);
		createHidOrUpdate(this.User.form, this.User.userCatField, record.data.category);
		while(sel.options.length > 0) { sel.options[sel.options.length - 1] = null; }
		parseOptions = function(record) { var len = sel.options.length; sel.options[len] = new Option(record.data.number, record.data.agrmid); }
		var store = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results' }, [ { name: 'agrmid', type: 'int' }, { name: 'number', type: 'string' } ]), baseParams:{ async_call: 1, devision: 7, getagrms: record.data.uid }, autoLoad: true, listeners: { load: function(store) { store.each(parseOptions) } } })
	}
} // end initUserAgrms()


/**
 * Generate new password
 * Button for generate new password for account
 * @todo	Get length from LANBilling options
 */
function genNewPass(elId){
	/**
	 * 8 - pwd length
	 */
	pwd = generatePassword(8,2);
	return document.getElementById(elId).value = pwd;
}
function generatePassword(limit, inclNumbers) {
    var vowels = 'aeiou'.split('');
    var constonants = 'bcdfghjklmnpqrstvwxyz'.split('');
    var word = '', i, num;
    if (!limit) limit = 8;
    for (i = 0; i < (inclNumbers ? limit - 3 : limit); i++) {
        if (i % 2 == 0) { // even = vowels
            word += vowels[Math.floor(Math.random() * 4)];
        } else {
            word += constonants[Math.floor(Math.random() * 20)].toUpperCase();
        }
    }
    if (inclNumbers) {
        num = Math.floor(Math.random() * 99) + '';
        if (num.length == 1) num = '00' + num;
        else if (num.length == 2) num = '0' + num;
        word += num;
    }
    return word.substr(0, limit);
}


/**
 * ConnectedFromUser
 * Select parent user for account
 * @param	object, for the direct call there should be null
 * @param	string, dom element id to set user name
 * @param	string, dom element id to set user id
 * @param	string, form dom element id
 */
function ConnectedFromUser( grid, renderId, User, UserId, UserForm )
{
	if (Ext.isEmpty(grid)) {
		showUsers({
					sm : true,
					callbackok : ConnectedFromUser,
					renderId : renderId,
					User : {
						name : User,
						id : UserId,
						form : UserForm,
						userCatField : 'userconnectedcategory'
					}
				});
	} else {
		if(Ext.isEmpty(grid.getSelectionModel().getSelected())) { return false; }
		else var record = grid.getSelectionModel().getSelected();
		try { document.getElementById(this.User.name).innerHTML = record.data.name; } catch(e) { return false; }
		createHidOrUpdate(this.User.form, this.User.id, record.data.uid);
		createHidOrUpdate(this.User.form, this.User.userCatField, record.data.category);
	}
}
// end ConnectedFromUser()


function vg_addr(){
	apply = function(A, B){

		if (!Ext.isEmpty(A.clear)){

			try {
				//document.getElementById('_vgUserAddr').innerHTML = A.clear.join(',<br/>');
				//document.getElementById('_vgAddrCode_').value = A.code.join(',');
				document.getElementById('_vgUserAddr').innerHTML = A.full.join(',');
				document.getElementById('_vgAddrCode_').value = A.code.join(',');
			}
			catch (e) {
				alert(e.toString())
			}
		}else{
			document.getElementById('_vgUserAddr').innerHTML = Ext.app.Localize.get('Undefined');
		}
    }
	adrCode = (Ext.isEmpty(document.getElementById('_vgAddrCode_').value)) ? '0,0,0,0,0,0,0,0,0,0' : document.getElementById('_vgAddrCode_').value;
	adrString = (document.getElementById('_vgUserAddr').innerHTML ==  Ext.app.Localize.get('Undefined')) ? ',,,,,,,,' : document.getElementById('_vgUserAddr').innerHTML;
	address(apply, { code: adrCode, string: adrString }, '_vgUserAddr');
}





/**
 * Show grid with multitarif
 * @param	string, render grid to
 */
function showMultitarif( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var module = document.getElementById('_module_').value } catch(e) { return false; }
	try { var tarid = document.getElementById('_tarid_').value } catch(e) { var tarid = 0 }
	try { var vgid = document.getElementById('_vgid_').value } catch(e) { var vgid = 0 }

	var tarMultStore = false;
	addRecord = function(record, grid) {

        try { record = record || {'data':{'recordid':0, 'dtto':0}} } catch(e) {return;}

        isInsert = true;
        if (record.data.recordid > 0){
            isInsert = false;
        }
		if(!Ext.isEmpty(Ext.getCmp('_mtar'))) { return; }
		tarMultStore = new Ext.data.Store({
			id: 'tarMultStore',
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
			reader: new Ext.data.JsonReader({ root: 'results' }, [
				{ name: 'tarid', type: 'int' },
				{ name: 'name', type: 'string' },
				{ name: 'symbol', type: 'string' },
				{ name: 'coeflow', type: 'float' },
				{ name: 'coefhigh', type: 'float' }
			]),
			autoLoad: true,
			baseParams: {
				async_call: 1,
				devision: 7,
				unavail: 0,
				gettarifs: module,
                origtarid: !tarid ? 0 : tarid,
				agrmcurid: !document.getElementById('_agrmid_') ? 0 : document.getElementById('_agrmid_').value
			},
			sortInfo: { field: 'name', direction: "ASC" }
		});

		var Win = new Ext.Window({
			title: Ext.app.Localize.get('Add'),
			width: 495,
			id: '_mtar',
			items:[{
				xtype: 'form',
				frame: true,
				monitorValid: true,
				buttonAlign: 'center',
	            buttons: [
                    {
                        xtype: 'button',
                        formBind: true,
                        text: (isInsert) ? Ext.app.Localize.get('Add') : Ext.app.Localize.get('Update'),
                        handler: function(Btn){
                            var t = Btn.findParentByType('form').tarif;
                            if (t.getStore().find('tarid', new RegExp('^' + t.getValue() + '$')) < 0) {
                                return false;
                            };
                            Ext.Ajax.request({
                                url: 'config.php',
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
                                            Ext.getCmp('_multitarifGrid').getStore().reload();
                                            Win.close();
                                        }else{
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                                        }
                                    }
                                  return false;
                                },
                                params: {
                                    async_call: 1,
                                    devision: 7,
                                    insupdMultitarif: (record.data.recordid > 0) ? record.data.recordid : 0,
                                    //vgid: !document.getElementById('_agrmid_') ? 0 : document.getElementById('_agrmid_').value,
                                    vgid: !vgid ? 0 : vgid,
                                    tarid: !Ext.isEmpty(t.originValue) ? t.originValue : t.getValue(),
                                    dtfrom: Ext.getCmp('_dateFrom').getValue(),
                                    dtto: Ext.getCmp('_dateTo').getValue(),
                                    useDateTo: Ext.getCmp('useDateTo').getValue()
                                }
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        text: Ext.app.Localize.get('Cancel'),
                        handler: function(){
                            Win.close()
                        }
                    }
                ],
				items:[
                    {
                        xtype: 'datefield',
                        autoWidth: true,
                        id: '_dateFrom',
                        name: 'dateFrom',
                        allowBlank: false,
                        readOnly: true,
                        fieldLabel: Ext.app.Localize.get('Date from'),
                        format: 'Y-m-d',
                        width: 140,
                        value: (isInsert) ? new Date() : record.data.dtfrom.format('Y-m-d'),
                        maskRe: new RegExp('[0-9\-]'),
                        formBind: true
                    },

                    {
                        xtype: 'compositefield',
                        labelWidth: 120,
                        fieldLabel: Ext.app.Localize.get('Date to'),
                        items: [
                            {
                                xtype: 'checkbox',
                                name: 'useDateTo',
                                id: 'useDateTo',
                                submitValue: 1,
                                listeners: {
                                    afterrender: function(checkbox, checked){
                                        if (!isInsert && record.data.dtto.format('Y-m-d') != '9999-12-31')
                                            checkbox.setValue(true);
                                    },
                                    check: function(checkbox, checked) {
                                        datetofield = Ext.getCmp('_dateTo');
                                        if(checked) {
                                            datetofield.minValue = Ext.getCmp('_dateFrom').getValue();
                                            datetofield.enable();
                                        }else{
                                            datetofield.setValue(Ext.getCmp('_dateFrom').getValue().format('Y-m-d')).disable();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'datefield',
                                autoWidth: true,
                                id: '_dateTo',
                                name: 'dateTo',
                                allowBlank: true,
                                readOnly: true,
                                format: 'Y-m-d',
                                width: 140,
                                value: (isInsert || record.data.dtto.format('Y-m-d') == '9999-12-31') ? new Date() : record.data.dtto.format('Y-m-d'),
                                maskRe: new RegExp('[0-9\-]'),
                                formBind: false,
                                disabled: true,
                                listeners: {
                                    afterrender: function(){
                                        if (isInsert)
                                            this.setValue(Ext.getCmp('_dateFrom').getValue().format('Y-m-d'));
                                    }
                                }
                            }
                        ]
                    },

                    {
                        xtype: 'combo',
                        ref: 'tarif',
                        id: '_multiCombo',
                        allowBlank: false,
                        emptyText: '...',
                        fieldLabel: Ext.app.Localize.get('Tarif'),
                        width: 260,
                        listWidth: 320,
                        displayField: 'name',
                        valueField: 'tarid',
                        tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name} ({symbol})">{tarid}. {[Ext.util.Format.ellipsis(values.name, 27)]} ({symbol})</div></tpl>',
                        editable: false,
                        typeAhead: true,
                        triggerAction: 'all',
                        mode: 'local',
                        store: tarMultStore,
                        enableKeyEvents: true,
                        listeners: {
                            afterrender: function(combo, rec, index){
                                if (!isInsert){
                                    this.setValue(record.data.tarid);
                                    this.setRawValue(record.data.tarname);
                                }
                            },
                            select: function(combo, rec, index){
                                this.originValue = this.getValue();
                            }
                        }
                    }
				]
			}]
		});
		Win.show();

		if(!document.getElementById('_agrmid_') || Ext.isEmpty(document.getElementById('_agrmid_').value)) {
			Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Undefined') + ' ' + Ext.app.Localize.get('agreement') + '!');
		}
	}





	new Ext.grid.GridPanel({
		title: Ext.app.Localize.get('Multitarif'),
        id: '_multitarifGrid',
		renderTo: renderTo,
		height: 190,
		width: 613,
		loadMask: true,
		autoExpandColumn: 'tarname',
		menuDisabled: true,
        enableHdMenu: false,
        disableSelection: true,
		listeners: {
			afterrender: function(grid){
				var vgid = Ext.get('_vgid_');
				if((vgid.getValue() * 1) > 0) {
					grid.getStore().setBaseParam('getMultitarifs', vgid.getValue()).reload();
				}
				else {
                    return false;
				}
			},
			beforerender: function(grid) {
                grid.plugins[0].on('action', function(grid, record, idx){
                    addRecord(record,grid);
				});
                grid.plugins[1].on('action', function(grid, record, idx){
                    Ext.MessageBox.show({
                        title: Ext.app.Localize.get('Remove multitarif'),
                        msg: Ext.app.Localize.get('Are you really want to delete multitarif?'),
                        width:400,
                        buttons: Ext.MessageBox.OKCANCEL,
                        multiline: false,
                        fn: function( btn ){
                            if (btn == 'cancel') return;
                            Ext.Ajax.request({
                                url: 'config.php',
                                method: 'POST',
                                params: {
                                    async_call: 1,
                                    devision: 7,
                                    delMultitarif: record.data.recordid
                                },
                                scope: {
                                    load: Ext.Msg.wait(Ext.app.Localize.get('Wait for complete') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
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
                                            grid.getStore().remove(record);
                                        }else{
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.error.reason);
                                        }
                                    }
                                  return false;
                                }
                            });
                        }
                    });
				});
				grid.getColumnModel().setConfig(
                    [
                        grid.plugins[0],
                        {
                            header: Ext.app.Localize.get('Date from'),
                            dataIndex: 'dtfrom',
                            renderer: function(value){try {return value.format('Y-m-d')}catch(e){}return value;}
                        },
                        {
                            header: Ext.app.Localize.get('Date to'),
                            dataIndex: 'dtto',
                            renderer: function(value){try {return value.format('Y-m-d')}catch(e){}return value;}
                        },
                        {
                            header: Ext.app.Localize.get('Tarif'),
                            dataIndex: 'tarname',
                            id: 'tarname'
                        },
                        grid.plugins[1]
                    ]
                );
			}
		},
		tbar: [{
			xtype: 'button',
			itemId: 'addMTarbtn',
			text: Ext.app.Localize.get('Add'),
			iconCls: 'ext-add',
			handler: function(Btn, params){
                addRecord();
			}
		}],
		plugins: [
            new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit'), width: 22, iconCls: 'ext-edit' }),
            new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), width: 22, iconCls: 'ext-drop' })
        ],
		columns: [],
        defaults: {
            menuDisabled: true,
            sortable: true
        },
		store: {
			xtype: 'jsonstore',
			timeout: 380000,
			url: 'config.php',
			method: 'POST',
			root: 'results',
			fields: [
				{ name: 'recordid', type: 'int' },
                { name: 'vgid',     type: 'int' },
                { name: 'tarid',    type: 'int' },
                { name: 'dtfrom',   type: 'date'},
				{ name: 'dtto',     type: 'date'},
				{ name: 'tarname',  type: 'string' }
			],
			baseParams: {
				async_call: 1,
				devision: 7
			},
            sortInfo : {
                field : 'dtfrom',
                direction : "DESC"
            }
		}
	});
} // end showMultitarif()





/**
 * Show vgroup item block
 * @param	string, HTMLElement id to render to
 */
function showVgBlocks(renderTo) {
	if(!document.getElementById(renderTo)) return;

	new Ext.grid.EditorGridPanel({
		title: Ext.app.Localize.get('Planning of blocking'),
		renderTo: renderTo,
		height: 190,
		width: 613,
		loadMask: true,
		autoExpandColumn: 'vgblk-col-exp',
		clicksToEdit: 1,
		menuDisabled: true,
		listeners: {
			afterrender: function(grid){
				var vgid = Ext.get('_vgid_');
				if((vgid.getValue() * 1) > 0) {
					grid.getStore().setBaseParam('getvgblocks', vgid.getValue()).reload();
				}
				else {
					var Btn = grid.getTopToolbar().get('addrecbtn');
					Btn.handler(Btn, {
						blkreq: 0
					});
				}
				Store.vgblocks = grid.store;
			},
			beforerender: function(grid) {
				grid.plugins[0].on('action', function(grid, record, idx){
					grid.getStore().remove(record);
				});

				grid.getColumnModel().setConfig([{
					header: Ext.app.Localize.get('Date'),
					dataIndex: 'changedate',
					renderer: function(value){
						try {
							return value.format('d.m.Y');
						}
						catch(e){ }
						return value;
					},
					editor: new Ext.form.DateField({
						format: 'd.m.Y'
					})
				}, {
					header: Ext.app.Localize.get('Time'),
					dataIndex: 'changetime',
					renderer: function(value) {
						try {
							return value.format('H:i');
						}
						catch(e) { }
						return value;
					},
					editor: new Ext.form.TextField({
						maskRe: new RegExp('[0-9\:]'),
						regex: new RegExp('^([0-1][0-9]|[2][0-3])\:([0-5][0-9]{1,2})$')
					})
				}, {
					header: Ext.app.Localize.get('Lock type'),
					width: 120,
					dataIndex: 'blkreq',
					renderer: function(value) {
						switch(value) {
							case 0: return Ext.app.Localize.get('Turn on');
							case 1: return Ext.app.Localize.get('by balance');
							case 2: return Ext.app.Localize.get('by client');
							case 3: return Ext.app.Localize.get('Administrative');
							case 4: return Ext.app.Localize.get('by balance');
							case 5: return Ext.app.Localize.get('by traffic amount');
							case 10: return Ext.app.Localize.get('Turn off');
							default: return value;
						}
					},
					editor: new Ext.form.ComboBox({
						mode: 'local',
						editable: false,
						triggerAction: 'all',
						valueField: 'id',
						displayField: 'name',
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name'],
							data: [
								[0, Ext.app.Localize.get('Turn on')],
								[3, Ext.app.Localize.get('Administrative')],
								[10, Ext.app.Localize.get('Turn off')]
							]
						}
					})
				}, {
					header: Ext.app.Localize.get('Manager'),
					id: 'vgblk-col-exp',
					dataIndex: 'mgrname'
				}, grid.plugins[0]]);
			}
		},
		tbar: [{
			xtype: 'button',
			itemId: 'addrecbtn',
			text: Ext.app.Localize.get('Add'),
			iconCls: 'ext-add',
			handler: function(Btn, params){
				var grid = Btn.findParentByType('editorgrid');
				grid.stopEditing();
				grid.store.insert(0, new grid.store.recordType({
					changedate: new Date().clearTime(),
					changetime: '00:00',
					mgrname: '',
					blkreq: Ext.isDefined(params['blkreq']) ? params['blkreq'] : 3
				}));
			}
		}],
		plugins: [new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Remove'),
			width: 22,
			iconCls: 'ext-drop'
		})],
		columns: [],
		store: {
			xtype: 'jsonstore',
			timeout: 380000,
			url: 'config.php',
			method: 'POST',
			root: 'results',
			fields: [
				{ name: 'changedate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
				{ name: 'changetime', type: 'string' },
				{ name: 'mgrname', type: 'string' },
				{ name: 'blkreq', type: 'int' }
			],
			baseParams: {
				async_call: 1,
				devision: 7
			},
			sortInfo: {
				field: 'changedate',
				direction: 'ASC'
			}
		}
	});
} // end showVgBlocks()


/**
 * Show control grid to view and drop ip transport
 * @param	string, render grid to
 */
function showIPTransport(renderToA, renderToB, renderToC){
    if (!document.getElementById(renderToA) || !document.getElementById(renderToB) || !document.getElementById(renderToC)) {
		return;
	}
    try {
        var module = document.getElementById('_module_').value
        var oldagent = document.getElementById('oldagent').value
    }
    catch (e) {
        return false;
    }
    try {
        var vgid = document.getElementById('_vgid_').value
    }
    catch (e) {
        var vgid = 0
    }

    var currSegment = {
        ip: null,
        mask: 0
    }
    recalc = function(){
        if (Ext.isEmpty(currSegment.ip) || Ext.isEmpty(Ext.getCmp('_devideMask').getValue())) {
            return false;
        }
        params = {};
        Store.ips.each(function(record, rowIndex){
            params['used[' + rowIndex + '][ip]'] = record.data.segment;
            params['used[' + rowIndex + '][mask]'] = record.data.mask;
        });
        params['broadcast'] = Ext.getCmp('_ExlBrd').getValue();
        params['segment[ip]'] = currSegment.ip;
        params['segment[mask]'] = currSegment.mask;
        params['mask'] = Ext.getCmp('_devideMask').getValue();
        store.reload({
            params: params
        })
    }
    clearRec = function(){
        var grid = Ext.getCmp('_signedSegments');
        if (!Ext.isEmpty(grid.getSelectionModel().getSelected())) {
            Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
                grid.store.remove(item)
            })
        }
        try {
            Ext.getCmp('staffCopy').setValue(false)
        }
        catch (e) {
        }
    }
    addRec = function(){
        var grid = Ext.getCmp('_freeSegments');
        var Row = Ext.data.Record.create([{
            name: 'segment',
            type: 'string'
        }, {
            name: 'mask',
            type: 'int'
        }]);
        if (!Ext.isEmpty(grid.getSelectionModel().getSelected())) {
            Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
                store.remove(item);
                Store.ips.insert(0, new Row({
                    segment: item.data.ip,
                    mask: item.data.mask
                }))
            })
        }
    }

    Store.ips = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'recordid',
            type: 'int'
        }, {
            name: 'segment',
            type: 'string'
        }, {
            name: 'mask',
            type: 'int'
        }, {
			name: 'type',
			type: 'int'
		}]),
        baseParams: {
            async_call: 1,
            devision: 7,
            getips: vgid
        },
        autoLoad: (vgid > 0) ? true : false
	 });

	// ---------------- IfIndex ----------------------------
    if (!Ext.getCmp('_ifIndex_panel')) {
        var value_ifindex = new Ext.form.TextField({
            width: 30,
            id: "ifindex",
            name: "ifindex",
            scope: this,
            listeners: {
                afterrender: function(){
                    Ext.Ajax.request({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            devision: 7,
                            async_call: 1,
                            get_ifindex: vgid
                        },
                        callback: function(opt, success, res) {
                            if (Ext.isDefined(res['responseText'])) {
                                var data = Ext.util.JSON.decode(res.responseText);
                                Ext.getCmp('ifindex').setValue(data.data.ifindex);
                            }
                        }
                    });
                }
            }
        });

        new Ext.Panel({
            width: 613,
            frame: false,
            id: '_ifIndex_panel',
            layout:	{
                type: 'hbox'
            },
            title: Ext.app.Localize.get('SNMP Index Settings'),
            renderTo: renderToC,
            tbar: [
                {
                    xtype: 'label',
                    text: Ext.app.Localize.get("Index number")
                },
                '&nbsp;',
                value_ifindex
            ]
        });
    }
	// ------------------------------------------------

	var checkPort = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('Port'),
		tooltip: Ext.app.Localize.get('PortOnDevice'),
		qtip: Ext.app.Localize.get('PortOnDevice'),
		dataIndex: 'type',
		width: 45,
		handler: function(C, A, B) {
			var P = Ext.get('_device_port_');
			if(P.dom.innerHTML.length == 0 && value_ifindex.getValue() == 0) {
				if(A == false && B == true) {
					Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('PortOnDeviceAlert') +
						 '&nbsp;' + Ext.app.Localize.get("or") + '&nbsp;' +
						Ext.app.Localize.get("IfIndex required"));
					return false;
				}
			}
		}
	});

    new Ext.grid.GridPanel({
        title: Localize.Assigned,
        renderTo: renderToA,
        id: '_signedSegments',
        store: Store.ips,
        cm: new Ext.grid.ColumnModel({
			columns: [{
				header: 'IP',
				dataIndex: 'segment',
				id: 'ipsigned',
				sortable: true,
				renderer: function(value, meta){
					meta.css += ' x-selectable ';
					return value;
				}
			}, {
				header: Localize.Mask,
				dataIndex: 'mask',
				width: 50
			}, checkPort],
			defaults: {
				menuDisabled: true
			}
		}),
		plugins: [checkPort],
        width: 210,
        height: 190,
        loadMask: true,
        frame: false,
        autoExpandColumn: 'ipsigned',
        tbar: [{
            xtype: 'button',
            text: Localize.Remove,
            iconCls: 'ext-remove',
            handler: clearRec
        }]
    });

    var segStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'segment',
            type: 'string'
        }, {
            name: 'mask',
            type: 'int'
        }]),
        baseParams: {
            async_call: 1,
            devision: 7,
            getsegments: Ext.get('moduleid').getValue(),
            vgid: Ext.get('vgid').getValue()
        },
        sortInfo: {
            field: 'segment',
            direction: "ASC"
        },
        autoLoad: true,
        listeners: {
            load: function(){
                var device_segments = new Ext.data.Store({
                    url: "config.php",
                    baseParams: {
                        async_call: 1,
                        devision: 207,
                        get_device_segments: 1,
                        vg_id: vgid
                    },
                    reader: new Ext.data.JsonReader({
                        root: 'results'
                    }, [{
                        name: 'segment',
                        type: 'string'
                    }, {
                        name: 'mask',
                        type: 'int'
                    }]),
                    autoLoad: true,
                    listeners: {
                        load: function(){
                            var records = [];
                            device_segments.each(function(r){
                                records.push(r)
                            });
                            segStore.insert(0, records);
                            var c = Ext.ComponentMgr.get("_segmentsCombo");
                            if (!Ext.isEmpty(c) && segStore.getCount()) {
                                var r = segStore.getAt(0);
                                c.setValue(r.get("segment"));
                                currSegment.ip = r.get("segment");
                                currSegment.mask = r.get("mask");
                            }
                        }
                    }
                })
            }
        }
    });
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [{
            name: 'ip',
            type: 'string'
        }, {
            name: 'mask',
            type: 'int'
        }, {
            name: 'segmentid',
            type: 'int'
        }]),
        baseParams: {
            async_call: 1,
            devision: 7,
            getipfree: module
        }
    });
} // end showIPTransport()


/**
 * Show AS transport control
 * @param	string, render grid to
 */
function showASTransport( renderTo )
{
	if (!document.getElementById(renderTo)) {
		return;
	}

	try {
		var vgid = document.getElementById('_vgid_').value
	}
	catch(e) {
		var vgid = 0
	}

	var Remove = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Remove'),
		dataIndex: 'recordid',
		width: 22,
		iconCls: 'ext-drop'
	});

    Store.aslist = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
			{ name: 'recordid', type: 'int' },
			{ name: 'as', type: 'int' }
		]),
		baseParams: {
			async_call: 1,
			devision: 7,
			getaslist: vgid
		},
		sortInfo: {
			field: 'as',
			direction: "ASC"
		}
	});

	if (vgid > 0) {
		Store.aslist.load();
	}

	new Ext.grid.GridPanel({
		renderTo: renderTo,
		id: '_asGrid',
		store: Store.aslist,
		cm: new Ext.grid.ColumnModel([{
			header: Ext.app.Localize.get('Local AS'),
			dataIndex: 'as',
			id: 'ascolumn'
		}, Remove]),
		width: 614,
		height: 180,
		loadMask: true,
		frame: false,
		autoExpandColumn: 'ascolumn',
		plugins: Remove,
		tbar: [Ext.app.Localize.get('Number') + ':', '&nbsp;',{
			xtype: 'numberfield',
			minValue: 1,
			maxValue: 65535,
			id: '_asField',
			width: 68
		}, '&nbsp;', {
			xtype: 'button',
			iconCls: 'ext-add',
			text: Ext.app.Localize.get('Add'),
			handler: function() {
				var field = this.ownerCt.findById('_asField');
				if(!field.isValid() || Ext.isEmpty(field.getValue())) {
					return false;
				}

				if(Store.aslist.find('as', field.getValue()) > -1) {
					return false;
				}

				Store.aslist.insert(0, new Store.aslist.recordType({
					recordid: 0,
					as: field.getValue()
				}))
			}
		}]
	});

    Remove.on('action', function(grid, record, rowIndex, e){
        Store.aslist.remove(record);
    });
} // end showASTransport()


/**
 * Show MAC transport
 * @param	string, render grid to
 */
function showMACTransport( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var vgid = document.getElementById('_vgid_').value } catch(e) { var vgid = 0 }

	addMac = function() { if(Ext.isEmpty(Ext.getCmp('_macField').getValue())) { return } var row = new Rows({ recordid: 0, mac: Ext.getCmp('_macField').getValue(), segment: this.ownerCt.findByType('combo')[0].getValue() }); Store.mac.insert(0, row); }
	rmIconStatus = function(record, row, col, object) { return 'ext-drop'; }
	var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'recordid', width: 22, iconCls: rmIconStatus });
	var Rows = Ext.data.Record.create([{ name: 'recordid', type: 'int' }, { name: 'mac', type: 'string' }, { name: 'segment', type: 'string' }]);
	Store.mac = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results' }, Rows), baseParams:{ async_call: 1, devision: 7, getmacs: vgid }, sortInfo: { field: 'mac', direction: "ASC" } });
	if(vgid > 0) { Store.mac.load(); }
	new Ext.grid.GridPanel({ renderTo: renderTo, id: '_macGrid', store: Store.mac, cm: new Ext.grid.ColumnModel([{ header: 'MAC', dataIndex: 'mac', id: 'macsigned', sortable: true, renderer: function(value, meta){ meta.css += ' x-selectable '; return value; } }, { header: 'IP ' + Localize.address, dataIndex: 'segment', width: 250, renderer: function(value, meta){ meta.css += ' x-selectable '; return value; } }, Remove]), width: 614, height: 180, loadMask: true, frame: false, autoExpandColumn: 'macsigned', plugins: Remove, tbar:[{ xtype: 'textfield', id: '_macField', width: 150 }, '&nbsp;', Localize.LinkeTo + ' IP: ', '&nbsp;', { xtype: 'checkbox', id: 'staffCopy', handler: function(A, B){ if(B){ this.ownerCt.findByType('combo')[0].enable(); } else { this.ownerCt.findByType('combo')[0].disable(); this.ownerCt.findByType('combo')[0].setValue('') } } }, '&nbsp;', { xtype: 'combo', disabled: true, typeAhead: true, mode: 'local', triggerAction: 'all', editable: false, store: Store.ips, displayField: 'segment', valueField: 'segment', tpl: '<tpl for="."><div class="x-combo-list-item">{segment}/{mask}</div></tpl>' }, '&nbsp;', { xtype: 'button', iconCls: 'ext-add', text: Localize.Add, handler: addMac }]});
	Remove.on('action', function(grid, record, rowIndex, e) { Store.mac.remove(record); });
} // end showMACTransport()


/**
 * Show phone transport grid control
 * @param	string, render grid to
 */
function showPhoneTransport( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var vgid = document.getElementById('_vgid_').value } catch(e) { var vgid = 0 }

	winAdd = function(R){
		if (!Ext.isEmpty(Ext.getCmp('_newNumber'))) {
		    return
		};
		var Win = new Ext.Window({
			id: '_newNumber',
			title: Localize.Newnumber,
			width: 315,
			buttonAlign: 'center',
			items: [{
			    xtype: 'form',
			    fieldLabel: 125,
			    frame: true,
			    items: [{
					xtype: 'textfield',
					id: '_phoneField',
					width: 150,
					fieldLabel: Localize.Indication,
					value: !(R.data) ? '' : R.data.phonenumber
			    }, {
					xtype: 'combo',
					id: '_deviceField',
					width: 100,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: !(R.data) ? null : R.data.device,
					editable: false,
					store: new Ext.data.SimpleStore({
					    data: [['0', Localize.Phone], ['1', 'MTA'], ['2', Localize.Trunk], ['3', Localize.Route]],
					    fields: ['id', 'name']
					}),
					fieldLabel: Localize.Device,
					listeners: {
					      expand: function(){
						    if(Ext.get('_usercategory_').getValue() != 1) {
								this.store.filter('id', new RegExp('0|1|2'));
						    }
						    else {
							  this.store.clearFilter();
						    }
					      }
					}
			    }, {
					xtype: 'checkbox',
					value: 1,
					id: '_intttl',
					fieldLabel: Localize.Access + ' ' + Localize.INTTL,
					checked: !(R.data) ? false : R.data.ldservice
			    }, {
					xtype: 'textfield',
					id: '_comment',
					width: 180,
					fieldLabel: Localize.Descr,
					value: !(R.data) ? '' : R.data.comment
			    }]
			}],
			buttons: [{
				xtype: 'button',
				text: Localize.Add,
				handler: function(){
					if(Ext.isEmpty(Ext.getCmp('_phoneField').getValue())) {
						return
					};
					try {
						R.set('device', Ext.getCmp('_deviceField').getValue());
						R.set('phonenumber', Ext.getCmp('_phoneField').getValue());
						R.set('ldservice', Ext.getCmp('_intttl').getValue());
						R.set('comment', Ext.getCmp('_comment').getValue());
						R.commit();
					}
					catch(e) {
						var row = new Rows({
							device: Ext.getCmp('_deviceField').getValue(),
							phonenumber: Ext.getCmp('_phoneField').getValue(),
							ldservice: Ext.getCmp('_intttl').getValue(),
							comment: Ext.getCmp('_comment').getValue()
						});
						Store.phone.insert(0, row);
					}
					Win.close();
				}
			}, {
			    xtype: 'button',
			    text: Localize.Cancel,
			    handler: function(){
				Win.close();
			    }
			}]
		});
		Win.show();
	};

	devices = function(value, meta, record) { switch(parseInt(value)) { case 0: return Localize.Phone; case 1: return 'MTA'; case 2: return Localize.Trunk; case 3: return Localize.Route; } };
	accessTl = function(value) { if(value == true) { return Localize.INTTL; } else { return '-'; }}
	rmIconStatus = function(record, row, col, object) { return 'ext-drop'; }
	var Remove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Remove, dataIndex: 'recordid', width: 22, iconCls: rmIconStatus });
	var Edit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Localize.Edit, width: 22, dataIndex: 'recordid', iconCls: 'ext-edit' })
	var Rows = Ext.data.Record.create([{ name: 'recordid', type: 'int' }, { name: 'device', type: 'int' }, { name: 'phonenumber', type: 'string' }, { name: 'ldservice', type: 'int' }, { name: 'comment', type: 'string' }]);
	Store.phone = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results' }, Rows), baseParams:{ async_call: 1, devision: 7, getphones: vgid }, sortInfo: { field: 'phonenumber', direction: "ASC" } });
	if(vgid > 0) { Store.phone.load(); }

	new Ext.grid.GridPanel({
	    renderTo: renderTo,
	    id: '_phoneGrid',
	    store: Store.phone,
	    cm: new Ext.grid.ColumnModel([Edit, {
			header: Localize.Indication,
			dataIndex: 'phonenumber',
			width: 180,
			sortable: true,
			renderer: function(value, meta){
				meta.css += ' x-selectable ';
				return value;
            }
	    }, {
			header: Localize.Device,
			dataIndex: 'device',
			width: 120,
			renderer: devices
	    }, {
			header: Localize.Access,
			dataIndex: 'ldservice',
			renderer: accessTl
	    }, {
			header: Localize.Descr,
			dataIndex: 'comment',
			id: 'phoneCommen'
	    }, Remove]),
	    width: 614,
	    height: 180,
	    loadMask: true,
	    frame: false,
	    autoExpandColumn: 'phoneCommen',
	    plugins: [Edit, Remove],
	    tbar: [{
			xtype: 'button',
			iconCls: 'ext-add',
			text: Localize.Add,
			handler: winAdd
	    }, '-', Localize.CheckDuplicates + ': ', {
			xtype: 'checkbox',
			checked: true,
			id: 'checkduplicates'
		}]
	});

	Edit.on('action', function(grid, record, rowIndex, e) { winAdd(record) });
	Remove.on('action', function(grid, record, rowIndex, e) { Store.phone.remove(record); });
} // end showPhoneTransport()


/**
 * Show all available services for the account and provide their management
 * @param	string, render to element with specified id
 */
function showDialinServices(renderTo)
{
	if(!Ext.get(renderTo)) {
		return false;
	}

	try { var vgid = document.getElementById('_vgid_').value } catch(e) { var vgid = 0 }
	try { var tarid = document.getElementById('_tarid_').value } catch(e) { var tarid = 0 }

	var Asigned = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('On state'),
		dataIndex: 'asigned',
		width: 65
	});

	Store.rservices = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'catidx', type: 'int' },
			{ name: 'catdescr', type: 'string' },
			{ name: 'uuid', type: 'string' },
			{ name: 'asigned', type: 'int' }
		]),
		autoLoad: true,
		checkRecord: function(record) {
			if(!record.data.asigned) {
				return false;
			}
			return true;
		},
		baseParams: {
			async_call: 1,
			devision: 7,
			getvgservices: vgid,
			tarid: tarid
		}
	});

	new Ext.grid.EditorGridPanel({
		renderTo: renderTo,
		autoExpandColumn: 'catdescrcol',
		height: 300,
		loadMask: true,
		plugins: [Asigned],
		cm: new Ext.grid.ColumnModel({
			columns: [{
				header: 'ID',
				dataIndex: 'catidx',
				width: 50
			}, {
				header: Ext.app.Localize.get('Number of service'),
				dataIndex: 'uuid',
				width: 110
			}, {
				header: Ext.app.Localize.get('Name'),
				dataIndex: 'catdescr',
				id: 'catdescrcol'
			}, Asigned],
			defaults: {
				menuDisabled: true,
				sortable: true
			}
		}),
		store: Store.rservices
	});
} // end showDialinServices(0


/**
 * Engine to manipulate vgroups fields. Add new properties to user account
 *
 */
function vgroupFormFields(){
    if (!Ext.isEmpty(Ext.getCmp('vgroupFormFields'))) {
        return;
    }

    createField = function(A){
        if (!Ext.isEmpty(Ext.getCmp('editVgFormField'))) {
            Ext.getCmp('editVgFormField').close();
        }

        A = A || { data: { type: 0, name: '', descr: '' } };

        var Rm = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Ext.app.Localize.get('Delete field'),
            dataIndex: 'idx',
            width: 22,
            iconCls: 'ext-drop'
        });

        title = function(A){
            try {
                return Ext.app.Localize.get('Edit field') + ': ' + A.get('name')
            }
            catch (e) {
                return Ext.app.Localize.get('Add field')
            }
        }

        new Ext.Window({
            id: 'editVgFormField',
            title: title(A),
			modal: true,
            width: 370,
            shawdow: false,
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
				disabled: true,
                handler: function(B){
                    var W = B.findParentByType('window');
                    var F = W.findByType('form')[0];
                    if (W.findById('fieldValues').isVisible()) {
                        W.findById('fieldValues').store.each(function(R){
                            if (R.get('idx') == 0) {
                                this.add({
                                    xtype: 'hidden',
                                    name: 'newstaff[]',
                                    value: R.get('value')
                                });
                            }
                            else {
                                this.add({
                                    xtype: 'hidden',
                                    name: 'staff[' + R.get('idx') + ']',
                                    value: R.get('value')
                                });
                            }
                        }, F);
                        F.doLayout();
                    }
                    F.getForm().submit({
                        method: 'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action){
                            Ext.getCmp('vgroupFormFields').findByType('grid')[0].store.reload();
                            W.close();
                        },
                        failure: function(form, action){
                            if (action.failureType == 'server') {
                                obj = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', obj.errors.reason);
                            }
                        }
                    })
                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Cancel'),
                handler: function(){
                    this.ownerCt.ownerCt.close();
                }
            }],
            items: [{
                xtype: 'form',
                id: 'vgFormFieldEdit',
                url: 'config.php',
                method: 'POST',
                frame: true,
				monitorValid: true,
				listeners: {
					clientvalidation: function(F, S) {
						if(S){
							F.ownerCt.buttons[0].enable()
						}
						else {
							F.ownerCt.buttons[0].disable()
						}
					}
				},
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 7
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Description'),
                    name: 'descr',
                    width: 150,
					allowBlank: false,
                    value: (A.data.descr) ? A.data.descr : ''
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Field'),
                    name: 'setvfrmfds',
                    width: 150,
                    readOnly: (A.data.name.length == 0) ? false : true,
                    value: (A.data.name) ? A.data.name : '',
					allowBlank: false,
                    maskRe: new RegExp('[a-zA-Z0-9\-\_]')
                }, {
					xtype: 'combo',
					fieldLabel: Ext.app.Localize.get('Module'),
					width: 167,
					displayField: 'descr',
					hiddenName: 'agentid',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: (A.data.agentid) ? A.data.agentid : '',
					editable: false,
					allowBlank: false,
					tpl: '<tpl for="."><div ext:qtip="{descr}" class="x-combo-list-item">{descr}</div></tpl>',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [{
							name: 'type',
							type: 'int'
						}, {
							name: 'descr',
							type: 'string'
						}, {
							name: 'id',
							type: 'int'
						}]),
		                autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 1,
							getmodules: 0
						},
						listeners: {
							load: function(){
								if(!Ext.isEmpty(this.ownerCt.value) && this.ownerCt.value != '') {
									this.ownerCt.setValue(this.ownerCt.value)
								}
							}
						}
					}),
					listeners: {
						render: function(){
							this.store.ownerCt = this;
						}
					}
				}, {
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Type'),
                    id: 'fieldType',
                    width: 100,
                    hiddenName: 'type',
                    displayField: 'name',
                    valueField: 'type',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: (A.data.type) ? A.data.type : 0,
                    editable: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['type', 'name'],
                        data: [[0, Ext.app.Localize.get('Text')], [1, Ext.app.Localize.get('List')],[2, Ext.app.Localize.get('Logical')]] 
                    }),
                    listeners: {
                        beforeselect: function(){
                            try {
                                A.get('name');
                                return false;
                            }
                            catch (e) {
                                return true
                            }
                        },
                        select: function(C, R){
                            var W = C.findParentByType('window');                   
                            if (R.data.type ==1) {
                                W.findById('fieldValues').show();
                            }
                            else {
                                W.findById('fieldValues').hide();
                            }
                            W.setActive(true);
                        }
                    }
                }]
            }, {
                xtype: 'editorgrid',
                id: 'fieldValues',
                hidden: true,
                height: 190,
                autoExpandColumn: 'comboValue',
                loadMask: true,
                clicksToEdit: 1,
                plugins: Rm,
                tbar: [{
                    xtype: 'button',
                    iconCls: 'ext-add',
                    text: Ext.app.Localize.get('Add value'),
                    handler: function(){
                        this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
                            idx: 0,
                            value: ''
                        }))
                    }
                }],
                cm: new Ext.grid.ColumnModel([{
                    header: Ext.app.Localize.get('Value'),
                    dataIndex: 'value',
                    id: 'comboValue',
                    editor: new Ext.form.TextField({
                        allowBlank: false
                    })
                }, Rm]),
                store: new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'config.php',
                        method: 'POST'
                    }),
                    reader: new Ext.data.JsonReader({
                        root: 'results'
                    }, [{
                        name: 'idx',
                        type: 'int'
                    }, {
                        name: 'value',
                        type: 'string'
                    }]),
                    baseParams: {
                        async_call: 1,
                        devision: 7,
                        getvfrmfds: '',
                        values: 1
                    }
                }),
                listeners: {
                    render: function(G){
                        if (A.data.type == 1) {
                            G.show();
                            G.store.baseParams.getvfrmfds = A.data.name;
                            G.store.load();
                        }
                    }
                }
            }]
        }).show();

        Rm.on('action', function(g, r, idx){
            g.store.remove(r)
        });
    }

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit'),
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-edit'
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-drop'
    });

    new Ext.Window({
        id: 'vgroupFormFields',
        title: Ext.app.Localize.get('Group fields'),
        height: 450,
        width: 760,
        layout: 'fit',
        shawdow: false,
        items: {
            xtype: 'grid',
            height: 435,
            loadMask: true,
            autoExpandColumn: 'ppvalues',
            plugins: [Edit, Remove],
            tbar: [{
                xtype: 'button',
                iconCls: 'ext-add',
                text: Ext.app.Localize.get('Add field'),
                handler: function(){
                    createField()
                }
            }],
            cm: new Ext.grid.ColumnModel([Edit, {
				header: Ext.app.Localize.get('Module'),
				dataIndex: 'agent',
				width: 145
			}, {
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'descr',
                width: 160
            }, {
                header: Ext.app.Localize.get('Field'),
                dataIndex: 'name',
                width: 90
            }, {
                header: Ext.app.Localize.get('Type'),
                dataIndex: 'type',
                width: 80,
                renderer: function(v){
                    if (v == 1) {
                        return Ext.app.Localize.get('List')
                    }
                    else if (v == 2){
                        return Ext.app.Localize.get('Logical')
                    }
                    else {
                    	return Ext.app.Localize.get('Text')
                    }
                }
            }, {
                header: Ext.app.Localize.get('Defined values'),
                id: 'ppvalues',
                dataIndex: 'strvalue'
            }, Remove]),
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: 'config.php',
                    method: 'POST'
                }),
                reader: new Ext.data.JsonReader({
                    root: 'results'
                }, [{
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'type',
                    type: 'int'
                }, {
					name: 'agentid',
					type: 'int'
				}, {
					name: 'agent',
					type: 'string'
				}, {
                    name: 'descr',
                    type: 'string'
                }, {
                    name: 'strvalue',
                    type: 'string'
                }]),
				autoLoad: true,
                baseParams: {
                    async_call: 1,
                    devision: 7,
                    getvfrmfds: 0
                }
            })
        }
    }).show();

    Edit.on('action', function(g, r, idx){
        createField(r)
    });

    Remove.on('action', function(g, r, idx){
        var fm = new Ext.form.FormPanel({
            frame: false,
            url: 'config.php',
            items: [{
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 7
            }, {
                xtype: 'hidden',
                name: 'delvfrmfds',
                value: r.get('name')
            }],
            renderTo: document.body
        });
        fm.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                g.store.reload();
                fm.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', obj.errors.reason);
                }
                fm.destroy();
            }
        });
    });
} // end vgroupsFormFields


/**
 * Show menu to change state for vgroup item
 * @param	integer, current state
 */
function menuVgState(el, state)
{
	if(!Ext.isDefined(el) || !Ext.isDefined(state)) {
		return false;
	}

	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}

	var vgid = null;
	if(!(vgid = Ext.get('_vgid_')) || vgid.getValue() == 0) {
		return false;
	}

	var action = function(state) {
        var fm = new Ext.form.FormPanel({
            frame: false,
            url: 'config.php',
            items: [{
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 7
            }, {
				xtype: 'hidden',
				name: 'lockcommand[' + this.vgid + '][action]',
				value: this.action
			}, {
				xtype: 'hidden',
				name: 'lockcommand[' + this.vgid + '][state]',
				value: state
			}],
            renderTo: document.body
        });
        fm.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
				Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                fm.destroy();
            },
            failure: function(form, action){
				var O = Ext.util.JSON.decode(action.response.responseText);
				Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
                fm.destroy();
            }
        });
	}

	new Ext.menu.Menu({
		autoDestroy: true,
		items: [{
			text: Ext.app.Localize.get('Turn on'),
			hidden: (state == 10) ? false : true,
			handler: action.createDelegate({ vgid: vgid.getValue(), action: 'unlock' }, [state])
		}, {
			text: Ext.app.Localize.get('Block up'),
			hidden: (state == 0) ? false : true,
			handler: action.createDelegate({ vgid: vgid.getValue(), action: 'lock' }, [state])
		}, {
			text: Ext.app.Localize.get('Release'),
			hidden: (state > 0 && state != 10) ? false : true,
			handler: action.createDelegate({ vgid: vgid.getValue(), action: 'unlock' }, [state])
		}, {
			text: Ext.app.Localize.get('Turn off'),
			hidden: (state != 10) ? false : true,
			handler: action.createDelegate({ vgid: vgid.getValue(), action: 'off' }, [state])
		}]
	}).showAt([el.box.x, el.box.y + el.box.height]);
} // end menuVgState()


/**
 * Call main vgroups widget to select main item
 *
 */
function getParentVgroup()
{
	var uid = null;
	if(!(uid = Ext.get('_uid_')) || (uid.getValue() * 1) < 1) {
		Ext.Msg.error(Ext.app.Localize.get('Can not define user'));
		return false;
	}

	showAccounts({
		sm: true,
		hideToolbar: true,
		filter: {
			vguserid: uid.getValue()
		},
		callbackok: function(grid) {
			var sm = grid.getSelectionModel().getSelected();
			Ext.each(this.query('input#_parentvgid_,input#_parentvglogin_,a#_parentvglink'), function(item){
				var el = Ext.get(item);
				switch(el.dom.id) {
					case '_parentvgid_': el.dom.value = this.get('vgid'); break;
					case '_parentvglogin_': el.dom.value = this.get('login'); break;
					case '_parentvglink': el.dom.innerHTML = this.get('login'); break;
				}
			}, sm);
		}.createDelegate(Ext.get('_Vgroups'))
	});
} // end getParentVgroup()


/**
 * Clear specific fields
 */
function clearFields(params)
{
	Ext.each(Ext.query(params), function(item){
		var el = Ext.get(item);
		switch (true) {
			case (el.dom.tagName.toLowerCase().indexOf("input") != -1):
				el.dom.value = '';
			break;

			case (el.dom.tagName.toLowerCase().indexOf("a") != -1):
				el.dom.innerHTML = Ext.app.Localize.get('Undefined');
			break;
		}
	});
} // end clearFields()


function tar_detail(form)
{
	if(!Ext.isDefined(form)) {
		return false;
	}
	try{
		if(Ext.get('_tarid_').getValue() > 0)
		{
			createHidOrUpdate(form.id, 'tarif', Ext.get('_tarid_').getValue());
			submitForm(form.id, 'devision', 4);
		} else {
			alert('User undefined');
			return false;
		}
	} catch(e){
		return false;
	}
}


/**
 * Vgroup panel, common settings and customizations
 * @param   string, element id render to
 */
function showVgroupPanel( id )
{
    var id = id || null;
    if(!Ext.get(id)) {
        return false;
    }
    
    /**
     * Buttons configuration block
     */
    // Remove tariff button
    var tarRemove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: function(record) {
        	return record.get('ishistory') ? 'ext-drop-dis' : 'ext-drop'; 
        }
    });
    
    // Edit tariff button (for multi-tariff only!)
    var multiTarEdit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit multitariff'),
        width: 26,
        iconCls: function(record) {
        	return record.get('ismulti') ? 'ext-edit' : 'ext-edit-dis'; 
        }
    });
    
    var rowCheck = new Ext.grid.CheckColumn({
        header: Ext.app.Localize.get('Port'),
		tooltip: Ext.app.Localize.get('Port'),
		qtip: Ext.app.Localize.get('Port'),
		id: 'deviceport',
		name: 'deviceport',
		dataIndex: 'type',
		width: 45,
		checked: true,
		handler: function(Chbx, Chkd, Unchkd, Index) {
			if(!Chkd) {	var type = 1;	} 
				else {	var type = 0;	}
			var vStore = Ext.getCmp('ipassigned').store;
			params = {};				
			params['recordid'] = vStore.getAt(Index).get('recordid');
			params['segment'] = vStore.getAt(Index).get('ipmask.ip');	
			params['mask'] = vStore.getAt(Index).get('ipmask.mask');
			params['type'] = type;
			params['getstaff'] = '';
			vStore.setBaseParam('setstaffport', Ext.get('vgid').getValue());	
			vStore.reload({
				params: params
			});	
		}
    }); 

    
	var macDel = new Ext.grid.RowButton({
        header: '',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: function(record) {
        	return 'ext-drop'; 
        }       
    });
    
    macDel.on('action', function(grid, record) {
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 7,
                    getmacstaff: Ext.get('vgid').getValue(),
                    record: record.get('macid')
                },
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res){
                    try {
                        var data = Ext.decode(res.responseText);
                        if(!data.success) {
                            throw(data.error);
                        }
                        Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
							grid.store.remove(item);
						});
						//grid.getStore().reload();                    
						}
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            })
        }, {
            grid: grid,
            record: record
        });
    });
    
    
    
    var asDel = new Ext.grid.RowButton({
        header: '',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: function(record) {
        	return 'ext-drop'; 
        }       
    });
    
    asDel.on('action', function(grid, rec, ind) {
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
            if(Btn != 'yes') {
                return;
            };
            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 7,
                    getstaffas: Ext.get('vgid').getValue(),
                    record: rec.get('recordid')
                },
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res){
                    try {
                        var data = Ext.decode(res.responseText);
							if(!data.success) {
								throw(data.error);
							}  
							Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
								grid.store.remove(item);
							});
							//grid.store.reload();
						}
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            })
        }, {
            grid: grid,
            record: rec
        });
    });
    
    
    
    // Remove tariff button action listener
    tarRemove.on('action', function(grid, record) {
        if(record.get('ishistory')) {
        	return false;
        }
        
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to delete selected item')+'?', function(Btn){
            if(Btn != 'yes') {
                return;
            };
            
            var deleteTariff = function(grid, record){
            	Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    timeout: 380000,
                    params: {
                        async_call: 1,
                        devision: 7,
                        deltarrasp: 1,
                        recordid: record.get('recordid'),
                        ismulti: record.get('ismulti')
                    },
                    scope: {
                        grid: grid
                    },
                    callback: function(opt, success, res){
                        try {
                            var data = Ext.decode(res.responseText);

                            if(!data.success) {
                                throw(data.error);
                            }

                            this.grid.getStore().reload();
                        }
                        catch(e) {
                            Ext.Msg.error(e);
                        }
                    }
                })
            };
			
			if(record.get('groupid')>0) {
				Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Tariff was assigned from unions. If you delete tariff from account tariff will removed to all accounts of this union. Are you sure to delete tariff'), function(Btn){
		            if(Btn != 'yes') {
		                return;
		            };
		            deleteTariff(this.grid, this.record);
				}, {
		            grid: grid,
		            record: record
		        });
			}
			else{
				deleteTariff(grid, record);
			}
            
        }, {
            grid: grid,
            record: record
        });
    });
    // Edit multi-tariff button action listener
    multiTarEdit.on('action', function(grid, record) {
        if(record.get('ismulti')!=1) {
        	return false;
        }
       
        var form = grid.findParentByType('tabpanel').get(0),
	    	mtype = form.getForm().findField('agenttype').getValue(),
	    	moduleid = form.getForm().findField('moduleid').getValue(),
	    	agrmid = form.getForm().findField('agrmid').getValue();
    	
        var config = {
			telphony: mtype > 6 && mtype < 13 ? true : false,
			discounts: mtype < 13 ? true : false,
			disCoef: mtype == 13 ? true : false,
			callback: function() {
				this.grid.getStore().reload({
					params: {
						start: 0
					}
				});
			}.createDelegate({
				grid: grid
			}),
			filter: {
				moduleid: moduleid,
				agrmid: agrmid
			},
			recordid: record.get('recordid'),
			vgid: record.get('vgid'),
			tarid: record.get('taridnew'),
			tarname: record.get('tarnewname'),
			timefrom: record.get('changetime'),
			timeto: record.get('timeto')
		}; 

        new Ext.Window({
	        title: Ext.app.Localize.get('Edit multitariff'),
	        height: 160,
	        width: 400,
	        layout: 'fit',
	        modal: true,
	        buttonAlign: 'center',
	        buttons: [{
	            xtype: 'button',
	            text: Ext.app.Localize.get('Save'),
	            itemId: 'apply',
	            handler: function(Btn) {
	            	var win = Btn.findParentByType('window'),
	            	    form = win.get(0).getForm(), 
	                    values = form.getValues(),
	                    tar = form.findField('tarid');
	                
	                if(!form.isValid()) {
	                    return false;
	                }
	                
            		var submitCfg = {
            			url: 'config.php',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        scope: {
                            config: this,
                            submitCfg: null,
                            win: Btn.findParentByType('window')
                        },
                        params: {
                            async_call: 1,
                            devision: 7,
                            settarrasp: 1
                        },
                        success: function(form, action) {
                            try {
                                this.config.callback(form);
                                this.win.close();
                            }
                            catch(e) {
                                Ext.Msg.error(Ext.app.Localize.get(e))
                            }
                        },
                        failure: function(form, action) {
                        	try {
                        		if(action.result.override) {
                        			Ext.Msg.confirm(Ext.app.Localize.get('Warning'), action.result.error, function(B){
                                        if (B != 'yes') {
                                            return;
                                        }
                                        
                                        Ext.apply(this.submitCfg.params, {
                                            override: 1
                                        });
                                        
                                        form.submit(this.submitCfg);
                        			}, this);
                        		}
                        		else {
                        			throw(action.result.error);
                        		}
                        	}
                        	catch(e) {
                                Ext.Msg.error(Ext.app.Localize.get(e));
                        	}
                        }
            		};
            		submitCfg.scope.submitCfg = submitCfg;
            		
            		form.submit(submitCfg);
	            }.createDelegate(config)
	        }],
	        items: [{
                	xtype: 'form',
                	frame: true,
                	url: 'config.php',
                	monitorValid: true,
		            defaults: {
		            	anchor: '100%',
		            	xtype: 'container'
		            },
		            items: [{
		                xtype: 'hidden',
		                name: 'recordid',
		                value: config.recordid
		            }, {
		                xtype: 'hidden',
		                name: 'vgid',
		                value: config.vgid
		            }, {
		                xtype: 'hidden',
		                name: 'ismulti',
		                value: 1
		            }, {
		                fieldLabel: Ext.app.Localize.get('Tarif'),
		                itemId: 'tarif-set',
		                layout: 'hbox',
		                items: [{
		                    xtype: 'combo',
		                    disabled:  false,
		                    itemId: 'tar-combo',
		                    hiddenName: 'tarid',
		                    valueField: 'tarid',
		                    value: config.tarid,
		                    displayField: 'descr',
		                    hiddenName: 'tarid',
		                    mode: 'remote',
		                    hideTrigger: true,
		                    triggerAction: 'query',
		                    queryParam: 'tarname',
		                    lastQuery: '',
		                    allowBlank: false,
		                    readOnly: true,
		                    listeners: {
		                    	'afterrender': function(){
		                    		this.store.insert(0, new this.store.recordType({'tarid': config.tarid, 'descr': config.tarname}));
		                    		this.setValue(this.getValue());
		                    	}
		                    },
		                    store: {
		                    	xtype: 'jsonstore',
		                    	root: 'results',
		                    	fields: ['tarid', 'descr']
		                    },
		                    flex: 1
		                }]
		            }, {
		                fieldLabel: Ext.app.Localize.get('Date') + ' (' + Ext.app.Localize.get('Since') + ')',
		                layout: 'hbox',
		                items: [{
		                    xtype: 'datefield',
		                    allowBlank: false,
		                    name: 'tardate',
		                    value: config.timefrom,
		                    width: 100
		                }, {
		                    xtype: 'tbspacer',
		                    width: 5
		                }, {
		                    xtype: 'combo',
		                    width: 35,
		                    name: 'tartimehour',
		                    triggerAction: 'all',
		                    hideTrigger: true,
		                    mode: 'local',
		                    valueField: 'id',
		                    displayField: 'id',
		                    editable: false,
		                    value: config.timefrom.format('H'),
		                    listeners: {
		                    	beforerender: function(combo) {
		                    		var data = [];
		                    		for(var i = 0; i < 24; i++) {
		                        		data.push([i < 10 ? '0' + i : i]);
		                            }
		                            combo.getStore().loadData(data);
		                    	}
		                    },
		                    store: {
		                    	xtype: 'arraystore',
		                    	fields: ['id']
		                    }
		                }, {
		                    xtype: 'tbtext',
		                    text: ':',
		                    style: 'padding: 4 0 0 1',
		                    width: 5
		                }, {
		                    xtype: 'combo',
		                    width: 35,
		                    name: 'tartimemin',
		                    triggerAction: 'all',
		                    hideTrigger: true,
		                    mode: 'local',
		                    valueField: 'id',
		                    displayField: 'id',
		                    editable: false,
		                    value: config.timefrom.format('i'),
		                    listeners: {
		                        beforerender: function(combo) {
		                        	var data = [];
		                            for(var i = 0; i < 60; i++) {
		                                data.push([i < 10 ? '0' + i : i]);
		                            }
		                            combo.getStore().loadData(data);
		                        }
		                    },
		                    store: {
		                        xtype: 'arraystore',
		                        fields: ['id'],
		                        data: []
		                    }
		                }]
		            }, {
		                fieldLabel: Ext.app.Localize.get('Date') + ' (' + Ext.app.Localize.get('Till') + ')',
		                itemId: 'date-till',
		                layout: 'hbox',
		                items: [{
		                    xtype: 'datefield',
		                    name: 'datetill',
		                    width: 100,
		                    value: config.timeto ? config.timeto : null
		                }, {
		                    xtype: 'tbspacer',
		                    width: 5
		                }, {
		                    xtype: 'combo',
		                    width: 35,
		                    name: 'timehourtill',
		                    triggerAction: 'all',
		                    hideTrigger: true,
		                    mode: 'local',
		                    valueField: 'id',
		                    displayField: 'id',
		                    editable: false,
		                    value: config.timeto ? config.timeto.format('H') : null,
		                    listeners: {
		                        beforerender: function(combo) {
		                            var data = [];
		                            for(var i = 0; i < 24; i++) {
		                                data.push([i < 10 ? '0' + i : i]);
		                            }
		                            combo.getStore().loadData(data);
		                        }
		                    },
		                    store: {
		                        xtype: 'arraystore',
		                        fields: ['id']
		                    }
		                }, {
		                    xtype: 'tbtext',
		                    text: ':',
		                    style: 'padding: 4 0 0 1',
		                    width: 5
		                }, {
		                    xtype: 'combo',
		                    width: 35,
		                    name: 'timemintill',
		                    triggerAction: 'all',
		                    hideTrigger: true,
		                    mode: 'local',
		                    valueField: 'id',
		                    displayField: 'id',
		                    editable: false,
		                    value: config.timeto ? config.timeto.format('i') : null,
		                    listeners: {
		                        beforerender: function(combo) {
		                            var data = [];
		                            for(var i = 0; i < 60; i++) {
		                                data.push([i < 10 ? '0' + i : i]);
		                            }
		                            combo.getStore().loadData(data);
		                        }
		                    },
		                    store: {
		                        xtype: 'arraystore',
		                        fields: ['id'],
		                        data: []
		                    }
		                }]
					}]
	        }]
		}).show();
    });
    // Remove vgblock record
    var blkRemove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: function(record) {
            return record.get('ishistory') ? 'ext-drop-dis' : 'ext-drop'; 
        }
    });
    // Remove vgblock record action listener
    blkRemove.on('action', function(grid, record) {
        if(record.get('ishistory')) {
            return false;
        }
        
        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
            if(Btn != 'yes') {
                return;
            };

            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: {
                    async_call: 1,
                    devision: 7,
                    delblkrasp: 1,
                    recordid: this.record.get('recordid')
                },
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res){
                    try {
                        var data = Ext.decode(res.responseText);

                        if(!data.success) {
                            throw(data.error);
                        }

                        this.grid.getStore().reload();
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            })
        }, {
            grid: grid,
            record: record
        });
    });
    // Telephony staff editor button
    var editTelStaff = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit'),
        width: 26,
        iconCls: 'ext-edit'
    });
    // Telephony staff editor button action listener
    editTelStaff.on('action', function(grid, record) {
        setTelItem({
            filter: {
                vgid: record.get('vgid')
            },
            formData: Ext.apply({}, record.data),
            callback: function(from) {
                this.getStore().reload({
                    params: {
                        start: 0
                    }
                });
            }.createDelegate(grid)
        })
    });
    // Remove telephony record
    var delTelStaff = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: 'ext-drop'
    });
    // Remove telephony record action listener
    delTelStaff.on('action', function(grid, record) {
        if(record.get('ishistory')) {
            return false;
        }

        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
            if(Btn != 'yes') {
                return;
            };

            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: Ext.apply({
                    async_call: 1,
                    devision: 7,
                    deltelstaff: 1
                }, this.record.data),
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res){
                    try {
                        var data = Ext.decode(res.responseText);

                        if(!data.success) {
                            throw(data.error);
                        }

                        this.grid.getStore().reload();
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            })
        }, {
            grid: grid,
            record: record
        });
    });

    // Trunk staff editor button
    var editTrunkStaff = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit'),
        width: 26,
        iconCls: 'ext-edit'
    });
    // Trunk staff editor button action listener
    editTrunkStaff.on('action', function(grid, record) {
        setTelItem({
            filter: {
                vgid: record.get('vgid')
            },
            formData: Ext.apply({}, record.data),
            callback: function(from) {
                this.getStore().reload({
                    params: {
                        start: 0
                    }
                });
            }.createDelegate(grid)
        })
    });
    // Remove trunk button
    var delTrunkStaff = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: 'ext-drop'
    });
    // Remove trunk button action listener
    delTrunkStaff.on('action', function(grid, record) {
        if(record.get('ishistory')) {
            return false;
        }

        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove selected records'), function(Btn){
            if(Btn != 'yes') {
                return;
            };

            Ext.Ajax.request({
                url: 'config.php',
                method: 'POST',
                params: Ext.apply({
                    async_call: 1,
                    devision: 7,
                    deltelstaff: 1
                }, this.record.data),
                scope: {
                    grid: this.grid
                },
                callback: function(opt, success, res){
                    try {
                        var data = Ext.decode(res.responseText);

                        if(!data.success) {
                            throw(data.error);
                        }

                        this.grid.getStore().reload();
                    }
                    catch(e) {
                        Ext.Msg.error(e);
                    }
                }
            })
        }, {
            grid: grid,
            record: record
        });
    });
    // Periodic services editor button
    var editPeriodic = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Change') + ' ' + Ext.app.Localize.get('period'),
        width: 22,
        dataIndex: 'vgid',
        iconCls: function(record) {
			var tarid = Ext.getCmp('vg-form').getForm().findField('tarid').getValue();
        	return (record.get('tarid') != tarid) ? 'ext-edit-dis' : 'ext-edit'; 
        }
    });
    // Periodic services editor button (action listener)
    editPeriodic.on('action', function(grid, record, rowIndex, e){
		var tarid = grid.findParentByType('tabpanel').get(0).getForm().findField('tarid').getValue();
		if(record.get('tarid') != tarid) return false;
        showUBAddControl({
            edit: true,
            tarid: record.get('tarid'),
            servdata: record,
            common: 1,
            filterClass: true,
            closeOnSuccess: true,
            success: function(){
                this.getStore().reload({
                    params: {
                    	start: 0
                    }
                });
            }.createDelegate(grid)
        })
    });
    // Remove one-time service button
    var delOneTime = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove') + '. ' + Ext.app.Localize.get('Rollback balance'),
        dataIndex: 'servid',
        width: 22,
        iconCls: 'ext-drop'
    });
    // Remove periodic service button
    var delPeriodic = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove') + '. ' + Ext.app.Localize.get('Rollback balance'),
        dataIndex: 'servid',
        width: 22,
        iconCls: 'ext-drop'
    });
    // Common function to remove/stop service
    var delService = function(grid, record) {
    	Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Money that were written off will be returned to account back') + '<br>' +
                Ext.app.Localize.get('Information about service will be deleted'),
            function(B) {
                if(B != 'yes') {
                    return;
                }
                
                var params = {};
                params['delservice[' + this.record.get('servid') + '][vglogin]'] = this.record.get('vglogin');
                
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: Ext.apply({
                        async_call: 1,
                        devision: 106
                    }, params),
                    scope: {
                        grid: this.grid
                    },
                    callback: function(opt, success, res){
                        try {
                            var data = Ext.decode(res.responseText);
    
                            if(!data.success) {
                                throw(data.error || data.reason);
                            }
    
                            this.grid.getStore().reload();
                        }
                        catch(e) {
                            Ext.Msg.error(e);
                        }
                    }
                });
        }, { grid: grid, record: record });
    }
    // Remove periodic service button action listener
    delPeriodic.on('action', delService);
    // Remove one-time serivice button action listeners
    delOneTime.on('action', delService);
    
    var editAddit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit'),
        width: 26,
        iconCls: 'ext-edit'
    });
    
    var delAddit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Delete'),
        width: 26,
        iconCls: 'ext-drop'
    });  
    
    
    function hideBlocks(A) {
		A.get('user-cnt').items.each(function() {
			this.disable();
		});						
		A.get('agrm-cnt').items.each(function() {
			this.disable();
		});	
		A.get('pass-cnt').items.each(function() {
			this.disable();
		});	
		A.get('address-cnt').items.each(function() {
			this.disable();
		});	
		A.get('parent-cnt').items.each(function() {
			this.disable();
		});	
		A.get('conn-cnt').items.each(function() {
			this.disable();
		});	
		A.get('login-cnt').disable();
		A.get('doctpl').disable();	
	}
    
    
    
    
    
    
    /**
     * Функции проверяющие подходит ли тип договора к типу блокировки тарифа
     */
    var checkingIfTariffCorrespondsToAgreement = new function() {
        /**
         * Данные договора, который в данный момент выбран в поле договоров
         */
        var currentAgreementData;
        /**
         * ID договора учетки, сохранный в базе данных
         */
        var initialAgrmid;
        /**
         * Данные последнего выбранного договора, тип которого подходил к типу блокировки тарифа
         */
        var lastValidAgreementData;
        /**
         * Функция, которая должна быть выполнена в том случае, когда значение договора не должно быть изменено
         */
        this.doIfAgreementShouldNotBeChanged = function(){};
        /**
         * Функция, которая должна быть выполнена в том случае, когда значение договора должно быть изменено
         */
        this.doIfAgreementShouldBeChanged = function(){};
        /**
         * Меняет значение поля договоров на последний выбранный договор, тип которого подходил к типу блокировки тарифа
         */
        this.resetAgreement = function() {
            var data = this.getLastValidAgreementData();
            if (!data) {
                this.field('agrmid').reset();
            } else {
                this.setAgreement(data);
            }
        };
        /**
         * Возвращает данные последнего выбранного договора, тип которого подходил к типу блокировки тарифа
         */
        this.getLastValidAgreementData = function() {
            if (!lastValidAgreementData) {
                return null;
            }
            if (!this.isTariffCorrespondsToAgreement(lastValidAgreementData.paymentmethod)) {
                throw 'invalid agreement data';
            }
            return lastValidAgreementData;
        };
        /**
         * Устанавливает данные договора, который в данный момент выбран в поле договоров
         */
        this.setCurrentAgreementData = function(data) {
            currentAgreementData = data;
            this.getCurrentAgreementData();
        };
        /**
         *  Устанавливает данные договора, который в данный момент выбран в поле договоров, получая их из записи хранилища
         */
        this.setCurrentAgreementRecord = function(record) {
            if (parseInt(Ext.get('_templ_').getValue(), 0)) {
                return;
            }
            this.setCurrentAgreementData({
                agrmid: record.get('agrmid'),
                number: record.get('number'),
                paymentmethod: record.get('paymentmethod')
            });
        };
        /**
         * Устанавливает значение поля договоров
         */
        this.setAgreement = function(data) {
            this.addRecordToAgreementsStore(data);
            this.field('agrmid').setValue(data.agrmid);
            this.setCurrentAgreementData(data);
        };
        /**
         * Устанавливает значение поля договоров, полученное запросом данных редактируемой учетной записи
         */
        this.initAgreement = function(data) {
            if (parseInt(Ext.get('_templ_').getValue(), 0)) {
                return;
            }
            initialAgrmid = data.agrmid;
            this.setAgreement(data);
            this.rememberAgreement();
        };
        /**
         * Устанавливает функции, которые должны быть выполнены в том случае, когда значение договора должно быть изменено и в том случае, когда оно не должно быть изменено
         */
        this.setParams = function(params) {
            this.doIfAgreementShouldNotBeChanged = params.doIfAgreementShouldNotBeChanged || function(){};
            this.doIfAgreementShouldBeChanged = params.doIfAgreementShouldBeChanged || function(){};
        };
        /**
         * Проверяет, подходит ли тип договора к типу блокировки тарифа и показывает окно с предупреждением об их несоответствии, если это необходимо
         */
        this.run = function(params) {
            if (parseInt(Ext.get('_templ_').getValue(), 0)) {
                return true;
            }
            var paymentmethod = params.agreement ? params.agreement.get('paymentmethod') : this.getCurrentAgreementData().paymentmethod;
            this.setParams(params);
            if (!this.isTariffCorrespondsToAgreement(paymentmethod)) {
                this.showWarning();
                return false;
            }
            this.doIfAgreementShouldBeChanged();
            this.rememberAgreement();
            return true
        };
        /**
         * Выполняет функцию если договор выбранный в поле договоров сохранен в базе данных, а в противном случае сохраняет его и выполняет функцию после сохранения
         */
        this.doWhenAgreementSaved = function(callback) {
            if (parseInt(Ext.get('_templ_').getValue(), 0)) {
                return;
            }
            if (!this.agreementIsChanged()) {
                callback();
            } else {
                this.common().saveData(callback, true);
            }
        };
        /**
         * Возвращает TRUE, если договор выбранный в поле договоров сохранен в базе данных, а в противном случае возвращает FALSE 
         */
        this.agreementIsChanged = function() {
            return this.param('agrmid') != initialAgrmid;
        };
        /**
         * Возвразает вкладку "Общие" панели учетных записей
         */
        this.common = function() {
            return Ext.getCmp('MainVgroupTabPanel').get('vg-form');
        };
        /**
         * Возвращает форму вкладки "Общие" панели учетных записей
         */
        this.form = function() {
            return this.common().getForm();
        };
        /**
         * Добавляет запись в хранилище комбобокса договоров, если такая запись там отсутствует
         */
        this.addRecordToAgreementsStore = function(data) {
            var field = this.field('agrmid'),
                store = field.store;
            if (!field.findRecord(field.valueField, data.agrmid)) {
                field.lastQuery = data.number;
                store.add(new store.recordType(data));
            }
        };
        /**
         * Возвращает данные договора, который в данный момент выбран в поле договоров
         */
        this.getCurrentAgreementData = function() {
            if (!currentAgreementData) {
                return null;
            }
            if (this.param('agrmid') != currentAgreementData.agrmid) {
                throw 'invalid agreement data';
            }
            return currentAgreementData;
        };
        /**
         *  Устанавливает данные последнего выбранного договора, тип которого подходил к типу блокировки тарифа, получая их из договора выбранного в поле договоров
         */
        this.rememberAgreement = function() {
            if (parseInt(Ext.get('_templ_').getValue(), 0)) {
                return;
            }
            var data = this.getCurrentAgreementData();
            if (this.isTariffCorrespondsToAgreement(data.paymentmethod)) {
                lastValidAgreementData = data;
            }
        };
        /**
         * Показывает предупреждение о несоответствии типа договора типу блокировки тарифа
         */
        this.showWarning = function() {
            var message = Ext.app.Localize.get(
                'Tariff tardescr not fits to selected agreement. Would you like to change agreement and choose another tariff?'
            ).replace(
                'tardescr',
                this.param('tardescr')
            );
            Ext.Msg.confirm(Ext.app.Localize.get('Warning'), message, function(B) {
                if (B != 'yes') {
                    this.doIfAgreementShouldNotBeChanged();
                    return;
                }
                this.chooseOtherTariff();
            }, this);
        };
        /**
         * Открывает окно планирования тарифов
         */
        this.chooseOtherTariff = function() {
            var button = this.field('tardescr').ownerCt.get('tarid-btn');
            this.doIfAgreementShouldBeChanged();
            button.handler(button);
        };
        /**
         * Возвращает поле формы вкладки "Общие" панели учетных записей
         */
        this.field = function(name) {
            return this.form().findField(name);
        };
        /**
         * Возвращает значение поля формы вкладки "Общие" панели учетных записей
         */
        this.param = function(name) {
            return this.field(name).getValue();
        };
        /**
         * Возвращает TRUE, если тип договора подходит к типу блокировки тарифа, а в противном случае возвращает FALSE
         */
        this.isTariffCorrespondsToAgreement = function(paymentmethod) {
            var actblock = this.param('actblock') + '',
                AGREEMENT_PAYMENTMETHOD_ADVANCE = 0,
                AGREEMENT_PAYMENTMETHOD_CREDIT = 1,
                AGREEMENT_PAYMENTMETHOD_MIXED = 2,
                TARIFF_ACTBLOCK_NONE = '0',
                TARIFF_ACTBLOCK_AUTO = '1',
                TARIFF_ACTBLOCK_ACTIVE = '2';
            if (actblock === '') {
                return true;
            }
            if (paymentmethod == AGREEMENT_PAYMENTMETHOD_MIXED) {
                return true;
            }
            switch (actblock) {
                case TARIFF_ACTBLOCK_NONE:
                case TARIFF_ACTBLOCK_ACTIVE:
                    return paymentmethod == AGREEMENT_PAYMENTMETHOD_ADVANCE;
                    break;
                case TARIFF_ACTBLOCK_AUTO:
                    return paymentmethod == AGREEMENT_PAYMENTMETHOD_CREDIT;
                    break;
                default:
                    return true;
            }
        };
    };

    new Ext.TabPanel({
        renderTo: id,
        plain: true,
        activeItem: 0,
        deferredRender: true,
        width: 980,
        accType: null,
        id: 'MainVgroupTabPanel',
        listeners: {
        	afterrender: function(panel) {
				var vgid = Ext.get('vgid');
				var vgtpl = Ext.get('vgtpl');
        		if(vgid.getValue() > 0 || vgtpl.getValue() > 0) {
					var vg = 0;
					if(vgid.getValue() > 0) { vg = vgid.getValue(); } else 
					if(vgtpl.getValue() > 0) { vg = vgtpl.getValue(); }

					var templ = Ext.get('_templ_');
					panel.getTopToolbar().get('on-vg-form-btn').disable();
        			panel.get(0).setIconClass('x-header-load-icon');
        			panel.get(0).load({
                        url: 'config.php',
                        params: {
                        	async_call: 1,
                        	devision: 7,
                        	getvgroup: 1,
                        	vgid: vg
                        },
                        scope: {
                            btn: panel.getTopToolbar().get('on-vg-form-btn'),
                            panel: panel.get(0),
                            tabpanel: panel
                        },
                        success: function(form, action) {
                        	try {
                        		
                        		// Set Module data
                        		var module = form.findField('moduleid');
                        		if(action.result.data.modulereadonly) {
                                    module.setReadOnly(true);
                                }
                        		if(!module.findRecord('id', action.result.data.moduleid)) {
                            		module.store.add(new module.store.recordType({
                            			id: action.result.data.moduleid,
                            			name: action.result.data.moduledescr,
                            			type: action.result.data.moduletype
                            		}));
                        		}
                        		
                        		var moduleidold = form.findField('moduleidold'); 
                        		if(action.result.data.moduleid) {
                                    moduleidold.setValue (action.result.data.moduleid);
                                }
                        		
								form.findField('agenttype').setValue(action.result.data.moduletype);
                        		module.setValue(action.result.data.moduleid);
                        		//Ext.get('moduleids').set({ 'value': action.result.data.moduleid }); // Set tpl status [is Account Template]
                        		if(action.result.data.moduletype > 6 && action.result.data.moduletype < 15) {
									Ext.getCmp('userDeviceBlock').hide();
								}	
																
								// Hide/show panel tabs
									this.tabpanel.get('additional-fields').enable();
								if(action.result.data.templ != 1) { // if is not account template
									this.tabpanel.get('networking')[(action.result.data.moduletype < 7) ? 'enable' : 'destroy']();
									this.tabpanel.get('telephony')[(action.result.data.moduletype > 6 && action.result.data.moduletype < 13) ? 'enable' : 'destroy']();
									this.tabpanel.get('one-time-service')[(action.result.data.moduletype == 13) ? 'enable' : 'destroy']();
									this.tabpanel.get('periodic-service')[(action.result.data.moduletype == 13) ? 'enable' : 'destroy']();
									
									try {
										this.tabpanel.get('one-time-service')[(action.result.data.moduletype == 13 && action.result.data.tarid == 0) ? 'disable' : 'enable']();
										this.tabpanel.get('periodic-service')[(action.result.data.moduletype == 13 && action.result.data.tarid == 0) ? 'disable' : 'enable']();
									}
									catch(e) {}
									
								}
								
								if(action.result.data.templ == 1 && Ext.get('vgtpl').getValue() == 0) {	// if account template && not account from tpl creation
									templ.set({value: action.result.data.templ}); // set dom value for {templ}			
									var A = panel.get(0).get('common-set');
									hideBlocks(A);	// hide containers func			
								} else {
									templ.set({value: action.result.data.templ}); 
								}
								
								var adds = this.tabpanel.get('additional-fields');
								adds.store.reload({	params: { getaddonsvalues: action.result.data.moduleid }	}); // reload Additional fields grid
								
                        		// Set user data
                        		var user = form.findField('uid');
                        		if(action.result.data.uid > 0) {
                        			if(action.result.data.agrmreadonly) {
                                        user.setReadOnly(true);
                                        this.panel.get('common-set').find('itemId', 'user-btn')[0].disable();
                                    }
                                    user.store.add(new user.store.recordType({
                                        uid: action.result.data.uid,
                                        name: action.result.data.username
                                    }));
                                    user.setValue(action.result.data.uid);
                                }
                                else {
                                	user.setValue(null);
                                }
                                
                                //form.findField('pass').getEl().dom.type = action.result.data.hidepass > 0 ? 'password' : 'text';
                                
                                if(!Ext.isEmpty(action.result.data.hidepass) && action.result.data.hidepass == 0){ 
                                	form.findField('openpass').show();
                                	form.findField('pass').hide();
                                	form.findField('passtype').setValue(1);
                                }
                                else{
                                	form.findField('pass').show();
                                	form.findField('openpass').hide();
                                	form.findField('passtype').setValue(0);
                                }                               
                                
                                
                                // Set agreement
                                var agrm = form.findField('agrmid');
                                if(action.result.data.agrmid > 0) {
                                	if(action.result.data.agrmreadonly) {
                                		agrm.setReadOnly(true);
                                	}
                                    checkingIfTariffCorrespondsToAgreement.initAgreement({
                                        agrmid: action.result.data.agrmid,
                                        number: action.result.data.agrmnum,
                                        paymentmethod: action.result.full.paymentmethod
                                    });
                                }
                                else {
                                	agrm.setValue(null);
                                }
                                
                                
                                // Set parent vgid
                                var pvgid = form.findField('parentvgid');
                                if(action.result.data.parentvgid > 0) {
                                    pvgid.store.add(new pvgid.store.recordType({
                                        vgid: action.result.data.parentvgid,
                                        login: action.result.data.parentlogin
                                    }));
                                    pvgid.setValue(action.result.data.parentvgid);
                                }
                                else {
                                    pvgid.setValue(null);
                                }
                                
                                // Set parent user
                                var puid = form.findField('connecteduid');
                                if(action.result.data.connecteduid > 0) {
                                	puid.store.add(new puid.store.recordType({
                                        uid: action.result.data.connecteduid,
                                        name: action.result.data.connectedname
                                    }));
                                    puid.setValue(action.result.data.connecteduid);
                                }
                                else {
                                    puid.setValue(null);
                                }
                                
                                this.btn.enable();
                                this.panel.syncLayoutType();
                                this.panel.get('common-set').get('doctpl').setContainerVisible(true);
                                this.panel.doLayout();
                        	}
                        	catch(e) {
                        		Ext.Msg.error(e);
                        	}
                        	// Clear load icon
                        	this.panel.setIconClass();
                        	
                        	if(templ.getValue() != 1 && vgid.getValue() > 0) { // if is not account template
								// Enable tarifs & blocks
								this.tabpanel.get('tar-history').enable();
								this.tabpanel.get('blocks-history').enable();
								// Enable promotions
								this.tabpanel.getTopToolbar().get('promo-btn').enable();
								// Enable Equipment
								this.tabpanel.getTopToolbar().get('equip-btn').enable();
								// Enable Statistics
								this.tabpanel.getTopToolbar().get('stat-btn').enable();
								// Enable History
								this.tabpanel.getTopToolbar().get('history-btn').enable();
								this.tabpanel.getTopToolbar().get('usr-btn').enable();
								// Enable Balance Button
								Ext.getCmp('PBtn').enable();
							}
                        	

                        },
                        failure: function(form, action) {
                        	Ext.Msg.error(action.result.error);
                        	// Clear load icon
                            this.panel.setIconClass();
                        }
        			})
        		}
        		else {
        			
        			var form = panel.get(0).getForm();
        			
                	form.setValues({
                        vgaddrcode: Ext.get('addrcode').getValue(),
                        vgaddrstr: Ext.get('addrstr').getValue()
                	})					
					
        			if(Ext.get('uid') && Ext.get('username')) {
        				// Set user data
                        var user = form.findField('uid');
                        if(Ext.get('uid').getValue() > 0) {
                            user.store.add(new user.store.recordType({
                                uid: Ext.get('uid').getValue(),
                                name: Ext.get('username').getValue()
                            }));
                            user.setValue(Ext.get('uid').getValue());
                        }
        			}
					
        			if(Ext.get('autoagrmid') && Ext.get('autoagrmnum')) {
        				// Set agreement data
                        var agrm = form.findField('agrmid');
                        if(Ext.get('autoagrmid').getValue() > 0) {
                            checkingIfTariffCorrespondsToAgreement.initAgreement({
                                agrmid: Ext.get('autoagrmid').getValue(),
                                number: Ext.get('autoagrmnum').getValue(),
                                paymentmethod: Ext.get('autoagrmpaymentmethod').getValue()
                            });
                        }
        			}
        			
        			if( /* Ext.get('userlogin') && Ext.get('userlogin').getValue()!='' && */ Ext.get('userpass')) {        				
        				var vgpass = form.findField('pass');
                        vgpass.setValue(Ext.get('userpass').getValue());
                        var vgopenpass = form.findField('openpass');
                        vgopenpass.setValue(Ext.get('userpass').getValue());
                        
                        var vglogin = form.findField('login');
                        vglogin.setValue(Ext.get('userlogin').getValue());
        			}
        		}
        	},
        	tabchange: function(panel, tab) {
                panel.getTopToolbar().items.each(function(item) {
                    if(item.itemId && /^on-/.test(item.itemId)) {
                    	if(!this.regx) {
                    		item.hide();
                    	}
                    	else {
                            item[!this.regx.test(item.itemId) ? 'hide' : 'show']();
                    	}
                    }
                }, {
                    tab: tab,
                    regx: tab.itemId ? new RegExp('^on-' + tab.itemId) : false
                });
                // Apply some settings
                if(tab['itemId']) {
                    switch(tab.itemId) {
                    	case 'tar-history':
                    	case 'blocks-history':
                    	case 'one-time-service':
                            if(!tab.getStore().getCount()) {
								tab.getStore().setBaseParam('vgid', panel.get('vg-form').getForm().getValues().vgid).reload();
                            };
                        break;
                        case 'telephony':
                            tab.reload({
                                params: {
                                    vgid: panel.get('vg-form').getForm().getValues().vgid
                                }
                            });
                        break;
                    }
                }
        	}
        },
        tbar: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Save'),
            iconCls: 'ext-save',
            itemId: 'on-vg-form-btn',
            handler: function(Btn) {
                var tab = Btn.findParentByType('tabpanel').getActiveTab();
                if(tab['saveData'] && Ext.isFunction(tab['saveData'])) {
                	tab.saveData();
                }
            }
        }, {
            xtype: 'button', 
            iconCls: 'ext-tariff',
            itemId: 'on-tar-history-btn',
            hidden: true,
            text: Ext.app.Localize.get('Schedule tariff'),
            handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get('vg-form').getForm()
                    module = form.findField('moduleid'), 
                    agrm = form.findField('agrmid');
                    
                if(!module.getValue()) {
                    Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Module'));
                    return false;
                }
                if(!agrm.getValue()) {
                    Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Agreement'));
                    return false;
                }
                        
                var mtype = module.findRecord('id', module.getValue()).get('type');
                if(!Ext.isEmpty(mtype) && mtype == 13) {
                Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Active services could be stopped'), function(B) {
					if (B != 'yes') {
						return;
					};	
					// Call tariff schedulling form
					getTarifPlan({
						telphony: mtype > 6 && mtype < 13 ? true : false,
						discounts: mtype < 13 ? true : false,
						disCoef: mtype == 13 ? true : false,
						directSave: {
							vgid: form.getValues().vgid,
							moduleid: form.getValues().moduleid
						},
						callback: function(form) {
							this.grid.getStore().reload({
								params: {
									start: 0
								}
							});
							// reloading vgroups form -> showing new tariff data 
							var dt = new Date();
							if(form.findField('tardate').getValue().format('dmY') <= dt.format('dmY')) {
								Ext.get('_vgroupForm').dom.submit();
							}
						}.createDelegate({
							grid: Btn.findParentByType('tabpanel').getActiveTab()
						}),
						filter: {
							moduleid: module.getValue(),
							agrmid: agrm.getValue()
						}
					});
				});
				
				} else {
					// Call tariff schedulling form
					getTarifPlan({
						telphony: mtype > 6 && mtype < 13 ? true : false,
						discounts: mtype < 13 ? true : false,
						disCoef: mtype == 13 ? true : false,
						directSave: {
							vgid: form.getValues().vgid,
							moduleid: form.getValues().moduleid
						},
						callback: function(form) {
							this.grid.getStore().reload({
								params: {
									start: 0
								}
							});
							// reloading vgroups form -> showing new tariff data 
							var dt = new Date();
							if(form.findField('tardate').getValue().format('dmY') <= dt.format('dmY')) {
								Ext.get('_vgroupForm').dom.submit();
							}
						}.createDelegate({
							grid: Btn.findParentByType('tabpanel').getActiveTab()
						}),
						filter: {
							moduleid: module.getValue(),
							agrmid: agrm.getValue()
						}
					});
				}
				
            }
        }, {
        	xtype: 'button',
            iconCls: 'ext-blocked',
            itemId: 'on-blocks-history-btn',
            hidden: true,
            text: Ext.app.Localize.get('Schedule block'),
            handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get('vg-form').getForm();
                
                // Set vgroup block
                setVgBlock({
                    filter: {
                      vgid: form.getValues().vgid,
                      moduleid: form.getValues().moduleid
                    },
                    callback: function(form) {
                        this.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }.createDelegate(Btn.findParentByType('tabpanel').get('blocks-history'))
                });
            }
        }, {
        	xtype: 'button',
        	text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('number') + ' / ' + Ext.app.Localize.get('Trunk'),
        	iconCls: 'ext-cdrpabx',
        	itemId: 'on-telephony-btn',
        	handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get('vg-form').getForm();

                // Set telephony staff
        		setTelItem({
                    filter: {
                        vgid: form.getValues().vgid
                    },
                    callback: function(form) {
                        this.get(form.getValues().device < 2 ? 0 : 1).getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }.createDelegate(Btn.findParentByType('tabpanel').getActiveTab())
                });
        	}
        }, 
		{
        	xtype: 'button',
            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('One-time-e') + ' ' + Ext.app.Localize.get('services'),
            iconCls: 'ext-add',
            itemId: 'on-one-time-service-btn',
            handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get('vg-form').getForm(),
                    values = form.getValues();
                // Set One-time service
                showUBAddControl({
                    edit: false,
                    tarid: values.tarid,
                    servdata: {
                        data: {
                            vgid: values.vgid,
                            accondate: Date.parseDate( values.accondate, 'Y-m-d H:i:s' ),
                            servid: 0
                        }
                    },
                    login: values.login,
                    common: 0,
                    filterClass: true,
                    success: function(){
                        this.getStore().reload({
                            params: {
                            	start: 0
                            }
                        });
                    }.createDelegate(Btn.findParentByType('tabpanel').getActiveTab())
                });
            }
        }, {
        	xtype: 'button',
            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('Periodic-e') + ' ' + Ext.app.Localize.get('services'),
            iconCls: 'ext-add',
            itemId: 'on-periodic-service-btn',
            handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get('vg-form').getForm(),
                    values = form.getValues();

                // Set One-time service
                showUBAddControl({
                    edit: false,
                    tarid: values.tarid,
                    servdata: {
                        data: {
                            vgid: values.vgid,
                            accondate: Date.parseDate( values.accondate, 'Y-m-d H:i:s' ),
                            servid: 0
                        }
                    },
                    login: values.login,
                    common: 1,
                    filterClass: true,
                    success: function(){
                        this.getStore().reload({
                            params: {
                                start: 0
                            }
                        });
                    }.createDelegate(Btn.findParentByType('tabpanel').getActiveTab())
                });
            }
        }, {
        	xtype: 'tbspacer',
            width: 5
        }, {
        	xtype: 'button',
        	text: Ext.app.Localize.get('Promotions'),
        	itemId: 'promo-btn',
        	iconCls: 'ext-scheduled',
        	disabled: true,
            handler: function(Btn) {
            	var form = Btn.findParentByType('tabpanel').get(0).getForm();
            	
                setPromoTo({
                    data: { 
                        agrmid: form.getValues().agrmid,
                        vgid: form.getValues().vgid
                    }, vgroup: 1
                });
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            text: Ext.app.Localize.get('Equipment'),
            itemId: 'equip-btn',
            iconCls: 'ext-devices',
            disabled: true,
            handler: function(Btn) {
            	var form = Btn.findParentByType('tabpanel').get(0).getForm();
            	setVgEquipment({
                    data: {
						usecas: form.getValues().usecas,
                        agrmid: form.getValues().agrmid,
                        vgid: form.getValues().vgid,
                        tarid: form.getValues().tarid,
						agenttype: form.getValues().agenttype
                    }
                });
            }
        }, {
            xtype: 'button',
            text: Ext.app.Localize.get('Statistics'),
            iconCls: 'ext-stat',
            itemId: 'stat-btn',
            disabled: true,
            handler: function(Btn) {
				var form = Btn.findParentByType('tabpanel').get(0).getForm();
            	viewStatistics(form);                
			}
        }, {
            xtype: 'button',
            text: Ext.app.Localize.get('History'),
            iconCls: 'ext-history',
            itemId: 'history-btn',
            disabled: true,
            handler: function(Btn) {
                var form = Btn.findParentByType('tabpanel').get(0).getForm();
                var module = form.findField('moduleid');
				var data = module.findRecord('id', module.getValue());
                Charges({
					vgid: document.getElementById('vgid').value,
					module: data.data.id,
					moduletype: data.data.type
				});
            }
        }, {
			xtype: 'button',
			text: Ext.app.Localize.get('User'),
			disabled: true,
			itemId: 'usr-btn',
			iconCls: 'ext-ugroup',
			handler: function(Btn) {
				Btn.disable();

				var form = Btn.findParentByType('tabpanel').get('vg-form').getForm();					
				Ext.Ajax.request({
						url: 'config.php',
						method: 'POST',
						params: {
						async_call: 1,
						devision: 7,
						getifuser: form.getValues().uid
					},
					scope: {
						form: form,
						btn: Btn
					},
					callback: function(opt, success, resp) {
						try {
							this.btn.enable();							
							var data = Ext.decode(resp.responseText);							
							if(!data.success) {
								throw(data.error);
							}							
							createHidOrUpdate('_vgroupForm', 'uid', this.form.getValues().uid);
							submitForm('_vgroupForm', 'devision', 22);
						}
						catch(e) {
							Ext.Msg.error(e);
						}
					}
				});
			}			
		}],
        items: [
        // First tab
        {
            xtype: 'form',
            url: 'config.php',
            frame: true,
            title: Ext.app.Localize.get('Common'),
            autoHeight: true,
            monitorValid: true,
            itemId: 'vg-form',
            id: 'vg-form',
            saveData: function(callback, skipCheckingIfTariffCorrespondsToAgreement) {
                var callback = callback || function() {};
            	if(!this.getForm().isValid()) {
            		return false;
            	}

                if (!skipCheckingIfTariffCorrespondsToAgreement) {
                    if (!checkingIfTariffCorrespondsToAgreement.run({
                        doIfAgreementShouldNotBeChanged: function() {
                            checkingIfTariffCorrespondsToAgreement.resetAgreement();
                        }
                    })) {
                        return false;
                    }
                }
            	
				var form = this.getForm(); 
				
				if(Ext.get('_templ_').getValue()!=1)
				{
					var R = new RegExp(Ext.get('regpass').getValue());
					var passfield = form.findField('openpass').isVisible() ? form.findField('openpass') : form.findField('pass');
					
					if(!R.test(passfield.getValue())) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Incorrect password value') + ': (' + Ext.get('regpass').getValue() + ')');
						return false;
					}
					
	            	if(form.findField('tarid').getValue() == '' && Ext.get('_templ_').getValue()!=1) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Tariff undefined'));
						return false;
					}
            		
	            	if(form.findField('agrmid').getValue() == '' && Ext.get('_templ_').getValue()!=1) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Agreement'));
						return false;
					}
				
				}
            	
            	this.getForm().submit({
                    url: 'config.php',
                    waitTitle: Ext.app.Localize.get('Connecting'),
                    waitMsg: Ext.app.Localize.get('Sending data') + '...',
                    params: Ext.apply({
                    	async_call: 1,
                    	devision: 7,
                    	setvgroup: 1,
                    	templ: Ext.get('_templ_').getValue(),
                    	vgtpl: Ext.get('vgtpl').getValue()
                    }, this.getForm().modifires || {}),
                    success: function(form, action) {
                    	try {
                            callback();

                    		if(action.result.data.vgroup.vgid != form.getValues().vgid) {
                    			Ext.get('vgid').set({
                                    value: action.result.data.vgroup.vgid
                    			});
                    			Ext.get('_vgroupForm').dom.submit();
                    		}
                    		if(form.getValues().moduleid != form.getValues().moduleidold) 
                    		{                    			
                    			Ext.get('_vgroupForm').dom.submit();
                    		}
                    		
                    	}
                    	catch(e)
                    	{
                    		Ext.Msg.error(e);
                    	}
                    },
                    failure: function(form, action) {
                    	Ext.Msg.error(action.result.error);
                    }
            	});
            },
            syncLayoutType: function() { 

            	var form = this.getForm(),
                    module = form.findField('moduleid'),
                    tarid = form.findField('tarid').getValue(),
                    showTarBtn =form.findField('tardescr').ownerCt.get('tar-show-btn');
   
                // Check is current tariff available for showing for this manager
                if(tarid && tarid!=0) {
                	Ext.Ajax.request({
	            		url: 'config.php',
	                    method: 'POST',
	                    params: {
	                    	async_call: 1,
	                    	devision: 7,
	                    	getiftarif: form.getValues().tarid
	                    },
	                    scope: {
	                    	form: form,
	                    	btn: showTarBtn
	                    },
	                    callback: function(opt, success, resp) {
	                    	try {
	                    		var data = Ext.decode(resp.responseText);
	                    		if(data.success) this.btn.enable();
	                    	}
	                    	catch(e){}
	                    }
	            	});
                }
                
                if(!module.getValue()) {
                	form.findField('cuid').setContainerVisible(false);
                    return;
                }    

                if(Ext.get('_templ_').getValue() == 1) {
					form.findField('tardescr').ownerCt.get('tarid-btn').enable();
				}
				
                var type = module.findRecord('id', module.getValue()).get('type');
                form.findField('ipdet').setContainerVisible(type >= 0 && type < 6 ? true : false);
                form.findField('portdet').setContainerVisible(type >= 0 && type < 6 ? true : false);
                form.findField('shape').setContainerVisible(type >= 0 && type < 7 ? true : false);
                form.findField('maxsessions').setContainerVisible(type >= 0 && type < 7 || type == 12 ? true : false);
                form.findField('cuid').setContainerVisible(Ext.get('cybercrypt') && type == 13 ? true : false);
                form.findField('tarshape').setContainerVisible(type >= 0 && type < 7 ? true : false);
                // We suppose that container is empty for this module types
                // Empty means - no visible elements
                var fset;
                if((fset = this.find('itemId', 'options')[0])){
                    fset[(type > 6 && type < 12) || type == 14 || (type == 13 && !Ext.get('cybercrypt')) ? 'hide' : 'show']();
                }
            },
            layout: 'column',
            items: [{
                xtype: 'hidden',
                name: 'moduleidx',
                value: null
            },  {
                xtype: 'hidden',
                name: 'vgid',
                value: null
            }, {
                xtype: 'hidden',
                name: 'vgaddrcode',
                value: null
            }, {
            	xtype: 'hidden',
                name: 'tarid',
                value: null
            },{
            	xtype: 'hidden',
                name: 'accondate',
                value: null
            },
            {
            	xtype: 'hidden',
            	name: 'usercategory',
            	value: null
            },
            {
            	xtype: 'hidden',
            	name: 'agenttype',
            	value: 0
            },
            {
            	xtype: 'hidden',
            	name: 'usecas',
            	value: 0
            },
            // Common settings: login, pass, module, agreement and etc
            { //
                xtype: 'fieldset',
                itemId: 'common-set',
                columnWidth: .50,
                style: 'padding-top: 10px;',
                defaults: {
                    anchor: '100%',
                    xtype: 'textfield'
                },
                listeners: {
					afterrender: function(A) { // Account templates
						if(Ext.get('_templ_').getValue() == 1) {
							hideBlocks(A);
						}
					}
				},
                items: [{
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Module'),
                    hiddenName: 'moduleid',
                    editable: false,
                    triggerAction: 'all',
                    valueField: 'id',
                    displayField: 'name',
                    mode: 'local',
                    allowBlank: false,
                    forceSelection: true,
                    listeners: {
                    	beforeselect: function(combo, record) {
                    		if(combo.getValue() && combo.findRecord('id', combo.getValue()).get('type') != record.get('type')) {
                    			combo.findParentByType('form').getForm().setValues({
                                    tarid: null,
                                    tardescr: null,
                                    tartime: null,
                                    tardisc: null,
                                    tarrent: null,
                                    dailyrent: null,
                                    actblock: null,
                                    tarshape: null
                    			});
                    		}
                    		else if(combo.getValue() && combo.getValue()!= record.get('id') && combo.findRecord('id', combo.getValue()).get('type') == record.get('type')){
                    			if(!Ext.isDefined(combo.findParentByType('form').getForm().getValues()['tartime'])) {
                    				combo.findParentByType('form').add([{
										xtype: 'hidden',
										name: 'tartime',
										value: null
									}, {
										xtype: 'hidden',
										name: 'tardisc',
										value: null
									}, {
										xtype: 'hidden',
										name: 'catdisc',
										value: null
									}]);
                    				combo.findParentByType('form').doLayout();
								}
                    			
                    			combo.findParentByType('form').getForm().setValues({
                                    tardisc: 1,
                                    tartime: new Date().format('Y-m-d') + ' 00:00:00'
                    			});
                    		}
                    	},
                    	select: function(combo, record) {
							combo.findParentByType('form').getForm().findField('agenttype').setValue(record.get('type'));
                    		combo.findParentByType('form').syncLayoutType();
                    		var adds = combo.findParentByType('form').ownerCt.get('additional-fields');
                    		adds.store.reload({
								params: {
									getaddonsvalues: this.getValue()
								}
							});
                    	}
                    },
                    store: {
                        xtype: 'jsonstore',
                        root: 'results',
                        fields: ['id', 'name', 'type'],
                        autoLoad: true,
                        baseParams: {
                            async_call: 1,
                            devision: 7,
                            getmodules: 1
                        }
                    }
                }, {
        		    xtype: 'hidden', 
                    name: 'moduleidold',
                    value: null
        		},
                	{
                    xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('User'),
                    layout: 'hbox',
                    itemId: 'user-cnt',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-ugroup',
                        itemId: 'user-btn',
                        handler: function(Btn) {
                        	showUsers({ sm: true, 
                        	    callbackok: function(grid){									
                                    var record = grid.getSelectionModel().getSelected(),
                                        user = this.findField('uid');
                                    if(record && record != '') {
										this.findField('agrmid').setValue('');
									}                                     
                                    user.store.add(new user.store.recordType(record.data));
                                    user.setValue(record.get('uid'));
                                    if(!this.getValues().vgid && record.get('addrcode')) {
                                    	this.setValues({
                                            vgaddrcode: record.get('addrcode'),
                                            vgaddrstr: record.get('address'),
                                            vgaddressraw: record.get('addressraw')
                                    	})
                                    }
                        	    }.createDelegate(Btn.findParentByType('form').getForm())
                        	});
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'combo',
                        hiddenName: 'uid',
                        mode: 'remote',
                        lastQuery: '',
                        hideTrigger: true,
                        triggerAction: 'query',
                        queryParam: 'username',
                        valueField: 'uid',
                        displayField: 'name',
                        forceSelection: true,
                        allowBlank: false,
                        validator: function(value) {
                            var form = this.findParentByType('form').getForm();
                            form.findField('agrmid')[this.getValue() ? 'enable' : 'disable']();
                            form.findField('parentvgid')[(this.getValue() && Ext.get('vgid').getValue() >  0) ? 'enable' : 'disable']();
                        },
                        listeners: {
                        	select: function(combo, record) {
                        		var form = combo.findParentByType('form').getForm();
                        		if(!form.getValues().vgid && record.get('addrcode')) {
                        			form.setValues({
                                        vgaddrcode: record.get('addrcode'),
                                        vgaddrstr: record.get('address')
                        			});
                        		}
                        	}
                        },
                        store: {
                            xtype: 'jsonstore',
                            root: 'results',
                            fields: ['uid', 'name', 'addrcode', 'address'],
                            baseParams: {
                            	async_call: 1,
                            	devision: 7,
                            	getuseronfly: 1
                            }
                        },
                        flex: 1
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'button',
                        icon: 'images/16info.gif',
                        tooltip: Ext.app.Localize.get('Go to view user data'),
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm();
                        	
                        	if(!form.getValues().uid) {
                        		Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('User'));
                        		return false;
                        	}
                        	
                        	Btn.disable();
                        	
                        	Ext.Ajax.request({
                        		url: 'config.php',
                                method: 'POST',
                                params: {
                                	async_call: 1,
                                	devision: 7,
                                	getifuser: form.getValues().uid
                                },
                                scope: {
                                	form: form,
                                	btn: Btn
                                },
                                callback: function(opt, success, resp) {
                                	try {
                                		this.btn.enable();
                                		
                                		var data = Ext.decode(resp.responseText);
                                		
                                		if(!data.success) {
                                			throw(data.error);
                                		}
                                		
                                		createHidOrUpdate('_vgroupForm', 'uid', this.form.getValues().uid);
                                		submitForm('_vgroupForm', 'devision', 22);
                                	}
                                	catch(e) {
                                		Ext.Msg.error(e);
                                	}
                                }
                        	});
                        }
                    }]
                }, {
                    xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Agreement'),
                    layout: 'hbox',
                    itemId: 'agrm-cnt',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-agreement',
                        itemId: 'agrm-btn',
                        disabled: true,
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm(),
                                uid = form.findField('uid').getValue();
                            
                            if(!uid) {
                            	Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('User'));
                                return false;
                            }
                            
                            selectAgreements({
                                sm: true,
                                filter: { userid: uid },
                                callbackok: function(grid) {
                                    var record = grid.getSelectionModel().getSelected();
                                    checkingIfTariffCorrespondsToAgreement.run({
                                        agreement: record,
                                        doIfAgreementShouldBeChanged: function() {
                                            checkingIfTariffCorrespondsToAgreement.setAgreement({
                                                agrmid: record.get('agrmid'),
                                                number: record.get('number'),
                                                paymentmethod: record.get('paymentmethod')
                                            });
                                        }
                                    });
                                }.createDelegate(Btn.findParentByType('form').getForm().findField('agrmid'))
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'combo',
                        hiddenName: 'agrmid',
                        mode: 'remote',
                        lastQuery: '',
                        hideTrigger: true,
                        triggerAction: 'query',
                        queryParam: 'useragrm',
                        valueField: 'agrmid',
                        displayField: 'number',
                        forceSelection: true,
                        disabled: true,
                        allowBlank: false,
                        validator: function(value) {
                            var form = this.findParentByType('form').getForm();
                            form.findField('tardescr').ownerCt.get('tarid-btn')[value ? 'enable' : 'disable']();
                        },
                        listeners: {
                        	beforequery: function(ev) {
                        		var uid;
                        		if(!(uid = ev.combo.findParentByType('form').getForm().findField('uid').getValue())) {
                        			ev.cancel = true;
                        			return;
                        		}
                        		ev.combo.getStore().setBaseParam('uid', uid);
                        	},
                        	disable: function(combo) {
                        		combo.ownerCt.get('agrm-btn').disable();
                        	},
                        	enable: function(combo) {
                                combo.ownerCt.get('agrm-btn')[combo.readOnly ? 'disable' : 'enable']();
                            },
                            change: function(combo, newValue) {
                                var record = this.findRecord(this.valueField, newValue);
                                checkingIfTariffCorrespondsToAgreement.setCurrentAgreementRecord(record);
                                checkingIfTariffCorrespondsToAgreement.run({
                                    doIfAgreementShouldNotBeChanged: function() {
                                        checkingIfTariffCorrespondsToAgreement.resetAgreement();
                                    }
                                });
                            }
                        },
                        store: {
                        	xtype: 'jsonstore',
                        	root: 'results',
                        	fields: ['agrmid', 'number', 'paymentmethod'],
                        	baseParams: {
                        		async_call: 1,
                        		devision: 7,
                        		getagrmonfly: 1
                        	}
                        },
                        flex: 1
                    }]
                }, {
                    fieldLabel: Ext.app.Localize.get('Login'),
                    name: 'login',
                    itemId: 'login-cnt'
                },{
                	xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Password'),
                    layout: 'hbox',
                    itemId: 'pass-cnt',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-key',
                        handler: function(Btn) {
                            Ext.Ajax.request({
                            	url: 'config.php',
                            	timeout: 380000,
                            	method: 'POST',
                            	scope: Btn.findParentByType('form').getForm(),
                            	params: {
                            		async_call: 1,
                            		devision: 7,
                            		getrandompass: 1
                            	},
                            	callback: function(options, success, resp) {
                            		try {
                            			var data = Ext.decode(resp.responseText);
                            			this.setValues({
                            				pass: data.data,
                            				openpass: data.data
                            			});
                            		}
                            		catch(e) {
                            			Ext.Msg.error(e);
                            		}
                            	}
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'textfield',
                        name: 'pass',
                        inputType: 'password',
                        flex: 1,
                        hidden: true
                    }, {
                        xtype: 'textfield',
                        name: 'openpass',
                        inputType: 'text',
                        flex: 1
                    }, { 
                    	xtype: 'textfield',
                        name: 'passtype',
                        hidden: true,
                        value: 1
                    }]
                }, {
                    xtype: 'textarea',
                    fieldLabel: Ext.app.Localize.get('Description'),
                    name: 'descr'
                }, {
                	xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Parent account'),
                    itemId: 'parent-cnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-account',
                        disabled: true,
                        itemId: 'parentacc-btn',
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm(),
                                uid = form.findField('uid').getValue();
                            
                            if(!uid) {
                                Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('User'));
                                return false;
                            }
                            
                            showAccounts({
                                sm: true,
                                hideToolbar: true,
                                filter: {
                                    vguserid: uid
                                },
                                callbackok: function(grid) {
                                    var sm = grid.getSelectionModel().getSelected();
                                    if(!this.findRecord('id', sm.get('vgid'))) {
                                        this.getStore().add(new this.store.recordType({
                                            vgid: sm.get('vgid'),
                                            login: sm.get('login')
                                        }));
                                    }
                                    this.setValue(sm.get('vgid'));
                                    this.setRawValue(sm.get('login'));
                                }.createDelegate(form.findField('parentvgid'))
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'combo',
                        hiddenName: 'parentvgid',
                        mode: 'remote',
                        lastQuery: '',
                        hideTrigger: true,
                        triggerAction: 'query',
                        queryParam: 'vglogin',
                        valueField: 'vgid',
                        displayField: 'login',
                        forceSelection: true,
                        disabled: true,
                        listeners: {
                            beforequery: function(ev) {
                                var uid;
                                if(!(uid = ev.combo.findParentByType('form').getForm().findField('uid').getValue())) {
                                    ev.cancel = true;
                                    return;
                                }
                                ev.combo.getStore().setBaseParam('uid', uid);
                            },
                            disable: function(combo) {
                                combo.ownerCt.get('parentacc-btn').disable();
                            },
                            enable: function(combo) {
                                combo.ownerCt.get('parentacc-btn').enable();
                            }
                        },
                        store: {
                        	xtype: 'jsonstore',
                        	root: 'results',
                        	fields: ['vgid', 'login'],
                        	baseParams: {
                        		async_call: 1,
                        		devision: 7,
                        		getvgidonfly: 1
                        	}
                        },
                        flex: 1
                    }]
                }, {
                	xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Address'),
                    itemId: 'address-cnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        tooltip: Ext.app.Localize.get('Choose'),
                        iconCls: 'ext-address-ico',
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm();
                        	
                        	address(function(addr){
                        		this.setValues({
                                    vgaddrstr: addr.full.join(','),
                                    vgaddrcode: addr.code.join(','),
                                    vgaddressraw: addr.full.join(',')
                        		});
                        	}.createDelegate(form), { 
                        	   code: form.getValues().vgaddrcode || '', 
                        	   string: form.getValues().vgaddressraw || form.getValues().vgaddrstr
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'button',
                        tooltip: Ext.app.Localize.get('Clear'),
                        iconCls: 'ext-erase',
                        handler: function(Btn) {
                        	Btn.findParentByType('form').getForm().setValues({
                                vgaddrcode: null,
                                vgaddrstr: null,
                                vgaddressraw: null
                        	});
                        }
                    }, {
                    	xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'textarea',
                        name: 'vgaddrstr',
                        cls: 'textfield-body-hide',
                        readOnly: true,
                        flex: 1
                    }, {
                        xtype: 'hidden',
                        name: 'vgaddressraw'
                    }]
                }, {
                	xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Connected from'),
                    itemId: 'conn-cnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        iconCls: 'ext-account',
                        handler: function(Btn) {
                        	showUsers({
                                sm : true,
                                callbackok: function(grid){
                                    var record = grid.getSelectionModel().getSelected();
                                    this.store.add(new this.store.recordType({
                                        uid: record.get('uid'),
                                        name: record.get('name')
                                    }));
                                    this.setValue(record.get('uid'));
                                }.createDelegate(Btn.findParentByType('form').getForm().findField('connecteduid'))
                            });
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                    	xtype: 'combo',
                        hiddenName: 'connecteduid',
                        mode: 'remote',
                        lastQuery: '',
                        hideTrigger: true,
                        triggerAction: 'query',
                        queryParam: 'username',
                        valueField: 'uid',
                        displayField: 'name',
                        forceSelection: true,
                        store: {
                            xtype: 'jsonstore',
                            root: 'results',
                            fields: ['uid', 'name'],
                            baseParams: {
                            	async_call: 1,
                            	devision: 7,
                            	getuseronfly: 1
                            }
                        },
                        flex: 1
                    }]
                }, {
                	xtype: 'textfield',
                	hiddenName: 'ccrypt',
                	name: 'ccrypt',
                	fieldLabel: Ext.app.Localize.get('CerberCrypt card number')

                }, {
                    xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Document template'),
                    itemId: 'doctpl',
                    layout: 'hbox',
                    listeners: {
                    	render: function(el) {
                    		el.setContainerVisible(false)
                    	}
                    },
                    items: [{
                        xtype: 'combo',
                        hiddenName: 'docid',
                        mode: 'remote',
                        valueField: 'id',
                        displayField: 'name',
                        triggerAction: 'all',
                        editable: false,
                        store: {
                        	xtype: 'jsonstore',
                        	root: 'results',
                        	fields: ['id', 'name'],
                        	baseParams: {
                        		async_call: 1,
                        		devision: 7,
                        		getdoctpls: 1
                        	}
                        },
                        flex: 1,
                        listWidth: 600
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'button',
                        text: Ext.app.Localize.get('Generate'),
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm(),
                        	    values = form.getValues();
                        	
                        	if(!values.docid || !values.uid || !values.vgid || !values.agrmid) {
                        		return;
                        	}
                        	createDocument(Ext.copyTo({}, values, 'uid,agrmid,vgid,docid'));
                        }
                    }]
                }]
            }, // End common block
            {
                xtype: 'fieldset',
                labelWidth: 140,
                columnWidth: 0.50,
                style: 'padding-top: 10px;',
                defaults: {
                	xtype: 'combo',
                	anchor: '100%',
                	readOnly: true
                },
                items: [{
                    xtype: 'container',
                    fieldLabel: Ext.app.Localize.get('Tarifs'),
                    itemId: 'tarifs-cnt',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        tooltip: Ext.app.Localize.get('Choose'),
                        iconCls: 'ext-add',
                        itemId: 'tarid-btn',
                        disabled: true,
                        handler: function(Btn) {

							var form = Btn.findParentByType('form').getForm()
								module = form.findField('moduleid'), 
								agrm = form.findField('agrmid');
								vgid = form.findField('vgid');
								
							if(!module.getValue()) {
								Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Module'));
								return false;
							}
							if(!agrm.getValue() && Ext.get('_templ_').getValue() != 1) {
								Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Agreement'));
								return false;
							}
							
							var mtype = module.findRecord('id', module.getValue()).get('type');
							var midold = form.findField('moduleidold').getValue();
							
							if(vgid.getValue() && Ext.get('_templ_').getValue() != 1 && module.getValue() == midold)
							{    
								
								var getTarPlan = function (){
									getTarifPlan({
										telphony: mtype > 6 && mtype < 13 ? true : false,
										discounts: mtype < 13 ? true : false,
										disCoef: mtype == 13 ? true : false,
										directSave: {
											vgid: form.getValues().vgid,
											moduleid: form.getValues().moduleid
										},
										callback: function(form) {
											this.grid.getStore().reload({
												params: {
													start: 0
												}
											})
											var dt = new Date();
											if(form.findField('tardate').getValue().format('dmY') > dt.format('dmY')) {
												Ext.Msg.alert(Ext.app.Localize.get('Tarif scheduled'), Ext.app.Localize.get("Tarif was scheduled"));
											} else {
                                                checkingIfTariffCorrespondsToAgreement.doWhenAgreementSaved(function() {
                                                    Ext.get('_vgroupForm').dom.submit();
                                                });
											}
										}.createDelegate({
											grid: Btn.findParentByType('tabpanel').get('tar-history')
										}),
										filter: {
											moduleid: module.getValue(),
											agrmid: agrm.getValue()
										}
									});
								}
								
								if(!Ext.isEmpty(mtype) && mtype == 13) {
									Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Active services could be stopped'), function(B) {
										if (B != 'yes') {
											return;
										};								                       	
										getTarPlan();
									});
								}
								
								else{
									getTarPlan();
								}
								
								
							}
							else
							{
								getTarifPlan({
									telphony: mtype > 6 && mtype < 13 ? true : false,
									discounts: mtype < 13 ? true : false,
									disCoef: mtype == 13 ? true : false,
									callback: function(form, data) {
										if(!Ext.isDefined(this.form.getValues()['tartime'])) {
											this.panel.add([{
												xtype: 'hidden',
												name: 'tartime',
												value: null
											}, {
												xtype: 'hidden',
												name: 'tardisc',
												value: null
											}]);
											this.panel.doLayout();
										}
										
										var values = form.getValues(),
											tarif = form.findField('tarid').findRecord('tarid', values.tarid);
										
										this.form.modifires = data.modifires || {};
										
										this.form.setValues({
											tarid: values.tarid,
											tardescr: tarif.get('descr'),
											tartime: form.findField('tardate').getValue().format('Y-m-d') + ' ' + values.tartimehour + ':' + values.tartimemin + ':00',
											tardisc: values.tardisc,
											tarrent: tarif.get('rent') + ' ' + tarif.get('symbol'),
											dailyrent: tarif.get('dailyrent'),
											actblock: tarif.get('actblock'),
											tarshape: null
										});
                                        checkingIfTariffCorrespondsToAgreement.rememberAgreement();
										
									}.createDelegate({
										form: form,
										panel: Btn.findParentByType('form')
									}),
									filter: {
										moduleid: module.getValue(),
										agrmid: agrm.getValue()
									}
								});
							}						
						}
					},{
                        xtype: 'tbspacer',
                        width: 5
                    },{
                        xtype: 'button',
                        tooltip: Ext.app.Localize.get('Go to view selected tariff'), 
                        icon: 'images/16info.gif',
                        itemId: 'tar-show-btn', 
                        id: 'tar-show-btn',
                        disabled: true,
                        handler: function(Btn) {
                        	var form = Btn.findParentByType('form').getForm();
                        	if(!form.getValues().tarid) {
                        		Ext.Msg.error(Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('Tarif'));
                        		return false;
                        	}
                        	
                        	Btn.disable();
                        	
                        	Ext.Ajax.request({
                        		url: 'config.php',
                                method: 'POST',
                                params: {
                                	async_call: 1,
                                	devision: 7, 
                                	getiftarif: form.getValues().tarid 
                                },
                                scope: {
                                	form: form,
                                	btn: Btn
                                },
                                callback: function(opt, success, resp) {
                                	try {
                                		this.btn.enable();
                                		
                                		var data = Ext.decode(resp.responseText);
                                		
                                		if(!data.success) {
                                			throw(data.error);
                                		}
                                		
                                		createHidOrUpdate('_vgroupForm', 'tarif', form.getValues().tarid);
                    					submitForm('_vgroupForm', 'devision', 4);
                                	}
                                	catch(e) {
                                		Ext.Msg.error(e);
                                	}
                                }
                        	});
                        	
                        	
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 5
                    }, {
                        xtype: 'textfield',
                        name: 'tardescr',
                        cls: 'textfield-body-hide',
                        readOnly: true,
                        flex: 1
                    }
                    
                    
                    ]
                }, {
                	xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Rent'),
                    name: 'tarrent',
                    cls: 'textfield-body-hide'
                }, {
                    fieldLabel: Ext.app.Localize.get('Write rent off'),
                    name: 'dailyrent',
                    hideTrigger: true,
                    valueField: 'id',
                    cls: 'textfield-body-hide',
                    displayField: 'name',
                    store: {
                    	xtype: 'arraystore',
                    	fields: ['id', 'name'],
                    	data: [[null, ''], [1, Ext.app.Localize.get('daily')], [0, Ext.app.Localize.get('monthly')]]
                    }
                }, {
                    fieldLabel: Ext.app.Localize.get('Service blocking'),
                    name: 'actblock',
                    hideTrigger: true,
                    valueField: 'id',
                    displayField: 'name',
                    cls: 'textfield-body-hide',
                    store: {
                        xtype: 'arraystore',
                        fields: ['id', 'name'],
                        data: [[null, ''], [0, Ext.app.Localize.get('None')], [1, Ext.app.Localize.get('Automatically')], [2, Ext.app.Localize.get('Aggressive')]]
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Shape rate') + ' (' + Ext.app.Localize.get('Kbit') + '/' + Ext.app.Localize.get('sec-s') + ')',
                    cls: 'textfield-body-hide',
                    name: 'tarshape'
                }]
            }, {
                xtype: 'fieldset',
                columnWidth: 0.50,
                itemId: 'balance-cnt',
                style: 'padding-top: 10px;',
                defaults: {
                	anchor: '100%'
                },
                items: [{
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Status'),
                    name: 'blocked',
                    valueField: 'id',
                    displayField: 'name',
                    hideTrigger: true,
                    readOnly: true,
                    value: 10,
                    cls: 'textfield-body-hide',
                    store: {
                    	xtype: 'arraystore',
                    	fields: ['id', 'name'],
                    	data: [
                    	   [0, Ext.app.Localize.get('On state')],
                    	   [1, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')],
                    	   [2, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client')],
                    	   [3, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager')],
                    	   [4, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')],
                    	   [5, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic')],
                    	   [10, Ext.app.Localize.get('Turned off')]
                    	]
                    }
                },	{
					xtype: 'container',
						fieldLabel: Ext.app.Localize.get('Balance'),
						layout: 'hbox',                       
						items: [{
							xtype: 'button',
							id: 'PBtn',
							qtip: Ext.app.Localize.get('Save payment'),
							width: 22,
							menuDisabled: true,
							disabled: true,
							dataIndex: 'vgid',
							iconCls: 'ext-payhistory',
							handler: function(Btn) {								
								var form = Btn.findParentByType('tabpanel').get('vg-form').getForm();
                                agrm = form.findField('agrmid').getValue();
                                uid = form.findField('uid').getValue()
								setPayment({
									uid: uid,
									agrmid: agrm,
									vgid: document.getElementById('vgid').value,
									onpayment: function(o){
										form.findField('balance').setValue(o.newBalance);									
									},
									onpromised: function(o) {
										// FORM RELOAD?	
									},
									scope: form
								})			
							}
						}, {
							xtype: 'textfield',
							id: 'balance',
							name: 'balance',
							cls: 'textfield-body-hide',
							readOnly: true								
						}]
					}]
            }, {
                xtype: 'fieldset',
                itemId: 'options',
                columnWidth: .50,
                defaults: {
                	anchor: '100%'
                },
                items: [{
                    xtype: 'container',
                    layout: 'column',
                    stype: 'padding: 0',
                    defaults: {
                    	xtype: 'fieldset',
                    	border: false,
                    	style:'padding:0 2px 0 0'
                    },
                    items: [{
                        columnWidth: 0.65,
                        labelWidth: 190,
                        defaults: {
                            xtype: 'numberfield',
                            anchor: '100%',
                            allowDecimal: false,
                            allowNegative: false
                        },
                        items: [{
                            fieldLabel: Ext.app.Localize.get('Shape rate') + ' (' + Ext.app.Localize.get('Kbit') + '/' + Ext.app.Localize.get('sec-s') + ')',
                            name: 'shape'
                        }, {
                            fieldLabel: Ext.app.Localize.get('Sessions at the moment'),
                            value: 1,
                            name: 'maxsessions'
                        }, {
                            fieldLabel: Ext.app.Localize.get('CyberCrypt card number'),
                            name: 'cuid',
                            listeners: {
                            	afterrender: function(field) {
                            		field.findParentByType('form').syncLayoutType();
                            	}
                            }
                        }]
                    }, {
                        columnWidth: 0.35,
                        defaults: {
                            xtype: 'checkbox',
                            anchor: '100%'
                        },
                        items: [{
                            fieldLabel: Ext.app.Localize.get('Take account of') + ' ' + Ext.app.Localize.get('resource'),
                            inputValue: 1,
                            name: 'ipdet'
                        }, {
                            fieldLabel: Ext.app.Localize.get('Take account of') + ' ' + Ext.app.Localize.get('port'),
                            inputValue: 1,
                            name: 'portdet'
                        }]
                    }]
                }]
            }, {
                xtype: 'fieldset',
                id: 'userDeviceBlock', 
                columnWidth: .50,
                defaults: {
                	anchor: '100%'
                },    
				listeners: {
					afterrender: function() {
						var vgid = document.getElementById("vgid").value;
						if(vgid != '' && vgid > 0) {
							show_vgid_port(vgid);
						} else {
							this.hide();
						}					
					}
				},       
                items: [{
                    xtype: 'container',
                    layout: 'column',
					id: 'device_ports',
                    stype: 'padding: 0',
                    defaults: {
                    	xtype: 'fieldset',
                    	border: false,
                    	style:'padding:0 2px 0 0'
                    },
                    items: [{
						xtype: 'hidden',
						id: 'dev_id'
					},{
						xtype: 'hidden',
						id: 'port_id'
					},{
                        columnWidth: 0.5,
                        labelWidth: 100,
                        defaults: {
							xtype: 'textfield',
							border: false,
							cls: 'textfield-body-hide',
							readOnly: true
						},
                        items: [{
							xtype: 'container',
                            fieldLabel: Ext.app.Localize.get('Name'),
                            layout: 'hbox',                           
                            items: [{
									xtype: 'container',
									id: 'flagDevice'
								}, {
									xtype: 'textfield',
									id: 'device_name',
									cls: 'textfield-body-hide',
									readOnly: true								
								}]
                        }, {
                            fieldLabel: Ext.app.Localize.get('Vlan'),
                            id: 'port_vlan',
                            dataIndex: 'vlan'
                        }, {
                            fieldLabel: Ext.app.Localize.get('Comment'),
                            id: 'port_comment',
                            dataIndex: 'comment'
                        }]
                    }, {
                        columnWidth: 0.5,
                        defaults: {
							xtype: 'textfield',
							border: false,
							cls: 'textfield-body-hide',
							readOnly: true
						},
                        items: [{
                            xtype: 'container',
                            fieldLabel: Ext.app.Localize.get('Port'),
                            layout: 'hbox',
                            items: [{
								xtype: 'container',
								id: 'flagPort'
								}, {
									xtype: 'textfield',
									id: 'device_port',
									dataIndex: 'device_port',
									cls: 'textfield-body-hide',
									readOnly: true								
								}]
                        }, {
                            fieldLabel: Ext.app.Localize.get('Policy'),
                            id: 'policy_name',
                            dataIndex: 'policy' 
                        }, {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [{
								xtype: 'button',
								text: Ext.app.Localize.get('Change'),
								id: 'bind_account_to_port_btn',
								handler: function() {
									var vgid = document.getElementById("vgid").value;
									if(vgid != '' && vgid > 0) {
										bind_account(vgid);
									}	
								}
							},{
								xtype: 'button',
								text: Ext.app.Localize.get('Remove port'),
								id: 'unbind_account_to_port_btn',
								disabled: true,
								handler: function(Btn) {
									Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Remove port request'), function(B) {
										if (B != 'yes') {
											return;
										};
										if(Ext.isEmpty(Ext.getCmp("port_id").getValue())) {
											Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('No data'));
											return;
										}		
										Ext.Ajax.request({
											url: 'config.php',
											method: "POST",
											params: {
												devision: 207,
												async_call: 1,
												removeportfromvgid: 1,
												vgid: Ext.get("vgid").getValue()
											},
											success: function(response){
												var resp = Ext.util.JSON.decode(response.responseText);										
												if (resp.success) {
													Ext.get('_vgroupForm').dom.submit();
												}
											}
										});
									})
								}
							}]
                        }]
                    }]					
                }]
            }]
        }, // END First tab
        // Second tab
        {
        	xtype: 'grid',
        	title: Ext.app.Localize.get('Tarifs'),
        	height: 750,
        	autoExpandColumn: 'tar-name-col-exp',
        	PAGELIMIT: 100,
        	loadMask: true,
        	disabled: true,
        	itemId: 'tar-history',
        	listeners: {
        		beforerender: function(grid) {
        			grid.setPagePanel();
        		}
        	},
        	plugins: [multiTarEdit, tarRemove],
        	columns: [multiTarEdit, {
        	    header: Ext.app.Localize.get('Tarif'),
        	    dataIndex: 'tarnewname',
        	    id: 'tar-name-col-exp'
        	}, {
                header: Ext.app.Localize.get('Previous tariff'),
                dataIndex: 'taroldname',
                renderer: function(value, meta, record) {
                	return record.get('israsp') ? '-' : value;
                },
                width: 180
        	}, {
        		header: Ext.app.Localize.get('Scheduled on'),
        		dataIndex: 'rasptime',
        		width: 120,
        		renderer: function(value, meta, record) {
                    return (!Ext.isEmpty(value) && value.format('Y') > 1900) ? (Ext.isDate(value) ? value.format('d.m.Y H:i') : '-') : '-';
                }
        	}, {
        		header: Ext.app.Localize.get('Time of action'),
        		dataIndex: 'changetime',
        		width: 180,
        		renderer: function(value, meta, record) {
        			var str = null;
        			if(record.get('ismulti') && Ext.isDate(value) && value.format('Y') > 1900) {
        				str = value.format('d.m.Y H:i');
        			}
        			if(str && Ext.isDate(record.get('timeto')) && record.get('timeto').format('Y') > 1900) {
                        str = str + ' - ' + record.get('timeto').format('d.m.Y H:i');
                    }
                    return str ? str : '-';
        		}
        	}, {
        	    header: Ext.app.Localize.get('Changed'),
        	    dataIndex: 'changetime',
        	    renderer: function(value, meta, record) {
					if(!Ext.isEmpty(value) && value.format('Y') > 1900) {
						return (record.get('ishistory')) ? (Ext.isDate(value) ? value.format('d.m.Y H:i') : '-') : '-';
					} else {
						return '-';
					}
        	    },
        	    width: 120
        	}, {
        	    header: Ext.app.Localize.get('Assigned by'),
        	    dataIndex: 'mgrname',
        	    width: 200
        	}, tarRemove],
        	viewConfig: {
        		getRowClass: function(record, rowIndex, rp) {
        			return record.get('ismulti') ? 'x-type-multitarif' : '';
        		}
        	},
        	bbar: {
        		xtype: 'paging',
                pageSize: 0,
                displayInfo: true
        	},
        	store: {
        		xtype: 'jsonstore',
        		root: 'results',
        		totalProperty: 'total',
        		fields: ['recordid','taridnew','taridold', 'vgid',
                    'israsp','ishistory','ismulti','tarnewname','taroldname','mgrname', 'moduleid', 'moduletype', 'discount', 'groupid',
                    { name: 'changetime', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'rasptime', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
                ],
        		baseParams: {
        			async_call: 1,
        			devision: 7,
        			gettarhistory: 1,
					vgid: Ext.get('vgid').getValue()
        		}
        	}
        }, // END second tab
        // Blocks tab
        {
            xtype: 'grid',
            title: Ext.app.Localize.get('Locks'),
            itemId: 'blocks-history',
            height: 750,
            PAGELIMIT: 100,
            loadMask: true,
            disabled: true,
            autoExpandColumn: 'blk-mgr-exp-col',
            listeners: {
                beforerender: function(grid) {
                    grid.setPagePanel();
                },
                activate: function(grid) {
                    grid.getStore().reload();
                }
            },
            plugins: [blkRemove],
            columns: [{
                header: Ext.app.Localize.get('Blocking') + ' (' + Ext.app.Localize.get('Since') + ')',
                dataIndex: 'changetime',
                renderer: function(value, meta, record) {
                    return Ext.isDate(value) ? (value.format('Y') < 1900 ? '-' : value.format('d.m.Y H:i')) : '-';
                },
                width: 180
            }, {
            	header: Ext.app.Localize.get('Lock removed'),
                dataIndex: 'timeto',
                renderer: function(value, meta, record) {
                    return Ext.isDate(value) ? value.format('d.m.Y H:i') : '-';
                },
                width: 180
            }, {
                header: Ext.app.Localize.get('Lock type'),
                dataIndex: 'blkreq',
                width: 180,
                renderer: function(value) {
                	var str = '(' + value + ') ';
                    switch(value) {
                        case 0: str += Ext.app.Localize.get('Turn on'); break;
                        case 1: str += Ext.app.Localize.get('by balance'); break;
                        case 2: str += Ext.app.Localize.get('by client'); break;
                        case 3: str += Ext.app.Localize.get('Administrative'); break;
                        case 4: str += Ext.app.Localize.get('by balance'); break;
                        case 5: str += Ext.app.Localize.get('by traffic amount'); break;
                        case 10: str += Ext.app.Localize.get('Turn off'); break;
                    }
                    
                    return str;
                }
            }, {
                header: Ext.app.Localize.get('Assigned by'),
                dataIndex: 'mgrname',
                id: 'blk-mgr-exp-col'
            }, blkRemove],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            store: {
            	xtype: 'jsonstore',
            	root: 'results',
            	totalProperty: 'total',
            	fields: ['recordid', 'vgid', 'groupid', 'ishistory', 'blkreq', 'mgrname', 'mgrdescr', 'comment', 
            	   { name: 'changetime', type: 'date', dateFormat: 'Y-m-d H:i:s' },
            	   { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
            	],
            	baseParams: {
            		async_call: 1,
            		devision: 7,
            		getvgblocks: 1,
					vgid: Ext.get('vgid').getValue(),
            		start: 0,
            		limit: 100
            	}
            }
        }, // END Blocks tab
        // Network tab
       {
            xtype: 'panel',
            disabled: true,
            title: Ext.app.Localize.get('Networking'),
            itemId: 'networking',
            layout: 'accordion',
            loadMask: true,
            disabled: true,
            height: 750,
            defaults: {
            	border: false
            },
			items: [{
				title: 'IP ' + Ext.app.Localize.get('addresses'), // IP адреса вкладка
                layout: 'fit',
                id: 'addx',
                items: {
					layout: 'border',
					defaults: {
						border: false
					},
					items: [{
						xtype: 'grid',
                        region: 'west',
						width: 400,
						split: true,
						title: Ext.app.Localize.get('Assigned'), // Назначенные столбец
						id: 'ipassigned',
						name: 'ipassigned',
						loadMask: true,
						tbar: [{ // Кнопка удаления
							xtype: 'button',
							text: Ext.app.Localize.get('Remove'),
							iconCls: 'ext-remove',
							handler: function() {
								var grid = Ext.getCmp('ipassigned');
								if (!Ext.isEmpty(grid.getSelectionModel().getSelected())) {
									params = {};
									Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
										grid.store.remove(item);
										params[index] = item.data.recordid;
									});								

									Ext.Ajax.request({
										url: 'config.php',
										method: 'POST',
										params: {
											async_call: 1,
											devision: 7,
											getstaff: Ext.get('vgid').getValue(),
											records: Ext.encode(params)
										}
									});
								}
								try {
									Ext.getCmp('staffCopy').setValue(false);
								}
								catch (e) {
								}
							}
						}],
						plugins: [rowCheck],
                        columns: [{ // Колонки данных
							header: Ext.app.Localize.get('IP'), 
							dataIndex: 'ipmask.ip',
							id: 'ipsigned',
							width: 250,
							sortable: true,
							renderer: function(value, meta){
								meta.css += ' x-selectable ';
								return value;
							}
						}, {
							header: Ext.app.Localize.get('Mask'),
							dataIndex: 'ipmask.mask',
							width: 70,
							sortable: true
						}, rowCheck],
                        store: {
							xtype: 'jsonstore',
							root: 'results',
							fields: ['recordid','vgid', 'type', 'as', 'ipmask.ip', 'ipmask.mask', 'port'],
							baseParams: {
								async_call: 1,
								devision: 7,
								getstaff: Ext.get('vgid').getValue()
							}
						},
						listeners: {
							afterrender: function() {
								this.store.reload();
							}
						}
                    }, {
                        region: 'center',
                        title: Ext.app.Localize.get('Free'), // Свободные столбец
                        xtype: 'grid',
                        id: 'addrx',
                        PAGELIMIT: 100, // zz
						tbar: [{
							xtype: 'button', // Кнопка Добавить
							text: Ext.app.Localize.get('Add'),
							iconCls: 'ext-add',
							handler: function(){
								var grid = Ext.getCmp('addrx');								
								var vlist = Ext.getCmp('ipassigned');
								params = {};							
								
								if (!Ext.isEmpty(grid.getSelectionModel().getSelected())) {
									Ext.each(grid.getSelectionModel().getSelections(), function(item, index){
										grid.store.remove(item);
										params[index] = {
											'type': 0, 
											'segment': item.data.ip, 
											'mask': item.data.mask,
											'segmentid': item.data.segmentid
										};
									});
									
									Ext.Ajax.request({
										url: 'config.php',
										method: 'POST',
										params: {
											async_call: 1,
											devision: 7,
											setstaff: Ext.get('vgid').getValue(),
											records: Ext.encode(params)
										},
										callback: function() {								
											var params = {};				
											params['getstaff'] = Ext.get('vgid').getValue();
											params['setstaffport'] = '';
											vlist.store.reload({
												params: params
											});
										}
									});
								}
							}							
						}, '-', Ext.app.Localize.get('Exlude br-cast') + ':', {
							xtype: 'checkbox',
							id: '_ExlBrd'
						}, {
							xtype: 'combo',
							width: 120,
							id: '_segmentsCombo',
							emptyText: '...',
							displayField: 'segment',
							valueField: 'segment',
							triggerAction: 'all',
							editable: false,			
							store: {
								xtype: 'jsonstore',
								root: 'results',
								fields: ['segment','mask'],
								baseParams: {
									async_call: 1,
									devision: 7,
									vgid: Ext.get('vgid').getValue()
								},
								sortInfo: {
									field: 'segment',
									direction: "ASC"
								},
								listeners: {
									load: function() {
										var c = this.store;									
										if (!Ext.isEmpty(c) && c.store.getCount()) {
											var r = c.store.getAt(0);
											c.setValue(r.get("segment"));
											Ext.getCmp('iSegment').setValue(r.get("segment"));
											Ext.getCmp('iMask').setValue(r.get("mask"));
										}
									}
								}								
							}, 
							listeners: {
								beforequery: function(query){
									query.combo.store.baseParams = {};
									query.combo.store.reload({ 
											params: {
												async_call: 1,
												devision: 7,
												getsegments: Ext.get('moduleid').getValue(),
												vgid: Ext.get('vgid').getValue()
											}
										});	
									return false;
								},
								select: function() {
									var combobox = this;
									var value = combobox.getValue();
									var record = combobox.findRecord(combobox.valueField || combobox.displayField, value);
									var index = combobox.store.indexOf(record);
									var r = combobox.store.getAt(index);
									Ext.getCmp('iSegment').setValue(r.get("segment"));
									Ext.getCmp('iMask').setValue(r.get("mask"));
								}
							},
							tpl: '<tpl for="."><div class="x-combo-list-item">{segment}/{mask}</div></tpl>'
						}, {
							xtype: 'combo',
							id: '_devideMask',
							itemId: 'dmask',
							width: 55,
							displayField: 'id',
							valueField: 'id',
							value: 32,
							tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{[values.descr]}">{id}</div></tpl>',
							triggerAction: 'all',
							mode: 'local',
							editable: false,
							store: {
								xtype: 'arraystore',
								fields: ['id', 'descr'],
								data: [
									[0, '0.0.0.0'], [1, '128.0.0.0'], [2, '192.0.0.0'], [3, '224.0.0.0'], [4, '240.0.0.0'],
									[5, '248.0.0.0'], [6, '252.0.0.0'], [7, '254.0.0.0'], [8, '255.0.0.0'], [9, '255.128.0.0'],
									[10, '255.192.0.0'], [11, '255.224.0.0'], [12, '255.240.0.0'], [13, '255.248.0.0'], [14, '255.250.0.0'],
									[15, '255.254.0.0'], [16, '255.255.0.0'], [17, '255.255.128.0'], [18, '255.255.192.0'], [19, '255.255.224.0'],
									[20, '255.255.240.0'], [21, '255.255.248.0'], [22, '255.255.252.0'], [23, '255.255.254.0'], [24, '255.255.255.0'],
									[25, '255.255.255.128'], [26, '255.255.255.192'], [27, '255.255.255.224'], [28, '255.255.255.240'], [29, '255.255.255.248'],
									[30, '255.255.255.252'], [31, '255.255.255.254'], [32, '255.255.255.255']									
								]
							}
						},{
							xtype: 'hidden',
							id: 'iSegment'
						},{
							xtype: 'hidden',
							id: 'iMask'
						}, '&nbsp;', {
							xtype: 'button',
							iconCls: 'ext-calc',
							tooltip: Ext.app.Localize.get('Recalculate'),
							handler: function(){ // Перезагрузка Grid при клике на калькулятор
								var alist = Ext.getCmp('addrx');
								params = alist.store.baseParams;
								params['broadcast'] = Ext.getCmp('_ExlBrd').getValue();
								params['segment[ip]'] = Ext.getCmp('iSegment').getValue();
								params['segment[mask]'] = Ext.getCmp('iMask').getValue();
								params['mask'] = Ext.getCmp('_devideMask').getValue();
								alist.store.reload({
									params: params
								});
							}
						}],
						columns: [{
							header: 'IP',
							dataIndex: 'ip',
							id: 'ipsigned',
							width: 250,
							sortable: true
						}, {
							header: Ext.app.Localize.get('Mask'),
							dataIndex: 'mask',
							id: 'masksigned',
							width: 70,
							sortable: true
						}], 
                        store: {
							xtype: 'jsonstore',
							timeout: 380000,
							root: 'results',
							fields: ['ip','mask', 'segmentid'],
							baseParams: {
								async_call: 1,
								devision: 7,
								getipfree: '' // module
							}
						}, 
						bbar: {
							xtype: 'paging',
							pageSize: 0,
							displayInfo: true
						},
						listeners: {
							beforerender: function(grid) {
								grid.setPagePanel();
							},
							afterrender: function() {
								this.store.baseParams.getipfree = Ext.get('moduleid').getValue();
								/*this.store.reload({ 
									params: {
										broadcast: Ext.getCmp('_ExlBrd').getValue(),
										'segment[ip]': Ext.getCmp('iSegment').getValue(),
										'ipsegment[mask]': Ext.getCmp('iMask').getValue(),
										mask: Ext.getCmp('_devideMask').getValue()
									}
								});	*/
							 }
						 }
                    }]
                }
            }, {
                title: Ext.app.Localize.get('Transport network addresses'),
                layout: 'fit',
                hideMode:'offsets',                            
				tbar:[{ 
					xtype: 'textfield',
					id: '_macField',
					width: 150 
				}, '&nbsp;', Ext.app.Localize.get("Linke to") + ' IP: ', '&nbsp;', { 
					xtype: 'checkbox',
					id: 'staffCopy',
					handler: function(A, B){ 
						if(B) { 
							Ext.getCmp('linkip').enable(); 
						} else { 
							Ext.getCmp('linkip').disable(); 
							Ext.getCmp('linkip').setValue('') 
							} 
						} 
					}, {
						xtype: 'tbspacer',
						width: 10
					}, { 
						xtype: 'combo',
						id: 'linkip',
						width: 150,
						disabled: true,
						mode: 'local', 
						triggerAction: 'all', 
						editable: false, 
						displayField: 'segment', 
						valueField: 'segment',
						store: { 
							xtype: 'jsonstore',
							timeout: 380000,
							root: 'results',
							fields: ['recordid','segment', 'mask', 'type'],
							baseParams: {
								async_call: 1,
								devision: 7,
								getips: Ext.get('vgid').getValue() // vgid
							}
						 },
						 listeners: {
							beforequery: function(queryEv){
								queryEv.combo.store.reload();
								return false;
							}   
						 },
						tpl: '<tpl for="."><div class="x-combo-list-item">{segment}/{mask}</div></tpl>' 
					}, {
						xtype: 'tbspacer',
						width: 10
					}, { 
						xtype: 'button', 
						iconCls: 'ext-add', 
						text: Ext.app.Localize.get("Add"), 
						handler: function() {
							var macstore = Ext.getCmp('macstore').store;
							params = {};
							params['mac'] = Ext.getCmp('_macField').getValue();
							
							if(Ext.getCmp('staffCopy').getValue()) {
								var ipstore = Ext.getCmp('linkip').store;
								var ind = Ext.getCmp('linkip').selectedIndex;
								params['recordid'] = ipstore.getAt(ind).get('recordid');										
								params['segment'] = Ext.getCmp('linkip').getValue();		
							}
							
							Ext.Ajax.request({
								url: 'config.php',
								timeout: 380000,
								method: 'POST',
								params: {
									async_call: 1,
									devision: 7,
									setmacstaff: Ext.get('vgid').getValue(),
									records: Ext.util.JSON.encode(params)
								},
								callback: function(opt, success, res) {
                                    if (Ext.isDefined(res['responseText'])) {
                                        var data = Ext.util.JSON.decode(res.responseText);
                                        if(!Ext.isEmpty(data.error)) {
											Ext.Msg.error(Ext.app.Localize.get(data.error));
										}
                                    }
									macstore.reload({
										params: params
									});
                                }
							});	
						} 
					}],
                items: [{
                    xtype: 'grid',
                    id: 'macstore',
                    dataIndex: 'macstore',
                    loadMask: true,
                    store: { 
						xtype: 'jsonstore',
						timeout: 380000,
						root: 'results',
						fields: ['macid', 'mac', 'segment', 'vgid', 'recordid'],
						baseParams: {
							async_call: 1,
							devision: 7,
							getmacstaff: Ext.get('vgid').getValue() // vgid
						}
					},
					plugins: [macDel],
					listeners: {
							afterrender: function() {
								this.store.reload();
							}
						},
                    columns: [{
                        header: Ext.app.Localize.get('MAC'), 
							dataIndex: 'mac',
							width: 350,
							sortable: true,
							renderer: function(value, meta){
								meta.css += ' x-selectable ';
								return value;
							}
						}, {
							header: Ext.app.Localize.get('IP'),
							dataIndex: 'segment',
							width: 200,
							sortable: true,
							renderer: function(value, meta){
								meta.css += ' x-selectable ';
								return value;
							}
                    }, macDel]                                     
				}]
            }, {
                title: Ext.app.Localize.get('Local AS'),
                layout: 'fit',
                id: '_asGrid',
                tbar: [Ext.app.Localize.get('Number') + ':', '&nbsp;',{
					xtype: 'numberfield',
					minValue: 1,
					maxValue: 65535,
					id: '_asField',
					width: 68
				}, '&nbsp;', {
					xtype: 'button',
					iconCls: 'ext-add',
					text: Ext.app.Localize.get('Add'),
					handler: function() {
						var asStore = Ext.getCmp('asStore').store;
						var fval = Ext.getCmp('_asField').getValue();
						params = {};				
						params['recordid'] = 0;		
						params['type'] = 2;
						params['vgid'] = Ext.get('vgid').getValue();
						params['las'] = fval;
						
						Ext.Ajax.request({
								url: 'config.php',
								method: 'POST',
								params: {
									async_call: 1,
									devision: 7,
									setstaffas: Ext.get('vgid').getValue(),
									records: Ext.encode(params)
								},
								callback: function() {
									asStore.reload({
										params: params
									});	
								}
							});
					}
				}],
                items: {
                	xtype: 'grid',
                	id: 'asStore',
                	dataIndex: 'as',
                	plugins: [asDel],
                	loadMask: true,
                    store: { 
						xtype: 'jsonstore',
						timeout: 380000,
						root: 'results',
						fields: ['as', 'recordid','vgid', 'type'],
						baseParams: {
							async_call: 1,
							devision: 7,
							getstaffas: Ext.get('vgid').getValue()
						}
					},
					listeners: {
						afterrender: function() {
							this.store.reload();
						}
					},
                	columns: [{
                        header: Ext.app.Localize.get('Local AS'),
                        width: 500 
                	}, asDel]
                }
            }]
        }, // END Network tab
        // Telephony
        {
        	xtype: 'container',
        	title: Ext.app.Localize.get('Telephony'),
        	disabled: true,
        	layout: 'anchor',
        	itemId: 'telephony',
        	height: 750,
        	border: false,
        	defaults: {
        		anchor: '100% 50%'
        	},
            reload: function(params) {
                var params = params || {};
                Ext.each(this.findByType('grid'), function(item) {
                    if(item.getStore().getCount() == 0) {
                        Ext.apply(item.store.baseParams, this.params.params);
                        item.getStore().reload();
                    }
                }, {
                    params: params
                });
            },
        	items: [{
                xtype: 'grid',
                title: Ext.app.Localize.get('Phone numbers') + ' / ' + Ext.app.Localize.get('MTA'),
                loadMask: true,
                autoExpandColumn: 'tel-comm-col-exp',
                listeners: {
                    beforerender: function(grid) {
                        grid.setPagePanel();
                    }
                },
                plugins: [editTelStaff, delTelStaff],
                columns: [editTelStaff, {
                    header: Ext.app.Localize.get('Number'),
                    dataIndex: 'phonenumber',
                    width: 200
                },/* {
                    header: Ext.app.Localize.get('INT/TL'),
                    width: 80,
                    dataIndex: 'ldservice',
                    renderer: function(value) {
                        return value ? Ext.app.Localize.get('Yes') : Ext.app.Localize.get('None')
                    }
                },*/ {
                    header: Ext.app.Localize.get('Device'),
                    dataIndex: 'device',
                    renderer: function(value) {
                        switch(value) {
                            case 0: return Ext.app.Localize.get('Phone');
                            case 1: return Ext.app.Localize.get('MTA');
                            case 2: return Ext.app.Localize.get('Trunk');
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Since'),
                    dataIndex: 'timefrom',
                    width: 120,
                    renderer: function(value) {
                        return Ext.isDate(value) ? (value.format('Y') < 1900 ? '-' : value.format('d.m.Y H:i:s')) : '-';
                    }
                }, {
                    header: Ext.app.Localize.get('Till'),
                    dataIndex: 'timeto',
                    width: 120,
                    renderer: function(value) {
                        return Ext.isDate(value) ? (value.format('Y') < 1900 ? '-' : value.format('d.m.Y H:i:s')) : '-';
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'comment',
                    id: 'tel-comm-col-exp'
                }, delTelStaff],
                bbar: {
                    xtype: 'paging',
                    pageSize: 0,
                    displayInfo: true
                },
                store: {
                	xtype: 'jsonstore',
                    root: 'results',
                    totalProperty: 'total',
                	fields: ['recordid', 'vgid', 'device', 'ldservice', 'phonenumber', 'comment',
                        { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                        { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
                    ],
                	baseParams: {
                		async_call: 1,
                		devision: 7,
                		gettelstaff: 1
                	}
                }
        	}, {
        	    xtype: 'grid',
        	    title: Ext.app.Localize.get('Trunks'),
                loadMask: true,
                autoExpandColumn: 'tel-trunk-col-exp',
                listeners: {
                    beforerender: function(grid) {
                        grid.setPagePanel();
                    }
                },
                plugins: [editTrunkStaff, delTrunkStaff],
                columns: [editTrunkStaff, {
                    header: Ext.app.Localize.get('Number'),
                    dataIndex: 'phonenumber',
                    width: 200
                }, /*{
                    header: Ext.app.Localize.get('INT/TL'),
                    width: 80,
                    dataIndex: 'ldservice',
                    renderer: function(value) {
                        return value ? Ext.app.Localize.get('Yes') : Ext.app.Localize.get('None')
                    }
                },*/ {
                    header: Ext.app.Localize.get('Device'),
                    dataIndex: 'device',
                    renderer: function(value) {
                        switch(value) {
                            case 0: return Ext.app.Localize.get('Phone');
                            case 1: return Ext.app.Localize.get('MTA');
                            case 2: return Ext.app.Localize.get('Trunk');
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Since'),
                    dataIndex: 'timefrom',
                    width: 120,
                    renderer: function(value) {
                        return Ext.isDate(value) ? (value.format('Y') < 1900 ? '-' : value.format('d.m.Y H:s')) : '-';
                    }
                }, {
                    header: Ext.app.Localize.get('Till'),
                    dataIndex: 'timeto',
                    width: 120,
                    renderer: function(value) {
                        return Ext.isDate(value) ? (value.format('Y') < 1900 ? '-' : value.format('d.m.Y H:i')) : '-';
                    }
                }, {
                    header: Ext.app.Localize.get('Description'),
                    dataIndex: 'comment',
                    id: 'tel-trunk-col-exp'
                }, delTrunkStaff],
                bbar: {
                    xtype: 'paging',
                    pageSize: 0,
                    displayInfo: true
                },
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    totalProperty: 'total',
                    fields: ['recordid', 'vgid', 'device', 'ldservice', 'phonenumber', 'comment',
                        { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                        { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' }
                    ],
                    baseParams: {
                        async_call: 1,
                        devision: 7,
                        gettelstaff: 1,
                        trunk: 1
                    }
                }
        	}]
        }, // END Telephony tab
        // One-time services tab
        {
            xtype: 'grid',
            title: Ext.app.Localize.get('One-time-e') + ' ' + Ext.app.Localize.get('services'),
            loadMask: true,
            itemId: 'one-time-service',
            autoExpandColumn: 'on-time-col-exp',
            enableHdMenu: false,
            disabled: true,
            height: 750,
            PAGELIMIT: 100,
            listeners: {
                beforerender: function(grid) {
                    grid.setPagePanel();
                },
                activate: function(grid) {
					//grid.getStore().reload();
				}
            },
            plugins: [delOneTime],
            columns: [{
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'catdescr',
                id: 'on-time-col-exp',
                sortable: true
            }, {
                header: Ext.app.Localize.get('Instrument reading'),
                dataIndex: 'externaldata',
                width: 105,
                hidden: Ext.get('zkh_configuration') ? false : true
            }, {
                header: Ext.app.Localize.get('Quant.'),
                dataIndex: 'mul',
                width: 50
             }, {
                header: Ext.app.Localize.get('Price'),
                dataIndex: 'catabove',
                width: 65
             },{
				header: Ext.app.Localize.get('Discount'),
				dataIndex: 'rate',
				width: 70, 
				renderer: function(value, op, record) {
					var cost = record.get('catabove'),
						rate = record.get('rate'),
						disc = record.get('discount');
						
					if(disc == 0 && rate == 1) {
						return '<span style="color:#777;">---</span>';
					} else if(disc == 0 && rate != 1) {
						return Math.round((1 - rate)*100) + '%';
					} else {
						return disc + ' ' + record.get('symbol');
					}
				}
			}, {
                header: Ext.app.Localize.get('Total'),
                width: 55,
                renderer: function(value, metaData, record) {
					if(record.get('rate') == 1 && record.get('discount')>0) {
						return Math.ceil(record.get('mul') * record.get('catabove') * 10) / 10 - record.get('discount');
					} else if(record.get('discount') == 0) {
                        return Math.ceil(record.get('mul') * record.get('catabove') * record.get('rate') * 10) / 10;
                    }
                }
            }, {
                header: Ext.app.Localize.get('Date'),
                dataIndex: 'timefrom',
                width: 100,
                renderer: function(value){
                    return Ext.isDate(value) ? value.format('d.m.Y H:i') : '';
                },
                sortable: true
            }, {
                header: Ext.app.Localize.get('Comment'),
                dataIndex: 'comment',
                width: 100
            }, {
                header: Ext.app.Localize.get('Assigned by'),
                dataIndex: 'personid',
                sortable: true,
                width: 145,
                renderer: function(value, meta, record){
                    return value == 'null' ? record.get('username') : record.get('personname');
                }
            }, delOneTime],
            viewConfig: {
                // Return CSS class to apply to rows depending upon data values
                getRowClass: function(record, index) {
                	return record.get('needcalc') > 0 ? 'ext-row-red' : '';
                }
            },
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            store: {
            	xtype: 'jsonstore',
            	root: 'results',
                totalProperty: 'total',
                fields: [ 'servid', 'username', 'vglogin', 'agrmnumber', 'catidx', 'catdescr',
                    'catabove', 'personname', 'mul', 'personid', 'common', 'used', 'vgid', 'tarid',
                    'needcalc', 'externaldata', 'comment', 'rate', 
                    { name: 'disctimefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
					{ name: 'activated', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'disctimeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'accondate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
					{ name: 'discount', type: 'float' },
					{ name: 'symbol', type: 'string' }
                ],
            	baseParams: {
            		async_call: 1,
                    devision: 106,
                    getserv: 0,
                    vgid: 0
            	},
            	remoteSort: true,
        		sortInfo: {
        			field: 'servid',
        			direction: "ASC"
        		}
            }
        }, // END One-time services tab
        // Periodic tab
        {
            xtype: 'grid',
            title: Ext.app.Localize.get('Periodic-e') + ' ' + Ext.app.Localize.get('services'),
            loadMask: true,
            itemId: 'periodic-service',
            autoExpandColumn: 'periodic-col-exp',
            enableHdMenu: false,
            disabled: true,
            height: 750,
            PAGELIMIT: 100,
            listeners: {
                beforerender: function(grid) {
                    grid.setPagePanel();
                },
                activate: function(grid) {
					grid.getStore().reload();
				}
            },
            plugins: [editPeriodic, delPeriodic],
            columns: [editPeriodic, {
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'catdescr',
                id: 'periodic-col-exp',
                sortable: true
            }, {
                header: Ext.app.Localize.get('Date'),
                dataIndex: 'timefrom',
                sortable: true,
                width: 75,
                renderer: function(value){
                    return Ext.isDate(value) ? value.format('d.m.Y') : '';
                }
            }, {
                header: Ext.app.Localize.get('End of period'),
                dataIndex: 'timeto',
                sortable: true,
                width: 100,
                renderer: function(value){
                	return Ext.isDate(value) ? (value.format('Y') != 9999 ? value.format('d.m.Y') : '') : '';
                }
            }, {
                header: Ext.app.Localize.get('Quant.'),
                dataIndex: 'mul',
                width: 50
            }, {
                header: Ext.app.Localize.get('Price'),
                dataIndex: 'catabove',
                width: 65
            }, {
				header: Ext.app.Localize.get('Discount'),
				dataIndex: 'rate',
				width: 70, 
				renderer: function(value, op, record) {
					var cost = record.get('catabove'),
						rate = record.get('rate'),
						disc = record.get('discount');
					
					if(disc == 0 && rate == 1) {
						return '<span style="color:#777;">---</span>';
					} else if(disc == 0 && rate != 1) {
						return Math.round((1 - rate)*100) + '%';
					} else {
						return disc + ' ' + record.get('symbol');
					}
				}
			}, {
                header: Ext.app.Localize.get('Total'),
                width: 55,
                renderer: function(value, metaData, record) {
					if(record.get('rate') == 1 && record.get('discount')>0) {
						return Math.ceil(record.get('mul') * record.get('catabove') * 10) / 10 - record.get('discount');
					} else if(record.get('discount') == 0) {
                        return Math.ceil(record.get('mul') * record.get('catabove') * record.get('rate') * 10) / 10;
                    }
                }
            }, {
                header: Ext.app.Localize.get('Write-off'),
                dataIndex: 'common',
                width: 100,
                renderer: function(value){
                    switch (value) {
                        case 2: return Ext.app.Localize.get('daily');
                        case 3: return Ext.app.Localize.get('daily')+ ',<br/>' + Ext.app.Localize.get('equal parts');
                        default: return Ext.app.Localize.get('monthly');
                    }
                }
            }, {
                header: Ext.app.Localize.get('Assigned by'),
                dataIndex: 'personid',
                sortable: true,
                width: 145,
                renderer: function(value, meta, record){
                    return value == 'null' ? record.get('username') : record.get('personname');
                }
            }, {
                header: Ext.app.Localize.get('Comment'),
                dataIndex: 'comment',
                width: 100
            }, delPeriodic],
            viewConfig: {
                // Return CSS class to apply to rows depending upon data values
                getRowClass: function(record, index) {
                    return record.get('needcalc') > 0 ? 'ext-row-red' : '';
                }
            },
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            store: {
            	xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: [ 'servid', 'username', 'vglogin', 'agrmnumber', 'catidx', 'catdescr',
                    'catabove', 'personname', 'mul', 'personid', 'common', 'used', 'vgid', 'tarid',
                    'needcalc', 'externaldata', 'comment', 'rate', 'realrate',
                    { name: 'disctimefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
					  { name: 'activated', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'disctimeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'timeto', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                    { name: 'accondate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
					{ name: 'discount', type: 'float' },
					{ name: 'symbol', type: 'string' }
                ],
                baseParams: {
                    async_call: 1,
                    devision: 106,
                    getserv: 1,
                    vgid: Ext.get('vgid').getValue()
                },
                remoteSort: true,
                sortInfo: {
        			field: 'servid',
        			direction: "ASC"
        		}
            }
        }, // END Periodic tab
        { //  fields tab
            xtype: 'editorgrid',
            title: Ext.app.Localize.get('Group fields'),
            autoLoad: false,
            loadMask: true,
            id: 'group-editor-grid',
            itemId: 'additional-fields',
            autoExpandColumn: 'addit-fields-agent',
            disabled: true,
            height: 750,
            listeners: {
				afterrender: function(grid) {	
					this.store.baseParams = {};
					if(Ext.get('vgid').getValue() > 0) { vg = Ext.get('vgid').getValue(); }
					if(Ext.get('vgtpl').getValue() > 0) { vg = Ext.get('vgtpl').getValue(); }
					this.store.reload({ 
						params: {
							async_call: 1,
							devision: 7,
							getaddonsvalues: Ext.get('moduleid').getValue(),
							vgid:  vg
						}
					});			
				},
				rowclick: function (grid, index) {
					
					var cStore = grid.store.getAt(index);
					var vType = cStore.get('type');
					var cmb = new Ext.form.ComboBox({
						name: 'gen-combo-editor',
						valueField: 'value',						
						displayField: 'value',
						triggerAction: 'all',
						mode: 'local',
						editable: false,
						typeAhead: false,
						autoLoad: true,
						store: {
							xtype: 'jsonstore',
							fields: ['idx', 'name', 'value'],
							data: cStore.get('staff')
						},
						listeners: {
							select: function(e, rec) {
								var vals = this.store.getAt(this.selectedIndex);
								// Перегружаем store при выборе с новыми параметрами
								cStore.store.baseParams = {};
								cStore.store.reload({ 
									params: {
										async_call: 1,
										devision: 7,
										setaddonsvalues: Ext.get('vgid').getValue(),
										idx: vals.data['idx'],
										name: vals.data['name'],
										type: 1 
									}
								});
								this.setRawValue(vals.data['value']);
							}
						}		
					})
					
					var txt = new Ext.form.TextField({
						dataIndex: 'strvalue',
						listeners: {
							change: function() {
								cStore.store.baseParams = {};
								cStore.store.reload({ 
									params: {
										async_call: 1,
										devision: 7,
										setaddonsvalues: Ext.get('vgid').getValue(),
										strvalue: this.getValue(),
										name: cStore.data['name'],
										type: 0 
									}
								});
							}
						}
					});
					
					var checkbox = new Ext.form.Checkbox({
						dataIndex: 'strvalue',
						listeners: {
							change: function() {
								cStore.store.baseParams = {};
								cStore.store.reload({ 
									params: {
										async_call: 1,
										devision: 7,
										setaddonsvalues: Ext.get('vgid').getValue(),
										strvalue: this.getValue(),
										name: cStore.data['name'],
										type: 2
									}
								});
							}
						}
					});
					
					var bools = new Ext.form.ComboBox({
						name: 'gen-bool-editor',
						valueField: 'value',						
						displayField: 'name',
						triggerAction: 'all',
						mode: 'local',
						autoLoad: true,
						editable: false,
						typeAhead: false,
						value: 0,
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name', 'value'],
							data: [
								[0, Ext.app.Localize.get("no"), 'false'], 
								[1, Ext.app.Localize.get("yes"), 'true']
							]
						}, 
						listeners: {
							select: function(cmd, record, index) {
								var vals = this.store.getAt(this.selectedIndex);
								this.setRawValue(vals.data['name']);
							},
							change: function() {
								cStore.store.baseParams = {};
								cStore.store.reload({ 
									params: {
										async_call: 1,
										devision: 7,
										setaddonsvalues: Ext.get('vgid').getValue(),
										strvalue: this.getValue(),
										name: cStore.data['name'],
										type: 2
									}
								});
							}
						}
					});
					

					if(vType && vType == 1) {
						grid.getColumnModel().setEditor(1, cmb);
						// Параметры для значения Undefined
						cmb.store.insert(0, new cmb.store.recordType({
                            idx: -1,
                            name: cStore.data['name'],
                            value: Ext.app.Localize.get('Undefined')
						}));
					} else if(vType == 0){
						grid.getColumnModel().setEditor(1, txt);
					} else {
						grid.getColumnModel().setEditor(1, bools);
					}}
			},
            columns: [{
                header: Ext.app.Localize.get('Description'),
                dataIndex: 'descr',
                id: 'addit-fields-agent',
                width: 200,
                sortable: false
            }, {
                header: Ext.app.Localize.get('Value'),
                width: 300,
                id: 'edit-column',
                itemId: 'edit-column',
                name: 'edit-column',
                dataIndex: 'strvalue',
                renderer: function(v){
                    if (v == 'false') {
                        return Ext.app.Localize.get('no')
                    }
                    else if (v == 'true'){
                        return Ext.app.Localize.get('yes')
                	}
                	else return v;
                }
                
			}],
            store: {
            	xtype: 'jsonstore',
                root: 'results',
                fields: ['type', 'agentid', 'name', 'descr', 'idx', 'strvalue', 'staff'],
                baseParams: {
                    async_call: 1,
                    devision: 7,
                    getaddonsvalues: 0,
                    vgid: Ext.get('vgid').getValue() || Ext.get('vgtpl').getValue()
                }
            }		
        }] // END Additional fields tab
    });
} // showVgroupPanel()


/**
 * Get tarif setting to
 */
function getTarifPlan( config )
{
	var config = config || {};
	
	// Check id filter exists
	config.filter = config.filter || {};
	
	if(!config.callback) {
		config.callback = Ext.emptyFn;
	}
	
	if(!Ext.isObject(config.edit)) {
		config.edit = null;
	}
	
	var catSel = new Ext.grid.RowButton({
        header: '',
        qtip: Ext.app.Localize.get('Add'),
        width: 26,
        iconCls: 'ext-add'       
    });
    
    catSel.on('action', function(grid, record) {
        var mGrid = grid.ownerCt.get(0),
            mStore = mGrid.getStore();
        
	    grid.ownerCt.getLayout().setActiveItem(0);

        if(-1 == mStore.find('catidx', record.data.catidx)){
	        mStore.add(new mStore.recordType(Ext.copyTo({
	        	catidx: null, 
	        	catdescr: null,
	        	type: 0, 
	        	value: 0,
	        	includes: 0
	        }, record.data, 'catidx,catdescr')));
        }
    });
	
    var catRm = new Ext.grid.RowButton({
        header: '',
        qtip: Ext.app.Localize.get('Remove'),
        width: 26,
        iconCls: 'ext-drop'       
    });
    
    catRm.on('action', function(grid, record) {
        record.store.remove(record);
    });
    
    var discountValueEditor = new Ext.form.NumberField({
        getMaxValueAccordingDiscountType: function(type) {
            return type ? 100 : Number.MAX_VALUE;
        }
    });
	new Ext.Window({
        layout: 'fit',
        modal: true,
        width: 700,
        title: Ext.app.Localize.get('Scheduling'),
        listeners: {
        	afterrender: function(win) {
        		if(this.edit && this.tardisc) {
        			win.getTopToolbar().get('multitar').toggle(true);
        		}
        	}.createDelegate(config)
        },
        getCatModif: function() {
        	var grid = this.get('zone-disc').get(0),
                params = {};
            
            if(grid.isVisible() && grid.getStore().getCount()) {
                grid.getStore().each(function(record, idx){
                    this["catdisc[" + idx + "][catidx]"] = record.get('catidx');
                    this["catdisc[" + idx + "][type]"] = record.get('type');
                    this["catdisc[" + idx + "][value]"] = record.get('value');
                    this["catdisc[" + idx + "][includes]"] = record.get('includes');
                }, params);
            }
            
            return params;
        },
        tbar: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Apply'),
            itemId: 'apply',
            iconCls: 'ext-save-doc',
            disabled: true,
            handler: function(Btn) {
            	var win = Btn.findParentByType('window'),
            	    form = win.get('tar-form').getForm(), 
                    values = form.getValues(),
                    tar = form.findField('tarid');
                
                if(!form.isValid()) {
                    return false;
                }
                
                var intRegex = /^\d+$/;
                if(false === intRegex.test(values.tarid)){
                	Ext.Msg.error(Ext.app.Localize.get('Uncorrent tariff value'));
                	return;
                }
                
                if(this.directSave) {
                	if(form.isValid()) {
                		var params = win.getCatModif();
                		
                		var submitCfg = {
                			url: 'config.php',
                            waitTitle: Ext.app.Localize.get('Connecting'),
                            waitMsg: Ext.app.Localize.get('Sending data') + '...',
                            scope: {
                                config: this,
                                submitCfg: null,
                                win: Btn.findParentByType('window'),
                                localize: function(msg) {
                                    return Ext.app.Localize.get(msg.replace(/ \([^()]*\)/, ''));
                                }
                            },
                            params: Ext.apply(Ext.apply({
                                async_call: 1,
                                devision: 7,
                                settarrasp: 1
                            }, Ext.isObject(this.directSave) ? this.directSave : {}), params),
                            success: function(form, action) {
                                try {
                                    this.config.callback(form);
                                    this.win.close();
                                }
                                catch(e) {
                                    Ext.Msg.error(Ext.app.Localize.get(e))
                                }
                            },
                            failure: function(form, action) {
                            	try {
                            		if(action.result.override) {
                            			Ext.Msg.confirm(Ext.app.Localize.get('Warning'), this.localize(action.result.error), function(B){
                                            if (B != 'yes') {
                                                return;
                                            }
                                            
                                            Ext.apply(this.submitCfg.params, {
                                                override: 1
                                            });
                                            
                                            form.submit(this.submitCfg);
                            			}, this);
                            		}
                            		else {
                            			throw(action.result.error);
                            		}
                            	}
                            	catch(e) {
                                    Ext.Msg.error(this.localize(e));
                            	}
                            }
                		};
                		submitCfg.scope.submitCfg = submitCfg;
                		
                		form.submit(submitCfg);
                	}
                }
                else {
                	Ext.getCmp('tar-show-btn').enable();
                	
                    this.callback(form, {
                        modifires: win.getCatModif()
                    });
                    Btn.findParentByType('window').close();
                }
            }.createDelegate(config)
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            itemId: 'multitar',
            hidden: config.telphony == true ? false : true,
            enableToggle: true,
            text: Ext.app.Localize.get('Multitarif'),
            toggleHandler: function(Btn, state) {
            	var win = Btn.findParentByType('window'),
            	    form = win.get('tar-form');
            	form.get('oper-combo').setContainerVisible(state);
            	form.get('date-till').setContainerVisible(state);
            	form.doLayout();
            	win.syncShadow();
            	
            	if(state) {
            		form.getForm().setValues({
            			tarid: null,
            			ismulti: 1
            		});
            		form.getForm().findField('tarid').lastQuery = null;
            	}
            	else {
            		form.getForm().setValues({
                        operid: null,
                        ismulti: 0,
                        tarid: null
            		});
            		form.get('tarif-set').get('tar-btn').enable();
            		form.get('tarif-set').get('tar-combo').enable();
            		form.getForm().findField('tarid').lastQuery = null;
            	}
            }
        }],
        items: [{
            xtype: 'form',
            frame: true,
            url: 'config.php',
            autoHeight: true,
            itemId: 'tar-form',
            monitorValid: true,
            defaults: {
            	anchor: '100%',
            	xtype: 'container'
            },
            items: [{
                xtype: 'hidden',
                name: 'recordid',
                value: 0
            }, {
                xtype: 'hidden',
                name: 'ismulti',
                value: 0
            }, {
            	xtype: 'combo',
            	itemId: 'oper-combo',
                fieldLabel: Ext.app.Localize.get('Operator'),
                hidden: true,
                hiddenName: 'operid',
                valueField: 'id',
                displayField: 'descr',
                triggerAction: 'all',
                mode: 'remote',
                editable: false,
                readOnly: config.edit ? true : false,
                listeners: {
                	beforeselect: function(combo, record) {
                		if(combo.getValue() != record.get('uid')) {
                            var tar = combo.ownerCt.get('tarif-set').get('tar-combo');
                            tar.getStore().setBaseParam('operid', record.get('uid')).removeAll();
                            tar.setValue(null);
                            tar.lastQuery = null;
                		}
                    },
                    beforerender: function(combo) {
                    	combo.validator = function() {
                    		if(!this.multitar.hidden && !this.combo.readOnly && this.multitar.pressed) {
                                this.tarset.get('tar-btn')[this.combo.getValue() ? 'enable' : 'disable']();
                                this.tarset.get('tar-combo')[this.combo.getValue() ? 'enable' : 'disable']();
                    		}
                    	}.createDelegate({
                    		combo: combo,
                            tarset: combo.ownerCt.get('tarif-set'),
                            multitar: combo.findParentByType('window').getTopToolbar().get('multitar') 
                    	})
                    },
                	render: function(el) {
                        el.setContainerVisible(el.hidden ? false : true)
                    }
                },
                store: {
                	xtype: 'jsonstore',
                	root: 'results',
                	fields: ['id','descr'],
                	baseParams: {
                		async_call: 1,
                		devision: 22,
                		getoperlist: 1
                	}
                }
            }, {
                fieldLabel: Ext.app.Localize.get('Tarif'),
                itemId: 'tarif-set',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    iconCls: 'ext-tariff',
                    itemId: 'tar-btn',
                    id: 'tar-btn',
                    disabled: config.edit ? true : false,
                    handler: function(Btn) {
						
						var win = Btn.findParentByType('window'),
						opid = win.get('tar-form').get('oper-combo').getValue();
							
						var module = Ext.getCmp('vg-form').getForm().findField('agenttype').getValue();
							
						if(opid && opid != '') {
							config.filter.operid = opid;
							config.filter.common = 1;
						}
						else{
							config.filter.operid = null;
							config.filter.common = 0;
						}
						
						if(Ext.get('_templ_').getValue() == 1) {
							var dis = false;
						}

						if(!Ext.isEmpty(module)) {
							if(module > 0 && module < 6) moduletype = 0;
							if(module == 6) moduletype = 1;
							if(module > 6 && module < 12) moduletype = 3;
							if(module > 11 && module < 13) moduletype = 4;
							if(module == 13) moduletype = 5;
						}						
                    	getTarifGridWindow({
                            grid: {
                            	toolbar: {
                            		tartype: {
                            			disabled: true
                            		}
                            	},
                                filter: Ext.apply(config.filter, { unavail : 0 }),
								moduletype: moduletype
                    	    },
                    	    win: {
                    	    	callback: function(grid) {
                                    var record = grid.getSelectionModel().getSelected();
                                    if(record) {
                                    	if(!this.findRecord('tarid', record.get('tarid'))) {
                                    		this.store.add(new this.store.recordType(record.data));
                                    	}
                                    	this.setValue(record.get('tarid'));
                                    	
                                    	if(config.discounts) {
											Btn.findParentByType('window').get('zone-disc').getLayout().setActiveItem(0);
											Btn.findParentByType('window').get('zone-disc').get(0).getStore().removeAll();
										}
                                    }
                                }.createDelegate(Btn.findParentByType('form').getForm().findField('tarid'))
                    	    }
                    	});
                    }
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    disabled: config.multiTarif ? true : false,
                    itemId: 'tar-combo',
                    hiddenName: 'tarid',
                    valueField: 'tarid',
                    displayField: 'descr',
                    hiddenName: 'tarid',
                    mode: 'remote',
                    hideTrigger: true,
                    triggerAction: 'query',
                    queryParam: 'tarname',
                    lastQuery: '',
                    allowBlank: false,
                    readOnly: config.edit ? true : false,
                    validator: function(value) {
                    	var catDisc = this.findParentByType('window').get('zone-disc');
                    	
                    	this.findParentByType('window').getTopToolbar().get('apply')[this.getValue() ? 'enable' : 'disable']();
                    	
                    	if(catDisc.isVisible()) {
                    	   catDisc.get(0).getTopToolbar().get('cat-sel')[this.getValue() && this.findParentByType('form').getForm().getValues().ismulti == 0 ? 'enable' : 'disable']();
                    	}
                    	
                        if(!this.getValue()) {
                        	if(catDisc.isVisible() && catDisc.getLayout().activeItem > 0) {
                        		catDisc.getLayout().setActiveItem(0);
                        	}
                            return false;
                        }
                    },
                    store: {
                    	xtype: 'jsonstore',
                    	root: 'results',
                    	fields: ['tarid', 'descr', 'rent', 'dailyrent', 'actblock', 'symbol'],
                    	baseParams: Ext.apply({
                    		async_call: 1,
                            devision: 4,
                            unavail : 0,
                            gettariffs: 1,
                            limit: 10
                    	}, config.filter || {})
                    },
                    flex: 1
                }]
            }, {
                fieldLabel: Ext.app.Localize.get('Date') + ' (' + Ext.app.Localize.get('Since') + ')',
                layout: 'hbox',
                items: [{
                    xtype: 'datefield',
                    allowBlank: false,
                    name: 'tardate',
                    value: new Date(),
                    width: 100
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    name: 'tartimehour',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    value: 0,
                    listeners: {
                    	beforerender: function(combo) {
                    		var data = [];
                    		for(var i = 0; i < 24; i++) {
                        		data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                    	}
                    },
                    store: {
                    	xtype: 'arraystore',
                    	fields: ['id']
                    }
                }, {
                    xtype: 'tbtext',
                    text: ':',
                    style: 'padding: 4 0 0 1',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    name: 'tartimemin',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    value: 0,
                    listeners: {
                        beforerender: function(combo) {
                        	var data = [];
                            for(var i = 0; i < 60; i++) {
                                data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                        }
                    },
                    store: {
                        xtype: 'arraystore',
                        fields: ['id'],
                        data: []
                    }
                }]
            }, {
                fieldLabel: Ext.app.Localize.get('Date') + ' (' + Ext.app.Localize.get('Till') + ')',
                itemId: 'date-till',
                hidden: true,
                layout: 'hbox',
                listeners: {
                	render: function(el) {
                		el.setContainerVisible(el.hidden ? false : true)
                	}
                },
                items: [{
                    xtype: 'datefield',
                    name: 'datetill',
                    width: 100
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    name: 'timehourtill',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    listeners: {
                        beforerender: function(combo) {
                            var data = [];
                            for(var i = 0; i < 24; i++) {
                                data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                        }
                    },
                    store: {
                        xtype: 'arraystore',
                        fields: ['id']
                    }
                }, {
                    xtype: 'tbtext',
                    text: ':',
                    style: 'padding: 4 0 0 1',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    name: 'timemintill',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    listeners: {
                        beforerender: function(combo) {
                            var data = [];
                            for(var i = 0; i < 60; i++) {
                                data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                        }
                    },
                    store: {
                        xtype: 'arraystore',
                        fields: ['id'],
                        data: []
                    }
                }]
            }, {
                xtype: 'numberfield',
                fieldLabel: Ext.app.Localize.get('Coefficient'),
                name: 'tardisc',
                anchor: '50%',
                value: 1,
                readOnly: config.disCoef,
                allowDecimal: false,
                decimalPrecision: 5
            }]
        }, {
        	xtype: 'container',
        	layout: 'card',
        	itemId: 'zone-disc',
        	activeItem: 0,
        	hidden: config.discounts ? false : true,
        	items: [{
                xtype: 'editorgrid',
                height: 400,
                enableHdMenu: false,
                disableSelection: true,
                autoExpandColumn: 'tar-cat-signed-col-exp',
                clicksToEdit: 1,
                listeners: {
                    beforeedit: function(e) {
                        discountValueEditor.setMaxValue(discountValueEditor.getMaxValueAccordingDiscountType(e.record.get('type')));
                    },
                    afteredit: function(e) {
                        var maxValue = discountValueEditor.getMaxValueAccordingDiscountType(e.record.get('type'));
                        if (e.record.get('value') > maxValue) {
                            e.record.set('value', maxValue);
                        }
                    }
                },
                tbar: [{
                    xtype: 'button',
                    itemId: 'cat-sel',
                    iconCls: 'ext-add',
                    text: Ext.app.Localize.get('Choose category'),
                    disabled: true,
                    handler: function(Btn) {
                    	var form = Btn.findParentByType('window').get('tar-form').getForm(),
                    	    grid = Btn.findParentByType('editorgrid').ownerCt.get(1);
                    	
                        Btn.findParentByType('container').getLayout().setActiveItem(1);
                        if(grid.getStore().getCount() == 0 || grid.getStore().baseParams.tarid != form.getValues().tarid) {
                        	grid.getStore().setBaseParam('tarid', form.getValues().tarid).reload({
                                params: {
                                	start: 0
                                }
                        	});
                        }
                    }
                }],
                plugins: [catRm],
                columns: [{
                    header: Ext.app.Localize.get('ID'),
                    dataIndex: 'catidx',
                    width: 20
                }, {
                    header: Ext.app.Localize.get('Description'),
                    id: 'tar-cat-signed-col-exp',
                    dataIndex: 'catdescr'
                }, {
                    header: Ext.app.Localize.get('Type'),
                    dataIndex: 'type',
                    width: 80,
                    renderer: function(value) {
                    	return value ? '%' : Ext.app.Localize.get('Absolute');
                    },
                    editor: {
                        xtype: 'combo',
                        valueField: 'id',
                        displayField: 'name',
                        editable: false,
                        mode: 'local',
                        triggerAction: 'all',
                        store: {
                        	xtype: 'arraystore',
                        	fields: ['id','name'],
                        	data: [[0, Ext.app.Localize.get('Absolute')], [1, '%']]
                        }
                    }
                }, {
                    header: Ext.app.Localize.get('Value'),
                    dataIndex: 'value',
                    width: 50,
                    editor: discountValueEditor
                }, {
                    header: Ext.app.Localize.get('Include') + ' (' + Ext.app.Localize.get('min') + ' / ' + Ext.app.Localize.get('Mb') + ')',
                    dataIndex: 'includes',
                    width: 100,
                    editor: {
                    	xtype: 'numberfield',
                        allowDecimals: false
                    }
                }, catRm],
                store: {
                	xtype: 'jsonstore',
                	root: 'results',
                	fields: ['catidx', 'catdescr', 'type', 'value', 'includes']
                }
        	}, {
                xtype: 'grid',
                height: 400,
                enableHdMenu: false,
                disableSelection: true,
                loadMask: true,
                autoExpandColumn: 'tar-cat-free-col-exp',
                PAGELIMIT: 100,
                listeners: {
                    beforerender: function(grid) {
                        grid.setPagePanel();
                        // Synchronize filter with store
                        grid.getStore().syncStore = function() {
                            this.getTopToolbar().syncToolStore();
                            return this.getStore().baseParams;
                        }.createDelegate(grid);
                    }
                },
                tbar: [{
                    xtype: 'button',
                    text: Ext.app.Localize.get('Go back to list'),
                    handler: function(Btn) {
                        Btn.findParentByType('container').getLayout().setActiveItem(0);
                    }
                }, {
                	xtype: 'tbseparator',
                	width: 5
                }, {
                    xtype: 'textfield',
                    name: 'search'
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    iconCls: 'ext-search',
                    text: Ext.app.Localize.get('Show'),
                    handler: function(Btn) {
                    	Btn.findParentByType('grid').getStore().reload({
                            params: {
                            	start: 0
                            }
                    	});
                    }
                }],
                bbar: {
                	xtype: 'paging',
                    pageSize: 0,
                    displayInfo: true
                },
                plugins: [catSel],
                columns: [catSel, {
                    header: Ext.app.Localize.get('Category'),
                    id: 'tar-cat-free-col-exp',
                    dataIndex: 'catdescr'
                }],
                store: {
                	xtype: 'jsonstore',
                	root: 'results',
                	fields: ['catidx','catdescr'],
                	baseParams: {
                		async_call: 1,
                		devision: 7,
                        getvgservices: null,
                        tarid: null
                	}
                }
        	}]
        }]
    }).show(null, function(win) {
        if(this.edit) {
            var form = win.get('tar-form').getForm(),
                tarcombo = form.findField('tarid');
            
            if(!tarcombo.findRecord('tarid', this.edit.tarid)) {
                tarcombo.store.add(new tarcombo.store.recordType({
                    tarid: this.edit.tarid,
                    descr: this.edit.tarname
                }));
            }
            
            form.setValues(this.edit);
        }
    }, config);
} // end getTarifPlan()


/**
 * Form panel to set block event for vgroup
 * @param   object, config
 */
function setVgBlock( config )
{
	var config = config || {};
    
    // Check id filter exists
    config.filter = config.filter || {};
    
    if(!config.callback) {
        config.callback = Ext.emptyFn;
    }
    
    new Ext.Window({
        layout: 'fit',
        modal: true,
        width: 400,
        title: Ext.app.Localize.get('Scheduling'),
        tbar: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Save'),
            itemId: 'apply',
            iconCls: 'ext-save',
            disabled: true,
            handler: function(Btn) {
            	var win = Btn.findParentByType('window'),
            	    form = win.get(0).getForm();
            	
            	form.submit({
                    url: 'config.php',
                    waitTitle: Ext.app.Localize.get('Connecting'),
                    waitMsg: Ext.app.Localize.get('Sending data') + '...',
                    scope: {
                    	config: this,
                    	win: win,
                    	form: form
                    },
                    params: Ext.apply({
                    	async_call: 1,
                    	devision: 7,
                    	setvgblock: 1
                    }, this.filter || {}),
                    success: function(form, action) {
                    	try {
                    		this.config.callback(this.form);
                    		this.win.close();
                    	}
                    	catch(e) {
                    		Ext.Msg.error(e);
                    	}
                    },
                    failure: function(form, action) {
                    	Ext.Msg.error(action.result.error);
                    }
            	});
            }.createDelegate(config)
        }],
        items: {
        	xtype: 'form',
        	autoHeight: true,
        	frame: true,
        	width: 350,
        	monitorValid: true,
        	url: 'config.php',
        	defaults: {
        		anchor: '100%'
        	},
        	listeners: {
        		beforerender: function(form) {
        			form.on('clientvalidation', function(form, state){
                        this[state ? 'enable' : 'disable']();
        			}, form.findParentByType('window').getTopToolbar().get('apply'));
        		}
        	},
        	items: [{
                xtype: 'container',
                fieldLabel: Ext.app.Localize.get('Date'),
                layout: 'hbox',
                items: [{
                    xtype: 'datefield',
                    name: 'blockdate',
                    value: new Date(),
                    allowBlank: false
                }, {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    hiddenName: 'timehour',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    value: 0,
                    listeners: {
                        beforerender: function(combo) {
                            var data = [];
                            for(var i = 0; i < 24; i++) {
                                data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                        }
                    },
                    store: {
                        xtype: 'arraystore',
                        fields: ['id']
                    }
                }, {
                    xtype: 'tbtext',
                    text: ':',
                    style: 'padding: 4 0 0 1',
                    width: 5
                }, {
                    xtype: 'combo',
                    width: 35,
                    hiddenName: 'timemin',
                    triggerAction: 'all',
                    hideTrigger: true,
                    mode: 'local',
                    valueField: 'id',
                    displayField: 'id',
                    editable: false,
                    value: 0,
                    listeners: {
                        beforerender: function(combo) {
                            var data = [];
                            for(var i = 0; i < 60; i++) {
                                data.push([i < 10 ? '0' + i : i]);
                            }
                            combo.getStore().loadData(data);
                        }
                    },
                    store: {
                        xtype: 'arraystore',
                        fields: ['id']
                    }
                }]
        	}, {
        		xtype: 'combo',
        		fieldLabel: Ext.app.Localize.get('Lock type'),
                mode: 'local',
                editable: false,
                triggerAction: 'all',
                valueField: 'id',
                displayField: 'name',
                hiddenName: 'blkreq',
                allowBlank: false,
                value: 0,
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [
                        [0, Ext.app.Localize.get('Turn on account entry')],
                        [3, Ext.app.Localize.get('Administrative')],
                        [10, Ext.app.Localize.get('Turn off account entry')]
                    ]
                }
        	}]
        }
    }).show();
} // end setVgBlock


/**
 * Set new telephony property
 * 
 */
function setTelItem( config )
{
	var config = config || {};
    
    // Check id filter exists
    config.filter = config.filter || {};
    
    if(!config.callback) {
        config.callback = Ext.emptyFn;
    }
    
	new Ext.Window({
        title: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('number'),
        width: 450,
        layout: 'fit',
        modal: true,
        tbar: [{
            xtype: 'button',
            text: Ext.app.Localize.get('Save'),
            itemId: 'apply',
            iconCls: 'ext-save',
            disabled: true,
            handler: function(Btn) {
                var form = Btn.findParentByType('window').get('tel-form').getForm();

                if(form.isValid()) {
                    form.submit({
                        method: 'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        params: Ext.apply({
                            async_call: 1,
                            devision: 7,
                            settelstaff: 1
                        }, this.filter || {}),
                        scope: {
                            config: this,
                            win: Btn.findParentByType('window')
                        },
                        success: function(form, action) {
                            try {
                                if(this.config.callback) {
                                    this.config.callback(form);
                                }

                                this.win.close();
                            }
                            catch (e) {
                                Ext.Msg.error(e);
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.error(action.result.error);
                        }
                    });
                }
            }.createDelegate(config)
        }],
        items: [{
            xtype: 'form',
            url: 'config.php',
            width: 380,
            fieldLabel: 135,
            frame: true,
            autoHeight: true,
            monitorValid: true,
            itemId: 'tel-form',
            defaults: {
            	anchor: '100%'
            },
            listeners: {
                beforerender: function(form) {
                    form.on('clientvalidation', function(form, state){
                        this[state ? 'enable' : 'disable']();
                    }, form.findParentByType('window').getTopToolbar().get('apply'));
                },
                render: function(panel) {
                    if(this.formData) {
                        if(Ext.isDate(this.formData.timefrom) && this.formData.timefrom.format('Y') < 1900) {
                            this.formData.timefrom = null;
                        }
                        if(Ext.isDate(this.formData.timeto) && this.formData.timeto.format('Y') < 1900) {
                            this.formData.timeto = null;
                        }
                        panel.getForm().setValues(Ext.apply({
                            timefrom_hh: this.formData.timefrom ? this.formData.timefrom.format('H') : null,
                            timefrom_mm: this.formData.timefrom ? this.formData.timefrom.format('i') : null,
                            timefrom_ss: this.formData.timefrom ? this.formData.timefrom.format('s') : null,
                            timeto_hh: this.formData.timeto ? this.formData.timeto.format('H') : null,
                            timeto_mm: this.formData.timeto ? this.formData.timeto.format('i') : null,
                            timeto_ss: this.formData.timeto ? this.formData.timeto.format('s') : null
                        }, this.formData))
                    }
                }.createDelegate(config)
            },
            items: [{
                xtype: 'hidden',
                name: 'recordid',
                value: 0
            }, {
            	xtype: 'checkbox',
            	fieldLabel: Ext.app.Localize.get('Check duplicates on save'),
            	inputValue: 1,
            	checked: true,
            	name: 'nodupl'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Indication'),
                name: 'phonenumber',
                allowBlank: false
            }, {
                xtype: 'combo',
                displayField: 'name',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                allowBlank: false,
                hiddenName: 'device',
                store: {
                	xtype: 'arraystore',
                    data: [
                        ['0', Ext.app.Localize.get('Phone')], 
                        ['1', Ext.app.Localize.get('MTA')], 
                        ['2', Ext.app.Localize.get('Trunk')]
                    ],
                    fields: ['id', 'name']
                },
                fieldLabel: Ext.app.Localize.get('Device')
            }, {
                xtype: 'checkbox',
                inputValue: 1,
                //fieldLabel: Ext.app.Localize.get('Access') + ' ' + Ext.app.Localize.get('INT/TL'),
                name: 'ldservice',
                hidden: true
            }, {
            	xtype: 'container',
            	fieldLabel: Ext.app.Localize.get('Since'),
            	layout: 'hbox',
            	items: [{
                    xtype: 'datefield',
                    anchor: '60%',
                    name: 'timefrom'
            	}, {
            	   xtype: 'tbspacer',
            	   width: 5
            	}, {
            	   xtype: 'numberfield',
            	   maxValue: 23,
            	   minValue: 0,
            	   width: 40,
            	   allowDecomals: false,
            	   name: 'timefrom_hh'
            	}, {
            	   xtype: 'tbtext',
            	   style: 'padding:3px 0 0 1px;',
            	   text: ':',
            	   width: 5
            	}, {
            	   xtype: 'numberfield',
                   maxValue: 59,
                   minValue: 0,
                   width: 40,
                   allowDecomals: false,
                   name: 'timefrom_mm'
            	}, {
            	   xtype: 'tbtext',
            	   style: 'padding:3px 0 0 1px;',
            	   text: ':',
            	   width: 5
            	}, {
            	   xtype: 'numberfield',
                   maxValue: 59,
                   minValue: 0,
                   width: 40,
                   allowDecomals: false,
                   name: 'timefrom_ss'
            	}]
            }, {
            	xtype: 'container',
            	layout: 'hbox',
            	fieldLabel: Ext.app.Localize.get('Till'),
            	items: [{
                    xtype: 'datefield',
                    anchor: '60%',
                    name: 'timeto'
            	}, {
                   xtype: 'tbspacer',
                   width: 5
                }, {
                   xtype: 'numberfield',
                   maxValue: 23,
                   minValue: 0,
                   width: 40,
                   allowDecomals: false,
                   name: 'timeto_hh'
                }, {
                   xtype: 'tbtext',
                   style: 'padding:3px 0 0 1px;',
                   text: ':',
                   width: 5
                }, {
                   xtype: 'numberfield',
                   maxValue: 59,
                   minValue: 0,
                   width: 40,
                   allowDecomals: false,
                   name: 'timeto_mm'
                }, {
                   xtype: 'tbtext',
                   style: 'padding:3px 0 0 1px;',
                   text: ':',
                   width: 5
                }, {
                   xtype: 'numberfield',
                   maxValue: 59,
                   minValue: 0,
                   width: 40,
                   allowDecomals: false,
                   name: 'timeto_ss'
                }]
            }, {
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Description'),
                name: 'comment'
            }]
        }]
    }).show();
} // end setTelItem()

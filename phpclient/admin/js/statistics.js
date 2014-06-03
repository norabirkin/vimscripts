/**
 * JavaScript engine for the system statistics
 *
 * Repository information:
 * @date		$Date: 2014-05-07 14:31:19 +0400 (Ср., 07 мая 2014) $
 * @revision	$Revision: 42962 $
 */

Ext.onReady(function(){
	Ext.QuickTips.init();
	// Show stat panel
	showStatPanel('StatPanelPlace');
});


/**
 * Global function to build and render to document parent panel
 * Filter setup
 * 		x0 - module type to setup correct active tab
 * 		x1 - module id
 * 		x2 - date from
 * 		x3 - date till
 * 		x4 - search type
 * 		x5 - search field value
 * @param {Object} renderTo
 */
function showStatPanel(renderTo)
{
	// View Cookie name
	var COOKIE = 'node104';
	// Let it be global define for the page limit
	var PAGELIMIT = 100;
	// Global variable to customize common grids height
	var GRIDHEIGHT= 700;
	
	
	if(!Ext.app.DefaultView.exists(COOKIE)) var COOKIE = 'nodeTmp';
	// Common storage
	// ATTANTION!! Do not set direct parameter autoLoad. There are actions that are depended
	// on already loaded modules. autoLoad value will cause them first
	var Store = new Ext.data.Store({
	    proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST',
			timeout: 580000
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			// Common fields for all data
			{ name: 'dt', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'vg_id', type: 'int' },
			{ name: 'vg_login', type: 'string' },
			{ name: 'agrm_id', type: 'int' },
			{ name: 'agrm_num', type: 'string' },
			{ name: 'user_name', type: 'string' },
			{ name: 'tar_id', type: 'int' },
			{ name: 'tar_descr', type: 'string' },
			{ name: 'tar_type', type: 'int' },
			{ name: 'cat_idx', type: 'int' },
			{ name: 'cat_descr', type: 'string' },
			{ name: 'agent_id', type: 'int' },
			{ name: 'agent_descr', type: 'string' },
			{ name: 'agent_type', type: 'int' },
			{ name: 'amount', type: 'float' },
			{ name: 'amount_in', type: 'float' },
			{ name: 'amount_out', type: 'float' },
			{ name: 'curr_symbol', type: 'string' },
			{ name: 'curr_id', type: 'int' },
			{ name: 'oper_id', type: 'int' },
			{ name: 'oper_descr', type: 'string' },

			// Phone data only
			{ name: 'timefrom', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'duration', type: 'int' },
			{ name: 'duration_in', type: 'int' },
			{ name: 'duration_out', type: 'int' },
			{ name: 'duration_round', type: 'int' },
			{ name: 'duration_round_in', type: 'int' },
			{ name: 'duration_round_out', type: 'int' },
			{ name: 'direction', type: 'int' },
			{ name: 'cnt_in', type: 'int' },
			{ name: 'cnt_out', type: 'int' },
			{ name: 'cnt', type: 'int' },
			{ name: 'numfrom', type: 'string' },
			{ name: 'numto', type: 'string' },
			{ name: 'trunk_in', type: 'string' },
			{ name: 'trunk_out', type: 'string' },
			{ name: 'cause', type: 'int' },
			{ name: 'class', type: 'string'},
			{ name: 'c_date', type: 'date', dateFormat: 'Y-m-d'},

			// Ethernet traffic only data
			{ name: 'src_ip', type: 'string' },
			{ name: 'dst_ip', type: 'string' },
			{ name: 'dst_port', type: 'int' },
			{ name: 'dst_proto', type: 'string' },
			{ name: 'volume', type: 'float' },
			{ name: 'volume_in', type: 'float' },
			{ name: 'volume_out', type: 'float' },
			{ name: 'ani', type: 'string' },
			{ name: 'dnis', type: 'string' },
			{ name: 'nas', type: 'string' },
			// Specific Radius data
			{ name: 'ip', type: 'string' },

			// Specific for USBox
			{ name: 'period', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'external_data', type: 'string' }

		]),
		setBaseParam : function (name, value, remove){
			this.baseParams = this.baseParams || {};
			this.baseParams[name] = value;

			if(Ext.isDefined(remove)) {
				var params = {};

				if(!Ext.isArray(remove)) {
					var remove = [remove];
				}

				if (remove.length > 0) {
					for (var i in this.baseParams) {
						if (remove.indexOf(i) > -1) {
							continue;
						}

						params[i] = this.baseParams[i];
					}

					this.baseParams = params;
				}
			}
		},
		getDate: function(bound) {
			switch(bound) {
				case 'from':
					return new Date(Date.parseDate(this.baseParams.datefrom + ' ' + this.baseParams.fromhour + ':' + this.baseParams.fromminute + ':00', 'Y-m-d H:i:s'));

				case 'till':
					return new Date(Date.parseDate(this.baseParams.datetill + ' ' + this.baseParams.tillhour + ':' + this.baseParams.tillminute + ':00', 'Y-m-d H:i:s'));
			}

			return null;
		},
		syncStore: function() {
			var panel = Ext.getCmp('statpanel').getTopToolbar();
			if(Ext.isObject(panel['extfilter'])) {
				panel.extfilter.saveParams();
			}
			panel.syncToolStore();
			return this.baseParams;
		},
		reload : function(options){
			this.syncStore();
			this.load(Ext.applyIf(options||{}, this.lastOptions));
		},
		setDate: function(bound, val) {
			switch(bound) {
				case 'from':
					this.setBaseParam('datefrom', val.format('Y-m-d'));
					this.setBaseParam('fromhour', val.format('H'));
					this.setBaseParam('fromminute', val.format('i'));
				break;

				case 'till':
					this.setBaseParam('datetill', val.format('Y-m-d'));
					this.setBaseParam('tillhour', val.format('H'));
					this.setBaseParam('tillminute', val.format('i'));
				break;
			}
		},
		listeners: {
			load: function(store, records) {
				if (store.getCount() > 0) {
					var S = [];
					Ext.each(records, function(item){
						var curr = item.data['curr_id'];
						if (Ext.isDefined(curr)) {
							if (!Ext.isDefined(this[curr])) {
								this[curr] = {
									volume_in: 0,
									volume_out: 0,
									volume: 0,
									cnt_in: 0,
									cnt_out: 0,
									duration_in: 0,
									duration_out: 0,
									amount: 0,
									curr_symbol: new String(item.get('curr_symbol'))
								}
							}
							for (var i in this[curr]) {
								if (Ext.isDefined(item.data[i]) && Ext.isNumber(this[curr][i])) {
									this[curr][i] += item.data[i];
								}
							}
							if(Ext.isDefined(item.data['cnt_in']) && Ext.isDefined(item.data['cnt_out']) &&
								item.get('cnt_in') == 0 && item.get('cnt_out') == 0) {
								if(item.get('direction') == 1) {
									this[curr]['cnt_out']++;
								}
								if(item.get('direction') == 0) {
									this[curr]['cnt_in']++;
								}
							}
						}
					}, S);

					var panel = Ext.getCmp('SumPanel');
					panel.store.removeAll();
					Ext.each(S, function(item, key){
						if (typeof item != 'undefined') {
							item.curr_id = key;
							this.add(new this.recordType(item));
						}
					}, panel.store);
					panel.show();
				}
			},
			clear: function() {
				Ext.getCmp('SumPanel').setVisible(false);
			}
		},
		remoteSort: true,
		baseParams: {
			async_call: 1,
			devision: 104,
			gettraff: 1,
			module: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x1') : 0,
			datefrom: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x2') : '',
			fromhour: 0,
			fromminute: 0,
			datetill: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x3') : '',
			groupitem: 0,
			groups: -1,
			start: 0,
			limit: PAGELIMIT,
			showdef: 0,
			operid: -1,
			vgid: 0,
			cin: 1,
			cout: 1,
			additional: 1,
			durfrom: '',
			durto: '',
			numfrom: '',
			numto: '',
			searchtype: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x4') : 3,
			searchfield: Ext.app.DefaultView.exists(COOKIE) ? Ext.app.DefaultView.get(COOKIE, 'x5') : '',
			amountfrom: ''
		}
	});

	// Column button, which will be embed  to column model of the ethernet traffic grid
	var TraffVgDet = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Detail statistics for account'),
		width: 22,
		dataIndex: 'vg_id',
		iconCls: 'ext-table',
		menuDisabled: true
	});

	// Column button, which will be embed  to column model of the phone traffic grid
	var TellVgDet = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Detail statistics for account'),
		width: 22,
		dataIndex: 'vg_id',
		iconCls: 'ext-table',
		menuDisabled: true
	});

	// Column button, which will be embed  to column model of the services grid
	var ServVgDet = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Detail statistics for account'),
		width: 22,
		dataIndex: 'vg_id',
		iconCls: 'ext-table',
		menuDisabled: true
	});

	// Common function to go to grouped list
	var gotoCommon = function() {
		this.ownerCt.ownerCt.store.baseParams.vgid = 0;
		this.ownerCt.ownerCt.store.baseParams.c_date = '';
		this.ownerCt.ownerCt.store.setBaseParam('operid', -1);
		if(this.ownerCt.ownerCt.store.baseParams.showdef > 0) {
			this.ownerCt.ownerCt.store.baseParams.showdef = 0;
		}
		this.ownerCt.ownerCt.groupitem.restoreLast();
		this.ownerCt.ownerCt.store.reload({
			params: {
				start: 0
			}
		});
		this.disable();
	}

	// Create grouping combo for all grids with common structure
	var groupCombo = {
		xtype: 'combo',
		name: 'groupitem',
		width: 150,
		displayField: 'name',
		valueField: 'id',
		typeAhead: true,
		mode: 'local',
		value: 0,
		triggerAction: 'all',
		editable: false,
		//ref: '../../groupitem',
		applyModuleFilter: function(type) {
			this.store.clearFilter();

			switch(type) {
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
					// Modify record name for friendly visualization
					var recIdx = this.store.find('id', 3);
					this.store.getAt(recIdx).set('name', Ext.app.Localize.get('by sessions'));
					this.store.getAt(recIdx).commit();
					
					this.store.filter('id', this.getType(type));
				break;

				case 13:
					// Modify record name for friendly visualization
					var recIdx = this.store.find('id', 3);
					this.store.getAt(recIdx).set('name', Ext.app.Localize.get('by services'));
					this.store.getAt(recIdx).commit();

					this.store.filter('id', this.getType(type));
				break;

				default:
					// Modify record name for friendly visualization
					var recIdx = this.store.find('id', 3);
					this.store.getAt(recIdx).set('name', Ext.app.Localize.get('by addresses'));
					this.store.getAt(recIdx).commit();
			}

			var idx = this.store.find('id', this.getValue());
			if(this.getRawValue() != this.store.getAt(idx).get('name')) {
				this.setRawValue(this.store.getAt(idx).get('name'))
			}
		},
		linkModule: function() {
			if(!this['module']) {
				this.module = this.findParentByType('panel').ownerCt.getTopToolbar().module;
			}
			return this.module;
		},
		mtypes: {
			6: new RegExp('^(0|1|2|3|4)$'),
			7: new RegExp('^(0|1|2|3)$'),
			8: new RegExp('^(0|1|2|3)$'),
			9: new RegExp('^(0|1|2|3)$'),
			10: new RegExp('^(0|1|2|3)$'),
			11: new RegExp('^(0|1|2|3)$'),
			12: new RegExp('^(0|1|2|3)$'),
			13: new RegExp('^(0|2|3)$')
		},
		getType: function(type){
			if(!this.mtypes[type]) {
				return new RegExp('.*');
			}
			return this.mtypes[type];
		},
		isInType: function(type, data) {
			if(!this.mtypes[type]) {
				return false;
			}
			return this.mtypes[type].test(data);
		},
		store: new Ext.data.ArrayStore({
			data: [
				['0', Ext.app.Localize.get('by accounts')],
				['1', Ext.app.Localize.get('by hours')],
				['2', Ext.app.Localize.get('by days')],
				['3', Ext.app.Localize.get('by addresses')],
				['4', Ext.app.Localize.get('by categories')],
				['5', Ext.app.Localize.get('by protocol')]
			],
			fields: ['id', 'name']
		}),
		restoreLast: function() {
			if (Ext.isDefined(this['lastValue'])) {
				this.setValue(this.lastValue);
				this.fireEvent('select', this);
			}
		},
		listeners: {
			afterrender: function() {
				this.lastValue = this.getValue();
				this.findParentByType('grid').groupitem = this;
			},
			beforeselect: function() {
				var G = this.ownerCt.ownerCt.ownerCt;
				this.lastValue = this.getValue();
				G.getColumnModel().configs[this.getValue()] = G.getColumnModel().config; 
			},
			expand: function() {
				this.linkModule();
				this.applyModuleFilter(this.module.store.getAt(this.module.store.find('id', this.module.getValue())).get('type'));
			},
			select: function(combo, record) {
				var G = this.ownerCt.ownerCt.ownerCt;
				G.store.baseParams.groupitem = this.getValue();
				G.store.removeAll();
				G.getColumnModel().setConfig(G.getColumnModel().configs[this.getValue()]);
			}
		}
	};
	
	// Global container to hold all elements
	new Ext.TabPanel({
		renderTo: renderTo,
		id: 'statpanel',
		activeTab: Ext.app.DefaultView.exists(COOKIE) ? ((Ext.app.DefaultView.get(COOKIE, 'x0') == 13) ? 2 : ((Ext.app.DefaultView.get(COOKIE, 'x0') < 7) ? 0 : 1)) : 0,
		plain: true,
		width: 1018, //958
		deferredRender: true,
		autoHeight: true,
		// This object works with date/time controls
		period: {
			from: null,
			till: null,
			getInterval: function() {
				var G = this.ownerCt.getTopToolbar().findById('timeinterval');
				if(Ext.isEmpty(G.getValue())) {
					G.setValue('interval_2', true);
				}
				return G.getValue().value;
			},
			init: function(panel){
				this.ownerCt = panel;
				if(!Ext.isEmpty(this.ownerCt.getGrid().store.baseParams.datetill)) {
					this.till = Date.parseDate(this.ownerCt.getGrid().store.baseParams.datetill.substr(0,10), 'Y-m-d')
				}
				else {
					this.till = new Date();
				}
				if(!Ext.isEmpty(this.ownerCt.getGrid().store.baseParams.datefrom)) {
					this.from = Date.parseDate(this.ownerCt.getGrid().store.baseParams.datefrom.substr(0,10), 'Y-m-d')
					this.sync();
				}
				else {
					this.set();
				}
			},
			resetTime: function(bound) {
				var bound = bound || true;
				if(bound) {
					this.till.setHours(0);
					this.till.setMinutes(0);
					this.from.setHours(0);
					this.from.setMinutes(0);
				}
				this.sync();
			},
			isReset: function() {
				return this.ownerCt.getTopToolbar().findById('resettime').getValue();
			},
			set: function(tdy){
				var A = this.till.clone();
				var B = this.till.clone();
				if (this.isReset() && tdy != 1){
					B = B.clearTime(true);
				}
				switch (this.getInterval()) {
					case 0:
						if (this.isReset()){
							B = B.getFirstDateOfMonth();
							A = B.add(Date.MONTH, -1);
						} else A = A.add(Date.MONTH, -1);
					break;
					case 1:
						if (this.isReset()){
							A = B.add(Date.DAY, -7);
						} else A = A.add(Date.DAY, -7);

					break;
					case 2:
						A = B.add(Date.DAY, -1);
					break;
					case 3:
						if (this.isReset()){
							B.setMinutes(0);
							tdy = 1;
						}
						A = B.add(Date.HOUR, -1);
					break;
				}
				this.from = A;
				this.till = B;
				this.sync(tdy);
			},
			sync: function(tdy){
				var store = this.ownerCt.getActiveTab().items.first().store;
				store.baseParams.datefrom = this.from.format('Y-m-d');
				store.baseParams.datetill = this.till.format('Y-m-d');

				if (this.isReset() && tdy != 1){
					store.baseParams.fromhour = 0;
					store.baseParams.tillhour = 0;
				}else{
					store.baseParams.fromhour = this.from.format('G');
					store.baseParams.tillhour = this.till.format('G');
				}

				store.baseParams.fromminute = this.isReset() ? 0 : this.from.format('i');
				store.baseParams.tillminute = this.isReset() ? 0 : this.till.format('i');
			},
			move: function(A){
				var A = A || 1;
				var td = 0;
				switch (this.getInterval()) {
					case 0: this.till = this.till.add(Date.MONTH, A); break;
					case 1: A = A * 7;
					case 2: this.till = this.till.add(Date.DAY, A); break;
					case 3: this.till = this.till.add(Date.HOUR, A); td = 1;break;
				};
				this.set(td);
				this.sync(td);
        	},
			now: function(){
				var t = 0;
				this.till = new Date();
				if (this.isReset()) {
					switch (this.getInterval()) {
						case 0:
							this.till = this.till.add(Date.MONTH, +1);
						break;
						case 1:
							this.till = this.till.add(Date.DAY, +1);
						break;
						case 2:
							this.till = this.till.add(Date.DAY, +1);
						break;
						case 3:
							this.till = this.till.add(Date.HOUR, +1);
							t = 1;
						break;
					};

				}
				else
				{
					this.till.setHours(0);
					this.till.setMinutes(0);
				}
				this.set(t);
				this.sync(t);
			},
			sprintf: function(A){
				if (A < 10) {
					return new String('0' + A);
				};
				return new String(A);
			},
			hours: function(){
				var A = [[-1, Ext.app.Localize.get('Hours')]];
				for (var i = 0, off = 24; i < off; i++) {
					A.push([i, this.sprintf(i)]);
				}
				return A;
			},
			minutes: function(){
				var A = [[-1, Ext.app.Localize.get('Minutes')]];
				for (var i = 0, off = 60; i < off; i++) {
					A.push([i, this.sprintf(i)]);
				}
				return A;
			},
			// @param	String, attribute name to modify
			// @param	String, date item to modify
			// @param	Integer, new value
			update: function(A, xformat, value){
				if(!this[A]) {
					return false;
				}

				if (!Ext.isDefined(xformat) || !Ext.isDefined(value)) {
					return false;
				}

				var D = Date.parseDate(this.sprintf(value), xformat);
				var DD = '';

				for (var l = 'YmdHi', i = 0, off = l.length; i < off; i++) {
					if (xformat.search(l[i]) > -1) {
						DD = DD + '' + D.format(l.charAt(i));
					}
					else {
						DD = DD + '' + this[A].format(l.charAt(i));
					}
				}

				this[A] = Date.parseDate(DD, 'YmdHi');
				this.sync();
			}
		},
		getGrid: function() {
			return this.getActiveTab().items.first();
		},
		// This function return object with currently visible columns
		getVisibleModel: function(){
			var B = {
				col: [],
				names: [],
				getString: function(item){
					if(!this[item]) {
						return '';
					}
					else {
						return this[item].join(';');
					}
				}
			}, idx;
			var A  = this.getActiveTab().items.first().getColumnModel().getColumnsBy(function(C){
				return (!C.hidden ? true : false);
			});

			for(var i = 0, off = A.length; i < off; i++){
				B.col.push(A[i].dataIndex);
				B.names.push(A[i].header.replace('&nbsp;', ' '));
			}

			if((idx = B.col.indexOf('amount')) > -1) {
				var sl_col = B.col.slice((idx + 1), B.col.length);
				var sl_names = B.names.slice((idx + 1), B.names.length);
				B.col[idx + 1] = 'curr_symbol';
				B.names[idx + 1] = Ext.app.Localize.get('Currency');
				if(sl_col.length > 0) {
					for(var i = idx + 2, k = 0, off = B.col.length + 1; i < off; i++, k++) {
						B.col[i] = sl_col[k];
						B.names[i] = sl_names[k];
					}
				}

			}
			return B
		},
		// Global panel events list
		listeners: {
			// After rendering configuration actions
			afterrender: function(panel) {
				
				var A = this.getActiveTab();
				var G = A.items.first();
				var T = this.getTopToolbar();
				T.findById('fromhour').store.loadData(this.period.hours());
				T.findById('tillhour').store.loadData(this.period.hours());
				T.findById('fromminute').store.loadData(this.period.minutes());
				T.findById('tillminute').store.loadData(this.period.minutes());
				this.period.init(this);
				T.syncToolView();
								
				var tabId = A.getId();
				if(UsboxStat == 0) { panel.get(2).disable(); T.disable(); } else { panel.setActiveTab(2); }
				if(TimeStat == 0) {	panel.get(1).disable();	T.disable(); } else { panel.setActiveTab(1); }
				if(IpStat == 0) { panel.get(0).disable(); T.disable();	} else { panel.setActiveTab(0); }
				T.enable();
				
				setTab = (Ext.app.DefaultView.exists(COOKIE) || Ext.app.DefaultView.get(COOKIE, 'x0')>0) ? ((Ext.app.DefaultView.get(COOKIE, 'x0') == 13) ? 2 : ((Ext.app.DefaultView.get(COOKIE, 'x0') < 7) ? 0 : 1)) : 0;
				this.setActiveTab(setTab);
				
				// When panel was rendered let us add event trigger to monitor column model changes
				Ext.each(panel.items.items, function(item){
					var grid = item.findByType('grid')[0];
					grid.getColumnModel().on('configchange', function(model){
						var idx = this.modules.store.find('id', this.modules.getValue());
						var grid = this.panel.getActiveTab().get(0);

						switch(this.panel.getActiveTab().getId()) {
							case 'stat_ethernet':
								if (grid.groupitem.getValue() == 0 && model.getIndexById('agrmcol') >= 0) {
									//model.setHidden(model.getIndexById('agrmcol'), this.modules.store.getAt(idx).get('type') == 6 ? true : false);
									//model.setHidden(model.getIndexById('durationcol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
								}
								if (grid.groupitem.getValue() == 3) {
									model.setDataIndex(model.getIndexById('expandcol'), this.modules.store.getAt(idx).get('type') == 6 ? 'ip' : 'src_ip');
									model.setColumnWidth(model.getIndexById('expandcol'), model.getColumnWidth(model.getIndexById('expandcol')) < 100 ? 100 : model.getColumnWidth(model.getIndexById('expandcol')));
									model.setHidden(model.getIndexById('ipcol'), this.modules.store.getAt(idx).get('type') == 6 ? true : false);
									model.setHidden(model.getIndexById('catcol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
									model.setHidden(model.getIndexById('datecol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
									model.setHidden(model.getIndexById('anicol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
									model.setHidden(model.getIndexById('dniscol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
									model.setHidden(model.getIndexById('nascol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
									model.setHidden(model.getIndexById('durationcol'), this.modules.store.getAt(idx).get('type') == 6 ? false : true);
								}
							break;
							case 'stat_service':
								if (grid.groupitem.getValue() == 3 && this.zkhConf) {
									model.setHidden(model.getIndexById('ext-data'), grid.getStore().baseParams['vgid'] > 0 ? false : true);
									model.setHidden(model.getIndexById('ext-data-date'), grid.getStore().baseParams['vgid'] > 0 ? false : true);
								}
							break;
						}
					}, this);
				}, {
					panel: panel,
					modules: T.findById('module'),
					zkhConf: Ext.get('zkh_configuration')
				});
			},
			beforetabchange: function(panel, newtab, curtab) {
			    var tab = curtab || newtab,
                    store = tab.items.first().store;
                
                store.lastBase = store.lastBase || {};
                if(curtab) {
                    store.lastBase[tab.getId()] = Ext.apply({}, store.baseParams);
                }
			},
			tabchange: function(panel, active){
				var grid = active.items.first();
				this.getTopToolbar().findById('module').fixList(grid.store.baseParams.module);
				switch(active.getId()) {
					case 'stat_ethernet': grid.store.setBaseParam('gettraff', 1, ['gettime', 'getserv']); break;
					case 'stat_time': grid.store.setBaseParam('gettime', 1, ['gettraff', 'getserv']); break;
					case 'stat_service': grid.store.setBaseParam('getserv', 1, ['gettraff', 'gettime']); break;
				}
				if(grid.store.lastBase[active.getId()]) {
				    grid.store.baseParams = Ext.apply({}, grid.store.lastBase[active.getId()]);
				}
				else {
    				grid.store.setBaseParam('vgid', 0);
    				if(grid.store.baseParams.showdef > 0) {
    					grid.store.setBaseParam('showdef', 0);
    				}
				}
			    grid.getTopToolbar().items.first()[grid.store.baseParams.vgid > 0 ? 'enable' : 'disable']();
			    if (this.notFirstTabActivation || !Ext.app.DefaultView.exists(COOKIE)) { grid.store.setBaseParam('searchtype', this.getTopToolbar().findById('searchtype').getValue()); }
                this.notFirstTabActivation = true;
			}
		},
		// Global top tool bar
		tbar: new Ext.Toolbar({
			layout: 'anchor',
			syncToolView: function() {
				Ext.each(this.findByType('datefield'), function(item){
					if(Ext.isDefined(this.baseParams[item.getId()])) {
						item.setValue(this.baseParams[item.getId()])
					}
				}, this.ownerCt.getActiveTab().items.first().store);
				Ext.each(this.findByType('textfield'), function(item){
					if(Ext.isDefined(this.baseParams[item.getId()])) {
						item.setValue(this.baseParams[item.getId()])
					}
				}, this.ownerCt.getActiveTab().items.first().store);
				Ext.each(this.findByType('combo'), function(item){
					if(Ext.isDefined(this.baseParams[item.getId()])) {
						item.setValue(this.baseParams[item.getId()])
					}
				}, this.ownerCt.getActiveTab().items.first().store);
			},
			syncToolStore: function() {
				var store = this.ownerCt.getGrid().store;
				// Save date values to store
				store.setDate('from', this.ownerCt.period.from);
				store.setDate('till', this.ownerCt.period.till);
				// Save combo values to store
				Ext.each(this.findByType('textfield'), function(item){
					switch(item.getId()) {
						case 'searchfield':
							this.setBaseParam(item.getId(), item.getValue());
						break;
					}
				}, store);
			},
			items: [{
				// Top line of the panel tool bar
				xtype: 'container',
				layout: 'toolbar',
				width: 1100,
				style: {
					paddingTop: '1px'
				},
				items: [{
					xtype: 'container',
					style: {
						paddingLeft: '2px'
					},
					html: Ext.app.Localize.get('Since') + ':&nbsp;'
				}, {
					xtype: 'datefield',
					width: 95,
					id: 'datefrom',
					format: 'Y-m-d',
					maskRe: new RegExp('[0-9\-]'),
					allowBlank: false,
					listeners: {
						change: function(field, value) {
							if (!Ext.isEmpty(this.getValue())) {
								this.ownerCt.ownerCt.ownerCt.period.update('from', 'Ymd', value.format('Ymd'));
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'combo',
					width: 65,
					displayField: 'name',
					valueField: 'id',
					id: 'fromhour',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							if (this.getValue() > -1) {
								this.ownerCt.ownerCt.ownerCt.period.update('from', 'H', this.getValue());
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'combo',
					id: 'fromminute',
					width: 65,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
					    data: [],
					    fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							if (this.getValue() > -1) {
								this.ownerCt.ownerCt.ownerCt.period.update('from', 'i', this.getValue());
							}
						}
					}
				}, {
					xtype: 'container',
					style: {
						paddingLeft: '12px'
					},
					html: Ext.app.Localize.get('Till') + ':&nbsp;'
				}, {
					xtype: 'datefield',
					id: 'datetill',
					width: 95,
					format: 'Y-m-d',
					maskRe: new RegExp('[0-9\-]'),
					allowBlank: false,
					listeners: {
						change: function(field, value) {
							if (!Ext.isEmpty(this.getValue())) {
								this.ownerCt.ownerCt.ownerCt.period.update('till', 'Ymd', value.format('Ymd'));
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'combo',
					id: 'tillhour',
					width: 65,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							if (this.getValue() > -1) {
								this.ownerCt.ownerCt.ownerCt.period.update('till', 'H', this.getValue());
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'combo',
					id: 'tillminute',
					width: 65,
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							if (this.getValue() > -1) {
								this.ownerCt.ownerCt.ownerCt.period.update('till', 'i', this.getValue());
							}
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 6
				}, {
					xtype: 'checkbox',
					id: 'resettime',
					height: 23,
					checked: true,
					qtip: Ext.app.Localize.get('Hold the zero boundary period'),
					handler: function(A) {
						this.ownerCt.ownerCt.ownerCt.period.resetTime(A);
						this.ownerCt.ownerCt.syncToolView();
						this.ownerCt.ownerCt.get(1).get(0).fixList(this.ownerCt.ownerCt.get(1).get(0).getValue());
					}
				}, {
					xtype: 'button',
					iconCls: 'ext-arrow-left',
					tooltip: Ext.app.Localize.get('Moove backward'),
					handler: function(){
						this.ownerCt.ownerCt.ownerCt.period.move(-1);
						this.ownerCt.ownerCt.syncToolView();
						this.ownerCt.ownerCt.get(1).get(0).fixList(this.ownerCt.ownerCt.get(1).get(0).getValue());
					}
				}, {
					xtype: 'radiogroup',
					id: 'timeinterval',
					width: 190,
					height: 23,
					style: {
						margin: 0,
						padding: 0
					},
					columns: [63, 63, 63, 63],
					defaults: {
						name: 'time'
					},
					listeners: {
						change: function(group, box) {
							this.ownerCt.ownerCt.ownerCt.period.set();
							this.ownerCt.ownerCt.syncToolView();
							this.ownerCt.ownerCt.get(1).get(0).fixList(this.ownerCt.ownerCt.get(1).get(0).getValue());
						}
					},
					items: [{
						boxLabel: Ext.app.Localize.get('Month'),
						value: 0,
						id: 'interval_0',
						name: 'interval'
					}, {
						boxLabel: Ext.app.Localize.get('Week'),
						value: 1,
						id: 'interval_1',
						name: 'interval'
					}, {
						boxLabel: Ext.app.Localize.get('Day'),
						value: 2,
						id: 'interval_2',
						name: 'interval'
					}, {
						boxLabel: Ext.app.Localize.get('Hour'),
						value: 3,
						id: 'interval_3',
						name: 'interval'
					}]
				}, {
					xtype: 'button',
					tooltip: Ext.app.Localize.get('Today'),
					iconCls: 'ext-calendar',
					handler: function(){
						this.ownerCt.ownerCt.ownerCt.period.now();
						this.ownerCt.ownerCt.syncToolView();
						this.ownerCt.ownerCt.get(1).get(0).fixList(this.ownerCt.ownerCt.get(1).get(0).getValue());
					}
				}, {
					xtype: 'button',
					iconCls: 'ext-arrow-right',
					tooltip: Ext.app.Localize.get('Moove forward'),
					handler: function(){
						this.ownerCt.ownerCt.ownerCt.period.move();
						this.ownerCt.ownerCt.syncToolView();
						this.ownerCt.ownerCt.get(1).get(0).fixList(this.ownerCt.ownerCt.get(1).get(0).getValue());
					}
				}, {
					xtype: 'splitbutton',
					width: 73,
					id: 'menu_btn',
					iconCls: 'ext-search',
					text: Ext.app.Localize.get('Show'),
					handler: function(Btn) {						
						var S = this.ownerCt.ownerCt.ownerCt.getActiveTab().items.first().store;
						if(S.baseParams.module == 0) {
							this.ownerCt.ownerCt.findById('module').fixList(true)
						};
						S.reload({
							params: {
								start: 0
							}
						})
					},
					menu: [{
						text: Ext.app.Localize.get('Active sessions'),
						id: 'sessions_btn',
						handler: function(){
							var M = this.findParentByType('toolbar').findById('module');
							showSessions(M.store.query('id', new RegExp('^(' + M.getValue() + ')$')).items[0]);
						}
					}, {
						text: Ext.app.Localize.get('Download'),
						iconCls: 'ext-downcsv',
						menu: [{
							text: Ext.app.Localize.get('Current page'),
							handler: function() {
								var panel = this.findParentByType('toolbar').ownerCt;
								var Model = panel.getVisibleModel();
								var params = {};

								Ext.apply(params, panel.getGrid().store.syncStore());
								params.downtype = 0;
								params.clm= Model.getString('col');
								params.clmnames = Model.getString('names');
								
								if(panel.getGrid().store.sortInfo)
								{
									var sinf = panel.getGrid().store.sortInfo;
									params.sort = sinf.field;
									params.dir = sinf.direction;
								}

								Download(params);
							}
						}, {
							text: Ext.app.Localize.get('All') + ' ' + Ext.app.Localize.get('pages'),
							handler: function() {
								var panel = this.findParentByType('toolbar').ownerCt;
								var Model = panel.getVisibleModel();
								var params = {};

								Ext.apply(params, panel.getGrid().store.syncStore());
								params.downtype = 1;
								params.clm= Model.getString('col');
								params.clmnames = Model.getString('names');
								
								if(panel.getGrid().store.sortInfo)
								{
									var sinf = panel.getGrid().store.sortInfo;
									params.sort = sinf.field;
									params.dir = sinf.direction;
								}

								Download(params);
							}
						}]
					}]
				}]
			}, {
				// Bottom line of panel tool bar
				xtype: 'container',
				layout: 'toolbar',
				width: 955,
				style: {
					paddingTop: '1px'
				},
				items: [{
					xtype: 'combo',
					id: 'module',
					width: 240,
					IE8Fix: false,
					emptyText: Ext.app.Localize.get('Module'),
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name}">{id}. {[Ext.util.Format.ellipsis(values.name, 26)]}</div></tpl>',
					displayField: 'name',
					valueField: 'id',
					editable: false,
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					ref: '../module',
					listeners: {
						expand: function(){
							this.fixList(false)
						},
						select: function(combo, record) {
							var S = this.ownerCt.ownerCt.findById('menu_btn').menu.findById('sessions_btn');
							var G = this.ownerCt.ownerCt.ownerCt.getActiveTab().items.first();
							G.store.baseParams.module = this.getValue();

							switch(record.get('type')) {
								case 6:
									if(!G.groupitem.isInType(record.get('type'), G.groupitem.getValue())) {
										G.groupitem.setValue(G.groupitem.store.getAt(0).get('id'));
										G.groupitem.lastValue = G.groupitem.getValue();
										G.groupitem.fireEvent('select', G.groupitem);
									}
									else {
										G.getColumnModel().fireEvent('configchange', G.getColumnModel());
									}
									S.enable();
								break;

								case 12:
									S.enable()
								break;

								default:
									G.getColumnModel().fireEvent('configchange', G.getColumnModel());
									S.disable();
							}

							G.groupitem.applyModuleFilter(record.get('type'));

							if(G.store.getCount() > 0) {
								G.store.removeAll()
							}
						}
					},
					fixList: function(B){
						//if(this.store.getCount() == 0) {
						//	return;
						//}
						var A = '';
						switch (this.ownerCt.ownerCt.ownerCt.getActiveTab().getId()) {
							case 'stat_ethernet': A = new RegExp('^(1|2|3|4|5|6)$'); break;
							case 'stat_time': A = new RegExp('^(7|8|9|10|11|12)$'); break;
							case 'stat_service': A = new RegExp('^(13)$'); break;
						};
						this.store.clearFilter();
						this.store.filter('type', A);
						if(this.store.getCount() == 0) {
							this.setRawValue('');
							return;
						}
						if (Ext.isBoolean(B) && B == true) {
							try {
								this.setValue(this.store.data.first().data.id);
								this.fireEvent('select', this, this.store.data.first());
							}
							catch (e) { }
						}
						else if(B > 0) {
							try {
								var idx = this.store.find('id', B);
								if (idx > -1) {
									if(B == this.store.getAt(idx).get("id")){
										this.setValue(B);
										this.fireEvent('select', this, this.store.getAt(idx));
									}
									else {
										this.setValue(this.store.data.first().data.id);
										this.fireEvent('select', this, this.store.data.first());
									}	
								}
								else {
									this.setValue(this.store.data.first().data.id);
									this.fireEvent('select', this, this.store.data.first());
								}
							}
							catch (e) { }
						}
						else {
							this.setValue(this.store.data.first().data.id);
							this.fireEvent('select', this, this.store.data.first());
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
							{ name: 'type', type: 'int' }
						]),
						baseParams: {
							async_call: 1,
							devision: 104,
							getmodules: 1
						},
						autoLoad: true,
						sortInfo: {
							field: 'id',
							direction: 'ASC'
						},
						listeners: {
							load: function() {
								var combo = Ext.getCmp('module'), module;
								combo.fixList((module = combo.findParentByType('toolbar').ownerCt.getGrid().store.baseParams.module) > 0 ? module : true);

								// ATTANTION! These lines should be executed after modules list is already loaded
								if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'a0')) {
									combo.findParentByType('toolbar').ownerCt.getGrid().getStore().reload({
										params: {
											start: 0
										}
									});
									
                                    if(Ext.app.DefaultView.exists(COOKIE) && Ext.app.DefaultView.get(COOKIE, 'rm') == 1) {
                                        Ext.app.DefaultView.set(COOKIE, {}, true);
                                    }
								}
							}
						}
					})
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'combo',
					IE8Fix: false,
					width: 250,
					emptyText: Ext.app.Localize.get('User group'),
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.name}{[(!Ext.isEmpty(values.descr) && values.descr.length > 0) ? \" :: \" + values.descr : \"\"]}">{[values.id < 1 ? \"\" : values.id + \".\"]} {[Ext.util.Format.ellipsis(values.name, 23)]}</div></tpl>',
					displayField: 'name',
					valueField: 'id',
					id: 'group',
					editable: false,
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
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
							devision: 104,
							getugroups: 1
						},
						sortInfo: {
							field: 'id',
							direction: 'ASC'
						},
						autoLoad: true,
						listeners: {
							load: function(store){
								store.insert(0, new store.recordType({
									id: -1,
									name: Ext.app.Localize.get('All available'),
									descr: ''
								}));
							}
						}
					}),
					listeners: {
						select: function() {
							this.ownerCt.ownerCt.ownerCt.getActiveTab().items.first().store.setBaseParam('groups', this.getValue());
						}
					}
				}, {
					xtype: 'tbseparator'
				}, {
					xtype: 'combo',
					IE8Fix: false,
					width: 150,
					id: 'searchtype',
					displayField: 'name',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: new Ext.data.SimpleStore({
						data: [
							['0', Ext.app.Localize.get('User')],
							['1', Ext.app.Localize.get('Agreement')],
							['3', Ext.app.Localize.get('Account login')],
							['4', 'IP ' + Ext.app.Localize.get('address')],
							['5', Ext.app.Localize.get('Session') + ' (ANI)']
						],
						fields: ['id', 'name']
					}),
					listeners: {
						select: function() {
							this.ownerCt.ownerCt.ownerCt.getGrid().store.setBaseParam(this.getId(), this.getValue())
						}
					}
				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'textfield',
					width: 204,
					id: 'searchfield',
					listeners: {
						afterrender: function() {
							this.on('specialkey', function(f, e){
								if (e.getKey() == e.ENTER) {								
									this.ownerCt.ownerCt.ownerCt.getGrid().store.reload({
										params: {
											start: 0
										}
									})
								}
							}, this);
						},
						blur: function(field) {
							this.ownerCt.ownerCt.ownerCt.getGrid().store.setBaseParam(this.getId(), this.getValue())
						}
					}
				}, {
					xtype: 'tbseparator'

				}, {
					xtype: 'tbspacer',
					width: 3
				}, {
					xtype: 'button',
					text: Ext.app.Localize.get('Filter'),
					icon: 'images/filter.gif',
					iconAlign: 'right',
					width: 80,
					enableToggle: true,
					handler: function() {
						if (!Ext.isObject(this.ownerCt.ownerCt['extfilter'])) {
							this.ownerCt.ownerCt.extfilter = ExtendedFilter(this);
							this.ownerCt.ownerCt.extfilter.panel = this.ownerCt.ownerCt.ownerCt;
							if(!this.ownerCt.ownerCt.extfilter) {
								return false;
							}
						}
						if(this.ownerCt.ownerCt.extfilter) {
							if(this.pressed) {
								this.ownerCt.ownerCt.extfilter.show();
							}
							else {
								this.ownerCt.ownerCt.extfilter.hide();
							}
						}
					}
				}]
			}]
		}),
		items: [{
			// Start Traffic grid configuration object
			title: Ext.app.Localize.get('Traffic statistics'),
			id: 'stat_ethernet',
			autoHeight: true,
			items: {
				xtype: 'grid',
				loadMask: true,
				height: GRIDHEIGHT,
				store: Store,
				minColumnWidth: 100,
				autoExpandColumn: 'expandcol',
				plugins: [TraffVgDet],
				cm: new Ext.grid.ColumnModel({
					columns: [TraffVgDet,

					{
						header: Ext.app.Localize.get('Cost'),
						dataIndex: 'amount',
						width: 120,
						renderer: function(value, metaData, record) {
							return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
						}
					},
					          {
						header: Ext.app.Localize.get('User'),
						dataIndex: 'user_name',
						id: 'expandcol',
						renderer: function(value, metaData, record) {
							if(record.get('vg_id') == 0) {
								return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
							}
							return value;
						}
					}, {
						header: Ext.app.Localize.get('Account'),
						dataIndex: 'vg_login',
						width: 130
					}, {
						header: Ext.app.Localize.get('Agreement'),
						dataIndex: 'agrm_num',
						id: 'agrmcol',
						hidden: true,
						width: 130
					}, {
						header: Ext.app.Localize.get('Duration'),
						dataIndex: 'duration',
						id: 'durationcol',
						width: 110,
						renderer: function(value, metaData, record) {
							return Duration(value)
						}
					}, {
						header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
						dataIndex: 'volume_in',
						width: 120
					}, {
						header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
						dataIndex: 'volume_out',
						width: 120
					}, {
						header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
						dataIndex: 'volume',
						width: 120
					}
                    ],
					// Object that contains default column models for the different data groups
					configs: {
						// Column model for the data grouped by hour
						1: [
						    {
								header: Ext.app.Localize.get('Cost'),
								dataIndex: 'amount',
								width: 130,
								renderer: function(value, metaData, record) {
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
							},
						    {
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'dt',
							id: 'expandcol',
							renderer: function(value, metaData, record) {
								try {
									return value.format('d.m.Y') + ' <span style="color:red">' + value.format('H') + '</span>:' + value.format('i');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_in',
							width: 120
						}, {
							header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_out',
							width: 120
						}, {
							header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume',
							width: 120
						}],
						// Column model for the data grouped by day
						2: [
						    {
								header: Ext.app.Localize.get('Cost'),
								dataIndex: 'amount',
								width: 130,
								renderer: function(value, metaData, record) {
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
							},
						    {
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'dt',
							id: 'expandcol',
							renderer: function(value, metaData, record) {
								try {
									return '<span style="color:red">' + value.format('d') + '</span>.' + value.format('m.Y');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_in',
							width: 120
						}, {
							header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_out',
							width: 120
						}, {
							header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume',
							width: 120
						}],
						// Column model for the data grouped by ip address
						3: [{
							header: Ext.app.Localize.get('Cost'),
							dataIndex: 'amount',
							width: 130,
							renderer: function(value, metaData, record) {
								return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
							}
						}, {
							header: 'IP ' + Ext.app.Localize.get('address'),
							dataIndex: 'src_ip',
							id: 'expandcol'
						}, {
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'dt',
							id: 'datecol',
							width: 128,
							renderer: function(value, metaData, record) {
								try {
									if(value.format('Y') < 1900) {
										return '-';
									}
									return value.format('d.m.Y H:i');
								}
								catch(e) {
									return '-';
								}
							}
						}, {
							header: Ext.app.Localize.get('User'),
							dataIndex: 'user_name',
							hidden: true,
							renderer: function(value, metaData, record) {
								if (record.get('vg_id') > 0) {
									return value;
								}
								return '-';
							}
						}, {
							header: Ext.app.Localize.get('Login'),
							dataIndex: 'vg_login',
							width: 120,
							renderer: function(value, metaData, record) {
								if(record.get('vg_id') > 0) {
									return '<span ext:qtip="' + Ext.util.Format.htmlEncode(record.get('user_name')) + '">' + value + '</span>';
								}
								return '-';
							}
						}, {
							header: 'IP ' + Ext.app.Localize.get('Resource'),
							dataIndex: 'dst_ip',
							id: 'ipcol',
							width: 130
						}, {
							header: Ext.app.Localize.get('Category'),
							dataIndex: 'cat_descr',
							id: 'catcol',
							width: 130
						}, {
							header: Ext.app.Localize.get('Duration'),
							dataIndex: 'duration',
							id: 'durationcol',
							width: 110,
							renderer: function(value, metaData, record) {
								return Duration(value)
							}
						}, {
							header: 'ANI',
							dataIndex: 'ani',
							id: 'anicol',
							width: 100
						}, {
							header: 'DNIS',
							dataIndex: 'dnis',
							id: 'dniscol',
							width: 100
						},
						{
                            header: 'NAS',
                            dataIndex: 'nas',
                            id: 'nascol',
                            width: 100
                        },
						{
							header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_in',
							width: 120
						}, {
							header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_out',
							width: 120
						}, {
							header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume',
							width: 120
						}],
						// Column model for the data grouped by tariff's category
						4: [
						{
							header: Ext.app.Localize.get('Cost'),
							dataIndex: 'amount',
							width: 130,
							renderer: function(value, metaData, record) {
								return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
							}
						},
						    {
							header: Ext.app.Localize.get('Tarif'),
							dataIndex: 'tar_descr',
							id: 'expandcol'
						}, {
							header: Ext.app.Localize.get('Category'),
							dataIndex: 'cat_descr',
							width: 180
						}, {
							header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_in',
							width: 120
						}, {
							header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_out',
							width: 120
						}, {
							header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume',
							width: 120
						}],
						// Column model for the data grouped by protocol
						5: [
						    {
								header: Ext.app.Localize.get('Cost'),
								dataIndex: 'amount',
								width: 130,
								renderer: function(value, metaData, record) {
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
							},
						    {
							header: Ext.app.Localize.get('Protocol'),
							dataIndex: 'dst_proto',
							id: 'expandcol'
						}, {
							header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_in',
							width: 120
						}, {
							header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume_out',
							width: 120
						}, {
							header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
							dataIndex: 'volume',
							width: 120
						}]
					},
					defaults: {
						sortable: true
					}
				}),
				// Top tool bar of the traffic grid
				tbar: [{
					xtype: 'button',
					id: 'gobacktraff',
					text: Ext.app.Localize.get('Go back to common statistics'),
					iconCls: 'ext-levelup',
					disabled: true,
					handler: gotoCommon
				}],
				// Bottom tool bar of the traffic grid
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: Store,
					displayInfo: true,
					items: ['-', {
						xtype: 'container',
						width: 400,
						layout: 'hbox',
						items: [{
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
								data: [['100'], ['500']],
								fields: ['id']
							}),
							listeners: {
								select: function(){
									PAGELIMIT = this.getValue() * 1;
									this.ownerCt.ownerCt.pageSize = PAGELIMIT;
									Store.setBaseParam('limit', PAGELIMIT);
								}
							}
						}, {
							xtype: 'tbseparator',
							style: {
								marginTop: '2px'
							},
							width: 8
						}, {
							xtype: 'container',
							style: {
								paddingTop: '4px',
								paddingLeft: '3px'
							},
							html: Ext.app.Localize.get('t-Group') + ':&nbsp;'
						}, groupCombo]
					}]
				})
			}
		}, {
			// Start Telephony grid configuration object
			title: Ext.app.Localize.get('Time statistics'),
			id: 'stat_time',
			autoHeight: true,
			items: [{
				xtype: 'grid',
				loadMask: true,
				height: GRIDHEIGHT,
				store: Store,
				minColumnWidth: 100,
				autoExpandColumn: 'expandcol',
				plugins: [TellVgDet],
				cm: new Ext.grid.ColumnModel({
					columns: [TellVgDet,
					   {
						header: Ext.app.Localize.get('Write-off'),
						dataIndex: 'amount',
						width: 120,
						renderer: function(value, metaData, record) {
							try {
								return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
							}
							catch(e){
								return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
							}
						}
					},
					          {
						header: Ext.app.Localize.get('User'),
						dataIndex: 'user_name',
						hidden: true,
						renderer: function(value, metaData, record) {
							if(record.get('vg_id') == 0) {
								return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
							}
							return value;
						}
					}, {
						header: Ext.app.Localize.get('Account'),
						dataIndex: 'vg_login',
						width: 130,
						renderer: function(value, metaData, record) {
							if(record.get('vg_id') == 0) {
								return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
							}
							return value;
						}
					}, {
						header: Ext.app.Localize.get('Operator'),
						dataIndex: 'oper_descr',
						id: 'expandcol'
					}, {
						header: Ext.app.Localize.get('Agreement'),
						dataIndex: 'agrm_num',
						id: 'agrmcol',
						hidden: true,
						width: 130
					}, {
						header: Ext.app.Localize.get('Incom') + '.',
						dataIndex: 'cnt_in',
						width: 60
					}, {
						header: Ext.app.Localize.get('Duration'),
						dataIndex: 'duration_in',
						id: 'durationcol',
						width: 95,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
							if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0) {
								if(record.get('direction') == 0) {
									return Duration(value);
								}
								else{
									return Duration(record.get('duration_out'))
								}
							}
							else{
								return Duration(value);
							}
						}
					}, {
						header: Ext.app.Localize.get('Dur-n ro-nd'),
						dataIndex: 'duration_round_in',
						width: 95,
						renderer: function(value, metaData, record, rowIndex, colIndex, store){
							if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0){
								if(record.get('direction') == 0){
									return Duration(value);
								}
								else{
									return Duration(record.get('duration_round_out'));
								}
							}
							else{
								return Duration(value);
							}
						}
					}, {
						header: Ext.app.Localize.get('Outg-ng') + '.',
						dataIndex: 'cnt_out',
						width: 60
					}, {
						header: Ext.app.Localize.get('Duration'),
						dataIndex: 'duration_out',
						width: 95,
						renderer: function(value) {
							return Duration(value);
						}
					}, {
						header: Ext.app.Localize.get('Dur-n ro-nd'),
						dataIndex: 'duration_round_out',
						width: 95,
						renderer: function(value) {
							return Duration(value)
						}
					}, {
						header: Ext.app.Localize.get('Period'),
						dataIndex: 'c_date',
						width: 95,
						renderer: function(value) {
							if(!Ext.isEmpty(value) && !Ext.isPrimitive(value))
								return value.format('Y-m-d');
							return value;
						}
					}],
					configs: {
						1: [{
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'timefrom',
							width: 130,
							renderer: function(value, metaData, record) {
								try {
									return value.format('d.m.Y') + ' <span style="color:red">' + value.format('H') + '</span>:' + value.format('i');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Operator'),
							dataIndex: 'oper_descr',
							id: 'expandcol'
						}, {
							header: Ext.app.Localize.get('Agreement'),
							dataIndex: 'agrm_num',
							id: 'agrmcol',
							hidden: true,
							width: 130
						}, {
							header: Ext.app.Localize.get('Incom') + '.',
							dataIndex: 'cnt_in',
							width: 60
						}, {
							header: Ext.app.Localize.get('Duration'),
							dataIndex: 'duration_in',
							id: 'durationcol',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store) {
								if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0) {
									if(record.get('direction') == 0) {
										return Duration(value);
									}
									else{
										return Duration(record.get('duration_out'))
									}
								}
								else{
									return Duration(value);
								}
							}
						}, {
							header: Ext.app.Localize.get('Dur-n ro-nd'),
							dataIndex: 'duration_round_in',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0){
									if(record.get('direction') == 0){
										return Duration(value);
									}
									else{
										return Duration(record.get('duration_round_out'));
									}
								}
								else{
									return Duration(value);
								}
							}
						}, {
							header: Ext.app.Localize.get('Outg-ng') + '.',
							dataIndex: 'cnt_out',
							width: 60
						}, {
							header: Ext.app.Localize.get('Duration'),
							dataIndex: 'duration_out',
							width: 95,
							renderer: function(value) {
								return Duration(value);
							}
						}, {
							header: Ext.app.Localize.get('Dur-n ro-nd'),
							dataIndex: 'duration_round_out',
							width: 95,
							renderer: function(value) {
								return Duration(value)
							}
						}, {
							header: Ext.app.Localize.get('Write-off'),
							dataIndex: 'amount',
							width: 120,
							renderer: function(value, metaData, record) {
								try {
									return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
								catch(e){
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
								}
							}
						}, {
							header: Ext.app.Localize.get('Period'),
							dataIndex: 'c_date',
							width: 95,
							renderer: function(value) {
								return value.format('Y-m-d');
							}
						}],
						2: [{
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'timefrom',
							width: 110,
							renderer: function(value, metaData, record) {
								try {
									return '<span style="color:red">' + value.format('d') + '</span>.' + value.format('m.Y');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Operator'),
							dataIndex: 'oper_descr',
							id: 'expandcol'
						}, {
							header: Ext.app.Localize.get('Incom') + '.',
							dataIndex: 'cnt_in',
							width: 60
						}, {
							header: Ext.app.Localize.get('Duration'),
							dataIndex: 'duration_in',
							id: 'durationcol',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store) {
								if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0) {
									if(record.get('direction') == 0) {
										return Duration(value);
									}
									else{
										return Duration(record.get('duration_out'))
									}
								}
								else{
									return Duration(value);
								}
							}
						}, {
							header: Ext.app.Localize.get('Dur-n ro-nd'),
							dataIndex: 'duration_round_in',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(store.baseParams.vg_id > 0 || store.baseParams.showdef > 0){
									if(record.get('direction') == 0){
										return Duration(value);
									}
									else{
										return Duration(record.get('duration_round_out'));
									}
								}
								else{
									return Duration(value);
								}
							}
						}, {
							header: Ext.app.Localize.get('Outg-ng') + '.',
							dataIndex: 'cnt_out',
							width: 60
						}, {
							header: Ext.app.Localize.get('Duration'),
							dataIndex: 'duration_out',
							width: 95,
							renderer: function(value) {
								return Duration(value);
							}
						}, {
							header: Ext.app.Localize.get('Dur-n ro-nd'),
							dataIndex: 'duration_round_out',
							width: 95,
							renderer: function(value) {
								return Duration(value)
							}
						}, {
							header: Ext.app.Localize.get('Write-off'),
							dataIndex: 'amount',
							width: 120,
							renderer: function(value, metaData, record) {
								try {
									return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
								catch(e){
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
								}
							}
						}, {
							header: Ext.app.Localize.get('Period'),
							dataIndex: 'c_date',
							width: 95,
							renderer: function(value) {
								return value.format('Y-m-d');
							}
						}],
						// Detailed data by calls
						3: [{
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'timefrom',
							width: 120,
							renderer: function(value, metaData, record) {
								try {
									return value.format('d.m.Y H:i');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('User'),
							dataIndex: 'user_name',
							hidden: true,
							id: 'expandcol',
							renderer: function(value, metaData, record) {
								if(record.get('vg_id') == 0) {
									return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
								}
								return value;
							}
						}, {
							header: Ext.app.Localize.get('Account'),
							dataIndex: 'vg_login',
							hidden: true,
							width: 130,
							renderer: function(value, metaData, record) {
								if(record.get('vg_id') == 0) {
									return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
								}
								return value;
							}
						}, {
							header: Ext.app.Localize.get('Direct'),
							dataIndex: 'direction',
							width: 60,
							renderer: function(value, metaData, record){
								if(value == 0){
									metaData.style = 'background-color:#ecf9ff;';
									return Ext.app.Localize.get('Incom') + '.';
								}
								else{
									metaData.style = 'background-color:#fdffec;';
									return Ext.app.Localize.get('Outg-ng') + '.'
								}
							}
						}, {
							header: Ext.app.Localize.get('Operator'),
							dataIndex: 'oper_descr',
							width: 135
						}, {
							header: Ext.app.Localize.get('Agreement'),
							dataIndex: 'agrm_num',
							id: 'agrmcol',
							hidden: true,
							width: 130
						}, {
							header: Ext.app.Localize.get('Dur-n'),
							dataIndex: 'duration_in',
							id: 'durationcol',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store) {

								if(record.get('direction') == 0) {
									return Duration(record.get('duration_in'));
								}
								else{
									return Duration(record.get('duration_out'));
								}
							}
						}, {
							header: Ext.app.Localize.get('Dur-n ro-nd'),
							dataIndex: 'duration_round_in',
							width: 95,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(record.get('direction') == 0){
									return Duration(record.get('duration_round_in'));
								}
								else{
									return Duration(record.get('duration_round_out'));
								}
							}
						}, {
							header: Ext.app.Localize.get('Number') + ' A',
							dataIndex: 'numfrom',
							width: 120
						}, {
							header: Ext.app.Localize.get('Number') + ' ' + Ext.app.Localize.get('B'),
							dataIndex: 'numto',
							width: 120
						}, {
							header: Ext.app.Localize.get('Tarif'),
							dataIndex: 'tar_descr',
							width: 130,
							renderer: function(value) {
								if(value == '') {
									return Ext.app.Localize.get('Undefined')
								}
								else{
									return value
								}
							}
						}, {
							header: Ext.app.Localize.get('Category'),
							dataIndex: 'cat_descr',
							width: 130,
							renderer: function(value) {
								if(value == ''){
									return Ext.app.Localize.get('Undefined');
								}
								else{
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Trunk in'),
							dataIndex: 'trunk_in',
							width: 130
						}, {
							header: Ext.app.Localize.get('Trunk out'),
							dataIndex: 'trunk_out',
							width: 130
						}, {
							header: Ext.app.Localize.get('Class'),
							dataIndex: 'class',
							width: 120
						}, {
							header: Ext.app.Localize.get('Cause'),
							dataIndex: 'cause',
							width: 80
						}, {
							header: Ext.app.Localize.get('Write-off'),
							dataIndex: 'amount',
							width: 120,
							renderer: function(value, metaData, record) {
								try {
									return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
								}
								catch(e){
									return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
								}
							}
						}, {
							header: Ext.app.Localize.get('Period'),
							dataIndex: 'c_date',
							width: 95,
							renderer: function(value) {
								return value ? value.format('Y-m-d') : '';
							}
						}]
					},
					defaults: {
						sortable: true
					}
				}),
				// Top tool bar of the telephony grid
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Go back to common statistics'),
					iconCls: 'ext-levelup',
					disabled: true,
					handler: gotoCommon
				}],
				// Bottom tool bar of the telephony grid
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: Store,
					displayInfo: true,
					items: ['-', {
						xtype: 'container',
						width: 400,
						layout: 'hbox',
						items: [{
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
								data: [['100'], ['500']],
								fields: ['id']
							}),
							listeners: {
								select: function(){
									PAGELIMIT = this.getValue() * 1;
									this.ownerCt.ownerCt.pageSize = PAGELIMIT;
									Store.setBaseParam('limit', PAGELIMIT);
								}
							}
						}, {
							xtype: 'tbseparator',
							style: {
								marginTop: '2px'
							},
							width: 8
						}, {
							xtype: 'container',
							style: {
								paddingTop: '4px',
								paddingLeft: '3px'
							},
							html: Ext.app.Localize.get('t-Group') + ':&nbsp;'
						}, groupCombo]
					}]
				})
			}]
		}, {
			// Start grid of the Provided services (USBox) configuration object
			title: Ext.app.Localize.get('Provided services'),
			id: 'stat_service',
			autoHeight: true,
			items: [{
				xtype: 'grid',
				loadMask: true,
				height: GRIDHEIGHT,
				store: Store,
				minColumnWidth: 100,
				autoExpandColumn: 'expandcol',
				plugins: [ServVgDet],
				listeners: {
					beforerender: function(grid){
						var model = grid.getColumnModel(), items = model.configs[3];

						if (Ext.get('zkh_configuration')) {
							model.configs[3] = [];
							Ext.each(items, function(item, key){
								this.push(item);
								if (item.dataIndex == 'vg_login') {
									this.push({
										header: Ext.app.Localize.get('Device meterage'),
										id: 'ext-data',
										dataIndex: 'external_data',
										width: 115
									});

									this.push({
										header: Ext.app.Localize.get('Meterage date'),
										id: 'ext-data-date',
										dataIndex: 'timefrom',
										width: 100,
										renderer: function(value){
											try {
												return value.format('d.m.Y');
											}
											catch (e) {
												return value;
											}
										}
									});
								}
							}, model.configs[3]);
						}
					}
				},
				cm: new Ext.grid.ColumnModel({
					columns: [ServVgDet,

					          {
						header: Ext.app.Localize.get('Write-off'),
						dataIndex: 'amount',
						width: 120,
						renderer: function(value, metaData, record) {
							try {
								return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
							}
							catch(e){
								return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
							}
						}
					},
					          {
						header: Ext.app.Localize.get('User'),
						dataIndex: 'user_name',
						id: 'expandcol',
						renderer: function(value, metaData, record) {
							if(record.get('vg_id') == 0) {
								return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
							}
							return value;
						}
					}, {
						header: Ext.app.Localize.get('Account'),
						dataIndex: 'vg_login',
						width: 135,
						renderer: function(value, metaData, record) {
							if(record.get('vg_id') == 0) {
								return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
							}
							return value;
						}
					}, {
						header: Ext.app.Localize.get('Agreement'),
						dataIndex: 'agrm_num',
						id: 'agrmcol',
						hidden: true,
						width: 130
					}, {
						header: Ext.app.Localize.get('Quant. charging'),
						dataIndex: 'volume',
						width: 70
					}],
					configs: {
						// Grouped data by day
						2: [
							{
								header: Ext.app.Localize.get('Write-off'),
								dataIndex: 'amount',
								width: 120,
								renderer: function(value, metaData, record) {
									try {
										return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
									}
									catch(e){
										return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
									}
								}
							},
						    {
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'dt',
							id: 'expandcol',
							renderer: function(value, metaData, record) {
								try {
									return '<span style="color:red">' + value.format('d') + '</span>.' + value.format('m.Y');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Quant.'),
							dataIndex: 'volume',
							width: 80
						}],
						// Detailed data by provided services
						3: [/*{
							header: Ext.app.Localize.get('Date'),
							dataIndex: 'dt',
							id: 'expandcol',
							renderer: function(value, metaData, record) {
								try {
									return value.format('d.m.Y H:i');
								}
								catch(e){
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Period'),
							dataIndex: 'period',
							width: 110,
							renderer: function(value, metaData, record) {
								try {
									return value.format('d.m.Y');
								}
								catch(e){
									return value;
								}
							}
						}, */
						    {
								header: Ext.app.Localize.get('Write-off'),
								dataIndex: 'amount',
								width: 120,
								renderer: function(value, metaData, record) {
									try {
										return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
									}
									catch(e){
										return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
									}
								}
							},
						    {
							header: Ext.app.Localize.get('User'),
							dataIndex: 'user_name',
                            id: 'expandcol',
							width: 130,
							renderer: function(value, metaData, record) {
								if(record.get('vg_id') == 0) {
									return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
								}
								return value;
							}
						}, {
							header: Ext.app.Localize.get('Account'),
							dataIndex: 'vg_login',
							width: 130,
							renderer: function(value, metaData, record) {
								if(record.get('vg_id') == 0) {
									return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
								}
								return value;
							}
						}, {
							header: Ext.app.Localize.get('Operator'),
							dataIndex: 'oper_descr',
							hidden: true,
							width: 135
						}, {
							header: Ext.app.Localize.get('Agreement'),
							dataIndex: 'agrm_num',
							id: 'agrmcol',
							hidden: true,
							width: 130
						}, {
							header: Ext.app.Localize.get('Tarif'),
							dataIndex: 'tar_descr',
							width: 130,
							renderer: function(value) {
								if(value == '') {
									return Ext.app.Localize.get('Undefined')
								}
								else{
									return value
								}
							}
						}, {
							header: Ext.app.Localize.get('Category'),
							dataIndex: 'cat_descr',
							width: 130,
							renderer: function(value) {
								if(value == ''){
									return Ext.app.Localize.get('Undefined');
								}
								else{
									return value;
								}
							}
						}, {
							header: Ext.app.Localize.get('Quant.'),
							dataIndex: 'volume',
							width: 50
						}]
					},
					defaults: {
						sortable: true
					}
				}),
				// Top tool bar of the telephony grid
				tbar: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Go back to common statistics'),
					iconCls: 'ext-levelup',
					disabled: true,
					handler: gotoCommon
				}],
				// Bottom tool bar of the telephony grid
				bbar: new Ext.PagingToolbar({
					pageSize: PAGELIMIT,
					store: Store,
					displayInfo: true,
					items: ['-', {
						xtype: 'container',
						width: 400,
						layout: 'hbox',
						items: [{
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
								data: [['100'], ['500']],
								fields: ['id']
							}),
							listeners: {
								select: function(){
									PAGELIMIT = this.getValue() * 1;
									this.ownerCt.ownerCt.pageSize = PAGELIMIT;
									Store.setBaseParam('limit', PAGELIMIT);
								}
							}
						}, {
							xtype: 'tbseparator',
							style: {
								marginTop: '2px'
							},
							width: 8
						}, {
							xtype: 'container',
							style: {
								paddingTop: '4px',
								paddingLeft: '3px'
							},
							html: Ext.app.Localize.get('t-Group') + ':&nbsp;'
						}, groupCombo]
					}]
				})
			}]
		}]
	});

	// Event trigger to show short menu on row click to show detail data
    TraffVgDet.on('action', function(grid, record, rowIndex, e){
		if (!this['menu']) {
			var handler = function(A, record){
				this.grid.store.baseParams.vgid = record.get('vg_id');

				if(record.get('vg_id') == 0) {
					this.grid.store.baseParams.showdef = 1;
				}

				this.grid.getTopToolbar().findById('gobacktraff').enable();

				this.grid.groupitem.fireEvent('beforeselect', this);
				this.grid.groupitem.setValue(A);
				this.grid.groupitem.fireEvent('select', this);
				this.grid.store.reload({
					params: {
						start: 0
					}
				});
			}.createDelegate({
				grid: grid
			});

			this.menu = new Ext.menu.Menu({
				enableScrolling: false,
				items: [{
					text: Ext.app.Localize.get('Category'),
					handler: function() {
						handler(4, this.ownerCt.record);
					}
				}, {
					text: Ext.app.Localize.get('Addresses'),
					handler: function() {
						handler(3, this.ownerCt.record);
					}
				}, {
					text: Ext.app.Localize.get('Protocol'),
					handler: function() {
						handler(5, this.ownerCt.record);
					}
				}, {
					text: Ext.app.Localize.get('Sessions'),
					handler: function() {
						handler(3, this.ownerCt.record);
					}
				}],
				module: this.grid.ownerCt.ownerCt.getTopToolbar().findById('module'),
				listeners: {
					beforeshow: function(menu) {
						menu.items.each(function(item, key){
							if (this.type == 6) {
								switch(key) {
									case 3: item.show(); break;
									default: item.hide();
								}
							}
							else {
								switch(key) {
									case 0: item[this.record.get('vg_id') > 0 ? 'show' : 'hide'](); break;
									case 3: item.hide(); break;
									default: item.show();
								}
							}
						}, {
							record: this.record,
							type: this.module.store.getAt(this.module.store.find('id', this.module.getValue())).get('type')
						})
					}
				}
			});
		};

		if(this['menu']) {
			this.menu.record = record;
			this.menu.showAt(e.getXY())
		}
    });

	var CommonVgDet = function(grid, record, rowIndex, e){
		grid.store.setBaseParam('vgid', record.get('vg_id'));
		grid.store.setBaseParam('operid', record.get('oper_id'));
		if (record.get('c_date')) {
            grid.store.setBaseParam('c_date', record.get('c_date').format('Y-m-d'));
        }

		if(record.get('vg_id') == 0) {
			grid.store.setBaseParam('showdef', 1);
		}

		grid.getTopToolbar().items.first().enable();

		grid.groupitem.fireEvent('beforeselect', this);
		grid.groupitem.setValue(3);
		grid.groupitem.fireEvent('select', this);
		grid.store.reload({
			params: {
				start: 0
			}
		});
	};

	TellVgDet.on('action', CommonVgDet);
	ServVgDet.on('action', CommonVgDet);

	new Ext.grid.GridPanel({
		renderTo: 'SumPanelPlace',
		title: Ext.app.Localize.get('Total'),
		id: 'SumPanel',
		hidden: true,
		hideParent: true,
		hideMode: 'display',
		autoHeight: true,
		width: 1018, //958
		autoExpandColumn: 'expandcol',
		listeners: {
			beforeshow: function() {
				var M = Ext.getCmp('statpanel').getTopToolbar().findById('module');
				if( -1 === M.store.find('id', M.getValue()) ){
					return;
				}
				switch(M.store.getAt(M.store.find('id', M.getValue())).get('type')) {
					case 7:
					case 8:
					case 9:
					case 10:
					case 11:
					case 12:
						this.getColumnModel().setConfig(this.getColumnModel().configs[1]);
					break;

					case 13:
						this.getColumnModel().setConfig(this.getColumnModel().configs[2]);
					break;

					default:
						this.getColumnModel().setConfig(this.getColumnModel().configs[0]);
				}
				return true;
			},
			render: function() {
				this.getColumnModel().configs[0] = this.getColumnModel().config;
			},
			hide: function() {
				this.store.removeAll();
			}
		},
		store: new Ext.data.ArrayStore({
			fields: [
				{ name: 'descr', type: 'string' },
				{ name: 'volume_in', type: 'float' },
				{ name: 'volume_out', type: 'float' },
				{ name: 'volume', type: 'float' },
				{ name: 'cnt_in', type: 'int' },
				{ name: 'cnt_out', type: 'int' },
				{ name: 'duration_in', type: 'int' },
				{ name: 'duration_out', type: 'int' },
				{ name: 'amount', type: 'float' },
				{ name: 'curr_id', type: 'int' },
				{ name: 'curr_symbol', type: 'string' }]
		}),
		cm: new Ext.grid.ColumnModel({
			defaultWidth: 150,
			columns: [
					{
						header: Ext.app.Localize.get('Cost'),
						dataIndex: 'amount',
						renderer: function(value, metaData, record) {
							return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
						}
					},
			          {
				header: '&nbsp;',
				id: 'expandcol',
				renderer: function(value, metaData, record) {
					if(record.get('curr_id') == 0) {
						return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
					}
					return '&nbsp;';
				}
			}, {
				header: Ext.app.Localize.get('Incoming') + ' (' + Ext.app.Localize.get('Mb') + ')',
				dataIndex: 'volume_in'
			}, {
				header: Ext.app.Localize.get('Outgoing') + ' (' + Ext.app.Localize.get('Mb') + ')',
				dataIndex: 'volume_out'
			}, {
				header: Ext.app.Localize.get('Sum') + ' (' + Ext.app.Localize.get('Mb') + ')',
				dataIndex: 'volume'
			}],
			configs: {
				1: [
					{
						header: Ext.app.Localize.get('Write-off'),
						dataIndex: 'amount',
						renderer: function(value, metaData, record){
							try {
								return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
							}
							catch (e) {
								return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
							}
						}
					},
				    {
					header: '&nbsp;',
					id: 'expandcol',
					width: 186,
					renderer: function(value, metaData, record) {
						if(record.get('curr_id') == 0) {
							return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
						}
						return '&nbsp;';
					}
				}, {
					header: Ext.app.Localize.get('Incom') + '.',
					dataIndex: 'cnt_in'
				}, {
					header: Ext.app.Localize.get('Duration'),
					dataIndex: 'duration_in',
					renderer: function(value, metaData, record, rowIndex, colIndex, store) {
						return Duration(value);
					}
				}, {
					header: Ext.app.Localize.get('Outg-ng') + '.',
					dataIndex: 'cnt_out'
				}, {
					header: Ext.app.Localize.get('Duration'),
					dataIndex: 'duration_out',
					renderer: function(value) {
						return Duration(value);
					}
				}],
				2: [{
					header: '&nbsp;',
					id: 'expandcol',
					width: 786,
					renderer: function(value, metaData, record) {
						if(record.get('curr_id') == 0) {
							//return '<span style="font-style:italic">' + Ext.app.Localize.get('Undefined traffic') + '</span>';
                            return '&nbsp;';
						}
						return '';
					}
				}, {
					header: Ext.app.Localize.get('Write-off'),
					dataIndex: 'amount',
					renderer: function(value, metaData, record) {
						try {
							return value.toFixed(2) + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '')
						}
						catch(e){
							return value + (record.get('curr_symbol') ? ' (' + record.get('curr_symbol') + ')' : '');
						}
					}
				}]
			}
		})
	});
} // end


/**
 * This function creates extened filter for global usage
 * @param	Object, to link this created
 */
function ExtendedFilter(caller)
{
	if(!Ext.isDefined(caller)) {
		return false;
	}

	if(Ext.getCmp('ExtFilter')) {
		return Ext.getCmp('ExtFilter');
	}

	return (new Ext.Window({
		title: Ext.app.Localize.get('Filter'),
		id: 'ExtFilter',
		closable: false,
		minimizable: true,
		collapsible: true,
		monitorResize: true,
		width: 400,
		autoHeight: true,
		saveParams: function() {
			var params = [];
			this.items.first().items.each(function(item){
				var param = item.items.first().getForm().getFieldValues();
				Ext.iterate(item.items.first().getForm().getValues(), function(key, item){
					this[key] = item;
				}, param);
				this.push(param);
			}, params);
			Ext.each(params, function(item){
				if(Ext.isObject(item)) {
					Ext.iterate(item, function(key, value){
						if (key.substr(0, 3) != 'ext') {
							this.setBaseParam(key, value);
						}
					}, this);
				}
			}, this.panel.getGrid().store);
		},
		restoreParams: function() {
			this.items.first().items.each(function(item){
				item.items.first().getForm().setValues(this.baseParams);
			}, this.panel.getGrid().store);
		},
		listeners: {
			minimize: function(win){
				this.toggle(false, true);
				win.hide();
			}.createDelegate(caller),
			hide: function() {
				this.saveParams();
			},
			show: function(win) {
				this.restoreParams()
			}
		},
		items: {
			xtype: 'tabpanel',
			activeTab: 0,
			height: Ext.isIE ? 197 : 'auto',
			autoHeight: Ext.isIE ? false : true,
			deferredRender: true,
			items: [{
				title: Ext.app.Localize.get('Calls'),
				items: {
					xtype: 'form',
					frame: true,
					autoHeight: true,
					labelWidth: 130,
					items: [{
						xtype: 'textfield',
						name: 'numto',
						fieldLabel: Ext.app.Localize.get('Direction mask'),
						width: 180
					}, {
						xtype: 'textfield',
						fieldLabel: Ext.app.Localize.get('Source mask'),
						name: 'numfrom',
						width: 180
					}, {
						xtype: 'checkbox',
						fieldLabel: Ext.app.Localize.get('Incoming-e'),
						name: 'cin',
						inputValue: true
					}, {
						xtype: 'checkbox',
						fieldLabel: Ext.app.Localize.get('Outgoing-e'),
						name: 'cout',
						inputValue: true
					}, {
						xtype: 'numberfield',
						fieldLabel: Ext.app.Localize.get('Cost'),
						name: 'amountfrom',
						width: 120
					}, {
						xtype: 'compositefield',
						fieldLabel: Ext.app.Localize.get('Duration') + ' (' + Ext.app.Localize.get('sec-s') + ')',
						msgTarget: 'side',
						items: [{
							xtype: 'numberfield',
							id: 'durfrom',
							width: 80
						}, {
							xtype: 'displayfield',
							width: 7,
							value: ' - '
						}, {
							xtype: 'numberfield',
							id: 'durto',
							width: 80
						}]
					},{
						xtype: 'checkbox',
						fieldLabel: Ext.app.Localize.get('Post-loaded traffic'),
						name: 'additional',
						inputValue: true
					}]
				}
			}]
		}
	}));
} // end ExtendedFilter()


/**
 * Show sessions for RADIUS
 * @param	object, module record
 */
function showSessions(record)
{
	if(Ext.isEmpty(record)){
		return false;
	}

	// Let it be global define for the page limit
	var PAGELIMIT = 100;

	compactForm = function(items, object){
		if (Ext.isEmpty(items)) {
			return false;
		};

		var form = new Ext.form.FormPanel({
			id: 'compactForm',
			renderTo: Ext.getBody(),
			url: 'config.php',
			items: items
	    });

	    form.getForm().submit({
			method: 'POST',
			waitTitle: Ext.app.Localize.get('Connecting'),
			waitMsg: Ext.app.Localize.get('Sending data') + '...',
			params: {
				devision: 104,
				async_call: 1
			},
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
					Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.errors.reason);
				}
		    		form.destroy();
			}
		})
	}

	getSelected = function(o){
		var A = [];
		Ext.each(o.getSelectionModel().getSelections(), function(r){
			this.items.push({
				xtype: 'hidden',
				name: 'stopsession[]',
				value: r.data.session_id
			});
		}, { items: A });
		A.push({
			xtype: 'hidden',
			name: 'module',
			value: record.get('id')
		});
		compactForm(A, [Ext.getCmp('actSessions').store]);
	}

	// Storage
	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'start_time', type: 'date', dateFormat: 'Y-m-d H:i:s' },
			{ name: 'user_name', type: 'string' },
			{ name: 'vg_login', type: 'string' },
			{ name: 'session_id', type: 'string' },
			{ name: 'updatetime', type: 'string' },
			{ name: 'sess_ani', type: 'string' },
			{ name: 'sess_dnis', type: 'string' },
			{ name: 'shape', type: 'int' },
			{ name: 'nas', type: 'string' },
			{ name: 'assigned_ip', type: 'string' },
			{ name: 'direction', type: 'int' },
			{ name: 'outer_vlan', type: 'string' }
		]),
		baseParams:{
			async_call: 1,
			devision: 104,
			getsessions: record.get('id'),
			search: '',
			search_type: null,
			start: 0,
			limit: PAGELIMIT
		}
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});
	
	var StateCookie = Ext.util.Cookies.get("ys-actSessions");

	new Ext.Window({
		title: Ext.app.Localize.get('Active sessions') + ': ' + record.get('name'),
		layout: 'fit',
		width: 1200,
		height: 590,
		items: {
			xtype: 'grid',
			id: 'actSessions',
			autoExpandColumn: 'start_time',
			loadMask: true,
			sm: sm,
			listeners: {
			    beforerender: function(grid) {
			        // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
			    }
			},
			tbar: [{
				xtype: 'button',
				iconCls: 'ext-stop',
				text: Ext.app.Localize.get('Stop'),
				handler: function(B){
					getSelected(B.ownerCt.ownerCt)
				}
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Reload data'),
				handler: function(){
					this.ownerCt.ownerCt.store.reload();
				}
			},

			'->',
			{
				xtype: 'combo',
				IE8Fix: false,
				width: 150,
				displayField: 'name',
				valueField: 'id',
				name: 'search_type',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: 'login',
				editable: false,
				store: new Ext.data.SimpleStore({
					data: [
						['number', 		Ext.app.Localize.get('Agreement')		  	],
						['login', 		Ext.app.Localize.get('Account login')		],
						['assignedip',  'IP ' + Ext.app.Localize.get('address')		],
						['sessionid', 	Ext.app.Localize.get('Session') + ' (ANI)'	],
						['devname',     Ext.app.Localize.get('Device name')  ]
					],
					fields: ['id', 'name']
				}),
				listeners: {
					select: function() {
						this.ownerCt.ownerCt.getStore().setBaseParam('search_type', this.getValue())
					}
				}
			}, {
				xtype: 'tbspacer',
				width: 3
			},
			{
				name: 'search',
				id: '_actSessions_search',
				xtype: 'textfield',
				listeners: {
					afterrender: function() {
						this.on('specialkey', function(f, e){
							if (e.getKey() == e.ENTER) {
								this.ownerCt.ownerCt.getStore().setBaseParam('search',Ext.getCmp('_actSessions_search').getValue());
								this.ownerCt.ownerCt.getStore().reload({
									params: {
										limit: 100,
										start: 0
									}
								})
							}
						}, this);
					}
				}
			},
			{
				xtype: 'button',
				iconCls: 'ext-search',
				handler: function(){
					Ext.getCmp('actSessions').getStore().setBaseParam('search',Ext.getCmp('_actSessions_search').getValue());
					Ext.getCmp('actSessions').getStore().reload({
						params: { start: 0, limit: 100, alldata: 1 }
					});
					//Ext.getCmp('_segmentsList').getView().refresh();
				}
			},
			'&nbsp;'

			],
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: Store,
				displayInfo: true,
				items: ['-', {
					xtype: 'container',
					width: 400,
					layout: 'hbox',
					items: [{
						xtype: 'combo',
						width: 70,
						displayField: 'name',
						valueField: 'id',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						value: PAGELIMIT,
						editable: false,
						store: new Ext.data.ArrayStore({
							data: [
								[100, '100'],
								[500, '500'],
								[1000, '1000'],
								[0, Ext.app.Localize.get('All')]],
							fields: ['id', 'name']
						}),
						listeners: {
							select: function(){
								PAGELIMIT = this.getValue() * 1;
								this.ownerCt.ownerCt.pageSize = PAGELIMIT;
								Store.setBaseParam('limit', PAGELIMIT);
								Store.reload({
									params: {
										start: 0
									}
								});
							}
						}
					}]
				}]
			}),
			store: Store,
			cm: new Ext.grid.ColumnModel({
				stateful: true,
				stateId: 'actSessions',
				columns: [ sm, {
					header: Ext.app.Localize.get('Begining'),
					dataIndex: 'start_time',
					id: 'start_time',
					renderer: function(value){
						try{
							return value.format('Y-m-d H:i')
						}
						catch(e){
							return value;
						}
					}
				}, {
					header: Ext.app.Localize.get('Session ID'),
					dataIndex: 'session_id',
					width: 120
				}, {
					header: Ext.app.Localize.get('User'),
					dataIndex: 'user_name',
					width: 120
				}, {
					header: Ext.app.Localize.get('Account'),
					dataIndex: 'vg_login',
					width: 120
				}, {
					header: Ext.app.Localize.get('Refreshing'),
					dataIndex: 'updatetime',
					width: 120,
					hidden: !StateCookie ? true : undefined
				}, {
					header: Ext.app.Localize.get('Direct'),
					dataIndex: 'direction',
					width: 80,
					hidden: !StateCookie ? true : undefined,	
					renderer: function(value){
						if(value == 1){
							return Ext.app.Localize.get('Incom') + '.'
						}
						else{
							return Ext.app.Localize.get('Outg-ng') + '.'
						}
					},
					//hidden: (record.get('type') == 6) ? true : false
				}, {
					header: Ext.app.Localize.get('Number') + ' A',
					width: 100,
					dataIndex: 'sess_ani',
					hidden: !StateCookie ? true : undefined
					//hidden: (record.get('type') == 6) ? true : false
				}, {
					header: Ext.app.Localize.get('Number') + ' ' + Ext.app.Localize.get('B'),
					width: 100, dataIndex: 'sess_dnis',
					hidden: !StateCookie ? true : undefined
					//hidden: (record.get('type') == 6) ? true : false
				}, {
					header: Ext.app.Localize.get('Assigned IP'),
					dataIndex: 'assigned_ip',
					width: 120,
					hidden: (record.get('type') == 12) ? true : false
				}, {
					header: 'MAC-' + Ext.app.Localize.get('address'),
					dataIndex: 'sess_ani',
					width: 120,
					hidden: (record.get('type') == 12) ? true : false,
					editor: new Ext.form.TextField({})
				}, {
					header: 'IP NAS',
					dataIndex: 'nas',
					width: 100
				}, {
					header: Ext.app.Localize.get('Shape'),
					dataIndex: 'shape',
					width: 65,
					hidden: (record.get('type') == 12) ? true : false
				}, {
				    header: Ext.app.Localize.get('VLAN'),
				    dataIndex: 'outer_vlan',
				    width: 65,
				    hidden: (record.get('type') == 12) ? true : false
				}],
			defaults: {
				//menuDisabled: true,
				sortable: true
			}}
		)}
	}).show(null, function(win) {
	    win.get(0).getStore().reload({
            params: {
                start: 0
            }
        });
	});
} // end showSessions()

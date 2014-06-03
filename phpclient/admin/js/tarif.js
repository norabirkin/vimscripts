/**
 * Tariff javascript engine based on ExtJS library
 *
 * Repository information:
 */

var weekDaysList = false;


/**
 * Form components and storages handler with global defines
 *
 */
var Storages = {
	autoSave: true,
	categories: { timedisc: false, sizedisc: false, routes: false },
	directions: false,
	getCurrency: function(){ try{ var A = Ext.get('_curid_').dom; for(var i = 0, off = A.options.length; i < off; i++){ if(A.options[i].selected){ return ({ curid: A.options[i], name: A.options[i].text, symbol: nodeAttributes(A.options[i]).symbol }); } }; return ({ curid: 0, name: Localize.cu, symbol: Localize.cu }) } catch(e){ alert(e.toString()) }},
	discToForm: function(formObj){
		for(var i in this.categories){
			this.categories[i].each(function(record, idx) {
				for(var j in record.data){
					if(j == 'remove') {
						continue
					};
					formObj.add({ xtype: 'hidden', id: '_' + i + '[' + idx + '][' + j + ']_', name: i + '[' + idx + '][' + j + ']', value: record.data[j] });
				}
			}, this);
			if(this.categories[i].getCount() > 0) {
				formObj.doLayout(true);
			}
		}
	},
	discUnForm: function( formObj ){ for(var i in this.categories){ this.categories[i].each(function(record, idx){ for(var j in record.data){ formObj.remove(Ext.getCmp('_' + i + '[' + idx + '][' + j + ']_')); formObj.doLayout(); } }, this); } },
	extract: function( _formId ) {
		this.runningObject = '';
		for(var i in this.objects){
			if(this.objects[i] == false){
				continue;
			};
			this.runningObject = i;
			this.objects[i].each(function(record, idx){
				for(var j in record.data){
					if(j == 'remove'){
						continue;
					};
					createHidOrUpdate(_formId, i + '[' + idx + '][' + j + ']', record.data[j]);
				}
			}, this);
		}
	},
	getCatEl: function() { try{ return document.getElementById('_catnumbers_') } catch(e){ return null } },
	getCatType: function() { if(this.tarType() == 3 || this.tarType() == 4) { return 3 } if(this.tarType() == 0) { var cat = this.getCatEl(); try{ for(var i = 0, off = cat.options.length; i < off; i++){ if(cat.options[i].selected){ return nodeAttributes(cat.options[i]).type }}} catch(e){ return 1 }}},
	getCatOwner: function() {
		var cat = this.getCatEl();
		try{
			for(var i = 0, off = cat.options.length; i < off; i++){
				if(cat.options[i].selected){
					return nodeAttributes(cat.options[i]).ownerid
				}
			}
		}
		catch(e){
			return 0;
		}
	},
	isOperMode: function() { if(this.operMode.is == null){ try{ if(document.getElementById('_operators_').value == 1){ this.operMode.is = true; } else{ this.operMode.is = false; } } catch(e){ this.operMode.is = false; } }; return this.operMode.is;},
	modified: function(node) {
		if(Ext.isEmpty(node)) { return this.modifiedNode.id; }
		if(node == false) { this.modifiedNode.id = false; this.modifiedNode.attributes = { }; return false; }
		if(node == true) { var node = Ext.getCmp('catList').getSelectionModel().getSelectedNode(); if(Ext.isEmpty(node)){ return false; } }
		if(typeof node == 'object') { this.modifiedNode.id = node.id; this.modifiedNode.attributes = node.attributes; return true; }
	},
	modifiedNode: { id: false, attributes: { } },
	node: { id: -1, text: 'New', leaf: true, tarid: 0, catidx: -1, includes: 0, common: 0, descr: 'New', above: 0, disprior: 0, operid: 0, catid: 0, freeseconds: 0, minchargedur: 0, roundseconds: 0, permabove: 0, admblockabove: 0, usrblockabove: 0, enabled: 0, available: 0 },
	objects: { timeshp: false, sizeshp: false },
	operMode: {
		Aprefix: 'operid_',
		Bprefix: 'catalog_',
		CtgControl: '_catnumbers_',
		OprControl: '_operators_',
		catalog: [],
		data: [],
		elused: [],
		is: null,
		operators: [],
		add: function(A) {
			try{
				this.data[this.catalog[A].operid].trigger(A, true);
				this.elused[A] = this.catalog[A].catname;
				this.upCatEl();
			}
			catch(e) {
				return false;
			};
			if(!Ext.isEmpty(A)){
				this.update();
			}
		},
		create: function(A, B, C){
			for(var i in B){
				if(typeof B[i] == 'function') {
					continue;
				};
				try {
					var item = A.menu.add({
						id: (!C ? this.Aprefix : this.Bprefix) + i,
						text: (!C ? this.operators[i] : this.catalog[i].catname),
						menu: (!C ? [] : null),
						hidden: (!C ? false : ((B[i] == true) ? false : true)),
						handler: (C ? function(){
							var A = Storages.operMode;
							var B = A.getCatById(this.id);
							A.add(B);
							newTreeNode(A.catalog[B]);
						} : null)
					});
					if(!C && B[i].length > 0){
						this.create(item, B[i], true);
					};
				} catch(e){ }
			}
		},
		getCatById: function(A) {
			if(!Ext.isEmpty(A)){
				for(var i in this.catalog){
					if(this.Bprefix + i == A){
						return i;
					}
				};
				return 0;
			}
		},
		init: function(A, B) {
			if(!B.operators[A.data.operid]) {
				B.operators[A.data.operid] = A.data.opername;
				B.data[A.data.operid] = [];
				B.data[A.data.operid].triggerAll = function(A){
					for(var i in this){
						if(typeof this[i] == 'function'){
							continue;
						};
						this[i] = A;
					}
				};
				B.data[A.data.operid].trigger = function(A, B){
					this.triggerAll(false);
					if(B == true){
						try{
							this[A] = B;
						}
						catch(e){ }
					}
				};
			};
			if(!B.catalog[A.data.catid]){
				B.catalog[A.data.catid] = { catname: A.data.catname, operid: A.data.operid, catid: A.data.catid, opername: A.data.opername }; B.data[A.data.operid][A.data.catid] = false;
			};
		},
		isUsed: function(){
			if(Ext.isEmpty(this.operMode)) {
				try{
					if(Ext.get(this.OprControl).getValue() == 1) {
						this.operMode = true;
					}
					else {
						throw('Cannot get operators hidden control to identify');
					}
				}
				catch(e){
					this.operMode = false;
				}

				if(this.operMode) {
					this.getElUsed(this.CtgControl);
				}
			}

			return this.operMode;
		},
		syncToElUsed: function() {
			this.triggerAll(true);
			if(this.elused.length > 0){
				try{
					for(var i in this.elused){
						if(typeof this.catalog[i] == 'function') {
							continue;
						};
						this.data[this.catalog[i].operid].trigger(i, true);
					}
				} catch(e){ }
			}
		},
		getElUsed: function(A) {
			var A = A || this.CtgControl;
			var items = [];

			try{
				var items = Ext.get(A).getValue().split(',');
			} catch(e){ }

			Ext.each(items, function(item){
				this.elused[item] = this.elused[item];
			}, this);

			this.elused.remove = function(A){
				delete this[A];
			}
		},
		triggerAll: function(A){ for(var i in this.catalog){ if(typeof this.catalog[i] == 'function'){ continue; }; this.data[this.catalog[i].operid].triggerAll(A); }},
		remove: function(A){
			try{
				this.data[this.catalog[A].operid].triggerAll(true);
				delete this.elused[A];
				this.upCatEl();
			} catch(e){ };
			if(!Ext.isEmpty(A)){
				this.update();
			}
		},
		update: function() {
			Ext.each(this.catalog, function(item, i){
				try{
					if(this.data[item.operid][i] == true) {
						Ext.getCmp(this.Bprefix + i).show();
					}
					else {
						Ext.getCmp(this.Bprefix + i).hide();
					}
				}
				catch(e){ }
			}, this);
		},
		upCatEl: function(A){
			if(Ext.isEmpty(A)){
				var A = '_catnumbers_';
			};
			try{
				var B = [];
				for(var i in this.elused){
					if(typeof this.elused[i] == 'function' || i == 0){
						continue;
					};
					B[B.length] = i;
				};
				createHidOrUpdate('_Tarif', 'catnumbers', B.join(','));
			}
			catch(e){ return false; }
		}
	},
	Row: { Grid: false, rowIndex: false, columnIndex: false,
		dayLine: function(row) {
			var inline = new Array();
			for(i in row) {
				if(!row[i]) {
					continue;
				}
				switch(i){
					case 'mon':
					case 'tue':
					case 'wed':
					case 'thu':
					case 'fri':
					case 'sat':
					case 'sun':
						inline[ inline.length ] = Localize[Ext.util.Format.capitalize(i)];
				}
			};
			return inline.join(', ');
		},
		disType: function(value){ if(value == 0) return '%'; else return Localize.cu; } },
	tarType: function(){
		if(!this.tarifType) {
			if(!document.getElementById('_type_')) {
				this.tarifType = { value: 0 };
			}
			else {
				this.tarifType = document.getElementById('_type_');
			}
		}
		return this.tarifType.value;
	},
	used: function() { if(!document.getElementById('_used_')) { return false; } else { return true } },
	dynRoute: function() { try{ if(document.getElementById('_dynroute_').value > 0){ return true; } else{ return false; } } catch(e){ return false } }
}

/**
 * Run this function when document is already loaded
 *
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
	weekDaysList = new Ext.Window({ closable: false, hideLabel: true, frame: false, shadow: false, resizable: false, items: new Ext.FormPanel({ frame: true, hideLabel: true, width: 240, items: [{ xtype: 'checkboxgroup', id: 'daysList', vertical: true, hideLabel: true, columns: 4, items: [{boxLabel: Localize.Mon, id: 'ext-week-mon', name: 'mon', checked: true}, {boxLabel: Localize.Tue, id: 'ext-week-tue', name: 'tue', checked: true}, {boxLabel: Localize.Wed, id: 'ext-week-wed', name: 'wed', checked: true}, {boxLabel: Localize.Thu, id: 'ext-week-thu', name: 'thu', checked: true}, {boxLabel: Localize.Fri, id: 'ext-week-fri', name: 'fri', checked: true}, {boxLabel: Localize.Sat, id: 'ext-week-sat', name: 'sat', checked: true},{boxLabel: Localize.Sun, id: 'ext-week-sun', name: 'sun', checked: true}] }], buttons: [{ text: Localize.Add, handler: function(){ var InLine = new Array(); Ext.getCmp('daysList').items.each(function(item){ try { Storages.Row.Grid.store.getAt(Storages.Row.rowIndex).data[item.name] = (item.checked) ? 1 : 0; InLine[ item.name ] = item.checked; } catch(e) { alert(e.toString() )} }); Storages.Row.Grid.store.getAt(Storages.Row.rowIndex).data.inline = Storages.Row.dayLine(InLine); Storages.Row.Grid.store.fireEvent('datachanged'); weekDaysList.hide(); }}, { text: Localize.Cancel, handler: function() { weekDaysList.hide() } }] }), listeners: { show: function(){ var row = Storages.Row.Grid.store.getAt(Storages.Row.rowIndex).data; for(var i in row) { try { Ext.getCmp('ext-week-' + i).setValue(row[i]) } catch(e) { } }}} });

	ShaperGridOnTime('_ShaperTime');
	ShaperGridOnValue('_ShaperSize');
	categoryForm('_Categories');
	syncSymbolDisplay();
});


/**
 * Parse all tag to find and change currency symbol display
 *
 */
function syncSymbolDisplay() {
    var A = ['current', 'permabove', 'admblockabove', 'usrblockabove', 'currentoff', 'minsumcurr', 'currbon', 'currabove'];
    for (var i = 0, off = A.length; i < off; i++) {
        try {
            Ext.get(A[i]).dom.innerHTML = Storages.getCurrency().symbol
        } catch (e) {}
    };
    var items = [];
    if (Storages.tarType() != 5) {
        items.push(Ext.getCmp('timeDiscCombo').store), items.push(Ext.getCmp('sizeDiscCombo').store)
    };
    var C = {
        items: items,
        change: function() {
            for (var i = 0, off = this.items.length; i < off; i++) {
                this.items[i].remove(this.items[i].getAt(0));
                this.items[i].insert(0, new this.items[i].recordType({
                    type: 1,
                    name: Storages.getCurrency().symbol
                }))
            }
        }
    };
    C.change();
} // end syncSymbolDisplay()


/**
 * Get and returns current tarif type
 *
 */
function tarifType(){
	return Storages.tarType();
} // end tarifType()


/**
 * Service unit to dissplay fot the selected tarif type
 * @param	string
 * @param	string
 */
function unitOnType( unit_1, unit_2 ) {
	if(Ext.isEmpty(unit_1) || Ext.isEmpty(unit_2)) {
		return '';
	}
	try {
		var control = document.getElementById('_type_');
		switch(parseInt(control.value)) {
			case 2: case 3: case 4:
				return unit_2;
			default: return unit_1;
		}
	} catch(e) { }
} // end unitOnType()


/**
 * To set read only or disabled status to all elements in the specified container
 * @param	string, container id
 * @param	array, elements id to exclude
 */
function setReadOnly(parentSetId, excludeId) {
	if(!Ext.isArray(excludeId)) {
		excludeId = [];
	}
	Ext.getCmp(parentSetId).items.each(function(child) {
        if(excludeId.indexOf(child.getId()) < 0 && child.hiddenName != 'catidxmaster') {
            switch(child.xtype) {
				case 'field': case 'checkbox': case 'combo':
					child.disable();
				break;
			}
		}else{
            child.enable();
        }
	});
} // end setReadOnly()


/**
 * To set enabled status to all elements in the specified container
 * @param	string, container id
 * @param	array, elemets id to exculde
 */
function setWrite(parentSetId, excludeId) {
	if(!Ext.isArray(excludeId)) {
		excludeId = [];
	}
	Ext.getCmp(parentSetId).items.each(function(child) {
		if(excludeId.indexOf(child.getId()) < 0) {
			switch(child.xtype) {
				case 'field': case 'checkbox': case 'combo':
					child.enable();
				break;
			}
		}
	});
} // end setWrite()

/**
 * Shape rate settings Grid object
 * Day and time shape rate configuration table
 * @param	string, dom element to render to
 */
function ShaperGridOnTime( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var tarifId = document.getElementById('_tarif_').value; } catch(e) { var tarifId = 0 }
	var fm = Ext.form;
	var checkCal = new Ext.grid.CheckColumn({ header: Localize.Cal, dataIndex: 'useweekend', width: 57 });
	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });
	var ColModel = new Ext.grid.ColumnModel([{ 
		header: Localize.Since, 
		dataIndex: 'timefrom', 
		width: 65, 
		sortable: true,
		editor: new fm.TextField({ 
			allowBlank: false, 
			maskRe: new RegExp("[0-9\:]") 
		}) }, 
		{ 
			header: Localize.Till, 
			dataIndex: 'timeto', 
			width: 65, 
			sortable: true, 
			editor: new fm.TextField({ 
				allowBlank: false, 
				maskRe: new RegExp("[0-9\:]") 
			})
		}, 
		{ 
			header: Localize.WeekD, 
			dataIndex: 'inline', 
			width: 175 
		}, 
		checkCal, 
		{ header: Localize.ShpRate + ' (Kbit/sec)', dataIndex: 'shaperate', width: 88, sortable: true, editor: new fm.NumberField({ allowBlank: false, allowNegative: false }) }, checkRemove ]);
	var Rows = Ext.data.Record.create([ 
		{ name: 'id', type: 'int' }, 
		{ name: 'timefrom', type: 'string' }, 
		{ name: 'timeto', type: 'string' }, 
		{ name: 'mon', type: 'int' }, 
		{ name: 'tue', type: 'int' },
		{ name: 'wed', type: 'int' }, 
		{ name: 'thu', type: 'int' }, 
		{ name: 'fri', type: 'int' }, 
		{ name: 'sat', type: 'int' },
		{ name: 'sun', type: 'int' }, 
		{ name: 'inline', type: 'string' }, 
		{ name: 'useweekend', type: 'int' }, 
		{ name: 'shaperate', type: 'int' }, 
		{ name: 'remove', type: 'int' } 
	]);
	
	Storages.objects.timeshp = new Ext.data.Store({ 
		proxy: new Ext.data.HttpProxy({ 
			url: 'config.php', 
			method: 'POST'
		}), 
		reader: new Ext.data.JsonReader({ 
			root: 'results', 
			id: 'timeShapeRate' 
		}, Rows),
	baseParams:
		{ async_call: 1, devision: 4, timeshapes: 1, tarif: tarifId }, 
		autoLoad: true, 
		listeners:{ 
			load: function(store) { 
				store.each(
					function(record){ 
						record.data.inline = Storages.Row.dayLine(record.data); 
					}); 
				store.fireEvent('datachanged'); 
			} 
		} 
	});
	var ShpGrid = new Ext.grid.EditorGridPanel({ title: Localize.ShpToDay, autoHeight: true, maxHeight: 200, store: Storages.objects.timeshp, cm: ColModel, renderTo: renderTo, width: 540, frame: false, enableHdMenu: false, plugins: [ checkCal, checkRemove ], clicksToEdit: 1, listeners: { cellclick: function(grid, rowIndex, columnIndex, e) { if(columnIndex != 2) return; Storages.Row.Grid = grid; Storages.Row.rowIndex = rowIndex; Storages.Row.columnIndex = columnIndex; weekDaysList.setPosition(e.getXY()[0], e.getXY()[1]); if(weekDaysList.isVisible()) weekDaysList.fireEvent('show'); else weekDaysList.show(); } }, tbar: [{ xtype: 'button', text: Localize.Add, iconCls: 'ext-add', 
	handler:function(){ 
		var row = new Rows
		({ 
			id: 0, 
			timefrom: '00:00:00', 
			timeto: '00:00:00', 
			mon: true, 
			tue: true, 
			wed: true, 
			thu: true, 
			fri: true, 
			sat: true,
			sun: true,  
			inline: '', 
			useweekend: true, 
			shaperate: 0, 
			remove: false 
		}); 
		row.data.inline = Storages.Row.dayLine(row.data); 
		ShpGrid.stopEditing(); 
		Storages.objects.timeshp.insert(0, row); 
		ShpGrid.startEditing(0, 0);
		
		} 
		},
		'-',
		{ xtype: 'button', 
			text:Localize.Remove, 
			iconCls: 'ext-remove', 
			handler: function() { 
				ShpGrid.stopEditing(); 
				Storages.objects.timeshp.each(function(record){ 
						if(record.data.remove == true){ 
							Storages.objects.timeshp.remove(record); 
						}
				})
			}}] 
		});
} // end ShaperGridOnTime()


/**
 * Shape rate settings Grid object
 * Size shape rate configuration tab
 * @param	string, dom element to render to
 */
function ShaperGridOnValue( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var tarifId = document.getElementById('_tarif_').value; } catch(e) { var tarifId = 0 }
	var fm = Ext.form;
	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });
	var ColModel = new Ext.grid.ColumnModel([ { header: Localize.Size + ' (' + unitOnType(Localize.MB, Localize.min) + ')', dataIndex: 'amount', width: 76, sortable: true, editor: new fm.NumberField({ allowBlank: false, allowNegative: false }) }, { header: Localize.ShpRate + ' (Kbit/sec)', dataIndex: 'shaperate', width: 87, sortable: true, editor: new fm.NumberField({ allowBlank: false, allowNegative: false }) }, checkRemove ]);
	var Rows = Ext.data.Record.create([ { name: 'id', type: 'int' }, { name: 'amount', type: 'int' }, { name: 'shaperate', type: 'int' }, { name: 'remove', type: 'int' } ]);
	Storages.objects.sizeshp = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results', id: 'sizeShaperList' }, Rows), baseParams:{ async_call: 1, devision: 4, sizeshapes: 1, tarif: tarifId }, autoLoad: true });
	var ShpGrid = new Ext.grid.EditorGridPanel({ title: Localize.ShpToSize, enableHdMenu: false, store: Storages.objects.sizeshp, cm: ColModel, renderTo: renderTo, width: 250, autoHeight: true, maxHeight: 200, frame: false, plugins: checkRemove, clicksToEdit: 1, tbar: [{ xtype: 'button', text: Localize.Add, iconCls: 'ext-add', handler: function() { var row = new Rows({ id: 0, amount: 0, rate: 0, remove: false }); ShpGrid.stopEditing(); Storages.objects.sizeshp.insert(0, row); ShpGrid.startEditing(0, 0); } },'-', { xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove', handler: function() { ShpGrid.stopEditing(); Storages.objects.sizeshp.each(function(record) { if(record.data.remove == true) { Storages.objects.sizeshp.remove(record); } }) }}] });
} // end ShaperGridOnValue()


/**
 * Leased line classes engine grid
 * @param	string, DOM element to render to
 */
function categoryForm( renderTo )
{
	try { var tarifId = document.getElementById('_tarif_').value; } catch(e) { var tarifId = 0 }
	try { Storages.operators = document.getElementById('_operators_').value; } catch(e) { Storages.operators = 0 }

	// To remove records from storage
	removeRecord = function(record, recordIdx) { if(record.data.remove == true) { this.store.remove(record); if(Storages.modified() == false) { Storages.modified(true) } } } // end removeRecord()

	// Record construct for the time discounts
	var TimeDRows = Ext.data.Record.create([
		{ name: 'disid', type: 'int' },
		{ name: 'tarid', type: 'int' },
		{ name: 'catidx', type: 'int' },
		{ name: 'type', type: 'int' },
		{ name: 'typedescr', type: 'string' },
		{ name: 'useweekend', type: 'int' },
		{ name: 'mon', type: 'int' },
		{ name: 'tue', type: 'int' },
		{ name: 'wed', type: 'int' },
		{ name: 'thu', type: 'int' },
		{ name: 'fri', type: 'int' },
		{ name: 'sat', type: 'int' },
		{ name: 'sun', type: 'int' },
		{ name: 'inline', type: 'string' },
		{ name: 'discount', type: 'float' },
		{ name: 'timefrom', type: 'string' },
		{ name: 'timeto', type: 'string' },
		{ name: 'remove', type: 'int' }
	]);
	// Record construct for the size discount
	var SizeDRows = Ext.data.Record.create([
		{ name: 'disid', type: 'int' },
		{ name: 'tarid', type: 'int' },
		{ name: 'catidx', type: 'int' },
		{ name: 'type', type: 'int' },
		{ name: 'typedescr', type: 'string' },
		{ name: 'amount', type: 'int' },
		{ name: 'discount', type: 'float' },
		{ name: 'bonus', type: 'float' },
		{ name: 'remove', type: 'int' }
	]);

	try {
		if(Storages.operMode.isUsed()) {
			buildOperStruct = function(store) {
				store.each(function(record) {
					Storages.operMode.init(record, Storages.operMode)
				});
			}
			var Operators = new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
				reader: new Ext.data.JsonReader({ root: 'results' }, [
					{ name: 'catid', type: 'int' },
					{ name: 'catname', type: 'string' },
					{ name: 'operid', type: 'int' },
					{ name: 'opername', type: 'string' }
				]),
				baseParams:{ async_call: 1, devision: 4, getcatlist: 1 },
				autoLoad: true,
				listeners: {
					load: function(store) {
						buildOperStruct(store);
						if(!Ext.isEmpty(Ext.getCmp('_catAddBtn'))) {
							Storages.operMode.syncToElUsed();
							Storages.operMode.create(Ext.getCmp('_catAddBtn'), Storages.operMode.data, false);
						}
					}
				}
			});
		}
	} catch(e) { }

	// Data Store for the time discounts
    Storages.categories.timedisc = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, TimeDRows),
        baseParams: {
            async_call: 1,
            devision: 4,
            timedisc: tarifId,
            category: 0
        },
		listeners: {
			load: function(store){
				store.each(function(record){
					record.data.inline = Storages.Row.dayLine(record.data);
				});
				store.fireEvent('datachanged');
			}
		}
    });

	// Data Store for the size discounts
    Storages.categories.sizedisc = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            id: 'sizeDiscList'
        }, SizeDRows),
        baseParams: {
            async_call: 1,
            devision: 4,
            sizedisc: tarifId,
            category: 0
        }
    });

	// Catalogues direction storage
	Storages.directions = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'catid', type: 'int' },
			{ name: 'zoneid', type: 'int' },
			{ name: 'descr', type: 'string' },
			{ name: 'zonenum', type: 'string' },
			{ name: 'zoneas', type: 'int' },
			{ name: 'zoneas', type: 'int' },
			{ name: 'zoneip', type: 'string' },
			{ name: 'zonemask', type: 'int' },
			{ name: 'port', type: 'int' },
			{ name: 'proto', type: 'int' },
			{ name: 'direction', type: 'int' },
			{ name: 'remove', type: 'int' }
		]),
		baseParams:{
			async_call: 1,
			devision: 4,
			directions: tarifId,
			category: 0,
			dirtype: 1,
			limit: 500,
			start: 0
		} });

	// This variable is need to fix visual bug in the buggest IE
	var fieldSetLeft = [
		{ xtype: 'hidden', name: 'async_call', value: 1 },
		{ xtype: 'hidden', name: 'devision', value: 4 },
		{ xtype: 'hidden', id: '_catsave_', name: 'catsave', value: 1 },
		{ xtype: 'hidden', id: '_tarid_', name: 'tarid', value: tarifId },
		{ xtype: 'hidden', id: '_operid_', name: 'operid', value: 0 },
		{ xtype: 'hidden', name: 'tartype', value: tarifType() },
		{ xtype: 'hidden', id: '_catidx_', name: 'catidx', value: -1 },
        { xtype: 'hidden', id: '_c_saledictionaryid_', name: 'saledictionaryid', value: 0 },
		{ 
        	xtype: 'textfield', 
        	id: '_catdescr_',
        	width: 133, 
        	name: 'descr', 
        	fieldLabel: Localize.Descr, 
        	autoCreate: {
        		'data-cucumber': 'catdescr',
        		tag: 'input', 
        		type: 'text', 
        		size: '20', 
        		autocomplete: 'off'
        	}
		}
	];

    fieldSetLeft.push(
        {
            //xtype: 'box',
            layout: 'hbox',
            fieldLabel: Ext.app.Localize.get('Service code'),
            items: [{
                xtype: 'button',
                iconCls: 'ext-erase',
                handler: function(Btn) {
                    Ext.get('_c_saledictionaryid_').dom.value = null;
                    Ext.get('_c_saledictionarylink').dom.innerHTML = Ext.app.Localize.get('Not assigned');
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'box',
            id: '_gaap',
            autoEl: {
                tag: 'a',
                cn: 'Undefined',
                id: '_c_saledictionarylink',
                style: 'color:navy;cursor:pointer;text-decoration: underline;padding-top:3px;'
            },
            listeners: {
                render: function(component){
                    component.getEl().on('click', function(e){
                        saleDictionaryWin({
                            sm: true,
                            hideToolbar: true,
                            callbackok: function(grid) {
                                var sm = grid.getSelectionModel().getSelected();
                                recordid = sm.get('recordid');
                                gaap = sm.get('gaap');
                                name = sm.get('name');
                                try {
                                    document.getElementById('_c_saledictionaryid_').value = recordid;
                                    document.getElementById('_c_saledictionarylink').innerHTML = gaap;
                                    Storages.modified(true);
                                    Ext.QuickTips.register({
                                        target: component.getEl(),
                                        text: name
                                    });

                                } catch(e) {
                                    return false;
                                }
                            }
                        });
                    });
                }
            }
            }]
        }
    );


	if(Storages.tarType() != 5) {
		fieldSetLeft.push({ xtype: 'textfield', name: 'includes', id: '_catincludes_', width: 133, fieldLabel: Localize.Included + ' (' + unitOnType(Localize.MB, Localize.min) + ')', listeners: { change: function() { Storages.modified(true) } } });
	}
	fieldSetLeft.push({ xtype: 'textfield', name: 'above', id: '_catabove_', width: 133, fieldLabel: ((Storages.tarType() != 5) ? Localize.PriceAbove : Localize.Cost) + ' (<span id="currabove">' + Storages.getCurrency() + '</span>)', listeners: { change: function() { Storages.modified(true) } } });
	fieldSetLeft.push({ xtype: 'textfield', name: 'link', id: '_catlink_', width: 133, fieldLabel: Localize.DescUrl }); 
	fieldSetLeft.push({ 
		xtype: 'textarea', 
		name: 'descrfull', 
		id: '_catdescrfull_', 
		width: 133, 
		fieldLabel: Localize.FullDesc,
    	autoCreate: {
    		'data-cucumber': 'catfulldescr',
    		tag: "textarea",
			style: "width: 133px; height: 60px;",
			autocomplete: "off"
    		
    	}
	}); 
	
	if(Storages.tarType() == 5){
		fieldSetLeft.push({
			xtype: 'textfield',
			name: 'permabove',
			id: '_permabove_',
			width: 133,
			fieldLabel: Localize.CostWhileOff + ' (<span id="permabove">' + Storages.getCurrency().symbol + '</span>)',
			listeners: { change: function() { Storages.modified(true) } }
		});
		fieldSetLeft.push({
			xtype: 'textfield',
			name: 'admblockabove',
			id: '_admblockabove_',
			width: 133,
			fieldLabel: Ext.app.Localize.get('Cost while admin off') + ' (<span id="admblockabove">' + Storages.getCurrency().symbol + '</span>)',
			listeners: { change: function() { Storages.modified(true) } }
		});
		fieldSetLeft.push({
			xtype: 'textfield',
			name: 'usrblockabove',
			id: '_usrblockabove_',
			width: 133,
			fieldLabel: Ext.app.Localize.get('Cost while user off') + ' (<span id="usrblockabove">' + Storages.getCurrency().symbol + '</span>)',
			listeners: { change: function() { Storages.modified(true) } }
		});
		fieldSetLeft.push({
		    layout: 'hbox',
			fieldLabel: Ext.app.Localize.get('External service id'),
			width: 133,
			items: [{
                xtype: 'textfield',
                name: 'uuid',
                id: '_catuuid_',
                flex: 1
			}, {
			    xtype: 'tbspacer',
			    width: Ext.get('_isdtv_') ? 5 : 0
			}, {
			    xtype: 'button',
			    text: 'CAS',
			    hidden: Ext.get('_isdtv_') ? false : true,
			    handler: function(Btn) {
			        getCASPackages({
			            callback: function(grid) {
			                var record = grid.getSelectionModel().getSelected();
			                this.setValue(record.get('tag'));
			            }.createDelegate(Ext.getCmp('_catuuid_'))
			        });
			    }
			}]
		});
		fieldSetLeft.push({
			xtype: 'checkbox',
			fieldLabel: Ext.app.Localize.get('Allow user to manage this service'),
			name: 'available',
			inputValue: 1,
			id: '_catavailable_'
		});

		fieldSetLeft.push({ 
			xtype: 'combo',
			width: 137,
			hiddenName: 'dtvtype',
			id: '_dtvtype_',
			displayField: 'name',
			valueField: 'id',
			value: 0,
			hidden: Ext.get('_isdtv_') ? false : true,
			store: new Ext.data.ArrayStore({
				data: [ ['0', Ext.app.Localize.get('Not specified')],
				       ['1', Ext.app.Localize.get('Channels Package')],
				       ['2', Ext.app.Localize.get('Channel')],
				       ['3', Ext.app.Localize.get('VAS')],
				       ['4', Ext.app.Localize.get('SVOD')],
				       ['5', Ext.app.Localize.get('TVOD')],
				       ['6', Ext.app.Localize.get('EST')],
				       ['7', Ext.app.Localize.get('FVOD')]],
				fields: ['id', 'name']
			}),
			fieldLabel: Ext.app.Localize.get('Category type'),
			allowBlank: false,
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			listeners: {
				select: function(){
					if(Storages.used() && Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.catidx != -1) {
						return false;
					}
					else {
						return true;
					}
				},
				change: function(){
					Storages.modified(true)
				}
			}
		});
		
	}
	if (Storages.tarType() == 3 || Storages.tarType() == 4) {
        fieldSetLeft.push({
            xtype: 'textfield',
            width: 133,
            name: 'permabove',
            id: '_permabove_',
            value: 0,
            fieldLabel: Localize.inFactCall + ' (' + Storages.getCurrency().symbol + ')',
            listeners: {
                change: function() {
                    Storages.modified(true)
                }
            }
        });

        fieldSetLeft.push({
            xtype: 'combo',
            width: 133,
            fieldLabel: Ext.app.Localize.get('Master category'),
            tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.catidx + " - " + values.descr, 32)]}</div></tpl>',
            itemSelector: 'div.x-combo-list-item',
            triggerAction:'all',
            editable:false,
            forceSelection:true,
            valueField:'catidx',
            displayField:'descr',
            hiddenName:'catidxmaster',
            id: '_catidxmaster_',
            listWidth: 250,
            listEmptyText: 'none',
            store: new Ext.data.Store({
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
                autoLoad: true,
                baseParams: {
                    async_call: 1,
                    devision: 25,
                    getmastercategory: 0
                },
                listeners: {
                    load: function(store) {
                        child = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
                        recordData = {catidx:0,catid:0,descr:Ext.app.Localize.get('no category'),uuid:0};
                        store.insert(0,new store.reader.recordType(recordData));
                        if (child !== null)
                            Ext.getCmp('_catidxmaster_').setValue(child.attributes.catidxmaster);
                        else
                            Ext.getCmp('_catidxmaster_').setValue(0);
                    }
                }
            }),
            listeners: {
                //select: function(){alert(this.setValue)},
                change: function() {
                    Storages.modified(true)
                }
            }
        });

    };
	var fieldSetRight = [];
	if(Storages.tarType() < 3){
		fieldSetRight.push({
			xtype: 'checkbox',
			name: 'common',
			id: '_catcommon_',
            fieldValue: 1,
			fieldLabel: Localize.IncludedTraffTo,
			listeners: {
				change: function(){
					Storages.modified(true)
				}
			}
		});
		fieldSetRight.push({
			xtype: 'hidden',
			name: 'common_hidden',
			id: '_catcommon_hidden_'
		});
	}




    unitStore = new Ext.data.Store({
        id: '_unitStore',
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader( { root: 'results' }, [ { name: 'recordid', type: 'int' }, { name: 'name', type: 'string' } ]),
        baseParams: { async_call: 1, devision: 4, getDefUnit: 1 },
        autoLoad: false,
        sortInfo: {
            field:     'name',
            direction: 'ASC'
        }
    });

	if(Storages.tarType() == 3 || Storages.tarType() == 4){
		fieldSetRight.push({ xtype: 'textfield', width: 90, name: 'freeseconds', id: '_freeseconds_', value: 0, fieldLabel: Localize.freeChrg + ' (' + Localize.sec + ')', listeners: { change: function() { Storages.modified(true) }}});
		fieldSetRight.push({ xtype: 'textfield', width: 90, name: 'roundseconds', id: '_roundseconds_', value: 0, fieldLabel: Localize.Round + ' (' + Localize.sec + ')', listeners: { change: function() { Storages.modified(true) }}});
		fieldSetRight.push({ xtype: 'textfield', width: 90, name: 'minchargedur', id: '_minchargedur_', value: 0, fieldLabel: Localize.RndBgCall + ' (' + Localize.sec + ')', listeners: { change: function() { Storages.modified(true) }}});
	}
	if(Storages.tarType() < 5) {
		fieldSetRight.push({ xtype: 'combo', width: 92, hiddenName: 'disprior', displayField: 'name', valueField: 'id', store: new Ext.data.SimpleStore({ data: [['0',Localize.Less],['3',Localize.Most],['1',Localize.BySize],['2',Localize.ByTime]], fields: ['id', 'name'] }), id: '_disprior_', fieldLabel: Localize.DiscPrior, allowBlank: false, typeAhead: true, mode: 'local', triggerAction: 'all', listeners: { change: function() { Storages.modified(true) }}});
	}
	if(Storages.tarType() == 5) {
		fieldSetRight.push({
			xtype: 'combo',
			width: 167,
			listWidth: 197,
			hiddenName: 'common',
			id: '_catcommon_',
			displayField: 'name',
			valueField: 'id',
			store: new Ext.data.ArrayStore({
				data: [['0',Localize.oneTime],['1',Localize.monthly],['2',Localize.daily],['3',Localize.daily + ' ' + Localize.equalparts]],
				fields: ['id', 'name']
			}),
			fieldLabel: Localize.WriteOff,
			allowBlank: false,
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			listeners: {
				select: function(){
					if(Storages.used() && Ext.getCmp('catList').getSelectionModel().getSelectedNode().attributes.catidx != -1) {
						return false;
					}
					else {
						return true;
					}
				},
				change: function(){
					Storages.modified(true)
				}
			}
		});
	}
	if(Storages.tarType() == 1 || Storages.tarType() == 2) {
		fieldSetLeft.push({
			xtype: 'textfield',
			fieldLabel: Ext.app.Localize.get('External service id'),
			name: 'uuid',
			id: '_catuuid_',
			width: 133
		});
		fieldSetRight.push({
			xtype: 'checkbox',
			fieldLabel: Ext.app.Localize.get('Enable by default'),
			name: 'enabled',
			inputValue: 1,
			id: '_catenabled_'
		});
		fieldSetRight.push({
			xtype: 'checkbox',
			fieldLabel: Ext.app.Localize.get('Allow user to manage this service'),
			name: 'available',
			inputValue: 1,
			id: '_catavailable_'
		});
	}

	// Category properties items array
	var CatBodyElements = [{
		xtype: 'panel',
		layout: 'table',
		layoutConfig: {
        	columns: 2,
			cellCls: 'cell-vertical-top'
    	},
		extraCls: 'x-column',
		border: false,
		autoHeight: true,
		width: 573,
		frame: true,
		items: [{
			xtype: 'fieldset',
			id: '_discFieldSet-1_',
			autoHeight: true,
			width: 288,
			border: false,
			style: 'padding-top: 10px',
			labelWidth: 130,
			frame: false,
			cellCls: 'cell-vertical-top',
			items: fieldSetLeft
		}, {
			xtype: 'fieldset',
			id: '_discFieldSet-2_',
			autoHeight: true,
			width: 263,
			border: false,
			frame: false,
			style: 'padding-top: 10px',
			labelWidth: (Storages.tarType() == 5) ? 70 : 147,
			cellCls: 'cell-vertical-top',
			items: fieldSetRight
		}]
	}];

	// Added new method to the usbox service: run post script after
	// service was applied to the account
	if(Storages.tarType() == 5) {
		CatBodyElements[0].items.push({
			xtype: 'fieldset',
			colspan: 2,
			border: false,
			frame: false,
			labelWidth: 130,
			listeners: {
			    beforerender: function(fset) {
			        if(!Ext.get('_isdtv_')) {
			            fset.get('_keepturnedon_').destroy();
			            //fset.get('_autoassign_').destroy();
			        }
			    }
			},
			items: [{
				xtype: 'textfield',
				fieldLabel: Ext.app.Localize.get('Run external method'),
				qtip: Ext.app.Localize.get('Example') + ': [mysql or cmd]:[procedure or command]<br>mysql:my_procedure_name<br>cmd:/usr/local/billing/scripts/script',
				name: 'uscript',
				id: '_uscript_',
				width: 395
			}, {
				xtype: 'textfield',
				fieldLabel: Ext.app.Localize.get('External method on turning off'),
				qtip: Ext.app.Localize.get('Example') + ': [mysql or cmd]:[procedure or command]<br>mysql:my_procedure_name<br>cmd:/usr/local/billing/scripts/script',
				name: 'scriptoff',
				id: '_scriptoff_',
				width: 395
			}, {
                xtype: 'checkbox',
                fieldLabel: Ext.app.Localize.get('Not disconnect (DTV)'),
                inputValue: 1,
                id: '_keepturnedon_',
                name: 'keepturnedon'
            }, {
                xtype: 'checkbox',
                fieldLabel: Ext.app.Localize.get('Sign by default'),
                inputValue: 1,
                id: '_autoassign_',
                name: 'autoassign'
            }]
		});
	}

	// If there is tarif not for the services
	if(Storages.tarType() < 5) {
		// Visual controls for the time discounts
		var chkClTimeDisc = new Ext.grid.CheckColumn({ header: Localize.Cal, dataIndex: 'useweekend', width: 55 });
		var chkRmTimeDisc = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 55 });
        var timeColModel = new Ext.grid.ColumnModel([{
            header: 'ID',
            dataIndex: 'disid',
            width: 45,
            sortable: false
        }, {
            header: Localize.Since,
            width: 65,
            dataIndex: 'timefrom',
            editor: new Ext.form.TextField({
                allowBlank: false,
                maskRe: new RegExp("[0-9\:]")
            })
        }, {
            header: Localize.Till,
            dataIndex: 'timeto',
            width: 65,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maskRe: new RegExp("[0-9\:]")
            })
        }, {
            header: Localize.WeekD,
            dataIndex: 'inline',
            width: 135,
            sortable: false
        }, chkClTimeDisc, {
            header: Localize.Discount,
            dataIndex: 'discount',
            width: 70,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false
            })
        }, {
            header: Localize.Type,
            dataIndex: 'typedescr',
            width: 55,
			renderer: function(A, B, C){
				if(Ext.isEmpty(A) || A == '') {
					if(C.data.type == 1){
						A = Storages.getCurrency().symbol;
					}
					else {
						A = '%';
					}
					C.data.typedescr = A;
				}

				return A;
			},
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                mode: 'local',
                id: 'timeDiscCombo',
                displayField: 'name',
                triggerAction: 'all',
                store: new Ext.data.SimpleStore({
                    data: [['1', Storages.getCurrency().symbol], ['0', '%']],
                    fields: ['type', 'name']
                }),
                listeners: {
                    select: function(){
                        Storages.categories.timedisc.getAt(Storages.Row.rowIndex).data.type = this.store.getAt(this.store.find('name', this.getRawValue())).data.type;
                    }
                }
            })
        }, chkRmTimeDisc]);

		// Visual controls for the size discounts
		var chkRmSizeDisc = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 85 });
        var sizeColModel = new Ext.grid.ColumnModel([{
            header: 'ID',
            dataIndex: 'disid',
            width: 50,
            sortable: false
        }, {
            header: Localize.Size + ' (' + unitOnType(Localize.MB, Localize.min) + ')',
            dataIndex: 'amount',
            width: 100,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false
            })
        }, {
            header: Localize.Discount,
            dataIndex: 'discount',
            width: 85,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false
            })
        }, {
            header: Localize.Type,
            dataIndex: 'typedescr',
            width: 85,
			renderer: function(A, B, C){
				if(Ext.isEmpty(A) || A == '') {
					if(C.data.type == 1){
						A = Storages.getCurrency().symbol;
					}
					else {
						A = '%';
					}
					C.data.typedescr = A;
				}

				return A;
			},
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                mode: 'local',
                id: 'sizeDiscCombo',
                displayField: 'name',
                triggerAction: 'all',
                store: new Ext.data.SimpleStore({
                    data: [['1', Storages.getCurrency().symbol], ['0', '%']],
                    fields: ['type', 'name']
                }),
                listeners: {
                    select: function(){
                        Storages.categories.sizedisc.getAt(Storages.Row.rowIndex).data.type = this.store.getAt(this.store.find('name', this.getRawValue())).data.type;
                    }
                }
            })
        }, {
            header: Localize.Bonus + ' (<span id="currbon">' + Storages.getCurrency().symbol + '</span>)',
            dataIndex: 'bonus',
            width: 85,
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false
            })
        }, chkRmSizeDisc]);

		// Complite time discount grid object
        CatBodyElements.push({
            xtype: Storages.used() ? 'grid' : 'editorgrid',
            id: '_timeDiscGrid',
            title: Localize.TimeDisc,
            height: 200,
            clicksToEdit: 1,
            autoScroll: true,
            store: Storages.categories.timedisc,
            cm: timeColModel,
            frame: false,
			width: 572,
            loadMask: true,
            enableHdMenu: false,
            border: false,
            plugins: [chkClTimeDisc, chkRmTimeDisc],
            tbar: [{
                xtype: 'button',
                text: Localize.Add,
                iconCls: 'ext-add',
                disabled: Storages.used() ? true : false,
                handler: function(){
                    var row = new TimeDRows({
                        disid: 0,
                        tarid: tarifId,
                        catidx: 0,
                        type: 1,
                        useweekend: 1,
                        typedescr: Storages.getCurrency().symbol,
                        mon: 1,
                        tue: 1,
                        wed: 1,
                        thu: 1,
                        fri: 1,
                        san: 1,
                        sun: 1,
                        inline: '',
                        discount: 0,
                        timefrom: '00:00:00',
                        timeto: '00:00:00',
                        remove: false
                    });
                    row.data.inline = Storages.Row.dayLine(row.data);
                    Ext.getCmp('_timeDiscGrid').stopEditing();
                    Storages.categories.timedisc.insert(0, row);
                    Ext.getCmp('_timeDiscGrid').startEditing(0, 0);
                    Storages.modified(true);
                }
            }, '-', {
                xtype: 'button',
                text: Localize.Remove,
                iconCls: 'ext-remove',
                disabled: Storages.used() ? true : false,
                handler: function(){
                    Ext.getCmp('_timeDiscGrid').stopEditing();
                    Storages.categories.timedisc.each(removeRecord)
                }
            }],
            listeners: {
                cellclick: function(grid, rowIndex, columnIndex, e){
                    Storages.Row.Grid = grid;
                    Storages.Row.rowIndex = rowIndex;
                    Storages.Row.columnIndex = columnIndex;
                    if (columnIndex != 3 || Storages.Row.Grid.store.getAt(Storages.Row.rowIndex).data['useweekend']==true) { 
                        return;
                    }
                    weekDaysList.setPosition(e.getXY()[0], e.getXY()[1]);
                    if (weekDaysList.isVisible()) {
                        weekDaysList.fireEvent('show');
                    }
                    else {
                        weekDaysList.show();
                    }
                }
            }
        });

		// Complite volume discount grid object
        CatBodyElements.push({
            xtype: Storages.used() ? 'grid' : 'editorgrid',
            id: '_sizeDiscGrid',
            title: Localize.SizeDisc,
            height: (Storages.tarType() == 3 || Storages.tarType() == 4) ? 191 : 235,
            clicksToEdit: 1,
            autoScroll: true,
            store: Storages.categories.sizedisc,
            cm: sizeColModel,
            border: false,
            frame: false,
            loadMask: true,
			width: 572,
            enableHdMenu: false,
            plugins: chkRmSizeDisc,
            tbar: [{
                xtype: 'button',
                text: Localize.Add,
                iconCls: 'ext-add',
                disabled: Storages.used() ? true : false,
                handler: function(){
                    var row = new SizeDRows({
                        disid: 0,
                        tarid: tarifId,
                        catidx: 0,
                        type: 1,
                        typedescr: Storages.getCurrency().symbol,
                        discount: 0,
                        amount: 0,
                        bonus: 0,
                        remove: false
                    });
                    Ext.getCmp('_sizeDiscGrid').stopEditing();
                    Storages.categories.sizedisc.insert(0, row);
                    Ext.getCmp('_sizeDiscGrid').startEditing(0, 0);
                    Storages.modified(true);
                }
            }, '-', {
                xtype: 'button',
                text: Localize.Remove,
                iconCls: 'ext-remove',
                disabled: Storages.used() ? true : false,
                handler: function(){
                    Ext.getCmp('_sizeDiscGrid').stopEditing();
                    Storages.categories.sizedisc.each(removeRecord)
                }
            }],
            listeners: {
                cellclick: function(grid, rowIndex, columnIndex, e){
                    Storages.Row.Grid = grid;
                    Storages.Row.rowIndex = rowIndex;
                    Storages.Row.columnIndex = columnIndex;
                }
            }
        });
	}

	// The first TabPanel elements object
	var catPropTab = { title: Localize.Properties, id: '_discTab_', autoHeight: true, items: CatBodyElements}

	Ext.app.DirSearch = Ext.extend(Ext.form.TwinTriggerField, {
		width: this['width'] || 120,
		validationEvent: false,
		validateOnBlur: false,
		trigger1Class: 'x-form-clear-trigger',
		trigger2Class: 'x-form-search-trigger',
		hideTrigger1: true,
		hasSearch: false,
		paramName: 'dirsearch',
		initComponent : function(){
			Ext.app.DirSearch.superclass.initComponent.call(this);
			this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this);
			this.on('afterrender', function(){ this.el.setWidth(this.width - 17); }, this);
		},
		onTrigger1Click : function(){
			if(this.hasSearch){
				this.el.dom.value = '';
				var o = {
					start: 0
                };
				this.store.baseParams = this.store.baseParams ||{};
				this.store.baseParams[this.paramName] = '';
				this.store.reload({
					params: o
				});
				this.triggers[0].hide();
				this.hasSearch = false;

				this.el.setWidth(this.width - this.trigger.getWidth());
			}
		},
		onTrigger2Click : function(){
			var v = this.getRawValue();

			if (v.length < 1) {
				this.onTrigger1Click();
				return;
			}
			var o = {
				start: 0
            };
			this.store.baseParams = this.store.baseParams || {};
			this.store.baseParams[this.paramName] = v;
			this.store.reload({
				params: o
			});
			this.hasSearch = true;
			this.triggers[0].show();

			this.el.setWidth(this.width - this.trigger.getWidth());
		}
	});

	// The second TabPanel elements object. Contains only Catalogue directions
	var dirRmInc = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 60 });
	var catDirecTabInc = {
		title: Localize.Directions + ((Storages.tarType() == 3 || Storages.tarType() == 4) ? ': ' + Localize.IncE : ''),
		disabled: true,
		height: 550,
		id: 'dirTabInc',
		items: [{
			xtype: 'grid',
			id: 'dirGridInc',
			height: 550,
			clicksToEdit: 1,
			autoWidth: true,
			enableHdMenu: false,
			border: false,
			width: 572,
			autoScroll: true,
			store: Storages.directions,
			cm: new Ext.grid.ColumnModel([{
				header: Localize.Catalogue + ' ID',
				dataIndex: 'catid',
				width: 70,
				sortable: true
			}, {
				header: Localize.Direction + ' ID',
				dataIndex: 'zoneid',
				width: 100,
				sortable: true
			}, {
				header: 'IP',
				dataIndex: 'zoneip',
				width: 90,
				sortable: true,
				hidden: ((Storages.getCatType() == 1) ? false : true),
				renderer: function(value, meta, record){
					return value + ' / ' + record.data.zonemask
				}
			}, {
				header: Localize.Port,
				dataIndex: 'port',
				width: 50,
				sortable: true,
				hidden: ((Storages.getCatType() == 1) ? false : true)
			}, {
				header: Localize.Protocol,
				dataIndex: 'proto',
				width: 66,
				sortable: true,
				hidden: ((Storages.getCatType() == 1) ? false : true)
			}, {
				header: 'AS',
				dataIndex: 'zoneas',
				width: 120,
				sortable: true,
				hidden: (Storages.getCatType() == 2) ? false : true
			}, {
			    header: Localize.Number,
			    dataIndex: 'zonenum',
			    width: 120,
			    sortable: true,
			    hidden: ((Storages.getCatType() == 3) ? false : true)
			}, {
			    header: Localize.Descr,
			    id: 'indescr',
			    width: ((Storages.getCatType() == 1) ? 113 : 198),
			    dataIndex: 'descr',
			    sortable: false
			}, dirRmInc]),
			plugins: dirRmInc,
			loadMask: true,
			tbar: new Ext.Toolbar({
				items: [{
					xtype: 'button',
					text: Localize.Add,
					iconCls: 'ext-add',
					handler: function(){
						getCatalogContent(tarifId, Storages.currNode.attributes.catidx, 0)
					}
				}, {
					xtype: 'button',
					text: Localize.AddRecordsFile,
					iconCls: 'ext-upcsv',
					handler: function(){
						uploadDirCSV({
							tarid: tarifId,
							catidx: Storages.currNode.attributes.catidx,
							direction: 0
						})
					}
				}, '-', {
					xtype: 'button',
					text: Localize.Remove,
					iconCls: 'ext-remove',
					handler: function(){
						var parent = Ext.getCmp('dirGridInc').stopEditing();
						removeDirection()
					}
				}, '-', new Ext.app.DirSearch({
					width: 210,
					store: Storages.directions,
					field: ['descr', 'zonenum', 'zoneas', 'zoneas', 'zoneip', 'zonemask', 'port', 'proto']
				})]
			}),
			bbar: new Ext.PagingToolbar({
				pageSize: 500,
				store: Storages.directions,
				displayInfo: true,
				items: ['-', {
					xtype: 'combo',
					width: 70,
					displayField: 'id',
					valueField: 'id',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					value: 500,
					editable: false,
					store: new Ext.data.ArrayStore({
						data: [
							['500'],
							['1000']
						],
						fields: ['id']
					}),
					listeners: {
						select: function(){
							this.ownerCt.pageSize = this.getValue() * 1;
							Storages.directions.reload({ params: { limit: this.getValue() } });
						}
					}
				}]
			})
		}]
	}

	// The third TabPanel elements object. Contains only Catalogue directions
	var dirRmOut = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 60 });
	var catDirecTabOut = {
		title: Localize.Directions + ((Storages.tarType() == 3 || Storages.tarType() == 4) ? ': ' + Localize.OutE : ''),
		disabled: true,
		height: 550,
		id: 'dirTabOut',
		items: [{
			xtype: 'grid',
			id: 'dirGridOut',
			height: 524,
			clicksToEdit: 1,
			autoWidth: true,
			enableHdMenu: false,
			border: false,
			autoScroll: true,
			width: 572,
			store: Storages.directions,
			cm: new Ext.grid.ColumnModel([{
				header: Localize.Catalogue + ' ID',
				dataIndex: 'catid',
				width: 80,
				sortable: true
			}, {
				header: Localize.Direction + ' ID',
				dataIndex: 'zoneid',
				width: 100,
				sortable: true
			}, {
				header: Localize.Number,
				dataIndex: 'zonenum',
				width: 120,
				sortable: false
			}, {
				header: Localize.Descr,
				id: 'outdescr',
				width: 188,
				dataIndex: 'descr',
				sortable: false
			}, dirRmOut]),
			plugins: dirRmOut,
			loadMask: true,
			tbar: [{
				xtype: 'button',
				text: Localize.Add,
				iconCls: 'ext-add',
				handler: function(){
					getCatalogContent(tarifId, Storages.currNode.attributes.catidx, 1)
				}
			}, {
				xtype: 'button',
				text: Localize.AddRecordsFile,
				iconCls: 'ext-upcsv',
				handler: function(){
					uploadDirCSV({
						tarid: tarifId,
						catidx: Storages.currNode.attributes.catidx,
						direction: 1
					})
				}
			}, '-', {
				xtype: 'button',
				text: Localize.Remove,
				iconCls: 'ext-remove',
				handler: function(){
					var parent = Ext.getCmp('dirGridOut').stopEditing();
					removeDirection()
				}
			}, '-',
			new Ext.app.DirSearch({
				width: 210,
				store: Storages.directions,
				field: ['descr', 'zonenum', 'zoneas', 'zoneas', 'zoneip', 'zonemask', 'port', 'proto']
			})]
		}],
		bbar: new Ext.PagingToolbar({
			pageSize: 500,
			store: Storages.directions,
			displayInfo: true,
			items: ['-', {
				xtype: 'combo',
				width: 70,
				displayField: 'id',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: 500,
				editable: false,
				store: new Ext.data.ArrayStore({
					data: [
						['500'],
						['1000']
					],
					fields: ['id']
				}),
				listeners: {
					select: function(){
						this.ownerCt.pageSize = this.getValue() * 1;
						Storages.directions.reload({ params: { limit: this.getValue() } });
					}
				}
			}]
		})
	}

	// The fourth TabPanel elements object. Contains only route weights
	Storages.categories.routes = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'routeid', type: 'int' }, { name: 'trunk', type: 'string' }, { name: 'weight', type: 'int' }]), baseParams:{ async_call: 1, devision: 4, routes: tarifId, category: 0 } });
    var weightRoute = {
        title: Localize.RouteW,
        disabled: true,
		height: 550,
        id: 'routeTab',
        autoHeight: true,
        items: [{
            xtype: 'editorgrid',
            id: 'routeWGrid',
            height: 550,
            clicksToEdit: 1,
            autoWidth: true,
            enableHdMenu: false,
            border: false,
            autoScroll: true,
			width: 572,
            store: Storages.categories.routes,
            cm: new Ext.grid.ColumnModel([{
                header: Localize.Route,
                dataIndex: 'trunk',
                width: 180,
                sortable: true
            }, {
                header: Localize.Weight,
                dataIndex: 'weight',
                id: '_weight',
                width: 180,
                sortable: true,
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 65000,
                    minValue: 0
                })
            }]),
            loadMask: true
        }]
    }
    
    var recRemove = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'),  width: 25, iconCls: 'ext-drop' });
	recRemove.on('action', function(grid, record) {
			grid.stopEditing();
			grid.getStore().remove(record);
			return;
		});
    var discountRecs = 0;
    var tarGridTab = {
		title: Ext.app.Localize.get('Discounts'),
		disabled: false,
		height: 550,
		id: 'tarGridTab',
		items: [{
			xtype: 'editorgrid',
			id: 'tarGridTabInc',
			height: 550,
			clicksToEdit: 1,
			autoWidth: true,
			border: false,
			width: 572,
			autoScroll: true,
			loadMask: true,
			plugins: [recRemove],
			tbar: new Ext.Toolbar({
				items: [{
					xtype: 'button',
					text: Ext.app.Localize.get('Add'),
					iconCls: 'ext-add',
					handler: function(Btn) {
						var grid = Ext.getCmp('tarGridTabInc');
						grid.stopEditing();
						var r = new grid.store.recordType({
							count: '',
							rate: ''
						}, discountRecs++);
						grid.store.insert(0, r);
						grid.startEditing(0, 0);
					}
				}, '-', {
					xtype: 'tbtext',
					text: Ext.app.Localize.get('PutsOn')
				}, {
					xtype: 'combo',
					width: 150,
					id: 'usingByCmb',
					hiddenName: 'usingBy',
					displayField: 'name',
					valueField: 'id',
					typeAhead: false,
					mode: 'local',
					triggerAction: 'all',
					value: 0,
					editable: false,
					store: {
						xtype: 'arraystore',
						fields: ['id', 'name'],
						data: [
							['1', Ext.app.Localize.get('agreement')],
							['0', Ext.app.Localize.get('to account entry')]
						]
					}					
				}]
			}),
			cm: new Ext.grid.ColumnModel([{
				header: Ext.app.Localize.get('Starting from quantity'),
				itemId: 'count',
				name: 'sCount',
				dataIndex: 'count',
				width: 250,
				sortable: false,
				editor: new Ext.form.NumberField({
					allowBlank: false
				})
			}, {
				header: Ext.app.Localize.get('Ratio'),
				itemId: 'rate',
				name: 'sRate',
				dataIndex: 'rate',
				width: 150,
				sortable: false,
				editor: new Ext.form.NumberField({
					allowBlank: false,
					decimalPrecision: 5
				})
			}, recRemove]),
			store: {
				xtype: 'jsonstore',
				method: 'POST',
				root: 'results',
				fields: ['count', 'rate', 'object'],
				baseParams: {
					async_call: 1,
					devision: 4,
					gettarcatdisc: 1
				}, 
				listeners: {
					load: function(store) {
						if(!Ext.isEmpty(store.getAt(0))) {
							Ext.getCmp('usingByCmb').setValue(store.getAt(0).get('object'));
						}
					}					
				}
			},
			listeners: {
				afterrender: function(grid) {
					grid.getStore().reload();
				}
			}
		}]
	}	 
    

	var tabArray = [ catPropTab, catDirecTabInc ];
	if(Storages.tarType() == 3 || Storages.tarType() == 4) { tabArray[tabArray.length] = catDirecTabOut }
	if(Storages.tarType() == 4) { tabArray[tabArray.length] = weightRoute }
	if(Storages.tarType() == 5) { tabArray[tabArray.length] = tarGridTab }
	if(Storages.tarType() == 5 && document.getElementById("_cerber_").value == 1 ) {
	
		var arr = [];
		for(var i = 1; i <= 16; i++) {
			var item = {};
			item.name =  "'" + i + "'";
			item.type = 'int';
			arr.push(item);
		}

		var d = [];
		for(var i = 0; i < 8; i++) {
			d.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]) ;
		}

		var cerber_ds = new Ext.data.Store({
		url: 'config.php',
		reader: new Ext.data.ArrayReader( {}, arr),
		data: d
		});

		Storages.cerber_data = cerber_ds;

		var columns = [];
		columns.push( {fixed: true , width: 80 } );
		for(var i = 1; i <= 16; i++) {
			var item = {};
			item.header =  i;
			item.dataIndex =  "'" + i + "'";
			item.width =  30;
			item.height =  30;
			item.menuDisabled = true;
			item.renderer =  function(value, cell) { return '<input style="height: 16px; width: 16px" type="checkbox"' + (value ? 'checked' : '') + '/>'; };
			columns.push(item);
		}

		var col = new Ext.grid.ColumnModel(columns);

		CatBodyElements.push({ xtype: 'grid', title: Localize.cerberMask, id: 'cerber_table', ds: cerber_ds, cm: col, border: true, height: 270,  width: 573, listeners: { cellclick: function(grid, rowIndex, columnIndex, e){ var record = grid.getStore().getAt(rowIndex); var fieldName = grid.getColumnModel().getDataIndex(columnIndex); var data = record.get(fieldName); data = (data == 1 ) ? 0 : 1; record.set(fieldName, data); } } });

		function render_chanels(value, metadata, record, rowIndex, colIndex, store) {
			var beg = (rowIndex == 0) ? 1 : rowIndex*16 + 1;
			var end = (rowIndex + 1)*16;
			return "<table width='70'><tr><td align='left'>" + beg + "</td><td align='center'> - </td><td align='right'>" + end + "</td></tr></table>";
		}

		col.setRenderer(0, render_chanels);
	}

	Ext.app.FastSearchField = Ext.extend(Ext.form.TwinTriggerField, {
		width: this.width || 120,
		validationEvent: false,
		validateOnBlur: false,
		trigger1Class: 'x-form-clear-trigger',
		triggerClass: 'x-form-search-trigger',
		trigger2Class: 'x-form-search-trigger',
		hideTrigger1: true,
		lazyInit : true,
		hasSearch : false,
		field: this.field || 'text',
		initComponent: function(){
			Ext.app.FastSearchField.superclass.initComponent.call(this);
			this.on('specialkey', function(f, e){
				if(e.getKey() == e.ENTER){
					this.onTrigger2Click();
				}
			}, this);
		},
		initTree: function(){
			if(!this.ownerCt.ownerCt.filterTree.tree) {
				this.ownerCt.ownerCt.filterTree.tree = this.ownerCt.ownerCt;
			}
			if(!this.filter) {
				this.filter = this.ownerCt.ownerCt.filterTree;
			}
		},
		onTrigger1Click: function(){
			this.initTree();
			if(this.hasSearch){
				this.el.dom.value = '';
				this.filter.clear();
				this.triggers[0].hide();
				this.hasSearch = false;
			}
		},
		onTrigger2Click: function(){
			this.initTree();
			var v = this.getRawValue();
			if(v.length < 1){
				this.onTrigger1Click();
				return;
			}
			this.filter.tree.expandAll();
			this.filter.filter(new RegExp(v, 'i'), this.field);
			this.hasSearch = true;
			this.triggers[0].show();
		}
	});

	var cf = new Ext.form.FormPanel({
		id: '_categoryForm',
		url: 'config.php',
		xtype: 'form',
		frame: false,
		title: Localize.Categories,
		layout: 'column',
		height: 'auto',
		renderTo: renderTo,
		monitorValid: true,
		tbar: [{
				xtype: 'button',
				text: Localize.SaveCat,
				id: '_catSaveBtn',
				iconCls: 'ext-save',
				disabled: true,
				handler: function() {
					saveNodeData(Storages.currNode, true);
				}
			},'-',
			((!Operators) ? {
				xtype: 'button',
				text: Localize.Add,
				id: '_catAddBtn',
				iconCls: 'ext-add',
				handler: newTreeNode,
				disabled: Storages.used() ? true : false
			} : {
				text: Localize.Add,
				id: '_catAddBtn',
				iconCls: 'ext-add',
				disabled: Storages.used() ? true : false,
				shadow: 'frame', menu: []
			}),'-', {
				xtype: 'button',
				text: Localize.Remove,
				id: '_catRemoveBtn',
				disabled: true,
				handler: removeTreeNode,
				iconCls: 'ext-remove'
			}
		],
		items:[{ columnWidth: 0.28, layout: 'fit', border: false, items:
			{
				xtype: 'treepanel',
				id: 'catList',
				autoScroll: true,
				animate: true,
				border: false,
				width: 214,
				height: 578,
				containerScroll: true,
				selModel: new Ext.tree.DefaultSelectionModel(),
				rootVisible: false,
				root: new Ext.tree.AsyncTreeNode({ text: Localize.Categories }),
				filterTree: new Ext.tree.TreeFilter,
				
				
				loader: new Ext.tree.TreeLoader({
					requestMethod: 'POST',
					url: 'config.php',
					baseParams: { async_call: 1, devision: 4, categories: tarifId },
					listeners: {
						beforeload: function() {
							// DO NOT load category tree if tarif = 0 (create new tarif)
							if(Ext.get('_tarif_').getValue() == 0) {
								return false;
							}
						},
						loadexception: function() {
							Storages.autoSave = false;
                            Ext.getCmp('_categoryForm').getTopToolbar().disable();
                            if (tarifId == 0) {
                                Ext.getCmp('_catAddBtn').enable()
                            }
                        },
                        load: function(store, node, data) {
                            parseLeaves(store, node, data);
                            if (store.baseParams.categories > 0) {
                                Ext.getCmp('_categoryForm').getTopToolbar().enable();
                            }
                        }
                    }
				}),
				
				
				listeners: {
					click: selectLeaf,
					render: function(){
						this.filterTree.tree = this;
						this.root.selectChild = {
							catidx: null,
							firstChild: null,
							root: this.root,
							selected: null,
							select: function(catidx){
								this.root.eachChild(function(child){
									if(child.hasChildNodes())
									{
										child.expand();
										if(Ext.isEmpty(this.firstChild)) {
											this.firstChild = child.firstChild;
										}
										var A = child.findChild('catidx', catidx);
										if(!Ext.isEmpty(A)) {
											this.selected = A;
											return false;
										}
										child.collapse();
									}
								}, this);
								if(Ext.isEmpty(this.selected)) {
									if(!Ext.isEmpty(this.firstChild)) {
										this.selected = this.firstChild;

									}
								}
								if(Ext.isEmpty(this.selected)) {
									throw('Child not found');
								}
								else {
									if(!this.selected.parentNode) {
										this.root.eachChild(function(N){
											var C = N.findChild('id', this.selected.id);
											if(C){
												N.expand();
												C.select();
												return false;
											}
										}, this);
									}
									else {
										if(!this.selected.parentNode.isExpanded()) {
											this.selected.parentNode.expand();
										}
										this.selected.select();
									}
									this.catidx = this.selected.attributes.catidx;
								}
							},
							unselect: function(){
								this.firstChild = null;
								this.selected = null;
								this.catidx = null;
							}
						}
					}
				},
				tbar: [ new Ext.app.FastSearchField({ field: 'text', width: 210 }) ]
			} },
			{ columnWidth: 0.72, xtype: 'tabpanel', id: '_catTabsPanel', frame: true, width: 556, activeTab: 0, autoHeight: true, plain: true, deferredRender: false,
			items: tabArray, listeners: { 
				tabchange: function(panel, currTab) {  
					if(!currTab.disabled) { 
						if(currTab.getId() == 'dirTabInc' || currTab.getId() == 'dirTabOut') { 
							Ext.getCmp('_categoryForm').getTopToolbar().disable(); 
						} 
						else { 
							if(tarifId > 0){ 
								Ext.getCmp('_categoryForm').getTopToolbar().enable(); 
							} 
						}
						if(!Ext.isEmpty(Storages.currNode) && Storages.currNode.id == -1) {
							return;
						}
						selectLeaf(Storages.currNode); } } }
		
		}],
		listeners: {
			render: function(){
				if(Storages.used() == true){
					setReadOnly('_discFieldSet-1_', ['_catdescr_', '_catavailable_', '_catuuid_']);
					if(!Ext.isEmpty(Ext.getCmp('_dtvtype_'))){
						Ext.getCmp('_dtvtype_').enable();
					}
				}
			}
		}
	});

	// Tree filter by category name
	Ext.override(Ext.tree.TreeFilter, {
		lastQuery: null,
		filter: function (d, a, b) {
			a = a || "text";
			var c;
			if (typeof d == "string") {
				var e = d.length;
				if (e == 0 && this.clearBlank) {
					this.clear();
					return;
				}
				d = d.toLowerCase();
				c = function (g){
					if(g.hasChildNodes()) {
						return true;
					}
					return g.attributes[a].substr(0, e).toLowerCase() == d;
				};
			} else {
				if (this.lastQuery != d) {
					this.clear();
				}
				if (d.exec) {
					c = function (g){
						if(g.hasChildNodes()) {
							return true;
						}
						return d.test(g.attributes[a]);
					};
				} else {
					throw "Illegal filter type, must be string or regex";
				}
			}
			this.filterBy(c, null, b);
		},

		filterBy: function (d, c, b) {
			b = b || this.tree.root;
			if (this.autoClear) {
				this.clear();
			}
			var a = this.filtered, i = this.reverse;
			var e = function (k) {
				if (k == b) {
					return true;
				}
				if (a[k.id]) {
					return false;
				}
				var j = d.call(c || k, k);
				if (!j || i) {
					a[k.id] = k;
					k.ui.hide();
					return false;
				}
				return true;
			};
			b.cascade(e);
			if(this.remove) {
				for (var h in a) {
					if (typeof h != "function") {
						var g = a[h];
						if (g && g.parentNode) {
							g.parentNode.removeChild(g);
						}
					}
				}
			}
		}
	});

	if(Storages.tarType() == 5 && document.getElementById("_cerber_").value == 1 ) {
		var cerber_mask = new Ext.form.Hidden({name: 'cerber_mask', id: '_cerber_mask_', value: '', hidden: true });
		Ext.getCmp('_categoryForm').add(cerber_mask);
		Ext.getCmp('_categoryForm').doLayout();
	}
} // end categoryForm()


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
 * Select leaf. if there is no passed arguments than first valid child group
 * @param	object, child node to select
 */
function selectLeaf( child )
{
	var child = child;
	if(Ext.isEmpty(child)) {
		var T = Ext.getCmp('catList');
		
		try {
			T.root.selectChild.select();
			child = T.getSelectionModel().getSelectedNode();
		}
		catch(e){
			T.root.eachChild(function(node){
				if(node.attributes.def == 1 && node.hasChildNodes()) {
					node.expand();
					if(!Ext.isEmpty(node.firstChild)) {
						child = node.firstChild;
						node.firstChild.select();
					}
					return false;
				}
			});
		}
	};

	if(!child || Ext.isEmpty(child) || !Ext.isEmpty(child.attributes.group)) {
		return false;
	}
	Storages.currNode = child;

    /**
     * Подгрузка списка тарифных категорий
     */
    if (Storages.tarType() == 3 || Storages.tarType() == 4){
        if (child.attributes.catid >= 0 && child.attributes.catidxmaster >= 0 && child.attributes.catidx > 0){
            Ext.getCmp('_catidxmaster_').getStore().baseParams.getmastercategory = child.attributes.catid;
            Ext.getCmp('_catidxmaster_').getStore().removeAll();
            Ext.getCmp('_catidxmaster_').getStore().load();
        }else{
            Ext.getCmp('_catidxmaster_').setValue(0);
        }
    }
	if(Storages.modified() != false && Storages.modified() != child.id) {
		// Save data to DB and call reload on success
		saveNodeData(child);
		
	}
	else { 
		loadDataTo(child);
		if(Ext.getCmp('tarGridTabInc')) {
			var gStore = Ext.getCmp('tarGridTabInc').getStore();
			gStore.setBaseParam('catidx', child.attributes.catidx).setBaseParam('tarid', child.attributes.tarid);
			gStore.removeAll();
			gStore.reload();
		}
	}
} // end selectLeaf()


/**
 * Add new node to the tree. It means to add new category
 * @param	object, catalog data for the operators mode
 */
function newTreeNode( object )
{
	// Detect operators mode
	if(!document.getElementById('_operators_')) {
		var operMode = 0;
	}
	else {
		var operMode = document.getElementById('_operators_').value;
	}
	// Find tarif id value
	if(!document.getElementById('_tarif_')) {
		return false
	}
	else {
		var tarifId = document.getElementById('_tarif_').value;
	}
	// Find catalogue id
	if(!document.getElementById('_catnumbers_')) {
		var catNum = 0;
	}
	else {
		var catNum = document.getElementById('_catnumbers_').value;
	}
	// Take important action for the new tarif
	if(tarifId == 0) {
		// If there is operators mode - stop previous action "add"
		if(operMode > 0){
			Storages.operMode.remove(object.catid);
		}
		// Show confirmation to save before add categories
		if(confirm(Localize.ShouldSaveTar) == true) {
			Storages.extract('_Tarif');
			createHidOrUpdate('_Tarif', 'nolist', 1);
			submitForm('_Tarif', 'save', 1);
			return true;
		}
		else {
			if(operMode > 0){
				Storages.operMode.triggerAll(true);
				Storages.operMode.update();
			}
			return false;
		}
	}
	// If tarif is already saved and there is call to add new category
	// Find if there is recieved catalogue object
	if(Ext.isEmpty(object)){
		var object = { catname: '', operid: 0, catid: (operMode == 0) ? catNum : 0, opername: '' };
	}
	else {
		if(!Storages.operMode.isUsed()) {
			object['operid'] = object.operid || Storages.getCatOwner();
		}
	}

	var tree = Ext.getCmp('catList');
	if(!tree.getNodeById(-1)) {
		var node = Storages.node; node.tarid = tarifId; node.operid = object.operid; node.catid = object.catid; node.dtvtype = 0;
		tree.getRootNode().appendChild(node);
		Storages.modified({id: -1, attributes: Ext.getCmp('catList').getNodeById(-1).attributes });
		Ext.getCmp('catList').getNodeById(-1).select();
		selectLeaf(Ext.getCmp('catList').getNodeById(-1));
	}
} // newTreeNode()


/**
 * Send background form data to server
 * @param	string / HTMLElement of the form to pass
 * @param	boolean, to reload tree and update forms
 */
function sendFormInBack( form, reload )
{
	// Add hidden to from to send as background
	Ext.Ajax.request({
		form: form,
		method: 'POST',
		url: 'config.php',
		params: { async_call: 1, save: 1 },
		success: function(response) {
			obj = Ext.util.JSON.decode(response.responseText);
			if(!Ext.isEmpty(obj.tarif)){
				if(reload == true) {
					createHidOrUpdate(form, 'tarif', obj.tarif);
					Ext.getCmp('catList').getLoader().baseParams.categories = obj.tarif;
					Ext.getCmp('_tarid_').setValue(obj.tarif);
					Ext.getCmp('catList').root.reload(function(){});
				}
			}
		},
		failure: function(response) {
			try{
				obj = Ext.util.JSON.decode(response.responseText); Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
			} catch(e){ }
		}
	});
} // end ifSaveNewTarif()


/**
 * Remove child from the parent object
 * @param	object, parent Ext object
 * @param	string or array, node to remove
 * @param	object or mix collection to add to parent
 */
function removeChild( parent, childId, newChild )
{

    if (Ext.isEmpty(parent)) {
        return false
    }
    if (!Ext.isEmpty(childId)) {
        if (Ext.isArray(childId)) {
            for (var i in childId) {
                if (typeof childId[i] == 'object') {
					Ext.getCmp(childId[i].id).destroy();
                }
            }
        }
        else {
			try {
				Ext.getCmp(childId).destroy()
			}
			catch(e){}
        }
    }
    if (!Ext.isEmpty(newChild)) {
        for (var i in newChild) {
            if (typeof newChild[i] == 'object') {
                parent.add(newChild[i])
            }
        }
    }
} // end removeChild()


/**
 * Remove node from the tree and category record from database if node.id != -1
 * @param	integer, tarif id
 */
function removeTreeNode( tarifId )
{
	
	Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Are you sure you want delete category'), function(B) {
		if (B != 'yes') {
			return;
		};	
	
		if(Ext.isEmpty(tarifId)) {
			try {
				var tarifId = document.getElementById('_tarif_').value;
			}
			catch(e) {
				return false
			}
		}

		Storages.modified(false);
		var child = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
		var attributes = child.attributes;
		var parent = child.parentNode;

		if(child.attributes.catidx != 0) {
			child.remove();
			if(!parent.hasChildNodes() || Ext.isEmpty(parent.findChild('catid', attributes.catid)) && (Storages.isOperMode() && (Storages.tarType() == 3 || Storages.tarType() == 4))) {
				Storages.operMode.remove(attributes.catid);
				sendFormInBack('_Tarif');
			}
		}
		if(child.attributes.catidx > 0) {
			if(!parent.hasChildNodes() || Ext.isEmpty(parent.findChild('catid', attributes.catid))){
				Storages.operMode.remove(attributes.catid);
				sendFormInBack('_Tarif');
			}

			replaceHidden = function(currId, newObj) {
				var f = Ext.getCmp('_categoryForm');
				Ext.getCmp(currId).destroy();
				f.add(newObj);
				f.doLayout(true);
			}

			replaceHidden('_catsave_', { xtype: 'hidden', id: '_catdelete_', name: 'catdelete', value: attributes.catidx });
			Ext.getCmp('_categoryForm').getForm().submit({
				method:'POST',
				waitTitle: Localize.Connecting,
				waitMsg: Localize.SendingData + '...',
				success: function(form, action) {
					replaceHidden('_catdelete_', { xtype: 'hidden', id: '_catsave_', name: 'catsave', value: 1 });
					Ext.getCmp('catList').root.reload(function(node) {
						if(node.item(0).hasChildNodes()) {
							Storages.currNode = false;
							var T = Ext.getCmp('catList');
							T.root.selectChild.unselect();
							selectLeaf(node.item(0).firstChild);
						}
					});
				},
				failure: function(form, action) {
					if(action.failureType == 'server') {
						obj = Ext.util.JSON.decode(action.response.responseText);
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
					};
					replaceHidden('_catdelete_', { xtype: 'hidden', id: '_catsave_', name: 'catsave', value: 1 });
					Ext.getCmp('catList').root.reload(function(node) {
						if(node.item(0).hasChildNodes()) {
							Storages.currNode = false;
							var T = Ext.getCmp('catList');
							T.root.selectChild.unselect();
							T.root.selectChild.select(attributes.catidx);
						}
					});
				}
			});
		}
	})
} // end removeTreeNode()


/**
 * Remove directions from current category
 *
 */
function removeDirection()
{
    formItems = new Array();
    Storages.directions.each(function(record, idx){
        if (record.data.remove == true) {
            formItems[formItems.length] = {
                xtype: 'hidden',
                name: 'directiondelete[' + idx + '][zoneid]',
                value: record.data.zoneid
            };
            formItems[formItems.length] = {
                xtype: 'hidden',
                name: 'directiondelete[' + idx + '][catid]',
                value: record.data.catid
            };
            formItems[formItems.length] = {
                xtype: 'hidden',
                name: 'directiondelete[' + idx + '][direction]',
                value: record.data.direction
            };
        }
    })
    Ext.each(formItems, function(item, idx){
        formItems[idx].id = '_' + formItems[idx].name
    });

	var F = Ext.getCmp('_categoryForm');
    removeChild(F, '_catsave_', formItems);
    F.doLayout(true); 

    F.getForm().submit({
        method: 'POST',
        waitTitle: Localize.Connecting,
        waitMsg: Localize.SendingData + '...',
        success: function(form, action){
            removeChild(Ext.getCmp('_categoryForm'), formItems, [{ xtype: 'hidden', id: '_catsave_', name: 'catsave', value: 1 }]);
            Ext.getCmp('_categoryForm').doLayout(true);
            Storages.directions.reload({params: { start: 0 }})
        },
        failure: function(form, action){
            if (action.failureType == 'server') {
                obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
            }
            removeChild(Ext.getCmp('_categoryForm'), formItems, [{ xtype: 'hidden', id: '_catsave_', name: 'catsave', value: 1 }]);
            Ext.getCmp('_categoryForm').doLayout(true);
            Storages.directions.reload({ params: { start: 0 } });
        }
    })
} // end removeDirection()


/**
 * Reload storages and refresh data in the grids and from
 * @param	integer, category ID
 */
function loadDataTo( node, catIdx )
{
	if(Ext.isEmpty(catIdx) && typeof node == 'object' && !Ext.isEmpty(node.id))
	{
		catIdx = node.attributes.catidx;

		// Try to push data from attribute to tabForm
		Ext.getCmp('_catidx_').setValue(catIdx);
		

		Ext.getCmp('_operid_').setValue(node.attributes.operid);
		Ext.getCmp('_catdescr_').setValue(node.attributes.descr);

        Ext.getCmp('_c_saledictionaryid_').setValue(node.attributes.saledictionaryid);

        if (node.attributes.saledictionaryid > 0){
            Ext.getCmp('_gaap').getEl().dom.innerHTML = node.attributes.gaap[0].gaap;
            Ext.QuickTips.register({
                target: Ext.getCmp('_gaap').getEl(),
                text: node.attributes.gaap[0].name
            });
        }else{
            Ext.getCmp('_gaap').getEl().dom.innerHTML = Ext.app.Localize.get('Not assigned');
            Ext.QuickTips.register({
                target: Ext.getCmp('_gaap').getEl(),
                text: Ext.app.Localize.get('Press for set GAAP code')
            });
        }
        Ext.getCmp('_catabove_').setValue(node.attributes.above);

        if (Storages.tarType() == 3 || Storages.tarType() == 4){
            try { Ext.getCmp('_catidxmaster_').setValue(node.attributes.catidxmaster); } catch(e) { }
        }

        try { Ext.getCmp('_disprior_').setValue(node.attributes.disprior); } catch(e) { }
		try { Ext.getCmp('_catincludes_').setValue(node.attributes.includes); } catch(e) { }
		try { Ext.getCmp('_catcommon_').setValue(node.attributes.common); } catch(e) { }
        try { Ext.getCmp('_catcommon_hidden_').setValue(node.attributes.common); } catch(e) { }
		try { Ext.getCmp('_permabove_').setValue(node.attributes.permabove); } catch(e) { }
		try { Ext.getCmp('_admblockabove_').setValue(node.attributes.admblockabove); } catch(e) { }
		try { Ext.getCmp('_usrblockabove_').setValue(node.attributes.usrblockabove); } catch(e) { }
		try { Ext.getCmp('_freeseconds_').setValue(node.attributes.freeseconds); } catch(e) { }
		try { Ext.getCmp('_roundseconds_').setValue(node.attributes.roundseconds); } catch(e) { }
		try { Ext.getCmp('_minchargedur_').setValue(node.attributes.minchargedur); } catch(e) { }
		try { Ext.getCmp('_catuuid_').setValue(node.attributes.uuid); } catch(e) { }
		try { Ext.getCmp('_keepturnedon_').setValue(node.attributes.keepturnedon); } catch(e) { }
		try { Ext.getCmp('_autoassign_').setValue(node.attributes.autoassign); } catch(e) { }
		try { Ext.getCmp('_catenabled_').setValue(node.attributes.enabled ? true : false); } catch(e) { }
		try { Ext.getCmp('_catavailable_').setValue(node.attributes.available ? true : false); } catch(e) { }
		try { Ext.getCmp('_uscript_').setValue(node.attributes.uscript); } catch(e) { }
		try { Ext.getCmp('_scriptoff_').setValue(node.attributes.scriptoff); } catch(e) { }
		try { Ext.getCmp('_catlink_').setValue(node.attributes.link); } catch(e) { }
		try { Ext.getCmp('_catdescrfull_').setValue(node.attributes.descrfull); } catch(e) { }
		try { Ext.getCmp('_dtvtype_').setValue(node.attributes.dtvtype); } catch(e) { }
		
		var elements_ids = ['_catcommon_','_catabove_', '_permabove_', '_admblockabove_', '_usrblockabove_'];
		for(var i = 0; i < elements_ids.length; i++) {
			try {
				var el = Ext.getCmp(elements_ids[i]);
				if(!Ext.isEmpty(node.attributes.usboxcount) && node.attributes.usboxcount > 0) {
					el.setReadOnly(false); // true
				}
				else {
					el.setReadOnly(false);
					el.setDisabled(false);
				}
			} catch(e) {}
		}
		
	}

	if(Ext.isEmpty(catIdx)) {
		return false;
	}
	if (Ext.getCmp('_discTab_').disabled) {
		Ext.getCmp('_discTab_').enable();
	}
	if (node.id == -1) {
		Ext.getCmp('dirTabInc').disable();
		if (Storages.tarType() == 3 || Storages.tarType() == 4) {
			Ext.getCmp('dirTabOut').disable();
			if (Storages.tarType() == 4) {
				Ext.getCmp('routeTab').disable();
			}
		}
		setWrite('_discFieldSet-2_');
	}
	else {
		try {
			var A = document.getElementById('_catnumbers_').value;
		}
		catch (e) {
			var A = 0
		}
		if (Storages.tarType() == 3 || Storages.tarType() == 4) {
			if (Storages.operMode.elused.length > 0 || A > 0) {
				Ext.getCmp('dirTabInc').enable();
				Ext.getCmp('dirTabOut').enable();
				if (Storages.tarType() == 4 && Storages.dynRoute()) {
					Ext.getCmp('routeTab').enable();
				}
				if (Storages.tarType() == 4 && !Storages.dynRoute()) {
					Ext.getCmp('routeTab').disable();
				}
			}
		}
		else {
			if (A > 0) {
				Ext.getCmp('dirTabInc').enable();
			}
		}
		if(Storages.used()) {
			switch (Storages.tarType()) {
				case "1":
				case "2":
					setReadOnly('_discFieldSet-2_', ['_catenabled_', '_catavailable_']);
				break;

				case "5":
					setReadOnly('_discFieldSet-2_', ['_catcommon_']);
				break;

				default:
					setReadOnly('_discFieldSet-2_');
			}
		}
	}
	if (Ext.getCmp('_catTabsPanel').getActiveTab().getId() == 'dirTabInc') {
	    Storages.directions.baseParams.category = catIdx;
	    Storages.directions.baseParams.dirtype = 1;
	    Storages.directions.reload({params: { start: 0 }})
	}
	else {
		if (Ext.getCmp('_catTabsPanel').getActiveTab().getId() == 'dirTabOut') {
			Storages.directions.baseParams.category = catIdx;
			Storages.directions.baseParams.dirtype = 2;
			Storages.directions.reload({ params: { start: 0 } })
		}
		else {
			for (var i in Storages.categories) {
				Storages.categories[i].baseParams.category = catIdx;
				if (node.id == -1) {
					Storages.categories[i].removeAll()
				}
				else {
					Storages.categories[i].reload();
				}
			}
		}
	}
	if(Storages.tarType() == 5 && document.getElementById("_cerber_").value == 1) {
		Storages.cerber_data.load({
			params: {
				async_call: 1,
				devision: 4,
				catid: catIdx,
				tarid: document.getElementById("_tarif_").value,
				get_cerber: 1
			}
		});
	}
} // end loadDataTo()


/**
 * Send data to server before there'll new data loaded
 * @param	object, tree node
 * @param	boolean, if need to save passed node with out check
 */
function saveNodeData( node, currNode )
{

	if(Storages.autoSave == false){
		return true;
	}
	if(Ext.isEmpty(currNode) || currNode == false){
		if(Storages.modified() == false || Storages.modified() == node.id){
			return true;
		}
	}
	else {
		if(Ext.isEmpty(node)){
			return true;
		}
	}
	if(Ext.isEmpty(node) || !node) {
		return true;
	}
	if(Ext.util.Format.uppercase(Ext.EventObject.getTarget().id) == 'SAVEBTN' ||
		Ext.util.Format.uppercase(Ext.get(Ext.EventObject.getTarget()).dom.parentNode.id) == 'SAVEBTN')
	{
		var clickOn = (Ext.util.Format.uppercase(Ext.EventObject.getTarget().id) != 'SAVEBTN') ? Ext.get(Ext.EventObject.getTarget()).dom.parentNode : Ext.EventObject.getTarget();
		try {
			clickOn.type = 'button';
			clickOn.id = ''
		} catch(e) { }
	}
	Storages.discToForm(Ext.getCmp('_categoryForm'));

	if(Storages.tarType() == 5 && document.getElementById("_cerber_").value == 1 ) {
		var mask = '';
		for(var i = 0; i < Storages.cerber_data.getCount(); i++)  {
			var rec = Storages.cerber_data.getAt(i);
			for(var j = 1 ; j <= 16; j++) {
				var val = rec.get("'" + j + "'");
				mask += val.toString();
			}
		}
		Ext.getCmp('_categoryForm').findById("_cerber_mask_").setRawValue(mask);
	}
	
	setDisc = [];
	if(Ext.getCmp('tarGridTabInc')) {
		var gStore = Ext.getCmp('tarGridTabInc').getStore();
		var i = 0;
		gStore.each(function(record){
			setDisc[i] = record.get('count') + ';' + record.get('rate');
			i++;
		});
	}
	
	Ext.getCmp('_categoryForm').getForm().submit({
		method:'POST', waitTitle: Localize.Connecting, waitMsg: Localize.SendingData + '...',
		params: {
			'setDisc[]': setDisc,
			roundseconds: node.attributes.roundseconds,
			disprior: node.attributes.disprior,
			dtvtype: node.attributes.dtvtype,
			enabled: node.attributes.enabled	
		},
		success: function(form, action){
			if(Storages.isOperMode() && (Storages.tarType() == 3 || Storages.tarType() == 4)) {
				sendFormInBack('_Tarif');
			}
			Storages.modified(false);
			Storages.discUnForm(Ext.getCmp('_categoryForm'));
			if(!Ext.isEmpty(clickOn)) {
				submitForm('_Tarif', 'save', 1);
			}
			else {
				Ext.getCmp('catList').root.reload(function(node) {
					Storages.currNode = false;
					node.selectChild.select(this.response.catidx);
				}, { response: Ext.util.JSON.decode(action.response.responseText) });
			}
		},
		failure: function(form, action){
			if(action.failureType == 'server')
			{
				obj = Ext.util.JSON.decode(action.response.responseText)
				Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
				if ("Category already used" === obj.errors.reason) { // Если категория уже используется, сбрасываем финансовую информацию к прежним значениям
					var old_finance_data = Storages.currNode.attributes;
					Ext.getCmp('_catabove_').setValue(old_finance_data.above);
					try { Ext.getCmp('_permabove_').setValue(old_finance_data.permabove); } catch(e) { }
					try { Ext.getCmp('_roundseconds_').setValue(old_finance_data.roundseconds); } catch(e) { }
					try { Ext.getCmp('_freeseconds_').setValue(old_finance_data.freeseconds); } catch(e) { }
					try { Ext.getCmp('_minchargedur_').setValue(old_finance_data.minchargedur); } catch(e) { }
					try { Ext.getCmp('_admblockabove_').setValue(old_finance_data.admblockabove); } catch(e) { }
					try { Ext.getCmp('_usrblockabove_').setValue(old_finance_data.usrblockabove); } catch(e) { }
					try { Ext.getCmp('_catincludes_').setValue(old_finance_data.includes); } catch(e) { }
					try { Ext.getCmp('_catcommon_').setValue(old_finance_data.common); } catch(e) { }
			        try { Ext.getCmp('_catcommon_hidden_').setValue(old_finance_data.common); } catch(e) { }
					try { Ext.getCmp('_disprior_').setValue(old_finance_data.disprior); } catch(e) { }
				}
			}
			Storages.modified(false);
			Storages.discUnForm(Ext.getCmp('_categoryForm'));
			//Storages.currNode = false;
			if(!Ext.isEmpty(clickOn)) {
				submitForm('_Tarif', 'save', 1);
			}
		}
	});

	return false;
} // end saveNodeData()


/**
 * Catalog content, returns object with directions list
 * @param	integer, tarif id
 * @param	integer, category id
 * @param	integer, direction value, actual to telephony
 */
function getCatalogContent( tarId, catIdx, Dir )
{
	if(!Ext.isEmpty(Ext.getCmp('dirWin'))) { return }
	if(!Ext.isEmpty(Ext.getCmp('dirWin'))) { return }
	
	if(Ext.isEmpty(catIdx) || catIdx == 0) {
		Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Action is not allowed for default category'));
		return false;
	}
	
	if(Ext.isEmpty(Dir)) { var Dir = 0; }
	var child = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
	if(!Ext.isEmpty(child)) {
		if(Storages.isOperMode()){
			if(Ext.isArray(Storages.operMode.elused)) {
				var catId = child.attributes.catid;
				if(catId == 0 && child.attributes.catidx == 0) {
					try {
						if(child.attributes.operid == child.nextSibling.attributes.operid) {
							var catId = child.nextSibling.attributes.catid;
						}
					}
					catch(e){ }
				}
			}
		} else{
			var catId = Storages.getCatEl();
			catId = catId.value;
		}
		if(catId <= 0) {
			alert(Localize.CatlgNotDef);
			return false;
		}
	}

	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php', method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total'
		}, [
			{ name: 'zoneid', type: 'int' },
			{ name: 'catid', type: 'int' },
			{ name: 'zoneclass', type: 'int' },
			{ name: 'zoneip', type: 'string' },
			{ name: 'zoneas', type: 'int' },
			{ name: 'zonemask', type: 'int' },
			{ name: 'port', type: 'int' },
			{ name: 'proto', type: 'int' },
			{ name: 'descr', type: 'string' },
			{ name: 'zonenum', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'zonedescr', type: 'string' },
            { name: 'catidxmaster', type: 'int' }
		]),
		baseParams:{
			async_call: 1,
			devision: 4,
			catcontent: catId,
			cattype: Storages.getCatType(),
			searchtype: 5
		},
		sortInfo: {
			field: "zoneid",
			direction: "ASC"
		}
	});
	Store.reload({params: { start: 0, limit: 50 }});

	Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, { width:280, initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); }, validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search', onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } }, onTrigger2Click : function(){ var v = this.getRawValue(); if(v.length < 1){ this.onTrigger1Click(); return; } var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); } });

	var comboView = { 1: [['1', 'IP ' + Localize.Address],['2', Localize.Protocol], ['3', Localize.Port], ['10', Localize.Descr]], 2: [['4', Localize.Number], ['10', Localize.Descr]], 3: [['5', Localize.Number], ['10', Localize.Descr]] }
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
            value: 5,
            editable: false,
            store: new Ext.data.SimpleStore({
                data: comboView[Storages.getCatType()],
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
        }),
        enableHdMenu: false,
        loadMask: true,
        cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel(), {
            header: 'ID',
            dataIndex: 'zoneid',
            width: 50,
            sortable: false
        }, {
            header: 'IP',
            dataIndex: 'zoneip',
            width: 100,
            sortable: false,
            hidden: (Storages.tarType() > 1) ? true : false
        }, {
            header: Localize.Mask,
            dataIndex: 'zonemask',
            width: 85,
            sortable: false,
            hidden: (Storages.tarType() > 1) ? true : false
        }, {
            header: Localize.Port,
            dataIndex: 'port',
            width: 85,
            sortable: false,
            hidden: (Storages.tarType() > 1) ? true : false
        }, {
            header: Localize.Protocol,
            dataIndex: 'proto',
            width: 85,
            sortable: false,
            hidden: (Storages.tarType() > 1) ? true : false
        }, {
            header: Localize.Number,
            dataIndex: 'as',
            width: 100,
            sortable: false,
            hidden: (Storages.tarType() != 2) ? true : false
        }, {
            header: Localize.Number,
            dataIndex: 'zonenum',
            width: 120,
            sortable: false,
            hidden: (Storages.tarType() != 3 && Storages.tarType() != 4) ? true : false
        }, {
            header: Localize.DirClass,
            dataIndex: 'zoneclass',
            width: 120,
            sortable: false,
            hidden: (Storages.tarType() != 3 && Storages.tarType() != 4) ? true : false
        }, {
            header: Localize.Descr,
            id: 'descr',
            dataIndex: 'descr',
            sortable: false
        }]),
        height: 400,
        autoExpandColumn: 'descr',
        sm: new Ext.grid.CheckboxSelectionModel(),
        store: Store
    });

	var CatForm = new Ext.form.FormPanel({
		frame: false,
		url: 'config.php',
		items: [{
			xtype: 'hidden',
			name: 'async_call',
			value: 1
		}, {
			xtype: 'hidden',
			name: 'devision',
			value: 4
		}, {
			xtype: 'hidden',
			name: 'tarid',
			value: tarId
		}, {
			xtype: 'hidden',
			name: 'catidx',
			value: catIdx
		}, {
			xtype: 'hidden',
			name: 'direction',
			value: Dir
		}],
		buttonAlign: 'center',
		buttons: [{
			text: Localize.Save,
			handler: function() {
				var rows = CatGrid.selModel.getSelections();
				for (var i in rows) {
					if (typeof rows[i] != 'object') continue;
					CatForm.insert(0, {
						xtype: 'hidden',
						name: 'directionsave[' + i + '][id]',
						value: rows[i].data.zoneid
					});
					CatForm.insert(0, {
						xtype: 'hidden',
						name: 'directionsave[' + i + '][catid]',
						value: rows[i].data.catid
					});
				}
				CatForm.doLayout();
				CatForm.getForm().submit({
					method: 'POST',
					waitTitle: Localize.Connecting,
					waitMsg: Localize.SendingData + '...',
					success: function(form, action) {
						Storages.directions.reload({
							params: {
								start: 0
							}
						});
						Win.close();
					},
					failure: function(form, action) {
						if (action.failureType == 'server') {
							obj = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.reason));
						}
						Win.close();
					}
				})
			}
		}, {
			text: Localize.Cancel,
			handler: function() {
				Win.close()
			}
		}]
	});

	var Win = new Ext.Window({ id: 'dirWin', layout: 'fit', title: Localize.Catalogue, plain: true, width: 600, defaults: { labelWidth: 140 }, items: [ CatGrid, CatForm ] });
	Win.show();
} // end getCatalogContent()


/**
 * Form to load catalogue from CSV file to server and put it to DB
 * @param	object, catalogue tree leaf
 */
function uploadDirCSV( object )
{
	if (!Ext.isEmpty(Ext.getCmp('winUpCsv'))) {
		return
	}
	if(Ext.isEmpty(object.catidx) || object.catidx == 0) {
		Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Action is not allowed for default category'));
		return false;
	}
    var child = Ext.getCmp('catList').getSelectionModel().getSelectedNode();
    if (!Ext.isEmpty(child)) {
        if (Storages.isOperMode()) {
            try {
                for (var i in Storages.operMode.elused) {
                    var catId = child.attributes.catid;
                    break;
                }
            }
            catch (e) {
                var catId = 0
            }
        }
        else {
            var catId = Storages.getCatEl();
            catId = catId.value;
        }
        if (catId <= 0) {
            alert(Localize.CatlgNotDef);
            return false;
        }
    }
    var formText = new Ext.Template('<div style="padding-bottom: 8px; color: red;">{text}</dv>');
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
				var O = Ext.util.JSON.decode(action.response.responseText);
				Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
					this.reload({
						params: {
							start: 0
						}
					});
				}.createDelegate(Storages.directions));
                Win.close();
            },
            failure: function(form, action){
				if (action.failureType == 'server') {
					var O = Ext.util.JSON.decode(action.response.responseText);
					if (!Ext.isArray(O.reason)) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason);
					}
					else {
						try {
							var Store = new Ext.data.ArrayStore({
								autoDestroy: true,
								idIndex: 0,
								data: O.reason,
								fields: [{
									name: 'number',
									type: 'string'
								}, {
									name: 'name',
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
									store: Store,
									height: 200,
									autoExpandColumn: 'nonedelreason',
									cm: new Ext.grid.ColumnModel({
										columns: [{
											header: Ext.app.Localize.get('Direction'),
											dataIndex: 'number',
											width: 170
										}, {
											header: Ext.app.Localize.get('Description'),
											dataIndex: 'name',
											width: 200
										}, {
											header: Ext.app.Localize.get('Reason'),
											dataIndex: 'reason',
											id: 'nonedelreason'
										}],
										defaults: {
											sortable: true,
											menuDisabled: false
										}
									})
								}]
							}).show();
						}
						catch (e) {

						}
					}
					Win.close();
				}
            }
		});
	}

    var Win = new Ext.Window({
        title: Localize.UplFile,
        id: 'winUpCsv',
        width: 337,
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
            html: formText.applyTemplate({
                text: Localize.FileFormatShouldBe
            }),
            items: [{
                xtype: 'hidden',
                name: 'devision',
                value: 4
            }, {
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'tarid',
                value: object.tarid
            }, {
                xtype: 'hidden',
                name: 'upcatidx',
                value: object.catidx
            }, {
                xtype: 'hidden',
                name: 'updirection',
                value: object.direction
            }, {
                xtype: 'hidden',
                name: 'upcatid',
                value: catId
            }, {
                xtype: 'fileuploadfield',
                emptyText: Localize.SelectFile,
                fieldLabel: Localize.File,
                name: 'upcontent',
                buttonCfg: {
                    text: '',
                    iconCls: 'ext-upload'
                }
            }],
            buttons: [{
                text: Localize.Upload,
                handler: sendData
            }, {
                text: Localize.Cancel,
                handler: function(){
                    Win.close();
                }
            }]
        }
    });
    Win.show();
} // end uploadCatCSV()


/**
 *
 */
function tariffPermission( tarid )
{
	if(!Ext.isDefined(tarid) || Ext.isEmpty(tarid)) {
		if (!Ext.get('_tarif_')) {
			return;
		}

		if(Ext.get('_tarif_').getValue() <= 0) {
			return
		}

		var tarid = Ext.get('_tarif_').getValue();
	}

	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php', method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'personid', type: 'int' },
			{ name: 'tarid', type: 'int' },
			{ name: 'fio', type: 'string' },
			{ name: 'login', type: 'string' },
			{ name: 'descr', type: 'string' },
			{ name: 'fread', type: 'int' },
			{ name: 'fwrite', type: 'int' }
		]),
		autoLoad: true,
		baseParams:{
			async_call: 1,
			gettarperm: tarid,
			devision: 13
		}
	});

	var Read = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('Read only'),
		dataIndex: 'fread',
		width: 105
	});

	var Write = new Ext.grid.CheckColumn({
		header: Ext.app.Localize.get('Read and write'),
		dataIndex: 'fwrite',
		width: 105
	});

	new Ext.Window({
		title: Ext.app.Localize.get('Permissions to access tariff') + (Ext.get('_descr_') ? ' (' + Ext.get('_descr_').getValue() + ')' : ''),
		width: 400,
		autoHeight: true,
		modal: true,
		resizable: false,
		items: new Ext.grid.GridPanel({
			xtype: 'grid',
			loadMask: true,
			store: Store,
			height: 380,
			plugins: [ Read, Write ],
			loadMask: true,
			autoExpandColumn: 'mancol',
			cm: new Ext.grid.ColumnModel({
				columns: [{
					header: Ext.app.Localize.get('Manager'),
					dataIndex: 'fio',
					id: 'mancol',
					sortable: true,
					renderer: function(value, metaData, record) {
						return '<span ext:qtip="' + record.get('descr') + '">' + value + ' (' + record.get('login') + ')</span>'
					}
				}, Read, Write]
			}),
			tbar: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Save'),
				iconCls: 'ext-save',
				handler: function() {
					if(!Ext.getCmp('savetarpermform')) {
						var form = new Ext.form.FormPanel({
							url: 'config.php',
							method: 'POST',
							id: 'savetarpermform',
							renderTo: Ext.getBody()
						});
					}
					else {
						var form = Ext.getCmp('savetarpermform');
					}

					var params = {
						async_call: 1,
						devision: 13,
						savetarpermid: this.ownerCt.ownerCt.store.baseParams.gettarperm
					};

					this.ownerCt.ownerCt.store.each(function(record){
						this['savetarperm[' + record.get('personid') + '][fread]'] = record.get('fread');
						this['savetarperm[' + record.get('personid') + '][fwrite]'] = record.get('fwrite');
						this['savetarperm[' + record.get('personid') + '][fio]'] = record.get('fio');
					}, params);

					form.getForm().submit({
						params: params,
						scope: this.ownerCt.ownerCt,
						waitTitle: Ext.app.Localize.get('Connecting'),
						waitMsg: Ext.app.Localize.get('Sending data') + '...',
						success: function(form, action) {
							var O = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function() {
								this.reload();
							}.createDelegate(this.store));
						},
						failure: function(form, action) {
							if (action.failureType == 'server') {
								var O = Ext.util.JSON.decode(action.response.responseText);
								if (!Ext.isArray(O.reason)) {
									Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function() {
										this.reload();
									}.createDelegate(this.store));
								}
								else {
									try {
										var Store = new Ext.data.ArrayStore({
											autoDestroy: true,
											idIndex: 0,
											data: O.reason,
											fields: [{
												name: 'personid',
												type: 'int'
											}, {
												name: 'fio',
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
											listeners: {
												close: function() {
													this.reload()
												}.createDelegate(this.store)
											},
											items: [{
												xtype: 'grid',
												store: Store,
												height: 200,
												autoExpandColumn: 'nonedelreason',
												cm: new Ext.grid.ColumnModel({
													columns: [{
														header: Ext.app.Localize.get('Manager'),
														dataIndex: 'fio',
														width: 200
													}, {
														header: Ext.app.Localize.get('Reason'),
														dataIndex: 'reason',
														id: 'nonedelreason'
													}],
													defaults: {
														sortable: true,
														menuDisabled: false
													}
												})
											}]
										}).show();
									}
									catch (e) { }
								}
							}
						}
					});
				}
			}]
		})
	}).show();
} // end tariffPermission()


function checkCoefField(str){
	str = alltrim(str);
	return /^[-+]?[0-9]+(\.[0-9]+)?$/.test(str);
}


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


/**
 */
function saleDictionary(idField,linkField,form)
{
	saleDictionaryWin({
		sm: true,
		hideToolbar: true,
		callbackok: function(grid) {
			var sm = grid.getSelectionModel().getSelected();
            recordid = sm.get('recordid');
            gaap = sm.get('gaap');
            name = sm.get('name');
            try {
                document.getElementById(idField).value = recordid;
                document.getElementById(linkField).innerHTML = gaap + ': ' + name;
            } catch(e) {
                return false;
            }
		}.createDelegate(Ext.get(form))
	});
} // end getParentVgroup()



function saleDictionaryWin(A) {

    PPAGELIMIT = 100;

    if (Ext.isEmpty(A)) {
        A = {
            sm: true,
            callbackok: false,
            callbackcl: false
        }
    }
    try {
        if (Ext.isEmpty(Localize)) {
            Localize = {}
        }
    } catch (e) {
        Localize = {}
    }
    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        initComponent: function() {
            Ext.app.SearchField.superclass.initComponent.call(this);
            this.on('specialkey', function(f, e) {
                if (e.getKey() == e.ENTER) {
                    this.onTrigger2Click();
                }
            }, this);
        },
        validationEvent: false,
        validateOnBlur: false,
        trigger1Class: 'x-form-clear-trigger',
        trigger2Class: 'x-form-search-trigger',
        hideTrigger1: true,
        hasSearch: false,
        paramName: 'search',
        onTrigger1Click: function() {
            if (this.hasSearch) {
                this.el.dom.value = '';
                var o = {
                    start: 0,
                    limit: 100
                };
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({
                    params: o
                });
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click: function() {
            var v = this.getRawValue();
            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            };
            var o = {
                start: 0,
                limit: 100
            };
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({
                params: o
            });
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader(
            { root: 'results', totalProperty: 'total' },
            [
                { name: 'recordid',  type: 'int' },
                { name: 'gaap',      type: 'int' },
                { name: 'name',      type: 'string' },
                { name: 'unit',      type: 'string' },
                { name: 'unitmult',  type: 'int' },
                { name: 'modperson', type: 'int' }
            ]
        ),
        baseParams: {
            async_call: 1,
            devision: 4,
            getSaleDictionary: 1,
            start: 0,
            limit: PPAGELIMIT
        },
        sortInfo: {
            field: 'name',
            direction: "ASC"
        }
    });

    if (!Ext.isEmpty(A.filter)) {
        for (var i in A.filter) {
            if (typeof A.filter[i] != 'function') {
                store.baseParams[i] = A.filter[i];
            }
        }
    }

    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: Ext.isEmpty(A.sm) ? true : A.sm
    });
    var colModel = new Ext.grid.ColumnModel([
        sm, {
            header: Ext.app.Localize.get('Name'),
            dataIndex: 'name',
            id: 'name',
            sortable: true
        }, {
            header: Ext.app.Localize.get('Unit of m.'),
            dataIndex: 'unit',
            width: 80
        }, {
            header: Ext.app.Localize.get('Code'),
            dataIndex: 'gaap',
            sortable: true
        }
    ]);
    var Btn = new Array();
    if (!Ext.isEmpty(A.callbackok)) {
        Btn.push({
            xtype: 'button',
            text: Ext.app.Localize.get('Add'),
            handler: function(button) {
                var parent = button.findParentByType('window');
                if (typeof A.callbackok == 'function') {
                    A.callbackok(parent.findByType('grid')[0]);
                }
                parent.close();
            }
        })
    };
    Btn.push({
        xtype: 'button',
        text: Ext.app.Localize.get('Cancel'),
        handler: function(button) {
            var parent = button.findParentByType('window');
            if (typeof A.callbackcl == 'function') {
                A.callbackcl(parent.findByType('grid')[0]);
            };
            parent.close();
        }
    });

    var Win = new Ext.Window({
        title: Ext.app.Localize.get('List of services'),
        id: 'saleDictListWin',
        buttonAlign: 'center',
        width: 653,
        layout: 'fit',
        items: [{
            xtype: 'grid',
            width: 640,
            id: '_saleDictListWin',
            height: 350,
            store: store,
            cm: colModel,
            loadMask: true,
            autoExpandColumn: 'name',
            sm: sm,
            bbar: [
                new Ext.PagingToolbar({
                    pageSize: PPAGELIMIT,
                    store: store,
                    displayInfo: true,
                    items: [{
                        xtype: 'combo',
                        width: 70,
                        displayField: 'id',
                        valueField: 'id',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        value: PPAGELIMIT,
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
                                PPAGELIMIT = this.getValue();
                                this.ownerCt.pageSize = PPAGELIMIT;
                                store.reload({ params: { limit: PPAGELIMIT } });
                            }
                        }
                    }
                    ]
                })
            ]
        }],
        buttons: Btn
    });
    Win.show();
    store.reload({
        params: {
            start: 0,
            limit: 100
        }
    });
} // end saleDictionary()



function insUpdSalesDictionary(Object)
{
    isInsert = (typeof Object.editSalesDict == 'undefined') ? true : false;
    Object.editSalesDict = Object.editSalesDict || {
        data: {
            gaap: '',
            name: '',
            recordid: 0
        }
    };
    Store = Object['Store'];
    if (!Ext.isEmpty(Ext.getCmp('winInsUpdSalesDict'))) { return; }
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                Store.reload({
                    params: {
                        start: 0,
                        limit: 100
                    }
                });
                Win.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
					Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(obj.errors.reason));
                };
                //Win.destroy();
            }
        });
    }

    var Win = new Ext.Window({
        title: (isInsert) ? Ext.app.Localize.get('Add service') : Ext.app.Localize.get('Edit service'),
        id: 'winInsUpdSalesDict',
        renderTo:Ext.getBody(),
        width: 450,
        height: 200,
        border:false,
        layout:'fit',
        items: [{
            xtype: 'form',
            buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame:true,
            labelWidth: 120,
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 4 },
                { xtype: 'hidden', name: 'insUpdSalesDictionary', value: 1 },
                { xtype: 'hidden', name: 'isInsert', value: isInsert?1:0 },
                { xtype: 'hidden', name: 'recordid', value: Object.editSalesDict.data.recordid},
                {
                    xtype: 'numberfield',
                    name: 'gaap',
                    id: 'gaap',
                    width: 180,
                    allowDecimals: false,
                    allowNegative: false,
                    blankText: Ext.app.Localize.get('GAAP code'),
                    fieldLabel: Ext.app.Localize.get('GAAP Code'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9]"),
                    value: Object.editSalesDict.data.gaap,
                    anchor:'-18'
                },
                {
                    xtype: 'textarea',
                    name: 'name',
                    id: 'name',
                    fieldLabel: Ext.app.Localize.get('Service description'),
                    allowBlank: false,
                    enableKeyEvents: true,
                    height:80,
                    width: 280,
                    value: Object.editSalesDict.data.name,
                    autoScroll:true,
                    anchor:'-18 -28'
                    //listeners: {
                    //    render: {
                    //        fn: function(f){
                    //            f.resizer=new Ext.Resizable(f.getEl(),{handles:'s,se,e',wrap:true});
                    //            f.resizer.on('resize',function(){delete f.anchor;});
                    //        }
                    //    }
                    //},
                    //onResize: function(){
                    //  Ext.form.TextArea.superclass.onResize.apply(this, arguments);
                    //  var r = this.resizer;
                    //  var csize = r.getResizeChild().getSize();
                    //  r.el.setSize(csize.width, csize.height);
                    //}
                }
            ],
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                formBind: true,
                handler: sendData
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Cancel'),
                handler: function(){
                    Win.close();
                }
            }]
        }]
    });
    Win.show();
}


/**
 * Get CAS packages
 */
function getCASPackages(config)
{
    var config = config || {};
    
    new Ext.Window({
        title: Ext.app.Localize.get('CAS Packages'),
        constrain: true,
        modal: true,
        layout: 'fit',
        height: 400,
        width: 600,
        buttonAlign: 'center',
        buttons: [{
            text: Ext.app.Localize.get("Choose"),
            handler: function(Btn) {
                var grid = Btn.findParentByType('window').get(0);
                if(config.callback && grid.getSelectionModel().getSelected()) {
                    config.callback(grid);
                }
                grid.ownerCt.close();
            }
        }],
        items: {
            xtype: 'grid',
            loadMask: true,
            PAGELIMIT: 100,
            autoExpandColumn: 'cas-pack-name-exp',
            listeners: {
                beforerender: function(grid) {
                    // Add selection
                    var model = grid.getColumnModel();
                    model.config.unshift(grid.getSelectionModel())
                    model.setConfig(model.config);
                    
                    // Set paging bar
                    grid.getStore().setBaseParam('limit', grid.PAGELIMIT);
                    var bbar = grid.getBottomToolbar();
                    bbar.pageSize = grid.PAGELIMIT;
                    bbar.bindStore(grid.store);
                    bbar.add(['-', {
                        xtype: 'combo',
                        width: 70,
                        displayField: 'id',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all',
                        value: grid.PAGELIMIT,
                        editable: false,
                        store: {
                            xtype: 'arraystore',
                            data: [[20], [50], [100], [500]],
                            fields: ['id']
                        },
                        listeners: {
                            select: function(c){
                                this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
                                this.store.reload({
                                    params: {
                                        limit: this.PAGELIMIT
                                    }
                                });
                            }.createDelegate(grid)
                        }
                    }]);
                    // Synchronize filter with store
                    grid.getStore().syncStore = function() {
                        this.getTopToolbar().syncToolStore();
                        return this.getStore().baseParams;
                    }.createDelegate(grid);
                }
            },
            tbar: [Ext.app.Localize.get('Search') + ': ', {
                xtype: 'textfield',
                name: 'fullsearch',
                width: 180,
                listeners: {
                    afterrender: function() {
                            this.on('specialkey', function(f, e){
                            if (e.getKey() == e.ENTER) {
                                var Btn = this.ownerCt.get('searchBtn');
                                Btn.handler(Btn);
                            }
                        }, this);
                    }
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'button',
                iconCls: 'ext-search',
                itemId: 'searchBtn',
                text: Ext.app.Localize.get('Show'),
                handler: function(Btn) {
                    Btn.findParentByType('grid').getStore().reload({
                        start: 0
                    });
                }
            }],
            bbar: {
                xtype: 'paging',
                pageSize: 0,
                displayInfo: true
            },
            sm: new Ext.grid.CheckboxSelectionModel({ singleSelect: true }),
            columns: [{
                header: Ext.app.Localize.get('Tag'),
                dataIndex: 'tag',
                width: 80
            }, {
                header: Ext.app.Localize.get('Name'),
                dataIndex: 'name',
                id: 'cas-pack-name-exp'
            }],
            store: {
                xtype: 'jsonstore',
                root: 'results',
                totalProperty: 'total',
                fields: ['recordid', 'tag', 'name'],
                autoLoad: true,
                baseParams: {
                    async_call: 1,
                    devision: 4,
                    getcaspacks: 1,
                    fullsearch: null,
                    start: 0,
                    limit: 100
                }
            }
        }
    }).show();
} // end getCASPackages()

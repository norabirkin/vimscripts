/**
 * Operators client control engine
 * Onready action start rendering
 */ 

Ext.onReady(function() {
	// Call indetification settings
	callProperties('OperProp');
	// Call  prime cost grid
	primeCostGrid('PrimeCost');
	// Field type input
	onlyNumeric('_rs_, _korrs_, _bik_, _inn_, _kpp_');
});


/**
 * Operator properties to identify call
 * @param	string, render to
 */
function callProperties(renderTo){
    if (!document.getElementById(renderTo)) 
        return;
    if (!document.getElementById('_operator_')) {
        return false;
    }
    else {
        var operId = document.getElementById('_operator_').value;
    }
    addLine = function(){
        var grid = Ext.getCmp('opertrunks');
        grid.stopEditing();
        var row = new Rows({
            recordid: 0,
            operid: operId,
            tokentype: 0,
            trunk: '',
            id: 0
        });
        grid.store.insert(0, row);
    }
    renderToken = function(value){
        if (value == 0) {
            return Localize.LineId;
        }
        else {
            return Localize.Route;
        }
    }
    renderModule = function(value){
        try {
            if (value > 0) {
                return Modules.getAt(Modules.find('id', value)).data.nameelipse;
            }
            else {
                return '...'
            }
        } 
        catch (e) {
            return '...';
        }
    }
    var Rows = Ext.data.Record.create([{
        name: 'recordid',
        type: 'int'
    }, {
        name: 'aid',
        type: 'int'
    }, {
        name: 'operid',
        type: 'int'
    }, {
        name: 'tokentype',
        type: 'int'
    }, {
        name: 'trunk',
        type: 'string'
    }]);
    var Store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, Rows),
        baseParams: {
            async_call: 1,
            devision: 201,
            getoperstaff: operId
        },
        sortInfo: {
            field: 'trunk',
            direction: "ASC"
        }
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
            name: 'nameelipse',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 201,
            getmodules: 1
        },
        listeners: {
            load: function(store){
                store.each(function(record){
                    record.data.nameelipse = Ext.util.Format.ellipsis(record.data.name, 20)
                });
                Store.load();
            }
        },
        autoLoad: true
    });
    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.Remove,
        dataIndex: 'recordid',
        width: 22,
        iconCls: 'ext-drop'
    });
    new Ext.grid.EditorGridPanel({
        id: 'opertrunks',
        store: Store,
        cm: new Ext.grid.ColumnModel([{
            header: Localize.OperSign,
            id: '_trunk',
            dataIndex: 'trunk',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: Localize.Module,
            id: '_id',
            dataIndex: 'aid',
            width: 130,
            sortable: true,
            editor: new Ext.form.ComboBox({
                displayField: 'nameelipse',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                lazyRender: true,
                store: Modules
            }),
            renderer: renderModule
        }, {
            header: Localize.Type,
            id: '_tokentype',
            dataIndex: 'tokentype',
            width: 130,
            sortable: true,
            editor: new Ext.form.ComboBox({
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                lazyRender: true,
                store: new Ext.data.SimpleStore({
                    data: [['0', Localize.LineId], ['1', Localize.Route]],
                    fields: ['id', 'name']
                })
            }),
            renderer: renderToken
        }, Remove]),
        plugins: Remove,
        width: 443,
        height: 200,
        renderTo: renderTo,
        autoExpandColumn: '_trunk',
        tbar: [{
            xtype: 'button',
            text: Localize.Add,
            iconCls: 'ext-add',
            handler: addLine
        }],
        title: Localize.TraceOper,
        clicksToEdit: 1,
        loadMask: true
    });
    Remove.on('action', function(grid, record, rowIndex){
        grid.stopEditing();
        grid.store.remove(record)
    });
} // end callProperties()


/**
 * Prime cost grid for the operator
 * @param	string, render to
 */
function primeCostGrid( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	if(!document.getElementById('_operator_')){ return false; } else{ var operId = document.getElementById('_operator_').value; };
	var Tarifs = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'id', type: 'int' }, { name: 'type', type: 'int' }, { name: 'name', type: 'string' }, { name: 'nameelipse', type: 'string' }]), baseParams: { async_call: 1, devision: 201, gettarifs: 1 }, listeners: { load: function(store){ store.insert(0, new store.recordType({ id: 0, name: Localize.Undefined, type: -1, nameelipse: Localize.Undefined})); store.each(function(record){ record.data.nameelipse = Ext.util.Format.ellipsis(record.data.name, 30) }); Grid.store.load(); } }, autoLoad: true });
	filterTarif = function(){ switch(Ext.getCmp('opercost').getSelectionModel().getSelected().data.type){ case 1: case 2: case 3: case 4: case 5: var type = '-1|0'; break; case 6: var type = '-1|1|2'; break; case 7: case 8: case 9: case 10: case 11: var type = '-1|3'; break; case 12: var type = '-1|4'; break; default: var type = '-1' }; this.store.filter('type', new RegExp(type)) };
	initTarName = function(value, meta, record){ var record = Tarifs.find('id', value); if(record > -1){ return Tarifs.getAt(record).data.name } else{ try{ if(value > 0){ return  Tarifs.getAt(record).data.tarname } else{ return Localize.Undefined; } } catch(e){ return Localize.Undefined; } } }
	var Grid = new Ext.grid.EditorGridPanel({ id: 'opercost', store: new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }), reader: new Ext.data.JsonReader({ root: 'results' }, [{ name: 'id', type: 'int' }, { name: 'type', type: 'int' }, { name: 'name', type: 'string' }, { name: 'tarid', type: 'int' }, { name: 'tarname', type: 'string' }]), baseParams: { async_call: 1, devision: 201, getopertarifs: operId }, sortInfo: { field: 'id', direction: 'ASC' } }), cm: new Ext.grid.ColumnModel([ { header: Localize.Module + ' ID', id: '_id', dataIndex: 'id', width: 70, sortable: true }, { header: Localize.Description, id: '_descr', dataIndex: 'name', width: 130, sortable: true }, { header: Localize.Tarif, id: '_tarif', dataIndex: 'tarid', width: 170, sortable: true, editor: new Ext.form.ComboBox({  displayField: 'nameelipse', valueField: 'id', typeAhead: true, emptyText: '...', mode: 'local', triggerAction: 'all', lazyRender: true, store: Tarifs, listeners: { expand: filterTarif }}), renderer: initTarName }]), width: 443, height: 200, renderTo: renderTo, autoExpandColumn: '_descr', clicksToEdit: 1, loadMask: true, selModel: new Ext.grid.RowSelectionModel({ singleSelect: true }), title: Localize.PrimeCost});
} // end primeCostGrid()


/**
 * Extract data from storages to the main form before submiting
 * @param	object HTMLForm or Form id
 * @param	string or Mixed string if the ids
 */
function Extract( form, El )
{
	if(Ext.isEmpty(El)) { return false; }
	if(typeof form != 'object') { try{ var form = document.getElementById(form); } catch(e){ return false; } }
	if(typeof El != 'object') { var El = [El]; }
	for(var i in El){ if(typeof El == 'function'){ continue; }; try{ Ext.getCmp(El[i]).store.each(function(record, rowIndex){ if(record.data.id > 0 || record.data.aid ){ for(var j in record.data){ if(typeof record.data[j] == 'function'){ continue; }; createHidOrUpdate(form, El[i] + '[' + rowIndex + '][' + j + ']', record.data[j]); }} }) } catch(e){ continue; } }
	submitForm(form.id, 'save', 1);
} // end Extract()


/**
 * Apply selected address value to control fields
 * 
 */
function apply(A, B) {
	try { B.stringEl.value = A.get(A.full); B.codeEl.value = A.get(A.code); B.stringElSh.value = A.get(A.clear); } catch(e) { }
} // end apply()


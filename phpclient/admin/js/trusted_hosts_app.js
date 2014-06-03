/**
 * @author Vlad B. Pinzhenin
 */

/**
 * Storages collection object
 * An implementation of hidden values creation to be able to save changes over form submittion
 * Result: there will be a hidden elements created 
 */
var Storages = {
	store: false, 
	removed: new Array(), 
	grid: false,
	extract: function( _formId ){
		createHidOrUpdate(_formId, 'savetrusteds',1);
		this.store.each(function(record, idx){
			if(record.dirty == true || record.data.id == 0) {
				var remove = false;
				var save = (record.data.id == 0) ? true : false;;
				
				if(record.data.remove == false) {
					for(var j in record.data){
						if(j == 'remove') continue;
						createHidOrUpdate(_formId, 'throwupd[' + idx + '][' + j + ']', record.data[j]);
					}
				}
			}
		}, this);
		
		if(this.removed.length > 0) {
			for(var i in this.removed) {
				if(typeof this.removed[i] == 'function') continue;
				createHidOrUpdate(_formId, 'throwdel[' + i + '][id]', this.removed[i].id);
			}
		}
	}
} // end Storages{ }

// alert('This is a trusted hosts application!');

Ext.onReady(function(){
    Ext.QuickTips.init();
	var fm = Ext.form;
	
	// custom column to be able to remove this row
    var checkColumn = new Ext.grid.CheckColumn({
       header: Localize.Remove,
       dataIndex: 'remove',
       width: 75
    });
	
	var th_cm = new Ext.grid.ColumnModel([{
           id:'ip',
           header: Localize.Ip_address,
           dataIndex: 'ip',
           width: 200,
		   editor: new fm.TextField({
				allowBlank: false,
				maskRe: new RegExp("[0-9\.]")
			})
        },{
		   id:'mask',
           header: Localize.Ip_mask,
           dataIndex: 'mask',
           width: 200,
		   editor: new fm.TextField({
				allowBlank: false,
				maskRe: new RegExp("[0-9\.]")
			})
        },{
		   id:'description',
           header: Localize.Description,
           dataIndex: 'description',
           width: 225,
		   editor: new fm.TextField({
		   allowBlank: false 
		   })
		},
        checkColumn
    ]);
	
	th_cm.defaultSortable = true;
	
	var thRows = Ext.data.Record.create([
		{ name: 'id', type: 'int' }, 
		{ name: 'ip', type: 'string' },
		{ name: 'mask', type: 'string'},
	    { name: 'description', type: 'string'},
		{ name: 'remove', type: 'int'}
		]);
	
	// Create the Data Store for Trusted hosts list
	
	Storages.store = new Ext.data.Store({
	    id: 'th_store',
	    proxy: new Ext.data.HttpProxy({
	                url: 'config.php',      									// File to connect to
	                method: 'POST'
	            }),
	    baseParams: {async_call: 1, devision: 501, getTrustedHosts: 1}, 		// Get active trusted hosts list 
		reader: new Ext.data.JsonReader({   									// we tell the datastore where to get his data from
	    root: 'results',
		// totalProperty: 'total',
	    id: 'trusted_list'
	  	},
		thRows),
		// listeners: { load: function(store, data, object) { alert(1)}},
	    sortInfo:{field: 'ip', direction: "ASC"},
		autoLoad: true
    });
	

	
	// Create the trusted hosts editor grid
    Storages.grid = new Ext.grid.EditorGridPanel({
        store: Storages.store,
        cm: th_cm,
		loadMask: true,
        renderTo: 'th-editor-grid',
        width:800,
        height:400,
        autoExpandColumn: 'description',
        title: Localize.TrustedTitle,
        frame:true,
        plugins:checkColumn,
        clicksToEdit:1,
		tbar: [{
			text: Localize.Save, iconCls: 'ext-save',
			handler: function() { 
				Storages.extract('_TrustedHosts')
				try { document.getElementById('_TrustedHosts').submit() } catch(e) { }
			}
		},'-', {
			text: Localize.Add,
			iconCls: 'ext-add',
			handler: function() {
				var row = new thRows({
					id: 0, 
					ip: '127.0.0.1', 
					mask: '255.255.255.255',
					description: 'User added trusted host',
					remove: false
				});
				Storages.grid.stopEditing();
				Storages.store.insert(0, row);
				Storages.grid.startEditing(0, 0);
			}
		}, '-', {
			xtype: 'button',
			text: Localize.Remove,
			iconCls: 'ext-remove',
			handler: function() {
				Storages.grid.stopEditing();
				Storages.store.each(function(record) { 
					if(record.data.remove == true) {
						if(record.data.id > 0) {
							Storages.removed[ Storages.removed.length ] = record.data;
						}
						
						Storages.store.remove(record);
					}
				})
			}
		}]
    });

    // trigger the data store load
    //th_store.load();
	
	
});

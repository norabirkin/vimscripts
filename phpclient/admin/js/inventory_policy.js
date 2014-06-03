/* 
 * Billing system Inventory control policies functions and objects
 * 
 * Repository information:
 * $Date: 2009-12-01 14:47:22 $
 * $Revision: 1.1.2.8 $
 */


function show_grids() {

	var policies_store = new Ext.data.Store({
	    url: 'config.php',
	    baseParams: {
	        devision: 208,
	        async_call: 1,
	        get_policies: 1
	    },
	    reader: new Ext.data.ArrayReader({
	        idIndex: 0
	    }, [{
	        name: 'id',
	        type: 'int'
	    }, {
	        name: 'name',
	        type: 'string'
	    }, {
	        name: 'desc',
	        type: 'string'
	    }, {
	        name: 'script',
	        type: 'string'
	    }]),
		listeners: {load: function() { this.each( function(record){
												  	var s = record.get("script");													 
													s = s.replace(/<br>/ig,'\r\n'); 
													record.set("script", s);
													record.dirty = false; 
													}
													)}}	
	});	
	var Edit = new Ext.grid.RowButton({
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-edit'
    });	
	var edit_policy = function(grid, record, rowIndex, e){
		var default_script = "function get(state_id, port_name, vlan)\r\n return false\r\nend\r\n\r\nfunction set(state_id, port_name, vlan)\r\n return false\r\nend";
		var text_area = new Ext.form.TextArea({					
					id: 'script_texarea',
					height: 386,
					width: 384,
					value: (record.get("id")) ? record.get("script") : default_script
		});
		var wnd = new Ext.Window({
					title: Localize.Script,						
					width: 400,
					height: 420,
					autoScroll: true,
					id: 'script_wnd',
					plain: true,
					modal: true,
					items: [text_area],
					listeners: {
						close: function() {
							record.set("script", text_area.getValue());
						}
					}
					})
					wnd.show();
	};	
	Edit.on('action', edit_policy);
	function check_changes(params) {
		var index = params.grid.getStore().findBy(function(rec){ if(rec.dirty) return true;});				
		if(index != -1) {
			Ext.Msg.show({
				width: 400,
				msg: Localize.SaveChanges + '?',
				buttons: Ext.Msg.YESNO,
				fn: function(btn){
							if (btn == "yes") {
								save(params.grid.getStore(), params.array_name, params.action);
								params.callback();
							} else {
								params.callback();
							}							
						}
					
			});			
		}	
		else {
			params.callback();
		}
	};	
	var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',        
        dataIndex: 'id',
        width: 22,
        iconCls: 'ext-drop'
    });
	var remove_policy = function(grid, record, rowIndex, e){	
		if (!record.get("id")) {
            grid.stopEditing();
            policies_store.remove(record);
            grid.startEditing(0, 0);
            return;
        }
		if(record.get("id") == 1)
			return;	
		check_changes({grid: policy_grid, 
					   array_name: "policies[]", 
					   action: "save_policies", 
					   callback: function(){
					   	Ext.Ajax.request({
					   		url: 'config.php',
					   		method: "POST",
					   		params: {
					   			devision: 207,
					   			async_call: 1,
					   			delete_policy: 1,
					   			policy_id: record.get("id")
					   		},
					   		callback: function(options, success, response){
					   			policies_store.removeAll();
					   			policies_store.load();					   			
					   		}
					   	})
					   }	
					})		
			
    };
    Remove.on('action', remove_policy);		
	function save(store, param_name, action){
		p = [];
		store.each( function(record) {			
			if(record.dirty) {
				var o = [];
				record.fields.eachKey(function(key, value){
					var v = (typeof record.get(key) == 'undefined') ? '' : record.get(key);								
            		o.push(v);
				});
				p.push(o);					
			}
		});
		params = {
       		devision: 208,
            async_call: 1			
       };
	   params[param_name] = p;
	   params[action] = 1;
	   Ext.Ajax.request({
       		url: 'config.php',
            method: "POST",
            params: params,
            callback: function(options, success, response){
                      	Ext.Msg.alert(Localize.Status, response.responseText, function(){
                       	store.load()
                       })
                    }
            });
	};	
	var height = 400;
	var new_rec_id = 0;
    var policy_grid = new Ext.grid.EditorGridPanel({
		title: Localize.Policies,
        collapsible: false,		
        id: "policy_grid",
        height: height,
		width: 480,
        clicksToEdit: 1,
        tbar: [{
            text: Localize.Save,
            iconCls: 'ext-save',
            handler: function(){
                save(policies_store, "policies[]", "save_policies");
            }
        }, {
            text: Localize.Add,
            iconCls: 'ext-add',
            handler: function(){
                policy_grid.stopEditing();
                var r = new policies_store.recordType({
                    name: '',
                    desc: '',
                    script: ''                    
                }, new_rec_id++);
                policies_store.insert(0, r);
                policy_grid.startEditing(0, 0);
            }
        }],
        cm: new Ext.grid.ColumnModel([ Edit, {
			header: 'ID',
			width: 30,
            dataIndex: 'id'            
        }, {
            header: Localize.Name,
            width: 100,
            dataIndex: 'name',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: Localize.Description,
            width: 280,
            dataIndex: 'desc',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        },Remove ]),
        ds: policies_store,
        plugins: [Edit, Remove]  
    });	
	var state_store = new Ext.data.Store({
	    url: 'config.php',
	    baseParams: {
	        devision: 208,
	        async_call: 1,
	        get_port_states: 1
	    },
	    reader: new Ext.data.ArrayReader({
	        //idIndex: 0
	    }, [{
	        name: 'state_id',
	        type: 'int'
	    }, {
	        name: 'name',
	        type: 'string'
	    }, {
	        name: 'desc',
	        type: 'string'
	    }, {
	        name: 'icon',
	        type: 'string'
	    }])
	});
	var RemoveState = new Ext.grid.RowButton({
        header: '&nbsp;',        
        dataIndex: 'id',
        width: 22,
        iconCls: 'ext-drop'
    });
	var remove_state = function(grid, record, rowIndex, e){		
        if (typeof record.get("state_id") == 'undefined') {
            grid.stopEditing();
            state_store.remove(record);
            grid.startEditing(0, 0);
            return;
        }		
		var state_id = record.get("state_id");		
		if(state_id == 0 || state_id == 1 || state_id == 2)
			return;
		check_changes({grid: state_grid, 
					   array_name: "states[]", 
					   action: "save_states", 
					   callback: function(){
									Ext.Ajax.request({
										url: 'config.php',
										method: "POST",
										params: {
											devision: 207,
											async_call: 1,
											delete_port_state: 1,
											state_id: record.get("state_id")
										},
										callback: function(options, success, response){
											state_store.removeAll();
											state_store.load();											
										}
									});
								}
					});			
    };
    RemoveState.on('action', remove_state);	
	var state_row_index = 0;
	var state_grid = new Ext.grid.EditorGridPanel({
		title: Localize.PortStates,
        collapsible: false,		
        id: "state_grid",
        height: height,
		width: 468,
        clicksToEdit: 1,
        tbar: [{
            text: Localize.Save,
            iconCls: 'ext-save',
            handler: function(){
				if(icon_list.isVisible()) {
					icon_list.hide();
				}
                save(state_store, "states[]", "save_states");
            }
        }, {
            text: Localize.Add,
            iconCls: 'ext-add',
            handler: function(){
                state_grid.stopEditing();
                var r = new state_store.recordType({
                    name: '',
                    desc: '',
                    icon: ''                    
                }, new_rec_id++);
                state_store.insert(0, r);
                state_grid.startEditing(0, 0);
            }
        }],
        cm: new Ext.grid.ColumnModel([{
			header: 'ID',
			width: 30,
            dataIndex: 'state_id'            
        }, {
            header: Localize.Name,
            width: 80,
            dataIndex: 'name',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: Localize.Description,
            width: 220,
            dataIndex: 'desc',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            })
        }, {
            header: Localize.Icon,
            width: 84,
            dataIndex: 'icon',
            sortable: true,
			editor: new Ext.form.TextField({
                allowBlank: false
            }),            
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {					
					return (value) ?  "<img src='" + value + "'>" : " ";				 	
			}
        }, 
        RemoveState
        ]),
        ds: state_store,
        plugins: [RemoveState],
		listeners: {cellclick: function(grid, rowIndex, columnIndex, e) {
			state_row_index = rowIndex;
			if(columnIndex == 3) {
				icon_list.setPosition(e.getXY()[0], e.getXY()[1]);
				if(!icon_list.isVisible()) {
					icon_list.show();
				}
			} else {
				if(icon_list.isVisible()) {
					icon_list.hide();
				}
			}
		}}        
    });	
	policies_store.load();
	state_store.load();
	var choose_icon = function(btn) {
		var r = state_grid.getStore().getAt(state_row_index);		
		r.set("icon", btn.initialConfig.icon);
		icon_list.hide();
	};
	var icon_list = new Ext.Window({ 
		closable: false, 
		hideLabel: true, 
		frame: false, 
		shadow: false, 
		resizable: false,
		closeAction: 'hide',
		width: 80, 
		tbar: [{xtype: 'buttongroup',
            	columns: 3,
            	defaults: {
                	scale: 'small'
            	},
				listeners: { beforerender: function() { this.items.each(function(item){item.on("click", choose_icon)})}},
				items: (Ext.isEmpty(states_icon)) ? [] : states_icon
		}]	
	});		
	policy_grid.render("_policies_");
	state_grid.render("_states_");
}

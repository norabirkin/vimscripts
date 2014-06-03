Ext.namespace("DeviceTree");

DeviceTree.pageSize = 20;

DeviceTree.start = 0;

DeviceTree.show = function(){
    var record = Ext.data.Record.create([{
        name: '_id',
        type: 'int'
    }, {
        name: 'deviceid',
        type: 'int'
    }, {
        name: 'devicename'
    }, {
        name: 'status',
        type: 'int'
    }, {
        name: 'uptime',
        type: 'int'
    }, {
        name: 'deviceaddr'
    }, {
        name: '_parent',
        type: 'auto'
    }, {
        name: '_is_leaf',
        type: 'bool'
    }]);
    var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
        //autoLoad: true,
        url: 'config.php',
        baseParams: {
            devision: 209,
            async_call: 1,
            get_devices_list: 1,
            deviceid: 0
        },
        reader: new Ext.data.JsonReader({
            id: '_id',
            root: 'data',
            totalProperty: 'amount',
            successProperty: 'success'
        }, record),
        listeners: {
            load: function(){
                this.baseParams.deviceid = 0;
            }
        }
    });
	var task = {
    	run: function(){ store.load({params: { start: DeviceTree.start }});},
    	interval: 20000
	};
    var status_renderer = function(value){
        if (value == 1) {
            return "<img src='./images/states/flag_green.gif'>";
        }
        else
            if (value == 0) {
                return "<img src='./images/states/flag_red.gif'>";
            }
            else {
                return "<img src='./images/states/flag_white.gif'>";
            }
    }
    var tree_grid = new Ext.ux.maximgb.tg.GridPanel({
        store: store,
        master_column_id: 'device_name',
        columns: [{
            header: Localize.Name,
            id: 'device_name',
            width: 415,
            sortable: true,
            dataIndex: 'devicename'
        }, {
            header: Localize.Status,
            width: 75,
            sortable: true,
            renderer: status_renderer,
            dataIndex: 'status'
        }, {
            header: Localize.Uptime,
            width: 100,
            sortable: true,
            dataIndex: 'uptime'
        }, {
            header: Localize.Address,
            width: 260,
            sortable: true,
            dataIndex: 'deviceaddr'
        }],
        stripeRows: false,
        autoExpandColumn: 'device_name',
        title: Localize.DeviceList,
        width: 850,
		height: 700,
         bbar: new Ext.ux.maximgb.tg.PagingToolbar({
         store: store,
         displayInfo: true,
         pageSize: DeviceTree.pageSize,
	 listeners: {'beforechange' : function(obj, p){ DeviceTree.start = p.start; } }
         }),
        //autoHeight: true,
        listeners: {
            'cellclick': function(grid, rowindex){
				Ext.TaskMgr.stop(task);
				var policy_store =  new Ext.data.Store({
								url: 'config.php',
								autoLoad: true,
								baseParams: {
										devision: 207,
										async_call: 1,
										get_policy: 1
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
									}])

							});
               /* var PortParamsRecord = Ext.data.Record.create([{
                	
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'speed',
                    type: 'string'
                }, {
                    name: 'media',
                    type: 'string'
                }, {
                    name: 'vlan',
                    type: 'string'
                }, {
                    name: 'prototype_id',
                    type: 'int'
                }, {
                    name: 'vg_id',
                    type: 'int'
                }, {
                    name: 'port_number',
                    type: 'int'
                }, {
                    name: 'login',
                    type: 'string'
                }, {
                    name: 'comment',
                    type: 'string'
                }, {
                    name: 'policy_id',
                    type: 'int'
                }, {
                    name: 'status',
                    type: 'string'
                }, {
                    name: 'connected_port_id',
                    type: 'int'
                }, {
                    name: 'connected_device_id',
                    type: 'int'
                }, {
                    name: 'connected_port_name',
                    type: 'string'
                }, {
                    name: 'connected_device_name',
                    type: 'string'
                }, {
                    name: 'connected_device_is_parent',
                    type: 'int'
                }, {
                    name: 'remove',
                    type: 'bool'
                }]);*/
				var PortParamsRecord = Ext.data.Record.create([{
                	
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'speed',
                    type: 'string'
                }, {
                    name: 'media',
                    type: 'string'
                }, {
                    name: 'vlanid',
                    type: 'int'
                 }, {
	                name: 'innervlan',
	                type: 'string'
                 }, {
	                name: 'outervlan',
	                type: 'string'
                }, {
                    name: 'prototype_id',
                    type: 'int'
                }, {
                    name: 'vg_id',
                    type: 'int'
                }, {
                    name: 'port_number',
                    type: 'int'
                }, {
                    name: 'login',
                    type: 'string'
                }, {
                    name: 'comment',
                    type: 'string'
                }, {
                    name: 'policy_id',
                    type: 'int'
                }, {
                    name: 'status',
                    type: 'string'
                }]);
                var record = store.getAt(rowindex);
                var port_grid = new Ext.grid.GridPanel({
                    store: new Ext.data.Store({ 
                        url: 'config.php',          
                        reader: new Ext.data.JsonReader({ root: 'results' }, PortParamsRecord),
                        autoLoad: true,
                        baseParams: {
                            devision: 207,
                            async_call: 1,
                            get_ports: 1,
                            device_id: record.get("deviceid")
                        }

                    }),
                    cm: new Ext.grid.ColumnModel([{
                        header: Localize.Number,
                        width: 80,
                        sortable: false,
                        dataIndex: 'name',
                        menuDisabled: true
                    }, {
                        header: Localize.Speed,
                        width: 80,
                        sortable: false,
                        dataIndex: 'speed',
                        menuDisabled: true
                    }, {
                        header: Localize.Media,
                        width: 80,
                        sortable: false,
                        dataIndex: 'media',
                        menuDisabled: true
                    }, {
                        header: Localize.Vlan,
                        width: 80,
                        sortable: false,
                        dataIndex: 'vlanid',
                        menuDisabled: true
                    }, {
                        header: Localize.Comment,
                        width: 90,
                        sortable: false,
                        dataIndex: 'comment',
                        menuDisabled: true
                    }, {
                        header: Localize.Policy,
                        width: 80,
                        dataIndex: 'policy_id',
                        menuDisabled: true,
						renderer: function(value) {
							if (value == 0)
								return "";
							var index = policy_store.find("id", value);
							return (index == -1) ? "" : policy_store.getAt(index).get("name");
						}
                    }, {
                        header: Localize.Account + '/' + Localize.Device,
                        width: 180,
                        sortable: false,
                        dataIndex: 'login',
                        menuDisabled: true,
                        renderer: function(value, metaData, record, rowIndex, colIndex, store){
                            if (record.get("login")) {
                                return record.get("login");
                            }
                            else
                                if (record.get("connected_device_name")) {
                                    return record.get("connected_device_name") + ". " + Localize.Port + ": " + record.get("connected_port_name");
                                }
                                else {
                                    return "";
                                }
                        }
                    }, {
                        header: Localize.Status,
                        width: 80,
                        sortable: false,
                        dataIndex: 'status',
                        menuDisabled: true,
                        editable: false,
                        renderer: function(value, cell){
                            if (value) {
                                return "<img src='./" + value + "'>"
                            }
                        }
                    }]),
                    width: 770,
                    height: 460,
                    border: false
                });
				var port_task = {
    					run: function(){ port_grid.getStore().load();},
    					interval: 10000
				};
				
				Ext.TaskMgr.start(port_task);
                var wnd = new Ext.Window({
                    title: Localize.DevPorts + ' ' + record.get("devicename"),
					width: 785,
                    height: 495,
                    plain: true,
                    modal: true,
                    items: [port_grid],
					listeners: {close: function(){
							store.removeAll();
							Ext.TaskMgr.stop(port_task);
							Ext.TaskMgr.start(task);
							}}
                })
                wnd.show();
            }
        }
    });
	Ext.TaskMgr.start(task);
    store.relayEvents(tree_grid, 'expandnode');
	store.relayEvents(tree_grid, 'collapsenode');
    store.on({
		'beforeexpandnode': function(s, r){
			s.baseParams.deviceid = r.get("deviceid");
			Ext.TaskMgr.stop(task);
		},
		'collapsenode': function() {Ext.TaskMgr.start(task);}
	});
    tree_grid.render("_devices_");
}

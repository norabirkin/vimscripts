/**
 * Billing system Inventory functions and objects
 * 
 * Repository information:
 * $Date: 2009-11-04 12:18:43 $
 * $Revision: 1.1.2.4 $
 */

function delete_tree_item (port, device_id, callback) {
		Ext.Ajax.request({
						url: 'config.php',
						method: "POST",
						params: {
								devision: 207,
								async_call: 1,
								del_tree_item: 1,
								deviceid: (port.get("connected_device_is_parent") == 1) ? device_id : port.get("connected_device_id"),
								portid: (port.get("connected_device_is_parent") == 1) ? port.get("id") : port.get("connected_port_id"),
								parentdeviceid: (port.get("connected_device_is_parent") == 1) ? port.get("connected_device_id") : device_id,
								parentportid: (port.get("connected_device_is_parent") == 1) ? port.get("connected_port_id") : port.get("id")
						},
						success: function(response){
								if (callback) {
									var resp = Ext.util.JSON.decode(response.responseText);
									if (resp.success) {
										callback();
									}
								}
						}	
		})		
}
	
function update_vgid(port, device_id, vg_id, callback) {
		Ext.Ajax.request({
			url: 'config.php',
		    method: "POST",
			params: {
			         devision: 207,
			         async_call: 1,
			         update_port: 1,
			         device_id: device_id,
				     port_id: port.get("id"),
				     vg_id: vg_id,
				     tpl: port.get("port_tpl"),
				     prototypeid: port.get("prototype_id"),
				     name: port.get("name"),
				     media: port.get("media"),
				     speed: port.get("speed"),
				     vlan: port.json.vlan,
					 vlan_id: port.get("vlanid"),
					 comment: port.get("comment"),
					 policy_id: port.get("policy_id")
		  	 		},
			success: function(){
				if(callback) 
					callback();
			}																
	    });		
}
	
function bind_account_to_port(port, vg_id, device_id, callback){	  
	var msg = "";
	var connected_to_device = false;
	if(port.get("vg_id")) {
		msg = Ext.app.Localize.get('Port') + " " + port.get("name") + " " + Ext.app.Localize.get('Already binded with') + ": " + port.get("login"); 
	} else if(port.get("connected_device_id")) {
		msg = Ext.app.Localize.get('Port') + " " + port.get("name") + " " + Ext.app.Localize.get('PortIsConnected') + ": " + port.get("connected_device_name") + " (" + Ext.app.Localize.get('Port') + ": " + port.get("connected_port_name") + ")";
		connected_to_device = true;
	}
	if (msg) {
		msg += ". " + Ext.app.Localize.get('Continue') + "?";
		Ext.Msg.show({
			width: 480,
			msg: msg,
			buttons: Ext.Msg.YESNO,
			fn: function(btn){
				if (btn == "yes") {
					if (connected_to_device) {
						delete_tree_item(port, device_id, bind);
					}
					else {
						bind();
					}					
				}
				else 
					return;
			},
			icon: Ext.MessageBox.QUESTION
		})
		
	}
	else {
		bind();
	}				
	
	function bind() {
			if(vg_id == 0) {
				update_vgid(port, device_id, vg_id, callback);
				return;
			}				          
           	var ds = new Ext.data.Store({
               url: 'config.php',
               baseParams: {
                   devision: 207,
                   async_call: 1,
                   check_vgid: 1,
                   vg_id: vg_id
               },
               reader: new Ext.data.JsonReader({
                   totalProperty: 'found',
                   root: "device"
               }, [{
                    name: 'deviceid',
                    type: 'int'
                }, {
                    name: 'devicename',
                    type: 'string'
                }, {
                    name: 'portid',
                    type: 'int'
                }, {
                    name: 'tpl',
                    type: 'int'
                }, {
                    name: 'prototypeid',
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
                    name: 'comment',
                    type: 'string'
                }, {
                    name: 'policy_id',
                    type: 'int'
                }, {
            		name: 'device_status',
            		type: 'int'
        		}, {
            		name: 'port_status',
            		type: 'string'
        		}, {
            		name: 'vlanid',
            		type: 'int'
        		}])
            });
            
            ds.load({
                callback: function(r, options, success){					
                    if (ds.getCount()) {
                        r = ds.getAt(0);
                        Ext.Msg.show({
                            width: 480,
                            msg: Ext.app.Localize.get('Account Is Bind') + " " + Ext.app.Localize.get('device') + ": " + r.get("devicename") + ". " + Ext.app.Localize.get('Port') + ": " + r.get("name") + ".<br/> " + Ext.app.Localize.get('Change account port'),
                            buttons: Ext.Msg.YESNO,
                            fn: function(btn){
                                if (btn == 'yes') {
                                    Ext.Ajax.request({
                                        url: 'config.php',
                                        method: "POST",
                                        params: {
                                            devision: 207,
                                            async_call: 1,
                                            update_port: 1,
                                            old_device_id: r.get("deviceid"),
                                            old_port_id: r.get("portid"),                                            
                                            old_prototypeid: r.get("prototypeid"),
                                            old_name: r.get("name"),
                                            old_media: r.get("media"),
                                            old_speed: r.get("speed"),
                                            old_vlan: r.get("vlan"),
                                            old_vlan_id: r.get("vlanid"),
											old_comment: r.get("comment"),
					 						old_policy_id: r.get("policy_id"),
                                            device_id: device_id,
                                            port_id: port.get("id"),
                                            vg_id: vg_id,                                            
                                            prototypeid: port.get("prototype_id"),
                                            name: port.get("name"),
                                            media: port.get("media"),
                                            speed: port.get("speed"),
                                            vlan: port.get("vlan"),
                                            vlan_id: port.get("vlanid"),
											comment: port.get("comment"),
					 						policy_id: port.get("policy_id")
                                        },
                                        callback: callback
                                    })
                                }                                
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }
                    else {
                        update_vgid(port, device_id, vg_id, callback);
                    }
                }
            });      
            
        };
}

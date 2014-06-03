/*
* Inventory functions and objects
*
* Repository information:
* $Date:  $
* $Revision:  $
*/

 Ext.namespace("Inventory");
 Inventory.PageSize = 20;
 Inventory.NewRecordId = 0;
 Inventory.PortParamsRecord = Ext.data.Record.create([{
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
        type: 'int'
    }, {
        name: 'outervlan',
        type: 'int'
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
    },{
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
 }]);

 PPAGELIMIT = 100;


 Inventory.DeviceTemplatesCombo = Ext.extend(Ext.form.ComboBox, {
  initComponent: function() {
      var store = new Ext.data.Store({
        url: 'config.php',
        baseParams: {
            devision: 207,
            async_call: 1,
            get_dev_tpls: 1
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
            name: 'address',
            type: 'string'
        }, {
            name: 'address_idx',
            type: 'string'
        }])
    });
    Ext.apply(this, {
        triggerAction: 'all',
        store: store,
        valueField: 'id',
        displayField: 'name',
        emptyText: '',
        mode: 'local',
        editable: false,
        lazyRender: true,
        forceSelection: true
    });
    Inventory.DeviceTemplatesCombo.superclass.initComponent.apply(this, arguments);
  }
 });
 Inventory.EditDevicesGrid = Ext.extend(Ext.grid.EditorGridPanel, {
  initComponent: function(){
      var Edit = new Ext.grid.RowButton({
        width: 22,
        dataIndex: 'id',
        iconCls: 'ext-edit'
    });
    var edit_device = function(grid, record, rowIndex, e){
        document.getElementById("_device_").value = record.get("id");
        document.forms.inventory_add_device.submit();
    };
    Edit.on('action', edit_device);
    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.DeleteUser,
        dataIndex: 'id',
        width: 22,
        iconCls: 'ext-drop'
    });
    var remove_device = function(grid, record, rowIndex, e){
        if (!record.get("id")) {
            grid.stopEditing();
            grid.getStore().remove(record);
            grid.options.removeKey(record.id);
            grid.ports.removeKey(record.id);
            grid.startEditing(0, 0);
            return;
        }
        Ext.Ajax.request({
            url: 'config.php',
            method: "POST",
            params: {
                devision: 207,
                async_call: 1,
                delete_device: 1,
                device_id: record.get("id")
            },
            callback: function(options, success, response){
                grid.getStore().removeAll();
                grid.getStore().load({
                    params: {
                        start: 0,
                        limit: Inventory.PageSize,
                        devision: 207,
                        async_call: 1,
                        get_devices: 1,
                        group_id: record.get("dev_grp_id")
                    }
                });
                tpl_combo.getStore().load();
                Ext.Msg.alert(Localize.Status, response.responseText);
            }
        });
    };




    Remove.on('action', remove_device);
    tpl_combo = new Inventory.DeviceTemplatesCombo({id: "device_templates_combo"});
    tpl_combo.addListener(
    'beforeselect',
        function(combo, record){
        	
          var row = this.getSelectionModel().getSelectedCell()[0];
          var r = this.store.getAt(row);
          if (r.get("id")) {
              if (record.get("id") != r.get("prototype_id"))
              {
                  return false;
              }
          } else if (this.store.baseParams.group_id == -1) {
                  return false;
          } else {
          	r.set("prototype_id", record.get("id"));
			r.set("address", record.get("address"));
			r.set("address_idx", record.get("address_idx"));
          	
          	
            this.optionsStore.baseParams.device_id = record.get("id");
            this.optionsStore.load({callback: function(){
                var o = Inventory.getParams(this.optionsStore, ["name", "descr", "value"], true);
                this.options.add(r.id, o);
            },
            scope: this});
            this.portsStore.baseParams.device_id = record.get("id");
            this.portsStore.load({callback: function(){
            	var o = Inventory.getParams(this.portsStore, [" ", "name", "speed", "media", "vlanid", "innervlan", "outervlan", "prototype_id", "vg_id", "port_number", "login", "comment", "policy_id", "status", "connected_port_id", "connected_device_id", "connected_port_name", "connected_device_name", "connected_device_is_parent"], true);
                this.ports.add(r.id, o);
                r.set("ports_amount", this.portsStore.getCount());
            },
            scope: this});
          }
        }, this
    );
    
    tpl_combo.getStore().load();

    devGridStore=new Ext.data.Store({
        url: 'config.php',
        baseParams: {
            devision: 207,
            async_call: 1,
            get_devices: 1
        },
        reader: new Ext.data.JsonReader({
                     totalProperty: 'amount',
                     root: "devices"
                     }, [{
                          name: 'id',
                          type: 'int'
                        }, {
                           name: 'name',
                           type: 'string'
                        }, {
                           name: 'dev_grp_id',
                           type: 'int'
                        }, {
                           name: 'prototype_id',
                           type: 'int'
                        }, {
                           name: 'address',
                           type: 'string'
                        }, {
                           name: 'address_idx',
                           type: 'string'
                        }, {
                           name: 'ports_amount',
                           type: 'int'
                        }, {
                           name: 'remove',
                           type: 'bool'
                        }, {
                           name: 'status',
                           type: 'int'
                        }])
        });

    Ext.apply(this, {
        collapsible: false,
        //height: 500,
        clicksToEdit: 1,
        loadMask: true,
        listeners: {
            beforerender: function(grid) {
                // Synchronize filter with store
                grid.getStore().syncStore = function() {
                    Ext.apply(this.store.baseParams, this.getTopToolbar().getToolValues());
                    return this.getStore().baseParams;
                }.createDelegate(grid);
            }
        },
        tbar: [
            {
                  text: Ext.app.Localize.get('Save'),
                  iconCls: 'ext-save',
                  handler: this.saveDevices.createDelegate(this)
            }, {
                  text: Ext.app.Localize.get('Add'),
                  iconCls: 'ext-add',
                  handler: this.addDevice.createDelegate(this)
            }, {
                xtype: 'tbseparator',
                width: 5
            }, {
                xtype: 'combo',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                valueField: 'id',
                displayField: 'name',
                name: 'searchtype',
                value: 4,
                store: {
                    xtype: 'arraystore',
                    fields: ['id', 'name'],
                    data: [ [4, Ext.app.Localize.get('Device name')],
                            [5, Ext.app.Localize.get('Address')],
                            [3, 'IP ' + Ext.app.Localize.get('Address')]]
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'textfield',
                name: 'search',
                width: 180,
                listeners: {
                    afterrender: function(field) {
                        field.on('specialkey', function(f, e){
                            if (e.getKey() == e.ENTER) {
                                var Btn = this.ownerCt.get('searchBtn');
                                Btn.handler(Btn);
                            }
                        }, field);
                    }
                }
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                text: Ext.app.Localize.get('Search'),
                iconCls: 'ext-search',
                itemId: 'searchBtn',
                handler: function(Btn){
                    Btn.ownerCt.ownerCt.getStore().reload({
                        params: {
                            start: 0
                        }
                    });
                }
            }
        ],
        store: devGridStore,
        cm: new Ext.grid.ColumnModel([
            Edit,
            {
                header: Localize.DevName,
                width: 150,
                dataIndex: 'name',
                sortable: true,
                editor: new Ext.form.TextField({allowBlank: false})
            },
            {
                header: Localize.Template,
                width: 120,
                dataIndex: 'prototype_id',
                editor: tpl_combo,
                renderer: Inventory.ComboRenderer(tpl_combo)
            },
            {
            header: Localize.Ports,
            width: 60,
            dataIndex: 'ports_amount',
            sortable: true
          }, {
            header: Localize.Address,
            width: 260,
            dataIndex: 'address',
            id: 'addr_column',
            renderer: function(value, cell){
                var a = value.split(',');
                return a.join(' ');
            }
          },
          {
                header: Localize.Status,
                width: 72,
                dataIndex: 'status',
                renderer: function(value, cell){
                  if (value == 1) {
                      return "<img src='./images/states/flag_green.gif'>";
                  }
                  else if (value == 0) {
                      return "<img src='./images/states/flag_red.gif'>";
                  }
                  else {
                      return "<img src='./images/states/flag_white.gif'>";
                  }
                }
          },
          Remove
        ]),
        plugins: [Remove, Edit]
    });
    Ext.apply(this, {
        bbar: new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: Inventory.PageSize,
            prependButtons: true
        })
    });
    Inventory.EditDevicesGrid.superclass.initComponent.apply(this, arguments);
  },
    addDevice: function(){
        this.stopEditing();
        var r = new this.store.recordType({
            name: '',
            address: '',
            address_idx: '',
            prototype_id: '',
            dev_grp_id: this.store.baseParams.group_id
        }, Inventory.NewRecordId++);
        this.store.insert(0, r);
        this.startEditing(0, 0);
    },

  optionsStore: new Ext.data.Store({
                        url: 'config.php',
                        reader: new Ext.data.JsonReader({
                                root: "options"
                                }, [{
                                    name: 'id',
                                    type: 'int'
                                }, {
                                    name: 'name',
                                    type: 'string'
                                }, {
                                    name: 'descr',
                                    type: 'string'
                                }, {
                                    name: 'value',
                                    type: 'string'
                                }, {
                                    name: 'remove',
                                    type: 'bool'
                        }]),
                        baseParams: {
                            devision: 207,
                            async_call: 1,
                            get_device: 1
                        }
                    }),
  options: new Ext.util.MixedCollection(),
  portsStore: new Ext.data.JsonStore({
                        root: 'results',
                        fields: Inventory.PortParamsRecord,
                        baseParams: {
                            devision: 207,
                            async_call: 1,
                            get_ports: 1
                        }
                    }),
  ports: new Ext.util.MixedCollection(),
  saveDevices: function() {
  	
      if(!this.store.getCount())
        return;
      var devices = [];
    this.store.each(function(record) {
        if (record.dirty) {
            var d = {};
            d.device_id = record.get("id");
            d.name = record.get("name");
            d.prototype_id = record.get("prototype_id");
            d.address = record.get("address_idx");
            d.options = this.options.key(record.id);
            d.ports = this.ports.key(record.id);
            devices.push(d);
        }
    }, this);
    
    if(!devices.length)
        return;
    var params = {
        devision: 207,
        async_call: 1,
        save_devices: 1,
        group_id: this.store.baseParams.group_id
    };
    params['devices'] = Ext.util.JSON.encode(devices);
    Ext.Ajax.request({
        url: 'config.php',
        method: "POST",
        params: params,
        callback: function(options, success, response){
                    this.store.load({
                    params: {
                        start: 0,
                        limit: Inventory.PageSize,
                        devision: 207,
                        async_call: 1,
                        get_devices: 1,
                        group_id: this.store.baseParams.group_id
                    }
                });
                this.options.clear();
                this.ports.clear();
                Ext.getCmp("device_templates_combo").getStore().load();
                Ext.Msg.alert(Localize.Status, response.responseText);
        },
        scope: this
    });
  }
 });
 Ext.reg("editdevicesgrid", Inventory.EditDevicesGrid);
 Inventory.ComboRenderer = function(combo){
    return function(value, metaData, record, rowIndex, colIndex, store){
        if(value) {
            var index = combo.getStore().find("id", value);
            return (index == -1) ? combo.emptyText : combo.getStore().getAt(index).get("name");
        }
        else {
            return combo.emptyText;
        }
    }
 }



 Inventory.GroupsWnd = Ext.extend(Ext.Window, {

    initComponent: function(){

        isInsert = (typeof this.group_id == 'undefined') ? true : false;

        var ds = new Ext.data.Store({
            url: "config.php",
            reader: new Ext.data.ArrayReader({},
               [
                   { name: 'id', type: 'int'},
                   { name: 'name', type: 'string'},
                   { name: 'desc', type: 'string'},
                   { name: 'agent_id', type: 'int'}
               ]
           ),
            baseParams: {
               devision: 207,
               async_call: 1,
               get_dev_groups: 1,
               for_grid: 1
           },
           data: [[0, '', '']]
        });

        var groupVlansStore = new Ext.data.Store({
            id: 'groupVlansStore',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
            reader: new Ext.data.JsonReader({
                root: 'results'
            }, [
                {name: 'recordid',  type: 'int'},
                {name: 'outervlan', type: 'int'},
                {name: 'name',      type: 'string'},
                {name: 'type',      type: 'string'}
               ]
            ),
            baseParams: {
                async_call: 1,
                devision: 210,
                action: 'getVlans',
                forGroup: (isInsert?0:this.group_id)
            },
            scope: this,
            autoLoad: true //AUTOLOAD
        });

        var agent_combo = new Ext.form.ComboBox({
            triggerAction: 'all',
            store: new Ext.data.Store({
                url: 'config.php',
                baseParams: { devision: 207, async_call: 1, get_agents: 1 },
                reader: new Ext.data.ArrayReader({}, [
                    { name: 'id', type: 'int' },
                    { name: 'name', type: 'string' }
                ])
            }),
            valueField: 'id',
            displayField: 'name',
            emptyText: Localize.Choose,
            mode: 'local',
            editable: false,
            lazyRender: true,
            forceSelection: true,
            listeners: {
                'select': function(combo, record, index){
                      var r =  ds.getAt(0);
                      r.set("agent_id", record.get("id"));
                    }
                }
         });
         agent_combo.getStore().load({
            callback: function() { if (!this.add_group) {ds.load({params: {    group_id: this.group_id}})}    },
            scope: this
        });


    /**
     * Кнопка удаления Vlan
    */
    var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), width: 22, iconCls: 'ext-drop' });
    btnDel.on('action', function(g, r, i) {
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Removing vlan'),
            msg: Ext.app.Localize.get('Are you sure, want to remove vlan from the list?'),
            width:400,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                vlanRec = {
                    name:      r.data.name,
                    outervlan: r.data.outervlan,
                    recordid:  r.data.recordid,
                    type:      r.data.type
                }
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: {
                        async_call: 1,
                        devision: 210,
                        action: 'delVlanFromGroup',
                        group_id: group_id,
                        vlan: Ext.util.JSON.encode(vlanRec)
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
                                // TODO: Удалять только 1 запись, не прибегая к перезагрузке Store
                                groupVlansStore.removeAll();
                                groupVlansStore.load();
                                Ext.Msg.alert(Ext.app.Localize.get('Info'), "Vlan successfully removed.");
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

    var masterVlansList = new Ext.grid.GridPanel({
        xtype: 'grid',
        id: 'vlanGrid',
        title: '',
        frame: false,
        border: true,
        loadMask: true,
        flex:2,
        listeners: {
            afterrender: function() {
                this.setHeight(this.ownerCt.getHeight()-27)
            }
        },
        store: groupVlansStore,
        autoExpandColumn: 'name',
        cm: new Ext.grid.ColumnModel({
            columns: [
                {header: Ext.app.Localize.get('Outer Vlan'), dataIndex: 'outervlan', width: 160},
                {header: Ext.app.Localize.get('Name'), dataIndex: 'name', id: 'name' },
                {
                    header: Ext.app.Localize.get('Type'),
                    dataIndex: 'type',
                    width: 200,
                    renderer: function(value){
                        switch (value){
                            case '1': return Ext.app.Localize.get('Client'); break;
                            case '2': return Ext.app.Localize.get('Device'); break;
                            case '3': return Ext.app.Localize.get('Guest'); break;
                        }
                    }
                },
                btnDel
            ]
        }),
        plugins: [btnDel],
        viewConfig: {
            deferEmptyText: false,
            emptyText:Ext.app.Localize.get('There is no added Vlans.')
        },
        tbar: [
            {
                xtype: 'button',
                iconCls: 'ext-add',
                id: 'addVlanToGroup',
                text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('Vlan'),
                handler: function(){
                    selectVlan({Store: Ext.getCmp('vlanGrid').getStore()});
                }
            }
        ],
        bbar: [
            new Ext.PagingToolbar({
                pageSize: PPAGELIMIT,
                store: groupVlansStore,
                displayInfo: true,
                items: [{
                    xtype: 'combo',
                    width: 70,
                    displayField: 'id',
                    valueField: 'id',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    value: 100,
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
                            groupVlansStore.reload({ params: { limit: PPAGELIMIT } });
                        }
                    }
                }
                ]
            })
        ]
    });

    function selectVlan(Store) {
        if (!Ext.isEmpty(Ext.getCmp('winSelectVlan'))) { return; }

        if (isInsert){
            return Ext.Msg.alert(Ext.app.Localize.get('Info'), "You should save group before VLAN adding");
        }

        masterGroupVlansStore = new Ext.data.Store({
            id: 'masterGroupVlansStore',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
            reader: new Ext.data.JsonReader({
                root: 'results'
            }, [
                {name: 'recordid',  type: 'int'},
                {name: 'outervlan', type: 'int'},
                {name: 'name',      type: 'string'},
                {name: 'type',      type: 'string'}
               ]
            ),
            baseParams: {
                async_call: 1,
                devision: 210,
                notgroups: 1,
                action: 'getVlans'
            },
            sortInfo: {
                field: 'name',
                direction: "ASC"
            },
            scope: this,
            autoLoad: false //AUTOLOAD
        });

        var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:false, dataIndex: 'outervlan' });
        var Win = new Ext.Window({
            title: Ext.app.Localize.get('Select Vlan'),
            id: 'winSelectVlan',
            width: 550,
            height: 370,
            plain: true,
            modal: true,
            layout: 'fit',
            listeners:{
                show: function() {
                    this.loadMask = new Ext.LoadMask(this.body, { msg:'Loading. Please wait...' });
                }
            },
            tbar: [
                '->',
                Ext.app.Localize.get('Search') + '&nbsp;',
                {
                    name: 'search',
                    id: '_search',
                    xtype: 'textfield',
                    emptyText: Ext.app.Localize.get('search by name')
                },
                {
                    xtype: 'button',
                    iconCls: 'ext-search',
                    tooltip: Ext.app.Localize.get('search by name') + ' VLAN',
                    handler: function(){
                        Ext.getCmp('masterGroupVlanGrid').getStore().setBaseParam('search',Ext.getCmp('_search').getValue());
                        Ext.getCmp('masterGroupVlanGrid').getStore().reload({ params: { start: 0, limit: 100 } });
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'ext-erase',
                    tooltip: Ext.app.Localize.get('Clear'),
                    handler: function(){
                        Ext.getCmp('_search').setValue('');
                        Ext.getCmp('masterGroupVlanGrid').getStore().setBaseParam('search','');
                        Ext.getCmp('masterGroupVlanGrid').getStore().reload({
                            params: {
                                start: 0,
                                limit: 100
                            }
                        });
                    }
                },
                '&nbsp;'
            ],
            items: [
                new Ext.grid.GridPanel({
                    xtype: 'grid',
                    id: 'masterGroupVlanGrid',
                    frame: false,
                    width: 'auto',
                    loadMask: true,
                    height: 200,
                    autoScroll: true,
                    store: masterGroupVlansStore,
                    sm: sm,
                    autoExpandColumn: 'name',
                    cm: new Ext.grid.ColumnModel({
                        columns: [
                            sm,
                            {header: Ext.app.Localize.get('Outer Vlan'), dataIndex: 'outervlan', width: 160},
                            {header: Ext.app.Localize.get('Name'), dataIndex: 'name', id: 'name' },
                            {
                                header: Ext.app.Localize.get('Type'),
                                dataIndex: 'type',
                                width: 120,
                                renderer: function(value){
                                    switch (value){
                                        case '1': return Ext.app.Localize.get('Client'); break;
                                        case '2': return Ext.app.Localize.get('Device'); break;
                                        case '3': return Ext.app.Localize.get('Guest'); break;
                                    }
                                }
                            }
                        ]
                    }),
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText:Ext.app.Localize.get('There is no available Vlans.'),
                        sortable: true
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: 100,
                        store: masterGroupVlansStore,
                        displayInfo: true
                    })
                })
            ],
            buttons:[
            {
                text: Ext.app.Localize.get('Choose'),
                id: 'selectGroupVlan',
                handler: function(){
                    grid = Ext.getCmp('masterGroupVlanGrid');
                    if (Ext.isEmpty(grid.getSelectionModel().getSelections())) {
                        return false;
                    } else var records = grid.getSelectionModel().getSelections();

                    try {

                        if (isInsert){
                            return Ext.Msg.alert(Ext.app.Localize.get('Info'), "You should save group before VLAN adding");
                        }else{
                            var vlanRec = [];
                            Ext.each(records, function(item){
                                this.push({
                                    name: item.get('name'),
                                    outervlan: item.get('outervlan'),
                                    recordid: item.get('recordid'),
                                    type: item.get('type')
                                });
                            }, vlanRec);

                            Ext.Ajax.request({
                                url: 'config.php',
                                method: 'POST',
                                params: {
                                    async_call: 1,
                                    devision: 210,
                                    action: 'addVlanToGroup',
                                    group_id: group_id,
                                    vlan: Ext.util.JSON.encode(vlanRec)
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
                                            Store.Store.removeAll();
                                            Store.Store.load();
                                            //Ext.Msg.alert(Ext.app.Localize.get('Info'), "Vlan successfully added.");
                                            Win.close();
                                        }else{
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), data.error.reason);
                                        }
                                    }
                                  return false;
                                }
                            });
                        }
                    } catch(e) {
                        return false;
                    }
                }
            },
            { text: Ext.app.Localize.get('Cancel'), handler: function(){ Win.close();}}
            ]
        });
        masterGroupVlansStore.reload();
        Win.show();
    } // end selectVlan()

     var gridDevGroupOptVals = createDevGroupOptVals(this.group_id);
     var group_id = this.group_id;

        Ext.apply(this, {
         title: Ext.app.Localize.get('Group of devices'),
        width: 660,
        height: 550,
        plain: true,
        modal: true,
        layout: {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        items: [
            new Ext.grid.EditorGridPanel({
                height: 50,
                id: 'dev_group_grid',
                store: ds,
                clicksToEdit: 1,
                autoExpandColumn: 'mdesc',
                cm: new Ext.grid.ColumnModel([
                    {
                        dataIndex: 'id',
                        hidden: true
                    }, {
                        header: Ext.app.Localize.get('Name'),
                        width: 150,
                        sortable: false,
                        dataIndex: 'name',
                        menuDisabled: true,
                        editor: new Ext.form.TextField({
                            allowBlank: true
                        })
                    }, {
                        header: Ext.app.Localize.get('Description'),
                        sortable: false,
                        dataIndex: 'desc',
                        id: 'mdesc',
                        menuDisabled: true,
                        editor: new Ext.form.TextField({
                            allowBlank: true
                        })
                    }, {
                        header: Ext.app.Localize.get('Agent'),
                        width: 180,
                        dataIndex: 'agent_id',
                        editor: agent_combo,
                        renderer: Inventory.ComboRenderer(agent_combo)
                    }
                ])
            }),
            gridDevGroupOptVals,
            masterVlansList
        ],
        buttons: [{
            text: Ext.app.Localize.get('Save'),
            formBind: true,
            id: 'save_grp_btn',
            add_group: this.add_group,
            wnd: this,
            handler: function(b){
                var rec = ds.getAt(0);
                Ext.Ajax.request({
                    url: 'config.php',
                    method: "POST",
                    params: {
                        devision: 207,
                        async_call: 1,
                        add_group   : (this.add_group) ? 1 : 0,
                        group_id    : rec.get("id"),
                        group_name  : rec.get("name"),
                        group_desc  : rec.get("desc"),
                        agent_id    : rec.get("agent_id")//,
                        //group_vlans : Ext.util.JSON.encode(groupVlans)
                    },
                    callback: function(options, success, response) {
                        if (this.add_group && response.responseText) {
                            group_id = Ext.util.JSON.decode(response.responseText);
                        }
                        saveDevGroupOptVals(gridDevGroupOptVals, group_id);
                        this.wnd.close();
                        var tree = Ext.ComponentMgr.get("device_groups");
                        tree.getLoader().load(tree.root);
                        Ext.getCmp("devices_grid").getStore().baseParams.group_id = 0;
                    },
                    scope: this
                });
            }
        }],
        buttonAlign: 'center'
     })
     Inventory.GroupsWnd.superclass.initComponent.apply(this, arguments);
   }
 });
 Inventory.EditDevicesPanel = Ext.extend(Ext.Panel, {
   initComponent: function(){
       var grid = new Inventory.EditDevicesGrid({id: "devices_grid"});
       var tree = new Ext.tree.TreePanel({
        id: 'device_groups',
        autoScroll: true,
        animate: true,
        border: false,
        containerScroll: true,
        selModel: new Ext.tree.DefaultSelectionModel(),
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            iconCls: 'ext-add'
        }),
        loader: new Ext.tree.TreeLoader({
            requestMethod: 'POST',
            url: 'config.php',
            baseParams: {
                async_call: 1,
                devision: 207,
                get_dev_groups: 1
            },
            listeners: {
                load: function(){
                    var root = tree.getRootNode();
                    var all = root.findChild("text", Localize.AllDevices);
                    if (all) {
                        all.select();
                        grid.getStore().load({
                            params: {
                                start: 0,
                                limit: Inventory.PageSize,
                                devision: 207,
                                async_call: 1,
                                get_devices: 1
                            }
                        });
                    }
                }
            }
        }),
        listeners: {
            click: function(node){
                grid.stopEditing();
                var store = grid.getStore();
                store.baseParams.group_id = node.attributes.group_id;
                Ext.get("_group_id_").dom.value = node.attributes.group_id;
                store.removeAll();
                store.reload({
                    params: {
                        start: 0,
                        limit: Inventory.PageSize,
                        devision: 207,
                        async_call: 1,
                        get_devices: 1
                    },
                    callback: function(){
                        if(node.attributes.group_id == -1) {
                            grid.getColumnModel().setHidden(5, true);
                        } else {
                            grid.getColumnModel().setHidden(5, false);
                        }
                        grid.startEditing(0, 0);
                    }
                });
            }
        }
    });
       Ext.apply(this, {
        frame: false,
        border: false,
        title: Ext.app.Localize.get('Edit devices'),
        width: 960,
        height: 500,
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        tbar: [
            {
                xtype: 'button',
                text: Ext.app.Localize.get('Create group'),
                iconCls: 'ext-add',
                handler: function(){var wnd = new Inventory.GroupsWnd({id: "groups_wnd", add_group: true}); wnd.show();}
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Change group'),
                iconCls: 'ext-edit',
                handler: function(){
                    var id = tree.getSelectionModel().getSelectedNode().attributes.group_id;
                    if (id && id != -1) {
                        var wnd = new Inventory.GroupsWnd({id: "groups_wnd", add_group: false, group_id: id});
                        wnd.show();
                    }
                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Delete group'),
                iconCls: 'ext-remove',
                handler: function(){
                    var id = tree.getSelectionModel().getSelectedNode().attributes.group_id;
                    Ext.Ajax.request({
                        url: 'config.php',
                        method: "POST",
                        params: {
                            devision: 207,
                            async_call: 1,
                            remove_group: 1,
                            group_id: id
                        },
                        callback: function(){
                            tree.getLoader().load(tree.root);
                            grid.getStore().baseParams.group_id = 0;
                        }
                    })
                }
            }, {
                xtype: 'button',
                text: '&nbsp;&nbsp;'+Localize.GroupFields,
                iconCls: 'ext-fields',
                handler: function(){
                    showDevGroupOptSet();
                }
            }
        ],
        items: [
            {
                width:220,
                title: Ext.app.Localize.get('Device groups'),
                layout: 'fit',
                items: [tree]
            }, {
                flex: 1,
                layout: 'fit',
                items: [grid]
            }
        ]
    });
    Inventory.EditDevicesPanel.superclass.initComponent.apply(this, arguments);
   }
 });
 Inventory.RemoveCheckColumn = function(config) {
     Ext.apply(this, config);
    Inventory.RemoveCheckColumn.superclass.constructor.call(this);
 };
 Ext.extend(Inventory.RemoveCheckColumn, Ext.grid.CheckColumn, {header: Localize.Remove, width: 65, dataIndex: 'remove', menuDisabled: true});
 Inventory.DeviceOptionsGrid = Ext.extend(Ext.grid.EditorGridPanel, {
     initComponent: function(){
         var store= new Ext.data.Store({
             autoLoad:true,
             proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
             reader: new Ext.data.JsonReader(
                {},
                [
                    { name: 'name', type: 'string' }
                ]
            ),
             baseParams: {
                devision: 207,
                async_call: 1,
                get_devices_options: 1
            },
            listeners: {
                load: function() {


                }
            }
         });
         this.comboStore=store;


        var combo = new Ext.form.ComboBox({
            triggerAction: 'all',
            store:this.comboStore,
            displayField: 'name',
            valueField: 'name',
            emptyText: Ext.app.Localize.get('Choose'),
            mode: 'local',
            editable: true,
            lazyRender: true,
            forceSelection: true
        });
        var check_column = new Inventory.RemoveCheckColumn();
        var data_reader = new Ext.data.JsonReader(
            { root: "options" },
            [
                { name: 'id', type: 'int' },
                { name: 'name', type: 'string' },
                { name: 'descr', type: 'string' },
                { name: 'value', type: 'string' },
                { name: 'remove', type: 'bool' }
            ]
        );
        Ext.apply(this, {
            tbar: [
                {
                    text: Ext.app.Localize.get('Add'),
                    iconCls: 'ext-add',
                    handler: this.addOption.createDelegate(this)
                },
                {
                    text: Ext.app.Localize.get('Remove'),
                    iconCls: 'ext-remove',
                    handler: this.removeOption.createDelegate(this)
                }
            ],
            store: new Ext.data.Store({
                autoLoad: true,
                url: 'config.php',
                reader: data_reader,
                baseParams: {
                    devision: 207,
                    async_call: 1,
                    get_device: 1,
                    device_id: device_id
                },
                listeners: {'load': this.loadCallback.createDelegate(this, [data_reader])}
            }),
            cm: new Ext.grid.ColumnModel([
                {
                    header: Ext.app.Localize.get('Name'),
                    width: 170,
                    sortable: false,
                    dataIndex: 'name',
                    menuDisabled: true,
                    editor: combo,
                    renderer: function(value){
                        return value;
                    }
                }, {
                    header: Localize.Description,
                    width: 170,
                    sortable: false,
                    dataIndex: 'descr',
                    id: 'dev_descr',
                    menuDisabled: true
                }, {
                    header: Localize.Value,
                    width: 170,
                    sortable: false,
                    dataIndex: 'value',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        //emptyText: "",
                        //selectOnFocus: true
                    })
                },
                check_column
            ]),
            autoExpandColumn: 'dev_descr',
            plugins: [check_column],
            clicksToEdit: 1
            //width: 610
        });
        Inventory.DeviceOptionsGrid.superclass.initComponent.apply(this, arguments);
    },
    loadCallback: function(reader) {
        //if (this.store.getCount()) {
            Ext.get("Address_0-str").dom.value = reader.jsonData.address_str;
            Ext.get("Address_0-hid").dom.value = reader.jsonData.address_idx;
            this.deviceName = reader.jsonData.tpl_name;
            this.prototypeId = (this.store.baseParams.device_id == this.prototypeId) ? this.prototypeId : reader.jsonData.prototype_id;
            this.fireEvent('dataisload');
        //}
    },
    addOption: function() {
        this.stopEditing();
        this.store.insert(0, new this.store.recordType({name: '', value: '', descr: ''}, Inventory.NewRecordId++));
        this.startEditing(0, 0);
    },
    removedOptions: [],
    removeOption: function() {
        this.stopEditing();
        this.store.each( function(r){
            if (r.get("remove")) {
                this.store.remove(r);
                if(r.get("id")) {
                    this.removedOptions.push(r.get("id"));
                }
        }}, this);
        if(this.store.getCount() > 0) {
        this.startEditing(0, 0);
        }
    }
 });
 Inventory.OptionsPanel = Ext.extend(Ext.Panel, {
     initComponent: function(){
        var grid = new Inventory.DeviceOptionsGrid({id: 'devsOpts', height: 180});
        var tpl_combo = new Inventory.DeviceTemplatesCombo({fieldLabel: Localize.Template, width: 220, emptyText: Localize.Choose});
        
        tpl_combo.addListener('beforerender', 
                               function(){
                               	if((device_id || group_id == -1))
                               		tpl_combo.disable();
                              }
                            );
        tpl_combo.addListener('beforeselect',
                               function(){
                                  return (device_id || group_id == -1) ? false : true;
                              }
                            );
        tpl_combo.addListener('select',
                              function(combo, record){
                                  grid.prototypeId = record.get("id");
                                grid.getStore().baseParams.device_id = record.get("id");
                                name_label.setValue('');
                                Ext.get("Address_0-str").dom.value = '';
                                Ext.get("Address_0-hid").dom.value = '0, 0, 0, 0, 0, 0, 0, 0, 0, 0';
                                  this.fireEvent('selectTpl', this);
                              }, this);
        this.addEvents('selectTpl');
        var name_label = new Ext.form.TextField({fieldLabel: Localize.Name, width: 220});
        name_label.addListener('change', function(field, newValue){this.deviceName = newValue;}, grid);
        var panel = new Ext.Panel({
            height: 180,
            frame: false,
            border: false,
            padding: '2 0 0 2',
            layout: 'form',
            labelWidth: 60,
            labelPad: 5,
            items: [name_label,
                    tpl_combo,
                    {
                        xtype: 'panel',
                        border: false,
                        frame: false,
                        id: '_device_addr_'
                    }]
        });
        this.getDeviceName = function() {return name_label.getValue();}
        this.getPrototypeId = function() {return tpl_combo.getValue();}
        this.getOptions = function() {
            gst=grid.getStore();
            return Inventory.getParams(gst, ["name", "descr", "value"], true);
        }
        this.reload = function(id) {
            grid.getStore().removeAll();
            if (id) {
                grid.getStore().baseParams.device_id = id;
            }
            grid.getStore().load();
        }
        this.relayEvents(grid, ['dataisload']);
        this.on({'dataisload': function(){
                    name_label.setValue(grid.deviceName);
                    tpl_combo.getStore().load({callback: function(){
                        tpl_combo.setValue(grid.prototypeId);
                    }});
                    if (this.rendered) {
                        Inventory.ShowAddressPanel({height: 140 });
                    }
                }
        });
        if (!device_id) {
            tpl_combo.getStore().load();
        }
        Ext.apply(this, {
            title: Localize.Properties,
            frame: false,
            border: false,
            layout: 'column',
            items: [{
                    columnWidth: 0.32,
                    frame: false,
                    border: false,
                    items: [panel]
            }, {
                    columnWidth: 0.68,
                    layout: 'fit',
                    frame: false,
                    border: false,
                    items: [grid]
            }]
        });
         Inventory.OptionsPanel.superclass.initComponent.apply(this, arguments);
    }
 });
 Inventory.ShowAddressPanel = function(config) {
     var change_btn = false;
    if (Ext.ComponentMgr.get("Address_0")) {
        Ext.ComponentMgr.get("Address_0").destroy();
        change_btn = true;
    }
    apply = function(A, B){
        try {
            B.items.items[0].body.dom.innerHTML = '<p class="address-block">' + A.get(A.clear) + '</p>';
            Ext.get(B.getId() + '-hid').dom.value = A.get(A.code);
            Ext.get(B.getId() + '-str').dom.value = A.get(A.full);
        }
        catch (e) {
            alert(e.toString())
        }
    }
    clear = function(A){
        if (typeof A != 'string') {
            return
        };
        A = A.split(',');
        var B = [];
        for (var i = 0, off = A.length; i < off; i++) {
            if (Ext.util.Format.trim(A[i]) == '') {
                continue
            };
            B.push(A[i]);
        };
        return B.join(', ');
    }
    var A = new Ext.Panel({
        title: Localize.Address,
        id: 'Address_0',
        frame: false,
        border: false,
        height: config.height,
        bodyStyle: 'padding: 6px',
        tbar: [{
            text: (change_btn) ? Localize.Add + '/' + Localize.Change : Localize.Add,
            iconCls: 'ext-accept',
            handler: function(){
                address(apply, {
                    code: Ext.get('Address_0-hid').dom.value,
                    string: Ext.get('Address_0-str').dom.value
                }, A);
            }
        }],
        items: [{
            frame: false,
            border: false,
            html: '<p class="address-block">' + clear(Ext.get('Address_0-str').dom.value) + '</p>'
        }]
    });
    A.render('_device_addr_');
 };
 Inventory.ShowAccounts = function(A) {
    if(Ext.isEmpty(A)) { A = { sm: true, callbackok: false, callbackcl: false } }
    try { if(Ext.isEmpty(Localize)) { Localize = { } } } catch(e) { Localize = { } }
    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, { initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); }, validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search', onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } }, onTrigger2Click : function(){ if (A.address && Ext.ComponentMgr.get('_listCombo').getValue() == 3) { var v = A.address.addr_idx }    else { var v = this.getRawValue() } if(v.length < 1){ this.onTrigger1Click(); return; }; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); } });
    var store = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [ { name: 'vgid', type: 'int' }, { name: 'login', type: 'string' }, { name: 'agrmnum', type: 'string' }, { name: 'username', type: 'string' }, { name: 'userid', type: 'int' }, { name: 'agentdescr', type: 'string' }, { name: 'address', type: 'string' }]), baseParams:{ async_call: 1, devision: 7, getvgroups: 0, searchtype: 0}, sortInfo: { field: 'login', direction: "ASC" } });
    if(!Ext.isEmpty(A.filter)){ for(var i in A.filter){ if(typeof A.filter[i] != 'function'){ store.baseParams[i] = A.filter[i]; }}}
    var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: Ext.isEmpty(A.sm) ? true : A.sm });
    var colModel = new Ext.grid.ColumnModel([ sm, { header: Localize.Login, dataIndex: 'login', width: 90, sortable: true }, { header: Localize.Agreement, dataIndex: 'agrmnum', width: 90, sortable: true }, { header: Localize.PersonFullName, width: 120, dataIndex: 'username', id: 'ext-userName', sortable: true }, { header: Localize.Agent, dataIndex: 'agentdescr', id: 'ext-agentDescr', width: 130, sortable: true }, { header: Localize.Address, dataIndex: 'address', id: 'ext-address', width: 170, sortable: true } ]);
    var Btn = new Array();
    if(!Ext.isEmpty(A.callbackok)){ Btn.push({ xtype: 'button', text: Localize.Add, handler: function(button){ var parent = button.findParentByType('window'); if(typeof A.callbackok == 'function'){ A.callbackok(parent.findByType('grid')[0]); } parent.close(); }}) };    Btn.push({ xtype: 'button', text: Localize.Cancel, handler: function(button){ var parent = button.findParentByType('window'); if(typeof A.callbackcl == 'function'){ A.callbackcl(parent.findByType('grid')[0]); }; parent.close(); }});
    var combo_store = new Ext.data.SimpleStore({ data: [['0', Localize.PersonFullName],['1', Localize.Agreement],['2', Localize.Login]], fields: ['id', 'name'] });
    var Win = new Ext.Window({ title: Localize.Accounts, id: 'accListWin', buttonAlign: 'center', width: 704, modal: true, items:[{ xtype: 'grid', width: 690, id: '_AccList', height: 350, store: store, cm: colModel, loadMask: true, autoExpandColumn: 'ext-userName', sm: sm, tbar: [ Localize.Search + ':&nbsp;', { xtype: 'combo', id: '_listCombo', width: 150, displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', value: 0, editable: false, store: combo_store, listeners: { select: function(obj, rec) { if (rec.get("id") == 3) { Ext.ComponentMgr.get("search_field").setValue(A.address.addr_str)} store.baseParams.searchtype = this.getValue(); } } },'&nbsp;', new Ext.app.SearchField({ id: "search_field", store: store, params: { start: 0, limit: 50}, width: 227 }) ], bbar: new Ext.PagingToolbar({ pageSize: 50, store: store, displayInfo: true }) }], buttons: Btn });
    if (!Ext.isEmpty(A.address)) { Ext.ComponentMgr.get("search_field").setValue(A.address.addr_str); var r = new combo_store.recordType({id: '3', name: Localize.Address}, Inventory.NewRecordId++); combo_store.insert(3, r);}
    Win.show();
    if (!Ext.isEmpty(A.address)) {
        Ext.ComponentMgr.get('_listCombo').setValue('3');
        store.baseParams.searchtype = 3;
        store.baseParams.search = A.address.addr_idx;
        Ext.ComponentMgr.get("search_field").onTrigger2Click();
    }
    else {
        store.reload({
            params: {
                start: 0,
                limit: 50
            }
        });
    }

 };
 Inventory.showDeviceConnectionWnd = function(port, saveCallback) {
    var addresscode = Ext.get("Address_0-hid").dom.value;
    var address = Ext.get("Address_0-str").dom.value.split(",");
    address = address.join(" ");
    var deviceid = device_id;
    var port_ds = new Ext.data.JsonStore({
        root: 'results',
        fields: Inventory.PortParamsRecord,
        baseParams: {
            devision: 207,
            async_call: 1,
            get_ports: 1,
            device_id: 0
        },
        listeners: {load: function() {
                var checkbox = Ext.ComponentMgr.get("ports_checkbox");
                if(! Ext.isEmpty(checkbox) )
                    checkbox.setValue(false);
            }}
    });
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(obj, rowIndex, r){
                obj.grid.getStore().each(function(r){
                    r.set("choose", false)
                });
                r.set("choose", true);
            }
        }
    });
    var port_grid = new Ext.grid.GridPanel({
        title: Localize.Ports,
        frame: false,
        border: false,
        width: 318,
        id: 'port_grid',
        ds: port_ds,
        tbar: [{
            text: Localize.Choose,
            iconCls: 'ext-accept',
            handler: function(){
                    var index = port_ds.find("choose", true);
                    if (index == -1)
                        return;
                    var connections = [];
                    check_port(port, deviceid)
                    var device_port = port_ds.getAt(index);
                    check_port(device_port, port_ds.baseParams.device_id);
                    if (connections.length) {
                        show_alert();
                    } else {
                        bind();
                    }
                    function check_port(port, device_id){
                        if (port.get("vg_id")) {
                            connections.push({port: port, device_id: device_id, type: "account"});
                        }
                        else if (port.get("connected_device_id")) {
                            connections.push({port: port, device_id: device_id, type: "device"});
                        }
                    }
                    function show_alert() {
                        var p = connections.shift();
                        var msg = "";
                        if (p.type == "account") {
                            msg = Localize.Port + " " + p.port.get("name") + " " + Localize.PortIsBind + ": " + p.port.get("login");
                        }
                        else {
                            msg = Localize.Port + " " + p.port.get("name") + " " + Localize.PortIsConnected + ": " + p.port.get("connected_device_name") + " (" + Localize.Port + ": " + p.port.get("connected_port_name") + ")";
                        }
                        msg += ". " + Localize.Continue + "?";
                        Ext.Msg.show({
                            width: 480,
                            msg: msg,
                            buttons: Ext.Msg.YESNO,
                            fn: function(btn){
                                if (btn == "yes") {
                                    if(connections.length) {
                                        var callback = show_alert();
                                    } else {
                                        var callback = bind();
                                    }
                                    if(p.type == "account") {
                                        update_vgid(p.port, p.device_id, 0, callback);
                                    } else {
                                        delete_tree_item(p.port, p.device_id, callback);
                                    }
                                }
                            }
                        });
                    }
                    function bind() {
                        Ext.Ajax.request({
                            url: 'config.php',
                            method: "POST",
                            params: {
                                devision: 207,
                                async_call: 1,
                                insert_tree_item: 1,
                                deviceid: deviceid,
                                portid: port.get("id"),
                                parentdeviceid: port_ds.baseParams.device_id,
                                parentportid: device_port.get("id")
                                },
                            callback: function() {saveCallback(); wnd.close();}
                            });
                    }
                }
            },
            new Ext.form.Checkbox({fieldLabel: 'test',
                                              id: 'ports_checkbox',
                                              handler: function(checkbox, checked) {
                                                              if(checked) {
                                                                port_ds.each(function(r){if(r.get("vg_id") || r.get("connected_device_id")) port_ds.remove(r) });
                                                            } else {
                                                                port_ds.reload();
                                                            }

                                                      }
                                              }),
          "&nbsp<span style='color: #444444'>" + Localize.HideOccupied + "</div>"],
        cm: new Ext.grid.ColumnModel([{
            dataIndex: 'id',
            hidden: true
        }, {
            header: Localize.Name,
            width: 80,
            sortable: false,
            dataIndex: 'name',
            menuDisabled: true
        }, {
            header: Localize.Account + '/' + Localize.Device,
            width: 190,
            sortable: false,
            dataIndex: 'login',
            menuDisabled: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store){
                if (record.get("vg_id")) {
                    return record.get("login");
                }
                else if (record.get("connected_device_id")) {
                        return record.get("connected_device_name") + ". " + Localize.Port + ": " + record.get("connected_port_name");
                    }
            }
        }, sm]),
        sm: sm
    });
    var device_ds = new Ext.data.Store({
        url: 'config.php',
        baseParams: {
            devision: 207,
            async_call: 1,
            get_devices: 1
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'amount',
            root: "devices"
        }, [{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }]),
        listeners: {load: function() {
                        var index = device_ds.find("id", deviceid);
                        if(index != -1) {
                            device_ds.remove(device_ds.getAt(index));
                        }
        }}
    });
    var device_grid = new Ext.grid.GridPanel({
        height: 375,
        border: false,
        frame: false,
        id: 'device_grid',
        ds: device_ds,
        cm: new Ext.grid.ColumnModel([{
            dataIndex: 'id',
            hidden: true
        }, {
            header: Localize.Name,
            width: 207,
            sortable: false,
            dataIndex: 'name',
            menuDisabled: true
        }]),
        bbar: new Ext.PagingToolbar({ pageSize: 15, store: device_ds, displayInfo: false }),
        listeners: { cellclick: function(grid, rowIndex, columnIndex, e) {
            port_ds.baseParams.device_id = device_ds.getAt(rowIndex).get("id");
            port_ds.load();
        }}
    });
    Ext.app.SearchField = Ext.extend(
    Ext.form.TwinTriggerField,
    { initComponent : function(){
                        Ext.app.SearchField.superclass.initComponent.call(this);
                        this.on('specialkey', function(f, e) {
                                                    if(e.getKey() == e.ENTER){
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
     onTrigger1Click: function(){
                        if(this.hasSearch){
                            this.el.dom.value = '';
                            var o = {start: 0, limit: 15};
                            this.store.baseParams = this.store.baseParams || {};
                            this.store.baseParams[this.paramName] = '';
                            this.store.reload({params:o});
                            this.triggers[0].hide();
                            this.hasSearch = false; }
                     },
     onTrigger2Click: function(){
                    if (Ext.ComponentMgr.get('search_combo').getValue() == 0) {
                            var v = addresscode;
                    } else {
                        var v = this.getRawValue()
                    }
                     if(v.length < 1){
                        this.onTrigger1Click();
                        return;
                    };
                    var o = {start: 0, limit: 15};
                    this.store.baseParams = this.store.baseParams || {};
                    this.store.baseParams[this.paramName] = v;
                    this.store.reload({params:o});
                    this.hasSearch = true;
                    this.triggers[0].show();
                    }
    });
    var combo_store = new Ext.data.SimpleStore({ data: [['5', Localize.Address], ['4', Localize.Name]], fields: ['id', 'name'] });
    var search_field = new Ext.app.SearchField({id: "search_field", store: device_ds, params: {start: 0, limit: 15}, width: 250});
    var panel = new Ext.Panel({
        frame: false,
        border: false,
        layout: 'column',
        //height: 425,
        tbar: [
            Localize.Search + ':&nbsp;',
            {
                xtype: 'combo',
                id: 'search_combo',
                width: 150,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                value: 5,
                editable: false,
                store: combo_store,
                listeners: {
                    select: function(obj, rec) {
                        if (rec.get("id") == 0) {
                            search_field.setValue(address);
                        }
                        device_ds.baseParams.searchtype = this.getValue();
                    }
                }
            },
            '&nbsp;',
            search_field
        ],
        items: [{
            columnWidth: 0.4,
            layout: 'fit',
            title: Localize.Devices,
            items: [device_grid]
            }, {
            columnWidth: 0.6,
            items: [port_grid]
        }]
    });
    var wnd = new Ext.Window({
        //title: Localize.DevicesConnection + " - " + '"' +  r.get("name") + '"',
        title: Localize.DevicesConnection,
        width: 550,
       // height: 480,
        autoScroll: true,
        id: 'devices_wnd',
        plain: true,
        modal: true,
        items: [panel],
        listeners: {'show': function(){ port_grid.setHeight( panel.getHeight() - 26 )}}
    });
    search_field.setValue(address);
    device_ds.baseParams.search = addresscode;
    device_ds.baseParams.searchtype = 0;
    wnd.show();
    search_field.onTrigger2Click();
 };
 Inventory.PolicyCombo = Ext.extend(Ext.form.ComboBox, {
     initComponent: function(){
        Ext.apply(this, {
            triggerAction: 'all',
            store: new Ext.data.Store({
                url: 'config.php',
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
            }),
            valueField: 'id',
            displayField: 'name',
            emptyText: Localize.Choose,
            mode: 'local',
            editable: false,
            lazyRender: true,
            forceSelection: true
        });
        Inventory.PolicyCombo.superclass.initComponent.apply(this, arguments);
    },
    selectPolicy: function(combo, record, index) {
        var row = this.getSelectionModel().getSelectedCell()[0];
        var r = this.store.getAt(row);
        if (index > 0) {
                r.set("policy_id", record.get("id"));
        }
    }
 });
 Inventory.EditPortsGrid = Ext.extend(Ext.grid.EditorGridPanel, {
     initComponent: function() {
        var tpl_combo = new Ext.form.ComboBox({
                    triggerAction: 'all',
                    store: new Ext.data.JsonStore({
                                root: 'results',
                                baseParams: {
                                    devision: 207,
                                    async_call: 1,
                                    get_ports_tpls: 1
                                },
                                  fields: Inventory.PortParamsRecord
                    }),
                    valueField: 'id',
                    displayField: 'name',
                    emptyText: Localize.Choose,
                    mode: 'local',
                    editable: false, 
                    lazyRender: true,
                    forceSelection: true,
                    listeners: {select: function(combo, record, index){ this.fireEvent("selectTpl", this, record, index);}}
        });
        tpl_combo.addEvents("selectTpl");
        tpl_combo.getStore().load();
        this.tpl_combo = tpl_combo;
        var policy_combo = new Inventory.PolicyCombo();
        policy_combo.addListener("select", policy_combo.selectPolicy, this);
        policy_combo.getStore().load();
        var acc_combo = new Ext.form.ComboBox({
            triggerAction: 'all',
            store: new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'id', type: 'int'}, {name: 'action', type: 'string'}]),
                                       data: [['0', Localize.Choose], ['1', Localize.Account], ['2', Localize.Device]]
                                    }),
            valueField: 'id',
            displayField: 'action',
            emptyText: Localize.Choose,
            mode: 'local',
            editable: false,
            lazyRender: true,
            forceSelection: true,
            listeners: {'beforeselect': function(combo, record, index){ combo.reset(); combo.collapse(); this.fireEvent("selectAcc", this, record, index); return false;}}
        });
        acc_combo.addEvents("selectAcc");
        this.relayEvents(tpl_combo, ['selectTpl']);
        this.relayEvents(acc_combo, ['selectAcc']);
        this.on({
            'selectTpl': function(combo, record, index){
                var row = this.getSelectionModel().getSelectedCell()[0];
                var r = this.store.getAt(row);
                if (index > 0) {
                    r.set("speed", record.get("speed"));
                    r.set("media", record.get("media"));
                    r.set("vlan", record.get("vlan"));
                    r.set("prototype_id", record.get("id"));
                    r.set("comment", record.get("comment"));
                    r.set("policy_id", record.get("policy_id"));
                }
                else {
                    r.set("speed", "");
                    r.set("media", "");
                    r.set("vlan", "");
                    r.set("prototype_id", "");
                    r.set("comment", "");
                    r.set("policy_id", "");
                }
            },
            'selectAcc': function(combo, record, index) {
                var row = this.getSelectionModel().getSelectedCell()[0];
                var port = this.store.getAt(row);
                if (device_id && port.get("id")) {
                    if(record.get("id") == 0) {
                        if (port.get("vg_id") || port.get("connected_device_id")) {
                            bind_account_to_port(port, 0, device_id, this.portUpdateCallback.createDelegate(this));
                        }
                    }
                    else if (record.get("id") == 1) {
                        Inventory.ShowAccounts({
                                        sm: 'single',
                                        filter: {
                                            async_call: 1,
                                            devision: 207,
                                            getvgroups: 1,
                                            searchtype: 0
                                        },
                                        callbackok: this.selectAccount.createDelegate(this),
                                        address: {
                                            addr_str: Ext.get('Address_0-str').dom.value,
                                            addr_idx: Ext.get('Address_0-hid').dom.value
                                        }
                                    });
                    }
                    else {
                        var store = this.store;
                        Inventory.showDeviceConnectionWnd(port, function() {store.load();});
                    }
                }
                else {
                    Ext.Msg.alert(Localize.Status, Localize.SaveAlert);
                }
            }
        });
        var check_box = new Ext.form.Checkbox({ id: 'hide_ports_checkbox' });
        var BtnVlans = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Choose') + ': ' + Ext.app.Localize.get('Vlan'),
            width: 22,
            iconCls: 'ext-devmap'
        });
        BtnVlans.on('action', function(grid, record){
            showVlanWindow({
                grid: {
                    sm: true
                },
                win: {
                    buttons: [{
                        xtype: 'button',
                        text: Ext.app.Localize.get('Choose'),
                        handler: function(Btn) {
                            var win = Btn.findParentByType('window'),
                                grid = win.items.get(0),
                                record = grid.getSelectionModel().getSelected();

                            this.record.set('vlanid', record.get('recordid'));
                            this.record.set('innervlan', record.get('innervlan'));
                            this.record.set('outervlan', record.get('outervlan'));

                            win.close();
                        }.createDelegate({
                            record: record
                        })
                    }
                ]}
            });
        });
        var BtnVlansErase = new Ext.grid.RowButton({
            header: '&nbsp;',
            tplModel: true,
            qtip: Ext.app.Localize.get('Clear') + ': ' + Ext.app.Localize.get('Vlan'),
            width: 22,
            iconCls: 'ext-drop'
        });
        BtnVlansErase.on('action', function(grid, record, row){
        	record.set('vlanid', null);
        	record.set('innervlan', null);
        	record.set('outervlan', null);
        });
        check_box.addListener('check',
                              function(checkbox, checked){
                                  if (checked) {
                                      this.store.each(function(r){
                                          if (r.get("vg_id") || r.get("connected_device_id"))
                                              this.store.remove(r)
                                      });
                                  }
                                  else {
                                      this.store.reload();
                                  }
                              },
                              this);
        var numeration_checkbox = new Ext.form.Checkbox({ id: 'num_checkbox' });
        numeration_checkbox.addListener('check',
                              function(checkbox, checked){
                                var i = 1;
                                  if (checked) {
                                      i = 0;
                                  }
                                    this.store.each(function(r){
                                        r.set("port_number", i);
                                        r.set("name", i);
                                        ++i;
                                    });
                              },
                              this);
        var numeration_combo = new Ext.form.ComboBox({
        	id: 'num_combobox',
        	mode: 'local',
        	width: 160,
            triggerAction: 'all',
            valueField: 'id',
            displayField: 'name',
            editable: false,
            value: 2,
            store: new Ext.data.SimpleStore({
                data: [
                    ['1', Ext.app.Localize.get('Numeration from zero')],
                    ['2', Ext.app.Localize.get('Numeration from first')],
                    ['3', Ext.app.Localize.get('Custom numeration')]
                ],
                fields: ['id', 'name']
            })
        });
        numeration_combo.addListener('select',
            function(combo, record){
	            var i = 1;
	            if (record.get('id') == 1)
	            	i = 0;
	            if(record.get('id') == 1 || record.get('id') == 2){
	            	this.getColumnModel().config[0].editable = false;
		            this.store.each(function(r){
		                r.set("port_number", i);
		                r.set("name", i);
		                ++i;
		            });
	            }
	            else{
            		this.getColumnModel().config[0].editable = true;
            	}  
            },
            this);
        var check_col = new Inventory.RemoveCheckColumn();
        
        var ports_store = new Ext.data.JsonStore({
            root: 'results',
            fields: Inventory.PortParamsRecord,
            autoLoad: true,
            baseParams: {
                devision: 207,
                async_call: 1,
                get_ports: 1,
                device_id: device_id
            }
        });
        
        ports_store.addListener('load', function(store) {
        	store.sort("port_number", 'ASC');
            var checkbox = Ext.ComponentMgr.get("hide_ports_checkbox");
            if(! Ext.isEmpty(checkbox) )
                checkbox.setValue(false);
            if( store.getCount() ) {
            	combo = Ext.ComponentMgr.get("num_combobox");
            	combo.setValue(3);
            	this.getColumnModel().config[0].editable = true;
            	
            	if(store.getAt(0).get('port_number') == 0) {
            		for(var l = 0, i = 0; l < store.getCount(); ++l, ++i){
            			if(store.data.items[l].get('port_number') != i)
            				return;
            		}
            		combo.setValue(1);
            		this.getColumnModel().config[0].editable = false;
            	}
                else if(store.getAt(0).get('port_number') == 1) {
                	for(var l = 0, i = 1; l < store.getCount(); ++l, ++i){
            			if(store.data.items[l].get('port_number') != i)
            				return;
            		}
                	combo.setValue(2);
                	this.getColumnModel().config[0].editable = false;
                }
            }
        }, this);
        
        Ext.apply(this, {
            clicksToEdit: 1,
            tbar: [{
                      text: Localize.Add,
                      iconCls: 'ext-add',
                      handler: this.addPort.createDelegate(this)
                   }, {
                         text: Localize.Remove,
                      iconCls: 'ext-remove',
                      handler: this.removePorts.createDelegate(this)
                   },
                   check_box,
                   {
                         xtype: 'tbtext',
                      text: Localize.HideOccupied
                   },
                {
                     xtype: 'tbtext',
                     text: ' '
                },
                numeration_combo
            ],
            store: ports_store,
            cm: new Ext.grid.ColumnModel([ {
                    header: Localize.Number,
                    width: 80,
                    sortable: false,
                    dataIndex: 'name',
                    editable: false,
                    menuDisabled: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        minValue: 0,
						listeners: {							
							afterrender: function(field) {	
								this.on('validateedit', function(editor) {
									if(editor.column != 0) return;
									ports_store.each(function(store, idx) {
										if(ports_store.getAt(idx).get('name') == editor.value) {
											editor.value = null;
										}
									});
								});
							}.createDelegate(this)
						}
                    })
                }, {
                    header: Localize.Template,
                    width: 80,
                    dataIndex: 'prototype_id',
                    menuDisabled: true,
                    editor: tpl_combo,
                    renderer: Inventory.ComboRenderer(tpl_combo)
                }, {
                    header: Localize.Speed,
                    width: 80,
                    sortable: false,
                    dataIndex: 'speed',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Media,
                    width: 80,
                    sortable: false,
                    dataIndex: 'media',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, BtnVlans, {
                    header: Ext.app.Localize.get('Vlan (Outer/Inner)'),
                    width: 80,
                    sortable: false,
                    dataIndex: 'vlanid',
                    menuDisabled: true,
                    renderer: function(value, meta, record) {
                        if(record.get('innervlan') || record.get('outervlan')) {
                            return record.get('outervlan') + ':' + record.get('innervlan')
                        }
                        else {
                            if(value) {
                                return Ext.app.Localize.get('Undefined') + ':' + Ext.app.Localize.get('Undefined');
                            }
                        }
                        return '';
                    }
                }, BtnVlansErase, {
                    header: Ext.app.Localize.get('Comment'),
                    width: 90,
                    sortable: false,
                    dataIndex: 'comment',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Policy,
                    width: 80,
                    dataIndex: 'policy_id',
                    menuDisabled: true,
                    editor: policy_combo,
                    renderer: Inventory.ComboRenderer(policy_combo)
                }, {
                    header: Localize.Account + '/' + Localize.Device,
                    width: 180,
                    sortable: false,
                    dataIndex: 'login',
                    menuDisabled: true,
                    editor: acc_combo,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store){
                                    if ( record.get("login") ) {
                                           return record.get("login");
                                    } else if( record.get("connected_device_name") ){
                                        return record.get("connected_device_name") + ". " + Localize.Port + ": " + record.get("connected_port_name");
                                    } else {
                                        return acc_combo.emptyText;
                                    }
                            }
                    },  {
                    header: Ext.app.Localize.get('Status'),
                    width: 80,
                    sortable: false,
                    dataIndex: 'status',
                    menuDisabled: true,
                    editable: false,
                    renderer: function(value, cell) {
                        if (value) {return "<img src='./" + value + "'>"
                    }}
                    }, check_col]),
           width: 925,
           height: 280,
           border: false,
           plugins: [check_col, BtnVlans, BtnVlansErase]
        });
        Inventory.EditPortsGrid.superclass.initComponent.apply(this, arguments);
    },
    addPort: function() {
        this.stopEditing();
        var ds = this.store;
        var r = new ds.recordType({speed: '', media: '', vlan: '', comment: ''}, Inventory.NewRecordId++);
		combovalue = Ext.ComponentMgr.get("num_combobox").getValue();
		if(combovalue == 1)
			var port_number = (ds.getCount()) ? parseInt(ds.getCount()) : 0;
		else if (combovalue == 2)
			port_number = parseInt(ds.getCount() + 1);
		else
			port_number = null;
	    
	    r.set("name", port_number);
        r.set("port_number", port_number);
        r.set("status", "");
        
        ds.insert(0, r);
        ds.sort("port_number", "ASC");
        this.startEditing(0, 0);
    },
    removedPorts: [],
    removePorts: function() {
        this.stopEditing();
        this.store.each(function(r){
            if (r.get("remove")) {
                if (r.get("id"))
                    this.removedPorts.push(r.get("id"));
                this.store.remove(r);
            }
        }, this);
        var combovalue = Ext.ComponentMgr.get("num_combobox").getValue();
        var i = null;
        if(combovalue == 1)
        	i=0;
        else if (combovalue == 2)
        	i=1;
        if(combovalue==1 || combovalue == 2)
	        this.store.each(function(r){
	            r.set("port_number", i);
	            r.set("name", i);
	            ++i;
	        });        
        this.startEditing(0, 0);
    },
    portUpdateCallback: function() {
        this.store.load();
    },
    selectAccount: function(grid) {
        var vg_id = grid.getSelectionModel().getSelected().get("vgid");
        var row = this.getSelectionModel().getSelectedCell()[0];
        var port = this.store.getAt(row);
        bind_account_to_port(port, vg_id, device_id, this.portUpdateCallback.createDelegate(this));
    }
 });
 Inventory.getParams = function(store, params_names, all) {
    var opt = [];
    if (all && store.getCount() > 0) {
        for (i = 0; i < store.getCount(); i++) {
            var rec = store.getAt(i);
            var o = [];
            for (var j = 0; j < params_names.length; j++) {
                var v = (rec.get(params_names[j])) ? rec.get(params_names[j]) : '';
                o.push(v);
            }
            opt.push(o);
        }
    }
    else {
        store.each(function(rec){
            if (rec.dirty) {
                var o = [];
                for (var j = 0; j < params_names.length; j++) {
                    var v = (rec.get(params_names[j])) ? rec.get(params_names[j]) : '';
                    o.push(v);
                }
                opt.push(o);
            }
        });
    }
    return opt;
 };
 Inventory.PortTemplatesGrid = Ext.extend(Ext.grid.EditorGridPanel, {
     initComponent: function() {
        var policy_combo = new Inventory.PolicyCombo();
        policy_combo.addListener("select", policy_combo.selectPolicy, this);
        policy_combo.getStore().load();
        var check_col = new Inventory.RemoveCheckColumn();
        this.addEvents("tplSsaved");
        Ext.apply(this, {
            clicksToEdit: 1,
            tbar: [{
                      text: Localize.Add,
                      iconCls: 'ext-add',
                      handler: this.addPortTemplate.createDelegate(this)
                   }, {
                         text: Localize.Remove,
                      iconCls: 'ext-remove',
                      handler: this.removePortTemplate.createDelegate(this)
                   }, {
                      text: Localize.Save,
                      iconCls: 'ext-save',
                      handler: this.savePortTemplates.createDelegate(this)
                    }],
            store: new Ext.data.JsonStore({
                        root: 'results',
                        //reader: Inventory.PortParamsRecord,
                        autoLoad: true,
                        baseParams: {
                            devision: 207,
                            async_call: 1,
                            get_ports_tpls: 1,
                            for_grid: 1
                        },
                        fields: Inventory.PortParamsRecord
                    }),
            cm: new Ext.grid.ColumnModel([ {
                    header: Localize.Number,
                    width: 80,
                    sortable: false,
                    dataIndex: 'name',
                    menuDisabled: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        minValue: 0
                    })
                }, {
                    header: Localize.Speed,
                    width: 80,
                    sortable: false,
                    dataIndex: 'speed',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Media,
                    width: 80,
                    sortable: false,
                    dataIndex: 'media',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Vlan,
                    width: 80,
                    sortable: false,
                    dataIndex: 'vlan',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Comment,
                    width: 90,
                    sortable: false,
                    dataIndex: 'comment',
                    menuDisabled: true,
                    editor: new Ext.form.TextField({
                        allowBlank: true
                    })
                }, {
                    header: Localize.Policy,
                    width: 80,
                    dataIndex: 'policy_id',
                    menuDisabled: true,
                    editor: policy_combo,
                    renderer: Inventory.ComboRenderer(policy_combo)
                }, check_col]),
            width: 925,
            height: 280,
            plugins: [check_col]
        });
        Inventory.PortTemplatesGrid.superclass.initComponent.apply(this, arguments);
    },
    addPortTemplate: function() {
        this.stopEditing();
        this.store.insert(0, new this.store.recordType({speed: '', media: '', vlan: '', comment: ''}, Inventory.NewRecordId++));
        this.startEditing(0, 0);
    },
    removedTemplates: [],
    removePortTemplate: function() {
        this.stopEditing();
        this.store.each( function(r){
            if (r.get("remove")) {
                this.store.remove(r);
                if(r.get("id")) {
                    this.removedTemplates.push(r.get("id"));
                }
        }}, this);
        this.startEditing(0, 0);
    },
    savePortTemplates: function() {
        params = {
            devision: 207,
            async_call: 1,
            save_port_tpls: 1,
            "to_delete[]": this.removedTemplates
        };
        var p = Inventory.getParams(this.store, ["id", "name", "speed", "media", "vlan", "comment", "policy_id"]);
        if(p.length) {
            params["ports[]"] = p;
        }
        Ext.Ajax.request({
            url: 'config.php',
            method: "POST",
            params: params,
            callback: function(options, success, response){
                        this.fireEvent("tplSaved", this);
                        Ext.Msg.alert(Localize.Status, response.responseText, function(){
                            this.getStore().load();
                            this.removedTemplates = [];
                        }, this)
                    },
            scope: this
        });
    }
 });
 Inventory.PortsTabPanel = Ext.extend(Ext.TabPanel, {
     initComponent: function() {
        var port_grid = new Inventory.EditPortsGrid();
        var tpl_grid = new Inventory.PortTemplatesGrid();
        port_grid.relayEvents(tpl_grid, ['tplSaved']);
        port_grid.on({
            'tplSaved': function() {
                port_grid.tpl_combo.getStore().load();
            }
        });
        this.reload = function(id){port_grid.getStore().baseParams.device_id = id; port_grid.getStore().load(); port_grid.removedPorts = [];}
        this.getRemovedPorts = function() {return port_grid.removedPorts;}
        this.getPorts = function() {
        	port_grid.getStore().sort("port_number", "ASC");
            var p = ["id", "name", "speed", "media", "vlanid", "innervlan", "outervlan", "prototype_id", "vg_id", "port_number", "login", "comment", "policy_id", "status", "connected_port_id", "connected_device_id", "connected_port_name", "connected_device_name", "connected_device_is_parent"];
            (device_id) ? p[0] = p[0] : p[0] = "";
            return Inventory.getParams(port_grid.getStore(), p, true);
        }
        Ext.apply(this, {
            deferredRender: false,
            header: true,
            plain: false,
            border: false,
            frame: false,
            width: 925,
            height: 310,
            activeTab: 0,
            items: [{
                    title: Localize.DevPorts,
                    id: 'tab_1',
                    items: [port_grid]/*,
                    height: 310*/
                }, {
                    title: Localize.PortTpl,
                    id: 'tab_2',
                    items: [tpl_grid]/*,
                    height: 310*/
                }]
        });
        Inventory.PortsTabPanel.superclass.initComponent.apply(this, arguments);
    }
 });
 Ext.reg("porttabpanel", Inventory.PortsTabPanel);
 Inventory.GroupsPanel = Ext.extend(Ext.Panel, {
     initComponent: function() {
        var group_checkbox = new Inventory.RemoveCheckColumn({
            header: Localize.Choose,
            width: 60,
            dataIndex: 'choose'
        });
        var groups_record = new Ext.data.Record.create([
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'desc', type: 'string' },
            { name: 'choose', type: 'bool' },
            { name: 'new', type: 'bool' }
        ]);
        var height = 200;
        var all_groups_grid = new Ext.grid.GridPanel({
            height: height,
            border: false,
            id: 'groups_grid',
            store: new Ext.data.Store({
                url: "config.php",
                reader: new Ext.data.ArrayReader({}, groups_record),
                autoLoad: true,
                baseParams: {
                    devision: 207,
                    async_call: 1,
                    get_dev_groups: 1,
                    for_grid: 1,
                    clearList: 1
                }
            }),
            tbar: [{
                text: Localize.Choose,
                iconCls: 'ext-accept',
                handler: function(){
                    all_groups_grid.getStore().each(function(r){
                        if (r.get("choose")) {
                            r.set("new", true);
                            var s = device_groups_grid.getStore();
                            var index = s.find("id", r.get("id"));
                            if (index == -1 || s.getAt(index).get("id") != r.get("id")){
                                var new_record = r.copy();
                                new_record.markDirty();
                                s.insert(0, new_record);
                            }
                        }
                    });
                }
            }],
            plugins: [group_checkbox],
            cm: new Ext.grid.ColumnModel([{
                dataIndex: 'id',
                hidden: true
            }, {
                header: Localize.Name,
                width: 150,
                sortable: false,
                dataIndex: 'name',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            }, {
                header: Localize.Description,
                width: 220,
                sortable: false,
                dataIndex: 'desc',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            }, group_checkbox])
        });
        var remove_checkbox = new Inventory.RemoveCheckColumn({ width: 60 });
        var device_groups_grid = new Ext.grid.GridPanel({
            height: height,
            border: false,
            clicksToEdit: 1,
            id: 'device_grp_grid',
            store: new Ext.data.Store({
                    url: "config.php",
                    reader: new Ext.data.ArrayReader({}, groups_record),
                    autoLoad: (device_id) ? true : false,
                    baseParams: {
                        devision: 207,
                        async_call: 1,
                        get_dev_groups: 1,
                        for_grid: 1,
                        device_id: device_id
                    }
            }),
            tbar: [{
                text: Localize.Remove,
                iconCls: 'ext-remove',
                handler: this.removeGroup.createDelegate(this)
            }],
            plugins: [remove_checkbox],
            cm: new Ext.grid.ColumnModel([{
                dataIndex: 'id',
                hidden: true
            }, {
                header: Localize.Name,
                width: 150,
                sortable: false,
                dataIndex: 'name',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            }, {
                header: Localize.Description,
                width: 220,
                sortable: false,
                dataIndex: 'desc',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            }, remove_checkbox])
        });
        this.getGroups = function() {
            return Inventory.getParams(device_groups_grid.getStore(), ["id"]);
        }
        this.reload = function(id) {device_groups_grid.getStore().baseParams.device_id = id;  device_groups_grid.getStore().load();}
        Ext.apply(this, {
            frame: false,
            border: false,
            layout: 'column',
            items: [{
                    title: Localize.DevGroups,
                    columnWidth: 0.5,
                    layout: 'fit',
                    items: [all_groups_grid]
                }, {
                    title: Localize.InGroups,
                    columnWidth: 0.5,
                    layout: 'fit',
                    items: [device_groups_grid]
                }]
        });
        Inventory.GroupsPanel.superclass.initComponent.apply(this, arguments);
    },
    removeGroup: function() {
                    var s = Ext.getCmp('device_grp_grid').getStore();
                    s.each(function(r){
                        if (r.get("remove")) {
                            if (!r.get("new")) {
                                this.to_delete.push(r.get("id"));
                            }
                            s.remove(r);
                        }
                    }, this);
    },
    to_delete : []
 });
 Inventory.NasPanel = Ext.extend(Ext.form.FormPanel, {
     initComponent: function(){
        Ext.apply(this, {
            height: 30,
            layout: 'hbox',
            border: false,
            style: 'padding-top:5px',
            url: 'config.php',
            method: 'POST',
            listeners: {
                afterrender: function(form){
                    form.load({
                        scope: form,
                        url: 'config.php',
                        params: {
                            async_call:1,
                            devision:207,
                            get_device_nas:1,
                            deviceid: device_id
                        },
                        success: function(form, action) {
                            try {
                                if(action.result.data.rnas) {
                                    this.get('rnasBox').setValue(false).handler(this.get('rnasBox'), true);
                                    this.get('rnasBox').disable();

                                    this.get('module').setValue(action.result.data.moduelid).setRawValue(action.result.data.agentname);
                                    this.get('module').setReadOnly(true);
                                    this.get('secret').setReadOnly(true);
                                }
                            }
                            catch(e) {
                                Ext.Msg.error(e);
                            }
                        }
                    });
                }
            },
            items: [{
                xtype: 'checkbox',
                name: 'rnas',
                itemId: 'rnasBox',
                inputValue: 1,
                handler: function(check, state){
                    if(state && Ext.getCmp('devsOpts').getStore().find('name', 'IP', 0, false) < 0) {
                        Ext.Msg.error(Ext.app.Localize.get('Device not contain IP addres'));
                        check.setValue(false);
                        return false;
                    }
                    this.items.each(function(item){
                        if(item == this.item) {
                            return;
                        }
                        if(item.getXType() == "textfield" || item.getXType() == "combo") {
                            item[this.state ? "enable" : "disable"]();
                        }
                    }, {
                        item: check,
                        state: state
                    });
                }.createDelegate(this)
            }, {
                xtype: 'tbtext',
                style: 'padding-top:5px',
                text: Ext.app.Localize.get('Create') + ' NAS'
            }, {
                xtype: 'tbspacer',
                width: 20
            }, {
                xtype: 'combo',
                hiddenName: 'moduleid',
                itemId: 'module',
                mode: 'local',
                triggerAction: 'all',
                valueField: 'id',
                displayField: 'name',
                emptyText: '',
                editable: false,
                lazyRender: true,
                forceSelection: true,
                disabled: true,
                store: {
                    xtype: 'jsonstore',
                    root: 'results',
                    timeoute: 38000,
                    url: 'config.php',
                    autoLoad: true,
                    baseParams:{
                        async_call: 1,
                        devision: 207,
                        get_device_agents:1
                    },
                    fields: [
                       {name: 'id', type: 'name'},
                       {name: 'name', type: 'string'},
                       {name:'data', type: 'data'}
                    ]
                }
            }, {
                xtype: 'tbspacer',
                width: 20
            }, {
                xtype: 'tbtext',
                style: 'padding-top:5px',
                text: Ext.app.Localize.get('Secret')
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'textfield',
                itemId: 'secret',
                name: 'rsharedsec',
                disabled: true
            }]
        });

        Inventory.NasPanel.superclass.initComponent.apply(this, arguments);
    },
    getRNasValues: function() {
        return this.getForm().getValues();
    }
 });
 Ext.reg('groupspanel', Inventory.GroupsPanel);
 Inventory.ShowEditDeviceForm = function() {
     Ext.QuickTips.init();
    var options_panel = new Inventory.OptionsPanel();
    var ports_panel = new Inventory.PortsTabPanel();
    var items = [options_panel, ports_panel];
    if(group_id != -1) {
        var groups_panel = new Inventory.GroupsPanel();
        var rnas_panel = new Inventory.NasPanel();
        items.push(groups_panel, rnas_panel);
    }
    options_panel.addListener('selectTpl', function(){
        options_panel.reload();
        ports_panel.reload(options_panel.getPrototypeId());
    });
    var btn = new Ext.Button({
        text: Localize.Save
    });
    btn.addListener('click', function(b, e){
        var d = {};
        d.device_id = device_id;
        d.name = options_panel.getDeviceName();
        d.prototype_id = options_panel.getPrototypeId();
        d.address = Ext.get("Address_0-hid").dom.value ;
        d.options = options_panel.getOptions();
        d.ports = ports_panel.getPorts();
        var empty_count = 0;
        for(var i = 0; i<d.ports.length; ++i){
        	if(Ext.isEmpty(d.ports[i][1]) || d.ports[i][1]=='' || d.ports[i][1] ==0) {
        		empty_count++;
        	}
        }
        if(empty_count>1) {
        	Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unable to save ports with same or empty numbers'));
    		return;
        }
        for(var i = 0; i<d.ports.length; ++i){
        	for(var j = i+1; j<d.ports.length; ++j)
	        	if(d.ports[i][1]==d.ports[j][1]) {
	        		Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Unable to save ports with same or empty numbers'));
	        		return;
	        	}
        }
        d.removed_ports = ports_panel.getRemovedPorts();
        if (group_id != -1) {
            d.groups = groups_panel.getGroups();
            d.removed_groups = groups_panel.to_delete;
            d.rnas = rnas_panel.getRNasValues();
        }
        var devices = [];
        devices.push(d);
        b.setDisabled(true); 
        Ext.Ajax.request({
            url: 'config.php',
            method: "POST",
            params: {
                devision: 207,
                async_call: 1,
                devices: Ext.util.JSON.encode(devices),
                save_devices: 1,
                single_device: 1,
                group_id: group_id
            },
            callback: function(options, success, response){
            			b.setDisabled(false); 
                        var response = Ext.util.JSON.decode(response.responseText);
                        if (response.device_id) {
                            device_id = response.device_id;
                        }
                        Ext.Msg.show({
                            width: 230,
                            msg: response.message + "!<br/>" + Localize.ReturnMsg,
                            buttons: Ext.Msg.YESNO,
                            fn: function(btn){
                                    if (btn == "yes") {
                                        var form = new Ext.form.FormPanel({id: 'compactForm', renderTo: Ext.getBody(), url: 'config.php', standardSubmit: true, items: [{xtype: 'hidden', name: 'devision', value: 207}]});
                                        form.getForm().submit();
                                    } else {
                                        options_panel.reload(device_id);
                                        ports_panel.reload(device_id);
                                        if (group_id != -1) {
                                            groups_panel.reload(device_id);
                                        }
                                    }
                                }
                            });
                    }
        });
    }, this);
    items.push({xtype: 'panel',    frame: true, buttonAlign: 'center',    buttons: [btn]});
    var panel = new Ext.Panel({
            frame: false,
            border: true,
            //layout: 'form',
            //tools: [{id: 'save'}],
            items: items
    });
    panel.addListener('afterrender', function(){Inventory.ShowAddressPanel({height: 140 });});
    panel.render("_device_");
 };

// ================================= DEV_GROUP_OPT ===========================================================================

function showDevGroupOptSet(){
    if (!Ext.isEmpty(Ext.getCmp('inventoryFormFields'))) {
        return;
    }

    createField = function(A){
        if (!Ext.isEmpty(Ext.getCmp('editInventoryFormField'))) {
            Ext.getCmp('editInventoryFormField').close();
        }
        A = A ||
        {
            data: {
                type: 0,
                name: '',
                descr: ''
            }
        };
        var Rm = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Localize.DeleteField,
            dataIndex: 'idx',
            width: 22,
            iconCls: 'ext-drop'
        });
        title = function(A){
            try {
                return Localize.EditField + ': ' + A.get('name')
            }
            catch (e) {
                return Localize.AddNewRecord
            }
        }
        var wind = new Ext.Window({
            id: 'editInventoryFormField',
            title: title(A),
            width: 370,
            shawdow: false,
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Localize.Save,
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
                        waitTitle: Localize.Connecting,
                        waitMsg: Localize.SendingData + '...',
                        success: function(form, action){
                            Ext.getCmp('inventoryFormFields').findByType('grid')[0].store.reload();
                            W.close();
                        },
                        failure: function(form, action){
                            if (action.failureType == 'server') {
                                obj = Ext.util.JSON.decode(action.response.responseText);
                                Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
                            }
                        }
                    })
                }
            }, {
                xtype: 'button',
                text: Localize.Cancel,
                handler: function(){
                    this.ownerCt.ownerCt.close();
                }
            }],
            items: [{
                xtype: 'form',
                id: 'invFormFieldEdit',
                url: 'config.php',
                method: 'POST',
                frame: true,
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 207
                }, {
                    xtype: 'textfield',
                    fieldLabel: Localize.Description,
                    name: 'descr',
                    width: 200,
                    value: (A.data.descr) ? A.data.descr : ''
                }, {
                    xtype: 'textfield',
                    fieldLabel: Localize.Field,
                    name: 'save_dev_group_opt_set',
                    width: 150,
                    readOnly: (A.data.name.length == 0) ? false : true,
                    value: (A.data.name) ? A.data.name : '',
                    maskRe: new RegExp('[a-zA-Z0-9\-\_]')
                }, {
                    xtype: 'combo',
                    fieldLabel: Localize.Type,
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
                        data: [[0, Localize.Text], [1, Localize.List]]
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
                            if (R.data.type == 1) {
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
                    text: Localize.AddValue,
                    handler: function(){
                        this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
                            idx: 0,
                            value: ''
                        }))
                    }
                }],
                cm: new Ext.grid.ColumnModel([{
                    header: Localize.Value,
                    dataIndex: 'value',
                    id: 'comboValue',
                    editor: new Ext.form.TextField({
                        alloBlank: false
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
                        devision: 207,
                        show_dev_group_opt_staff: ''
                    }
                }),
                listeners: {
                    render: function(G){
                        if (A.data.type == 1) {
                            G.show();
                            G.store.baseParams.show_dev_group_opt_staff = A.data.name;
                            G.store.load();
                        }
                    }
                }
            }]
        }).show();
        Rm.on('action', function(g, r, idx) {
            var W = g.findParentByType('window');
            var F = W.findByType('form')[0];
            F.add({
                xtype: 'hidden',
                name: 'delstaff['+r.data.idx+']',
                value: r.data.value
            });
            g.store.remove(r);
        });
    }

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.EditField,
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-edit'
    });
    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.DeleteField,
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-drop'
    });
    new Ext.Window({
        id: 'inventoryFormFields',
        title: Localize.AUsrFrmFields,
        height: 400,
        width: 600,
        shawdow: false,
        items: {
            xtype: 'grid',
            height: 589,
            loadMask: true,
            autoExpandColumn: 'ppvalues',
            plugins: [Edit, Remove],
            tbar: [{
                xtype: 'button',
                iconCls: 'ext-add',
                text: Localize.AddNewRecord,
                handler: function(){
                    createField()
                }
            }],
            cm: new Ext.grid.ColumnModel([Edit, {
                header: Localize.Description,
                dataIndex: 'descr',
                width: 160
            }, {
                header: Localize.Field,
                dataIndex: 'name',
                width: 90
            }, {
                header: Localize.Type,
                dataIndex: 'type',
                width: 65,
                renderer: function(v){
                    if (v == 1) {
                        return 'combo'
                    }
                    else {
                        return 'text'
                    }
                }
            }, {
                header: Localize.DefinedValues,
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
                    name: 'descr',
                    type: 'string'
                }, {
                    name: 'strvalue',
                    type: 'string'
                }]),
                autoLoad: true,
                baseParams: {
                    async_call: 1,
                    devision: 207,
                    show_dev_group_opt_set: 0
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
                value: 207
            }, {
                xtype: 'hidden',
                name: 'del_dev_group_opt_set',
                value: r.get('name')
            }],
            renderTo: document.body
        });
        fm.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
                g.store.reload();
                fm.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Localize.Error + '!', obj.errors.reason);
                }
                fm.destroy();
            }
        });
    });
} // end devGroupOptions()


function createDevGroupOptVals(group_id) {
    Ext.grid.Data = [];

    var reader = new Ext.data.ArrayReader({}, [
        {name: 'name',          type: 'string'},
        {name: 'descr',         type: 'string'},
        {name: 'type',          type: 'int'},
        {name: 'intvalue',      type: 'int'},
        {name: 'value'}
    ]);

    var data_store = new Ext.data.Store({
        reader: reader,
        data:   Ext.grid.Data
    });

    var add_params = function(response) {
        var res = Ext.util.JSON.decode(response.responseText);
        if (res.results && res.results.length) {
            Ext.each(res.results, function(op) {
                data_store.add(new data_store.recordType({
                    name        : op.name,
                    descr       : op.descr,
                    type        : op.type,
                    intvalue    : op.intvalue,
                    value       : op.value
                }));
            });
        }
    };

    Ext.Ajax.request({
        url: 'config.php',
        method: "POST",
        params: {
            devision                : 207,
            async_call              : 0,
            show_dev_group_opt_vals : 1,
            group_id                : group_id
        },
        success: add_params
    });

    Inventory.DGO_store=data_store;

    var comboStore = function(combo_data) {
        var store = new Ext.data.SimpleStore({
            id      : 0,
            data    : combo_data,
            fields  : ['idx', 'name']
        });
        return store;
    };

    var comboBox = function(combo_data, combo_index) {
        var store = comboStore(combo_data);
        var combo  = new Ext.form.ComboBox({
            store           : store,
            mode            : 'local',
            triggerAction   : 'all',
            valueField      : 'idx',
            displayField    : 'name',
            editable        : false
        });
        store.getById(combo_index);
        return combo;
    }

    var setComboValue = function(value, ss, sd) {
        var combo_data = [];
        var i=0;
        Ext.each(sd.data.value, function(pair) {
            combo_data[i++] = [pair.id, pair.value];
        });
        if ( sd.data.type ) {
            var res;
            if ( value ) {
                res = comboStore(combo_data).getById(value).get('name');
            } else {
                res = comboStore(combo_data).getById(sd.data.intvalue);
                if ( !res ) {
                    res = '';
                } else {
                    res = comboStore(combo_data).getById(sd.data.intvalue).get('name');
                }
            }
            return res;
        } else {
            if ( value || sd.dirty ) {
                return value;
            } else {
                return comboStore(combo_data).getById(0).get('name');
            }
        }
    }

    var colModel = new Ext.grid.ColumnModel({
        columns: [
            { header: Localize.Name , width:  150, dataIndex: 'name'  },
            { header: Localize.Description,  dataIndex: 'descr', id: 'descr'},
            { header: Localize.Value, width:  200, dataIndex: 'param_value', renderer: setComboValue, editable: true}
        ],
        editors: {
                'text':    new Ext.grid.GridEditor(new Ext.form.TextField({})),
                'combo':   function(combo_data, combo_index) {
                                return new Ext.grid.GridEditor(comboBox(combo_data, combo_index));
                           }
        },
        getCellEditor: function(colIndex, rowIndex) {
            var field = this.getDataIndex(colIndex);
            if (field == 'param_value') {
                var rec = data_store.getAt(rowIndex);
                if (rec.data.type) {
                    var data = data_store.getAt(rowIndex).data.value;
                    var int_value = data_store.getAt(rowIndex).data.int_value;
                    var combo_data = [];
                    var i=0;
                    Ext.each(data, function(pair) {
                       combo_data[i++] = [pair.id, pair.value];
                    });
                    return this.editors['combo'](combo_data, combo_data[0][0]);
                } else {
                    return this.editors['text'];
                }
            }
            return Ext.grid.ColumnModel.prototype.getCellEditor.call(this, colIndex, rowIndex);
        }
    });

    grid_panel = new Ext.grid.EditorGridPanel({
        //height  : 200,
        flex:1,
        ds      : data_store,
        autoExpandColumn: 'descr',
        cm      : colModel,
        selModel: new Ext.grid.RowSelectionModel(),
        disableSelection: true
    });
    return grid_panel;
}

function saveDevGroupOptVals(grid_panel, group_id) {
    var sel_model = grid_panel.getSelectionModel();
      var options = [];
    // @TODO сейчас передаётся только одна строка
    // @TODO нужно разобраться с "getSelectionModel() + selModel: new Ext.grid.RowSelectionModel()"
      // krivtsov: Перенес сторик в глобальный Inventory

    Ext.each(Inventory.DGO_store.getModifiedRecords(), function(record) {
            var d = {};
            d.name          = record.data.name;
            d.param_value   = record.data.param_value;
            options.push(d);
    });
    Ext.Ajax.request({
        url: 'config.php',
        method: "POST",
        params: {
            devision                : 207,
            async_call              : 1,
            save_dev_group_opt_vals : 1,
            group_id                : group_id,
            dev_group_options       : Ext.util.JSON.encode(options)
        },
        failure: function(options, success, response){
            Ext.Msg.alert(Localize.Status, response.responseText);
        }
    });
}








//var win = new Ext.Window();
//win.show();
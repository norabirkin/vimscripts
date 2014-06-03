/**
 * Storages collection object
 * Before save call function extract in this object
 * Result there will be created hidden elements
 */
var Storages = {
	objects: { net: false, ign: false, ifc: false, nas: false },
	grids: { segments: false, nas: false, nasseg: false },
	nasblock: { },
	nasblockRows: Ext.data.Record.create([{name: 'aniid', type: 'int'}, {name: 'nasid', type: 'int'}, { name: 'aniid', type: 'int'}, { name: 'type', type: 'int' }, { name: 'info', type: 'string' }, { name: 'value', type: 'string'}, { name: 'descr', type: 'string'}, { name: 'remove', type: 'int' }]),
	nasSimpleRow: new Ext.data.Record.create([{ name: 'id', type: 'int'}, { name: 'name', type: 'string'}]),
	nasSimpleStore: false,
	nasIndex: 0,
	removed: { netdel: new Array(), igndel: new Array(), ifcdel: new Array() },
	params: { formId: '', runningObject: '' },
	extract: function( _formId ){
		this.runningObject = '';

		for(var i in this.objects){
			if(this.objects[i] == false) continue;

			this.runningObject = i;
			this.objects[i].each(function(record, idx){
				for(var j in record.data){
					if(j == 'remove') continue;
					createHidOrUpdate(_formId, i + '[' + idx + '][' + j + ']', record.data[j]);
				}
			}, this);
		}

		for(var i in this.removed)
		{
			if(this.removed[i] == false) continue;

			if(this.removed[i].length > 0) {
				for(var j in this.removed[i]) {
					if(typeof this.removed[i][j] == 'function') continue;
					createHidOrUpdate(_formId, i + '[' + j + '][id]', this.removed[i][j].id);
				}
			}
		}

		for(var i in this.nasblock)
		{
			if(typeof this.nasblock[i] == 'object') {
				this.nasblock[i].each(function(record, idx) {
					for(var j in record.data){ createHidOrUpdate(_formId, 'radblacklog[' + i + '][' + idx + '][' + j + ']', record.data[j]); }
				})
			}
		}
	}
} // end Storages{ }


/**
 * Run this function when document is already loaded
 *
 */
Ext.onReady(function() {
	// Apply field restrictions
	onlyIP('_naip_, _nfhost_, _dhcpd_ip_');
	onlyNumeric('_flush_, _timer_, _nfport_, _dvport_, _netgrp_, _dhcpd_port_');
	// Initialize selected module group
	ifGroup('_Modules', '_moduleType_');
	changeVar('use_cas');

	// Управление сетями
    //NetwoksGrid('_Modules', '_NetworksList');

	//NASGrid('_Modules_', '_NasList');
	//NASSegments('_Modules_', '_NasSegList');
	LBPhone('_LBPhone');
	ignoreNetGrid('_IgnoreNetworksList');
 	iFaces('_NetFaces');
});


function nasEditor()
{
    PPAGELIMIT = 100;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0; return; }

    var feedWin;
    if(!feedWin){
        nasStore = new Ext.data.Store({
            id: 'nasList',
            name: 'nasList',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
            reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total', idProperty: 'nasid' },
                [
                    { name: 'nasid',      type: 'int'    },
                    { name: 'id',         type: 'int'    },
                    { name: 'isnew',      type: 'int'    },
                    { name: 'rsharedsec', type: 'string' },
                    { name: 'testpass',   type: 'string' },
                    { name: 'deviceid',   type: 'int'    },
                    { name: 'devicename', type: 'string' },
                    {
                        name: 'ip',
                        type: 'string',
                        // Для корректной сортировки по IP. Добиваем октет нулями и сортируем.
                        sortType: function(v){
                            var parts = String(v).split('.');
                            for(var i = 0, len = parts.length; i < len; i++){
                                parts[i] = String.leftPad(parts[i], 3, '0');
                            }
                            return parts.join('.');
                        }
                    }
                ]
            ),
            autoLoad: true,
            baseParams:{ async_call: 1, devision: 1, getRnas: 1, module: moduleId }
            //sortInfo: {
                //field: 'nasid',
                //direction: 'ASC'
            //}
        });

        var btnAddRemoveDevice = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: function(r,x,c){
                if (r.data.deviceid > 0)
                    return Ext.app.Localize.get('Remove') + ': ' + Ext.app.Localize.get('Device');
                else
                    return Ext.app.Localize.get('Add') + ': ' + Ext.app.Localize.get('Device');
            },
            iconCls: function(r,x,c){
                if (r.data.deviceid > 0 )
                    return 'ext-erase';
                else return 'ext-add';
            },
            resizable: false,
            width: 22
        });
        btnAddRemoveDevice.on('action', function(grid, record, rowIndex) {
            if (record.data.deviceid > 0){
                /**
                 * Отвязываем устройство от NAS
                 */
                Ext.MessageBox.show({
                    title: Ext.app.Localize.get('Remove device'),
                    msg: Ext.app.Localize.get('Exclude device') + '<b>' + record.data.ip + '</b>?',
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: false,
                    fn: function( btn ){
                        if (btn == 'cancel') return;
                        Ext.Ajax.request({ url: 'config.php', method: 'POST',
                            params: { async_call: 1, devision: 1, AddRemoveDevice: record.data.nasid, isRemove: 1 },
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
                                        record.set('deviceid', 0);
                                        nasStore.reload();
                                        Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Device was excluded"));
                                    }else{
                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), data.error.reason);
                                    }
                                }
                              return false;
                            }
                        });
                    }
                });
            } else {
                /**
                 * Привязка устройства к NAS
                 */
                Ext.MessageBox.show({
                    title: Ext.app.Localize.get('Add device'),
                    msg: Ext.app.Localize.get('Add device') + ': <b>' + record.data.ip + '</b>?',
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: false,
                    fn: function( btn ){
                        if (btn == 'cancel') return;
                        Ext.Ajax.request({ url: 'config.php', method: 'POST',
                            params: { async_call: 1, devision: 1, AddRemoveDevice: record.data.nasid, ip: record.data.ip, isRemove: 0 },
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
                                        if (data.data.devicename == null){
                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Device not found"));
                                        } else {
                                            nasStore.reload();
                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Device was included') + '<b>' + data.data.devicename + "</b>");
                                        }
                                    }else{
                                        Ext.Msg.alert(Ext.app.Localize.get('Error'), data.error.reason);
                                    }
                                }
                              return false;
                            }
                        });



                        //Ext.Ajax.request({
                        //    url: 'config.php',
                        //    timeout: 380000,
                        //    method: 'POST',
                        //    params: { async_call: 1, devision: 1, getnasdevice: record.get('ip') },
                        //    scope: { store: nasStore, idx: rowIndex },
                        //    callback: function(options, success, resp) {
                        //        try {
                        //            if(!success) { throw(resp); }
                        //            var data = Ext.util.JSON.decode(resp.responseText);
                        //            if(data['results']) {
                        //                this.store.getAt(this.idx).set('deviceid', data.results.deviceid);
                        //                this.store.getAt(this.idx).set('devicename', data.results.devicename);
                        //            } else Ext.Msg.alert('Внимание!', 'Устройство не найдено.');
                        //        }
                        //        catch(e) { Ext.Msg.error(e); }
                        //    }
                        //});
                    }
                });
            }
        });

        /**
         * Кнопка удаления NAS
        */
        var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), width: 22, iconCls: 'ext-drop' });
        btnDel.on('action', function(g, r, i) {
            Ext.MessageBox.show({
                title: Ext.app.Localize.get('Remove access server'),
                msg: Ext.app.Localize.get('Remove access server') + ': <b>' + r.data.ip + '</b>?',
                //width:400,
                buttons: Ext.MessageBox.OKCANCEL,
                multiline: false,
                fn: function( btn ){
                    if (btn == 'cancel') return;
                    Ext.Ajax.request({ url: 'config.php', method: 'POST',
                        params: { async_call: 1, devision: 1, delRnas: r.data.nasid },
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
                                    nasStore.reload();
                                    Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Record was removed'));
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

        /**
         * Кнопка редактирования NAS
        */
        var btnEdit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit') + ' ' + Ext.app.Localize.get('NAS'), width: 22, iconCls: 'ext-edit' });
        btnEdit.on('action', function(g, r, i) {
            insUpdRnas({Store: Ext.getCmp('_nasList').getStore(), editNas: r});
        });

        feedWin = new Ext.Window({
            width: 960,
            height: 450,
            layout:'fit',
            title: Ext.app.Localize.get('Gateway servers'),
            modal: true,
            labelAlign: 'top',
            buttonAlign: 'right',
            items:[
                {
                    xtype: 'grid',
                    id: '_nasList',
                    name: '_nasList',
                    layout:'fit',
                    enableHdMenu: false,
                    disableSelection: true,
                    loadMask: true,
                    autoExpandColumn: 'devicename',
                    view: new Ext.grid.GridView({
                        forceFit:false,
                        enableRowBody:true,
                        enableNoGroups: true,
                        deferEmptyText: false,
                        emptyText:Ext.app.Localize.get('Empty data')
                    }),
                    tbar: [
                        {
                            xtype: 'button',
                            iconCls: 'ext-add',
                            id: 'addNewRnas',
                            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('server'),
                            handler: function(){
                                insUpdRnas({Store: Ext.getCmp('_nasList').getStore()});
                            }
                        },
						'->',
						{
							xtype: 'label',
							text: Ext.app.Localize.get('Search'),
							style: 'font-weight:bold;padding-right:5px;'
						},
						{
							name: 'rnas_search',
							id: '_rnas_search',
							xtype: 'textfield',
							qtip: Ext.app.Localize.get('IP search available'),
							listeners: {
								afterrender: function() {
									this.on('specialkey', function(f, e){
										if (e.getKey() == e.ENTER) {
											this.ownerCt.ownerCt.getStore().setBaseParam('search',Ext.getCmp('_rnas_search').getValue());
											this.ownerCt.ownerCt.getStore().reload({
												params: {
													alldata: 1,
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
								Ext.getCmp('_nasList').getStore().setBaseParam('search',Ext.getCmp('_rnas_search').getValue());
								Ext.getCmp('_nasList').getStore().reload({
									params: {
										start: 0,
										limit: 100,
										alldata: 1
									}
								});
								//Ext.getCmp('_segmentsList').getView().refresh();
							}
						},
						'&nbsp;'
                    ],
                    cm: new Ext.grid.ColumnModel({
                        columns: [
                            btnEdit,
                            { header: 'ID', width: 65, sortable: true, dataIndex: 'nasid' },
                            {
                                header: Ext.app.Localize.get('IP'),
                                dataIndex: 'ip',
                                width: 160,
                                sortable: true
                            },
                            {
                                header: Ext.app.Localize.get('Secret'),
                                dataIndex: 'rsharedsec',
                                width: 200
                            },
                            btnAddRemoveDevice,
                            {
                                header: Ext.app.Localize.get('Device'),
                                dataIndex: 'devicename',
                                id: 'devicename',
                                sortable: true,
                                renderer: function(value, metaData, record) {
                                    if (value.length > 0) {
                                        return '<span style="color:green;">'+value+'</span>';
                                    }
                                    else {
                                        return '<span style="color:#666;"><i>' + Ext.app.Localize.get('Undefined') + '</i></span>';
                                    }
                                }
                            },
                            btnDel
                        ],
                        defaults: {
                            sortable: false,
                            menuDisabled: true
                        }
                    }),
                    plugins: [btnEdit,btnDel,btnAddRemoveDevice],
                    store: nasStore,
                    listeners:{
                        show: function() {
                            this.loadMask = new Ext.LoadMask(this.body, { msg:'Loading. Please wait...' });
                        }
                    },
                    bbar: [
                        new Ext.PagingToolbar({
                            pageSize: PPAGELIMIT,
                            store: nasStore,
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
                                        nasStore.reload({ params: { limit: PPAGELIMIT } });
                                    }
                                }
                            }
                            ]
                        })
                    ]
                }
            ],
            buttons:[{text:Ext.app.Localize.get('Close'),handler:function(){feedWin.close();}}]
        });
    }
  feedWin.show();
}

function insUpdRnas(Object)
{
    var isInsert = (typeof Object.editNas == 'undefined') ? true : false;
    Object.editNas = Object.editNas || {
        data: {
            nasid: 0,
            secret: '',
            ip: '127.0.0.0',
            devicename: '',
            deviceid: 0
        }
    };
    Store = Object['Store'];
    agentID = Store.baseParams.module;

    if (!Ext.isEmpty(Ext.getCmp('winInsUpdNas'))) { return; }

    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                Store.reload();
                Win.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.error.reason);
                };
            }
        });
    }

    // Ext.form.VTypes["ipVal"] = /^([1-9][0-9]{0,1}|1[013-9][0-9]|12[0-689]|2[01][0-9]|22[0-3])([.]([1-9]{0,1}[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){2}[.]([1-9][0-9]{0,1}|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;
    Ext.form.VTypes["ipVal"] = /^([1-9][0-9]{0,1}|1[0123-9][0-9]|12[0-689]|2[01][0-9]|22[0-3])([.]([1-9]{0,1}[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){2}[.]([0-9][0-9]{0,1}|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    Ext.form.VTypes["ip"]=function(v){
        return Ext.form.VTypes["ipVal"].test(v);
    }
    Ext.form.VTypes["ipText"]="1.0.0.1 - 223.255.255.254 excluding 127.x.x.x"
    Ext.form.VTypes["ipMask"]=/[.0-9]/;


    var Win = new Ext.Window({
        title: (isInsert) ? Ext.app.Localize.get('Adding access server') : (Ext.app.Localize.get('Editing access server') + ' ' + Object.editNas.data.ip),
        id: 'winInsUpdNas',
        plain: true,
        modal: true,
        renderTo:Ext.getBody(),
        layout: 'fit',
        border:false,
        width: 350,
        height: 170,
        items: [{
            xtype: 'form',
            buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame: true,
            labelWidth: 90,
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 1 },

                { xtype: 'hidden', name: 'InsUpdNas', value: Object.editNas.data.nasid},
                { xtype: 'hidden', name: 'agentid', value: agentID},
                { xtype: 'hidden', name: 'deviceid', value: Object.editNas.data.deviceid},
                { xtype: 'hidden', name: 'devicename', value: Object.editNas.data.devicename},
                { xtype: 'hidden', name: 'isInsert', value: isInsert?1:0 },

                {
                    xtype: 'textfield',
                    vtype: 'ip', // Валидатор выше
                    name: 'ip',
                    id: 'ip',
                    width: 180,
                    fieldLabel: Ext.app.Localize.get('IP'),
                    allowBlank: false,
                    value: Object.editNas.data.ip,
                    anchor:'-18'
                },
                {
                    xtype: 'textfield',
                    name: 'secret',
                    id: '_secret',
                    width: 180,
                    fieldLabel: Ext.app.Localize.get('Secret'),
                    allowBlank: true,
                    value: Object.editNas.data.rsharedsec,
                    anchor:'-18'
                },
                {
                    xtype: 'label',
                    fieldLabel: Ext.app.Localize.get('Device'),
                    text: Object.editNas.data.deviceid + ': ' + Object.editNas.data.devicename,
                    border:false,
                    hidden: (isInsert || Object.editNas.data.deviceid == 0 ) ? true : false
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
 * Всплывающее окно управления сетями
 */
function networksEditor()
{
    PPAGELIMIT = 100;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0; return; }
    try { var emul = document.getElementById('_remulateonnaid_').value; } catch(e) { var emul = 0; }

    if ( emul != 0 ){
        var S = Ext.get('_remulateonnaid_');
        addonTitle =  ' (' + Ext.app.Localize.get('emulation mode') + S.dom.options[S.dom.selectedIndex].text + ')';
    }
    else { addonTitle = ''; }

    var feedWin;
    if(!feedWin){

        segmentStore = new Ext.data.Store({
            id: 'nasSegList',
            name: 'nasSegList',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
            reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
                [
                    { name: 'recordid',  type: 'int' },
                    { name: 'aid',       type: 'int' },
                    { name: 'ignore',    type: 'int' },
                    { name: 'nat',       type: 'int' },
                    {
                        name: 'segment',
                        type: 'string',
                        sortType: function(v){
                            var parts = String(v).split('.');
                            for(var i = 0, len = parts.length; i < len; i++){
                                parts[i] = String.leftPad(parts[i], 3, '0');
                            }
                            return parts.join('.');
                        }
                    },
                    { name: 'mask',      type: 'string' },
                    { name: 'nasid',     type: 'int' },
                    { name: 'rnas',      type: 'string' },
                    { name: 'outervlan', type: 'string' },
					{ name: 'vlanname',  type: 'string' },
					{ name: 'vlanid',  type: 'string' },
                    {
                        name: 'gateway',
                        type: 'string',
                        sortType: function(v){
                            var parts = String(v).split('.');
                            for(var i = 0, len = parts.length; i < len; i++){
                                parts[i] = String.leftPad(parts[i], 3, '0');
                            }
                            return parts.join('.');
                        }
                    },
                    { name: 'devicegroupid',  type: 'int' },
                    { name: 'devicegroupname',  type: 'string' },
                    { name: 'guest',     type: 'int' }
                ]
            ),
            autoLoad: true,
            baseParams:{ async_call: 1, devision: 1, getsegments: 1, module: moduleId, emulate: emul },
			sortInfo: {
                field:     'recordid',
				direction: 'ASC'
			}
        });

        /**
         * Кнопка удаления сегмента
        */
        var btnDel = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), width: 22, iconCls: 'ext-drop' });
        btnDel.on('action', function(g, r, i) {
            Ext.MessageBox.show({
                title: Ext.app.Localize.get('Removing network segment'),
                msg: Ext.app.Localize.get('Remove') + ': ' + r.data.segment + '?',
                width:400,
                buttons: Ext.MessageBox.OKCANCEL,
                multiline: false,
                fn: function( btn ){
                    if (btn == 'cancel') return;
                    Ext.Ajax.request({ url: 'config.php', method: 'POST',
                        params: { async_call: 1, devision: 1, delSegment: r.data.recordid },
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
                                    Ext.getCmp('_segmentsList').getStore().reload();
                                    Ext.getCmp('_segmentsList').getView().refresh();
                                    Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Segment successfully deleted"));
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

        /**
         * Кнопка редактирования сетей
        */
        var btnEdit = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit') + ' ' + Ext.app.Localize.get('segment'), width: 22, iconCls: 'ext-edit' });
        btnEdit.on('action', function(g, r, i) {
            insUpdSegment({Store: Ext.getCmp('_segmentsList').getStore(), editSegment: r});
        });

        feedWin = new Ext.Window({
            width: 960,
            height: 450,
            layout:'fit',
            title: Ext.app.Localize.get('Networks configuration') + addonTitle,
            modal: true,
            labelAlign: 'top',
            buttonAlign: 'right',
            items:[
                {
                    xtype: 'grid',
                    id: '_segmentsList',
                    name: '_segmentsList',
                    layout:'fit',
                    enableHdMenu: false,
                    disableSelection: true,
                    loadMask: true,
                    autoExpandColumn: 'segment',
                    view: new Ext.grid.GridView({
                        forceFit:false,
                        enableRowBody:true,
                        enableNoGroups: true,
                        deferEmptyText: false,
                        emptyText:Ext.app.Localize.get('Empty data')
                    }),

                    cm: new Ext.grid.ColumnModel({
                        columns: [
                            btnEdit,
                            { header: 'ID', width: 55, sortable: true, dataIndex: 'recordid' },
                            {
                                header: Ext.app.Localize.get('Ignore'),
                                dataIndex: 'ignore',
                                width: 90,
                                renderer: function(value, metaData, record) {
                                    if (value > 0) {
                                        return '<span style="color:green;">' + Ext.app.Localize.get('yes') + '</span>';
                                    }
                                    else {
                                        return '--';
                                    }
                                }
                            },
                            {
                                header: Ext.app.Localize.get('NAT'),
                                dataIndex: 'nat',
                                width: 52,
                                resizable: false,
                                renderer: function(value, metaData, record) {
                                    if (value > 0) {
                                        return '<span style="color:green;">' + Ext.app.Localize.get('yes') + '</span>';
                                    }
                                    else {
                                        return '--';
                                    }
                                }
                            },
                            {
                                header: Ext.app.Localize.get('Guest'),
                                dataIndex: 'guest',
                                width: 52,
                                resizable: false,
                                renderer: function(value, metaData, record) {
                                    if (value > 0) {
                                        return '<span style="color:green;">' + Ext.app.Localize.get('yes') + '</span>';
                                    }
                                    else {
                                        return '--';
                                    }
                                }
                            },
                            {
                                id: 'segment',
                                header: Ext.app.Localize.get('Network'),
                                dataIndex: 'segment',
                                width: 70,
                                sortable: true
                            },
                            {
                                header: Ext.app.Localize.get('Mask'),
                                dataIndex: 'mask',
                                width: 65,
                                sortable: true
                            },
                            {
                                header: Ext.app.Localize.get('Gateway'),
                                dataIndex: 'gateway',
                                sortable: true,
                                width: 100
                            },
                            {
                                header: 'VLAN',
                                dataIndex: 'outervlan',
                                width: 80
                            },
                            {
                                header: Ext.app.Localize.get('VLAN name'),
                                dataIndex: 'vlanname',
                                width: 120
                            },
                            {
                                header: 'NAS',
                                width: 130,
                                dataIndex: 'nasid',
                                sortable: true,
                                renderer: function(value, metaData, record) {
									if (value == 0){
                                        return Ext.app.Localize.get('All');
                                    } else if (value == -1){
                                        return Ext.app.Localize.get('Not use');
                                    } else if (value > 0){
                                        return record.get('rnas');
                                    } else return value;
                                }
                            },{
                                header: Ext.app.Localize.get('Group of devices'),
                                dataIndex: 'devicegroupname',
                                width: 100
                            },
                            btnDel
                        ],
                        defaults: {
                            sortable: false,
                            menuDisabled: true
                        }
                    }),
                    plugins: [btnEdit,btnDel],
                    store: segmentStore,
                    listeners:{
                        show: function() {
                            this.loadMask = new Ext.LoadMask(this.body, { msg:'Loading. Please wait...' });
                        },
                        rowDblclick: function(grid, rowIndex, e) {
                            rStore = grid.getStore();
                            insUpdSegment({Store: rStore, editSegment: rStore.getAt(rowIndex)});
                        }
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            iconCls: 'ext-add',
                            id: 'addNewSegment',
                            text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('network'),
                            handler: function(){
                                insUpdSegment({Store: Ext.getCmp('_segmentsList').getStore()});
                            }
                        },
                        '->',
                        {
                            xtype: 'label',
                            text: Ext.app.Localize.get('Search'),
                            style: 'font-weight:bold;padding-right:5px;'
                        },
                        {
                            name: 'search',
                            id: '_search',
                            xtype: 'textfield',
                            qtip: Ext.app.Localize.get('VLAN search template'),
                            listeners: {
                                afterrender: function() {
                                    this.on('specialkey', function(f, e){
                                        if (e.getKey() == e.ENTER) {
                                            this.ownerCt.ownerCt.getStore().setBaseParam('search',Ext.getCmp('_search').getValue());
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
                                Ext.getCmp('_segmentsList').getStore().setBaseParam('search',Ext.getCmp('_search').getValue());
                                Ext.getCmp('_segmentsList').getStore().reload({
                                    params: {
                                        start: 0,
                                        limit: 100
                                    }
                                });
                                //Ext.getCmp('_segmentsList').getView().refresh();
                            }
                        },
                        '&nbsp;'
                    ],
                    bbar: [
                        new Ext.PagingToolbar({
                            pageSize: PPAGELIMIT,
                            store: segmentStore,
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
                                        segmentStore.reload({ params: { limit: PPAGELIMIT } });
                                    }
                                }
                            }
                            ]
                        })
                    ]
                }
            ],
            buttons:[
                {
                    text: Ext.app.Localize.get('Close'),
                    handler: function(){
                        feedWin.close();
                    }
                }
            ]
        });
        /**
         * Подгружаем данные
         */
        //segmentStore.reload();
    }
    feedWin.show();

}


function insUpdSegment(Object)
{
    isInsert = (typeof Object.editSegment == 'undefined') ? true : false;
    Object.editSegment = Object.editSegment || {
        data: {
            vlanid: 0,
            recordid: 0,
            segment: '127.0.0.0',
            mask: '24'
        }
    };
    Store = Object['Store'];

    if (!Ext.isEmpty(Ext.getCmp('winInsUpdSegment'))) { return; }

    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
                Store.reload();
                Win.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.error.reason);
                };
                //Win.destroy();
            }
        });
    }

    try {
        agentID = (Store.baseParams.emulate > 0) ? Store.baseParams.emulate : Store.baseParams.module;
		rnasAgent = Store.baseParams.module
    } catch (e) {
        agentID = 0;
		rnasAgent = 0;
    }

        //Storages.nasSimpleStore = new Ext.data.SimpleStore({ data: [[0, Localize.All], [-1, Localize.NotUse]], fields: ['id', 'name'] });
        var nasStore = new Ext.data.Store({
            id: 'nasList',
            name: 'nasList',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
            reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total', idProperty: 'nasid' },
                [
                    { name: 'nasid',      type: 'int'    },
                    {
                        name: 'ip',
                        type: 'string',
                        // Для корректной сортировки по IP. Добиваем октет нулями и сортируем.
                        sortType: function(v){
                            var parts = String(v).split('.');
                            for(var i = 0, len = parts.length; i < len; i++){
                                parts[i] = String.leftPad(parts[i], 3, '0');
                            }
                            return parts.join('.');
                        }
                    },
                    { name: 'mask',       type: 'string' }
                ]
            ),
            autoLoad: false,
            baseParams:{ async_call: 1, devision: 1, getRnas: 1, module: rnasAgent, alldata: 1 },
            listeners: {
                load: function(store) {
                    store.each(function(record) {
                        record.data.name = Ext.util.Format.ellipsis(record.data.name, 33);
                    });
                    store.insert(0, new store.recordType({
                        nasid: 0,
                        ip: Ext.app.Localize.get('All')
                    }));
                    store.insert(0, new store.recordType({
                        nasid: -1,
                        ip: Ext.app.Localize.get('Not use')
                    }));
                }
            },
            sortInfo: {
                field: 'ip',
                direction: 'ASC'
            }
        });


		var deviceStore = new Ext.data.Store({
            id: 'deviceList',
            name: 'deviceList',
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
            reader: new Ext.data.JsonReader({ root: 'data' },
                [
                    { name: 'groupid', type: 'int' },
                    { name: 'name', type: 'string' }
                ]
            ),
            autoLoad: false,
            baseParams:{ async_call: 1, devision: 209, getdevgr: 1 },
            listeners: {
                load: function(store) {
					store.insert(0, new store.recordType({
                        groupid: 0,
                        name: Ext.app.Localize.get('None')
                    }));
                    store.each(function(record) {
                        record.data.name = Ext.util.Format.ellipsis(record.data.name, 33);
                    });
                }
            }
        });

    var vlansStore = new Ext.data.Store({
		id: 'vlansStore',
		name: 'vlansStore',
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
			alldata: 1
        },
		listeners: {
			load: function(store) {
				store.each(function(record) {
					record.data.name = Ext.util.Format.ellipsis(record.data.name, 33);
				});
			}
		},
		sortInfo: {
			field: 'outervlan',
			direction: 'ASC'
		},
        autoLoad: false
    });

    var Win = new Ext.Window({
        title: (isInsert) ? Ext.app.Localize.get('Adding network') : Ext.app.Localize.get('Editing network'),
        id: 'winInsUpdSegment',
        width: 350,
        height: 330,
        modal: true,
        layout: 'fit',
        items: [{
            xtype: 'form',
            buttonAlign: 'center',
            url: 'config.php',
            monitorValid: true,
            frame: true,
            labelWidth: 140,
            defaults: {
                anchor: '100%'
            },
            items: [
                { xtype: 'hidden', name: 'async_call', value: 1 },
                { xtype: 'hidden', name: 'devision', value: 1 },
                { xtype: 'hidden', name: 'InsUpdSegment', value: 1},
                { xtype: 'hidden', name: 'agentid', value: agentID},
                { xtype: 'hidden', name: 'isInsert', value: isInsert?1:0 },
                { xtype: 'hidden', name: 'recordid', value: Object.editSegment.data.recordid},
                {
                    xtype: 'checkbox',
                    name: 'ignore',
                    id: 'ignore',
                    fieldLabel: Ext.app.Localize.get('Ignore') + " (" + Ext.app.Localize.get("l. traf.") + ")",
                    checked: (Object.editSegment.data.ignore) ? true : false
                },
                {
                    xtype: 'checkbox',
                    name: 'nat',
                    id: 'nat',
                    fieldLabel: Ext.app.Localize.get('Nat'),
                    checked: (Object.editSegment.data.nat) ? true : false
                },
                {
                    xtype: 'checkbox',
                    name: 'guest',
                    id: 'guest',
                    fieldLabel: Ext.app.Localize.get('Guest'),
                    checked: (Object.editSegment.data.guest) ? true : false
                },
                {
                    xtype: 'textfield',
                    name: 'segment',
                    id: 'segment',
                    fieldLabel: Ext.app.Localize.get('Segment'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9\.]"),
                    value: Object.editSegment.data.segment
                },
                {
                    xtype: 'numberfield',
                    name: 'mask',
                    id: 'mask',
                    allowDecimals: false,
                    allowNegative: false,
                    blankText: Ext.app.Localize.get('Input number >= 0'),
                    minValue: 0,
                    fieldLabel: Ext.app.Localize.get('Mask'),
                    allowBlank: false,
                    maskRe: new RegExp("[0-9]"),
                    value: Object.editSegment.data.mask
                },
                {
                    xtype: 'textfield',
                    name: 'gateway',
                    id: 'gateway',
                    fieldLabel: Ext.app.Localize.get('Gateway'),
                    maskRe: new RegExp("[0-9\.]"),
                    value: Object.editSegment.data.gateway
                },
                /*
				{
                    xtype: 'numberfield',
                    name: 'outervlan',
                    id: 'outervlan',
                    width: 180,
                    allowDecimals: false,
                    allowNegative: false,
                    blankText: Ext.app.Localize.get('Input number from 1 to 4095'),
                    maxValue: 4095,
                    minValue: 1,
                    fieldLabel: Ext.app.Localize.get('VLAN'),
                    maskRe: new RegExp("[0-9]"),
                    value: (Object.editSegment.data.outervlan == 0) ? '' : Object.editSegment.data.outervlan
                },
                */
                {
                    xtype: 'combo',
                    id: '_vlanid',
                    fieldLabel: Ext.app.Localize.get('VLAN'),
                    hiddenName: 'vlanid',
                    displayField: 'name',
                    valueField: 'recordid',
                    //value: (Object.editSegment.data.vlanid == 0) ? '' : Object.editSegment.data.vlanid,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    tpl: '<tpl for="."><div class="x-combo-list-item">{outervlan} &mdash; {name}</div></tpl>',
                    itemSelector: 'div.x-combo-list-item',
                    forceSelection:true,
                    lazyInit: false,
                    emptyText: '...',
                    loadingText: Ext.app.Localize.get('Receiving VLAN&quot;s list...'),
                    selectOnFocus:true,
                    store: vlansStore,
                    listeners: {
                        beforerender: function(combo){
                            combo.store.on('load', function(store){
                                if (store.getCount()>0){
                                    var idx;
                                    if ((idx = store.find('recordid',this.data.vlanid)) > -1){
                                        this.combo.setValue(this.data.vlanid);
                                    }
                                }
                            },{combo:combo,data:Object.editSegment.data});
                            combo.getStore().load();
                        }.createDelegate({data: Object.editSegment.data})
                    }
				},
                {
                    xtype: 'combo',
                    id: '_nasid',
                    fieldLabel: Ext.app.Localize.get('NAS'),
                    hiddenName: 'nasid',
                    displayField: 'ip',
                    valueField: 'nasid',
                    value: Object.editSegment.data.nasid,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    tpl: '<tpl for="."><div class="x-combo-list-item">{ip}</div></tpl>',
                    itemSelector: 'div.x-combo-list-item',
                    forceSelection:true,
                    lazyInit: false,
                    emptyText: Ext.app.Localize.get('All'),
                    loadingText: Ext.app.Localize.get('Receiving NAS list...'),
                    selectOnFocus:true,
                    store: nasStore,
                    listeners: {
                        beforerender: function(combo){
                            combo.store.on('load', function(store){
                                if (store.getCount()>0){
                                    var idx;
                                    if ((idx = store.find('nasid',this.data.nasid)) > -1){
                                        this.combo.setValue(this.data.nasid);
                                    }
                                }
                            },{combo:combo,data:Object.editSegment.data});
                            combo.getStore().load();
                        }.createDelegate({data: Object.editSegment.data})
                    }
				},
				{
                    xtype: 'combo',
                    id: '_deviceid',
                    fieldLabel: Ext.app.Localize.get('Group of devices'),
                    hiddenName: 'groupid',
                    displayField: 'name',
                    valueField: 'groupid',
                    value: Object.editSegment.data.devicegroupname,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    forceSelection:true,
                    lazyInit: false,
                    loadingText: Ext.app.Localize.get('Loading...'),
                    selectOnFocus:true,
                    store: deviceStore,
                    listeners: {
                        beforerender: function(combo){
                            combo.store.on('load', function(store){
                                if (store.getCount()>0){
                                    var idx;
                                    if ((idx = store.find('groupid', this.data.devicegroupid)) > -1){
                                        this.combo.setValue(this.data.devicegroupid);
                                        this.combo.setRawValue(this.data.devicegroupname);
                                    }
                                }
                            },{combo:combo,data:Object.editSegment.data});
                            combo.getStore().load();
                        }.createDelegate({data: Object.editSegment.data})
                    }
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
 * Create network grid object
 * @param	string, DOM Element to render grid object
 */
function NetwoksGrid( formId, renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0 }

	Ext.QuickTips.init();
	var fm = Ext.form;

	var checkIgnore = new Ext.grid.CheckColumn({ header: Localize.Ignore, id: 'ext-ignoreCol', dataIndex: 'ignore', width: 70 });
	var checkNAT = new Ext.grid.CheckColumn({ header: "NAT", id: 'ext-natCol', dataIndex: 'nat', width: 55 });
	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });

	var netColModel = new Ext.grid.ColumnModel([
		checkIgnore, checkNAT,
		{
			id: 'segment', header: Localize.Network, dataIndex: 'segment', sortable: true,
			editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[0-9\.]") })
		},{
			header: Localize.Mask, dataIndex: 'mask', width: 65, sortable: true,
			editor: new fm.NumberField({ allowBlank: false, allowNegative: false, maxValue: 32 })
		}, checkRemove
	]);

	var netRows = Ext.data.Record.create([
        { name: 'recordid', type: 'int' },
        { name: 'aid', type: 'int' },
        { name: 'ignore', type: 'int' },
        { name: 'nat', type: 'int' },
        { name: 'segment', type: 'string' },
        { name: 'mask', type: 'int' },
        { name: 'nasid', type: 'int' },
        { name: 'gateway', type: 'string' },
        { name: 'guest', type: 'int' },
        { name: 'remove', type: 'int' }
    ]);

	Storages.objects.net = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, netRows),
		baseParams: {
			async_call: 1,
			devision: 1,
			getsegments: 1,
			module: moduleId
		},
		autoLoad: true
	});

	Storages.grids.segments = new Ext.grid.EditorGridPanel({
		store: Storages.objects.net, cm: netColModel, renderTo: renderTo, height: 200,
		autoExpandColumn: 'segment', frame: false, loadMask: true,
		plugins: [checkIgnore, checkNAT, checkRemove], clicksToEdit: 1,
		tbar: [{
			text: Localize.Add, iconCls: 'ext-add',
			handler: function() {
				var row = new netRows({ recordid: 0, aid: 0, ignore: 0, nat: 0, segment: '127.0.0.1', mask: 32, remove: false });
				Storages.grids.segments.stopEditing();
				Storages.objects.net.insert(0, row);
				Storages.grids.segments.startEditing(0, 0);
			}
		},{
			xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove',
			handler: function() {
				Storages.grids.segments.stopEditing();
				Storages.objects.net.each(function(record) {
					if(record.data.remove == true) {
						if(record.data.recordid > 0) {
							Storages.removed.netdel[ Storages.removed.netdel.length ] = record.data;
						}

						Storages.objects.net.remove(record);
					}
				})
			}
		}, '-' , {
			xtype: 'checkbox', id: 'globalignore', boxLabel: Localize.IgnLocalTraf,
			listeners: {
				check: function(check, checked) {
					createHidOrUpdate(formId, 'ignorelocal', (checked) ? 1 : 0);
					Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-ignoreCol'), checked)
				},
				render: function(){
					try {
						this.setValue((document.getElementById('_ignorelocal_').value == 1) ? true: false);
					} catch(e) { }
				}
			}
		}],
		listeners: {
			render: function() {
				try {
					if(document.getElementById('_ignorelocal_').value == 1) { this.colModel.setHidden(this.colModel.getIndexById('ext-ignoreCol'), true); }
					if(document.getElementById('_moduleType_').value > 1) { this.colModel.setHidden(this.colModel.getIndexById('ext-natCol'), true); }
				} catch(e) { }
			}
		}
	});
} // end NetworksGrid()


/**
 * Create NAS grid object
 * @param	string, DOM Element to render grid object
 */
function NASGrid( formId, renderTo )
{
    if (!document.getElementById(renderTo)) return;

    try {
        var moduleId = document.getElementById('_module_').value;
    } catch (e) {
        var moduleId = 0
    }

    Ext.QuickTips.init();
    var fm = Ext.form;

    var checkRemove = new Ext.grid.CheckColumn({
        header: Localize.Remove,
        dataIndex: 'remove',
        resizable: false,
        width: 65
    });
    var ANI = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Localize.AclSet,
        width: 22,
        dataIndex: 'uid',
        resizable: false,
        iconCls: 'ext-edit'
    });
    var DevAdd = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Add') + ': ' + Ext.app.Localize.get('Device'),
        resizable: false,
        width: 22,
        dataIndex: 'uid',
        iconCls: 'ext-add'
    });
    var DevClear = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove') + ': ' + Ext.app.Localize.get('Device'),
        width: 22,
        resizable: false,
        dataIndex: 'uid',
        iconCls: 'ext-erase'
    });

	var NASColModel = new Ext.grid.ColumnModel({
        columns: [
            ANI,
            { header: 'ID', width: 50, sortable: true, dataIndex: 'nasid' },
            {
                id: 'secret',
                header: Ext.app.Localize.get('Secret'),
                width: 160,
                dataIndex: 'secret',
                sortable: false,
                renderer: function(value) { var result = ''; for(var i = 0, off = value.length; i < off; i++) { result = result + '*'; } return result; },
                editor: new fm.TextField({ inputType: 'password', allowBlank: false })
            },
            DevAdd,
            DevClear,
            {
                header: Ext.app.Localize.get('Device'),
                width: 120,
                dataIndex: 'devicename',
                id: 'devicename',
                sortable: true
            },
            {
                id: 'rnas',
                header: 'IP',
                dataIndex: 'rnas',
                width: 160,
                sortable: true,
                editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[0-9\.]") })
            },
            checkRemove
        ],
        defaults: {
            sortable: false,
            menuDisabled: true
        }
    });

    var netRows = Ext.data.Record.create([{
        name: 'nasid',
        type: 'int'
    }, {
        name: 'id',
        type: 'int'
    }, {
        name: 'isnew',
        type: 'int'
    }, {
        name: 'secret',
        type: 'string'
    }, {
        name: 'deviceid',
        type: 'int'
    }, {
        name: 'devicename',
        type: 'string'
    }, {
        name: 'rnas',
        type: 'string'
    }, {
        name: 'remove',
        type: 'int'
    }]);
    Storages.objects.nas = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            id: 'nasList'
        }, netRows),
        baseParams: {
            async_call: 1,
            devision: 1,
            getnas: 1,
            module: moduleId
        },
        listeners: {
            load: function(store) {
                store.each(function(record, idx) {
                    var row = new Storages.nasSimpleRow({
                        id: record.data.nasid,
                        name: record.data.rnas
                    });
                    try {
                        Storages.nasSimpleStore.add(row);
                    } catch (e) {}
                    if (record.data.nasid > Storages.nasIndex) {
                        Storages.nasIndex = record.data.nasid;
                    }

                    //if (!Storages.nasblock[record.data.nasid]) {
                    //    Storages.nasblock[record.data.nasid] = new Ext.data.Store({
                    //
                    //        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
                    //        reader: new Ext.data.JsonReader(
                    //            { root: 'results', id: 'ifacesList' },
                    //            Storages.nasblockRows
                    //        ),
                    //
                    //        baseParams: {
                    //            async_call: 1,
                    //            devision: 1,
                    //            getnasblock: record.data.nasid,
                    //            module: record.data.id
                    //        }
                    //
                    //    });
                    //
                    //    Storages.nasblock[record.data.nasid].load();
                    //}


                });

                try {
                    Storages.objects.net.load()
                } catch (e) {}
            },
            update: function(store, record) {
                var reg = new RegExp("^" + record.data.nasid + "$", "ig");
                try {
                    Storages.nasSimpleStore.getAt(Storages.nasSimpleStore.find('id', reg)).data.name = record.data.rnas;
                    Storages.nasSimpleStore.fireEvent('datachanged');
                } catch (e) {}
            }
        },
        autoLoad: true
    });

	Storages.grids.nas = new Ext.grid.EditorGridPanel({
		store: Storages.objects.nas, cm: NASColModel, renderTo: renderTo, height: 200, autoExpandColumn: 'devicename', frame: false, loadMask: true,
		plugins: [ANI, DevAdd, checkRemove ], clicksToEdit: 1,
		tbar: [{
			text: Localize.Add, iconCls: 'ext-add',
			handler: function() {
				Storages.nasIndex = Storages.nasIndex + 1;
				var row = new netRows({ nasid: Storages.nasIndex, secret: '', rnas: '127.0.0.1', id: moduleId, isnew: 1, remove: false });
				Storages.grids.nas.stopEditing(); Storages.objects.nas.insert(0, row); Storages.grids.nas.startEditing(0, 0);
				var row = new Storages.nasSimpleRow({ id: Storages.nasIndex, name: '127.0.0.1'});
				try{ Storages.nasSimpleStore.add(row); } catch(e){ }
			}
		},{
			xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove',
			handler: function() {
				Storages.grids.nas.stopEditing();
				Storages.objects.nas.each(function(record) {
					if(record.data.remove == true) {
						var reg = new RegExp("^" + record.data.nasid + "$", "ig");
						// Try if dialup
						try{ var row = Storages.nasSimpleStore.getAt(Storages.nasSimpleStore.find('id', reg)); Storages.objects.net.each(function(rec) { if(rec.data.nasid == row.data.id) { rec.data.nasid = 0; Storages.objects.net.fireEvent('datachanged'); } }); Storages.nasSimpleStore.remove(row); } catch(e){ };
						Storages.objects.nas.remove(record);
					}
				})
			}
		}]
	});

	ANI.on('action', function(grid, record, rowIndex) { showRNASBlock(moduleId, grid.store.getAt(rowIndex).data.nasid) });
	DevAdd.on('action', function(grid, record, rowIndex){
        // Request
		Ext.Ajax.request({
			url: 'config.php',
			timeout: 380000,
			method: 'POST',
			params: {
				async_call: 1,
				devision: 1,
				getnasdevice: record.get('rnas')
			},
			scope: {
				store: grid.store,
				idx: rowIndex
			},
			callback: function(options, success, resp) {
				try {
					if(!success) {
						throw(resp);
					}

					var data = Ext.util.JSON.decode(resp.responseText);
					if(data['results']) {
						this.store.getAt(this.idx).set('deviceid', data.results.deviceid);
						this.store.getAt(this.idx).set('devicename', data.results.devicename);
					}
				}
				catch(e) {
					Ext.Msg.error(e);
				}
			}
		});
	});
	DevClear.on('action', function(grid, record, rowIndex){
		record.set('deviceid', 0);
		record.set('devicename', '');
	});
} // end NASGrid()


/**
 * Create NAS grid object. This grid is common for Dialup and VoIP modules
 * @param	string, DOM Element to render grid object
 */
function NASSegments( formId, renderTo )
{

	if(!document.getElementById(renderTo)) return;

	try {
		var moduleId = document.getElementById('_module_').value;
	} catch(e) {
		var moduleId = 0
	}

	Storages.nasSimpleStore = new Ext.data.SimpleStore({ data: [[0, Localize.All], [-1, Localize.NotUse]], fields: ['id', 'name'] });

	Ext.QuickTips.init();
	var fm = Ext.form;

	var checkGuest = new Ext.grid.CheckColumn({ header: Localize.Guest, dataIndex: 'guest', width: 52, resizable: false});
	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 62, resizable: false});

	var checkIgnore = new Ext.grid.CheckColumn({ header: Localize.Ignore, resizable: false, id: 'ext-ignoreCol', dataIndex: 'ignore', width: 70 });
	var checkNAT = new Ext.grid.CheckColumn({ header: "NAT", resizable: false, id: 'ext-natCol', dataIndex: 'nat', width: 55 });


	var NASColModel = new Ext.grid.ColumnModel({
        columns:[
            { header: 'ID', width: 55, sortable: true, dataIndex: 'recordid' },
            checkIgnore, checkNAT,
            checkGuest,
            {
                id: 'segment', header: Localize.Network, dataIndex: 'segment', width: 95, sortable: true,
                editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[0-9\.]") })
            },
            {
                header: Localize.Mask, dataIndex: 'mask', width: 65, sortable: true,
                editor: new fm.NumberField({ allowBlank: false, allowNegative: false, maxValue: 32 })
            },
            {
                header: Ext.app.Localize.get('Gateway'),
                dataIndex: 'gateway',
                sortable: true,
                width: 130,
                editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[0-9\.]") })
            },
            {
                header: 'VLAN',
                dataIndex: 'outervlan',
                width: 80,
                editor: new Ext.form.NumberField({allowDecimals:false})
            },
            {
                header: 'NAS',
                width: 130,
                dataIndex: 'nasid',
                sortable: true,
                renderer: function(value) {
                    var reg = new RegExp("^" + value + "$", "ig");
                    if(value <= 0){ return Storages.nasSimpleStore.getAt(Storages.nasSimpleStore.find('id', reg)).data.name; }
                    else{ var A = Storages.nasSimpleStore.find('id', reg); if(A > -1){ return 'ID ' + Storages.nasSimpleStore.getAt(A).data.id; } }
                },
                editor: new fm.ComboBox({
                    typeAhead: true, mode: 'local', lazyRender: true,
                    triggerAction: 'all', store: Storages.nasSimpleStore,
                    displayField: 'name', valueField: 'id', listWidth: 130
                })
            },
            checkRemove
        ],
        defaults: {
            sortable: false,
            menuDisabled: true
        }
    });


	var Rows = Ext.data.Record.create([
        { name: 'recordid', type: 'int' },
        { name: 'id', type: 'int' },
        { name: 'nat', type: 'int' },
        { name: 'nasid', type: 'int' },
        { name: 'ignore', type: 'int' },
        { name: 'guest', type: 'int' },
        { name: 'segment', type: 'string' },
        { name: 'gateway', type: 'string' },
        { name: 'mask', type: 'int' },
        { name: 'outervlan', type: 'int' },
        { name: 'remove', type: 'int' }
    ]);

    try { var emul = document.getElementById('_remulateonnaid_').value; } catch(e) { var emul = 0 }
    Storages.objects.net = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
		reader: new Ext.data.JsonReader({ root: 'results', id: 'nasSegList' }, Rows),
		baseParams:{ async_call: 1, devision: 1, getsegments: 1, module: moduleId, emulate: emul },
        autoLoad: true
	});

	Storages.grids.nasseg = new Ext.grid.EditorGridPanel({
		store: Storages.objects.net, cm: NASColModel, renderTo: renderTo, height: 200, autoExpandColumn: 'segment',
		frame: false, loadMask: true, plugins: [ checkGuest, checkRemove, checkIgnore, checkNAT ], clicksToEdit: 1,
		tbar: [{
			text: Localize.Add, iconCls: 'ext-add',
			handler: function() {
                var row = new Rows({
					recordid: 0,
                    ignore: 0, nat: 0,
					id: 0,
                    segment: '127.0.0.1',
                    mask: 32,
					nasid: 0,
                    guest: 0,
					remove: false
				});
				Storages.grids.nasseg.stopEditing();
				Storages.objects.net.insert(0, row);
				Storages.grids.nasseg.startEditing(0, 0);
			}
		},{
			xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove',
			handler: function() {
				Storages.grids.nas.stopEditing();
				Storages.objects.net.each(function(record) {
					if(record.data.remove == true) {
						Storages.objects.net.remove(record);
					}
				})
			}
		}]
	});
} // end NASSegments()


/**
 * Update segments list for the radius when chwnged emulate mode
 * @param	integer, module id to emulate for, if empty than off
 */
function onEmulUpdate( emulate )
{
	try {
        var emulate = emulate || document.getElementById('_module_').value;
        var agentId = document.getElementById('_module_').value;
    } catch(e) { Ext.Msg.error(e); }

	try {
		if(agentId != emulate) {
			var S = Ext.get('_remulateonnaid_');
			Ext.Msg.alert(
                Ext.app.Localize.get('Info'),
                (emulate == 0)
                    ? Ext.app.Localize.get('RADIUS will manage own accounts')
                    : Ext.app.Localize.get('RADIUS will manage accounts of the selected module')
                    + ' "' + S.dom.options[S.dom.selectedIndex].text + '"'
            );
		}
//        if (emulate != 0)
//            Storages.objects.net.baseParams.module = emulate;
//        else
//            Storages.objects.net.baseParams.module = document.getElementById('_module_').value;
//		Storages.objects.net.reload({ params: { flush: 1 } });

	} catch(e) { Ext.Msg.error(e); }
} // end onEmulUpdate()


/**
 * Create grid object to show ignored network area segments
 * @param	string, DOM element render to
 */
function ignoreNetGrid( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0 }

	Ext.QuickTips.init();
	var fm = Ext.form;

	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });

	var netColModel = new Ext.grid.ColumnModel([
        {
			header: Localize.Network,
            dataIndex: 'segment',
            id: 'ignore_segment',
            sortable: true,
            width: 248,
			editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[0-9\.]") })
		},
        {
			header: Localize.Mask,
            dataIndex: 'mask',
            width: 65,
            sortable: true,
			editor: new fm.NumberField({ allowBlank: false, allowNegative: false, maxValue: 32 })
		},
        checkRemove
	]);

	var igNetRows = Ext.data.Record.create([
        { name: 'id', type: 'int' },
        { name: 'segment', type: 'string' },
        { name: 'mask', type: 'int' },
        { name: 'remove', type: 'int' }
    ]);
	Storages.objects.ign = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
		reader: new Ext.data.JsonReader({ root: 'results', id: 'ignoreNetList' }, igNetRows),
		baseParams:{ async_call: 1, devision: 1, getignore: 1, module: moduleId },
		autoLoad: true
	});

    var igGrid = new Ext.grid.EditorGridPanel({
        store: Storages.objects.ign,
        cm: netColModel,
        renderTo: renderTo,
        height: 200,
        frame: false,
        autoExpandColumn: 'ignore_segment',
        plugins: checkRemove,
        loadMask: true,
        clicksToEdit: 1,
        tbar: [{
            text: Ext.app.Localize.get('Add'),
            iconCls: 'ext-add',
            handler: function() {
                var row = new igNetRows({
                    id: 0,
                    segment: '127.0.0.1',
                    mask: 32,
                    remove: false
                });
                igGrid.stopEditing();
                Storages.objects.ign.insert(0, row);
                igGrid.startEditing(0, 0);
            }
        }, {
            xtype: 'button',
            text: Ext.app.Localize.get('Remove'),
            iconCls: 'ext-remove',
            handler: function() {
                igGrid.stopEditing();
                Storages.objects.ign.each(function(record) {
                    if (record.data.remove == true) {
                        if (record.data.id > 0) {
                            Storages.removed.igndel[Storages.removed.igndel.length] = record.data;
                        }

                        Storages.objects.ign.remove(record);
                    }
                })
            }
        }]
    });
} // ignoreNetGrid()


/**
 * Network device interfaces list
 * @param	string, DOM element render to
 */
function iFaces( renderTo )
{
	if(!document.getElementById(renderTo)) return;
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0 }

	Ext.QuickTips.init();
	var fm = Ext.form;

	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });
	var faceColModel = new Ext.grid.ColumnModel([{
			header: "ID", dataIndex: 'devid', width: 55
		},{
			header: Localize.InterfaceName, dataIndex: 'name', width: 257, align: 'left',
			editor: new fm.TextField({ allowBlank: false, maskRe: new RegExp("[a-z-A-Z0-9\.\-\/]") })
		}, checkRemove
	]);

	var faceRows = Ext.data.Record.create([ { name: 'id', type: 'int' }, { name: 'devid', type: 'int' }, { name: 'name', type: 'string' }, { name: 'remove', type: 'int' } ]);
	Storages.objects.ifc = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
		reader: new Ext.data.JsonReader({ root: 'results', id: 'ifacesList' }, faceRows),
		baseParams:{ async_call: 1, devision: 1, getifaces: 1, module: moduleId },
		autoLoad: true
	});

	var faceGrid = new Ext.grid.EditorGridPanel({
		store: Storages.objects.ifc, cm: faceColModel, renderTo: renderTo, height: 150, frame: false,
		plugins: checkRemove, loadMask: true, clicksToEdit: 1,
		tbar: [{
			text: Localize.Add, iconCls: 'ext-add',
			handler: function() {
				var row = new faceRows({ id: 0, devid: 0, name: 'eth0', remove: false });
				faceGrid.stopEditing();
				Storages.objects.ifc.insert(0, row);
				faceGrid.startEditing(0, 0);
			}
		},{
			xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove',
			handler: function() {
				faceGrid.stopEditing();
				Storages.objects.ifc.each(function(record) {
					if(record.data.remove == true) {
						if(record.data.id > 0) {
							Storages.removed.ifcdel[ Storages.removed.ifcdel.length ] = record.data;
						}

						Storages.objects.ifc.remove(record);
					}
				})
		}}]
	});
} // end iFaces()


/**
 * If there was action select in modules and group attribute another
 * than reload page
 * @param	string form id
 * @param	HTMLobject, selector
 */
function ifGroup( formId, el )
{
	if(typeof el != 'object') {
		try { el = document.getElementById(el) }
		catch(e) { alert( e.toString() ); return false }
	}

	attr = function(item) {
		var __attr = new Array();
		for(var i = 0, off = item.attributes.length; i < off; i++)
		{
			if(!item.attributes[i].name) continue;
			__attr[ item.attributes[i].name ] = item.attributes[i].value;
		}
		return __attr;
	}

	for(var i = 0, off = el.options.length; i < off; i++)
	{
		if(el.options[i].selected)
		{
			var attrs = attr(el.options[i]);
			try {
				if(!window.currModuleGroup) {
					window.currModuleGroup = attrs['group'];
					window.currModuleValue = el.options[i].value;
					return;
				}
				else if(attrs['group'] == '0') {
					for(var k = 0, kOff = el.options.length; k < kOff; k++) {
						if(el.options[k].value == window.currModuleValue) {
							el.options[k].selected = true;
							break;
						}
					}
					return;
				}
				else {
					if(window.currModuleGroup != attrs['group']) {
						document.getElementById(formId).submit();
						return;
					}

					if(window.currModuleValue != el.options[i].value)
						reorderBlocks(el.options[i].value);

					window.currModuleValue = el.options[i].value;
					return;
				}
			} catch(e) { alert( e.toString() )}
		}
	}
} // end ifGroup( el )


/**
 * Add to access list new entry
 * @param	function to handle on Ok press
 * 		Parameters: type of acl 0-2 (0 - Ani, 1 - tarif, 2 - union), value
 */
function aclAddNew( callback )
{
	try { var moduleType = document.getElementById('_moduleType_').value; } catch(e) { var moduleType = 1 }

	// Change field view status
	fieldStatus = function(radio, check) {
		if(!check) return; typeRadio = radio.value;
		if(radio.value == 0) { Ext.getCmp('Tarifs').disable(); Ext.getCmp('Unions').disable(); Ext.getCmp('Ani').enable(); }
		if(radio.value == 1) { Ext.getCmp('Tarifs').enable(); Ext.getCmp('Unions').disable(); Ext.getCmp('Ani').disable();}
		if(radio.value == 2) { Ext.getCmp('Tarifs').disable(); Ext.getCmp('Unions').enable(); Ext.getCmp('Ani').disable();}
	}

	// Returns value according to the selected type
	getValue = function(radio) {
		if(radio == 0) { return { value: Ext.getCmp('Ani').getValue(), rowText: '', descr: Ext.getCmp('Description').getValue() } }
		if(radio == 1) { return { value: Ext.getCmp('Tarifs').getValue(), rowText: Ext.getCmp('Tarifs').getRawValue(), descr: Ext.getCmp('Description').getValue() } }
		if(radio == 2) { return { value: Ext.getCmp('Unions').getValue(), rowText: Ext.getCmp('Unions').getRawValue(), descr: Ext.getCmp('Description').getValue() } }
	}

	if(!Storages.Tarifs) {
		Storages.Tarifs = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
			reader: new Ext.data.JsonReader({ root: 'results', id: 'TarifsStore' }, [ { name: 'id', type: 'int' }, { name: 'name', type: 'string' } ]),
			baseParams:{ async_call: 1, devision: 1, gettarifs: moduleType },
			autoLoad: true
		});
	}

	if(!Storages.Unions) {
		Storages.Unions = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
			reader: new Ext.data.JsonReader({ root: 'results', id: 'UnionsStore' }, [ { name: 'id', type: 'int' }, { name: 'name', type: 'string' } ]),
			baseParams:{ async_call: 1, devision: 1, getunions: moduleType },
			autoLoad: true
		});
	}

	var typeRadio = 0;
	var Panel = new Ext.Panel({
		layout: 'column', frame: true, width: 300, buttonAlign: 'center',
		items: [{ columnWidth: 0.10, xtype: 'form', defaults: { hideLabel: true }, items: [
			{ xtype: 'radio', style: 'margin-top:5px', id: '_blocktype', name: 'blocktype', value: 0, checked: true, listeners: { check: fieldStatus } },
			{ xtype: 'radio', style: 'margin-top:7px', name: 'blocktype', value: 1, listeners: { check: fieldStatus } },
			{ xtype: 'radio', style: 'margin-top:7px', name: 'blocktype', value: 2, listeners: { check: fieldStatus } } ]},
			{ columnWidth: 0.90, xtype: 'form', labelWidth: 75, items: [
			{ xtype: 'field', width: 160, name: 'ani', id: 'Ani', fieldLabel: 'Ani' },
			{ xtype: 'combo', width: 160, displayField: 'name', valueField: 'id', store: Storages.Tarifs, id: 'Tarifs', fieldLabel: Localize.Tarifs, mode: 'local', triggerAction: 'all', emptyText: '...', disabled: true },
			{ xtype: 'combo', width: 160, displayField: 'name', valueField: 'id', store: Storages.Unions, id: 'Unions', fieldLabel: Localize.Unions, mode: 'local', triggerAction: 'all', emptyText: '...', disabled: true },
			{ xtype: 'field', width: 160, name: 'descr', id: 'Description', fieldLabel: Localize.Description } ]} ],
		buttons: [ { xtype: 'button', text: Localize.Add, handler: function() { if(typeof callback != 'function') { return false; };  callback(typeRadio, getValue(typeRadio)); Win.close(); } }, { xtype: 'button', text: Localize.Cancel, handler: function() { Win.close() } } ]
	});

	var Win = new Ext.Window({ width: 309, modal: true, title: Localize.Add + ' ' + Localize.DenyRule, plain: true, items: Panel });
	Win.show();
}// end aclAddNew()


/**
 * Show form to cinfigure radius black list
 *
 */
function showRNASBlock( moduleId, nasId )
{
    if (!Storages.nasblock[nasId]) {
        Storages.nasblock[nasId] = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
            reader: new Ext.data.JsonReader(
                { root: 'results', id: 'ifacesList' },
                Storages.nasblockRows
            ),
            baseParams: {
                async_call: 1,
                devision: 1,
                getnasblock: nasId,
                module: moduleId
            }

        });
        Storages.nasblock[nasId].load();
    }

	if(Ext.isEmpty(nasId) || nasId <= 0) return false;
	if(Ext.getCmp('aclWindow')) { return; }
	try { var moduleId = document.getElementById('_module_').value; } catch(e) { var moduleId = 0 }

	Ext.QuickTips.init();
	var fm = Ext.form;

	renderAni = function(value, record) { switch(record.data.type) { case 1: case 2: return record.data.info; default: return value; } }
	renderType = function(value) { switch(value) { case 1: return Localize.Tarif; case 2: return Localize.Union; default: return 'ANI'; } }
	var checkRemove = new Ext.grid.CheckColumn({ header: Localize.Remove, dataIndex: 'remove', width: 65 });
	var ColModel = new Ext.grid.ColumnModel([
		{ header: 'NAS ID', dataIndex: 'nasid', width: 55  },
		{ header: Localize.Type, dataIndex: 'type', width: 85, renderer: renderType },
		{ header: Localize.Value, dataIndex: 'value', width: 142, renderer: function(value, cell, record) { return renderAni(value, record) } },
		{ header: Localize.Description, dataIndex: 'descr', width: 142 },
		checkRemove
	]);

	if(!Storages.nasblock[nasId])
	{
		Storages.nasblock[nasId] = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
			reader: new Ext.data.JsonReader({ root: 'results', id: 'ifacesList' }, Storages.nasblockRows),
			baseParams:{ async_call: 1, devision: 1, getnasblock: nasId, module: moduleId }, autoLoad: true });
	}

	var grid = new Ext.grid.GridPanel({
		store: Storages.nasblock[nasId], cm: ColModel, frame: false, plugins: checkRemove, height: 250, loadMask: true, clicksToEdit: 1,
		tbar: [{
			text: Localize.Add, iconCls: 'ext-add',
			handler: function() {
				aclAddNew(function(radio, data) {
					var row = new Storages.nasblockRows({ aniid: 0, nasid: nasId, type: radio, info: data.rowText, value: data.value, descr: data.descr, remove: false });
					Storages.nasblock[nasId].insert(0, row);
				 })
			}
		},{
			xtype: 'button', text: Localize.Remove, iconCls: 'ext-remove',
			handler: function() {
				Storages.nasblock[nasId].each(function(record) { if(record.data.remove == true) { Storages.nasblock[nasId].remove(record); } })
			}
		}]
	});

	var Win = new Ext.Window({
		id: 'aclWindow', title: Localize.AclSet, plain: true, width: 530, items: grid,
		listeners: { close: function() { grid.stopEditing(); } }
	});

	Win.show();
} // end showRNASBlock()


/**
 * Set blocks visibility accoding selected module
 * @param	integer, module selected type
 */
function reorderBlocks( value )
{
	try {
		switch(parseInt(value))
		{
			case 1:
				document.getElementById('_ETH_').style.display = '';
				document.getElementById('_NetFlowSflow_').style.display = 'none';
				document.getElementById('_UlogTee_').style.display = 'none';
				//Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-natCol'), false);
                //Storages.grids.nasseg.colModel.setHidden(Storages.grids.nasseg.colModel.getIndexById('ext-natCol'), false);

			break;

			case 2:
				document.getElementById('_ETH_').style.display = '';
				document.getElementById('_UlogTee_').style.display = '';
				document.getElementById('_NetLink_').style.display = '';
				document.getElementById('_NetFlowSflow_').style.display = 'none';
				document.getElementById('_Divert_').style.display = 'none';
				//Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-natCol'), true);
                //Storages.grids.nasseg.colModel.setHidden(Storages.grids.nasseg.colModel.getIndexById('ext-natCol'), true);
			break;

			case 3:
				document.getElementById('_ETH_').style.display = '';
				document.getElementById('_UlogTee_').style.display = '';
				document.getElementById('_Divert_').style.display = '';
				document.getElementById('_NetFlowSflow_').style.display = 'none';
				document.getElementById('_NetLink_').style.display = 'none';
				//Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-natCol'), true);
                //Storages.grids.nasseg.colModel.setHidden(Storages.grids.nasseg.colModel.getIndexById('ext-natCol'), true);
			break;

			case 4:
				document.getElementById('_LocalAS_').style.display = '';
				document.getElementById('_NetFlowSflow_').style.display = '';
				document.getElementById('_ETH_').style.display = 'none';
				document.getElementById('_UlogTee_').style.display = 'none';
				document.getElementById('_NetLink_').style.display = 'none';
				document.getElementById('_Divert_').style.display = '';
				//Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-natCol'), true);
                //Storages.grids.nasseg.colModel.setHidden(Storages.grids.nasseg.colModel.getIndexById('ext-natCol'), true);
			break;

			case 5:
				document.getElementById('_NetFlowSflow_').style.display = '';
				document.getElementById('_LocalAS_').style.display = 'none';
				document.getElementById('_ETH_').style.display = 'none';
				document.getElementById('_UlogTee_').style.display = 'none';
				document.getElementById('_NetLink_').style.display = 'none';
				document.getElementById('_Divert_').style.display = '';
				//Storages.grids.segments.colModel.setHidden(Storages.grids.segments.colModel.getIndexById('ext-natCol'), true);
                //Storages.grids.nasseg.colModel.setHidden(Storages.grids.nasseg.colModel.getIndexById('ext-natCol'), true);
			break;

			case 7:
				document.getElementById('_TelSrcBlock_').style.display = '';
				document.getElementById('_ifcdrsrc').style.display = '';
				document.getElementById('_ifrs232src').style.display = 'none';
				document.getElementById('_iffifosrc').style.display = 'none';
				document.getElementById('_RS232_').style.display = 'none';
				document.getElementById('_PABXNet_').style.display = 'none';
			break;

			case 8:
				document.getElementById('_TelSrcBlock_').style.display = '';
				document.getElementById('_ifcdrsrc').style.display = 'none';
				document.getElementById('_ifrs232src').style.display = '';
				document.getElementById('_iffifosrc').style.display = 'none';
				document.getElementById('_RS232_').style.display = '';
				document.getElementById('_PABXNet_').style.display = 'none';
			break;

			case 9:
				document.getElementById('_TelSrcBlock_').style.display = '';
				document.getElementById('_ifcdrsrc').style.display = 'none';
				document.getElementById('_ifrs232src').style.display = 'none';
				document.getElementById('_iffifosrc').style.display = '';
				document.getElementById('_RS232_').style.display = 'none';
				document.getElementById('_PABXNet_').style.display = 'none';
			break;

			case 10:
				document.getElementById('_TelSrcBlock_').style.display = 'none';
				document.getElementById('_ifcdrsrc').style.display = 'none';
				document.getElementById('_ifrs232src').style.display = 'none';
				document.getElementById('_iffifosrc').style.display = 'none';
				document.getElementById('_RS232_').style.display = 'none';
				document.getElementById('_PABXNet_').style.display = '';
				document.getElementById('_PABXCliIP').style.display = '';
				document.getElementById('_PABXCliPort').style.display = '';
				document.getElementById('_PABXSerIP').style.display = 'none';
				document.getElementById('_PABXSerPort').style.display = 'none';
			break;

			case 11:
				document.getElementById('_TelSrcBlock_').style.display = 'none';
				document.getElementById('_ifcdrsrc').style.display = 'none';
				document.getElementById('_ifrs232src').style.display = 'none';
				document.getElementById('_iffifosrc').style.display = 'none';
				document.getElementById('_RS232_').style.display = 'none';
				document.getElementById('_PABXNet_').style.display = '';
				document.getElementById('_PABXCliIP').style.display = 'none';
				document.getElementById('_PABXCliPort').style.display = 'none';
				document.getElementById('_PABXSerIP').style.display = '';
				document.getElementById('_PABXSerPort').style.display = '';
			break;
		}
	} catch(e) { alert( e.toString() )}
} // end reorderBlocks()


/**
 * This function need obly to display frendly keepdetails
 *
 */
function keepDtField(element, ifFocus) {
	if(!element) return;
	if(isNaN(element.value) || element.value == "") element.value = 0;
	if(ifFocus == 1) { if(element.value == 0){ element.value = Localize.always; } }
} // end keepDtField()


/**
 * Change fields state for the DHCP configuration fieldset
 * 
 */
function DHCPFields( field )
{
    Ext.each(Ext.get(Ext.get(field).findParentNode('table')).query('input'), function(item) {
        if(item.name == 'dhcpd_port' || item.name == 'dhcpd_ip') {
            return;
        }
        Ext.get(Ext.get(item).findParentNode('tr')).setVisibilityMode(Ext.Element.DISPLAY)[Ext.isEmpty(this.value) || this.value == 0 ? 'hide' : 'show']();
    }, {
        value: field.value
    });
} // end DHCPFields()


function changeVar(el) {
	if(el.value > 0) el.value = 0; 
	else el.value = 1;
}







/****************************** LBPhone ********************************/


function changeForm(combo) {
	var form = combo.findParentByType('form');
	//enable RS232 fields
	form.get(0).get('rs232')[(combo.getValue() == 1) ? 'enable' : 'disable']();
	form.get(0).get('rs232')[(combo.getValue() == 1) ? 'show' : 'hide']();

	form.get(0).get('tcpip')[(combo.getValue() > 2) ? 'enable' : 'disable']();
	form.get(0).get('tcpip')[(combo.getValue() > 2) ? 'show' : 'hide']();

	// enable TCP/IP server or client
	Ext.get(form.get(0).get('tcpip').get(0).getEl().up('div.x-form-item').query('label[for='+form.get(0).get('tcpip').get(0).id+']')[0]).update( 
		(combo.getValue() == 4) ? Ext.app.Localize.get('Listen IP') : Ext.app.Localize.get('Station IP')
	);
	Ext.get( form.get(0).get('tcpip').get(1).getEl().up('div.x-form-item').query('label[for='+ form.get(0).get('tcpip').get(1).id+']')[0]).update(
		(combo.getValue() == 4) ? Ext.app.Localize.get('Listen port') : Ext.app.Localize.get('Station port')
	);
	
	// FIFO
	form.get(0).get('stream')[(combo.getValue() == 2) ? 'enable' : 'disable']();
	form.get(0).get('stream')[(combo.getValue() == 2) ? 'show' : 'hide']();
	
	// PCDR
	form.get(0).get('telsrc')[(combo.getValue() == 0) ? 'enable' : 'disable']();
	form.get(0).get('telsrc')[(combo.getValue() == 0) ? 'show' : 'hide']();
}



function LBPhone( renderTo )
{
	if(document.getElementById('_moduleType_').value != '7') {
		return false;
	}		

	var EButton = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Edit'), menuDisabled: true, width: 22, iconCls: 'ext-edit' });
	var DButton = new Ext.grid.RowButton({ header: '&nbsp;', qtip: Ext.app.Localize.get('Remove'), menuDisabled: true, width: 22, iconCls: 'ext-drop' });

	EButton.on('action', function(grid, record, rowIndex) {
		
		var form = grid.findParentByType('panel').get(1).get(0).getForm();
		
		var data = record.data;
							
		if(data.type == 0) {
			data.pcdrSaveDir = data.savedir;
			data.cdrdir = data.source;
		} 
		if(data.type == 1) {
			data.RSSaveDir = data.savedir;
			source = data.source.split(',');
			
			data.deviceport = source[0];
			data.speed = source[1];
			data.parity = source[2];
			data.databits = source[3];
			data.stopbits = source[4];
		}
		if(data.type == 2) {
			data.fifoSaveDir = data.savedir;
			data.streamfile = data.source;
		}
		if(data.type > 2) {
			source = data.source.split(':');
			data.ip = source[0];
			data.port = source[1];
			data.tcpSaveDir = data.savedir;
		}

		
		//prepair data					

		form.setValues(data);
		changeForm(form.findField('type'));
		grid.findParentByType('panel').get(1).get(0).get(0).setTitle(Ext.app.Localize.get('Edit')+ ' ' +Ext.app.Localize.get('Parser'))
	});

	DButton.on('action', function(grid, record, rowIndex) {
		
		Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Are you sure you want to delete this entry') + '?', function(B) {
			if (B != 'yes') {
				return;
			}
			/*if(record.get('recordid') == 0) {
				grid.getStore().remove(record);
				return;
			}*/
			
			Ext.Ajax.request({
				url: 'config.php',
				timeout: 380000,
				method: 'POST',
				params: {
					async_call: 1,
					devision: 1,
					delparser: record.get('recordid')
				},
				scope: this,
				callback: function(options, success, resp) {
					try {
						if(!success) { throw(resp); }
						var data = Ext.util.JSON.decode(resp.responseText);
						grid.findParentByType('panel').get(1).get(0).getForm().reset();
						grid.getStore().removeAll();
						grid.getStore().load();
					}
					catch(e) { 
						Ext.Msg.error(Ext.app.Localize.get(e)); 
					}
				}
			});

		});
	});
	
	
	var LBPhonePanel = new Ext.Panel({
	    frame: false,
		hidden: (document.getElementById('_module_').value > 0) ? false : true,
	    bodyStyle: 'padding: 0px;',
	    title: Ext.app.Localize.get('LBPhone settings'),
	    border: false,
	    layout: 'column',
	    height: 452,
	    width: 960,
	    renderTo: renderTo,
		tbar: [{
			xtype: 'button',
			iconCls: 'ext-add',
			text: Ext.app.Localize.get('Add'),
			handler: function(Btn) {
				var store = Btn.findParentByType('panel').get(0).getStore(),
					form = Btn.findParentByType('panel').get(1).get(0).getForm();

				Btn.findParentByType('panel').get(0).getView().refresh();
				
				Btn.findParentByType('panel').get(1).get(0).get(0).setTitle(Ext.app.Localize.get('Add')+ ' ' +Ext.app.Localize.get('Parser'))
				
				form.reset();
				form.findField('type').setValue(null);
				changeForm(form.findField('type'));
			}
		}], 
		listeners: {
			afterrender: function(panel) {
				var agentid = document.getElementById('_module_').value,
					parserForm = panel.get(1).get(0).getForm();
				parserForm.reset();
				parserForm.findField('agentid').setValue(agentid);
			}
		},
		items: [{
			xtype: 'grid',
			border: false,
			columnWidth: 0.35,
			height: 400,
			columns: [
				EButton,
				{
					header: Ext.app.Localize.get('Name'),
					width: 278,
					menuDisabled: true,
					dataIndex: 'name'
				}, 
				DButton
			],
			store: {
				xtype: 'jsonstore',
				method: 'POST',
				autoLoad: true,
				root: 'results',
				fields: ['recordid', 'agentid', 'pabxid', 'name', 'savedir', 'type', 'source'],
				baseParams: {
					async_call: 1,
					devision: 1,
					getparsers: document.getElementById('_module_').value
				}
			},
			plugins: [ EButton, DButton ],
		}, {

		xtype: 'panel',
		border: false,
		layout: 'anchor',
		columnWidth: 0.65,
		items: [{
		
			xtype: 'form',
			height: 400,
			frame: true,
			padding: 10,
			layout: 'form',
			items: [{
				xtype: 'fieldset',
				title: Ext.app.Localize.get('Parser'),
				border: true,
				style: 'padding:14px',
				items: [{
					xtype: 'hidden',
					name: 'async_call',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'devision',
					value: 1
				}, {
					xtype: 'hidden',
					name: 'setparser',
					value: 0
				}, {
					xtype: 'hidden',
					name: 'recordid',
					value: 0
				}, {
					xtype: 'hidden',
					name: 'agentid',
					value: document.getElementById('_module_').value
				},{
					xtype: 'textfield',
					fieldLabel: Ext.app.Localize.get('Name'),
					name: 'name',
					allowBlank: false,
					width: 200
				}, {
					xtype: 'combo',
					width: 200,
					hiddenName: 'pabxid',
					fieldLabel: Ext.app.Localize.get('CDR format'),
					allowBlank: false,
					editable: false,
					valueField: 'pbxid',
					displayField: 'descr',
					mode: 'local',
					triggerAction: 'all',
					store: {
						xtype: 'jsonstore',
						method: 'POST',
						autoLoad: true,
						root: 'results',
						fields: ['pbxid', 'name', 'descr'],
						baseParams: {
							async_call: 1,
							devision: 1,
							getformats: 1
						}
					}
				}, 
				{
					xtype: 'combo',
					width: 200,
					name: 'type',
					fieldLabel: Ext.app.Localize.get('Type'),
					valueField: 'id',
					editable: false,
					allowBlank: false,
					displayField: 'name',
					mode: 'local',
					triggerAction: 'all',
					hiddenName: 'type',
					value: null,
					store: {
						xtype: 'arraystore',
						fields: ['id', 'name'],
						data: [
							[0, 'PCDR'],
							[1, '[PABX] RS-232'],
							[2, '[PABX] FIFO'],
							[3, '[PABX] TCP/IP client'],
							[4, '[PABX] TCP/IP server']				
						]
					},
					listeners: {
						show: function(combo) {
							combo.setValue(0);
						},
						change: function(combo) { // Событие change добавлено для того, чтобы отображать доп. форму если параметр комбы явно не указывался...
							changeForm(combo); 
						},
						select: function(combo) {
							changeForm(combo);
						}
					}
				},
				/***************** PCDR **********************/
				{
					xtype: 'fieldset',
					border: false,
					hidden: true,
					disabled: true,
					itemId: 'telsrc',
					items:[{
						xtype: 'textfield',
						name: 'pcdrSaveDir',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Save to')
					}, {
						xtype: 'textfield',
						name: 'cdrdir',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Path to CDR')
					}]
				},
			/***************** FIFO **********************/
				{
					xtype: 'fieldset',
					border: false,
					hidden: true,
					disabled: true,
					itemId: 'stream',
					items:[{
						xtype: 'textfield',
						name: 'fifoSaveDir',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Save to')
					}, {
						xtype: 'textfield',
						name: 'streamfile',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Stream file')
					}]
				},
			/*********** TCP server/client **************/
				{
					xtype: 'fieldset',
					border: false,
					hidden: true,
					disabled: true,
					itemId: 'tcpip',
					items:[{
						xtype: 'textfield',
						width: 190,
						name: 'ip'
					}, {
						xtype: 'textfield',
						width: 190,
						name: 'port'
					}, {
						xtype: 'textfield',
						name: 'tcpSaveDir',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Save to')
					}]
				},
			
				/*********** RS-232 ***********/
				{
					xtype: 'fieldset',
					border: false,
					hidden: true,
					disabled: true,
					itemId: 'rs232',
					items:[{
						xtype: 'textfield',
						name: 'RSSaveDir',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Save to')
					}, {
						xtype: 'textfield',
						name: 'deviceport',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Device port')
					}, {
						xtype: 'combo',
						width: 190,
						hiddenName: 'speed',
						fieldLabel: Ext.app.Localize.get('Speed'),
						valueField: 'id',
						displayField: 'name',
						mode: 'local',
						editable: false,
						triggerAction: 'all',
						value: 1200,
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name'],
							data: [
								[1200, '1200'],
								[2400, '2400'],
								[4800, '4800'],
								[9600, '9600'],
								[19200, '19200'],
								[38400, '38400'],
								[57600, '57600'],
								[115200, '115200']
							]
						}
					}, {
						xtype: 'combo',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Parity'),
						hiddenName: 'parity',
						valueField: 'id',
						displayField: 'name',
						mode: 'local',
						editable: false,
						value: 0,
						triggerAction: 'all',
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name'],
							data: [
								[0, 'no parity'],
								[1, 'odd parity'],
								[2, 'even parity']
							]
						}
					}, {
						xtype: 'combo',
						width: 190,
						fieldLabel: Ext.app.Localize.get('Data bits'),
						hiddenName: 'databits',
						valueField: 'id',
						displayField: 'name',
						mode: 'local',
						editable: false,
						triggerAction: 'all',
						value: 5,
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name'],
							data: [
								[5, '5'],
								[6, '6'],
								[7, '7'],
								[8, '8']
							]
						}
					}, {
						xtype: 'combo',
						width: 190,
						hiddenName: 'stopbits',
						fieldLabel: Ext.app.Localize.get('Stop bits'),
						valueField: 'id',
						displayField: 'name',
						mode: 'local',
						editable: false,
						triggerAction: 'all',
						value: 1,
						store: {
							xtype: 'arraystore',
							fields: ['id', 'name'],
							data: [
								[1, '1'],
								[2, '2']
							]
						}
					}]
				}, {
					xtype: 'button',
					style: 'margin: 10px 0 0 105px;',
					text: Ext.app.Localize.get('Save'),
					handler: function(Btn) {
						var form = Btn.findParentByType('form').getForm();

						if(form.findField('name').getValue() == '' || form.findField('pabxid').getValue() == '') {
							Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Please fill all important fields'));
							return;
						}
						var data = form.getValues();
						
						Ext.Ajax.request({
							url: 'config.php',
							timeout: 380000,
							method: 'POST',
							params: data,
							scope: this,
							callback: function(options, success, resp) {
								try {
									if(!success) { throw(resp); }
									var data = Ext.util.JSON.decode(resp.responseText),
										grid = Btn.findParentByType('panel').ownerCt.get(0);
										
									grid.getStore().reload();
									grid.findParentByType('panel').get(1).get(0).getForm().reset();
								}
								catch(e) { 
									Ext.Msg.error(Ext.app.Localize.get(e)); 
								}
							}
						});
					
						
					}
				}]
			}] // end form
			
			}] // end column's panel
		}]
	});
	
}

function changeDtvType(formId, el) {
	document.getElementById(formId).submit();
}
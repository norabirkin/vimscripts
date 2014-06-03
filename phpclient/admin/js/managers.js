/**
 * JavaScript engine for the billing managers
 * with supporting manager templates
 *
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Show managers list
	managersList('menPanelPlace');
});

Ext.override(Ext.data.Connection, {
	timeout: 200000
});

function compactForm(items, object) {
    if (Ext.isEmpty(items)) { return false; };
    items.push({ xtype: 'hidden', name: 'devision', value: 13 });
    items.push({ xtype: 'hidden', name: 'async_call', value: 1 });
    var form = new Ext.form.FormPanel({ id: 'compactForm', renderTo: Ext.getBody(), url: 'config.php', items: items });
    form.getForm().submit({
        method: 'POST',
        waitTitle: Localize.Connecting,
        waitMsg: Localize.SendingData + '...',
        success: function(form, action) {
            if (!Ext.isEmpty(object)) {
                try {
                    object.success(action);
                } catch (e) {}
            };
            form.destroy();
        },
        failure: function(form, action) {
            if (action.failureType == 'server') {
                obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert('Error!', obj.errors.reason);
            }
            form.destroy();
        }
    });
    return true;
}

function managersList(renderTo) {

	if (!Ext.isEmpty(Ext.getCmp('managers'))) {
		Ext.getCmp('managers').show();
		Ext.getCmp('managers').store.reload();
		return;
	}

	var Remove = new Ext.grid.RowButton({
		header: '&nbsp;',
        qtip: function(record,x,c){
            if (record.data.istemplate)
                return Ext.app.Localize.get('Delete group');
            else
                return Ext.app.Localize.get('Remove manager');
        },

		width: 22,
		iconCls: 'ext-drop'
	});

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: function(record,x,c){
            if (record.data.istemplate)
                return Ext.app.Localize.get('View group');
            else
                return Ext.app.Localize.get('Edit manager');
        },
        dataIndex: 'recordid',
        width: 22,
        iconCls: function(record,x,c){
            if (record.data.istemplate == 0 )
                return 'ext-edit';
            else return 'ext-table';
        }
    });

	var createManButton = new Ext.Button({
		id: 'createManButton',
		text: Ext.app.Localize.get('Add manager'),
		iconCls: 'ext-add',
		personid: null,
		handler: function(){
			var g = Ext.getCmp('managers');
            g.hide();
            managerForm(g.initialConfig.renderTo, -1, false, this.personid);
        }
	});
	var createGroupButton = new Ext.Button({
		id: 'createGroupButton',
		text: Ext.app.Localize.get('Add group'),
		iconCls: 'ext-add',
		handler: function(){
             var g = Ext.getCmp('managers');
             g.hide();
             managerForm(g.initialConfig.renderTo, -1, true);
        }
	});

    var upLevelButton = new Ext.Button({
		id: 'upLevelButton',
		text: '',
		iconCls: 'ext-levelup',
		hidden: true,
		handler: function () {
			this.setVisible(false);
			createGroupButton.setVisible(true);
			createManButton.personid = null;
			Ext.getCmp('managers').store.reload({
				params: {
					getmanagers: 0
				}
			});
		}
	});

    Edit.on('action', function(g, r, i) {
        if (r.data.istemplate == 1){
            upLevelButton.setVisible( true );
            createGroupButton.setVisible(false);
            createManButton.personid = r.data.personid;
            Ext.getCmp('managers').store.reload({
                params: {
                    getmanagers: r.data.personid
                }
            });
        } else {
            g.hide();
            managerForm(g.initialConfig.renderTo, r.data.personid, false);
        }
    });


    var EditGroup = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: function(record) {
            if (record.data.istemplate == 1 )
                return Ext.app.Localize.get('Edit group');
            else
                return '';
        },
        width: 22,
        iconCls: function(record,x,c){
            if (record.data.istemplate == 1 )
                return 'ext-edit';
            else return '';
        }
    });

    EditGroup.on('action', function(g, r, i) {
        if (r.data.istemplate == 1){
            g.hide();
            managerForm(g.initialConfig.renderTo, r.data.personid, true);
        }else{
            return '';
        }
    });


	new Ext.grid.GridPanel({
		title: Localize.Managers,
		renderTo: renderTo,
		id: 'managers',
		width: 960,
		height: 600,
        enableHdMenu: false,
        disableSelection: true,
		tbar: [
			createManButton,
			createGroupButton,
            '->',
			upLevelButton
        ],
		cm: new Ext.grid.ColumnModel({
            columns: [
                Edit,
                { header: 'ID', dataIndex: 'personid', width: 30 },
                { header: Ext.app.Localize.get('Login'), dataIndex: 'login', width: 180 },
                { header: Localize.PersonFullName, dataIndex: 'name', width: 320 },
                { header: Ext.app.Localize.get('Description'), dataIndex: 'descr', id: 'descr' },
                EditGroup,
                Remove
            ],
            defaults: {
                sortable: true,
                menuDisabled: true
            }
        }),
		autoExpandColumn: 'descr',
		plugins: [Edit, Remove, EditGroup],
		loadMask: true,

        view: new Ext.grid.GridView({
            forceFit:false,
            enableRowBody:true,
            enableNoGroups: false,
            deferEmptyText: false,
            emptyText:Ext.app.Localize.get('There are no available managers') + '.',
            getRowClass: function(record, index) {
                if (record.get('istemplate') == 1)
                    return 'x-type-payment-transfer'
                else
                    return '';
            }
        }),
		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST'
			}),
			reader: new Ext.data.JsonReader(
                { root: 'results' },
                [
                    { name: 'personid', type: 'int' },
                    { name: 'login', type: 'string' },
                    { name: 'name', type: 'string' },
                    { name: 'descr', type: 'string' },

                    { name: 'istemplate', type: 'int' },
                    { name: 'parenttemplate', type: 'int' }
                ]
            ),
			autoLoad: true,
			baseParams: {
				async_call: 1,
				devision: 13,
				getmanagers: 0
			},
			sortInfo: {
				field: 'istemplate',
				direction: "DESC"
			}
		})
        //bbar: new Ext.PagingToolbar({
        //    pageSize: PAGELIMIT,
        //    store: Store,
        //    displayInfo: true,
        //    items: ['-',
        //    {
        //        xtype: 'combo',
        //        width: 70,
        //        displayField: 'id',
        //        valueField: 'id',
        //        typeAhead: true,
        //        mode: 'local',
        //        triggerAction: 'all',
        //        value: PAGELIMIT,
        //        editable: false,
        //        visible: false,
        //        store: new Ext.data.ArrayStore({
        //            data: [
        //                ['100'],
        //                ['500']
        //            ],
        //            fields: ['id']
        //        }),
        //        listeners: {
        //            select: function(){
        //                PAGELIMIT = this.getValue() * 1;
        //                this.ownerCt.pageSize = PAGELIMIT;
        //                Store.reload({ params: { limit: PAGELIMIT } });
        //            }
        //        }
        //    },
        //    '-',
        //    {
        //        xtype: 'displayfield',
        //        value: 'Испорченный',
        //        hideLabel: true,
        //        style: 'padding:3px;border:1px solid gray;',
        //        ctCls: 'x-type-payment-canceled'
        //    }
        //    ]
        //})
	});

	Remove.on('action', function(g, r, i) {
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Removing manager'),
            msg: Ext.app.Localize.get('Do you really want to remove manager?'),
            width:290,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                compactForm([{
                    xtype: 'hidden',
                    name: 'delmanager',
                    value: r.data.personid
                }], {
                    grid: g,
                    record: r,
                    success: function() {
                        this.grid.store.remove(this.record)
                    }
                });
            }
        });
	});
}


function manGroupForm(renderTo, man) {


	if (!Ext.isEmpty(Ext.getCmp('manGroups'))) {
		Ext.getCmp('managers').show();
		Ext.getCmp('managers').store.reload();
		return;
	}

	var Edit = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.Edit,
		width: 22,
		iconCls: 'ext-edit'
	});
	var Remove = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Localize.Remove,
		width: 22,
		iconCls: 'ext-drop'
	});

	new Ext.grid.GridPanel({
		title: Localize.Managers,
		renderTo: renderTo,
		id: 'manGroups',
		width: 960,
		height: 600,
		tbar: [{
			xtype: 'button',
			text: Localize.Create,
			iconCls: 'ext-add',
			handler: function() {
				var g = Ext.getCmp('manGroups');
				g.hide();
				managerForm(g.initialConfig.renderTo, -1)
			}
		}],
		cm: new Ext.grid.ColumnModel([
			Edit,
			{ header: 'ID', dataIndex: 'personid', width: 60 },
			{ header: Ext.app.Localize.get('Login'), dataIndex: 'login', width: 180 },
			{ header: Localize.PersonFullName, dataIndex: 'name', width: 320 },
			{ header: Ext.app.Localize.get('Description'), dataIndex: 'descr', id: 'descr' },
			Remove
		]),

		autoExpandColumn: 'descr',
		plugins: [Edit, Remove],
		loadMask: true,
		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST'
			}),
			reader: new Ext.data.JsonReader(
                { root: 'results' },
                [
                    { name: 'personid', type: 'int' },
                    { name: 'login', type: 'string' },
                    { name: 'name', type: 'string' },
                    { name: 'descr', type: 'string' },
                    { name: 'istemplate', type: 'int' },
                    { name: 'parenttemplate', type: 'int' }
                ]
            ),
			autoLoad: true,
			baseParams: {
				async_call: 1,
				devision: 13,
				getmanagers: 1
			},
			sortInfo: {
				field: 'personid',
				direction: "ASC"
			}
		})
	});

	Edit.on('action', function(g, r, i) {
		g.hide();
		managerForm(g.initialConfig.renderTo, r.data.personid)
	});
	Remove.on('action', function(g, r, i) {
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Removing manager'),
            msg: Ext.app.Localize.get('Do you really want to remove manager?'),
            width:260,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                compactForm([{
                    xtype: 'hidden',
                    name: 'delmanager',
                    value: r.data.personid
                }], {
                    grid: g,
                    record: r,
                    success: function() {
                        this.grid.store.remove(this.record)
                    }
                });
            }
        });
	});
}



/**
 *
 *
 */
function managerForm(renderTo, man, isGroup, parenttemplate) {
	clearItems = function() {
		var F = Ext.getCmp('manForm');
		var ro = F.find('name', 'privro[]');
		Ext.each(ro, function(A) {
			this.remove(A);
		}, F);
		var rw = F.find('name', 'privrw[]');
		Ext.each(rw, function(A) {
			this.remove(A);
		}, F);
		var gro = F.find('name', 'grpro[]');
		Ext.each(gro, function(A) {
			this.remove(A);
		}, F);
		var grw = F.find('name', 'grprw[]');
		Ext.each(grw, function(A) {
			this.remove(A);
		}, F);
		var tro = F.find('name', 'trfro[]');
		Ext.each(tro, function(A) {
			this.remove(A);
		}, F);
		var trw = F.find('name', 'trfrw[]');
		Ext.each(trw, function(A) {
			this.remove(A);
		}, F);
		F.doLayout();
	}

	prepareItems = function(F) {
		Ext.getCmp('privRO').getRootNode().eachChild(function(N) {
			if (N.hasChildNodes()) {
				N.eachChild(function(N) {
					this.insert(0, {
						xtype: 'hidden',
						name: 'privro[]',
						value: N.attributes.data
					})
				}, this);
			}
		}, F);
		Ext.getCmp('privRW').getRootNode().eachChild(function(N) {
			if (N.hasChildNodes()) {
				N.eachChild(function(N) {
					this.insert(0, {
						xtype: 'hidden',
						name: 'privrw[]',
						value: N.attributes.data
					})
				}, this);
			}
		}, F);
		Ext.getCmp('groupsRO').getRootNode().eachChild(function(N) {
			this.insert(0, {
				xtype: 'hidden',
				name: 'grpro[]',
				value: N.attributes.data
			})
		}, F);
		Ext.getCmp('groupsRW').getRootNode().eachChild(function(N) {
			this.insert(0, {
				xtype: 'hidden',
				name: 'grprw[]',
				value: N.attributes.data
			})
		}, F);
		Ext.getCmp('tarifsRO').getRootNode().eachChild(function(N) {
			if (N.hasChildNodes()) {
				N.eachChild(function(N) {
					this.insert(0, {
						xtype: 'hidden',
						name: 'trfro[]',
						value: N.attributes.data
					})
				}, this);
			}
		}, F);
		Ext.getCmp('tarifsRW').getRootNode().eachChild(function(N) {
			if (N.hasChildNodes()) {
				N.eachChild(function(N) {
					this.insert(0, {
						xtype: 'hidden',
						name: 'trfrw[]',
						value: N.attributes.data
					})
				}, this);
			}
		}, F);
		F.doLayout();
	}

	resortTree = function(e) {
		Ext.each(e.data.nodes, function(A, B, C) {
			if (A.attributes.grpchild != this.group) {
				this.root.findChild('grpnum', A.attributes.grpchild).appendChild(A);
			}
		}, {
			root: e.tree.getRootNode(),
			group: e.target.attributes.grpnum
		});
	}

	var group_combo = new Ext.form.ComboBox({
		width: 180,
		fieldLabel: Ext.app.Localize.get('Manager group'),
		tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.personid + " - " + values.fio, 32)]}</div></tpl>',
		itemSelector: 'div.x-combo-list-item',
		emptyText: Ext.app.Localize.get('Manager group') + '...',
		triggerAction:'all',
		editable:false,
		allowBlank: false,
		pid: 'parenttemplate',
		name: 'parenttemplate',
		id: 'ptplc',
		hiddenName:'parenttemplate', // parenttpl
		valueField:'personid',
		displayField:'fio',

		store: new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
			reader: new Ext.data.JsonReader( { root: 'results' }, [ { name: 'personid', type: 'integer' }, { name: 'fio', type: 'string' } ]),
			autoLoad: true,
			baseParams: { async_call: 1, devision: 13, getmanagersgroups: 1, encode: 1 },
			listeners: {
				load: function(store) {
					store.insert(0, new store.recordType({ personid: 0, fio: Ext.app.Localize.get('No group') }));
				}
			}
		}),
		scope: this,
		lastValue: 0,
		setLastValue: function(){
			this.lastValue = this.getValue()
		}
	});

	new Ext.form.FormPanel({
		renderTo: renderTo,
		id: 'manForm',
        name: 'manForm',
		url: 'config.php',
		method: 'POST',
		frame: true,
		layout: 'column',
		width: 731,
		title: (!isGroup) ? Localize.Manager : Ext.app.Localize.get('Group configuration'),
		monitorValid: true,
		listeners: {
			render: function(F) {
                parenttemplate = (parenttemplate) ? parenttemplate : 0;
				F.getForm().load({
					method: 'POST',
					url: 'config.php',
					params: {
						devision: 13,
						async_call: 1,
						getman: man,
                        parenttemplate: parenttemplate
					},
					success: function(F, A) {
                        if (!Ext.isEmpty(A.result.data)) {

                            Ext.getCmp('istpl').setValue((isGroup) ? 1 : 0);


                            if (A.result.data.saveman == 0) { // Администратор
								Ext.getCmp('useadvance').setValue(false);
								Ext.getCmp('useadvance').disable();
								Ext.getCmp('payments').setValue(false);
								Ext.getCmp('payments').disable();
                                group_combo.disable();
							} else { // Менеджер или создание нового
                                if (A.result.data.saveman != -1){ // редактирование менеджера
                                    isGroup = A.result.data.istemplate;
									if (isGroup == true) group_combo.setDisabled(true);
                                    parenttemplate = A.result.data.parenttemplate;
                                } else { // создаем нового
                                    if (isGroup == true) group_combo.disable();
                                    //createHidOrUpdate('manForm', 'parenttemplate', parenttemplate);
                                    //Ext.getCmp('ptplc').disable(); // при создании нового запрещаем менять группу
                                }
							}
						}
					}
				});
			}
		},
		tbar: [{
			xtype: 'button',
			text: Localize.Save,
			iconCls: 'ext-save',
            scope:this,
			handler: function() {
                if (group_combo.getValue() != parenttemplate){
                    Ext.MessageBox.show({
                        title: Ext.app.Localize.get('Changing group for manager'),
                        msg: Ext.app.Localize.get('Attention! You are changed group for manager. This will change all access privileges of managers to default access privileges for selected group. Are you sure to continue saving?'),
                        width:500,
                        buttons: Ext.MessageBox.OKCANCEL,
                        multiline: false,
                        fn: function( btn ){
                            if (btn == 'cancel') return;
                            var F = Ext.getCmp('manForm');
                            prepareItems(F);
                            F.getForm().submit({
                                method: 'POST',
                                waitTitle: Localize.Connecting,
                                waitMsg: Localize.SendingData + '...',
                                success: function(F, A) {
                                    clearItems();
                                    var F = Ext.getCmp('manForm');
                                    F.hide();
                                    managersList(F.initialConfig.renderTo);
                                    F.destroy();
                                },
                                failure: function(F, A) {
                                    if (A.failureType == 'server') {
                                        obj = Ext.util.JSON.decode(A.response.responseText);
                                        Ext.Msg.alert('Error!', obj.errors.reason);
                                    }
                                    clearItems();
                                }
                            })

                        }
                    });
                } else {
                    var F = Ext.getCmp('manForm');
                    prepareItems(F);
                    F.getForm().submit({
                        method: 'POST',
                        waitTitle: Localize.Connecting,
                        waitMsg: Localize.SendingData + '...',
                        success: function(F, A) {
                            clearItems();
                            var F = Ext.getCmp('manForm');
                            F.hide();
                            managersList(F.initialConfig.renderTo);
                            F.destroy();
                        },
                        failure: function(F, A) {
                            if (A.failureType == 'server') {
                                obj = Ext.util.JSON.decode(A.response.responseText);
                                Ext.Msg.alert('Error!', obj.errors.reason);
                            }
                            clearItems();
                        }
                    })

                }

			}.createDelegate(this)
		}, '-',
		{
			xtype: 'button',
			text: Localize.BackList,
			iconCls: 'ext-levelup',
			handler: function() {
				var F = Ext.getCmp('manForm');
				F.hide();
				managersList(F.initialConfig.renderTo);
				F.destroy();
			}
		}],
		items: [{
			xtype: 'container',
			autoEl: 'div',
			layout: 'column',
			items: [
            { xtype: 'hidden', name: 'devision',     value: 13 },
            { xtype: 'hidden', name: 'async_call',   value: 1  },
            { xtype: 'hidden', id: 'passchanged',    value: 0  },
            { xtype: 'hidden', id: 'saveman',        value: -1 },
            { xtype: 'hidden', id: 'istpl',     value: 0 },
            //{ xtype: 'hidden', id: 'parenttpl', value: 0 },
            {
				xtype: 'fieldset',
				border: false,
				style: 'border: none; padding: 0px',
				height: 245,
				width: 370,
				labelWidth: 163,
				items: [
                {
					xtype: 'checkbox',
					id: 'payments',
					fieldLabel: Localize.ExternalPaySystem,
					listeners: {
						check: function(A, B) {
							if (B) {
								Ext.getCmp('privPanel').hide();
								Ext.getCmp('groupPanel').hide();
								Ext.getCmp('tarifsPanel').hide();
								Ext.getCmp('useadvance').enable()
							} else {
								Ext.getCmp('privPanel').show();
								Ext.getCmp('groupPanel').show();
								Ext.getCmp('tarifsPanel').show();
								Ext.getCmp('useadvance').setValue(false);
								Ext.getCmp('useadvance').disable()
							}
						}
					}
				}, {
					xtype: 'checkbox',
					id: 'useadvance',
					fieldLabel: Localize.UseAdvance
				},
				group_combo,	// group selection combo
                {
					xtype: 'textfield',
					id: 'fio',
					width: 180,
					fieldLabel: (!isGroup) ? Localize.PersonFullName : Ext.app.Localize.get('Group name')
				}, {
					xtype: 'textfield',
					id: 'login',
					width: 180,
					fieldLabel: Localize.Login,
					allowBlank: (!isGroup) ? false : true,
					maskRe: new RegExp('[a-zA-Z0-9\_\-]')
				}, {
					xtype: 'textfield',
					id: 'pass',
					width: 180,
					inputType: 'password',
                    fieldLabel: Localize.Password,
                    maskRe: new RegExp('[a-zA-Z0-9\_\-]'),
					listeners: {
						change: function(F, N, O) {
							if (N != O) {
								F.findParentByType('form').getForm().findField('passchanged').setValue(1);
							}
						}
					}
				}, {
					xtype: 'textfield',
					id: 'cashregisterfolder',
					width: 180,
					fieldLabel: Ext.app.Localize.get('Cash Register folder')
				}, {
					xtype: 'textfield',
					id: 'externalid',
					width: 180,
					fieldLabel: Ext.app.Localize.get('Identifier in the external system')
				}]
			}, {
				xtype: 'fieldset',
				border: false,
				labelWidth: 142,
				style: 'border: none; padding: 0px',
				height: 218,
				items: [{
					xtype: 'checkbox',
					id: 'openpass',
					fieldLabel: Localize.ShowPasswords
				}, {
					xtype: 'textfield',
					id: 'email',
					width: 180,
					fieldLabel: 'Email'
				}, {
					xtype: 'textfield',
					id: 'office',
					width: 180,
					fieldLabel: Localize.Office
				}, {
					xtype: 'textarea',
					id: 'descr',
					width: 180,
					height: 38,
					fieldLabel: Localize.Description
				}, {
					xtype: 'combo',
					fieldLabel: Ext.app.Localize.get('Default class of payment'),
					id: 'pclasscombo',
					width: 180,
					displayField: 'classname',
					valueField: 'classid',
					hiddenName: 'classid',
					mode: 'local',
					value: 0,
					triggerAction: 'all',
					editable: false,
					allowBlank: true,
					tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.classname} :: {values.descr}">{[Ext.util.Format.ellipsis(values.classname, 22)]}</div></tpl>',
					store: new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({
							url: 'config.php',
							method: 'POST'
						}),
						reader: new Ext.data.JsonReader({
							root: 'results'
						}, [{
							name: 'classid',
							type: 'int'
						}, {
							name: 'classname',
							type: 'string'
						}, {
							name: 'descr',
							type: 'string'
						}]),
						autoLoad: true,
						baseParams: {
							async_call: 1,
							devision: 331,
							getpayclass: 1
						},
						sortInfo: {
							field: 'classname',
							direction: "ASC"
						},
						listeners: {
							load: function(store) {
								var classcmb = Ext.getCmp('pclasscombo');
								classcmb.setValue(!Ext.isEmpty(classcmb.getValue()) && classcmb.getValue() > 0 ? classcmb.getValue() : 0);
							}
						}
					})
				}]
			}, {
				xtype: 'container',
				id: 'privPanel',
				width: 719,
				layout: 'hbox',
				defaults: {
					bodyStyle: 'background-color:white;border:1px solid #c0c0c0'
				},
				items: [new Ext.ux.MultiSelectTreePanel({
					title: Ext.app.Localize.get('All available'),
					id: 'freePerm',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: 'Tree',
						draggable: false
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							privileges: 0,
							man: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'privDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				}), new Ext.ux.MultiSelectTreePanel({
					title: Localize.ReadOnly,
					id: 'privRO',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: 'Tree',
						draggable: false
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							privileges: 1,
							man: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'privDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				}), new Ext.ux.MultiSelectTreePanel({
					title: Localize.ReadWrite,
					id: 'privRW',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: 'Tree',
						draggable: false
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							privileges: 2,
							man: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'privDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				})]
			}, {
				xtype: 'panel',
				title: Localize.UGRead + ' / ' + Localize.UGWrite,
				width: 717,
				id: 'groupPanel',
				layout: 'hbox',
				border: true,
				style: 'margin-top: 6px;',
				defaults: {
					bodyStyle: 'background-color:white;border:1px solid #c0c0c0'
				},
				items: [{
					xtype: 'treepanel',
					title: Localize.AllAvailable,
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					selModel: new Ext.tree.DefaultSelectionModel(),
					rootVisible: true,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Free,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getfreegroups: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'groupsDD',
					ddScroll: true
				}, {
					xtype: 'treepanel',
					title: Localize.ReadOnly,
					id: 'groupsRO',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					selModel: new Ext.tree.DefaultSelectionModel(),
					rootVisible: true,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Assigned,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getrogroups: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'groupsDD',
					ddScroll: true
				}, {
					xtype: 'treepanel',
					title: Localize.ReadWrite,
					id: 'groupsRW',
					autoScroll: true,
					animate: true,
					width: 239,
					height: 280,
					containerScroll: true,
					selModel: new Ext.tree.DefaultSelectionModel(),
					rootVisible: true,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Assigned,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getrwgroups: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'groupsDD',
					ddScroll: true
				}]
			}, {
				xtype: 'panel',
				title: Localize.TariffsToRead + ' / ' + Localize.TariffsToModify,
				width: 717,
				id: 'tarifsPanel',
				layout: 'hbox',
				border: true,
				style: 'margin-top: 6px;',
				defaults: {
					bodyStyle: 'background-color:white;border:1px solid #c0c0c0'
				},
				items: [new Ext.ux.MultiSelectTreePanel({
					title: Ext.app.Localize.get('All available') + ' ' + Ext.app.Localize.get('tarifs'),
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Free,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getfreetariffs: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'tarifsDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				}), new Ext.ux.MultiSelectTreePanel({
					title: Localize.ReadOnly,
					id: 'tarifsRO',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Assigned,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getrotariffs: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'tarifsDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				}), new Ext.ux.MultiSelectTreePanel({
					title: Localize.ReadWrite,
					id: 'tarifsRW',
					autoScroll: true,
					containerScroll: true,
					animate: true,
					width: 239,
					height: 280,
					rootVisible: false,
					root: new Ext.tree.AsyncTreeNode({
						text: Localize.Assigned,
						draggable: false,
						expanded: true
					}),
					loader: new Ext.tree.TreeLoader({
						requestMethod: 'POST',
						url: 'config.php',
						baseParams: {
							async_call: 1,
							devision: 13,
							getrwtariffs: man,
                            parenttemplate: (parenttemplate) ? parenttemplate : 0
						}
					}),
					enableDD: true,
					ddGroup: 'tarifsDD',
					ddScroll: true,
					listeners: {
						nodedrop: resortTree
					}
				})]
			}]
		}]

	});
} // end managerForm()

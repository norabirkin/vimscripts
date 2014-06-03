/**
 * Controls and function to edit user informantion
 *
 * Repository information:
 * @date		$Date: 2014-03-12 16:28:51 +0400 (Ср., 12 марта 2014) $
 * @revision	$Revision: 42173 $
 */

Ext.onReady(function() {
	Ext.QuickTips.init();
	// Show Address panels
	showAddressPanels();
});


/**
 * Build and show address panels
 *
 */
function showAddressPanels() {
    for(var i = 0, off = 2; i <= off; i++) {
        if(!Ext.get('Address_' + i)) {
            return;
        }
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
    copy = function(A, B, C, D){
        if (typeof A != 'object') {
            A = [A];
        }
        Ext.each(A, function(A){
            try {
                Ext.get('Address_' + A + '-hid').set({
                    value: this.value
                });
                Ext.get('Address_' + A + '-str').set({
                    value: this.string
                });
            }
            catch (e) {
                alert(e.toString())
            }
        }, {
            value: B,
            string: C,
            panel: D
        });
        Ext.each(D, function(A){
            A.items.items[0].body.dom.innerHTML = '<p class="address-block">' + clear(this.string) + '</p>';
        }, {
            string: C
        })
    }
    var A = new Ext.Panel({
        title: (Ext.get('_uType_2_').dom.checked) ? Localize.RegisteredAddress : Localize.LegalAddress,
        applyTo: 'Address_0',
        id: 'Address_0',
        frame: false,
        height: 150,
		width: 310,
        bodyStyle: 'padding: 6px',
        tbar: [{
            text: Localize.Add + ' / ' + Localize.Change,
            iconCls: 'ext-accept',
            handler: function(){
                address(apply, {
                    code: Ext.get('Address_0-hid').dom.value,
                    string: Ext.get('Address_0-str').dom.value
                }, A);
            }
        }, '-', {
            text: Localize.Copy + ' ' + Localize.address + ' ' + Localize.to,
            menu: [{
                text: Localize.PostAddress,
                handler: function(){
                    copy(1, Ext.get('Address_0-hid').getValue(), Ext.get('Address_0-str').getValue(), [B]);
                }
            }, {
                text: Localize.AddressDeliverInvoice,
                handler: function(){
                    copy(2, Ext.get('Address_0-hid').getValue(), Ext.get('Address_0-str').getValue(), [C]);
                }
            }, {
                text: Localize.ForAll,
                handler: function(){
                    copy([1, 2], Ext.get('Address_0-hid').getValue(), Ext.get('Address_0-str').getValue(), [B, C]);
                }
            }]
        }],
        items: [{
            frame: false,
            border: false,
            html: '<p class="address-block">' + clear(Ext.get('Address_0-str').dom.value) + '</p>'
        }]
    });
    var B = new Ext.Panel({
        title: Localize.PostAddress,
        applyTo: 'Address_1',
        id: 'Address_1',
        frame: false,
        height: 150,
        width: 310,
        bodyStyle: 'padding: 6px',
        tbar: [{
            text: Localize.Add + ' / ' + Localize.Change,
            iconCls: 'ext-accept',
            handler: function(){
                address(apply, {
                    code: Ext.get('Address_1-hid').dom.value,
                    string: Ext.get('Address_1-str').dom.value
                }, B);
            }
        }, '-', {
            text: Localize.Copy + ' ' + Localize.address + ' ' + Localize.to,
            menu: [{
                text: (Ext.get('_uType_2_').dom.checked) ? Localize.RegisteredAddress : Localize.LegalAddress,
                handler: function(){
                    copy(0, Ext.get('Address_1-hid').getValue(), Ext.get('Address_1-str').getValue(), [A]);
                }
            }, {
                text: Localize.AddressDeliverInvoice,
                handler: function(){
                    copy(2, Ext.get('Address_1-hid').getValue(), Ext.get('Address_1-str').getValue(), [C]);
                }
            }, {
                text: Localize.ForAll,
                handler: function(){
                    copy([0, 2], Ext.get('Address_1-hid').getValue(), Ext.get('Address_1-str').getValue(), [A, C]);
                }
            }]
        }],
        items: [{
            frame: false,
            border: false,
            html: '<p class="address-block">' + clear(Ext.get('Address_1-str').dom.value) + '</p>'
        }]
    });
    var C = new Ext.Panel({
        title: Localize.AddressDeliverInvoice,
        applyTo: 'Address_2',
        id: 'Address_2',
        frame: false,
        height: 150,
        width: 310,
        bodyStyle: 'padding: 6px',
        tbar: [{
            text: Localize.Add + ' / ' + Localize.Change,
            iconCls: 'ext-accept',
            handler: function(){
                address(apply, {
                    code: Ext.get('Address_2-hid').dom.value,
                    string: Ext.get('Address_2-str').dom.value
                }, C);
            }
        }, '-', {
            text: Localize.Copy + ' ' + Localize.address + ' ' + Localize.to,
            menu: [{
                text: (Ext.get('_uType_2_').dom.checked) ? Localize.RegisteredAddress : Localize.LegalAddress,
                handler: function(){
                    copy(0, Ext.get('Address_2-hid').getValue(), Ext.get('Address_2-str').getValue(), [A]);
                }
            }, {
                text: Localize.PostAddress,
                handler: function(){
                    copy(1, Ext.get('Address_2-hid').getValue(), Ext.get('Address_2-str').getValue(), [B]);
                }
            }, {
                text: Localize.ForAll,
                handler: function(){
                    copy([0, 1], Ext.get('Address_2-hid').getValue(), Ext.get('Address_2-str').getValue(), [A, B]);
                }
            }]
        }],
        items: [{
            frame: false,
            border: false,
            html: '<p class="address-block">' + clear(Ext.get('Address_2-str').dom.value) + '</p>'
        }]
    });
} // end showAddressPanels()


/**
 * Add or remove selt value to operator's list in new agreements
 * @param	object, DOM element
 */
function modifyOperListNewAgrm(o)
{
	var A = document.getElementsByTagName('select');
	Ext.each(A, function(el){
		if(this.idTpl.test(el.id)) {
			if(this.list.value == 1) {
				el.insertBefore(new Option(Localize.Default, this.operid), el.options[0]);
				el.options[0].setAttribute('onlyOper', 1);
				el.options[0].selected = true;
			}
			else {
				Ext.each(el.options, function(op, idx){
					for(var i = 0, off = op.attributes.length; i < off; i++) {
						if(typeof op.attributes[i] == 'function') {
							continue;
						}

						if(op.attributes[i].nodeName == 'onlyoper') {
							this.options[idx] = null;
							return false;
						}
					}
				}, el)
			}
		}
	}, { idTpl: new RegExp('new_agrms_oper_'), list: o, operid: Ext.get('_uid_').getValue() })
} // end modifyOperListNewAgrm()


/**
 * Check user access attribute when save user
 * @param	integer, mode to check
 * @param	object, form
 * @param	integer, string length to check
 */
function checkUserAttributes(mode, form)
{
	if(typeof form != 'object') {
		Ext.Msg.alert(Localize.Error, 'Cannot identify DOMHTMLForm Object!');
		return false;
	}
	
	if(form.login.value.length == 0){
		Ext.Msg.alert(Localize.Error, Localize.LoginError);
		return false;
	}
	
	var LA = nodeAttributes(form.login);
	if(form.pass.value.length == 0){
		Ext.Msg.alert(Localize.Error, Localize.PassError + ': (' + LA.tpl + ')');
		return false;
	}

	if(LA.tpl.length > 0) {
		var R = new RegExp(LA.tpl);
		if(!R.test(form.pass.value)) {
			Ext.Msg.alert(Localize.Error, Localize.PassError + ': (' + LA.tpl + ')');
			return false;
		}
	}

	if(mode == 1 || (mode == 0 && form.pass_chg.value == 1))
	{
		var R = /^[\d,\w,-]+[\d,\w,-]+[\d,\w,-]$/;
		if(!R.test(form.pass.value)) {
			Ext.Msg.alert(Localize.Error, Localize.PassError);
			return false;
		}
	}

	//#4913
	// Check format of mobile phone number
	// First of all you should set it up in Options -> Common 
	if(form.mobileformat.value != '')
	{
		var R = RegExp(form.mobileformat.value);
		if(form.mobile.value.length && !R.test(form.mobile.value)) {
			Ext.Msg.alert(Localize.Error, Ext.app.Localize.get('Wrong mobile format') + form.mobileformat.value);
			return false;
		}
	}

	return true;
} // end checkUserAttributes()


/**
 * Create prepay document for user
 *
 */
function createInvoice(A){

    if (Ext.isEmpty(A)) {
        return false;
    };
    var B = new Ext.form.FormPanel({
        id: 'compactForm',
        renderTo: Ext.getBody(),
        url: 'config.php',
        items: [{
            xtype: 'hidden',
            name: 'devision',
            value: 22
        }, {
            xtype: 'hidden',
            name: 'async_call',
            value: 1
        }, {
            xtype: 'hidden',
            name: 'getinvoice',
            value: 1
        }, {
            xtype: 'hidden',
            name: 'userid',
            value: A.uid
        }, {
            xtype: 'hidden',
            name: 'agrmid',
            value: A.agrmid
        }, {
            xtype: 'hidden',
            name: 'docid',
            value: A.docid
        }, {
            xtype: 'hidden',
            name: 'orsum',
            value: A.sum
        }]
    });
    B.getForm().submit({
        method: 'POST',
		timeout: 380000,
        waitTitle: Localize.Connecting,
        waitMsg: Localize.SendingData + '...',
        success: function(form, action){
            var A = Ext.util.JSON.decode(action.response.responseText);
            Download({
                devision: 22,
                getinvoice: A.fileid
            });
            form.destroy();
        },
        failure: function(form, action){
            if (action.failureType == 'server') {
                obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert(Localize.Error, obj.errors.reason);
            }
            form.destroy();
        }
    });
}


/**
 * Create document for user
 *
 */
function createDocument(A){

    if (Ext.isEmpty(A)) {
        return false;
    };
	if((A.docid * 1) <= 0){
		return false;
	}
    var B = new Ext.form.FormPanel({
        id: 'compactForm',
        renderTo: Ext.getBody(),
        url: 'config.php',
        items: [{
            xtype: 'hidden',
            name: 'devision',
            value: 22
        }, {
            xtype: 'hidden',
            name: 'async_call',
            value: 1
        }, {
            xtype: 'hidden',
            name: 'getinvoice',
            value: 1
        }, {
            xtype: 'hidden',
            name: 'getExt',
            value: 1
        }, {
            xtype: 'hidden',
            name: 'userid',
            value: A.uid
        }, {
            xtype: 'hidden',
            name: 'agrmid',
            value: A.agrmid
        },{
            xtype: 'hidden',
            name: 'vgid',
            value: A.vgid
        }, {
            xtype: 'hidden',
            name: 'docid',
            value: A.docid
        }, {
            xtype: 'hidden',
            name: 'templatedate',
            value: A.templatedate
        },{
            xtype: 'hidden',
            name: 'templatedatetill',
            value: A.templatedatetill
        }, {
            xtype: 'hidden',
            name: 'vgroups',
            value: A.vgroups
        }]
    });
    B.getForm().submit({
        method: 'POST',
		timeout: 380000,
        waitTitle: Ext.app.Localize.get('Connecting'),
        waitMsg: Ext.app.Localize.get('Sending data') + '...',
        success: function(form, action){
            var A = Ext.util.JSON.decode(action.response.responseText);
            Download({
                devision: 22,
                getinvoice: A.fileid,
				getExt: 1
            });
            form.destroy();
        },
        failure: function(form, action){
            if (action.failureType == 'server') {
                obj = Ext.util.JSON.decode(action.response.responseText);
                Ext.Msg.alert(Ext.app.Localize.get('Error'), obj.errors.reason);
            }
            form.destroy();
        }
    });
}


/**
 * User's accounts managment panel
 */
function vgroupPanel(agrmid, button)
{
	if(!Ext.isDefined(agrmid) && !Ext.isObject(button)) {
		return false;
	}
	else {
		var el  = Ext.get('_User');
		if (!el) {
			var USECERBER = false;
		}
		else {
			if(nodeAttributes(el.dom)['usecerber'] == 1) {
				var USECERBER = true;
			}
			else {
				var USECERBER = false;
			}
		}
	}

	var TEMPLATE = 0;
	if((TEMPLATE = Ext.get('_templ_'))) {
		TEMPLATE = (TEMPLATE.getValue() == 2) ? 2 : 0
	}

	var PAGELIMIT = 100;

	// If state true - expaned, else collapsed
	button.vState = function(state) {
		var state = state || this.HtmlAttr.visible;
		if(state) {
			this.dom.firstChild.src = 'images/minus.gif'
		}
		else {
			this.dom.firstChild.src = 'images/plus.gif'
		}
	}

	button.HtmlAttr =  nodeAttributes(button.dom);
	button.vPanel = Ext.get(button.HtmlAttr.vchild + agrmid);
	button.vPanel.setVisibilityMode(Ext.Element.DISPLAY);
	if(!Ext.isDefined(button.HtmlAttr.visible)) {
		if(button.vPanel.getStyle('display') != 'none') {
			button.HtmlAttr['visible'] = true;
		}
		else {
			button.HtmlAttr['visible'] = false;
		}
		button.vState();
	}

	button.HtmlAttr.visible = button.HtmlAttr.visible ? false : true;
	button.vPanel.setVisible(button.HtmlAttr.visible);
	button.vState(button.HtmlAttr.visible);

	if (button.HtmlAttr.visible && button.vPanel.dom.childNodes.length == 0) {

		var Store = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: 'config.php',
				method: 'POST',
				timeout: 380000
			}),
			reader: new Ext.data.JsonReader({
				root: 'results',
				totalProperty: 'total'
			}, [{
				name: 'vgid',
				type: 'int'
			}, {
				name: 'username',
				type: 'string'
			}, {
				name: 'userid',
				type: 'int'
			}, {
				name: 'agrmid',
				type: 'int'
			}, {
				name: 'balance',
				type: 'float'
			}, {
				name: 'agrmnum',
				type: 'string'
			}, {
				name: 'symbol',
				type: 'string'
			}, {
				name: 'descr',
				type: 'string'
			}, {
				name: 'login',
				type: 'string'
			}, {
				name: 'blkreq',
				type: 'int'
			}, {
				name: 'blocked',
				type: 'int'
			}, {
				name: 'blockdate',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'accondate',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'accoffdate',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'canmodify',
				type: 'int'
			}, {
				name: 'agenttype',
				type: 'int'
			}, {
				name: 'agentdescr',
				type: 'string'
			}, {
				name: 'tarifdescr',
				type: 'string'
			}, {
				name: 'ccrypt',
				type: 'int'
			}, {
				name: 'creationdate',
				type: 'date',
				dateFormat: 'Y-m-d H:i:s'
			}, {
				name: 'ppdebt',
				type: 'float'
			}]),
			baseParams: {
				async_call: 1,
				devision: 7,
				getvgroups: 0,
				searchtype: 0,
				blocked: 0,
				tarid: 0,
				agrmid: agrmid || -1,
				istemplate: TEMPLATE,
				start: 0,
				limit: PAGELIMIT
			},
			remoteSort: true,
			sortInfo: {
				field: 'login',
				direction: "ASC"
			},
			autoLoad: true
		});

		var EButton = new Ext.grid.RowButton({
			header: '&nbsp;',
			tplModel: true,
			qtip: Ext.app.Localize.get('Edit account'),
			width: 22,
			dataIndex: 'vgid',
			menuDisabled: true,
			iconCls: 'ext-edit'
		});

		var HButton = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: function(record){
				return Ext.app.Localize.get('Rent charges') + ' / ' + Ext.app.Localize.get('Balance history') + ((record.data.agenttype == 13) ? ' / ' + Ext.app.Localize.get('Services history') : '')
			},
			width: 22,
			dataIndex: 'vgid',
			menuDisabled: true,
			iconCls: function(record){
				return 'ext-charts'
			}
		});

		var SelectionModel = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		new Ext.grid.GridPanel({
			renderTo: button.vPanel.id,
			width: (button.vPanel.dom.offsetWidth - 6),
			height: 210,
			tbar: [Ext.app.Localize.get('Module') + ':&nbsp;', {
				xtype: 'combo',
				width: 200,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				store: new Ext.data.Store({
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
						name: 'descr',
						type: 'string'
					}]),
					baseParams: {
			            async_call: 1,
			            devision: 7,
			            getmodules: 1
					},
					sortInfo: {
						field: 'id',
						direction: "ASC"
					},
					autoLoad: true,
					listeners: {
						load: function(store){
							store.each(function(record){
								record.data.name = Ext.util.Format.ellipsis(record.data.name, 30);
							});
						}
					}
				}),
				listeners: {
					select: function() {
						this.ownerCt.ownerCt.store.baseParams.getvgroups = this.getValue();
						this.ownerCt.ownerCt.store.reload({ params: { start: 0, limit: PAGELIMIT }});
					}
				}
			}, '-', Ext.app.Localize.get('Status') + ':&nbsp;', {
				xtype: 'combo',
				id: 'statecombo',
				width: 175,
				displayField: 'name',
				valueField: 'id',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				value: 0,
				editable: false,
				store: new Ext.data.SimpleStore({
					data: [
						['0', Ext.app.Localize.get('All')],
						['1', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance')],
						['2', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client')],
						['3', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager')],
						['5', Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic')]
					],
					fields: ['id', 'name']
				}),
				listeners: {
					select: function(combo){
						this.ownerCt.ownerCt.store.baseParams.blocked = combo.getValue();
						this.ownerCt.ownerCt.store.reload({ params: { start: 0, limit: PAGELIMIT } })
					}
				}
			}, '&nbsp;', {
				xtype: 'button',
				id: 'lockbutton',
				text: Ext.app.Localize.get('Locks'),
				tooltip: Ext.app.Localize.get('Lock management'),
				form: new Ext.form.FormPanel({
					frame: false,
					url: 'config.php',
					items: [{
						xtype: 'hidden',
						name: 'async_call',
						value: 1
					}, {
						xtype: 'hidden',
						name: 'devision',
						value: 7
					}],
					renderTo: Ext.getBody(),
					clearLocks: function() {
						var items = this.findByType('hidden');
						if(items.length > 0) {
							Ext.each(items, function(item){
								if (this.name.test(item.name)) {
									this.form.remove(item);
								}
							}, { form: this, name: new RegExp('lockcommand') });
							this.doLayout();
						}
					}
				}),
				submitObject: {
					method:'POST',
					waitTitle: Ext.app.Localize.get('Connecting'),
					waitMsg: Ext.app.Localize.get('Sending data') + '...',
					success: function(form, action) {
						var O = Ext.util.JSON.decode(action.response.responseText);
						Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
							this.store.reload();
						}.createDelegate(this.grid));
						this.form.clearLocks();
					},
					failure: function(form, action){
						var O = Ext.util.JSON.decode(action.response.responseText);
						if(!Ext.isArray(O.reason)) {
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
								this.store.reload()
							}.createDelegate(this.grid));
						}
						else {
							try {
								var store = new Ext.data.ArrayStore({
									autoDestroy: true,
									idIndex: 0,
									data: O.reason,
									fields: [{
										name: 'login',
										type: 'string'
									}, {
										name: 'tardescr',
										type: 'string'
									}, {
										name: 'reason',
										type: 'string'
									}]
								});

								new Ext.Window({
									modal: true,
									title: Ext.app.Localize.get('Error'),
									width: 600,
									items: [{
										xtype: 'grid',
										store: store,
										height: 200,
										autoExpandColumn: 'nonedelreason',
										cm: new Ext.grid.ColumnModel({
											columns: [{
												header: Ext.app.Localize.get('Login'),
												dataIndex: 'login',
												width: 140
											}, {
												header: Ext.app.Localize.get('Tarif'),
												dataIndex: 'tardescr',
												width: 200
											}, {
												header: Ext.app.Localize.get('Reason'),
												dataIndex: 'reason',
												id: 'nonedelreason'
											}],
											defaults: {
												sortable: true,
												menuDisabled: true
											}
										})
									}],
									listeners: {
										close: function(){
											this.store.reload()
										}.createDelegate(this.grid)
									}
								}).show();
							}
							catch(e) { }
						}
						this.form.clearLocks();
					}
				},
				menu: [{
				text: Ext.app.Localize.get('Block up'),
					handler: function() {
						this.ownerCt.ownerCt.form.clearLocks();
						var G = this.ownerCt.ownerCt.ownerCt.ownerCt;
						var Sel = G.getSelectionModel();
						if(Sel.getCount() > 0) {
							Sel.each(function(record){
								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][state]',
									value: record.data.blocked
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][login]',
									value: record.data.login
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
									value: record.data.tarifdescr
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][action]',
									value: 'lock'
								});
							}, this.ownerCt.ownerCt.form);

							this.ownerCt.ownerCt.form.doLayout();

							if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
								this.ownerCt.ownerCt.submitObject.scope = {
									form: this.ownerCt.ownerCt.form,
									grid: G
								}
							}

							this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
						}
					}
				}, {
					text: Ext.app.Localize.get('Turn off'),
					handler: function() {
						this.ownerCt.ownerCt.form.clearLocks();
						var G = this.ownerCt.ownerCt.ownerCt.ownerCt;
						var Sel = G.getSelectionModel();
						if(Sel.getCount() > 0) {
							Sel.each(function(record){
								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][state]',
									value: record.data.blocked
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][login]',
									value: record.data.login
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
									value: record.data.tarifdescr
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][action]',
									value: 'off'
								});
							}, this.ownerCt.ownerCt.form);

							this.ownerCt.ownerCt.form.doLayout();

							if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
								this.ownerCt.ownerCt.submitObject.scope = {
									form: this.ownerCt.ownerCt.form,
									grid: G
								}
							}

							this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
						}
					}
				}, {
					text: Ext.app.Localize.get('Turn on'),
					handler: function() {
						this.ownerCt.ownerCt.form.clearLocks();
						var G = this.ownerCt.ownerCt.ownerCt.ownerCt;
						var Sel = G.getSelectionModel();
						if(Sel.getCount() > 0) {
							Sel.each(function(record){
								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][state]',
									value: record.data.blocked
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][login]',
									value: record.data.login
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][tarifdescr]',
									value: record.data.tarifdescr
								});

								this.add({
									xtype: 'hidden',
									name: 'lockcommand[' + record.data.vgid + '][action]',
									value: 'unlock'
								});
							}, this.ownerCt.ownerCt.form);

							this.ownerCt.ownerCt.form.doLayout();

							if(!Ext.isDefined(this.ownerCt.ownerCt.submitObject['scope'])) {
								this.ownerCt.ownerCt.submitObject.scope = {
									form: this.ownerCt.ownerCt.form,
									grid: G
								}
							}

							this.ownerCt.ownerCt.form.getForm().submit(this.ownerCt.ownerCt.submitObject);
						}
					}
				}]
			}, '-', {
				xtype: 'button',
				iconCls: 'ext-remove',
				form: new Ext.form.FormPanel({
					frame: false,
					url: 'config.php',
					items: [{
						xtype: 'hidden',
						name: 'async_call',
						value: 1
					}, {
						xtype: 'hidden',
						name: 'devision',
						value: 7
					}],
					renderTo: Ext.getBody(),
					clearLocks: function() {
						var items = this.findByType('hidden');
						if(items.length > 0) {
							Ext.each(items, function(item){
								if (this.name.test(item.name)) {
									this.form.remove(item);
								}
							}, { form: this, name: new RegExp('delvgid') });
							this.doLayout();
						}
					}
				}),
				submitObject: {
					method:'POST',
					waitTitle: Ext.app.Localize.get('Connecting'),
					waitMsg: Ext.app.Localize.get('Sending data') + '...',
					success: function(form, action) {
						var O = Ext.util.JSON.decode(action.response.responseText);
						Ext.Msg.alert(Ext.app.Localize.get('Info'), O.reason, function(){
							this.store.reload();
						}.createDelegate(this.grid));
						this.form.clearLocks();
                        submitForm('_User'); // перезагрузка основной формы, чтобы обновить доступные на договорах методы расчёта
					},
					failure: function(form, action){
						var O = Ext.util.JSON.decode(action.response.responseText);
						if(!Ext.isArray(O.reason)) {
							Ext.Msg.alert(Ext.app.Localize.get('Error'), O.reason, function(){
								this.store.reload()
							}.createDelegate(this.grid));
						}
						else {
							try {
								var store = new Ext.data.ArrayStore({
									autoDestroy: true,
									idIndex: 0,
									data: O.reason,
									fields: [{
										name: 'login',
										type: 'string'
									}, {
										name: 'tardescr',
										type: 'string'
									}, {
										name: 'reason',
										type: 'string'
									}]
								});

								new Ext.Window({
									modal: true,
									title: Ext.app.Localize.get('Error'),
									width: 600,
									items: [{
										xtype: 'grid',
										store: store,
										height: 200,
										autoExpandColumn: 'nonedelreason',
										cm: new Ext.grid.ColumnModel({
											columns: [{
												header: Ext.app.Localize.get('Login'),
												dataIndex: 'login',
												width: 140
											}, {
												header: Ext.app.Localize.get('Tarif'),
												dataIndex: 'tardescr',
												width: 200
											}, {
												header: Ext.app.Localize.get('Reason'),
												dataIndex: 'reason',
												id: 'nonedelreason'
											}],
											defaults: {
												sortable: true,
												menuDisabled: true
											}
										})
									}],
									listeners: {
										close: function(){
											this.store.reload()
										}.createDelegate(this.grid)
									}
								}).show();
							}
							catch(e) { }
						}
						this.form.clearLocks();
					}
				},
				text: Ext.app.Localize.get('Remove'),
				handler: function() {
					this.form.clearLocks();
					var G = this.ownerCt.ownerCt;
					var Sel = G.getSelectionModel();
					//if(Sel.getCount() > 0) {
						Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Remove selected') + ' ' + Ext.app.Localize.get('accounts') + '?', function(B){
							if(B == 'yes') {
								this.sm.each(function(record){
									this.add({
										xtype: 'hidden',
										name: 'delvgid[' + record.data.vgid + '][login]',
										value: record.data.login
									});

									this.add({
										xtype: 'hidden',
										name: 'delvgid[' + record.data.vgid + '][tarifdescr]',
										value: record.data.tarifdescr
									});
								}, this.Button.form);

								this.Button.form.doLayout();

								if(!Ext.isDefined(this.Button.submitObject['scope'])) {
									this.Button.submitObject.scope = {
										form: this.Button.form,
										grid: this.Grid
									}
								}

								this.Button.form.getForm().submit(this.Button.submitObject);
							}
						}, {
							sm: Sel,
							Button: this,
							Grid: G
						});
					//}
				}
			}],
			store: Store,
			loadMask: true,
			sm: SelectionModel,
			plugins: [EButton, HButton],
			cm: new Ext.grid.ColumnModel({
				columns: [SelectionModel, EButton, HButton, {
					header: Ext.app.Localize.get('Login'),
					dataIndex: 'login',
					id: 'logincolumn'
				}, {
					header: Ext.app.Localize.get('Card') + ' CC',
					dataIndex: 'ccrypt',
					hidden: USECERBER ? false : true,
					width: 80
				}, {
					header: Ext.app.Localize.get('Tarif'),
					dataIndex: 'tarifdescr',
					width: 200
				}, {
					header: Ext.app.Localize.get('Creation date'),
					dataIndex: 'creationdate',
					tplModel: true,
					width: 120,
					hidden: true,
					renderer: function(value, metaData) {
						try {
							metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
							return value.format('d.m.Y H:i');
						}
						catch(e){
							return value;
						}
					}
				}, {
					header: Ext.app.Localize.get('Date to turn on'),
					dataIndex: 'accondate',
					width: 120,
					renderer: function(value, metaData) {
						try {
							if (value.format('Y') <= 1900) {
								return '-';
							}
							else {
								metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
								return value.format('d.m.Y H:i');
							}
						}
						catch(e){
							return value;
						}
					}
				}, {
					header: Ext.app.Localize.get('Date to turn off'),
					dataIndex: 'accoffdate',
					width: 120,
					renderer: function(value, metaData) {
						try {
							if (value.format('Y') <= 1900) {
								return '-';
							}
							else {
								metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
								return value.format('d.m.Y H:i');
							}
						}
						catch(e){
							return value;
						}
					}
				}, {
					header: '&nbsp;',
					tooltip: Ext.app.Localize.get('Status'),
					dataIndex: 'blocked',
					menuDisabled: true,
					width: 24,
					renderer: function(value, metaData, record) {
						if (value > 0) {
							metaData.css = 'ext-blocked-grid';
						}
						else {
							metaData.css = 'ext-activate';
						}
						switch(value) {
							case 1:
							case 4:
								metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
								return Ext.app.Localize.get('B');

							case 10:
								metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Turned off') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
								return 'O';

							case 3:
								metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
								return 'A';

							case 5:
								metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
								return 'T';

							case 2:
								metaData.attr = 'ext:qtip="' + Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by user') + ' (' + Ext.app.Localize.get('Blocking') + ': ' + value + ')"';
								return Ext.app.Localize.get('U');
						}
					}
				}, {
					header: Ext.app.Localize.get('Date'),
					tooltip: Ext.app.Localize.get('Date state was changed'),
					dataIndex: 'blockdate',
					width: 120,
					renderer: function(value) {
						try {
							if(value.format('Y') <= 1900) {
								return '-';
							}
							return value.format('d.m.Y H:i');
						}
						catch(e) {
							return value
						}
					}
				}, {
					header: '&nbsp;',
					dataIndex: 'agentdescr',
					menuDisabled: true,
					width: 21,
					renderer: function(value, metaData, record) {
						switch(record.get('agenttype')) {
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
								metaData.css = "ext-leased";
							break;

							case 6:
								metaData.css = "ext-radius";
							break;

							case 7:
							case 8:
							case 9:
							case 10:
							case 11:
								metaData.css = "ext-cdrpabx";
							break;

							case 12:
								metaData.css = "ext-voip";
							break;

							case 13:
								metaData.css = "ext-usbox";
							break;
						}
						metaData.attr = 'ext:qtip="' + value + '"';
						return '&nbsp;';
					}
				}],
				defaults: {
					sortable: true,
					menuDisabled: false
				}
			}),
			autoExpandColumn: 'logincolumn',
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: Store,
				displayInfo: true,
				items: ['-', {
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
						data: [
							['100'],
							['500']
						],
						fields: ['id']
					}),
					listeners: {
						select: function(){
							PAGELIMIT = this.getValue();
							this.ownerCt.pageSize = PAGELIMIT;
							Store.reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			})
		});

		EButton.on('action', function(grid, record, rowIndex) {
			createHidOrUpdate('_User', 'devision', 7);
			Ext.Element.get('_descr_').dom.name='';
			submitForm('_User', 'vgid', record.data.vgid);
		});

		HButton.on('action', function(grid, record, rowIndex) {
			if(record.data.istemplate) {
				return;
			}
			Charges({
				vgid: record.data.vgid,
				module: record.data.id,
				moduletype: record.data.agenttype
			});
		});
	}
} // end vgroupPanel()
/**
 * Operator tell staff widget
 * @param	integer
 */
function operTellStaff(id)
{
	var id = id || 0;
	var PAGELIMIT = 100;

	var DropBtn = new Ext.grid.RowButton({
		header: '&nbsp;',
		qtip: Ext.app.Localize.get('Delete'),
		width: 22,
		dataIndex: 'recordid',
		menuDisabled: true,
		iconCls: 'ext-drop'
	})

	DropBtn.on('action', function(grid, record, rowIndex) {
		if(record.get('recordid') <= 0) {
			grid.getStore().remove(record);
		}
		else {
			Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to delete selected item'), function(Btn){
				if(Btn != 'yes') {
					return;
				}

				Ext.Ajax.request({
					url: 'config.php',
					timeout: 380000,
					method: 'POST',
					params: {
						async_call: 1,
						devision: 22,
						delopertelstaff: this.record.get('recordid')
					},
					scope: this.grid,
					callback: function(opt, success, resp) {
						try {
							// Decode JSON data
							var data = Ext.util.JSON.decode(resp.responseText);

							if(!data['success']) {
								throw(data);
							}

							this.getStore().reload();
						}
						catch(e) {
							Ext.Msg.show({
								title: Ext.app.Localize.get('Error'),
								msg: '<b>' + Ext.app.Localize.get('Error') + ':</b><br>' + e['error'] || e || Ext.app.Localize.get('Unknown error') + '<br>',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						}
					}
				});
			}, {
				grid: grid,
				record: record
			});
		}
	});

	new Ext.Window({
		title: Ext.app.Localize.get('Number capacity'),
		width: 750,
		modal: true,
		items: {
			xtype: 'editorgrid',
			height: 500,
			clicksToEdit: 1,
			autoExpandColumn: 'oper-tel-staff-exp',
			loadMask: true,
			listeners: {
				beforerender: function(grid) {
					var bbar = grid.getBottomToolbar();
					bbar.pageSize = PAGELIMIT;
					bbar.bindStore(grid.store);
					bbar.add(['-', {
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
							data: [
								['50'],
								['100'],
								['500']
							],
							fields: ['id']
						}),
						listeners: {
							select: function(c){
								this.PAGELIMIT = c.ownerCt.pageSize = c.getValue() * 1;
								this.store.reload({ params: { limit: this.PAGELIMIT } });
							}.createDelegate(grid)
						}
					}]);
				}
			},
			columns: [{
				header: Ext.app.Localize.get('Template') + ': ' + Ext.app.Localize.get('Phone number') + '/ ' + Ext.app.Localize.get('Route') + ' / ' + Ext.app.Localize.get('Modem pool'),
				id: 'oper-tel-staff-exp',
				dataIndex: 'number',
				editor: new Ext.form.TextField({
					allowBlank: false
				})
			}, {
				header:  Ext.app.Localize.get('Device'),
				width: 120,
				dataIndex: 'device',
				renderer: function(value, meta, record) {
					switch(value) {
						case 0: return Ext.app.Localize.get('Phone');
						case 1: return Ext.app.Localize.get('Route');
						case 2: return Ext.app.Localize.get('Modem pool');
						default: return value;
					}
				},
				editor: new Ext.form.ComboBox({
					editable: false,
					triggerAction: 'all',
					lazyRender: true,
					mode: 'local',
					valueField: 'id',
					displayField: 'name',
					store: {
						xtype: 'arraystore',
						fields: ['id','name'],
						data: [
							[0, Ext.app.Localize.get('Phone')],
							[1, Ext.app.Localize.get('Route')],
							[2, Ext.app.Localize.get('Modem pool')]
						]
					}
				})
			}, DropBtn],
			plugins: [DropBtn],
			tbar: [{
				xtype: 'button',
				text: Ext.app.Localize.get('Add'),
				handler: function(Btn) {
					var grid = Btn.findParentByType('editorgrid');
					var store = grid.getStore();

					store.insert(0, new store.recordType({
						recordid: 0,
						number: '',
						device: 0,
						operid: id
					}));

					grid.startEditing(0,0);
				}
			}],
			bbar: {
				xtype: 'paging',
				pageSize: 0,
				displayInfo: true
			},
			store: {
				xtype: 'jsonstore',
				url: 'config.php',
				timeout: 380000,
				root: 'results',
				totalProperty: 'total',
				autoLoad: true,
				fields: [
					{ name: 'recordid', type: 'int' },
					{ name: 'number', type: 'string' },
					{ name: 'operid', type: 'int' },
					{ name: 'device', type: 'int' }
				],
				baseParams: {
					async_call: 1,
					devision: 22,
					start: 0,
					getopertelstaff: id,
					limit: PAGELIMIT
				},
				listeners: {
					exception: function(proxy, type, action, res) {
						if (!res.reader.jsonData['success']) {
							Ext.Msg.show({
								title: Ext.app.Localize.get('Error'),
								msg: res.reader.jsonData['error'] + '<br>' + Ext.app.Localize.get('Try again') + '?',
								buttons: Ext.Msg.OKCANCEL,
								icon: Ext.MessageBox.ERROR,
								fn: function(B){
									if (B == 'yes') {
										this.reload();
									}
								}.createDelegate(this)
							});
						}
					},
					update: function(store, record, action) {
						if(action == Ext.data.Record.EDIT) {
							Ext.Ajax.request({
								url: 'config.php',
								timeout: 3800000,
								method: 'POST',
								params: Ext.apply(record.data, {
									async_call: 1,
									devision: 22,
									setopertelstaff: id
								}),
								scope: {
									record: record,
									store: store
								},
								callback: function(opt, success, resp){
									try {
										// Decode JSON data
										var data = Ext.util.JSON.decode(resp.responseText)

										if(!data['success']) {
											throw(data);
										}

										if(opt.params.recordid <= 0) {
											this.record.data.recordid = data.results[0].recordid;
										}

										this.store.commitChanges();
									}
									catch(e) {
										Ext.Msg.show({
											title: Ext.app.Localize.get('Error'),
											msg: '<b>' + Ext.app.Localize.get('Error') + ':</b><br>' + e['error'] || e || Ext.app.Localize.get('Unknown error') + '<br>',
											buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.ERROR
										});
									}
								}
							})
						}
					}
				}
			}
		}
	}).show();
} // end operTellStaff()

/**
 * Show universal agreement form for user
 *
 */
function showOptionsForm(A){
	
	if (Ext.isEmpty(A) || Ext.isEmpty(A.uid)) {
        return false;
    };
    
    var SelectionModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});
	
	new Ext.Window({ 
        title: Ext.app.Localize.get('More'),
        height: 320,
        width: 470,
        layout: 'fit',
        buttonAlign: 'center',
        buttons:[{
            xtype: 'button',
            text: Ext.app.Localize.get('Save'),
            handler: function(Btn){
            	var win = Btn.findParentByType('window'),
            		vgroups = [],
            		records = win.get(0).getSelectionModel().getSelections();
                for(var i = 0; i < records.length; ++i){
					vgroups.push(records[i].get('vgid'));
                }
                document.getElementById(A.form).vgroups.value = vgroups.join(',');;
                win.close();
            }
        }],
        items: [{
            xtype: 'grid',
            title: Ext.app.Localize.get('Accounts'),
            anchor: '100% 100%',
            autoExpandColumn: 'auto_exp_col_vgroup',
            sm: SelectionModel,
            columns: [SelectionModel, {
                header: Ext.app.Localize.get('Login'),
                dataIndex: 'login',
                id: 'auto_exp_col_vgroup'
            }, {
                header: Ext.app.Localize.get('Date to turn on'),
                dataIndex: 'accondate',
                width: 110,
                renderer: function(value){
	                try {
						if (value.substr(0, 4) == '0000') {
							return '-';
						}
						else {
							return value.substr(0, 11);
						}
					}
					catch(e){
						return value;
					}
            	}
            }, {
                header: Ext.app.Localize.get('Tarif'),
                dataIndex: 'tarifdescr',
                width: 110
            }],
            store: {
            	xtype: 'jsonstore',
            	url: 'config.php',
    			timeout: 380000,
    			root: 'results',
    			totalProperty: 'total',
    			autoLoad: true,
                fields:[
                    { name: 'vgid', type: 'int' },
 					{ name: 'login', type: 'string' },
					{ name: 'accondate', type: 'string' },
					{ name: 'tarifdescr', type: 'string' }
				],
                baseParams: {
    				async_call: 1,
    				devision: 22,
    				getvgroupslist: 1,
    				uid: A.uid
    			}
            }
        }]			
	}).show();
} // end showOptionsForm()


function refreshDateFiedlsView(value, element){
	var doctype = document.getElementById("option_" + value).value;
	
	var datetill = document.getElementsByName("templatedatetill")[0];
	datetill.disabled = doctype != 1 ? true : false;
	
	var templatedatelabel = document.getElementById("templatedatelabel");
	var labeltext = 'Period';
	if (doctype == 1) {
		labeltext = 'Since';
	}
	if (doctype == 2) {
		labeltext = 'Date';
	}
	templatedatelabel.innerHTML = Ext.app.Localize.get(labeltext);
} // end refreshDateFiedlsView()



function delUser(uid, agrmid) {
	if(Ext.isEmpty(uid)) return;
	
	
	Ext.Ajax.request({
		url: 'config.php',
		timeout: 380000,
		method: 'POST',
		params: {
			async_call: 1,
			devision: 22,
			'deluid[]': uid
		},
		scope: this.grid,
		callback: function(opt, success, resp) {
			try {
				// Decode JSON data
				var data = Ext.util.JSON.decode(resp.responseText);

				if(!data['success']) {
					throw(data);
				}
				Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Request done successfully'));
				submitForm('_User', 'migrateAgrm', agrmid)
			}
			catch(e) {
				Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(e.reason));
			}
		}
	});
}




function attachAgreement() {

	if (Ext.isEmpty(Ext.get('_uid_').getValue()) || Ext.isEmpty(Ext.get('_uid_').getValue())) {
        return false;
    };
    
    var SelectionModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	
	var PAGELIMIT = 100;
	
	var store = new Ext.data.JsonStore({
    	url: 'config.php',
		timeout: 380000,
		root: 'results',
		totalProperty: 'total',
		autoLoad: false,
        fields:[
            { name: 'agrmid', type: 'int' },
			{ name: 'number', type: 'string' },
			{ name: 'uid', type: 'int' },
			{ name: 'username', type: 'string' }
		],
        baseParams: {
			async_call: 1,
			devision: 22,
			getpreactivated: 1
		}
	});
	
	
	new Ext.Window({ 
        title: Ext.app.Localize.get('Transfer agreement'),
        height: 440,
        width: 610,
        layout: 'anchor',
        buttonAlign: 'center',
        buttons:[{
            xtype: 'button',
            text: Ext.app.Localize.get('Transfer'),
            handler: function(Btn){
            	var win = Btn.findParentByType('window'),
            		record = win.get(0).getSelectionModel().getSelected();
					
				Ext.Msg.confirm(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('After transfer old account will be removed. Continue?'), function(Btn){
					if(Btn != 'yes') {
						return;
					}

					
					Ext.Ajax.request({
						url: 'config.php',
						timeout: 380000,
						method: 'POST',
						params: {
							async_call: 1,
							devision: 22,
							migrateagreement: 1,
							agrmid: record.get('agrmid'),
							uid: Ext.get('_uid_').getValue()
						},
						scope: this.grid,
						callback: function(opt, success, resp) {
							try {
								// Decode JSON data
								var data = Ext.util.JSON.decode(resp.responseText);

								if(!data['success']) {
									throw(data);
								}
								
								delUser(record.get('uid'), record.get('agrmid'));
								
								win.close();
							}
							catch(e) {
								Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(e.reason));
							}
						}
					});
					
					
					
				});

                
            }
        }],
        items: [{
            xtype: 'grid',
            anchor: '100% 100%',
            sm: SelectionModel,
			loadMask: true,
			tbar: [{
				xtype: 'tbspacer',
				width: 5
			},{
				xtype: 'tbtext',
				text: Ext.app.Localize.get('Agreement') + ':'
			}, {
				xtype: 'tbspacer',
				width: 5
			}, {
				xtype: 'textfield',
				itemId: 'searchfield',
				width: 200
			}, {
				xtype: 'tbspacer',
				width: 5
			}, {
				xtype: 'button',
				text: Ext.app.Localize.get('Search'),
				iconCls: 'ext-search',
				handler: function(Btn) {
					var field = Btn.findParentByType('toolbar').get('searchfield');
					Btn.findParentByType('grid').getStore().removeAll();
					Btn.findParentByType('grid').getStore().reload({
						params: {
							search: field.getValue()
						}
					});
	
				}
			}],
			bbar: new Ext.PagingToolbar({
				pageSize: PAGELIMIT,
				store: store,
				displayInfo: true,
				items: ['-', {
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
						data: [
							['100'],
							['500']
						],
						fields: ['id']
					}),
					listeners: {
						select: function(){
							PAGELIMIT = this.getValue();
							this.ownerCt.pageSize = PAGELIMIT;
							Store.reload({ params: { limit: PAGELIMIT } });
						}
					}
				}]
			}),
			columns: [
			SelectionModel, 
			{
				header: Ext.app.Localize.get('Agreement number'),
				dataIndex: 'number',
				width: 260
			}, {
				header: Ext.app.Localize.get('User name'),
				dataIndex: 'username',
				width: 200
			}],
            store: store
        }]			
	}).show();
	
}

function sumbitMainForm(form) {
	if (document.getElementsByName("passissuedate").length > 0) {
		var passissuedate = document.getElementsByName("passissuedate")[0];
		var R = /^\d\d\d\d\-\d\d\-\d\d$/;
		if(passissuedate.value!= "" && !R.test(passissuedate.value)) {
			alert(Ext.app.Localize.get('Invalid passport issue date'));
			return;
		}
	}
	submitForm('_User', 'save', '1');
}
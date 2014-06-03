/**
 * Widget to work with additional fields for agreements and form to apply values for them
 * @param {Object} form
 * @param {Object} agrmid
 */
function AgrmProperties(form, agrmid, callback){
	var callback = callback || function(){};

	var Fields = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		reader: new Ext.data.JsonReader({
			root: 'results'
		}, [
			{ name: 'name', type: 'string' },
			{ name: 'type', type: 'int'	},
			{ name: 'descr', type: 'string' },
			{ name: 'strvalue', type: 'string' }
		]),
		autoLoad: true,
		baseParams: {
			async_call: 1,
			devision: 22,
			getafrmfds: 0
		},
		listeners: {
			load: function(store){
				var A = Ext.getCmp('agrmFields');
				if(A!=undefined && A.items.first().id == A.getActiveTab().id){
					buildFormFields(store)
				}
			}
		}
	});

	var AInputs = {
		agrmExistsName: 'aaddons',
		agrmid: null,
		agrmNewName: 'new_aaddons',
		form: null,
		items: [],
		map: {},
		parentName: null,
		getAttributes: function(o) {
                var A = {};
				for(var i = 0, off = o.attributes.length; i < off; i++) {
				if (!o.attributes[i].name) {
					continue;
				}
				A[ o.attributes[i].name ] = o.attributes[i].value;
			}
			return A;
        },
		getValue: function(N){
			if(this.map[N]) {
				return this.items[this.map[N].key].value;
			}
			return null;
		},
		clearElement: function(N){
			if(this.map[N]) {
				this.form.removeChild(this.items[this.map[N].key]);
				this.items.remove(this.map[N].key);
			}
		},
		initItems: function(){
			this.items = [];
			this.map = {};
			
			this.namePattern = new RegExp('(' + this.agrmExistsName + '|' + this.agrmNewName + ')' + '\\[' + this.agrmid + '\\]')
			var L = Ext.getBody().dom.getElementsByTagName('INPUT');
			Ext.each(L, function(I){
				if(I.type == 'hidden' && this.namePattern.test(I.name)) {
					
					if(Ext.isEmpty(this.parentName)) {
						var P = I.name.split('[');
						if(P[0] == this.agrmExistsName) {
							this.parentName = this.agrmExistsName
						}

						if(P[0] == this.agrmNewName) {
							this.parentName = this.agrmNewName
						}
					}

					var A = this.getAttributes(I);
					this.map[A.fieldname] = {
						key: this.items.length,
						name: I.name,
						fieldname: A.fieldname
					};
					this.items.push(I);
				}
			}, this);
		},
		initStaticItems: function(F) {
			
			if(F.findParentByType('window').disableSomeAgreementFields()) {
				F.find('id', 'anumber')[0].setReadOnly(true);
				F.find('id', 'adate')[0].setReadOnly(true);
			}
			
			//var L = Ext.getBody().dom.getElementsByTagName('INPUT');
			var L =Ext.query('input[type=hidden],select[id^=new_agrms_type_],select[id^=agrms_type_]', Ext.getBody().dom) 
			Ext.each(L, function(I){
				if (this.pattern.test(I.name)) {
					var items = I.name.split('[');

					// The last test for the parentName
					if(Ext.isEmpty(this.parentName)) {
						this.main.parentName = items[0] == "agrms" ? this.main.agrmExistsName : this.main.agrmNewName;
					}
					
					switch (items[2].replace(']', '')) {
						case 'date':
							try {
								if (I.value.substr(0, 1) * 1 > 0) {
									this.container.find('id',	 'adate')[0].setValue(I.value)
								}
							}
							catch (e) {

							}
							break;
						case 'num':
							try {
								this.container.find('id', 'anumber')[0].setValue(I.value);
							}
							catch (e) {

							}
							break;

						case 'penaltymethod':
							try {
								this.container.find('id', 'penaltymethod')[0].setValue(I.value);
							}
							catch (e) {

							}
							break;
							
						case 'priority':
							try { 
								this.container.find('id', 'priority')[0].setValue(I.value);
							}
							catch (e) {
								
							}
							break;
							
						case 'closedon':
							try {
								var tmpValue = I.value;
								if (!Ext.isDate(I.value)) {
									I.value = Date.parseDate(I.value, "c"); 
								}
								if(I.value == 'undefined' || I.value == '') {
									I.value = tmpValue;
								}
								I.value = Ext.util.Format.date(I.value, 'Y-m-d');
								this.container.find('id', 'closedon')[0].setValue(I.value);
							}
							catch (e) {
								
							}
							break;
							
						case 'installments':
							try { 
								this.container.find('id', 'installments')[0].setValue(I.value);
							}
							catch (e) {
								
							}
							break;
							
                        case 'friendagrmid':
                            try {
                                this.container.find('id', 'friendagrmid')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;
                        case 'friendnumber':
                            try {
                                this.container.find('id', 'friendnumber')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;
                        case 'parentagrmid':
                            try {
                                this.container.find('id', 'parentagrmid')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;
                        case 'uid':
                            try {
                                this.container.find('id', 'uidd')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;    
                        case 'parentnumber':
                            try {
                                this.container.find('id', 'parentnumber')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;
                        case 'paymentmethod':
                            try {
                            	if(I.value)
                            	{
                            		var combo = this.container.find('id', 'paymentmethod')[0];
                            		combo.setValue(I.value);
									combo.getStore().setBaseParam('agrmid', this.main.agrmid);
									combo.getStore().load();					
                            	}
                            }
                            catch (e) {
                            	
                            }
                            break;
                            
                        case 'ownerid':
                            try {
                            	if(I.value) 
                            	{
                            		var combo = this.container.find('id', 'ownerid')[0];
                            		combo.setValue(I.value);
                            	}
                            }
                            catch (e) {

                            }
                            break;
                   
                        case 'orderpayday': 
                            try {
                                	this.container.find('id', 'orderpayday')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;                            
                        case 'blockorders': 
                            try {

                                	this.container.find('id', 'blockorders')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;
                        case 'ablocktype': 
                            try {
                                	this.container.find('id', 'ablocktype')[0].setValue(I.value =='' ? 0 : I.value);
                            }
                            catch (e) {

                            }
                            break;    
                        case 'ablockvalue': 
                            try {
                                	this.container.find('id', 'ablockvalue')[0].setValue(I.value);
                            }
                            catch (e) {

                            }
                            break;    
					}
				}
			}, {
				pattern: new RegExp('^(agrms|new_agrms)\\['+ agrmid + '\\]\\[(num|ablocktype|ablockvalue|uid|orderpayday|blockorders|date|paymentmethod|priority|closedon|installments|friendagrmid|friendnumber|penaltymethod|parentagrmid|parentnumber|ownerid)\\]'),
				container: F,
				main: this
			});
		},
		saveItems: function(F){
			var Set = F.find('id', 'addOnsFieldset');
			if(Set.length > 0){
				Set = Set[0];
				if(Set.items.first().xtype == 'container' || Set.items.items.length == 0) {
					return;
				}
				var O = {
					map: {}
				};
				Set.items.each(function(I){
					O.map[I.id] = {
						name: I.id,
						found: true,
						value: I.getValue()
					}
				}, O);
				this.syncItems(O, true);
			}
			else {
				return;
			}
		},
		syncItems: function(O, NotInint) {
			if(Ext.isEmpty(this.parentName)) {
				return false;
			}
			for(var i in O.map) {
				if(O.map[i].found) {
					if(this.map[i]) {
						this.items[this.map[i].key].value = (O.map[i].value || "");
					}
					else {
						var H = document.createElement('INPUT');
						H.type = 'hidden';
						H.name = this.parentName + '[' + this.agrmid + '][' + O.map[i].name + ']';
						H.value = (O.map[i].value || "");
						H.setAttribute('fieldname', O.map[i].name);
						this.form.appendChild(H);
					}
				}
				else {
					this.form.removeChild(this.items[this.map[i].key]);
				}
			}
			if(!NotInint) {
				this.initItems();
			}
		}
	}

	if(Ext.isEmpty(form)) {
		return false;
	}
	else {
		if(typeof form != 'object') {
			try{
				AInputs.form = document.getElementById(form);
			}
			catch(e){
				return false;
			}
		}
	}

	if(Ext.isEmpty(agrmid)) {
		return false;
	}
	else {
		AInputs.agrmid = agrmid;
	}

	AInputs.initItems();

	function buildFormFields(S){
		if(Ext.isEmpty(S)){
			return false;
		}

		var A = Ext.getCmp('agrmFields').getActiveTab();
		var F = A.findByType('form')[0];
		F.disable();
		var O = {
			map: {},
			items: []
		}

		S.each(function(R){
			this.map[R.data.name] = {
				name: R.data.name,
				type: R.data.type,
				text: R.data.descr,
				found: false,
				key: this.items.length,
				value: AInputs.getValue(R.data.name)
			}

			if(R.data.type == 0) {
				this.items.push({
					xtype: 'textfield',
					fieldLabel: R.data.descr,
					width: 200,
					id: R.data.name,
					value: AInputs.getValue(R.data.name)
				})
			}
				
			if(R.data.type == 1) {
				this.items.push({
					xtype: 'combo',
					width: 200,
					mode: 'local',
					id: R.data.name,
					displayField: 'value',
					valueField: 'idx',
					fieldLabel: R.data.descr,
					triggerAction: 'all',
					editable: false,
					value: AInputs.getValue(R.data.name),
					store: new Ext.data.Store({
						parentId: R.data.name,
						parentValue: AInputs.getValue(R.data.name),
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
	                    },{
	                        name: 'name',
	                        type: 'string'
	                    }]),
						autoLoad: true,
	                    baseParams: {
	                        async_call: 1,
	                        devision: 22,
	                        getafrmfds: R.data.name,
	                        values: 1
	                    },
						listeners: {
							load: function(){
								var P = Ext.getCmp(this.parentId);
								if(P){
									P.setValue(this.parentValue);
								}
							}
						}
	                })
				});
			}
		}, O);

		if(Ext.isEmpty(F.find('id', 'addOnsFieldset'))) {
			var Set = new Ext.form.FieldSet({
				id: 'addOnsFieldset',
				title: Ext.app.Localize.get('Fields'),
				xtype: 'fieldset',
				overflow:'auto',
				style: 'padding: 6px',
				autoScroll: true,
				labelWidth: 220,
				height: 150,
				isEmpty: true,
				items: []
			});

			F.add(Set);
		}
		else {
			var Set = F.find('id', 'addOnsFieldset')[0];
		}

		if(typeof Set.AttachItem != 'function') {
			Set.AttachItems = function(O){
				var iterate = function(L,O){
					if (L.length > 0) {
						Ext.each(L, function(I){
							if (!this.map[I.id]) {
								I.destroy();
							}
							else {
								this.map[I.id].found = true;
								this.map[I.id].value = I.getValue();
								I.setLabel(this.map[I.id].text);
							}
						}, O);
					}
				}

				// Compare TextFields
				iterate(this.findByType('textfield'), O);
				// Compare Combo
				iterate(this.findByType('combo'), O);

				for(var i in O.map) {
					if(!O.map[i].found) {
						this.add(O.items[O.map[i].key]);
						O.map[i].found = true;
					}
				}
			}.createDelegate(Set);
		}

		if (O.items.length > 0) {
			if (Set.isEmpty) {
				Set.removeAll();
			}
		}

		// Add new fields to form, clear deleted, and update lables
		Set.AttachItems(O);
		// Synchronize with html input elements in main form
		AInputs.syncItems(O);

		if (O.items.length == 0) {
			if (Set.items.items.length == 0) {
				Set.add({
					xtype: 'container',
					autoEl: 'div',
					html: '<div style="width: 100%; color: #b0b0b0; text-align: center; padding-top: 120px">' + Ext.app.Localize.get('Empty list') + '</div>'
				});
			}
		}

		// Rebuild EXTJS form
		F.doLayout();
		// Enable it
		F.enable();
	} // end buildFormFields()

   createField = function(A){
        if (!Ext.isEmpty(Ext.getCmp('editAgrmFormField'))) {
            Ext.getCmp('editAgrmFormField').close();
        }

        A = A || { data: { type: 0, name: '', descr: '' } };
        var Rm = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Ext.app.Localize.get('Remove'),
            dataIndex: 'idx',
            width: 22,
            iconCls: 'ext-drop'
        });

        title = function(A){
            try {
                return Ext.app.Localize.get('Edit') + ': ' + A.get('name')
            }
            catch (e) {
                return Ext.app.Localize.get('Add new record')
            }
        }

        new Ext.Window({
            id: 'editAgrmFormField',
            title: title(A),
            width: 370,
            shawdow: false,
			modal: true,
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
				disabled: true,
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
                    var submit = function() {
                        F.getForm().submit({
                            method: 'POST',
                            waitTitle: Ext.app.Localize.get('Connecting'),
                            waitMsg: Ext.app.Localize.get('Sending data') + '...',
                            success: function(form, action){
                                Ext.getCmp('agrmFormFields').store.reload();
                                W.close();
                            },
                            failure: function(form, action){
                                if (action.failureType == 'server') {
                                    obj = Ext.util.JSON.decode(action.response.responseText);
                                    Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', obj.errors.reason);
                                }
                            }
                        })
                    }
                    if (
                        Ext.getCmp('agrmFormFields').store.findExact(
                            'name',
                            F.getForm().findField('setafrmfds').getValue()
                        ) != -1
                    ) {
                        Ext.Msg.confirm(
                            Ext.app.Localize.get('Info'),
                            Ext.app.Localize.get(
                                'Field with name __name already exists. Do you want to override it?'
                            ).replace(
                                '__name',
                                '"'+F.getForm().findField('setafrmfds').getValue()+'"'
                            ),
                            function(B){
                                if (B == 'yes') {
                                    submit();
                                } else {
                                    W.close();
                                }
                            }
                        );
                    } else {
                        submit();
                    }
                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Cancel'),
                handler: function(){
                    this.ownerCt.ownerCt.close();
                }
            }],
            items: [{
                xtype: 'form',
                id: 'agrmFormFieldEdit',
                url: 'config.php',
                method: 'POST',
				monitorValid: true,
                frame: true,
				listeners: {
					clientvalidation: function(F, S) {
						if(S){
							F.ownerCt.buttons[0].enable()
						}
						else {
							F.ownerCt.buttons[0].disable()
						}
					}
				},
                items: [{
                    xtype: 'hidden',
                    name: 'async_call',
                    value: 1
                }, {
                    xtype: 'hidden',
                    name: 'devision',
                    value: 22
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Description'),
                    name: 'descr',
                    width: 230,
                    value: (A.data.descr) ? A.data.descr : '',
					allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: Ext.app.Localize.get('Field'),
                    name: 'setafrmfds',
                    width: 150,
					allowBlank: false,
                    readOnly: (A.data.name.length == 0) ? false : true,
                    value: (A.data.name) ? A.data.name : '',
                    maskRe: new RegExp('[a-zA-Z0-9\-\_]')
                }, {
                    xtype: 'combo',
                    fieldLabel: Ext.app.Localize.get('Type'),
                    id: 'fieldType',
                    width: 150,
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
                        data: [[0, Ext.app.Localize.get('Text')], [1, Ext.app.Localize.get('List')]]
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
                    text: Ext.app.Localize.get('Add value'),
                    handler: function(){
                        this.ownerCt.ownerCt.store.insert(0, new this.ownerCt.ownerCt.store.recordType({
                            idx: 0,
                            value: ''
                        }))
                    }
                }],
                cm: new Ext.grid.ColumnModel([{
                    header: Ext.app.Localize.get('Value'),
                    dataIndex: 'value',
                    id: 'comboValue',
					alloBlank: false,
                    editor: new Ext.form.TextField({})
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
                        devision: 22,
                        getafrmfds: '',
                        values: 1
                    }
                }),
                listeners: {
                    render: function(G){
                        if (A.data.type == 1) {
                            G.show();
                            G.store.baseParams.getafrmfds = A.data.name;
                            G.store.load();
                        }
                    }
                }
            }]
        }).show();
        Rm.on('action', function(g, r, idx){
            g.store.remove(r)
        });
    }

    var Edit = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Edit'),
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-edit'
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Remove'),
        dataIndex: 'name',
        width: 22,
        iconCls: 'ext-drop'
    });

	// Main Window View
	new Ext.Window({
		title: Ext.app.Localize.get('Agreement properties') + ' / ' + Ext.app.Localize.get('Additional fields for agreements'),
		width: 850,
		modal: true,
		constrain: true,
		resizable: false,
		listeners: {
			close: function(){
				try {
					Ext.getCmp('autoNumbering').destroy()
				}
				catch(e){

				}
			}
		},
		agrmid: agrmid,
		disableSomeAgreementFields: function(){ // Если из php приходит опция "disable_account_fields" и у выбранного договора пустой код оплаты - дизейбл полей
			try {
				var dis = document.getElementsByName("disable_account_fields")[0].value;
				if (dis == 1) {
					var code = document.getElementsByName("agrms[" + this.agrmid + "][code]")[0].value;
					if (code.length > 0) {
						return true;
					}
					return false;
				}
			}
			catch(e){}	
			return false;
		},
		items:[{
			xtype: 'tabpanel',
			id: 'agrmFields',
			frame: true,
			activeTab: 0,
			//autoHeight: true,
			plain: true,
			deferredRender: true,
			listeners: {
				tabchange: function(P, C){
					if (P.items.first().id == C.id) {
						buildFormFields(Fields)
					}
				}
			},
			addPB: function(grid) {
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
			},
			items: [{
				title: Ext.app.Localize.get('Agreement properties'),
				height: 650,
				items: [{
					xtype: 'form',
					frame: true,
					height: 650,
					listeners: {
						afterrender: function(){
							AInputs.initStaticItems(this);
						}
					},
					buttonAlign: 'center',
					buttons: [{
						xtype: 'button',
						text: Ext.app.Localize.get('Save'),
						handler: function(Btn){
							// Static fields: number and date
							//var L = document.getElementsByTagName('INPUT'); 
							var L =Ext.query('input[type=hidden],select[id^=new_agrms_type_],select[id^=agrms_type_]', Ext.getBody().dom) 
							var Str = {
								values: [],
								prefix: null,
								id: null,
								getString: function(){
									Ext.each(this.values, function(I, idx){
										
										if(idx == 0 && I == '') {
											this.values[idx] = Ext.app.Localize.get('Undefined')
										}
										if(idx == 1 && I != '') {
											this.values[idx] = '(' + this.values[idx] + ')';
										}
									}, this);
									return this.values.join(' ');
								}
							};
							Ext.each(L, function(I){
								if(this.pattern.test(I.name)) {	
									var items = I.name.split('[');

									if (Ext.isEmpty(this.str.prefix)) {
										this.str.prefix = items[0].replace(']', '');
									}

									if (Ext.isEmpty(this.str.id)) {
										this.str.id = items[1].replace(']', '');
									}
									switch(items[2].replace(']', '')) {
										case 'date':
											try {
												I.value = this.container.find('id', 'adate')[0].getValue().format('Y-m-d');
												this.str.values[1] = I.value;
											}
											catch(e) {

											}
										break;

										case 'num':
											try {												
												I.value = this.container.find('id', 'anumber')[0].getValue();
												this.str.values[0] = I.value;
											}
											catch(e) {

											}
										break;
										
										case 'penaltymethod':
											try {
												I.value = this.container.find('id', 'penaltymethod')[0].getValue();
											}
											catch(e) {

											}
										break;
										
										case 'ownerid':
											try {
												I.value = this.container.find('id', 'ownerid')[0].getValue();
											}
											catch(e) {

											}
										break;
										
										case 'priority':
											try {												
												I.value = this.container.find('id', 'priority')[0].getValue();
											}
											catch(e) {

											}
										break;
										
                                        case 'friendagrmid':
                                            try {
                                                I.value = this.container.find('id', 'friendagrmid')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;

                                        case 'friendnumber':
                                            try {
                                                I.value = this.container.find('id', 'friendnumber')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;
                                        case 'parentagrmid':
                                            try {
                                                I.value = this.container.find('id', 'parentagrmid')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;
										case 'uid':
											try {
												this.container.find('id', 'uidd')[0].setValue(I.value);
											}
											catch (e) {

											}
										break;  
                                        case 'parentnumber':
                                            try {
                                                I.value = this.container.find('id', 'parentnumber')[0].getValue();
                                            }
                                            catch(e) {
                                            }
                                        break;
                                        case 'blockorders':
                                            try {
                                                I.value = this.container.find('id', 'blockorders')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;

                                        case 'orderpayday':
                                            try {
                                                I.value = this.container.find('id', 'orderpayday')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;
                                        case 'ablocktype':
											try {
												I.value = this.container.find('id', 'ablocktype')[0].getValue();
											}
											catch (e) {

											}
										break;  
                                        case 'ablockvalue':
                                            try {
                                                I.value = this.container.find('id', 'ablockvalue')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;
                                        case 'paymentmethod':
                                            try {
                                                I.value = this.container.find('id', 'paymentmethod')[0].getValue();
                                            }
                                            catch(e) {

                                            }
                                        break;
									}
								}
						}, { str: Str, pattern: new RegExp('^(agrms|new_agrms)\\['+ agrmid + '\\]\\[(num|uid|ablocktype|ablockvalue|date|penaltymethod|orderpayday|blockorders|paymentmethod|priority|friendagrmid|friendnumber|parentagrmid|parentnumber|ownerid)\\]'), container: Btn.ownerCt.ownerCt, form: form });

							try {
								Ext.get(Str.prefix + 'displ-' + Str.id).dom.innerHTML = Str.getString();
							}
							catch(e){

							}

							AInputs.saveItems(Btn.ownerCt.ownerCt);

							if(Ext.isFunction(this.callback)) {
								this.callback();
							}

							Btn.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt.close()
						}.createDelegate({
							callback: callback
						})
					}],
					items: [{
						xtype: 'hidden',
						id: 'code'
						},{	
                    	xtype: 'fieldset',
                        border: true, 
                        title: Ext.app.Localize.get('Properties'), 
                        style: 'padding: 16px',
                        labelWidth: 125,
                        //height: 450,
                        items: [		
						{	
						xtype: 'container',
						autoEl: 'div',
						layout: 'hbox',
						items: [					
						{
							xtype: 'fieldset',
							border: false,
							width: 320,
							style: 'padding: 0',
							items: 
							[{
								xtype: 'textfield',
								width: 182,
								id: 'anumber',
								fieldLabel: Ext.app.Localize.get('Agreement number'),
								listeners: {
									afterrender: function(){
										if (this.findParentByType('window').disableSomeAgreementFields() == false) {
											new Ext.ToolTip({ 
												target: this.id,
												id: 'autoNumbering',
												anchor: 'top',
												width: this.width + 50,
												title: Ext.app.Localize.get('Auto numbering') + '. ' + Ext.app.Localize.get('Select') + ' ' + Ext.app.Localize.get('template') + ':',
												tpl: new Ext.XTemplate(
													'<tpl for="results">',
													'<div style="cursor: pointer" onclick="Ext.app.UpdateField(\'{template}\')"> - {name}</div>',
													'</tpl>'),
												trackMouse: false,
												autoHide: false,
												closable: true,
												draggable: false,
												targetObject: this,
												listeners: {
													afterrender: function(){

														// This function will be used to apply generated agreement number to field
														Ext.app.UpdateField = function(A){
															Ext.Ajax.request({
																url: 'config.php',
																params: {
																	async_call: 1,
																	devision: 22,
																	getanumber: A
																},
																method: 'POST',
																scope: this,
																success: function(R) {
																	var O = Ext.util.JSON.decode(R.responseText);
																	try {
																		this.field.setValue(O.number)
																	}
																		catch(e){
																	}
																	this.tip.hide()
																}
															})
														}.createDelegate({ field: this.targetObject, tip: this });

														Ext.Ajax.request({
															url: 'config.php',
															method: 'POST',
															success: function(R){
																try {
																	var O = Ext.util.JSON.decode(R.responseText);
																	this.update(O)
																}
																catch(e){

																}
															}.createDelegate(this),
															params: {
																async_call: 1,
																devision: 22,
																getagrmtpls: 1
															}
														})
													}
												}
											})
										}
										
									}
								}
							}]
						},  
						{
                            xtype: 'tbspacer',
                            width: 10
                        },
                        {
							xtype: 'fieldset',
							border: false,
							labelWidth: 85,
							style: 'padding: 0',
							items: [{
								xtype: 'datefield',
								id: 'adate',
								format: 'Y-m-d',
								width: 97,
								fieldLabel: Ext.app.Localize.get('Date')
							}]
						}
						
					]},{
							xtype: 'fieldset',
							border: false,
							style: 'padding: 0',
							labelWidth: 175,
							items: [{	
								xtype: 'container',
								autoEl: 'div',
								layout: 'hbox',
								items: [{
									xtype: 'fieldset',
									border: false,
									width: 320,
									style: 'padding: 0',
									items: [{
										xtype: 'combo',
										id: 'paymentmethod',
										width: 132,
										fieldLabel: Ext.app.Localize.get('Payment method'),
									    mode: 'local',
									    allowBlank: false,
									    displayField: 'name',
		                				valueField: 'id',
									    triggerAction: 'all',
									    editable: false,
									    listeners: {
									    	afterrender: function(combo){
									    		combo.store.on('load', function(store){
									    			this.setValue(this.getValue());
									    		}, combo);
									    	},
									    	select: function(combo, record){
									    		var type = record.get('id'),
									    			cnt = combo.findParentByType('form');
									    		
									    		var	ablocktype = cnt.find('id', 'ablocktype')[0],
									    			ablockvalue = cnt.find('id', 'ablockvalue')[0],
									    			orderpayday = cnt.find('id', 'orderpayday')[0],
									    			blockorders = cnt.find('id', 'blockorders')[0];
									    		
								    			blockorders.setContainerVisible(type ==1 ? true : false);
								    			blockorders.setDisabled(type ==1 ? false : true);
								    			
								    			orderpayday.setContainerVisible(type ==1 ? true : false);
								    			orderpayday.setDisabled(type ==1 ? false : true);

								    			ablocktype.setDisabled(type ==0 ? false : true);
								    			ablockvalue.setDisabled(type ==0 ? false : true)
								    			ablocktype.setVisible(type ==0 ? true : false);
								    			ablockvalue.setContainerVisible(type ==0 ? true : false);
								    			
								    			cnt.doLayout();
									    	}
									    },
									    store: {
						                    xtype: 'jsonstore',
						                    root: 'results',
						                    fields: [
						                        { name: 'id', type: 'int' },
						                        { name: 'name', type: 'string' }
						                    ],
						                    autoLoad: false,
						                    baseParams: {
						                        async_call: 1,
						                        devision: 24,
						                        getavailablepaymethods: 1,
						                        agrmid: 0
						                    }
						                }
									}]
								},
								{
		                            xtype: 'tbspacer',
		                            width: 10
		                        },
								{
									xtype: 'fieldset',
									border: false,
									labelWidth: 85,
									style: 'padding: 0',
									items: [{
			                    		fieldLabel: Ext.app.Localize.get('Installment'),
			                            xtype:'textfield',
						                id: 'installments',
						                name: 'installments',
						                disabled:true,
						                readOnly:true,
						                editable:false,
						                width: 96,
						                listeners: {
						                	enable: function() {
												this.setDisabled(true);
											}
						                }
									}]
								}]
							}]
						},{
								xtype: 'fieldset',
								border: false,
								style: 'padding: 0',
								labelWidth: 175,
								items:[{
									xtype: 'container',
									autoEl: 'div',
									layout: 'hbox',
									items: [{
										xtype: 'fieldset',
										border: false,
										labelWidth: 175,
										style: 'padding: 0',
										items: [{
											xtype: 'textfield',
											fieldLabel: Ext.app.Localize.get('BalanceStatus'),
											id: 'balancestatus',
											name: 'balancestatus',
											width: 132,
											editable: false,
											disabled: true,
											listeners: {
												afterrender: function(){
													Ext.Ajax.request({
														url: 'config.php',
														method: 'POST',
														success: function(R){
															try {
																var response = (Ext.util.JSON.decode(R.responseText)).results;
																var balancestatus = response.balancestatus;
																var status='';
																if ( balancestatus == 1) {
																	status=Ext.app.Localize.get('unknown');
																} else if ( balancestatus == 2) {
																	status=Ext.app.Localize.get('debtor');
																} else if ( balancestatus == 3) {
																	status=Ext.app.Localize.get('denouncement');
																} else if ( balancestatus == 4) {
																	status=Ext.app.Localize.get('partner');
																} else {
																	status=Ext.app.Localize.get('unknown');
																}
																this.setValue(status);
																this.setDisabled(true);
															} catch(e){
															}
														}.createDelegate(this),
														params: {
															async_call: 1,
															devision: 22,
															agrmid: agrmid,
															getagrm_main_settings: 1
														}
													})
												},
												enable: function() {
													this.setDisabled(true);
												}
											}
										}]
									},
									{
			                            xtype: 'tbspacer',
			                            width: 17
			                        },
									{
										xtype: 'fieldset',
										border: false,
										style: 'padding: 0',
										labelWidth: 85,
										items: [{
				                    		fieldLabel: Ext.app.Localize.get('Date of terminate'),
				                            xtype:'datefield',
							                id: 'closedon',
							                name: 'closedon',
							                enabled: false,
							                editable: false,
											format: 'd.m.Y',
							                style: 'color: grey;',
							                labelStyle: 'color: grey;',
							                width: 97,
							                listeners: {
							                	enable: function() {
													this.setDisabled(true);
												}
							                }
										}]
									}]
									},
									
		                        {
									xtype: 'fieldset',
									border: false,
									style: 'padding: 0',
									labelWidth: 125,
									items:[{
										xtype: 'container',
										autoEl: 'div',
										layout: 'hbox',
										items: [{
											xtype: 'fieldset',
											border: false,
											width: 320,
											style: 'padding: 0',
											items: [{
												xtype: 'combo',
												id: 'ownerid',
												width: 182,
												fieldLabel: Ext.app.Localize.get('Agreement owner'),
											    mode: 'local',
											    allowBlank: false,
											    displayField: 'name',
				                				valueField: 'uid',
				                				value: 0,
				                				editable: false,
											    triggerAction: 'all',
											    listeners: {
											    	afterrender: function(combo){
											    		combo.store.on('load', function(store){
											    			store.insert(0, new store.recordType({
											    				uid: 0,
						   										name: Ext.app.Localize.get('Default')
											    			}));
											    			this.setValue(this.getValue());
											    		}, combo);
											    	}
											    },
											    store: {
								                    xtype: 'jsonstore',
								                    root: 'results',
								                    fields: [
								                        { name: 'uid', type: 'int' },
								                        { name: 'name', type: 'string' }
								                    ],
								                    autoLoad: true,
								                    baseParams: {
								                        async_call: 1,
								                        devision: 24,
								                        getopers: 1
								                    }
								                }
											}]
										}]
									}]
		                        }
								]
								}
		                        ]
                    },
                    {
						xtype: 'fieldset',
                        border: true, 
                        title: Ext.app.Localize.get('Options'), 
                        style: 'padding: 16px',
                        labelWidth: 175,
                        items: [
                        {
						    xtype: 'fieldset',
	                        border: false,
	                        style: 'padding: 0',
	                        labelWidth: 175,
						    items: [{
						        xtype: 'hidden',
	                            id: 'friendagrmid',
	                            name: 'friendagrmid'
						    }, {
						        xtype: 'container',
						        layout: 'hbox',
						        fieldLabel: "\"" + Ext.app.Localize.get('Invite friend') + "\"",
	                            items: [{
	                                xtype: 'button',
	                                iconCls: 'ext-hand',
	                                tooltip: Ext.app.Localize.get('Agreements'),
	                                handler: function(Btn) {
	                                    selectAgreements({
	                                        modal: true,
	                                        sm: true,
	                                        callbackok: function(grid) {
	                                            var record = grid.getSelectionModel().getSelected(),
	                                                vals = this.getForm().getValues();

	                                            this.getForm().setValues({
	                                                friendagrmid: record.get('agrmid'),
	                                                friendnumber: record.get('number')
	                                            });
	                                        }.createDelegate(Btn.findParentByType('form'))
	                                    });
	                                }
	                            }, {
	                                xtype: 'tbspacer',
	                                width: 5
	                            }, {
	                                xtype: 'textfield',
	                                id: 'friendnumber',
	                                name: 'friendnumber',
	                                readOnly: true,
	                                cls: 'textfield-body-hide',
	                                flex: 1
	                            }]
						    }]
						},
	                    {
						    xtype: 'fieldset',
	                        border: false,
	                        style: 'padding: 0',
	                        labelWidth: 175,
						    items: [{
						        xtype: 'hidden',
	                            id: 'parentagrmid',
	                            name: 'parentagrmid'
						    }, {
						        xtype: 'hidden',
	                            id: 'uidd',
	                            name: 'uidd'
						    }, {
						        xtype: 'container',
						        layout: 'hbox',
						        fieldLabel: Ext.app.Localize.get('Parent agreement'),
	                            items: [{
	                                xtype: 'button',
	                                iconCls: 'ext-hand',
	                                tooltip: Ext.app.Localize.get('Agreements'),
	                                handler: function(Btn) {
                                        var findParentAgrmids = function() {
                                            var fields =Ext.query('input[type=hidden]', Ext.getBody().dom),
                                                pattern = new RegExp('^(agrms|new_agrms)\\[([0-9]+)\\]\\[parentagrmid\\]'),
                                                values = [],
                                                matches;
                                            Ext.each(fields, function(field){
                                                matches = pattern.exec(field.name);
                                                if (matches && parseInt(field.value, 0)) {
                                                    values.push(matches[2]);
                                                }
                                            });
                                            return values;
                                        };
	                                    selectAgreements({
	                                        modal: true,
	                                        sm: true,
	                                        filter: {
	                                            userid: Ext.getCmp('uidd').getValue() > 0 ? Ext.getCmp('uidd').getValue() : Ext.get('_uid_').getValue(),
	                                            not_in_agrm: [agrmid].concat(findParentAgrmids()).join(',')
	                                        },
	                                        callbackok: function(grid) {
	                                            var record = grid.getSelectionModel().getSelected(),
	                                                vals = this.getForm().getValues();
	                                            this.getForm().setValues({
	                                                parentagrmid: record.get('agrmid'),
	                                                parentnumber: record.get('number')
	                                            });
	                                        }.createDelegate(Btn.findParentByType('form'))
	                                    });
	                                }
	                            }, {
	                                xtype: 'tbspacer',
	                                width: 5
	                            },{
	                                xtype: 'button',
	                                iconCls: 'ext-erase',
	                                tooltip: Ext.app.Localize.get('Clear'),
	                                handler: function(Btn) {
	                                	Btn.findParentByType('form').getForm().findField('parentagrmid').setValue(0);
	                                	Btn.findParentByType('form').getForm().findField('parentnumber').setValue("");
	                                }
	                            }, {
	                                xtype: 'tbspacer',
	                                width: 5
	                            }, {
	                                xtype: 'textfield',
	                                id: 'parentnumber',
	                                name: 'parentnumber',
	                                readOnly: true,
	                                cls: 'textfield-body-hide',
	                                flex: 1
	                            }]
						    }]
	                    },{
                    		fieldLabel: Ext.app.Localize.get('Bill is unpaid after this day of month'),
                            xtype:'numberfield',
                            editable: false,
							disabled: true,
			                id: 'orderpayday',
			                name: 'orderpayday',
			                minValue: 0,
			                allowDecimals: false,
			                labelStyle: 'width:330px',
			                width: 184,	
			                listeners: {
			                	enable: function() {
			                		
			                		if(Ext.getCmp('paymentmethod').getValue()!=1)
			                		{
										this.setDisabled(true);
										this.setContainerVisible(false);
			                		}
								}
			                }
			                
	                    },
	                    {
	                    		fieldLabel: Ext.app.Localize.get('Lockout limit by number of unpaid bills'),
	                            xtype:'numberfield',
	                            editable: false,
								disabled: true,
				                id: 'blockorders',
				                name: 'blockorders',
				                minValue: 0,
				                allowDecimals: false,
				                labelStyle: 'width:330px',
				                width: 184,
				                listeners: {
				                	enable: function() {
										if(Ext.getCmp('paymentmethod').getValue()!=1)
										{
											this.setDisabled(true);
											this.setContainerVisible(false);
										}
									}
				                }
	                    },{
							xtype: 'container',
							autoEl: 'div',
							layout: 'hbox',
							items:[{
									xtype: 'combo',
									id: 'ablocktype',
									name: 'ablocktype',
									width: 312,
									displayField: 'name',
									valueField: 'id',
									typeAhead: true,
									mode: 'local',
									triggerAction: 'all',
									value: 0,
									editable: false,
									disabled: true,
									store: new Ext.data.ArrayStore({
										data: [
										
											['0', Ext.app.Localize.get('Unlocking limit in days')],
											['1', Ext.app.Localize.get('Unlocking limit in months')],
											['2', Ext.app.Localize.get('Unlocking limit in account currency')]
										],
										fields: ['id', 'name']
									}),
									listeners: {
										select: function(){
		
										},
										enable: function() {
											if(Ext.getCmp('paymentmethod').getValue()!=0)
											{
												this.setDisabled(true);
												this.setVisible(false);
											}
										}
									}
								},									
								{
									xtype: 'fieldset',
									border: false,
									labelWidth: 16,
									style: 'padding: 0',
									items: [{
										xtype: 'numberfield',
										editable: false,
										disabled: true,
			                            id: 'ablockvalue',
			                            name: 'ablockvalue',
										width: 184,
						                listeners: {
						                	enable: function() {
												if(Ext.getCmp('paymentmethod').getValue()!=0)
												{
													this.setDisabled(true);
													this.setContainerVisible(false);
												}
											}
						                }
									}]
								
		                    	 }]
		                 	},{
						xtype: 'fieldset',
						border: false,
						style: 'padding: 0',
						labelWidth: 328,
						items: [
						{
							xtype: 'combo',
							fieldLabel: Ext.app.Localize.get('Penalty accrual method'),
							id: 'penaltymethod',
							name: 'penaltymethod',
							width: 184,
							displayField: 'name',
							valueField: 'id',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							value: 0,
							editable: false,
							store: new Ext.data.ArrayStore({
								data: [
									['0', Ext.app.Localize.get('Do not accrue')],
									['1', Ext.app.Localize.get('Accrue')]
								],
								fields: ['id', 'name']
							}),
							listeners: {
								select: function(){

								}
							}
						},				
                    {
                    		fieldLabel: Ext.app.Localize.get('Priority allocation'),
                            xtype:'numberfield',
			                id: 'priority',
			                name: 'priority',
			                minValue: 0,
			                disabled: false,
			                labelStyle: 'width:330px',
			                width: 184
                    }
						]
					}]
						}
		            ]
					}]
					},
		            {
						title: Ext.app.Localize.get('Additional fields for agreements'),
						height: 650,
						items: [{
				            xtype: 'grid',
							id: 'agrmFormFields',
				            height: 650,
				            loadMask: true,
				            autoExpandColumn: 'ppvalues',
				            plugins: [Edit, Remove],
				            tbar: [{
				                xtype: 'button',
				                iconCls: 'ext-add',
				                text: Ext.app.Localize.get('Add new record'),
				                handler: function(){
				                    createField()
				                }
				            }],
				            cm: new Ext.grid.ColumnModel([Edit, {
				                header: Ext.app.Localize.get('Description'),
				                dataIndex: 'descr',
				                width: 160
				            }, {
				                header: Ext.app.Localize.get('Field'),
				                dataIndex: 'name',
				                width: 90
				            }, {
				                header: Ext.app.Localize.get('Type'),
				                dataIndex: 'type',
				                width: 65,
				                renderer: function(v){
				                    if (v == 1) {
				                        return Ext.app.Localize.get('List')
				                    }
				                    else {
				                        return Ext.app.Localize.get('Text')
				                    }
				                }
				            }, {
				                header: Ext.app.Localize.get('Defined values'),
				                id: 'ppvalues',
				                dataIndex: 'strvalue'
				            }, Remove]),
				            store: Fields
						}]
					}, {
					    title: Ext.app.Localize.get('Customer equipment'),
		                height: 650,
		                xtype: 'grid',
		                id: 'gridagrmwin',
		                PAGELIMIT: 100,
		                loadMask: true,
		                autoExpandColumn: 'ina-cli-dev-col-exp',
		                disabled: agrmid > 0 ? false : true,
		                signDevices: function(grid, reason) {
		                	
		                    var sel = grid.getSelectionModel().getSelections(),
		                        list = {};
		                        
		                    Ext.each(sel, function(record, idx) {
									
		                    	if(record.data.agrmid!=this.agrmid)
		                    	{
		                    		record.data.cardid = 0;
		                    	}

		                        Ext.iterate(record.data, function(key, value){
		                            this.list['devs[' + this.idx + '][' + key + ']'] = value;
		                        }, {
		                            list: this.list,
		                            idx: idx
		                        });
		                        this.list['devs[' + idx +'][agrmid]'] = this.agrmid;	
		                        
		                    }, {
		                        list: list,
		                        agrmid: this.agrmid
		                    });
							
							if(this.agrmid == 0) {
			                    Ext.Ajax.request({
			                        url: 'config.php',
			                        method: 'POST',
			                        params: Ext.apply({
			                            async_call: 1,
			                            devision: 27,
			                            setagrmequip: 1,
			                            reason: reason
			                        }, list),
			                            scope: {
			                                grid: this.grid
			                            },
			                        callback: function(opt, success, res) {
			                            try {
			                                var data = Ext.decode(res.responseText);

			                                if(!data.success) {
			                                    throw(data.error);
			                                }

			                                this.grid.getStore().reload();
			                            }
			                            catch(e) {
			                                Ext.Msg.error(e);
			                            }
			                        }
			                    });
							}
		                    
		                },
		                listeners: {
		                    afterrender: function(grid) {
		                        grid.getStore().reload();
		                    },
		                    beforerender: function(grid) {
		                        // Add selection
		                        var model = grid.getColumnModel();
		                        model.config.unshift(grid.getSelectionModel())
		                        model.setConfig(model.config);
		                        // Set paging bar
		                        grid.ownerCt.addPB(grid);
		                    }
		                },
		                tbar: [{
		                    xtype: 'button',
		                    text: Ext.app.Localize.get('Add'),
		                    iconCls: 'ext-add',
		                    handler: function(Btn) {
		                        var fn = Btn.findParentByType('grid').signDevices;
		                        showDevicesPanel({
		                            modal: true,
		                            disableSmartCards: true,
		                            activeItem: 1,
		                            parentagrmid: agrmid,
		                            EQSingle: true,
		                            callback: fn.createDelegate({
		                                grid: Btn.findParentByType('grid'),
		                                agrmid: agrmid
		                            })
		                        });
		                    }
		                }, {
		                    xtype: 'tbspacer',
		                    width: 5
		                }, {
		                    xtype: 'button',
		                    text: Ext.app.Localize.get('Unsign selected'),
		                    handler: function(Btn) {
		                        Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to unsign selected'), function(Btn){
		                            if(Btn != 'yes') {
		                                return;
		                            };
		                            
		                            Ext.MessageBox.minPromptWidth = 380;
		                            Ext.Msg.prompt(Ext.app.Localize.get('Change/return'), Ext.app.Localize.get('Reason of change/return'), function(btn, text){
									    if (btn == 'ok')
									    {
									    	var grid = this.findParentByType('grid'),
				                                fn = grid.signDevices.createDelegate({
				                                    grid: grid,
				                                    agrmid: 0
				                                });
				
				                            fn(grid, text);
									    }
		                            }, this);
		                            
		                            
		                            
		                        }, this);
		                    }
		                }],
		                sm: new Ext.grid.CheckboxSelectionModel(),
		                columns: [{
		                header: Ext.app.Localize.get('Name'),
		                dataIndex: 'name'
		                }, {
		                    header: Ext.app.Localize.get('Serial number'),
		                    dataIndex: 'serial'
		                }, {
		                    header: Ext.app.Localize.get('Model'),
		                    dataIndex: 'modelname'
		                }, {
		                    header: Ext.app.Localize.get('Smart card'),
		                    dataIndex: 'cardserial'
		                }, {
		                    header: Ext.app.Localize.get('Chip ID'),
		                    dataIndex: 'chipid'
		                }, {
		                    header: Ext.app.Localize.get('MAC'),
		                    dataIndex: 'mac'
		                }, {
		                    header: Ext.app.Localize.get('Description'),
		                    dataIndex: 'descr',
							width:130,
		                    id: 'ina-cli-dev-col-exp'
		                }, {
		                    header: Ext.app.Localize.get('Service'),
		                    dataIndex: 'catdescr'
		                }],
		                bbar: {
		                    xtype: 'paging',
		                    pageSize: 0,
		                    displayInfo: true
		                },
		                store: {
		                    xtype: 'jsonstore',
		                    url: 'config.php',
		                    root: 'results',
		                    method: 'POST',
		                    fields: [
		                        { name: 'id', type: 'int' },
		                        { name: 'name', type: 'string' },
		                        { name: 'catdescr', type: 'string' },
		                        { name: 'descr', type: 'string' },
		                        { name: 'serial', type: 'string' },
		                        { name: 'agrmnum', type: 'string' },
		                        { name: 'vglogin', type: 'string' },
		                        { name: 'agrmid', type: 'int' },
		                        { name: 'cardid', type: 'int' },
		                        { name: 'modelid', type: 'int' },
		                        { name: 'modelname', type: 'string' },
								{ name: 'serialformat', type: 'int' },
		                        { name: 'cardserial', type: 'string' },
		                        { name: 'chipid', type: 'string' },
								{ name: 'mac', type: 'string' },
								{ name: 'vgid', type: 'int' }
		                    ],
		                    baseParams: {
		                        async_call: 1,
		                        devision: 27,
		                        getcldevices: 1,
		                        agrmid: agrmid
		                    }
		                }
					}, {
					    title: Ext.app.Localize.get('Promotions'),
					    xtype: 'editorgrid',
					    clicksToEdit: 1,
					    PAGELIMIT: 100,
					    height: 650,
					    loadMask: true,
					    disabled: agrmid > 0 ? false : true,
					    autoExpandColumn: 'promo-name-col-exp',
					    signPromotions: function(grid) {
					        var record = grid.getSelectionModel().getSelected();

					        if(!record) {
					            return;
					        }

					        new Ext.Window({
					            title: Ext.app.Localize.get('Valid time'),
					            constrain: true,
					            modal: true,
					            layout: 'fit',
					            width: 250,
					            height: 130,
					            items: {
					                xtype: 'form',
					                url: 'config.php',
					                frame: true,
					                monitorValid: true,
					                labelWidth: 50,
					                buttonAlign: 'center',
					                defaults: {
					                    anchor: '100%',
					                    xtype: 'hidden'
					                },
					                buttons: [{
					                    xtype: 'button',
					                    text: Ext.app.Localize.get('Save'),
					                    bindForm: true,
					                    handler: function(Btn) {
					                        var form = Btn.findParentByType('form');

					                        if(!form.getForm().isValid()) {
					                            return
					                        }

					                        form.getForm().submit({
					                            url: 'config.php',
		                                        method: 'POST',
		                                        scope: {
		                                            win: form.ownerCt
		                                        },
		                                        params: {
		                                            async_call: 1,
		                                            devision: 122,
		                                            setpromostaff: 1
		                                        },
		                                        waitTitle: Ext.app.Localize.get('Connecting'),
		                                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
		                                        success: function(form, action) {
		                                            if(this.win.parent.store) {
		                                                this.win.parent.store.reload({
		                                                    params: {
		                                                        start: 0
		                                                    }
		                                                });
		                                            }
		                                            this.win.close();
		                                        },
		                                        failure: function(form, action) {
		                                            Ext.Msg.error(action.result.error);
		                                        }
					                        });
					                    }
					                }],
					                items: [{
					                    name: 'recordid'
					                }, {
					                    name: 'actionid'
					                }, {
					                    name: 'members[][agrmid]'
					                }, {
					                    xtype: 'datefield',
					                    fieldLabel: Ext.app.Localize.get('Since'),
					                    name: 'dtfrom',
					                    allowBlank: false,
					                    format: 'd.m.Y'
					                }, {
					                    xtype: 'datefield',
					                    fieldLabel: Ext.app.Localize.get('Till'),
					                    name: 'dtto',
					                    allowBlank: true,
					                    format: 'd.m.Y'
					                }]
					            }
					        }).show(null, function(win) {
					            var data = Ext.apply(this.record.data, {
					                recordid: 0,
					                actionid: this.record.get('recordid'),
					                'members[][agrmid]': this.grid.store.baseParams.agrmid,
					                dtfrom: new Date(),
					                dtto: !Ext.isDate(this.record.get('dtto')) || this.record.get('dtto').format('Y') <= 1900 ? null : this.record.get('dtto')
					            });

					            win.get(0).getForm().setValues(data);
					            win.parent = this.grid;
					        }, {
					            record: record,
					            grid: this.grid
					        });
					    },
					    listeners: {
					        afterrender: function(grid) {
					            grid.getStore().on('update', function(store, record, action){
					                if(action == Ext.data.Record.EDIT) {
					                	
					                	var params = Ext.apply(record.data, {
	                                        async_call: 1,
	                                        devision: 122,
	                                        setpromostaff: 1
	                                    });
					                	params['members[0][agrmid]'] = record.get('agrmid');
					                	
					                    Ext.Ajax.request({
		                                    url: 'config.php',
		                                    timeout: 3800000,
		                                    method: 'POST',
		                                    params: params,
		                                    scope: {
		                                        record: record,
		                                        store: store
		                                    },
		                                    callback: function(opt, success, resp){
		                                        try {
		                                            // Decode JSON data
		                                            var data = Ext.decode(resp.responseText)

		                                            if(!data['success']) {
		                                                throw(data.error);
		                                            }

		                                            this.store.commitChanges();
		                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
		                                        }
		                                        catch(e) {
		                                            Ext.Msg.error(e);
		                                        }
		                                    }
		                                });
					                }
					            });
		                        grid.getStore().reload({
		                            params: {
		                                start: 0
		                            }
		                        });
		                    },
		                    beforerender: function(grid) {
		                        // Set paging bar
		                        grid.ownerCt.addPB(grid);
		                    }
					    },
					    tbar: [{
					        xtype: 'button',
		                    text: Ext.app.Localize.get('Add'),
		                    iconCls: 'ext-add',
		                    handler: function(Btn) {
		                        var fn = Btn.findParentByType('editorgrid').signPromotions;
		                        showPrmotionPanel({
		                            grid: {
		                                singleSelect: true,
		                                editBtn: true,
		                                rmBtn: true,
		                                filter: {
		                                    category: 1
		                                }
		                            },
		                            win: {
		                                callback: fn.createDelegate({
		                                    grid: Btn.findParentByType('editorgrid'),
		                                    agrmid: agrmid
		                                })
		                            }
		                        });
		                    }
					    }],
					    columns: [{
					        header: Ext.app.Localize.get('Name'),
					        id: 'promo-name-col-exp',
					        dataIndex: 'actionname'
					    },{
					        header: Ext.app.Localize.get('Assigned by'),
					        width: 220,
					        dataIndex: 'mgrname',
					        renderer: function (value, meta, record) {
					        	if (record.get('personid') < 0) {
					        		return record.get('username');
					        	}
					        	return value;
					        },
					    }, {
					        header: Ext.app.Localize.get('Since'),
					        dataIndex: 'dtfrom',
					        width: 110,
					        editor: {
					            xtype: 'datefield',
					            format: 'd.m.Y',
					            allowBlank: false
					        },
					        renderer: function(value) {
					            try {
					                return value.format('d.m.Y');
					            }
					            catch(e) { }
					        }
					    }, {
					        header: Ext.app.Localize.get('Till'),
		                    dataIndex: 'dtto',
		                    width: 110,
		                    editor: {
		                        xtype: 'datefield',
		                        format: 'd.m.Y'
		                    },
		                    renderer: function(value) {
		                        try {
		                            if(value.format('Y') < 1900) {
		                                return Ext.app.Localize.get('No limits');
		                            }
		                            return value.format('d.m.Y');
		                        }
		                        catch(e) { }
		                    }
					    }],
					    bbar: {
		                    xtype: 'paging',
		                    pageSize: 0,
		                    displayInfo: true
		                },
					    store: {
					        xtype: 'jsonstore',
					        root: 'results',
					        fields: [
		                        { name: 'actionid', type: 'int' },
		                        { name: 'recordid', type: 'int' },
		                        { name: 'uid', type: 'int' },
		                        { name: 'userlogin', type: 'string' },
		                        { name: 'username', type: 'string' },
		                        { name: 'tarid', type: 'int' },
		                        { name: 'tardescr', type: 'string' },
		                        { name: 'agrmnum', type: 'string' },
		                        { name: 'agrmid', type: 'int' },
		                        { name: 'vglogin', type: 'string' },
		                        { name: 'vgid', type: 'int' },
		                        { name: 'actionname', type: 'string' },
		                        { name: 'personid', type: 'int' },
		                        { name: 'mgrname', type: 'string' },
		                        { name: 'dtfrom', type: 'date', dateFormat: 'Y-m-d' },
		                        { name: 'dtto', type: 'date', dateFormat: 'Y-m-d' }
					        ],
					        baseParams: {
					            async_call: 1,
					            devision: 122,
					            getpromostaff: 1,
					            agrmid: agrmid
					        }
					    }
			}]
		}]
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
                value: 22
            }, {
                xtype: 'hidden',
                name: 'delafrmfds',
                value: r.get('name')
            }],
            renderTo: document.body
        });
        fm.getForm().submit({
            method: 'POST',
            waitTitle: Ext.app.Localize.get('Connecting'),
            waitMsg: Ext.app.Localize.get('Sending data') + '...',
            success: function(form, action){
				AInputs.clearElement(r.data.name);
                g.store.reload();
                fm.destroy();
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', obj.errors.reason);
                }
                fm.destroy();
            }
        });
    });
}

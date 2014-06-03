/**
 * Show form to start genration process for the documents
 *
 * Repository information:
 * $Date: 2009-08-07 15:49:06 $
 * $Revision: 1.1.2.7 $
 */



Ext.onReady(function(){
	// Place controls to the document body
	setControls();
	//queueGrid();
});



// Function to compose storage base params for server list filtering
// @param	boolean, if pass true to function than call storage load
// @param	boolean, reset list

function advSearch(l,r,e){
	var c = Ext.getCmp('advSearchList');
	var n = new RegExp('searchtpl','i');
	var s = {};
	var l = l || false;
	if(r == true){
		c.setValue('');
	}
	
	if (e == true) c.setEnqueueModeFieldValue(1);
	else c.setEnqueueModeFieldValue(0);
	
	var form = Ext.get('CreateDoc');
	Ext.each(form.query('input'), function(item){
		if(Ext.isDefined(item['name']) && /searchtpl.*/.test(item.name)) {
			Ext.get(item).remove();
		}
	});

	if(c.mainStore.find('tplname', c.getValue()) > -1) {
		c.mainStore.each(function(r,idx){
			if(r.data.tplname != this.tplname) {
				return;
			}
			for(var i in r.data) {
				if(i == 'tplname') {
					continue;
				}
				this.form.createChild('<input type="hidden" name="' + 'searchtpl[' + idx + '][' + i + ']' + '" value="' + r.data[i] + '">');
			}
		}, {
			tplname: c.getValue(),
			form: form
		});
	}
	if(l) {
		sendGenerate(form.dom, e);
	}
}

function setControls() {
	// View Cookie name
	var COOKIE = 'node108';

	new Ext.Container({
		renderTo: 'AFilterPlace',
		layout: 'hbox',
		width: 440,
		items: [{
			xtype: 'combo',
			id: 'advSearchList',
			width: 220,
			displayField: 'tplname',
			valueField: 'tplname',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: true,
			enqueueMode: false,
			refreshQueueGridIfNecessary: function() {
				if (this.enqueueMode) Ext.getCmp('QueueGridPanel').getStore().reload();
			},
			setEnqueueModeFieldValue: function(value) {
				if (value == 1) this.enqueueMode = true;
				else this.enqueueMode = false;
				Ext.query('input[name=enqueueMode]')[0].value = value;
			},
			listeners: {
				select: function() {
					if(Ext.app.DefaultView.exists(COOKIE)) {
						Ext.app.DefaultView.set(COOKIE, {
							x6: this.getRawValue()
						})
					}
				}
			},
			store: {
				xtype: 'arraystore',
				fields: [{ name: 'tplname', type: 'string' }],
				data: []
			},
			mainStore: new Ext.data.Store({
				proxy: new Ext.data.HttpProxy({
					url: 'config.php',
					method: 'POST'
				}),
				reader: new Ext.data.JsonReader({
					root: 'results'
				}, [
					{ name: 'tplname', type: 'string' },
					{ name: 'property', type: 'string' },
					{ name: 'condition', type: 'string' },
					{ name: 'date', type: 'date', dateFormat: 'd-m-Y' },
					{ name: 'value', type: 'string' },
					{ name: 'logic', type: 'string' }
				]),
				baseParams: {
					async_call: 1,
					devision: 42,
					getallsearchtpl: ''
				},
				autoLoad: true,
				listeners: {
					add: function(s,r,i){
						var C = Ext.getCmp('advSearchList');
						Ext.each(r, function(A){
							if(this.store.find('tplname', A.data.tplname) < 0) {
								this.store.add(A);
							}
							if(this.cookie && this.cookieData == A.data.tplname) {
								this.element.setValue(A.data.tplname);
								new Ext.util.DelayedTask(function(){
									this.advSearch(AUTOLOAD);
								}.createDelegate(Ext.getCmp('AgrmsGrid'))).delay(Ext.isGeko ? 160 : 90);
							}
						}, {
							element: C,
							store: C.store,
							mainStore: C.mainStore,
							cookie: Ext.app.DefaultView.exists(COOKIE),
							cookieData: Ext.app.DefaultView.asBoolean(Ext.app.DefaultView.get(COOKIE, 'x5', false)) ? Ext.app.DefaultView.get(COOKIE, 'x6') : null
						});
					},
					load: function(s,r,i){
						s.events.add.listeners[0].fn(s,r,i);
					},
					remove: function(s,r,i){
						var C = Ext.getCmp('advSearchList');
						var f = C.store.find('tplsname', r.data.tplname);
						if(f > -1) {
							C.store.remove(C.store.getAt(f));
						}
					}
				}
			})
		}, {
			xtype: 'tbspacer',
			width: 5
		}, {
			xtype: 'button',
			flex: 1,
			text: Ext.app.Localize.get('Change') + '&nbsp;' + Ext.app.Localize.get('rules') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
			handler: function(){
				fn = function(A){
					var C = Ext.getCmp('advSearchList');
					C.mainStore.each(function(r){
						if(r.data.tplname == this.tplname) {
							this.store.remove(r);
						}
					}, { store: C.mainStore, tplname: A.tplname});
					if(A.data.length > 0) {
						Ext.each(A.data, function(A){
							this.add(new this.recordType(A))
						}, C.mainStore);
						if(!Ext.isEmpty(A.data[0].tplname)) {
							C.setValue(A.data[0].tplname);
						}
					}
					else {
						var i = C.store.find('tplname', A.tplname);
						if(i > -1) {
							C.store.remove(C.store.getAt(i));
						}
						C.setValue('');
					}
				};
				var C = Ext.getCmp('advSearchList');
				var rules = [];
				C.mainStore.each(function(R){
					if(this.tplname == R.data.tplname){
						this.rules.push(R.data);
					}
				}, { rules: rules, tplname: C.getValue() });
				new SearchTemplate.show({
					tplname: C.getValue(),
					onsearch: fn,
					onsave: fn,
					onSaveClose: true,
					rules: rules
				})
			}
		}]
	});
}


/**
 * Object that contains form data to send
 *
 */
Generate = {
	ctrl: [
		'tplid',
		'drawYear',
		'drawMonth',
		'drawDay',
		'firstDoc',
		'periodYear',
		'periodMonth',
		'userent',
		'sum',
		'docfor_1',
		'docfor_2',
		'docfor_3',
		'userid',
		'ugroup',
		'operator'
	],
	form: false,
	initValues: function() {
		for (var i in this.ctrl) {
			try {
				var A = Ext.get(this.ctrl[i]);
				this.values[A.dom.id] = A.dom;
			} catch (e) {
				continue
			}
		};
		this.getDocType();
		this.validate();
	},
	docType: 0,
	getDocType: function() {
		for (var i = 0, off = this.values.tplid.options.length; i < off; i++) {
			if (this.values.tplid.options[i].selected) {
				this.docType = nodeAttributes(this.values.tplid.options[i]);
				return this.docType;
				break;
			}
		}
	},
	values: {},
	valid: true,
	validate: function() {
		var A = this.values;
		if ((this.docType.type == 2 || this.docType.type == 3) && !A.userent.checked && parseInt(A.sum.value) <= 0) {
			alert(1);
			this.valid = false;
			return;
		};
		if (this.docType.type == 1 && (parseInt(A.periodYear.value) <= 0 || parseInt(A.periodMonth.value) <= 0)) {
			this.valid = false;
			return;
		};
		this.valid = true;
	}
}
/**
 * Change fields view on document type
 * @param	object, HTML select element
 * @param	object, HTML form element
 */
function docType( A, B )
{
	if (Ext.isEmpty(Ext.get(A)) || Ext.isEmpty(Ext.get(B))) {
		return false;
	}
	getSelected = function(A){
		for (var i = 0, off = A.options.length; i < off; i++) {
			if (A.options[i].selected) {
				return A.options[i];
			}
		}
	}
	var C = nodeAttributes(getSelected(A));
	document.getElementById('prepayctrl').style.display = (C.type == 2 || C.type == 3) ? '' : 'none';
	createHidOrUpdate('CreateDoc', 'doctype', C.type);
}


/**
 * Change fileds view on selected radio button
 * @param	object, array of element to disable
 * @param	object, array of element to enable
 */
function Control( A, B ) {
	if(!Ext.isEmpty(A)) { if(typeof A != 'object'){ var A = [A]; }; Ext.each(A, function(A){ elementState(A, true)}) }
	if(!Ext.isEmpty(B)) { if(typeof B != 'object'){ var B = [B]; }; Ext.each(B, function(A){ elementState(A, false)}) }
} // end Control()


/**
 * Fill data from the selected user item
 * @param	object, Ext grid element
 */
function setUserValue( A ) {
	if(Ext.isEmpty(A.getSelectionModel().getSelected()))
		return false;
	else
		var B = A.getSelectionModel().getSelected();

	try {
		document.getElementById('agrmDocBloc').style.display = 'block';
		document.getElementById('docfor_3').checked = true;
		//createHidOrUpdate('CreateDoc', 'userid', B.data.uid);
		document.getElementById('userid').value = B.data.uid;
		document.getElementById('userhrefname').innerHTML = (B.data.name != "") ? B.data.name : ((B.data.login != "") ? record.data.login : "___________");
	} catch(e) { }
} // end setUserValue()


/**
 * Send data to generate
 * @param	object, HTML form element
 */
function sendGenerate(A){
    Generate.form = A;
    Generate.initValues();
    if (!Generate.valid) {
        if (Generate.docType.type == 1) {
            alert(Localize.EmptyField + ': ' + Localize.Period);
        }
        if (Generate.docType.type == 2 || Generate.docType.type == 3) {
            alert(Localize.EmptyField + ': ' + Localize.Sum);
        }
    }
    else {
        sendForm(A, function(response){
            try {
                obj = Ext.util.JSON.decode(response.responseText);
                if (obj.success == false) {
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.isEmpty(obj.reason) ? (Localize.UServerErr) : (Localize.ServerErr + ': ' + obj.reason));
                }
                else {
                	Ext.getCmp('advSearchList').refreshQueueGridIfNecessary();
                	if (!Ext.getCmp('advSearchList').enqueueMode) {
                   		Ext.Msg.confirm(Localize.Success, Localize.Success + '.<br>' + Localize.GoView + '?', function(A){
                        	if (A == 'yes') {
                            	createHidOrUpdate('CreateDoc', 'defaultview[getdocument]', document.getElementById('tplid').value);
                            	if (Generate.getDocType().type < 2) {
                                	createHidOrUpdate('CreateDoc', 'defaultview[period]', document.getElementById('periodYear').value + '-' + ((document.getElementById('periodMonth').value.length < 2) ? '0' + document.getElementById('periodMonth').value : document.getElementById('periodMonth').value));
                            	}
                            	submitForm('CreateDoc', 'devision', 105);
                        	}
                    	});
                   }
                }
            }
            catch (e) {
                Ext.Msg.alert(Localize.Error, Localize.UServerErr);
            }
        })
    }
} // end sendGenerate()


/**
 * Send background form data to server
 * @param	string / HTMLElement of the form to pass
 * @param	function, call this on success response
 * @param	function, call this on fail response
 */
function sendForm( A, success, failure )
{
	if(Ext.isEmpty(success)) { success = function(){ } }
	if(Ext.isEmpty(failure)) { failure = function(){ } }
	// Add hidden to from to send as background
	createHidOrUpdate(A, 'async_call', 1); createHidOrUpdate(A, 'generate', 1);
	var W = Ext.MessageBox.wait(Localize.Connecting, Localize.SendingData);
	Ext.Ajax.request({ form: A, method: 'POST', timeout:580000, url: 'config.php', success: function(A){ W.hide(); success(A) }, failure: function(A){ W.hide(); failure(A) } });
	Ext.get('_async_call_').remove(); Ext.get('_generate_').remove();
} // end sendFor()



function selectDocAgrm(el, filter) {
	if(!Ext.isDefined(el)) {
		return false;
	}
	if(!Ext.isObject(el) || Ext.isElement(el)) {
		var el = Ext.get(el);
		el.box = el.getBox();
	}
	selectAgreements({
		title: Ext.app.Localize.get('Agreements'),
		sm: true,
		filter: {
			userid: filter.userid,
			archive: 0
		},
		callbackok: function(ret){
			record = ret.getSelectionModel().getSelected();
			try {
				document.getElementById('agrmid').value = record.data.agrmid;
				el.dom.innerHTML = record.data.number;
				return true;
			} catch(e) {
				return false;
			}
		}
	});
	return true;
}
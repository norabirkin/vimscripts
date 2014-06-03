/**
 * SBSS - CRM common function
 *
 */


/**
 * Expand request class group
 * @param	object form
 * @param	integer to compare group id
 */
function expandGroup(form, value)
{
	if(!form) return false;
	formValue = document.getElementsByName('group_class')[0].value;
	
	if(formValue != value) {
		formValue = value;
	} else {
		formValue = -1;
	}
	
	document.getElementsByName('group_class')[0].value = formValue;
	document.getElementById('_sbssForm').submit();
} // end expandGroup()


/**
 * Show / hide status block list
 * @param	object checkbox
 * @param	string block id
 */
function sbssShowStatuses( Caller, id )
{
	try {
		if(Caller.checked) document.getElementById(id).style.display = "";
		else document.getElementById(id).style.display = "none";
	} catch(e) { }
} // end sbssShowStatuses()


/**
 * Create new hidden element or edit existing with new value and submit form
 * @param	string form Id
 * @param	string form element name
 * @param	string new value for the element
 */
function sbssSubmitFor( _formId, _elName, _value )
{
	try {
		createHidOrUpdate(_formId, _elName, _value);
		document.getElementById(_formId).submit();
	} catch(e) { alert(e.toString()) }
} // end viewTicket()


/**
 * Create new hidden element or edit existing with new value
 * @param	string form Id
 * @param	string form element name
 * @param	string new value for the element
 */
function createHidOrUpdate( _formId, _elName, _value )
{
	try {
		if(!document.getElementById('_' + _elName + '_'))
		{
			var hid = document.createElement("input");
			hid.type = "hidden";
			hid.name = _elName;
			hid.id = '_' + _elName + '_';
			document.getElementById(_formId).appendChild(hid);
		}
		else var hid = document.getElementById('_' + _elName + '_');
		hid.value = _value;
	} catch(e) { alert(e.toString()) }
} // end createHidOrUpdate()


/**
 * Check search selector value and block givven elements
 * @param	string selector id
 * @param	string element to block
 */
function searchCheck( _selId, _inpId, _sel2Id )
{
	try {
		if(document.getElementById(_selId).value == -3)
			document.getElementById(_selId).options[0].selected = true;
		
		if(document.getElementById(_selId).value > -1)
		{
			document.getElementById(_inpId).disabled = true;
			document.getElementById(_inpId).style.display = "none";
			document.getElementById(_inpId).value = "";
			document.getElementById(_sel2Id).disabled = false;
			document.getElementById(_sel2Id).style.display = "";
		}
		else
		{
			document.getElementById(_inpId).disabled = false;
			document.getElementById(_inpId).style.display = "";
			document.getElementById(_inpId).value = "";
			document.getElementById(_sel2Id).disabled = true;
			document.getElementById(_sel2Id).style.display = "none";
		}
	} catch(e) { alert(e.toString()) }
} // end searchCheck()


/**
 * Show or hide attach form elements
 * @param	string file upload block id
 */
function attachFormView( _blockId )
{
	try {
		if(document.getElementById(_blockId).style.display == "none")
			document.getElementById(_blockId).style.display = "";
		else document.getElementById(_blockId).style.display = "none";
	} catch(e) { alert(e.toString()) }
}


/**
 * Add new row table by cloning existing hidden row
 * @param	string table identifier
 * @param	string row identifier
 */
function cloneTableRow( _itemTable, _itemSourceRow )
{
	var table;
	var row;
	
	if( false == (table = document.getElementById(_itemTable)) ||
		false == (row = document.getElementById(_itemSourceRow)) )
	{
		alert("Not specified table source or table row source to clone. You can't clone item!");
		return false;
	}
	
	var clone = row.cloneNode(true);
	clone.style.display = "";
	clone.id = "";
	clone.id = Ext.id(clone, table.id + '_');
	var _button = clone.getElementsByTagName("button");
	_button[0].onclick = new Function("removeTableRow('" + table.id + "','" + clone.id + "')");
	
	// Convert cloned row inputs and selects to php array iterpritation
	inputs = clone.getElementsByTagName("input");
	for(var i in inputs)
		if(!Ext.isEmpty(inputs[i].name))
		{
			inputs[i].name = inputs[i].name + "[]";
		}
	
	selects = clone.getElementsByTagName("select");
	for(var i in selects)
		if(!Ext.isEmpty(selects[i].name))
		{
			selects[i].name = selects[i].name + "[]";
		}
	
	var tbody = table.getElementsByTagName("tbody");
	tbody[0].appendChild(clone);
	validRows(_itemTable, _itemSourceRow);
} // end cloneTableRow()


/**
 * Remove new row table by cloning existing hidden row
 * @param	string table identifier
 * @param	string row identifier
 */
function removeTableRow( _itemTable, _itemSourceRow )
{
	var table;
	var row;
	
	if( false == (table = document.getElementById(_itemTable)) ||
		false == (row = document.getElementById(_itemSourceRow)) )
	{
		alert("Not specified table source or table row source to remove. You can't remove item!");
		return false;
	}
	
	try { 
		while(document.getElementById(_itemSourceRow))
		{
			var tr = document.getElementById(_itemSourceRow);
			tr.parentNode.removeChild(tr);
		}
	} catch(e) { alert(e.toString()) }
	
	validRows(_itemTable, _itemSourceRow);
} // end removeTableRow()


/**
 * Check if table doesn't contain valid information row
 * If true than show "empty row", else hide "empty row"
 */
function validRows( _itemTable, _itemSourceRow )
{
	var table;
	var row;
	
	if( false == (table = document.getElementById(_itemTable)) ||
		false == (row = document.getElementById(_itemSourceRow)) )
	{
		alert("Not specified table source or table row source!");
		return false;
	}
	
	var trs = table.getElementsByTagName("tr");
	var regexp = new RegExp(_itemTable + "_");
	var found = false;
	
	for(var i in trs)
	{
		try {
			var myId = trs[i].id;
			if(!Ext.isEmpty(myId) && regexp.test(myId))
			{
				found = true;
				break;
			}
		} catch(e) { }
	}
	
	try { 
		if(found) document.getElementById( _itemTable + "No" ).style.display = "none";
		else document.getElementById( _itemTable + "No" ).style.display = "";
	} catch(e) { alert(e.toString()) }
} // end validRows()


/**
 * Open new window
 * @param	URI to open
 * @param	window width
 * @param	window height
 */
function newWindow ( url, _width, _height )
{
	if(typeof _width == "undefined") var _width = 600;
	if(typeof _height == "undefined") var _height = 400;
	
	var w = window.open (url, '_sbss', 'width=' + _width + ',height=' + _height + ',resizable=yes,status=no,menubar=no,scrollbars=yes');
	w.focus();
} // end newWindow()


/**
 * Add hidden elements to parent window form
 * @param	string, parent window form id
 * @param	integer, knowledge subject id, if new than 0
 * @param	string, knowledge base name
 * @param	string, div id to set there subject name
 */
function copyToKnowledge( formId, itemId, itemName, divId )
{
	try {
		var _form = opener.document.getElementById(formId);
		
		if(!_form.kbId)
		{
			var _kbId = opener.document.createElement("input");
			_kbId.type = "hidden";
			_kbId.name = "kbId";
			_kbId.id = "_kbId_";
			_form.appendChild(_kbId);
		}
		
		if(!_form.kbName)
		{
			var _kbName = opener.document.createElement("input");
			_kbName.type = "hidden";
			_kbName.name = "kbName";
			_kbName.id = "_kbName_";
			_form.appendChild(_kbName);
		}
		
		opener.document.getElementById("_kbId_").value = itemId;
		opener.document.getElementById("_kbName_").value = itemName;
		
		opener.document.getElementById(divId).innerHTML = itemName;
		
		self.close();
	} catch(e) { alert(e.toString() ) }
} // end copyToKnowledge()


/**
 * Sbss table panel with tickets linked to vgId
 * For the localization you should use this structure
 * 
 * @param	string, block id on the page to insert panel to
 * @param	integer vgId
 */
function sbssVgroupLinked( _block, _vgId )
{
	if(typeof _block == 'undefined' || !document.getElementById(_block)) return false;
	if(typeof _vgId == 'undefined') return false;
	
	// Create data structure
	var sbssDataStore = new Ext.data.Store({
		id: 'sbssDataStore',
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 5, vgid: _vgId},
		reader: new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total',
			id: 'id'
		},[ 
			{name: 'status', type: 'string', mapping: 'status'},
			{name: 'title', type: 'string', mapping: 'title'},
			{name: 'lasttime', type: 'date', mapping: 'lasttime'}, 
			{name: 'lastauthor', type: 'string', mapping: 'lastauthor'}, 
			{name: 'responsible', type: 'string', mapping: 'responsible'}
		]),
		sortInfo:{field: 'lasttime', direction: "DESC"}
        });
	
	// Create column structure
	var sbssColumnModel = new Ext.grid.ColumnModel(
		[{
			header: Localize.Status,
			readOnly: true,
			dataIndex: 'status',
			width: 140,
			hidden: false
		},{
			header: Localize.Title,
			dataIndex: 'title',
			width: 250,
			readOnly: true
		},{
			header: Localize.Last,
			dataIndex: 'lasttime',
			width: 180,
			readOnly: true,
			renderer: Ext.util.Format.dateRenderer('H:i d.m.Y')
		},{
			header: Localize.Last,
			dataIndex: 'lastauthor',
			width: 190,
			readOnly: true
		},{
			header: Localize.Responsible,
			dataIndex: 'responsible',
			width: 170,
			readOnly: true
		}]
	);
	
	sbssColumnModel.defaultSortable= true;
	
	var sbssGridPanel = new Ext.grid.GridPanel({
		store: sbssDataStore,
		cm: sbssColumnModel,
		width: 980,
		height: 250,
		collapsible: true,
		collapsed: true,
		animCollapse: false,
		enableColLock: false,
		clicksToEdit:1,
			selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
			bbar: new Ext.PagingToolbar({
				pageSize: 50,
				store: sbssDataStore,
				displayInfo: true
			}),
		title: Localize.PanelTitle
	});
    
	sbssDataStore.reload({params: {start: 0, limit: 50}});
	Ext.onReady(function(){ sbssGridPanel.render(_block) });
} // end sbssVgroupLinked()


function linkVgToTicket(A) {
	if(Ext.isEmpty(A.getSelectionModel().getSelected())) { return false; }
	else var B = A.getSelectionModel().getSelected();
	
	createHidOrUpdate('_sbssForm', 'uId', B.data.userid);
	document.getElementById('_Uname').innerHTML = B.data.username;
	createHidOrUpdate('_sbssForm', 'vgId', B.data.vgid);
	document.getElementById('_Vname').innerHTML = B.data.login + ' (' + B.data.agentdescr + ')';
	document.getElementById('_Vname').style.display = "";
	document.getElementById('_VnameUndef').style.display = "none";
	// Show Information block if hidden
	if(document.getElementById('_asClient').style.display == "none") {
		document.getElementById('_asClient').style.display = "";
	}
}

/**
 * Show user info
 * @param	user id 
 * @param user name
 */
function getUserInfo(uid, user_name) {
	var accounts_store = new Ext.data.Store({
	    url: 'config.php',
	    baseParams: {
	        devision: 1001,
	        async_call: 1,
	        get_user_accounts: 1,
			uid: uid
	    },
		autoLoad: true, 
	    reader: new Ext.data.ArrayReader({
	        idIndex: 0
	    }, [{
	        name: 'vg_id',
	        type: 'int'
	    }, {
	        name: 'login',
	        type: 'string'
	    }, {
	        name: 'agreement',
	        type: 'string'
	    }, {
	        name: 'balance',
	        type: 'string'
	    }, {
	        name: 'blocked',
	        type: 'int'
	    },{
            name: 'address',
            type: 'string'
        }, {
            name: 'devicename',
            type: 'string'
        }, {
            name: 'port',
            type: 'string'
        }, {
            name: 'port_status',
            type: 'string'
        }]),
		listeners: {load: function() { this.each(get_port_state); }}		
	});
	function get_port_state(rec) {
		Ext.Ajax.request({
            url: 'config.php',
            method: "POST",
            params: {
                devision: 207,
                async_call: 1,
                check_vgid: 1,
            	vg_id: rec.get("vg_id"),
				for_sbss: 1
            },
			callback: function(options, success, response){
				if (success) {					
					var res = Ext.util.JSON.decode(response.responseText);
					if( res.found != 0 ) {						
						rec.set("devicename", res.device[0].devicename);
						rec.set("port", res.device[0].name);
						rec.set("port_status", res.device[0].port_status);
					}					
				}				
			}	
		});	
	}
	var accounts_grid = new Ext.grid.GridPanel({
		title: Localize.Accounts,
        collapsible: false,		
        id: "acc_grid",
        height: 380,
		width: 662,
		ds: accounts_store,
		cm: new Ext.grid.ColumnModel([{
            			header: Localize.Login,
            			width: 90,
            			dataIndex: 'login',
            			sortable: true
					}, {
            			header: Localize.Addr,
            			width: 120,
            			dataIndex: 'address',
            			sortable: true
					}, {
            			header: Localize.Agreement,
            			width: 70,
            			dataIndex: 'agreement',
            			sortable: true
					}, {
            			header: Localize.Balance,
            			width: 70,
            			dataIndex: 'balance',
            			sortable: true
					}, {
            			header: Localize.Blocking,
            			width: 80,
            			dataIndex: 'blocked',
            			sortable: true,
						renderer: function(value) {
							switch(value) { case 1: return '($$)'; case 2: return 'User'; case 3: return 'Adm'; case 4: return 'A. ($$)'; case 5: return 'Traf lim'; case 10: return 'OFF'; default: return 'Online'; }
						}
					}, {
            			header: Localize.Device,
            			width: 80,
            			dataIndex: 'devicename',
            			sortable: true
					}, {
            			header: Localize.Port,
            			width: 50,
            			dataIndex: 'port',
            			sortable: true
					}, {
            			header: Localize.Status,
            			width: 80,
            			dataIndex: 'port_status',
            			sortable: false,
						renderer: function(value) {														
							if( value.match(/images[\w\/]+.\w+/) ) {
								return "<img src='" + value + "'>";
							}
						}
					} ])
	});
	var wnd = new Ext.Window({
					title: Localize.User + ' ' + user_name,						
					width: 680,
					height: 420,
					autoScroll: true,
					id: 'user_info_wnd',
					plain: true,
					modal: true,
					items: [accounts_grid]        					
				})
	wnd.show();	
	return false;
}

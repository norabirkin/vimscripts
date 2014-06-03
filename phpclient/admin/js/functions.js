/**
 * Billing system Common functions and objects
 *
 * Repository information:
 */

Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24*7)) //7 days from now
}));

/**
 * Synchronize background responses from server with authentication command to logout if
 * session died
 */
Ext.Ajax.on('requestcomplete', function(c, r){ try{ response = Ext.util.JSON.decode(r.responseText); if(response.authorize){ var F = new Ext.form.FormPanel({ renderTo: Ext.getBody(), url: 'config.php', method: 'POST', standardSubmit: true, items: [{ xtype: 'hidden', name: 'devision', value: 99 }]}); F.getForm().submit(); } } catch(e){ } }, this);

/**
 * First day of the week is monday
 */
if(Ext.DatePicker){
   Ext.override(Ext.DatePicker, {
      startDay: 1
   });
}

// ExtJS 3.2 Webkit Hidden Component Fix
Ext.override(Ext.Component, {
	onShow : function(){

        this.getVisibilityEl().removeClass('x-hide-' + this.hideMode);

		if(Ext.isWebKit) {
			this.getVisibilityEl().show();
		}
    },
	onHide : function(){

		this.getVisibilityEl().addClass('x-hide-' + this.hideMode);

		if(Ext.isWebKit) {
			this.getVisibilityEl().hide();
		}
    }
});


Ext.QuickTips.init();
/**
 * This is localization support. Localize object with string data is a global variable built in
 * as java script code response from server and it's storing in private browser cache due to any
 * modification on server side
 * Call: Ext.app.Localize.get('Key You are looking for')
 * Returns: key value or key if not found
 */
Ext.app.Localize = {
    errors: {},

    get: function(key)
    {
        try {
            if (Ext.isDefined(localize[key])) {
                var str = new String(localize[key]);
            }
            else {
                var str = new String(key);
            }
        }
        catch(e) {
            this.error(key, e.toString());
            var str = new String(key);
        }

        // Add line break at specified position
        // @param    number, add html <br> tag to specified after word position
        // @param    string, split sting by delimiter (optional), defaul space
        str.lineBreak = function(pos, delim) {
            if(!Ext.isNumber(pos)) {
                return this;
            }

            if(!Ext.isDefined(delim) || delim.length == 0) {
                delim = ' ';
            }

            var A = this.split(delim);
            if(A.length < pos) {
                return this;
            }

            A[pos - 1] += '<br />';
            return A.join(delim);
        }

        return str;
    },

    error: function(key, reason)
    {
        this.errors[key] = {
            reason: reason
        };
    }
}; // end Ext.app.Localize


/**
 * Short alias function to create error message
 * @param       object similar to the object for the show function
 */
Ext.Msg.error = function( params ) {
    if(!Ext.isObject(params)) {
        var params = {
            msg: params
        }
    };

    var params = Ext.apply(params || {}, {
        title: Ext.app.Localize.get('Error'),
        msg: '<b>' + Ext.app.Localize.get('Error') + ':</b><br>' + params['msg'] || Ext.app.Localize.get('Unknown error') + '<br>',
        buttons: Ext.Msg.OK,
        icon: Ext.MessageBox.ERROR
    });

    this.show(params);
};


/**
 * Add some advanced function to work easy with elements of the toolbar
 * in the grid object
 */
Ext.override(Ext.Toolbar, {
    // Get toolbar values
    getToolValues: function() {
        var params = {};
        this.items.each(function(item){
            switch(item.getXType()) {
                case 'textfield':
                case 'combo':
                case 'datefield':
                case 'spinnerfield':
                    this[item.name || item.getId()] = Ext.isDate(item.getValue()) ? item.getValue().format('Y-m-d H:i:s') : item.getValue();
                }
        }, params);
        return params;
    },
    // Restore Storage values to filter
    syncToolView: function() {
        if (this.ownerCt.getXType() == 'grid' || this.ownerCt.getXType() == 'editorgrid') {
            var store = this.ownerCt.getStore();
            Ext.each(this.findByType('textfield'), function(item){
                if (Ext.isDefined(this.baseParams[item.name || item.getId()])) {
                    item.setValue(this.baseParams[item.name || item.getId()])
                }
            }, store);
            Ext.each(this.findByType('combo'), function(item){
                if (Ext.isDefined(this.baseParams[item.name || item.hiddenName || item.getId()])) {
                    item.setValue(this.baseParams[item.name || item.hiddenName || item.getId()])
                }
            }, store);
        }
        return this;
    },
    // Save filter data to store
    syncToolStore: function() {
        if (this.ownerCt.getXType() == 'grid' || this.ownerCt.getXType() == 'editorgrid') {
            var store = this.ownerCt.getStore();
            // Save combo values to store
            this.items.each(function(item){
                switch(item.getXType()) {
                    case 'textfield':
                    case 'combo':
                        this.setBaseParam(item.name || item.getId(), item.getValue());
                }
            }, store);
        }
    }
});


/**
 * Advanced function to store data to base params store
 * @param       string, key name to modify or add
 * @param       Mixed, Value to store or modify
 * @param       array, array of keys to remove from base params store
 */
Ext.override(Ext.data.Store, {
    // file to call be default
    url: 'config.php',
    // Request timeout
    timeout: 380000,
    // Default method
    method: 'POST',
    // Apply or remove value from the baseParams object
    setBaseParam : function (name, value, remove){
        this.baseParams = this.baseParams || {};
        this.baseParams[name] = value;

        if(Ext.isDefined(remove)) {
            var params = {};

            if(!Ext.isArray(remove)) {
                var remove = [remove];
            }

            if (remove.length > 0) {
                for (var i in this.baseParams) {
                    if (remove.indexOf(i) > -1) {
                        continue;
                    }

                    params[i] = this.baseParams[i];
                }

                this.baseParams = params;
            }
        }

        return this;
    },

    // Advance reload, call synchronization before send data
    reload : function(options){
        if(this['syncStore']) {
            this.syncStore();
        }
        this.load(Ext.applyIf(options||{}, this.lastOptions));
    }
});


/**
 * Add to the GridPanel extra functions
 */
Ext.ns('Fncs');
Fncs.setPagePanel = function() {
	this.PAGELIMIT = this.PAGELIMIT || 100;
        var bbar = this.getBottomToolbar();
        
        if(!bbar) {
            return;
        }
        
        bbar.pageSize = this.PAGELIMIT;
        bbar.bindStore(this.store);
        bbar.add(['-', {
            xtype: 'combo',
            width: 70,
            displayField: 'id',
            valueField: 'id',
            mode: 'local',
            triggerAction: 'all',
            value: this.PAGELIMIT,
            editable: false,
                store: {
                    xtype: 'arraystore',
                    data: [['50'], ['100'], ['500']],
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
                }.createDelegate(this)
            }
        }]);
};
Ext.override(Ext.grid.GridPanel, {
    setPagePanel: Fncs.setPagePanel
});


/**
 * Select parent user for account
 * @param    object, for the direct call there should be null
 * @param    string, dom element id to set user name
 * @param    string, dom element id to set user id
 * @param    string, form dom element id
 */
selectAgrm = function(grid, renderId, User, UserId, UserForm, flt_archive, searchTypeValue, autoLoad, flt_unavail, filter) {

    if (Ext.isEmpty(filter)) {
        filter = {};
    }
	if(Ext.isEmpty(flt_unavail))
		var flt_unavail = 0;
	
	if(Ext.isEmpty(flt_archive))
		var flt_archive = 0;
	
	if(Ext.isEmpty(searchTypeValue))
		var searchTypeValue = 0;
	
	if(Ext.isEmpty(autoLoad))
		var autoLoad = 1;
	
    if (Ext.isEmpty(grid)) {
        selectAgreements({
            sm: true,
            callbackok: selectAgrm,
            searchTypeValue: searchTypeValue,
            renderId: renderId,
            flt_archive: flt_archive,
            flt_unavail: flt_unavail,
            filter: filter,
            autoLoad: autoLoad,
            User: {
                name: User,
                id: UserId,
                form: UserForm,
                userCatField: 'searchAgrmField'
            }
        });
    } else {
        if (Ext.isEmpty(grid.getSelectionModel().getSelected())) {
            return false;
        } else var record = grid.getSelectionModel().getSelected();
        try {
            document.getElementById(this.User.name).value = record.data.number;
            document.getElementById(this.User.id).value = record.data.agrmid;
            Ext.getCmp(this.User.name).getEl().removeClass('x-form-invalid');
        } catch(e) {
            return false;
        }
    }
}



function searchBsoDoc( bsoSetId, bsoDocId, bsoValField, pForm ){
    var feedWin;
    if(!feedWin){
        var PAGELIMIT = 100;
        var bsoDocStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
            reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' },
            [
                { name: 'recordid',      type: 'int'     },
                { name: 'setid',          type: 'int'     },
                { name: 'createdby',      type: 'int'     },
                { name: 'updatedby',      type: 'int'     },
                { name: 'dirty',         type: 'int'      },
                { name: 'payid',          type: 'int'      },
                { name: 'number',          type: 'string' },
                { name: 'receipt',       type: 'string' },
                { name: 'created',          type: 'string' },
                { name: 'updated',          type: 'string' },
                { name: 'mgrnameins',      type: 'string' },
                { name: 'mgrnameupd',      type: 'string' },
                { name: 'createdip',      type: 'string' },
                { name: 'createdipmask', type: 'int'    },
                { name: 'updatedip',      type: 'string' },
                { name: 'updatedipmask', type: 'int'    },
                { name: 'p_data',          type: 'array'  }

            ]),
            autoLoad: false,
            baseParams: { async_call: 1, devision: 18, getBsoDocs: 0, category: 0, /*bsoPayed: 0,*/ limit: PAGELIMIT, start: 0 },
            sortInfo: { field: 'number', direction: 'ASC' }
        });
        var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect:true, dataIndex: 'recordid' });

        var combo = new Ext.form.ComboBox({
            id: '_listBsoSetCombo',
            width: 160,
            displayField: 'number',
            valueField: 'recordid',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            value: '',
            editable: false,
            store: new Ext.data.Store({
                proxy:    new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
                reader: new Ext.data.JsonReader({ root: 'results' },
                                                [{ name: 'recordid', type: 'int' }, { name: 'number', type: 'string' }]),
                autoLoad: true,
                baseParams: { async_call: 1, devision: 18, getBsoSets: 1 }
            })
        });
        var text = new Ext.form.TextField({
            id: '_listBsoNumberField',
            value: '',
            width: 100,
            value: '',
            allowBlank: true,
            style: 'font-weight:bold;',
            renderTo: Ext.getBody()
        });
        var button = new Ext.Button({
            id: '_listBsoNumberButton',
            renderTo: Ext.getBody(),
            iconCls: 'ext-search'
        });

        combo.addListener('select',
            function() {
                bsoDocStore.baseParams.getBsoDocs = this.getValue();
                bsoDocStore.baseParams.number = text.getValue();
                bsoDocStore.load();
            }
        );

        button.addListener('click',
                function() {
                    bsoDocStore.baseParams.getBsoDocs = combo.getValue();
                    bsoDocStore.baseParams.number = text.getValue();
                    bsoDocStore.removeAll();
                    bsoDocStore.load();
                }
        );


        feedWin = new Ext.Window({
            id: 'getBsoDocWin',
            width: 550,
            layout: 'fit',
            title: Ext.app.Localize.get('Choose SRF'),
            buttonAlign: 'right',
            modal: true,
            tbar: [
                Ext.app.Localize.get('Billhead serial') + ':&nbsp;', combo ,
                Ext.app.Localize.get('Billhead number') + ':&nbsp;', text,
                button
            ],
            items:[{
                xtype: 'grid',
                id: '_bsoSetDocs',
                layout: 'fit',
                height: 300,
                store: bsoDocStore,
                autoExpandColumn: 'p_data_id',
                viewConfig: {
                    getRowClass: function(record, index) {
                        if (record.get('payid') > 0) return 'x-type-payment-transfer';
                        else return '';
                    }
                },
                loadMask: true,
                sm: sm,
                cm: new Ext.grid.ColumnModel({
                    defaults: {
                        sortable: true,
                        menuDisabled: true
                    },
                    columns: [
                        sm,
                        {
                            header: Ext.app.Localize.get('Number'),
                            dataIndex: 'number',
                            id: 'number',
                            width: 160,
                            renderer: function(value, metaData, record) {
                                return Ext.getCmp('_listBsoSetCombo').getRawValue() + ' / ' + value;
                            }
                        },
                        {
                            header: Ext.app.Localize.get('Info about attached payment'),
                            dataIndex: 'p_data',
                            id: 'p_data_id',
                            layout: 'fit',
                            renderer: function(value, metaData, record) {
                                i = [];
                                Ext.each(value, function(itm){
                                        if (itm == null)
                                            r = "";
                                        else
                                            r = Ext.app.Localize.get('Agreement number')+ ': ' + itm.agrm + '<br/>' + 
												Ext.app.Localize.get('Sum of payment')+ ': ' + itm.amount + '<br/>' + 
												Ext.app.Localize.get('Client') + ': ' + itm.uname + '<br/>' + 
												Ext.app.Localize.get('Payment date') + ': ' + itm.paydate;
                                        this.push(r);
                                    },i
                                )
                                return i.join("<hr/>");
                            }
                        },
                        {
                            header: Ext.app.Localize.get('Creation date'),
                            dataIndex: 'created',
                            id: 'created',
                            width: 160
                        }
                    ]
                }),
                bbar: new Ext.PagingToolbar({
                    pageSize: PAGELIMIT,
                    store: bsoDocStore,
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
                                ['300'],
                                ['500'],
                                ['1000']
                            ],
                            fields: ['id']
                        }),
                        listeners: {
                            select: function(){
                                PAGELIMIT = this.getValue() * 1;
                                this.ownerCt.pageSize = PAGELIMIT;
                                bsoDocStore.reload({ params: { limit: PAGELIMIT } });
                            }
                        }
                    }]
                })
            }],
            buttons:[
                {
                    text: Ext.app.Localize.get('Choose'),
                    id: 'addBsoBtn',
                    handler: pForm || function(){
                        grid = Ext.getCmp('_bsoSetDocs');
                        if (Ext.isEmpty(grid.getSelectionModel().getSelected())) {
                            return false;
                        } else var record = grid.getSelectionModel().getSelected();
                        try {
                            Ext.getCmp(bsoSetId).setValue(Ext.getCmp('_listBsoSetCombo').getValue());
                            Ext.getCmp(bsoDocId).setValue(record.data.recordid);
                            Ext.getCmp(bsoValField).setValue(Ext.getCmp('_listBsoSetCombo').getRawValue() + ' / ' + record.data.number);
                        } catch(e) {
                            return false;
                        }
                        feedWin.close();
                    }
                },
                { text: Ext.app.Localize.get('Cancel'), handler: function(){ feedWin.close();}}
            ]
        });
    }
  feedWin.show();
}




Ext.override(Ext.form.TwinTriggerField, {
	afterRender: function() {
		Ext.form.TwinTriggerField.superclass.afterRender.call(this);
		var y = this.trigger.getY();
		this.triggers[0].hide();
		if (Ext.isIE && !this.hideTrigger) {
			this.el.position();
			this.el.setY(Ext.isIE8 ? y - 2 : y);
		} 
	}
});

/**
 * Get agreements list.
 * @param    object: sm - row selection model (true: single, false: multi)
 *             filter - make storage request with passed params as static
 *             title - set specific window title
 *             tbSearch - if false, then gide search field, ddefault true
 *             callbackok: fuction to call on pressed OK button, this pass
 *             callbackcl: function to call on CANCEL button, this pass
 */
function selectAgreements( A ) {
    if(!Ext.isEmpty(Ext.getCmp('usersListWin'))){
        return
    }
    if(Ext.isEmpty(A)) {
        A = { sm: true, callbackok: false, callbackcl: false, usboxReglament: false }
    }
    try {
        if(Ext.isEmpty(Localize)) {
            Localize = { };
        }
        if(Ext.isEmpty(A.tbSearch)) {
            A.tbSearch = true;
        }
    } catch(e) { Localize = { } }
    var SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        initComponent : function(){
            SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this);
        },
        validationEvent:false,
        validateOnBlur:false,
        trigger1Class:'x-form-clear-trigger',
        trigger2Class:'x-form-search-trigger',
        hideTrigger1:true,
        hasSearch : false,
        paramName : 'search',
        onTrigger1Click : function(){
            if(this.hasSearch){
                this.el.dom.value = '';
                var o = {start: 0, limit: 50};
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({params:o});
                this.triggers[0].hide();
            }
        },
        onTrigger2Click : function(){
            var v = this.getRawValue();
            if(v.length < 1){
            	this.hasSearch = true;
                this.onTrigger1Click();
                return;
            };
            var o = {start: 0, limit: 50};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({params:o});
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}),
        reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [
            { name: 'uid', type: 'int' },
            { name: 'number', type: 'string' },
            { name: 'agrmid', type: 'int' },
            { name: 'balance', type: 'float' },
            { name: 'opername', type: 'string' },
            { name: 'username', type: 'string' },
            { name: 'paymentmethod', type: 'int' }         
        ]),
        baseParams:{ async_call: 1, devision: 22, getagreementslist: 0, searchtype: Ext.isEmpty(A.searchTypeValue) ?  0 : A.searchTypeValue, archive: A.flt_archive, unavail: A.flt_unavail}
    });
    if(!Ext.isEmpty(A.filter)){
        for(var i in A.filter){
            if(typeof A.filter[i] != 'function'){
                store.baseParams[i] = A.filter[i];
            }
        }
    }
    var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: Ext.isEmpty(A.sm) ? true : A.sm });
    var Btn = new Array();
    if(!Ext.isEmpty(A.callbackok)){
        Btn.push({
            xtype: 'button',
            text: Ext.app.Localize.get('Add'),
            handler: function(button){
                var parent = button.findParentByType('window');
                if(typeof A.callbackok == 'function') {
                    A.callbackok(parent.findByType('grid')[0]);
                }
                parent.close();
			}
        })
    };
    var Win = new Ext.Window({
        title: (!Ext.isEmpty(A.title)) ? A.title : Ext.app.Localize.get('Agreements'),
        id: 'usersListWin',
        buttonAlign: 'center',
        width: 700,
		resizable: false,
        items:[{
            xtype: 'grid',
            id: '_Users',
            store: store,
			height: 375,
            loadMask: true,
            autoExpandColumn: 'ext-userName',
            sm: sm,
            tbar: [ Ext.app.Localize.get('Search') + ':&nbsp;', {
                xtype: 'combo',
                id: '_listCombo',
                width: 160,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                value: Ext.isEmpty(A.searchTypeValue) ?  0 : A.searchTypeValue,
                editable: false,
                store: new Ext.data.SimpleStore({
                    data: [
                        ['0', Ext.app.Localize.get('Person full name')],
                        ['1', Ext.app.Localize.get('Agreement')],
                        ['6', Ext.app.Localize.get('Paycode')],
                        ['2', Ext.app.Localize.get('User login')],
                        ['3', Ext.app.Localize.get('Account login')],
                        ['4', 'E-mail'],
                        ['5', Ext.app.Localize.get('Phone')],
                        ['7', Ext.app.Localize.get('Address')],
                        ['11', Ext.app.Localize.get('TIN')] 
                    ],
                    fields: ['id', 'name'] }),
                    listeners: {
                        select: function() {
                            store.baseParams.searchtype = this.getValue();
                        }
                    }
            },'&nbsp;', new SearchField({
                store: store,
                params: { start: 0, limit: 50},
                width: 227
            }) ],
            bbar: new Ext.PagingToolbar({ pageSize: 50, store: store, displayInfo: true }),
            cm: new Ext.grid.ColumnModel({
                columns: [sm, {
                        header: Ext.app.Localize.get('Agreement'),
                        id: 'ext-userName',
                        dataIndex: 'number',
                        sortable: true
                    },{
                        header: Ext.app.Localize.get('Operator'),
                        id: '_operName',
                        dataIndex: 'opername',
                        width: 200,
                        sortable: true
                    },{ 
                        header: Ext.app.Localize.get('Name of user'),
                        hidden:  Ext.isEmpty(A.showusername) ? true : false,
                        dataIndex: 'username',
                        width: 200,
                        sortable: true
                    },{
                        header: Ext.app.Localize.get('Balance'),
                        id: '_typeCol',
                        dataIndex: 'balance',
                        width: 125,
                        sortable: true,
                        renderer: function(value, metaData, record) {
                            return Ext.util.Format.round(value,2);
                        }

                    }]
                }),
                view: new Ext.grid.GridView({
                    forceFit:false,
                    deferEmptyText: false,
                    emptyText:Ext.app.Localize.get('There is no available agreements')
                })
            }],
        buttons: Btn
    });
    if(A.tbSearch == false) {
        Win.find('id', '_Users')[0].getTopToolbar().hide()
    }
    Win.show();
    //store.reload({params: {start: 0, limit: 50}}); // AUTOLOAD
    if(Ext.isEmpty(A.autoLoad) || A.autoLoad > 0)
    	store.load(); // AUTOLOAD
} // end selectAgreements()

/**
 * This class provides cookie storage to save temporary short data
 * If You need to save any filter and load back it when page comes across load cycles
 * use syntax:
 *         Ext.app.DefaultView.set('CookieName', {
 *             item1: value1,
 *             item2: value2
 *         });
 *
 * To load back the whole cookie use
 *         Ext.app.DefaultView.get('CookieName')
 * or specify key name as second parameter
 * Remember, there is restriction to use symbols in names and values ":" and "="
 */
Ext.app.DefaultView = function(config) {
    Ext.apply(this, config);

    this.provider = new Ext.state.CookieProvider({
        path: this.path,
        expires: this.expires
    });

    Ext.app.DefaultView.constructor.call(this);
};

Ext.app.DefaultView.prototype = {
    path: '/',
    expires: null,

    // Public function to interpret passed value as boolean
    // @param    mixed, value
    asBoolean: function(value) {
        if(Ext.isBoolean(value)) {
            return value;
        }
        var check = new RegExp('^[0-9]+$');
        if(Ext.isNumber(value) || check.test(value)) {
            if(value == 1) {
                return true;
            }
        }
        return false;
    },

    // Public function to check if cookie exists
    // @param    string name
    // @return    boolean
    exists: function(name) {
        var cookie = this.provider.readCookies();
        if(cookie[name]) {
            return true;
        }
        return false;
    },

    // Private function to decode cookie content
    // @param    string content
    decodeCookie: function(content) {
        if(!Ext.isDefined(content) || Ext.isEmpty(content)) {
            return {};
        }

        var arr = content.split('&'),
            params = {};

        Ext.each(arr, function(item){
            var result = item.split(':');
            this[result[0]] = result[1];
        }, params);

        return params;
    },

    // Public function to cat from cookie body whole content or key value if there was passed
    // @param    string, cookie name to read out
    // @param    string, key to return value
    // @param    mixed, if specified key name than it possible to return default value if key was not found
    get: function(name, key, defaultValue) {
        if(!Ext.isDefined(name) || Ext.isEmpty(name)) {
            return {};
        }
        var params = this.decodeCookie(this.provider.get(name));
        if (Ext.isDefined(key)) {
            if (params[key]) {
                return params[key];
            }
            else {
                if(Ext.isDefined(defaultValue)) {
                    return defaultValue;
                }
            }
            return null;
        }
        else {
            return params;
        }
    },

    // Public function to remove variable value from cookie body
    // @param    string, cookie name
    // @param    string, key name to remove
    // @returns    void
    remove: function(name, key) {
        if(this.get(name, key, false) !== false) {
            var data = this.get(name),
                params = {};
            for(var i in data) {
                if(i == key) {
                    continue;
                }
                params[i] = data[i];
            }
            this.set(name, params, true);
        }
    },

    // Global function to write data to cookie that contains abstract settings
    // @param    string, cookie name to write in
    // @param    object that contains variables should be stored to cookie
    // @param    boolean to override whole cookie if true, default add or change existing items
    // @return    void
    set: function(name, params, overwrite) {
        if(!Ext.isDefined(name) || Ext.isEmpty(name)) {
            return null;
        }
        var params = params || {};
        if (overwrite != true) {
            var data = this.get(name);
            for(var i in params) {
                data[i] = params[i];
            }
            var params = {};
            for(var i in data) {
                if(Ext.isEmpty(data[i])) {
                    continue;
                }
                params[i] = data[i];
            }
        }
        var arr = [];
        for(var i in params) {
            arr.push(i + ':' + params[i]);
        }
        this.provider.set(name, arr.join('&'));
    }
};

Ext.app.DefaultView = new Ext.app.DefaultView();


/**
 * Override private function in ComboBox class to fix selection action
 * by valueField id exists and by displayField if the first is missed
 */
Ext.override(Ext.form.ComboBox, {
    assertValue: function(){
        var val = this.getRawValue(), rec;
        if(this.valueField && Ext.isDefined(this.value)){
            rec = this.findRecord(this.valueField, this.value);
        }
        if(!rec || rec.get(this.displayField) != val){
            rec = this.findRecord(this.displayField, val);
        }
        if(!rec && this.forceSelection){
            if(val.length > 0 && val != this.emptyText){
                this.el.dom.value = Ext.value(this.lastSelectionText, '');
                this.applyEmptyText();
            }else{
                this.clearValue();
            }
        }else{
            if(rec){
                // onSelect may have already set the value and by doing so
                // set the display field properly.  Let's not wipe out the
                // valueField here by just sending the displayField.
                if (val == rec.get(this.displayField) && this.value == rec.get(this.valueField)){
                    return;
                }
                val = rec.get(this.valueField || this.displayField);
            }
            this.setValue(val);
        }
    }
});


/**
 * CheckBox plugin,
 * @param    object, config
 */
Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
    init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function(e, t){
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            if(Ext.isDefined(this.handler) && Ext.isFunction(this.handler)) {
                var elstate = Ext.get(t).hasClass('x-grid3-check-col-on');
                if(this.handler(this, elstate, elstate ? false : true, index) === false) {
                    return;
                }
            }
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function(v, p, record){
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '" ' + (Ext.isDefined(this.qtip) ? ('ext:qtip="' + this.qtip + '"') : '') + '>&#160;</div>';
    }
};


/**
 * buttonText: The button text to display on the upload button (defaults to
 * 'Browse...').  Note that if you supply a value for {@link #buttonCfg}, the buttonCfg.text
 * value will be used instead if available.
 *
 * buttonOnly: True to display the file upload field as a button with no visible
 * text field (defaults to false).  If true, all inherited TextField members will still be available.
 *
 * buttonOffset: The number of pixels of space reserved between the button and the text field
 * (defaults to 3).  Note that this only applies if {@link #buttonOnly} = false.
 *
 * buttonCfg: A standard {@link Ext.Button} config object.
 *
 * @event fileselected
 * Fires when the underlying file input field's value has changed from the user
 * selecting a new file from the system file selection dialog.
 * @param {Ext.form.FileUploadField} this
 * @param {String} value The file value returned by the underlying file input field
 */
Ext.form.FileUploadField = Ext.extend(Ext.form.TextField, { buttonText: 'Browse...', buttonOnly: false, buttonOffset: 3, autoSize: Ext.emptyFn, initComponent: function(){ Ext.form.FileUploadField.superclass.initComponent.call(this); this.addEvents( 'fileselected' ); }, onRender : function(ct, position){ Ext.form.FileUploadField.superclass.onRender.call(this, ct, position); this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap'}); this.el.addClass('x-form-file-text'); this.el.dom.removeAttribute('name'); this.fileInput = this.wrap.createChild({ id: this.getFileInputId(), name: this.name||this.getId(), cls: 'x-form-file', tag: 'input', type: 'file', size: 1 }); var btnCfg = Ext.applyIf(this.buttonCfg || {}, { text: this.buttonText }); this.button = new Ext.Button(Ext.apply(btnCfg, { renderTo: this.wrap, cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '') })); if(this.buttonOnly){ this.el.hide(); this.wrap.setWidth(this.button.getEl().getWidth()); } this.fileInput.on('change', function(){ var v = this.fileInput.dom.value; this.setValue(v); this.fireEvent('fileselected', this, v); }, this); }, getFileInputId: function(){ return this.id+'-file'; }, onResize : function(w, h){ Ext.form.FileUploadField.superclass.onResize.call(this, w, h); this.wrap.setWidth(w); if(!this.buttonOnly){ var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset; this.el.setWidth(w); }; }, preFocus : Ext.emptyFn, getResizeEl : function(){ return this.wrap; }, getPositionEl : function(){ return this.wrap; }, alignErrorIcon : function(){ this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]); } });
Ext.reg('fileuploadfield', Ext.form.FileUploadField);

Ext.override(Ext.form.TriggerField, {
    IE8Fix: true,

    afterRender: function(){
        Ext.form.TriggerField.superclass.afterRender.call(this);
        this.updateEditState();
        var y;
        if(Ext.isIE && !this.hideTrigger && this.el.getY() != (y = this.trigger.getY())){
            this.el.position();
            this.el.setY(y);
        }
    },

    fixIE8: function(a){
        if(Ext.isIE8){
            var b = a.getEl();
            var c = b.next()
            if(b.getY()*1 != c.getY()*1){
                b.setY(c.getY());
            }
        }
    }
});

Ext.override(Ext.BoxComponent, {
/**
     * Show the container including the label
     */
    showContainer: function() {
        this.enable();
        this.show();
 
        if (!Ext.isEmpty(this.getEl())) {
            this.getEl().up('.x-form-item').setDisplayed(true); // show entire container and children (including label if applicable)
        }
 
 
    },
 
    /**
     * Hide the container including the label
     */
    hideContainer: function() {
        this.disable(); // for validation
        this.hide();
 
        if (!Ext.isEmpty(this.getEl())) {
            this.getEl().up('.x-form-item').setDisplayed(false); // hide container and children (including label if applicable)
        }
    },
 
    /**
     * Hide / Show the container including the label
     * @param visible
     */
    setContainerVisible: function(visible) {
        if (this.rendered) {
            if (visible) {
                this.showContainer();
            } else {
                this.hideContainer();
            }
        }
 
        return this;
    }
});

/**
 * Extra function in the parent Ext class for quick change textfield label. Also you can show or hide container with label
 * Use: myTextField.setLabel('Text')
 * Use textfield.showContainter to show field with label 
 * Use textfield.hideContainter to hide field with label 
 */
Ext.override(Ext.form.Field, {
    showContainer: function() {
        this.enable();
        this.show();
        this.getEl().up('.x-form-item').setDisplayed(true); // show entire container and children (including label if applicable)
    },
    
    hideContainer: function() {
        this.disable(); // for validation
        this.hide();
        this.getEl().up('.x-form-item').setDisplayed(false); // hide container and children (including label if applicable)
    },
    
    setContainerVisible: function(visible) {
        if (visible) {
            this.showContainer();
        } else {
            this.hideContainer();
        }
        return this;
    },
    setLabel: function(text){
        if (this.xtype == 'radio' || this.autoEl.type == 'radio') {
            this.getEl().dom.parentNode.getElementsByTagName('label')[0].nodeValue = String.format('{0}', text);
        }
        else {
            var A = this.getEl().up('div.x-form-item');
            A.dom.firstChild.firstChild.nodeValue = String.format('{0}', text);
        }
    },
    
    // Add quick tip for the text field
    afterRender : Ext.form.Field.prototype.afterRender.createSequence(
        function() {
            var qt = this.qtip;
            if (qt) {
                Ext.QuickTips.register({
                    target : this,
                    title : '',
                    text : qt,
                    enabled : true,
                    showDelay : 20
                });
            }
        }
    )
});


/**
 * Extra function int the parent Ext class to add quick tip for the text field
 * Use in the config: qtip: 'Text'
 */
/*Ext.override(Ext.form.Field, {
			afterRender : Ext.form.Field.prototype.afterRender.createSequence(
					function() {
						var qt = this.qtip;
						if (qt) {
							Ext.QuickTips.register({
										target : this,
										title : '',
										text : qt,
										enabled : true,
										showDelay : 20
									});
						}
					})
		});*/


/**
 * Create similar function like php number_format
 *
 */
Ext.util.Format.numberFormat = function(number, decimals, dec_point, thousands_sep){
    var exponent = "";
    var numberstr = number.toString();
    var eindex = numberstr.indexOf("e");
    var i, z;
    if (eindex > -1) {
        exponent = numberstr.substring(eindex);
        number = parseFloat(numberstr.substring(0, eindex));
    }
    if (decimals != null) {
        var temp = Math.pow(10, decimals);
        number = Math.round(number * temp) / temp;
    }
    var sign = number < 0 ? "-" : "";
    var integer = (number > 0 ? Math.floor(number) : Math.abs(Math.ceil(number))).toString();
    var fractional = number.toString().substring(integer.length + sign.length);
    dec_point = dec_point != null ? dec_point : ".";
    fractional = decimals != null && decimals > 0 || fractional.length > 1 ? (dec_point + fractional.substring(1)) : "";
    if (decimals != null && decimals > 0) {
        for (i = fractional.length - 1, z = decimals; i < z; ++i) {
            fractional += "0";
        }
    }
    thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ? thousands_sep : null;
    if (thousands_sep != null && thousands_sep != "") {
        for (i = integer.length - 3; i > 0; i -= 3) {
            integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
        }
    }
    return sign + integer + fractional + exponent;
}


/**
 * If there is need to check any row / cell/ grid condition than set function to the
 * object iconCls: myfunction
 * there with be passed: record, row, col, this
 */
Ext.grid.RowButton = function(config){
    Ext.apply(this, config);
    this.addEvents({
        beforeaction: true,
        action: true
    });
    if (Ext.util.Format.substr(Ext.version, 0, 1) == 3 && !this.renderer) {
        this.renderer = this.Renderer.createDelegate(this);
    }
    Ext.grid.RowButton.superclass.constructor.call(this);
};
Ext.extend(Ext.grid.RowButton, Ext.util.Observable, {
    header: '',
    sortable: false,
    printable: false,
    dataIndex: '',
    width: 20,
    fixed: true,
    lazyRender: true,
    iconCls: '',

    init: function(grid){
        this.grid = grid;
        var view = grid.getView();
        var cfg = {
            scope: this
        };
        cfg[this.actionEvent] = this.onClick;
        grid.afterRender = grid.afterRender.createSequence(function(){
            view.mainBody.on(cfg);
            grid.on('destroy', this.purgeListeners, this);
        }, this);
        grid.on({
            render: {
                scope: this,
                fn: function(){
                    view.mainBody.on({
                        click: {
                            scope: this,
                            fn: this.onClick
                        }
                    });
                }
            }
        });
        if (Ext.util.Format.substr(Ext.version, 0, 1) == 2 && !this.renderer) {
            this.renderer = this.Renderer.createDelegate(this);
        }
    },

    Renderer: function(value, cell, record, row, col, store){
        cell.css += (cell.css ? ' ' : '') + 'ext-grid3-row-action-cell';
        var retval = '<div class="' + this.getIconCls(record, row, col) + '"';
        retval += this.style ? ' style="' + this.style + '"' : '';
        retval += Ext.isDefined(this.qtip) ? ' ext:qtip="' + this.getQtip(record, row, col) + '"' : '';
        retval += '> </div>';
        return retval;
    },

    getQtip : function(record, row, col) {
        if (typeof this.qtip == 'function') {
            return this.qtip(record, row, col, this);
        }
        else {
            return this.qtip;
        };
    },

    getIconCls: function(record, row, col){
        if (typeof this.iconCls == 'function') {
            return this.iconCls(record, row, col, this);
        }
        else {
            return this.iconCls;
        };
    },

    onClick: function(e, target){
        var record, iconCls;
        var row = e.getTarget('.x-grid3-row');
        var col = this.grid.getView().getCellIndex(e.getTarget('.ext-grid3-row-action-cell'));
        if (false !== row && false !== col) {
            record = this.grid.store.getAt(row.rowIndex);
            iconCls = this.getIconCls(record, row.rowIndex, col);
            if (Ext.fly(target).hasClass(iconCls)) {
                if (false !== this.fireEvent('beforeaction', this.grid, record, row.rowIndex)) {
                    this.fireEvent('action', this.grid, record, row.rowIndex, e);
                }
            }
        }
    }
});
Ext.reg('rowbutton', Ext.grid.RowButton);



Ext.override(Ext.grid.GroupingView, {

	/* The modified function */
	interceptMouse : Ext.emptyFn,
	processEvent: function(name, e){
		Ext.grid.GroupingView.superclass.processEvent.call(this, name, e);
		var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
		if(hd){
			// group value is at the end of the string
			var field = this.getGroupField(),
				prefix = this.getPrefix(field),
				groupValue = hd.id.substring(prefix.length),
				emptyRe = new RegExp('gp-' + Ext.escapeRe(field) + '--hd');

			// remove trailing '-hd'
			groupValue = groupValue.substr(0, groupValue.length - 3);

			// also need to check for empty groups
			if(groupValue || emptyRe.test(hd.id)){
				this.grid.fireEvent('group' + name, this.grid, field, groupValue, e);
			}
			if(name == 'mousedown' && e.button == 0){
				//this.toggleGroup(hd.parentNode);
			}
		}
	}
	/* end of the modified function */

});



/**
 * Fix for old browser to round numbers
 */
if(!Number.toFixed){ Number.prototype.toFixed=function(x){ var t = this; t = Math.round(t*Math.pow(10,x))/Math.pow(10,x); return t; }; }


/**
 * This function helps to convert time duration from seconds length to H:i:s
 * @param    long, time in seconds
 */
var Duration = function(v) {
    if (Ext.isEmpty(v) || !Ext.isDefined(v)) {
        v = 0;
    }
    var sprintf = function(A){
        if (A < 10) {
            return new String('0' + A);
        };
        return new String(A);
    };
    var h = (v - (v % 3600)) / 3600;
    v = v - (h * 3600);
    var m = (v - (v % 60)) / 60;
    var s = v - m * 60;
    return (sprintf(h) + ':' + sprintf(m) + ':' + sprintf(s));
} // end Duration()


/**
 * Create new hidden element or edit existing with new value and submit form
 * @param    string form Id
 * @param    string form element name
 * @param    string new value for the element
 * @param    string, confirm message
 */
function submitForm( A, B, C, D ) {
    try {
        if (typeof D != "undefined" && D != "") {
            if (false == confirm(D)) {
                return false;
            }
        }
        createHidOrUpdate(A, B, C);
        if (Ext.isElement(A)) {
            A.submit();
        }
        else {
            document.getElementById(A).submit();
        }
    }
    catch (e) {
        alert(e.toString());
    }
} // end submitForm()


/**
 * Create new hidden element or edit existing with new value
 * @param    string form Id
 * @param    string form element Name id not exists or element ID
 * @param    string new value for the element
 */
function createHidOrUpdate( A, B, C ) {	
    createItem = function(A, C){
        var B = document.createElement('INPUT');
        B.type = 'hidden';
        B.name = A;
        B.id = '_' + A + '_';
        B.value = C;
        return B;
    }
    if (!Ext.isElement(A)) {
        var A = document.getElementById(A);
    }
    try {
        if (!document.getElementById('_' + B + '_')) {
            B = createItem(B, C);
            A.appendChild(B);
        }
        else {
            if (!A[document.getElementById('_' + B + '_').name]) {
                B = createItem(B, C);
                A.appendChild(B);
            }
            else {
                A[document.getElementById('_' + B + '_').name].value = C;
            };
                }
    }
    catch (e) {
        alert(e.toString())
    }
} // end createHidOrUpdate()


/**
 * Create and pass link to hidden frame to start download
 * @param    object, url parameters to pass as get link
 * @param    boolean, to encode url before send, default false
 */
function Download(A, encode) {
    if (typeof A != 'object') {
        return false
    };
    if(!Ext.isBoolean(encode)) {
        var encode = false;
    }
    params = function(A, encode){
        var B = [];
        if (Ext.isEmpty(A.async_call)) {
            A['async_call'] = 1
        };
        if (Ext.isEmpty(A.download)) {
            A['download'] = 1
        };
        if(encode) {
            return Ext.urlEncode(A);
        }
        for (var i in A) {
            B.push(i + '=' + A[i]);
        }
        return B.join('&');
    }
    if (!document.getElementById('_DownFrame')) {
        var B = document.createElement("IFRAME");
        B.id = '_DownFrame';
        B.style.display = "none";
        document.body.appendChild(B);
    };
    if (typeof B != 'object') {
        var B = document.getElementById('_DownFrame');
    };
    B.src = './config.php?' + params(A, encode);
} // end Download()


/**
 * Open new window
 * @param    URI to open
 * @param    window width
 * @param    window height
 */
function newWindow ( url, _width, _height )
{
    if(typeof _width == "undefined") var _width = 600;
    if(typeof _height == "undefined") var _height = 400;

    var w = window.open (url, '_sbss', 'width=' + _width + ',height=' + _height + ',resizable=yes,status=no,menubar=no,scrollbars=yes');
    w.focus();
} // end newWindow()


/**
 * Returns all atrributes and there values for the given Object node like array
 * @param    object node
 */
function nodeAttributes( A ) {
    var B = {};
    for (var i = 0, off = A.attributes.length; i < off; i++) {
        if (!A.attributes[i].name) {
            continue;
        };
        B[A.attributes[i].name] = A.attributes[i].value;
    }
    return B;
} // end nodeAttributes()


/**
 * This function allows to input data only IP-address format
 * @param    string, field id
 */
function onlyIP( _field )
{
    var fields = _field.split(',');
    for(var i in fields)
    {
        if(typeof fields[i] != 'string') continue;
        if(!document.getElementById(Ext.util.Format.trim(fields[i]))) continue;

        var field = Ext.get(Ext.util.Format.trim(fields[i]));
        field.on('keypress', function(e){
            if(e.BACKSPACE == e.getKey() || e.DELETE == e.getKey())
                return true;

            var RegX = /[0-9]|\./;
            var key = String.fromCharCode( e.getKey() );

            if(!RegX.test(key)) {
                e.returnValue = false;
                e.preventDefault();
            }
        } );
    }
} // end onlyIP()


/**
 * This function allows to input only numeric data to the standart HTML input tag
 * @param    string, field id
 */
function onlyNumeric( _field )
{
    var fields = _field.split(',');
    for(var i in fields)
    {
        if(typeof fields[i] != 'string') continue;
        if(!document.getElementById(Ext.util.Format.trim(fields[i]))) continue;

        var field = Ext.get(Ext.util.Format.trim(fields[i]));
        field.on('keypress', function(e){
            if(e.BACKSPACE == e.getKey() || e.DELETE == e.getKey())
                return true;

            var RegX = /[0-9]/;
            var key = String.fromCharCode( e.getKey() );

            if(!RegX.test(key)) {
                e.returnValue = false;
                e.preventDefault();
            }
        } );
    }
} // end onlyNumeric()


/**
 * Change Element property disabled to specified state
 * @param    string / object, DOM element Id / DOM element
 * @param    boolena, new state
 */
function elementState( el, state )
{
    if(Ext.isEmpty(state)) state = false;
    try {
        if(typeof el == 'object') el.disabled = state
        else document.getElementById(el).disabled = state;
    } catch(e) { e.toString() }
} // end elementState()


/**
 * Get users list. You may call this function from any web place to select
 * one or more users for the future action to. The result of this function is Window
 * with grid. Returns grid object
 * @param    object: sm - row selection model (true: single, false: multi)
 *             filter - make storage request with passed params as static
 *             title - set specific window title
 *             tbSearch - if false, then gide search field, ddefault true
 *             callbackok: fuction to call on pressed OK button, this pass
 *             callbackcl: function to call on CANCEL button, this pass
 */
function showUsers( A )
{
    if(!Ext.isEmpty(Ext.getCmp('usersListWin'))){
        return
    }
    if(Ext.isEmpty(A)) {
        A = { sm: true, callbackok: false, callbackcl: false }
    }
    try {
        if(Ext.isEmpty(Localize)) {
            Localize = { };
        }
        if(Ext.isEmpty(A.tbSearch)) {
            A.tbSearch = true;
        }
    } catch(e) { Localize = { } }
    var SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        initComponent : function(){
            SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this);
        },
        validationEvent:false,
        validateOnBlur:false,
        trigger1Class:'x-form-clear-trigger',
        trigger2Class:'x-form-search-trigger',
        hideTrigger1:true,
        hasSearch : false,
        paramName : 'search',
        onTrigger1Click : function(){
            if(this.hasSearch){
                this.el.dom.value = '';
                var o = {start: 0, limit: 50};
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({params:o});
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click : function(){
            var v = this.getRawValue();
            if(v.length < 1){
                this.onTrigger1Click();
                return;
            };
            var o = {start: 0, limit: 50};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({params:o});
            this.hasSearch = true;
            this.triggers[0].show();
        }, 
		afterrender : function(){
			Ext.form.TriggerField.superclass.afterRender.call(this);
			var y;
			console.log('rendered. ');
			if (Ext.isIE && !this.hideTrigger) {
				if (Ext.isIE8||Ext.isIE6) { // IE6 is also discovered for IE9
					this.el.position();
					this.el.setY(this.el.getY()+1);	
				} else if(Ext.isIE7 && this.el.getY() !== (y = this.trigger.getY())){
					this.el.position();
					this.el.setY(y);
				}
			}
		}
    });
    var store = new Ext.data.JsonStore({
        root: 'results', 
        totalProperty: 'total',
        fields:['uid', 'category', 'name', 'type', 'phone', 'email', 'addrcode', 'address', 'addressraw'],
        baseParams:{ async_call: 1, devision: 22, getusers: 0, searchtype: 0 },
        sortInfo: { field: 'name', direction: "ASC" }
    });
    if (!Ext.isEmpty(A.showdefault)){
    	 store.baseParams.showdefault = A.showdefault;
    }
    if(!Ext.isEmpty(A.filter)){
        for(var i in A.filter){
            if(typeof A.filter[i] != 'function'){
                store.baseParams[i] = A.filter[i];
            }
        }
    }
    var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: Ext.isEmpty(A.sm) ? true : A.sm });
    var Btn = new Array();
    if(!Ext.isEmpty(A.callbackok)){
        Btn.push({
            xtype: 'button',
            text: Ext.app.Localize.get('Add'),
            handler: function(button){
                var parent = button.findParentByType('window');
                if(typeof A.callbackok == 'function') {
                    A.callbackok(parent.findByType('grid')[0]);
                }
                parent.close();
            }
        })
    };
    Btn.push({
        xtype: 'button',
        text: Ext.app.Localize.get('Cancel'),
        handler: function(button){
            parent = button.findParentByType('window');
            if(typeof A.callbackcl == 'function') {
                A.callbackcl(parent.findByType('grid')[0]);
            };
            parent.close();
        }
    });
    var Win = new Ext.Window({
        title: (!Ext.isEmpty(A.title)) ? A.title : Ext.app.Localize.get('Users'),
        id: 'usersListWin',
        buttonAlign: 'center',
        width: 700,
        items:[{
            xtype: 'grid',
            id: '_Users',
            height: 350,
            store: store,
            loadMask: true,
            autoExpandColumn: 'ext-userName',
            sm: sm,
            tbar: [ Ext.app.Localize.get('Search') + ':&nbsp;', {
                xtype: 'combo',
                id: '_listCombo',
                width: 160,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                value: 0,
                editable: false,
                store: new Ext.data.SimpleStore({
                    data: [
						['0', Ext.app.Localize.get('Person full name')],
						['1', Ext.app.Localize.get('Agreement')],
						['6', Ext.app.Localize.get('Paycode')],
						['2', Ext.app.Localize.get('User login')],
						['3', Ext.app.Localize.get('Account login')],
						['4', 'E-mail'],
						['5', Ext.app.Localize.get('Phone')],
						['7', Ext.app.Localize.get('Address')],
						['8', Ext.app.Localize.get('Similar addresses')]
                    ],
                    fields: ['id', 'name'] }),
                    listeners: {
                        select: function() {
                            store.baseParams.searchtype = this.getValue();
                        }
                    }
            },'&nbsp;', new SearchField({
                store: store,
                params: { start: 0, limit: 50},
                width: 227
            }) ],
            bbar: new Ext.PagingToolbar({ pageSize: 50, store: store, displayInfo: true }),
            cm: new Ext.grid.ColumnModel({
                columns: [sm, {
                        header: Ext.app.Localize.get('Person full name'),
                        id: 'ext-userName',
                        dataIndex: 'name',
                        sortable: true
                    }, {
                        header: Ext.app.Localize.get('User type'),
                        id: '_typeCol',
                        dataIndex: 'type',
                        width: 125,
                        sortable: true,
                        renderer: function(value) {
                            if(value == 2) {
                                return Ext.app.Localize.get('Physical person');
                            }
                            else {
                                return Ext.app.Localize.get('Legal person');
                            }
                        }
                    }, {
                        header: Ext.app.Localize.get('Phone'),
                        width: 120,
                        dataIndex: 'phone'
                    }, {
                        header: 'E-mail',
                        width: 120,
                        dataIndex: 'email'
                    }]
                })
            }],
        buttons: Btn
    });
    if(A.tbSearch == false) {
        Win.find('id', '_Users')[0].getTopToolbar().hide()
    }
    Win.show();
    store.reload({params: {start: 0, limit: 50}});
} // end showUsers()


/**
 * Get accounts list. You may call this function from any web place to select
 * one or more account for the future action to. The result of this function is Window
 * with grid. Returns grid object
 * @param    object: sm - row selection model (true: single, false: multi)
 *             filter - make storage request with passed params as static
 *             callbackok: fuction to call on pressed OK button, this pass
 *             callbackcl: function to call on CANCEL button, this pass
 */
function showAccounts( A )
{
    if(Ext.isEmpty(A)) { A = { sm: true, callbackok: false, callbackcl: false } }
    try { if(Ext.isEmpty(Localize)) { Localize = { } } } catch(e) { Localize = { } }
    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, { initComponent : function(){ Ext.app.SearchField.superclass.initComponent.call(this); this.on('specialkey', function(f, e){ if(e.getKey() == e.ENTER){ this.onTrigger2Click(); } }, this); }, validationEvent:false, validateOnBlur:false, trigger1Class:'x-form-clear-trigger', trigger2Class:'x-form-search-trigger', hideTrigger1:true, hasSearch : false, paramName : 'search', onTrigger1Click : function(){ if(this.hasSearch){ this.el.dom.value = ''; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = ''; this.store.reload({params:o}); this.triggers[0].hide(); this.hasSearch = false; } }, onTrigger2Click : function(){ var v = this.getRawValue(); if(v.length < 1){ this.onTrigger1Click(); return; }; var o = {start: 0, limit: 50}; this.store.baseParams = this.store.baseParams || {}; this.store.baseParams[this.paramName] = v; this.store.reload({params:o}); this.hasSearch = true; this.triggers[0].show(); } });
    var store = new Ext.data.Store({ proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST'}), reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total' }, [ { name: 'vgid', type: 'int' }, { name: 'login', type: 'string' }, { name: 'agrmid', type: 'int' }, { name: 'agrmnum', type: 'string' }, { name: 'username', type: 'string' }, { name: 'userid', type: 'int' }, { name: 'agentdescr', type: 'string' }]), baseParams:{ async_call: 1, devision: 7, getvgroups: 0, searchtype: 0}, sortInfo: { field: 'login', direction: "ASC" } });
    if(!Ext.isEmpty(A.filter)){ for(var i in A.filter){ if(typeof A.filter[i] != 'function'){ store.baseParams[i] = A.filter[i]; }}}
    var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect: Ext.isEmpty(A.sm) ? true : A.sm });
    var colModel = new Ext.grid.ColumnModel([ sm, { header: Ext.app.Localize.get('Login'), dataIndex: 'login', width: 150, sortable: true }, { header: Ext.app.Localize.get('Agreement'), dataIndex: 'agrmnum', width: 125, sortable: true }, { header: Ext.app.Localize.get('Person full name'), dataIndex: 'username', id: 'ext-userName', sortable: true } ]);
    var Btn = new Array();
    if(!Ext.isEmpty(A.callbackok)){ Btn.push({ xtype: 'button', text: Ext.app.Localize.get('Add'), handler: function(button){ var parent = button.findParentByType('window'); if(typeof A.callbackok == 'function'){ A.callbackok(parent.findByType('grid')[0]); } parent.close(); }}) };    Btn.push({ xtype: 'button', text: Ext.app.Localize.get('Cancel'), handler: function(button){ var parent = button.findParentByType('window'); if(typeof A.callbackcl == 'function'){ A.callbackcl(parent.findByType('grid')[0]); }; parent.close(); }});
    var Win = new Ext.Window({ modal: true, title: Ext.app.Localize.get('Accounts'), id: 'accListWin', buttonAlign: 'center', width: 653, items:[{ xtype: 'grid', width: 640, id: '_AccList', height: 350, store: store, cm: colModel, loadMask: true, autoExpandColumn: 'ext-userName', sm: sm, tbar: { hidden: Ext.isDefined(A['hideToolbar']) ? (A['hideToolbar']) : false , items: [ Ext.app.Localize.get('Search') + ':&nbsp;', { xtype: 'combo', id: '_listCombo', width: 150, displayField: 'name', valueField: 'id', typeAhead: true, mode: 'local', triggerAction: 'all', value: 0, editable: false, store: new Ext.data.SimpleStore({ data: [['0', Ext.app.Localize.get('Person full name')],['1', Ext.app.Localize.get('Agreement')],['2', Ext.app.Localize.get('Login')]], fields: ['id', 'name'] }), listeners: { select: function() { store.baseParams.searchtype = this.getValue(); } } },'&nbsp;', new Ext.app.SearchField({ store: store, params: { start: 0, limit: 50}, width: 227 }) ]}, bbar: new Ext.PagingToolbar({ pageSize: 50, store: store, displayInfo: true }) }], buttons: Btn });
    Win.show();
    store.reload({params: {start: 0, limit: 50}});
} // end showAccounts()


    /**
     * Печать чеков
     */
    salesCheckData = function (ptype,agrmid, p_sum, extid, pmid, authname, agrmnum, registerfolder, paymentType, feedWin) {
        Ext.Ajax.request({
            url: 'config.php',
            method: 'POST',
            params: {
                devision: 331,
                async_call: 1,
                printsales: 1,
                agrmid: agrmid
            },
            scope: {
                load: Ext.Msg.wait(Ext.app.Localize.get('Filling of the check') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
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
                        try {
                            if (data.results.isMebius){
                                MebInfo = data.results.tpl;
                                BigField = '';
                            }else{
                                MebInfo = '';
                                BigField = data.results.tpl;
                            }
                            var sales_data = [
                                [ptype, paymentType, '', 0, p_sum, extid, authname, '', '','','','', (Ext.isIE ? '' : '\n')].join(';'),
                                [MebInfo, 1, p_sum, (data.results.operCode) ? data.results.operCode : 0, '', '', '', '', data.results.taxGroup, '','','',BigField, (Ext.isIE ? '' : '\n')].join(';')
                            ];
                        }
                        catch(e) { console.log(e) }
                        if (pmid > 0) { saveCheckFile(registerfolder + (Ext.isWindows ? '\\' : '/') + 'pm-' + pmid + '.xte', sales_data); feedWin.hide();}
                        else { Ext.Msg.alert(Ext.app.Localize.get('Error'), 'Unknown payment ID'); }
                    }else{
                        Ext.Msg.alert(Ext.app.Localize.get('Error'), data.errors.reason);
                    }
                }
              return false;
            }
        });
    }

    var printReceipt = function( agrmid, p_sum, extid, pmid, authname, agrmnum, registerfolder, paymentType ) {
        var feedWin;
        if(!feedWin){
            feedWin = new Ext.Window({
                title: Ext.app.Localize.get('Print sales check'),
                buttonAlign: 'center',
                width: 350,
                modal: true
            });

            if (p_sum > 0){
                // Стандартный платеж с обычным чеком
                feedWin.addButton({
                    text: Ext.app.Localize.get('Print sales check'),
                    id: 'printStandart',
                    type: 'button',
                    handler:function( v ){
                        salesCheckData(1,agrmid, p_sum, extid, pmid, authname, agrmnum, registerfolder, paymentType, feedWin);
                    }
                });
            } else if (p_sum < 0){ // Отридцательный платеж: возможно Возврат или Снятие денег
                p_sum = Math.abs(p_sum);
                feedWin.addButton({ // Возврат средств
                    text: Ext.app.Localize.get('Repayment'),
                    id: 'printReturn',
                    type: 'button',
                    handler:function( v ){
                        salesCheckData(2,agrmid, p_sum, extid, pmid, authname, agrmnum, registerfolder, paymentType, feedWin);
                    }
                });
                feedWin.addButton({ // Снятие средств
                    text: Ext.app.Localize.get('Withdrawals'),
                    id: 'printWithdrawal',
                    type: 'button',
                    handler:function( v ){
                        salesCheckData(6,agrmid, p_sum, extid, pmid, authname, agrmnum, registerfolder, paymentType, feedWin);
                    }
                });
            }
            feedWin.addButton({ // Всегда доступное: не печатать чек
                text: Ext.app.Localize.get('Cancel'),
                id:'printCancel',
                handler:function( v ){
                    feedWin.hide();
                }
            });
        };
        feedWin.show();
    } // end printReceipt

    //
    // @param    string, local path to write file
    // @param    string or array, line to write
    var saveCheckFile = function(path, data) {
        if(!Ext.isArray(data)) {
            data = [data];
        }
        try {

            // isChrome && OPERA

            if(Ext.isIE) {
                var O = new ActiveXObject("Scripting.FileSystemObject");
                var i = path.lastIndexOf("\\");
                if (i >= 0) {
                    var file = path.substr(i + 1);
                }
                var folder = path.slice(0, i);
                if(!O.FolderExists(folder)) {
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Undefined-o') + ': "' + Ext.app.Localize.get('Cash Register folder') + '" (' + folder + ')')
                    return false;
                }
                if(!O.FileExists(path)) {
                    if(!(F = O.CreateTextFile(path))) {
                        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Can not create file') + ': ' + path);
                    }
                    else {
                        Ext.each(data, function(item){
                            this.WriteLine(item);
                        }, F)
                        F.Close()
                    }
                }
                else {
                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('The same file already exists') + ': ' + path);
                }
            }
            if(Ext.isGecko) {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                var F = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                F.initWithPath(path);

                if(!F.exists()) {
                    F.create(F.NORMAL_FILE_TYPE, 0644);
                }

                var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
                var uri = ioService.newFileURI(F);
                var channel = ioService.newChannelFromURI(uri);
                var Out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

                Out.init(F, 0x20|0x02, 00004, null);

                Ext.each(data, function(item){
                    if(this.charset) {
                        this.utf.charset = this.charset;
                        item = this.utf.ConvertFromUnicode(item)
                    }
                    this.file.write(item, item.length);
                }, {
                    file: Out,
                    utf: Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Components.interfaces.nsIScriptableUnicodeConverter),
                    charset: 'windows-1251'
                });

                Out.flush();
                Out.close();
            }
        }
        catch(e) {
            Ext.Msg.alert(Ext.app.Localize.get('Error'), e.toString());
        }
    }


/**
 * Make payment or promise payment, view payments history fot the specified agreement
 * @param    object,
 *             uid: user identification
 *             agrmid: user agreement unique number
 *             balance: agreement balance value (optional)
 *             onpayment: call back function after payment was commited
 */
function setPayment(o)
{
    Ext.QuickTips.init();

    if(Ext.isEmpty(o)) {
        var o = { uid: 0, agrmid: 0, balance: 0 };
    }

    if(!(o.uid) || o.uid <= 0) {
        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('user'));
        return false;
    }

    if(!(o.agrmid) || o.agrmid <= 0) {
        Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Undefined') + ': ' + Ext.app.Localize.get('agreement'));
        return false;
    }


    var C = ['balance', 'symbol', 'promiserent', 'promisetill', 'promisemin', 'promisemax', 'promiselimit'];
    var PAGELIMIT = 100;

    Ext.each(C, function(v){
        if(!(this[v])) {
            this.reload = true;
            return false;
        }
    }, o);

    if(!(o.reload)) {
        o.reload = false;
    }

    var Store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST',
            timeout: 380000,
            listeners: {
                exception: function(proxy, type, action, options, response) {
                    try {
                        var o = Ext.util.JSON.decode(response.responseText);
                        if (o.success === false) {
                            Ext.Msg.alert(Ext.app.Localize.get('Warning'), o.reason);
                        }
                    }
                    catch(e){

                    }
                }
            }
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [{
            name: 'agrmid',
            type: 'int'
        }, {
            name: 'amount',
            type: 'float'
        }, {
            name: 'symbol',
            type: 'string'
        }, {
            name: 'ordernum',
            type: 'string'
        }, {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, {
            name: 'localdate',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s'
        }, {
            name: 'recipe',
            type: 'string'
        }, {
            name: 'recordid',
            type: 'int'
        }, {
            name: 'uid',
            type: 'int'
        }, {
            name: 'mgr',
            type: 'string'
        }, {
            name: 'comment',
            type: 'string'
        }, {
            name: 'classid',
            type: 'int'
        }, {
            name: 'classname',
            type: 'string'
        }, {
            name: 'bsodoc',
            type: 'array'
        },{
            name: 'fromagrmnumber',
            type: 'string'
        },{
            name: 'paymentordernumber',
            type: 'string'
        }]),
        baseParams: {
            async_call: 1,
            devision: 199,
            getpayhistory: o.agrmid,
            start: 0,
            limit: PAGELIMIT
        }
    });


    new Ext.Window({
        title: Ext.app.Localize.get('Payments') + ' (' + Ext.app.Localize.get('Agreement') + ': ' + o.agrmnum + ')',
        id: 'paymentsWin',
        modal: true,
        border: false,
        width: 770,
        height: 380,
        minHeight: 340,
        layout:'fit',
        viewConfig: {forceFit: true},
        items: [{
            xtype: 'tabpanel',
            id: 'paymentsWindow',
            width: 736,
            plain: true,
            deferredRender: false,
            activeTab: 0,
            enableTabScroll: true,
            frame:true,
            items: [{
                title: Ext.app.Localize.get('Payment') + ' (' + Ext.app.Localize.get('Currency') + ': ' + !(o.symbol) ? '' : o.symbol + ')',
                id: 'paymentTab',
                layout: 'fit',
                items: [{
                    xtype: 'form',
                    url: 'config.php',
                    id: 'paymentForm',
                    callback: !(o.onpayment) ? function(){} : o.onpayment.createDelegate(o.scope),
                    orderTpl: '',
                    frame: true,
                    labelWidth: 170,
                    tbar: [
                    {
                        xtype: 'button',
                        text: Ext.app.Localize.get('Save payment'),
                        iconCls: 'ext-save',
                        disabled: true,
                        handler: function(){
                            // Возможность проводить 0-е платежи
                            //if(this.ownerCt.ownerCt.find('id', 'pmtForm_sum')[0].getValue() == 0) {
                            //    return;
                            //}
                        	
                        	if(!this.ownerCt.ownerCt.getForm().isValid()){
                        		Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Empty field') + ': ' + Ext.app.Localize.get('Sum'));
                        		return;
                        	}
                        	
                        	if(Ext.isEmpty(this.ownerCt.ownerCt.find('id', 'payment_manager')[0].getValue())){
                        		Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Empty field') + ': ' + Ext.app.Localize.get('Manager'));
                        		return;
                        	}
                        	
                        	
                            this.ownerCt.ownerCt.getForm().submit({
                                url: 'config.php',
                                method:'POST',
                                scope: {
                                    form: this.ownerCt.ownerCt
                                },
                                waitTitle: Ext.app.Localize.get('Connecting'),
                                waitMsg: Ext.app.Localize.get('Sending data') + '...',
                                success: function(form, action){
                                    var data = eval(action.response.responseText);
                                    var b = this.form.find('id', 'pmtForm_nbl')[0];
                                    var p = this.form.find('id', 'pmtForm_sum')[0];

                                    this.form.callback({
                                        agrmid: this.form.find('id', 'commit_payment')[0].getValue(),
                                        newBalance: b.getValue(),
                                        payment: p.getValue()
                                    });

                                    p.setValue(0);
                                    this.form.find('id', 'pmtForm_cbl')[0].setValue(b.getValue());

                                    Ext.getCmp('bso_set_id').setValue(0);
                                    Ext.getCmp('bso_doc_id').setValue(0);
                                    Ext.getCmp('searchBsoField').setValue('');
                                    Ext.getCmp('pmtForm_num').setValue('');

                                    Ext.getCmp('paymentsWin').find('id', 'promisedTab')[0].items.first().find('id', 'prmdForm_cbl')[0].setValue(b.getValue());
                                    b.setValue(0);

                                    uagrmid = this.form.find('id', 'commit_payment')[0].getValue();

                                    if (data.data.extid == 0 || Ext.isEmpty(data.data.registerfolder)) {
                                        if (data.bsoerr != 0){
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Payment was done, but failed to bind to the payment form') + data.bsoerr);
                                        }
                                        else
                                        {
                                            Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                                        }
                                    }
                                    else {
                                        if (data.bsoerr != 0){
                                            Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Payment was done, but failed to bind to the payment form') + data.bsoerr);
                                        }
                                        printReceipt(
                                            uagrmid,
                                            data.data.sum,
                                            data.data.extid,
                                            data.data.pmid,
                                            data.data.authname,
                                            data.data['agrmnum'],
                                            data.data.registerfolder,
                                            Ext.getCmp('_paymentType').getValue()
                                        );
                                    }
                                },
                                failure: function(form, action){
                                    if(action.failureType == 'server') {
                                        var o = Ext.util.JSON.decode(action.response.responseText);
                                        Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.error.reason);
                                    }
                                }
                            })
                        }
                    }, {
                        xtype: 'tbseparator',
                        id: 'register-group-sep',
                        hidden: true
                    }, {
                        xtype: 'button',
                        text: 'X ' + Ext.app.Localize.get('Report'),
                        hidden: true,
                        id: 'register-group-xrep',
                        iconCls: 'ext-table',
                        handler: function() {
                            var data = '3;1;;;;' + this.data.extid + ';' + this.data.authname + ';;;';
                            saveCheckFile(this.data.registerfolder + (Ext.isWindows ? '\\' : '/') + 'x-' + (new Date().format('YmdHis')) + '.xte', data);
                        }
                    }, {
                        xtype: 'tbspacer',
                        hidden: true,
                        id: 'register-group-sp'
                    }, {
                        xtype: 'button',
                        text: 'Z ' + Ext.app.Localize.get('Report'),
                        hidden: true,
                        id: 'register-group-zrep',
                        iconCls: 'ext-table',
                        handler: function() {
                            var data = '4;1;;;;' + this.data.extid + ';' + this.data.authname + ';;;';
                            saveCheckFile(this.data.registerfolder + (Ext.isWindows ? '\\' : '/') + 'z-' + (new Date().format('YmdHis')) + '.xte', data);
                        }
                    }],
                    items: [{
                        xtype: 'hidden',
                        name: 'async_call',
                        value: 1
                    }, {
                        xtype: 'hidden',
                        name: 'devision',
                        value: 199
                    }, {
                        xtype: 'hidden',
                        id: 'commit_payment',
                        name: 'commit_payment',
                        value: o.agrmid
                    }, {
                        xtype: 'textfield',
                        id: 'pmtForm_cbl',
                        width: 160,
                        readOnly: true,
                        value: !(o.balance) ? 0 : o.balance,
                        fieldLabel: Ext.app.Localize.get('Current Balance')
                    },
                    {
                        xtype: 'numberfield',
                        width: 160,
                        name: 'payment_sum',
                        id: 'pmtForm_sum',
                        fieldLabel: Ext.app.Localize.get('Payment sum'),
                        allowBlank: false,
                        listeners: {
                            change: function(a,n,o){
                                a.ownerCt.find('id', 'pmtForm_nbl')[0].setValue((a.ownerCt.find('id', 'pmtForm_cbl')[0].getValue()*1 + n).toFixed(2));
                            }
                        }
                    },

                     {
                        xtype: 'numberfield',
                        id: 'pmtForm_nbl',
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Set balance value'),
                        listeners: {
                            change: function(a,n,o){
                                a.ownerCt.find('id', 'pmtForm_sum')[0].setValue((n - a.ownerCt.find('id', 'pmtForm_cbl')[0].getValue()*1).toFixed(2));
                            }
                        }
                    },
                    
                    {
                        xtype: 'textfield',
                        name: 'paymentordernumber',
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Payment order number')
                    },

                    {
                        xtype: 'compositefield',
                        id: 'compositpnum',
                        fieldLabel: Ext.app.Localize.get('Pay document number'),
                        msgTarget : 'side',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'payment_number',
                                id: 'pmtForm_num',
                                width: 160,
                                validator: function(v){
                                    if(Ext.isEmpty(Ext.getCmp('paymentForm').orderTpl)) {
                                        Ext.getCmp('paymentForm').stopMonitoring();
                                        Ext.getCmp('paymentForm').getTopToolbar().items.items[0].enable();
                                        return true;
                                    }
                                    else {
                                        if(Ext.getCmp('paymentForm').orderTpl.test(v)) {
                                            Ext.getCmp('paymentForm').getTopToolbar().items.items[0].enable();
                                            return true;
                                        }
                                        else {
                                            Ext.getCmp('paymentForm').getTopToolbar().items.items[0].disable();
                                            return false;
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                id: 'btn_genPmt',
                                text: '',
                                handler: function(a){
                                    ldt = new Date();
                                    rval = Math.floor(Math.random() * 9999);
                                    Ext.getCmp('pmtForm_num').setValue(ldt.format('Ymdhis') + '-' + rval );
                                },
                                icon: 'images/key.png',
                                width: 22
                            }
                        ],
                        listeners: {
                            render: function(){
                            }
                        }
                    },
                    { xtype: 'hidden', id: 'bso_set_id', name: 'bso_set_id', value: 0 },
                    { xtype: 'hidden', id: 'bso_doc_id', name: 'bso_doc_id', value: 0 },
                    {
                        xtype: 'compositefield',
                        id: 'compositebso',
                        fieldLabel: Ext.app.Localize.get('Strict reporting form'),
                        msgTarget : 'side',
                        items: [
                            {
                                xtype: 'textfield',
                                id: 'searchBsoField',
                                name: 'searchBsoField',
                                value: '',
                                width: 160,
                                readOnly: true,
                                allowBlank: true
                            },
                            {
                                xtype: 'button',
                                id: 'searchBsoBtn',
                                iconCls: 'ext-search',
                                hideLabel: true,
                                width: 22,
                                handler: function(){
                                    // bsoSetId, bsoDocId, bsoValField
                                    searchBsoDoc( 'bso_set_id', 'bso_doc_id', 'searchBsoField');
                                }
                            }
                        ],
                        listeners: {
                            render: function(){
                                //if (correctType != 1){
                                //    Ext.getCmp('compositeagrm').getEl().up('.x-form-item').setDisplayed(false);
                                //}
                            }
                        }
                    },
                    {
                        xtype: 'datefield',
                        name: 'formattedDate',
                        width: 160,
                        format: 'Y-m-d',
                        value: new Date(),
			id: "payment_1st_tab_date",
                        fieldLabel: Ext.app.Localize.get('Payment date')
                    },
                    {
                        xtype: 'combo',
                        id: 'payment_manager',
                        fieldLabel: Ext.app.Localize.get('Manager'),
                        width: 190,
                        displayField: 'login',
                        valueField: 'personid',
                        tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis( values.login + " (" +values.name +" )", 35)]}</div></tpl>',
                        hiddenName: 'personid',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader(
                                { root: 'results' },
                                [
                                    { name: 'personid', type: 'int' }, 
									{ name: 'name', type: 'string' }, 
									{ name: 'login', type: 'string' }
                                ]
                            ),
                            autoLoad: true,
                            baseParams: {
                                async_call: 1, 
								devision: 13,
								getpaymanagers: 0
                            },
                            listeners: {
                                load: function(store) {
                                	Ext.Ajax.request({ 
			                            url: 'config.php',
			                            scope: this,
			                            success: function(a){
			                                var p = Ext.util.JSON.decode(a.responseText);
			                                Ext.getCmp('payment_manager').setValue(p.results);
			                            },
			                            params: { devision: 13, async_call: 1, getcurrentman: 1 }
			                        });
                                }
                            }
                        })
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: Ext.app.Localize.get('Class of payment'),
                        id: 'pclasscombo',
                        width: 190,
                        displayField: 'classname',
                        valueField: 'classid',
                        hiddenName: 'classid',
                        mode: 'local',
                        value: 0,
                        triggerAction: 'all',
                        editable: false,
                        //tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.classname} :: {values.descr}">{[Ext.util.Format.ellipsis(values.classname, 22)]}</div></tpl>',
                        store: new Ext.data.Store({
                            proxy: new Ext.data.HttpProxy({
                                url: 'config.php',
                                method: 'POST'
                            }),
                            reader: new Ext.data.JsonReader(
                                { root: 'results' },
                                [
                                    { name: 'classid', type: 'int' },
                                    { name: 'classname', type: 'string' },
                                    { name: 'descr', type: 'string'}
                                ]
                            ),
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
                                	Ext.Ajax.request({ 
			                            url: 'config.php',
			                            scope: this,
			                            success: function(a){
			                                var p = Ext.util.JSON.decode(a.responseText);
			                                Ext.getCmp('pclasscombo').setValue(p.results);
			                            },
			                            params: { devision: 199, async_call: 1, getDefaultManClass: 1 }
			                        });
                                	
                                    var classcmb = Ext.getCmp('pclasscombo');
    								classcmb.setValue( !Ext.isEmpty(classcmb.getValue()) && classcmb.getValue() > 0 ? classcmb.getValue() : 0 );
                                }
                            }
                        })
                    }, {
                        xtype: 'combo',
                        id: '_paymentType',
                        fieldLabel: Ext.app.Localize.get('Payment type'),
                        width: 190,
                        displayField: 'descr',
                        valueField: 'val',
                        typeAhead: true,
                        mode: 'local',
                        triggerAction: 'all',
                        value: 1,
                        editable: false,
                        store: new Ext.data.SimpleStore({
                            data: [
                                ['1', Ext.app.Localize.get('Cash')],
                                ['2', Ext.app.Localize.get('Cashless')],
                                ['3', Ext.app.Localize.get('Sell without check')],
                                ['4', Ext.app.Localize.get('Refund without check')]
                            ],
                            fields: ['val', 'descr'] })
                    }, {
                        xtype: 'textfield',
                        name: 'payment_comment',
                        width: 210,
                        fieldLabel: Ext.app.Localize.get('Comment')
                    }]
                }]
            }, {
                title: Ext.app.Localize.get('Promised payment'),
                id: 'promisedTab',
                layout: 'fit',
                items: [{
                    xtype: 'form',
                    url: 'config.php',
                    id: 'promisedForm',
                    callback: !(o.onpromised) ? function(){} : o.onpromised.createDelegate(o.scope),
                    frame: true,
                    labelWidth: 170,
                    tbar: [{
                        xtype: 'button',
                        text: Ext.app.Localize.get('Save payment'),
                        iconCls: 'ext-save',
                        disabled: true,
                        handler: function(){
                            if((this.ownerCt.ownerCt.find('id', 'prmdForm_sum')[0].getValue() + this.ownerCt.ownerCt.find('id', 'prmdForm_cbl')[0].getValue()) < 0) {
                                Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', Ext.app.Localize.get('Payment does not debit'));
                                return false;
                            }

                            if(this.ownerCt.ownerCt.promised.promisedexists > 0) {
                                Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', Ext.app.Localize.get('Promised exists'));
                                return false;
                            }

                            this.ownerCt.ownerCt.getForm().submit({
                                url: 'config.php',
                                method:'POST',
                                scope: this.ownerCt.ownerCt,
                                waitTitle: Ext.app.Localize.get('Connecting'),
                                waitMsg: Ext.app.Localize.get('Sending data') + '...',
                                success: function(){
                                    var b = this.find('id', 'prmdForm_sum')[0];
                                    this.callback({
                                        agrmid: this.find('id', 'commit_promised')[0].getValue(),
                                        newValue: b.getValue()
                                    });
                                    this.promised.promisedexists = 1;
                                    b.setValue(0);
                                    Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                                },
                                failure: function(form, action){
                                    if(action.failureType == 'server') {
                                        var o = Ext.util.JSON.decode(action.response.responseText);
                                        Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.error.reason);
                                    }
                                }
                            })
                        }
                    }],
                    items: [{
                        xtype: 'hidden',
                        name: 'async_call',
                        value: 1
                    }, {
                        xtype: 'hidden',
                        name: 'devision',
                        value: 199
                    }, {
                        xtype: 'hidden',
                        id: 'commit_promised',
                        name: 'commit_promised',
                        value: o.agrmid
                    }, {
                        xtype: 'numberfield',
                        width: 160,
                        name: 'promised_sum',
                        id: 'prmdForm_sum',
                        fieldLabel: Ext.app.Localize.get('Payment sum'),
                        validator: function(v){
                            if(v >= this.ownerCt.promised.promisemin && this.ownerCt.promised.promisemin <= v) {
                                this.ownerCt.getTopToolbar().items.items[0].enable();
                                return true
                            }
                            this.ownerCt.getTopToolbar().items.items[0].disable();
                            return false;
                        }
                    }, {
                        xtype: 'numberfield',
                        id: 'prmdForm_adbt',
                        width: 160,
                        readOnly: true,
                        value: 0,
                        fieldLabel: Ext.app.Localize.get('Allowed debt')
                    }, {
                        xtype: 'textfield',
                        id: 'prmdForm_cbl',
                        width: 160,
                        readOnly: true,
                        value: !(o.balance) ? 0 : o.balance,
                        fieldLabel: Ext.app.Localize.get('Current Balance')
                    }, {
                        xtype: 'textfield',
                        id: 'prmdForm_offdebt',
                        readOnly: true,
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Date to pay off debt')
                    }, {
                        xtype: 'numberfield',
                        id: 'prmdForm_maxsum',
                        readOnly: true,
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Maximum') + ' ' + Ext.app.Localize.get('payment')
                    }, {
                        xtype: 'numberfield',
                        id: 'prmdForm_minsum',
                        readOnly: true,
                        width: 160,
                        fieldLabel: Ext.app.Localize.get('Minimum') + ' ' + Ext.app.Localize.get('payment')
                    }]
                }]
            }, {
                title: Ext.app.Localize.get('Payments history'),
                id: 'historyTab',
                xtype: 'grid',
                height: 280,
                width: 700,
                layout: 'fit',
                tbar: [Ext.app.Localize.get('Since') + ':&nbsp;', {
                    xtype: 'datefield',
                    id: 'PFROM_Field',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: new Date().format('Y-m-01')
                }, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
                    xtype: 'datefield',
                    id: 'PTILL_Field',
                    allowBlank: false,
                    format: 'Y-m-d',
                    value: new Date().add(Date.MONTH, 1).format('Y-m-01')
                }, '&nbsp;', {
                    xtype: 'button',
                    iconCls: 'ext-search',
                    handler: function(){
                        this.ownerCt.ownerCt.store.baseParams.datefrom = this.ownerCt.find('id', 'PFROM_Field')[0].getValue().format('Y-m-d');
                        this.ownerCt.ownerCt.store.baseParams.datetill = this.ownerCt.find('id', 'PTILL_Field')[0].getValue().format('Y-m-d');
                        this.ownerCt.ownerCt.store.reload({
                            params: {
                                start: 0,
                                limit: PAGELIMIT
                            }
                        })
                    }
                }, {
                    xtype: 'tbseparator',
                    style: {
                        paddingLeft: '3px',
                        paddingRight: '3px'
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'ext-downcsv',
                    text: Ext.app.Localize.get('Download'),
                    menu: [{
                        text: Ext.app.Localize.get('Current page'),
                        handler: function() {
                            var M = this.ownerCt.findParentByType('grid').getVisibleModel();
                            Store.baseParams.datefrom = Ext.getCmp('PFROM_Field').getValue().format('Y-m-d');
                            Store.baseParams.datetill = Ext.getCmp('PTILL_Field').getValue().format('Y-m-d');
                            if(Store.getCount() == 0) {
                                return;
                            }
                            var O = {
                                clm: M.getString('col').trim(),
                                clmnames: Ext.urlEncode({ X: M.getString('names') }).substr(2).trim()
                            }
                            for(var i in Store.baseParams) {
                                O[i] = Store.baseParams[i];
                            }
                            Download(O);
                        }
                    }, {
                        text: Ext.app.Localize.get('All') + ' ' + Ext.app.Localize.get('pages'),
                        handler: function() {
                            var M = this.ownerCt.findParentByType('grid').getVisibleModel();
                            Store.baseParams.datefrom = Ext.getCmp('PFROM_Field').getValue().format('Y-m-d');
                            Store.baseParams.datetill = Ext.getCmp('PTILL_Field').getValue().format('Y-m-d');
                            if(Store.getCount() == 0) {
                                return;
                            }
                            var O = {
                                clm: M.getString('col').trim(),
                                clmnames: Ext.urlEncode({ X: M.getString('names') }).substr(2).trim()
                            }
                            for(var i in Store.baseParams) {
                                if (i != 'start' && i != 'limit') {
                                    O[i] = Store.baseParams[i];
                                }
                            }
                            Download(O);
                        }
                    }]
                }],
                cm: new Ext.grid.ColumnModel({
                    columns: [{
                        header: Ext.app.Localize.get('Payment date'),
                        dataIndex: 'date',
                        width: 100,
                        renderer: function(value, metaData, record) {
                            try {
                                metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
                                return value.format('d.m.Y');
                            }
                            catch(e){
                                return value
                            }
                        }
                    }, {
                        header: Ext.app.Localize.get('Payment commited'), 
                        dataIndex: 'localdate',
                        width: 117,
                        renderer: function(value, metaData, record) {
                            try {
                                metaData.attr = 'ext:qtip="' + value.format('d.m.Y H:i') + '"';
                                return value.format('d.m.Y');
                            }
                            catch(e){
                                return value
                            }
                        }
                    },  {
                        header: Ext.app.Localize.get('Payment order number'),
                        dataIndex: 'paymentordernumber',
                        width: 117
                    }, {
                        header: Ext.app.Localize.get('Manager'),
                        dataIndex: 'mgr',
                        id: 'managercolumn'
                    }, {
                        header: Ext.app.Localize.get('Sum'),
                        dataIndex: 'amount',
                        width: 110,
                        renderer: function(value, metaData, record) {
                            return value + ' ' + record.get('symbol')
                        }
                    }, {
                        header: Ext.app.Localize.get('Class of payment'),
                        dataIndex: 'classname',
                        width: 140
                    }, {
                        header: Ext.app.Localize.get('Transfer from'),
                        dataIndex: 'fromagrmnumber',
                        width: 140
                    }, {
                        header: Ext.app.Localize.get('Payment order'),
                        dataIndex: 'ordernum',
                        hidden: true,
                        width: 100
                    }, {
                        header: Ext.app.Localize.get('Comment'),
                        dataIndex: 'comment',
                        id: 'comment'
                    },     {
                        header: Ext.app.Localize.get('Strict reporting form'),
                        id: 'bsodocid',
                        dataIndex: 'bsodoc',
                        renderer: function(value, metaData, record) {
                            try {
                                if (value.recordid > 0){
                                    return value.setnumber + '/' + value.number;
                                }else{
                                    return '';
                                }
                            }
                            catch(e){ return value; }
                        },
                        width: 160
                    }


                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: false
                    }
                }),
                autoExpandColumn: 'comment',
                loadMask: true,
                store: Store,
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
                }),
                getVisibleModel: function(){
                    var B = {
                        col: [],
                        names: [],
                        getString: function(item){
                            if(!this[item]) {
                                return '';
                            }
                            else {
                                return this[item].join(';');
                            }
                        }
                    };
                    var A  = this.getColumnModel().getColumnsBy(function(C){
                        if(!C.hidden){
                            return true
                        }
                        return false
                    });
                    for(var i = 0, off = A.length; i < off; i++){
                        if(Ext.isEmpty(A[i].dataIndex)) {
                            continue;
                        }
                        B.col.push(A[i].dataIndex);
                        B.names.push(A[i].header.replace('&nbsp;', ' '));
                    }
                    return B
                }
            },{
                title: Ext.app.Localize.get('Transfer payment'),
                id: 'transferTab',
                layout: 'fit',
                items: [{
                    xtype: 'form',
                    url: 'config.php',
                    id: 'transferForm',
                    frame: true,
                    labelWidth: 170,
                    monitorValid: true,
                    //buttonAlign: 'top',
                    tbar: [
                    //buttons:[
                    {
                        xtype: 'button',
                        text: Ext.app.Localize.get('Transfer payment'),
                        formBind: true,
                        iconCls: 'ext-save',
                        id:'transferBtn',
                        //disabled: true,
                        handler:function( v ){
                            if (Ext.getCmp('transferSum').getValue() <= 0 || Ext.getCmp('transferAgrmId').getValue() <= 0){
                            	if(Ext.getCmp('transferSum').getValue() <= 0) {
                            		Ext.Msg.alert(Ext.app.Localize.get('Information'), Ext.app.Localize.get('Transfer amount should be more than 0'));
                            	}
                                return false;
                            }
                            v.ownerCt.ownerCt.getForm().submit({
                                url: 'config.php',
                                method:'POST',
                                scope: {
                                    form: this.ownerCt.ownerCt
                                },
                                waitTitle: Ext.app.Localize.get('Connecting'),
                                waitMsg: Ext.app.Localize.get('Sending data') + '...',

                                success: function(form, action){
                                    var data = eval(action.response.responseText);
                                    /**
                                     * @TODO: Печать чека при корректировках
                                     * @TODO: Перезагрузка родительской таблицы
                                     */
                                    if (typeof Ext.getCmp('_userAgreementsList') != "undefined" && Ext.getCmp('_userAgreementsList') != "") {
                                        Ext.getCmp('_userAgreementsList').store.reload();
                                    }
                                    if (typeof Ext.getCmp('_paymentsHistory') != "undefined" && Ext.getCmp('_paymentsHistory') != "") {
                                        Ext.getCmp('_paymentsHistory').store.reload();
                                    }

                                    Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Request done successfully'));
                                },
                                failure: function(form, action){
                                    if(action.failureType == 'server') {
                                        var o = Ext.util.JSON.decode(action.response.responseText);
                                        Ext.Msg.alert(Ext.app.Localize.get('Error') + '!', o.error.reason);
                                    }
                                }
                            });
                        }
                    }],
                    items: [
                        { xtype: 'hidden', name: 'async_call', value: 1 },
                        { xtype: 'hidden', name: 'devision', value: 199 },
                        { xtype: 'hidden', name: 'correctType', value: 3 },
                        { xtype: 'hidden', id: 'transferFromAgrm', name: 'transferFromAgrm', value: o.agrmid },
                        { xtype: 'hidden', name: 'transferAgrmId', id: 'transferAgrmId', value: 0 },
                        {
                            xtype: 'compositefield',
                            id: 'compositeagrm',
                            fieldLabel: Ext.app.Localize.get('Agreement number'),
                            msgTarget: 'qtip',
                            defaults: {
                                flex: 1
                            },
                            combineErrors: false,
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'searchAgrmField',
                                    name: 'searchAgrmField',
                                    readOnly: true,
                                    allowBlank: false,
                                    formBind: true,
                                    width: 160
                                },
                                {
                                    xtype: 'button',
                                    id: 'searchAgrmBtn',
                                    iconCls: 'ext-search',
                                    hideLabel: true,
                                    width: 22,
                                    handler: function(){
                                        selectAgrm(null, null, 'searchAgrmField', 'transferAgrmId', 'transferForm', null, null, null, unavail = -1);
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'numberfield',
                            width: 160,
                            name: 'transferSum',
                            id: 'transferSum',
                            fieldLabel: Ext.app.Localize.get('Transfer sum'),
                            maskRe: new RegExp("[0-9\.]"),
                            allowBlank: false,
                            formBind: true
                        },
                        {
                            xtype: 'compositefield',
                            id: 'compositrecipe',
                            fieldLabel: Ext.app.Localize.get('Pay document number'),
                            msgTarget: 'side',
                            anchor    : '-20',
                            defaults: {
                                flex: 1
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'recipe',
                                    id: 'transf_recipe',
                                    width: 160,
                                    msgTarget: 'side'
                                },
                                {
                                    xtype: 'button',
                                    id: 'btn_genPmt',
                                    text: '',
                                    handler: function(a){
                                        ldt = new Date();
                                        rval = Math.floor(Math.random() * 9999);
                                        Ext.getCmp('transf_recipe').setValue(ldt.format('Ymdhis') + '-' + rval );
                                    },
                                    icon: 'images/key.png',
                                    width: 22
                                }
                            ]
                        },
                        {
                            xtype: 'datefield',
                            name: 'pay_date',
                            id: 'pay_date',
                            width: 160,
                            format: 'Y-m-d',
                            value: new Date(),
                            readOnly: false,
                            formBind: true,
                            allowBlank: false,
                            fieldLabel: Ext.app.Localize.get('Payment date')
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: Ext.app.Localize.get('Class of payment'),
                            id: 'transf_pclasscombo',
                            width: 190,
                            displayField: 'classname',
                            valueField: 'classid',
                            hiddenName: 'transf_classid',
                            mode: 'local',
                            value: 0,
                            triggerAction: 'all',
                            editable: false,
                            tpl: '<tpl for="."><div class="x-combo-list-item" ext:qtip="{values.classname} :: {values.descr}">{[Ext.util.Format.ellipsis(values.classname, 22)]}</div></tpl>',
                            store: new Ext.data.Store({
                                proxy: new Ext.data.HttpProxy({
                                    url: 'config.php',
                                    method: 'POST'
                                }),
                                reader: new Ext.data.JsonReader(
                                    { root: 'results' },
                                    [
                                        { name: 'classid', type: 'int' },
                                        { name: 'classname', type: 'string' },
                                        { name: 'descr', type: 'string'}
                                    ]
                                ),
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
                                        Ext.Ajax.request({
                                            url: 'config.php',
                                            scope: this,
                                            success: function(a){
                                                var p = Ext.util.JSON.decode(a.responseText);
                                                Ext.getCmp('transf_pclasscombo').setValue(p.results);
                                            },
                                            params: { devision: 199, async_call: 1, getDefaultPClass: 1 }
                                        });
                                        Ext.getCmp('transf_pclasscombo').setValue(0);
                                    }
                                }
                            })
                        },
                        {
                            xtype:'textarea',
                            id: 'pay_comment',
                            name: 'pay_comment',
                            height:65,
                            width: 280,
                            layout:'fit',
                            fieldLabel: Ext.app.Localize.get('Comment'),
                            enableKeyEvents: true,
                            value: o.balance,
                            allowBlank: false
                        }
                    ]
                }]
            }, {
	            title: Ext.app.Localize.get('Promised payments history'),
                id: 'historyTab2',
                xtype: 'grid',
                height: 280,
                width: 700,
                layout: 'fit',
                tbar: [Ext.app.Localize.get('Since') + ':&nbsp;', {
                    xtype: 'datefield',
                    allowBlank: false,
                    format: 'Y-m-d',
					itemId: 'dtform',
                    value: new Date().format('Y-m-01')
                }, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
                    xtype: 'datefield',
                    allowBlank: false,
                    format: 'Y-m-d',
					itemId: 'dtto',
                    value: new Date().add(Date.MONTH, 1).format('Y-m-01')
                }, '&nbsp;', {
                    xtype: 'button',
                    iconCls: 'ext-search',
                    handler: function(Btn) {
                        Btn.ownerCt.ownerCt.store.baseParams.dtfrom = Btn.ownerCt.get(1).value;
                        Btn.ownerCt.ownerCt.store.baseParams.dtto = Btn.ownerCt.get(4).value;
						Btn.ownerCt.ownerCt.store.baseParams.agrmid = o.agrmid;
						Btn.ownerCt.ownerCt.store.reload({
                            params: {
                                start: 0,
                                limit: PAGELIMIT
                            }
                        })
                    }
                }],
                cm: new Ext.grid.ColumnModel({
                    columns: [{
                        header: Ext.app.Localize.get('Payment date'),
                        dataIndex: 'promdate',
                        width: 150
                    }, {
                        header: Ext.app.Localize.get('Valid until'),
                        dataIndex: 'promtill',
						width: 150
                    }, {
                        header: Ext.app.Localize.get('Amount'),
                        dataIndex: 'amount',
                        width: 150
                    }, {
                        header: Ext.app.Localize.get('Debt'),
                        dataIndex: 'debt',
                        width: 150
                    }, {
                        header: Ext.app.Localize.get('Status'),
                        dataIndex: 'payid',
                        width: 150,
						renderer: function(v){
							switch(v) {
							case -1: return Ext.app.Localize.get('Overdue'); break;
							case 0: return Ext.app.Localize.get('Not paid'); break;
							case 1: return Ext.app.Localize.get('Paid'); break;
							default: return Ext.app.Localize.get('Paid'); break;
							}
						}
                    }],
                    defaults: {
                        sortable: false,
                        menuDisabled: false
                    }
                }),
                loadMask: true,
                store: {
                	xtype: 'jsonstore',
			        root: 'results', 
					autoLoad: false,
			        totalProperty: 'total',
			        fields:['recordid', 'agrmid', 'payid', 'currid', 'debt', 'amount', 'promdate', 'promtill'],
			        baseParams: { 
						async_call: 1,
						devision: 199,
						getpromhist: 1,
						start: 1
					}
                },
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
								['50'],
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
            }],
            listeners: {
                tabchange: function(tabPanel, tab){
                    /**
                     * Подгонка тени для различных размеров окна
                     */
                    tabPanel.findParentByType('window').syncShadow();
                }
            }
        }],
        listeners: {
            resize: function(win){
                new Ext.util.DelayedTask(function(){
                    this.syncShadow();
                }, win).delay(Ext.isGeko ? 150 : 80);
            },
            show: function(){
                if (Ext.isEmpty(Ext.getCmp('pmtForm_numTpl'))) {
                    new Ext.ToolTip({
                        target: 'pmtForm_num',
                        id: 'pmtForm_numTpl',
                        autoHide: true,
                        html: 'Here Order'
                    })
                };

                Ext.Ajax.request({
                    url: 'config.php',
                    scope: this,
                    success: function(a){
                        var p = Ext.util.JSON.decode(a.responseText);
                        var tp = Ext.getCmp('pmtForm_numTpl');
                        var f = this.find('id', 'paymentForm')[0];

                        if(p.data.pordertpl.length > 0) {
                            f.getTopToolbar().items.items[0].enable();
                            f.orderTpl = new RegExp('^' + p.data.pordertpl + '$');
                            tp.destroy();
                        }
                        else {
                            f.orderTpl = null;
                            tp.html = p.data.pordernum;
                            tp.doLayout();
                        }
                    },
                    params: { devision: 105, async_call: 1, getpordertpl: 1 }
                });
            }
        }
    }).show();

    if(o.reload)
    {
        Ext.Ajax.request({
            url: 'config.php',
            success: function(a){
                var p = Ext.util.JSON.decode(a.responseText);
                Ext.getCmp('paymentsWin').setTitle(Ext.app.Localize.get('Payments') + ' (' + Ext.app.Localize.get('Agreement') + ': ' + p.result.number + ')');
		if (!p.result.balance) p.result.balance = 0;
                Ext.getCmp('pmtForm_cbl').setValue(p.result.balance.toFixed(2));
                /**
                 * Установка минимальной даты для календаря. (lock_period)
                 */
                Ext.getCmp('pay_date').setMinValue(p.result.lock_period);
		if (p.result.payments_cash_now == "1") {
			Ext.getCmp('payment_1st_tab_date').setReadOnly(true);
                	Ext.getCmp('pay_date').setReadOnly(true);
		}
                if (p.result.use_bso < 2){
                    Ext.getCmp('searchBsoBtn').disable();
                    Ext.getCmp('searchBsoField').disable();
                }

                    Ext.Ajax.request({
                       url: 'config.php',
                        success: function(result, request){
                        dt=Ext.util.JSON.decode (result.responseText);
                        new Ext.ToolTip({
                            target: 'pmtForm_sum',
                            html: Ext.app.Localize.get('RecomPayment')+': '+dt.sum+' '+dt.symbol
                        });

                    },
                       params: { devision:331, async_call: 1, recompayment:1, agrmid: o.agrmid }
                    });




                Ext.getCmp('paymentTab').setTitle(Ext.app.Localize.get('Payment') + ' (' + Ext.app.Localize.get('Currency') + ': ' + p.result.symbol + ')');

                if (!Ext.isEmpty(p.result.extid) && !Ext.isEmpty(p.result.registerfolder)) {
                    Ext.getCmp('paymentTab').items.first().getTopToolbar().findBy(function(item){
                        if (this.byid.test(item.getId())) {
                            item.show();
                            if(item.getXType() == 'button') {
                                item.handler = item.handler.createDelegate({
                                    data: p.result
                                })
                            }
                        }
                    }, {
                        byid: new RegExp('register-group')
                    });
                }

                Ext.getCmp('prmdForm_cbl').setValue(p.result.balance.toFixed(2));
                Ext.getCmp('promisedTab').setTitle(Ext.app.Localize.get('Promised payment') + ' (' + Ext.app.Localize.get('Currency') + ': ' + p.result.symbol + ')');

                try {
                    if(p.result.ispromised == true) {
                        Ext.getCmp('promisedTab').enable();
                    }
                    else {
                        Ext.getCmp('promisedTab').disable();
                    }
                }
                catch(e){
                    Ext.getCmp('promisedTab').disable();
                }

		Ext.getCmp('prmdForm_offdebt').setValue(new Date().add(Date.DAY, p.result.promisetill).format('Y-m-d'));
                Ext.getCmp('prmdForm_maxsum').setValue(p.result.promisemax);
                Ext.getCmp('prmdForm_minsum').setValue(p.result.promisemin);
                Ext.getCmp('prmdForm_adbt').setValue(p.result.promiselimit * -1);

                Ext.each(['promisetill', 'promisemin', 'promisemax', 'promiselimit', 'promisedexists'], function(v){
                    if(!(this.form.promised)) {
                        this.form.promised = {};
                    }

                    try {
                        this.form.promised[v] = this.result[v];
                    }
                    catch(e){ }
                }, { result: p.result, form: Ext.getCmp('promisedForm') })
            },
            params: { devision: 22, async_call: 1, getagrmbal: o.uid, agrmid: o.agrmid, getppset: o.agrmid }
        });
    }
} // end setPayment


/**
 * Call function to create agreement document or other using template
 * @param    string, form id
 */
function createTemplDoc( _formId )
{
    try {
        var _form = document.getElementById(_formId);
        _form.target = '_blank';
        _form.action = 'document.php';
        _form.submit();

        _form.target='_self';
        _form.action='config.php';
    } catch(e) { alert(e.toString()) }
} // end createTemplDoc()


/**
 * Parse recived line and set values to specific fields
 * @param    string, form id
 * @param    string, prefix
 * @param    string, line with value separated by comma
 */
function setSelectedAddress( _formId, prefix, _string )
{
    try {
        var _form = document.getElementById(_formId);
        if(typeof prefix == "undefined" || prefix == "") return false;
        var string = _string.split(',');

        if(string.length <= 1) return false;
        var _elements = new Array("_user_country_", "_user_city_", "_user_street_", "_user_bnum_", "_user_bknum_", "_user_apart_", "_user_addr_");
        for(var i = 0, off = _elements.length; i < off; i++)
        {
            try { document.getElementById(_elements[i] + prefix).value = string[i] } catch(e) { }
        }
    } catch(e) { alert(e.toString()) }
} // end setSelectedAddress()


/**
 * Get cookie content
 * @param    cookie name
 */
function getCookie( labelName )
{
    var cookieData = document.cookie;
    var cLen = cookieData.length;
    var cEnd;
    var i = 0;
    while(i < cLen)
    {
        var j = i + labelName.length;
        if(cookieData.substring(i,j) == labelName)
        {
            cEnd = cookieData.indexOf(";",j);
            if(cEnd == -1) cEnd = cLen;
            return unescape(cookieData.substring(j + 1,cEnd));
        }
        i++;
    }
    return false;
} // end getCookie()


/**
 * Set MaxLength for field
 * @param event
 * @param Object
 * @param maximum length
 * @example: onkeypress="return imposeMaxLength(this, 1023);"
 */
function imposeMaxLength(event, Object, MaxLen) {
    if (event.keyCode!=8)
        return (Object.value.length <= MaxLen);
}

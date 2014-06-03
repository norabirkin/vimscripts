Ext.onReady(function() {

    Ext.QuickTips.init();
    var PAGELIMIT = 100;

    var Store = new Ext.data.GroupingStore({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST',
            timeout: 380000
        }),
        reader: new Ext.data.JsonReader({
            root: 'results',
            totalProperty: 'total'
        }, [
            { name: 'uid', type: 'int' },
            { name: 'istemplate', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'balance', type: 'float' },
            { name: 'agrmid', type: 'int' },
            { name: 'agrmnum', type: 'string' },
            { name: 'symbol', type: 'string' },
            { name: 'descr', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'phone', type: 'string' },
            { name: 'addrtype', type: 'int' },
            { name: 'addrcode', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'vgcnt', type: 'int' },
            { name: 'login', type: 'string' },
            { name: 'type', type: 'int' },
            { name: 'address_1', type: 'string' },
            { name: 'address_2', type: 'string' },
            { name: 'address_3', type: 'string' },
            { name: 'ppdebt', type: 'float' },
            { name: 'category', type: 'int' },
            { name: 'code', type: 'string' },
            { name: 'opername', type: 'string' }
        ]),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        groupField: 'uid',
        baseParams:{
            async_call: 1,
            devision: 22,
            getusers: 0,
            listext: 1,
            searchtype: 0,
            category: 0,
            start: 0,
            istemplate: 0,
            limit: PAGELIMIT
        },
        remoteSort: true,
        sortInfo: {
            field: 'name',
            direction: 'ASC'
        },
        autoLoad: AUTOLOAD,
        getUserCatName: function(cat) {
            switch(cat) {
                case 1: return Ext.app.Localize.get('Operator');
                case 2: return Ext.app.Localize.get('Dealer');
                case 3: return Ext.app.Localize.get('LegalOwner');
                case 4: return Ext.app.Localize.get('Advertiser');
                case 5: return Ext.app.Localize.get('Partner');
                case 6: return Ext.app.Localize.get('Agent');
                default: return Ext.app.Localize.get('Subscriber');
            }
        }
    });


    var DocStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({url: 'config.php',method: 'POST'}),
        id: '_DocStore',
        baseParams: {
            async_call: 1,
            devision: 121,
            getdocs: 1,
            agrmid: 0,
            start: 0,
            limit: PAGELIMIT
        },
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            { name: 'saleid', type: 'int' },
            { name: 'agrmid', type: 'int' },
            { name: 'ownerid', type: 'int' },
            { name: 'amountcurid', type: 'int' },
            { name: 'currsymb', type: 'string' },
            { name: 'currnum', type: 'string' },
            { name: 'amountcur', type: 'float' },
            { name: 'revisions', type: 'int' },
            { name: 'amountcurvat', type: 'string' },
            { name: 'amount', type: 'string' },
            { name: 'amountvat', type: 'string' },
            { name: 'receiptseq', type: 'int' },
            { name: 'receipt', type: 'string' },
            { name: 'saledate', type: 'string' },
            { name: 'localdate', type: 'string' },
            { name: 'canceldate', type: 'string' },
            { name: 'paydate', type: 'string' },
            { name: 'perioddate', type: 'string' },
            { name: 'bdate', type: 'string' },
            { name: 'edate', type: 'string' },
            { name: 'comment', type: 'string' },
            { name: 'modperson', type: 'int' },
            { name: 'managername', mapping: 'nameperson', type: 'string' }
        ]
        ),
        autoLoad: false
    });
    
    var UGroups = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'descr', type: 'string' }
        ]),
        baseParams: {
            async_call: 1,
            devision: 22,
            getgroups: 1,
            limit: PAGELIMIT
        },
        sortInfo: {
            field: 'id',
            direction: 'ASC'
        },
        autoLoad: true
    });

    var PStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        baseParams: {
            async_call: 1,
            devision: 199,
            getpayhistory: 0,
            start: 0,
            limit: PAGELIMIT
        },
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            { name: 'amount', type: 'float' },
            { name: 'currid', type: 'int' },
            { name: 'symbol', type: 'string' },
            { name: 'ordernum', type: 'string' },
            { name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s' },
            { name: 'recipe', type: 'string' },
            { name: 'comment', type: 'string' },
            { name: 'mgr', type: 'string' },
            { name: 'recordid', type: 'int' },
            { name: 'uid', type: 'int' },
            { name: 'classid', type: 'int' },
            { name: 'classname', type: 'string'},
            { name: 'localdate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
            { name: 'agrmid', type: 'int' },
            { name: 'lock_period', type: 'date', dateFormat: 'Y-m-d H:i:s' },
            { name: 'revisions', type: 'int' },
            { name: 'revno', type: 'int' },
            { name: 'fromagrmid', type: 'int' },
            { name: 'canceldate', type: 'date', dateFormat: 'Y-m-d H:i:s' },
            { name: 'orig_payment', type: 'float' },
            { name: 'orig_agrm', type: 'int' },
            { name: 'bsodoc', type: 'array' },
            { name: 'use_bso', type: 'int' },
            { name: 'additional', type: 'string' }
        ]),
        //sortInfo: {
        //    field: 'localdate',
        //    direction: "DESC"
        //},
        autoLoad: false
    });


    var RStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'config.php',
            method: 'POST'
        }),
        baseParams: {
            async_call: 1,
            devision: 199,
            getdoctpls: 3
        },
        reader: new Ext.data.JsonReader({
            root: 'results'
        }, [
            { name: 'docid', type: 'int' },
            { name: 'name', type: 'string'}
        ]),
        autoLoad: true
    });

    var RButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: Ext.app.Localize.get('Print a receipt'),
        width: 22,
        iconCls: 'ext-table'
    });

    var CButton = new Ext.grid.RowButton({
        header: '&nbsp;',
        width: 22,
        iconCls: 'ext-edit',
        menuDisabled: true
    });

    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        width: 280,
        initComponent: function(){
            Ext.app.SearchField.superclass.initComponent.call(this);
            this.on('specialkey', function(f, e){
                if (e.getKey() == e.ENTER) {
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
            PStore.removeAll();
            if (this.hasSearch) {
                this.el.dom.value = '';
                var o = {
                    start: 0,
                    limit: PAGELIMIT
                };
                this.store.baseParams = this.store.baseParams ||{};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({
                    params: o
                });
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click: function(){
            PStore.removeAll();
            var v = this.getRawValue();

            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            }
            var o = {
                start: 0,
                limit: PAGELIMIT
            };
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({
                params: o
            });
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });

    // Function to compose storage base params for server list filtering
    // @param    boolean, if pass true to function than call storage load
    // @param    boolean, reset list
    advSearch = function(l,r){
        var c = Ext.getCmp('advSearchList');
        var n = new RegExp('searchtpl','i');
        var s = {};
        var l = l || false;
        if(r == true){
            c.setValue('');
        }
        for(var i in Store.baseParams){
            if(!n.test(i)) {
                s[i] = Store.baseParams[i];
            }
        }
        Store.baseParams = s;
        if(c.mainStore.find('tplname', c.getValue()) > -1) {
            c.mainStore.each(function(r,idx){
                if(r.data.tplname != this.tplname) {
                    return;
                }
                for(var i in r.data) {
                    if(i == 'tplname') {
                        continue;
                    }
                    this.store.baseParams['searchtpl[' + idx + '][' + i + ']'] = r.data[i];
                }
            }, { store: Store, tplname: c.getValue() });
        }
        if(l) {
            Store.reload({ params: { start: 0, limit: PAGELIMIT } });
        }
    }


    var UsersGrid = new Ext.grid.GridPanel({

        id: '_userAgreementsList',
        title: Ext.app.Localize.get('Users') + ' / ' + Ext.app.Localize.get('Agreements'),
        store: Store,

        loadMask: true,

        tbar: [{
            xtype: 'combo',
            id: '_usergrpsCombo',
            width: 200,
            tpl: '<tpl for="."><div class="x-combo-list-item">{[Ext.util.Format.ellipsis(values.name, 32)]}</div></tpl>',
            displayField: 'name',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            store: UGroups,
            listeners: {
                select: function() {
                    Store.baseParams.getusers = this.getValue();
                    Store.reload({ params: { start: 0, limit: PAGELIMIT }});
                }
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'combo',
            id: '_categoryCombo',
            width: 180,
            displayField: 'name',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            value: 0,
            editable: false,
            store: new Ext.data.ArrayStore({
                data: [
                    ['-1', 1, Ext.app.Localize.get('All')],
                    ['0', 1, Ext.app.Localize.get('Subscriber')],
                    ['1', 1, Ext.app.Localize.get('Operator')],
                    ['2', 1, Ext.app.Localize.get('Dealer')],
                    ['3', 1, Ext.app.Localize.get('LegalOwner')],
                    ['4', 1, Ext.app.Localize.get('Advertiser')],
                    ['5', 1, Ext.app.Localize.get('Partner')],
                    ['6', 1, Ext.app.Localize.get('Agent')]
                ],
                fields: ['id', 'perm', 'name']
            }),
            listeners: {
                render: function(){
                    Ext.Ajax.request({
                        url: 'config.php',
                        scope: this,
                        success: function(a){
                            var p = Ext.util.JSON.decode(a.responseText);
                            var o = this.store.getAt(this.store.find('id', 1));

                            if(p.filterperm[1] < 1) {
                                o.data.perm = 0;
                            }
                        },
                        params: { async_call: 1, devision: 22, filterperm: 0 }
                    });
                },
                beforeselect: function(c, r, i){
                    if(r.data.perm < 1) {
                        Ext.Msg.alert(Ext.app.Localize.get('Warning'), Ext.app.Localize.get('Access restricted') + '!');
                        return false;
                    }
                    return true;
                },
                select: function(){
                    Store.baseParams.category = this.getValue();
                    Store.reload({ params: { category: this.getValue() }});
                }
            }
        }, {
            xtype: 'tbseparator',
            style: {
                paddingLeft: '3px',
                paddingRight: '3px'
            }
        }, {
            xtype: 'checkbox',
            width: 23,
            height:23,
            checked: false,
            listeners: {
                render: function() {
                    var qtip = document.createAttribute("ext:qtip");
                    qtip.value = Ext.app.Localize.get('Advanced search');
                    this.getEl().dom.attributes.setNamedItem(qtip);
                }
            },
            handler: function(A, B){
                A.ownerCt.items.eachKey(function(A,B,C) {
                    if(this.checked) {
                        if(this.tplA.test(B.id)) {
                            B.show();
                        }
                        if(this.tplS.test(B.id)) {
                            if(Ext.isDefined(B['hasSearch']) && B['hasSearch']) {
                                B.onTrigger1Click();
                            }
                            B.hide();
                        }
                    }
                    else {
                        if(this.tplA.test(B.id)) {
                            B.hide();
                        }
                        if(this.tplS.test(B.id)) {
                            B.show();
                        }
                    }
                }, {
                    checked: B,
                    tplA: new RegExp('advSearch'),
                    tplS: new RegExp('SmplSearch')
                });

                if(!B){
                    advSearch(true, true);
                }
            }
        }, {
            xtype: 'combo',
            id: 'SmplSearchCombo',
            width: 164,
            displayField: 'name',
            valueField: 'id',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            value: 0,
            editable: false,
            store: new Ext.data.ArrayStore({
                data: [
                    ['0', Ext.app.Localize.get('Person full name')],
                    ['1', Ext.app.Localize.get('Agreement')],
                    ['6', Ext.app.Localize.get('Paycode')],
                    ['2', Ext.app.Localize.get('User login')],
                    ['3', Ext.app.Localize.get('Account login')],
                    ['4', 'E-mail'],
                    ['5', Ext.app.Localize.get('Phone')],
                    ['7', Ext.app.Localize.get('Address')]
                ],
                fields: ['id', 'name']
            }),
            listeners: {
                select: function(){
                    Store.baseParams.searchtype = this.getValue();
                }
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, new Ext.app.SearchField({
            id: 'SmplSearchField',
            store: Store,
            params: {
                start: 0,
                limit: PAGELIMIT
            },
            width: 227
        }), {
            xtype: 'combo',
            hidden: true,
            id: 'advSearchList',
            width: 194,
            displayField: 'tplname',
            valueField: 'tplname',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: true,
            store: new Ext.data.ArrayStore({
                fields: [{ name: 'tplname', type: 'string' }],
                data: []
            }),
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
                                this.store.sort('tplname', 'ASC');
                            }
                        }, { store: C.store, mainStore: C.mainStore });
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
            id: 'advSearchStart',
            hidden: true,
            text: Ext.app.Localize.get('Search'),
            iconCls: 'ext-search',
            handler: function(){
                advSearch(true);
            }
        }, {
            xtype: 'button',
            id: 'advSearchEdit',
            text: Ext.app.Localize.get('Change') + '&nbsp;' + Ext.app.Localize.get('rules') + ' / ' + Ext.app.Localize.get('Create') + '&nbsp;' + Ext.app.Localize.get('rules'),
            hidden: true,
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
        }],
        listeners: {
            render: function(grid) {
                var store = grid.getStore();
                var view = grid.getView();
                grid.tip = new Ext.ToolTip({
                    target: view.mainBody,
                    delegate: '.x-grid3-row',
                    trackMouse: true,
                    renderTo: document.body,
                    maxWidth: 500,
                    tpl: new Ext.XTemplate('<p style="color: back; font-weight: bold">{[Ext.app.Localize.get("Additional information")]}:</p><ul>',
                        '<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("User name")]}:</span> {name}</li>',
                        '<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Description")]}:</span> {descr}</li>',
                        '<li style="padding-top: 3px"><span style="color: black">E-mail:</span> {email}</li>',
                        '<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Phone")]}:</span> {phone}</li>',
                        '<li style="padding-top: 3px"><span style="color: black"><tpl if="type == 2">{[Ext.app.Localize.get("Registered address")]}</tpl><tpl if="type == 1">{[Ext.app.Localize.get("Legal address")]}</tpl>:</span> {address_1}</li>',
                        '<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Post address")]}:</span> {address_2}</li>',
                        '<li style="padding-top: 3px"><span style="color: black">{[Ext.app.Localize.get("Address to deliver invoice")]}:</span> {address_3}</li>',
                        '</ul>'
                    ),
                    listeners: {
                        beforeshow: function updateTipBody(tip) {
                            var rowIndex = view.findRowIndex(tip.triggerElement);
                            tip.tpl.overwrite(tip.body, store.getAt(rowIndex).data);
                        }
                    }
                })
            },
            rowclick: function(grid, rowIndex, e) {
                agrmid=Store.getAt(rowIndex).data.agrmid;
                DocStore.setBaseParam('agrmid', agrmid);
                
                if (DocStore.baseParams.agrmid > 0)
                {
                	DocStore.baseParams.datefrom = Ext.getCmp('PFROM').getValue().format('Y-m-d');
                	DocStore.baseParams.datetill = Ext.getCmp('PTILL').getValue().format('Y-m-d');
                }
                DocStore.reload();

            }
        },
        view: new Ext.grid.GroupingView({
            forceFit: true,
            enableGroupingMenu: false,
            groupTextTpl: '<span style="color:black">{[values.rs[0].data.name]} {[values.rs[0].data.email.length > 0 ? "&nbsp;::&nbsp;" + values.rs[0].data.email : ""]} {[values.rs[0].data.descr.length > 0 ? "&nbsp;::&nbsp;" + values.rs[0].data.descr : ""]}</span>'
        }),
        cm: new Ext.grid.ColumnModel({
            columns: [{
                header: 'UID',
                dataIndex: 'uid',
                width: 30,
                hidden: true
            }, {
                header: Ext.app.Localize.get('Agreement number'),
                width: 180,
                dataIndex: 'agrmnum'
            }, {
                header: Ext.app.Localize.get('Operator'),
                dataIndex: 'opername'
            }, {
                header: Ext.app.Localize.get('Paycode'),
                width: 80,
                dataIndex: 'code'
            }, {
                header: Ext.app.Localize.get('Balance'),
                dataIndex: 'balance',
                width: 110,
                renderer: function(value, metaData, record) {
                    if (value < 0) {
                        metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + '"'
                        return '<span style="color:red">' + value + '</span> ' + record.get('symbol');
                    }
                    else {
                        return value + ' ' + record.get('symbol');
                    }
                }
            }, {
                header: Ext.app.Localize.get('Promised payment'),
                dataIndex: 'ppdebt',
                width: 115,
                sortable: false,
                renderer: function(value, metaData, record) {
                        metaData.attr = 'ext:qtip="' + value + ' ' + record.get('symbol') + ' ' + (value == 0 ? '(' + Ext.app.Localize.get('Empty data') + ')' : '') + '"';
                        return value + ' ' + record.get('symbol');
                }
            }],
            defaults: {
                sortable: true,
                menuDisabled: true
            }
        }),
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
                        PAGELIMIT = this.getValue() * 1;
                        this.ownerCt.pageSize = PAGELIMIT;
                        Store.reload({ params: { limit: PAGELIMIT } });
                    }
                }
            }]
        })
    });

    /**
     * Таблица со сгенерированными счетами
     */
    var Edit = new Ext.grid.RowButton({ 
        header: '&nbsp;',
        width: 22,
        menuDisabled: true,
        qtip: Ext.app.Localize.get('Edit'),
        iconCls: function(record,x,c){
            /**
             * Даем просмотреть документ в любом случае
             */
            if (!record.data.canceldate)
                return 'ext-edit';
            else return 'ext-table';
        }
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        width: 22,
        menuDisabled: true,
        qtip: function(record,x,c){
            if (record.data.canceldate){
                return '';
            } else {
                return Ext.app.Localize.get('Cancel');
            }
        },
        iconCls: function(record,x,c){
            if (record.data.canceldate){
                return 'gridBtnEmpty';
            } else {
                return 'ext-drop';
            }
        }
    });
    

    var History = new Ext.grid.RowButton({
        header: '&nbsp;',
        tplModel: true,
        qtip: Ext.app.Localize.get('History'),
        width: 22,
        iconCls: 'ext-history'
    }); 

    var UsersDocs = new Ext.grid.GridPanel({
        title: Ext.app.Localize.get('Documents of charges'),
        store: DocStore,
        loadMask: true,
        id: '_UsersDocs',
        tbar: [
            Ext.app.Localize.get('Since') + ':&nbsp;',
            {
                xtype: 'datefield',
                id: 'PFROM',
                allowBlank: false,
                format: 'Y-m-d',
                value: new Date().format('Y-m-01')
            }, '&nbsp;', Ext.app.Localize.get('Till') + ':&nbsp;', {
                xtype: 'datefield',
                id: 'PTILL',
                allowBlank: false,
                format: 'Y-m-d',
                value: new Date().add(Date.MONTH, 1).format('Y-m-01')
            }, '&nbsp;', {
                xtype: 'button',
                iconCls: 'ext-search',
                handler: function(){
                   if (DocStore.baseParams.agrmid > 0) {
                   	DocStore.baseParams.datefrom = this.ownerCt.find('id', 'PFROM')[0].getValue().format('Y-m-d');
                	DocStore.baseParams.datetill = this.ownerCt.find('id', 'PTILL')[0].getValue().format('Y-m-d');
                	DocStore.reload();
                    }
                }
            }, {
                xtype: 'tbseparator',
                style: {
                    paddingLeft: '3px',
                    paddingRight: '3px'
                }
            }, {
                xtype: 'button',
                iconCls: 'ext-print',
                qtip: Ext.app.Localize.get('Print'),
                handler: function(){
                    Print(this.ownerCt.ownerCt);
                }
            }, {
                xtype: 'tbseparator',
                style: {
                    paddingLeft: '3px',
                    paddingRight: '3px'
                }
            }
        ],
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
        },
        plugins: [Edit,Remove, History],
        viewConfig: {
            forceFit: true,
            emptyText : Ext.app.Localize.get('Nothing was found with current filter settings'),
            /**
             * выделяем цветом в зависимости от того аннулирован ли документ
             */
            getRowClass: function(record, index) {
				if(record.get('revisions') > 0 && record.get('canceldate') == '') {
					 return 'x-type-payment-edited';
				}
                if (record.get('canceldate')) {
                    return 'x-type-payment-canceled';
                }
            }
        },
        autoExpandColumn: 'comment',
        cm: new Ext.grid.ColumnModel({
            columns: [
                Edit,
                History,
                {
                    header: Ext.app.Localize.get('Period'),
                    dataIndex: 'perioddate'
                },{
                    header: Ext.app.Localize.get('Docdate'),
                    dataIndex: 'saledate',
                    renderer: function(value) {
						try {
							return value.format('Y-m-d');
						} catch(e) {} 
						return value;
                    }
                },{
                    header: Ext.app.Localize.get('DocReceipt'),
                    dataIndex: 'receipt'
                },{
                    header: Ext.app.Localize.get('Amountcur'),
                    dataIndex: 'amountcur'
                },{
                    header: Ext.app.Localize.get('Amount of Tax'),
                    dataIndex: 'amountcurvat'
                },{
                    header: Ext.app.Localize.get('Pay date'),
                    dataIndex: 'paydate'
                },{
                    header: Ext.app.Localize.get('Cancel date'),
                    dataIndex: 'canceldate'
                },{
                    header: Ext.app.Localize.get('Local date'),
                    dataIndex: 'localdate'
                },{
                    header: Ext.app.Localize.get('Manager'),
                    dataIndex: 'managername'
                },{
                    header: Ext.app.Localize.get('Comment'),
                    dataIndex: 'comment',
                    id: 'comment'
                },
                Remove
            ]
        }),
        bbar: [{
            xtype: 'displayfield',
            value: Ext.app.Localize.get('Canceled payment'),
            hideLabel: true,
            style: 'padding:3px;border:1px solid gray;',
            ctCls: 'x-type-payment-canceled'
        }, {
            xtype: 'displayfield',
            value: Ext.app.Localize.get('Corrected'),
            hideLabel: true,
            style: 'padding:3px;border:1px solid gray;',
            ctCls: 'x-type-payment-edited'
        }]
    });


    Edit.on('action', function(g, r, i) {
        insUpdSales({Store: DocStore, editSales: r});
    });
    
    History.on('action', function(grid, record, rowIndex) {
    	var data = record.data ? record.data : {};
    	var store = grid.getStore();
    	data.agrmnum = Ext.getCmp('_userAgreementsList').getSelectionModel().getSelected().get('agrmnum');
	    showSalesHistory(data);
    });
    
    Remove.on('action', function(g, r, i) {
        /**
         * Если строка помечена как аннулированная, то return
         */
        if (r.data.canceldate) return;
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Deleting document'),
            msg: Ext.app.Localize.get('Are you sure want to delete document?'),
            width:400,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                Ext.Ajax.request({
                    url: 'config.php',
                    method: 'POST',
                    params: {
                        devision: 121,
                        async_call: 1,
                        delSaleDocument: r.data.saleid
                    },
                    scope: {
                        load: Ext.Msg.wait(Ext.app.Localize.get('Please wait') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
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
                                Ext.getCmp('_UsersDocs').store.removeAll();
                                Ext.getCmp('_UsersDocs').store.load();
                                g.getStore().reload();
                                Ext.Msg.alert(Ext.app.Localize.get('Info'), Ext.app.Localize.get("Document was successfully deleted!"));
                            }else{
                                Ext.Msg.alert(Ext.app.Localize.get('Error'), data.error);
                            }
                        }
                      return false;
                    }
                });
            }
        });
    });

	
	function showSalesHistory ( data ) {	
		
		var showData = new Ext.grid.RowButton({
			header: '&nbsp;',
			qtip: Ext.app.Localize.get('Show Document Details'),
			iconCls: 'ext-text',
			dataIndex: 'recordid',
			width: 22
		});
		showData.on('action', function(grid, rec, ind) {
			var panel = grid.findParentByType('window');
			panel.get('detailsgrid').getStore().setBaseParam('detailed', ind).reload();
			panel.getLayout().setActiveItem(1);
		});
		
		new Ext.Window({
				modal: true,
				width: 850,
				title: Ext.app.Localize.get('Agreement') +': ' + data.agrmnum + ' / ' + Ext.app.Localize.get('DocReceipt') + ': ' + data.receipt,
				layout: 'card',
				activeItem: 0,
				height: 350,
				items: [{
					xtype: 'grid',
					loadMask: true,
					plugins: [showData],
					columns: [showData,
						{
							header: Ext.app.Localize.get('Period'),
							dataIndex: 'perioddate'
						},{
							header: Ext.app.Localize.get('Docdate'),
							dataIndex: 'saledate'
						},{
							header: Ext.app.Localize.get('Local date'),
							dataIndex: 'localdate'
						},{
							header: Ext.app.Localize.get('Amountcur'),
							dataIndex: 'amountcur'
						},{
							header: Ext.app.Localize.get('Amount of Tax'),
							dataIndex: 'amountcurvat'
						},{
							header: Ext.app.Localize.get('Manager'),
							dataIndex: 'nameperson'
						},{
							header: Ext.app.Localize.get('Comment'),
							dataIndex: 'comment',
							id: 'comment'
						}
					],
				store: {
					xtype: 'jsonstore',
					root: 'results',
					autoLoad: true,
					fields: [{ name: 'saleid', type: 'int' },
						{ name: 'agrmid', type: 'int' },
						{ name: 'ownerid', type: 'int' },
						{ name: 'amountcurid', type: 'int' },
						{ name: 'currsymb', type: 'string' },
						{ name: 'currnum', type: 'string' },
						{ name: 'amountcur', type: 'float' },
						{ name: 'revisions', type: 'int' },
						{ name: 'amountcurvat', type: 'string' },
						{ name: 'amount', type: 'string' },
						{ name: 'amountvat', type: 'string' },
						{ name: 'receiptseq', type: 'int' },
						{ name: 'receipt', type: 'string' },
						{ name: 'saledate', type: 'string' },
						{ name: 'localdate', type: 'string' },
						{ name: 'canceldate', type: 'string' },
						{ name: 'paydate', type: 'string' },
						{ name: 'perioddate', type: 'string' },
						{ name: 'bdate', type: 'string' },
						{ name: 'edate', type: 'string' },
						{ name: 'comment', type: 'string' },
						{ name: 'modperson', type: 'int' },
						{ name: 'nameperson', type: 'string' }
					],
					baseParams: {
						async_call: 1,
						devision: 121,
						getSalesHistory: 1,
						id: data.saleid
					}
				}	
			}, {
				xtype: 'grid',
				itemId: 'detailsgrid',
				loadMask: true,	
				tbar: [{
                    text: Ext.app.Localize.get('Go back to list'),
                    iconCls: 'ext-history2',
                    handler: function(Btn){
						var panel = Btn.findParentByType('window');
						panel.getLayout().setActiveItem(0);
                    }
                }],		
				columns: [{
					header: Ext.app.Localize.get('Service ID'),
						dataIndex: 'recordid',
						width: 65
					},{
						header: Ext.app.Localize.get('Service code'),
						dataIndex: 'gaap'
					},{
						header: Ext.app.Localize.get('Type of service'),
						dataIndex: 'name',
						id: 'name'
					},{
						header: Ext.app.Localize.get('Unit of m.'),
						dataIndex: 'unit',
						width: 57
					},{
						header: Ext.app.Localize.get('VAT rate'),
						dataIndex: 'vat',
						width: 85
					},{
						header: Ext.app.Localize.get('Count.'),
						dataIndex: 'count',
						width: 55
					},{
						header: Ext.app.Localize.get('Cost'),
						dataIndex: 'pricecur',
						width: 75
					},{ 
						header: Ext.app.Localize.get('Amount in the account currency'),
						dataIndex: 'amountcur', 
						width: 95 
					},{
						header: Ext.app.Localize.get('Amount of Tax'),
						dataIndex: 'amountcurvat',
						width: 95
					}
				],
				store: {
					xtype: 'jsonstore',
					method: 'POST',
					root: 'results',
					autoLoad: false,
					fields: ['recordid', 'gaap', 'codeokei', 'name', 'unit', 'unitmult', 'modperson',  'vat', 'count', 'pricecur', 'amountcur', 'amountcurvat', 'price', 'amount', 'amountvat'], 
					baseParams: {
						async_call: 1,
						devision: 121,
						getSalesHistory: 1,
						id: data.saleid
					}
				}	
			}]
		}).show();
	}

    new Ext.Panel({
        renderTo: 'ADPanel',
        height: 744,
        width: 960,
        plain:true,
        layout: 'border',
        defaults: {
            collapsible: false,
            split: true
        },
        items:[
            {
                hideBorders: true,
                region:'center',
                layout:'fit',
                frame:true,
                border:false,
                items:[
                    UsersGrid
                ]
            },
            {
                region:'south',
                layout:'fit',
                frame:true,
                border:false,
                split:true,
                items:[
                    UsersDocs
                ],
                height: 350,
                minSize: 250,
                maxSize: 450,
                margins: '0 0 0 0',
                cmargins: '0 0 0 0'
            }
        ]
    });



function insUpdSales(Object)
{
    isInsert = (typeof Object.editSales == 'undefined') ? true : false;
    Object.editSales = Object.editSales || {
        data: {
            saleid: 0
        }
    };
    var Store = Object['Store'];
    readOnly = (Object.editSales.data.canceldate || Store.reader.jsonData.genorderpermissions == 0) ? true : false;

    if (!Ext.isEmpty(Ext.getCmp('winInsUpdSales'))) { return; }
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
                    Ext.Msg.alert('Error!', obj.error);
                };
            }
        });
    }

    var salesStore = new Ext.data.Store({
        id: 'salesList',
        name: 'salesList',
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST', timeout: 380000 }),
        reader: new Ext.data.JsonReader({ root: 'results' /*,totalProperty: 'total', idProperty: 'saleid'*/ },
            [
                { name: 'recordid', type: 'int' },
                { name: 'gaap', type: 'string' },
                { name: 'codeokei', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'unit', type: 'string' },
                { name: 'unitmult', type: 'string' },
                { name: 'modperson', type: 'string' },
                { name: 'vat', type: 'string' },
                { name: 'count', type: 'string' },
                { name: 'pricecur', type: 'string' },
                { name: 'amountcur', type: 'string' },
                { name: 'amountcurvat', type: 'string' },
                { name: 'price', type: 'string' },
                { name: 'amount', type: 'string' },
                { name: 'amountvat', type: 'string' },
				{ name: 'saledate', type: 'string' }
            ]
        ),
        listeners: {
            /**
             * Пересчет значений при изменении некоторых параметров
             */
            update: function(store, record, action){
                if(action == Ext.data.Record.EDIT) {
                    record.set('amountcur', record.get('pricecur') * record.get('count'));
                    record.set('amountcurvat', record.get('amountcur') / (1 + 100/record.get('vat')));
                }
            }
        },
        autoLoad: true,
        baseParams:{ async_call: 1, devision: 121, getdocs: 1, saleDetail: Object.editSales.data.saleid }
    });

    var Remove = new Ext.grid.RowButton({
        header: '&nbsp;',
        qtip: function(record,x,c){
            if (readOnly){
                return '';
            } else {
                return Ext.app.Localize.get('Remove');
            }
        },
        iconCls: function(record,x,c){
            if (readOnly){
                return 'gridBtnEmpty';
            } else {
                return 'ext-drop';
            }
        },
        dataIndex: 'recordid',
        width: 22
    });
    Remove.on('action', function(g, r, i) {
        if (readOnly) return;
        Ext.MessageBox.show({
            title: Ext.app.Localize.get('Deleting a record'),
            msg: Ext.app.Localize.get('Are you sure want to delete document?'),
            width:400,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: false,
            fn: function( btn ){
                if (btn == 'cancel') return;
                g.getStore().remove(r);
            }
        });
    });

    var formPanel = new Ext.form.FormPanel({
        xtype: 'form',
        labelWidth: 110,
        bodyStyle:'padding:5px',
        border:false,
        frame: true,
        buttonAlign: 'center',
        url: 'config.php',
        items: [
            { xtype: 'hidden', name: 'async_call',  value: 1 },
            { xtype: 'hidden', name: 'devision',    value: 121 },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('Docdate'),
                disabled: true,
                value: Object.editSales.data.saledate,
                anchor:'100%'
            },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('Period'),
                disabled: true,
                value: Object.editSales.data.perioddate,
                anchor:'100%'
            },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('Amountcur'),
                disabled: true,
                value: Object.editSales.data.amountcur,
                anchor:'100%'
            },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('Amount of Tax'),
                disabled: true,
                value: Object.editSales.data.amountcurvat,
                anchor:'100%'
            },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('DocReceipt'),
                disabled: true,
                value: Object.editSales.data.receipt,
                anchor:'100%'
            },
            {
                xtype:'textfield',
                fieldLabel: Ext.app.Localize.get('Comment'),
                itemId: 'comment',
                disabled: false,
                value: Object.editSales.data.comment,
                anchor:'100%'
            },
            {
                xtype: 'editorgrid',
                gaapWindowIsOpened: false,
                id: '_salesList',
                name: '_salesList',
                anchor:'100% -160',
                enableHdMenu: false,
                disableSelection: true,
                loadMask: true,
                border: true,
                autoExpandColumn: 'name',
                clicksToEdit: 1,
                view: new Ext.grid.GridView({
                    forceFit:false,
                    enableRowBody:true,
                    enableNoGroups: true,
                    deferEmptyText: false,
                    autoScroll : true,
                    emptyText:Ext.app.Localize.get('No documents') 
                }),
                store: salesStore,
                tbar: [{
                    text: Ext.app.Localize.get('Add'),
                    disabled: (readOnly) ? true : false,
                    formBind: true,
                    iconCls: 'ext-add',
                    handler: function(){
                        salesStore.insert(0, new salesStore.recordType({
                            recordid: 0,
                            gaap: 0,
                            codeokei: 0,
                            name: '',
                            unit: '',
                            unitmult: '',
                            modperson: 0,
                            vat: 18,
                            count: 1,
                            pricecur: 0,
                            amountcur: 0,
                            amountcurvat: 0,
                            price: 0,
                            amount: 0,
                            amountvat: 0
                        }));
                    }
                }],
                listeners: {
                    'show' : function() {
                        this.loadMask = new Ext.LoadMask(this.body, { msg:'Loading. Please wait...' });
                    },
                    'cellclick' : function(grid, rowIndex, cellIndex, e){
                        /**
                         * Режим просмотра
                         */
                        if (readOnly) return false;
                        var store = grid.getStore().getAt(rowIndex);
                        var columnName = grid.getColumnModel().getDataIndex(cellIndex);
                        /**
                         * Вызывыаем форму выбора услуги при клике на ячейку GAAP
                         */
                        if (columnName == 'gaap' && !Ext.getCmp('_salesList').gaapWindowIsOpened){
                        	Ext.getCmp('_salesList').gaapWindowIsOpened = true;
                            saleDictionaryWin({
                                sm: true,
                                hideToolbar: true,
                                callbackok: function(grid) {
                                    var sm = grid.getSelectionModel().getSelected();
                                    recordid = sm.get('recordid'); // код услуги
                                    gaap = sm.get('gaap');
                                    name = sm.get('name');
                                    unit = sm.get('unit');
                                    try {
                                        this.store.set('gaap',gaap);
                                        this.store.set('recordid',recordid);
                                        this.store.set('name',name);
                                        this.store.set('unit',unit);
                                    } catch(e) {
                                        return false;
                                    }
                                    return true;
                                }.createDelegate({store: store})
                            });
                            //var cellValue = store.get(columnName);
                        }
                    },
                    'beforeedit' : function (){
                        /**
                         * Режим просмотра. Запрещаем редактирование.
                         */
                        if (readOnly) return false;
                        return true;
                    }

                },
                cm: new Ext.grid.ColumnModel({
                    columns: [
                        {
                            header: Ext.app.Localize.get('Service ID'),
                            dataIndex: 'recordid',
                            width: 65
                        },
                        {
                            header: Ext.app.Localize.get('Service code'),
                            dataIndex: 'gaap'
                        },
                        {
                            header: Ext.app.Localize.get('Type of service'),
                            dataIndex: 'name',
                            id: 'name'
                        },
                        {
                            header: Ext.app.Localize.get('Unit of m.'),
                            dataIndex: 'unit',
                            width: 57
                        },
                        {
                            header: Ext.app.Localize.get('VAT rate'),
                            dataIndex: 'vat',
                            editable: (readOnly) ? true : false,
                            editor: new Ext.form.NumberField({
                                allowBlank: false,
                                allowNegative: false
                            }),
                            width: 85
                        },
                        {
                            header: Ext.app.Localize.get('Count.'),
                            dataIndex: 'count',
                            editor: new Ext.form.NumberField({
                                allowBlank: false,
                                allowNegative: false,
                                allowDecimals: true
                            }),
                            width: 55
                        }, {
                            header: Ext.app.Localize.get('Cost'),
                            dataIndex: 'pricecur',
                            editor: new Ext.form.NumberField({
                                allowBlank: false,
                                allowNegative: true
                            }),
                            width: 75
                        },
                        { header: Ext.app.Localize.get('Amount in the account currency'), dataIndex: 'amountcur', width: 95 },
                        {
                            header: Ext.app.Localize.get('Amount of Tax'),
                            dataIndex: 'amountcurvat',
                            renderer: function(value){
                                return value;
                            },
                            width: 95
                        },
                        Remove
                    ],
                    defaults: {
                        sortable: false,
                        menuDisabled: true
                    }
                }),
                plugins: [Remove]
            }
        ],
        buttons: [
            {
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                formBind: true,
                disabled: (readOnly) ? true : false,
                handler: function(Btn){
                    salesDocs = [];
                    salesDocs = Object.editSales.data;
                    salesDocs.SaleDetail = [];
                    Ext.getCmp('_salesList').getStore().each(function(rec){
                        this.SaleDetail.push(rec.data);
                    },salesDocs);
                    
                    var comment = Btn.findParentByType('form').getForm().findField('comment').getValue();
                    Object.editSales.data.comment = comment;
                    Ext.Ajax.request({
                        url: 'config.php',
                        method: 'POST',
                        params: {
                            devision: 121,
                            async_call: 1,
                            saleid: Object.editSales.data.saleid,
                            saveSalesDocs: Ext.util.JSON.encode(salesDocs)
                        },
                        scope: {
                            load: Ext.Msg.wait(Ext.app.Localize.get('Loading') + "...",Ext.app.Localize.get('Connecting'), { autoShow: true })
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
                                        salesStore.commitChanges();
                                        salesStore.reload();
                                        Store.reload();
                                    }
                                    catch(e) { Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get('Cannot update the data')); }
                                }else{
                                    Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(data.error));
                                }
                            }
                          return false;
                        }
                    });
                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Close'),
                handler: function(){
                    Ext.getCmp('winInsUpdSales').close();
                }
            }
        ]
    });
    
    // create and show window
    var win = new Ext.Window({
        id: 'winInsUpdSales',
        width:960,
        height:550,
        minWidth:500,
        minHeight:450,
        //modal: true,
        plain:true,
        title: Ext.app.Localize.get('Document of charges'),
        layout:'fit',
        border:false,
        closable:false,
        items:formPanel,
        listeners: {
            'beforeclose' : function (window)
            {
                /**
                 * Проверка наличия не сохраненных данных перед закрытием окна
                 */
                var changedRecords = salesStore.getModifiedRecords();
                if (changedRecords.length > 0) {
                    Ext.Msg.confirm(Ext.app.Localize.get('Saving changes'), Ext.app.Localize.get('Changes are not saved, continue?'), function(answer){
                        if(answer == 'yes'){
                            window.hide(null); // null to "unset" animation target
                            window.destroy();
                            return true;
                        }
                        return false; // always stop default close if dirty
                    });
                    return false; // always stop default close if dirty
                } else {
                    window.hide(null); // null to "unset" animation target
                    window.destroy();
                    return true;
                }
            }
        }
    });
    win.show();
}


/**
 * Форма справочника услуг
 *
 */
function saleDictionary(idField,linkField,form)
{
    saleDictionaryWin({
        sm: true,
        hideToolbar: true,
        callbackok: function(grid) {
            var sm = grid.getSelectionModel().getSelected();
            recordid = sm.get('recordid');
            gaap = sm.get('gaap');
            name = sm.get('name');
            try {
                document.getElementById(idField).value = recordid;
                document.getElementById(linkField).innerHTML = gaap + ': ' + name;
            } catch(e) {
                return false;
            }
        }.createDelegate(Ext.get(form))
    });
} // end getParentVgroup()



function saleDictionaryWin(A) {

    PPAGELIMIT = 100;

    if (Ext.isEmpty(A)) {
        A = {
            sm: true,
            callbackok: false,
            callbackcl: false
        }
    }
    try {
        if (Ext.isEmpty(Localize)) {
            Localize = {}
        }
    } catch (e) {
        Localize = {}
    }
    Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
        initComponent: function() {
            Ext.app.SearchField.superclass.initComponent.call(this);
            this.on('specialkey', function(f, e) {
                if (e.getKey() == e.ENTER) {
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
        onTrigger1Click: function() {
            if (this.hasSearch) {
                this.el.dom.value = '';
                var o = {
                    start: 0,
                    limit: 100
                };
                this.store.baseParams = this.store.baseParams || {};
                this.store.baseParams[this.paramName] = '';
                this.store.reload({
                    params: o
                });
                this.triggers[0].hide();
                this.hasSearch = false;
            }
        },
        onTrigger2Click: function() {
            var v = this.getRawValue();
            if (v.length < 1) {
                this.onTrigger1Click();
                return;
            };
            var o = {
                start: 0,
                limit: 100
            };
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = v;
            this.store.reload({
                params: o
            });
            this.hasSearch = true;
            this.triggers[0].show();
        }
    });
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
        reader: new Ext.data.JsonReader(
            { root: 'results', totalProperty: 'total' },
            [
                { name: 'recordid',  type: 'int' },
                { name: 'gaap',      type: 'int' },
                { name: 'name',      type: 'string' },
                { name: 'unit',      type: 'string' },
                { name: 'unitmult',  type: 'int' },
                { name: 'modperson', type: 'int' }
            ]
        ),
        baseParams: {
            async_call: 1,
            devision: 4,
            getSaleDictionary: 1,
            start: 0,
            limit: PPAGELIMIT
        },
        sortInfo: {
            field: 'name',
            direction: "ASC"
        }
    });

    if (!Ext.isEmpty(A.filter)) {
        for (var i in A.filter) {
            if (typeof A.filter[i] != 'function') {
                store.baseParams[i] = A.filter[i];
            }
        }
    }

    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: Ext.isEmpty(A.sm) ? true : A.sm
    });
    var colModel = new Ext.grid.ColumnModel([
        sm, {
            header: Ext.app.Localize.get('Name'),
            dataIndex: 'name',
            id: 'name',
            sortable: true
        }, {
            header: Ext.app.Localize.get('Unit of m.'),
            dataIndex: 'unit',
            width: 80
        }, {
            header: Ext.app.Localize.get('Code'),
            dataIndex: 'gaap',
            sortable: true
        }
    ]);
    var Btn = new Array();
    if (!Ext.isEmpty(A.callbackok)) {
        Btn.push({
            xtype: 'button',
            text: Ext.app.Localize.get('Add'),
            handler: function(button) {
                var parent = button.findParentByType('window');
                if (typeof A.callbackok == 'function') {
                    A.callbackok(parent.findByType('grid')[0]);
                }
                parent.close();
            }
        })
    };
    Btn.push({
        xtype: 'button',
        text: Ext.app.Localize.get('Cancel'),
        handler: function(button) {
            var parent = button.findParentByType('window');
            if (typeof A.callbackcl == 'function') {
                A.callbackcl(parent.findByType('grid')[0]);
            };
            parent.close();
        }
    });

    var Win = new Ext.Window({
        title: Ext.app.Localize.get('List of services'),
        id: 'saleDictListWin',
        buttonAlign: 'center',
        width: 653,
        layout: 'fit',
        listeners: {
            close: function() {
                Ext.getCmp('_salesList').gaapWindowIsOpened = false;
            }
        },
        items: [{
            xtype: 'grid',
            width: 640,
            id: '_saleDictListWin',
            height: 350,
            store: store,
            cm: colModel,
            loadMask: true,
            autoExpandColumn: 'name',
            sm: sm,
            bbar: [
                new Ext.PagingToolbar({
                    pageSize: PPAGELIMIT,
                    store: store,
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
                                store.reload({ params: { limit: PPAGELIMIT } });
                            }
                        }
                    }
                    ]
                })
            ]
        }],
        buttons: Btn
    });
    Win.show();
    store.reload({
        params: {
            start: 0,
            limit: 100
        }
    });
} // end saleDictionary()

});

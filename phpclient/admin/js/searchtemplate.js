/**
 * Template search abstrack layout
 * This class contains engine to build condition using different properties
 *
 * Object:
 *     tplname: name of search template to read at start up
 *     onclose: run use function on closin window by pressing button
 *     onsearch: function to call on pressed searh button
 *     onsave: function to call on pressed save button
 *     onSaveClose: boolean, to destroy window object on success save action (default false)
 *     rules:  property - table and field value like sql path "my_table.my_field"
 *         condition - method to select value for the field
 *         date - if need
 *         value - value to select
 *         logic - logic to concat rules
 *
 * Call: new SearchTemplate,show( Object )
 * Returns: Object that will be passed to callback function
 *     tplname: search template name
 *     data: array of record.data from storage
 *     getHtmlItems: function to convert data to form hidden elements, need post variable name
 *
 * Repository information:
 * $Date: 2009-12-21 09:24:11 $
 * $Revision: 1.1.2.19 $
 *
 * @todo: Too many data load connections. Autoload data for editor combos by request.
 * @todo: Add load mask for first run
 */

var SearchTemplate = new Object();

// Render Ext window object with fields form
SearchTemplate.show = function(A) {
    if(!Ext.isEmpty(Ext.getCmp('SearchTpl'))){ return }
    Ext.QuickTips.init();

    var config, store, properties, conditions, logic, editors, window, grid;

    this.init(A);
    this.render();
};

SearchTemplate.show.prototype = {
    init: function(config) {
        this.config = config || {};

        if(!this.config.onsearch || typeof this.config.onsearch != 'function') {
            this.config.onsearch = function(A){ };
        };

        if(!this.config.onsave || typeof this.config.onsave != 'function') {
            this.config.onsave = function(A){ };
        };

        if(!this.config.onclose || typeof this.config.onclose != 'function') {
            this.config.onclose = function(A){ };
        };

        this.config.rules = this.config.rules || null;
        if(!Ext.isEmpty(this.config.rules) && !Ext.isArray(this.config.rules)) {
            this.config.rules = [this.config.rules];
        }

        if(Ext.isEmpty(this.config.tplname) || this.config.tplname.length == 0) {
            this.config.autoLoad = false;
            this.config.tplname = this.config.tplname || Ext.app.Localize.get('Search template');
        }
        else {
            this.config.autoLoad = true;
        }

        this.config.onSaveClose = this.config.onSaveClose || false;

        // Attention! Don't use autoload = true!
        // This store loads below in onload method!
        this.store = new Ext.data.JsonStore({
            root: 'results',
            fields: [
                { name: 'tplname', type: 'string', defaultValue: this.config.tplname },
                { name: 'property', type: 'string' },
                { name: 'condition', type: 'string' },
                { name: 'value', type: 'string' },
                { name: 'logic', type: 'string' }
            ],
            baseParams: { async_call: 1, devision: 42, getsearchtpl: this.config.tplname }
        });

        this.properties = new Ext.form.ComboBox({
            displayField: 'descr',
            valueField: 'property',
            mode: 'local',
            triggerAction: 'all',
            editable: true,
            typeAhead: true,
            store: new Ext.data.ArrayStore({
                idIndex: 0,
                fields: [
                    {name: 'property', type: 'string'},
                    {name: 'descr',type: 'string'},
                    {name: 'editorobject',type: 'string', defaultValue: 'defaultObj'}
                ],
                data: [
                    ['accounts.type', Ext.app.Localize.get('User type'), 'utypes'],
                    ['accounts.name', Ext.app.Localize.get('User name'), 'defaultObj'],
                    ['accounts.login', Ext.app.Localize.get('User login'), 'defaultObj'],
                    ['accounts.email', 'Email', 'defaultObj'],
                    ['agreements.balance', Ext.app.Localize.get('Balance'), 'defaultObj'],
                    ['agreements.number', Ext.app.Localize.get('Agreement'), 'defaultObj'],
                    ['agreements.code', Ext.app.Localize.get('Paycode'), 'defaultObj'],
                    ['agreements.credit', Ext.app.Localize.get('Credit'), 'defaultObj'],
                    ['agreements.balance_status', Ext.app.Localize.get('Deptor'), 'deptors'],
                    ['accounts_addr.address', Ext.app.Localize.get('Address'), 'defaultObj'],
                    ['vgroups.login', Ext.app.Localize.get('Account login'), 'defaultObj'],
                    ['vgroups.id', Ext.app.Localize.get('Module'), 'mlist'],
                    ['vgroups.blocked', Ext.app.Localize.get('Blocking'), 'blklist'],
                    ['vgroups.current_shape', Ext.app.Localize.get('Current shape'), 'defaultObj'],
                    ['vgroups.tar_id', Ext.app.Localize.get('Tarif'), 'tarlist'],
                    ['vgroups.archive', Ext.app.Localize.get('Deleted accounts'), 'archived'],
                    ['staff.segment', 'IP ' + Ext.app.Localize.get('Address'), 'defaultObj'],
                    ['mac_staff.mac', 'MAC ' + Ext.app.Localize.get('Address'), 'defaultObj'],
                    ['currency.id', Ext.app.Localize.get('Currency'), 'curlist'],

                    ['agreements.oper_id', Ext.app.Localize.get('Operator'), 'operlist'],
                    ['agreements_groups.agrm_group_id', Ext.app.Localize.get('Agreements groups'), 'groupAgrmList']
                ]
            })
        });

        var addonFields = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'results'
            }, [
                { name: 'property', type: 'string' },
                { name: 'descr', type: 'string' }
            ]),
            baseParams: { async_call: 1, devision: 42, getaddonfields: 1 },
            listeners: {
                load: {
                    fn: function(s){
                        s.each(function(r){
                            this.add(r);
                        }, this);
                    },
                    scope: this.properties.store
                }
            }
        });

        addonFields.load();

        this.conditions = new Ext.form.ComboBox({
            displayField: 'descr',
            valueField: 'condition',
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            store: new Ext.data.ArrayStore({
                idIndex: 0,
                fields: [{
                    name: 'condition',
                    type: 'string'
                }, {
                    name: 'descr',
                    type: 'string'
                }],
                data: [[
                    '=',
                    Ext.app.Localize.get('equal')
                ], [
                    '!=',
                    Ext.app.Localize.get('not') + ' ' + Ext.app.Localize.get('equal')
                ], [
                    '>',
                    Ext.app.Localize.get('more than')
                ], [
                    '<',
                    Ext.app.Localize.get('less than')
                ], [
                    '>=',
                    Ext.app.Localize.get('equal') + ', ' + Ext.app.Localize.get('more than')
                ], [
                    '<=',
                    Ext.app.Localize.get('equal') + ', ' + Ext.app.Localize.get('less than')
                ], [
                    'REGEXP',
                    Ext.app.Localize.get('contains')
                ]]
            })
        });

        this.logic = new Ext.form.ComboBox({
            displayField: 'descr',
            valueField: 'logic',
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            store: new Ext.data.ArrayStore({
                idIndex: 0,
                fields: [{
                    name: 'logic',
                    type: 'string'
                }, {
                    name: 'descr',
                    type: 'string'
                }],
                data: [[
                    'and',
                    Ext.app.Localize.get('AND')
                ], [
                    'or',
                    Ext.app.Localize.get('OR')
                ]]
            })
        });

        this.editors = {
            blklist: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                minListWidth: 170,
                store: new Ext.data.ArrayStore({
                    fields: [{ name: 'id', type: 'int' }, { name: 'descr', type: 'string' }],
                    data: [
                        [ 0, Ext.app.Localize.get('Active') ], //#
                        [ 1, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by balance') ],
                        [ 2, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by client') ],
                        [ 3, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by manager') ],
                        [ 5, Ext.app.Localize.get('Blocked') + ' ' + Ext.app.Localize.get('by traffic') ],
                        [ 10, Ext.app.Localize.get('Turned off') ]
                    ]
                })
            }),

            archived: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.ArrayStore({
                    fields: [{ name: 'id', type: 'int' }, { name: 'descr', type: 'string' }],
                    data: [
                        [ 0, Ext.app.Localize.get('No') ],
                        [ 1, Ext.app.Localize.get('Yes') ]
                    ]
                })
            }),

            curlist: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'name',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.JsonStore({
                    root: 'results',
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'name', type: 'string' }
                    ],
                    baseParams: { async_call: 1, devision: 14, getcurrency: 0 }
                })
            }),

            mlist: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                resizable: true,
                store: new Ext.data.JsonStore({
                    root: 'results',
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'descr', type: 'string' }
                    ],
                    baseParams: { async_call: 1, devision: 1, getmodules: 1 }
                })
            }),

            operlist: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.JsonStore({
                    root: 'results',
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'descr', type: 'string' }
                    ],
                    baseParams: { async_call: 1, devision: 22, getoperlist: 1 }
                })
            }),
            
            groupAgrmList: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'name',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.JsonStore({
                    root: 'results',
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'name', type: 'string' }
                    ],
                    baseParams: { async_call: 1, devision: 28, getagrmgroups: 1 }
                })
            }),
            
            tarlist: new Ext.form.ComboBox({
                xtype: 'combo',
                id: '_tarList',
                displayField: 'name',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                forceSelection:true,
                resizable:true,
                minListWidth: 430,
                typeAhead: true,
                lazyRender: true,
                listClass: 'x-combo-list-small',

                store: new Ext.data.JsonStore({
                    root: 'results',
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'name', type: 'string' }
                    ],
                    baseParams: { async_call: 1, devision: 4, getsimpletarifs: -1 }
                })
            }),

            utypes: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.ArrayStore({
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'descr', type: 'string' }
                    ],
                    data: [
                        [ 1, Ext.app.Localize.get('Legal person') ],
                        [ 2, Ext.app.Localize.get('Physical person') ]
                    ]
                })
            }),

            deptors: new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'descr',
                valueField: 'id',
                mode: 'local',
                triggerAction: 'all',
                editable: false,
                store: new Ext.data.ArrayStore({
                    fields: [
                        { name: 'id', type: 'int' },
                        { name: 'descr', type: 'string' }
                    ],
                    data: [
                        [ 1, Ext.app.Localize.get('No') ],
                        [ 2, Ext.app.Localize.get('Disconnection') ],
                        [ 3, Ext.app.Localize.get('Termination')]
                    ]
                })
            }),
            defaultObj: new Ext.form.TextField({ }),
            parent: this,
            loadStates: [],
            init: function(){
                for(var i in this) {
                    if(i == 'parent' || Ext.isArray(this[i]) || !Ext.isObject(this[i])) {
                        continue;
                    }
                    if(this[i].xtype == 'combo') {
                        this.loadStates[i] = false;
                        if(this[i].store.reader.arrayData) {
                            this.loadStates[i] = true;
                        }
                        else {
                            this[i].store.on('load', function(s,r,i){
                                this.obj.onload(this.map);
                            }, { obj: this, el: this[i], map: i });
                            this[i].store.load();
                        }
                    }
                    this[i].named = i;
                }
            },

            getOrigin: function(A){
                if(!this[A]) {
                    return this.defaultObj;
                }
                else {
                    return this[A];
                }
            },

            get: function(A){
                var o, n;
                o = this.getOrigin(A);
                n = o.cloneConfig();
                n.named = o.named;
                return n;
            },

            onload: function(a){
                if(typeof (this.loadStates[a]) != 'undefined') {
                    this.loadStates[a] = true;
                }
                for(var i in this.loadStates) {
                    if(this.loadStates[i] == false) {
						this.parent.grid.body.unmask();
                        return;
                    }
                }

                /**
                 * Прогрузка параметров.
                 */
                if(!Ext.isEmpty(this.parent.config.rules)) {
                    Ext.each(this.parent.config.rules, function(item, i){
                        this.add(new this.recordType(item));
                    }, this.parent.store);
                }
                else {
                    if(this.parent.config.autoLoad) {
                        this.parent.store.load();
                    }
                }
                //  Здесь хранилища загрузились. Отключаем затенение при прогрузке параметров
                this.parent.grid.body.unmask();
            }
        }
        this.editors.init();
    },

    prepare: function(B){
        var o = { tplname: B.ownerCt.ownerCt.parent.config.tplname, data: [],
            getHtmlItems: function(n){
                var n = n || 'searchtpl';
                var o = { html: [], hiddenName: n };
                Ext.each(this.data, function(item, key){
                    for(var i in item) {
                        this.html.push({ xtype: 'hidden', id: this.hiddenName + '[' + key + '][' + i + ']', value: item[i] })
                    }
                }, o);

                return o.html;
            }
        };

        B.ownerCt.ownerCt.parent.grid.store.each(function(item, s, iter){
            item.data.tplname = B.ownerCt.ownerCt.parent.config.tplname;
            this.data.push(item.data);
        }, o);

        return o;
    },

    render: function(){
        var rm = new Ext.grid.RowButton({ header: '&nbsp;', qtip: 'Remove condition', dataIndex: 'property', width: 22, iconCls: 'ext-drop' });
        rm.on('action', function(g, r){
            g.store.remove(r);
        });

        this.grid = new Ext.grid.EditorGridPanel({
            xtype: 'editorgrid',
            parent: this,
            height: 350,
            tbar:[
                Ext.app.Localize.get('Name') + ':&nbsp;',
                {
                    xtype: 'textfield',
                    id: 'tplname',
                    width: 250,
                    parent: this,
                    value: this.config.tplname,
                    listeners: {
                        change: function(F, V) {
                            F.parent.config.tplname = V;
                        }
                    }
                },
                '&nbsp;',
                '-',
                '&nbsp;',
                {
                    xtype: 'button',
                    iconCls: 'ext-add',
                    text: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('new condition'),
                    handler: function() {
                        this.ownerCt.ownerCt.store.add(new this.ownerCt.ownerCt.store.recordType());
                    }
                }
            ],
            clicksToEdit: 1,
            loadMask: true,
            autoExpandColumn: '_value',
            cm: new Ext.grid.ColumnModel([
                {
                    header: Ext.app.Localize.get('Property'),
                    dataIndex: 'property',
                    width: 200,
                    renderer: function(v) {
                        try {
                            return this.editor.store.getAt(this.editor.store.find('property', v)).data.descr;
                        } catch (e) {
                            return v;
                        }
                    },
                    editor: this.properties
                }, {
                    header: Ext.app.Localize.get('Condition'),
                    dataIndex: 'condition',
                    width: 145,
                    renderer: function(v) {
                        try {
                            return this.editor.store.getAt(this.editor.store.find('condition', v)).data.descr;
                        } catch (e) {
                            return v;
                        }
                    },
                    editor: this.conditions
                }, {
                    header: Ext.app.Localize.get('Value'),
                    dataIndex: 'value',
                    id: '_value',
                    width: 150,
                    parent: this,
                    grid: null,
                    renderer: function(v, c, d, r) {
                        //var v = v || '';
                    	var v =  (v === undefined) ? '' : v;
                        try {
                            if (Ext.isEmpty(this.grid)) {
                                this.grid = this.parent.grid;
                            }
                            var i = this.parent.properties.store.find('property', this.grid.store.getAt(r).data.property);
                            if (i > -1) {
                                var o = this.parent.editors.getOrigin(this.parent.properties.store.getAt(i).data.editorobject);
                                if (o.xtype == 'combo') {
                                    var i = o.store.find('id', new RegExp('^' + v + '$'));
                                    if (i > -1) {
                                        return o.store.getAt(i).get(o.store.getAt(i).fields.keys[1]);
                                    }
                                    return '';
                                }
                            }
                        } catch (e) {
                            return v;
                        }

                        return v;
                    },
                    editor: this.editors.get()
                },
                {
                    header: Ext.app.Localize.get('Logic'),
                    dataIndex: 'logic',
                    width: 70,
                    renderer: function(v) {
                        try {
                            return this.editor.store.getAt(this.editor.store.find('logic', v)).data.descr;
                        } catch (e) {
                            return v;
                        }
                    },
                    editor: this.logic
                },
                rm // delete button
            ]),
            store: this.store,
            plugins: rm,
            listeners: {
                afterrender : function(grid){
                    grid.body.mask(Ext.app.Localize.get('Wait for complete') + "...");
                },
                beforeedit: function(e) {
                    if (e.column != 2) {
                        return true;
                    }
                    var i = e.grid.parent.properties.store.find('property', e.record.data.property);
                    if (i > -1) {
                        var o = e.grid.parent.editors.get(e.grid.parent.properties.store.getAt(i).data.editorobject);
                        if (o.named != e.grid.getColumnModel().getCellEditor(2, e.row).field.named) {
                            e.grid.getColumnModel().setEditor(2, o);
                        }
                    }
                    return true;
                }
            }
        });

        this.window = new Ext.Window({
            title: Ext.app.Localize.get('Search template'),
            width: 624,
            layout: 'fit',
            parent: this,
            items: [this.grid],
            buttonAlign: 'center',
            modal: true,
            constrain: true,
            checkValues: function (B) {
            	var o = this.parent.prepare(B).getHtmlItems();
           
            	var conditional_count	=	0;
            	var values_count		=	0;
            	var property_count		=	0;
            	var total_count		=	0;
            	var error_str = '';
            	
            	Ext.each(o, function(item){
            		if(item.id.indexOf('[value]') + 1 && item.value!=='')
            			values_count++;
            		
            		if(item.id.indexOf('[property]') + 1 && item.value!=='' )
            			property_count++;
            		
            		if(item.id.indexOf('[condition]') + 1 && item.value!=='' )
            			conditional_count++;
            		
            		if(item.id.indexOf('[tplname]') + 1)
            			total_count++;
            	});
            	
            	if(values_count < conditional_count || values_count < property_count)
            		error_str = 'Value';
            	
            	if(conditional_count < values_count || conditional_count < property_count)
            		error_str = 'Condition';
            	
            	if(property_count < values_count || property_count < conditional_count)
            		error_str = 'Property';
               
            	if(total_count!=conditional_count && total_count!=values_count && total_count!=property_count)
            		error_str = 'Property';
            	
                if(error_str!='') {
                	Ext.Msg.error(Ext.app.Localize.get('Empty field') + ': "' + Ext.app.Localize.get(error_str) + '"');
                	return false;
                }
                return true;
            },
            buttons: [{
                xtype: 'button',
                text: Ext.app.Localize.get('Apply'),
                handler: function(B){
                	
                	if(!B.ownerCt.ownerCt.checkValues(B))
                		return;
                	
                	var o = B.ownerCt.ownerCt.parent.prepare(B).getHtmlItems();
                    B.ownerCt.ownerCt.parent.config.onsearch(B.ownerCt.ownerCt.parent.prepare(B));
                    B.ownerCt.ownerCt.close();
                }
            }, {
                xtype: 'button',
                text: Ext.app.Localize.get('Save'),
                handler: function(B){
                	
                	if(!B.ownerCt.ownerCt.checkValues(B))
                		return;
                	
                    var o = B.ownerCt.ownerCt.parent.prepare(B);
                    var h = o.getHtmlItems();
                    h.push({ xtype: 'hidden', name: 'async_call', value: 1 });
                    h.push({ xtype: 'hidden', name: 'devision', value: 42 });
                    h.push({ xtype: 'hidden', name: 'savesearchtpl', value: B.ownerCt.ownerCt.parent.config.tplname });

                    var f = new Ext.form.FormPanel({
                        frame: false,
                        url: 'config.php',
                        items: h,
                        parent: B.ownerCt.ownerCt.parent,
                        tpldata: o,
                        renderTo: Ext.getBody()
                    });
                   
                    f.getForm().submit({
                        method:'POST',
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action) {
                            form.parent.config.onsave(form.tpldata);
                            form.destroy();
                            if(form.parent.config.onSaveClose) {
                                form.parent.window.close();
                            }
                        },
                        failure: function(form, action){
                            form.parent.config.onsave(false);
                            form.destroy();
                        }
                    });
                }
            }]
        });

        this.window.on('close', this.config.onclose, this);
        this.window.show();
    }
}

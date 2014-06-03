Ext.onReady(function(){
    showSBSSTicketsGrid('ticketsGridWrappeer');
});

function showSBSSTicketsGrid(renderTo) {
    var PAGELIMIT = 100,
        store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'results',
                totalProperty: 'total'
            }, [{
                name: 'id',
                type: 'int'
            }, {
                name: 'status',
                type: 'string'
            }, {
                name: 'title',
                type: 'string'
            }, {
                name: 'author',
                type: 'string'
            }, {
                name: 'answers',
                type: 'int'
            }, {
                name: 'last',
                type: 'string'
            }, {
                name: 'responsible',
                type: 'string'
            }, {
                name: 'authortime',
                type: 'string'
            }, {
                name: 'answertime',
                type: 'string'
            }, {
                name: 'uid',
                type: 'int'
            }, {
                name: 'manview',
                type: 'string'
            }, {
                name: 'authormail',
                type: 'string'
            }, {
                name: 'files',
                type: 'int'
            }, {
                name: 'statuscolor',
                type: 'string'
            }, {
                name: 'trcolor',
                type: 'string'
            }]),
            autoLoad: true,
            baseParams: {
                async_call: 1,
                devision: 1001,
                getticketslistdata: 0,
                start: 0,
                limit: PAGELIMIT
            }
        }),
        mailto = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: function(record) {
                if (record.get('authormail')) {
                    return Ext.app.Localize.get('Send mail to author');
                } else {
                    return Ext.app.Localize.get('No allowed');
                }
            },
            width: 22,
            iconCls: 'ext-mailto'
        }),
        group = new Ext.grid.RowButton({
            header: '&nbsp;',
            qtip: Ext.app.Localize.get('Group by author'),
            width: 22,
            iconCls: 'ext-ugroup'
        }),
        search = new Ext.form.TextField({
            name: 'search'
        }),
        doSearch = function() {
            store.baseParams.search = search.getValue();
            store.load();
        };
    search.on('specialkey', function(f, e){
        if (e.getKey() == e.ENTER) {
            doSearch();
        }
    });
    group.on('action', function() {
        var record = arguments[1];
        console.log('GROUP', record);
    });
    mailto.on('action', function() {
        var record = arguments[1];
        if (record.get('authormail')) {
            document.location.href='mailto:'+record.get('authormail');
        }
    });
    if(!Ext.get(renderTo)) {
        return false;
    }
    Ext.grid.LinkColumn = function(config){
        Ext.apply(this, config);
        Ext.grid.LinkColumn.superclass.constructor.call(this);
    };
    Ext.grid.LinkColumn.clickHandler = {
        init: function(grid) {
            grid.on('cellclick', function() {
                var record = grid.store.getAt(arguments[1]),
                    target = arguments[3].getTarget(),
                    column = grid.getColumnModel().columns[arguments[2]],
                    handler = column.handler || function() {};
                if (target.className == 'lb-column-link') {
                    handler(record);
                }
            });
        }
    };
    Ext.extend(Ext.grid.LinkColumn, Ext.grid.Column, {
        valueRenderer: function(value) {
            return '<a class="lb-column-link" href="#">'+value+'</a>';
        },
        renderer: function(value) {
            return this.valueRenderer(value);
        }
    });
    new Ext.grid.GridPanel({
        autoHeight: true,
        width: '100%',
        title: Ext.app.Localize.get('Requests'),
        loadMask: true,
        renderTo: renderTo,
        tbar: [search, {
            xtype: 'button',
            itemId: 'searchBtn',
            text: Ext.app.Localize.get('Search'),
            iconCls: 'ext-search',
            handler: doSearch
        }],
        plugins: [
            Ext.grid.LinkColumn.clickHandler,
            mailto,
            group
        ],
        viewConfig: {
            getRowClass: function() {
                var rowParams = arguments[2],
                    record = arguments[0];
                if (record.get('trcolor')) {
                    rowParams.tstyle = rowParams.tstyle+' background-color: #'+record.get('trcolor')+';';
                }
            }
        },
        cm: new Ext.grid.ColumnModel({
            columns: [{
                header: '#',
                width: 50,
                dataIndex: 'id'
            }, {
                header: Ext.app.Localize.get('Status'),
                dataIndex: 'status',
                renderer: function(value, meta, record) {
                    if (record.get('statuscolor')) {
                        meta.style = meta.style + ' color: #'+record.get('statuscolor');
                    }
                    return value;
                }
            }, new Ext.grid.LinkColumn({
                header: Ext.app.Localize.get('Title of ticket'),
                id: 'SBSSTicketTitle',
                dataIndex: 'title',
                handler: function(record) {
                    sbssSubmitFor('_sbssForm', 'ticketId', record.get('id'));
                }
            }), new Ext.grid.LinkColumn({
                header: Ext.app.Localize.get('Author'),
                dataIndex: 'author',
                renderer: function(value) {
                    var record = arguments[2],
                        meta = arguments[1];
                    meta.css = 'normal-wrap-cell';
                    return (record.get('uid') ? this.valueRenderer(value) : value) + '<br/>' + record.get('authortime');
                },
                handler: function(record) {
                    getUserInfo(record.get('uid'), record.get('author'));
                }
            }), {
                header: '&nbsp;',
                width: 22,
                dataIndex: 'manview',
                renderer: function(value, cell) {
                    cell.css += (cell.css ? ' ' : '') + 'ext-grid3-row-action-cell';
                    if (value) {
                        return '<div style="height: 16px; width: 16px;" class="ext-blocked" ext:qtip="'+Ext.app.Localize.get('Locked by manager')+': '+value+'"></div>';
                    } else {
                        return '';
                    }
                }
            }, mailto, /*group, */{
                header: Ext.app.Localize.get('Answers'),
                width: 55,
                dataIndex: 'answers',
                renderer: function(value) {
                    var record = arguments[2],
                        files = '';
                    if (record.get('files')) {
                        files = ' ('+record.get('files')+')';
                    }
                    return files+value;
                }
            }, {
                header: Ext.app.Localize.get('Last'),
                dataIndex: 'last',
                renderer: function(value) {
                    var record = arguments[2],
                        meta = arguments[1];
                    meta.css = 'normal-wrap-cell';
                    return value + '<br/>' + record.get('answertime');
                }
            }, {
                header: Ext.app.Localize.get('Responsible'),
                dataIndex: 'responsible',
                renderer: function(value) {
                    var meta = arguments[1];
                    meta.css = 'normal-wrap-cell';
                    return value;
                }
            }],
            defaults: {
                sortable: true,
                menuDisabled: false
            }
        }),
        autoExpandColumn: 'SBSSTicketTitle',
        store: store,
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
                        PAGELIMIT = this.getValue() * 1;
                        this.ownerCt.pageSize = PAGELIMIT;
                        store.reload({ params: { limit: PAGELIMIT } });
                    }
                }
            }]
        })
    });
}

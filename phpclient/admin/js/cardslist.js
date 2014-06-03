/**
 * Show cards list table on ready page
 *
 */

Ext.onReady(function() {
	showCardsLIst('cardsList');
});

function showCardsLIst( renderTo )
{
	Ext.QuickTips.init();
	
	var filled = false;
    formatDate = function(value){
        try {
            return value.format('Y-m-d H:i')
        } 
        catch (e) {
            return value
        }
    }
	
    var convertExpiredSeconds = function(value){
        if (value == 0) {
            return Localize.Unlimited
        };
        if (value < 60) {
            return value + ' (' + Localize.Seconds + ')'
        }
        var iter = 0;
        while (value > 60 && iter < 3) {
            value = value / ((iter < 2) ? 60 : 24);
            iter++;
        }
        return value + ' (' + ((iter == 1) ? Localize.Minutes : ((iter == 2) ? Localize.Hours : Localize.Days)) + ')';
    }
	
    var modifyColModel = function(combo){
        if (combo.getValue() == 0) {
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_acttilCol'), false);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_activatedCol'), true);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_modePersonCol'), false);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_userNameCol'), true);
        }
        else {
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_acttilCol'), true);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_activatedCol'), false);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_modePersonCol'), true);
            Ext.getCmp('_cardsGrid').colModel.setHidden(Ext.getCmp('_cardsGrid').colModel.getIndexById('_userNameCol'), false);
        }
    }
	
	var DownloadList = function(A){
		var A = A || false;
		var B = Store.lastOptions.params;
		B.download = 0;
		
		// if A = true then load all pages
		if(A){
			B.download = 1;
		}
		
		Download(B)
	}
	
    compileParams = function(){
        Store.baseParams.cardslist = Ext.getCmp('_listCombo').getValue();
        if (Ext.getCmp('_cardFilter').getValue() > 0) {
            Store.baseParams.setid = Ext.getCmp('_cardFilter').getValue()
        }
        else {
            Store.baseParams.setid
        };
        if (Ext.getCmp('_cardFilter').getValue() == -1) {
            Store.baseParams.cardkey = Ext.getCmp('_cardProp').getValue()
        }
        else {
            Store.baseParams.cardkey = ''
        };
        if (Ext.getCmp('_cardFilter').getValue() == -2) {
            Store.baseParams.serno = Ext.getCmp('_cardProp').getValue()
        }
        else {
            Store.baseParams.serno = ''
        };
        try {
            Store.baseParams.dtcreated = Ext.getCmp('_cardCreated').getValue().format('Y-m-d');
        } 
        catch (e) {
            Store.baseParams.dtcreated = ''
        }
        try {
            Store.baseParams.dtactivated = Ext.getCmp('_Activated').getValue().format('Y-m-d');
        } 
        catch (e) {
            Store.baseParams.dtactivated = ''
        }
        Store.reload({
            params: {
                start: 0,
                limit: 50
            }
        });
    }
	
	var Rows = Ext.data.Record.create([{ name: 'serno', type: 'int' }, { name: 'used', type: 'int' }, { name: 'agrmid', type: 'int' }, { name: 'modpers', type: 'int' }, { name: 'cardset', type: 'int' }, { name: 'sum', type: 'float' }, { name: 'modpersdescr', type: 'string' }, { name: 'cardkey', type: 'string' }, { name: 'datecreate', type: 'date', dateFormat: 'Y-m-d H:i:s' }, { name: 'acttil', type: 'date', dateFormat: 'Y-m-d H:i:s' }, { name: 'activated', type: 'date', dateFormat: 'Y-m-d H:i:s' }, { name: 'symbol', type: 'string' }, { name: 'expired', type: 'int' }, { name: 'modpersdescr', type: 'string' }, { name: 'username', type: 'string' } ]);
	
	var Store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
		reader: new Ext.data.JsonReader({ root: 'results', totalProperty: 'total', id: 'cardsList' }, Rows), baseParams:{ async_call: 1, devision: 103, cardslist: 0, setid: 0, cardkey: '', serno: '', dtcreated: '' }, sortInfo:{ field: 'serno', direction: "DESC" }
	});
	
	Store.reload({params: { start: 0, limit: 50 }});
	
	var cardSets = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({ url: 'config.php', method: 'POST' }),
		reader: new Ext.data.JsonReader({ root: 'results', id: 'cardsetsList' }, 
		[{ name: 'setid', type: 'int' }, { name: 'createdby', type: 'int' }, { name: 'curid', type: 'int' }, { name: 'acctpl', type: 'int' }, { name: 'expireperiod', type: 'int' }, { name: 'cardscnt', type: 'int' }, { name: 'setdescr', type: 'string' }, { name: 'createdbyname', type: 'string' }, { name: 'currname', type: 'string' }, { name: 'accname', type: 'string' }]), 
		baseParams:{ async_call: 1, devision: 545, getcardsets: 1 }, autoLoad: true
	});
	
	var colModel = new Ext.grid.ColumnModel([{ header: Localize.Serial, dataIndex: 'serno', width: 80, editor: new Ext.form.TextField({ allowBlank: false }) }, { header: Localize.Set, dataIndex: 'cardset', width: 50 }, { header: Localize.Key, dataIndex: 'cardkey', width: 155, sortable: false, editor: new Ext.form.TextField({ allowBlank: false }) }, { header: Localize.Sum, dataIndex: 'sum', width: 80 }, { header: Localize.Currency, dataIndex: 'symbol', width: 55, sortable: false }, { header: Localize.Created, dataIndex: 'datecreate', width: 105, sortable: false, renderer: formatDate }, { header: Localize.ActTill, id: '_acttilCol', dataIndex: 'acttil', width: 115, sortable: false, renderer: formatDate }, { header: Localize.Activated, id: '_activatedCol', dataIndex: 'activated', width: 105, sortable: false, hidden: true, renderer: formatDate }, { header: Localize.Validity, tooltip: Localize.Validity, dataIndex: 'expired', width: 108, sortable: false, renderer: convertExpiredSeconds }, { header: Localize.Author, id: '_modePersonCol', dataIndex: 'modpersdescr', width: 120 }, { header: Localize.ActivBy, id: '_userNameCol', dataIndex: 'username', width: 120, hidden: true }]);
    var grid = new Ext.grid.EditorGridPanel({
        title: Localize.PCards,
        id: '_cardsGrid',
        height: 600,
        width: 897,
        renderTo: renderTo,
        enableHdMenu: false,
        store: Store,
        cm: colModel,
        loadMask: true,
        clicksToEdit: 1,
        tbar: [{
            xtype: 'combo',
            id: '_listCombo',
            width: 124,
            displayField: 'name',
            valueField: 'id',
            store: new Ext.data.SimpleStore({
                data: [['0', Localize.Free], ['1', Localize.Used]],
                fields: ['id', 'name']
            }),
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            value: 0,
            editable: false,
            listeners: {
                select: function(){
                    if (this.getValue() == 0) {
                        Ext.getCmp('_Activated').disable()
                    }
                    else {
                        Ext.getCmp('_Activated').enable()
                    };
                    modifyColModel(this);
                    compileParams();
                }
            }
        }, '-', Localize.Created + ': ', {
            xtype: 'datefield',
            id: '_cardCreated',
            width: 95,
            format: 'Y-m-d',
            style: 'margin-left: 5px'
        }, '-', Localize.Activated + ': ', {
            xtype: 'datefield',
            id: '_Activated',
            width: 95,
            format: 'Y-m-d',
            style: 'margin-left: 5px',
            disabled: true
        }, '-', {
            xtype: 'combo',
            id: '_cardFilter',
            width: 154,
            listWidth: 180,
            displayField: 'name',
            valueField: 'id',
            store: new Ext.data.SimpleStore({
                data: [['-1', Localize.Key], ['-2', Localize.Serial]],
                fields: ['id', 'name']
            }),
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            tpl: '<tpl for="."><tpl if="id &gt; 0"><div class="x-combo-list-item" style="color: green">{id}. {[Ext.util.Format.ellipsis(values.name, 25)]}</div></tpl><tpl if="id &lt; 0"><div class="x-combo-list-item" style="color: red">{name}</div></tpl></tpl>',
            listeners: {
                focus: function(){
                    if (filled) {
                        return
                    };
                    cardSets.each(function(record){
                        this.store.add(new Ext.data.Record({
                            id: record.data.setid,
                            name: record.data.setdescr
                        }))
                    }, this);
                    filled = true;
                },
                select: function(){
                    if (this.getValue() < 0) {
                        Ext.getCmp('_cardProp').enable()
                    }
                    else {
                        Ext.getCmp('_cardProp').disable()
                    };
                                }
            }
        }, {
            xtype: 'field',
            id: '_cardProp',
            width: 150,
            style: 'margin-left: 5px',
            disabled: true
        }, {
            xtype: 'button',			
			width: 20,
			text: Ext.isIE8 ? ('<img align=middle src=./images/search.gif>') : '',
			iconCls: !Ext.isIE8 ? 'ext-search' : '',
			style: 'margin-left: 4px',
            tooltip: Localize.Reload,           
            handler: compileParams
        }, {
			xtype: 'button',
			width: 20,			
			tooltip: 'download',
			text:Ext.isIE8 ? ('<img align=middle src=./images/csvdown.gif>') : '',			
			iconCls:!Ext.isIE8 ? 'ext-downcsv' : '',
			menu: [{
				text: Localize.CurrentPage,
				handler: function(){
					DownloadList(false)
				}
			}, {
				text: Ext.app.Localize.get('All'),
				handler: function(){
					DownloadList(true)
				}
			}]
		}],
        bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: Store,
            displayInfo: true
        }),
        listeners: {
            afteredit: function(A){
                A.grid.store.rejectChanges()
            }
        }
    });
	
	Ext.getCmp('_cardProp').on('specialkey', function(f, e) { if(e.getKey() == e.ENTER){ this.compileParams() } }, this);
} // end showCardsLIst()

/**
 * Payments history view with page scrolling
 * @param	integer, agreement ID
 * @param	integer, user ID
 */

function showPayHistory( agrmId, userId )
{
	function formatDate(value){
		return value ? value.dateFormat('Y-m-d') : '';
	};
	
	if(Ext.getCmp('_showPayHistory_')) return;
	
	if(Ext.isEmpty(agrmId)) agrmId = 0;
	if(Ext.isEmpty(userId)) userId = 0;
	
	var rows = Ext.data.Record.create([
		{ name: 'paydate', type: 'string' },
		{ name: 'status', type: 'int' },
		{ name: 'agreement', type: 'string' },
		{ name: 'user', type: 'string' },
		{ name: 'symbol', type: 'string' },
		{ name: 'manager', type: 'string' },
		{ name: 'amount', type: 'string' }
	]);
	
	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'}),
		reader: new Ext.data.JsonReader({
			root: 'results',
			id: 'paymentsHistory'
		}, rows),
		baseParams:{ async_call: 9, agrmid: agrmId, userid: userId }
	});
	
	var colModel = new Ext.grid.ColumnModel([
		{ header: Localize.Date, dataIndex: 'paydate' },
		{ header: Localize.User, dataIndex: 'user', readOnly: true, menuDisabled: true },
		{ header: Localize.Agreement, dataIndex: 'agreement', readOnly: true, menuDisabled: true },
		{ header: Localize.Sum, dataIndex: 'amount', readOnly: true },
		{ header: Localize.Symbol, dataIndex: 'symbol', readOnly: true, menuDisabled: true, width: 55 },
		{ header: Localize.Manager, dataIndex: 'manager', readOnly: true, menuDisabled: true }
	]);
	
	var grid = new Ext.grid.EditorGridPanel({
		store: store,
		cm: colModel,
		selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
		enableColLock: false,
		height: 300,
		bbar: new Ext.PagingToolbar({
			pageSize: 50,
			store: store,
			displayInfo: true
		})
	});
	
	var Win = new Ext.Window({
		id: '_showPayHistory_',
		shadow: false,
		title: Localize.Payments,
		width: 650,
		defaults: { labelWidth: 100 },
		items: grid
	});
	
	Win.show();
	store.reload({params: {start: 0, limit: 50}});
} // end showPayHistory()
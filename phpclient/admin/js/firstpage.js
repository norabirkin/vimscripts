/**
 * This view created to fill the first page after manager was granted
 *
 * Repository information:
 * @date		$Date: 2012-03-16 11:05:51 +0400 (Пт., 16 марта 2012) $
 * @revision	$Revision: 20825 $
 */


Ext.onReady(function() {
	// Load Quick tips class to parse extra tags
	Ext.QuickTips.init();

	// Manager's sessions panel
	if (Ext.get('logged_in_list')) {
		new Ext.Panel({
			layout: 'fit',
			title: Ext.app.Localize.get('Current sessions'),
			renderTo: 'logged_in_list',
			frame: true,
			bodyStyle: 'background-color:white;',
			items: new Ext.list.ListView({
				height: 327,
				autoScroll: true,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results'
					}, [{
						name: 'name',
						type: 'string'
					}, {
						name: 'online',
						type: 'int'
					}]),
					baseParams: {
						async_call: 1,
						devision: 0,
						getsessions: 1
					},
					sortInfo: {
						field: 'name',
						direction: "ASC"
					},
					autoLoad: true
				}),
				multiSelect: true,
				emptyText: 'No images to display',
				reserveScrollOffset: true,
				columns: [{
					header: Ext.app.Localize.get('Manager'),
					width: .7,
					dataIndex: 'name'
				}, {
					header: Ext.app.Localize.get('Duration'),
					dataIndex: 'online',
					tpl: '{[Duration(values.online)]}',
					align: 'right'
				}]
			})
		});
	}

	// Total system information
	if (Ext.get('system_totals')) {
		new Ext.Panel({
			layout: 'fit',
			title: Ext.app.Localize.get('General information about the system'),
			renderTo: 'system_totals',
			frame: true,
			bodyStyle: 'background-color:white;',
			tbar: [{
				xtype: 'button',
				text: '&nbsp;&nbsp;' + Ext.app.Localize.get('Billing system server log data'),
				iconCls: 'ext-table',
				disabled: Ext.get('_allowlog_') ? false : true,
				handler: showLogFile
			}],
			items: new Ext.list.ListView({
				height: 300,
				autoScroll: true,
				columnSort: false,
				store: new Ext.data.Store({
					proxy: new Ext.data.HttpProxy({
						url: 'config.php',
						method: 'POST'
					}),
					reader: new Ext.data.JsonReader({
						root: 'results'
					}, [{
						name: 'name',
						type: 'string'
					}, {
						name: 'descr',
						type: 'string'
					}, {
						name: 'value',
						type: 'string'
					}]),
					baseParams: {
						async_call: 1,
						devision: 0,
						getgeneralinfo: 1
					},
					autoLoad: true
				}),
				multiSelect: true,
				emptyText: 'No images to display',
				reserveScrollOffset: true,
				columns: [{
					header: Ext.app.Localize.get('Parameter'),
					width: .7,
					dataIndex: 'descr',
					tpl: '{[(values.name == "buildname" || values.name == "builddate") ? "<span style=\'color:red\'>" + values.descr + "</span>" : values.descr]}'
				}, {
					header: Ext.app.Localize.get('Value'),
					dataIndex: 'value',
					align: 'right'
				}]
			})
		});
	}
});


/**
 * This function creates widget with loaded log file data from server response
 * @param	object, object which calles this function
 */
function showLogFile( caller )
{
	new Ext.Window({
		title: Ext.app.Localize.get('Billing system server log data'),
		width: 800,
		height: 600,
		bodyStyle: 'background-color:white;',
		autoScroll: true,
		autoLoad: {
			url: 'config.php',
			method: 'POST',
			params: {
				async_call: 1,
				devision: 0,
				getlogfile: 1
			}
		},
		tbar: [{
			xtype: 'button',
			text: Ext.app.Localize.get('Reload data'),
			handler: function() {
				this.ownerCt.ownerCt.load(this.ownerCt.ownerCt.autoLoad);
			}
		}],
		html: ''
	}).show()
}

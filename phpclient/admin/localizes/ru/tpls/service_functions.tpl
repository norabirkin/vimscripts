
<script language="javascript">
Ext.onReady(function(){
  		Ext.QuickTips.init();
		servicesFunctions();
});


function servicesFunctions(){
var Localize = {
		Title: '<%@ Service functions %>', ServiceName: '<%@ Service name %>',ClientInterface: '<%@ Client interface %>',
		NameOfFile: '<%@ Name of file %>',AssociativeFileName: '<%@ Name of associative file %>',NumberByOrder:'<%@ Number by order%>',
		Add: '<%@ Add %>', Save: '<%@ Save %>', Remove: '<%@ Remove %>'
	};
var store;		
var grid;
var insupd_arr=new Array();
var service_name_edit =new Ext.form.TextField();
var original_file_edit =new Ext.form.TextField();
var saved_file_edit =new Ext.form.TextField();
var flag_edit =new Ext.form.TextField();
var uuid =new Ext.form.TextField();	
	
var servicesRows = Ext.data.Record.create([
		{name: 'id', type: 'int'},
			{name: 'flag', type: 'int'},
			{name:'descr', type:'string'},		
			{name: 'originalfile', type: 'string'},
			{name:'savedfile', type:'string'},
			{name:'uuid', type:'string'}
		]);
 var checkColumn = new Ext.grid.CheckColumn({
       		id:'flag',
			header: Localize.ClientInterface,
			width: 150, 
			sortable: true,  
			dataIndex: 'flag'/*,
			editor:flag_edit*/
    });
		


store = new Ext.data.Store({
		id: 'servicesDataStore',		
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POST'
		}),
		baseParams:{async_call: 1, devision: 339, getcontent: 1},		
		reader: new Ext.data.JsonReader({
		root: 'results'			
		},[ 
			{name: 'id', type: 'int'},
			{name: 'flag', type: 'int'},
			{name:'descr', type:'string'},		
			{name: 'originalfile', type: 'string'},
			{name:'savedfile', type:'string'},
			{name: 'descrfull', type: 'string'},
			{name:'link', type:'string'},
			{name:'uuid', type:'string'}
				
		]),
		autoLoad:true
	});
 
 
var BtnEdit = new Ext.grid.RowButton({
    header: '&nbsp;',
    tplModel: true,
    qtip: Ext.app.Localize.get('Edit'),
    width: 22,
    dataIndex: 'id',
    iconCls: 'ext-edit'
});

BtnEdit.on('action', function(grid, record, rowIndex) {
	editFunc({
            data: record.data,
            store: grid.getStore()
        });
});


function editFunc( data )
{
    var data = data || {};

    new Ext.Window({
        modal: true,
        width: 500,
        title: Ext.app.Localize.get('Service functions'),
        layout: 'fit',
        height: 260,
        items: [{
            xtype: 'form',
            monitorValid: true,
            frame: true,
            url: 'config.php',
            labelWidth: 120,
            defaults: {
                xtype: 'hidden',
                anchor: '100%'
            },
            items: [{
                name: 'devision',
                value: 339
            }, {
                name: 'async_call',
                value: 1
            }, {
                name: 'id',
                value: 0
            }, {
                name: 'insupd',
                value: 1
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Service name'),
                name: 'descr'
            }, {
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Name of associative file'),
                name: 'savedfile'
            }, {
                xtype: 'checkbox',
                fieldLabel: Ext.app.Localize.get('Client interface'),
                name: 'flag'
            },{
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('Description url'),
                name: 'link'
            },{
                xtype: 'textfield',
                fieldLabel: Ext.app.Localize.get('External service id'),
                name: 'uuid'
            },{
                xtype: 'textarea',
                fieldLabel: Ext.app.Localize.get('Description'),
                name: 'descrfull'
            }],
            buttonAlign: 'center',
            buttons: [{
                xtype: 'button',
                bindForm: true,
                text: Ext.app.Localize.get('Save'),
                handler: function(Btn) {
                    var form = Btn.findParentByType('form');

                    if(!form.getForm().isValid()) {
                        return;
                    }

                    form.getForm().submit({
                        url: 'config.php',
                        method: 'POST',
                        scope: {
                            win: form.ownerCt,
                            data: data
                        },
                        waitTitle: Ext.app.Localize.get('Connecting'),
                        waitMsg: Ext.app.Localize.get('Sending data') + '...',
                        success: function(form, action) {
                            this.win.close();
                            if(this.data.store) {
                                this.data.store.reload();
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.error(action.result.error);
                        }
                    });
                }
            }]
        }]
    }).show(null, function(win) {
        if(!this.data) {
            return;
        }

        if(this.data) {
            win.get(0).getForm().setValues(this.data);
        }
    }, data);
} // end editFunc()
 
// create the Grid 
grid = new Ext.grid.EditorGridPanel({
        store: store,
		//clicksToEdit: 1,
		frame:true,
		plugins: [BtnEdit], 
        columns: [
        BtnEdit,
            {id:'number_by_order',
			header:Localize.NumberByOrder, 
			width: 40, 
			sortable: true,
			hidden:true, 
			dataIndex: 'id'			
			},
            {id:'service_name',
			header: Localize.ServiceName, 
			width: 240, 
			sortable: true,
			dataIndex: 'descr',
			//editor: service_name_edit
			},
            {id:'original_file',
			header: Localize.NameOfFile, 
			width: 180, 
			sortable: true,
			hidden: true,
			dataIndex: 'originalfile',
			//editor: original_file_edit
			},
            {id:'saved_file',
			header: Localize.AssociativeFileName, 
			width: 180, 
			sortable: true,  
			dataIndex: 'savedfile',		
			//editor:saved_file_edit
			},
			 checkColumn
        ],
        stripeRows: true,
		sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
        autoExpandColumn: 'service_name',
        height:350,
        width:800,
		tbar: [{
			text: Localize.Save, iconCls: 'ext-save',
			handler: function() { 
			store.each(function(record, idx){
				if(record.dirty == true) {					
					id=record.data.id;
					flag=record.data.flag;
					if (flag) flag=1; else flag=0;
					descr=record.data.descr;
					originalfile=record.data.originalfile;
					savedfile=record.data.savedfile;
					var conn=new Ext.data.Connection();
					conn.request({
						url:'config.php',
						method: 'POST',
						params:{async_call: 1, devision: 339, insupd: 1, id:id, flag:flag, descr:descr, originalfile:originalfile, savedfile:savedfile}
					 });										
					}					
			      });				
				grid.destroy();
				servicesFunctions();				
			}
		},'-', {
			text: Localize.Add,
			iconCls: 'ext-add',
			handler: function() {
				var row = new servicesRows({
					id: 0,					
					flag: 0, 
					descr: Localize.Title,
					originalfile: '',
					savedfile: ''
				});
				editFunc({ 
		            data: {},
		            store: grid.getStore()
		        });
				/*grid.stopEditing();
				store.insert(0, row);
				grid.startEditing(0, 0);	*/			
			
			}
		}, '-', {
			xtype: 'button',
			text: Localize.Remove,
			iconCls: 'ext-remove',
			handler: function() {
				var sm=grid.getSelectionModel();
				var sel=sm.getSelected();				
				if (sm.hasSelection()){
					Ext.Msg.show({
						tiitle:' ',
						buttons:Ext.MessageBox.YESNO,
						msg: Localize.Remove+'"'+sel.data.descr+'" ?',
						fn: function(btn){
							if (btn=='yes'){
								var conn=new Ext.data.Connection();
								conn.request({
									url:'config.php',
									method: 'POST',
									params:{async_call: 1, devision: 339, delrow: 1, id:sel.data.id}						
							});
							grid.getStore().remove(sel);
							}
						}
					});
												
				}
			}
		}],
        title:Localize.Title
    });

    grid.render('_Services');
    grid.getSelectionModel().selectFirstRow();
}
</script>
<table align="center" width="900"><tr><td ><div id="_Services"></div></td></tr></table>

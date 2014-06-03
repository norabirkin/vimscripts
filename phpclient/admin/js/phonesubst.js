/**
 * Phone substitution form the telephony modules
 * 
 * Repository information:
 * $Date: 2009-06-25 07:52:01 $
 * $Revision: 1.1.2.8 $
 */

function substForm( recordId )
{
    Ext.QuickTips.init();
    try {
        var moduleId = document.getElementById('_module_').value;
        if (Ext.isEmpty(moduleId)) {
            return false
        }
    } 
    catch (e) {
        return false
    }
    if (Ext.getCmp('substPhoneNum')) {
        return
    }
    if (!Ext.isEmpty(recordId) && parseInt(recordId) > 0) {
        new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: 'config.php',
                method: 'POST'
            }),
            reader: new Ext.data.JsonReader({
                root: 'results'
            }, [{
                name: 'recordid',
                type: 'int'
            }, {
                name: 'oldnumber',
                type: 'string'
            }, {
                name: 'newnumber',
                type: 'string'
            }, {
                name: 'newprefix',
                type: 'string'
            }, {
                name: 'whatsubst',
                type: 'int'
            }, {
                name: 'length',
                type: 'int'
            }]),
            baseParams: {
                async_call: 1,
                devision: 68,
                module: moduleId,
                getsubst: recordId
            },
            autoLoad: true,
            listeners: {
                load: function(store){
                    Ext.getCmp('isrecordid').setValue(store.getAt(0).data.recordid);
                    Ext.getCmp('isoldnum').setValue(store.getAt(0).data.oldnumber);
                    Ext.getCmp('isclinum').setValue(store.getAt(0).data.newnumber);
                    Ext.getCmp('_listCombo').setValue(store.getAt(0).data.whatsubst);
                    if (store.getAt(0).data.length >= 0) {
                        Ext.getCmp('isprefix').getEl().up('.x-form-item').setDisplayed(true);
                        Ext.getCmp('isclinum').getEl().up('.x-form-item').setDisplayed(false);
                        Ext.getCmp('isprefix').setValue(Ext.getCmp('isclinum').getValue());
                        Ext.getCmp('islength').enable();
                        Ext.getCmp('isgrpsubst').setValue(true);
                        Ext.getCmp('islength').setValue(store.getAt(0).data.length);
                    }
                }
            }
        })
    }
    sendData = function(button){
        var form = button.findParentByType('form');
        form.getForm().submit({
            method: 'POST',
            waitTitle: Localize.Connecting,
            waitMsg: Localize.SendingData + '...',
            success: function(form, action){
                Win.close();
                submitForm('_PhSubst', 'devision', 68)
            },
            failure: function(form, action){
                if (action.failureType == 'server') {
                    obj = Ext.util.JSON.decode(action.response.responseText);
                    Ext.Msg.alert('Error!', obj.errors.reason);
                };
                Win.close();
            }
        });
    }
    var Win = new Ext.Window({
        shadow: false,
        title: ((!Ext.isEmpty(recordId) && parseInt(recordId) > 0) ? Localize.Change : Localize.Create),
        id: 'substPhoneNum',
        width: 430,
        items: [{
            xtype: 'form',
            url: 'config.php',
			buttonAlign: 'center',
            frame: true,
            labelWidth: 207,
            items: [{
                xtype: 'hidden',
                name: 'async_call',
                value: 1
            }, {
                xtype: 'hidden',
                name: 'devision',
                value: 68
            }, {
                xtype: 'hidden',
                name: 'savesubst',
                value: moduleId
            }, {
                xtype: 'hidden',
                id: 'isrecordid',
                name: 'recordid',
                value: 0
            }, {
                xtype: 'textfield',
                name: 'oldnumber',
                id: 'isoldnum',
                fieldLabel: Localize.IntAtsNum,
                width: 185
            }, {
                xtype: 'textfield',
                id: 'isclinum',
                name: 'newnumber',
                fieldLabel: Localize.CliNum,
                width: 185
            }, {
                xtype: 'textfield',
                id: 'isprefix',
                fieldLabel: Ext.app.Localize.get('Add') + ' ' + Ext.app.Localize.get('prefix'),
                name: 'newprefix',
                width: 185,
                listeners: {
                    render: function(){
                        Ext.getCmp('isprefix').getEl().up('.x-form-item').setDisplayed(false);
                    }
                }
            }, {
                xtype: 'combo',
                hiddenName: 'whatsubst',
                fieldLabel: Ext.app.Localize.get('Substitute'),
                id: '_listCombo',
                width: 185,
				listWidth: 185,
                displayField: 'name',
                valueField: 'id',
                typeAhead: true,
                mode: 'local',
                triggerAction: 'all',
                value: 0,
                editable: false,
                store: new Ext.data.SimpleStore({
                    data: [
						['0', Ext.app.Localize.get('Calling station number')], 
						['1', Ext.app.Localize.get('Dialed number')], 
						['2', Ext.app.Localize.get('Both numbers')]
					],
                    fields: ['id', 'name']
                })
            }, {
                xtype: 'checkbox',
                id: 'isgrpsubst',
                name: 'grpsubst',
                value: 1,
                fieldLabel: Localize.GrpSubst,
                listeners: {
                    check: function(box, checked){
                        var prefix = Ext.getCmp('isprefix');
                        var clinum = Ext.getCmp('isclinum');
                        var length = Ext.getCmp('islength');
                        if (checked == true) {
                            Ext.getCmp('isoldnum').setLabel(Localize.IntAtsNumTempl + ' (' + Localize.ExtraSymbols + ': *?): ');
                            length.enable();
                            clinum.getEl().up('.x-form-item').setDisplayed(false);
                            prefix.getEl().up('.x-form-item').setDisplayed(true);
                            prefix.setValue(clinum.getValue())
                        }
                        else {
                            Ext.getCmp('isoldnum').setLabel(Localize.IntAtsNum);
                            length.disable();
                            clinum.getEl().up('.x-form-item').setDisplayed(true);
                            prefix.getEl().up('.x-form-item').setDisplayed(false);
                            clinum.setValue(prefix.getValue());
                        };
                                        }
                }
            }, {
                xtype: 'textfield',
                id: 'islength',
				width: 80,
                name: 'lng',
                fieldLabel: Localize.PrefixLengthCut,
                disabled: true
            }],
            buttons: [{
                xtype: 'button',
                text: Localize.Save,
                handler: sendData
            }, {
                xtype: 'button',
                text: Localize.Cancel,
                handler: function(){
                    Win.close()
                }
            }]
        }]
    });
    Win.show();
} // end substForm()

Ext.namespace("Filter");
Filter.filterRuleGrid = Ext.extend(Ext.grid.EditorGridPanel, {
 	initComponent: function(){		
		var combo_renderer = function(combo){
    			return function(value, metaData, record, rowIndex, colIndex, store){				
        			if(value) {			
						var index = combo.getStore().find("param", value);			
            			return (index == -1) ? combo.emptyText : combo.getStore().getAt(index).get("descr");
        			}
        			else {
            			return combo.emptyText;
        			}
    			}
 		}
		var param_combo = new Ext.form.ComboBox({
			triggerAction: 'all',
			store: new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'param', type: 'string'}, {name: 'descr', type: 'string'}]),
									   data: [['direction', Localize.Direction], 
									   		  ['duration', Localize.Duration], 
											  ['numfrom', Localize.NumA], 
											  ['numto', Localize.NumB],
											  ['trunk_in', Localize.TrunkIn],
											  ['trunk_out', Localize.TrunkOut],
											  ['cause', Localize.Cause]]									
									}),
			valueField: 'param',
			displayField: 'descr',
			emptyText: Localize.Choose,
			mode: 'local',		
			editable: false,
			lazyRender: true,
			forceSelection: true			
		});
		var condition_combo = new Ext.form.ComboBox({
			triggerAction: 'all',
			store: new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'param', type: 'string'}, {name: 'descr', type: 'string'}]),
									   data: [['=', Localize.Equal], 
									   		  ['>', Localize.More], 
											  ['<', Localize.Less], 
											  ['!=', Localize.NotEqual],
											  ['~', Ext.app.Localize.get('match')],
											  ['!~', Ext.app.Localize.get('not match')]]
									}),
			valueField: 'param',
			displayField: 'descr',
			emptyText: Localize.Choose,
			mode: 'local',		
			editable: false,
			lazyRender: true,
			forceSelection: true			
		});
		var logic_combo = new Ext.form.ComboBox({
			triggerAction: 'all',
			store: new Ext.data.Store({reader: new Ext.data.ArrayReader({}, [{name: 'param', type: 'string'}, {name: 'descr', type: 'string'}]),
									   data: [['&&', Localize.And], 
									   		  ['||', Localize.Or]]									
									}),
			valueField: 'param',
			displayField: 'descr',
			emptyText: Localize.Choose,
			mode: 'local',		
			editable: false,
			lazyRender: true,
			forceSelection: true			
		});			
		this.record_id = 0;	
		var RemoveBtn = new Ext.grid.RowButton({
       			header: '&nbsp;',
        		qtip: Localize.Remove,
        		dataIndex: 'id',
        		width: 22,
        		iconCls: 'ext-drop'
    	});
		var remove_condition = function(grid, record, rowIndex, e) {
            //grid.stopEditing();
            grid.getStore().remove(record);			
            //grid.startEditing(0, 0);          
        }
		RemoveBtn.on('action', remove_condition);
		Ext.apply(this, {
			title: Localize.BillingMediation,						
		    clicksToEdit: 1,
			tbar: [{
		              text: Localize.Add,
		              iconCls: 'ext-add',
		              handler: this.addCondition.createDelegate(this)
		           }, {
		              text: Localize.Save,
		              iconCls: 'ext-save',
		              handler: this.saveFilter.createDelegate(this)
             }],
			store: new Ext.data.Store({
				reader: new Ext.data.ArrayReader({}, [{	name: 'parameter', type: 'string'}, {name: 'condition',	type: 'string'}, {name: 'value', type: 'string'}, {name: 'logic', type: 'string'}]),
				url: 'config.php',
				 autoLoad: true,
                 baseParams: {
                     devision: 68,
                     async_call: 1,
                     get_filter: 1,
					 module_id: document.getElementById('_module_').value
                 }					
			}),
			cm: new Ext.grid.ColumnModel([{
		            header: Localize.Parameter,
		            width: 200,
		            dataIndex: 'parameter',
		            menuDisabled: true,
		            editor: param_combo,
		            renderer: combo_renderer(param_combo) 
		        }, {
		            header: Localize.Condition,
		            width: 200,
		            dataIndex: 'condition',
		            menuDisabled: true,
		            editor: condition_combo,
		            renderer: combo_renderer(condition_combo) 
		        }, {
		            header: Localize.Value,
		            width: 200,
		            dataIndex: 'value',
		            menuDisabled: true,
		            editor: new Ext.form.TextField({
		                allowBlank: false
		            })		             
		        }, {
		            header: Localize.Logic,
		            width: 200,
		            dataIndex: 'logic',
		            menuDisabled: true,
		            editor: logic_combo,
		            renderer: combo_renderer(logic_combo) 
		        },
					RemoveBtn 
				]),
			plugins: [RemoveBtn],	
			width: 860,
		   	height: 280,	
		   	border: false				   
		});	
		Filter.filterRuleGrid.superclass.initComponent.apply(this, arguments);
	},
	addCondition: function() {
		this.stopEditing();
        	var r = new this.store.recordType({
            	       	parameter: '',
                    	condition: '',
                    	logic: ''                    	                    	
                	}, this.record_id++);					
			var index = (this.store.getCount()) ? this.store.getCount() : 0;		
        this.store.insert(index, r);
        this.startEditing(this.store.getCount() - 1, 0);
	},
	saveFilter: function() {
		var filter = "";
		for(var i = 0; i < this.store.getCount(); i++ ) {
			var r = this.store.getAt(i);			
			filter += "(" + r.get("parameter") + " " + r.get("condition") + " " + r.get("value") + ")";
			if (r.get("logic")) {
				if (i != (this.store.getCount() - 1)) {
					filter += " " + r.get("logic") + " ";
				}		 
			}
			else {
				break;
			}						
		}
		Ext.Ajax.request({
		        url: 'config.php',
		        method: "POST",
		        params: { devision: 68,
                          async_call: 1,
						  save_filter: 1,
						  filter: filter,
					 	  module_id: document.getElementById('_module_').value },
		        callback: function(options, success, resp){
					var result = Ext.util.JSON.decode(resp.responseText);
					if(!result.success && !Ext.isEmpty(result.errors)) {
						Ext.Msg.alert(Ext.app.Localize.get('Error'), Ext.app.Localize.get(result.errors.reason));
					}
					this.store.load()
				},
				scope: this
		});				
	}		
});
Filter.showFilterForm = function() {
	var filter = new Filter.filterRuleGrid();
	filter.render("_filter_");
}

Ext.ns('DocQueue');
DocQueue.PageLimit = 10;

Ext.onReady(function(){

	DocQueue.createButtonCol1();
	DocQueue.createButtonCol2();
	DocQueue.initStore();
	DocQueue.createToolbarButtons();
	DocQueue.createTemplatesRequest();
 	DocQueue.getTemplates();

});

DocQueue.Request = function() {
		
	this.baseParams = function() { return {
		async_call: 1,
       	devision: 43
	}},
		
	this.send = function() {
			
		Ext.Ajax.request({
        	url: 'config.php',
           	timeout: 380000,
            method: 'POST',
            params: this.params,
            scope: {request: this},
            callback: this.callback
       	});
		
	},
		
	this.callback = function( opt, success, res ) {
        	
    	try {
        	var data = Ext.decode(res.responseText);
            if(!data.success) {
            	throw(data.errors.reason);
            }
            this.request.onSuccess( data );
        }
        catch(e) {
        	Ext.Msg.error(e);
        }
        	
    }
	
};

DocQueue.createTemplatesRequest = function() {
	
	DocQueue.Templates = {};
	DocQueue.Templates.Request = function(config) {

		this.params = this.baseParams();
		this.params[ "getDocumentTemplateNames" ] = 1;
		this.onSuccess = function( data ) { 
			DocQueue.Templates.Data = data.results;
			DocQueue.createGrid();
		}
		
	};
	DocQueue.Templates.Request.prototype = new DocQueue.Request;
	
}

DocQueue.createToolbarButtons = function() {
	
	DocQueue.AutoReloadToggle = new Ext.Button({
	
		autoReloadInterval: null,
		realoadingStateParamName: 'autoreload',
		defaultState: 'on',
		start: function() {
			this.setButtonText();
			if (this.getState() == 'on') this.initAutoReloading();
		},
		setState: function(value) {
			Ext.state.Manager.set(this.realoadingStateParamName, value);
		},
		getState: function() {
			var state = Ext.state.Manager.get(this.realoadingStateParamName);
			if (state == undefined) {
				state = this.defaultState;
				this.setState(state);
			}
			return state;
		},
		getAutoReloadInterval: function() {
			return this.autoReloadInterval;
		},
		setAutoReloadInterval: function(interval) {
			this.autoReloadInterval = interval;
		},
		setButtonText: function() {
			switch (this.getState()) {
				case "on" : 
					this.setText(Ext.app.Localize.get('Turn off auto reloading'));
					break;
				case "off" : 
					this.setText(Ext.app.Localize.get('Turn on auto reloading'));
					break;
			}
		},
		turnOn: function() {
			this.setState('on');
			this.setButtonText();
			this.initAutoReloading();
		},
		turnOff: function() {
			this.setState('off');
			this.setButtonText();
			this.stopAutoReloading();
		},
		stopAutoReloading: function() {
			clearInterval(this.getAutoReloadInterval());
		},
		initAutoReloading: function() {
			this.setAutoReloadInterval(window.setInterval(function() {
         		DocQueue.Store.reload();
         	}, 10000));
		},
		handler: function() {
			if (this.getState() == 'on') this.turnOff();
			else if (this.getState() == 'off') this.turnOn();
		}
		
	});
	
	DocQueue.ReloadOnceButton = new Ext.Button({
		text: Ext.app.Localize.get('Reload data'),
		handler: function() {
			if (DocQueue.AutoReloadToggle.getState() == 'on') return;
			DocQueue.Store.reload();
		}
	});
	
}

DocQueue.initStore = function() {
	DocQueue.Store = new Ext.data.Store({
    	
		id: 'QueueGridStore',
		
		proxy: new Ext.data.HttpProxy({
			url: 'config.php',
			method: 'POSt'
		}),
				
		baseParams: {
			async_call: 1,
			devision: 43,
			start: 0,
			limit: DocQueue.PageLimit,
			OnFly: OnFly
		},
		
		reader: new Ext.data.JsonReader(
			{ 
				root: 'results',
				totalProperty: 'total'
			}, 
			[
				{ name: 'recordid', type: 'int' },
				{ name: 'createdate', type: 'string' },
				{ name: 'enddate', type: 'string' },
				{ name: 'percent', type: 'string' },
				{ name: 'buttontype', type: 'string' },
				{ name: 'buttonavailable', type: 'int' },
				{ name: 'error', type: 'int' },
				{ name: 'periodraw', type: 'string' },
				{ name: 'orderid', type: 'int' },
				{ name: 'canceled', type: 'int'},
				{ name: 'manager', type: 'string' },
				{ name: 'tplid', type: 'int' },
				{ name: 'period', type: 'string'},
				{ name: 'message', type: 'string'},
				{ name: 'done', type: 'int' }
			]
		),
			
		autoLoad: true
			
	});
}

DocQueue.Record = function( record ){
	
	this.record = record;
	this.getTypeOfDocument = function() {
		if (DocQueue.Templates.Data[this.record.get('tplid')] != undefined) return DocQueue.Templates.Data[this.record.get('tplid')].orderorreport;
		else return 'notfound';
	}
	
};

DocQueue.progressbar = {
	setValue: function(value) { this.value = value / 1000; },
    getHtmlCode: function() { return '<div class="progress-wrap" title="' + (this.value) + '%"><div class="progress-value" style="background-color: #9DC293; width: ' + (this.value) + '%;"></div></div>'; }
};

DocQueue.createButtonCol2 = function() {
	
	DocQueue.ButtonCol2 = new Ext.grid.RowButton({
		
		header: '&nbsp;',
        tplModel: true,
        width: 22,
        iconCls: function( record ) {
        	return DocQueue.ButtonCol2.getParams( record ).iconCls( record );
        },
        qtip: function(record) { 
        	return DocQueue.ButtonCol2.getParams( record ).qtip( record );
        },
        action: function(grid, record) {
        	if (record.get('done') && DocQueue.ButtonCol2.getParams( record ).action) DocQueue.ButtonCol2.getParams( record ).action(grid, record);
        },
        getParams: function( record ) {
        	if (record.get('error')) return DocQueue.ButtonCol2.Params.Error;
        	switch ( (new DocQueue.Record( record )).getTypeOfDocument() ) {
        		case 'order':
        			return DocQueue.ButtonCol2.Params.ListOfOrders;
        			break;
        		case 'report':
        			return DocQueue.ButtonCol2.Params.SaveReport;
        			break;
        		case 'notfound':
        			return DocQueue.ButtonCol2.Params.templateNotFound;
        			break;
        	}
        }
		
	});
	
	DocQueue.ButtonCol2.Params = {};
	
	DocQueue.ButtonCol2.Params.Error =  {
		
		iconCls: function(record) { return 'ext-doc-generation-error' },
    	qtip: function( record ) { return record.get('message') }
		
	};
	
	DocQueue.ButtonCol2.Params.templateNotFound = {
		
		iconCls: function(record) { return 'ext-doc-generation-error' },
		qtip: function( record ) { return "template " + record.get('tplid') + " was not found" }
		
	};
	
	DocQueue.ButtonCol2.Params.ListOfOrders = {
		
		iconCls: function(record) { return 'ext-table' + (record.get('done') ? '' : '-dis') },
    	qtip: function() { return Ext.app.Localize.get( 'List of documents' ) },
    	action: function(grid, record) {
    		createHidOrUpdate('DocsList', 'defaultview[getdocument]', record.get('tplid'));
       		createHidOrUpdate('DocsList', 'defaultview[period]', record.get('periodraw'));
        	submitForm('DocsList', 'devision', 105);
    	}
		
	};
	
	DocQueue.ButtonCol2.Params.SaveReport = {
		
		iconCls: function(record) { return 'ext-save' + (record.get('done') ? '' : '-dis') },
    	qtip: function() { return Ext.app.Localize.get( 'Download' ) },
    	action: function(grid, record) {
    		DocQueue.ButtonCol2.Params.SaveReport.getIframeThatWouldContainReport().src = './config.php?devision=105&async_call=1&getExt=1&download=1&getsingleord=' + record.get('orderid');
    	},
    	iframeThatWouldContainReport: null,
    	getIframeThatWouldContainReport: function() {
    		if (this.iframeThatWouldContainReport === null) {
    			this.iframeThatWouldContainReport = document.createElement("IFRAME");
				this.iframeThatWouldContainReport.id = 'DownloadReportFrame';
				this.iframeThatWouldContainReport.style.display = "none";
				document.body.appendChild(this.iframeThatWouldContainReport);
			}
			return this.iframeThatWouldContainReport;
    	}
		
	};
	
	DocQueue.ButtonCol2.on('action', DocQueue.ButtonCol2.action);
	
}

DocQueue.createButtonCol1 = function() {
	
	DocQueue.ButtonCol1 = new Ext.grid.RowButton({
	
    	header: '&nbsp;',
        tplModel: true,
        width: 22,
        action: function(grid, record) {
        	if ( record.get('buttonavailable') != 1 ) return;
        	record.set('buttonavailable', -1);
        	var act = function() { ( new DocQueue.ButtonCol1.Request({ grid: grid, record:record }) ).send(); }
        	if ( record.get('buttontype') == "delete" ) Ext.Msg.confirm(Ext.app.Localize.get('Info'), Ext.app.Localize.get('Do You really want to remove task?'), function(Btn){
				if (Btn != 'yes') { record.set('buttonavailable', 1); }
				else { act(); }
			});
        	else { act(); }
		},
        iconCls: function(record) {
			return DocQueue.ButtonCol1.getParams( record.get('buttontype') ).cssClass + ( ( record.get('buttonavailable') == 1 ) ? '' : '-dis');
        },
        qtip: function(record) {
        	if ( record.get('buttonavailable') == 0 ) var msg = " (" + Ext.app.Localize.get("Not enough rights") + ")";
        	else var msg = "";
			return Ext.app.Localize.get( DocQueue.ButtonCol1.getParams( record.get('buttontype') ).QTip ) + msg;
		},
		getParams: function( type ) {
			return DocQueue.ButtonCol1.Params[ type.charAt(0).toUpperCase() + type.substr(1) ];
		}

	});
	
	DocQueue.ButtonCol1.Params = {
		
		Cancel: {
    		actionFn: 'cancelGenerationTask',
    		cssClass: 'ext-cancel',
    		QTip: 'Cancel'
   		},
   		Delete: {
   			actionFn: 'deleteGenerationTask',
    		cssClass: 'ext-drop',
    		QTip: 'Remove'
   		}
			
	};
	
	DocQueue.ButtonCol1.Request = function(config) {

		this.grid = config.grid;
		this.record = config.record;
		this.params = this.baseParams();
		this.params[ DocQueue.ButtonCol1.getParams( this.record.get('buttontype') ).actionFn ] = this.record.get('recordid');
		this.onSuccess = function() { DocQueue.Store.reload(); }
		
	};
	DocQueue.ButtonCol1.Request.prototype = new DocQueue.Request;
	
	DocQueue.ButtonCol1.on('action', DocQueue.ButtonCol1.action);
	
}

DocQueue.getTemplates = function() {
	(new DocQueue.Templates.Request).send();
}

DocQueue.createGrid = function() {
	
	var statusCol = {
		
		header: Ext.app.Localize.get('Status'), 
		dataIndex: 'percent', 
		width:132, 
		renderer: function(value, meta, record) {
			if ( record.get('canceled') ) {
				return Ext.app.Localize.get('Canceled');
			}
			if ( record.get('error') ||  new DocQueue.Record( record ).getTypeOfDocument() == 'notfound'  ) {
				meta.style += 'color:red;';
				return Ext.app.Localize.get('Error');
			} else {
				DocQueue.progressbar.setValue(value);
				return DocQueue.progressbar.getHtmlCode();
			}
		}
		
	};
	
	var templateCol = {
		
		header: Ext.app.Localize.get('Documents templates'), 
		dataIndex: 'tplid', 
		id: 'tplname-col', 
		renderer: function(value, meta, record) {
			if (DocQueue.Templates.Data[value] != undefined) return DocQueue.Templates.Data[value].name;
			else return '';
		}
		
	};
	
	var retainScrollPosition = {
		viewConfig: {
        	onLoad: Ext.emptyFn,
           	listeners: {
            	beforerefresh: function(v) {
                	v.scrollTop = v.scroller.dom.scrollTop;
                	v.scrollHeight = v.scroller.dom.scrollHeight;
            	},
            	refresh: function(v) {
            		v.scroller.dom.scrollTop = v.scrollTop +
                	(v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight - v.scrollHeight);
            	}
            }
       	}
	};
		
	DocQueue.Grid = new Ext.grid.GridPanel(Ext.apply({
		
		renderTo:'queueGrid',
		id:'QueueGridPanel',
		width: 960,
		height: 300,
		autoExpandColumn: 'tplname-col',
		tbar: [ DocQueue.AutoReloadToggle,  {xtype: 'tbseparator'},  DocQueue.ReloadOnceButton ],
		columns: [
			{header: "ID", dataIndex: 'recordid', width: 50},
			templateCol,
			{header: Ext.app.Localize.get('Manager'), dataIndex: 'manager', width:178},
			{header: Ext.app.Localize.get('Added'), dataIndex: 'createdate', width:145},
			{header: Ext.app.Localize.get('Generated'), dataIndex: 'enddate', width:145},
			{header: Ext.app.Localize.get('Period'), dataIndex: 'period', width:100},
			statusCol,
			DocQueue.ButtonCol1,
			DocQueue.ButtonCol2
		],
		listeners: {
            beforerender: function(grid) {
              	grid.setPagePanel();
            },
            afterrender: function(grid) {
            	DocQueue.AutoReloadToggle.start();
   			}
        },
		plugins: [DocQueue.ButtonCol1, DocQueue.ButtonCol2],
		store: DocQueue.Store
        
	}, retainScrollPosition));
}

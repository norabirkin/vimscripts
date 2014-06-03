/**
 * LANBilling JavaScript functions for the common use
 *
 * Repository information:
 * $Date: 2009-11-25 12:23:54 $
 * $Revision: 1.15.2.8 $
 */

/**
 * Internet Explorer PNG bug fix
 *
 */
function fixPNG(element) {
	if (/MSIE (5\.5|6).+Win/.test(navigator.userAgent)) { var src; if (element.tagName=='IMG'){ if (/\.png$/.test(element.src)) { src = element.src; element.src = "images/s.gif"; } } else { src = element.currentStyle.backgroundImage.match(/url\("(.+\.png)"\)/i); if (src) { src = src[1]; element.runtimeStyle.backgroundImage="none"; } } if (src) element.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')"; }
}


/**
 * Create new hidden element or edit existing with new value and submit form
 * @param	string form Id
 * @param	string form element name
 * @param	string new value for the element
 * @param	string, confirm message
 */
function submitForm( A, B, C, D ) {
	try { if(typeof D != "undefined" && D != "") { if(false == confirm(D)) { return false; } } createHidOrUpdate(A, B, C); if(typeof A == 'object') { A.submit(); } else { document.getElementById(A).submit(); } }
	catch(e) { alert(e.toString()); }
} // end submitForm()


/**
 * Create new hidden element or edit existing with new value
 * @param	string form Id
 * @param	string form element Name id not exists or element ID
 * @param	string new value for the element
 */
function createHidOrUpdate( A, B, C ) {
	createItem = function(A, C){ var B = document.createElement('INPUT'); B.type = 'hidden'; B.name = A; B.id = '_' + A + '_'; B.value = C; return B; }
	if(typeof A != 'object'){ var A = document.getElementById(A); }
	try { if(!document.getElementById('_' + B + '_')){ B = createItem(B, C); A.appendChild(B); } else { if(!A[document.getElementById('_' + B + '_').name]){ B = createItem(B, C); A.appendChild(B); } else { A[document.getElementById('_' + B + '_').name].value = C; }; } } catch(e) { alert(e.toString()) }
} // end createHidOrUpdate()


/**
 * Change class value for the requsted block
 *
 */
function ClassName(A, B) {
	if(Ext.isEmpty(A)){ return false; };
	if(typeof A != 'object'){ try{ var A = document.getElementById(A);} catch(e){ alert(e.toString()); return false; }}; if(Ext.isEmpty(B)){ A.className = ''; } else{ A.className = B; }
} // end class()


/**
 * Change Element visibility state to opposite
 * @param	string / object, DOM element Id / DOM element
 */
function displayState( A ) {
	try {
		// Convert or get HTML element as EXT prepared element
		var A = Ext.Element.get(A);
		A.setVisibilityMode(2);
		if(A.isVisible() == true) { A.setVisible(false, true); } else { A.setVisible(true, true); }
	} catch(e) { e.toString() }
} // end elementState()


/**
 * Remove elements from the DOM by ID
 * @param	Mix (array or string) elements to remove from DOM
 */
function removeElements( A ) {
	if(Ext.isEmpty(A)) { return false; }; if(typeof A != 'object') { var A = [A]; }; Ext.each(A, function(A){ try{ Ext.get(A).remove(); } catch(e){ } });
} // end removeElements()


/**
 * Create and pass link to hidden frame to start download
 * @param	object, parameters to pass as get link
 * @param	boolean, if thrue than passed A is url link
 */
//function Download( A, url ) {
//	if(typeof A != 'object' && url != true) { return false };
//	params = function(A){ var B = []; for(var i in A){ B.push(i + '=' + A[i]); } return B.join('&'); }
//	if(!document.getElementById('_DownFrame')) { var B = document.createElement("IFRAME"); B.id = '_DownFrame'; B.style.display = "none"; document.body.appendChild(B); }; if(typeof B != 'object'){ var B = document.getElementById('_DownFrame'); };
//	if (url != true) {
//		B.src = './index.php?async_call=1&download=1&' + params(A);
//	}
//	else {
//		B.src = './index.php?' + A;
//	}
//} // end Download()


/**
 * Exception catcher to determine if ExtJS was not loaded before
 *
 */
try {
	/**
	 * Detect from server unauthorized command
	 *
	 */
	Ext.Ajax.on('requestcomplete', function(c, r){ try{ response = Ext.util.JSON.decode(r.responseText); if(response.authorize){ submitForm('_MenuForm', 'devision', -1); } } catch(e){ } }, this);

	/**
	 * Send request to server to identify records on page
	 */
	//if(Ext.isEmpty(Ext.app.PageLimit)){ Ext.Ajax.request({ url: 'index.php', method: 'POST', success: function(R){ try { var O = Ext.util.JSON.decode(R.responseText); Ext.app.PageLimit = O.pgsize; } catch(e){ Ext.app.PageLimit = 50; } }, failure: function(){ Ext.app.PageLimit = 50; }, params: { devision: 0, async_call: 1, getpgsize: 1 } }); }

	/**
	 * Simple menu visual effects
	 *
	 */
	Ext.simpleMenu = { get: function(A){ var F = Ext.get(A); Ext.each(F.dom.getElementsByTagName('li'), this.parse, this)}, parse: function(A, B){ var F = Ext.get(A); if(F.dom.className == ''){ F.addClassOnOver('tabmenu-item-over'); } } }

	/**
	 * This function allows to control input data to specified fiald
	 * @param	Mix, array or single string of the lement(s) to apply property
	 * @param	string, control type, known types: int, float, string
	 * @param	string, specific regexp string to apply as property (only if string type)
	 */
	function typeControl( A, C, D ) {
		var B = A.split(',');
		for(var i in B) { if(typeof B[i] != 'string'){ continue; }; if(!document.getElementById(Ext.util.Format.trim(B[i]))){ continue; }; var field = Ext.get(Ext.util.Format.trim(B[i])); field.on('keypress', function(e){ if((e.SHIFT == e.getKey() || e.BACKSPACE == e.getKey() || e.DELETE == e.getKey()) && e.charCode != 46) { return true; } switch(C){ case 'float': var F = /[0-9\.\,]/; break; case 'int': var F = /[0-9]/; break; default: if(!Ext.isEmpty(D)){ var F = new RegExp(D); } else{ var F = /[\w\W\d\D\s]/ } } var key = String.fromCharCode( (Ext.isEmpty(e.getKey()) ? e.charCode : e.getKey()) ); if(!F.test(key)) { e.returnValue = false; e.preventDefault(); } } ); }
	} // end onlyFloat()

	/**
	 * If there is need to check any row / cell/ grid condition than set function to the
	 * object iconCls: myfunction
	 * there with be passed: record, row, col, this
	 */
	Ext.grid.RowButton = function(config){ Ext.apply(this, config); this.addEvents({ beforeaction: true, action: true }); if(Ext.util.Format.substr(Ext.version,0,1) == 3 && !this.renderer){ this.renderer = this.Renderer.createDelegate(this); } Ext.grid.RowButton.superclass.constructor.call(this); };
	Ext.extend(Ext.grid.RowButton, Ext.util.Observable, { header: '', sortable: false, dataIndex: '', width: 20, fixed: true, lazyRender: true, iconCls: '', init:function(grid){ this.grid = grid; var view = grid.getView(); var cfg = {scope:this}; cfg[this.actionEvent] = this.onClick; grid.afterRender = grid.afterRender.createSequence(function() { view.mainBody.on(cfg); grid.on('destroy', this.purgeListeners, this); }, this); grid.on({ render: { scope: this, fn: function(){ view.mainBody.on({ click: { scope: this, fn: this.onClick } }); } } }); if(Ext.util.Format.substr(Ext.version,0,1) == 2 && !this.renderer){ this.renderer = this.Renderer.createDelegate(this); } }, Renderer: function(value, cell, record, row, col, store){ cell.css += (cell.css ? ' ' : '') + 'ext-grid3-row-action-cell'; var retval = '<div class="' + this.getIconCls(record, row, col) + '"'; retval += this.style ? ' style="' + this.style + '"' : ''; retval += this.qtip ? ' ext:qtip="' + this.qtip +'"' : ''; retval += '> </div>'; return retval; }, getIconCls:function(record, row, col){ if(typeof this.iconCls == 'function'){ return this.iconCls(record, row, col, this); } else{ return this.iconCls }; }, onClick:function(e, target){ var record, iconCls; var row = e.getTarget('.x-grid3-row'); var col = this.grid.getView().getCellIndex(e.getTarget('.ext-grid3-row-action-cell')); if(false !== row && false !== col){ record = this.grid.store.getAt(row.rowIndex); iconCls = this.getIconCls(record, row.rowIndex, col); if(Ext.fly(target).hasClass(iconCls)) { if(false !== this.fireEvent('beforeaction', this.grid, record, row.rowIndex)) { this.fireEvent('action', this.grid, record, row.rowIndex, e); } } } } });
	Ext.reg('rowbutton', Ext.grid.RowButton);


	/**
	 * CheckBox plugin,
	 * @param	object, config
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
	            var record = this.grid.store.getAt(index);
				if(Ext.isDefined(this.handler) && Ext.isFunction(this.handler)) {
					var elstate = Ext.get(t).hasClass('x-grid3-check-col-on');
					if(this.handler(this, elstate, elstate ? false : true, record, index) === false) {
						return;
					}
				}
	            record.set(this.dataIndex, !record.data[this.dataIndex]);
	        }
	    },
	    renderer: function(v, p, record){
	        p.css += ' x-grid3-check-col-td';
	        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '" ' + (Ext.isDefined(this.qtip) ? ('ext:qtip="' + this.qtip + '"') : '') + '>&#160;</div>';
	    }
	};

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
} catch(e) { }

inoremap <buffer> : :<space>
if !exists('loaded_snippet') || &cp
    finish
endif

let st = g:snip_start_tag
let et = g:snip_end_tag
let cd = g:snip_elem_delim

function! GetExtjsClassName()
    let cls = "OSS." . substitute( expand('%'), '/','.','g')
    let cls = substitute( cls, '.js','','g')
    return cls
endfunction

exec "Snippet proto ".st."className".et.".prototype.".st."methodName".et." = function(".st.et.")<CR>{<CR>".st.et."<CR>};<CR>".st.et
exec "Snippet m= /**<cr>".st.et."<cr>/<cr>this.".st.et." = function(".st.et.") {<cr>".st.et."<cr>};"
exec "Snippet m /**<cr>".st.et."<cr>/<cr>".st.et.": function(".st.et.") {<cr>".st.et."<cr>},".st.et
exec "Snippet if if (".st.et.") {<cr>".st.et."<cr>}"
exec "Snippet else else {<cr>".st.et."<cr>}"
"exec \"Snippet win /**<cr>\".st.et.\"<cr>/<cr>Ext.define('\". GetExtjsClassName() .\"', {<cr>extend: 'Ext.window.Window',<cr>title: i18n.get('\".st.et.\"'),<cr>width: 500,<cr>layout: 'anchor',<cr>modal: true,<cr>items: [\".st.et.\"]<cr>});"
exec "Snippet win new Ext.Window({<cr>title: Ext.app.Localize.get('".st.et."'),<cr>modal: true,<cr>width: 850,<cr>resizable: false,<cr>items: [".st.et."]<cr>});"
exec "Snippet fo new Ext.form.FormPanel({<cr>frame: true,<cr>labelWidth: 100,<cr>buttonAlign: 'center',<cr>items: [".st.et."],<cr>buttons: [".st.et."]<cr>});"
exec "Snippet xgr {<cr>xtype: 'gridpanel',<cr>store: ".st.et.",<cr>columns: [".st.et."],<cr>bbar: {<cr>xtype: 'pagingtoolbar'<cr>}<cr>},"
exec "Snippet col {<cr>header: Ext.app.Localize.get('".st.et."'),<cr>dataIndex: '".st.et."'<cr>}, ".st.et
"exec \"Snippet col {<cr>header: i18n.get('\".st.et.\"'),<cr>dataIndex: '\".st.et.\"'<cr>}, \".st.et
exec "Snippet [: ".st.et.": [".st.et."],".st.et
exec "Snippet fi {<cr>name: '".st.et."',<cr>type: '".st.et."'<cr>}, ".st.et
exec "Snippet cs Ext.create('Ext.data.Store', {<cr>".st.et."<cr>})".st.et
exec "Snippet pr proxy: {<cr>type: 'rest',<cr>url: Ext.Ajax.getRestUrl('api/".st.et."'),<cr>reader: {<cr>type: 'json',<cr>root: 'results',<cr>totalProperty: 'total'<cr>}<cr>},".st.et
exec "Snippet o {<cr>".st.et."<cr>}".st.et
exec "Snippet : ".st.et.": ".st.et.",".st.et
exec "Snippet wino if (!this.get".st.et."(".st.et.")) {<cr>this.getView('".st.et."').create();<cr>}<cr>this.get".st.et."(".st.et.").show();"
exec "Snippet ref {<cr>selector: '".st.et."',<cr>ref: '".st.et."'<cr>}"
exec "Snippet ali alias: 'widget.".st.et."',"
exec "Snippet def /**<cr>".st.et."<cr>/<cr>Ext.define('". GetExtjsClassName() ."', {<cr>".st.et."<cr>});"
exec "Snippet mod /**<cr>".st.et."<cr>/<cr>Ext.define('". GetExtjsClassName() ."', {<cr>extend: 'Ext.data.Model',<cr>idProperty: '".st.et."',<cr>".st.et."<cr>});"
exec "Snippet ds /**<cr>".st.et."<cr>/<cr>Ext.define('". GetExtjsClassName() ."', {<cr>extend: 'Ext.data.Store',<cr>".st.et."<cr>});"
exec "Snippet han '".st.et."': {<cr>".st.et.": '".st.et."'<cr>}, ".st.et
exec "Snippet ini initComponent: function() {<cr>".st.et."<cr>this.callParent(arguments);<cr>},".st.et
exec "Snippet cgr Ext.define('". GetExtjsClassName() ."', {<cr>extend: 'OSS.ux.form.field.ComboGrid',<cr>store: ".st.et.",<cr>width: 500,<cr>displayField: '".st.et."',<cr>valueField: '".st.et."',<cr>columns: [".st.et."]<cr>});"
exec "Snippet cre Ext.create('".st.et."'".st.et.")".st.et
"exec \"Snippet i18 i18n.get('\".st.et.\"')\"
exec "Snippet i18 Ext.app.Localize.get('".st.et."')"
exec "Snippet cons console.log(".st.et.");"
exec "Snippet console.log(' console.log('".st.et."'"
"exec \"Snippet cal this.callParent(arguments);\".st.et

exec "Snippet cal Ext.".st.et.".superclass.".st.et.".call(this);"
exec "Snippet xform {<cr>xtype: 'form',<cr>frame: true,<cr>items:[".st.et."]<cr>}".st.et
exec "Snippet confirm Ext.Msg.confirm(i18n.get('".st."title".et."'), i18n.get('".st."message".et."'), function(btn) {<cr> if (btn != 'yes') {<cr>return;<cr>}<cr>".st.et."<cr>}, this);".st.et
exec "Snippet alert Ext.Msg.alert(i18n.get('".st."title".et."'), i18n.get('".st."message".et."'));".st.et
exec "Snippet for for (".st.et." = 0; ".st.et." < ".st.et."; ".st.et." ++) {<cr>".st.et."<cr>}".st.et
exec "Snippet getC Ext.app.Application.instance.getController('".st.et."')".st.et
exec "Snippet over /**<cr>".st.et."<cr>/<cr>Ext.define('OSS.overrides.".st.et."', function() {<cr>return {<cr>override: '".st.et."',<cr>".st.et."<cr>};<cr>}());"
exec "Snippet @p @param ".st.et." {".st.et."} ".st.et
exec "Snippet @r @return {".st.et."} ".st.et
exec "Snippet lazy mixins: ['OSS.ux.data.store.LazyBehaviour'],".st.et
exec "Snippet time {<cr>xtype:'datetime',<cr>fieldLabel: i18n.get('".st.et."'),<cr>labelWidth: 50,<cr>name: '".st.et."',<cr>defaultDate: function() {<cr>return null;<cr>},<cr>showSeconds: true<cr>},".st.et
exec "Snippet taba this.".st.et."().getStore().setExtraParams({<cr>vg_id: this.getVgroupId()<cr>});<cr>this.".st.et."().getStore().loadIfNeccessary();"
exec "Snippet ajax ajax.request({<cr>url: '".st.et."',<cr>method: '".st.et."',<cr>success: function(result) {<cr>".st.et."<cr>},<cr>scope: this<cr>});"
exec "Snippet remove {<cr>itemId: 'remove',<cr>xtype: 'actioncolumn',<cr>width: 25,<cr>tooltip: i18n.get('Remove'),<cr>iconCls: 'x-ibtn-def x-ibtn-delete',<cr>getClass: function() {<cr>var dis = (".st.et.") ? '' : '-dis';<cr>return 'x-ibtn-def' + dis + ' x-ibtn-delete';<cr>}<cr>}"
exec "Snippet edit {<cr>itemId: 'edit',<cr>xtype: 'actioncolumn',<cr>width: 20,<cr>tooltip: i18n.get('Edit'),<cr>iconCls: 'x-ibtn-def x-ibtn-edit',<cr>getClass: function() {<cr>var dis = (".st.et.") ? '' : '-dis';<cr>return 'x-ibtn-def' + dis + ' x-ibtn-edit';<cr>}<cr>}"
exec "Snippet cc /**<cr>".st.et."<cr>/"
exec "Snippet combotpl tpl: Ext.create('Ext.XTemplate',<cr><tab>'<tpl for=\".\">',<cr><tab>'<div data-qtip=\"{".st.et."}\" class=\"x-boundlist-item\">".st.et."</div>',<cr><bs><bs><bs><bs>'</tpl>'<cr><bs><bs><bs><bs>),".st.et
exec "Snippet xtpl Ext.create('Ext.XTemplate',<cr><tab>'<tpl for=\".\">',<cr><tab>".st.et.",<cr><bs><bs><bs><bs>'</tpl>'<cr><bs><bs><bs><bs>)".st.et
exec "Snippet ell Ext.String.ellipsis(".st.et.", ".st.et.")" 
exec "Snippet func function(".st.et.") {<cr>".st.et."<cr>}"
exec "Snippet winedit Ext.define('".GetExtjsClassName()."', {<cr>extend: 'OSS.ux.grid.editor.Window',<cr>store: ".st.et.",<cr>title: i18n.get('".st.et."'),<cr>winConfig: {<cr>title: {<cr>create: i18n.get('".st.et."'),<cr>update: i18n.get('".st.et."')<cr>},<cr>editForm: [".st.et."]<cr>},<cr>columns: [".st.et."]<cr>});"
exec "Snippet dc /**<cr>".st.et."<cr>/<cr>Ext.define('".GetExtjsClassName()."', {<cr>extend: 'Ext.app.Controller',<cr>requires: [],<cr>stores: [],<cr>views: [],<cr>refs: [],<cr>init: function() {<cr>this.control({<cr>});<cr>}<cr>});"
exec "Snippet class /**<cr>".st.et."<cr>/<cr>Ext.define('".GetExtjsClassName()."', {<cr>constructor: function(config) {<cr>this.initConfig(config);<cr>},<cr>config: {<cr>".st.et."<cr>}<cr>});"
exec "Snippet process OSS.component.License.process(<cr><tab>this.licid,<cr>'".st.et."',<cr>".st.et."<cr><bs><bs><bs><bs>);"
exec "Snippet processor /**<cr>".st.et."<cr>/<cr>Ext.define('".GetExtjsClassName()."', {<cr>extend: 'OSS.component.license.Processor'<cr>});"
"exec \"Snippet Aj Ext.Ajax.request({<cr>url: 'index.php/api/\".st.et.\"',<cr>scope: this,<cr>success: \".st.et.\"<cr>});"
exec "Snippet Aj Ext.Ajax.request({<cr>url: 'config.php',<cr>method: 'POST',<cr>params: {<cr>async_call: 1,<cr>devision: ".st.et.",<cr>".st.et."<cr>},<cr>callback: function(){<cr>".st.et."<cr>},<cr>scope: this<cr>});"
exec "Snippet de var success = arguments[1],<cr><tab>response = arguments[2],<cr>results;<cr><bs><bs><bs><bs>if (success) {<cr>results = Ext.decode(response.responseText).results;<cr>}<cr>".st.et
exec "Snippet onr Ext.onReady(function(){<cr>".st.et."('".st.et."');<cr>});<cr><cr>function ".st.et."(renderTo) {<cr>if(!Ext.get(renderTo)) {<cr>return false;<cr>}<cr>".st.et."<cr>}"
exec "Snippet gr new Ext.grid.GridPanel({<cr>height: 800,<cr>width: 980,<cr>renderTo: ".st.et.",<cr>cm: new Ext.grid.ColumnModel({<cr>columns: [".st.et."],<cr>defaults: {<cr>sortable: true,<cr>menuDisabled: false<cr>}<cr>}),<cr>autoExpandColumn: '".st.et."',<cr>store: ".st.et.",<cr>bbar: new Ext.PagingToolbar({<cr>pageSize: PAGELIMIT,<cr>store: ".st.et.",<cr>displayInfo: true,<cr>items: ['-', {<cr>xtype: 'combo',<cr>width: 70,<cr>displayField: 'id',<cr>valueField: 'id',<cr>typeAhead: true,<cr>mode: 'local',<cr>triggerAction: 'all',<cr>value: PAGELIMIT,<cr>editable: false,<cr>store: new Ext.data.ArrayStore({<cr>data: [<cr>['100'],<cr>['500']<cr>],<cr>fields: ['id']<cr>}),<cr>listeners: {<cr>select: function(){<cr>PAGELIMIT = this.getValue() * 1;<cr>this.ownerCt.pageSize = PAGELIMIT;<cr>".st.et.".reload({ params: { limit: PAGELIMIT } });<cr>}<cr>}<cr>}]<cr>})<cr>})"
exec "Snippet rs new Ext.data.Store({<cr>proxy: new Ext.data.HttpProxy({<cr>url: 'config.php',<cr>method: 'POST'<cr>}),<cr>reader: new Ext.data.JsonReader({<cr>root: 'results'<cr>}, [".st.et."]),<cr>autoLoad: true,<cr>baseParams: {<cr>async_call: 1,<cr>devision: ".st.et.",<cr>".st.et."<cr>}<cr>})"
exec "Snippet ed ".st.et." = new Ext.grid.RowButton({<cr>header: '&nbsp;',<cr>qtip: Ext.app.Localize.get('".st.et."'),<cr>width: 22,<cr>iconCls: 'ext-edit'<cr>});<cr>".st.et.".on('action', function() {<cr>var record = arguments[1];<cr>".st.et."<cr>});"
exec "Snippet ex Ext.".st.et." = function(config){<cr>Ext.apply(this, config);<cr>Ext.".st.et.".superclass.constructor.call(this);<cr>};<cr>Ext.extend(Ext.".st.et.", Ext.".st.et.", {<cr>".st.et."<cr>});"
exec "Snippet im {<cr>type: 'imageBtn',<cr>cls: '".st.et."',<cr>title: Ext.app.Localize.get('".st.et."'),<cr>img: '".st.et."',<cr>handler: function() {<cr>".st.et."<cr>}<cr>}"
exec "Snippet in {<cr>type: 'infoCol',<cr>label: Ext.app.Localize.get('".st.et."'),<cr>dataIndex: '".st.et."'<cr>}"
exec "Snippet add {<cr>xtype: 'button', <cr>itemId: 'save',<cr>text: Ext.app.Localize.get('".st.et."'), <cr>icon: 'images1/create1.gif',<cr>iconCls: 'ext-edit-message-btn',<cr>listeners: {<cr>click: ".st.et."<cr>}<cr>}"
exec "Snippet ls new Ext.data.ArrayStore({<cr>data: [<cr><tab>".st.et."<cr><bs><bs><bs><bs>],<cr>fields: [".st.et."]<cr>})"
exec "Snippet com {<cr>xtype: 'combo',<cr>editable: false,<cr>triggerAction: 'all',<cr>fieldLabel: Ext.app.Localize.get('".st.et."'),<cr>name: '".st.et."',<cr>displayField: '".st.et."',<cr>valueField: '".st.et."',<cr>store: ".st.et."<cr>}"
exec "Snippet rea Ext.onReady(function() {\<cr>});"

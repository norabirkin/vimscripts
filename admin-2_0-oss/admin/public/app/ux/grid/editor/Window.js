Ext.define( "OSS.ux.grid.editor.Window", {
    extend: "Ext.grid.Panel",
    
    alias: "widget.grid_with_edit_window",
    
    getEditWindow: function() {
        if (!this.win) { 
            this.saveBtn = Ext.create( "Ext.button.Button", {
                itemId: "save",
                formBind: true,
                text: OSS.Localize.get("Save")
            });
            this.cancelBtn = Ext.create("Ext.button.Button", { text: OSS.Localize.get( "Cancel" ) });
            var conf = { 
                xtype: "form", 
                frame: true, 
                padding: '10',
                buttonAlign: 'center',
                defaults: {
                    labelWidth: this.winConfig.labelWidth || 100
                },
                items: this.winConfig.editForm,
                buttons: [ this.saveBtn, this.cancelBtn ]
            };
            if (this.itemId && this.itemId !== "") {
                conf.itemId = this.itemId + "_editform";
            }
            this.form = this.processForm(Ext.create("Ext.form.Panel", conf));
            conf = Ext.apply({
                width: this.winConfig.width || 350,
                //height: 350,
                closeAction: 'hide',
                layout: "fit",
                items: [this.form]
            }, (this.winConfig.params || {}));
            if (this.itemId && this.itemId !== "") {
                conf.itemId = this.itemId + "_editwin";
            }
            this.win = Ext.create( "Ext.window.Window", conf );
            this.cancelBtn.on( "click", function() { this.win.hide(); }, this );
            this.saveBtn.on( "click", this.saveItem, this );
            this.form.getForm().reset();
            this.fireEvent( "windowcreated", this.item, this );
        }
        return this.win;
    },
    /**
     * Возвращает форму создания/редактирования
     *
     * @return {Ext.form.Panel} Форма
     */
    getForm: function() {
        return this.form;
    },
    /**
     * Обрабатывает форму создания/редактирования записи
     *
     * @param form {Ext.form.Panel} Форма
     * @return {Ext.form.Panel}
     */
    processForm: function(form) {
        return form;
    },
    /**
     * Возвращает редактируемую запись
     *
     * @return {Ext.data.Model} Запись
     */
    getItem: function() {
        return this.item;
    },
    getFieldValue: function( field ) {
        var value = field.getValue();
        if ( field.xtype == "checkbox" ) { 
            var checkedValue = field.inputValue;
            var defaultValue = (new this.store.model()).get( field.getName() );
            value = value ? checkedValue : defaultValue;
        }
        if (value instanceof Date) {
            value = Ext.Date.format(value, 'Y-m-d H:i:s');
        }
        return value;
    },
    saveItem: function() {
        var values = {};

        if (this.validate) {
            if (!this.form.getForm().isValid()) {
                return;
            }
        }
        this.form.getForm().getFields().each(function( field ) {
            values[field.getName()] = this.getFieldValue( field );
        }, this);

        this.fireEvent( "itemsave", { values: values } );
        for (var i in values) { 
            this.item.set( i, values[i] );
        }
        this.itemSave();
    },
    itemSave: function() {
        this.item.save({ scope: this, callback: function() {
            if (!arguments[2]) {
                return;
            }
            this.store.reload();
            this.fireEvent('aftersave');
            this.getEditWindow().hide();
        }});
    },
    openEditWindow: function() {
        this.editMode = false;
        this.createMode = true;
        this.item = new this.store.model();
        this.fireEvent( "newitemcreated", this.item );
        var win = this.getEditWindow();
        this.fireEvent('itemcreate', {panel: this});
        win.setTitle( this.winConfig.title.create );
        var beforewindowshow = { go_on: true, delegateBack: Ext.bind( this.resetFormAndShowWindow, this ) };
        this.fireEvent( "beforewindowshow", beforewindowshow );
        if (beforewindowshow.go_on) {
            this.resetFormAndShowWindow();
        }
    },
    resetFormAndShowWindow: function() {
        this.form.getForm().reset();
        this.showWindow();
    },
    setFormValuesAndShowWindow: function() {
        this.form.getForm().setValues( this.valuesToSet );
        this.showWindow();
    },
    showWindow: function() {
        this.getEditWindow().show();
        this.form.getForm().isValid();
        this.fireEvent('windowshow', this);
    },
    setFormValuesAndOpenWindow: function() {
        var win = this.getEditWindow(),
            values = {},
            i;
        for (i in this.item.data) {
            values[i] = this.item.get(i);
        }
        this.fireEvent("itemedit", {
            values: values,
            form: this.form,
            panel: this
        });
        this.valuesToSet = values;
        win.setTitle( this.winConfig.title.update );
        var beforewindowshow = { go_on: true, delegateBack: Ext.bind( this.setFormValuesAndShowWindow, this ) };
        this.fireEvent( "beforewindowshow", beforewindowshow );
        if (beforewindowshow.go_on) {
            this.setFormValuesAndShowWindow();
        }
    },
    valuesToSet: {},
    beforeItemEdit: function() {
        var data = { edit: true, panel: this };
        this.fireEvent( "beforeitemedit", data );
        if (data.edit) {
            this.setFormValuesAndOpenWindow();
        }
    },
    openUpdateWindow: function() {
        if (!this.editAvailable(arguments[5])) {
            return;
        }
        this.item = arguments[5];
        this.editMode = true;
        this.createMode = false;
        this.beforeItemEdit();
    },
    editAvailable: function(record) {
        return true;
    },
    deleteConfirm: {
        title: OSS.Localize.get("Confirm item remove"), 
        msg: OSS.Localize.get("Do you realy want to remove item?")
    },
    getDeleteConfirmProperty: function( prop, record ) {
        var value = this.deleteConfirm[ prop ];
        if (typeof value == "function") {
            return Ext.bind( value, this )( record );
        }
        if (typeof value == "string") {
            return value;
        }
    },
    openRemoveConfirmWindow: function() {
        var record = arguments[5];
        if (!this.removeAllowed(record)) {
            return;
        }
        Ext.Msg.confirm( 
            this.getDeleteConfirmProperty( "title" ),
            this.getDeleteConfirmProperty( "msg" ),
            this.removeItem,
            { me: this, record: record }
        );
    },
    removeItem: function( button ) {
        if (!this.me.removeAllowed(this.record) || button != "yes") {
            return;
        }
        this.record.destroy({ scope: this.me, callback: function() { this.store.reload(); }});
    },
    removeAllowed: function( record ) {
        return true;
    },
    /**
     * Обрабатывает колонки грида
     */
    processColumns: function(columns) {
        return columns;
    },
    actions: [],
    /**
     * Получает элементы меню <Действия>
     */
    getActions: function() {
        return [this.addBtn].concat(this.actions);
    },
    toolbarClassName: 'OSS.ux.toolbar.Toolbar',
    externalToolbarContainer: false,
    createToolbar: function() {
        var tbconf,
            external;
        this.toolbar = this.toolbar || [];
        tbconf = {
            actions: this.getActions(),
            items: this.toolbar
        };
        if (typeof this.back !== 'undefined') {
            tbconf.back = this.back;
        }
        this.tb = Ext.create(this.toolbarClassName, tbconf);
        if (!this.externalToolbarContainer) {
            this.tbar = this.tb;
        }
    },
    addToolbar: function(container) {
        container.addDocked(this.tb);
    },
    initComponent: function() {
        this.addBtn = Ext.create("Ext.menu.Item", { itemId:"add", text: OSS.Localize.get("Add"), iconCls: 'x-ibtn-add' });
        this.createToolbar();
        this.addBtn.on("click", this.openEditWindow, this);
        
        var me = this;
        this.removeCol = Ext.create( "Ext.grid.column.Action", {
            itemId: "remove",
            header: '&nbsp',
            width: 25,
            tooltip: OSS.Localize.get( 'Remove' ),
            getClass: function() { 
                var dis = me.removeAllowed( arguments[2] ) ? "" : "-dis";
                return 'x-ibtn-def' + dis + ' x-ibtn-delete'; 
            }                       
        });
        if (!this.disableEdit) {
            this.editCol = Ext.create( "Ext.grid.column.Action", {
                header: "&nbsp",
                itemId: "edit",
                width: 30,
                tooltip: OSS.Localize.get( 'Edit' ),
                align: 'center',
                getClass: function() {
                    var dis = me.editAvailable(arguments[2]) ? '' : '-dis';
                    return 'x-ibtn-def' + dis + ' x-ibtn-edit'; 
                }                       
            });
            this.editCol.on("click", this.openUpdateWindow, this);
        }
        this.removeCol.on("click", this.openRemoveConfirmWindow, this);
        var cols = [];
        for (var i = 0; i < this.columns.length; i ++) {
            if (this.columns[i].itemId != "edit" && this.columns[i].itemId != "remove") {
                cols.push( this.columns[i] );
            }
        }
        this.columns = cols;
        if (!this.disableEdit) {
            this.columns.unshift( this.editCol );
        }
        this.columns.push( this.removeCol );
        this.columns = this.processColumns(this.columns);
        this.callParent();
    }
});

Ext.define( "OSS.ux.grid.editor.row.CheckboxSelection", {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelectionBase',
    
    alias: "widget.with_row_editing_and_checkbox_selection",
    
    addBtn: null,
    removeBtn: null,
    addBtnText: OSS.Localize.get( 'Add' ),
    removeBtnText: OSS.Localize.get( 'Delete' ),
    actions: [],

    defaultActions: function() { 
        return [{
            itemId:"addBtn", 
            text: this.addBtnText, 
            iconCls: 'x-ibtn-add'
        }, {
            itemId:"removeBtn", 
            text: this.removeBtnText, 
            disabled: true, 
            iconCls: 'x-ibtn-def-dis x-ibtn-delete'
        }];
    },
    toolbarClassName: 'OSS.ux.toolbar.Toolbar',
    createTbar: function() {
        if (!this.tbar) {
            this.tbar = [];
        }
        this.tbar = Ext.create(this.toolbarClassName, {
            items: this.tbar,
            actions: this.defaultActions().concat(this.actions)
        });
    },
    setRemoveBtn: function( removeBtn ) {
        this.removeBtn = removeBtn;
        this.on( 'selectionchange', this.setRemoveBtnState, this );
        this.removeBtn.on( 'click', this.onRemoveButtonClick,  this );
    },
    setAddBtn: function( addBtn ) {
        this.addBtn = addBtn;
        this.addBtn.on( 'click', this.addItemForRowEditing, this );
    },
    initGridSettings: function() {
        this.createTbar();
        this.on( "render", function() {
            var removeBtn = this.down("toolbar > #actions > #removeBtn");
            var addBtn = this.down("toolbar > #actions > #addBtn");
            if (removeBtn) {
                this.setRemoveBtn(removeBtn);
            }
            if (addBtn) {
                this.setAddBtn(addBtn);
            }
        }, this );
    }
});

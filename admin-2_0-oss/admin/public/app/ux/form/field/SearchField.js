Ext.define('OSS.ux.form.field.SearchField', {
    extend: "Ext.form.field.Text",
    alias: "widget.searchtext",
    enableKeyEvents: true,
    parentContainerType: null, // string
    searchButton: null, // string
    listeners: {
        keypress : function(textfield, eo){
            if (eo.getCharCode() == Ext.EventObject.ENTER) {
                // Check or set textfield & button container
                if(this.parentContainerType == '') {
                    this.parentContainerType = 'toolbar';
                }
                // Check each item in container to find the button (searchButton param)
                Ext.each(this.up( this.parentContainerType ).items.items, function(item){
                    if(item.itemId == this.searchButton) {
                        // fire!
                        item.fireEvent('click', item);
                    }                   
                }, this);
            }
        }
    }
});


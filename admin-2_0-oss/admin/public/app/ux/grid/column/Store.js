/**
 * Колонка отображающая свойство записи хранилища, соответствующей значению колонки
 */
Ext.define('OSS.ux.grid.column.Store', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.storecolumn',
    valueField: 'id',
    displayField: 'name',
    getStore: function() {
        return typeof this.store == 'string' ? Ext.data.StoreManager.lookup(this.store) : this.store;
    },
    config: {
        store: null
    },
    /**
     * Отображает значение колонки
     */
    defaultRenderer: function(value) {
        var index = this.getStore().findExact(this.valueField, value);
        if (index == -1) {
            return value;
        } else {
            return this.getStore().getAt(index).get(this.displayField);
        }
    }
});

/**
 * This is store for the application laounched views int he main body
 */
Ext.define('OSS.store.Programs', {
    extend: 'Ext.data.ArrayStore',
    fields: ['id', 'name', 'state', 'item', 'title', 'control'],
    data: [],

        /**
     * Get item record from process storage
     * @param      object
     */
    getProccess: function(data) {
        var data = data || {
            property: 'id',
            value: null
        },
            idx = -1;

        if ((idx = this.find(data.property, data.value, 0, false, true, true)) > -1) {
            return this.getAt(idx);
        }

        return null;
    }
});

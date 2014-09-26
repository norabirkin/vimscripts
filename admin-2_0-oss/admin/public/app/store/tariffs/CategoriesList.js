Ext.define('OSS.store.tariffs.CategoriesList', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.tariffs.CategoriesList',
    model: 'OSS.model.tariffs.CategoriesList',
    groupField: 'oper_name',
    remoteSort: true,
    constructor: function(config) {
        this.listeners = {
            load: function() {
                Ext.app.Application.instance.getController(
                    'tariffs.Categories'
                ).restoreSelection();
            }
        };
        this.callParent(arguments);
    }
});

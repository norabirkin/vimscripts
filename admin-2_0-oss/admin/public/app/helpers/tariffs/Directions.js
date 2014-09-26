/**
 * Загрузка хранилищ для вкладок направлений в категориях тарифа
 */
Ext.define('OSS.helpers.tariffs.Directions', {
    constructor: function(config) {
        this.initConfig(config);
    }, 
    config: {
        loadClasses: false,
        panel: null,
        catalog_type: null,
        params: {}
    },
    load: function(params) {
        var me = this, load;

        if (this.loadClasses) {
            this.controller('Catalogs').
                 getCatalogZonesClassesStore().load({
                     received: this.doLoad,
                     scope: this
                 });
        } else {
            this.doLoad();
        }
    },
    doLoad: function(params) {
        if (this.modified('cat_id') || !this.param('cat_id')) {
            this.clear(this.free());
            this.clear(this.assigned());
            this.disable();
        } else {
            this.enable();
            this.assigned().setExtraParams(this.request({
                catalog_type: this.catalog_type,
                cat_idx: this.param('cat_idx'),
                tar_id: this.param('tar_id')
            }));
            this.free().setExtraParams(this.request({
                catalog_type: this.catalog_type,
                catalog_id: this.param('cat_id')
            }));
            this.panel.setParams(this.request({
                cat_idx: this.param('cat_idx'),
                catalog_id: this.param('cat_id'),
                tar_id: this.param('tar_id')
            }));
            this.free().load();
            this.assigned().load();
        }
    },
    clear: function(store) {
        store.setExtraParams({});
        store.removeAll();
    },
    enable: function() {
        this.panel.available.enable();
        this.panel.assigned.enable();
    },
    disable: function() {
        this.panel.available.disable();
        this.panel.assigned.disable();
    },
    request: function(params) {
        return Ext.apply(params, this.params);
    },
    free: function() {
        return this.panel.available.store;
    },
    assigned: function() {
        return this.panel.assigned.store;
    },
    param: function(name) {
        return this.categories().param(name);
    },
    modified: function(name) {
        return this.categories().modified(name);
    },
    categories: function() {
        return this.controller('tariffs.Categories');
    },
    controller: function(name) {
        return Ext.app.Application.instance.getController(name);
    }
});

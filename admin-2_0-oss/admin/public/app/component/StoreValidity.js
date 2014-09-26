/**
 * Класс управляющий валидностью данных хранилищ
 */
Ext.define('OSS.component.StoreValidity', {
    singleton: true,
    stores: {},
    /**
     * Добавляет хранилище
     */
    addStore: function(store) {
        var validity = store.validity,
            i;
        if (!validity) {
            return;
        }
        if (!(validity instanceof Array)) {
            validity = [validity];
        }
        for (i = 0; i < validity.length; i ++) {
            if (!this.stores[validity[i]]) {
                this.stores[validity[i]] = [];
            }
            this.stores[validity[i]].push(store);
        }
    },
    /**
     * Объявляет хранилища невалидными
     */
    setInvalid: function(id) {
        var stores = this.stores[id],
            i;
        if (!stores) {
            return;
        }
        for (i = 0; i < stores.length; i ++) {
            stores[i].setInvalid();
        }
    }
});

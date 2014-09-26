/*
* Mixin для хранилища, проверяющий изменение параметров хранилища перед запросом
*/
Ext.define('OSS.ux.data.store.LazyBehaviour', {
    isLazy: true,
    invalidData: true,
    setDataInvalid: function() {
        this.invalidData = true;
    },
    extraParamsChanged: function( params ) {
        if (this.countObjectParams(params) != this.countObjectParams(this.proxy.extraParams)) {
            return true;
        }
        for (var i in params) {
            if ((typeof this.proxy.extraParams[i]) != (typeof params[i])) {
                return true;
            }
            if (params[i] != this.proxy.extraParams[i]) {
                return true;
            }
        }
        return false;
    },
    countObjectParams: function(obj) {
        var i,
            count = 0;
        for (i in obj) {
            count ++;
        }
        return count;
    },
    setDataValid: function() {
        this.invalidData = false;
    },
    setDataValidationState: function( state ) {
        this.invalidData = state;
    },
    /**
     * Добавляет дополнительные параметры
     */
    addExtraParams: function(params) {
        this.setExtraParams(
            Ext.apply(
                Ext.apply(
                    {},
                    this.proxy.extraParams
                ),
                params
            )
        );
        return this;
    },
    setExtraParams: function(params) {
        if (this.extraParamsChanged(params)) {
            this.setDataInvalid();
        }
        this.proxy.extraParams = params;
        this.currentPage = 1;
        return this;
    },
    loadIfNeccessary: function( params ) {
        if (!this.invalidData) {
            return false;
        }
        var setDataValid = function() {
            this.setDataValid();
            this.un( "load", setDataValid, this );
        };
        this.on( "load", setDataValid, this );
        this.load( params );
        return true;
    }
});

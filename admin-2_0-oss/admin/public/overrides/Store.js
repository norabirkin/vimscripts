/**
 * Override на хранилище
 */
Ext.define('OSS.overrides.data.Store', function() {
    return {
        override: 'Ext.data.AbstractStore',
        defaultPageSize: 100,
        lastParams: {},
        invalid: true,
        lazy: false,
        /**
         * Добавляет фильтр загруженных данных, в зависимости от свойств лицензии
         *
         * @param config {Object} конфиг хранилища
         */
        constructor: function(config) {
            this.callParent(arguments);
            if (Ext.ClassManager.get('OSS.component.StoreValidity')) {
                OSS.component.StoreValidity.addStore(this);
            }
            if (Ext.ClassManager.get('OSS.component.License')) {
                OSS.component.License.process(
                    this.licid,
                    'store',
                    this.filters
                );
            }
        },
        extraParamsChanged: function(params) {
            return !this.compareObjects(params, this.proxy.extraParams);
        },
        setInvalid: function(state) {
            if (typeof state == 'undefined') {
                state = true;
            }
            this.invalid = !!state;
        },
        getInvalid: function() {
            return this.invalid;
        },
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
                this.setInvalid();
            } else {
                return this;
            }
            this.proxy.extraParams = params;
            this.currentPage = 1;
            return this;
        },
        compareObjects: function(obj1, obj2) {
            if (this.countObjectParams(obj1) != this.countObjectParams(obj2)) {
                return false;
            }
            for (var i in obj1) {
                if ((typeof obj2[i]) != (typeof obj1[i])) {
                    return false;
                }
                if (obj1[i] != obj2[i]) {
                    return false;
                }
            }
            return true;
        },
        countObjectParams: function(obj) {
            var i,
                count = 0;
            for (i in obj) {
                count ++;
            }
            return count;
        },
        createParamsObject: function(params) {
            return Ext.apply(Ext.apply(
                Ext.apply(
                    {},
                    params
                ),
                this.proxy.extraParams
            ), {
                limit: this.pageSize,
                page: this.currentPage
            });
        },
        onLoadNotNeccesary: function() {
        },
        load: function(__options) {
            var options = __options || {},
                scope = options.scope || window,
                received = Ext.bind(
                    (options.received || function () {}),
                    scope
                ),
                callback = function() {
                    this.setInvalid(false);
                    received();
                    this.un('load', callback, this);
                },
                paramsObject;
            if (!this.lazy || options.force) {
                return this.callParent(arguments);
            }
            if (this.loading) {
                return this;
            }
            paramsObject = this.createParamsObject(options.params);
            if (!this.invalid) {
                if (!this.compareObjects(
                    this.lastParams,
                    paramsObject
                )) {
                    this.setInvalid();
                }
            }
            this.lastParams = paramsObject;
            if (this.invalid) {
                this.on('load', callback, this);
                return this.callParent(arguments);
            } else {
                received();
                this.onLoadNotNeccesary();
                return this;
            }
        }
    };
}());

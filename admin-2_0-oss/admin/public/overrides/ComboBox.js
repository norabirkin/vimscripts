Ext.define('OSS.overrides.form.field.ComboBox', function() {
    return {
        override: 'Ext.form.field.ComboBox',
        /**
         * Устанавливает значение для комбобокса, создавая элемент хранилища, если необходимо
         *
         * @param value {mixed} значение
         * @param display {String} отображение значения
         */
        setValueWithDisplay: function(value, display) {
            var data = {};
            if (this.getStore().findExact(this.valueField, value) == -1) {
                data[this.valueField] = value;
                data[this.displayField] = display;
                this.getStore().add(data);
            }
            this.setValue(value);
        },
        /**
         * Executes a query to filter the dropdown list. Fires the {@link #beforequery} event prior to performing the query
         * allowing the query action to be canceled if needed.
         *
         * @param {String} queryString The string to use to filter available items by matching against the configured {@link #valueField}.
         * @param {Boolean} [forceAll=false] `true` to force the query to execute even if there are currently fewer characters in
         * the field than the minimum specified by the `{@link #minChars}` config option. It also clears any filter
         * previously saved in the current store.
         * @param {Boolean} [rawQuery=false] Pass as true if the raw typed value is being used as the query string. This causes the
         * resulting store load to leave the raw value undisturbed.
         * @return {Boolean} true if the query was permitted to run, false if it was cancelled by a {@link #beforequery}
         * handler.
         */
        doQuery: function(queryString, forceAll, rawQuery) {
            var me = this,

                // Decide if, and how we are going to query the store
                queryPlan = me.beforeQuery({
                    query: queryString || '',
                    rawQuery: rawQuery,
                    forceAll: forceAll,
                    combo: me,
                    cancel: false
                });

            // Allow veto.
            if (queryPlan === false || queryPlan.cancel) {
                return false;
            }

            // If they're using the same value as last time, just show the dropdown
            if (me.queryCaching && queryPlan.query === me.lastQuery && !me.store.lazy) {
                me.expand();
            }
            
            // Otherwise filter or load the store
            else {
                me.lastQuery = queryPlan.query;

                if (me.queryMode === 'local') {
                    me.doLocalQuery(queryPlan);

                } else {
                    me.doRemoteQuery(queryPlan);
                }
            }

            return true;
        },
        /**
         * Устанавливает значение для комбобокса, создавая элемент хранилища, если необходимо
         *
         * @param record {Ext.data.Model} запись
         */
        setValueByRecord: function(record) {
            if (!record) {
                this.setValue(null);
                return;
            }
            if (this.getStore().findExact(this.valueField, record.get(this.valueField)) == -1) {
                this.getStore().add(record);
            }
            this.setValue(record.get(this.valueField));
        },
        /**
         * Находит запись в хранилище соответствующую текущему значению
         */
        getRecord: function() {
            var index = this.getStore().findExact(this.valueField, this.getValue());
            if (index == -1) {
                return null;
            } else {
                return this.getStore().getAt(index);
            }
        },
        /**
         * Отображает элементы в формате "{значение valueField}. {значение displayField}"
         */
        addTplsForIdShowing: function() {
            var tpl = '{'+this.valueField+'}. {[Ext.String.ellipsis(values.'+this.displayField+', 20)]}';
            this.tpl = Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div data-qtip="{'+this.displayField+'}" class="x-boundlist-item">'+tpl+'</div>',
                '</tpl>'
            );
            if (!this.notDisplayId) {
                this.displayTpl = Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                        tpl,
                    '</tpl>'
                );
            }
        },
        /**
         * Привязвает к хранилищу обработчик, добавляющий элемент <по-умолчанию> в начало списка
         */
        bindStoreLoadHandlerToAddDefaultOption: function() {
            this.getStore().on('load', this.addDefaultOption, this);
        },
        /**
         * Добавляет элемент <по умолчанию> в начало списка
         */
        addDefaultOption: function() {
            if (this.getStore().findExact(this.valueField, this.defaultOption[this.valueField]) != -1) {
                return;
            }
            this.getStore().insert(0, this.defaultOption);
            if (this.displayTpl) {
                this.setValue(this.value);
            } else {
                this.shouldSetValue = true;
            }
        },
        /**
         * Удаляет обработчик, добавляющий элемент <по-умолчанию>, если это нужно
         */
        removeStoreLoadHandlerToAddDefaultOption: function(store) {
            if (!store && this.getStore()) {
                this.getStore().un('load', this.addDefaultOption, this);
            }
        },
        /**
         * Выполняется до привязки хранилища если определен элемент <по умолчанию>
         *
         * @param store {Ext.data.Store} Хранилище
         */
        doBeforeStoreBindingIfDefaultOptionDefined: function(store) {
            this.removeStoreLoadHandlerToAddDefaultOption(store);  
        },
        /**
         * Выполняется полсе привязки хранилища если определен элемент <по умолчанию>
         */
        doAfterStoreBindingIfDefaultOptionDefined: function() {
            if (!this.getStore()) {
                return;
            }
            this.addDefaultOption();
            this.bindStoreLoadHandlerToAddDefaultOption();
        },
        bindStore: function(store) {
            if (this.defaultOption) {
                this.doBeforeStoreBindingIfDefaultOptionDefined(store);
            }
            this.callParent(arguments);
            if (this.defaultOption) {
                this.doAfterStoreBindingIfDefaultOptionDefined();
            }
        },
        initComponent: function() {
            if (this.showId) {
                this.addTplsForIdShowing();
            }
            this.callParent(arguments);
            if (this.shouldSetValue) {
                this.setValue(this.value);
            }
        }
    };
}());

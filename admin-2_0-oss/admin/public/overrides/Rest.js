/**
 * Override на REST прокси
 */
Ext.define('OSS.overrides.data.proxy.Rest', function() {
    return {
        override: 'Ext.data.proxy.Rest',
        /**
         * Костыль для совместимости с кодом фреймворка версии 4.0.
         *
         * @param id {Integer} id записи
         * @return {Boolean} TRUE если следует считать id валидным
         */
        isValidId: function(id) {
            return !!id;
        },
        /**
         * Изменяет параметры запрса в зависимости от свойств лицензии
         *
         * @param operation {Object} операция
         * @return {Object} параметры запроса
         */
        getParams: function(operation) {
            var params = this.callParent(arguments);
            OSS.component.License.process(
                this.licid,
                'proxy',
                params
            );
            return params;
        },
        /**
         * Добавляет в опции запроса свойство "silent" от значение которого зависит 
         * будет ли при ошбике отображаться окно с сообщением об ошибке
         *
         * @param operation {Object} операция
         * @return {Object} опции запроса
         */
        buildRequest: function(operation) {
            return Ext.apply(this.callParent(arguments), {
                silent: operation.silent
            });
        }
    };
}());

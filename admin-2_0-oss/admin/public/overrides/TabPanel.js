/**
 * Override на панель вкладок
 */
Ext.define('OSS.overrides.tab.Panel', function() {
    return {
        override: 'Ext.tab.Panel',
        /**
         * Перед добавлением вкладки проверяет, нужно ли добавлять эту вкладку исходя из свойств лицензии
         *
         * @param tab {Ext.Component} вкладка
         */
        onBeforeAdd: function(tab) {
            if (
                OSS.component.License.process(
                    tab.licid,
                    'tab'
                ) === false
            ) {
                return false;
            } else {
                return this.callParent(arguments);
            }
        }
    };
}());

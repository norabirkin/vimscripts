/**
 * Override на компонент
 */
Ext.define('OSS.overrides.Component', function() {
    return {
        override: 'Ext.Component',
        /**
         * Скрывает компонент, если это необходимо исходя из свойств лицензии
         */
        initComponent: function() {
            this.callParent(arguments);
            if (typeof OSS !== 'undefined' && typeof OSS.component !== 'undefined' && typeof OSS.component.License !== 'undefined') {
                OSS.component.License.process(
                    this.licid,
                    'component',
                    this
                );
            }
        }
    };
}());

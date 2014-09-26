/**
 * Скрывает компонент, если это необходимо, исходя из свойств лицензии
 */
Ext.define('OSS.component.license.processor.Component', {
    extend: 'OSS.component.license.Processor',
    /**
     * Скрывает компонент, добавляя свойства в его конфиг
     *
     * @param component {Object} компонент
     */
    hide: function(component) {
        component.on('render', function() {
            component.hide();
        });
        component.show = function() {};
        component.forceHidden = true;
        if (component.isXType('gridcolumn')) {
            component.hideable = false;
        } else if (
            component.isXType('menuitem') &&
            component.controller
        ) {
            Ext.app.Application.instance.getController(
                'Viewport'
            ).disallowProgram(
                component.controller
            );
        }
    },
    /**
     * Скрывает компонент, который не должен присутствовать в облачной версии
     */
    processFull: function(component) {
        if (this.param('cloud')) {
            this.hide(component);
        }
    }
});

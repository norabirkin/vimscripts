/**
 * Базовый класс для классов изменяющих интерфейс в зависимости от свойств лицензии
 */
Ext.define('OSS.component.license.Processor', {
    param: function(name) {
        if(!window.License || !Ext.isObject(window.License)) {
            return false;
        }
        
        return window.License[name];
    }
});

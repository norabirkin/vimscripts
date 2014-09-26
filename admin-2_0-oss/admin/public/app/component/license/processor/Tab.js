/**
 * Перед добавлением вкладки в панель вкладок проверяет стоит
 * ли добавлять эту вкладку исходя из свойств лицензии
 */
Ext.define('OSS.component.license.processor.Tab', {
    extend: 'OSS.component.license.Processor',
    /**
     * Предотвращает добавление вкладок, которые не
     * должны быть доступны в облачной версии
     *
     * @return {Boolean/null} возвращает FALSE в том случае, когда вкладку добавлять не нужно
     */
    processFull: function() {
        if (this.param('cloud')) {
            return false;
        }
    }
});

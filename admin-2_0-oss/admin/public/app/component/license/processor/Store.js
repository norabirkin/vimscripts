/**
 * Фильтрует данные хранилища в зависимости от свойств лицензии
 */
Ext.define('OSS.component.license.processor.Store', {
    extend: 'OSS.component.license.Processor',
    /**
     * Фильтрует содержимое таблицы в разделе Опции/Настройки/Общие
     *
     * @param filters {Ext.util.MixedCollection} фильтры
     */
    processSettings: function(filters) {
        if (this.param('cloud')) {
            filters.add(new Ext.util.Filter({
                filterFn: function(item) {
                    return !Ext.Array.contains([
                        'disable_change_user_agreement',
                        'session_lifetime',
                        'wrong_active',
                        'use_operators',
                        'default_operator',
                        'pay_import_delim',
                        'templates_dir'
                    ], item.get('name'));
                }
            }));
        }
    },
    /**
     * Фильтрует хранилище типов агентов
     *
     * @param filters {Ext.util.MixedCollection} фильтры
     */
    processAgentType: function(filters) {
        if (this.param('cloud')) {
            filters.add(new Ext.util.Filter({
                filterFn: function(item) {
                    return item.get('id') == 13;
                }
            }));
        }
    },
    /**
     * Фильтрует хранилище типов тарифов
     *
     * @param filters {Ext.util.MixedCollection} фильтры
     */
    processTariffTypes: function(filters) {
        if (this.param('cloud')) {
            filters.add(new Ext.util.Filter({
                filterFn: function(item) {
                    return item.get('id') == 5;
                }
            }));
        }
    },
    /**
     * Фильтрует комбобокс параметров поиска в разделе Отчеты/Статистика
     */
    processStatisticsSearch: function(filters) {
        if (this.param('cloud')) {
            filters.add(new Ext.util.Filter({
                filterFn: function(item) {
                    return item.get('name') != 'ip' &&
                           item.get('name') != 'ani';
                }
            }));
        }
    }
});

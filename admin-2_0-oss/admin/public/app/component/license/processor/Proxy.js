/**
 * Изменяет параметры запроса, осуществляемого прокси, в зависимости от свойств лицензии
 */
Ext.define('OSS.component.license.processor.Proxy', {
    extend: 'OSS.component.license.Processor',
    /**
     * Добавляет в запрос списка агентов параметр types=13, если у клиента облачная лицензия
     *
     * @param params {Object} параметры запроса
     */
    processAgents: function(params) {
        if (this.param('cloud')) {
            params.types = 13;
        }
    },
    /**
     * Добавляет в запрос списка тарифов параметр tar_types=5, если у клиента облачная лицензия
     *
     * @param params {Object} параметры запроса
     */
    processTariffs: function(params) {
        if (this.param('cloud')) {
            params.tar_types = 5;
        }
    },
    /**
     * Добавляет в запрос списка учетных записей параметр agent_type=5, если у клиента облачная лицензия
     *
     * @param params {Object} параметры запроса
     */
    processAccounts: function(params) {
        if (this.param('cloud')) {
            params.agent_type = 13;
        }
    }
});

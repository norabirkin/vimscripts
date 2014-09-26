/**
 * Хелпер раздела <Статистика>
 */
Ext.define('OSS.helpers.Statistics', {
    statics: {
        REPNUM_INTERNET: 5,
        REPNUM_DIALUP: 7,
        REPNUM_TELEPHONY: 9,
        REPNUM_SERVICES: 6,
        AGENT_TYPE_VOIP: 12,
        AGENT_TYPE_USBOX: 13
    },
    isProperAgent: function(record) {
        throw 'define isProperAgent method';
    },
    /**
     * Возвращает данные для хранилища комбобокса <группировать по>
     *
     * @return {Array}
     */
    getGroupings: function() {
        throw 'define getGroupings method';
    },
    /**
     * Возвращает имя класса панели <Итого>
     *
     * @return {String}
     */
    getSummaryGridClass: function() {
        throw 'define getSummaryGridClass method';
    },
    /**
     * Создает экземплар класса хелпера и возвращает его, или возвращает уже созданный
     *
     * @param className {String}
     * @return {OSS.helpers.Statistics}
     */
    get: function(className) {
        if (!this.instances) {
            this.instances = {};
        }
        if (!this.instances[className]) {
            this.instances[className] = Ext.create(className);
        }
        return this.instances[className];
    },
    /**
     * Увеличивает значение поля записи панели <Итого>
     *
     * @param currency {Number} валюта
     * @param record {Ext.data.Model} текущая в данной итерации запись таблицы статистики
     * @param field {String} имя поля
     * @param summary {Array} массив данных для панели итого
     * @return {Number} увеличенное значение
     */
    increaseSummaryValue: function(currency, record, field, summary) {
        return false;
    },
    /**
     * Возвращает хелпер статистики для определенного типа агента.
     * Если не указан параметр type, то используется тип агента, 
     * выбранного в комбобоксе агентов
     *
     * @param type {Integer} тип агента
     * @return {OSS.helpers.Statistics}
     */
    getInstance: function(type) {
        var s = OSS.helpers.Statistics;
        type = type || Ext.
                       app.
                       Application.
                       instance.
                       getController('Statistics').
                       getRepnum();
        switch (type) {
            case s.REPNUM_INTERNET:
                return this.get('OSS.helpers.statistics.Internet');
            case s.REPNUM_DIALUP:
                return this.get('OSS.helpers.statistics.Dialup');
            case s.REPNUM_TELEPHONY:
                return this.get('OSS.helpers.statistics.Telephony');
            case s.REPNUM_SERVICES:
                return this.get('OSS.helpers.statistics.Services');
            default:
                throw 'unknown type';
        }
    }
});

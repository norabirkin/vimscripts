/**
 * Данные об учетной записи и связанных с ней агенте, договоре и тарифе
 */
Ext.define('OSS.helpers.accounts.Data', {
    singleton: true,
    constructor: function() {
        var account,
            tariff,
            agent,
            agreement,
            manager,
            old;
        /**
         * Удаляет все данные
         */
        this.clear = function() {
            account = Ext.create('OSS.model.account.Full');
            tariff = null;
            agent = null;
            manager = null;
            agreement = null;
            old = {};
        };
        /**
         * Возвращает данные менеджера
         */
        this.getManager = function() {
            return manager;
        };
        /**
         * Возваращает учетную запись
         */
        this.getAccount = function() {
            return account;
        };
        /**
         * Возвращает тариф
         */
        this.getTariff = function() {
            return tariff;
        };
        /**
         * Возвращает агент
         */
        this.getAgent = function() {
            return agent;
        };
        /**
         * Возвращает договор
         */
        this.getAgreement = function() {
            return agreement;
        };
        /**
         * Устанавливает тариф
         */
        this.setTariff = function(value) {
            account.set(
                'tar_id',
                value ?
                value.get('tar_id') :
                0
            );
            tariff = value;
        };
        /**
         * Устанавливает данные менеджера
         */
        this.setManager = function(value) {
            manager = value;
        };
        /**
         * Устанавливает учетную запись
         */
        this.setAccount = function(value) {
            account = value;
        };
        /**
         * Устанавливает договор
         */
        this.setAgreement = function(value) {
            old.agreement = agreement;
            agreement = value;
        };
        /**
         * Устанавливает агент
         */
        this.setAgent = function(value) {
            old.agent = agent;
            agent = value;
        };
        /**
         * Восстанавлиает предыдущее значение договора
         */
        this.restoreAgreement = function() {
            agreement = old.agreement;
        };
        /**
         * Восстанавливает предыдущее значение агента
         */
        this.restoreAgent = function() {
            agent = old.agent;
        };

        this.clear();
    }
});

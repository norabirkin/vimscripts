/**
 * Проверяет подходит ли тариф связанный с учетной записью к ее текущим параметрам
 */
Ext.define('OSS.helpers.accounts.tariff.Validation', {
    AGREEMENT_PAYMENT_METHOD_ADVANCE: 0,
    AGREEMENT_PAYMENT_METHOD_CREDIT: 1,
    AGREEMENT_PAYMENT_METHOD_MIXED: 2,

    TARIFF_ACT_BLOCK_NONE: 0,
    TARIFF_ACT_BLOCK_AUTO: 1,
    TARIFF_ACT_BLOCK_ACTIVE: 2,

    TARIFF_TYPE_LEASED_LINE: 0,
    TARIFF_TYPE_DIALUP_BY_SIZE: 1,
    TARIFF_TYPE_DIALUP_BY_TIME: 2,
    TARIFF_TYPE_TELEPHONY: 3,
    TARIFF_TYPE_IP_TELEPHONY: 4,
    TARIFF_TYPE_SERVICES: 5,

    AGENT_TYPE_ETHERNET_PCAP: 1,
    AGENT_TYPE_ETHERNET_ULOG: 2,
    AGENT_TYPE_ETHERNET_TEE: 3,
    AGENT_TYPE_NETFLOW: 4,
    AGENT_TYPE_SFLOW: 5,
    AGENT_TYPE_RADIUS: 6,
    AGENT_TYPE_PCDR_PABX: 7,
    AGENT_TYPE_VOIP: 12,
    AGENT_TYPE_USBOX: 13,
    AGENT_TYPE_SNMP: 14,

    constructor: function(config) {
        this.initConfig(config);
    },
    /**
     * Проверяет подходит ли тариф связанный с учетной записью к ее текущим параметрам
     */
    run: function() {
        if (
            this.controller.load.fillingForm ||
            !OSS.helpers.accounts.Data.getTariff()
        ) {
            return;
        }
        if (!this.isCurrentTariffValid()) {
            this.askToConfirmChanges();
        }
    },
    /**
     * Возвращает TRUE если тариф связанный с учетной записью подходит к ее текущим параметра, и возвращает FALSE в противном случае
     */
    isCurrentTariffValid: function() {
        this.inconsistency = {
            messages: [],
            actions: []
        };
        this.checkIfAgentCompatible();
        this.checkAgreementCompatible();
        return this.inconsistency.messages.length === 0;
    },
    /**
     * Проверяет подходит ли агент к текущему тарифу
     */
    checkIfAgentCompatible: function() {
        if (!this.isAgentCompatible()) {
            this.inconsistency.messages.push(i18n.get('The agent that you have choosen does not fit to current tariff.'));
            this.inconsistency.actions.push(function() {
                OSS.helpers.accounts.Data.restoreAgent();
                this.controller.field('agent_id').setValueByRecord(
                    OSS.helpers.accounts.Data.getAgent()
                );
            });
        }
    },
    /**
     * Возвращает TRUE, если агент подходит к текущему тарифу и возвращает FALSE в противном случае
     */
    isAgentCompatible: function() {
        var tariff = OSS.helpers.accounts.Data.getTariff(),
            agent = OSS.helpers.accounts.Data.getAgent();
        if (agent.get('type') == this.AGENT_TYPE_SNMP) {
            return true;
        }
        switch (tariff.get('type')) {
            case this.TARIFF_TYPE_LEASED_LINE:
                return Ext.Array.contains([
                    this.AGENT_TYPE_ETHERNET_PCAP,
                    this.AGENT_TYPE_ETHERNET_ULOG,
                    this.AGENT_TYPE_ETHERNET_TEE,
                    this.AGENT_TYPE_NETFLOW,
                    this.AGENT_TYPE_SFLOW
                ], agent.get('type'));
            case this.TARIFF_TYPE_DIALUP_BY_SIZE:
            case this.TARIFF_TYPE_DIALUP_BY_TIME:
                return agent.get('type') == this.AGENT_TYPE_RADIUS;
            case this.TARIFF_TYPE_TELEPHONY:
                return agent.get('type') == this.AGENT_TYPE_PCDR_PABX;
            case this.TARIFF_TYPE_IP_TELEPHONY:
                return agent.get('type') == this.AGENT_TYPE_VOIP;
            case this.TARIFF_TYPE_SERVICES:
                return agent.get('type') == this.AGENT_TYPE_USBOX;
        }
    },
    /**
     * Проверяет подходит ли договор к текущему тарифу
     */
    checkAgreementCompatible: function() {
        var agreement = OSS.helpers.accounts.Data.getAgreement(),
            tariff = OSS.helpers.accounts.Data.getTariff();
            restore = false;
        if (tariff.get('cur_id') != agreement.get('cur_id')) {
            this.inconsistency.messages.push(i18n.get('The agreement that you have choosen does not fit to current tariff by currency.'));
            restore = true;
        }
        if (this.isIncosistentByPaymentMethod()) {
            this.inconsistency.messages.push(i18n.get('The agreement that you have choosen does not fit to current tariff by payment method.'));
            restore = true;
        }
        if (restore) {
            this.inconsistency.actions.push(function() {
                OSS.helpers.accounts.Data.restoreAgreement();
                this.controller.field('agrm_id').setValueByRecord(
                    OSS.helpers.accounts.Data.getAgreement()
                );
            });
        }
    },
    /**
     * Проверяет договор на совместимость тарифу по типу договора
     */
    isIncosistentByPaymentMethod: function() {
        var agreement = OSS.helpers.accounts.Data.getAgreement(),
            tariff = OSS.helpers.accounts.Data.getTariff();
        if (agreement.get('payment_method') == this.AGREEMENT_PAYMENT_METHOD_MIXED) {
            return false;
        }
        switch (tariff.get('act_block')) {
            case this.TARIFF_ACT_BLOCK_NONE:
            case this.TARIFF_ACT_BLOCK_ACTIVE:
                return agreement.get('payment_method') != this.AGREEMENT_PAYMENT_METHOD_ADVANCE;
            case this.TARIFF_ACT_BLOCK_AUTO:
                return agreement.get('payment_method') != this.AGREEMENT_PAYMENT_METHOD_CREDIT;
            default:
                throw 'Unknown tariff block type';
        }
    },
    /**
     * Показывает окно подтверждения измененеия параметров учетной записи
     */
    askToConfirmChanges: function() {
        Ext.Msg.confirm(
            i18n.get('Info'),
            this.getConfirmationText(),
            function(btn) {
                 if (btn == 'yes') {
                     Ext.bind(this.onConfirm, this.scope)();
                 } else {
                     this.ifChangesNotConfirmed();
                 }
            }, this
        );
    },
    /**
     * Возвращает текст, который должен быть отображен в окне подтверждения
     */
    getConfirmationText: function() {
        var text = [];
        Ext.Array.each(this.inconsistency.messages, function(item) {
            text.push(item);
        });
        text.push(i18n.get('Do you want to apply changes?'));
        return text.join('<br/>');
    },
    /**
     * Выполняется если пользователь не подтвердил изменения параметров
     */
    ifChangesNotConfirmed: function() {
        Ext.Array.each(this.inconsistency.actions, function(item) {
            Ext.bind(item, this)();
        }, this);
    },
    config: {
        /**
         * Выполняется если пользователь подтвердил изменения параметров
         */
        onConfirm: function() {
            throw 'define onConfirm method';
        },
        controller: null,
        scope: {}
    }
});

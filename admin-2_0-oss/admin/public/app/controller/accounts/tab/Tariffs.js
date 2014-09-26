/**
 * Управляет вкладкой <Тарифы>
 */
Ext.define('OSS.controller.accounts.tab.Tariffs', {
    extend: 'Ext.app.Controller',
    refs: [{
        selector: 'accounts > #form > #tariffs',
        ref: 'tariffs'
    }],
    init: function() {
        this.control({
            'accounts > #form > #tariffs': {
                aftersave: 'afterSchedule',
                itemcreate: 'beforeSchedule'
            }
        });
    },
    /**
     * Выполняется после сохранения запланированного тарифа
     */
    afterSchedule: function() {
        var controller = this.getController('OSS.controller.accounts.Item'),
            form = this.getTariffs().
                getEditWindow().
                down('form').
                getForm();
        if (this.isScheduledOnCurrentDate(form)) {
            this.display(
                controller,
                form
            );
        }
        if (this.isTariffsTabActive(controller)) {
            OSS.ux.HeadMsg.show(i18n.get('Tariff scheduled'));
        }
    },
    /**
     * Возвращает TRUE, если текущей активной вкладкой является вкладка <Тарифы>
     */
    isTariffsTabActive: function(controller) {
        return controller.
        getTabs().
        getActiveTab().
        getItemId() != 'tariffs';
    },
    /**
     * Отображает новый тариф на вкладке <Общие>, если это необходимо
     */
    display: function(controller, form) {
        OSS.helpers.accounts.Data.setTariff(
            form.
            findField('tar_id_new').
            getRecord()
        );
        controller.tariff.display();
    },
    /**
     * Возвращает true, если тариф запланирован на текущую дату
     */
    isScheduledOnCurrentDate: function(form) {
        return Ext.Date.format(
            form.
                findField('change_time').
                getDate(),
            'Y-m-d'
        ) ==
        Ext.Date.format(
            new Date(),
            'Y-m-d'
        );
    },
    /**
     * Вызывается при открытии окны планирования тарифа
     */
    beforeSchedule: function(options) {
        options.panel.getItem().set(
            'agent_id',
            OSS.helpers.accounts.Data.
                getAccount().
                get('agent_id')
        );
    }
});

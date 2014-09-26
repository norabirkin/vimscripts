/**
 * Планирование тарифа
 */
Ext.define('OSS.helpers.accounts.Tariff', {
    constructor: function(config) {
        this.initConfig(config);
        this.initTariffChecker();
    },
    config: {
        controller: null,
        /**
         * Создает объект проверяющий тариф на совместимость с параметрами учетной записи
         */
        initTariffChecker: function() {
            this.tariffChecker = Ext.create('OSS.helpers.accounts.tariff.Validation', {
                onConfirm: this.ifChangesConfirmed,
                controller: this.controller,
                scope: this
            });
        },
        /**
         * Изменяет доступность планирования тарифа
         */
        checkSchedulingAvailability: function() {
            if (
                !OSS.helpers.accounts.Data.
                    getAccount().
                    get('agent_id') ||
                !OSS.helpers.accounts.Data.
                    getAgreement()
            ) {
                this.disable();
            } else {
                this.ifSchedulingAvailable();
            }
        },
        /**
         * Выполняется если планирование тарифа должно быть доступно
         */
        ifSchedulingAvailable: function() {
            this.enable();
            this.addRequestParams();
            this.tariffChecker.run();
        },
        /**
         * Устанавливает параметры запроса списка доступных тарифов
         */
        addRequestParams: function() {
            this.fetchStore().setExtraParams({
                agent_id:
                    OSS.helpers.accounts.Data.
                    getAccount().
                    get('agent_id'),
                cur_id:
                    OSS.helpers.accounts.Data.
                    getAgreement().
                    get('cur_id'),
                act_block:
                    OSS.helpers.accounts.Data.
                    getAgreement().
                    get('payment_method')
            });
        },
        /**
         * Делает планирование тарифа недоступным
         */
        disable: function() {
            this.controller.getTariffButton().disable();
            this.reset();
        },
        /**
         * Делает планирование тарифа доступным
         */
        enable: function() {
            this.controller.getTariffButton().enable();
        },
        /**
         * Удаляет данные о тарифе
         */
        reset: function() {
            var record = Ext.create('OSS.model.account.Tariff');
            OSS.helpers.accounts.Data.setTariff(null);
            OSS.helpers.accounts.Data.getAccount().set('tar_schedules', null);
            Ext.Array.each(
                this.controller.getTariffFieldset().query('field'),
                function(item) {
                    item.setValue(record.get(item.getName()));
                }
            );
        },
        /**
         * Выполняется если пользователь подтвердил изменения параметров
         */
        ifChangesConfirmed: function() {
            this.reset();
            this.openWindow();
        },
        /**
         * Возвращает хранилище тарифов
         *
         * @return {OSS.store.Tariffs}
         */
        fetchStore: function() {
            if (!this.store) {
                this.store = Ext.create('OSS.store.Tariffs');
            }
            return this.store;
        },
        /**
         * Открывает окно планирования тарифа
         */
        openWindow: function() {
            if (!this.controller.getTariffButton().disabled) {
                this.fetchTab().openEditWindow();
            }
        },
        /**
         * Возвращает вкладку тарифов
         */
        fetchTab: function() {
            var me = this,
                controller = Ext.app.Application.instance.getController('OSS.controller.accounts.tab.Tariffs');
            if (
                controller.getTariffs &&
                controller.getTariffs()
            ) {
                this.tab = controller.getTariffs();
            }
            if (!this.tab) {
                this.tab = this.createTab();
            }
            return this.tab;
        },
        /**
         * Создает вкладку тарифов
         */
        createTab: function() {
            var me = this;
            return Ext.create('OSS.view.accounts.item.Tariffs', {
                itemSave: function() {
                    me.substituteTabElementSave(this);
                }
            });
        },
        /**
         * Метод подменяющий сохранение элемента вкладки тарифов
         */
        substituteTabElementSave: function(tab) {
            this.scheduleForNewAccount(tab.item,
                tab.getEditWindow().
                down('combogrid1[name=tar_id_new]').
                getRecord()
            );
            tab.getEditWindow().hide();
        },
        /**
         * Выполняется при выборе тарифа
         */
        scheduleForNewAccount: function(schedule, tariff) {
            OSS.helpers.accounts.Data.setTariff(tariff);
            OSS.helpers.accounts.Data.getAccount().set('tar_schedules', Ext.JSON.encode(schedule.data));
            this.display();
        },
        /**
         * Отображает данные о тарифе
         */
        display: function() {
            if (OSS.helpers.accounts.Data.getTariff()) {
                Ext.Array.each(
                    [
                        'rent',
                        'descr',
                        'tar_shape',
                        'act_block',
                        'daily_rent'
                    ],
                    this.displayParam,
                    this
                );
            } else {
                this.reset();
            }
        },
        /**
         * Отображает свойство тарифа
         */
        displayParam: function(id) {
            if (id == 'rent') {
                this.displayRent();
            } else {
                this.controller.getTariffFieldset().down('#'+id).setValue(
                    OSS.helpers.accounts.Data.getTariff().get(id)
                );
            }
        },
        /**
         * Отображает абонентскую плату тарифа
         */
        displayRent: function() {
            this.controller.getRent().setValue(
                this.controller.formatPrice(
                    OSS.helpers.accounts.Data.getTariff().get('rent'),
                    OSS.helpers.accounts.Data.getTariff().get('symbol')
                )
            );
        }
    }
});

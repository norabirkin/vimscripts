/**
 * Загружает данные учетной записи, тарифа, агента и договора
 */
Ext.define('OSS.helpers.accounts.Load', {
    constructor: function(config) {
        this.initConfig(config);
    },
    config: {
        controller: null,
        /**
         * Удаляет данные об учетке тарифе, агенте и договоре
         */
        clear: function(params) {
            this.controller.mask(true);
            OSS.model.managers.Managers.load(
                Ext.app.Application.instance.getController(
                    'Viewport'
                ).getManager().person_id, {
                    success: function(record) {
                        OSS.helpers.accounts.Data.clear();
                        Ext.bind(params.onClear, params.scope)();
                        OSS.helpers.accounts.Data.setManager(record);
                        this.fillForm();
                        this.controller.mask(false);
                        Ext.bind(params.onFormFilled, params.scope)();
                    },
                    failure: function() {
                        this.controller.mask(false);
                    },
                    scope: this
                }
            );
        },
        fillingForm: false,
        /**
         * Присваивает значения элементам формы
         */
        fillForm: function() {
            this.fillingForm = true;
            this.controllRecord();
            this.fillingForm = false;
            this.controller.afterFormFill();
            this.controller.getCommon().resetOriginalValues();
            this.controller.mask(false);
        },
        /**
         * Устанавливает запись для формы <Общие>
         */
        controllRecord: function() {
            this.controller.getCommon().controllRecord(OSS.helpers.accounts.Data.getAccount(), {
                agent_id: function(field) {
                    field.setValueByRecord(OSS.helpers.accounts.Data.getAgent());
                },
                uid: function(field, record) {
                    field.setValueWithDisplay(record.get('uid'), record.get('user_name'));
                },
                agrm_id: function(field) {
                    field.setValueByRecord(OSS.helpers.accounts.Data.getAgreement());
                },
                parent_vg_id: function(field, record) {
                    field.setValueWithDisplay(
                        record.get('parent_vg_id'),
                        record.get('parent_vg_login')
                    );
                },
                connected_from: function(field, record) {
                    field.setValueWithDisplay(
                        record.get('connected_from'),
                        record.get('connected_from_name')
                    );
                },
                tar_id: function(field, record) {
                    this.controller.tariff.display();
                }
            }, this);
        },
        /**
         * Выбирает пользователя
         */
        setUser: function(uid, user_name) {
            if (uid) {
                this.controller.field('uid').setValueWithDisplay(uid, user_name);
            }
        },
        /**
         * Выбирает договор
         */
        setAgreement: function(agrm_id) {
            if (agrm_id) {
                this.controller.mask(true);
                OSS.model.Agreement.load(agrm_id, {
                    success: function(record) {
                        this.fillingForm = true;
                        OSS.helpers.accounts.Data.setAgreement(record);
                        this.controller.field('agrm_id').setValueByRecord(record);
                        this.fillingForm = false;
                        this.controller.mask(false);
                    },
                    failure: function() {
                        this.controller.mask(false);
                    },
                    scope: this
                });
            }
        },
        /**
         * Выполняется после загрузки дополнительных данных
         */
        extraLoaded: function() {
            if (
                OSS.helpers.accounts.Data.getManager() &&
                OSS.helpers.accounts.Data.getTariff() &&
                OSS.helpers.accounts.Data.getAgreement() &&
                OSS.helpers.accounts.Data.getAgent()
            ) {
                this.fillForm();
            } 
        },
        /**
         * Загружает дополнительные данные
         */
        loadExtra: function() {
            var account = OSS.helpers.accounts.Data.getAccount();
            OSS.model.managers.Managers.load(
                Ext.app.Application.instance.getController(
                    'Viewport'
                ).getManager().person_id, {
                    success: function(record) {
                        OSS.helpers.accounts.Data.setManager(record);
                        this.extraLoaded();
                    },
                    failure: function() {
                        this.controller.mask(false);
                    },
                    scope: this
                }
            );
            OSS.model.account.Agent.load(account.get('agent_id'), {
                success: function(record) {
                    OSS.helpers.accounts.Data.setAgent(record);
                    this.extraLoaded();
                },
                failure: function() {
                    this.controller.mask(false);
                },
                scope: this
            });
            OSS.model.Agreement.load(account.get('agrm_id'), {
                success: function(record) {
                    OSS.helpers.accounts.Data.setAgreement(record);
                    this.extraLoaded();
                },
                failure: function() {
                    this.controller.mask(false);
                },
                scope: this
            });
            OSS.model.account.Tariff.load(account.get('tar_id'), {
                success: function(record) {
                    OSS.helpers.accounts.Data.setTariff(record);
                    this.extraLoaded();
                },
                failure: function() {
                    this.controller.mask(false);
                },
                scope: this
            });
        },
        /**
         * Учетка загрузилась
         */
        accountLoaded: function(record) {
            OSS.helpers.accounts.Data.setAccount(record);
            this.loadExtra();
        },
        /**
         * Загрузка учетки
         */
        loadAccount: function(vg_id) {
            this.controller.mask(true);
            OSS.helpers.accounts.Data.clear();
            OSS.model.account.Full.load(vg_id, {
                success: this.accountLoaded,
                failure: function() {
                    this.controller.mask(false);
                },
                scope: this
            });
        },
        /**
         * Создает экземпляр модели учетки
         */
        initAccount: function(vg_id, params) {
            if (!params) {
                params = {
                    onClear: function() {},
                    onFormFilled: function() {},
                    scope: window
                };
            }
            if (vg_id) {
                this.loadAccount(vg_id);
            } else {
                this.clear(params);
            }
        }
    }
});

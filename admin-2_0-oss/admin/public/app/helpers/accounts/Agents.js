/**
 * Управляет видимостью полей формы <Общие> и вкладок панели создания/редактирования учетных записей в соответствии с выбранным агентом.
 */
Ext.define('OSS.helpers.accounts.Agents', {
    constructor: function(config) {
        this.initConfig(config);
    },
    config: {
        controller: null,
        params: {
            fields: {
                'accounts > #form > #common > form > #right > #options': [
                    'ethernet',
                    'radius',
                    'voip',
                    'usbox'
                ],
                'accounts > #form > #common > form > #right > #options > container > numberfield[name=max_sessions]': [
                    'ethernet',
                    'radius',
                    'voip'
                ],
                'accounts > #form > #common > form > #right > #options > #ethernet': [
                    'ethernet'
                ],
                'accounts > #form > #common > form > #right > #options > container > numberfield[name=shape]': [
                    'radius',
                    'ethernet'
                ],
                'accounts > #form > #common > form > #right > #tariff > #tar_shape': [
                    'radius',
                    'ethernet'
                ],
                'accounts > #form > #common > form > #right > #options > container > numberfield[name=cu_id]': [
                    'usbox'
                ]
            },
            tabs: {
                any: [
                    'OSS.view.accounts.item.Tariffs',
                    'OSS.view.accounts.item.Locks'
                ],
                telephony: [
                    'OSS.view.accounts.item.Telephony'
                ],
                usbox: [
                    'OSS.view.accounts.item.usbox.OneTime',
                    'OSS.view.accounts.item.usbox.Periodic'
                ],
                radius: [
                    'OSS.view.accounts.item.Networking'
                ],
                ethernet: [
                    'OSS.view.accounts.item.Networking'
                ]
            },
            actions: ['accounts > #form > panel > toolbar > #actions > #rent', 'accounts > #form > panel > toolbar > #actions > #addonsBtn']
        },
        mode: 'create',
        type: 'none',
        /**
         * Вызывается при смене агента
         */
        refresh: function() {
            this.initState();
            this.refreshFields();
            this.refreshTabs();
            this.refreshActions();
            this.rememberState();
        },
        /**
         * Устанавливает текущее состояние
         */
        initState: function() {
            this.mode = this.initMode();
            this.type = this.initType();
        },
        /**
         * Сохраняет текущее состояние
         */
        rememberState: function() {
            this.oldMode = this.mode;
            this.oldType = this.type;
        },
        /**
         * Обновление видимости полей формы <Общие>
         */
        refreshFields: function() {
            if (this.oldType != this.type) {
                Ext.Object.each(
                    this.params.fields,
                    this.changeFieldVisibility,
                    this
                );
            }
        },
        /**
         * Обновление вкладок
         */
        refreshTabs: function() {
            if (this.mode == 'create') {
                if (this.oldMode == 'update') {
                    this.removeTabs();
                }
            } else {
                if (
                    this.oldType != this.type ||
                    this.oldMode != this.mode
                ) {
                    this.removeTabs();
                    this.addTabs();
                }
            }
        },
        /**
         * Меняет доступность пунктов меню <Действия>
         */
        refreshActions: function() {
            var method = this.mode == 'update' ? 'enable' : 'disable';
            if (this.mode != this.oldMode) {
                Ext.Array.each(this.params.actions, function(item) {
                    Ext.Array.each(Ext.ComponentQuery.query(item), function(action) {
                        action[method]();
                    });
                });
            }
        },
        /**
         * Добавляет вкладки относящиеся к выбранному агенту
         */
        addTabs: function() {
            Ext.Array.each(
                this.params.tabs.any.concat(
                    this.params.tabs[this.type] || []
                ),
                function(className) {
                    this.controller.getTabs().add(Ext.create(className));
                },
                this
            );
        },
        /**
         * Удаляет все вкладки, кроме вкладки <Общие>
         */
        removeTabs: function() {
            this.controller.getTabs().items.each(function(item) {
                if (item.getItemId() != 'common') {
                    this.controller.getTabs().remove(item);
                }
            }, this);
        },
        /**
         * Изменяет видимость поля формы <Общие>, если это необходимо
         */
        changeFieldVisibility: function(query, types) {
            var field = Ext.ComponentQuery.query(query)[0];
            if (Ext.Array.contains(types, this.type)) {
                field.show();
            } else {
                field.hide();
            }
        },
        /**
         * Возвращает условный идентификатор типа агента
         */
        initType: function() {
            var agent = OSS.helpers.accounts.Data.getAgent(),
                type;
            if (agent) {
                type = agent.get('type');
                if (type < 6) {
                    return 'ethernet';
                } else if (type == 6) {
                    return 'radius';
                } else if (type == 7) {
                    return 'telephony';
                } else if (type == 12) {
                    return 'voip';
                } else if (type == 13) {
                    return 'usbox';
                } else if (type == 14) {
                    return 'snmp';
                }
            } else {
                return 'none';
            }
        },
        /**
         * Возвращает 'update', если редактируется существующая учетная запись, и возвращает 'create', если создается новая
         */
        initMode: function() {
            if (OSS.helpers.accounts.Data.getAccount().get('vg_id')) {
                return 'update';
            } else {
                return 'create';
            }
        }
    }
});

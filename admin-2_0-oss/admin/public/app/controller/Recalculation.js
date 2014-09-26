Ext.define("OSS.controller.Recalculation", {
    extend: 'Ext.app.Controller',
    views: [
        'recalculation.Grid',
        'recalculation.Filter',
        'Recalculation'
    ],
    view: 'Recalculation',
    stores: [
        'Agents',
        'recalculation.AccountsGroups',
        'recalculation.List',
        'recalculation.Agents'
    ],
    refs: [{
        selector: 'recalculation > gridpanel > toolbar > #refreshBtn',
        ref: 'refreshBtn'
    }],
    init: function() {
        this.control({
            'recalculation > gridpanel': { 
                afterrender:   this.initReloading
            },
            'recalculation > #calcForm > toolbar > #startRecals': { 
                click:         this.startRecalculation
            },
            'recalculation > #calcForm > fieldset > #recalc_stat': {
                change:        this.onChangeRecalcValue
            },
            'recalculation > #calcForm > fieldset > #stat_owner': {
                change:        this.onChangeStatOwnerValue
            },
            'recalculation > #calcForm > fieldset > combobox[name=agent_id]': {
                change: 'onAgentChange'
            }
        });
    },

    /**
     * Выполняется при смене агента
     */
    onAgentChange: function(field) {
        var form = field.up('form').getForm(),
            type = field.getRecord().get('agent_type');
        form.findField('recalc_date').enable();
        form.findField('recalc_group').enable();
        form.findField('recalc_stat').enable();
        form.findField('recalc_rent')[type == 13 ? 'disable' : 'enable']();
        if (form.findField('recalc_stat').getValue() == -1) {
            form.findField('recalc_stat').setValue(1);
        }
        this.onChangeRecalcValue(form.findField('recalc_stat'), form.findField('recalc_stat').getValue());
        if (type == 13) {
            form.findField('recalc_stat').getStore().addFilter(new Ext.util.Filter({
                id: 'norollover',
                filterFn: function(record) {
                    return record.get('id') != -1;
                }
            }));
        } else {
            form.findField('recalc_stat').getStore().removeFilter('norollover');
            form.findField('recalc_stat').getStore().load();
        }
        if (type == 13) {
            form.findField('stat_owner').disable();
            form.findField('stat_owner').setValue(false);
            form.findField('stat_tariff').disable();
            form.findField('stat_tariff').setValue(false);
        }
    },       

    initReloading: function() {

        // Обновляем список доступных агентов для перерасчёта (у которых перерасчёт ещё не выполняется)
        this.getRecalculationListStore().on('load', function (store) {
            var cc = store.getCount();
            if (!store['lastCount']) {
                store.lastCount = cc;
            }
            if (store.lastCount != cc) {
                this.getRecalculationAgentsStore().reload();
            }
            store.lastCount = cc;
        }, this);

        // Кнопка автоматической перезагрузки грида
        Ext.create('OSS.helpers.reports.Reloading', {
            button: this.getRefreshBtn(),
            callback: this.loadMainGrid,
            scope: this,
            reloadingStateParamName: 'recalc_autoload'
        }).start();

        this.loadMainGrid();
    },

    loadMainGrid: function (argument) {
        this.getRecalculationListStore().load();
    },

    startRecalculation: function (Btn) {
        var form = Btn.up('form').getForm(),
            stat = form.findField('recalc_stat').getValue(),
            rent = form.findField('recalc_rent').getValue(),
            agent = form.findField('agent_id').getValue(); 

        if (Ext.isEmpty(agent)) {
            Ext.Msg.alert(i18n.get('Error'), i18n.get('Agent is not set'));
            return;
        } 

        if (stat == 0 && rent == 0) {
            Ext.Msg.alert(i18n.get('Error'), i18n.get('Tast is not set (Statistics, Rent)'));
            return;
        } 


        form.submit({
            clientValidation: true,
            url: 'index.php/api/recalculation/start',
            msg: true,
            success: function(form, action) {  
                this.getRecalculationListStore().reload();
                form.findField('agent_id').setValue('');
            },
            failure: this.failure,
            scope: this
        });
    },

    onChangeRecalcValue: function (field, value) {
        var form = field.up('form').getForm(),
            agent = form.findField('agent_id').getRecord(),
            statOwnerCb = form.findField('stat_owner'),
            statAlert   = field.up('form').down('fieldset').items.get('stat_alert');
        if (agent && agent.get('agent_type') != 13) {
            if (1 == value) {
                statOwnerCb.enable();
                if (agent && agent.get('agent_type') == 6) {
                    statOwnerCb.setValue(true);
                }
            } else {
                statOwnerCb.disable();
                statOwnerCb.setValue(false);
            }
        }
        if (-1 == value) {
            statAlert.show();
        } else {
            statAlert.hide();
        }
    },

    onChangeStatOwnerValue: function (field, value) {
        var form = field.up('form').getForm(),
            agent = form.findField('agent_id').getRecord(),
            statTariffCb = form.findField('stat_tariff');
        if (agent && agent.get('agent_type') != 13) {
            if (!value && form.findField('recalc_stat').getValue() == 1 && agent.get('agent_type') == 6) {
                field.setValue(true);
            }
            if (true == field.getValue()) {
                statTariffCb.enable();
            } else {
                statTariffCb.disable();
                statTariffCb.setValue(false);
            }
        }
    }
});

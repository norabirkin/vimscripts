/**
 * Котнроллер для вкладки Тарифы/Категории
 */
Ext.define('OSS.controller.tariffs.Categories', {
    extend: 'OSS.controller.tariffs.Base',
    requires: [
        'OSS.helpers.tariffs.Directions'
    ],
    stores: [
        'tariffs.CategoriesList',
        'tariffs.CategoryDiscount',
        'tariffs.TimeDiscounts',
        'tariffs.discounts.Size',
        'tariffs.discounts.Type',
        'tariffs.Catalogs'
    ],
    refs: [{
        selector: 'tariffs > tariff_form #categoriesGrid',
        ref: 'grid'
    }, {
        selector: 'tariffs > tariff_form #categoryTabPanel',
        ref: 'tabs'
    }, {
        selector: 'tariffs > tariff_form #categoryDataTab',
        ref: 'form'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #discountsTab > #size > headercontainer > gridcolumn[dataIndex=amount]',
        ref: 'sizeDiscountAmountCol'
    }, {
        selector: 'tariffs > tariff_form #categoriesTab',
        ref: 'main'
    } ,{
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #common > #linkAndUuid > #uuid > button',
        ref: 'casBtn'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #categoryDataTab > #control > #wrap > #tv',
        ref: 'tvFieldSet'
    }, {
        selector: 'tariffs > tariff_form > #categoriesTab > #categoryTabPanel > #discountsTab > #size > headercontainer > gridcolumn[dataIndex=bonus]',
        ref: 'bonusCol'
    }],
    init: function() {
        this.control({
            'tariffs > tariff_form #categoriesTab': {
                activate: 'list'
            },
            'tariffs > tariff_form > #categoriesTab > toolbar > #categoriesActionsBtn > menu > #addTarCategoryBtn > menu > menuitem': {
                click: 'add'
            },
            'tariffs > tariff_form #categoriesGrid': {
                itemclick: 'edit'
            },
            'tariffs > tariff_form #saveCategoryDataBtn': {
                click: 'save'
            },
            'tariffs > tariff_form #categoriesActionsBtn > menu': {
                beforeshow: 'menu'
            },
            'tariffs > tariff_form #deleteTarCategoryBtn': {
                click: 'remove'
            }
        });
    },
    list: function() {
        this.store().addExtraParams({
            tar_id: this.tariffs().param('tar_id')
        }).load();
    },
    add: function(menuitem) {
        var record = this.getGrid().getStore().getAt(0);

        this.record = new OSS.model.tariffs.CategoriesList({
            tar_type: menuitem.value,
            oper_id: record.get('oper_id'),
            oper_name: record.get('oper_name'),
            descr: i18n.get('New category'),
            tar_id: this.tariffs().param('tar_id')
        });
        this.store().add(this.record);
        this.select(this.record);
        this.load();
    },
    edit: function() {
        var record = arguments[1],
            cat_idx = record.getId(),
            me = this,
            edit = function() {
                me.mask();
                OSS.model.tariffs.CategoriesList.load(cat_idx, {
                    scope: me,
                    callback: me.unmask,
                    success: function(record) {
                        me.record = record;
                        me.load();
                    }
                });
            };

        if (this.cat_idx !== cat_idx && this.selection().selected.length == 1) {
            if (this.record && (this.record.dirty || this.isRecordNew())) {
                Ext.Msg.confirm(
                    i18n.get('Confirmation'),
                    i18n.get('You will loose all you form data'),
                    function(btn) {
                        if (btn == 'yes') {
                            if (me.isRecordNew()) {
                                me.store().remove(me.record);
                            }
                            edit();
                        } else {
                            me.restoreSelection();
                        }
                    },
                    this
                );
            } else {
                edit();
            }
        }
    },
    save: function() {
        if (this.form().isValid()) {
            this.mask();
            this.record.save({
                msg: i18n.get('Category saved'),
                scope: this,
                failure: this.unmask,
                ok: this.onSave
            });
        }
    },
    remove: function() {
        this.mask();
        Ext.create('OSS.helpers.DeleteList', {
            panel: this.getGrid(),
            message: i18n.get('Selected entries successfully removed'),
            scope: this,
            confirmation: {
                title: i18n.get('Confirmation'),
                message: i18n.get('Do you realy want to delete this entry?')
            },
            callback: function() {
                this.record = null;
                this.getTabs().hide();
                this.unmask();
            }
        }).run();
    },
    load: function() {
        this.cat_idx = this.param('cat_idx');
        this.getForm().controllRecord(this.record);
        this.onLoadOrSave();
        this.symbol();
        this.amountCol();
        this.checkDtvAgentsExists();
        this.catalogType();
        this.getTabs().show();
        this.readOnly([
            'dis_prior',
            'free_seconds',
            'includes',
            'min_charge_dur',
            'round_seconds',
            'cat_idx_master',
            'common',
            'above',
            'perm_above',
            'adm_block_above',
            'usr_block_above'
        ], function() {
            return this.param('usbox_count');
        });
    },
    setup: function() {
        if (
            this.tar_type !== this.param('tar_type') ||
            this.isNew !== this.isRecordNew()
        ) {
            this.tar_type = this.param('tar_type');
            this.isNew = this.isRecordNew();

            Ext.Array.each(
                this.typeRelated(),
                function(item) {
                    var state = Ext.Array.contains(
                        item.tartypes,
                        this.param('tar_type')
                    );
                    if (item.isField || item.isXType('menuitem')) {
                        item.setDisabled(!state);
                    } else if (item.tab && item.tab.isTab) {
                        item = item.tab;
                        if (this.isRecordNew()) {
                            state = false;
                        }
                    }
                    item.setVisible(state);
                },
                this
            );
        }
    },
    onActivateConfig: function() {
        var load, directions, me = this;

        load = function(stores) {
            return function() {
                var i;

                for (i = 0; i < stores.length; i++) {
                    stores[i].setExtraParams({
                        tar_id: me.param('tar_id'),
                        cat_idx: me.param('cat_idx')
                    }).load();
                }
            };
        };

        directions = function(params) {
            return function(tab) {
                Ext.create('OSS.helpers.tariffs.Directions', Ext.apply(params, {
                    panel: me.getTabs().child('#'+tab)
                })).load();
            };
        };

        return {
            panel: this.getTabs(),
            items: {
                discountsTab2: load([
                    this.getTariffsCategoryDiscountStore()
                ]),
                discountsTab: load([
                    this.getTariffsTimeDiscountsStore(),
                    this.getTariffsDiscountsSizeStore()
                ]),
                directionsTab: directions({
                    catalog_type: 1
                }),
                directionsOutTab: directions({
                    catalog_type: 3,
                    loadClasses: true,
                    params: {
                        direction: 2
                    }
                }),
                directionsIncTab: directions({
                    catalog_type: 3,
                    loadClasses: true,
                    params: {
                        direction: 1
                    }
                })
            }
        };
    },
    symbol: function() {
        var symbol = this.tariffs().field('cur_id').getRecord().get('symbol');

        this.getBonusCol().setText(i18n.get('Bonus')+' ('+symbol+')');
        this.getTariffsDiscountsTypeStore().getAt(0).set('name', symbol);
    },
    amountCol: function() {
        this.getSizeDiscountAmountCol().setText(
            i18n.get('Size') + ' ' + (
                this.param('tar_type') > 1 && this.param('tar_type') < 5 ?
                '(Min)' : 
                '(Mb)'
            )
        );
    },
    catalogType: function() {
        this.getTariffsCatalogsStore().setExtraParams({
            type: this.param('tar_type') < 3 ? 1 : 3
        });
    },
    checkDtvAgentsExists: function() {
        var callback, me = this;

        callback = function() {
            var state =
                me.isDtvAgentExists &&
                me.param('tar_type') == 5;

            me.getCasBtn().setVisible(state);
            me.getTvFieldSet().setVisible(state);
        };

        if (this.isDtvAgentExists === null) {
            Ext.Ajax.request({
                url: 'index.php/api/agents/dtv',
                success: function(response) {
                    this.isDtvAgentExists = response.JSONResults;
                    callback();
                },
                scope: this
            });
        } else {
            callback();
        }
    },
    isDtvAgentExists: null,
    onLoadOrSave: function() {
        this.setup();
        this.getForm().resetOriginalValues();
        this.onActivate().load();
    },
    onSave: function() {
        var id = arguments[1];

        this.record.setId(id);
        this.onLoadOrSave();
        this.unmask();
        this.store().load({
            force: true
        });
        OSS.component.StoreValidity.setInvalid('categories');
    },
    restoreSelection: function() {
        var i, record;

        if (this.record) {
            if (this.isRecordNew()) {
                record = this.record;
            } else {
                i = this.store().findExact(
                    'cat_idx',
                    this.param('cat_idx')
                );
                if (i != -1) {
                    record = this.store().getAt(i);
                }
            }
            if (record) {
                this.select(record);
            }
        }
    },
    typeRelated: function() {
        if (!this.components) {
            this.components = this.getMain().query('component[tartypes]');
        }
        return this.components;
    },
    menu: function(menu) {
        var selected = this.getGrid().getSelectionModel().hasSelection(),
            setDisabled = function(id) {
                menu.items.get(id).setDisabled(!selected);
            };

        setDisabled('deleteTarCategoryBtn');
        setDisabled('saveCategoryDataBtn');
    },
    isRecordNew: function() {
        return !this.record.hasId();
    },
    select: function(record) {
        this.selection().select([record]);
    },
    selection: function() {
        return this.getGrid().getSelectionModel();
    },
    tariffs: function() {
        return this.getController('Tariffs');
    },
    store: function() {
        return this.getTariffsCategoriesListStore();
    },
    getMaskTarget: function() {
        return this.getMain();
    },


    addUsboxDiscount: function(Btn) {
        var grid = Btn.up('grid'),
            store = grid.getStore(),
            node = new store.model();
            
        store.add( node );
        var row = grid.getView().getNode( node ),
        column = Ext.get( row ).child("td:nth-child(2)");
        
        column.fireEvent("dblclick");  
    },
    saveUsboxDiscountEntry: function(editor, context) {
        var params = context.newValues;

        params.tar_id = context.store.proxy.extraParams.tar_id;
        params.cat_idx = context.store.proxy.extraParams.cat_idx;
        params.object = this.getUsboxDiscountsToolbar().items.get('object').getValue();
        params.record_id = context.record.data.record_id;
            
        Ext.Ajax.request({
            url: 'index.php/api/Tariffs/setCategoryDiscount',
            method: 'POST',
            params: params,
            scope: this,
            success: function() {
                var response = Ext.JSON.decode(arguments[0].responseText);
                if (!response.success) {
                    return;
                }               
                var data = response.results;
                context.grid.getStore().reload();
            }
        });
    },
    deleteUsboxDiscount: function(grid, rowIdx, colIdx, item, event, record) {
        Ext.Msg.confirm(
            i18n.get( "Confirmation" ),
            i18n.get( "Do you realy want to delete this entry?" ),
            function( button ) {
                if (button != "yes") {
                    return;
                }

                Ext.Ajax.request({
                    url: 'index.php/api/Tariffs/deleteUsboxDiscount',
                    method: 'POST',
                    scope: this,
                    params: record.data,
                    msg: i18n.get('Selected entry successfully removed'),
                    success: function() {
                        var response = Ext.JSON.decode(
                            arguments[0].responseText
                        );
                        if (!response.success) {
                            return;
                        }
                        grid.getStore().reload();
                    }
                });
                
                
            },
            this
        );
    }
});

Ext.define('OSS.view.tariffs.TariffsList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tariffs_list',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            columns: [
                {
                    xtype: 'actioncolumn',
                    iconCls: 'x-ibtn-edit',
                    itemId: 'editTariffBtn',
                    tooltip: i18n.get('Edit tariff'),
                    width: 25
                },
                {
                    dataIndex: 'tar_id',
                    width: 110,
                    text: 'ID'
                },
                {
                    dataIndex: 'descr',
                    flex: 1,
                    text: 'Описание'
                },
                {
                    width: 200,
                    dataIndex: 'daily_rent',
                    text: 'Периодичность списания',
                    renderer: function(value, meta, record, rowIdx) {
                        if(record.get('daily_rent') == 0 && record.get('rent') == 0) {
                            return '-';
                        }
                        return value;
                    }
                },
                {
                    dataIndex: 'rent',
                    width: 150,
                    text: 'Аренда',
                    renderer: function(value, meta, record, rowIdx) {
                        if(record.get('daily_rent') == 0 && record.get('rent') == 0) {
                            return '-';
                        } else {
                            return value + ' (' + record.get('symbol') + ')';
                        }
                        return value;
                    }
                },
                {
                    dataIndex: 'ext_vg_count',
                    text: 'Учетные записи'
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'deleteTariffBtn',
                    iconCls: 'x-ibtn-delete',
                    tooltip: i18n.get('Delete tariff'),
                    width: 25
                }
            ],
            store: 'tariffs.TariffsList',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'splitbutton',
                            text: i18n.get('Actions'),
                            itemId: 'tariffListActionsBtn',
                            handler: function(Btn) {
                                Btn.showMenu();
                            },
                            menu: {
                                items: [{
                                    iconCls: 'x-ibtn-add',
                                    itemId: 'addTariffBtn',
                                    text: 'Добавить'
                                },
                                {
                                    iconCls: 'x-ibtn-calendar',
                                    itemId: 'holydayCalendarBtn',
                                    text: i18n.get('Calendar of holidays')
                                },
                                {
                                    iconCls: 'x-ibtn-copy',
                                    disabled: true,
                                    itemId: 'copyTariffBtn',
                                    text: i18n.get('Копировать тариф')
                                }]
                            }
                        }, '-',
                        {
                            xtype: 'combobox',
                            width: 180,
                            hideLabel: true,
                            itemId: 'tariffTypeField',
                            hiddenName: 'tar_type',
                            valueField: 'id',
                            displayField: 'name',
                            triggerAction: 'all',
                            mode: 'local',
                            store: 'tariffs.TariffTypes'
                        },
                        {
                            xtype: 'searchtext',
                            itemId: 'searchField',
                            width: 200,
                            parentContainerType: 'toolbar',
                            searchButton: 'searchTariffs',
                            hideLabel: true
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-ibtn-search',
                            itemId: 'searchTariffs',
                            text: 'Показать'
                        }
                    ]
                },
                {
                    xtype: 'pagingtoolbar',
                    displayInfo: true,
                    dock: 'bottom',
                    store: 'tariffs.TariffsList'
                }
            ]
        });

        me.callParent(arguments);
    }

});

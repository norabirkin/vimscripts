/**
 * Вкладка истории тарифов
 *
 * ref: 'accounts > #form > #tariffs'
 */
Ext.define('OSS.view.accounts.item.Tariffs', {
    extend: 'OSS.ux.grid.editor.Window',
    itemId: 'tariffs',
    title: i18n.get('Tariffs'),
    toolbarClassName: 'OSS.view.accounts.item.Toolbar',
    initComponent: function() {
        this.store = Ext.create('OSS.store.accounts.tariffs.History');
        this.winConfig = {
            title: {
                create: i18n.get('Schedule tariff'),
                update: i18n.get('Edit multitariff')
            },
            editForm: [Ext.create('OSS.view.accounts.item.common.right.tariff.Combogrid', {
                labelWidth: 95,
                store: Ext.app.Application.instance.getController('OSS.controller.accounts.Item').tariff.fetchStore(),
                loadOnRender: false,
                name: 'tar_id_new'
            }), {
                xtype:'datetime',
                fieldLabel: i18n.get('Date') + ' (' + i18n.get('Since') + ')',
                labelWidth: 95,
                defaultDate: function() {
                    return Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d 00:00:00'), 'Y-m-d 00:00:00');
                },
                name: 'change_time'
            }, {
                xtype:'datetime',
                fieldLabel: i18n.get('Date') + ' (' + i18n.get('Till') + ')',
                labelWidth: 95,
                name: 'time_to',
                defaultDate: function() {
                    return null;
                }
            }, {
                xtype: 'numberfield',
                fieldLabel: i18n.get('Coefficient'),
                labelWidth: 95,
                name: 'rate',
                value: 1
            }]
        };
        this.columns = [{
            header: i18n.get('Tarif'),
            dataIndex: 'tar_new_name',
            flex: 1
        }, {
            header: i18n.get('Previous tariff'),
            dataIndex: 'tar_old_name'
        }, {
            header: i18n.get('Scheduled on'),
            dataIndex: 'rasp_time',
            xtype: 'datecolumn',
            width: 125,
            format: 'Y-m-d H:i:s'
        }, {
            header: i18n.get('Changed'),
            dataIndex: 'change_time',
            xtype: 'datecolumn',
            width: 125,
            format: 'Y-m-d H:i:s'
        }, {
            header: i18n.get('Assigned by'),
            dataIndex: 'mgr_name'
        }];
        this.bbar = {
            xtype: 'pagingtoolbar',
            store: this.store
        };
        this.callParent(arguments);
    },
    editAvailable: function(record) {
        return record.get('is_multi');
    }
});

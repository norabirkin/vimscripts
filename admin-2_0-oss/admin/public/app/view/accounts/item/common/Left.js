/**
 * Левая часть вкладки <Общие> панели создания/редактирования учетных записей
 *
 * ref: 'accounts > #form > #common > form > #left'
 */
Ext.define('OSS.view.accounts.item.common.Left', {
    extend: 'Ext.container.Container',
    itemId: 'left',
    initComponent: function() {
        var labelWidth = 120;
        this.items = [{
            xtype: 'fieldset',
            width: 650,
            defaultBackground: true,
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'combo',
                name: 'agent_id',
                allowBlank: false,
                fieldLabel: i18n.get('Module'),
                editable: false,
                labelWidth: labelWidth,
                displayField: 'name',
                valueField: 'id',
                store: Ext.create('OSS.store.statistics.Agents')
            }, {
                xtype: 'fieldcontainer',
                itemId: 'user',
                labelWidth: labelWidth,
                layout: 'hbox',
                fieldLabel: i18n.get('User'),
                items: [Ext.create('OSS.view.users.Combogrid', {
                    flex: 1,
                    allowBlank: false
                }), {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    disabled: true,
                    itemId: 'details',
                    iconCls: 'x-ibtn-info',
                    tooltip: i18n.get('Go to view user data')
                }]
            }, Ext.create('OSS.view.accounts.item.common.left.Agreements', {
                name: 'agrm_id',
                allowBlank: false,
                labelWidth: labelWidth,
                readOnly: true,
                storeClassName: function() {
                    return 'OSS.store.accounts.Agreements';
                },
                loadOnRender: false
            }), {
                xtype: 'textfield',
                allowBlank: false,
                labelWidth: labelWidth,
                fieldLabel: i18n.get('Login'),
                name: 'login'
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                itemId: 'password',
                fieldLabel: i18n.get('Password'),
                labelWidth: labelWidth,
                items: [Ext.create('OSS.ux.form.field.Password', {
                    patternSetting: 'acc_pass_symb'
                }), {
                    xtype: 'tbspacer',
                    width: 5
                }, {
                    xtype: 'button',
                    itemId: 'generatePwdBtn',
                    disabled: true,
                    iconCls: 'x-ibtn-key',
                    tooltip: i18n.get('Generate')
                }]
            }, Ext.create('OSS.view.addresses.Button', {
                labelWidth: labelWidth
            }), {
                fieldLabel: i18n.get('Description'),
                xtype: 'textarea',
                name: 'descr',
                height: 150,
                labelWidth: labelWidth
            }, Ext.create('OSS.view.accounts.item.common.left.Parent', {
                fieldLabel: i18n.get('Parent account'),
                loadOnRender: false,
                licid: 'full',
                name: 'parent_vg_id',
                readOnly: true,
                labelWidth: labelWidth
            }), Ext.create('OSS.view.users.Combogrid', {
                fieldLabel: i18n.get('Connected from'),
                name: 'connected_from',
                loadOnRender: false,
                labelWidth: labelWidth
            })]
        }];
        this.callParent(arguments);
    }
});

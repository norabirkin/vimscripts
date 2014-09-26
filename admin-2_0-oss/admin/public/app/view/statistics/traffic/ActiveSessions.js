Ext.define('OSS.view.statistics.traffic.ActiveSessions', {
    extend: 'Ext.Window',
    width: 1000,
    initComponent: function() {
        var store = Ext.create('OSS.store.Statistics'),

            controller =
            Ext.app.
                Application.
                instance.
                getController('Statistics'),

            gridStateNotSaved =
            Ext.create('Ext.state.CookieProvider').
                get('activeSessions') ? false : true,
            
            VoIPAgentSelected = controller.isVoIPAgentSelected();

        store.proxy.extraParams = {
            repnum: 8,
            agentid: controller.getAgent().getValue()
        };
        store.load();

        this.items = [{
            xtype: 'gridpanel',
            store: store,
            stateful: true,
            stateId: 'activeSessions',
            height: 500,
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.get('Stop'),
                    handler: function() {
                        controller.stopSessions();
                    }
                }
            ],
            columns: [
                {
                    header: i18n.get('Begining'),
                    dataIndex: 'start_time',
                    flex: 1
                },
                {
                    header: i18n.get('Session ID'),
                    dataIndex: 'session_id'
                },
                {
                    header: i18n.get('User'),
                    dataIndex: 'user_name'
                },
                {
                    header: i18n.get('Account'),
                    dataIndex: 'vg_login'
                },
                {
                    header: i18n.get('Refreshing'),
                    dataIndex: 'updatetime',
                    hidden: gridStateNotSaved
                },
                {
                    header: i18n.get('Direct'),
                    dataIndex: 'direction',
                    hidden: gridStateNotSaved
                },
                {
                    header: i18n.get('Number') + ' A',
                    dataIndex: 'sess_ani',
                    hidden: gridStateNotSaved
                },
                {
                    header: i18n.get('Number') + ' B',
                    dataIndex: 'sess_dnis',
                    hidden: gridStateNotSaved
                },
                {
                    header: i18n.get('Assigned IP'),
                    dataIndex: 'assigned_ip',
                    hidden: VoIPAgentSelected
                },
                {
                    header: 'MAC-' + i18n.get('address'),
                    dataIndex: 'sess_ani',
                    hidden: VoIPAgentSelected
                },
                {
                    header: 'IP NAS',
                    dataIndex: 'nas'
                },
                {
                    header: i18n.get('Shape'),
                    dataIndex: 'shape',
                    hidden: VoIPAgentSelected
                },
                {
                    header: i18n.get('VLAN'),
                    dataIndex: 'outer_vlan',
                    hidden: VoIPAgentSelected
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store
            }
        }];
        this.callParent( arguments );
    }
});

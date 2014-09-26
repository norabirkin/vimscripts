Ext.define( 'OSS.view.history.Tabs', {
    extend: 'Ext.tab.Panel',
    itemId: 'tabs',
    disabled: true,
    layout: 'fit',
    height: 500,
    border: false,
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.history.tabs.Rent'),
            Ext.create('OSS.view.history.tabs.Balance'),
            Ext.create('OSS.view.history.tabs.Locks'),
            Ext.create('OSS.view.history.tabs.Services'),
            Ext.create('OSS.view.history.tabs.Discounts'),
            {
                title: OSS.Localize.get('Repayment installments'),
                disabled: true,
                xtype: 'grid',
                columns: [
                    {
                        header: OSS.Localize.get('Installment plan'),
                        dataIndex: 'planname'
                    }, 
                    {
                        header: OSS.Localize.get('Service'),
                        dataIndex: 'servname'
                    }, 
                    {
                        header: OSS.Localize.get('Periodical payment'),
                        dataIndex: 'amount'
                    }, 
                    {
                        header: OSS.Localize.get('Pay date'),
                        dataIndex: 'dt'
                    }
                ],
                store: Ext.create( 'Ext.data.Store', {
                    fields: [
                        { name: 'planid', type: 'string' }, 
                        { name: 'servid', type: 'string' }, 
                        { name: 'amount', type: 'string' }, 
                        { name: 'dt', type: 'string' }, 
                        { name: 'processedtime', type: 'string' }, 
                        { name: 'planname', type: 'string' }, 
                        { name: 'servname', type: 'string' }
                    ],
                    data: [{
                        servname: 'servname-001',
                        planname: 'planname-001',
                        processedtime: 'processedtime-001',
                        dt: 'dt-001',
                        amount: 'amount-001',
                        servid: 'servid-001',
                        planid: 'planid-001'
                    }]
                })
            }
        ];
        this.callParent( arguments );
    }
});


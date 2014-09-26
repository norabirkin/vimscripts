Ext.define('OSS.view.users.block.Agreements', {
    extend: 'Ext.Window',
    alias: 'widget.users_block_agreements',
    initComponent: function() {
        this.items = [Ext.create('OSS.view.Agreements', { 
            padding: '10 10 10 10',
            store: Ext.app.Application.instance.getController('Users').getAgreementsStore()
        })];
        this.callParent( arguments );
    }
});

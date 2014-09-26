Ext.define('OSS.ux.form.field.combogrid.grid.PagingBar', {
    extend: 'Ext.toolbar.Paging',
    showLimitCombo: false,
    displayInfo: false,
    getPagingItems: function() {
        var items = this.callParent(arguments),
            me = this,
            hide = [
                'first',
                'inputItem',
                'afterTextItem',
                'last',
                'refresh'
            ],
            i,
            data = ['->'];

        for (i = 0; i < items.length; i++) {
            if (typeof items[i] == 'object') {
                if (Ext.Array.contains(hide, items[i].itemId)) {
                    items[i].hidden = true;
                }
                data.push(items[i]);
                if (items[i].itemId == 'prev') {
                    data.push({
                        xtype: 'tbtext',
                        itemId: 'displayItem'
                    });
                    items[i].text = '&lt;';
                }
                if (items[i].itemId == 'next') {
                    items[i].text = '&gt;';
                }
                if (items[i].itemId == 'next' || items[i].itemId == 'prev') {
                    items[i].border = false;
                    items[i].overCls = '';
                    items[i].iconCls = '';
                }
            }
        }
        return data;
    },
    initComponent: function() {
        this.displayMsg = i18n.get('{0} - {1} of {2}');
        this.callParent(arguments);
    }
});

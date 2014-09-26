/**
 * Всплывающее сообщение вверху окна
 */
Ext.define('OSS.ux.HeadMsg', {
    extend: 'Ext.Component',
    singleton: true,
    tpl: [
        '<div class="msg">',
            '<div class="x-box-tl">',
                '<div class="x-box-tr">',
                    '<div class="x-box-tc"></div>',
                '</div>',
            '</div>',
            '<div class="x-box-ml">',
                '<div class="x-box-mr">',
                    '<div class="x-box-mc">',
                        '<tpl if="title">',
                            '<h3>{title}</h3>',
                        '</tpl>',
                        '{message}',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="x-box-bl">',
                '<div class="x-box-br">',
                    '<div class="x-box-bc"></div>',
                '</div>',
            '</div>',
        '</div>'
    ],
    initComponent: function() {
        if (!this.msgBody) {
            Ext.onReady(function() {
                this.msgBody = Ext.DomHelper.insertFirst(
                    document.body,
                    {
                        id:'port-head-message'
                    },
                    true
                );
            }, this);
        }
        this.callParent(arguments);
    },
    show: function(message, title, animateTarget, callback, scope) {
        if (!this.msgBody) {
            return;
        }
        if (!this.rendered) {
            this.render(this.msgBody);
        }
        this.tpl.overwrite(this.getEl(), {
            title: title,
            message: message
        });
        this.callParent([animateTarget, callback, scope]);
        this.getEl().slideIn();
        this.getEl().ghost('t', {
            delay: 1000
        });
    }
});

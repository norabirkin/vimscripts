/**
 * Adds functions with predefined configs
 */
Ext.define('OSS.overrides.MessageBox', function() {
    return {
        override: 'Ext.window.MessageBox',
        
        getMaskCls: function() {
            return this.maskCls;
        },

        setMaskCls: function(value) {
            this.maskCls = value;
        },

        onShow: function() {
            this.callParent(arguments);
            this.center();
            
            // This will fix trace information block
            if (!Ext.isEmpty(Ext.query('div.x-msg-trace')) && !Ext.isEmpty(Ext.query('div.x-msg-error'))) {
                var error = Ext.get(Ext.query('div.x-msg-error')),
                    trace = Ext.get(Ext.query('div.x-msg-trace'));
                
                if (trace.first().getHeight() + error.first().getHeight() > this.body.getHeight()) {
                   trace.first().setHeight(this.body.getHeight() - error.first().getHeight());
                }
            }
        },
        
        showInfo: function(config) {
            Ext.Msg.show(Ext.apply({
                autoScroll: true,
                title: 'Info',
                msg: '',
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
            }, config || {}));
        },
                
        showError: function(cfg) {
            if (Ext.isObject(cfg.msg)) {
                if (cfg.msg.tpl) {
                    if (Ext.isArray(cfg.msg.tpl) || Ext.isString(cfg.msg.tpl)) {
                        cfg.msg = new Ext.XTemplate(Ext.isArray(cfg.msg.tpl) ? cfg.msg.tpl.join('') : cfg.msg.tpl).apply(cfg.msg.data || {});
                    } else if (cfg.msg.tpl.isTemplate) {
                        cfg.msg = cfg.msg.tpl.apply(cfg.msg.data || {});
                    }
                } else if (cfg.msg.error) {
                    cfg.msg = new Ext.XTemplate(
                        '<div class="x-msg-error">',
                        '<tpl if="code">{[i18n.get("Error code")]}: {code}<br/></tpl>',
                        '<tpl if="type">{[i18n.get("Error type")]}: {type}<br/></tpl>',
                        '{[i18n.get("Message")]}: <tpl if="message">{[Ext.String.htmlEncode(values.message)]}</tpl><tpl if="!values.message">Unknown error</tpl><br>',
                        '</div>',
                        '<tpl if="traces">',
                            '<div class="x-msg-trace">',
                            '<div>',
                                '<tpl if="file">File: {file}<br/></tpl>',
                                '<tpl if="line">Line: {line}<br/></tpl>',
                            '</div>',
                            '<tpl for="traces">',
                                '({line}) {file}: <div class="x-msg-trace-detail">',
                                    '<tpl if="type == \'-&gt;\'">{class}-&gt;{function}()</tpl>',
                                    '<tpl if="args && args.length &gt; 0"><div><b>Arguments:</b> {[ Ext.encode(values.args) ]}</div></tpl>',
                                '</div>',
                            '</tpl></div>',
                        '</tpl>'
                    ).apply(cfg.msg.error);
                }
            }
            
            Ext.Msg.show(Ext.apply({
                autoScroll: true,
                title: 'Error',
                msg: '',
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            }, cfg || {}));
        }
    };
}());

Ext.define('OSS.view.viewport.Header', {
    extend: 'Ext.Panel',
    alias: 'widget.ossheader',
    height: 51,
    ui: 'oss-header',
    layout: 'hbox',
    bodyStyle: {
        padding: 0
    },
    defaults: {
        xtype: 'component',
        border: false,
        height: 51
    },
    items: [{
        autoEl: {
            tag: 'img',
            src: Ext.BLANK_IMAGE_URL
        },
        width: 144,
        height: 39,
        cls: 'x-panel-oss-header-logo'
    }, {
        autoEl: {
            tag: 'img',
            src: Ext.BLANK_IMAGE_URL
        },
        cls: 'x-panel-oss-header-fill',
        flex: 1
    }, {
        autoEl: {
            tag: 'img',
            src: Ext.BLANK_IMAGE_URL
        },
        width: 4,        
        cls: 'x-panel-oss-header-spacer'
    }, {
        xtype: 'container',
        cls: 'x-panel-oss-header-info',
        itemId: 'info',
        width: 250,
        defaults: {
            xtype: 'container',
            border: false,
            style: {
                margin: '4px 0 3px 0'
            }
        },
        items: [{
            layout: 'hbox',
            itemId: 'manager',
            defaults: {
                xtype: 'component',
                border: false
            },
            items: [{
                autoEl: {
                    tag: 'img',
                    src: Ext.BLANK_IMAGE_URL
                },
                width: 23,
                height: 18,
                cls: 'x-ibtn-gray-man'
            }, {
                cls: 'x-panel-oss-header-info-msg',
                itemId: 'name',
                tpl: '{manager}',
                data: {
                    manager: ''
                }
            }]
        }, {
            layout: 'hbox',
            defaults: {
                xtype: 'component',
                border: false
            },
            items: [{
                autoEl: {
                    tag: 'img',
                    src: Ext.BLANK_IMAGE_URL
                },
                itemId: 'lang-img',
                width: 23,
                height: 18
            }, {
                xtype: 'combo',
                itemId: 'lang-control',
                flex: 1,
                hideTrigger: true,
                valueField: 'id',
                displayField: 'name',
                editable: false,
                triggerAction: 'all',
                value: 'ru',
                cls: 'x-field-body-hide',
                store: 'Languages'
            }]
        }]
    }]
});

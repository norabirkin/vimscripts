Ext.define('OSS.view.viewport.Footer', {
    extend: 'Ext.Panel',
    alias: 'widget.ossfooter',
    height: 60,
    ui: 'oss-footer',
    layout: 'hbox',
    style: {
        padding: '0 2px 0 2px' 
    },
    bodyStyle: {
        padding: '10px 0 0 0'
    },
    defaults: {
        xtype: 'component',
        border: false
    },
    items: [{
        autoEl: {
            tag: 'img',
            src: Ext.BLANK_IMAGE_URL
        },
        cls: 'x-panel-oss-footer-logo'
    }, {
        tpl: '© ' + OSS.Localize.get( 'Network Solutions' ) + ', 2011-{date}</br><a href="http://www.lanbilling.ru">' + OSS.Localize.get( 'All rights reserved' ) + '</a>',
        data: {
            date: new Date().getFullYear()
        },
        cls: 'x-panel-oss-footer-copyright'
    }]
});

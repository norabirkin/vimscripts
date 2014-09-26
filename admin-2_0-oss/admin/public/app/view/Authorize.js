Ext.define('OSS.view.Authorize', {
    extend: 'Ext.Window',
    alias: 'widget.authorize',
    autoShow: true,

    width: 390,
    
    closable: false,
    draggable: false,
    resizable: false,
    shadow: false,
    
    constrain: true,
    modal: true,
    
    
    cls: 'x-window-authorize-bg',
    style: {
        borderStyle: 'none'
    },
    ui: 'authorize',
   
    items: [{
        xtype: 'form',
        url: 'index.php',
        monitorValid: true,
        width: 240,
        height: 170,
        
        fieldDefaults: {
            labelWidth: 60,
            labelClsExtra: 'x-authorize-label'
        },
        
        style: {
           margin: '30px auto' 
        },
        
        bodyStyle: {
            border: 0,
            background: 'transparent'
        },
        
        buttonAlign: 'center',
        
        defaults: {
            anchor: '100%'
        },
        
        buttons: [{
            ui: 'oss-authorize',
            cls: "x-button-authorize-bg",
            width: 109,
            height: 32,
            border: false,
            scale: 'small',
            iconCls: 'x-button-authorize-icon-dummy',
            text: OSS.Localize.get( 'Enter' ),
            itemId: 'authorize'
        }],
        items: [{
            xtype: 'container',
            height: 20,
            itemId: 'autherrormsg',
            style: {
                color: 'red'
            },
            tpl: '{message}',
            data: { message: '' }
        }, {
            fieldLabel: OSS.Localize.get( 'Login' ),
            xtype: 'textfield',
            allowBlank: false,
            name: 'login'
        }, {
            fieldLabel: OSS.Localize.get( 'Password' ),
            xtype: 'textfield',
            name: 'password',
            inputType: 'password'
        }]
    }]
});

/**
 * Addes Help button to the fieldLabel
 */
Ext.define('OSS.ux.form.plugin.QtipButton', {
    requires: [
        'Ext.AbstractPlugin',
        'Ext.tip.ToolTip'
    ],
    
    mixins: {
        plugin: 'Ext.AbstractPlugin'
    },
    
    // Constructor
    constructor: function (config) {
        // The Observable constructor copies all of the properties of `config` on
        // to `this` using Ext.apply. Further, the `listeners` property is
        // processed to add listeners.
        this.mixins.plugin.constructor.call(this, config);
    },
    
    fieldLabel: null,
    
    field: null,
    
    init: function(field) {
        this.field = field;
        
        this.fieldLabel = field.fieldLabel;
        
        this.fieldId = field.getId();
        
        if(/(field|box)$/i.test(field.getXType())) {
            Ext.apply(field, {
                afterRender: Ext.Function.createSequence(field.afterRender, this.afterRender, this),
                onDestroy: Ext.Function.createSequence(field.destroy, this.onDestroy, this)
            });
        }
    },
    
    
    afterRender: function(ct, position) {
        var node = Ext.DomQuery.select('*[id=' + this.fieldId + '-labelEl]');
        
        if(node) {
            Ext.DomHelper.append(node[0], {
                tag: 'div',
                cls: 'x-field-plugin-help x-ibtn-help',
                id: this.fieldId + '-help',
                children: [{
                    tag: 'img',
                    src: Ext.BLANK_IMAGE_URL
                }]
            });
            
            Ext.applyIf(this.initialConfig, {
                autoHide: true
            });
            
            Ext.apply(this.initialConfig, {
                target: this.fieldId + '-help'
            });
            
            Ext.create('Ext.tip.ToolTip', this.initialConfig);
        }
    },
    
    onDestroy: function() {
        var node = Ext.DomQuery.select('*[id=' + this.fieldId + '-help]');
        
        if(node){
            Ext.removeNode(node);
        }
    }
});
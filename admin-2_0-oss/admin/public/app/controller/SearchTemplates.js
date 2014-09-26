Ext.define( 'OSS.controller.SearchTemplates', {
    extend: 'Ext.app.Controller',
    views: [
        'SearchTemplates',
        'users.searchtemplate.Grid'
    ],
    stores: [
        'searchtemplates.Grid',
        'users.searchtemplates.Parameters',
        'users.searchtemplates.Conditions',
        'users.searchtemplates.Logic',
        'users.searchtemplates.AccountsAddons',
        'users.searchtemplates.Types',
        'users.searchtemplates.Deptors',
        'users.searchtemplates.Modules',
        'users.searchtemplates.Blocking',
        'users.searchtemplates.Tariffs',
        'users.searchtemplates.Archive',
        'users.searchtemplates.Currencies',
        'users.searchtemplates.Operators',
        'users.searchtemplates.AgrmGroups'
    ],
    refs: [{
        selector: 'searchtemplates > gridpanel',
        ref: 'grid'
    }, {
        selector: 'searchtemplates > gridpanel > toolbar > textfield[name=tpl_name]',
        ref: 'templateNameField'
    }],
    init: function() {
        this.control({
            'searchtemplates > gridpanel > toolbar > #actions > menu > #apply': {
                click: this.applyTemplate
            },
            'searchtemplates > gridpanel > toolbar > #actions > menu > #save': {
                click: this.saveTemplate
            }
        });
    },
    saveTemplate: function() {
        var tpl = this.getGrid().getConditionsArray();
        Ext.Ajax.request({
            url: "index.php/api/searchtemplates",
            params:  { tpl_name: this.getTemplateNameField().getValue(), rules: Ext.JSON.encode(tpl) },
            method: 'POST',
            scope: this,
            success: function() {
                this.combo.getStore().load({
                    callback: this.applyTemplate,
                    scope: this
                });
            }
        });
    },
    applyTemplate: function() {
        this.combo.addConditions( this.getTemplateNameField().getValue(), this.getGrid().getConditionsArray() );
        if (this.combo.up('container').down('checkbox')) {
            this.combo.up('container').down('checkbox').setValue(true);
        }
        this.combo.setValue( this.getTemplateNameField().getValue() );
        this.getMainPanel().hide();
        this.search();
    },
    getMainPanel: function() {
        if (!this.mainPanel) {
            this.mainPanel = Ext.create('OSS.view.SearchTemplates', {
                combo: this.combo
            });
        }
        return this.mainPanel;
    },
    openWindow: function( params ) {
        var name;
        this.combo = params.templatesCombo;
        this.search = params.searchFunction;
        this.getMainPanel().show();
        if (this.combo.getValue() && this.combo.getValue() != '') {
            name = this.combo.getValue();
        } else {
            name = OSS.Localize.get( 'Search template' );
        }
        this.getTemplateNameField().setValue( name );
    }
});

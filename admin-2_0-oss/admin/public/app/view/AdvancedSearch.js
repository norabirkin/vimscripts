Ext.define( 'OSS.view.AdvancedSearch', {
    extend: 'Ext.container.Container',
    alias: 'widget.advsearch',
    layout: 'hbox',
    initComponent: function() {
        this.getComboBox().getStore().load();
        this.items = this.getItems();
        this.callParent( arguments );
    },
    getSearchFunction: function() {
        if (!this.search) {
            this.search = function() {};
        }
        if (!this.scope) {
            this.scope = {};
        }
        return Ext.bind(this.search, this.scope);
    },
    getCheckBoxConfig: function() {
        return {};
    },
    getComboBoxConfig: function() {
        return {};
    },
    getCheckBox: function() {
        if (!this.checkbox) {
            this.checkbox = Ext.create('Ext.form.field.Checkbox', Ext.apply({
                name: 'use_search_template',
                fieldLabel: OSS.Localize.get('Advanced search'),
                labelWidth: 'auto',
                padding: '0 10 0 0'
            }, this.getCheckBoxConfig()));
        }
        return this.checkbox;
    },
    getComboBox: function() {
        if (!this.combobox) {
            this.combobox = Ext.create('OSS.view.users.searchtemplate.toolbar.Combo', this.getComboBoxConfig());
        }
        return this.combobox;
    },
    getButton: function() {
        if (!this.button) {
            this.button = Ext.create('Ext.button.Button', {
                text: OSS.Localize.get('Change rules / Create rules'),
                handler: function() {
                    Ext.app.Application.instance.getController('SearchTemplates').openWindow({
                        templatesCombo: this.getComboBox(),
                        searchFunction: this.getSearchFunction()
                    });
                },
                scope: this
            });
        }
        return this.button;
    },
    getItems: function() {
        return [
            this.getCheckBox(),
            this.getComboBox(),
            this.getButton()
        ];
    }
});

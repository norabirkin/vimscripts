Ext.define( "OSS.view.agents.Database", {
    extend: "OSS.view.agents.FormTabBase",
    licid: 'full',
    requires: ['OSS.ux.form.field.IPField'],
    mixins: ["OSS.view.agents.FormTab"],
    step: 1,
    itemId: "database",
    title: OSS.Localize.get("Database settings"),
    initComponent: function() {
        this.items = [{
            xtype: "fieldset",
            style: {
                backgroundColor: '#f0f0f0'
            },
            margin: '10 10 10 10',
            items: [{
                xtype: "ipfield",
                labelWidth: 300,
                allowBlank: false,
                fieldLabel: i18n.get("Database IP"),
                name: "na_ip"
            }, {
                xtype: "textfield",
                labelWidth: 300,
                allowBlank: false,
                fieldLabel: i18n.get("Database name"),
                name: "na_db"
            }, {
                xtype: "textfield",
                labelWidth: 300,
                allowBlank: false,
                fieldLabel: i18n.get("Database user"),
                name: "na_username"
            }, {
                xtype: "textfield",
                labelWidth: 300,
                allowBlank: false,
                fieldLabel: i18n.get("Database password"),
                name: "na_pass"
            }]
        }];
        this.callParent(arguments);
    },
    onSuccessfullValidation: function() {}
});

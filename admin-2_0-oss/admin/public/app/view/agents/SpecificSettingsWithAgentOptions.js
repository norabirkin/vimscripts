Ext.define( "OSS.view.agents.SpecificSettingsWithAgentOptions", {
    extend: "OSS.view.agents.FormTab",
    onTabActivated: function( data ) {
        if (data.id === 0) {
            return;
        }
        if (data.id == data.agentIDOfLoadedOptions) {
            return;
        }
        Ext.Ajax.request({
            url: "index.php/api/agents/options",
            params: { id: data.id },
            success: function(response) {
                var options = Ext.JSON.decode(response.responseText);
                if (!options.success) {
                    return;
                } else {
                    options = options.results;
                }
                Ext.apply( data, options );
                Ext.apply(Ext.app.Application.instance.getController('OSS.controller.agents.Tabs').originalAgent, options);
                this.getForm().setValues( data );
                data.agentIDOfLoadedOptions = data.id;
                this.fireEvent( "optionsloaded" );
            },
            scope: this
        });     
    }
});

Ext.define('OSS.store.agents.phone.ReplaceWhatDescrs', {
    extend: "Ext.data.Store",
    fields: [ { name: "id", type: "int" }, { name: "name", type: "string" } ],
    data: [
        { id: 0, name: OSS.Localize.get( "Calling station number" ) },
        { id: 1, name: OSS.Localize.get( "Dialed number" ) },
        { id: 2, name: OSS.Localize.get( "Both numbers" ) }
    ]
});

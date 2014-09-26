Ext.define( "OSS.model.agent.Form", {
    extend: 'Ext.data.Model',
    fields: [
        { name: "id", type: "int" },
        { name: "descr", type: "string" },
        { name: "flush", type: "int" },
        { name: "keepdetail", type: "int" },
        { name: "na_db", type: "string" },
        { name: "na_ip", type: "string" },
        { name: "na_pass", type: "string" },
        { name: "na_username", type: "string" },
        { name: "service_name", type: "string" },
        { name: "type", type: "int" },
        { name: "nfhost", type: "string" },
        { name: "nfport", type: "int" },
        { name: "local_as_num", type: "string" },
        { name: "ignorelocal", type: "string" },
        { name: "raccport", type: "string" },
        { name: "rauthport", type: "string" },
        { name: "eapcertpassword", type: "string" },
        { name: "session_lifetime", type: "int" },
        { name: "max_radius_timeout", type: "int" },
        { name: "raddrpool", type: "int" },
        { name: "save_stat_addr", type: "int" },
        { name: "remulate_on_naid", type: "int" },
        { name: "rad_stop_expired", type: "int" },
        { name: "restart_shape", type: "int" },
        { name: "tel_direction_mode", type: "int" },
        { name: "failed_calls", type: "int" },
        { name: "oper_cat", type: "int" },
        { name: "tel_src", type: "int" },
        { name: "com_speed", type: "int" },
        { name: "com_parity", type: "int" },
        { name: "com_data_bits", type: "int" },
        { name: "com_stop_bits", type: "int" },
        { name: "voip_card_user", type: "int" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});

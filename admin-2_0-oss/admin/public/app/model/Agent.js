Ext.define('OSS.model.Agent', {
    extend: 'Ext.data.Model',
    fields: [
        { name: "id", type: "int" },
        { name: "descr", type: "string" },
        { name: "na_ip", type: "string", defaultValue: "127.0.0.1" },
        { name: "active", type: "int" },
        { name: "vgroups", type: "int" },
        { name: "sessions", type: "int" },
        { name: "type", type: "int", defaultValue: 1 },
        { name: "flush", type: "int", defaultValue: 60 },
        { name: "keepdetail", type: "int" },
        { name: "na_pass", type: "string", defaultValue: "billing" },
        { name: "na_username", type: "string", defaultValue: "billing" },
        { name: "na_db", type: "string", defaultValue: "billing" },
        { name: "service_name", type: "string" },
        { name: "nfhost", type: "string" },
        { name: "nfport", type: "int" },
        { name: "local_as_num", type: "int" },
        { name: "ignorelocal", type: "int" },
        { name: "raccport", type: "int", defaultValue: 1813 },
        { name: "rauthport", type: "int", defaultValue: 1812 },
        { name: "eapcertpassword", type: "string" },
        { name: "session_lifetime", type: "int", defaultValue: 86400 },
        { name: "max_radius_timeout", type: "int", defaultValue: 86400 },
        { name: "raddrpool", type: "int" },
        { name: "save_stat_addr", type: "int" },
        { name: "remulate_on_naid", type: "int" },
        { name: "rad_stop_expired", type: "int" },
        { name: "restart_shape", type: "int" },
        { name: "tel_direction_mode", type: "int" },
        { name: "failed_calls", type: "int" },
        { name: "oper_cat", type: "int" },
        { name: "tel_src", type: "string" },
        { name: "com_speed", type: "int" },
        { name: "com_parity", type: "int" },
        { name: "com_data_bits", type: "int" },
        { name: "com_stop_bits", type: "int" },
        { name: "voip_card_user", type: "string" },
        { name: "options", type: "string" },
        { name: "ignore_nets", type: "string" },
        { name: "interfaces", type: "string" }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents'),
        licid: 'agents',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
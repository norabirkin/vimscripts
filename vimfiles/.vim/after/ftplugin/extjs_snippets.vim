let st          = g:snip_start_tag
let et          = g:snip_end_tag

function! GetExtjsClassName()
    let cls = "OSS." . substitute( expand('%'), '/','.','g')
    let cls = substitute( cls, '.js','','g')
    return cls
endfunction

exec "Snippet m ".st.et.": function (".st.et.") {<cr>},"
exec "Snippet c Ext.define( '". GetExtjsClassName() ."', {<cr>extend: 'Ext.app.Controller',<cr>views: [],<cr>stores: [],<cr><cr>refs: [<cr>],<cr><cr>init: function() {<cr>this.control({<cr>".st.et."<cr>});<cr>},<cr><cr>});"

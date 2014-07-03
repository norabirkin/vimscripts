nnoremap ;g :set operatorfunc=<SID>GrepOperator<cr>g@
vnoremap ;g :<c-u>call <SID>GrepOperator(visualmode())<cr>

function! s:GrepOperator(type)
    let clipboard = @@
    if a:type ==# 'v'
        normal!`<v`>y
    elseif a:type ==# 'char'
        normal!`[v`]y
    else
        return
    endif
    execute "grep! --exclude=*.{swp,log} --exclude=*.log.* --exclude-dir=\"\\.svn\" --exclude-dir=docs -R ".shellescape(@@)." ."
    copen
    let @@ = clipboard
endfunction

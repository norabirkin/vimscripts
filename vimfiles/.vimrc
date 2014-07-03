filetype plugin on
runtime macros/matchit.vim
set confirm
colorscheme desert
nmap <C-N> :NERDTreeFind<CR>
nmap <C-H> <C-W>h
nmap <C-L> <C-W>l
inoremap <C-H> <left>
function! SetManualFoldMethodIfNotDiff()
    if &foldmethod != 'diff'
        let &foldmethod = 'manual'
    endif
endfunction
au BufNewFile * r!mkdir -p %:h
au VimEnter *  NERDTree
au BufEnter * call SetManualFoldMethodIfNotDiff()
au BufEnter *.log set foldmethod=indent
let g:miniBufExplMapCTabSwitchBufs = 1
"let g:miniBufExplSplitBelow=1
nmap <TAB> :bn<cr>
nmap <C-P> :bp<cr>
nmap <C-C> :BW<cr>
map <F5> :r!ctags -R --languages=php .<CR>
map <F4> :TlistToggle<CR>
execute pathogen#infect()
let g:syntastic_javascript_jshint_conf = "~/.jshintrc"
nmap <C-D> /^Ext.define(<CR>zt
nmap ;e gg<C-D>/^[ ]*extend[ ]*:<CR>f'@u
nmap ;i gg<C-D>/^[ ]*initComponent[ ]*:<CR>zt
nmap ;f ye/^[ ]*<C-R>"[ ]*:[ ]*function<CR>zz
nmap ;jf /^[ ]*[a-zA-Z0-9]*[ ]*:[ ]*function<CR>zz
nmap ;kf ?^[ ]*[a-zA-Z0-9]*[ ]*:[ ]*function<CR>zz
nmap <C-V> /^Ext.define(<CR>f'<Space>i'<C-O>
imap <C-D> <Esc>ddI
imap <C-D><C-D> <Esc>ddI<Esc>k
"noremap ;sv :r!cp ~/ExtJSRefactor/vimscripts/ExtJSRefactor.vim ~/.vim/plugin/<cr>:so ~/.vim/plugin/ExtJSRefactor.vim<cr>
noremap ;sv :w<cr>:r!cp ~/mb/mb_register_form/mb_register_form.module ~/_mediabilling/sites/all/modules/mb_register_form/<cr>
inoremap <c-k> <esc>
vnoremap <c-k> <esc>
onoremap ao :<c-u>norm!V^f{%<cr>
onoremap aa :<c-u>norm!V^f[%<cr>
nnoremap ;af ^f{%J
inoremap <c-j> <cr>
inoremap <c-c>: :
inoremap <c-c>, <end>,<cr>
inoremap <c-c>x <del>
inoremap <c-x> <bs>
nnoremap <c-f> :FufFile<cr>

set smartindent
set incsearch
set nohlsearch
set number
set tabstop=4
set shiftwidth=4
set expandtab
set list
set listchars=tab:..
vnoremap <Space> "jy
nnoremap <Space> "jy
vnoremap , "jd
nnoremap , "jd
nnoremap <CR> "jp
inoremap " ""<left>
inoremap ' ''<left>
inoremap ( ()<left>
inoremap { {<cr>}<esc>O
inoremap [ []<esc>i
inoremap < <><esc>i
inoremap <c-c>< <
inoremap <c-c>' '
inoremap <c-c>" "
inoremap <c-c>{ {
inoremap <c-c>[ [
inoremap <c-c>( (
inoremap <c-c>; <esc>mmA;<esc>`ma
inoremap <c-z><c-z> <esc>zza
inoremap <C-L> <end>

inoremap <c-c>l <right>
inoremap <c-c>} <esc>/}<cr>a
inoremap <c-c>) <esc>/)<cr>a
inoremap <c-c>] <esc>/]<cr>a
" inoremap <c-o> <esc>/}<cr>a,<space>{<cr>}<esc>O
nnoremap - ;
function! CreateExtJSComponentQuery(separator)
    if @j ==# ''
        let s = ''
    else
        let s = a:separator
    endif
    let clipboard = @"
    execute "normal!^ye"
    let key = @"
    let valueGetter = "normal!f'yi'"
    let selector1 = ''
    let selector2 = ''
    if key ==# 'itemId'
        let selector1 = '#'
    elseif key ==# 'alias'
        let valueGetter = "normal!f.lyt'"
    elseif key ==# 'xtype'
    else
        let selector1 = '['.key.'='
        let selector2 = ']'
        let s = ''
    endif
    execute valueGetter
    let @j = @j . s . selector1 . @" . selector2
    let @" = clipboard
endfunction
nnoremap <f9> :r!sudo chmod 777 <c-r>%<cr>
nnoremap ;qc :let @j = ''<cr>
nnoremap ;q> :call CreateExtJSComponentQuery(' > ')<cr>
nnoremap ;q<space> :call CreateExtJSComponentQuery(' ')<cr>
nnoremap ;fo :.cc<cr>:ccl<cr>
nnoremap ;fh :ccl<cr>
nnoremap ;fs :cope<cr>
set nowrap

nnoremap ;rr :call <SID>RenameRecursive()<cr>
nnoremap ;oo :call <SID>OpenExtJSClass('')<cr>
nnoremap ;ov :call <SID>OpenExtJSClass('OSS.view.')<cr>
nnoremap ;oc :call <SID>OpenExtJSClass('OSS.controller.')<cr>
nnoremap ;os :call <SID>OpenExtJSClass('OSS.store.')<cr>
nnoremap ;ob :call <SID>OpenBackAndController()<cr>
nnoremap ;rc :call <SID>RenameClass()<cr>
nnoremap ;tc :call<SID>LocalizeConfirm()<cr>
nnoremap ;tu :call<SID>LocalizeRus('messages')<cr>
nnoremap ;tt :call<SID>Localize('messages')<cr>
nnoremap ;te :call<SID>Localize('errors')<cr>
nnoremap ;tf :call<SID>FindLocalization()<cr>
nnoremap ;to :call<SID>OpenLocalizationFile('messages')<cr>
nnoremap ;tr :call<SID>OpenLocalizationFile('errors')<cr>
nnoremap ;tp :call<SID>FindItTariffTpl()<cr>
nnoremap ;tg :call<SID>LocalizeGettext()<cr>
nnoremap ;ta :call<SID>FindInOldAdminLocalization()<cr>
nnoremap ;td :call<SID>AddToOldAdminLocalization()<cr>
nnoremap ;tn :call<SID>ConfirmOldLocalization()<cr>
nnoremap ;tw :call<SID>WrapWithT()<cr>
nnoremap ;ou :w<cr>:e ~/lb/admin2/admin-2_0-oss/protected/runtime/vardump.log<cr>
nnoremap ;rt :call<SID>GrepTabs()<cr>
nnoremap ;fg :call<SID>FindRefGetter()<cr>
nnoremap ;fr :call<SID>FindRussian()<cr>
nnoremap ;rg :call<SID>RefGetter()<cr>
nnoremap ;sg :call<SID>StoreGetter()<cr>
nnoremap ;ty :call<SID>LocalizeInBuffer(@@)<cr>
nnoremap ;tj :call<SID>NextT()<cr>
nnoremap ;sj :call<SID>SnippetJoin()<cr>
nnoremap ;sf :call<SID>FromSystemGetFunctors()<cr>
nnoremap ;sp :call<SID>FromSystemGetFunctorsForBackEnd()<cr>
nnoremap ;ii :call<SID>ReplaceWithNewLocalization()<cr>
nnoremap ;sc :call<SID>SetController()<cr>
nnoremap ;ir :call<SID>ItemRegister()<cr>
nnoremap ;aa :call<SID>CreateFake()<cr>
nnoremap ;aj :call<SID>CreateFake1()<cr>
nnoremap ;ax ^r'f]r'
nnoremap ;an ^Js\n<esc>^
nnoremap ;ak /{[a-z]\+}<cr>
nnoremap ;k{ vi{<esc>`<
nnoremap ;br :call<SID>BorderRadius()<cr>
nnoremap ;rd :call<SID>Gradient()<cr>

function! s:CreateFake1()
    execute "normal!ma/(\<cr>\"jyi('aVj^%doObj::get(array(\<cr>)),\<esc>ko\<esc>\"jp"
endfunction

function! s:CreateFake()
    execute "normal!^\"jyi[f>w\"kyg_^cg_'\<c-r>j' => '\<c-r>k',\<esc>j"
endfunction

function! s:Gradient()
    call <SID>SaveRegister()
    execute "normal!^yg_"
    let radius = @@
    let exploded = split(radius, ' ')
    execute "normal!^vg_sbackground-image: -moz-linear-gradient(top, ".exploded[0].", ".exploded[1].");\<cr>background-image: -ms-linear-gradient(top, ".exploded[0].", ".exploded[1].");\<cr>background-image: -webkit-gradient(linear, 0 0, 0 100%, from(".exploded[0]."), to(".exploded[1]."));\<cr>background-image: -webkit-linear-gradient(top, ".exploded[0].", ".exploded[1].");\<cr>background-image: -o-linear-gradient(top, ".exploded[0].", ".exploded[1].");\<cr>background-image: linear-gradient(top, ".exploded[0].", ".exploded[1].");\<cr>background-repeat: repeat-x;\<cr>filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='".exploded[0]."', endColorstr='".exploded[1]."', GradientType=0);"
    call <SID>RestoreRegister()
endfunction

function! s:BorderRadius()
    call <SID>SaveRegister()
    execute "normal!^yg_"
    let radius = @@
    let exploded = split(radius, ' ')
    let arr = []
    for i in exploded
        if  i == 0
            let item = 0
        else
            let item = i.'px'
        endif
        let arr += [item]
    endfor
    let str = join(arr, ' ')
    execute "normal!^vg_s-webkit-border-radius: ".str.";\<cr>-moz-border-radius: ".str.";\<cr>border-radius: ".str.";"
    call <SID>RestoreRegister()
endfunction

function! s:AddToOldAdminLocalization()
    call <SID>SaveRegister()
    let s:en = <SID>YankInQuotes()
    call <SID>OpenFile('/home/anshakov/lb/20/admin/localizes/localize.xml')
    execute "normal!Gkko<tu tuid=\"".s:en."\" datatype=\"plaintext\">\<cr>\<tab><tuv xml:lang=\"en\">\<cr>\<tab><seg>".s:en."</seg>\<cr>\<bs>\<bs>\<bs>\<bs></tuv>\<cr><tuv xml:lang=\"ru\">\<cr>\<tab><seg></seg>\<cr>\<bs>\<bs>\<bs>\<bs></tuv>\<cr>\<bs>\<bs>\<bs>\<bs></tu>\<esc>kkf>"
    call <SID>RestoreRegister()
endfunction

function! s:SnippetJoin()
    execute "normal!Js\\<cr>"
endfunction

let s:controller = ''

function! s:ItemRegister()
    let path = expand('%')
    let exploded = split(path, '/')
    let className = <SID>GetClassName()
    let shortenedClassName = <SID>GetShortenedClassName(className)
    if exploded[0] == 'store'
        let prop = 'stores'
    elseif exploded[0] == 'view'
        let prop = 'views'
    else
        return 0
    endif
    call <SID>OpenFile(s:controller)
    call <SID>GoToTop()
    call <SID>FindInBuffer('    '.prop.':')
    execute "normal!o    '".shortenedClassName."',"
    call <SID>OpenFile(path)
endfunction

function! s:SetController()
    let s:controller = expand("%")
endfunction

function! s:FromSystemGetFunctorsForBackEnd()
    call <SID>SaveRegister()
    execute "normal!^yi'"
    let field = @@
    execute "normal!f>wyg_"
    let val = @@
    if val == '0'
        let type = 'int'
    elseif val == "''"
        let type = 'string'
    elseif val == "0.0"
        let type = 'float'
    elseif val == "false"
        let type = 'bool'
    endif
    execute "normal!Vs'".field."' => (".type.") $this->param('".field."'),\<esc>j"
    call <SID>RestoreRegister()
endfunction

function! s:FromSystemGetFunctors()
    call <SID>SaveRegister()
    execute "normal!^yi'"
    let field = @@
    execute "normal!f>wyg_"
    let val = @@
    if val == '0'
        let type = 'int'
    elseif val == "''"
        let type = 'string'
    elseif val == "0.0"
        let type = 'float'
    elseif val == "false"
        let type = 'bool'
    endif
    execute "normal!Vs{\<cr>name: '".field."',\<cr>type: '".type."'\<cr>},\<esc>j^"
    call <SID>RestoreRegister()
endfunction

function! s:ReqParams()
    execute "normal!^f>wmmf'\"jyi'`mcg_(int) $this->param('\<c-r>j'),\<esc>j"
endfunction

function! s:SaveParams()
    execute "normal!^\"jyi'f>wcg_$item['\<c-r>j']\<esc>j"
endfunction

function! s:Reformat()
    execute "normal!^@d@n@x/{\<cr>"
endfunction

function! s:RestoreParams()
    execute "normal!^yi'f'a => yii::app()->lanbilling->clientInfo->account->\<c-r>\"\<esc>j"
endfunction

function! s:Editable()
    execute "normal!/display\<cr>hcf'yii::app()->params['editBankDetails'] ? 'text' : 'display'\<esc>/array\<cr>"
endfunction

function! s:SetNames()
    execute "normal!2j^/account\<cr>f>l\"jyeO'name' => '\<c-r>j'\<esc>/array\<cr>"
endfunction

function! s:Fields()
    execute "normal!2jf>/account\<cr>f>l\"jyej^f>w\"kyi'?array\<cr>Vf(%s\<c-r>j '\<c-r>k'\<esc>j^"
endfunction

function! s:ReplaceUsWithUx()
    let result = <SID>Grep('OSS.us.HeadMsg', '.', 'R')
    let bufnr = -1
    for i in result
        if bufnr != i.bufnr
            call <SID>OpenGrepResultItem(i)
            execute "normal!:%s/OSS.us.HeadMsg/OSS.ux.HeadMsg/g\<cr>:w"
            let bufnr = i.bufnr
        endif
    endfor
endfunction

function! s:ReplaceAlert()
    call <SID>SaveRegister()
    call <SID>FindInBuffer('Ext.Msg.alert(')
    execute "normal!mmf(f,l\"jdt)`mvf(%sOSS.us.HeadMsg.show(\<c-r>j)"
    call <SID>RestoreRegister()
endfunction

function! s:ReplaceWithNewLocalization()
    call <SID>SaveRegister()
    call <SID>FindInBuffer('\.get(')
    execute "normal!t(v?Ext\\|OSS\<cr>si18n.get"
    call <SID>RestoreRegister()
endfunction

function! s:FindRussian()
    call <SID>FindInBuffer('[а-яА-Я]')
    execute "normal!h"
endfunction

function! s:FindLocalization()
    call <SID>SaveRegister()
    let str = <SID>YankInQuotes()
    let str = <SID>InQuotes(str)
    call <SID>OpenLocalizationFile('messages')
    call <SID>FindInBuffer(str)
    execute "normal!^f>"
    let @j = <SID>YankInQuotes()
    call <SID>RestoreRegister()
endfunction

function! s:AppendString()
    let str = <SID>YankInQuotes()
    let @j = @j.str."\n"
endfunction

let s:en = ''
let s:ru = ''

function! s:StoreGetter()
    call <SID>SaveRegister()
    let className = <SID>YankInQuotes()
    let @j = <SID>GetStoreGetter(className)
    call <SID>RestoreRegister()
endfunction

function! s:FindItTariffTpl()
    call <SID>SaveRegister()
    execute "normal!ye"
    let text = @@
    call <SID>OpenFile('/home/anshakov/lb/20/admin/localizes/ru/tpls/tarif.tpl')
    call <SID>GoToTop()
    call <SID>FindInBuffer('\<'.text.'\>')
    execute "normal!f@llvt%hy"
    let @j = "i18n.get('".@@."')"
    call <SID>RestoreRegister()
endfunction

function! s:ConfirmOldLocalization()
    call <SID>SaveRegister()
    call <SID>FindInBuffer('"ru"')
    execute "normal!j^f>lyt<"
    let s:ru = @@
    call <SID>OpenLocalizationFile('messages')
    call <SID>AddLine("    '".s:en."' => '".s:ru."',")
    execute "normal!:w\<cr>"
    call <SID>RestoreRegister()
endfunction

function! s:FindInOldAdminLocalization()
    call <SID>SaveRegister()
    let s:en = <SID>YankInQuotes()
    call <SID>OpenFile('/home/anshakov/lb/20/admin/localizes/localize.xml')
    call <SID>FindInBuffer('"'.s:en.'"')
    call <SID>RestoreRegister()
endfunction

function! s:WrapLikeArrItem()
    call <SID>SaveRegister()
    let param = <SID>YankInQuotes()
    let @j = "[\"".param."\"]"
    call <SID>RestoreRegister()
endfunction

function! s:DescribeParam()
    call <SID>SaveRegister()
    let param = <SID>YankInQuotes()
    let @j = "- ПАРАМЕТР "
    let @j = @j."[\"params\"][\"".param."\"]"
    call <SID>RestoreRegister()
endfunction

function! s:RenameClass()
    call <SID>SaveRegister()
    call <SID>GoToTop()
    call <SID>FindInBuffer(s:classDefinitionPattern)
    let newClassName = <SID>GetClassName()
    let oldClassName = <SID>ReplaceInsideNearestQuotes(newClassName)
    let result = <SID>GrepInQuotes(oldClassName, '.', 'RE')
    execute "normal!:w\<cr>"
    for item in result
        call <SID>OpenGrepResultItem(item)
        call <SID>ReplaceInsideQuotes(oldClassName, newClassName)
    endfor
    call <SID>FindInControllerRequireClassLists(oldClassName, newClassName)
    call <SID>SpecialRenamingCases(oldClassName, newClassName)
    "call <SID>RestoreRegister()
endfunction

function! s:NextT()
    call search('\<t\>(')
endfunction

function! s:WrapWithT()
    call <SID>SaveRegister()
    let text = <SID>CutIntoQuotes()
    execute "normal!hvlst('".text."')"
    call <SID>RestoreRegister()
endfunction

function! s:CutIntoQuotes()
    let quote = <SID>SearchQuote()
    execute "normal!di".quote
    return @@
endfunction

function! s:LocalizeGettext()
    call <SID>SaveRegister()
    let text = <SID>YankInQuotes()
    call <SID>LocalizeInBuffer(@@)
    call <SID>RestoreRegister()
endfunction

function! s:LocalizeInBuffer(text)
    call <SID>OpenFile('/home/anshakov/mb/mb_register_form/ru.po')
    call <SID>GoToTop()
    execute "normal!}"
    call <SID>AddLine('msgid "'.a:text.'"')
    call <SID>AddLine('msgstr ""')
    execute "normal!f\""
endfunction

function! s:YankInQuotes()
    let quote = <SID>SearchQuote()
    execute "normal!yi".quote
    return @@
endfunction

function! s:GrepTabs()
    execute 'grep! --exclude=*.{swp,log} --exclude=*.log.* --exclude-dir=\"\\.svn\" --exclude-dir=docs -PR "\t" .'
    let result = getqflist()
    let bufnr = -1
    for i in result
        if bufnr != i.bufnr
            call <SID>OpenGrepResultItem(i)
            execute "normal!:retab\<cr>:w\<cr>"
            let bufnr = i.bufnr
        endif
    endfor
endfunction

function! s:GetRefGetter()
    call <SID>SaveRegister()
    execute "normal!yi'"
    let ref = @@
    let ref = <SID>Capitalize(ref)
    let getter = 'get'.ref
    call <SID>RestoreRegister()
    return getter
endfunction

function! s:RefGetter()
    let @j = <SID>GetRefGetter()
endfunction

function! s:FindRefGetter()
    execute "normal!mm"
    let getter = <SID>GetRefGetter()
    call <SID>FindInBuffer('this.'.getter.'(')
endfunction

let s:classDefinitionPattern = '^Ext.define('
let s:defaultRegister = @@
let s:spaces = '[ ]*'

function! s:InQuotes(text)
    let pattern = escape(a:text, '.')
    let pattern = "\\('".pattern."'\\)\\|".'\("'.pattern.'"\)'
    return pattern
endfunction

function! s:InQuotesForGrep(text)
    let pattern = escape(a:text, '.')
    let patternInSingleQuotes = "'".pattern."'"
    let patternInDubbleQuotes = '"'.pattern.'"'
    return '('.patternInSingleQuotes.'\|'.patternInDubbleQuotes.')'
endfunction

function! s:SearchInQuotes(text)
    let pattern = <SID>InQuotes(a:text)
    call search(pattern, 'c')
    execute "normal!vy"
    return @@
endfunction

function! s:GrepInQuotes(text, folder, options)
    let pattern = <SID>InQuotesForGrep(a:text)
    return <SID>Grep(pattern, a:folder, a:options)
endfunction

function! s:SearchQuote()
    call search('\("\)\|\('."'".'\)', 'c')
    execute "normal!vy"
    return @@
endfunction


function! s:FindInControllerRequireClassLists(className, newClassName)
    let classNameStringsOrNewLinesOrSpaces = '[ \na-z0-9A-Z''",\.]*'
    let param = <SID>GetClassRequireListName(a:className)
    if param != ''
        let shortenedClassName = <SID>GetShortenedClassName(a:className)
        let shortenedNewClassName = <SID>GetShortenedClassName(a:newClassName)
        let classNameInQuotes = <SID>InQuotesForGrep(shortenedClassName)
        let listContent = classNameStringsOrNewLinesOrSpaces.classNameInQuotes.classNameStringsOrNewLinesOrSpaces
        let pattern = '^'.s:spaces.param.s:spaces.':'.s:spaces.'\['.listContent.'\]'
        let result = <SID>Grep(pattern, './controller/', 'PR')
        for item in result
            if <SID>OpenGrepResultItem(item)
                call <SID>ReplaceInsideQuotes(shortenedClassName, shortenedNewClassName)
            endif
        endfor
    endif
endfunction

function! s:GetClassRequireListName(className)
    let folder = <SID>GetClassFolder(a:className)
    if folder == 'view'
        return 'views'
    elseif folder == 'store'
        return 'stores'
    elseif folder == 'controller'
        return 'controllers'
    else
        return ''
    endif
endfunction

function! s:RenameRecursive()
    call <SID>SaveRegister()
    let result = <SID>Grep(s:classDefinitionPattern, <SID>GetFolder(), 'R')
    for item in result
        call <SID>OpenGrepResultItem(item)
        call <SID>RenameClass()
    endfor
    call <SID>RestoreRegister()
endfunction

function! s:GetClassFolder(className)
    return split(a:className, '\.')[1]
endfunction

function! s:GetShortenedClassName(className)
    return join(split(a:className, '\.')[2:], '.')
endfunction

function! s:SpecialRenamingCases(oldClassName, newClassName)
    let folder = <SID>GetClassFolder(a:oldClassName)
    if folder == 'view'
        call <SID>ViewSpecialRenamingCases(a:oldClassName, a:newClassName)
    elseif folder == 'store'
        call <SID>StoreSpecialRenamingCases(a:oldClassName, a:newClassName)
    elseif folder == 'controller'
        call <SID>ControllerSpecialRenamingCases(a:oldClassName, a:newClassName)
    endif
endfunction

function! s:ReplaceStoreGetter(oldClassName, newClassName)
    let shortenedOldClassName = <SID>GetShortenedClassName(a:oldClassName)
    let shortenedNewClassName = <SID>GetShortenedClassName(a:newClassName)
    let oldGetter = <SID>GetStoreGetter(shortenedOldClassName)
    let newGetter = <SID>GetStoreGetter(shortenedNewClassName)
    let result = <SID>Grep('\b'.oldGetter.'\b', '.', 'R')
    for item in result
        call <SID>OpenGrepResultItem(item)
        call <SID>FindInBuffer('\<'.oldGetter.'\>')
        call <SID>ReplaceWord(oldGetter, newGetter)
    endfor
endfunction

function! s:ReplaceStoreProperty(oldClassName, newClassName)
    let shortenedOldClassName = <SID>GetShortenedClassName(a:oldClassName)
    let shortenedNewClassName = <SID>GetShortenedClassName(a:newClassName)
    let shortenedOldClassNameInQuotes = <SID>InQuotesForGrep(shortenedOldClassName)
    let result = <SID>Grep('^'.s:spaces.'store'.s:spaces.':'.s:spaces.shortenedOldClassNameInQuotes, '.', 'ER')
    for item in result
        call <SID>OpenGrepResultItem(item)
        call <SID>ReplaceInsideQuotes(shortenedOldClassName, shortenedNewClassName)
    endfor
endfunction

function! s:StoreSpecialRenamingCases(oldClassName, newClassName)
    call <SID>ReplaceStoreGetter(a:oldClassName, a:newClassName)
    call <SID>ReplaceStoreProperty(a:oldClassName, a:newClassName)
endfunction

function! s:ReplaceWord(find, replace)
    call <SID>FindInBuffer('\<'.a:find.'\>')
    execute "normal!ce".a:replace
endfunction

function! s:GetStoreGetter(className)
    let exploded = split(a:className, '\.')
    let getter = 'get'
    for item in exploded
        let getter = getter.<SID>Capitalize(item)
    endfor
    let getter = getter.'Store'
    return getter
endfunction

function! s:ViewSpecialRenamingCases(oldClassName, newClassName)
    call <SID>ReplaceGetterAgrument(a:oldClassName, a:newClassName, 'getView')
endfunction

function! s:ControllerSpecialRenamingCases(oldClassName, newClassName)
    call <SID>ReplaceGetterAgrument(a:oldClassName, a:newClassName, 'getController')
endfunction

let s:spacesAndNewLines = '[ \n]*'

function! s:ReplaceGetterAgrument(oldClassName, newClassName, getter)
    let shortenedOldClassName = <SID>GetShortenedClassName(a:oldClassName)
    let shortenedNewClassName = <SID>GetShortenedClassName(a:newClassName)
    let shortenedOldClassNameInQuotes = <SID>InQuotesForGrep(shortenedOldClassName)
    let pattern = '\b'.a:getter.'('.s:spacesAndNewLines.shortenedOldClassNameInQuotes.s:spacesAndNewLines.')'
    let result = <SID>Grep(pattern, '.', 'PR')
    for item in result
        if <SID>OpenGrepResultItem(item)
            call <SID>ReplaceInsideQuotes(shortenedOldClassName, shortenedNewClassName)
        endif
    endfor
endfunction

function! s:Save()
    execute "normal!:w\<cr>"
endfunction

function! s:ReplaceInsideQuotes(text, replace)
    let quote = <SID>SearchInQuotes(a:text)
    execute "normal!ci".quote.a:replace."\<esc>"
    call <SID>Save()
endfunction

function! s:InsertText(text)
    execute "normal!i".a:text."\<esc>"
    call <SID>Save()
endfunction

function! s:GetClassName()
    return substitute('OSS.'.substitute(expand('%'), '/', '.', 'g'), '.js', '', 'g')
endfunction

function! s:SaveRegister()
    let s:defaultRegister = @@
endfunction

function! s:RestoreRegister()
    let @@ = s:defaultRegister
endfunction

function! s:Grep(pattern, folder, options)
    echom 'grep! --exclude=*.{swp,log} --exclude=*.log.* --exclude-dir=\"\\.svn\" --exclude-dir=docs -'.a:options.' '.shellescape(a:pattern).' '.a:folder
    execute 'grep! --exclude=*.{swp,log} --exclude=*.log.* --exclude-dir=\"\\.svn\" --exclude-dir=docs -'.a:options.' '.shellescape(a:pattern).' '.a:folder
    return getqflist()
endfunction

function! s:GetFolder()
    return join(split(bufname('%'), '/')[:-2], '/')
endfunction

function! s:OpenGrepResultItem(item)
    if a:item.lnum > 0
        execute "normal!:w\<cr>"
        execute "normal!:b".a:item.bufnr."\<cr>:".a:item.lnum."\<cr>"
        return 1
    endif
    return 0
endfunction

function! s:FindInBuffer(pattern)
    call search(a:pattern, 'c')
endfunction

function! s:GoToTop()
    execute "normal!gg"
endfunction

function! s:ReplaceInsideNearestQuotes(replace)
    let quote = <SID>SearchQuote()
    let command = quote.a:replace
    execute "normal!ci".command
    return @@
endfunction

let s:app = '~/lb/admin2/admin-2_0-oss/public/app'
let s:core = '~/lb/admin2/admin-2_0-oss/public/ext/src'
let s:protected = '~/lb/admin2/admin-2_0-oss/protected'
let s:backend = s:protected.'/controllers/api'
let s:appname = 'OSS'

function! s:GetBasePath(base)
    if a:base ==# s:appname
        return s:app
    elseif a:base ==# 'Ext'
        return s:core
    endif
endfunction

function! s:OpenFile(path)
    execute "normal!:w\<cr>:e ".a:path."\<cr>"
endfunction

function! s:OpenBackAndController()
    call <SID>SaveRegister()
    let url = <SID>YankInQuotes()
    let exploded = split(url, '/')
    if exploded[0] == 'index.php'
        let exploded = exploded[1:]
    endif
    if exploded[0] == 'api'
        let exploded = exploded[1:]
    endif
    let route = exploded[0]
    let controller = <SID>Capitalize(route).'Controller.php'
    call <SID>OpenFile(s:backend.'/'.controller)
    call <SID>RestoreRegister()
endfunction

function! s:Capitalize(str)
    return toupper(a:str[0]).a:str[1:]
endfunction

function! s:OpenExtJSClass(ns)
    call <SID>SaveRegister()
    let classname = a:ns.<SID>YankInQuotes()
    let exploded = split(classname, '\.')
    let exploded[0] = <SID>GetBasePath(exploded[0])
    let path = join(exploded, '/').'.js'
    echo path
    call <SID>OpenFile(path)
    call <SID>RestoreRegister()
endfunction

function! s:InsertLine(text)
    execute "normal!O".a:text."\<esc>"
endfunction

function! s:AddLine(text)
    execute "normal!o".a:text."\<esc>"
endfunction

function! s:OpenLocalizationFile(file)
    "call <SID>OpenFile('/home/anshakov/lb/20/client2/protected/messages/ru/main.php')
    call <SID>OpenFile(s:protected.'/messages/ru/'.a:file.'.php')
    call <SID>GoToTop()
    call <SID>FindInBuffer('\<return array')
endfunction

function! s:LocalizeRus(file)
    call <SID>SaveRegister()
    let text = <SID>YankInQuotes()
    call <SID>OpenLocalizationFile(a:file)
    call <SID>AddLine("    '' => '".text."',")
    execute "normal!ma"
    call <SID>FindInBuffer(text)
    call <SID>RestoreRegister()
endfunction

function! s:Localize(file)
    call <SID>SaveRegister()
    let text = <SID>YankInQuotes()
    call <SID>OpenLocalizationFile(a:file)
    call <SID>AddLine("    '".text."' => '',")
    call <SID>RestoreRegister()
endfunction

function! s:LocalizeConfirm()
    call <SID>SaveRegister()
    execute "normal!^"
    let text = <SID>YankInQuotes()
    let @j = "i18n.get('".text."')"
    call <SID>RestoreRegister()
endfunction

if !exists('loaded_snippet') || &cp
    finish
endif

let st = g:snip_start_tag
let et = g:snip_end_tag
let cd = g:snip_elem_delim

set tabstop=2
set shiftwidth=2

let s:tabBack = '<bs><bs>'

exec "Snippet do do<CR><tab>".st.et."<CR>".s:tabBack."end"
exec "Snippet class class ".st."className".et."<CR>".st.et."<CR>end<CR>".st.et
exec "Snippet begin begin<CR>".st.et."<CR>rescue ".st."Exception".et." => ".st."e".et."<CR>".st.et."<CR>end<CR>".st.et
exec "Snippet each_with_index0 each_with_index do |".st."element".et.", ".st."index".et."|<CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet collect collect { |".st."element".et."| ".st."element".et.".".st.et." }<CR>".st.et
exec "Snippet forin for ".st."element".et." in ".st."collection".et."<CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet doo do |".st."object".et."|<CR>".st.et."<CR>end<CR>".st.et
exec "Snippet : :".st.et." => ".st.et.""
exec "Snippet def def ".st.et."<CR><tab>".st.et."<CR>".s:tabBack."end"
exec "Snippet case case ".st."object".et."<CR>when ".st."condition".et."<CR>".st.et."<CR>end<CR>".st.et
exec "Snippet collecto collect do |".st."element".et."|<CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet each each { |".st."element".et."| ".st."element".et.".".st.et." }<CR>".st.et
exec "Snippet each_with_index each_with_index { |".st."element".et.", ".st."idx".et."| ".st."element".et.".".st.et." }<CR>".st.et
exec "Snippet if if ".st.et."<CR>".st.et."<CR>".s:tabBack."end"
exec "Snippet eacho each do |".st."element".et."|<CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet unless unless ".st."condition".et."<CR>".st.et."<CR>end<CR>".st.et
exec "Snippet ife if ".st.et."<CR>".st.et."<CR>".s:tabBack."else<CR>".st.et."<CR>".s:tabBack."end"
exec "Snippet when when ".st."condition".et."<CR>".st.et
exec "Snippet selecto select do |".st."element".et."|<CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet injecto inject(".st."object".et.") do |".st."injection".et.", ".st."element".et."| <CR>".st.et."<CR>end<CR>".st.et
exec "Snippet reject { |".st."element".et."| ".st."element".et.".".st.et." }<CR>".st.et
exec "Snippet rejecto reject do |".st."element".et."| <CR>".st."element".et.".".st.et."<CR>end<CR>".st.et
exec "Snippet inject inject(".st."object".et.") { |".st."injection".et.", ".st."element".et."| ".st.et." }<CR>".st.et
exec "Snippet select select { |".st."element".et."| ".st."element".et.".".st.et." }<CR>".st.et

exec "Snippet sp # encoding: UTF-8<cr><bs><bs>require 'spec_helper'<cr><cr>describe '".st.et."' do<cr><tab>before(:all) do<cr><tab>admin_page<cr><cr>if login?<cr>authorize \"admin\", \"\"<cr>".s:tabBack."end<cr>".s:tabBack."end<cr><cr>after(:all, :logout => true) do<cr><tab>if login?<cr>tb_menu_click \"Выход\", :main_menu => true<cr>".s:tabBack."end<cr>".s:tabBack."end<cr><cr>".st.et."<cr>".s:tabBack."end"

exec "Snippet de describe '".st.et."' do<cr><tab>before do<cr><tab>if login?<cr>raise Capybara::ElementNotFound.new(\"Не авторизован\")<cr>".s:tabBack."end<cr>".s:tabBack."end<cr><cr>it '".st.et."' do<cr><tab>".st.et."<cr>".s:tabBack."end<cr>".s:tabBack."end"

exec "Snippet G Grid.new ".st.et
exec "Snippet T TestHelper::".st.et
exec "Snippet C Capybara::".st.et
exec "Snippet xp page.find(:xpath, ".st.et.")"
exec "Snippet cs page.find(:css, ".st.et.")"
exec "Snippet me tb_menu_click '".st.et."'".st.et.", :parent => ".st.et
exec "Snippet am tb_menu_click 'Действия', '".st.et."'".st.et.", :parent => ".st.et
exec "Snippet ma tb_menu_click '".st.et."'".st.et.", :main_menu => true"
exec "Snippet pa , :parent => ".st.et
exec "Snippet co set_combo_field '".st.et."', :label => '".st.et."', :parent => ".st.et.", :match => true"
exec "Snippet te set_text_field '".st.et."', :label => '".st.et."', :parent => ".st.et.", :match => true"
exec "Snippet er if message_box?('Ошибка', :click => 'OK')<cr>raise Capybara::CapybaraError.new('Произошла ошибка')<cr>".s:tabBack."end"
exec "Snippet let let(:".st.et.") do<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet it it '".st.et."' do<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet bu tb_button_click :label => '".st.et."', :parent => ".st.et
exec "Snippet ra raise Capybara::CapybaraError.new('".st.et."')"
exec "Snippet vc validate_combo_field '".st.et."', :parent => ".st.et.", :label => '".st.et."'"
exec "Snippet vt validate_text_field '".st.et."', :parent => ".st.et.", :label => '".st.et."', :match => true"
exec "Snippet tes test_data [<cr><tab>{ :cols => ['".st.et."'".st.et."], :headers => true },<cr>{ :cols => [".st.et."] }".st.et."<cr>".s:tabBack."]"
exec "Snippet col { :cols => [".st.et."] }".st.et
exec "Snippet se select_shift [".st.et."], :where => '".st.et."', :select => true"
exec "Snippet mes if !message_box?('".st.et."'".st.et.", :click => '".st.et."')<cr>raise Capybara::CapybaraError.new('".st.et."')<cr>".s:tabBack."end"
exec "Snippet emp count_rows 0"
exec "Snippet pr tb_button_click :css => 'x-ibtn-prev', :parent => ".st.et.", :match => true"
exec "Snippet ch check_rows ['".st.et."'], :where => '".st.et."', :check => true"
exec "Snippet ac tab = get_active_tab_component '".st.et."', :parent => ".st.et."<cr>tab = page.find(:css, \"div##{tab}\")"
exec "Snippet ed set_action :column => '".st.et."', :value => '".st.et."', :css => 'x-ibtn-edit'"
exec "Snippet rm set_action :column => '".st.et."', :value => '".st.et."', :css => 'x-ibtn-delete'"
exec "Snippet wi Window.new :title => '".st.et."'"
exec "Snippet fi get_fieldset :label => '".st.et."', :match => true, :parent => ".st.et
exec "Snippet ha page.has_xpath?(".st.et.")"
exec "Snippet wit within (".st.et.") do<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet ea each do |item|<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet eac each do |key, value|<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet Cn Class.new do<cr><tab>".st.et."<cr>".s:tabBack."end"
exec "Snippet in def initialize".st.et."<cr><tab>".st.et."<cr>".s:tabBack."end"

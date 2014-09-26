# encoding: UTF-8
require 'spec_helper'

describe 'Проверка списка пользователей' do
  before(:all) do
    admin_page
    
    if login?
      authorize "admin", ""
    end
  end
  
  after(:all, :logout => true) do
    if login?
      tb_menu_click "Выход", :main_menu => true
    end
  end
  
  describe 'Перейти в раздел пользователей' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'Клик: Объекты / Пользователи' do
      tb_menu_click "Объекты", "Пользователи", :main_menu => true
    end
  end
  
  describe 'Поиск пользователя' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:grid) { Grid.new :title => "Пользователи" }
    let(:grid_topbar) { page.find(:xpath, "//div[contains(@class, 'x-grid-with-row-lines') and contains(@id, 'users_list')]//div[contains(@class, 'x-toolbar-docked-top')]") }
    
    it 'поиск несуществующиего пользователя по ФИО' do
      sleep 1
      set_combo_field "ФИО ответственного", :name => "property", :parent => grid_topbar, :match => true
      set_text_field "ФИО_НЕСУЩЕСТВУЮЩЕГО_ПОЛЬЗОВАТЕЛЬ", :name => "search", :parent => grid_topbar, :match => true
      tb_button_click :label => "Показать", :parent => grid_topbar, :match => true
      
      sleep 1
      grid.count_rows 0
    end
    
    it 'поиск несуществующиего пользователя по логину пользователя' do
      sleep 1
      set_combo_field "Логин пользователя", :name => "property", :parent => grid_topbar
      set_text_field "ЛОГИН_НЕСУЩЕСТВУЮЩЕГО_ПОЛЬЗОВАТЕЛЬ", :name => "search", :parent => grid_topbar, :match => true
      tb_button_click :label => "Показать", :parent => grid_topbar, :match => true
      
      sleep 1
      grid.count_rows 0
    end
  end
  
  describe 'Новый пользователь', :newuser => true do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:grid_list) { Grid.new :title => "Пользователи" }
    let(:grid_list_topbar) { page.find(:xpath, "//div[contains(@class, 'x-grid-with-row-lines') and contains(@id, 'users_list')]//div[contains(@class, 'x-toolbar-docked-top')]") }
    let(:user_form_panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default') and contains(@id, 'user_form')]", :visible) }
    
    it 'открыть форму пользователя' do
      tb_menu_click "Действия", "Создать", :parent => grid_list_topbar 
    end
    
    it 'заполнить основные поля' do
      set_combo_field "Абонент", :label => "Категория", :parent => user_form_panel, :match => true
      set_combo_field "Физическое лицо", :label => "Тип пользователя", :parent => user_form_panel, :match => true
      set_text_field "paddavan", :label => "Логин", :parent => user_form_panel, :match => true
      tb_button_click :css => "x-ibtn-key", :parent => user_form_panel, :match => true
      set_text_field "Падаванов", :label => "Фамилия", :parent => user_form_panel, :match => true
      set_text_field "Корней", :label => "Имя", :parent => user_form_panel, :match => true
      set_text_field "Федорович", :label => "Отчество", :parent => user_form_panel, :match => true
    end
    
    it 'сохранить пользователя' do
      tb_menu_click "Действия", "Сохранить", :parent => user_form_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'вернуться в список пользователей' do
      tb_button_click :css => "x-ibtn-prev", :parent => user_form_panel, :match => true
      
      message_box?("Переход к списку", :click => "Yes")
    end
    
    it 'найти созданного пользователя' do
      sleep 1
      set_combo_field "ФИО ответственного", :name => "property", :parent => grid_list_topbar
      set_text_field "Падаванов", :name => "search", :parent => grid_list_topbar, :match => true
      tb_button_click :label => "Показать", :parent => grid_list_topbar, :match => true
      
      sleep 1
      grid_list.test_data [
        { :cols => ["Имя пользователя", "Логин"], :headers => true },
        { :cols => ["Падаванов Корней Федорович", "paddavan"] }
      ]
    end
    
    it 'отметить пользователя' do
      grid_list.check_rows [
        "Падаванов Корней Федорович"
      ], :where => "Имя пользователя", :check => true
    end
    
    it 'удалить отмеченого пользователя' do
      tb_menu_click "Действия", "Удалить", :parent => grid_list_topbar
      if !message_box?("Подтверждение", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      sleep 1
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Сервер вернул сообдение об ошибке")
      end
      
      grid_list.count_rows 0
    end
  end
end

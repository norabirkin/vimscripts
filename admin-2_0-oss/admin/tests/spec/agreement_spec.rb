# encoding: UTF-8
require 'spec_helper'

describe 'Проверка договора' do
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
  
  let(:grid_list) { Grid.new :title => "Пользователи" }
  let(:grid_list_topbar) { page.find(:xpath, "//div[contains(@class, 'x-grid-with-row-lines') and contains(@id, 'users_list')]//div[contains(@class, 'x-toolbar-docked-top')]") }
  let(:user_form_panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default') and contains(@id, 'user_form')]", :visible) }
  let(:agreement_panel) { get_active_tab_component "Договоры", :parent => user_form_panel }
  let(:agreement_comm) { get_active_tab_component "Свойства договора", :parent => user_form_panel }
  let(:agreement_num) { ['DD-109812', 'DO-109812'] }
  let(:agreement_code) { ['109812C1', '109812C2'] }
  let(:agreement_grid_id) { Capybara::page.execute_script("var A = Ext.ComponentQuery.query('grid#agreementsGrid'); if(A.length == 1) { return A[0].getId() } return null;") }
  let(:agreement_fields) { find(:css, "div##{agreement_comm}") }
  
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
  
  describe 'Новый пользователь' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'открыть форму пользователя' do
      tb_menu_click "Действия", "Создать", :parent => grid_list_topbar 
    end
    
    it 'заполнить основные поля' do
      set_combo_field "Абонент", :label => "Категория", :parent => user_form_panel, :match => true
      set_combo_field "Физическое лицо", :label => "Тип пользователя", :parent => user_form_panel, :match => true
      set_text_field "miranda_l", :label => "Логин", :parent => user_form_panel, :match => true
      tb_button_click :css => "x-ibtn-key", :parent => user_form_panel, :match => true
      set_text_field "Лоусон", :label => "Фамилия", :parent => user_form_panel, :match => true
      set_text_field "Миранда", :label => "Имя", :parent => user_form_panel, :match => true
      set_text_field "Афанасьевна", :label => "Отчество", :parent => user_form_panel, :match => true
    end
    
    it 'сохранить пользователя' do
      tb_menu_click "Действия", "Сохранить", :parent => user_form_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end  
  end
  
  describe 'Новый договор' do
    it 'выбрать вкладку Договоры' do
      tb_button_click :label => "Договоры", :parent => user_form_panel
    end
    
    it 'добавить первый договор' do
      tb_menu_click "Действия", "Добавить договор", :parent => user_form_panel
    end
    
    it 'проверить поля по умолчанию' do
      fields = agreement_fields
      validate_combo_field ".{1,}", :rawexpect => "match", :parent => fields, :label => "Оператор", :match => true
      validate_combo_field ".{1,}", :rawexpect => "match", :parent => fields, :label => "Тип договора", :match => true
      validate_combo_field ".{1,}", :rawexpect => "match", :parent => fields, :name => "create_date", :match => true
      validate_combo_field ".{1,}", :rawexpect => "match", :parent => fields, :label => "Валюта", :match => true
    end
    
    it 'установить номер первого договора' do
      fields = agreement_fields
      set_text_field agreement_num[0], :label => "Номер договора", :match => true, :parent => fields
      set_text_field agreement_code[0], :label => "Код оплаты", :match => true, :parent => fields
    end
    
    it 'сохранить первый договор' do
      tb_menu_click "Действия", "Сохранить", :parent => user_form_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'добавить второй договор' do
      tb_menu_click "Действия", "Добавить договор", :parent => user_form_panel
    end
    
    it 'установить номер второго договора' do
      fields = agreement_fields
      set_text_field agreement_num[1], :label => "Номер договора", :match => true, :parent => fields
      set_text_field agreement_code[1], :label => "Код оплаты", :match => true, :parent => fields
    end
    
    it 'сохранить второй договор' do
      tb_menu_click "Действия", "Сохранить", :parent => user_form_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
  end
  
  describe 'Проверка договоров' do
    let(:agreement_grid) do
      grid = nil
      gridId = agreement_grid_id
      
      if gridId != nil
        grid = Grid.new :id => gridId
      else
        raise Capybara::CapybaraError.new("Грид договор не найден")
      end
    end
    
    it 'проверить список договоров' do
      agreement_grid.test_data [
        { :cols => ["Номер договора", "Код оплаты", "Баланс", "Кредит"], :headers => true },
        { :cols => [agreement_num[0], agreement_code[0], 0, 0] },
        { :cols => [agreement_num[1], agreement_code[1], 0, 0] }
      ]
    end
    
    it 'удалить второй договор' do
      agreement_grid.select_shift [ agreement_num[1] ], :where => "Номер договора", :select => true
      
      tb_menu_click "Действия", "Удалить договор", :parent => user_form_panel
      
      if !message_box?("Подтверждение", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
      
      agreement_grid.test_data [
        { :cols => ["Номер договора", "Код оплаты", "Баланс", "Кредит"], :headers => true },
        { :cols => [agreement_num[0], agreement_code[0], 0, 0] }
      ]
    end
    
    it 'удалить первый договор' do
      agreement_grid.select_shift [ agreement_num[0] ], :where => "Номер договора", :select => true
      
      tb_menu_click "Действия", "Удалить договор", :parent => user_form_panel
      
      if !message_box?("Подтверждение", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
      
      agreement_grid.count_rows 0
    end
  end
  
  describe 'Удалить пользователя' do
    it 'вернуться в список пользователей' do
      tb_button_click :css => "x-ibtn-prev", :parent => user_form_panel, :match => true
      
      message_box?("Переход к списку", :click => "Yes")
    end
    
    it 'найти пользователя' do
      sleep 1
      set_combo_field "ФИО ответственного", :name => "property", :parent => grid_list_topbar
      set_text_field "Лоусон", :name => "search", :parent => grid_list_topbar, :match => true
      tb_button_click :label => "Показать", :parent => grid_list_topbar, :match => true
      
      sleep 1
      grid_list.test_data [
        { :cols => ["Имя пользователя", "Логин"], :headers => true },
        { :cols => ["Лоусон Миранда Афанасьевна", "miranda_l"] }
      ]
    end
    
    it 'отметить пользователя' do
      grid_list.check_rows [
        "Лоусон Миранда Афанасьевна"
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

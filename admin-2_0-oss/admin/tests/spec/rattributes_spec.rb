# encoding: UTF-8
require 'spec_helper'

describe 'Проверка RADIUS атридбутов' do
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
  
  let(:agent_name) { "RADIUS-attributes tester" }
  let(:agent_panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default-framed') and contains(@id, 'agents-')]") }
  let(:agent_topbar) { within(agent_panel) do find(:css, "div.x-toolbar-docked-top", :visible => true) end }
  let(:radius_panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default-framed') and contains(@id, 'radisuattributes-')]") }
  let(:radius_topbar) { within(radius_panel) do find(:css, "div.x-toolbar-docked-top", :visible => true) end }
  let(:radius_grid) { Grid.new :id => "radiusattributes_grid", :panelnum => 1, :match => true }
  let(:radius_form) { page.find(:xpath, "//div[contains(@class, 'x-panel-default-framed') and contains(@id, 'radiusattributes_form-')]", :visible => true) }
  
  let(:radius_data) do
    [
      [ "Атрибут Октябренка", agent_name, "Все", "Access-Accept", "Digest-Method", "Наше имя октябрята. - Будь готов! Всегда готов!" ],
      [ "Атрибут Пионера", agent_name, "Все", "Access-Accept", "Acct-Authentic", "Наше имя пионеры. - Будь готов! Всегда готов!" ]
    ]
  end
  
  describe 'Новый агент для тестирования атрибутов', :newagent => true do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'Клик: Объекты / Агенеты' do
      tb_menu_click "Объекты", "Агенты", :main_menu => true
    end
    
    it 'открыть форму нового агента' do
      tb_menu_click "Действия", "Создать новый агент", :parent => agent_topbar
    end
    
    it 'заполнить необходимые поля' do
      active_tab = get_active_tab_component "Общие настройки", :parent => agent_panel
      
      active_tab = find(:css, "div##{active_tab}")
      
      set_combo_field "RADIUS", :label => "Тип", :parent => active_tab, :match => true
      set_text_field agent_name, :label => "Имя", :parent => active_tab, :match => true
      set_text_field agent_name, :label => "Описание", :parent => active_tab, :match => true
    end
    
    it 'сохранить агента' do
      tb_menu_click "Действия", "Сохранить", :parent => agent_topbar
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
  end
  
  describe 'Перейти в раздел RADIUS-атрибуты' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'Клик: Свойства / RADIUS-атрибуты' do
      tb_menu_click "Свойства", "RADIUS-атрибуты", :main_menu => true
    end
  end
  
  describe 'Новый атрибут' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'нажать добавить' do
      tb_menu_click "Действия", "Добавить атрибут", :parent => radius_panel
    end
    
    it 'заполнить поля' do
      form = radius_form
      props = get_fieldset :label => "Свойства", :match => true, :parent => form
      
      set_text_field radius_data[0][0], :label => "Описание", :parent => props, :match => true
      set_combo_field radius_data[0][1], :label => "Агент", :parent => props, :match => true
      set_combo_field radius_data[0][2], :label => "Nas", :parent => props, :match => true
      set_combo_field radius_data[0][3], :label => "RADIUS Code", :parent => props, :match => true
      set_combo_field radius_data[0][4], :label => "Атрибут", :parent => props, :match => true
      set_text_field radius_data[0][5], :label => "Значение", :parent => props, :match => true
    end
    
    it 'сохранить атрибут' do
      tb_menu_click "Действия", "Сохранить", :parent => radius_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'нажать добавить' do
      tb_menu_click "Действия", "Добавить атрибут", :parent => radius_panel
    end
    
    it 'заполнить поля' do
      form = radius_form
      props = get_fieldset :label => "Свойства", :match => true, :parent => form
      
      set_text_field radius_data[1][0], :label => "Описание", :parent => props, :match => true
      set_combo_field radius_data[1][1], :label => "Агент", :parent => props, :match => true
      set_combo_field radius_data[1][2], :label => "Nas", :parent => props, :match => true
      set_combo_field radius_data[1][3], :label => "RADIUS Code", :parent => props, :match => true
      set_combo_field radius_data[1][4], :label => "Атрибут", :parent => props, :match => true
      set_text_field radius_data[1][5], :label => "Значение", :parent => props, :match => true
    end
    
    it 'сохранить атрибут' do
      tb_menu_click "Действия", "Сохранить", :parent => radius_panel
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
  end
  
  describe 'Проверка созданных атрибутов' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'очистить поиск' do
      set_text_field "", :name => "searchtext-", :match => true, :parent => radius_topbar
      tb_button_click :label => "Показать", :match => true, :parent => radius_topbar
    end
    
    it 'сравнить грид' do
      radius_grid.test_data [
        { :cols => [ "Атрибут", "RADIUS code", "Значение", "Описание" ], :headers => true },
        { :cols => [ radius_data[0][4], radius_data[0][3], radius_data[0][5], radius_data[0][0] ], :visible => false },
        { :cols => [ radius_data[1][4], radius_data[1][3], radius_data[1][5], radius_data[1][0] ], :visible => false }
      ]
    end
  end
  
  describe 'Удаление атрибутов' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'удалить описание Атрибут Октябренка' do
      radius_grid.select_shift [ radius_data[0][0] ], :where => "Описание", :match => true, :select => true
      tb_menu_click "Действия", "Удалить", :parent => radius_panel
      
      if !message_box?("Удаление", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
      
      radius_grid.count_rows 1
    end
    
    it 'удалить описание Атрибут Пионера' do
      radius_grid.select_shift [ radius_data[1][0] ], :where => "Описание", :match => true, :select => true
      tb_menu_click "Действия", "Удалить", :parent => radius_panel
      
      if !message_box?("Удаление", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
      
      radius_grid.count_rows 0
    end
  end
end

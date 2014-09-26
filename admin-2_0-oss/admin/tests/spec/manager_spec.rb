# encoding: UTF-8
require 'spec_helper'

describe 'Проверка менеджера' do
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
  
  describe 'Перейти в раздел менеджеров' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'Клик: Объекты / Менеджеры' do
      tb_menu_click "Объекты", "Менеджеры", :main_menu => true
    end
  end
  
  describe 'Создать менеджера' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default-framed') and contains(@id, 'ossmanagers-')]") }
    let(:window) { page.find(:xpath, "//div[contains(@class, 'x-window-default') and contains(@id, 'managersform-')]") }
    
    it 'выбрать вкладку Менеджеры' do
      tb_button_click :label => "Менеджеры", :parent => panel
    end
    
    it 'открыть форму создания менеджера' do
      active_tab = get_active_tab_component "Менеджеры", :parent => panel
      tb_menu_click "Действия", "Добавить менеджера", :parent => find("div##{active_tab}")
    end
    
    it 'заполнить поля' do
      set_text_field "Командер Шепард", :label => "ФИО ответственного", :match => true, :parent => window
      set_text_field "integrity", :label => "Логин", :match => true, :parent => window
      set_text_field "integrity", :label => "Пароль", :match => true, :parent => window
      set_text_field "/home/integrity", :label => "Папка кассового аппарата", :match => true, :parent => window
     set_text_field "integrity", :label => "Идентификатор во внешней системе", :match => true, :parent => window
      set_text_field "integrity@localhost", :label => "Email", :match => true, :parent => window
      set_text_field "737", :label => "Офис", :match => true, :parent => window
      set_text_field "Командер Шепард", :label => "Описание", :match => true, :parent => window
      set_combo_field "Default", :label => "Категория платежа по умолчанию", :match => true, :parent => window
    end
    
    it 'сохранить форму' do
      tb_button_click :label => "Сохранить", :parent => window
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'кликнуть в гриде на созданного менеджера' do
      grid = Grid.new :panelnum => 1, :id => "managerslist-", :match => true
      grid.set_action :column => "ФИО ответственного", :value => "Командер Шепард", :css => "x-ibtn-edit"
    end
    
    it 'проверить поля' do
      validate_text_field "Командер Шепард", :label => "ФИО ответственного", :match => true, :parent => window
      validate_text_field "integrity", :label => "Логин", :match => true, :parent => window
      validate_text_field "", :label => "Пароль", :match => true, :parent => window
      validate_text_field "/home/integrity", :label => "Папка кассового аппарата", :match => true, :parent => window
      validate_text_field "integrity", :label => "Идентификатор во внешней системе", :match => true, :parent => window
      validate_text_field "integrity@localhost", :label => "Email", :match => true, :parent => window
      validate_text_field "737", :label => "Офис", :match => true, :parent => window
      validate_text_field "Командер Шепард", :label => "Описание", :match => true, :parent => window
      validate_combo_field "Default", :label => "Категория платежа по умолчанию", :match => true, :parent => window
      
      win = Window.new :title => "Редактировать менеджера"
      win.close
    end
    
    it 'удалить менеджера' do
      grid = Grid.new :panelnum => 1, :id => "managerslist-", :match => true
      grid.set_action :column => "ФИО ответственного", :value => "Командер Шепард", :css => "x-ibtn-delete"
      if !message_box?("Удаление", "хотите удалить", :click => "Yes")
        raise Capybara::CapybaraError.new("Нет подтверждения перед удалением пользователя")
      end
      
      sleep 1
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Сервер вернул сообдение об ошибке")
      end
    end
  end
  
end

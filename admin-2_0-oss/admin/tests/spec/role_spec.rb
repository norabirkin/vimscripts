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
  
  describe 'Создать роль' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:panel) { page.find(:xpath, "//div[contains(@class, 'x-panel-default-framed') and contains(@id, 'ossmanagers-')]") }
    let(:window) { Window.new :title => "Добавить роль", :autoinit => false }
    let(:window_edit) { Window.new :title => "Редактировать роль", :autoinit => false }
    let(:grid) { Grid.new :panelnum => 1, :id => "roleslist-", :match => true }
    
    it 'выбрать вкладку Роли' do
      tb_button_click :label => "Роли", :parent => panel
    end
    
    it 'открыть форму создания роли' do
      active_tab = get_active_tab_component "Роли", :parent => panel
      tb_menu_click "Действия", "Добавить роль", :parent => find("div##{active_tab}")
    end
    
    it 'заполнить поля' do
      win = window.init
      
      set_text_field "Роль Шепарда", :label => "Имя", :match => true, :parent => win.component
      set_text_field "Эта роль для Шепарда. Он крут", :label => "Описание", :match => true, :parent => win.component
    end
    
    it 'сохранить форму' do
      tb_button_click :label => "Сохранить", :parent => window.component
      
      if message_box?("Ошибка", :click => "OK")
        if window.exists?
          window.init.close
        end
        
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'кликнуть в гриде на созданную роль' do
      grid.set_action :column => "Имя", :value => "Роль Шепарда", :css => "x-ibtn-edit"
    end
    
    it 'проверить поля' do
      win = window_edit.init
      
      validate_text_field "Роль Шепарда", :label => "Имя", :match => true, :parent => win.component
      validate_text_field "Эта роль для Шепарда. Он крут", :label => "Описание", :match => true, :parent => win.component
      
      win.close
    end
    
    it 'удалить роль' do
      grid.set_action :column => "Имя", :value => "Роль Шепарда", :css => "x-ibtn-delete"
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

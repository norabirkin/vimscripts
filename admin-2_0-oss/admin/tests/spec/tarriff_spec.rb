# encoding: UTF-8
require 'spec_helper'

describe 'Проверка формы тарифа' do
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
  
  describe 'Перейти в раздел тарифов' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    it 'Клик: Свойства / Тарификация / Тарифы' do
      tb_menu_click "Свойства", "Тарификация", "Тарифы", :main_menu => true
    end
  end
  
  describe 'Новый тариф' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:grid) { Grid.new :title => "Тарифы" }
    let(:grid_topbar) { page.find(:xpath, "//div[contains(@class, 'x-grid-with-row-lines') and contains(@id, 'tariffs_list')]//div[contains(@class, 'x-toolbar-docked-top')]") }
    let(:form_main) { page.find(:xpath, "//div[contains(@class, 'x-panel-body-default') and contains(@id, 'body') and contains(@id, 'tariff_form')]") }
    let(:form_main_topbar) { page.find(:xpath, "//div[contains(@class, 'x-panel-body-default') and contains(@id, 'body') and contains(@id, 'tariff_form')]//div[contains(@class, 'x-toolbar-docked-top')]", :visible) }
    
    it 'открыть форму создания тарифа' do
      if has_xpath?("//div[contains(@class, 'x-panel-body-default') and contains(@id, 'body') and contains(@id, 'tariff_form')]", :visible => true)
        tb_button_click :css => 'x-ibtn-prev', :parent => form_main_topbar
        
        message_box? "Переход к списку", "данные формы будут утеряны", :click => "Yes"
      end
      
      tb_menu_click "Действия", "Добавить", :parent => grid_topbar
    end
    
    it 'проверить установленную валюту в поле Валюта' do
      validate_combo_field ".{1,}", ".{1,}", :rawexpect => "match", :valueexpect => "match", :parent => form_main, :label => "Валюта", :match => true
    end
    
    it 'заполнить обязательные поля формы' do
      set_combo_field "Услуги", :label => "Тип тарифа", :parent => form_main, :match => true
      set_combo_field "RUR", :label => "Валюта", :parent => form_main, :match => true
      set_text_field "Автотест, тип: Услуги", :label => "Описание", :parent => form_main, :match => true
      set_combo_field "Комбинированно", :label => "Предоплаченой услуги", :parent => form_main, :match => true
      set_combo_field "Нет (предоплата)", :label => "Блокировка услуги", :parent => form_main, :match => true
    end
    
    it 'сохранить тариф' do
      tb_menu_click "Действия", "Сохранить настройки", :parent => form_main_topbar
      
      if message_box?("Ошибка", :click => "OK")
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
    
    it 'вернуться к списку тарифов' do
      tb_button_click :css => "x-ibtn-prev", :parent => form_main_topbar, :match => true
    end
    
    it 'найти созданный тариф' do
      sleep 1
      set_text_field "Автотест, тип: Услуги", :name => "searchtext", :match => true, :parent => grid_topbar
      tb_button_click :label => "Показать", :parent => grid_topbar, :match => true
      
      sleep 1
      grid.test_data [
        { :cols => ["Описание", "Учетные записи"], :headers => true },
        { :cols => ["Автотест, тип: Услуги", "0"] }
      ]
    end
    
    
    #it 'найти созданный тариф' do
    #  set_text_field "taross-5", :name => "searchtext", :match => true, :parent => grid_topbar
    #  tb_button_click :label => "Показать", :parent => grid_topbar, :match => true
    #  grid.set_action :column => "Описание", :value => "taross-5", :css => "x-ibtn-edit"
    #  tb_button_click :label => "Категории", :match => true
    #  
    #  categoriesId = Capybara::page.execute_script("var A = Ext.ComponentQuery.query('grid#categoriesGrid'); if(A.length == 1) { return A[0].getId() } return null;")
    #  
    #  if categoriesId == nil
    #    raise Capybara::ElementNotFound.new("Не найден грид категорий в менеджере компонентов фреймворка")
    #  end
    #  
    #  categories = Grid.new :id => categoriesId
    #  selected = categories.select_shift :all => 2, :select => true
    #  
    #  puts selected
    #  
    #  if selected > 1
    #    raise Capybara::CapybaraError.new("В один момент может быть выбрана только одна категория")
    #  end
    #  
    #  sleep 4
    #end
  end
  
end
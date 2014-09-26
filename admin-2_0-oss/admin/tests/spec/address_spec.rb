# encoding: UTF-8
require 'spec_helper'

describe 'Проверка адреса' do
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
  
  let(:container) { page.find(:xpath, "//div[contains(@id, 'container-') and ./label[contains(text(), 'Юридический адрес')]]") }
  let(:w_address) { Window.new :title => "Адреса", :autoinit => false }
  let(:t_bar) { within(w_address.init.component) do find(:xpath, ".//div[contains(@class, 'x-toolbar-docked-top')]", :visible => true ) end}
  
  let(:address) { [ "Вуаль Персея", "Раннох", "Рох", "Квартария", "Кварт", "Таллис", "1" ] }
  let(:labels) { ["Страна", "Регион", "Район", "Город", "Населенный пункт", "Улица", "Дом"] }
  let(:names) { [ "country", "region", "area", "city", "settle", "street", "building" ] }
  let(:means) { [ nil, "Область", "Автономный округ", "Город", "Хутор", "Улица", "Дом" ] }
  
  describe 'Перейти в раздел пользователей' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end
    
    let(:grid_topbar) { page.find(:xpath, "//div[contains(@class, 'x-grid-with-row-lines') and contains(@id, 'users_list')]//div[contains(@class, 'x-toolbar-docked-top')]") }
    
    it 'Клик: Объекты / Пользователи' do
      tb_menu_click "Объекты", "Пользователи", :main_menu => true
    end
    
    it 'открыть форму пользователя' do
      tb_menu_click "Действия", "Создать", :parent => grid_topbar
    end
  end
  
  describe 'Новый адрес' do
    it 'открыть окно адресов' do
      tb_menu_click "css:x-ibtn-address", "Изменить", :match => true, :parent => container
    
      if !w_address.exists? 
        raise Capybara::ElementNotFound.new("Окно адресов не найдено")
      end
    end
    
    it 'создать новый адрес' do
      tb_menu_click "Действия", "Создать новую запись", :match => true, :parent => t_bar
    end
    
    it 'заполнить поля' do
      win = w_address.init
      
      labels.each_with_index do |label, index|
        cc = get_fieldcontainer :label => label, :match => true, :parent => win.component
        
        if means[index] != nil
          set_combo_field means[index], :name => "%s_meaning" % [ names[index] ], :match => true, :parent => cc
        end
        
        set_search_field address[index], :name => "%s_id" % [ names[index] ], :match => true, :trigger => false, :parent => cc, :delay => 0.7
      end
    end
    
    it 'сохранить адрес' do
      tb_menu_click "Действия", "Сохранить", :match => true, :parent => t_bar
      
      if message_box?("Ошибка", :click => "OK")
        if w_address.exists?
          w_address.init.close
        end
        
        raise Capybara::CapybaraError.new("Действие не выполнено. Произошла ошибка при попытке сохранить")
      end
    end
  end
end
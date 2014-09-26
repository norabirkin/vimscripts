# encoding: UTF-8
require 'spec_helper'

describe 'Проверка авторизации' do
  before(:all) do
    admin_page
    
    if login?
      tb_menu_click "Выход", :main_menu => true
    end
  end
  
  after(:all, :logout => true) do
    if login?
      tb_menu_click "Выход", :main_menu => true
    end
  end
  
  describe 'Проверка неверных данных' do
    before(:each) do
      if ! login?
        raise Capybara::ElementNotFound.new("Отсутствует окно авторизации")
      end
    end
    
    it 'ввод пустого логина и пароля' do
      set_text_field "", :label => 'Логин', :match => true
      set_text_field "", :label => 'Пароль', :match => true
      tb_button_click :label => 'Войти'
      
      if ! login?
        raise Capybara::ElementNotFound.new("Отсутствует окно авторизации")
      end
    end
    
    it 'ввод неверно заполненных логина и пароля' do
      set_text_field "admin_AdMin", :label => 'Логин', :match => true
      set_text_field "Pasword_pswd", :label => 'Пароль', :match => true
      tb_button_click :label => 'Войти'
      
      if ! login?
        raise Capybara::ElementNotFound.new("Отсутствует окно авторизации")
      end
    end
  end
  
  describe 'Проверка верных авторизационных данных' do
    before(:each) do
      if ! login?
        raise Capybara::ElementNotFound.new("Отсутствует окно авторизации")
      end
    end
    
    it 'ввод логина "admin" и пустого пароля' do
      set_text_field "admin", :label => 'Логин', :match => true
      set_text_field "", :label => 'Пароль', :match => true
      tb_button_click :label => 'Войти'
      
      sleep 3
      
      if login?
        raise Capybara::CapybaraError.new("Не авторизован")
      end
    end
  end
end
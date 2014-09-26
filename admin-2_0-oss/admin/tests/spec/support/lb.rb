# encoding: UTF-8

module LB
  class Agents
    include TestHelper
    @@names = []
    def initialize
      @main = '//div[
        contains(
          @class,
          "x-panel-body-default-framed"
        )
        and
        contains(
          @id,
          "agents-"
        )
      ]'
      @common = '//div[
        contains(
          @id,
          "agents_common_settings"
        )
        and
        contains(
          @class,
          "x-panel-body-default-framed"
        )
      ]'
      @tabs = '#agentstabs'
    end
    def enter_section
      tb_menu_click 'Объекты', 'Агенты', :main_menu => true
    end
    def menuitem_create
      tb_menu_click 'Действия', 'Создать новый агент', :parent => Capybara::page.find(:xpath, @main) 
    end
    def combo_field(params)
      set_combo_field params[:value], :label => params[:label], :parent => Capybara::page.find(:xpath, @common), :match => true
    end
    def text_field(params)
      set_text_field params[:value], :label => params[:label], :parent => Capybara::page.find(:xpath, @common), :match => true
    end
    def save
      tb_menu_click 'Действия', 'Сохранить', :parent => Capybara::page.find(:css, @tabs) 
    end
    def back
      tb_button_click :css => 'x-ibtn-prev', :parent => Capybara::page.find(:css, @tabs), :match => true
    end
    def remove(params)
      grid = Grid.new :container => @main
      grid.set_action :column => params[:column], :value => params[:value], :css => 'x-ibtn-delete'
      if !message_box?('Подтверждение', :click => 'Yes')
        raise Capybara::CapybaraError.new('Нет подтверждения')
      end
    end
    def remove_all
      @@names.each do |item|
        self.remove :column => 'Описание', :value => item 
      end
    end
    def create(params)
      self.menuitem_create
      self.combo_field :label => 'Тип', :value => params[:type]
      self.text_field :label => 'Имя', :value => params[:name] 
      self.text_field :label => 'Описание', :value => params[:name] 
      self.save
      self.back
      @@names.push params[:name]
    end
  end
end

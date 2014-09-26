# encoding: UTF-8
require 'spec_helper'

describe 'Раздел "Перерасчет"' do
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

  let(:recalc) do
    Class.new do
      include TestHelper
      include RSpec::Matchers
      def initialize
        @form = '//div[
          contains(
            @class,
            "x-panel"
          )
          and
          contains(
            @id,
            "recalculation-"
          )
        ]
        /div[
          contains(
            @id,
            "form-"
          )
          and
          contains(
            @class,
            "x-panel-default-framed"
          )
        ]'
        @states = {
          0 => {
            'Сохранить тариф' => false,
            'Сохранить владельца' => false,
            'Аренда:' => false,
            'Статистика:' => false,
            'Группа учетных записей:' => false,
            'Агент:' => true,
            'Дата:' => false
          },
          1 => {
            'Сохранить тариф' => false,
            'Сохранить владельца' => false,
            'Аренда:' => true,
            'Статистика:' => true,
            'Группа учетных записей:' => true,
            'Агент:' => true,
            'Дата:' => true
          },
          2 => {
            'Сохранить тариф' => false,
            'Сохранить владельца' => true,
            'Аренда:' => true,
            'Статистика:' => true,
            'Группа учетных записей:' => true,
            'Агент:' => true,
            'Дата:' => true
          },
          3 => {
            'Сохранить тариф' => true,
            'Сохранить владельца' => true,
            'Аренда:' => true,
            'Статистика:' => true,
            'Группа учетных записей:' => true,
            'Агент:' => true,
            'Дата:' => true
          },
          4 => {
            'Сохранить тариф' => false,
            'Сохранить владельца' => false,
            'Аренда:' => false,
            'Статистика:' => true,
            'Группа учетных записей:' => true,
            'Агент:' => true,
            'Дата:' => true
          }
        }
      end
      def state(i)
        @states[i]
      end
      def form
        @form
      end
      def test_agent(agent, statistics = nil)
        if !statistics
          statistics = {
            'Нет' => 1,
            'Перерасчет' => 2,
            'Откат' => 1
          }
        end
        self.agent agent
        statistics.each do |key, value|
          self.statistics key, statistics.keys
          self.enabled @states[value]
          if key == 'Откат'
            Capybara::page.has_xpath?("#{@form}//label[
              contains(
                text(),
                'Статистика будет удалена! Убедитесь в том, что у Вас есть данные для повторной заливки'
              )
            ]").should be_true
          end
          if value == 3
            validate_text_field 'Да', :parent => Capybara::page.find(:xpath, @form), :label => 'Сохранить владельца', :match => true
            self.check_owner 'Нет'
            validate_text_field 'Да', :parent => Capybara::page.find(:xpath, @form), :label => 'Сохранить владельца', :match => true
          end
          if value == 2
            self.check_owner 'Да'
            self.enabled @states[3]
          end
        end
      end
      def enter_section
        tb_menu_click 'Действия', 'Перерасчет', :main_menu => true
      end
      def combo_field(params)
        set_combo_field params[:value], :label => params[:label], :parent => Capybara::page.find(:xpath, @form), :match => true, :options => params[:options]
      end
      def agent(value)
        self.combo_field :value => value, :label => 'Агент'
      end
      def check_owner(value)
        set_text_field value, :label => 'Сохранить владельца', :parent => Capybara::page.find(:xpath, @form), :match => true
      end
      def statistics(value, options)
        self.combo_field :value => value, :label => 'Статистика', :options => options 
      end
      def enabled(params)
        params.each do |key, value|
          disabled = field_disabled? :label => key, :parent => Capybara::page.find(:xpath, @form)
          if value
            disabled.should be_false
          else
            disabled.should be_true
          end
        end
      end
    end
  end

  describe 'Проверка доступности полей формы' do
    before do
      if login?
        raise Capybara::ElementNotFound.new("Не авторизован")
      end
    end

    it 'Создаю агенты' do
      a = LB::Agents.new
      a.enter_section
      a.create :name => 'testing-agent-type-ethernet', :type => 'Ethernet / PCAP'
      a.create :name => 'testing-agent-type-radius', :type => 'RADIUS'
      a.create :name => 'testing-agent-type-telephony', :type => 'PCDR / PABX'
      a.create :name => 'testing-agent-type-voip', :type => 'VoIP'
      a.create :name => 'testing-agent-type-usbox', :type => 'Услуги'
    end

    it 'Перехожу в раздел "Перерасчет"' do
      r = recalc.new
      r.enter_section
    end

    it 'Проверяю блокировку полей при невыбранном агенте' do
      r = recalc.new
      validate_combo_field '', :parent => page.find(:xpath, r.form), :label => 'Агент:'
      r.enabled(r.state 0)
    end

    it 'Проверяю блокировку полей при выборе агента Ethernet' do
      r = recalc.new
      r.test_agent 'testing-agent-type-ethernet'
    end

    it 'Проверяю блокировку полей при выборе агента RADIUS' do
      r = recalc.new
      r.test_agent(
        'testing-agent-type-radius',
        {
          'Нет' => 1,
          'Перерасчет' => 3,
          'Откат' => 1
        }
      )
    end

    it 'Проверяю блокировку полей при выборе агента PCDR' do
      r = recalc.new
      r.test_agent 'testing-agent-type-telephony'
    end

    it 'Проверяю блокировку полей при выборе агента VoIP' do
      r = recalc.new
      r.test_agent 'testing-agent-type-voip'
    end

    it 'Проверяю блокировку полей при выборе агента UsBox' do
      r = recalc.new
      r.test_agent(
        'testing-agent-type-usbox',
        {
          'Нет' => 4,
          'Перерасчет' => 4
        }
      )
    end

    it 'Удаляю агенты' do
      a = LB::Agents.new
      a.enter_section
      a.remove_all
    end
  end
end

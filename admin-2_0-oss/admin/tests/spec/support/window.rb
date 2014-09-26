# encoding: UTF-8

class Window
  include Capybara::DSL
  
  @c_path = nil
  @component = nil
  @visible = nil
  
  # options
  #    :panelnum - grid panel index in the DOM. The first DOM index is 1, do not set 0 as the first
  #    :id - grid panel id
  #    :title - grid panel title
  #    :match - true to use contains function (default false)
  #    :autoinit - true to find element at initialize process, false - just create path pattern
  #
  # Usage
  #    Title search  
  #    win = Window.new :title => "Пользователи"
  #
  #    Find first with id
  #    win = Window.new :panelnum => 0, :id => "managers-", :match => true
  def initialize (options = {})
    @visible = (!!options[:visible] == options[:visible]) ? options[:visible] : true
    autoinit = (!!options[:autoinit] == options[:autoinit]) ? options[:autoinit] : true
    
    if options[:panelnum]
      search_pattern = options[:id] ? 'and ' + attribute_match_pattern('@id', options[:id], options[:match]) : ''
      @c_path = "(//div[contains(@class, 'x-window-default') #{search_pattern}])[#{options[:panelnum]}]"
    elsif options[:id]
      search_pattern = attribute_match_pattern "@id", options[:id], options[:match]
      @c_path = "//div[#{search_pattern}]"
    elsif options[:title]
      search_pattern = attribute_match_pattern "text()", options[:title], options[:match]
      @c_path = "//div[contains(@class, 'x-window-default') and ./div[contains(@class, 'x-window-header') and .//div[contains(@class, 'x-header-text-container') and .//span[#{search_pattern}]]]]"
    end
    
    if @c_path == nil
      raise Capybara::ElementNotFound.new("Could not create any selector according to the passed options")
    end
    
    init if autoinit
  end
  
  
  # Check if component exists
  def exists?
    page.has_xpath?(@c_path, :visible => @visible)
  end
  
  
  # Click on close tool bar
  def close
    within(@component) do
      if !has_css?("img.x-tool-close")
        raise Capybara::ElementNotFound.new("Window is not closable")
      end
      
      find(:css, "img.x-tool-close").click
    end
  end
  
  
  # Create component
  def init
    if !exists?
      raise Capybara::ElementNotFound.new("Unable to find window with selector #{@c_path}")
    end
      
    @component = page.first(:xpath, @c_path, :visible => @visible)
    
    self
  end
  
  
  # Return component
  def component
    @component
  end
  
  private
  
  def attribute_match_pattern(attribute, value, match = false)
    if attribute == nil || value == nil
      raise Capybara::CapybaraError.new("Expected attribute name and value")
    end
    
    return match == true ? ("contains(#{attribute}, '#{value}')") : 
      ("#{attribute} = '#{value}'")
  end
end

# encoding: UTF-8

module TestHelper
  include Capybara::DSL
  
  def admin_page
    web_path = ENV['admin_path'] || '/admin'
    
    visit web_path
    
    if page.has_content?('not found')
      raise Capybara::ElementNotFound.new("Unable to open page #{web_path}")
    end
  end
  
  def login?
    if !page.has_xpath?('//div[contains(@class, "x-window-authorize")]', :visible => true)
      return false
    end
    
    return true
  end
  
  def authorize(login, password)
    if self.login?
      set_text_field login, :label => 'Логин', :match => true
      set_text_field password, :label => 'Пароль', :match => true
      tb_button_click :label => 'Войти', :match => true
      
      if login?
        raise Capybara::CapybaraError.new("Manager #{login} is not authorized")
      end
    end
  end
  
  
  # Set text field value
  # @param:
  #   value to set to
  #   options
  #    :parent - node point to look in
  #    :label - search field by its label
  #    :name - by the attribute input field
  #    :match - use use substring search instead of equal (default false)
  def set_text_field (value, options = {})
    (field, within_parent) = find_field options
    
    within(within_parent) do
      field = field.find(:xpath, ".//*[local-name() = 'input' or local-name() = 'textarea']")
      
      if (field.tag_name == 'input' && 
        (field[:type] == 'text' || field[:type] == 'password')) ||
        field.tag_name == 'textarea'
      then
          field.set(value)
      elsif field.tag_name == 'input' && has_css?('input.x-form-checkbox')
        if (value == 'Да' && !has_css?('x-form-cb-checked')) ||
           (value = 'Нет' && has_css?('x-form-cb-checked'))
        then
          field.click
        end
      else
        raise Capybara::CapybaraError.new("Unsupported type '#{field[:type]}' for the field '#{field[:id]}'")
      end
    end
  end
  

  # Set combobox field value
  # @param
  #  value to select in the list
  #  options
  #    :parent - node point to look in
  #    :label - search field by its label
  #    :name - by the attribute input field 
  #    :options - array of options that combo expects to contain
  def set_combo_field (value, options = {})
    (combo, within_parent) = find_combo options
    
    within(within_parent) do
      within(combo) do
        find(:xpath, ".//div[@role = 'button']", :visible => true).click
        
        wait_for_ajax
        
        me = find(:xpath, ".")
        pickerId = Capybara::page.execute_script("return Ext.getCmp('#{me[:id]}').picker.getId()")
        
        if options[:options]
          page.all(:xpath, "//div[@id = '#{pickerId}']//li").count().should eql options[:options].count
          options[:options].each do |item|
            has_xpath? "//div[@id = '#{pickerId}']//li[text() = '#{item}']"
          end
        end

        page.find(:xpath, "//div[@id = '#{pickerId}']//li[text() = '#{value}']").click
      end
    end
  end
  
  
  # Set combobox field value if element is configured as search
  # @param
  #  value - is raw value
  #  options
  #    :parent - node point to look in
  #    :label - search field by its label
  #    :name - by the attribute input field
  #    :delay - sleep after value set
  #    :wait - false to not check an wait ajax
  def set_search_field (value, options = {})
    (combo, within_parent) = find_combo options
    
    within(within_parent) do
      within(combo) do
        if options[:trigger] == nil || options[:trigger] === true
          find(:xpath, ".//div[@role = 'button']", :visible).click
        end
        
        find(:xpath, ".//input[@type = 'text']").set value
        if options[:delay] && options[:delay].is_a?(Integer) && options[:delay] > 0
          sleep options[:delay]
        end
                
        if options[:wait] == nil || options[:wait] === true
          wait_for_ajax
        end
        
        label = if options[:test] then options[:test] elsif options[:select] then options[:select] else nil end
        
        if label != nil
          me = find(:xpath, ".")
          pickerId = Capybara::page.execute_script("return Ext.getCmp('#{me[:id]}').picker.getId()")
          pattern = "//div[@id = '%s']//li[%s]" % [ pickerId, attribute_match_pattern("text()", label, options[:match]) ]
          
          if options[:test]
            return has_xpath?(pattern)
          elsif options[:select]
            page.find(:xpath, pattern).click
          end
        end
      end
    end
  end
  
  
  # Click button
  # @param
  #  options
  #    :parent - node point to look in
  #    :label - search field by its label
  #    :css - search by css
  #    :match - use substring search instead of equal (default false)
  def tb_button_click(options = {})
    button = nil
    
    within_parent = options[:parent] || get_root_element
    
    within(within_parent) do
      if options[:label]
        search_pattern = attribute_match_pattern "text()", options[:label], options[:match]
        button = find(:xpath, ".//a[@role = 'button' and .//span[#{search_pattern}]]", :visible => true)
      elsif options[:css]
        search_pattern = attribute_match_pattern "@class", options[:css], options[:match]
        button = find(:xpath, ".//a[@role = 'button' and .//span[#{search_pattern}]]", :visible => true)
      end
      
      button.click
      
      if options[:wait] == nil || options[:wait] === true
        wait_for_ajax
      end
    end
  end
  
  # Click menu button
  # @param
  #  arguments - labels or css of buttons
  #    To pass css in item "css:x-ibtn-edit" otherwise label "Действия"
  #  options (should be last)
  #    :parent - node point to look in
  #    :main_menu - points to main page menu
  #    :match - use substring search instead of equal (default false)
  #    :wait - false to not check an wait ajax
  def tb_menu_click(*args)
    if args.empty?
      raise Capybara::CapybaraError.new("Empty arguments passed")
    end
    
    options = if args.last.is_a?(Hash) then args.pop.dup else {} end
    within_parent = options[:parent] || get_root_element
    
    if options[:main_menu] == true
      within_parent = page.find(:xpath, "//div[contains(@class, 'x-panel-oss-app-menu')]", :visible)
    end
    
    within(within_parent) do
      itemId = nil
      
      args.each_with_index do |label, idx|
        css = css_pattern?(label)
        pattern = "//div[@id = '%s']//div[contains(@class, 'x-menu-item') and .//%s[%s]]"
        
        if idx == 0
          pattern = ".//a[@role = 'button' and .//span[%s]]"
          
          
          if css != nil
            pattern = pattern % [ "@role='img' and " + attribute_match_pattern("@class", css, options[:match]) ]
          else
            pattern = pattern % [ attribute_match_pattern("text()", label, options[:match]) ]
          end
          
          button = find(:xpath, pattern, :visible => true)
          button.click
          
          next if args.length < 2
          
          itemId = Capybara::page.execute_script("return Ext.getCmp('#{button[:id]}').menu.getId()")
          
          next
        end
        
        if css != nil
          pattern = pattern % [ itemId, "div", "@role='img' and " + attribute_match_pattern("@class", css, options[:match]) ]
        else
          pattern = pattern % [ itemId, "span", attribute_match_pattern("text()", label, options[:match]) ]
        end
        
        item = page.find(:xpath, pattern, :visible => true)
        
        if args.last == label
          item.first('a').click
          
          if options[:wait] == nil || options[:wait] === true
            wait_for_ajax
          end
        else
          item.first('a').hover
          itemId = Capybara::page.execute_script("return Ext.getCmp('#{item[:id]}').menu.getId()")
        end
      end
    end
  end
  
  
  # Remove message: accept or reject
  # @param
  #    box title
  #    box content
  #    options:
  #       :click - button text
  #
  # Usage:
  #    if message_box?("Error", :click => Yes)
  #      ... rais here error
  #    end
  def message_box?(*args)
    if args.length == 0
      raise Capybara::CapybaraError.new("Expected arguments")
    end
    
    options = if args.last.is_a?(Hash) then args.pop.dup else {} end
    box = "//div[contains(@class, 'x-message-box') and ./div[contains(@class, 'x-window-header') and .//*[contains(text(), '#{args[0]}')]]]"
    ok = false
    
    if page.has_xpath?(box, :visible => true)
      if args.length == 2 
        within(:xpath, box, :visible => true) do
          if has_xpath?(".//*[contains(text(), '#{args[1]}')]")
            ok = true
          end
        end
       else
         ok = true
      end
    end
    
    if ok == true && options[:click]
      tb_button_click :label => options[:click], :parent => find(:xpath, box, :visible => true)
    end
    
    return ok
  end
  
  
  # Validate combobox value
  # @param
  #    raw_value - visible element value
  #    in_value - hidden element value
  #    options
  #      :parent - parent element to look in
  #      :label - search element by field label
  #      :name - search element by field name (hidden input)
  #      :rawexpect - match or exect
  #      :valueexpect - match or exect
  def validate_combo_field (*args)
    if args.length == 0
      raise Capybara::CapybaraError.new("Expected arguments")
    end
    
    raw_value = if args.first.is_a?(String) || args.first.is_a?(Integer) then args.shift else nil end
    in_value = if args.first.is_a?(String) || args.first.is_a?(Integer) then args.shift else nil end
    
    if !raw_value && !in_value
      raise Capybara::CapybaraError.new("Expected element raw value as first argument or second argument as original value")
    end
    
    options = if args.last.is_a?(Hash) then args.pop.dup else {} end
    (combo, within_parent) = find_combo options
    
    within(within_parent) do
      within(combo) do
        if raw_value != nil
          el_raw_value = find(:xpath, ".//input[@type = 'text']").value
          match_exect el_raw_value, raw_value, options[:rawexpect]
        end
        
        # !! USE :visible => false, element is _covered_ with display:none
        if in_value != nil
          if !has_xpath?(".//input[@type = 'hidden']", :visible => false)
            raise Capybara::ElementNotFound.new("Expected original value '#{in_value}' but input element not found")
          end
          
          el_value = combo.find(:xpath, ".//input[@type = 'hidden']", :visible => false).value
          match_exect el_value, in_value, options[:valueexpect]
        end
      end
    end
  end
  
  
  # Validate if combobox is readonly
  # @param
  #    options
  #      :parent - parent element to look in
  #      :label - search element by field label
  #      :name - search element by field name (hidden input)
  def combo_field_radonly? (options = {})
    (combo, within_parent) = find_combo options
    
    within(within_parent) do
      within(combo) do
        return has_xpath?(".//div[@role = 'button']", :visible) && has_xpath?(".//input[@type = 'text' and @readonly]", :visible) ? true : false
      end
    end
  end
  
  
  # Validate text / textarea / checkbox value
  # @param
  #    value - visible element value
  #    options
  #      :parent - parent element to look in
  #      :label - search element by field label
  #      :name - search element by field name (hidden input)
  #      :match - use use substring search instead of equal (default false)
  #      :expect - match or exect
  def validate_text_field (*args)
    if args.length == 0
      raise Capybara::CapybaraError.new("Expected arguments")
    end
    
    options = if args.last.is_a?(Hash) then args.pop.dup else {} end
    value = if args.first.is_a?(String) || args.first.is_a?(Integer) then args.shift else nil end
    (field, within_parent) = find_field options
    
    if !value
      raise Capybara::CapybaraError.new("Expected element value as first argument")
    end
    
    within(within_parent) do
      field = field.find(:xpath, ".//*[local-name() = 'input' or local-name() = 'textarea']")
      
      if (field.tag_name == 'input' && 
        (field[:type] == 'text' || field[:type] == 'password')) ||
        field.tag_name == 'textarea'
      then
        match_exect field.value, value, options[:expect]
      elsif field.tag_name == 'input' && has_css?('input.x-form-checkbox')
        if value == 'Да' && !has_css?('.x-form-cb-checked')
          raise Capybara::CapybaraError.new("Expected checked element but not found")
        elsif value == 'Нет' && has_css?('.x-form-cb-checked')
          raise Capybara::CapybaraError.new("Expected unchecked element but not found")
        end
      else
        raise Capybara::CapybaraError.new("Unsupported type '#{field[:type]}' for the field '#{field[:id]}'")
      end
    end
  end
  
  
  # Return active table container ID
  # @param
  #    label - active tab lable
  #    options
  #      :parent - parent element to look in
  #      :match - use use substring search instead of equal (default false)
  def get_active_tab_component(label, options = {})
    panelId = nil
    within_parent = options[:parent] || get_root_element
    
    within(within_parent) do
      search_pattern = attribute_match_pattern "text()", label, options[:match]
      tab = page.find(:xpath, ".//a[@role = 'button' and .//span[contains(@class, 'x-tab-inner') and #{search_pattern}]]", :visible => true)
      panelId = Capybara::page.execute_script("var A; if((A = Ext.getCmp('#{tab[:id]}').up().up().getActiveTab())) { return A.getId() } return null;")
    end
    
    if !panelId
      raise Capybara::ElementNotFound.new("Unable to find active tab item component #{label}")
    end
    
    return panelId
  end
  
  
  # Wait until requests will be finished
  def wait_for_ajax
    counter = 0
    time_to_sleep = 0.7
    
    sleep time_to_sleep
    
    while page.execute_script("return OSS.helpers.Connection.get()").to_i > 0
      counter += 1
      sleep time_to_sleep
      
      raise "AJAX request took longer than 180 seconds." if counter >= 360
    end
  end
  
  
  # Get fieldcontainer
  # @param
  #    options
  #      :label - container label
  #      :parent - parent element to look in
  #      :match
  def get_fieldcontainer(options = {})
    within_parent = options[:parent] || get_root_element
    
    search_pattern = attribute_match_pattern "text()", options[:label], options[:match]
    pattern = ".//table[contains(@class, 'x-form-fieldcontainer') and ./tbody/tr/td/label[#{search_pattern}]]"
    
    within(within_parent) do
      if has_xpath?(pattern, :visible => true)
        all(:xpath, pattern, :visible => true).first
      else
        raise Capybara::ElementNotFound.new("Unable to find component #{pattern}")
      end
    end
  end
  
  
  # Get fieldset
  # @param
  #    options
  #      :label - container label
  #      :parent - parent element to look in
  #      :match
  def get_fieldset(options = {})
    within_parent = options[:parent] || get_root_element
    
    search_pattern = attribute_match_pattern "text()", options[:label], options[:match]
    pattern = ".//fieldset[./legend//div[#{search_pattern}]]"
    
    within(within_parent) do
      if has_xpath?(pattern, :visible => true)
        all(:xpath, pattern, :visible => true).first
      else
        raise Capybara::ElementNotFound.new("Unable to find component #{pattern}")
      end
    end
  end
  
  private
  
  def get_root_element
    return page.find(:css, "body")
  end

  def selenium_element_html(element)
    return Capybara::page.driver.browser.execute_script('return arguments[0].outerHTML;', element.native)
  end

  def field_disabled?(options = {})
    within (find_field(options)[0]) do
      page.find(:xpath, './/input').disabled?
    end
  end
  
  def find_field(options = {})
    field = nil
    within_parent = options[:parent] || get_root_element
    
    within(within_parent) do
      if options[:label]
        search_pattern = attribute_match_pattern "text()", options[:label], options[:match]
        if !has_xpath?(".//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and .//label[#{search_pattern}]]]", :visible)
          pattern = ".//table[contains(@class, 'x-form-fieldcontainer') and .//label[#{search_pattern}]]//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and ./td[contains(@id, 'textfield')]]][1]"
          if has_xpath?(pattern)
            field = find(:xpath, pattern)
          else
            raise Capybara::ElementNotFound.new("Could not find field element with label '#{options[:label]}'")
          end
        else
          field = find(:xpath, ".//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and .//label[#{search_pattern}]]]", :visible)
        end
      elsif options[:name]
        search_pattern = attribute_match_pattern "@name", options[:name], options[:match]
        field = find(:xpath, ".//table[contains(@class, 'x-field') and ./tbody/tr[ @class='x-form-item-input-row' and ./td//input[#{search_pattern}] ]]", :visible)
      else
        raise Capybara::CapybaraError.new("Unknown search. Supported: name, label")
      end
    end
    
    return field, within_parent
  end
  
  def find_combo(options = {})
    combo = nil
    within_parent = options[:parent] || get_root_element
    
    within(within_parent) do
      if options[:label]
        search_pattern = attribute_match_pattern "text()", options[:label], options[:match]
        if !has_xpath?(".//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and .//label[#{search_pattern}]]]", :visible)
          pattern = ".//table[contains(@class, 'x-form-fieldcontainer') and .//label[#{search_pattern}]]//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and ./td[contains(@id, 'combobox')]]][1]"
          if has_xpath?(pattern, :visible)
            combo = find(:xpath, pattern, :visible)
          else
            raise Capybara::ElementNotFound.new("Could not find combobox element with label '#{options[:label]}'. #{pattern}")
          end
        else
          combo = find(:xpath, ".//table[contains(@class, 'x-field') and ./tbody/tr[@class='x-form-item-input-row' and .//label[#{search_pattern}]]]", :visible)
        end
      elsif options[:name]
        search_pattern = attribute_match_pattern "@name", options[:name], options[:match]
        combo = find(:xpath, ".//table[contains(@class, 'x-field') and ./tbody/tr[ @class='x-form-item-input-row' and ./td//input[(@type = 'text' or @type = 'hidden') and #{search_pattern}] ]]", :visible)
      else
        raise Capybara::CapybaraError.new("Unknown search. Supported: name, label")
      end
    end
    
    return combo, within_parent
  end
  
  def attribute_match_pattern(attribute, value, match = false)
    if attribute == nil || value == nil
      raise Capybara::CapybaraError.new("Expected attribute name and value")
    end
    
    return match == true ? ("contains(#{attribute}, '#{value}')") : 
      ("#{attribute} = '#{value}'")
  end
  
  def match_exect(value_a, value_b, method)
    if method == 'match'
      value_a.should match(/#{value_b}/)
    else
      value_a.should eq value_b
    end
  end
  
  def css_pattern?(value)
    css = value[/^css:(.*)/, 1]
  end
end

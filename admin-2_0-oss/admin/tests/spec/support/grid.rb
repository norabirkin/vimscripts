# encoding: UTF-8

class Grid
  include Capybara::DSL
  
  @c_path = nil
  @component = nil
  @columns = nil
  
  # options
  #    :panelnum - grid panel index in the DOM. The first DOM index is 1, do not set 0 as the first
  #    :id - grid panel id
  #    :title - grid panel title
  #    :container - direct parent of grid panel
  #    :match - true to use contains function (default false)
  #
  # Usage
  #    Title search  
  #    grid = Grid.new :title => "Пользователи"
  #
  #    Find first with id
  #    grid = Grid.new :panelnum => 0, :id => "managers-", :match => true
  def initialize (options = {})
    if options[:container]
      @c_path = "#{options[:container]}/div[contains(@class, 'x-grid') and contains(@class, 'x-panel-default')]"
    elsif options[:panelnum]
      search_pattern = options[:id] ? 'and ' + attribute_match_pattern('@id', options[:id], options[:match]) : ''
      @c_path = "(//div[contains(@class, 'x-grid') and contains(@class, 'x-panel-default') #{search_pattern}])[#{options[:panelnum]}]"
    elsif options[:id]
      search_pattern = attribute_match_pattern "@id", options[:id], options[:match]
      @c_path = "//div[contains(@class, 'x-grid') and contains(@class, 'x-panel-default') and #{search_pattern}]"
    elsif options[:title]
      search_pattern = attribute_match_pattern "text()", options[:title], options[:match]
      @c_path = "//div[contains(@class, 'x-panel-default') and ./div[contains(@class, 'x-panel-header') and .//div[contains(@class, 'x-header-text-container') and .//span[#{search_pattern}]]]]//div[contains(@class, 'x-grid') and contains(@class, 'x-panel-default')]"
    end
    
    visible = (!!options[:visible] == options[:visible]) ? options[:visible] : true
    
    if !page.has_xpath?(@c_path, :visible => visible)
      raise Capybara::ElementNotFound.new("Unable to find panel with selector #{@c_path}")
    end
    
    @component = page.first(:xpath, @c_path, :visible => visible)
    
    within(@component) do
      if has_xpath?("./div[contains(@class, 'x-grid-header-ct-default')]")
        @columns = Hash.new
        
        # %w() as a word array
        # %r() is another way to write a regular expression.
        # %q() is another way to write a single-quoted string (and can be multi-line, which is useful)
        # %Q() gives a double-quoted string
        # %x() is a shell command
        # %i() gives an array of symbols (Ruby >= 2.0.0)
        ids = Capybara::page.execute_script(%Q{
          var data = []; 
          Ext.each(Ext.getCmp('#{@component[:id]}').columnManager.getColumns(), function(item) {
            var title;
            if(item.isCheckerHd) {
              title = 'CheckerHd';
            }
            else if(item.getXType() == 'actioncolumn' && item.itemId) {
              title = item.itemId;
            }
            else if(item.text) {
              title = item.text;
            }
            else {
              return;
            }
            
            this.push(title + '=>' + item.getId());
          }, data);
          return data.join('@@');
        })
        
        ids.split('@@').each do |pair|
          key,value = pair.split('=>')
          @columns[key] = value
        end
      end
    end
  end
  
  # Check if table contains passed data
  # @param
  #    data - array with columns config and rows data
  def test_data (data)
    (headers, data) = get_headers(data)
    
    is_headers = headers.length > 0 ? true : false
    
    within(@component) do
      rows = all(:xpath, ".//table[@role = 'presentation']//tr[@role = 'row']", :visible)
      
      self.count_rows(data.length, :rows => rows)
      
      rows.each_with_index do |row, row_idx|
        data_row = data[row_idx]
        raw = data_row[:cols]
        
        visible = (!!data_row[:visible] == data_row[:visible]) ? data_row[:visible] : true
        
        if is_headers && raw.length != headers.length
          raise Capybara::CapybaraError.new("Rows count does not match")
        end
        
        raw.each_with_index do |value, col_idx|
          within(row) do
            if is_headers
              if !has_xpath?("./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{headers[col_idx]}')]//*[contains(text(), '#{value}')]", :visible => visible)
                raise Capybara::CapybaraError.new "Expected value '#{value}' at row '#{(row_idx + 1)}'"
              end
            else
              if !has_xpath?("./td[@role = 'gridcell']//*[contains(text(), '#{value}')]", :visible => visible)
                raise Capybara::CapybaraError.new "Expected value '#{value}' at row '#{(row_idx + 1)}'"
              end
            end
          end
        end
      end
    end
  end
  
  
  # Use this function to change data in the grid cell (cell editor)
  # Usage:
  # g = Grid.new :title => "Название панели"
  #    g.set_data_in [
  #      { :cols => [ "Опция", "Значение" ], :headers => true, :where => "Опция" },
  #      { :cols => [ "Запретить смену типа пользователя", "Да" ] }
  #    ]
  def set_data_in (data)
    (headers, data, opts) = get_headers(data)
    
    is_headers = headers.length > 0 ? true : false
    
    if !is_headers
      raise Capybara::CapybaraError.new "Expected headers line in the passed configuration"
    end
    
    if !opts[:where]
      raise Capybara::CapybaraError.new "Expected option ':where' as column pointer to search row"
    end
    
    within(@component) do
      data.each do |item|
        if headers.length != item[:cols].length
          raise Capybara::CapybaraError.new "Expected same columns as in headers"
        end
        
        tr = find(:xpath, ".//tr[@role = 'row' and ./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{opts[:where]}') and .//*[contains(text(), '#{item[:cols][opts[:where_idx]]}')]]]")
        
        item[:cols].each_with_index do |value, col_idx|
          next if opts[:where] == headers[col_idx]
          
          td = tr.find(:xpath, "./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{headers[col_idx]}')]")
          
          if td.has_xpath?(".//div[contains(@class, 'x-grid-checkcolumn')]")
            if (td.has_css?("div.x-grid-checkcolumn-checked") && value == "Нет") ||
                !td.has_css?("div.x-grid-checkcolumn-checked") && value == "Да"
              
              td.find(:css, "div.x-grid-checkcolumn").click
            end
          else
            td.click
            
            editorId = Capybara::page.execute_script("return Ext.getCmp('#{@component[:id]}').colModel.getCellEditor(#{columns[colIdx] - 1}, #{rowIdx}).field.getId()")
            editorType = Capybara::page.execute_script("return Ext.getCmp('#{@component[:id]}').columnManager.getHeaderById('#{headers[col_idx]}').getEditor().getXType()")
            
            if editorType == 'combo'
              # TODO: Implement combo value select
            else
              find("input##{editorId}-inputEl").set value
            end
          end
        end
      end
    end
  end
  
  
  # Click on action icon
  # @param
  #    :column - column name to look in
  #    :value - search value
  #    :css - active column class
  #    :strict - raise error if no result (default true)
  #
  # Usage:
  # g = Grid.new :title => "Название панели"
  # g.set_action :column => "Название колонки", :value => "Строка со значением", :css => "x-ibtn-edit"
  def set_action(options = {})
    if !options[:column]
      raise Capybara::CapybaraError.new "Expected option ':column' as column pointer to search row"
    end
    
    if options[:sctrict] == nil
      options[:sctrict] = true
    end  
    
    within(@component) do
      pattern = ".//tr[@role = 'row' and ./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{@columns[options[:column]]}') and .//*[contains(text(), '#{options[:value]}')]]]"
      if options[:sctrict] && !has_xpath?(pattern)
        raise Capybara::CapybaraError.new "Expected rows with value '#{options[:value]}' in column '#{@columns[options[:column]]}'"
      end
      all(:xpath, pattern).each do |row|
        within(row) do find(:css, ".#{options[:css]}").click end
      end
    end
  end
  
  
  # Count grid rows
  # @param:
  #    count - expexted rows
  #    options
  #      :visible - pass false to count hidden (default true)
  #      :column - count rows with column name and value
  #        :name - column name
  #        :value - column value 
  def count_rows (count, options = {})
    if !count.is_a? Integer
      raise Capybara::CapybaraError.new("Passed parameter is not Integer")
    end
    
    visible = (!!options[:visible] == options[:visible]) ? options[:visible] : true
    
    within(@component) do
      if options[:rows].kind_of?(Array)
        rows = options[:rows]
      else
        rows = all(:xpath, ".//table[@role = 'presentation']//tr[@role = 'row']", :visible => visible)
      end
      
      if rows.length != count
        raise Capybara::CapybaraError.new("Expected rows '#{count}', but found #{rows.length}")
      end
    end
  end
  
  
  # Check rows. User this function only with checkbox featured grid
  # @param
  #    data - check rows with values
  #    options
  #       :idx - check row index
  #       :check - false if need to uncheck row (default true)
  #       :where - column name where to look value
  #       :all - check all rows
  def check_rows(*args)
    values = if args.first.is_a?(Array) then args.shift else nil end
    options = if args.first.is_a?(Hash) then args.shift.dup elsif args.length > 1 && args[1].is_a?(Hash) then args[1].dup else nil end
    
    if !values && !options
      raise Capybara::CapybaraError.new("Expected arguments")
    end
    
    if options[:all]
      values = nil
    end
    
    within(@component) do
      if values && values.length > 0
        if !options[:where]
          raise Capybara::CapybaraError.new("Expected column name in :where option")
        end
        
        values.each do |item|
          tr = find(:xpath, ".//tr[@role = 'row' and ./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{@columns[options[:where]]}') and .//*[contains(text(), '#{item}')]]]")
          if options[:check] == true && !tr.has_css?(".x-grid-row-selected")
            tr.find(:css, "div.x-grid-row-checker").click
          elsif options[:check] == false && tr.has_css?(".x-grid-row-selected")
            tr.find(:css, "div.x-grid-row-checker").click
          end
        end
      elsif options[:all] == true
        all(:xpath, ".//tr[@role = 'row']").each do |tr|
          if options[:check] == true && !tr.has_css?(".x-grid-row-selected")
            tr.find(:css, "div.x-grid-row-checker").click
          elsif options[:check] == false && tr.has_css?(".x-grid-row-selected")
            tr.find(:css, "div.x-grid-row-checker").click
          end
        end
      elsif options[:idx] && options[:idx].is_a?(Integer)
        tr = find(:xpath, ".//tr[@role = 'row'][#{options[:idx]}]")
      end
    end
  end
  
  
  # Select grid rows with shift control
  # @param
  #    data - array of values
  #    options
  #      :all - select all or specified amount (default 0 - all)
  #      :select - true to select otherwise unselect (default true)
  #      :where - column name where to look value
  #      :match
  def select_shift(*args)
    values = if args.first.is_a?(Array) then args.shift else nil end
    options = if args.first.is_a?(Hash) then args.shift.dup elsif args.length > 1 && args[1].is_a?(Hash) then args[1].dup else nil end
    
    if !values && !options
      raise Capybara::CapybaraError.new("Expected arguments")
    end
    
    options[:all] ||= nil
    options[:select] = if options[:select] == nil then true else options[:select] end
    
    if options[:all]
      values = nil
    end
    
    within(@component) do
      #Create a selenium-webdriver action builder
      builder = page.driver.browser.action
  
      #Hold control key down
      builder.key_down(:control)
      
      if values && values.length > 0
        if !options[:where]
          raise Capybara::CapybaraError.new("Expected column name in :where option")
        end
        
        values.each do |item|
          search_pattern = attribute_match_pattern "text()", item, options[:match]
          tr = find(:xpath, ".//tr[@role = 'row' and ./td[@role = 'gridcell' and contains(@class, 'x-grid-cell-#{@columns[options[:where]]}') and .//*[#{search_pattern}]]]")
          
          if (tr.has_css?(".x-grid-row-selected") && !options[:select]) ||
            (!tr.has_css?(".x-grid-row-selected") && options[:select])
          then
            builder.click(tr.native)
          end
        end
      elsif options[:all]
        all(:xpath, ".//tr[@role = 'row']").each_with_index do |row, index|
          if options[:all] > 0 && (index + 1) > options[:all]
            break
          end
          
          if (row.has_css?(".x-grid-row-selected") && !options[:select]) ||
            (!row.has_css?(".x-grid-row-selected") && options[:select])
          then
            builder.click(row.native)
          end
        end
      end
      
      #Release control key
      builder.key_up(:control)
  
      #Do the action setup
      builder.perform
    end
    
    return any_selected?
  end
  
  
  # Find if there are selected rows
  def any_selected?
    within(@component) do
      return all(:css, "tr.x-grid-row-selected").count
    end
  end
  
  
  # TODO: This function is not tested. Need more tests
  def count_columns (count, options = {})
    if !count.is_a? Integer
      raise Capybara::CapybaraError.new("Passed parameter is not Integer")
    end
    
    visible = (!!options[:visible] == options[:visible]) ? options[:visible] : true
    
    within(@component) do
      columns = all(:xpath, ".//div[contains(@class, 'x-column-header-default')]", :visible => visible)
      
      if columns.length != count
        raise Capybara::CapybaraError.new("Expected columns '#{count}', but found #{columns.length}")
      end
    end
  end
  
  private
  
  def get_headers (data)
    headers = Array.new
    options = {}
    
    row = data[0]
    
    if row[:headers] == true
      if !row.has_key?(:cols)
        raise Capybara::CapybaraError.new("Columns data not found")
      end
      
      row[:cols].each_with_index do |col, col_idx|
        if @columns.has_key?(col)
          if row[:where] && row[:where] == col
            options[:where] = @columns[col]
            options[:where_idx] = col_idx
          end
          headers.push @columns[col]
        end
      end
      
      data.shift
    end
    
    return headers, data, options
  end
  
  def attribute_match_pattern(attribute, value, match = false)
    if attribute == nil || value == nil
      raise Capybara::CapybaraError.new("Expected attribute name and value")
    end
    
    return match == true ? ("contains(#{attribute}, '#{value}')") : 
      ("#{attribute} = '#{value}'")
  end
end

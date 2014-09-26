require 'rspec'
require 'capybara'
require 'capybara/dsl'
# Requires supporting ruby files with custom matchers and macros, etc,                                                                                                      
# in spec/support/ and its subdirectories.                                                                                                                                  
Dir.glob(File.dirname(__FILE__) + '/support/**/*.rb', &method(:require))

Capybara.default_driver = :selenium
Capybara.run_server = false
Capybara.app_host = 'http://192.168.70.125'
Capybara.default_wait_time = 1

# RSpec configuration
RSpec.configure do |config|
    # Use color in STDOUT
    config.color_enabled = true
    
    # Use color not only in STDOUT but also in pagers and files
    config.tty = true
    
    # Use the specified formatter
    config.formatter = :documentation
    
    config.include Capybara::DSL
    config.include TestHelper
end

require 'active_support/inflector'

module Styleguide
  module Generators
    class WidgetGenerator < Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)
      argument :name

      desc "Creates a widget in your styleguide"

      def create_widget
        destination_name = name.gsub(/-/, '_').parameterize(sep = '_')
        copy_file 'widget.html.erb', "app/views/styleguide/widgets/_#{destination_name}.html.erb"
      end
    end
  end
end

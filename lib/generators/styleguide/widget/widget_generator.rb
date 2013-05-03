require 'active_support/inflector'

module Styleguide
  module Generators
    class WidgetGenerator < Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)
      argument :name

      desc "Creates a widget in your styleguide"

      def create_widget
        supported_template_engines = [:haml, :erb]
        destination_name = name.gsub(/-/, '_').parameterize(sep = '_')
        template_engine = Rails.configuration.generators.options[:rails][:template_engine]

        # use erb if we don't have a template for the engine currently in use
        template_engine = :erb if !supported_template_engines.include? template_engine

        copy_file "widget.html.#{template_engine}", "app/views/styleguide/widgets/_#{destination_name}.html.#{template_engine}"
      end
    end
  end
end

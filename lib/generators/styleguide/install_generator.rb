module Styleguide
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('../templates', __FILE__)

      desc "Adds a styleguide to your app"

      def create_controller
        copy_file 'styleguide_controller.rb', 'app/controllers/styleguide_controller.rb'
      end

      def create_route
        route "match 'styleguide' => 'styleguide#index' if Rails.env.development?"
      end

      def create_views
        copy_file 'styleguide.html.erb', 'app/views/layouts/styleguide.html.erb'

        empty_directory 'app/views/styleguide/widgets'
        empty_directory 'app/assets/stylesheets/widgets'
        copy_file 'index.html.erb', 'app/views/styleguide/index.html.erb'
        copy_file '_widget.html.erb', 'app/views/styleguide/_widget.html.erb'
        copy_file '_widget_link.html.erb', 'app/views/styleguide/_widget_link.html.erb'
      end

      def add_private_assets
        empty_directory 'public/stylesheets'
        copy_file 'styleguide.css', 'public/stylesheets/styleguide.css'
        empty_directory 'public/javascripts'
        copy_file 'styleguide.js', 'public/javascripts/styleguide.js'
      end

      def supply_basic_guide
        copy_file '_example_elements.html', 'app/views/styleguide/widgets/_example_elements.html'
      end

      def show_readme
        readme('../USAGE')
      end
    end
  end
end

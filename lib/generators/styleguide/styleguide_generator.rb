class StyleguideGenerator < Rails::Generators::Base
  source_root File.expand_path('../templates', __FILE__)

  def create_controller
    copy_file 'styleguide_controller.rb', 'app/controllers/styleguide_controller.rb'
  end

  def create_route
    route "match 'styleguide' => 'styleguide#index' if Rails.env.development?"
  end

  def create_views
    copy_file 'styleguide.html.erb', 'app/views/layouts/styleguide.html.erb'

    empty_directory 'app/views/styleguide/widgets'
    copy_file 'index.html.erb', 'app/views/styleguide/index.html.erb'
    copy_file '_widget.html.erb', 'app/views/styleguide/_widget.html.erb'
    copy_file '_widget_link.html.erb', 'app/views/styleguide/_widget_link.html.erb'
  end

  def add_internal_styles
    copy_file 'styleguide.css', 'app/assets/stylesheets/styleguide.css'
  end

  def supply_basic_guide
    copy_file '_elements.html.erb', 'app/views/styleguide/widgets/_elements.html.erb'
  end
end

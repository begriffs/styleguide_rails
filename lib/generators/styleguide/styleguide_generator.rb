class StyleguideGenerator < Rails::Generators::Base
  source_root File.expand_path('../templates', __FILE__)

  def create_controller
    copy_file 'styleguide_controller.rb', 'app/controllers/styleguide_controller.rb'

    copy_file 'styleguide.html.erb', 'app/views/layouts/styleguide.html.erb'

    empty_directory 'app/views/styleguide/widgets'
    copy_file 'index.html.erb', 'app/views/styleguide/index.html.erb'
    copy_file 'show.html.erb', 'app/views/styleguide/show.html.erb'
    copy_file '_widget.html.erb', 'app/views/styleguide/_widget.html.erb'
  end

  def supply_basic_guide
    copy_file '_elements.html.erb', 'app/views/styleguide/widgets/_elements.html.erb'
  end

  def create_routes
    route "match 'styleguide' => 'styleguide#index'"
    route "match 'styleguide/:name' => 'styleguide#show'"
  end
end

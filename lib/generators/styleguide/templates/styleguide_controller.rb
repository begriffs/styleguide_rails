class StyleguideController < ApplicationController
  layout "styleguide"

  def index
    widget_files = Dir.glob('app/views/styleguide/widgets/_*.html.erb')

    @widgets = widget_files.reduce([]) do |widgets, filename|
      name = File.basename(filename, '.html.erb')[1..-1]

      widgets << { :name     => name,
                   :filename => filename,
                   :contents => File.read(filename) }
      widgets
    end
  end

  def show
    name = params[:name]
    filename = "app/views/styleguide/widgets/_#{name}.html.erb"

    @widget = { :name     => name,
                :filename => filename,
                :contents => File.read(filename) }
  end
end

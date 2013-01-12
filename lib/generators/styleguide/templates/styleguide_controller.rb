class StyleguideController < ApplicationController
  layout "styleguide"

  def index
    widget_files = Dir.glob('app/views/styleguide/widgets/_*.html*')

    @widgets = widget_files.reduce([]) do |widgets, filename|
      name = File.basename(filename)
                 .sub(/.html.*/, '')
                 .sub(/^_/, '')

      widgets << { :name     => name,
                   :filename => filename,
                   :contents => File.read(filename) }
      widgets
    end
  end

  def show
    name = params[:name]
    widget_dir = "app/views/styleguide/widgets/_%s.html.%s"
    extension = %w|erb haml|.find do |ext|
      File.exist?(widget_dir % [name, ext])
    end

    filename = widget_dir % [name, extension]

    @widget = { :name     => name,
                :filename => filename,
                :contents => File.read(filename) }
  end
end

class StyleguideController < ApplicationController
  layout "styleguide"

  def index
    widget_files = Dir.glob('app/views/styleguide/widgets/_*.html*')

    @widgets = widget_files.reduce([]) do |widgets, filename|
      name = File.basename(filename)
                 .sub(/.html.*/, '')
                 .sub(/^_/, '')

      widgets << { :name       => name,
                   :filename   => filename,
                   :contents   => File.read(filename) }
      widgets
    end
  end
end

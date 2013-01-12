class StyleguideController < ApplicationController
  layout "styleguide"

  def index
    @modules = {}
    Dir.glob('app/views/styleguide/_*.html.erb').each do |mod|
      name = File.basename(mod, '.html.erb')[1..-1]

      @modules[name] = { :name     => mod,
                         :contents => File.read(mod) }
    end
  end

  def show
    name = params[:name]
    filename = "app/views/styleguide/_#{name}.html.erb"

    @file = { :name        => filename,
              :contents    => File.read(filename),
              :module_name => name }
  end
end

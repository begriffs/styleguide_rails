class StyleguideController < ApplicationController
  def index
    @modules = Hash.new
    Dir.glob('app/views/styleguide/_*.html.erb').each do |mod|
      name = File.basename(mod, '.html.erb')[1..-1]
      @modules[name] = File.read mod
    end
  end

  def show
    @name     = params[:name]
    @contents = File.read "app/views/styleguide/_#{@name}.html.erb"
  end
end

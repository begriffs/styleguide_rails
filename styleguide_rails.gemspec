$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "styleguide_rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "styleguide_rails"
  s.version     = StyleguideRails::VERSION
  s.authors     = ["Joe Nelson", "Adam Braus"]
  s.homepage    = "http://github.com/begriffs/styleguide_rails"
  s.summary     = "An easy modular styleguide for rails -- run rails g styleguide"
  s.description = "Provides a custom generator to build a styleguide controller, routes, and views."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", ">= 3.0.0"
end

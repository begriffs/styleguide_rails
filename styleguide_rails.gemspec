# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'styleguide_rails/version'

Gem::Specification.new do |gem|
  gem.name          = "styleguide_rails"
  gem.version       = StyleguideRails::VERSION
  gem.authors       = ["Joe Nelson", "Adam Braus"]
  gem.email         = ["cred+github@begriffs.com"]
  gem.description   = %q{Add living CSS styleguide to your Rails project}
  gem.summary       = %q{Generates a controller, route, and views for your styleguide}
  gem.homepage      = "http://github.com/begriffs/styleguide_rails"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency "rails", ">= 3.0.0"
end

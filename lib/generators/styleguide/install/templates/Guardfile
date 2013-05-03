guard 'livereload' do
  watch(%r{app/views/styleguide/.+\.(erb|haml|slim|html)$})
  watch(%r{public/.+\.css})
  watch(%r{(app|vendor)(/assets/\w+/(.+\.css)).*}) { |m| "/assets/#{m[3]}" }
end

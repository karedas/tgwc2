# Require any additional compass plugins here.
require "#{File.dirname(__FILE__)}/config"
require "#{File.dirname(__FILE__)}/utils"

images_dir = $images_dir
http_path = $http_path
css_dir = $css_dir
sass_dir = $sass_dir
images_dir = $images_dir
fonts_dir = $fonts_dir
javascripts_dir = $javascripts_dir
out_dir = $out_dir
relative_assets = $relative_assets



# Set this to the root of your project when deployed:

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

asset_cache_buster do |http_path, real_path|

	rpn = Pathname.new(real_path.path)
	hpn = Pathname.new(http_path)
	h = file_url_hash(hpn, rpn, images_dir, "#{out_dir}/#{images_dir}")
	unless h.nil?
		p = Pathname.new(h[:path])
		root = Pathname.new("..")
		dest = p.relative_path_from(root)
		File.open('assets_list', 'a') do |f1|
			f1.puts "#{hpn} #{dest}"
		end
	end

	h
end

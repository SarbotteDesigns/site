# encoding: utf-8

require 'sinatra'
require 'newrelic_rpm'
require 'slim'
require 'kramdown'
require 'sqt'
require 'json'
require 'RMagick'

include Magick

require_relative 'lib/sarbotteForm'

before do
  content_type :html, 'charset' => 'utf-8'
end

get '/' do
  slim :index
end

get '/application/?' do
  slim :application
end

get '/about/?' do
  slim :about, :locals=>{:title => 'Sarbotte Designs - About us'}
end

get '/applications/?' do
  applicationList = []
  Dir["public/applications/*.md"].each do |application|
    applicationList << application[/public\/applications\/(.*)\.md/, 1]
  end
  slim :applications, :locals=>{:applicationList => applicationList}
end

post '/application/?' do
  nom = params[:nom]
  application = File.open("views/application.sarbotte", "rb:UTF-8").read
  File.open("public/applications/#{nom}.md", 'w:UTF-8') {|f| f.write(eval '"' + application + '"') }
  redirect to("/application/#{nom}")
end

get '/application/:nom/?' do |nom|
  application = File.open("public/applications/#{nom}.md", "rb:UTF-8").read
  application = Kramdown::Document.new(application).to_html
  slim :showApplication, :locals=>{:application => application}
end

get '/sqt/:option?' do |option|
  slim :sqt, :locals=>{:title => 'Sarbotte Designs - Sarbotte Quality Tool', :option=> option }
end

post '/sqt/?' do
  content_type :json
  if params[:curly]
    result = SQT.sarbotteCurl(params[:curly], params[:depth].to_i || 0)

    result.sort_by! { |a| a[:sqi] }
    sums = result.reduce({:sqi=>0, :totalLength=>0, :jsAndCssLength=>0}) do |total, fP|
      total[:sqi] += fP[:sqi]
      total[:totalLength] += fP[:totalLength]
      total[:jsAndCssLength] += fP[:jsAndCssLength]
      total
    end
    average = {:sqi=>sums[:sqi]/result.size, :totalLength=>sums[:totalLength]/result.size, :jsAndCssLength=>sums[:jsAndCssLength]/result.size}

    {:sqr=>{ :average=>average, :result=>result}  }.to_json
  else { :sqr => SQT.sarbotteString(params[:sarbotte]) }.to_json
  end
end

get '/sqt/about/?' do
  slim :sqt_about, :locals=>{:title => 'Sarbotte Designs - Sarbotte Quality Tool'}
end

get '/sqt/badge/:url' do |url|
  content_type 'image/png'
  svg_to_png2(File.read('views/badge.sarbotte'))
end

get '/ping' do
  'ok'
end

not_found do
  'Page non trouvée.'
end

error do
  'Erreur - ' + env['sinatra.error'].name
end

def self.svg_to_png(svg)
  svg = RSVG::Handle.new_from_data(svg)
  surface = Cairo::ImageSurface.new(Cairo::FORMAT_ARGB32, 800, 800)
  context = Cairo::Context.new(surface)
  context.render_rsvg_handle(svg)
  b = StringIO.new
  surface.write_to_png(b)
  return b.string
end

def self.svg_to_png2(svg)
  img = Magick::Image::from_blob(svg)
  return img[0].to_blob {self.format = 'PNG'}
end
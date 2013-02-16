# encoding: utf-8

require 'sinatra'
require 'newrelic_rpm'
require 'haml'
require 'kramdown'
require 'sqt'
require 'json'

require './sarbotteForm'

before do
  content_type :html, 'charset' => 'utf-8'
end

get '/' do
  haml :index
end

get '/application/?' do
  haml :application
end

get '/about/?' do
  haml :about, :locals=>{:title => 'Sarbotte Designs - About us'}
end

get '/applications/?' do
  applicationList = []
  Dir["public/applications/*.md"].each do |application|
    applicationList << application[/public\/applications\/(.*)\.md/, 1]
  end
  haml :applications, :locals=>{:applicationList => applicationList}
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
  haml :showApplication, :locals=>{:application => application}
end

get '/sqt/?' do
  haml :sqt, :locals=>{:title => 'Sarbotte Designs - Sarbotte Quality Tool'}
end

post '/sqt/?' do
  content_type :json
  if params[:curly] then {:sqr => SQT.sarbotteCurl(params[:curly], 0) }.to_json
  else { :sqr => SQT.sarbotteString(params[:sarbotte]) }.to_json
  end
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
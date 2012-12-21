# encoding: utf-8

require 'sinatra'
require 'haml'
require 'kramdown'
require 'json'

get '/' do
  haml :index
end

get '/application/?' do
  haml :application
end

post '/application/?' do
  nom = params[:nom]
  application = File.open("views/application.md", "rb:UTF-8").read
  File.open("public/applications/#{nom}.md", 'w:UTF-8') {|f| f.write(eval '"' + application + '"') }
  redirect to("/application/#{nom}")
end

get '/application/:nom/?' do |nom|
  application = File.open("public/applications/#{nom}.md", "rb:UTF-8").read
  application = Kramdown::Document.new(application).to_html
  haml :showApplication, :locals=>{:application => application}
end

not_found do
  'Page non trouvée.'
end

error do
  'Erreur - ' + env['sinatra.error'].name
end
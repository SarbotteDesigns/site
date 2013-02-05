# encoding: utf-8

require 'sinatra'
require 'haml'
require 'kramdown'

require './sarbotteForm'

get '/' do
  haml :index
end

get '/application/?' do
  haml :application
end

get '/applications/?' do
  applicationList = []
  Dir["public/applications/*.md"].each do |application|
    applicationList << application[/public\/applications\/(.*)\.md/, 1]
  end
  haml :listApplications, :locals=>{:applicationList => applicationList}
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
  haml :sqt
end

not_found do
  'Page non trouvée.'
end

error do
  'Erreur - ' + env['sinatra.error'].name
end
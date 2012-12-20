require 'sinatra'
require 'haml'
require 'kramdown'
require 'json'

get '/' do
  haml :index
end

get '/application' do
  haml :application
end

post '/application' do
  nom = params[:nom]
  application = 
"""
**Nom**

> #{params[:prenom]} #{params[:nom]}

**Degre de Sarbottisme**

> #{params[:sarbottisme]}
"""
  File.open("public/applications/#{nom}.md", 'w') {|f| f.write(application) }
  redirect to("/application/#{nom}")
end

get '/application/:nom' do |nom|
  application = File.read("public/applications/#{nom}.md")
  application = Kramdown::Document.new(application).to_html
  haml :showApplication, :locals=>{:application => application}
end

not_found do
  'This is nowhere to be found.'
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].name
end
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
  application =
"""
## Informations

**Nom**

> #{params[:prenom]} #{params[:nom]}

{::comment}
#{params[:email]}
{:/comment}

## Sarbottisme

**Veuillez décrire de façon succinte et détaillée votre expérience du Sarbottisme**

> #{params[:experienceSarbottisme]}

**Comment avez-vous connu Sarbotte Designs ?**

> #{params[:connuSarbotteDesigns]}

## Test d'aptitudes

Vos tests d'aptitudes sont actuellement analisés et vous seront communiqués utlérieurement par Sarbotte Designs.

{::comment}

**Que renvoie l'expression suivante :**

> #{params[:testJs]}

**Quels sont les cinq pilliers du Sarbottisme ?**

> #{params[:pilliersSarbottisme]}

{:/comment}

"""
  File.open("public/applications/#{nom}.md", 'w:UTF-8') {|f| f.write(application) }
  redirect to("/application/#{nom}")
end

get '/application/:nom/?' do |nom|
  file = File.open("public/applications/#{nom}.md", "rb:UTF-8")
  application = file.read

  # application = File.read("public/applications/#{nom}.md")

  application = Kramdown::Document.new(application).to_html
  haml :showApplication, :locals=>{:application => application}
end

not_found do
  'This is nowhere to be found.'
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].name
end
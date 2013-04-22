# encoding: utf-8

require 'sinatra'
require 'newrelic_rpm'
require 'slim'
require 'kramdown'
require 'sqt'
require 'json'
require 'mongo' #bson_ext

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

def get_connection
  return @db_connection if @db_connection
  db = URI.parse(ENV['MONGOHQ_URL'])
  db_name = db.path.gsub(/^\//, '')
  @db_connection = Mongo::Connection.new(db.host, db.port).db(db_name)
  @db_connection.authenticate(db.user, db.password) unless (db.user.nil? || db.user.nil?)
  @db_connection
end

get '/about/?' do
  db = get_connection
  investors = db.collection('investors').find().sort({:euroValue => -1})
  slim :about, :locals=>{:title => 'Sarbotte Designs - About us', :investors => investors}
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

get '/sqt/?' do
  slim :sqt, :locals=>{:title => 'Sarbotte Designs - Sarbotte Quality Tool'}
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
    average = {
      :sqi=>sums[:sqi].to_f/result.size,
      :totalLength=>sums[:totalLength].to_f/result.size,
      :jsAndCssLength=>sums[:jsAndCssLength].to_f/result.size
    }

    {
      :sqr=>{
        :average=>average,
        :result=>result,
        :badge=> "public/images/badges/sqt/png/sqt_#{average[:sqi].to_i}.png"
      }
    }.to_json
  else { :sqr => SQT.sarbotteString(params[:sarbotte]) }.to_json
  end
end

#get '/sqt/about/?' do
#  slim :sqt_about, :locals=>{:title => 'Sarbotte Designs - Sarbotte Quality Tool'}
#end

get '/sqt/badge/:url/?:depth?' do |url, depth|
  content_type 'image/png'
  begin
    result = SQT.sarbotteCurl(URI.unescape(url), (depth || 0).to_i )
    sums = result.reduce({:sqi=>0}) do |total, fP|
      total[:sqi] += fP[:sqi]
      total
    end
    average = {:sqi=>sums[:sqi].to_f/result.size}
    send_file "public/images/badges/sqt/png/sqt_#{average[:sqi].to_i}.png"
  rescue Exception => error
    send_file "public/images/badges/sqt/png/sqt_na.png"
  end
end

get '/ping' do
  'ok'
end

not_found do
  'Page non trouvée.'
end

error do
  'Erreur - ' + env['sinatra.error']
end

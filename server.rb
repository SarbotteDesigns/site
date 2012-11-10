require 'sinatra'
require 'haml'

get '/' do
  haml :index
end

not_found do
  'This is nowhere to be found.'
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].name
end
#Helpers haml pour le formulaire
helpers do

  def bsInput(tag, type, name, label = '', placeholder = '', help = '')
    haml = <<-HAML
%div{:class=>'control-group'}
  %label{:class=>'control-label', :for=>"#{name}"}
    #{label}
  %div{:class=>'controls'}
    %#{tag}{:type=>"#{type}", :name=>"#{name}", :id=>"#{name}", :placeholder=>"#{placeholder}", :class=>'input-xlarge'}
    %span{:class=>'help-block'}
      %i #{help}
HAML
    engine = Haml::Engine.new(haml)
    engine.render
  end

  def question(question)
    haml = <<-HAML
%p
  %strong
    %i #{question}
HAML
    engine = Haml::Engine.new(haml)
    engine.render
  end

end
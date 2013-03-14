#Helpers slim pour le formulaire

def bsInput(tag, type, name, label = '', placeholder = '', help = '')
  slim = <<-SLIM
.control-group
  label.control-label for='#{name}' #{label}
  .controls
    #{tag}.input-xlarge type='#{type}' name='#{name}' id='#{name}' placeholder='#{placeholder}'
    span.help-block: i #{help}
  SLIM
  slim = eval('"' + slim + '"')
  t = Slim::Template.new { slim }
  t.render
end

def question(question)
  slim = <<-SLIM
p:
  strong: i '#{question}'
  SLIM
  slim = eval('"' + slim + '"')
  t = Slim::Template.new { slim }
  t.render
end
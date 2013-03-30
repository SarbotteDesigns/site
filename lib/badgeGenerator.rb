badge = File.read('../views/badge.sarbotte')
pngDir = '../public/images/badges/sqt/png'
svgDir = '../public/images/badges/sqt/svg'
badge = File.read('..\views\badge.sarbotte')
property = "SQT"
(1..100).each do |i|

  color = case i
    when  0..50 then '0-50' #'#F22E2E'
    when 51..60 then '51-60' #'#F25F2E'
    when 61..70 then '61-70' #'#F29B30'
    when 71..80 then '71-80' #'#F2B33D'
    when 81..90 then '81-90' #'#B1BF6E'
    when 91..99 then '91-99' #'#718F2F'
    when    100 then '100' #'#2A8F2F'
  end

  cBadge = badge.gsub("property", property).gsub("value", i.to_s).gsub("colorValue", color)
  File.open(svgDir + "/sqt_#{i}.svg", 'w') {|f| f.write(cBadge) }
  system("rsvg-convert.exe --output #{pngDir}/sqt_#{i}.png #{svgDir}/sqt_#{i}.svg")

end

cBadge = badge.gsub("property", property).gsub("value", "n/a").gsub("colorValue", 'lightgray')
File.open(svgDir + "/sqt_na.svg", 'w') {|f| f.write(cBadge) }
system("rsvg-convert.exe --output #{pngDir}/sqt_na.png #{svgDir}/sqt_na.svg")
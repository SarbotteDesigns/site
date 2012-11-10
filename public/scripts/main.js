(function($, undefined){
  "use strict";

  $(function () {

    $("summary a").on('click', function(){
      var $this = $(this);
      if($this.attr('target') === '_blank'){
        window.open($this.attr('href'));
      }else{
        location.href = $this.attr('href');
      }
      return false;
    });


    var width = 1900,
    height = 280;

    var color = d3.scale.category10();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(40)
        .size([width, height]);

    var svg = d3.select("#hero").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("miserables.json", function(json) {
      force
          .nodes(json.nodes)
          .links(json.links)
          .start();

      var link = svg.selectAll("line.link")
          .data(json.links)
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", function(d) { return Math.sqrt(d.value); });

      var node = svg.selectAll("circle.node")
          .data(json.nodes)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", function(d) { return (d.group); })
          .style("fill", function(d) { return color(d.group); })
          .call(force.drag);

      node.append("title")
          .text(function(d) { return d.name; });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });


  });

})(jQuery);


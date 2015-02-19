//based loosely on bostock's example and 
//http://bl.ocks.org/d3noob/5141278

var nodes = data.nodes
var links = data.links
var count = 0
for (i in links) {
   if (count<links[i].value) count = links[i].value 
}

var ele = document.getElementById("vis"), 
    //width = ele.offsetWidth+1200
    //height = ele.offsetHeight+1200
    width = ele.clientWidth - 25,
    height= ele.clientHeight - 25;

var force = d3.layout.force()
    .charge([-250])
    .linkDistance([75])
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .start();

var drag = force.drag();
drag.on("dragstart",dragstart);

var defaultColors = d3.scale.category20(); //10 or 20

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)

    .append("g")
	.call(d3.behavior.zoom().scaleExtent([0.5,5]).on("zoom",zoomHandler)).on("dblclick.zoom",null).on("mousedown.zoom",null);

var outer_box = svg.append("rect")
    .attr("width", width*2)
    .attr("height", height*2)
    .attr("x", 0)
    .attr("y", 0)
    .attr("id","outer_box")    //.attr("fill","none")
    	.attr("fill", "grey")
    	.attr("opacity", 0.1)
    .attr("pointer-events","all");

console.log(outer_box);

svg.append("svg:defs").selectAll("marker")
    .data(["end"])// Different path types defined here
    .enter().append("svg:marker")  
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerUnits", "userSpaceOnUse")
    .style("fill", function (d) {
        return d.color || "black"
    })
    .style("opacity", function(d) {
        return d.opacity || 1
    })
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var link = svg.append("svg:g").selectAll("path")
    .data(links)
    .enter().append("svg:path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)")
    .style("stroke-width", function (d) {
        return d.width || "1.5"
    })
    .style("stroke", function (d) {
        return d.color || "black"
    })
    .style("opacity", function(d) {
        return d.opacity || 1
    })
    .style("stroke-dasharray", function(d) {
        return d.dasharray || ""
    })
    .style("fill", "none")

//scale values between 1 and 100 to a reasonable range
var scaleSize = d3.scale.linear()
    .domain([1,100])
    .range([80,4000]);

//outer node
var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("dblclick", dblclick)
    .call(force.drag)

//inner nodes    
node
    .append('path')
    .attr("class", "node")
    .attr("d", d3.svg.symbol()
        .type(function(d) { return d.shape || "circle"; })
        .size(function(d) {return scaleSize(d.size || 1); })
    )
    .style("fill", function(d, i) {
        return d.color || defaultColors(i);
    })
    .style("opacity", function(d) {
        return d.opacity || 1
    })

//inner nodes
node
    .append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .style("color",'black')
    .style("display", "none")
    .text(function(d) {
        return d.name;
    });

// Function to add line breaks to node labels/names
var insertLineBreaks = function(d) {
	var el = d3.select(this);
	var words = d3.select(this).text().split('\n');
	el.text('');

	for (var i = 0; i < words.length; i++) {
	    var tspan = el.append('tspan').text(words[i]);
	    if (i > 0)
		tspan.attr('x',0).attr('dy','15');
	}
}

// Add line breaks to node labels
svg.selectAll('text').each(insertLineBreaks);


force.on("tick", function() {
    link
        .attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
                d.source.x + "," + 
                d.source.y + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                d.target.x + "," + 
                d.target.y;
        });
    
    node
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
})

function mouseover() {

    d3.select(this).select("text").transition()
        .duration(750)
        .style("display","block")
    d3.select(this).select("path").transition()
        .duration(750)
        .attr('d', function (d) {
            return d3.svg.symbol().type(d.shape||"circle")
                    .size(scaleSize(40))()
        })            
}

function mouseout() {
    
    d3.select(this).select("text").transition()
        .duration(750)
        .style("display","none")
    d3.select(this).select("path").transition()
        .duration(750)
        .attr('d', function (d) {
            return d3.svg.symbol().type(d.shape||"circle")
                    .size(scaleSize(d.size||1))()
        })            
        
}

// zoom function
function zoomHandler() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //svg.attr("transform", "scale(" + d3.event.scale + ")");    

//var w = svg.style("width");
//console.log(d3.event.translate);    
//d3.select("#outer_box").attr("transform","translate(" + -d3.event.translate[0] + ", " + -d3.event.translate[1] + ")scale(" + 1.0/d3.event.scale + ")");
    //.attr("height",height);//outter_box.attr("width","100%");
}

// Handle doubleclick on node path (shape)
function dblclick(d) {
    //console.log(this, d);
    d3.select(this).classed("fixed", d.fixed = false);
    //d3.select(this).attr("d", d3.svg.symbol()
	//		.type(function(d) { return d.shape || "circle"; })
	//		.size(function(d) { return scaleSize(d.size * 2 || 2); })
	//);
}

// Handle dragstart on force.drag()
function dragstart(d) {
    //console.log(this, d);
    d3.select(this).classed("fixed", d.fixed = true);
    //d3.select(this).attr("d", d3.svg.symbol()
		//.type(function(d) { return d.shape || "circle"; })
		//.size(function(d) { return scaleSize(d.size || 1); })
	//);
}


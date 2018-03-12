'use strict';  //treat silly mistakes as run-time errors

var width = 960, height = 547;
//var width = 960, height = 547;

// initial values
var selections = ["fiveSix2","sixSeven1","sixSeven2","sevenEight","eightPlus"];
var initSelections = ["fiveSix2","sixSeven1","sixSeven2","sevenEight","eightPlus"];
var startYearValue = 2008;
var endYearValue = 2016;

var switchStatus = d3.select("#switchStatus");
switchStatus.text("OFF");
//var w = window.innerWidth;
//var h = window.innerHeight;
//width = 960, height = 547;
console.log(width+","+height);
console.log(window.innerWidth)

//var svg = d3.select("#map");
    //.style('border','1px solid gray');

var active = d3.select(null);

var svg = d3.select("#map")
            .on("click", stopped, true);

svg.append("rect")
            .attr("fill","none")
            .attr("width", width)
            .attr("height", height);
            //.on("click", reset);

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
        
var g = svg.append("g")
            .attr("width", width)
            .attr("height", height);
        
svg.call(zoom)
          
var projection = d3.geoPatterson()
        .scale(153)
        .translate([width / 2, height / 2])
        .precision(0.1);

var path = d3.geoPath()
        .projection(projection);

var currentZoomLevel = 1;

// scale magnitude of earthquakes
var magScale = d3.scaleLinear()
        .domain([5.5, 9.2])
        .range([5, 30]);

var plateColor = d3.scaleLinear()
        .domain(["AF","AN","SO","IN"])
        .range(["#f7fbff","#9ecae1","#6baed6","#4292c6"]);

var zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0]) 
        // .scale(1) 
        .scaleExtent([1, 20])
        .on("zoom", zoomed);

var g = svg.append("g");

var tect = g.append("g")

var tectSwitch = d3.select("#tectSwitch");

var toolCircle = d3.select("#toolCircle")
    .append("div")
    .attr("class","circletooltip")
    .attr("opacity", 0.7)
    ;

var toolDiv = d3.select("#toolDiv")
    .append("div")
    .attr("class","tooltip")
    .attr("opacity", 0.7)
    ;

var startDropdown = d3.select('#startYear');

var endDropDown = d3.select('#endYear');


d3.select("#circleLegend")
        .append("circle")
        .attr("r",magScale(5.5))
        .attr('transform', 'translate(35, 30)')
        //.attr("x","100px")//function(d) {return d.x})
        //.attr("y","100px")//function(d) {return d.y})
        .style("fill","blue");

d3.select("#circleLegend").append('text')
        .attr('x', 5)
        .attr('y', 65)
        .text("Mag:  5.5")
        .style("font-size","12px");

d3.select("#circleLegend")
        .append("circle")
        .attr("r",magScale(6.5))
        .attr('transform', 'translate(65, 30)')
        //.attr("x","100px")//function(d) {return d.x})
        //.attr("y","100px")//function(d) {return d.y})
        .style("fill","blue");

d3.select("#circleLegend").append('text')
        .attr('x', 60)
        .attr('y', 65)
        .text("6.5")
        .style("font-size","12px");

//d3.select("#circleLegend")
//       .append("circle")
//        .attr("r",magScale(7.5))
//        .attr('transform', 'translate(100, 30)')
//        //.attr("x","100px")//function(d) {return d.x})
        //.attr("y","100px")//function(d) {return d.y})
//        .style("fill","blue");

//d3.select("#circleLegend").append('text')
//        .attr('x', 95)
//        .attr('y', 65)
//        .text("7.5")
//        .style("font-size","12px");

d3.select("#circleLegend")
        .append("circle")
        .attr("r",magScale(8.5))
        .attr('transform', 'translate(110, 30)')
        //.attr("x","100px")//function(d) {return d.x})
        //.attr("y","100px")//function(d) {return d.y})
        .style("fill","blue");

d3.select("#circleLegend").append('text')
        .attr('x', 100)
        .attr('y', 65)
        .text("8.5")
        .style("font-size","12px");

var colorDict = {
        "AF":"#4f3222", //africa
        "AN":"#b7d7e8",
        "SO":"#c8c3cc",
        "IN":"#c6bcb6",
        "AU":"#625750",
        "EU":"#4f3222", //Eurasian
        "NA":"#8b6f47",
        "SA":"#cab577",
        "PS":"#b7d7e8",
        "NZ":"#4f3222",
        "SC":"#625750",
        "CO":"#7a3b2e",
        "CA":"#b9b0b0",
        "JF":"#cab577",
        "PA":"#b7d7e8",
        "SU":"#c6bcb6",
        "TI":"#034f84",
        "KE":"#b9b0b0",
        "TO":"#4f3222",
        "NI":"#8b6f47",
        "WL":"#625750",
        "MO":"#cab577",
        "SB":"#c8c3cc",
        "SS":"#b7d7e8",
        "NB":"#8b6f47",
        "WL":"#cab577",
        "NH":"#625750",
        "AP":"#8b6f47",
        "ND":"#034f84",
        "ON":"#4f3222",
        "PS":"#625750",
        "YA":"#cab577",
        "AT":"#625750",
        "BU":"#4f3222",
        "RI":"#625750",
        "BH":"#4f3222",
        "MS":"#b9b0b0",
        "BS":"#cab577",
        "MN":"#c6bcb6",
        "CR":"#4f3222",
        "BR":"#034f84",
        "EA":"#8b6f47",
        "JZ":"#b9b0b0",
        "GP":"#667292",
        "SW":"#8b6f47",
        "PM":"#625750"
};

//init the map
queue()
    .defer(d3.json, "https://d3js.org/world-50m.v1.json")
    .defer(d3.csv, "data/database.csv")
    .await(loadMyMap);


// if filter on magnitude checkboxes
d3.selectAll(".magnitude").on("change",checkUpdate);

// if turn on/of tectonic switch
d3.select("#tectSwitch").on("change",checkSwicth);

// if select year in droplist 
startDropdown.on('change',startYearChanged);
endDropDown.on('change',endYearChanged);

function startYearChanged(){
    startYearValue = d3.event.target.value;
    if (startYearValue<=endYearValue){
        d3.select("#warningMsg")
        .text("")
        console.log("Start Year to",startYearValue)
        drawMap(selections,startYearValue,endYearValue,currentZoomLevel);
    }
    else{
        g.selectAll("circle").remove();
        d3.select("#warningMsg")
        .text("Start year must <= end year, please try again.")
        .style("color","red");
    }
}


function endYearChanged(){
    endYearValue = d3.event.target.value;
    if (endYearValue>=startYearValue){
        d3.select("#warningMsg")
        .text("")
        console.log("End Year to",endYearValue);
        drawMap(selections,startYearValue,endYearValue,currentZoomLevel);
    }
    else{
        g.selectAll("circle").remove();
        d3.select("#warningMsg")
        .text("End year must >= end year, please try again.")
        .style("color","red");
    }
}



function drawMap(magList,startYear, endYear,zoomLevel){
    console.log('map refreshed',magList,startYear,endYear);
    g.selectAll("circle").remove();
    for (var i = 0; i < magList.length; i++) { 
        //magFilter(newData[i]);
        updateMap(magList[i],startYear,endYear,zoomLevel);
    }
}

function loadMyMap(error, world, earthquake) {
    g.selectAll("path").
        data(topojson.feature(world, world.objects.land).features)
    .enter().append("path")
    .attr("d",path)
    .attr("class","land")
    .on("click",clicked)

    //console.log(earthquake[0].longitude, earthquake[0].latitude);
    
    g.append("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
       .attr("class", "boundary")
       .attr("d", path);

    drawMap(selections,startYearValue,endYearValue,currentZoomLevel);
}


function loadTectPlates(error, tectPlate){
    if (error) throw error;
    
    var tectFeatures = tectPlate.features;

    //console.log(tectFeatures[0]);
    //console.log(plateColor(tectFeatures[0].properties.Code));

    tect.selectAll("path")
      .data(tectFeatures)
      .enter().append("path")
        .attr("d", path)
        //.attr("fill",function(d) {return colorDict[d.properties.Code];})
        .attr("fill-opacity",0)
        .attr("stroke","grey")
        .attr("stroke-width",3)
        .attr("stroke-dasharray",10)
    .on('mouseover',function(d){
            toolDiv.transition().duration(0).style('opacity',0.9);
            toolDiv.html('Plate: ' + d.properties.PlateName);
            toolDiv.style('left',((d3.event.pageX+15)+'px'))
              .style('top',((d3.event.pageY+15)+'px'))
              .style('z-index',5);
        })
    .on('mouseout',function(d){
            toolDiv.transition().duration(100).style('opacity',0)
  
        })
    .on("click", clicked);
};


function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);
  
        var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];
  
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
  
  }
  
  function reset() {
    active.classed("active", false);
    active = d3.select(null);
  
    svg.transition()
        .duration(50)
        .call(zoom.transform, d3.zoomIdentity ); // updated for d3 v4
    
  }
  
  function zoomed() {
 
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    g.attr("transform", d3.event.transform); 
    //console.log(d3.event.transform);
    currentZoomLevel = d3.event.transform.k;
    //console.log(d3.event.transform.k);
    g.selectAll("circle")
    //.function(d) {return d;}
    .attr("r",function(d) { return magScale(d.magnitude)/currentZoomLevel;})



    //drawMap(selections,startYearValue,endYearValue,currentZoomLevel)
    //zoomCircles();

  }
  
  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }


function checkUpdate(){
    var choices = [];
    var newData = [];
    var intList = ["fiveSix2","sixSeven1","sixSeven2","sevenEight","eightPlus"]
    d3.selectAll(".magnitude").each(function(d){
        var cb = d3.select(this);
        //console.log(cb);
        if(cb.property("checked")){
          choices.push(cb.property("value"));
        }
      });
    
    if(choices.length > 0){
        newData = intList.filter(function(d,i){return choices.includes(d);});
      } else {
        newData = [];}
    
    g.selectAll("circle").remove();
    // update selections to newData
    selections = newData;
    drawMap(selections,startYearValue,endYearValue,currentZoomLevel);
};


function magFilter(magSelected){
    //console.log("init magSelected");
    d3.csv("/data/database.csv", function(err, data){
        //console.log(data[0]);

        //console.log("magselected", magSelected);
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .filter(function(d){
            if (magSelected == "fiveSix2"){return d.magnitude<6.0;}
            else if (magSelected == "sixSeven1"){return d.magnitude>=6.0 && d.magnitude<6.5;}
            else if (magSelected == "sixSeven2"){return d.magnitude>=6.5 && d.magnitude<7.0;}
            else if (magSelected == "sevenEight"){return d.magnitude>=7.0 && d.magnitude<8.0;}
            else if (magSelected == "eightPlus"){return d.magnitude>=8.0;}
        })
        .attr("r",function(d) {return magScale(d.magnitude);})
        .attr("fill","blue")
        .attr("opacity",0.3)
        .attr("transform", function(d) {return "translate(" + projection([d.longitude,d.latitude]) + ")"})
    .on('mouseover',function(d){
        toolCircle.transition().duration(10).style('opacity',0.9);
        if (d["country"].length>2) {
            toolCircle.html("Country: " + d["country"]
                        + "<br/> City: " + d["city"] 
                        + "<br/> Time: " + d['date'] + " " + d['time']
                        + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                        + "<br/> Magnitude:" + d['magnitude']);
        }
        else {
            toolCircle.html("Country: NA"
                        + "<br/> City: NA"
                        + "<br/> Time: " + d['date'] + " " + d['time']
                        + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                        + "<br/> Magnitude:" + d['magnitude']);
        } 
            
            toolCircle.style('left',((d3.event.pageX+15) +'px'))
                        .style('top',((d3.event.pageY+10)+'px'))
                        .style('z-index',5);
        })
    .on('mouseout',function(d){
            toolCircle.transition().duration(10).style('opacity',0)
  
        })
    .on("click", clicked);

    });
}

function zoomCircles(){
    //console.log("init magSelected");
    d3.csv("/data/database.csv", function(err, data){
    
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r",function(d) {return magScale(d.magnitude)/currentZoomLevel;})
        .attr("fill","blue")
        .attr("opacity",0.3)
        .attr("transform", function(d) {return "translate(" + projection([d.longitude,d.latitude]) + ")"})
    .on('mouseover',function(d){
        //console.log(d3.mouse(this));
            toolCircle.transition().duration(10).style('opacity',0.9);
            if (d["country"].length>2) {
                toolCircle.html("Country: " + d["country"]
                            + "<br/> City: " + d["city"] 
                            + "<br/> Time: " + d['date'] + " " + d['time']
                            + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                            + "<br/> Magnitude:" + d['magnitude']);
            }
            else {
                toolCircle.html("Country: NA"
                            + "<br/> City: NA"
                            + "<br/> Time: " + d['date'] + " " + d['time']
                            + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                            + "<br/> Magnitude:" + d['magnitude']);
            }
            toolCircle.style('left',((d3.event.pageX+15) +'px'))
              .style('top',((d3.event.pageY+10)+'px'))
              .style('z-index',5);
        })
    .on('mouseout',function(d){
            toolCircle.transition().duration(10).style('opacity',0)
  
        })
    .on("click", clicked);
    });
}

function checkSwicth(){
    d3.selectAll(".switch").each(function(d){
        var sw = d3.select(this);
        console.log(sw);
        if(sw.property("checked")){
            queue()
            .defer(d3.json, "/data/tectonicplates-master/GeoJSON/PB2002_plates.json")
            .await(loadTectPlates);
            switchStatus.text("ON");
        }
        else {tect.selectAll("path").remove();
        switchStatus.text("OFF");}
      });

};



function updateMap(magSelected,startYear,endYear,zoomLevel){
    //console.log("init magSelected");
    d3.csv("/data/database.csv", function(err, data){
          //console.log("magselected", magSelected);
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .filter(function(d){
            if (magSelected == "fiveSix2"){return d.magnitude<6.0 && d.year>=startYear && d.year<=endYear;}
            else if (magSelected == "sixSeven1"){return d.magnitude>=6.0 && d.magnitude<6.5 && d.year>=startYear && d.year<=endYear;}
            else if (magSelected == "sixSeven2"){return d.magnitude>=6.5 && d.magnitude<7.0 && d.year>=startYear && d.year<=endYear;}
            else if (magSelected == "sevenEight"){return d.magnitude>=7.0 && d.magnitude<8.0 && d.year>=startYear && d.year<=endYear;}
            else if (magSelected == "eightPlus"){return d.magnitude>=8.0 && d.year>=startYear && d.year<=endYear;}
        })
        .attr("r",function(d) {return magScale(d.magnitude)/zoomLevel;})
        .attr("fill","blue")
        .attr("opacity",0.3)
        .attr("transform", function(d) {return "translate(" + projection([d.longitude,d.latitude]) + ")"})
    .on('mouseover',function(d){
        toolCircle.transition().duration(10).style('opacity',0.9);
        if (d["country"].length>2) {
            toolCircle.html("Country: " + d["country"]
                        + "<br/> City: " + d["city"] 
                        + "<br/> Time: " + d['date'] + " " + d['time']
                        + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                        + "<br/> Magnitude:" + d['magnitude']);
        }
        else {
            toolCircle.html("Country: NA"
                        + "<br/> City: NA"
                        + "<br/> Time: " + d['date'] + " " + d['time']
                        + "<br/> Coordinates: (" +  parseFloat(d['latitude']).toFixed(2) + "," + parseFloat(d['longitude']).toFixed(2) + ")"
                        + "<br/> Magnitude:" + d['magnitude']);
        } 
            
            toolCircle.style('left',((d3.event.pageX+15) +'px'))
                        .style('top',((d3.event.pageY+10)+'px'))
                        .style('z-index',5);
        })
    .on('mouseout',function(d){
            toolCircle.transition().duration(10).style('opacity',0)
  
        })
    .on("click", clicked);

    });
}

function gettingCircles(){

};

toolCircle.transition().duration(10).style('opacity',0);
toolDiv.transition().duration(10).style('opacity',0);

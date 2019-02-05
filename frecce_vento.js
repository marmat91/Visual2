function arrow(data){
    d3.select("#frec").selectAll("line").remove();
    d3.select("#frec").selectAll("g").remove();
    d3.select("#frec").selectAll("image").remove();
    var immagine=d3.select("#frec").append('svg:image')
        .attr("xlink:href", "../progettoV/img/stella.png")
        .attr("x", "37.5")
        .attr("y", "37.5")
        .attr("width", "125")
        .attr("height", "125")
        .attr("opacity", 0.1);
    var cross=data.slice();
    var cf= crossfilter(cross);
    if(mese!="Tutti i mesi"){
        console.log(mese)
        var month = cf.dimension(function (d) {return d.meseanno});
        if(mese=="Aprile") {var m = "04/16"}
        if(mese=="Agosto") {var m = "08/16"}
        if(mese=="Dicembre") {var m = "12/16"}
        month.filter(m);
        var cont = month.group().reduceCount(),
            datiGroup2=cont.all();
        var date = month.group().reduceSum(function(d) { return d.WindDirection; }),
            datiGroup=date.all();
        console.log(datiGroup);
        console.log(datiGroup2);
        var speed = month.group().reduceSum(function(d) { return d.WindSpeed; }),
            datiGroup3=speed.all();
        console.log(datiGroup3);


        if(giorno!="Tutti i giorni"){
            var cross=data.slice();
            var cf=crossfilter(cross);
            var day= cf.dimension(function (d){return d.giorno});
            day.filter(giorno);
            var month = cf.dimension(function (d) {return d.meseanno});
            if(mese=="Aprile") {var m = "04/16"}
            if(mese=="Agosto") {var m = "08/16"}
            if(mese=="Dicembre") {var m = "12/16"}
            month.filter(m);
            var cont = month.group().reduceCount(),
                datiGroup2=cont.all();
            var date = month.group().reduceSum(function(d) { return d.WindDirection; }),
                datiGroup=date.all();
            console.log(datiGroup);
            console.log(datiGroup2);
            var speed = month.group().reduceSum(function(d) { return d.WindSpeed; }),
                datiGroup3=speed.all();
            if(ora!="Tutte le ore"){
                console.log(ora);
                var z = ora.split(":")[0];
                var o=(z % 3)
                if(o != 0){ z=z-1; o = z % 3}
                if(o != 0){ z=z-1;}
                console.log( );
                if (z<10 && z.toString().length<2){z="0"+z}
                var orario=(z+":00")
                console.log(orario);

                var cross=data.slice();
                var cf=crossfilter(cross);
                var hour= cf.dimension(function (d){return d.ora});
                hour.filter(orario);
                var day= cf.dimension(function (d){return d.giorno});
                day.filter(giorno);
                var month = cf.dimension(function (d) {return d.meseanno});
                if(mese=="Aprile") {var m = "04/16"}
                if(mese=="Agosto") {var m = "08/16"}
                if(mese=="Dicembre") {var m = "12/16"}
                month.filter(m);
                var cont = month.group().reduceCount(),
                    datiGroup2=cont.all();
                var date = month.group().reduceSum(function(d) { return d.WindDirection; }),
                    datiGroup=date.all();
                var speed = month.group().reduceSum(function(d) { return d.WindSpeed; }),
                    datiGroup3=speed.all();
                console.log(datiGroup);
                console.log(datiGroup2);
            }
        }
        for(i=0; i<datiGroup.length; i++){
            if(datiGroup[i].key==m){
                console.log(datiGroup[i].value);
                console.log(datiGroup2[i].value);
                var direz=datiGroup[i].value/datiGroup2[i].value
                console.log(direz);
                var vel = datiGroup3[i].value/datiGroup2[i].value
                console.log(vel);
            }
        }
    }
    else{
        var datiUp = cf.groupAll().reduceSum(function(d){ return d.WindDirection}).value();
        var cont = cf.groupAll().reduceCount().value();
        var direz= datiUp/cont;
        var velocita = cf.groupAll().reduceSum(function(d){ return d.WindSpeed}).value();
        var vel = velocita/cont;
        }
    //da rivedere è cambiata la scala (OK)
    var y=(direz*100)/180;
    if(y>100){y=(y-200)*(-1)}
    y=y+50;
    var z=((direz-90)*100)/180;
    if(z>100){var x=(z-100)}
    else if(z<0) { var x=100-(z*(-1))}
    else if (z<=100 && z>=0){
        var x= 100-z
    }
    x=x+50;
    x=(200-x);
    y=(200-y);

    var nodeSize = [1,4];
    var minmax = [0.1, 6.8];
    var nodeScale = d3.scaleLinear()
        .range(nodeSize)
        .domain(minmax);
    //
    var tar= d3.select("#frec").append("line")
        .attr("x1", 100)
        .attr("y1", 100)
        .attr("x2", x)
        .attr("y2", y)
        .attr('stroke-width',nodeScale(vel) )
        .attr('stroke', 'black')
        .attr("marker-end", "url(#marker_arrow)")
        .attr("marker-start", "url(#marker_arrow)");

    var legVel = d3.select("#frec").append("g")
        .attr("transform","translate(30 ,10)")
        .append("text")
        .attr("fill", "red")
        .style("font-size","10pt")
        .text("Wind Speed: "+vel.toFixed(2)+" km/h")
    var N = d3.select("#frec").append("g")
        .attr("transform","translate(95 ,35)")
        .append("text")
        .attr("fill", "black")
        .style("font-size","15pt")
        .style("font-family", "Informal Roman")
        .style("font-weight","bold")
        .text("N")
    var S = d3.select("#frec").append("g")
        .attr("transform","translate(95 ,175)")
        .append("text")
        .attr("fill", "black")
        .style("font-size","15pt")
        .style("font-family", "Informal Roman")
        .style("font-weight","bold")
        .text("S");
    var E = d3.select("#frec").append("g")
        .attr("transform","translate(165 ,105)")
        .append("text")
        .attr("fill", "black")
        .style("font-size","15pt")
        .style("font-family", "Informal Roman")
        .style("font-weight","bold")
        .text("E");
    var O = d3.select("#frec").append("g")
        .attr("transform","translate(22 ,105)")
        .append("text")
        .attr("fill", "black")
        .style("font-size","15pt")
        .style("font-family", "Informal Roman")
        .style("font-weight","bold")
        .text("O");

}
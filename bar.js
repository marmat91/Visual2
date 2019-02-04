
let dim_mese="tutti"
let dim_giorno="tutti"

function barre (data) {
    d3.select("#svg_barre").selectAll("g").remove();
    d3.select("#bott_indietro").selectAll("button").remove();

    var dati_chimici=[]
    var primo=0
    for (i=1; i<tipi_agenti.length; i++){
        var cf	=	crossfilter(sd);
        if (sensori!="Tutti"){
            var dateS = cf.dimension(function (d) {return d.Monitor});
            dateS.filterExact(sensori);
        }
        var dateT = cf.dimension(function (d) {return d.Chemical});
        dateT.filterExact(tipi_agenti[i]);
        if (dim_mese=="tutti"){
            var dateT = cf.dimension(function(d){ return d.meseanno});
        }
        else {
            var dateT = cf.dimension(function(d){ return d.meseanno});
            dateT.filterExact(dim_mese);
            var dateT = cf.dimension(function(d){ return d.giorno});
            if (dim_giorno!="tutti"){
                dateT.filterExact(dim_giorno);
                var dateT = cf.dimension(function(d){ return d.ora});
            }
        }
        var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
            datiGroup=date.all();
        if (primo==0){
            for (j=0;j<datiGroup.length; j++) {
                dati_chimici.push({nome:Object.values(datiGroup[j])[0],[tipi_agenti[1]]:0, [tipi_agenti[2]]:0, [tipi_agenti[3]]:0, [tipi_agenti[4]]:0})
            }
            for (j=0; j<datiGroup.length; j++) {
                for (k=0; k<dati_chimici.length; k++) {
                    if (dati_chimici[k].nome==Object.values(datiGroup[j])[0]){
                        dati_chimici[k][tipi_agenti[i]]=Object.values(datiGroup[j])[1]
                    }
                }
            }
            primo=1
        }
        else{
            for (j=0; j<datiGroup.length; j++) {
                for (k=0; k<dati_chimici.length; k++) {
                    if (dati_chimici[k].nome==Object.values(datiGroup[j])[0]){
                        dati_chimici[k][tipi_agenti[i]]=Object.values(datiGroup[j])[1]
                    }
                }
            }
        }

    }
    data=dati_chimici
    var margin = {top: 20, right: 100, bottom: 30, left: 40},
    width  = 1000 - margin.left - margin.right,
    height = 500  - margin.top  - margin.bottom;

    var x = d3.scaleBand ()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x); //svg oppure no?
    var yAxis = d3.axisLeft(y); //idem

    var color = d3.scaleOrdinal()
        .range(["#8da0cb","#e78ac3","#fc8d62","#66c2a5"]);
    var svg = d3.select("#svg_barre")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var labelVar = 'nome';
    var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
    color.domain(varNames);
    data.forEach(function (d) {
        var y0 = 0;
        d.mapping = varNames.map(function (name) {
            return {
                name: name,
                label: d[labelVar],
                y0: y0,
                y1: y0 += +d[name]
            };
        });
        d.total = d.mapping[d.mapping.length - 1].y1;
    });
    x.domain(data.map(function (d) { return d.nome; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Rounds");
    var selection = svg.selectAll(".series")
        .data(data)
        .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d.nome) + ",0)"; });
    selection.selectAll("rect")
        .data(function (d) { return d.mapping; })
        .enter().append("rect")
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .style("fill", function (d) { return color(d.name); })
        .style("stroke", "grey")
        .on("mouseover", function (d) { showPopover.call(this, d); })
        .on("mouseout",  function (d) { removePopovers(); })
        .on("click", function(d) {
            if (dim_mese=="tutti"){
                dim_mese=d.label
            } else if (dim_giorno=="tutti") {
                dim_giorno=d.label;
            }
            barre(data)
            removePopovers();
        })

    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(100," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color)
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    if (dim_mese!='tutti'){
        var back = d3.select("#bott_indietro")
            .append("button")
            .style("font-size","15pt")
            .text("Back")
            .on("click", function(d) {
                if (dim_giorno!='tutti'){
                    dim_giorno="tutti"
                }
                else {
                    dim_mese='tutti'
                }
                barre(data)
            });

    }

    function removePopovers () {
        $('.popover').each(function() {
            $(this).remove();
        });
    }
    function showPopover (d) {
        $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() {
                if (dim_giorno!='tutti'){
                    return "Data: "+ dim_giorno+"/"+dim_mese+" "+ d.label +
                        "<br/>Value: " + (d.y1 - d.y0);
                } else if (dim_mese!='tutti'){
                    return "Data: "+d.label +"/"+dim_mese+
                        "<br/>Value: " + (d.y1 - d.y0);
                } else {
                    return "Mese/Anno: " + d.label +
                        "<br/>Value: " + (d.y1 - d.y0);
                }
            }
        });
        $(this).popover('show')
    }

}
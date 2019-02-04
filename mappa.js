let nodi_con_valori=[{nome:"1", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"2", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"3", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"4", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"5", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"6", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"7", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"8", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0},
    {nome:"9", Methylosmolene:0, Chlorodinine:0, "AGOC-3A":0, Appluimonia:0, value:0}]

let color = d3.scaleOrdinal()
    .domain(["Methylosmolene", "Chlorodinine", "AGOC-3A", "Appluimonia","Tutti"])
    .range(["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#b59ea5"]);

let posizioniX = d3.scaleOrdinal()
    .domain (["1","2","3","4","5","6","7","8","9"])
    .range([62,66,76,88,103,102,89,74,119])

let posizioniY = d3.scaleOrdinal()
    .domain (["1","2","3","4","5","6","7","8","9"])
    .range([-21,-35,-41,-45,-43,-22,-3,-7,-42])

function creaMappa (dati) {
    for (i=1; i<tipi_agenti.length; i++){
        var cf	=	crossfilter(sd);
        var dateT = cf.dimension(function (d) {return d.Chemical});
        dateT.filterExact(tipi_agenti[i]);
        var dateT = cf.dimension(function(d){ return d.Monitor});
        var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
            datiGroup=date.all();
        for (j=0; j<datiGroup.length; j++){
            for (k=0; k<nodi_con_valori.length; k++) {
                if (nodi_con_valori[k].nome == datiGroup[j].key) {
                    nodi_con_valori[k][tipi_agenti[i]]=datiGroup[j].value
                }
            }
        }
    }

    var cf	=	crossfilter(sd);
    var dateT = cf.dimension(function(d){ return d.Monitor});
    var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
        datiGroup=date.all();
    for (j=0; j<datiGroup.length; j++){
        for (k=0; k<nodi_con_valori.length; k++) {
            if (nodi_con_valori[k].nome == datiGroup[j].key) {
                nodi_con_valori[k].value=datiGroup[j].value
            }
        }
    }

    console.log(nodi_con_valori)
    console.log (datiGroup);
    
    var cf=crossfilter(datiGroup);
    var tb=cf.dimension(function(d){ return d.value});
    var top=tb.top(1);
    var bott=tb.bottom(1);
    console.log(datiGroup);
    var nodeSize = [0.5,9];
    var minmax = [bott[0].value, top[0].value];
    var nodeScale = d3.scaleLinear()
        .range(nodeSize)
        .domain(minmax);



    console.log(color(agenti))
    var node = svg.selectAll("rect")
        .data(nodi_con_valori).enter()
        .append("rect")
        .attr("fill", color(agenti))
        .attr("width", function (d) {return nodeScale(d.value);})
        .attr("height",6)
        .attr("x", function (d) {return posizioniX(d.nome)-(nodeScale(d.value)/2);})
        .attr("y", function (d) {return (40+ posizioniY(d.nome) );}) //-1 almeno si accentra l'altezza
        .on("mouseover", function (d) { showPopover2.call(this, d); })
        .on("mouseout",  function (d) { removePopovers2(); });

    var circle_all = svg.selectAll("my circle")
        .data(posizione_fabb)

    var elemEnter = circle_all.enter()
        .append("g")
        .attr("transform", function(d){return "translate("+d.x+","+(40+d.y)+")"})


    var circle = elemEnter //LE AZIENDE
        .append("circle")
        .attr("fill", "black")
        .attr("r", 2.5)

    elemEnter
        .append("text")
        .attr("dx", -2)
        .attr("dy", 0.7)
        .style("font-size", 2)
        .style("fill", "red")
        .style("font-weight","bold")
        .text(function(d) { return d.cod ;});

    var legend = svg.append("g")
        .attr("transform",  "translate(105,-12)" )
        .selectAll(".legend")
        .data(posizione_fabb)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 5 + ")"; });
    legend.append("circle")
        .attr("cx", 50)
        .attr("cy", 6)
        .attr("r", 2.5)
        .style("fill", "black");
    legend.append("text")
        .attr("x", 47)
        .attr("y", 6)
        .style("text-anchor", "end")
        .attr("fill", "black")
        .attr("dy", ".35em")
        .style("font-size","1.5pt")
        .text(function (d) { return d.nome; })
    legend.append("text")
        .attr("x", 48)
        .attr("y",6+0.7)
        .style("font-size", 2)
        .style("fill", "red")
        .style("font-weight","bold")
        .text(function(d) { return d.cod ;});


    var min_max_label=0
    var elem_leg = svg.selectAll("g legend")
        .data(minmax)
    var elemEnter_leg = elem_leg.enter()
        .append("g")
        .attr("class", "legenda_minmax")
        .attr("transform","translate(77 ,53.5)")
    var bar_leg = elemEnter_leg.append("rect")
        .attr("width", function(d){return nodeScale(d);})
        .attr("height",6)
        .attr("fill", color(agenti))
        .attr("stroke","black")
        .attr("stroke-width", 0.1)
        .attr("x",function (d) { return nodeScale(d)*2})
    elemEnter_leg.append("text")
        .attr("fill", "black")
        .style("font-size","1.75pt")
        .text(function(d){
            if (min_max_label==0){
                min_max_label=1;
                return "Min: "+d.toFixed(2)
            } else { return "Max: \n"+d.toFixed(2) }

        })
        .attr("x", function (d) { return nodeScale(d)*2+nodeScale(d) })
        .attr("y", 3.5)

}

function updateGrafo(grafo){
    svg.selectAll(".legenda_minmax").remove();
    svg.selectAll("rect").remove();
    sd= grafo.slice();

    var cf	=	crossfilter(sd);
    if(agenti!="Tutti") {
        var dateT = cf.dimension(function (d) {return d.Chemical});
        dateT.filterExact(agenti);
    }
    if(mese!="Tutti i mesi"){
        var month = cf.dimension(function (d) {return d.meseanno});
        if(mese=="Aprile") {var m = "04/16"}
        if(mese=="Agosto") {var m = "08/16"}
        if(mese=="Dicembre") {var m = "12/16"}
        month.filterExact(m);
    }
    if(giorno!="Tutti i giorni"){
        var day = cf.dimension(function (d) {return d.giorno});
        day.filterExact(giorno);
    }
    if(ora!="Tutte le ore"){
        var hour = cf.dimension(function (d) {return d.ora});
        hour.filterExact(ora);
    }

    var dateT = cf.dimension(function(d){ return d.Monitor});
    var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
        datiGroup=date.all();
    console.log (datiGroup);

    var cf=crossfilter(datiGroup);
    var tb=cf.dimension(function(d){ return d.value});
    var top=tb.top(1);
    var bott=tb.bottom(1);
    console.log(datiGroup);
    var nodeSize = [0.5,9];
    var minmax = [bott[0].value, top[0].value];
    var nodeScale = d3.scaleLinear()
        .range(nodeSize)
        .domain(minmax);

    var node = svg
        .selectAll("rect")
        .data(datiGroup).enter()
        .append("rect")
        .attr("fill", color(agenti))
        .attr("width", function (d) {return nodeScale(d.value);})
        .attr("height",6)
        .attr("x", function (d) {return posizioniX(d.key)-(nodeScale(d.value)/2);})
        .attr("y", function (d) {return (40+ posizioniY(d.key)) })
        .on("mouseover", function (d) { showPopover2.call(this, d); })
        .on("mouseout",  function (d) { removePopovers2(); })

    var min_max_label=0
    var elem_leg = svg.selectAll("g legend")
        .data(minmax)
    var elemEnter_leg = elem_leg.enter()
        .append("g")
        .attr("class", "legenda_minmax")
        .attr("transform","translate(77 ,53.5)")
    var bar_leg = elemEnter_leg.append("rect")
        .attr("width", function(d){return nodeScale(d);})
        .attr("height",6)
        .attr("fill", color(agenti))
        .attr("stroke","black")
        .attr("stroke-width", 0.1)
        .attr("x",function (d) { return nodeScale(d)*2})
    elemEnter_leg.append("text")
        .attr("fill", "black")
        .style("font-size","1.75pt")
        .text(function(d){
            if (min_max_label==0){
                min_max_label=1;
                return "Min: "+d.toFixed(2)
            } else { return "Max: \n"+d.toFixed(2) }

        })
        .attr("x", function (d) { return nodeScale(d)*2+nodeScale(d) })
        .attr("y", 3.5)

}

function updateGrafoTutti(grafo){
    svg.selectAll(".legenda_minmax").remove();
    svg.selectAll("rect").remove();
    sd= grafo.slice();

    for (i=1; i<tipi_agenti.length; i++){
        var cf	=	crossfilter(sd);
        var dateT = cf.dimension(function (d) {return d.Chemical});
        dateT.filterExact(tipi_agenti[i]);
        if(mese!="Tutti i mesi"){
            var month = cf.dimension(function (d) {return d.meseanno});
            if(mese=="Aprile") {var m = "04/16"}
            if(mese=="Agosto") {var m = "08/16"}
            if(mese=="Dicembre") {var m = "12/16"}
            month.filterExact(m);
        }
        if(giorno!="Tutti i giorni"){
            var day = cf.dimension(function (d) {return d.giorno});
            day.filterExact(giorno);
        }
        if(ora!="Tutte le ore"){
            var hour = cf.dimension(function (d) {return d.ora});
            hour.filterExact(ora);
        }
        var dateT = cf.dimension(function(d){ return d.Monitor});
        var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
            datiGroup=date.all();
        for (j=0; j<datiGroup.length; j++){
            for (k=0; k<nodi_con_valori.length; k++) {
                if (nodi_con_valori[k].nome == datiGroup[j].key) {
                    nodi_con_valori[k][tipi_agenti[i]]=datiGroup[j].value
                }
            }
        }
    }
    var cf	=	crossfilter(sd);
    if(agenti!="Tutti") {
        var dateT = cf.dimension(function (d) {return d.Chemical});
        dateT.filterExact(agenti);
    }
    if(mese!="Tutti i mesi"){
        var month = cf.dimension(function (d) {return d.meseanno});
        if(mese=="Aprile") {var m = "04/16"}
        if(mese=="Agosto") {var m = "08/16"}
        if(mese=="Dicembre") {var m = "12/16"}
        month.filterExact(m);
    }
    if(giorno!="Tutti i giorni"){
        var day = cf.dimension(function (d) {return d.giorno});
        day.filterExact(giorno);
    }
    if(ora!="Tutte le ore"){
        var hour = cf.dimension(function (d) {return d.ora});
        hour.filterExact(ora);
    }

    var dateT = cf.dimension(function(d){ return d.Monitor});
    var date = dateT.group().reduceSum(function(d) { return d.Reading; }),
        datiGroup=date.all();
    console.log (datiGroup);
    for (j=0; j<datiGroup.length; j++){
        for (k=0; k<nodi_con_valori.length; k++) {
            if (nodi_con_valori[k].nome == datiGroup[j].key) {
                nodi_con_valori[k].value=datiGroup[j].value
            }
        }
    }
    console.log(nodi_con_valori)
    var cf=crossfilter(datiGroup);
    var tb=cf.dimension(function(d){ return d.value});
    var top=tb.top(1);
    var bott=tb.bottom(1);
    console.log(datiGroup);
    var nodeSize = [0.5,9];
    var minmax = [bott[0].value, top[0].value];
    var nodeScale = d3.scaleLinear()
        .range(nodeSize)
        .domain(minmax);

    var node = svg
        .selectAll("rect")
        .data(nodi_con_valori).enter()
        .append("rect")
        .attr("fill", color(agenti))
        .attr("width", function (d) {return nodeScale(d.value);})
        .attr("height",6)
        .attr("x", function (d) {return posizioniX(d.nome)-(nodeScale(d.value)/2);})
        .attr("y", function (d) {return (40+ posizioniY(d.nome) ); })
        .on("mouseover", function (d) { showPopover2.call(this, d); })
        .on("mouseout",  function (d) { removePopovers2(); });

    var min_max_label=0
    var elem_leg = svg.selectAll("g legend")
        .data(minmax)
    var elemEnter_leg = elem_leg.enter()
        .append("g")
        .attr("class", "legenda_minmax")
        .attr("transform","translate(77 ,53.5)")
    var bar_leg = elemEnter_leg.append("rect")
        .attr("width", function(d){return nodeScale(d);})
        .attr("height",6)
        .attr("fill", color(agenti))
        .attr("stroke","black")
        .attr("stroke-width", 0.1)
        .attr("x",function (d) { return nodeScale(d)*2})
    elemEnter_leg.append("text")
        .attr("fill", "black")
        .style("font-size","1.75pt")
        .text(function(d){
            if (min_max_label==0){
                min_max_label=1;
                return "Min: "+d.toFixed(2)
            } else { return "Max: \n"+d.toFixed(2) }

        })
        .attr("x", function (d) { return nodeScale(d)*2+nodeScale(d) })
        .attr("y", 3.5)
}

function removePopovers2 () {
    $('.popover').each(function() {
        $(this).remove();
    });
}
function showPopover2 (d) {
    console.log(d)
    if(agenti=="Tutti") { var titolo = d.nome }
    else {var titolo = d.key}

    $(this).popover({
        title: "Sensore "+titolo,
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() {
            if(agenti=="Tutti") {
                return "Totale: "+d.value+"<br/>AGOC-3A: "+d["AGOC-3A"]  + ", <br/>Appluimonia: " + d["Appluimonia"] +
               ", <br/>Chlorodinine: " + d["Chlorodinine"] +  ", <br/>Methylosmolene: " + d["Methylosmolene"] ;
            }
            else{
                return "Valore "+agenti+": <br/>" +d.value;
            }

        }
    });
    $(this).popover('show')
}


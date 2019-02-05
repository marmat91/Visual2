var date_all =['Tutti i mesi', 'Aprile', 'Agosto', 'Dicembre'];
let mese="Tutti i mesi";
let giorno="Tutti i giorni";
let ora="Tutte le ore";
let agenti="Tutti";
let sensori="Tutti";

function createSelettoreMappa(data1, data) {
    giorni("Tutti i mesi");
    var cf	=	crossfilter(sd);
    var dateT = cf.dimension(function(d){ return d.data_completa});
    var date = dateT.group().all();
    var tbYear = d3.select("#sel").append("select")
        .style("width","200px")
        .on('change',function(d) {
            mese=this.value;
            giorno="Tutti i giorni";
            ora="Tutte le ore";
            giorni(this.value, data1, data);
            if (agenti!="Tutti") {updateGrafo(data1);}
            else {updateGrafoTutti(data1); }
            arrow(data);
        })
        .attr('name','selettore')
        .selectAll("option")
        .data(date_all)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d;
        });
}

function giorni (mese, data1, data){
    ore("Tutti i giorni");
    d3.select("#sel2").selectAll("option").remove();
    var giorno2 = []
    if (mese=='Aprile'){
        var lowEnd=1;
        var highEnd=30;
    } else if(mese=='Tutti i mesi'){
        var lowEnd=1;
        var highEnd=0;
    }

    else {
        var lowEnd=1; var highEnd=31;
    }
    giorno2.push("Tutti i giorni")
    for (var i = lowEnd; i <= highEnd; i++) {
        if (i<10){
            giorno2.push("0"+i);
        }
        else {giorno2.push(i)}
    }
    var tbYear = d3.select("#sel2")
        .style("width","200px")
        .on('change',function(d) {
            //console.log(d)
            //console.log(mese_anno);
            giorno=this.value;
            ora="Tutte le ore";
            console.log(this.value);
            ore(this.value, data1, data);
            if (agenti!="Tutti") {updateGrafo(data1);}
            else {updateGrafoTutti(data1); }
            arrow(data);
        })
        .attr('name','selettore')
        .selectAll("option")
        .data(giorno2)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d;
        });
}

function ore(ore_t, data1, data){
    d3.select("#sel3").selectAll("option").remove();
    var ore_g = []
    if (ore_t=='Tutti i giorni'){
        var lowEnd=1;
        var highEnd=0;
    }
    else {
        var lowEnd=0; var highEnd=23;
    }
    ore_g.push("Tutte le ore")
    for (var i = lowEnd; i <= highEnd; i++) {
        if (i<10){
            ore_g.push("0"+i+":00");
        }
        else{
            ore_g.push(i +":00");
        }
    }
    var tbYear = d3.select("#sel3")
        .style("width","200px")
        .on('change',function(d) {
            //console.log(d)
            //console.log(mese_anno);
            ora=this.value;
            if (agenti!="Tutti") {updateGrafo(data1);}
            else {updateGrafoTutti(data1); }
            arrow(data);

        })
        .attr('name','selettore')
        .selectAll("option")
        .data(ore_g)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d;
        });
}

function createSelettoreMappaAgenti(data1){
    var sAgenti = d3.select("#sel4")
        .style("width","200px")
        .on('change',function(d) {
            //console.log(d)
            //console.log(mese_anno);
            agenti=this.value;
            if (agenti!="Tutti") {updateGrafo(data1);}
            else {updateGrafoTutti(data1); }

        })
        .attr('name','selettore')
        .selectAll("option")
        .data(tipi_agenti)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d;
        });
}

function createSelettoreBarSensor(data1){
    var sAgenti = d3.select("#labelSens")
        .append("label")
        .attr("style", "font-size: 14pt")
        .text("Seleziona il sensore:");
    var sAgenti2 = d3.select("#selSens")
        .on('change',function(d) {
            sensori=this.value;
            barre (data1);
        })
        .attr('name','selettore')
        .selectAll("option")
        .data(["Tutti",1,2,3,4,5,6,7,8,9])
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d;
        });
}
let tipi_agenti= ["Tutti", "AGOC-3A", "Appluimonia", "Chlorodinine", "Methylosmolene"]
let posizione=[{nome: "Roadrunner Fitness Electronics", x:89, y:27},
    {nome: "Kasios Office Furniture", x:90, y:21},
    {nome:"Radiance ColourTek", x:109, y:26},
    {nome:"Indigo Sol Boards", x:120, y:22},
    {nome:"1", x:62, y:21},
    {nome:"2", x:66, y:35},
    {nome:"3", x:76, y:41},
    {nome:"4", x:88, y:45},
    {nome:"5", x:103, y:43},
    {nome:"6", x:102, y:22},
    {nome:"7", x:89, y:3},
    {nome:"8", x:74, y:7},
    {nome:"9", x:119, y:42}
];
let posizione_fabb=[{nome: "Roadrunner Fitness Electronics", x:89, y:-27, cod:"RFE"},
    {nome: "Kasios Office Furniture", x:90, y:-21, cod:"KOF"},
    {nome:"Radiance ColourTek", x:109, y:-26, cod:"RCT"},
    {nome:"Indigo Sol Boards", x:120, y:-22, cod:"ISB"}]
let md;
let sd;

d3.json("csv/gerarchie.json", function(data2) {
    console.log(data2)
    tree(data2);
})
d3.json("csv/dati_completi_2.json", function(data) { //vento
    md = data.slice();

    d3.json("csv/dati_completi.json", function(data1) {
        sd = data1.slice();
        creaMappa(data1);
        createSelettoreMappa(data1, data);
        createSelettoreMappaAgenti(data1);
        arrow(data);
        barre(data1);
        createSelettoreBarSensor(data1);


//console.log(md);
//console.log(sd);
})
});

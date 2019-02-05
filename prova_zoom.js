function tree(data){
    var margin = {top: 10, right: 0, bottom: 0, left: 0},
        width = 1300,
        height = 570,
        formatNumber = d3.format(",d"),
        transitioning;

    var x = d3.scaleLinear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, height - margin.top - margin.bottom])
        .range([0, height - margin.top - margin.bottom]);


    var color = d3.scaleOrdinal()
        .range(d3.schemeCategory10
            .map(function(c) { c = d3.rgb(c); c.opacity = 1; return c; }));

    var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); };
    let colore = d3.scaleOrdinal()
        .domain(["Methylosmolene", "Chlorodinine", "AGOC-3A", "Appluimonia","Tutti"])
        .range(["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#b59ea5"]);

    var format = d3.format(",d");

    var treemap;

    var svg, grandparent;

    updateDrillDown();

    function updateDrillDown() {
        if (svg) {
            svg.selectAll("*").remove();
        } else {

            svg = d3.select("#domainDrillDown").append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.bottom - margin.top)
                .style("margin-left", -margin.left + "px")
                .style("margin.right", -margin.right + "px")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("shape-rendering", "crispEdges");

            //barra per tornare indietro
            grandparent = svg.append("g")
                .attr("class", "grandparent");

            grandparent.append("rect")
                .attr("y", -margin.top)
                .attr("width", width)
                .attr("height", (margin.top+7));

            grandparent.append("text")
                .attr("x", 6)
                .attr("y", 6 - (margin.top+4))
                .attr("dy", ".75em")
                .style("fill","white");

            treemap = d3.treemap()
            //.tile(d3.treemapResquarify)
                .size([width, height])
                .round(false)
                .paddingInner(0);
        }

        //creo le root
        var root = d3.hierarchy(data)
            .eachBefore(function(d) { d.name = (d.parent ? d.parent.name + "." : "") + d.data.name; })
            .sum((d) => d.value)
            .sort(function(a, b) {
                return b.height - a.height || b.value - a.value; });

        initialize(root);
        accumulate(root);
        layout(root);
        treemap(root);
        display(root);

    };

    function initialize(root) {
        root.x = root.y = 0;
        root.x1 = width;
        root.y1 = height;
        root.depth = 0;
    }

    //aggrego i valori per i nodi interni. I nodi children vengono sovrascritti quando viene calcolato il layout
    function accumulate(d) {
        return (d._children = d.children)
            ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
            : d.value;
    }


    //calcolo il layout del treemap in maniera ricorsiva almeno i chidren non utilizzino la dim del parent.
    //mantengo anche la dim del genitore
    function layout(d) {
        if (d._children) {
            d._children.forEach(function(c) {
                c.x0 = d.x0 + c.x0 * d.x1;
                c.y0 = d.y0 + c.y0 * d.y1;
                c.x1 *= d.x1;
                c.y1 *= d.y1;
                c.parent = d;
                layout(c);
            });
        }
    }



    function display(d) {

        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d))
            ;

        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth")
            ;

        var g = g1.selectAll("g")
            .data(d._children)
            .enter().append("g")
            ;

        g.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);

        var children = g.selectAll(".child")
            .data(function(d) { return d._children || [d]; })
            .enter().append("g");

        children.append("rect")
            .attr("class", "child")
            .call(rect)
            .append("title")
            .text(function(d) { return d.data.name + " (" + (d.value) + ")"; });



        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            ;

        //imposto i nomi e valori
        var t = g.append("text")
            .attr("class", "ptext")
            .attr("dy", ".65em")
        t.append("tspan")
            .text(function(d) { return d.data.name; })
            .attr("style", "font-size: 10pt");
        t.append("tspan")
            .attr("dy", "1.0em")
            .text(function(d) { return (d.value.toFixed(2)); })
            .attr("style", "font-size: 10pt");
        t.call(text);

        //imposto i colori
        g.selectAll("rect")
            .style("fill", function(d) { if (tipi_agenti.indexOf(d.data.name)!=-1){console.log(d.data.name); return colore(d.data.name);}
            else {return color(d.data.name)}})
            ;


        //transizioni (es se clicco sulla barra sopra)
        function transition(d) {
            if (transitioning || !d) return;
            transitioning = true;

            var g2 = display(d),
                t1 = g1.transition().duration(750),
                t2 = g2.transition().duration(750);

            // Aggiorno il dominio solo quando entro nell'elemento
            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);

            // Abilito  l'"anti-aliasing" durante la transizione.
            svg.style("shape-rendering", null);

            // Draw child nodes on top of parent nodes.
            svg.selectAll(".depth").sort(function(a, b) {
                return a.depth - b.depth; });

            g2.selectAll("text").style("fill-opacity", 0);

            // Transiziono la nuova vista.
            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll("text").call(text).style("fill-opacity", 1);
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);

            // Rimuovo i vecchi nodi quando la transizione finisce
            t1.remove().on("end", function() {
                svg.style("shape-rendering", "crispEdges");
                transitioning = false;
            });
        }

        return g;
    }

    function text(text) {
        text.selectAll("tspan")
            .attr("x", function(d) { return x(d.x0) + 6; });
        text.attr("x", function(d) { return x(d.x0) + 6; })
            .attr("y", function(d) { return y(d.y0) + 10; })
            .style("opacity", function(d) {
                return this.getComputedTextLength() < x(d.x0 + d.x1) - x(d.x0) ? 1 : 0;
            });
    }


    function rect(rect) {
        rect.attr("x", function(d) { return x(d.x0); })
            .attr("y", function(d) { return y(d.y0); })
            .attr("width", function(d) {
                return x(d.x0 + d.x1) - x(d.x0);

            })
            .attr("height", function(d) {
                return y(d.y0 + d.y1) - y(d.y0);

            })
            ;
    }

    function name(d) {
        return d.parent
            ? name(d.parent) + " / " + d.data.name + " (" + (d.value.toFixed(2)) + ")"
            : d.data.name + " (" + (d.value.toFixed(2)) + ")";
    }
}
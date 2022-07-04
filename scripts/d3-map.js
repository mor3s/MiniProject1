document.addEventListener("DOMContentLoaded", populateYearsOptions);
document.addEventListener("DOMContentLoaded", mapPop);
document.addEventListener("DOMContentLoaded", createNationalWordcloud(1900));
// Allier Ariège Ain Hautes-Alpes Alpes-Maritimes Alpes-de-Haute-Provence Val-d'Oise Hauts-de-Seine Seine-Saint-Denis Val-de-Marne Essonne Ardennes Territoire de Belfort
function mapBabyYear() {

}

function computeDistance(deptData, natData, nbDept, nbNat) {
    let Squaredist = 0;
    for (let e in natData) {
        let deptVal = deptData.filter(function(d) {
            return d.word == e.word
        }).val;
        Squaredist += Math.pow((e.size / nbNat) - (deptVal / nbDept), 2);
    }
    return Math.sqrt(Squaredist);
}


function yearChanged() {
    let select = document.getElementById('year-select');

    createNationalWordcloud(select.value);
}

function populateYearsOptions() {
    /*    <option value="1900">1900</option> ...
    <option value="2017">2017</option>*/
    let select = document.getElementById('year-select');
    for (let i = 1900; i <= 2017; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.textContent = i.toString();
        select.appendChild(option);
    }
}

function mapPop() {
    const width = 700,
        height = 550;

    const path = d3.geoPath();

    const projection = d3.geoConicConformal() // Lambert-93
        .center([2.454071, 46.279229]) // Center on France
        .scale(2600)
        .translate([width / 2 - 50, height / 2]);

    path.projection(projection);

    const svg = d3.select('#map').append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "YlGnBu");

    const deps = svg.append("g");

    var promises = [];
    promises.push(d3.json('../data/departments.geojson'));
    promises.push(d3.csv('../data/population.csv'));
    Promise.all(promises).then(function(values) {
        const geojson = values[0];
        const csv = values[1];

        var features = deps
            .selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr('id', d => "d" + d.properties.code)
            .attr("d", path);

        // Quantile scales map an input domain to a discrete range, 0...max(population) to 1...9
        var quantile = d3.scaleQuantile()
            .domain([0, d3.max(csv, e => +e.POP)])
            .range(d3.range(9));

        var legend = svg.append('g')
            .attr('transform', 'translate(525, 150)')
            .attr('id', 'legend');

        legend.selectAll('.colorbar')
            .data(d3.range(9))
            .enter().append('svg:rect')
            .attr('y', d => d * 20 + 'px')
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', '0px')
            .attr("class", d => "q" + d + "-9");

        var legendScale = d3.scaleLinear()
            .domain([0, d3.max(csv, e => +e.POP)])
            //.domain([0, 1])
            .range([0, 9 * 20]);

        var legendAxis = svg.append("g")
            .attr('transform', 'translate(550, 150)')
            .call(d3.axisRight(legendScale).ticks(6));

        csv.forEach(function(e, i) {
            d3.select("#d" + e.CODE_DEPT)
                .attr("class", d => "department q" + quantile(+e.POP) + "-9")
                .on("mouseover", function(event, d) {
                    clearWordcloud("#dept-wordcloud");
                    //createDepartmentalWordcloud(e.NOM_DEPT, document.getElementById('year-select').value);
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    var promises = [];
                    promises.push(d3.json('../data/dpt_year_parsed/dpt' + document.getElementById('year-select').value + '.json'));
                    promises.push(d3.json('../data/departement_name.json'));
                    Promise.all(promises).then(function(values) {
                        let data = values[0][0]["Year"];
                        data = data.filter(function(d) {
                            return d.dpt == e.CODE_DEPT;
                        });
                        let pop = 0
                        for (let i = 0; i < data.length; i++) {
                            pop += parseInt(data[i].nombre)
                        }
                        data = data.slice(0, 10);
                        let myWords = []
                        for (let i = 0; i < 10; i++) {
                            myWords[i] = { word: data[i]["preusuel"], size: (parseInt(data[i]["nombre"]) / pop).toString() };
                        }
                        createWordcloud(myWords, "dept-wordcloud")
                        div.html("<b>Region : </b>" + e.NOM_REGION + "<br>" +
                                "<b>Department : </b>" + e.NOM_DEPT + "<br>" +
                                "<b>Most given name : </b>" + data[0]["preusuel"] + "<br>"
                            )
                            .style("left", (event.pageX + 30) + "px")
                            .style("top", (event.pageY - 30) + "px");
                    });
                    div.html("<b>Region : </b>" + e.NOM_REGION + "<br>" +
                            "<b>Department : </b>" + e.NOM_DEPT + "<br>" +
                            "<b>Population : </b>" + e.POP + "<br>")
                        .style("left", (event.pageX + 30) + "px")
                        .style("top", (event.pageY - 30) + "px");
                })
                .on("mouseout", function(event, d) {

                    div.style("opacity", 0);
                    div.html("")
                        .style("left", "-500px")
                        .style("top", "-500px");
                });
        });
    });

    // Append a DIV for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0);
}

function clearWordcloud(wordcloud) {
    d3.select(wordcloud).selectAll("*").remove();
}

function createNationalWordcloud(year) {
    // List of words
    clearWordcloud("#national-wordcloud");
    let myWords = [];
    var promises = [];
    promises.push(d3.json('../data/nat_year_parsed/nat' + year + '.json'));
    Promise.all(promises).then(function(values) {
        let data = values[0][0]["Year"];
        let pop = 0

        for (let i = 0; i < data.length; i++) {
            pop += parseInt(data[i].nombre)
        }
        data = data.slice(0, 10);
        for (let i = 0; i < 10; i++) {
            myWords[i] = { word: data[i]["preusuel"], size: (parseInt(data[i]["nombre"]) / pop).toString() };
        }
        //console.log(myWords)
        createWordcloud(myWords, "national-wordcloud");
    });
    //let myWord = [{ word: "hi", size: "10" }, { word: "bye", size: "20" }, { word: "cry", size: "50" }, { word: "shy", size: "30" }, { word: "lie", size: "20" }, { word: "chai", size: "60" }]
    //createWordcloud(myWord, "national-wordcloud");
}

//function createDepartmentalWordcloud(dept, year) {
//    var promises = [];
//    let myWords = []
//    promises.push(d3.json('../data/dpt_year_parsed/dpt' + year + '.json'));
//    promises.push(d3.json('../data/departement_name.json'));
//    Promise.all(promises).then(function(values) {
//        let data = values[0][0]["Year"];
//
//        data = data.filter(function(d) {
//            return d.dpt == dept;
//        });
//
//        data = data.slice(0, 10);
//        console.log(data)
//        for (let i = 0; i < 10; i++) {
//            myWords[i] = { text: data[i]["preusuel"], size: data[i]["nombre"], value: data[i]["nombre"] };
//        }
//        //console.log(myWords)
//        createWordcloud(myWords, "dept-wordcloud");
//    });
//    //let myWord = [{ word: "hi", size: "10" }, { word: "bye", size: "20" }, { word: "cry", size: "50" }, { word: "shy", size: "30" }, { word: "lie", size: "20" }, { word: "chai", size: "60" }]
//    //reateWordcloud(myWord, "dept-wordcloud");
//
//}

function createWordcloud(myWords, id) {
    console.log(myWords)
        // set the dimensions and margins of the graph
    let width = 450,
        height = 450;
    // append the svg object to the body of the page
    let svg = d3.select("#" + id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + 10 + "," + 10 + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    let layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function(d) { return { text: d.word, value: d.size * 50000, size: d.size * 50000 }; }))
        .padding(5) //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        //.fontSize(d => d.size) // font size of words
        .on("end", draw);
    layout.start();
    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        console.log(words)
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}
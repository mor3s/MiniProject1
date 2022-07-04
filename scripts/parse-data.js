// function download(content, mimeType, filename){
//     const a = document.createElement('a') // Create "a" element
//     const blob = new Blob([content], {type: mimeType}) // Create a blob (file-like object)
//     const url = URL.createObjectURL(blob) // Create an object URL from blob
//     a.setAttribute('href', url) // Set "a" element link
//     a.setAttribute('download', filename) // Set download filename
//     a.click() // Start downloading
// }

// function run() {
// let year = 1900;
// let yearsGroups = [];
// let top10YearsGroups = [];
// var promises = [];
// promises.push(d3.tsv('../data/nat1900-2017.tsv'));

// Promise.all(promises).then(function(values) {
//     let data = values[0];
//     data = data.sort(function (a,b) {return d3.ascending(a.annais, b.annais);});
//     data = data.filter(function(d){ return !isNaN(d.annais)});
//     for (let i = 1900; i <= 2017; i++) {
//         year_data = data.filter(function(d){ return d.annais == i})
//         year_data = year_data.sort(function (a,b) {return (b.nombre - a.nombre);});
//         yearsGroups.push(year_data);
//         year_data = year_data.filter(function(d,i){ return i<10 })
//         top10YearsGroups.push(year_data);
//     }

//     let count = 110;
//     for (let i = 2010; i <= 2017; i++) {
//         let all_year_data = [];
//         let aydObj = {}
//         aydObj["Year"] = yearsGroups[count];
//         aydObj["Top 10"] = top10YearsGroups[count];
//         all_year_data.push(aydObj);

//         // console.log(all_year_data);

//         download(JSON.stringify(all_year_data), 'application/json', `nat${i}.json`);
//         count++;
//     }
// });
// }


///////////////////////////////////////////////////////


function download(content, mimeType, filename) {
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([content], { type: mimeType }) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', filename) // Set download filename
    a.click() // Start downloading
}

//function run() {
//    let year = 1900;
//    let yearsGroups = [];
//    let top10YearsGroups = [];
//    var promises = [];
//    promises.push(d3.csv('../data/dpt2020.csv'))
//    Promise.all(promises).then(function(values) {
//        let data = values[0];
//        data = data.sort(function(a, b) { return d3.ascending(a.annais, b.annais); });
//        data = data.filter(function(d) { return !isNaN(d.annais) });
//        for (let i = 1900; i <= 2017; i++) {
//            year_data = data.filter(function(d) { return d.annais == i })
//            year_data = year_data.sort(function(a, b) { return (b.nombre - a.nombre); });
//            yearsGroups.push(year_data);
//            year_data = year_data.filter(function(d, i) { return i < 10 })
//            top10YearsGroups.push(year_data);
//        }
//        let count = 110;
//        for (let i = 2010; i <= 2017; i++) {
//            let all_year_data = [];
//            let aydObj = {}
//            aydObj["Year"] = yearsGroups[count];
//            aydObj["Top 10"] = top10YearsGroups[count];
//            all_year_data.push(aydObj)
//                // console.log(all_year_data)
//            download(JSON.stringify(all_year_data), 'application/json', `dpt${i}.json`);
//            count++;
//        }
//    });
//}
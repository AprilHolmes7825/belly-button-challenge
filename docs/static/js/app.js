const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let metadata = [];
let samples = [];

init();
//getData();

function init() {
    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {

      let keys = Object.keys(data);
      let values = Object.values(data);

      //Get arrays from within the sample json
      metadata = values[1];
      samples = values[2];

      d3.select('#selDataset')
          .on('change', () => getData())
          //.data(names)
          .enter();
      
      //populate the items in the dropdown
      for (let j = 0; j < data.names.length; j++) {
          d3.select('#selDataset')
              .append('option')
              .attr('value', data.names[j])
              .text(data.names[j]);
        }
    });

    // Assuming your dropdown has an ID, for example, "myDropdown"
// var dropdownID = 'selDataset';

// // Use Plotly.update to set the selected value of the dropdown
// Plotly.update('well', {
//   'updatemenus': [{
//     'x': 0.1,
//     'y': 1.15,
//     'xanchor': 'left',
//     'yanchor': 'top',
//     'buttons': [{
//       'label': 'First Item',
//       'method': 'relayout',
//       'args': ['updatemenus.' + dropdownID + '.active', 0]  // Set the active index to 0 (first item)
//     }]
//   }]
// });

}





// Function called by DOM changes
function getData() {
 
  //filter to get samples from selected participant ID
  let personSamples = samples.filter(selectedSamples);


  otu_ids_ids = personSamples.map(function(sample) {
    return sample.otu_ids;
  });

  otu_ids = personSamples.map(function(sample) {
    return sample.otu_ids.map(function(id) {return `OTU ${id}`} );
  });

  sample_values = personSamples.map(function(sample) {
    return sample.sample_values;
  });

  otu_labels = personSamples.map(function(sample) {
    return sample.otu_labels;
  });

  //set up samplesets as object and put in array to sort to get top 10
  let samplesets =[];
  for (let j = 0; j < otu_ids_ids[0].length; j++) {
    let sampleset = {
      otu_id: otu_ids_ids[0][j],
      otu_label: otu_ids[0][j],
      value : sample_values[0][j],
      label: otu_labels[0][j]
    };
    samplesets.push(sampleset);
  };

  //sort dictionary array and get list of first 10 sorted by sample value
  let sorted = samplesets.sort(
    (p1, p2) => (p1.value < p2.value) ? 1 : (p1.value > p2.value ? -1 : 0))

  let sortedsliced = sorted.slice(0, 10);

  //console.log(sortedsliced)

  let barData = [{
    x: sortedsliced.map(item => item.value),
    y: sortedsliced.map(item => item.otu_label),
    hovertext: sortedsliced.map(item => item.label.replace(";","<br>")),
    type: 'bar',
    orientation: 'h'
  }];

  //Populate horizontal bar chart
  Plotly.newPlot("bar", barData)


  //Populate metadata panel
  let personMetadata = metadata.filter(selectedMetadata);
  
  let metaKeys = Object.keys(personMetadata[0]);
  let metaValues = Object.values(personMetadata[0]);
 
  
  //clear out prior values
  d3.select("#sample-metadata").selectAll("p").remove();
  
  for (let j = 0; j < metaKeys.length; j++) {
    d3.select("#sample-metadata").append("p").text(`${metaKeys[j]} : ${metaValues[j]}`);
  }
  
//Populate bubble chart
let bubbleData = {
  x: sortedsliced.map(item => item.otu_id),
  y: sortedsliced.map(item => item.value),
  text: sortedsliced.map(item => item.label),
  mode: 'markers',
  marker: {
    color: ['darkmagenta','blueviolet','mediumorchid', 'plum', 'palevioletred', 'pink', 'thistle', 'lightseagreen', 'turquoise', 'mediumaquamarine'],
    size: sortedsliced.map(item => item.value)
}};

var data2 = [bubbleData];

var layout = {
  //title: 'Bellybutton',
  showlegend: false,
  height: 600,
  width: 1200
};

Plotly.newPlot('bubble', data2, layout);

//gauge chart
var gaugeData = [
  {
    type: "indicator",
    mode: "gauge+number",
    value: metaValues[metaKeys.indexOf("wfreq")],
    
    title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
    delta: { reference: metaValues[metaKeys.indexOf("wfreq")], increasing: { color: "RebeccaPurple" } },
    gauge: {
      axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      //text: ["0 - 1", "1 - 2", "2 - 3", "3 - 4", "4 - 5", "5 - 6", "6 - 7", "8 - 9", "9 - 10"],
      steps: [
        { range: [0, 1], color: "oldlace" },
        { range: [1, 2], color: "linen" },
        { range: [2, 3], color: "lightcyan" },
        { range: [3, 4], color: "lightsteelblue" },
        { range: [4, 5], color: "lightblue" },
        { range: [5, 6], color: "lightskyblue" },
        { range: [6, 7], color: "deepskyblue" },
        { range: [7, 8], color: "cornflowerblue" },
        { range: [8, 9], color: "slateblue" },
        { range: [9, 10], color: "mediumblue" }
      ]
      // threshold: {
      //   line: { color: "red", width: 4 },
      //   thickness: 0.75,
      //   value: 490
      // }
    }
  }
];

var layout = {
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  font: { color: "darkblue", family: "Arial" }
};

Plotly.newPlot('gauge', gaugeData, layout);

}



// Update the restyled plot's values
function updatePlotly(newdata) {
  Plotly.restyle("bar", "values", [newdata]);
}


function selectedSamples(sample, id){
  return sample.id == d3.select("#selDataset").property("value");
}

function selectedMetadata(metadata){
    return metadata.id == d3.select("#selDataset").property("value");
}

//initialize

// read in the data 
/* <script src="./static/js/app.js"></script> */

var file_path='../../samples.json'
d3.json(file_path).then(function(data){
    console.log(data);
    dropdown(data);
});
// populate drop down menu
// wait for the d3 promise to be filled
// for each item in names attribute, create an option element in
    //  html under the select element
// program optionChanged to match html

function dropdown(sampleData) {
    sampleData['names'].forEach(name=>{
        var newOption=d3.select('#selDataset').append('option');
        newOption.text(name);
        newOption.property('value',name);
    });
};

function optionChanged(selected){
    console.log(selected);
    buildbar(selected);
    buildTable(selected);
};

// d3.select('#selDataset').on('change', optionChanged(this));

// Build a Barchart based on the Selection
// filter down to top 10 OTU's
// inverse sort

function buildbar(sampleId){
    d3.json(file_path).then(function(data){
    var samples=data['samples'];
    var selectedSample=samples.filter(sample=>sample['id']==sampleId)[0];
    console.log(selectedSample);
    traceBar={
        type:"bar",
        y: selectedSample['otu_ids'].map(otu_id=>'OTU' +otu_id.toString()).slice(0,10).reverse(),
        x: selectedSample['sample_values'].slice(0,10).reverse(),
        text: selectedSample['otu_labels'].slice(0,10).reverse(),
        orientation: 'h'
    };
        console.log(traceBar);
        Plotly.newPlot('bar', [traceBar])

    traceBubble={
        type: 'scatter',
        x: selectedSample['otu_ids'],
        y: selectedSample['sample_values'],
        mode: 'markers',
        marker:{
            size: selectedSample['sample_values'].map(sample_value=>sample_value/2),
            color: selectedSample['otu_ids'],
            colorscale: 'Earth'
        }
    };
        Plotly.newPlot('bubble',[traceBubble])
    });
};

// buildbar('940');

// build the metadata from json
// d3.json -> read the data from samples. json again
// for each object.enteries add new h6

function buildTable(sampleId){
    d3.json(file_path).then(function(data){
        var metadata=data['metadata'];
        var selectedMetadata=metadata.filter(meta=> meta['id']==sampleId)[0];
        // console.log(metadata);
        var panel=d3.select('#sample-metadata');
        Object.entries(selectedMetadata).forEach(([meta_key, meta_value])=>{
            panel.append('h6')
            .text(`${meta_key}: ${meta_value}`);
        });
    });
}

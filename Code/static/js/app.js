
/* <script src="./static/js/app.js"></script> */
// Use the D3 library to read in samples.json

var file_path='../../samples.json'
d3.json(file_path).then(function(data){
    console.log("Samples JSON successfully read");
    dropdown(data);
});
// create a horizontal bar chart with a dropdown menupopulate drop down menu
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

// Function optionChanged makes the new plots and metadata box according to which subject ID is selected from the menu
function optionChanged(selected){
    console.log(selected);
    buildbar(selected);
    buildTable(selected);
};

// d3.select('#selDataset').on('change', optionChanged(this));

// Build a Barchart based on the Selection
// filter down to top 10 OTU's
// inverse sort
//Function makePlot takes the IDs from the JSON and creates a bar graph, a bubble chart
function buildbar(sampleId){

    // read the data
    d3.json(file_path).then(function(data){
    var samples=data['samples'];

     // Filters the data to only include the samples from the selected ID in the menu
    var selectedSample=samples.filter(sample=>sample['id']==sampleId)[0];
    console.log(selectedSample);

//Create the trace for the bar graph using the sample value, OTU ID, and labels variables. 
   
    traceBar={
        type:"bar",
        // Sets the sample values from the desired ID to a variable
        // Uses slice function to only set the top 10 values to an array.
        // Uses the reverse function to set them in descending order
        y: selectedSample['otu_ids'].map(otu_id=>'OTU' +otu_id.toString()).slice(0,10).reverse(),
        x: selectedSample['sample_values'].slice(0,10).reverse(),
        text: selectedSample['otu_labels'].slice(0,10).reverse(),

        // Orientation is set to 'h' for horizontal 
        orientation: 'h'
    };
        console.log(traceBar);
        Plotly.newPlot('bar', [traceBar])


// Create the trace for the bubble chart using the the created variables
// set the layout for the bubble plot        
    traceBubble={
        type: 'scatter',
        x: selectedSample['otu_ids'],
        y: selectedSample['sample_values'],
        mode: 'markers',
        marker:{
            size: selectedSample['sample_values'].map(sample_value=>sample_value/2),
            color: selectedSample['otu_ids'],
            colorscale: ['greens'],
            text: selectedSample['otu_labels']
        },
    };
        Plotly.newPlot('bubble',[traceBubble])
    });
};

// buildbar('940');

// Display the sample metadata from json
// d3.json -> read the data from samples. json again

// for each object.enteries add new h6
// Function makeMetadata takes the metadata JSON info from the desired ID and prints them in a box on the page

function buildTable(sampleId){
    d3.json(file_path).then(function(data){

    //Sets the metadata object to a variable    
        var metadata=data['metadata'];

    // Filters the metadata object to the desired ID from the dropdown menu    
        var selectedMetadata=metadata.filter(meta=> meta['id']==sampleId)[0];

        // console.log(metadata);

        //Selects the demographic info box
        var panel=d3.select('#sample-metadata');

        //Appends one line to the box for each metadata key found, and prints out the keys and values of them
        Object.entries(selectedMetadata).forEach(([meta_key, meta_value])=>{
            panel.append('h6')
            .text(`${meta_key}: ${meta_value}`);
        });
    });
}

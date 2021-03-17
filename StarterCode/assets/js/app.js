// @TODO: YOUR CODE HERE!
var svgHeight = 600;
var svgWidth = 800;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 125,
  left: 125
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
// Load data for D3 Journalism data
d3.csv("assets/data/data.csv").then(function(censusData) {

  // Data
  console.log(censusData);

  // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

  // Create scale functions
    // ==============================
  
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, data => data.healthcare) -2, d3.max(censusData, data => data.healthcare) + 2])
    .range([chartHeight, 0]);
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, data => data.poverty) - 1, d3.max(censusData, data => data.poverty) + 1])
      .range([0, chartWidth]);

  // Step 3: Create axis functions
    // ==============================
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);
    
  // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

  // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cy", data => yLinearScale(data.healthcare))
      .attr("cx", data => xLinearScale(data.poverty))
      .attr("r", "10")
      .attr("opacity", "0.75")
      .attr("class", "stateCircle")
      .attr("stroke", "white");


  // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 0])
      .html(function(data) {
        return (`<strong>${data.state}</br></br>Lacks Healthcare (%):</br>${data.healthcare}</br></br>Poverty (%):</br> ${data.poverty}<strong>`);
      });

  // Create tooltip in the chart
  // ==============================
    svg.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
    // mouseclick event
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    });
    // onmouseover event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    });
    // onmouseout event
    circlesGroup.on("mouseout", function(data) {
      toolTip.hide(data, this);
    });

  // Create axes labels
  // ==============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axistext")
      //.text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axistext")
      //.text("Poverty (%)");

    // State Abbreviation in the Cirles
    chartGroup.selectAll("circleText")
    .data(censusData)
    .enter()
    .append("text")
    .attr("dx", function (data, index) {
      return xLinearScale(data.poverty) - 11.5
    })
    .attr("dy", function (data) {
      return yLinearScale(data.healthcare) + 4
    })
    .text(function (data, index) {
      return data.abbr;
    })
//    .style("fill", "white");

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // Append y-axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 1.1))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percentage of Population in Poverty (by state)");

  // Append x-axis labels
  chartGroup.append("text")
    .attr("transform", "translate(" + (chartWidth / 3.1) + " ," + (chartHeight + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Percentage of Population With Healthcare Access (by state)");
});
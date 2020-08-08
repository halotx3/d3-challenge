// @TODO: YOUR CODE HERE!
// svg container
const height = 600;
const width = 1000;
let xAxis = 'poverty'
const margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};
const chartHeight = height - margin.top - margin.bottom;
const chartWidth = width - margin.left - margin.right;


// create svg container
const svg = d3.select('#scatter').append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'bar_chart');

const labelsGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${chartHeight + 20})`);

// Add Y axis label grouping
svg.append('g')
    .attr('transform', `translate(-25, ${chartHeight / 2}) rotate(-90)`)
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'healthcare')
    .text('Healthcare');


// X axis label grouping
labelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty') // value to grab for event listener
    .text('Poverty');

// Define update functions that will be called when user selection is made
function xScale_update(data, xAxis) {
    const xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xAxis])])
        .range([0, chartWidth]);

    return xLinearScale
};

function renderAxes(newXScale, xAxis_g) {
    /*Update xAxis with new scale value */

    const bottomAxis = d3.axisBottom(newXScale);

    xAxis_g.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis_g;
};

function UpdateBars(circleGroup, newXScale) {
    /* function used for updating circles group by clicking on event listener */
    circleGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[xAxis]));

    return;
};

d3.csv('./assets/data/data.csv')
    .then(function (health_poverty_data) {
        let ymin = d3.min(health_poverty_data.map(d => parseFloat(d['healthcare'])));
        let ymax = d3.max(health_poverty_data.map(d => parseFloat(d['healthcare'])));

        const yScale = d3.scaleLinear()
            .domain([ymin, ymax])
            .range([chartHeight, 0]);

        // X axis: Testing to see if there is a string vs integer

        let xmin = d3.min(health_poverty_data, d => parseFloat(d[xAxis]))
        let xmax = d3.max(health_poverty_data, d => parseFloat(d[xAxis]))


        const xScale = d3.scaleLinear()
            .domain([xmin, xmax])
            .range([0, chartWidth])

        // Create axes for Svg
        const yAxis_func = d3.axisLeft(yScale);
        const xAxis_func = d3.axisBottom(xScale);

        // set x to the bottom of the chart
        let xAxis_g = svg.append('g')
            .attr('id', 'xaxis')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis_func);

        // Assign YAxis to variable so we can update it later
        let yAxis_g = svg.append('g')
            .attr('id', 'yaxis')
            .call(yAxis_func);

        const circleGroup = svg.selectAll('circle')
            .data(health_poverty_data)
            .enter()

        circleGroup.append('circle')
            .attr('cx', d => xScale(parseFloat(d['poverty'])))
            .attr('cy', d => yScale(d['healthcare']))
            .attr('r', 8)
            .classed('moreInfo', true)
            // .attr('fill', d => [d['abbr']])
            .attr('fill', 'blue')


        circleGroup.append("text")
            // Update the text to the abbrevation of the group
            .text(function(d) {
            return d.abbr;
            })
            .attr('dx', d => xScale(parseFloat(d['poverty'])))
            .attr("text-anchor", "middle") 
            .attr('alignment-baseline', 'middle')
            .attr('dy', d => yScale(d['healthcare']))
            .attr("class", "text_info")
            .style('font-size', 9)
            .attr('fill', 'white')
});
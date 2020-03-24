// Create Initial Time Plot
function createLinePlot(data, dataKeys, colors, unavailableFlag){

    // Get Data Arrays
    let dataArrays = getDataByKeys(data, dataKeys)
    const firstNonZeroIndex = getFirstNonZeroDataDay(dataArrays)
    dataArrays = dataArrays.map(a=>a.slice(firstNonZeroIndex))
    const datesArray = data.map(d=>d['data']).slice(firstNonZeroIndex)

    console.log(data)
    console.log(dataKeys)


    // Create Time Scale
    const xScale = getTimeScale(timeChartWidthFracPadLeft*timeChartWidth, 
        (1-timeChartWidthFracPadRight)*timeChartWidth,
        ...datesArray)

    const yScale = getTimeChartYScale($('#radio-a').prop('checked'), 
            (1-timeChartHeightFracPadBottom)*timeChartHeight,
            timeChartHeightFracPadTop*timeChartHeight, 
            ...dataArrays)

    // Create Line Elements

    const line = d3.line()
        .x((_, i)=>xScale(timeParse(datesArray[i])))
        .y(d=>yScale(d))

    const lines = d3.select('#time-chart').select('svg').selectAll('.line')
        .data(dataArrays)


    lines.exit().remove()

    lines
        .enter()
        .append('path')
        .classed('line', true)
        .merge(lines)
        .attr('id', (_,i)=> 'line' + i)
        .style('stroke', (_,i)=>colors[i])
        .attr('d', line)


    //animatelines()

    // Create Axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(4)
        .tickFormat(timeFormat)
        .tickSize(0)
    const yAxis = d3.axisLeft(yScale)
        .ticks(3)
        .tickFormat(d3.format("~s"))
        .tickSize(0)

    // Append Axis
    svgTime.select('#x-axis')
        .remove()
    svgTime
        .append('g')
        .attr('id', 'x-axis')
        .style('transform', 'translate(0,' + parseInt(timeChartHeight - timeChartHeightFracPadBottom*timeChartHeight) + 'px)')
        .call(xAxis)

    svgTime.select('#y-axis')
        .remove()
    svgTime
        .append('g')
        .attr('id', 'y-axis')
        .style('transform', 'translate(' + parseInt(timeChartWidthFracPadLeft * timeChartWidth) + 'px,0)')
        .call(yAxis)
    
}

	
function animatelines() {

    d3.selectAll(".line").style("opacity","0.5");

    //Select All of the lines and process them one by one
    d3.selectAll(".line").each(function(d,i){

    // Get the length of each line in turn
    var totalLength = d3.select("#line" + i).node().getTotalLength();

        d3.selectAll("#line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1000)
          .delay(100*i)
          .ease(d3.easePoly)
          .attr("stroke-dashoffset", 0)
          .style("stroke-width",3)
    })

 
} 


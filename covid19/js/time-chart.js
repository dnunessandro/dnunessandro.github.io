// Create Initial Time Plot
function createLinePlot(data, dataKeys, colors, unavailableFlag, labels){

    // Get Data Arrays
    let dataArrays = unavailableFlag ? [getDummyUnavailableDailyData(data)['dummyArray1'], 
        getDummyUnavailableDailyData(data)['dummyArray2']] : 
        getDataByKeys(data, dataKeys)
    
    const firstNonZeroIndex = getFirstNonZeroDataDay(dataArrays)
    dataArrays = dataArrays.map(a=>a.slice(firstNonZeroIndex))
    let datesArray = unavailableFlag ? getDummyUnavailableDailyData(data)['dates'] : data.map(d=>d['data'])
    datesArray = datesArray.slice(firstNonZeroIndex)


    // Get colors
    colors = unavailableFlag ? unavailableColors : colors

    // Create Time Scale
    const xScale = getTimeScale(timeChartWidthFracPadLeft*timeChartWidth, 
        (1-timeChartWidthFracPadRight)*timeChartWidth,
        ...datesArray)


    const yScale = getTimeChartYScale($('#scale-button').prop('checked'), 
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

    animatelines(unavailableFlag)


    // Create Labels Elements
    labels = labels.includes('Novos Casos') ? ['Total'] : labels
    labels = unavailableFlag ? ['', ''] : labels
    const timeChartLabels = d3.select('#time-chart').select('svg').selectAll('.label')
        .data(labels)

    timeChartLabels.exit().remove()

    const timeChartLabelsUnformatted = timeChartLabels
        .enter()
        .append('text')
        .classed('label', true)
        .merge(timeChartLabels)
        .text(d=>d)

    setLabelsInitialConditions(xScale, yScale, timeChartLabelsUnformatted)

    
    // Update Label Positions with Force Layout
    const newPositions = dataArrays.map(d => {
        return {
        fx: 0,
        targetY: yScale(d.slice(-1)[0])
        };
    });
    createTimeChartLabelsForce(newPositions)
    

    timeChartLabelsUnformatted
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .style('fill', (_,i)=>colors[i])
        //.attr('y', (_,i)=>yScale(dataArrays[i].slice(-1)[0]))
        .attr('y', (_,i)=>newPositions[i].y)
        .attr('x', xScale( timeParse(datesArray.slice(-1)[0]))*timeLabelXOffsetFrac )

    

    // Add Show Pie Labels Event
    d3.selectAll('.label').on('click', function(){

        if (numbersDisplayedFlag){
            changePieNumbersOpacity(0)
            showNamesOnTimeChartLabels()
    
            numbersDisplayedFlag = false
        } else{
            changePieNumbersOpacity(1)
            showNumbersOnTimeChartLabels(dataArrays)
            
            
            numbersDisplayedFlag = true
        }
        
    })
        
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
    if (svgTime.select('#x-axis').empty()){
        svgTime
            .append('g')
            .attr('id', 'x-axis')
            .style('transform', 'translate(0,' + 
            parseInt(timeChartHeight - timeChartHeightFracPadBottom*timeChartHeight) + 'px)')
    }

    // Update Axis
    d3.select('#x-axis')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(xAxis)

    if (svgTime.select('#y-axis').empty()){
        svgTime
            .append('g')
            .attr('id', 'y-axis')
            .style('transform', 'translate(' + parseInt(timeChartWidthFracPadLeft * timeChartWidth) + 'px,0)')
    }

    d3.select('#y-axis')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(yAxis)

    // Deal with Unavailable Data
    if(unavailableFlag){
        d3.select('#time-chart').selectAll('.tick')
            .select('text')
            .transition()
            .duration(1000)
            .ease(d3.easePoly)
            .style('font-size', '0px')

        d3.selectAll('.label')
            .transition()
            .duration(1000)
            .ease(d3.easePoly)
            .style('opacity', 0)
    }else{
        d3.select('#time-chart').selectAll('.tick')
            .select('text')
            .transition()
            .duration(1000)
            .ease(d3.easePoly)
            .style('font-size', '10px')

    }
}

function changePieNumbersOpacity(opacityVal){

    const pieLabels = smallValuesDisplayedFlag ? d3.selectAll('.pie-other-label') : d3.selectAll('.pie-label')
    
    pieLabels
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', opacityVal)
}

function showNumbersOnTimeChartLabels(dataArrays){

    const labels = d3.selectAll('.label')
    labels
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .text((_,i)=>dataArrays[i].slice(-1)[0])
}

function showNamesOnTimeChartLabels(){

    const labels = d3.selectAll('.label')
    labels
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .text(d=>d)
}


	
function animatelines(unavailableFlag) {

    d3.selectAll(".line").style("opacity","0.5");

    //Select All of the lines and process them one by one
    d3.selectAll(".line").each(function(d,i){

    // Get the length of each line in turn
    var totalLength = d3.select("#line" + i).node().getTotalLength();

        d3.selectAll("#line" + i).attr("stroke-dasharray", unavailableFlag ? 3 + " " + 3 : totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1000)
          .delay(100*i)
          .ease(d3.easeExp)
          .attr("stroke-dashoffset", 0)
          .style("stroke-width",3)
    })

 
} 

function createOtherLinePlot(data, configKeysDict, configColorsDict, configUnavailableDict, configLabelsDict){
    event.stopPropagation()
    
    const targetVariable = d3.select('.pie-other-group').attr('class').split(' ').slice(-1)[0]

    currentConfig = targetVariable + '_other'

        createLinePlot(data, 
            configKeysDict[currentConfig], 
            configColorsDict[currentConfig],
            configUnavailableDict[currentConfig], 
            configLabelsDict[currentConfig])
        
}


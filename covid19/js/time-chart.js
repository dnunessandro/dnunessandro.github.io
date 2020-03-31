// Create Initial Time Plot
function createLinePlot(data, dataKeys, colors, unavailableFlag, labels){

    numbersDisplayedFlag = false
    dataKeys = newCasesFilterFlag ? dataKeys.map(k=>k+'_novos') : dataKeys


    // Get Data Arrays
    let dataArrays = unavailableFlag ? [getDummyUnavailableDailyData(data)['dummyArray1'], 
        getDummyUnavailableDailyData(data)['dummyArray2']] : 
        getDataByKeys(data, dataKeys)


    const firstNonZeroIndex = unavailableFlag ? 0 : getFirstNonZeroDataDay(dataArrays)
    dataArrays = dataArrays.map(a=>a.slice(firstNonZeroIndex))
    let datesArray = unavailableFlag ? getDummyUnavailableDailyData(data)['dates'] : data.map(d=>d['data'])
    datesArray = datesArray.slice(firstNonZeroIndex)

    

    // Get labels max length
    let labelsMaxLen = Math.max(...labels.map(l=>l.length)) 
    labelsMaxLen = labelsMaxLen > 15 ? 5 : labelsMaxLen 
 
    // Get colors
    colors = unavailableFlag ? unavailableColors : colors

    // Create Time Scale
    const xScale = getTimeScale(timeChartWidthFracPadLeft*timeChartWidth, 
        (1-timeChartWidthFracPadRight)*timeChartWidth-labelsMaxLen*4,
        ...datesArray)

    const yScale = getTimeChartYScale($('#scale-button').prop('checked'), 
            (1-timeChartHeightFracPadBottom)*timeChartHeight,
            timeChartHeightFracPadTop*timeChartHeight, 
            ...dataArrays)

    // Create Axes
    const xNTicks = 4
    const xAxis = d3.axisBottom(xScale)
        .ticks(xNTicks)
        .tickFormat(timeFormat)
        .tickSize(0)
        .tickPadding(10)
    const YNTicks = 3
    const yAxis = d3.axisLeft(yScale)
        .ticks(YNTicks)
        .tickFormat(d3.format("~s"))
        .tickSize(0)


    // Append X Axis
    if (svgTime.select('#x-axis').empty()){
        svgTime
            .append('g')
            .attr('id', 'x-axis')
            .style('transform', 'translate(0,' + 
            parseInt(timeChartHeight - timeChartHeightFracPadBottom*timeChartHeight) + 'px)')
    }

    // Add the X gridlines
    const bottomPad = timeChartHeight - timeChartHeight*timeChartHeightFracPadBottom
    svgTime.append("g")
        .attr('id', 'x-grid')		
        .attr("class", "grid")
        .attr("transform", "translate(0," + bottomPad + ")")

    // Update X Axis
    d3.select('#x-axis')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(xAxis)
        .style('fill', fontColor)

    // Update X Grid
    d3.select('#x-grid')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(xAxis)
        .call(xAxis
            .tickSize(- timeChartHeight )
            .tickFormat("")
            .tickSizeOuter(0)
        )

    // Append Y Axis
    if (svgTime.select('#y-axis').empty()){
        svgTime
            .append('g')
            .attr('id', 'y-axis')
            .style('transform', 'translate(' + parseInt(timeChartWidthFracPadLeft * timeChartWidth) + 'px,0)')
    }

    // Add the Y gridlines
    const leftPad = timeChartWidthFracPadLeft * timeChartWidth
    svgTime.append("g")
        .attr('id', 'y-grid')		
        .attr("class", "grid")
        .attr("transform", "translate("+leftPad+",0)")

    // Update Y Axis
    d3.select('#y-axis')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(yAxis)
        
        .style('fill', fontColor)

    // Update Y Grid
    d3.select('#y-grid')
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .call(yAxis)
        .call(yAxis
            .tickSize(-(1 - timeChartWidthFracPadLeft - timeChartWidthFracPadRight) * timeChartWidth )
            .tickFormat("")
            .tickSizeOuter(0)
        )


    // Create Line Elements
    const line = d3.line()
        .x((_, i)=>xScale(timeParse(datesArray[i])))
        .y(d=>yScale(d))
        .curve(d3.curveBasis)
        

    

    const lines = d3.select('#time-chart').select('svg').selectAll('.line')
        .data(dataArrays)

        
    lines.exit().remove()

    lines
        .enter()
        .append('path')
        .classed('line', true)
        .merge(lines)
        .attr('d', line)
        .attr('id', (_,i)=> 'line' + i)
        .style('stroke', (_,i)=>colors[i])
        .style('stroke-linecap', 'round')
           
 
    
    animatelines()

    


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
    
            numbersDisplayedFlag = !numbersDisplayedFlag
        } else{
            changePieNumbersOpacity(1)
            showNumbersOnTimeChartLabels(dataArrays)
            
            numbersDisplayedFlag = !numbersDisplayedFlag
        }
        
    })

    // Add Show Pie Labels Event
    d3.selectAll('.circle-label-group').on('click', function(){

        if (numbersDisplayedFlag){
            changePieNumbersOpacity(0)
            showNamesOnTimeChartLabels()
    
            numbersDisplayedFlag = !numbersDisplayedFlag
        } else{
            changePieNumbersOpacity(1)
            showNumbersOnTimeChartLabels(dataArrays)
            
            numbersDisplayedFlag = !numbersDisplayedFlag
        }
        
    })
        
    



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

    const pieLabels = smallValuesDisplayedFlag ? d3.selectAll('.pie-other-label-group') : d3.selectAll('.pie-label-group')
    
    pieLabels
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', opacityVal)
}

function showNumbersOnTimeChartLabels(dataArrays){

    const labels = d3.selectAll('.label')
    labels
        .style('opacity', 0)
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .text((_,i)=>dataArrays[i].slice(-1)[0])
}

function showNamesOnTimeChartLabels(){

    const labels = d3.selectAll('.label')
    labels
        .style('opacity', 0)
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .text(d=>d)
}


	
function animatelines() {

    d3.selectAll(".line").style("opacity","0.7");

    //Select All of the lines and process them one by one
    d3.selectAll(".line").each(function(d,i){

    // Get the length of each line in turn
    var totalLength = d3.select("#line" + i).node().getTotalLength();

        d3.selectAll("#line" + i).attr("stroke-dasharray",  totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition('j')
          .duration(800)
          .delay(100*i)
          .ease(d3.easeExp)
          .attr("stroke-dashoffset", 0)
          .style("stroke-width", 3)
    })

 
} 

function createOtherLinePlot(data, configKeysDict, configColorsDict, configUnavailableDict, configShortLabelsDict){
    event.stopPropagation()
    
    const targetVariable = d3.select('.pie-other-group').attr('class').split(' ').slice(-1)[0]

    currentConfig = targetVariable + '_other'

        createLinePlot(data, 
            configKeysDict[currentConfig], 
            configColorsDict[currentConfig],
            configUnavailableDict[currentConfig], 
            configShortLabelsDict[currentConfig])
        
}


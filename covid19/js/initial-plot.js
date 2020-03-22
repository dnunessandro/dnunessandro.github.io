
function createCircleGroups(globalDataAllArray, cxScale){
    const circleGroups = svg.selectAll('g')
        .data(globalDataAllArray)
        .enter()
        .append('g')
        .attr('class', (_,i)=>allVars[i])
        .classed('circle-group', true)
        .style('transform', (d,i)=>"translate(" + parseInt(cxScale(i)) + "px," + parseInt(chartHeight/2) + "px)")

    return circleGroups
}

function createCircleShapesAll(circleGroups, rScale){
    const circleShapesAll = circleGroups
        .append('circle')
        .attr('class', (_,i)=>allVars[i])
        .classed('circle-shape', true)
        .classed('all', true)
        .attr('r', 0)
        .style('fill', (_,i)=>varsColorsDict[allVars[i]])
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .attr('r', (d,i)=>rScale(d))

    return circleShapesAll
}

function createCircleShapesPrevious(circleGroups, globalDataPreviousArray, rScale){

    const circleShapesPrevious = circleGroups
        .data(globalDataPreviousArray)
        .append('circle')
        .attr('class', (_,i)=>allVars[i])
        .classed('circle-shape', true)
        .classed('previous', true)
        .attr('r', (d,i)=>rScale(d))
        .style('opacity', 0)
        .style('fill', (_,i)=>varsColorsDict[allVars[i]])

    return circleShapesPrevious
}

function createTitles(circleGroups, globalDataAllArray, rScale){

    const circleTitles = circleGroups
        .data(globalDataAllArray)
        .append('text')
        .text((_,i)=>varsTitlesDict[allVars[i]])
        .attr('class', (_,i)=>allVars[i])
        .classed('circle-title', true)
        .attr('x', 0)
        .attr('y', (d,i)=> -rScale(Math.max(...globalDataAllArray))-20)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .style('opacity', 1)

    return circleTitles
}

function createValueLabels(circleGroups, rScale){
    const circleLabels = circleGroups
        .append('text')
        .text(d=>d)
        .attr('class', (_,i)=>allVars[i])
        .classed('circle-value', true)
        .attr('x', 0)
        .attr('y', (d,i) => rScale(d) < minRadiusLabel ? rScale(d) + 15 : 0)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .style('opacity', 1)

    return circleLabels
}

function createCircleNewCasesBreakdown(variable, previousValue, currentValue, variableRScale){

    // Create Group for Breakdown Values
    const circleBreadkdownValuesGroup = d3.select('.circle-group.' + variable)
        .append('g')
        .attr('class', variable)
        .classed('new-cases-labels', true)
        .style('opacity', 0)

    // Create Previous Value Label Background Shape
    circleBreadkdownValuesGroup
        .append('rect')
        .attr('class', variable)
        .classed('new-cases-shape', true)
        .classed('previous', true)

    // Create Current Value Label Background Shape
    circleBreadkdownValuesGroup
        .append('rect')
        .attr('class', variable)
        .classed('new-cases-shape', true)
        .classed('all', true)

    // Create Previous Value Label
    circleBreadkdownValuesGroup
        .append('text')
        .attr('class', variable)
        .classed('new-cases-value', true)
        .classed('previous', true)
        .text(previousValue)
        .style('fill', varsColorsDict[variable])

    // Create Current Value Label
    circleBreadkdownValuesGroup
        .append('text')
        .attr('class', variable)
        .classed('new-cases-value', true)
        .classed('all', true)
        .text(currentValue - previousValue)
        .attr('x', variableRScale(currentValue)*0.95)
        .attr('y', -variableRScale(currentValue)*0.95)
        .style('fill', varsColorsDict[variable+'_novos'])

    // Modify Breakdown Background Shapes Width and Height
    let textBBox = d3.select('.new-cases-value.' + variable).node().getBBox()
    let textWidth = textBBox.width
    let textHeight = textBBox.height

    d3.select('.new-cases-shape.previous.' + variable)
        .attr('width', textWidth+breakdownShapePad)
        .attr('height', textHeight+breakdownShapePad)
        .attr('x', -(textWidth+breakdownShapePad)/2)
        .attr('y', -(textHeight+breakdownShapePad+2)/2)
        .attr('rx', breakdownShapeRx)
        .style('fill', boxColor)
        

    textBBox = d3.select('.new-cases-value.' + variable).node().getBBox()
    textWidth = textBBox.width
    textHeight = textBBox.height

    d3.select('.new-cases-shape.all.' + variable)
        .attr('x', variableRScale(currentValue)*0.95-(textWidth+breakdownShapePad)/2)
        .attr('y', -variableRScale(currentValue)*0.95-(textHeight+breakdownShapePad+2)/2)
        .attr('width', textWidth+breakdownShapePad)
        .attr('height', textHeight+breakdownShapePad)
        .attr('rx', breakdownShapeRx)
        .style('fill', boxColor)

}

function createAllCirclesNewsCasesBreakdown(allVars, globalDataPreviousArray, globalDataAllArray, rScales){
    allVars.forEach((v,i)=>createCircleNewCasesBreakdown(v, globalDataPreviousArray[i], globalDataAllArray[i], rScales[v]))
}


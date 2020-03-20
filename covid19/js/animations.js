function showNewCases(i, varAll, varPrevious, rScale, rScales){

    // Fade In Inner Circle and 
    d3.select('.circle-shape.previous.' + allVars[i])
        .style('opacity', 1)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .attr('r', rScales[allVars[i]](varPrevious))

    // Color Outer Circle and Change Shape
    d3.select('.circle-shape.all.' + allVars[i])
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', varsColorsDict[allVars[i] + '_novos'])
        .attr('r', rScales[allVars[i]](varAll))
        .style('opacity', 1)

    console.log(d3.select('.circle-value.' + allVars[i]))

    // Fade Out Circle Value
    d3.select('.circle-value.' + allVars[i])
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)

    // Create Group for Breakdown Values
    const circleBreadkdownValuesGroup = d3.select('.circle-group.' + allVars[i])
        .append('g')
        .attr('class', allVars[i])
        .classed('breakdown-group', true)

    // Create Breakdown Values Background Shapes
    circleBreadkdownValuesGroup
        .append('rect')
        .attr('class', allVars[i])
        .classed('breakdown-shape', true)
        .classed('previous', true)

    circleBreadkdownValuesGroup
        .append('rect')
        .attr('class', allVars[i])
        .classed('breakdown-shape', true)
        .classed('new', true)

    // Create Breakdown Values Labels
    circleBreadkdownValuesGroup
        .append('text')
        .attr('class', allVars[i])
        .classed('breakdown-value', true)
        .classed('previous', true)
        .text(varPrevious)
        .style('fill', varsColorsDict[allVars[i]])

    circleBreadkdownValuesGroup
        .append('text')
        .attr('class', allVars[i])
        .classed('breakdown-value', true)
        .classed('new', true)
        .text(varAll - varPrevious)
        .attr('x', rScales[allVars[i]](varAll)*0.95)
        .attr('y', -rScales[allVars[i]](varAll)*0.95)
        .style('fill', varsColorsDict[allVars[i]+'_novos'])

    // Modify Breakdown Background Shapes Width and Height
    let textBBox = d3.select('.breakdown-value.' + allVars[i]).node().getBBox()
    let textWidth = textBBox.width
    let textHeight = textBBox.height

    d3.select('.breakdown-shape.previous.' + allVars[i])
        .attr('width', textWidth+breakdownShapePad)
        .attr('height', textHeight+breakdownShapePad)
        .attr('x', -(textWidth+breakdownShapePad)/2)
        .attr('y', -(textHeight+breakdownShapePad+2)/2)
        .attr('rx', breakdownShapeRx)
        .style('fill', boxColor)
        .style('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
        

    textBBox = d3.select('.breakdown-value.' + allVars[i]).node().getBBox()
    textWidth = textBBox.width
    textHeight = textBBox.height

    d3.select('.breakdown-shape.new.' + allVars[i])
        .attr('x', rScales[allVars[i]](varAll)*0.95-(textWidth+breakdownShapePad)/2)
        .attr('y', -rScales[allVars[i]](varAll)*0.95-(textHeight+breakdownShapePad+2)/2)
        .attr('width', textWidth+breakdownShapePad)
        .attr('height', textHeight+breakdownShapePad)
        .attr('rx', breakdownShapeRx)
        .style('fill', boxColor)
        .style('opacity', 0)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)  

    // Resize and Recolor Remaining Circles
    d3.selectAll('.circle-shape.all')
        .filter((_,e)=>e!=i)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', boxColor)
        .filter(d=>rScale(d) > maxRadiusWidthFrac*maxRadiusThreshFrac*chartWidth)
        .attr('r', maxRadiusWidthFrac*maxRadiusThreshFrac*chartWidth)

    // Hide Remaining Circles Values
    d3.selectAll('.circle-value')
        .filter((_,e)=>e!=i)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)

}

function hideNewCases(i, rScale){

    d3.select('.circle-shape.all.' + allVars[i])
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', varsColorsDict[allVars[i]])
        .attr('r', d=>rScale(d))

    d3.select('.circle-shape.previous.' + allVars[i])
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .attr('r', d=>rScale(d))
        .style('opacity', 0)

    d3.select('.breakdown-group.' + allVars[i]).selectAll('*')
        .remove()

    d3.select('.breakdown-group.' + allVars[i])
        .remove()

    d3.select('.circle-value.' + allVars[i])
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)

    // Resize Circles
    d3.selectAll('.circle-shape.all')
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', (_,e)=>varsColorsDict[allVars[e]])
        .attr('r', d=>rScale(d))

    // Show Labels
    d3.selectAll('.circle-value')
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)


}
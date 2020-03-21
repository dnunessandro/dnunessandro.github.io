
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
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .attr('opacity', 1)

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
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .attr('opacity', 1)

    return circleLabels
}

function bindAnimations(globalDataAllArray, globalDataPreviousArray, rScale, rScales, breakdownDataAll, breakdownDataPrevious, colors){

    //mobileFlag ? 
    //d3.selectAll('.circle-group').on('touchcancel', 
    //    (_,i)=>showNewCases(i, globalDataAllArray[i], globalDataPreviousArray[i], rScale, rScales)) :
    d3.selectAll('.circle-group').on('click', function(_,i){

        
        if(showbreakDownFlag){
            createBreakdownPie(allVars[i], breakdownDataAll[breakdownIndexArray[breakdownIndex]][i], breakdownDataPrevious[breakdownIndexArray[breakdownIndex]][i], breakdownColorsDict[breakdownCategories[breakdownIndexArray[breakdownIndex]]], rScale)
            //hideNewCases(i, rScale)
            breakdownIndex++
        }else{
            //showNewCases(i, globalDataAllArray[i], globalDataPreviousArray[i], rScale, rScales, breakdownDataAll, breakdownDataPrevious)
            showNewCasesBreakdown(i, globalDataAllArray[i], globalDataPreviousArray[i], rScales)
            resizeRemainingCircles(i, rScale)
            removeBreakdownPie(rScale, breakdownDataAll[breakdownIndexArray[breakdownIndex]][i], breakdownDataPrevious[breakdownIndexArray[breakdownIndex]][i])
            showbreakDownFlag = true
        }

    }) 

    d3.selectAll('.circle-group').on('mouseleave', function(_,i){
        hideNewCases(i, rScale)
        removeBreakdownPie(rScale, breakdownDataAll[breakdownIndexArray[breakdownIndex]][i], breakdownDataPrevious[breakdownIndexArray[breakdownIndex]][i])
        showbreakDownFlag = false
        breakdownIndex=0
    })
}
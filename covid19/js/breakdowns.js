function createBreakdownPie(variable, breakdownIndex, breakdownDataAll, 
    breakdownDataPrevious, colors, rScales, dataKeys, labels, unavailableFlag){

    // Check if First Category
    const firstCategoryFlag = breakdownIndex == 0

    // Functions to Draw Slices
    function tweenInnerPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return CirclePreviousArc(i(t)); };
        }

    function tweenOuterPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return CircleAllArc(i(t)); };
        }

    // Edges of Pies Arcs
    const previousOuterRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataPrevious)) :
        globalChartWidth * previousPieOuterRadiusWidthFrac

    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)

    const allInnerRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataPrevious)) :
        globalChartWidth * allPieInnerRadiusWidthFrac

    const allOuterRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataAll)) :
        globalChartWidth * allPieOuterRadiusWidthFrac

    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)

    // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-group.' + variable)
        .data(pieInner(breakdownDataAll))

    const piePreviousDataPaths = piePreviousData.select('path.previous.pie-path')

    piePreviousData.exit().remove()

    const piePreviousGroup = piePreviousData
        .enter()
        .append('g')
        .classed('previous', true)
        .classed('pie-group', true)
        .classed(variable, true)

    const piePreviousGroupTweened = piePreviousGroup
        .append('path')
        .merge(piePreviousDataPaths) 
        .attr('class', (d,i)=>dataKeys[i].replace(variable + '_', ''))
        .classed('previous', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .style('fill', (_,i)=>colors[i])
        .transition('a')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Draw Outer Pie
    const pieAllData = d3.select('.circle-group.' + variable)
        .selectAll('g.all.pie-group.' + variable)
        .data(pieOuter(breakdownDataPrevious))

    const pieAllDataPaths = pieAllData.select('path.all.pie-path')

    pieAllData.exit().remove()

    const pieAllGroup = pieAllData
        .enter()
        .append('g')
        .classed('all', true)
        .classed('pie-group', true)
        .classed(variable, true)

    const pieAllGroupTweened = pieAllGroup
        .append('path')
        .merge(pieAllDataPaths)
        .attr('class', (d,i)=>dataKeys[i].replace(variable + '_', ''))
        .classed('all', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .style('fill', (_,i)=>colors[i])
        .transition('b')
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)


    // Highlight Other Category
    d3.selectAll('.pie-path.region_other')
        .style('stroke', otherHighlightColor)
        .style('stroke-width', 3)

    if (firstCategoryFlag){

        piePreviousGroupTweened
            .attr('d', CirclePreviousArc.outerRadius(previousOuterRadius))
            .transition('c')
            .duration(300)
            .ease(d3.easePoly)
            .attr('d', CirclePreviousArc.outerRadius(globalChartWidth * previousPieOuterRadiusWidthFrac))

        pieAllGroupTweened
            .attr('d', CircleAllArc.innerRadius(allInnerRadius))
            .attr('d', CircleAllArc.outerRadius(allOuterRadius))
            .transition('d')
            .duration(500)
            .ease(d3.easePoly)
            .attr('d', CircleAllArc.innerRadius(globalChartWidth * allPieInnerRadiusWidthFrac))
            .attr('d', CircleAllArc.outerRadius(globalChartWidth * allPieOuterRadiusWidthFrac))

    }

    if (!unavailableFlag){

        // Draw Inner Pie Labels
    d3.selectAll('.previous.pie-label-group').remove()

    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('previous',true)
        .classed('pie-label-group', true)
        .classed(variable, true)
      
    const piePreviousLabelsGroup = d3.select('.circle-group.' + variable)
        .select('.previous.pie-label-group.' + variable)
        .selectAll('text.previous.pie-label.' + variable)
        .data(pieInner(breakdownDataPrevious))

    // Update Label Positions with Force Layout
    let pieLabelsOutsideCoordinatePairs = pieInner(breakdownDataPrevious)
        .map(d=>translateLabelOutside(d, CirclePreviousArc, previousOuterRadius*0.5))

    let newPositions = pieLabelsOutsideCoordinatePairs.map(d => {
        return {
        fx: 0,
        targetY: d[1]
        };
    });
    console.log(newPositions)
    createPieChartLabelsForce(newPositions, 7)
    console.log(newPositions)

    piePreviousLabelsGroup
        .enter()
        .append('text')
        .classed('previous', true)
        .classed('pie-label', true)
        .classed(variable, true)
        .text((_,i)=>breakdownDataPrevious[i])
        .style('opacity', 0)
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        .attr("text-anchor", function(d) {
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })

    // Draw Outer Pie Labels
    d3.selectAll('.all.pie-label-group').remove()
    
    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('all',true)
        .classed('pie-label-group', true)
        .classed(variable, true)
    
    const pieAllLabelsGroup = d3.select('.circle-group.' + variable)
        .select('.all.pie-label-group.' + variable)
        .selectAll('text.all.pie-label.' + variable)
        .data(pieOuter(breakdownDataAll))

    // Update Label Positions with Force Layout
    pieLabelsOutsideCoordinatePairs = pieOuter(breakdownDataAll)
        .map(d=>translateLabelOutside(d, CircleAllArc, allOuterRadius*0.8))

    newPositions = pieLabelsOutsideCoordinatePairs.map(d => {
        return {
        fx: 0,
        targetY: d[1]
        };
    });
    createPieChartLabelsForce(newPositions)

    pieAllLabelsGroup
        .enter()
        .append('text')
        .classed('all', true)
        .classed('pie-label', true)
        .classed(variable, true)
        .style('opacity', 0)
        .text((_,i)=>breakdownDataAll[i])
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        .attr("text-anchor", function(d) {
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })

    }

    

}

function removeBreakdownPie(variable, rScales, breakdownDataAll, breakdownDataPrevious){

    // Functions to Draw Slices
    function tweenInnerPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate(b, {startAngle: 0, endAngle: 0});
        return function(t) { return CirclePreviousArc(i(t)); };
        }

    function tweenOuterPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate(b, {startAngle: 0, endAngle: 0});
        return function(t) { return CircleAllArc(i(t)); };
        }

    // Edges of Pies Arcs
    const previousOuterRadius = globalChartWidth * otherPreviousPieOuterRadiusWidthFrac

    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)

    const allInnerRadius = globalChartWidth * otherAllPieInnerRadiusWidthFrac

    const allOuterRadius = globalChartWidth * otherAllPieOuterRadiusWidthFrac

    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)

    // Remove Inner Pie
    d3.selectAll('.previous.pie-path.' + variable)
        .transition('e')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-path.' + variable)
        .transition('f')
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-group.' + variable)
        .transition('g')
        .delay(800)
        .remove()

    // Remove Labels
    d3.selectAll('.pie-label-group.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', 0)
        .remove()

    d3.selectAll('.pie-other-label-group.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', 0)
        .remove()
        
}

function removeOtherBreakdownPies(variable, breakdownDataAll, breakdownDataAll, breakdownIndex){
    const ci = breakdownIndex > 0 ? breakdownIndexArray[breakdownIndex-1] : 0
    allVars.forEach(function(v, i){
        if (v!=variable){
            if (showbreakDownFlagDict[v]){
                removeBreakdownPie(v, rScales, breakdownDataAll[ci][i], breakdownDataAll[ci][i])
            }
        }
    })
}


function removeAllSmallNumberBreakdownPies(otherBreakdownPreviousData, otherBreakdownAllData){
    allVars.forEach(function(v, i){
        removeSmallNumbersBreakdownPie(v, otherBreakdownPreviousData[i], otherBreakdownAllData[i])
    })
}


function createSmallNumbersBreakdownPie(variable, otherBreakdownDataPreviousArray, otherBreakdownDataAllArray){
    
     // Functions to Draw Slices
    function tweenInnerPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return CirclePreviousArc(i(t)); };
        }

    function tweenOuterPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return CircleAllArc(i(t)); };
        }

    const otherRScale =  getRadiusScale(0, globalChartWidth*smallValuesMaxRadiusWidthFrac,sumArray(otherBreakdownDataPreviousArray), sumArray(otherBreakdownDataAllArray) )

    // Edges of Pies Arcs
    const previousOuterRadius = otherRScale(sumArray(otherBreakdownDataPreviousArray))
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)

    const allInnerRadius = otherRScale(sumArray(otherBreakdownDataPreviousArray))
    const allOuterRadius = otherRScale(sumArray(otherBreakdownDataAllArray))
    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)

        // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-other-group.' + variable)
        .data(pieInner(otherBreakdownDataAllArray))

    const piePreviousDataPaths = piePreviousData.select('path.previous.pie-other-path')

    piePreviousData.exit().remove()

    const piePreviousGroup = piePreviousData
        .enter()
        .append('g')
        .classed('previous', true)
        .classed('pie-other-group', true)
        .classed(variable, true)
        .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
            parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')

    const piePreviousGroupTweened = piePreviousGroup
        .append('path')
        .classed('previous', true)
        .classed('pie-other-path', true)
        .classed(variable, true)
        .merge(piePreviousDataPaths)
        .style('fill', (_,i)=>smallValuesColors[i])
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)
        

    // Draw Outer Pie
    const pieAllData = d3.select('.circle-group.' + variable)
        .selectAll('g.all.pie-other-group.' + variable)
        .data(pieOuter(otherBreakdownDataPreviousArray))

    const pieAllDataPaths = pieAllData.select('path.all.pie-other-path')

    pieAllData.exit().remove()

    const pieAllGroup = pieAllData
        .enter()
        .append('g')
        .classed('all', true)
        .classed('pie-other-group', true)
        .classed(variable, true)
        .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
            parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')

    const pieAllGroupTweened = pieAllGroup
        .append('path')
        .classed('all', true)
        .classed('pie-other-path', true)
        .classed(variable, true)
        .merge(pieAllDataPaths)
        .style('fill', (_,i)=>smallValuesColors[i])
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    piePreviousGroupTweened
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attr('d', CirclePreviousArc.outerRadius(globalChartWidth*otherPreviousPieOuterRadiusWidthFrac))

    pieAllGroupTweened
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attr('d', CircleAllArc.innerRadius(globalChartWidth*otherAllPieInnerRadiusWidthFrac))
        .attr('d', CircleAllArc.outerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac))


    // Draw Highlight
    const HighlightArc = d3.arc()
        .innerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac)
        .outerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac*1.1)
    function tweenHighlight(b) {
            //b.innerRadius = 0;
            var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) { return HighlightArc(i(t)); };
            }

    const highlightPaths = pieAllData.select('path.highlight-path')
    pieAllGroup
        .append('path')
        .merge(highlightPaths)
        .classed('highlight-path', true)
        .style('fill', otherHighlightColor)
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenHighlight)


    // Draw Inner Pie Labels
    d3.selectAll('.previous.pie-other-label-group').remove()

    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('previous',true)
        .classed('pie-other-label-group', true)
        .classed(variable, true)
        .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
            parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    
    const piePreviousLabelsGroup = d3.select('.circle-group.' + variable)
        .select('.previous.pie-other-label-group.' + variable)
        .selectAll('text.previous.pie-other-label.' + variable)
        .data(pieInner(otherBreakdownDataPreviousArray))

    // Update Label Positions with Force Layout
    let pieLabelsOutsideCoordinatePairs = pieInner(otherBreakdownDataPreviousArray)
        .map(d=>translateLabelOutside(d, CirclePreviousArc, previousOuterRadius*0.3))

    let newPositions = pieLabelsOutsideCoordinatePairs.map(d => {
        return {
        fx: 0,
        targetY: d[1]
        };
    });

    createPieChartLabelsForce(newPositions, 5)

    piePreviousLabelsGroup
        .enter()
        .append('text')
        .classed('previous', true)
        .classed('pie-other-label', true)
        .classed(variable, true)
        .text((_,i)=>otherBreakdownDataPreviousArray[i])
        .style('opacity', 0)
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        .attr("text-anchor", function(d) {
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })



    // Draw Outer Pie Labels
    d3.selectAll('.all.pie-other-label-group').remove()
    
    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('all',true)
        .classed('pie-other-label-group', true)
        .classed(variable, true)
        .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
            parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    
    const pieAllLabelsGroup = d3.select('.circle-group.' + variable)
        .select('.all.pie-other-label-group.' + variable)
        .selectAll('text.all.pie-other-label.' + variable)
        .data(pieOuter(otherBreakdownDataAllArray))

    // Update Label Positions with Force Layout
    pieLabelsOutsideCoordinatePairs = pieOuter(otherBreakdownDataAllArray)
        .map(d=>translateLabelOutside(d, CircleAllArc, allOuterRadius*1.2))

    newPositions = pieLabelsOutsideCoordinatePairs.map(d => {
        return {
        fx: 0,
        targetY: d[1]
        };
    });

    createPieChartLabelsForce(newPositions)

    pieAllLabelsGroup
        .enter()
        .append('text')
        .classed('all', true)
        .classed('pie-other-label', true)
        .classed(variable, true)
        
        .text((_,i)=>otherBreakdownDataAllArray[i])
        .style('opacity', 0)
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        .attr("text-anchor", function(d) {
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })

    

}


function removeSmallNumbersBreakdownPie(variable, otherBreakdownDataAllArray, otherBreakdownDataPreviousArray){

    const otherRScale =  getRadiusScale(0, globalChartWidth*smallValuesMaxRadiusWidthFrac,sumArray(otherBreakdownDataPreviousArray), sumArray(otherBreakdownDataAllArray) )

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(globalChartWidth * otherPreviousPieOuterRadiusWidthFrac)

    const CircleAllArc = d3.arc()
        .innerRadius(globalChartWidth * otherAllPieInnerRadiusWidthFrac)
        .outerRadius(globalChartWidth * otherAllPieOuterRadiusWidthFrac)


    // Functions to Draw Slices
    function tweenInnerPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate(b, {startAngle: 0, endAngle: 0});
        return function(t) { return CirclePreviousArc(i(t)); };
        }

    function tweenOuterPie(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate(b, {startAngle: 0, endAngle: 0});
        return function(t) { return CircleAllArc(i(t)); };
        }

    // Remove Inner Pie
    d3.selectAll('.previous.pie-other-path.' + variable)
        .transition('k')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-other-path.' + variable)
        .transition('l')
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-other-group.' + variable)
        .transition('m')
        .delay(800)
        .remove()

     // Remove Labels
    d3.selectAll('.pie-other-label-group.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', 0)
        .remove()
}


function translateLabelOutside(d, arc, radius){

    const c = arc.centroid(d),
            x = c[0],
            y = c[1],
            h = Math.sqrt(x*x + y*y);

    return [(x/h * radius), (y/h * radius)]

}













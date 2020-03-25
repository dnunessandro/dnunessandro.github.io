function createBreakdownPie(variable, breakdownIndex, breakdownDataAll, breakdownDataPrevious, colors, rScales){

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
        rScales[variable](sumArray(breakdownDataPrevious)) * previousOuterRadiusFrac

    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)

    const allInnerRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataPrevious)) :
        rScales[variable](sumArray(breakdownDataPrevious)) * allInnerRadiusFrac

    const allOuterRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataAll)) :
        rScales[variable](sumArray(breakdownDataAll)) * allOuterRadiusFrac

    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)


    // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-group.' + variable)
        .data(pie(breakdownDataAll))

    const piePreviousDataPaths = piePreviousData.select('path')

    piePreviousData.exit().remove()

    const piePreviousGroup = piePreviousData
        .enter()
        .append('g')
        .classed('previous', true)
        .classed('pie-group', true)
        .classed(variable, true)

    const piePreviousGroupTweened = piePreviousGroup
        .append('path')
        .classed('previous', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .merge(piePreviousDataPaths)
        .style('fill', (_,i)=>colors[i])
        .transition('a')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Draw Outer Pie
    const pieAllData = d3.select('.circle-group.' + variable)
        .selectAll('g.all.pie-group.' + variable)
        .data(pie(breakdownDataPrevious))

    const pieAllDataPaths = pieAllData.select('path')

    pieAllData.exit().remove()

    const pieAllGroup = pieAllData
        .enter()
        .append('g')
        .classed('all', true)
        .classed('pie-group', true)
        .classed(variable, true)

    const pieAllGroupTweened = pieAllGroup
        .append('path')
        .classed('all', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .merge(pieAllDataPaths)
        .style('fill', (_,i)=>colors[i])
        .transition('b')
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)


    if (firstCategoryFlag){

        piePreviousGroupTweened
            .attr('d', CirclePreviousArc.outerRadius(previousOuterRadius))
            .transition('c')
            .duration(300)
            .ease(d3.easePoly)
            .attr('d', CirclePreviousArc.outerRadius(previousOuterRadius*previousOuterRadiusFrac))

        pieAllGroupTweened
            .attr('d', CircleAllArc.innerRadius(allInnerRadius))
            .attr('d', CircleAllArc.outerRadius(allOuterRadius))
            .transition('d')
            .duration(500)
            .ease(d3.easePoly)
            .attr('d', CircleAllArc.innerRadius(allInnerRadius*allInnerRadiusFrac))
            .attr('d', CircleAllArc.outerRadius(allOuterRadius*allOuterRadiusFrac))

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
    const previousOuterRadius = rScales[variable](sumArray(breakdownDataPrevious)) 
        * previousOuterRadiusFrac

    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)

    const allInnerRadius = rScales[variable](sumArray(breakdownDataPrevious)) * allInnerRadiusFrac

    const allOuterRadius = rScales[variable](sumArray(breakdownDataAll)) * allOuterRadiusFrac

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
        .data(pie(otherBreakdownDataAllArray))

    const piePreviousDataPaths = piePreviousData.select('path')

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
        .data(pie(otherBreakdownDataPreviousArray))

    const pieAllDataPaths = pieAllData.select('path')

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
        //.attr('d', CirclePreviousArc.outerRadius(previousOuterRadius))
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attr('d', CirclePreviousArc.outerRadius(previousOuterRadius*previousOuterRadiusFrac))

    pieAllGroupTweened
        //.attr('d', CircleAllArc.innerRadius(allInnerRadius))
        //.attr('d', CircleAllArc.outerRadius(allOuterRadius))
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attr('d', CircleAllArc.innerRadius(allInnerRadius*allInnerRadiusFrac))
        .attr('d', CircleAllArc.outerRadius(allOuterRadius*allOuterRadiusFrac))

}


function removeSmallNumbersBreakdownPie(variable, otherBreakdownDataAllArray, otherBreakdownDataPreviousArray){

    const otherRScale =  getRadiusScale(0, globalChartWidth*smallValuesMaxRadiusWidthFrac,sumArray(otherBreakdownDataPreviousArray), sumArray(otherBreakdownDataAllArray) )

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray))*previousOuterRadiusFrac)

    const CircleAllArc = d3.arc()
        .innerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray))*allInnerRadiusFrac)
        .outerRadius(otherRScale(sumArray(otherBreakdownDataAllArray))*allOuterRadiusFrac)


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
}
















function createBreakdownPie(variable, breakdownDataAll, breakdownDataPrevious, colors, rScales){

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
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(rScales[variable](sumArray(breakdownDataPrevious)))

    const CircleAllArc = d3.arc()
        .innerRadius(rScales[variable](sumArray(breakdownDataPrevious)))
        .outerRadius(rScales[variable](sumArray(breakdownDataAll)))


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

    piePreviousGroup.append('path')
        .classed('previous', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .merge(piePreviousDataPaths)
        .style('fill', (_,i)=>colors[i])
        .transition()
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

    pieAllGroup
        .append('path')
        .classed('all', true)
        .classed('pie-path', true)
        .classed(variable, true)
        .merge(pieAllDataPaths)
        .style('fill', (_,i)=>colors[i])
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)


}

function removeBreakdownPie(variable, rScales, breakdownDataAll, breakdownDataPrevious){

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(rScales[variable](sumArray(breakdownDataPrevious)))

    const CircleAllArc = d3.arc()
        .innerRadius(rScales[variable](sumArray(breakdownDataPrevious)))
        .outerRadius(rScales[variable](sumArray(breakdownDataAll)))

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
    d3.selectAll('.previous.pie-path.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-path.' + variable)
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-group.' + variable)
        .transition()
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

    const otherRScale =  getRadiusScale(0, chartWidth*smallValuesMaxRadiusWidthFrac,sumArray(otherBreakdownDataPreviousArray), sumArray(otherBreakdownDataAllArray) )

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray)))

    const CircleAllArc = d3.arc()
        .innerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray)))
        .outerRadius(otherRScale(sumArray(otherBreakdownDataAllArray)))

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

    piePreviousGroup.append('path')
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

    pieAllGroup
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
}


function removeSmallNumbersBreakdownPie(variable, otherBreakdownDataAllArray, otherBreakdownDataPreviousArray){

    const otherRScale =  getRadiusScale(0, chartWidth*smallValuesMaxRadiusWidthFrac,sumArray(otherBreakdownDataPreviousArray), sumArray(otherBreakdownDataAllArray) )

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray)))

    const CircleAllArc = d3.arc()
        .innerRadius(otherRScale(sumArray(otherBreakdownDataPreviousArray)))
        .outerRadius(otherRScale(sumArray(otherBreakdownDataAllArray)))


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
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-other-path.' + variable)
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-other-group.' + variable)
        .transition()
        .delay(800)
        .remove()
}
















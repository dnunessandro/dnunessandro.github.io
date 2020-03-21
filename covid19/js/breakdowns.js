function createBreakdownPie(variable, breakdownDataAll, breakdownDataPrevious, colors, rScale){

    const unavailableDataAux = fixUnavailableData(variable, breakdownDataAll, breakdownDataPrevious, colors)
    breakdownDataAll = unavailableDataAux[0]
    breakdownDataPrevious = unavailableDataAux[1]
    colors = unavailableDataAux[2]

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
        .outerRadius(rScale(sumArray(breakdownDataPrevious)))

    const CircleAllArc = d3.arc()
        .innerRadius(rScale(sumArray(breakdownDataPrevious)))
        .outerRadius(rScale(sumArray(breakdownDataAll)))

    // Draw Outer Pie
    const pieAllData = d3.select('.circle-group.' + variable)
        .selectAll('g.all.pie-group.' + variable)
        .data(pie(breakdownDataPrevious))

    pieAllData.exit().remove()

    const pieAllGroup = pieAllData
        .enter()
        .append('g')
        .classed('all', true)
        .classed('pie-group', true)


    pieAllGroup
        .append('path')
        .classed('all', true)
        .classed('pie-path', true)
        .style('fill', (_,i)=>colors[i])
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-group.' + variable)
        .data(pie(breakdownDataAll))

    piePreviousData.exit().remove()

    const piePreviousGroup = piePreviousData
        .enter()
        .append('g')
        .classed('previous', true)
        .classed('pie-group', true)

    piePreviousGroup.append('path')
        .classed('previous', true)
        .classed('pie-path', true)
        .style('fill', (_,i)=>colors[i])
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Breakdown Group
    d3.select('.breakdown-group.' + variable)
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 0)
        .remove()

}

function removeBreakdownPie(rScale, breakdownDataAll, breakdownDataPrevious){

    // Edges of Pies Arcs
    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(rScale(sumArray(breakdownDataPrevious)))

    const CircleAllArc = d3.arc()
        .innerRadius(rScale(sumArray(breakdownDataPrevious)))
        .outerRadius(rScale(sumArray(breakdownDataAll)))

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
    d3.selectAll('.previous.pie-path')
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-path')
        .transition()
        .duration(800)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-group')
        .transition()
        .delay(800)
        .remove()
}

// function createBreakdownAnimations(breakdownCategories, allVars, breakdownDataAll, breakdownDataPrevious, breakdownColorsDict, rScale){
//     breakdownCategories.forEach(function(c, ci){
//         allVars.forEach(function(v, vi){
//             d3.select('.breakdown-trigger.' + v).on('click',function(){
//                 createBreakdownPie(v, breakdownDataAll[ci][vi], breakdownDataPrevious[ci][vi], breakdownColorsDict[c], rScale)
//             })
//         })
//     })
    
// }
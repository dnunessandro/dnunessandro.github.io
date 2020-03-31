function createBreakdownPie(variable, breakdownIndex, breakdownDataAll, 
    breakdownDataPrevious, colors, rScales, dataKeys, labels, unavailableFlag){

    // Check if First Category
    const firstCategoryFlag = breakdownIndex == 0

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
        .cornerRadius(2)

    const allInnerRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataPrevious)) :
        globalChartWidth * allPieInnerRadiusWidthFrac

    const allOuterRadius = firstCategoryFlag ? 
        rScales[variable](sumArray(breakdownDataAll)) + 1 :
        globalChartWidth * allPieOuterRadiusWidthFrac

    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)
        .cornerRadius(3)

    // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-group.' + variable)
        .data(pieInner(breakdownDataPrevious))

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
        .style('stroke-width', '0')
        .style('opacity', firstCategoryFlag ? '0' : '1')
        .transition('a')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)
        .style('stroke-width', breakdownCircleStrokeWidth)
        .style('stroke', circleStrokeColor)
        .style('opacity', '1')

    // Draw Outer Pie
    const pieAllData = d3.select('.circle-group.' + variable)
        .selectAll('g.all.pie-group.' + variable)
        .data(pieOuter(breakdownDataAll.map((a, i) => a - breakdownDataPrevious[i])))

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
        .style('stroke-width', '0')
        .style('fill', (_,i)=>colors[i])
        .style('opacity', firstCategoryFlag ? '0' : '1')
        .transition('b')
        .duration(600)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)
        .style('stroke-width', breakdownCircleStrokeWidth)
        .style('stroke', circleStrokeColor)
        .style('opacity', '1')


    // Highlight Other Category
    d3.selectAll('.pie-path.region_other')
        .transition('z')
        .duration(600)
        .delay(600)
        .ease(d3.easePoly)
        .style('stroke-width', '2')
        .style('stroke', otherHighlightColor)

        
    
    if (firstCategoryFlag){

        piePreviousGroupTweened
            .attr('d', CirclePreviousArc.outerRadius(previousOuterRadius))
            .transition('a')
            .duration(200)
            .ease(d3.easePoly)
            .attr('d', CirclePreviousArc.outerRadius(globalChartWidth * previousPieOuterRadiusWidthFrac))

        pieAllGroupTweened
            .attr('d', CircleAllArc.innerRadius(allInnerRadius))
            .attr('d', CircleAllArc.outerRadius(allOuterRadius))
            .transition('b')
            .duration(200)
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
        .style('opacity', 0)
      
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
    createPieChartLabelsForce(newPositions, 7)

    const piePreviousLabelsRects = piePreviousLabelsGroup
        .enter()
        .append('rect')
        .classed('previous', true)
        .classed('pie-label-bg', true)
        .classed(variable, true)

    piePreviousLabelsGroup
        .enter()
        .append('text')
        .classed('previous', true)
        .classed('pie-label', true)
        .classed(variable, true)
        .text((_,i)=>breakdownDataPrevious[i])
        .style('fill', '#4c4e4d')
        .style('font-size', '0.6rem')
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        // .attr("text-anchor", function(d) {
        //     return (d.endAngle + d.startAngle)/2 > Math.PI ?
        //         "end" : "start";
        // })

    // Get Labels Width and Height
    let textWidthArray = []
    let textHeightArray = []
    labels.forEach(function(_,i){

        textBBox = d3.selectAll('text.pie-label.previous.' + variable)
            .filter((_,e)=>e==i)
            .node()
            .getBBox()
            textWidthArray.push(textBBox.width)
            textHeightArray.push(textBBox.height)

    })

    piePreviousLabelsRects
        .style('fill', boxColor)
        .attr('width', (_,i)=>(textWidthArray[i]+6))
        .attr('height', (_,i)=>textHeightArray[i]+6)
        .attr('rx', breakdownShapeRx)
        .attr('transform', (_,i) => 'translate(' + parseInt(pieLabelsOutsideCoordinatePairs[i][0]-(textWidthArray[i]+6)/2) + ',' + parseInt(newPositions[i].y-(textHeightArray[i]+6)/2) + ')' )


    // Draw Outer Pie Labels
    d3.selectAll('.all.pie-label-group').remove()
    
    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('all',true)
        .classed('pie-label-group', true)
        .classed(variable, true)
        .style('opacity', 0)
    
    const pieAllLabelsGroup = d3.select('.circle-group.' + variable)
        .select('.all.pie-label-group.' + variable)
        .selectAll('text.all.pie-label.' + variable)
        .data(pieOuter(breakdownDataAll.map(function (num, idx) {
            return num - breakdownDataPrevious[idx];
          })))

    // Update Label Positions with Force Layout
    pieLabelsOutsideCoordinatePairs = pieOuter(breakdownDataAll)
        .map(d=>translateLabelOutside(d, CircleAllArc, Math.max(5, allOuterRadius)))

    newPositions = pieLabelsOutsideCoordinatePairs.map(d => {
        return {
        fx: 0,
        targetY: d[1]
        };
    });
    createPieChartLabelsForce(newPositions)

    const pieAllLabelsRects = pieAllLabelsGroup
        .enter()
        .append('rect')
        .classed('all', true)
        .classed('pie-label-bg', true)
        .classed(variable, true)

    pieAllLabelsGroup
        .enter()
        .append('text')
        .classed('all', true)
        .classed('pie-label', true)
        .classed(variable, true)
        .text((_,i)=>breakdownDataAll[i]-breakdownDataPrevious[i])
        .style('fill', '#4c4e4d')
        .style('font-size', '0.6rem')
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )


    // Get Labels Width and Height
    textWidthArray = []
    textHeightArray = []
    labels.forEach(function(_,i){

        textBBox = d3.selectAll('text.pie-label.all.' + variable)
            .filter((_,e)=>e==i)
            .node()
            .getBBox()
            textWidthArray.push(textBBox.width)
            textHeightArray.push(textBBox.height)

    })

    pieAllLabelsRects
        .style('fill', boxColor)
        .attr('width', (_,i)=>(textWidthArray[i]+6))
        .attr('height', (_,i)=>textHeightArray[i]+6)
        .attr('rx', breakdownShapeRx)
        .attr('transform', (_,i) => 'translate(' + parseInt(pieLabelsOutsideCoordinatePairs[i][0]-(textWidthArray[i]+6)/2) + ',' + parseInt(newPositions[i].y-(textHeightArray[i]+6)/2) + ')' )
    

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
    const previousOuterRadius = globalChartWidth * previousPieOuterRadiusWidthFrac

    const CirclePreviousArc = d3.arc()
        .innerRadius(0)
        .outerRadius(previousOuterRadius)
        .cornerRadius(2)

    const allInnerRadius = globalChartWidth * allPieInnerRadiusWidthFrac

    const allOuterRadius = globalChartWidth * allPieOuterRadiusWidthFrac

    const CircleAllArc = d3.arc()
        .innerRadius(allInnerRadius)
        .outerRadius(allOuterRadius)
        .cornerRadius(3)

    // Remove Inner Pie
    d3.selectAll('.previous.pie-path.' + variable)
        .transition('e')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-path.' + variable)
        .transition('f')
        .duration(600)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    d3.selectAll('.pie-group.' + variable)
        .transition('g')
        .duration(400)
        .ease(d3.easePoly)
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
        if(!d3.select('.previous.pie-other-path.' + v).empty())
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
        .cornerRadius(3)

        // Draw Inner Pie
    const piePreviousData = d3.select('.circle-group.' + variable)
        .selectAll('g.previous.pie-other-group.' + variable)
        .data(pieInner(otherBreakdownDataPreviousArray))

    const piePreviousDataPaths = piePreviousData.select('path.previous.pie-other-path')

    piePreviousData.exit().remove()

    const nonTranslatedPiePreviousGroup = piePreviousData
        .enter()
        .append('g')
        .classed('previous', true)
        .classed('pie-other-group', true)
        .classed(variable, true)

    let piePreviousGroup;

    if (allVars.indexOf(variable) == 2){

        piePreviousGroup = nonTranslatedPiePreviousGroup
            .style('transform', 'translate(' + (-parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5)) + 'px,' +
                parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    }else{
        piePreviousGroup = nonTranslatedPiePreviousGroup
            .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
                parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    }

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
        .data(pieOuter(otherBreakdownDataAllArray.map((a, i) => a - otherBreakdownDataPreviousArray[i])))

    const pieAllDataPaths = pieAllData.select('path.all.pie-other-path')

    pieAllData.exit().remove()

    const nonTranslatedPieAllGroup = pieAllData
        .enter()
        .append('g')
        .classed('all', true)
        .classed('pie-other-group', true)
        .classed(variable, true)

    let pieAllGroup;
    if (allVars.indexOf(variable) == 2){
        pieAllGroup = nonTranslatedPieAllGroup
            .style('transform', 'translate(' + (-parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5)) + 'px,' +
                parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    }else{
        pieAllGroup = nonTranslatedPieAllGroup
            .style('transform', 'translate(' + parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px,' +
                parseInt(otherRScale(sumArray(otherBreakdownDataAllArray))*2.5) + 'px)')
    }

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
        .outerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac*1.05)
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
        .style('opacity', 0)
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

    const piePreviousLabelsRects = piePreviousLabelsGroup
        .enter()
        .append('rect')
        .classed('previous', true)
        .classed('pie-label-bg', true)
        .classed(variable, true)


    piePreviousLabelsGroup
        .enter()
        .append('text')
        .classed('previous', true)
        .classed('pie-other-label', true)
        .classed(variable, true)
        .text((_,i)=>otherBreakdownDataPreviousArray[i])
        .style('fill', '#4c4e4d')
        .style('font-size', '0.6rem')
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        // .attr("text-anchor", function(d) {
        //     return (d.endAngle + d.startAngle)/2 > Math.PI ?
        //         "end" : "start";
        // })

    //Get Labels Width and Height
    let textWidthArray = []
    let textHeightArray = []
    otherBreakdownDataPreviousArray.forEach(function(_,i){

        textBBox = d3.selectAll('text.pie-other-label.previous.' + variable)
            .filter((_,e)=>e==i)
            .node()
            .getBBox()
            textWidthArray.push(textBBox.width)
            textHeightArray.push(textBBox.height)

    })

    piePreviousLabelsRects
        .style('fill', boxColor)
        .attr('width', (_,i)=>(textWidthArray[i]+4))
        .attr('height', (_,i)=>textHeightArray[i]+4)
        .attr('rx', breakdownShapeRx)
        .attr('transform', (_,i) => 'translate(' + parseInt(pieLabelsOutsideCoordinatePairs[i][0]-(textWidthArray[i]+4)/2) + ',' + parseInt(newPositions[i].y-(textHeightArray[i]+4)/2) + ')' )




    // Draw Outer Pie Labels
    d3.selectAll('.all.pie-other-label-group').remove()
    
    d3.select('.circle-group.' + variable)
        .append('g')
        .classed('all',true)
        .classed('pie-other-label-group', true)
        .classed(variable, true)
        .style('opacity', 0)
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

    const pieAllLabelsRects = pieAllLabelsGroup
        .enter()
        .append('rect')
        .classed('all', true)
        .classed('pie-label-bg', true)
        .classed(variable, true)

    pieAllLabelsGroup
        .enter()
        .append('text')
        .classed('all', true)
        .classed('pie-other-label', true)
        .classed(variable, true)
        .text((_,i)=>otherBreakdownDataAllArray[i]-otherBreakdownDataPreviousArray[i])
        .style('fill', '#4c4e4d')
        .style('font-size', '0.6rem')
        .attr('transform', (_,i) => 'translate(' + pieLabelsOutsideCoordinatePairs[i][0] + ',' + newPositions[i].y + ')' )
        // .attr("text-anchor", function(d) {
        //     return (d.endAngle + d.startAngle)/2 > Math.PI ?
        //         "end" : "start";
        // })

        //Get Labels Width and Height
        textWidthArray = []
        textHeightArray = []
        otherBreakdownDataAllArray.forEach(function(_,i){
    
            textBBox = d3.selectAll('text.pie-other-label.all.' + variable)
                .filter((_,e)=>e==i)
                .node()
                .getBBox()
                textWidthArray.push(textBBox.width)
                textHeightArray.push(textBBox.height)
    
        })
    
        pieAllLabelsRects
            .style('fill', boxColor)
            .attr('width', (_,i)=>(textWidthArray[i]+4))
            .attr('height', (_,i)=>textHeightArray[i]+4)
            .attr('rx', breakdownShapeRx)
            .attr('transform', (_,i) => 'translate(' + parseInt(pieLabelsOutsideCoordinatePairs[i][0]-(textWidthArray[i]+4)/2) + ',' + parseInt(newPositions[i].y-(textHeightArray[i]+4)/2) + ')' )
    

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

    const HighlightArc = d3.arc()
        .innerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac)
        .outerRadius(globalChartWidth*otherAllPieOuterRadiusWidthFrac*1.05)


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

    function tweenHighlight(b) {
        //b.innerRadius = 0;
        var i = d3.interpolate(b, {startAngle: 0, endAngle: 0});
        return function(t) { return HighlightArc(i(t)); };
        }

    // Remove Inner Pie
    d3.selectAll('.previous.pie-other-path.' + variable)
        .transition('k')
        .duration(300)
        .ease(d3.easePoly)
        .attrTween("d", tweenInnerPie)

    // Remove Outer Pie
    d3.selectAll('.all.pie-other-path.' + variable)
        .transition('l')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenOuterPie)

    // Remove Highlight
    d3.selectAll('.highlight-path')
        .transition('m')
        .duration(500)
        .ease(d3.easePoly)
        .attrTween("d", tweenHighlight)

    d3.selectAll('.pie-other-group.' + variable)
        .transition('n')
        .duration(500)
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



function createCircleLabels(variable, xFrac, labels, colors, supFrac, infFrac, step){

    const yScale = createCircleLabelsYScale(labels, supFrac, infFrac, step)

    let labelsGroups = svgGlobal.selectAll('g.circle-label-group.' + variable)
        .data(labels)

    labelsGroups.exit().remove()

    const labelGroupsEnter = labelsGroups.enter()
        .append('g')
        .classed('circle-label-group', true)
        .classed(variable, true)   
        .attr('transform', d=>'translate('+ xFrac*globalChartWidth + ',' + (-100) + ')')

    labelGroupsEnter
        .append('rect')
        .classed('circle-label-bg', true)
        .classed(variable, true)

    labelGroupsEnter
        .append('circle')
        .classed('circle-label-color', true)
        .classed(variable, true)
        
    labelGroupsEnter
        .append('text')
        .classed('circle-label', true)
        .classed(variable, true)
        
    labelsGroups = labelsGroups.merge(labelGroupsEnter)

    labelsGroups
        .transition()
        .duration(600)
        .delay((_,i)=>i*100)
        .ease(d3.easePoly)
        .attr('transform', d=>'translate('+ xFrac*globalChartWidth + ',' + yScale(d) + ')')

    labelsGroups
        .select('circle')
        .transition()
        .duration(600)
        .delay((_,i)=>i*100)
        .ease(d3.easePoly)
        .style('fill', (_,i)=>colors[i])
        .attr('r', circleLabelRadius)


    labelsGroups
        .select('text')
        .text((_,i)=>labels[i])
        .attr('transform', 'translate(' + circleLabelRadius*1.5 + ',0)' )
        .style('opacity', 0)
        .transition()
        .duration(600)
        .delay((_,i)=>i*100)
        .ease(d3.easePoly)
        .style('opacity', 1)


    // Get Labes Width and Height
    let textWidthArray = []
    let textHeightArray = []
    labels.forEach(function(_,i){

        textBBox = d3.selectAll('.circle-label.' + variable)
            .filter((_,e)=>e==i)
            .node()
            .getBBox()
            textWidthArray.push(textBBox.width)
            textHeightArray.push(textBBox.height)

    })

    labelsGroups
        .select('rect')
        .style('fill', boxColor)
        .attr('width', (_,i)=>(textWidthArray[i] + 2*circleLabelRadius + 14))
        .attr('height', (_,i)=>textHeightArray[i]*1.4)
        .attr('rx', breakdownShapeRx)
        .attr('transform', (d,i)=> 'translate(' + (-circleLabelRadius*2) + ',' + (-textHeightArray[i]*1.4/2) +')' )

}

function removeAllCircleLabels(){

    const labelGroups = d3.selectAll('.circle-label-group')

    labelGroups
        .style('opacity', 1)
        .transition()
        .duration(600)
        .delay((_,i)=>i*100)
        .attr('transform', 'translate(0' + (-100) + ')')
        .style('opacity', 0)
        .remove()

}


function changeCircleTitlesOpacity(variable){

    if(initialConditionsFlag){
        
        const allLabelGroups = d3.selectAll('.circle-title-group')
        allLabelGroups
            .transition()
            .duration(600)
            .ease(d3.easePoly)
            .style('opacity', 1)
    }else{


        const otherLabelGroups = d3.selectAll('.circle-title-group')
            .filter((_,i)=>i!=allVars.indexOf(variable))

        otherLabelGroups
            .transition()
            .duration(600)
            .ease(d3.easePoly)
            .style('opacity', 0)

        const currentlySelectedLabelGroup = d3.selectAll('.circle-title-group')
            .filter((_,i)=>i==allVars.indexOf(variable))

        currentlySelectedLabelGroup
            .transition()
            .duration(600)
            .ease(d3.easePoly)
            .style('opacity', 1)
        }
}

function createBreakdownTitle(variable, breakdownTitle, breakdownIcon, unavailableFlag){

    let breakdownTitleGroup = svgGlobal.selectAll('g.breakdown-title-group.' + variable)
        .data([breakdownTitle])

    const breakdownTitleGroupEnter = breakdownTitleGroup
        .enter()
        .append('g')
        .classed('breakdown-title-group', true)
        .classed(variable, true)

    const breakdownTitleRect = breakdownTitleGroupEnter
        .append('rect')
        .classed('breakdown-title-bg', true)

    const breakdowTitleText = breakdownTitleGroupEnter
        .append('text')
        .classed('breakdown-title-text', true)

    const breakdownTitleIcon = breakdownTitleGroupEnter
        .append('text')
        .classed('breakdown-title-icon', true)

    breakdownTitleGroup = breakdownTitleGroup.merge(breakdownTitleGroupEnter)

    breakdownTitleGroup.select('.breakdown-title-icon')
        .style('font-family', 'FontAwesome')
        .style('font-size', '1.4rem' )
        .style('fill', '#485058')
        .style('opacity',unavailableFlag ? 0.4 : 1)
        .text(d=> breakdownIcon)

    breakdownTitleGroup.select('.breakdown-title-text')
        .text(d=>d)
        .style('fill', fontColor)
        .style('font-size', '0.7rem')
        .style('opacity', unavailableFlag ? 0.7 : 1)

    const textBBox = d3.select('.breakdown-title-text')
        .node()
        .getBBox()

    const textWidth = textBBox.width
    const textHeight = textBBox.height

    const iconBBox = d3.select('.breakdown-title-icon')
        .node()
        .getBBox()

    const iconWidth = iconBBox.width
    const iconHeight = iconBBox.height

    breakdownTitleGroup.select('.breakdown-title-icon')
        .attr('transform', 'translate(' + (0) +','+ (-textHeight-10)+')' )

    breakdownTitleGroup.select('rect')
        .attr('width', textWidth + 10)
        .attr('height', textHeight + 5)
        .style('fill', boxColor)
        .attr('rx', breakdownShapeRx)
        .attr('transform', 'translate('+ (-(textWidth+10)/2) + ',' + (-(textHeight+5)/2) + ')')

    

        if (allVars.indexOf(variable) == 2){

            breakdownTitleGroup
                .style('opacity', 0)
                .attr('transform', 'translate(' + (-20) + ',' + (textHeight + iconHeight + 5)+')')
                .transition()
                .duration(600)
                .ease(d3.easePoly)
                .style('opacity', 1)
                .attr('transform', 'translate(' + (20 + textWidth/2-10) + ',' 
                    + (textHeight + iconHeight + 5) + ')')
            

        } else{
            breakdownTitleGroup
                .style('opacity', 0)
                .attr('transform', 'translate(' + (globalChartWidth+20) + ',' + (textHeight + iconHeight + 5)+')')
                .transition()
                .duration(600)
                .ease(d3.easePoly)
                .style('opacity', 1)
                .attr('transform', 'translate(' + (globalChartWidth-textWidth/2-10) + ',' 
                    + (textHeight + iconHeight + 5) + ')')
        }

    
        

}

function removeBreakdownTitle(){

    const constBreakdownTitleTransform = d3.select('.breakdown-title-group')
        .attr('transform')

    const xPosition = parseInt(constBreakdownTitleTransform.substring(
        constBreakdownTitleTransform.lastIndexOf('(')+1,
        constBreakdownTitleTransform.lastIndexOf(','))
    )

    const yPosition = parseInt(constBreakdownTitleTransform.substring(
        constBreakdownTitleTransform.lastIndexOf(',')+1,
        constBreakdownTitleTransform.lastIndexOf(')'))
    )

    const breakdownTitleGroup = d3.select('.breakdown-title-group')
        .transition()
        .duration(600)
        .ease(d3.easePoly)
        .style('opacity', 0)

    if (d3.select('.breakdown-title-group').attr('class').includes(allVars.slice(-1)[0])){
        breakdownTitleGroup
            .attr('transform', 'translate(' + (xPosition - 100) + ',' + yPosition + ')')
            .remove()
    }else{
        breakdownTitleGroup
            .attr('transform', 'translate(' + (xPosition + 100) + ',' + yPosition + ')')
            .remove()
    }

    
        

}


function createUnavailableTitle(variable, unavailableText, unavailableIcon, cxScale){

    let breakdownTitleGroup = svgGlobal.selectAll('g.unavailable-title-group')
        .data([unavailableText])

    const breakdownTitleGroupEnter = breakdownTitleGroup
        .enter()
        .append('g')
        .classed('unavailable-title-group', true)

    const breakdownTitleRect = breakdownTitleGroupEnter
        .append('rect')
        .classed('unavailable-title-bg', true)

    const breakdowTitleText = breakdownTitleGroupEnter
        .append('text')
        .classed('unavailable-title-text', true)

    const breakdownTitleIcon = breakdownTitleGroupEnter
        .append('text')
        .classed('unavailable-title-icon', true)

    breakdownTitleGroup = breakdownTitleGroup.merge(breakdownTitleGroupEnter)

    breakdownTitleGroup.select('.unavailable-title-icon')
        .style('font-family', 'FontAwesome')
        .style('font-size', '1.5rem' )
        .style('opacity', 1)
        .text(d=> unavailableIcon)
        

    breakdownTitleGroup.select('.unavailable-title-text')
        .text(d=>d)
        .style('fill', fontColor)
        .style('font-size', '0.6rem')
        .style('opacity', 0.8)
        .attr('transform', 'translate(0, 12)')

    const textBBox = d3.select('.unavailable-title-text')
        .node()
        .getBBox()

    const textWidth = textBBox.width
    const textHeight = textBBox.height

    const iconBBox = d3.select('.unavailable-title-icon')
        .node()
        .getBBox()

    const iconWidth = iconBBox.width
    const iconHeight = iconBBox.height

    breakdownTitleGroup.select('.unavailable-title-icon')
        .attr('transform', 'translate(0,-10)')

    breakdownTitleGroup.select('rect')
        .attr('width', textWidth + 12)
        .attr('height', textHeight + 5)
        .style('fill', boxColor)
        .attr('rx', breakdownShapeRx)
        .attr('transform', 'translate('+ (-(textWidth+10)/2) + ',' + (-(textHeight+5)/2+12 ) + ')')


    breakdownTitleGroup
        .style('opacity', 0)
        .style('transform', "translate(" + parseInt(cxScale(allVars.indexOf(variable))) + "px," 
            + parseInt(globalChartHeight*circlesHeightFrac) + "px)")
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 1)
        

}

function removeUnavailableTitle(){

    d3.select('.unavailable-title-group')
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 0)
        .remove()

}
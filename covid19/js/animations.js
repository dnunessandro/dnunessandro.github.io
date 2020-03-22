function showCircleNewCases(variable, previousValue, currentValue, variableRScale){

    showInnerCircle(variable, previousValue, variableRScale)
    showOuterCircle(variable, currentValue, variableRScale)
    hideGlobalCircleValue(variable)
    showCircleNewCasesLabels(variable)
}

function showInnerCircle(variable, previousValue, variableRScale){

    d3.select('.circle-shape.previous.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .style('fill', varsColorsDict[variable])
        .attr('r', variableRScale(previousValue))
}

function showOuterCircle(variable, currentValue, variableRScale){

    d3.select('.circle-shape.all.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .style('fill', varsColorsDict[variable + '_novos'])
        .attr('r', variableRScale(currentValue))
}

function hideGlobalCircleValue(variable){

    d3.select('.circle-value.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)
}

function showCircleNewCasesLabels(variable){

    d3.select('.new-cases-labels.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
}







function greyOutOtherCircles(variable, rScale){

    allVars.filter(v=>v!=variable).forEach(function(v){
        hideInnerCircle(v, rScale)
        hideCircleNewCasesLabels(v)
        greyOutCircle(v, rScale)
    })

}

function greyOutCircle(variable, rScale){
    d3.select('.circle-shape.all.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', boxColor)
        .attr('r', greyedOutRadiusFrac*chartWidth)
        .style('opacity', 1)

    d3.selectAll('.circle-value.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)
}
 






function hideCircleNewCases(variable, rScale){

    resizeOuterCircleToOriginal(variable, rScale)
    hideInnerCircle(variable, rScale)
    hideCircleNewCasesLabels(variable)
}

function resizeOuterCircleToOriginal(variable, rScale){

    d3.select('.circle-shape.all.' + variable)
        .transition('a')
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', varsColorsDict[variable])
        .attr('r', d=>rScale(d))
        .style('opacity', 1)
}

function hideInnerCircle(variable, rScale){

    d3.select('.circle-shape.previous.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .attr('r', d=>rScale(d))
        .style('opacity', 0)
}

function hideCircleNewCasesLabels(variable){

    d3.select('.new-cases-labels.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)
}





function resetCircle(variable, rScale){
    hideInnerCircle(variable, rScale)
    resizeOuterCircleToOriginal(variable, rScale)
    hideCircleNewCasesLabels(variable)
    showGlobalCircleValue(variable)
}




function showGlobalCircleValue(variable){

    d3.select('.circle-value.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
}




function hideGlobalCircle(variable){

    d3.select('.all.circle-shape.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)
}



function updateShowBreakdownFlagDict(variable){
    const otherVars = allVars.filter(v=>v!=variable)
    otherVars.forEach(v=>showbreakDownFlagDict[v]=false)
    showbreakDownFlagDict[variable] = true
}

function resetShowBreakdownFlagDict(){
    Object.keys(showbreakDownFlagDict).forEach(k=>showbreakDownFlagDict[k]=false)
}


                       
function bindAnimations(globalDataPreviousArray, globalDataAllArray, breakdownDataPrevious, breakdownDataAll, rScale, rScales, otherBreakdownPreviousData, otherBreakdownAllData){

        // Show Circles New Cases
        d3.selectAll('.circle-group').on('click', function(d, i){

            const variable = allVars[i]

            if (showbreakDownFlagDict[variable]){
                const ci = breakdownIndexArray[breakdownIndex]
                const c = breakdownCategories[ci]
                const colors = unavailableDict[variable].length == 0 ? breakdownColorsDict[c] : unavailableColors
                createBreakdownPie(variable, breakdownDataAll[ci][i], breakdownDataPrevious[ci][i], colors, rScales)
                hideInnerCircle(variable, rScale)
                hideCircleNewCasesLabels(variable)
                hideGlobalCircle(variable)
                if (otherBreakdownPreviousData[i].length != 0 & c=='region'){
                    createSmallNumbersBreakdownPie(variable, otherBreakdownPreviousData[i], otherBreakdownAllData[i])
                }else if(c=='sex' & breakdownIndex != 0) {
                    removeSmallNumbersBreakdownPie(variable, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
                }
                
                breakdownIndex++
            } else{
                showCircleNewCases(variable, globalDataPreviousArray[i], globalDataAllArray[i], rScales[variable])
                greyOutOtherCircles(variable, rScale)
                removeOtherBreakdownPies(variable, breakdownDataAll, breakdownDataAll, breakdownIndex)
                //removeAllSmallNumberBreakdownPies(otherBreakdownPreviousData, otherBreakdownAllData)
                updateShowBreakdownFlagDict(variable)

                if(!d3.select('.pie-other-group').empty()) {

                    const targetVariable = d3.select('.pie-other-group').attr('class').split(' ').slice(-1)[0]
                    removeSmallNumbersBreakdownPie(targetVariable, otherBreakdownAllData[allVars.indexOf(targetVariable)], 
                    otherBreakdownPreviousData[allVars.indexOf(targetVariable)])
                } 
            }
            

        })

        d3.select('#callback-rect').on('click', function(){
            
            allVars.forEach(function(v,i){
                const ci = breakdownIndex > 0 ? breakdownIndexArray[breakdownIndex-1] : 0

                removeBreakdownPie(v, rScales, breakdownDataAll[ci][i], breakdownDataPrevious[ci][i])
                if(!d3.select('.pie-other-group.' + v).empty()) {  
                    removeSmallNumbersBreakdownPie(v, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
                } 
                resetCircle(v, rScale)

                breakdownIndex = 0
                resetShowBreakdownFlagDict()
            })

        })

}
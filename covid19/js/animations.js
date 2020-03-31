function showCircleNewCases(variable, previousValue, currentValue, variableRScale) {

    showInnerCircle(variable, previousValue, variableRScale)
    showOuterCircle(variable, currentValue, variableRScale)
    hideGlobalCircleValue(variable)
    showCircleNewCasesLabels(variable)
}

function showInnerCircle(variable, previousValue, variableRScale) {

    d3.select('.circle-shape.previous.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .style('fill', varsColorsDict[variable])
        .attr('r', variableRScale(previousValue))
}

function showOuterCircle(variable, currentValue, variableRScale) {

    d3.select('.circle-shape.all.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
        .style('fill', varsColorsDict[variable + '_novos'])
        .attr('r', variableRScale(currentValue))
        .style('stroke', 'none')
}

function hideGlobalCircleValue(variable) {

    d3.select('.circle-value.' + variable)
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 0)
}

function showCircleNewCasesLabels(variable) {

    d3.select('.new-cases-labels.' + variable)
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', 1)
}







function greyOutOtherCircles(variable, rScale) {

    allVars.filter(v => v != variable).forEach(function (v) {
        hideInnerCircle(v, rScale)
        hideCircleNewCasesLabels(v)
        greyOutCircle(v, rScale)
    })

}

function greyOutCircle(variable, rScale) {
    d3.select('.circle-shape.all.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('fill', boxColor)
        .attr('r', greyedOutRadiusFrac * globalChartWidth)
        .style('opacity', 1)
        .style('stroke', 'none')

    d3.selectAll('.circle-value.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 0)
}







function hideCircleNewCases(variable, rScale) {

    resizeOuterCircleToOriginal(variable, rScale)
    hideInnerCircle(variable, rScale)
    hideCircleNewCasesLabels(variable)
}

function resizeOuterCircleToOriginal(variable, rScale) {

    d3.select('.circle-shape.all.' + variable)
        .transition('a')
        .duration(500)
        .ease(d3.easePoly)
        .style('fill', varsColorsDict[variable])
        .attr('r', d => rScale(d))
        .style('opacity', 1)
        .style('stroke', circleStrokeColor)
}

function hideInnerCircle(variable, rScale) {

    d3.select('.circle-shape.previous.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attr('r', d => rScale(d))
        .style('opacity', 0)
}

function hideCircleNewCasesLabels(variable) {

    d3.select('.new-cases-labels.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', 0)
}





function resetCircle(variable, rScale) {
    hideInnerCircle(variable, rScale)
    resizeOuterCircleToOriginal(variable, rScale)
    hideCircleNewCasesLabels(variable)
    showGlobalCircleValue(variable)
}




function showGlobalCircleValue(variable) {

    d3.select('.circle-value.' + variable)
        .transition()
        .duration(200)
        .ease(d3.easePoly)
        .style('opacity', 1)
}




function hideGlobalCircle(variable) {

    d3.select('.all.circle-shape.' + variable)
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', 0)
}


function updateShowBreakdownFlagDict(variable) {
    const otherVars = allVars.filter(v => v != variable)
    otherVars.forEach(v => showbreakDownFlagDict[v] = false)
    showbreakDownFlagDict[variable] = true
}

function resetShowBreakdownFlagDict() {
    Object.keys(showbreakDownFlagDict).forEach(k => showbreakDownFlagDict[k] = false)
}

function updateScaleSwitch(linearScaleFlag) {

    $('#scale-button').prop('checked', linearScaleFlag)
    $('#scale-button').bootstrapToggle(linearScaleFlag ? 'on' : 'off')

}

function changeScale(data, configKeysDict, configColorsDict, configUnavailableDict, configShortLabelsDict) {
    createLinePlot(data,
        configKeysDict[currentConfig],
        configColorsDict[currentConfig],
        configUnavailableDict[currentConfig],
        configShortLabelsDict[currentConfig])

}

function changePieOpacity(variable, opacityVal) {

    d3.selectAll('.pie-path.' + variable)
        .filter(function (d, i) {
            return !d3.select(this).attr('class').includes('other')
        })
        .transition()
        .duration(300)
        .ease(d3.easePoly)
        .style('opacity', opacityVal)
}

function bindAnimations(globalDataPreviousArray, globalDataAllArray, breakdownDataPrevious, breakdownDataAll,
    rScale, rScales, cxScale, otherBreakdownPreviousData, otherBreakdownAllData,
    data, configKeysDict, configColorsDict, configUnavailableDict, configScalesDict, configLabelsDict, configShortLabelsDict, circlsLabelsXFracDict) {

    $('#scale-button').on('change', function () {
        changeScale(data, configKeysDict, configColorsDict, configUnavailableDict, configShortLabelsDict)
    })

    d3.selectAll('.circle-group').on('click', function (d, i) {

        const variable = allVars[i]
        initialConditionsFlag = false


        if (showbreakDownFlagDict[variable]) { // Draw Next Category Breakdown Pie

            const ci = breakdownIndexArray[breakdownIndex]
            const c = breakdownCategories[ci]
            const colors = unavailableDict[variable].length == 0 ? breakdownColorsDict[c] : unavailableColors
            currentConfig = variable + '_' + c

            changeCircleTitlesOpacity()
            changeUiElementsExpandedState(globalChartHeightFixed, 1)
            changePieOpacity(variable, 1)
   
            createBreakdownTitle(variable, breakdownTitlesDict[c], breakdownIconsDict[c], configUnavailableDict[currentConfig])
            createBreakdownPie(variable, breakdownIndex, breakdownDataAll[ci][i], breakdownDataPrevious[ci][i],
                colors, rScales, configKeysDict[currentConfig], configLabelsDict[currentConfig], configUnavailableDict[currentConfig])
            hideInnerCircle(variable, rScale)
            hideCircleNewCasesLabels(variable)
            hideGlobalCircle(variable)

            removeUnavailableTitle()
            configUnavailableDict[currentConfig] ? createUnavailableTitle(variable, unavailableText, unavailableIcon, cxScale) : removeUnavailableTitle()

            configUnavailableDict[currentConfig] ? removeAllCircleLabels() :
                createCircleLabels('other', circlsLabelsXFracDict[variable], configLabelsDict[currentConfig], configColorsDict[currentConfig], 0.05, 0.2, 0.05)

            d3.selectAll('.pie-path.region_other, .pie-other-label-group, .pie-other-group').on('click', function () { // Show Small Numbers Pie

                event.stopPropagation()

                if (smallValuesDisplayedFlag) { // If Already Shown

                    currentConfig = variable + '_' + c

                    const globalChartHeight = parseInt($(window).height() * 0.25)

                    changeUiElementsExpandedState(globalChartHeightFixed, 1)
                    removeAllCircleLabels()
                    createCircleLabels('other', circlsLabelsXFracDict[variable], configLabelsDict[currentConfig], configColorsDict[currentConfig], 0.05, 0.2, 0.05)

                    removeSmallNumbersBreakdownPie(variable, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
                    updateScaleSwitch(configScalesDict[currentConfig])
                    createLinePlot(data, configKeysDict[currentConfig],
                        configColorsDict[currentConfig],
                        configUnavailableDict[currentConfig],
                        configShortLabelsDict[currentConfig])
                    changePieOpacity(variable, 1)

                    smallValuesDisplayedFlag = false


                } else { // If Not Shown Yet

                    createSmallNumbersBreakdownPie(variable, otherBreakdownPreviousData[i], otherBreakdownAllData[i])
                    createOtherLinePlot(data, configKeysDict, configColorsDict, configUnavailableDict, configLabelsDict)
                    changePieOpacity(variable, 0.5)
                    smallValuesDisplayedFlag = true

                    changeUiElementsExpandedState(globalChartHeightFixed * globalChartHeightExpandedFrac, 0)

                    createCircleLabels('other', circlsLabelsXFracDict['other'], configLabelsDict[currentConfig], configColorsDict[currentConfig], 0.65, -0.4, 0.05)

                    d3.selectAll('.pie-other-label-group, .pie-other-group').on('click', function () {
                        event.stopPropagation()

                        currentConfig = variable + '_' + c

                        removeSmallNumbersBreakdownPie(variable, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
                        updateScaleSwitch(configScalesDict[currentConfig])
                        createLinePlot(data, configKeysDict[currentConfig],
                            configColorsDict[currentConfig],
                            configUnavailableDict[currentConfig],
                            configShortLabelsDict[currentConfig])
                        changePieOpacity(variable, 1)
                        smallValuesDisplayedFlag = false

                        changeUiElementsExpandedState(globalChartHeightFixed, 1)
                        //changeCircleTitlesOpacity(variable)
                        createCircleLabels('other', circlsLabelsXFracDict[variable], 
                        configLabelsDict[currentConfig], configColorsDict[currentConfig], 
                        0.05, 0.2, 0.05)


                    })

                }


            })


            if (otherBreakdownPreviousData[i].length != 0 & c == 'region' & !configUnavailableDict[currentConfig]) { // Create Small Numbers Pie Chart
                // createSmallNumbersBreakdownPie(variable, otherBreakdownPreviousData[i], otherBreakdownAllData[i])

                // d3.selectAll('.pie-other-group').on('click', function(){

                //     createOtherLinePlot(data, configKeysDict, 
                //         configColorsDict, configUnavailableDict, configLabelsDict)

                // })

            } else if (c == 'sex' & breakdownIndex != 0 & otherBreakdownAllData[i].length != 0) {
                removeSmallNumbersBreakdownPie(variable, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
            }

            // Create Line Plot
            updateScaleSwitch(configScalesDict[currentConfig])
            createLinePlot(data, configKeysDict[currentConfig],
                configColorsDict[currentConfig],
                configUnavailableDict[currentConfig],
                configShortLabelsDict[currentConfig])


            breakdownIndex++
        } else { // Show New Cases Breakdown
            currentConfig = variable
            removeUnavailableTitle()
            changeUiElementsExpandedState(globalChartHeightFixed, 1)
            !d3.select('.breakdown-title-group').empty() ? removeBreakdownTitle() : undefined   
            showCircleNewCases(variable, globalDataPreviousArray[i], globalDataAllArray[i], rScales[variable])
            greyOutOtherCircles(variable, rScale)
            removeOtherBreakdownPies(variable, breakdownDataAll, breakdownDataAll, breakdownIndex)
            removeAllSmallNumberBreakdownPies(otherBreakdownPreviousData, otherBreakdownAllData)
            removeAllCircleLabels()
            changeCircleTitlesOpacity(variable)
            updateShowBreakdownFlagDict(variable)
            createCircleLabels('other', circlsLabelsXFracDict[variable], configLabelsDict[currentConfig], configColorsDict[currentConfig], 0.05, 0.2, 0.05)

            // Create Line Plot
            updateScaleSwitch(configScalesDict[currentConfig])
            createLinePlot(data,
                configKeysDict[currentConfig],
                configColorsDict[currentConfig],
                configUnavailableDict[currentConfig],
                configShortLabelsDict[currentConfig])

            breakdownIndex = 0

            // if (!d3.select('.pie-other-group').empty()) {

            //     const targetVariable = d3.select('.pie-other-group').attr('class').split(' ').slice(-1)[0]
            //     removeSmallNumbersBreakdownPie(targetVariable, otherBreakdownAllData[allVars.indexOf(targetVariable)],
            //         otherBreakdownPreviousData[allVars.indexOf(targetVariable)])


            //     changeUiElementsExpandedState(globalChartHeightFixed, 1)
            // }
        }


    })

    d3.select('#callback-rect').on('click', function () {

        initialConditionsFlag = true
        smallValuesDisplayedFlag = false
        changeCircleTitlesOpacity()
        removeAllCircleLabels()
        removeUnavailableTitle()
        !d3.select('.breakdown-title-group').empty() ? removeBreakdownTitle() : undefined

        allVars.forEach(function (v, i) {
            const ci = breakdownIndex > 0 ? breakdownIndexArray[breakdownIndex - 1] : 0

            removeBreakdownPie(v, rScales, breakdownDataAll[ci][i], breakdownDataPrevious[ci][i])
            if (!d3.select('.pie-other-group.' + v).empty()) {
                removeSmallNumbersBreakdownPie(v, otherBreakdownAllData[i], otherBreakdownPreviousData[i])
            }
            resetCircle(v, rScale)

            breakdownIndex = 0
            resetShowBreakdownFlagDict()

            // Create Line Plot
            currentConfig = 'global'

            updateScaleSwitch(configScalesDict[currentConfig])
            createLinePlot(data, configKeysDict[currentConfig], configColorsDict[currentConfig],
                configUnavailableDict[currentConfig], configShortLabelsDict[currentConfig])

            changeUiElementsExpandedState(globalChartHeightFixed, 1)

        })

    })

}


function setLabelsInitialConditions(xScale, yScale, timeChartLabelsUnformatted) {

    if (initialConditionsFlag) {
        timeChartLabelsUnformatted
            .attr('x', xScale.range()[1])
            .attr('y', yScale.range()[0])
            .style('opacity', 0)
    }

    initialConditionsFlag = false
}


function changeUiElementsExpandedState(height, footerOpacity) {
    d3.select('#footer')
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .style('opacity', footerOpacity)
    svgGlobal
        .transition()
        .duration(500)
        .ease(d3.easePoly)
        .attr('height', height)
    

}
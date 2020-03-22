d3.json(dataPath).then(function(data){


    // Compute Additional Daily Numbers
    data = getAdditionalAgeBrackets(data, newAgeBracketsDict, allVars)
    data = getDailySexData(data, allVars, ageBrackets)
    const smallCategoryValuesDict = getSmallCategoryValuesDict(data.slice(-1)[0], regions, smallValuesFracTresh)
    data = computeOtherCategory(data, 'region', smallCategoryValuesDict)
    
    
    // Get Global Data
    const globalData = getGlobalData(data, globalVarsDict, smallCategoryValuesDict)
    const globalDataAllArray = allVars.map(d=>globalData[d])
    const globalDataPreviousArray = allVars.map(d=> d + '_anterior').map(d=>globalData[d])

    // Get Breakdown Data
    breakdownData = getBreakdownData(globalData, breakdownCategories, allVars, ageBrackets, regions, smallCategoryValuesDict)
    let breakdownDataAll = breakdownData[0]
    let breakdownDataPrevious = breakdownData[1]

    // Get Other Breakdown Data
    breakdownData = getOtherBreakdownData(globalData, smallCategoryValuesDict)
    const otherBreakdownPreviousData = breakdownData[0]
    const otherBreakdownAllData = breakdownData[1]

    // Fix Unavailable Data
    const fixedBreakdownDataAll =  fixUnavailableBreakdownData(breakdownDataPrevious, breakdownDataAll, globalDataPreviousArray, globalDataAllArray, unavailableDict)
    breakdownDataPrevious = fixedBreakdownDataAll[0]
    breakdownDataAll = fixedBreakdownDataAll[1]
    
    // Create Scales
    const scales = createScales(globalDataAllArray, globalDataPreviousArray)
    const cxScale = scales[0]
    const rScale = scales[1]
    const rScales = scales[2]

    // Create Groups
    const circleGroups = createCircleGroups(globalDataAllArray, cxScale)
    // Create Circles (All)
    const circleShapesAll = createCircleShapesAll(circleGroups, rScale)

    // Create Circles (Previous)
    const circleShapesPrevious = createCircleShapesPrevious(circleGroups, globalDataPreviousArray, rScale)
    
    // Create Titles
    const circleTitles = createTitles(circleGroups, globalDataAllArray, rScale)

    // Create Value Labels
    const circleLabels = createValueLabels(circleGroups, rScale)

    // Create New Cases Breakdown
    createAllCirclesNewsCasesBreakdown(allVars, globalDataPreviousArray, globalDataAllArray, rScales)


    // Bind Animations
    bindAnimations(globalDataPreviousArray, globalDataAllArray, breakdownDataPrevious, breakdownDataAll, rScale, rScales, otherBreakdownPreviousData, otherBreakdownAllData)

})
d3.json(dataPath).then(function(data){
    

    // Compute Additional Daily Numbers
    data = getAdditionalAgeBrackets(data, newAgeBracketsDict, allVars)
    data = getDailySexData(data, allVars, ageBrackets)
    

    console.log(data);

    // Get Global Data
    const globalData = getGlobalData(data, globalVarsDict)
    const globalDataAllArray = allVars.map(d=>globalData[d])
    const globalDataPreviousArray = allVars.map(d=> d + '_anterior').map(d=>globalData[d])
    
    console.log(globalData)

    // Get Breakdown Data
    breakdownData = getBreakdownData(globalData, breakdownCategories, allVars, ageBrackets, regions)
    const breakdownDataAll = breakdownData[0]
    const breakdownDataPrevious = breakdownData[1]

    console.log(breakdownDataAll)
    console.log(breakdownDataPrevious)
    
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

    // Create New Cases Animation
    bindAnimations(globalDataAllArray, globalDataPreviousArray, rScale, rScales, breakdownDataAll, breakdownDataPrevious, breakdownColorsDict)

    // Create Breakdown Animation
    //createBreakdownAnimations(breakdownCategories, allVars, breakdownDataAll, breakdownDataPrevious, breakdownColorsDict, rScale)
})
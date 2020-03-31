//d3.json(dataPath).then(function(data){
$.ajax({
    url: "https://raw.githubusercontent.com/dssg-pt/covid19pt-data/master/data.csv",
    dataType: "text",
    type: "GET",
    error: function (jqXHR, textStatus, errorThrown) {
        $().toastmessage("showErrorToast",
            "AJAX call failed: " + textStatus + " " + errorThrown);
    },
    success: function (csv) {
        const rawData = csvToJson(csv)

        let data = parseData(rawData, dataStrFields)

        // Add Last Update to Footer
        getLastUpdate()

        // Get Age and Region Dicts 
        const regionsDict = getRegionsDictPerVariable(regions, allVars)
        const ageBracketsDict = getAgeBracketsDictPerVariable(ageBrackets, allVars)

        // Compute Additional Daily Numbers
        data = getAdditionalAgeBrackets(data, newAgeBracketsDict, allVars)
        data = getDailySexData(data, allVars, ageBrackets)
        data = mergeSexAgeDailyBrackets(data, ageBrackets, newAgeBracketsDict)
        const smallCategoryValuesDict = getSmallCategoryValuesDict(data.slice(-1)[0], regions, smallValuesFracThresh)
        data = computeOtherCategory(data, 'region', smallCategoryValuesDict)
        data = getFormattedData(data)
        data = getDailyNewCases(data)

    

        // Get Global Data
        const globalData = getGlobalData(data, globalVarsDict, smallCategoryValuesDict, ageBracketsDict, regionsDict)
        const globalDataAllArray = allVars.map(d => globalData[d])
        const globalDataPreviousArray = allVars.map(d => d + '_anterior').map(d => globalData[d])



        // Get Breakdown Data
        breakdownData = getBreakdownData(globalData, breakdownCategories, allVars, ageBracketsDict, regionsDict, smallCategoryValuesDict)
        let breakdownDataAll = breakdownData[0]
        let breakdownDataPrevious = breakdownData[1]

        // Get Other Breakdown Data
        breakdownData = getOtherBreakdownData(globalData, smallCategoryValuesDict)
        const otherBreakdownPreviousData = breakdownData[0]
        const otherBreakdownAllData = breakdownData[1]

        // Fix Unavailable Data
        const fixedBreakdownDataAll = fixUnavailableBreakdownData(breakdownDataPrevious, breakdownDataAll, globalDataPreviousArray, globalDataAllArray, unavailableDict)
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

        // Get Configuration Dicts
        const configKeysDict = createConfigKeysDict(smallCategoryValuesDict, ageBracketsDict, regionsDict)
        const configColorsDict = createConfigColorsDict()
        const configUnavailableDict = createConfigUnavailableDict()
        const configScalesDict = createConfigScalesDict()
        const configLabelsDict = createConfigLabelsDict(configKeysDict)
        const configShortLabelsDict = createConfigShortLabelsDict(configKeysDict)

        // Create Circles Labels
        const circlsLabelsXFracDict = createCirclesLabelsFracDict(allVars, circleLabelsXFracArray)


        // Create Line Plot
        updateScaleSwitch(configScalesDict[currentConfig])
        updateNewCasesFilterButton(newCasesFilterFlag)
        createLinePlot(data,
            configKeysDict[currentConfig],
            configColorsDict[currentConfig],
            configUnavailableDict[currentConfig],
            configShortLabelsDict[currentConfig])

        // Bind Animations
        bindAnimations(globalDataPreviousArray, globalDataAllArray, breakdownDataPrevious, breakdownDataAll,
            rScale, rScales, cxScale, otherBreakdownPreviousData, otherBreakdownAllData,
            data, configKeysDict, configColorsDict, configUnavailableDict, configScalesDict, configLabelsDict, configShortLabelsDict, circlsLabelsXFracDict)

    }
})





//})
d3.json(dataPath).then(function(data){
    console.log(data);

    // Initial Plot ///////

    // Compute Additional Daily Numbers
    data = getDailySexData(data, allVars, ageBrackets)

    // Get Global Numbers
    const globalData = getGlobalData(data, globalVarsDict)
    const globalDataAllArray = allVars.map(d=>globalData[d])
    const globalDataPreviousArray = allVars.map(d=> d + '_anterior').map(d=>globalData[d])

    // Get BreakDown Data
    const sexDataAllArray = allVars.map(d=>[globalData[d + '_f'], globalData[d + '_m']])
    const sexDataPreviousArray = allVars.map(d=>[globalData[d + '_f_anterior'], globalData[d + '_m_anterior']])
    
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
    bindAnimations(globalDataAllArray, globalDataPreviousArray, rScale, rScales)

    $('body').append('<h1>' +mobileFlag +'</h1>')

    // // Break by M/F
    // const pie = d3.pie()
    // pieColors = [sexColorsDict['m'], sexColorsDict['f']]

    // const arc = d3.arc()
    //     .innerRadius(0)
    //     .outerRadius(rScales(globalDataAllArray[0]))

    // console.log(pie(sexDataAllArray[0]))

    // const arcs = circleGroups
    //     .filter((_,i)=>i==0)
    //     .selectAll('g.circle-arc.sex')
    //     .data(pie(sexDataAllArray[0]))
    //     .enter()
    //     .append('g')
    //     .classed('circle-arc', true)
    //     .classed('sex', true)

 
    // arcs.append('path')
    //     .attr('fill', (_,i)=>pieColors[i])
    //     .attr('d',arc)



    
})
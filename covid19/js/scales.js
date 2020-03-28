function getLinearScale(array, rangeMin, rangeMax){

    const scale = d3.scaleLinear()
        .domain([0, array.length - 1 ])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale
}

function getRadiusScale(rangeMin, rangeMax, ...arrays){

    let concatArrays = []
    arrays.forEach(d=>concatArrays=concatArrays.concat(d))

    arraysMin = d3.min(concatArrays)
    arraysMax = d3.max(concatArrays)

    const scale = d3.scaleSqrt()
        .domain([0, arraysMax])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale

}

function createScales(globalDataAllArray, globalDataPreviousArray){

    const cxScale = getLinearScale(allVars, 
        Math.round(globalChartWidth*globalChartWidthFracPad), 
        Math.round(globalChartWidth-globalChartWidth*globalChartWidthFracPad))

    const rScale = getRadiusScale(minRadiusWidthFrac*globalChartWidth, maxRadiusWidthFrac*globalChartWidth, globalDataAllArray, globalDataPreviousArray)

    rScales = {}
    allVars.forEach(function(d, i){
        rScales[d] = getRadiusScale(0, 
            maxRadiusWidthFrac*globalChartWidth, 
            globalDataAllArray[i], globalDataPreviousArray[i])
    })

    return [cxScale, rScale, rScales]

}

function getTimeScale(rangeMin, rangeMax, ...arrays){

    let concatArrays = []
    arrays.forEach(d=>concatArrays=concatArrays.concat(d))

    concatArrays = concatArrays.map(d=>timeParse(d))
    arraysMin = d3.min(concatArrays)
    arraysMax = d3.max(concatArrays)

    const scale = d3.scaleTime()
        .domain([arraysMin, arraysMax])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale

}

function getTimeChartLinearScale(rangeMin, rangeMax, ...arrays){

    let concatArrays = []
    arrays.forEach(d=>concatArrays=concatArrays.concat(d))

    

    arraysMax = d3.max(concatArrays)

    const scale = d3.scaleLinear()
        .domain([0, arraysMax])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale

}

function getTimeChartLogScale(rangeMin, rangeMax, ...arrays){

    let concatArrays = []
    arrays.forEach(d=>concatArrays=concatArrays.concat(d))

    arraysMax = d3.max(concatArrays)

    const scale = d3.scaleLog()
        .domain([1, arraysMax])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale

}

function getTimeChartYScale(linearScaleFlag, rangeMin, rangeMax, ...arrays){
    if (linearScaleFlag){
        return getTimeChartLinearScale(rangeMin, rangeMax, ...arrays)
    } else{
        return getTimeChartLogScale(rangeMin, rangeMax, ...arrays)
    }
}

function createCircleLabelsYScale(labels, supFrac, infFrac, step){
    
    const maxLabels = 8
    const nlabels = labels.length
    const padFrac = ( (maxLabels - nlabels)*step)

    const scale = d3.scalePoint()
        .domain(labels)
        .range([globalChartHeight* (supFrac + padFrac), globalChartHeight - globalChartHeight * (infFrac + padFrac)])

    return scale

}
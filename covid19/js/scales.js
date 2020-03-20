function getLinearScale(array, rangeMin, rangeMax){

    const scale = d3.scaleLinear()
        .domain([0, array.length - 1 ])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale
}

function getRadiusScale(rangeMin, rangeMax, ...arrays){

    let concatArrays = []
    arrays.length == 1? concatArrays = arrays : arrays.forEach(d=>concatArrays=concatArrays.concat(d))

    arraysMin = d3.min(concatArrays)
    arraysMax = d3.max(concatArrays)

    console.log(arraysMin)
    console.log(arraysMax)

    const scale = d3.scaleSqrt()
        .domain([0, arraysMax])
        .range([rangeMin, rangeMax])
        .clamp(true)

    return scale

}

function createScales(globalDataAllArray, globalDataPreviousArray){

    const cxScale = getLinearScale(allVars, 
        Math.round(chartWidth*chartWidthFracPad), 
        Math.round(chartWidth-chartWidth*chartWidthFracPad))

    const rScale = getRadiusScale(0, maxRadiusWidthFrac*chartWidth, globalDataAllArray, globalDataPreviousArray)

    rScales = {}
    allVars.forEach(function(d, i){
        rScales[d] = getRadiusScale(0, 
            maxRadiusWidthFrac*chartWidth, 
            globalDataAllArray[i], globalDataPreviousArray[i])
    })

    return [cxScale, rScale, rScales]

}

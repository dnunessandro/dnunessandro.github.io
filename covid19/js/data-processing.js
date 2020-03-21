function getGlobalData(data, globalVarsDict){
    let globalData = {}
    const lastDayData = data.slice(-1)[0]
    const secondLastDayData = data.slice(-2)[0]

    globalData['confirmados'] = lastDayData[globalVarsDict['confirmados']]
    globalData['recuperados'] = lastDayData[globalVarsDict['recuperados']]
    globalData['obitos'] = lastDayData[globalVarsDict['obitos']]
    globalData['confirmados_novos'] = lastDayData[globalVarsDict['confirmados_novos']]
    globalData['recuperados_novos'] = lastDayData[globalVarsDict['recuperados']] - secondLastDayData[globalVarsDict['recuperados']]
    globalData['obitos_novos'] = lastDayData[globalVarsDict['obitos']] - secondLastDayData[globalVarsDict['obitos']]
    globalData['confirmados_anterior'] = secondLastDayData[globalVarsDict['confirmados']]
    globalData['recuperados_anterior'] = secondLastDayData[globalVarsDict['recuperados']]
    globalData['obitos_anterior'] = secondLastDayData[globalVarsDict['obitos']]
    globalData = getGlobalSexData(globalData, lastDayData, secondLastDayData, allVars)
    globalData = getGlobalAgeData(globalData, lastDayData, secondLastDayData, allVars, ageBrackets)
    globalData = getGlobalRegionData(globalData, lastDayData, secondLastDayData, allVars, regions)
    return globalData
}

function getDailySexData(data, allVars, ageBrackets){

    allVars.forEach(function(v){

        data.forEach(function(d, i){
            
            let ageBreakDownArray = ageBrackets.map(a=>d[v + '_' + a + '_m'])
            data[i][v + '_m'] = sumArray(ageBreakDownArray)
            ageBreakDownArray = ageBrackets.map(a=>d[v + '_' + a + '_f'])
            data[i][v + '_f'] = sumArray(ageBreakDownArray)
        })
        
    })

    return data
    
}

function getAdditionalAgeBrackets(data, newAgeBracketsDict, allVars){
    Object.keys(newAgeBracketsDict).forEach(function(k){
        data.forEach(function(d, i){
            allVars.forEach(function(a){
                data[i][ a + '_' + k + '_m'] = sumArray(newAgeBracketsDict[k].map(b => data[i][ a + '_' + b + '_m']))
                data[i][ a + '_' + k + '_f'] = sumArray(newAgeBracketsDict[k].map(b => data[i][ a + '_' + b + '_f']))
            })
        })
    })
    return data
}

function getGlobalSexData(globalData, lastDayData, secondLastDayData, allVars){

    allVars.forEach(function(d){

        globalData[d + '_m'] = lastDayData[d + '_m']
        globalData[d + '_f'] = lastDayData[d + '_f']

        globalData[d + '_m_anterior'] = secondLastDayData[d + '_m']
        globalData[d + '_f_anterior'] = secondLastDayData[d + '_f']

    })

    return globalData

}

function getGlobalAgeData(globalData, lastDayData, secondLastDayData, allVars, ageBrackets){

    allVars.forEach(function(v){
        ageBrackets.forEach(function(b){
            globalData[v + '_' + b] = lastDayData[v + '_' + b + '_m'] + lastDayData[v + '_' + b + '_f']
            globalData[v + '_' + b + '_anterior'] = secondLastDayData[v + '_' + b + '_m'] + secondLastDayData[v + '_' + b + '_f']
        })
    })

    return globalData
    
}

function getGlobalRegionData(globalData, lastDayData, secondLastDayData, allVars, regions){

    allVars.forEach(function(v){
        regions.forEach(function(b){
            globalData[v + '_' + b] = lastDayData[v + '_' + b]
            globalData[v + '_' + b + '_anterior'] = secondLastDayData[v + '_' + b]
        })
    })

    return globalData
    
}

function getSexNumbers(globalData, allVars){    

    return allVars.map(d=>[globalData[d + '_f'], globalData[d + '_m']])

}

function getBreakdownData(globalData, breakdownCategories, allVars, ageBrackets, regions){

    let breakdownDataAll = []
    let breakdownDataPrevious = []

    breakdownCategories.forEach(function(c){
        categoryBreakDownData = getBreakdownDataArrays(globalData, c, allVars, ageBrackets, regions)
        categoryBreakDownDataAll = categoryBreakDownData[0]
        categoryBreakDownDataPrevious = categoryBreakDownData[1]
        breakdownDataAll.push(categoryBreakDownDataAll)
        breakdownDataPrevious.push(categoryBreakDownDataPrevious)
    })
    return [breakdownDataAll, breakdownDataPrevious]
}

function getBreakdownDataArrays(globalData, category, allVars, ageBrackets, regions){

    if(category == 'sex'){
        const dataAllArray = allVars.map(d=>[globalData[d + '_f'], globalData[d + '_m']])
        const dataPreviousArray = allVars.map(d=>[globalData[d + '_f_anterior'], globalData[d + '_m_anterior']])
        return [dataAllArray, dataPreviousArray]
    }else if(category == 'age'){
        const dataAllArray = allVars.map(v=>ageBrackets.map(b=>globalData[v + '_' + b]))
        const dataPreviousArray = allVars.map(v=>ageBrackets.map(b=>globalData[v + '_' + b + '_anterior']))
        return [dataAllArray, dataPreviousArray]
    }else if(category == 'region'){
        const dataAllArray = allVars.map(v=>regions.map(b=>globalData[v + '_' + b]))
        const dataPreviousArray = allVars.map(v=>regions.map(b=>globalData[v + '_' + b + '_anterior']))
        return [dataAllArray, dataPreviousArray]
    }

}

function computeNew(lastDayData, secondLastDayData, key){
    return lastDayData[key] - secondLastDayData[key]
}

function sumArray(dataArray){
    return dataArray.reduce((a,b)=>numOr0(a)+numOr0(b))
}

function numOr0(n){
    return isNaN(n) ? 0 : n
}

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
    globalData = getGlobalSexData(globalData, lastDayData, secondLastDayData, allVars, globalVarsDict)
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

function getGlobalSexData(globalData, lastDayData, secondLastDayData, allVars, globalVarsDict){

    allVars.forEach(function(d){

        globalData[d + '_m'] = lastDayData[globalVarsDict[d + '_m']]
        globalData[d + '_f'] = lastDayData[globalVarsDict[d + '_f']]

        globalData[d + '_m_anterior'] = secondLastDayData[globalVarsDict[d + '_m']]
        globalData[d + '_f_anterior'] = secondLastDayData[globalVarsDict[d + '_f']]

    })

    return globalData

}

function getSexNumbers(globalData, allVars){    

    return allVars.map(d=>[globalData[d + '_f'], globalData[d + '_m']])

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

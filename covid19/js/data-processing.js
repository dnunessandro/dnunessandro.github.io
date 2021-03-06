function getRegionsDictPerVariable(regions, allVars){
    let regionsDict = {}
    allVars.forEach(v=>regionsDict[v] = regions.slice())

    return regionsDict
}

function getAgeBracketsDictPerVariable(ageBrackets, allVars){
    let ageBracketsDict = {}
    allVars.forEach(v=>ageBracketsDict[v] = ageBrackets.slice())

    return ageBracketsDict
}

function getGlobalData(data, globalVarsDict, smallCategoryValuesDict, ageBracketsDict, regionsDict){
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
    globalData = getGlobalAgeData(globalData, lastDayData, secondLastDayData, allVars, ageBracketsDict)
    globalData = getGlobalRegionData(globalData, lastDayData, secondLastDayData, allVars, regionsDict, smallCategoryValuesDict)
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

function getDailyNewCases(data){

    for (let i = 1; i < data.length; i++) {
        const dataElement = data[i];

        const elementKeys = Object.keys(dataElement)

        elementKeys.forEach(function(k){
            data[i][k + '_novos'] = data[i][k] - data[i-1][k]
        })
        
    }
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

function mergeSexAgeDailyBrackets(data, ageBrackets, newAgeBracketsDict){
    
    const newAgeBrackets = getNewAgeBrackets(ageBrackets, newAgeBracketsDict)
    data.forEach(function(d,i){
        allVars.forEach(function(v){
            newAgeBrackets.forEach(function(b){
                data[i][ v + '_' + b] = data[i][ v + '_' + b + '_m'] + data[i][ v + '_' + b + '_f']
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

function getGlobalAgeData(globalData, lastDayData, secondLastDayData, allVars, ageBracketsDict){

    allVars.forEach(function(v){
        ageBrackets.forEach(function(b){
            globalData[v + '_' + b] = lastDayData[v + '_' + b + '_f'] + lastDayData[v + '_' + b + '_m']
            globalData[v + '_' + b + '_anterior'] = secondLastDayData[v + '_' + b + '_f'] + secondLastDayData[v + '_' + b + '_m'] 
            globalData[v + '_' + b]==0 ? ageBracketsDict[v].splice(ageBracketsDict[v].indexOf(b), 1) : undefined
        })
    })

    return globalData
    
}

function getGlobalRegionData(globalData, lastDayData, secondLastDayData, allVars, regionsDict, smallCategoryValuesDict){

    allVars.forEach(function(v){
        
        let regionsCopy = [...regions]
        if (smallCategoryValuesDict[v].length > 1){
            regionsCopy.push('region_other')
        }

        regionsCopy.forEach(function(b){
            globalData[v + '_' + b] = lastDayData[v + '_' + b]
            globalData[v + '_' + b]==0 ? regionsDict[v].splice(regionsDict[v].indexOf(b), 1) : undefined
            globalData[v + '_' + b + '_anterior'] = secondLastDayData[v + '_' + b]
        })
    })

    return globalData
    
}

function updateSmallCategoryValues(category, variable, categories, smallCategoryValuesDict){
    if (smallCategoryValuesDict[variable].length>1){
        return removeSmallCategoryValues(categories, smallCategoryValuesDict[variable], category, variable)
    }else{
        return categories
    }
}

function removeSmallCategoryValues(categories, categoriesToRemove, category, variable){

    let categoriesCopy = [...categories]
    categoriesToRemove.forEach(function(c){
        let index = categoriesCopy.indexOf(c)
        categoriesCopy.splice(index, 1)
    })

    categoriesCopy.push(category + '_other')
    return categoriesCopy
}

function getSmallCategoryValuesDict(lastDayData, categoryValues, smallValuesFracTresh){

    let smallCategoryValuesDict = {}

    allVars.forEach(function(v){

        smallCategoryValuesDict[v] = []

        let varTotal = lastDayData[v]

        categoryValues.forEach(function(c){

            (lastDayData[v + '_' + c] < smallValuesFracTresh * varTotal && lastDayData[v + '_' + c]!= 0) ? smallCategoryValuesDict[v].push(c) : undefined
   
        })


        smallCategoryValuesDict[v].length == 1 ? smallCategoryValuesDict[v] = [] : undefined

    })
    return smallCategoryValuesDict

}

function computeOtherCategory(data, category, smallCategoryValuesDict){

    data.forEach(function(d, i){
        allVars.forEach(function(v){
            if (smallCategoryValuesDict[v].length > 1){
                data[i][v + '_' + category + '_other'] = sumArray(smallCategoryValuesDict[v].map(s=>data[i][v + '_' + s]))
            }
        })

    })

    return data

}

function getSexNumbers(globalData, allVars){    

    return allVars.map(d=>[globalData[d + '_f'], globalData[d + '_m']])

}

function getBreakdownData(globalData, breakdownCategories, allVars, ageBracketsDict, regionsDict, smallCategoryValuesDict){

    let breakdownDataAll = []
    let breakdownDataPrevious = []

    breakdownCategories.forEach(function(c){
        categoryBreakDownData = getBreakdownDataArrays(globalData, c, allVars, ageBracketsDict, regionsDict, smallCategoryValuesDict)
        categoryBreakDownDataAll = categoryBreakDownData[0]
        categoryBreakDownDataPrevious = categoryBreakDownData[1]
        breakdownDataAll.push(categoryBreakDownDataAll)
        breakdownDataPrevious.push(categoryBreakDownDataPrevious)
    })
    return [breakdownDataAll, breakdownDataPrevious]
}

function getBreakdownDataArrays(globalData, category, allVars, ageBracketsDict, regionsDict, smallCategoryValuesDict){

    if(category == 'sex'){
        const dataAllArray = allVars.map(d=>[globalData[d + '_m'],globalData[d + '_f']])
        const dataPreviousArray = allVars.map(d=>[ globalData[d + '_m_anterior'], globalData[d + '_f_anterior']])
        return [dataAllArray, dataPreviousArray]
    }else if(category == 'age'){
        const dataAllArray = allVars.map(v=>ageBracketsDict[v].map(b=>globalData[v + '_' + b]))
        const dataPreviousArray = allVars.map(v=>ageBracketsDict[v].map(b=>globalData[v + '_' + b + '_anterior']))
        return [dataAllArray, dataPreviousArray]
    }else if(category == 'region'){
        const dataAllArray = allVars.map(v=>updateSmallCategoryValues('region', v, regionsDict[v], smallCategoryValuesDict).map(b=>globalData[v + '_' + b]))
        const dataPreviousArray = allVars.map(v=>updateSmallCategoryValues('region', v, regionsDict[v], smallCategoryValuesDict).map(b=>globalData[v + '_' + b + '_anterior']))
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

function fixUnavailableBreakdownData(breakdownDataPrevious, breakdownDataAll, globalDataPreviousArray, globalDataAllArray, unavailableDict){

    allVars.forEach(function(v, i){
        if (unavailableDict[v].length != 0){
            breakdownDataPrevious.forEach(function(_,ci){
                breakdownDataPrevious[ci][i] = unavailableDict[v].map(o=>Math.round(o*globalDataPreviousArray[i]))
                breakdownDataAll[ci][i] = [...unavailableDict[v]].reverse().map(o=>Math.round(o*globalDataAllArray[i]))
            })
        }
    })
    return [breakdownDataPrevious, breakdownDataAll]
}

function getOtherBreakdownData(globalData, smallCategoryValuesDict){
    let otherBreakdownAllData = []
    let otherBreakdownPreviousData = []
    allVars.forEach(function(v){
        let breakdownData = getOtherBreakdownArrays(globalData, v, smallCategoryValuesDict[v])
        otherBreakdownPreviousData.push(breakdownData[0])
        otherBreakdownAllData.push(breakdownData[1])
    })

    return [otherBreakdownPreviousData, otherBreakdownAllData]
}

function getOtherBreakdownArrays(globalData, variable, categories){

    let breakdownDataPreviousArray = []
    let breakdownDataAllArray = []

    categories.forEach(function(c){
        breakdownDataPreviousArray.push(globalData[variable + '_' + c + '_anterior'])
        breakdownDataAllArray.push(globalData[variable + '_' + c])
    })

    return [breakdownDataPreviousArray, breakdownDataAllArray]

}

function getFormattedData(data){
    data.forEach(function(d,i){
        data[i]['formattedData'] = timeFormat(timeParse(d['data']))
    })
    return data
}

function getDataByKeys(data, dataKeys){

    let dataArrays = []
    dataKeys.forEach(function(k, i){
        let dataArray = data.map(d=>d[k])
        newCasesFilterFlag ? dataArray.shift() : dataArray
        dataArrays.push(dataArray)
    })
    return dataArrays

}

function getFirstNonZeroDataDay(dataArrays){
    let firstNonZeroIndexArray = []
    dataArrays.forEach(a=>firstNonZeroIndexArray.push(findFirstNonZeroElementInArray(a)))
    return Math.max(Math.min(...firstNonZeroIndexArray)-1,0)
}

function findFirstNonZeroElementInArray(a){
    let result = 0;
    for (let index = 0; index < a.length; index++) {
        if(a[index]!=0){
            result = index
            break;
        }
    }
    
    return result == 0 ? a.length : result
}

// function translateMonth(date){
//     Object.keys(monthTranslationDict).forEach(function(m){
//         if (date.includes(m)){
//             const translatedDate = date.replace(m, monthTranslationDict[m])
//             return translatedDate
//         } else {
//             return date
//         }
//     })
// }

function createConfigKeysDict(smallCategoryValuesDict, ageBracketsDict, regionsDict){

    let configKeysDict = {}

    // Add Global Keys
    configKeysDict['global'] = allVars

    // Add New Cases Breakdwon Keys
    allVars.forEach(a=>configKeysDict[a]=[a])

    // Add Sex Breakdwon Keys
    allVars.forEach(a=>configKeysDict[a + '_sex']=[a+'_m', a+'_f'])

    // Add Age Breakdwon Keys
    allVars.forEach(a=>configKeysDict[a + '_age']= getNewAgeBrackets(ageBracketsDict[a], newAgeBracketsDict).map(b=>a + '_' + b))

    // Add Region Breakdown Keys
    allVars.forEach(a=>configKeysDict[a + '_region'] = 
    updateSmallCategoryValues('region', a, regionsDict[a], smallCategoryValuesDict).map(r=>a + '_' + r))

    // Add Other Breakdown Keys
    allVars.forEach(a=>configKeysDict[a + '_other'] = smallCategoryValuesDict[a].map(c=>a + '_' + c))
    
    return configKeysDict

}


function getNewAgeBrackets(ageBrackets, newAgeBracketsDict){

    let newAgeBrackets = []
    let oldKeys = []
    const newAgeBracketsDictKeys = Object.keys(newAgeBracketsDict)
    newAgeBracketsDictKeys.forEach(k=>newAgeBracketsDict[k].forEach(v=>oldKeys.push(v)))
    
    ageBrackets.forEach(function(b){
        oldKeys.includes(b) ? undefined : newAgeBrackets.push(b)
    })
    return newAgeBrackets
}

function createConfigColorsDict(configKeysDict){

    let configColorsDict = {}

    // Add Global Breakdown Colors
    configColorsDict['global'] = allVars.map(a=>varsColorsDict[a])

    // Add New Cases Breakdwon Colors
    allVars.forEach(a=>configColorsDict[a]=[varsColorsDict[a], varsColorsDict[a+'_novos']])

    // Add Sex Breakdwon Colors
    allVars.forEach(a=>configColorsDict[a + '_sex'] = breakdownColorsDict['sex'])
    
    // Add Age Breakdwon Colors
    allVars.forEach(a=>configColorsDict[a + '_age'] = getIndexesOfElements(configKeysDict[a + '_age'].map(d=>d.replace(a + '_', '')), 
        getNewAgeBrackets(ageBrackets, newAgeBracketsDict))
        .map(i=>breakdownColorsDict['age'][i]))

    // Add Region Breakdown Colors
    let regionsMod = regions.slice()
    regionsMod.push('region_other')

    allVars.forEach(a=>configColorsDict[a + '_region'] = getIndexesOfElements(configKeysDict[a + '_region']
        .map(d=>d.replace(a + '_', '')), regionsMod)
        .map(i=>breakdownColorsDict['region'][i]))
    
    // Add Other Breakdown Keys
    allVars.forEach(a=>configColorsDict[a + '_other'] = getIndexesOfElements(configKeysDict[a + '_other']
        .map(d=>d.replace(a + '_', '')), regionsMod)
        .map(i=>smallValuesColors[i]))
        
    return configColorsDict
}

function getIndexesOfElements(shortList, completeList){

    return shortList.map(e=>completeList.indexOf(e))

}



function createConfigUnavailableDict(){

    let configUnavailableDict = {}

    // Add Global Breakdown Colors
    configUnavailableDict['global'] = false

    // Add New Cases Breakdwon Colors
    allVars.forEach(a=>configUnavailableDict[a]=false)

    // Add Sex Breakdwon Colors
    allVars.forEach(a=>configUnavailableDict[a + '_sex'] = unavailableVarsDict.includes(a) ? true : false)

    // Add Age Breakdwon Colors
    allVars.forEach(a=>configUnavailableDict[a + '_age']= unavailableVarsDict.includes(a) ? true : false)

    // Add Region Breakdown Colors
    allVars.forEach(a=>configUnavailableDict[a + '_region'] = unavailableVarsDict.includes(a) ? true : false)
    +
    // Add Other Breakdown Keys
    allVars.forEach(a=>configUnavailableDict[a + '_other'] = unavailableVarsDict.includes(a) ? true : false)
    
    return configUnavailableDict

}

function createConfigScalesDict(){

    let configScalesDict = {}

    // Add Global Breakdown Colors
    configScalesDict['global'] = false

    // Add New Cases Breakdwon Colors
    allVars.forEach(a=>configScalesDict[a]=true)

    // Add Sex Breakdwon Colors
    allVars.forEach(a=>configScalesDict[a + '_sex'] = true)

    // Add Age Breakdwon Colors
    allVars.forEach(a=>configScalesDict[a + '_age'] = true)

    // Add Region Breakdown Colors
    allVars.forEach(a=>configScalesDict[a + '_region'] = true)

    // Add Other Breakdown Keys
    allVars.forEach(a=>configScalesDict[a + '_other'] = true)
    
    return configScalesDict

}

function createConfigLabelsDict(configKeysDict){

    let configLabelsDict = {}

    // Add Global Labels
    configLabelsDict['global'] = configKeysDict['global'].map(k=>labelsDict[k])

    // Add New Cases Breakdwon Labels
    allVars.forEach(a=>configLabelsDict[a]=['Casos Anteriores', 'Novos Casos'])

    // Add Sex Breakdwon Colors
    allVars.forEach(a=>configLabelsDict[a + '_sex'] = 
        configKeysDict[a + '_sex'].map( k=>labelsDict[k.replace(a + '_', '')] ))

    // Add Age Breakdwon Colors
    allVars.forEach(a=>configLabelsDict[a + '_age'] = 
        configKeysDict[a + '_age'].map(k=>labelsDict[k.replace(a + '_', '')]))

    // Add Region Breakdown Colors
    allVars.forEach(a=>configLabelsDict[a + '_region'] = 
        configKeysDict[a + '_region'].map(k=>labelsDict[k.replace(a + '_', '')]))

    // Add Other Breakdown Keys
    allVars.forEach(a=>configLabelsDict[a + '_other'] = 
        configKeysDict[a + '_other'].map(k=>labelsDict[k.replace(a + '_', '')]))

    return configLabelsDict

}

function createConfigShortLabelsDict(configKeysDict){

    let configLabelsDict = {}

    // Add Global Labels
    configLabelsDict['global'] = configKeysDict['global'].map(k=>shortLabelsDict[k])

    // Add New Cases Breakdwon Labels
    allVars.forEach(a=>configLabelsDict[a]=['Casos Anteriores', 'Novos Casos'])

    // Add Sex Breakdwon Colors
    allVars.forEach(a=>configLabelsDict[a + '_sex'] = 
        configKeysDict[a + '_sex'].map( k=>shortLabelsDict[k.replace(a + '_', '')] ))

    // Add Age Breakdwon Colors
    allVars.forEach(a=>configLabelsDict[a + '_age'] = 
        configKeysDict[a + '_age'].map(k=>shortLabelsDict[k.replace(a + '_', '')]))

    // Add Region Breakdown Colors
    allVars.forEach(a=>configLabelsDict[a + '_region'] = 
        configKeysDict[a + '_region'].map(k=>shortLabelsDict[k.replace(a + '_', '')]))

    // Add Other Breakdown Keys
    allVars.forEach(a=>configLabelsDict[a + '_other'] = 
        configKeysDict[a + '_other'].map(k=>shortLabelsDict[k.replace(a + '_', '')]))

    return configLabelsDict

}

function getDummyUnavailableDailyData(data){

    let dummyUnavailableDailyData = {}
    
    dummyUnavailableDailyData['dates'] = data.map(d=>d['data'])
    let dummyArray = [...Array(dummyUnavailableDailyData['dates'].length)]
    dummyUnavailableDailyData['dummyArray1'] = 
        dummyArray.map(d3.randomExponential(0.01)).sort((a,b)=>a-b)
    dummyUnavailableDailyData['dummyArray2'] = 
    dummyArray.map(d3.randomExponential(0.01)).sort((a,b)=>a-b)
    
    
    return dummyUnavailableDailyData
}

function getIncreasingRandomArrayOfSizeN(n, seedStart, multFactor){
    let randomArray = []
    let seed = seedStart
    let dummyArray = [...Array(n)]
    dummyArray.forEach((v,i)=>randomArray.push(((i+1)+random(seed)*5)*multFactor), seed++)
    return randomArray
}

function random(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function createCirclesLabelsFracDict(allVars, xFracArray){

    let pieLabelsFracDict = {}

    allVars.forEach((v,i)=>pieLabelsFracDict[v] = xFracArray[i])

    pieLabelsFracDict['other'] = xFracArray.slice(-1)[0]

    return pieLabelsFracDict

}

function getLastUpdate(){

    $.ajax({
        url: "https://raw.githubusercontent.com/dssg-pt/covid19pt-data/master/README.md",
        dataType: "text",
        type: "GET",
        error: function(jqXHR, textStatus, errorThrown) {
            $().toastmessage("showErrorToast",
                "AJAX call failed: "+textStatus+" "+errorThrown);
        },
        success: function( data ) {
    
            const lastUpdate = data.substring(data.lastIndexOf('actualização**: ')+16,data.lastIndexOf('ℹ️')-2).trim()
            
            writeLastUpdateToFooter(lastUpdate)
        }
    })

}

function writeLastUpdateToFooter(lastUpdateStr){

    $('#footer > p').append(lastUpdateStr + '.')
}

function csvToJson( csv ) {
    
    var lines=csv.split("\n");

    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
  
    //return result; //JavaScript object
    return result //JSON
}

    
function parseData(data, strFields){
    let parsedData = [];

    data.forEach(function(d,i){
        let entry = {};
        let entryKeys = Object.keys(d)

        entryKeys.forEach(function(k){
            if (strFields.includes(k)){
                entry[k] = d[k]
            }else{
                entry[k] = parseInt(d[k]) || 0
            }
         
        })

        parsedData.push(entry)
    })

    parsedData.splice(-1,1)

    return parsedData
}
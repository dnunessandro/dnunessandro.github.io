// Data Path
const dataPath = 'data/data.json'

// Variables Dicts
const allVars = ['confirmados', 'recuperados', 'obitos']
const breakdownCategories = ['sex', 'age', 'region']
const ageBrackets = ['0_19', '20_29', '30_39', '40_49', '50_59', '60_69', '70_plus']
const newAgeBracketsDict = {
    '0_19': ['0_9', '10_19'],
    '70_plus': ['70_79', '80_plus'] 
}
const regions = ['arsnorte', 'arscentro', 'arslvt', 'arsalentejo', 'arsalgarve', 'acores', 'madeira', 'estrangeiro']

const globalVarsDict = {
    'confirmados': 'confirmados',
    'recuperados': 'recuperados',
    'obitos': 'obitos',
    'confirmados_novos':  'confirmados_novos',
    'confirmados_m': 'confirmados_m',
    'confirmados_f': 'confirmados_f',
    'recuperados_m': 'recuperados_m',
    'recuperados_f': 'recuperados_f',
    'obitos_m': 'obitos_m',
    'obitos_f': 'obitos_f'
}

// Text Variables
const varsTitlesDict = {
    'confirmados': 'Confirmados',
    'recuperados': 'Recuperados',
    'obitos': 'Óbitos'
}

// Colors
const varsColorsDict = {
    'confirmados': '#d7b354',
    'recuperados': '#6ab96b',
    'obitos': '#f97b7c',
    'confirmados_novos': '#f6ce6e',
    'recuperados_novos': '#86d182',
    'obitos_novos': '#ff9c9c'
}

const sexColorsDict = {
    'm': '#6b96be',
    'f': '#96c3e3',
    'm_anterior': '#5f9f9a',
    'f_anterior': '#7cb3ad'
}

const breakdownColorsDict = {
    'sex': ['#cbd5e8', '#f4cae4'],
    'age': ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
    'region': ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
}

const smallValuesColors = d3.schemePastel1

const boxColor = '#f3f3f3'

// Dimensions Variables
const globalChartWidth = parseInt($(window).width()*0.95)
const globalChartHeight = parseInt($(window).height()*0.5)
const timeChartWidth = parseInt($(window).width()*0.95)
const timeChartHeight = parseInt($(window).height()*0.3)
const globalChartWidthFracPad = 0.2
const timeChartWidthFracPadLeft = 0.1
const timeChartWidthFracPadRight = 0.1
const timeChartHeightFracPadTop = 0
const timeChartHeightFracPadBottom = 0.1
const minRadiusWidthFrac = 0.01
const maxRadiusWidthFrac = 0.17
const minRadiusLabel = 20
const breakdownShapePad = 5
const breakdownShapeRx = 8
const maxRadiusThreshFrac = 0.5
const greyedOutRadiusFrac = 0.05

// Create SVG Elements
const svgGlobal = d3.select('#global-chart')
    .append('svg')
    .attr('width', globalChartWidth)
    .attr('height', globalChartHeight)

const svgTime = d3.select('#time-chart')
    .append('svg')
    .attr('width', timeChartWidth)
    .attr('height', timeChartHeight)

// Create Dummy SVG Rect Element
const dummyRect = svgGlobal
    .append('rect')
    .attr('id', 'callback-rect')
    .attr('width', globalChartWidth)
    .attr('height', globalChartHeight)
    .style('opacity', 0)

// Create Pie Element
const pie = d3.pie().sort(null)

// Mobile Flag
const mobileFlag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// Generate Infinite Breakdown Vector
let breakdownIndexArray = []
for (let index = 0; index < 100; index++) {
    auxArray = [...Array(breakdownCategories.length).keys()]
    auxArray.forEach(d=>breakdownIndexArray.push(d)) 
}
let breakdownIndex = 0
let showbreakDownFlagDict = {
    'confirmados': false,
    'recuperados': false,
    'obitos': false
}

// Dealing with Unavailable Data
const unavailableVarsDict = ['recuperados', 'obitos']
const unavailableDict = {
    'confirmados': [],
    'recuperados': [0.6, 0.4],
    'obitos': [0.6, 0.4]
}
const unavailableColors = ['#AEB5BF', '#D9D9D9']

// Dealing with Small Category Values
const smallValuesFracTresh = 0.02
const smallValuesMinRadiusWidthFrac = 0.01
const smallValuesMaxRadiusWidthFrac = 0.1

// Time Parsing
const timeParse = d3.timeParse('%d/%m/%Y')
const timeFormat = d3.timeFormat('%e %B')
// const monthTranslationDict = {
//     'January': 'Janeiro',
//     'February': 'Fevereiro',
//     'March': 'Março',
//     'April': 'Abril',
//     'May': 'Maio',
//     'June': 'Junho',
//     'July': 'Julho',
//     'August': 'Agosto',
//     'September': 'Setembro',
//     'October': 'Outubro',
//     'November': 'Novembro',
//     'December': 'Dezembro'
// }

// Current Config
let currentConfig = 'global'

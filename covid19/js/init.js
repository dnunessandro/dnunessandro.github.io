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
const chartWidth = parseInt($(window).width()*0.95)
const chartHeight = parseInt($(window).height()*0.8)
const chartWidthFracPad = 0.2
const minRadiusWidthFrac = 0.01
const maxRadiusWidthFrac = 0.17
const minRadiusLabel = 20
const breakdownShapePad = 5
const breakdownShapeRx = 8
const maxRadiusThreshFrac = 0.5
const greyedOutRadiusFrac = 0.05

// Create SVG Element
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight)

// Create Dummy SVG Rect Element
const dummyRect = svg
    .append('rect')
    .attr('id', 'callback-rect')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
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

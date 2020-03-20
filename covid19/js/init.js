// Data Path
const dataPath = 'data/data.json'

// Variables Dicts
const allVars = ['confirmados', 'recuperados', 'obitos']
const ageBrackets = ['0_9', '10_19', '20_29', '30_39', '40_49', '50_59', '60_69', '70_79', '80_plus']

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

const varsColorsDict = {
    'confirmados': '#f6ce6e',
    'recuperados': '#6ab96b',
    'obitos': '#f97b7c',
    'confirmados_novos': '#d7b354',
    'recuperados_novos': '#86d182',
    'obitos_novos': '#ff9c9c'
}

const sexColorsDict = {
    'm': '#6b96be',
    'f': '#96c3e3',
    'm_anterior': '#5f9f9a',
    'f_anterior': '#7cb3ad'
}

const boxColor = '#f3f3f3'

// Dimensions Variables
const chartWidth = parseInt($(window).width()*0.95)
const chartHeight = parseInt($(window).height()*0.8)
const chartWidthFracPad = 0.2
const minRadiusWidthFrac = 0
const maxRadiusWidthFrac = 0.17
const minRadiusLabel = 20
const breakdownShapePad = 5
const breakdownShapeRx = 8
const maxRadiusThreshFrac = 0.5
const greyedOutRadiusFrac = 0.05

// Create SVG Element
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', chartWidth*0.9)
    .attr('height', chartHeight*0.9)

// Create Pie Element
const pie = d3.pie()

// Mobile Flag
const mobileFlag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

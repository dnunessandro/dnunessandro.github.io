const vSpec1 = {
    'width': 'container',
    'height': 'container',
    data: {
        url: './data/challenge_17b_Sandro.json'
    },
    layer: [
        {
            mark: 'text',
            encoding: {
                x: {
                    field: 'snr',
                    type: 'nominal',
                    sort: false,
                    axis:
                    {
                        labelAngle: 0,
                        labelFontSize: 12,
                        tickOpacity: 0,
                        title: 'SNR',
                        titleFontSize: 15,
                        domainOpacity: 0
                    }
                },
            }
        },
        {
            mark: 'circle',
            encoding: {
                x: {
                    field: 'xPos',
                    type: 'quantitative',
                    scale: { domain: [3, 113], nice: false },
                    axis: {
                        gridOpacity: 0,
                        title: null,
                        titleFontSize: 15,
                        tickOpacity: 0,
                        domainOpacity: 0,
                        labels: false
                    }
                },
                y: {
                    field: 'b',
                    type: 'ordinal',
                    axis: {
                        title: 'B-Value',
                        titleFontSize: 15,
                        labelFontSize: 12,
                        tickOpacity: 0,
                        domainOpacity: 0
                    }
                },

                color: {
                    field: 'parameter',
                    legend: {
                        title: 'Parameter',
                        titleFontSize: 15,
                        labelFontSize: 12,
                        orient: 'bottom',
                        direction: 'horizontal'
                    }
                },
                size: {
                    field: 'confidence',
                    type: 'quantitative',
                    title: 'Confidence',
                    legend: {
                        titleFontSize: 15,
                        labelFontSize: 12,
                        orient: 'bottom',
                        direction: 'horizontal',
                    },
                    scale: {
                        range: [0, 300]
                    }
                }
            }
        }
    ]
}

const vSpec2 = {
    'width': 'container',
    'height': 'container',
    data: {
        url: './data/challenge_17b_Sandro.json'
    },
    layer: [
    {
        mark: 'circle',
        encoding: {
            x: {
                field: 'confidence',
                type: 'quantitative',
                axis: {
                    gridOpacity: 0,
                    title: 'Confidence',
                    titleFontSize: 15,
                    tickOpacity: 0,
                    domainOpacity: 0,
                    labelFontSize: 12
                }
            },
            y: {
                field: 'parameter',
                type: 'nominal',
                axis: {
                    title: 'Parameter',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    tickOpacity: 0,
                    domainOpacity: 0
                }
            },
            color: {
                field: 'snr',
                type: 'quantitative',
                legend: {
                    title: 'SNR',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    orient: 'bottom',
                    direction: 'horizontal'
                }
            },
            size: {
                field: 'b',
                type: 'quantitative',
                title: 'B-Value',
                legend: {
                    titleFontSize: 15,
                    labelFontSize: 12,
                    orient: 'bottom',
                    direction: 'horizontal',
                },
                scale: {
                    range: [0, 600]
                }
            }
        }
    },
    {
        mark:{
            type: 'point'
        },
        encoding: {
            x: {
                field: 'confidence',
                axis: {
                    gridOpacity: 0,
                    title: 'Confidence',
                    titleFontSize: 15,
                    tickOpacity: 0,
                    domainOpacity: 0,
                    labelFontSize: 12
                }
            },
            y: {
                field: 'parameter',
                type: 'nominal',
                axis: {
                    title: 'Parameter',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    tickOpacity: 0,
                    domainOpacity: 0
                }
            },
            color: {
                field: 'constant',
                condition: {
                    test: 'datum.snr > 200 && datum.snr < 300',
                    value: 'rgba(300,0,0,0.3)'
                },
                scale: {range: ['rgba(0,0,0,0)']},
                legend: {
                    title: null,
                    labelExpr: '"Acquisiton Conditions"',
                    labelFontSize: 15,
                    labelFontWeight: 'bold',
                    orient: 'bottom',
                    direction: 'horizontal'
                }
            },
         
            size: {
                field: 'b',
                type: 'quantitative',
                title: 'B-Value',
                scale: {
                    range: [0, 600]
                },
            },
        }
    }
    ]
}

const vSpec3 = {
    'width': 'container',
    'height': 'container',
    data: {
        url: './data/challenge_17b_Sandro.json'
    },
    layer: [
    {
        mark: 'circle',
        encoding: {
            x: {
                field: 'snr',
                type: 'nominal',
                sort: false,
                axis: {
                    gridOpacity: 0,
                    title: 'SNR',
                    titleFontSize: 15,
                    tickOpacity: 0,
                    domainOpacity: 0,
                    labelFontSize: 12
                }
            },
            y: {
                field: 'parameter',
                type: 'nominal',
                axis: {
                    title: 'Parameter',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    tickOpacity: 0,
                    domainOpacity: 0
                }
            },
            color: {
                field: 'confidence',
                type: 'quantitative',
                legend: {
                    title: 'Confidence',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    orient: 'bottom',
                    direction: 'horizontal'
                }
            },
            size: {
                field: 'b',
                type: 'quantitative',
                title: 'B-Value',
                legend: {
                    titleFontSize: 15,
                    labelFontSize: 12,
                    orient: 'bottom',
                    direction: 'horizontal',
                },
                scale: {
                    range: [0, 600]
                }
            }
        }
    },
    {
        mark:{
            type: 'point'
        },
        encoding: {
            x: {
                field: 'snr',
                type: 'nominal',
                sort: false,
                axis: {
                    gridOpacity: 0,
                    title: 'SNR',
                    titleFontSize: 15,
                    tickOpacity: 0,
                    domainOpacity: 0,
                    labelFontSize: 12
                }
            },
            y: {
                field: 'parameter',
                type: 'nominal',
                axis: {
                    title: 'Parameter',
                    titleFontSize: 15,
                    labelFontSize: 12,
                    tickOpacity: 0,
                    domainOpacity: 0
                }
            },
            color: {
                field: 'constant',
                condition: {
                    test: 'datum.snr > 200 && datum.snr < 300',
                    value: 'rgba(300,0,0,0.3)'
                },
                scale: {range: ['rgba(0,0,0,0)']},
                legend: {
                    title: null,
                    labelExpr: '"Acquisiton Conditions"',
                    labelFontSize: 15,
                    labelFontWeight: 'bold',
                    orient: 'bottom',
                    direction: 'horizontal'
                }
            },
         
            size: {
                field: 'b',
                type: 'quantitative',
                title: 'B-Value',
                scale: {
                    range: [0, 600]
                },
            },
        }
    }
    ]
}


vegaEmbed('#vis1', vSpec1, { renderer: "svg" }).then(() => {

    $('.mark-group .role-legend').eq(1).first().attr('transform', 'translate(10,0)')
})

vegaEmbed('#vis2', vSpec2, { renderer: "svg" }).then(() => {
   
    $('.mark-symbol.role-legend-symbol path').last().css('stroke', 'rgba(300,0,0,0.5)').css('stroke-width', 2)
    $('.mark-group .role-legend').eq(1).first().attr('transform', 'translate(10,0)')
})

vegaEmbed('#vis3', vSpec3, { renderer: "svg" }).then(() => {
   
    $('.mark-symbol.role-legend-symbol path').last().css('stroke', 'rgba(300,0,0,0.5)').css('stroke-width', 2)
    $('.mark-group .role-legend').eq(1).first().attr('transform', 'translate(10,0)')
})



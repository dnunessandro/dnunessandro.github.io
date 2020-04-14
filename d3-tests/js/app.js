const vSpec = {
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

                color: { field: 'parameter', 
                legend: { 
                    title: 'Parameter', 
                    titleFontSize: 15, 
                    labelFontSize: 12,
                    orient: 'bottom',
                    direction: 'horizontal'
                } },
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


vegaEmbed('#vis', vSpec, {renderer: "svg"}).then(()=>{
    console.log($('.mark-group .role-legend').eq(1).first())
    $('.mark-group .role-legend').eq(1).first().attr('transform', 'translate(10,0)')
})




// const vSpec = {
//     'width': 'container',
//     'data': {
//         'url': 'data/seattle-weather.csv'
//     },
//     'transform': [
//         {
//             'calculate': 'datum.temp_max - datum.temp_min',
//             'as': 'temp_range'
//         }
//     ],
//     'mark': 'bar',
//     'encoding': {
//         'x': {
//             'field': 'date',
//             'type': 'temporal',
//             'timeUnit': 'month',
//             'band': 0.5
//         },
//         'y': {
//             'aggregate': 'count',
//             'type': 'quantitative'
//         },
//         'color': {
//             'field': 'weather',
//             'scale': {
//                 "domain": ["sun", "fog", "drizzle", "rain", "snow"],
//                 "range": ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4", "#9467bd"]
//             },
//             'legend': {
//                 'title': 'Weather Type'
//             }
//         }
//     }
// }

// $('#vis').css('width', '100%')
// vegaEmbed('#vis', vSpec)
const asd = [1, 2]

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
                        titleFontSize: 15
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
                        labelFontSize: 12
                    }
                },

                color: { field: 'parameter', legend: { title: 'Parameter', titleFontSize: 15, labelFontSize: 12 } },
                size: {
                    field: 'confidence',
                    type: 'quantitative',
                    title: 'Confidence',
                    legend: {
                        titleFontSize: 15,
                        labelFontSize: 12
                    },
                    scale: {
                        range: [0, 500]
                    }
                }
            }
        }
    ]
}


vegaEmbed('#vis', vSpec)

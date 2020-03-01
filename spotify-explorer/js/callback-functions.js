function createMetricsButtonsClickAnimation(displayMetricsList, metricsScales, albumNodeShapes, forceAlbums, nodesXScale){
    for(let i=0; i < displayMetricsList.length; i++){
        let metric = metricsList[i]
        let displayMetric = displayMetricsList[i]
        let metricStr = 'avg' + metric.charAt(0).toUpperCase() + metric   .slice(1)
        d3.select('#' + displayMetric + '-button').on('click', function(){

            $('#button-selector').children().css('border-color', '#BFBFBF')
            $(this).css('border-color', '#1C618C')

            $('#selected-metric-button').text(metric.charAt(0).toUpperCase() + metric.slice(1))

            albumNodeShapes
            .transition()
            .attr('width', d=>metricsScales[displayMetric](d[metricStr]))
            .attr('height',d=>metricsScales[displayMetric](d[metricStr]))

            forceAlbums.force('forceX')
                .x((d,i)=>nodesXScale(i)+albumNodesWidth/2-metricsScales[displayMetric](d[metricStr])/2)
            forceAlbums.force('forceY')
                .y((d,i)=>chartHeight/2-chartYPadding+albumNodesHeight/2-metricsScales[displayMetric](d[metricStr])/2)

            d3.selectAll('.track-node-shape')
            .transition()
            .attr('r', d=>metricsScales[displayMetric](Math.abs(d[metric]))/metricsScaleFactor)
            
        })

    }

}

function createAlbumNodesClickAnimation(albumIds, tracks, nodeColorScale, forceTracks, albumNodesFoci, albumNodeIndexScale, tooltip){
    
    for(let i=0; i < albumIds.length; i++){

        let albumId = albumIds[i]

        d3.select('.album-node.album-'+albumId).on('click',function(){

            let albumTracks = tracks.filter(d=>d.album_id == albumId)
            albumTracks.forEach(d=>d.x=albumNodesFoci[albumNodeIndexScale(d.album_id)].x)
            albumTracks.forEach(d=>d.y=albumNodesFoci[albumNodeIndexScale(d.album_id)].y)

            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0)

            const trackNodes = svg.selectAll('.track-node.album-' + albumId)
                .data(albumTracks)
                .enter()
                .append('g')
                .classed('track-node', true)
                .classed('album-' + albumId, true)
        
            const trackNodeShapes = trackNodes.append('circle')
                .attr('class', 'track-node-shape')
                .attr('cx', albumNodesFoci[albumNodeIndexScale(albumId)].x)
                .attr('cy', albumNodesFoci[albumNodeIndexScale(albumId)].y)
                .attr('r', trackNodesR)
                .style('fill', d=>nodeColorScale(d.album_id))
        
            const trackNodeLabels = trackNodes.append('text')
                .attr('class', 'track-node-label')
                .attr('x', albumNodesFoci[albumNodeIndexScale(albumIds[i])].x)
                .attr('y', albumNodesFoci[albumNodeIndexScale(albumIds[i])].y)
                .text(d=>d.name.substring(0,trackLabelMaxCharLen))

            const trackNodeShapesAll = svg.selectAll('.track-node-shape')
            const trackNodeLabelsAll = svg.selectAll('.track-node-label')
            
            // Tie Force to Tracks Nodes
            forceTracks.on("tick", function(){
                trackNodesTickUpdate(tracks, trackNodeShapesAll, trackNodeLabelsAll, albumNodesFoci, albumNodeIndexScale)
            });
            trackNodeShapes.call(d3.drag().on("drag", dragTrack));
            trackNodeLabels.call(d3.drag().on("drag", dragTrack));

            trackNodes.on('click', function(){
                createTrackNodesClickAnimation(trackNodes, trackNodeShapes, trackNodeLabels, albumId)
            })

            // Animate Track Nodes Tooltip
            trackNodes
            .on("mouseover", function(d){
                title = '<strong>' + (d.name.length<50 ? d.name : d.name.substring(0,50) + ' [...]') + '</strong><br><br>'
                tooltipHtml = createToolTip(d)
                
                let tooltip = d3.select('#tooltip')
                tooltip
                    .transition()		
                    .duration(200)
                    .style("opacity", .9)
                    
                tooltip.html(title + tooltipHtml)
            })			
            .on("mouseout", function(d) {		
                tooltip.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            }) 
            
              
        
        })     
    }  
}

function createToolTipHtml(displayMetricsList, metricsValues, highlightedMetric){

    let outputHtml = ""

    displayMetricsList.forEach(function(d, i){

        let upperCasedMetric = d.charAt(0).toUpperCase() + d.slice(1)

        if (d == highlightedMetric){
            outputHtml = outputHtml.concat('<em><strong>'+ upperCasedMetric  +': </strong>' +
            metricsValues[i] + '</em><br>')
        } else{
            outputHtml = outputHtml.concat('<strong>' + upperCasedMetric  +': </strong>' +
            metricsValues[i] + '<br>')
        }

    })

    return outputHtml
}

function createTrackNodesClickAnimation(trackNodes, trackNodeShapes, trackNodeLabels, albumId){

    trackNodes
        .transition()
        .style('opacity', 0)
        .remove()

    trackNodeShapes
        .transition()
        .attr('r', trackNodesTransitionR)

    trackNodeLabels
        .transition()
        .style('font-size', '120%')

    d3.select('.album-node.album-'+albumId)
        .transition()
        .duration(1000)
        .style('opacity', 100)
    
}

function createToolTip(d) {

    const selectedMetric = $('#selected-metric-button').text().toLowerCase()

    let metricsValues = []
    
    if ('album_id' in d){
        metricsValues = displayMetricsList.map(e=>roundIfNumber(d[e]))
    }
    else{
        metricsValues = displayMetricsList.map(e=>roundIfNumber(d['avg' + e.charAt(0).toUpperCase() + e.slice(1)]))
    }
    
    const tooltipHtml = createToolTipHtml(displayMetricsList, metricsValues, selectedMetric)
    	
    return tooltipHtml
}

function roundIfNumber(e){
    if (typeof(e)=='number'){
        return e.toFixed(2)
    }else{
        return e
    }
}
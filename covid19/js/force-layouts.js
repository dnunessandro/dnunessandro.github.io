// Create Force Layout for Time Chart Labels
function createTimeChartLabelsForce(newPositions){
 
    const simulation = d3.forceSimulation()
        .nodes(newPositions)
        .force('collide', d3.forceCollide(7))
        .force('y', d3.forceY(d => d.targetY).strength(1))    
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();


}

function createPieChartLabelsForce(newPositions, forceStr){
 
    const simulation = d3.forceSimulation()
        .nodes(newPositions)
        .force('collide', d3.forceCollide(forceStr))
        .force('y', d3.forceY(d => d.targetY).strength(0.7))    
        .stop();

    for (let i = 0; i < 300; i++) simulation.tick();


}

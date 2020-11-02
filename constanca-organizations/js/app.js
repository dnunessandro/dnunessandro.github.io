const vSpec1 = {
  width: 800,
  height: 300,
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: { url: "./data/data.csv", format: { type: "dsv", delimiter: ";" } },
  mark: "point",
  encoding: {
    x: {
      field: "EU contribution (€)",
      type: "quantitative",
      scale: { type: "log" },
    },
    y: { field: "PO budget %", type: "quantitative" },
    size: {
      field: "Includes PO?",
      type: "nominal",
      title: "Includes PO?",
      legend: {
        titleFontSize: 15,
        labelFontSize: 12,
        orient: "bottom",
        direction: "horizontal",
      },
      scale: {
        domain: [1, 3],
        range: [50, 200],
      },
    },
  },
};

const vSpec2 = {
  width: 800,
  height: 300,
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: { url: "./data/data.csv", format: { type: "dsv", delimiter: ";" } },
  mark: "point",
  encoding: {
    x: {
      field: "EU contribution (€)",
      type: "quantitative"
    },
    y: { field: "PO budget %", type: "quantitative" },
    size: {
      field: "Includes PO?",
      type: "nominal",
      title: "Includes PO?",
      legend: {
        titleFontSize: 15,
        labelFontSize: 12,
        orient: "bottom",
        direction: "horizontal",
      },
      scale: {
        domain: [1, 3],
        range: [50, 200],
      },
    },
  },
};

vegaEmbed("#vis1", vSpec1, { renderer: "svg" }).then(() => {
  $(".mark-group .role-legend")
    .eq(1)
    .first()
    .attr("transform", "translate(10,0)");
});
vegaEmbed("#vis2", vSpec2, { renderer: "svg" }).then(() => {
  $(".mark-group .role-legend")
    .eq(1)
    .first()
    .attr("transform", "translate(10,0)");
});

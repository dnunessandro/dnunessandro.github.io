const vSpec1 = {
  width: 1000,
  height: 300,
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: { url: "./data/data.csv", format: { type: "dsv", delimiter: ";" } },

  layer: [
    {
      mark: { type: "tick",  color: "#e63946", opacity: 0.1 },
      encoding: {
        x: { field: "EU contribution (€)", type: "quantitative" },
      },
    },
    {
      selection: {
        grid: {
          type: "interval",
          bind: "scales",
        },
      },
      mark: { type: "point", "tooltip": {"content": "data"}, filled: true },
      encoding: {
        x: {
          field: "EU contribution (€)",
          title: "EU Contribution (€)",
          axis: {
            titleFontSize: 15,
            labelFontSize: 12,
          },

          type: "quantitative",
          scale: { type: "log" },
        },
        y: {
          field: "PO budget %",
          type: "quantitative",
          title: "PO Budget %",
          axis: {
            titleFontSize: 15,
            labelFontSize: 12,
          },
        },
        size: {
          field: "Includes PO?",
          type: "nominal",
          title: "Number of included PO",

          legend: {
            titleFontSize: 15,
            labelFontSize: 12,
            orient: "bottom",
            direction: "horizontal",
          },
          scale: {
            domain: [1, 3],
            range: [100, 400],
          },
        },
      },
    },
  ],
  config: {
    tick: { bandSize: 10000, thickness: 3 },
  },
};

const vSpec2 = {
  width: 1000,
  height: 300,
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: { url: "./data/data.csv", format: { type: "dsv", delimiter: ";" } },

  layer: [
    {
      mark: { type: "tick", color: "#e63946", opacity: 0.1, "tooltip": {"content": "data"} },
      encoding: {
        x: { field: "EU contribution (€)", type: "quantitative" },
      },
    },
    {
      selection: {
        grid: {
          type: "interval",
          bind: "scales",
        },
      },
      mark: { type: "point", filled: true },
      encoding: {
        x: {
          field: "EU contribution (€)",
          title: "EU Contribution (€)",
          axis: {
            titleFontSize: 15,
            labelFontSize: 12,
          },

          type: "quantitative",
        },
        y: {
          field: "PO budget %",
          type: "quantitative",
          title: "PO Budget %",
          axis: {
            titleFontSize: 15,
            labelFontSize: 12,
          },
        },
        size: {
          field: "Includes PO?",
          type: "nominal",
          title: "Number of included PO",

          legend: {
            titleFontSize: 15,
            labelFontSize: 12,
            orient: "bottom",
            direction: "horizontal",
          },
          scale: {
            domain: [1, 3],
            range: [100, 400],
          },
        },
      },
    },
  ],
  config: {
    tick: { bandSize: 10000, thickness: 3 },
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

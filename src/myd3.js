import * as d3 from "d3";

let dataURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

//current issues, the legend colors and labels are off by one
//drinks category not showing up in legend, due to the off by one error

//really important points that took me a while to wrap my head around...
//the tree is not connected to the chart, it is completely separate
//the tree is there to calculate the x and y values for positioning
//the tree can give you a list of nodes to then put onto the chart
//you still use that list of nodes as the data input to d3.data()

// very helpful sites
// https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#node_sum
// https://www.youtube.com/watch?v=svT9RdyQlrw
// https://www.d3indepth.com/layouts/
// https://observablehq.com/@d3/d3-hierarchy
// https://d3-wiki.readthedocs.io/zh_CN/master/Treemap-Layout/

d3.json(dataURL, (data) => {
  const chartW = 700;
  const chartH = 500;
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#4e79a7",
    "#f28e2c",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab",
  ];

  //make a hierarchy from the data to feed to treemap()
  //hierarchy() returns a structure as a root node
  const root = d3.hierarchy(data);
  console.log();

  var treemap = d3
    .treemap() //establish the size of the tree
    .size([chartW, chartH])
    .padding(1);
  //tree map nodes
  //need sum and sort methods for it to work
  var leaves = treemap(
    root.sum((d) => d.value).sort((d, e) => d.value - e.value)
  )
    // .sort((d, e) => d.category > e.category))
    .leaves(); //return the leaves

  //extract categories
  let categories = new Set(leaves.map((d) => d.data.category));
  categories = Array.from(categories);
  console.log(categories.length, categories);

  //This ends the tree part, next is the chart part

  //tooltip
  const toolH = 60;
  const toolW = 300;
  const tooltip = d3
    .select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .attr("opacity", 0)
    .style("position", "absolute");

  //make the svg
  const chart = d3
    .select("#graph")
    .append("svg")
    .attr("width", `${chartW}px`)
    .attr("height", `${chartH}px`);

  //use "g", not "rect" to avoid having to add attributes
  const tile = chart.selectAll("g").data(leaves).enter().append("g");

  //each tile will have these properties...
  //this is called for each tile from above
  //a cleaner way to visually separate the code into blocks
  tile
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0) //calculate the width and height
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => colors[categories.indexOf(d.data.category)])
    .on("mouseover", (d) => {
      tooltip
        .transition()
        .duration(0)
        .attr("data-value", d.data.value)
        .style("opacity", 1)
        .style("font-size", "small")
        .style("left", `${d3.event.pageX + 10}px`)
        .style("top", `${d3.event.pageY - toolH / 2}px`)
        .style("width", toolW + "px")
        .style("height", toolH + "px");
      tooltip.html(
        d.data.category + "<br />" + d.data.name + "<br />" + d.data.value
      );
    })
    .on("mouseout", (d) => {
      tooltip
        .transition()
        .duration(0)
        .style("opacity", 0)
        .style("width", "0px")
        .style("height", "0px");
    });

  //text must be added to the tile, not the dataNode
  //I think this is due to the iteration through the data in d3.data()
  //this way, you have access to each element in the data list
  tile
    .append("text")
    .style("color", "black")
    .style("font-size", "xx-small")
    .attr("x", (d) => d.x0 + 2)
    .attr("y", (d) => d.y0 + 13) //lower text just a little
    .text((d) => d.data.name); //give the blocks their own title

  // legend
  const legend = d3
    .select("#legend")
    .append("svg")
    .attr("width", "600px") //calculate the width and height
    .attr("height", "400px");

  //texts
  legend
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", "20px")
    .attr("y", (d, i) => i * 18 + 18);

  //color boxes
  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", 0)
    .attr("y", (d, i) => i * 18 + 7)
    .attr("width", "10px")
    .attr("height", "10px")
    .style("fill", (d) => colors[categories.indexOf(d)]);
});

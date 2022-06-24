(() => {
  const table1 = document.getElementById("table1");
  const table2 = document.getElementById("table2");

  /**
   * generate label for mousmove of svg to show the current value
   * @returns Object
   */
  const generateLabelMoving = () => {
    const label = d3
      .select(`body`)
      .append("span")
      .attr("id", "value-chart-moving")
      .text("rr")
      .style("position", "absolute")
      .style("background", "red")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("padding", "10px")
      .style("transition", "opacity 0.3s ease-out")
      .style("font-weight", "bold")
      .style("border-radius", "10px")
      .style("letter-spacing", "2px");
    document.getElementById("value-chart-moving").style.backgroundColor =
      "rgb(234,116,36)";
      return label;
  };

  const buildGraph = (years, countries, idTarget) => {
    let currentChart = countries[0][0];
    const selected = d3
      .select(`#${idTarget}`)
      .append("select")
      .attr("id", "selected")
      .style("padding", "5px")
      .style("text-align", "center")
      .style("border", "0")
      .style("letter-spacing", "0px")
      .style("font-size", "2rem")
      .style("font-weight", "bold")
      .style("display", "block")
      .style("top", "10px")
      .style("margin", "0 auto")
      .style("position", "relative")
      .style("border-radius", "10px");
    document.querySelector(`#${idTarget} #selected`).style.backgroundColor =
      "rgb(234,116,36)";
    // console.log(years, countries);
    countries.forEach((country) => {
      selected
        .append("option")
        .text(country[0])
        .on("click", (e) => {
          d3.select(`#${idTarget} #${currentChart}`)
            .style("opacity", "0")
            .style("transition", "all 0.3s ease-out")
            .style("transform", "translateY(30px) scale(0) rotate(360deg)");
          console.log(currentChart);
          currentChart = e.target.innerText.replace(/\s/g, "");
          console.log(currentChart);
          d3.select(`#${idTarget} #${currentChart}`)
            .style("opacity", "1")
            .style("transition", "all 0.3s 1s ease-out")
            .style("transform", "translateY(0) scale(1) rotate(0)");
        });
      // console.log(Math.max(...filtered));
      let data = [];
      years.forEach((el, i) => {
        country[i + 1] === ":"
          ? (country[i + 1] = 0)
          : (country[i + 1] = country[i + 1]);
        data.push({ year: el, value: country[i + 1] });
      });
      // console.log(data);

      const width = 800;
      const height = 500;

      const margin = { top: 50, bottom: 50, left: 80, right: 50 };

      // const svgContainer = d3
      //   .select(`#${idTarget}`)
      //   .append("div")
      //   .attr("id", "svg-container").style('position','absolute').style('top','0');

      // const selected = svgContainer.append("select");
      // countries.forEach(e => {
      //     selected.append('option').text(e[0])
      // })
      country[0] = country[0].replace(/\s/g, "");
      const svg = d3
        .select(`#${idTarget}`)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("id", `${country[0]}`)
        .style("position", "absolute")
        .style("background", "lightgrey")
        .style("top", "50px")
        .style("opacity", "1")
        .style("transform", "translateY(30px) scale(0) rotate(360deg)")
        .on("mouseenter", () => {
          d3.selectAll("rect").attr("height", (d) => y(0) - y(d.value));
        })
        .on("mouseleave", () => {
          d3.selectAll("rect").attr("height", (d) => y(0) - y(0));
        });

      const x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      let filtered = country.filter(function (value, index, arr) {
        return !isNaN(value) && value;
      });
      let max = Math.max(...filtered);

      const y = d3
        .scaleLinear()
        .domain([0, max])
        .range([height - margin.bottom, margin.top])
        .nice();

      svg
        .append("path")
        .attr("fill", `royalblue`)
        .selectAll("rect")
        .data(data)
        // ordre decroissant: .data(data.sort((a, b) => d3.descending(a.score, b.score)))
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .attr("score", (d) => d.value)
        .attr("width", x.bandwidth())
        .style("transition", "all 0.3s ease-out")
        .style("opacity", "0.7")
        .on("mouseenter", (e) => {
          e.target.style.opacity = "1";
          labelMoving
            .style("opacity", "1")
            .text(e.target.getAttribute("score"));
          labelMoving
            .style(
              "left",
              `${
                e.pageX - labelMoving.node().getBoundingClientRect().width / 2
              }px`
            )
            .style(
              "top",
              `${e.pageY - labelMoving.node().getBoundingClientRect().height}px`
            );
        })
        .on("mouseleave", (e) => {
          e.target.style.opacity = "0.8";
          labelMoving.style("opacity", "0");
        })
        .on("mousemove", (e) => {
          labelMoving
            .style(
              "left",
              `${
                e.pageX - labelMoving.node().getBoundingClientRect().width / 2
              }px`
            )
            .style(
              "top",
              `${e.pageY - labelMoving.node().getBoundingClientRect().height}px`
            );
        });

      const xAxis = (g) => {
        g.attr("transform", `translate(0, ${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickFormat((i) => data[i].year))
          .attr("font-size", "20");
      };

      const yAxis = (g) => {
        g.attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y).ticks(null, data.format))
          .attr("font-size", "20");
      };

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      svg.node();
    });
    d3.select(`#${idTarget} svg`)
      .style("opacity", "1")
      .style("transform", "translateY(0) scale(1) rotate(0)");
    //   console.log(d3.select(`#${idTarget} #selected`).select('option').text());
  };

  const graph = (table) => {
    let ths, tds;
    let years = [];
    let target = document.createElement("div");
    target.style.position = "relative";
    target.style.width = "800px";
    target.style.height = "550px";
    target.setAttribute(
      "id",
      `graph${table.id[table.id.length - 1]}-container`
    ); // graph1-container or graph2container depending table1 or table2
    table.before(target);
    table.id === "table1"
      ? (ths = table.querySelector("tbody > tr").querySelectorAll("th"))
      : (ths = table.querySelector("thead > tr").querySelectorAll("th"));
    ths.forEach((el) => {
      !isNaN(el.innerText[0]) && years.push(el.innerText);
    });
    let countries = [];
    table.querySelectorAll("tr").forEach((el) => {
      let country = [];
      el.querySelectorAll("td").forEach((el2) => {
        el2.innerText = el2.innerText.replace(/,/g, ".");
        !isNaN(el2.innerText) && (el2.innerText = parseFloat(el2.innerText));
        el2.innerText[el2.innerText.length - 1] === ")" &&
          (el2.innerText = el2.innerText.substring(
            0,
            el2.innerText.indexOf("(")
          ));
        country.push(el2.innerText);
      });
      country.length > 0 && countries.push(country);
    });
    buildGraph(years, countries, target.id);
  };

  const labelMoving = generateLabelMoving();
  graph(table1);
  graph(table2);
})();

// const margin = { top: 10, right: 30, bottom: 30, left: 60 },
//   width = 460 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

//   var n = 21;
// var dataset = [{a: "2002", y: 10}, {a: "2003", y:25}, {a: "2004", y:20}, {a: "2005", y:0.2}];

// var xScale = d3.scaleLinear().domain(d3.extent(dataset, function(d) { return d.a })).range([0, width]);

// var yScale = d3.scaleLinear().domain([0, 30]).range([height, 0]);

// var line = d3
//   .line()
//   .x((d, i) => {
//     return  xScale(d.a);
//   })
//   .y((d) => {
//     return yScale(d.y);
//   });
// // .curve(d3.curveMonotoneX);

// var svg = d3
//   .select("#my_dataviz")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", `translate(${margin.left},${margin.top})`);

// svg
//   .append("g")
//   .attr("class", "x axis")
//   .attr("transform", `translate(0,${height})`)
//   .call(d3.axisBottom(xScale).ticks(dataset.length, dataset.format).tickFormat((d,i) => dataset[i].a));

// svg.append("g").attr("class", "y axis").call(d3.axisLeft(yScale));

// svg
//   .append("path")
//   .attr("fill", "none")
//   .attr("stroke", "red")
//   .attr("stroke-width", 2)
//   .datum(dataset)
//   .attr("class", "line")
//   .attr("d", line);

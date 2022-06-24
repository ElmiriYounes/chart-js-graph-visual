(() => {
  const table1 = document.getElementById("table1");
  const table2 = document.getElementById("table2");

  /**
   *
   * @param {Object} table
   * @param {String} value
   * @returns Array
   */
  const getValues = (table, value) => {
    let array = [];
    let tds = table.querySelectorAll("td");
    tds.forEach((td) => {
      if (value === "numbers") {
        td.innerText === ":" && (td.innerText = 0);
        !isNaN(td.innerText[0]) &&
          array.push(parseFloat(td.innerText.replace(/,/g, ".")));
      } else if (value === "countries") {
        if (td.innerText[0].match(/[a-z]/i)) {
          td.innerText.includes("(") &&
            (td.innerText = td.innerText.substring(
              0,
              td.innerText.indexOf("(")
            ));
          let rgb = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256
          )},${Math.floor(Math.random() * 256)})`;
          array.push({ country: td.innerText, color: rgb });
        }
      }
    });
    return array;
  };

  /**
   *
   * @param {Object} table
   * @returns Array
   */
  const getYears = (table) => {
    let array = [];
    if (table.id == "table1") {
      let ths = document
        .querySelector("#table1 tbody tr")
        .querySelectorAll("th");
      ths.forEach((th) => {
        !isNaN(th.innerText[0]) && array.push(th.innerText);
      });
    } else {
      let th = document
        .querySelector("#table2 thead tr")
        .querySelectorAll("th")[2];
      let year = parseInt(th.innerText.substring(0, 4));
      for (let i = 1; i <= 6; i++) {
        array.push(year++);
      }
    }
    return array;
  };

  /**
   *
   * @param {Object} table
   */
  const generateCanvas = (table) => {
    const canvas = document.createElement("div");
    // id chart1 for table1 and chart2 for table
    canvas.setAttribute("id", `chart${table.id[table.id.length - 1]}`);
    table.before(canvas);
  };

  /**
   *
   * @param {Function} xScale
   * @param {Function} yScale
   * @param {Array} dataset
   * @param {Number} left
   * @param {Number} top
   * @param {String} id
   * @param {String} country
   */
  function setLineChart(xScale, yScale, dataset, left, top, id, country) {
    var line = d3
      .line()
      .x((d, i) => {
        return xScale(d.year);
      })
      .y((d) => {
        return yScale(d.number);
      });
    // .curve(d3.curveMonotoneX);

    d3.select(`#chart${id} svg`)
      .append("path")
      .style("transition", "all 0.5s ease-out")
      .attr("fill", "none")
      .attr("stroke", country.color)
      .attr("stroke-width", 2)
      .datum(dataset)
      .attr("transform", `translate(${left},${top})`)
      .attr("class", `line-${country.country.replace(/\s/g, "")}`)
      .attr("d", line);

    d3.select(`#chart${id} svg`)
      .selectAll("dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", `circle dot-${country.country.replace(/\s/g, "")}`)
      .attr("fill", country.color)
      .attr("transform", `translate(${left},${top})`)
      .style("transition", "all 0.3s ease-out")
      .attr("r", 3)
      .attr("cx", function (d) {
        return xScale(d.year);
      })
      .attr("cy", function (d) {
        return yScale(d.number);
      });
  }

  /**
   *
   * @param {Array} years
   * @param {Number} maxValue
   * @param {Object} table
   */
  const generateChart = (years, maxValue, table) => {
    const countries = getValues(table, "countries");
    const numbers = getValues(table, "numbers");
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 600 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

    var xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(years, function (d) {
          return d;
        })
      )
      .range([0, width]);

    var yScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height, 0])
      .nice();

    d3.select(`#chart${table.id[table.id.length - 1]}`)
      .append("div")
      .attr("class", "legends")
      .style("text-align", "center")
      .style("padding", "20px 0");

    var svg = d3
      .select(`#chart${table.id[table.id.length - 1]}`)
      .style("background", "rgb(243,243,246)")
      .style("padding", "20px 5px")
      .append("svg")
      .style("margin", "0 auto")
      .style("display", "block")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(years.length)
          .tickFormat((d, i) => years[i])
      );

    svg.append("g").attr("class", "y axis").call(d3.axisLeft(yScale));

    let k = 0;

    for (const i in countries) {
      d3.select(`#chart${table.id[table.id.length - 1]} .legends`)
        .append("button")
        .attr("toggle", "enabled")
        .attr("idTable", `chart${table.id[table.id.length - 1]}`)
        .attr("country-name", countries[i].country.replace(/\s/g, ""))
        .attr("color", countries[i].color)
        .on("click", (e) => {
          e.target.getAttribute("toggle") === "enabled"
            ? ((e.target.style.background = "white"),
              (e.target.style.color = e.target.getAttribute("color")),
              d3
                .select(
                  `#${e.target.getAttribute(
                    "idTable"
                  )} .line-${e.target.getAttribute("country-name")}`
                )
                .attr("stroke-width", 0),
              d3
                .selectAll(
                  `#${e.target.getAttribute(
                    "idTable"
                  )} .dot-${e.target.getAttribute("country-name")}`
                )
                .attr("r", 0),
              e.target.setAttribute("toggle", "disabled"))
            : ((e.target.style.background = e.target.getAttribute("color")),
              (e.target.style.color = "white"),
              d3
                .select(
                  `#${e.target.getAttribute(
                    "idTable"
                  )} .line-${e.target.getAttribute("country-name")}`
                )
                .attr("stroke-width", 2),
              d3
                .selectAll(
                  `#${e.target.getAttribute(
                    "idTable"
                  )} .dot-${e.target.getAttribute("country-name")}`
                )
                .attr("r", 3),
              e.target.setAttribute("toggle", "enabled"));
        })
        .text(countries[i].country)
        .style("text-align", "center")
        .style("background", countries[i].color)
        .style("color", "white")
        .style("border", `1px solid ${countries[i].color}`)
        .style("border-radius", "10px")
        .style("padding", "5px 10px")
        .style("margin", "5px")
        .style("font-weight", "bold");
      let data = [];
      for (const j in years) {
        data.push({ year: years[j], number: numbers[k] });
        if (table.id === "table2") {
          (j === "2" || j === "5") && k++;
        } else {
          k++;
        }
      }
      setLineChart(
        xScale,
        yScale,
        data,
        margin.left,
        margin.top,
        table.id[table.id.length - 1],
        countries[i]
      );
    }
  };

  /**
   *
   * @param {Object} table
   */
  const chart = (table) => {
    let years = [],
      maxValue;

    generateCanvas(table);

    years = getYears(table);

    maxValue = d3.max(getValues(table, "numbers"));

    generateChart(years, maxValue, table);
  };

  chart(table1);
  chart(table2);
})();

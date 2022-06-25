(() => {
  const table1 = document.getElementById("table1");
  const table2 = document.getElementById("table2");

  /**
   *
   * @param {String} str
   * @returns Number
   */
  const convertToFloat = (str) => {
    if (str === ":") {
      return 0;
    } else {
      return parseFloat(str.replace(/,/g, "."));
    }
  };

  /**
   *
   * @param {String} str
   * @returns String
   */
  const deleteSymbols = (str) => {
    str.includes("(") && (str = str.substring(0, str.indexOf("(")));
    return str;
  };

  /**
   *
   * @returns String
   */
  const randomColorRGB = () => {
    return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)})`;
  };

  /**
   * checking if is country (return null or the letter)
   * @param {String} str
   * @returns Object
   */
  const hasLetter = (str) => {
    return str[0].match(/[a-z]/i);
  };

  /**
   *
   * @param {HTMLTableElement} table
   */
  const getDatasets = (table) => {
    let arrayDatasets = [];
    let trs = [...table.querySelectorAll("tbody tr")];
    table.id === "table1" && trs.shift();
    for (const tr of trs) {
      let color = randomColorRGB();
      let obj = {
        label: "",
        data: [],
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      };
      tr.querySelectorAll("td").forEach((td) => {
        hasLetter(td.innerText)
          ? (obj.label = deleteSymbols(td.innerText))
          : obj.data.push(convertToFloat(td.innerText));
      });
      arrayDatasets.push(obj);
    }
    return arrayDatasets;
  };

  /**
   *
   * @param {HTMLTableElement} table
   * @returns Array
   */
  const getYears = (table) => {
    let array = [];
    let ths;
    table.id === "table1"
      ? (ths = [
          ...table.querySelectorAll("tbody tr")[0].querySelectorAll("th"),
        ])
      : (ths = Array.from(
          table.querySelectorAll("thead tr")[0].querySelectorAll("th")
        ));
    ths.shift();
    ths.shift();
    ths.forEach((el) => {
      array.push(el.textContent);
    });
    return array;
  };

  /**
   *
   * @param {Object} myChart
   * @param {HTMLTableElement} table
   */
  const generateLinesChart = (myChart, table) => {
    myChart.data.labels = getYears(table);
    myChart.data.datasets = getDatasets(table);
    myChart.update();
  };

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLTableElement} table
   */
  const generateChart = (canvas, table) => {
    let typeChart;
    table.id === "table1" ? (typeChart = "line") : (typeChart = "bar");
    const myChart = new Chart(canvas.getContext("2d"), {
      type: typeChart,
      data: {
        labels: [],
        datasets: [{}],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    myChart.canvas.addEventListener("mouseenter", () => {
      myChart.canvas.animate(
        [{ transform: "scale(1.1)" }, { transform: "scale(1)" }],
        {
          duration: 1000,
        }
      );
    });
    
    generateLinesChart(myChart, table);
  };

  /**
   *
   * @param {HTMLTableElement} table
   */
  const generateCanvas = (table) => {
    const canvas = document.createElement("canvas");
    // id table = table1 or table2 = getting lats number to put it for chart'id
    canvas.setAttribute("id", `chart${table.id[table.id.length - 1]}`);
    canvas.setAttribute("width", "800");
    canvas.setAttribute("height", "450");
    table.before(canvas);
    generateChart(canvas, table);
  };

  generateCanvas(table1);
  generateCanvas(table2);
})();

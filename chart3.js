(() => {
  let labels = [],
    datas = [];
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", "800");
  canvas.setAttribute("height", "450");
  canvas.setAttribute("id", "line-chart");

  document.getElementById("firstHeading").after(canvas);

  let config = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
          borderColor: "#3e95cd",
          fill: false,
          borderWidth:1,
          pointRadius: 0
        },
      ],
    }
  };

  let myChart = new Chart(document.getElementById("line-chart"), config);
  
  let label = 0;
    setInterval(async () => {
        await fetch("https://canvasjs.com/services/data/datapoints.php", {
          cache: "no-cache",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data.forEach((el) => {
              labels.push(label);
              label++;
              datas.push(el[1]);
            });
            myChart.config.data.labels = labels;
            myChart.config.data.datasets[0].data = datas;
            myChart.update();
          })
          .catch((err) => console.log(err));
    }, 1000);
})();

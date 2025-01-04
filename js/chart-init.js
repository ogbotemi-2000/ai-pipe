(function(){
    let data = DIMENSIONS, chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
        const { ctx, chartArea: { left, top, width, height } } = chart;

        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
    }};
    ChartInit =_=> [_=>new Chart(
        document.getElementById('dimensions'),
        {
          type: 'bubble',
          plugins: [ chartAreaBorder ],
          options: {
            plugins: {
              chartAreaBorder: {
                borderColor: 'red',
                borderWidth: 2,
                borderDash: [ 5, 5 ],
                borderDashOffset: 2,
              }
            },
            aspectRatio: 1,
            scales: {
                x: {
                  max: 500,
                  ticks: {
                    callback: value => `${value / 100} m`
                  }
                },
                y: {
                  max: 500,
                  ticks: {
                    callback: value => `${value / 100} m`
                  }
                }
              }
          },
          data: {
            labels: data.map(x => x.year),
            datasets: [
                {
                  label: 'width = height',
                  data: data
                    .filter(row => row.width === row.height)
                    .map(row => ({
                      x: row.width,
                      y: row.height,
                      r: row.count
                    }))
                },
                {
                  label: 'width > height',
                  data: data
                    .filter(row => row.width > row.height)
                    .map(row => ({
                      x: row.width,
                      y: row.height,
                      r: row.count
                    }))
                },
                {
                  label: 'width < height',
                  data: data
                    .filter(row => row.width < row.height)
                    .map(row => ({
                      x: row.width,
                      y: row.height,
                      r: row.count
                    }))
                }
              ]
          }
        }
      ), (data=ACQUISITIONS, _=>new Chart(
        document.getElementById('acquisitions'), {
          type: 'line',
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Chart.js Line Chart - Cubic interpolation mode'
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Value'
                },
                suggestedMin: -10,
                suggestedMax: 200
              }
            }
          },
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Acquisitions by year',
                data:data.map(row => row.count)
              }
            ]
          }
        }
      ))];
})()
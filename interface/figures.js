var lineChart_ctx = document.getElementById('lineChart').getContext('2d');
var donutChart_ctx = document.getElementById('donutChart').getContext('2d');

document.getElementById('displayBackdrop').addEventListener('click', function() {
    this.style.display = 'none';
});

var lineChart = new Chart(lineChart_ctx, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
            data: [36, 30, 20, 20, 20, 20],
            borderWidth: 2,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Number of Games'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Beads'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Evolution of the number of beads in this box'
            },
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

var donutChart = new Chart(donutChart_ctx, {
    type: 'doughnut',
    data: {
        labels: [
          'Top Left',
          'Top Middle',
          'Top Right',
          'Center Left',
          'Center Left',
          'Center',
          'Center Rigth',
          'Bottom Left',
          'Bottom Middle',
          'Bottom Right'
        ],
        datasets: [{
            label: 'Bead count',
            data: [4,4,4,4,4,4,4,4],
            backgroundColor: [
            'rgb(255, 99, 132)', 
            'rgb(54, 162, 235)', 
            'rgb(255, 205, 86)', 
            'rgb(75, 192, 192)', 
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)', 
            'rgb(201, 203, 207)',
            'rgb(100, 149, 237)' 
            ],
            hoverOffset: 4
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Current beads repartition'
            },
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,

            }
        }
    }
  });
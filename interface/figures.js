var lineChart_ctx = document.getElementById('lineChart').getContext('2d');
var donutChart_ctx = document.getElementById('donutChart').getContext('2d');

document.getElementById('displayBackdrop').addEventListener('click', function() {
    this.style.display = 'none';
});

function display_box_stats(box_number) {
    document.getElementById('displayBackdrop').style.display = 'flex';
    document.getElementById('modal_title').innerHTML = `Box ${box_number} statistics`

    update_chart(box_number)
}

function state_winning_status(board_state) {
    // Define all possible winning combinations (rows, columns, diagonals)
    const winning_combinations = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
        [0, 3, 6], // Column 1
        [1, 4, 7], // Column 2
        [2, 5, 8], // Column 3
        [0, 4, 8], // Diagonal 1
        [2, 4, 6]  // Diagonal 2
    ];

    // Check each winning combination
    for (let combination of winning_combinations) {
        const [a, b, c] = combination;

        if (board_state[a] !== "_" && board_state[a] === board_state[b] && board_state[a] === board_state[c]) {
            // If all three positions are the same (either "X" or "O"), return the winner
            return board_state[a];
        }
    }

    // If no winner, check if the board is full (indicating a draw) or still has empty spaces
    if (board_state.includes("_")) {
        return undefined; // Game is ongoing
    } else {
        return "draw"; // No empty spaces and no winner
    }
}

function stats_from_history(history) {
    //Initialize all 304 boxes with beads
    let number_of_beads = [4, 3, 2, 1]
    let boxes = []

    // initialization
    for(let move_number=0; move_number < Object.keys(all_states_dict).length; move_number++) {
        boards = all_states_dict[move_number];

        for (const [key, value] of Object.entries(boards)) {
            empty_spaces = value.filter(item => item === "_").length;
            box = {
                bead_count_history: [number_of_beads[move_number] * empty_spaces],
                bead_count_by_color: value.map(item => item === "_" ? number_of_beads[move_number] : 0)
            }
            boxes.push(box)
        }
    }

    // Process each game in history
    for (let game of history) {
        let winning_status = state_winning_status(game[game.length - 1]); // Get win status from the last state
        
        if(winning_status === undefined)
            // the game is ongoing
            return

        for (let move_index = 0; move_index < game.length; move_index++) {
            let board_state = game[move_index];
            let box_index = get_box_number(board_state) - 1;

            if (box_index === -1) continue;

            menace_move_index = -1
            for (let i = 0; i < board_state.length; i++) {
                if(move_index === 0 && board_state[i] === "X") {
                    menace_move_index = i
                } else if (game[move_index - 1][i] === "_" && game[move_index][i] === "X") {
                    menace_move_index = i;
                }
            }

            if (winning_status === "O") { // Game is lost
                // For each move, reduce the bead count of available colors by 1
                boxes[box_index].bead_count_by_color[menace_move_index] = Math.max(0, boxes[box_index].bead_count_by_color[menace_move_index] - 1);
            } else if (winning_status === "X") { // Game is won
                // For each move, add 1 bead to available colors
                boxes[box_index].bead_count_by_color[menace_move_index] += 3;
            } else if (winning_status === "draw") {
                // If undefined and board is full (draw), add 1 bead to each color
                boxes[box_index].bead_count_by_color[menace_move_index] += 1;
            }

            // Update bead count history
            let current_bead_count = boxes[box_index].bead_count_by_color.reduce((a, b) => a + b, 0);
            boxes[box_index].bead_count_history.push(current_bead_count);
        }
    }

    return boxes;
}

// Define global variables to store chart instances
let lineChartInstance = null;
let donutChartInstance = null;

function update_chart(box_number) {
    board_history = getListFromCookie()

    console.log(board_history)

    box_stats = stats_from_history(board_history)[box_number - 1];

    const linechartdata = box_stats["bead_count_history"];
    const donutchartdata = box_stats["bead_count_by_color"];

    // Destroy existing line chart if it exists
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }

    // Create a new line chart
    lineChartInstance = new Chart(lineChart_ctx, {
        type: 'line',
        data: {
            labels: linechartdata.map((_, index) => index),
            datasets: [{
                data: linechartdata,
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

    // Destroy existing donut chart if it exists
    if (donutChartInstance) {
        donutChartInstance.destroy();
    }

    // Create a new donut chart
    donutChartInstance = new Chart(donutChart_ctx, {
        type: 'doughnut',
        data: {
            labels: [
              'Top Left', 'Top Middle', 'Top Right',
              'Center Left', 'Center Middle', 'Center Right',
              'Bottom Left', 'Bottom Middle', 'Bottom Right'
            ],
            datasets: [{
                label: 'Bead count',
                data: donutchartdata,
                backgroundColor: [
                    "deeppink", "yellow", "coral", "white",
                    "black", "darkblue", "lightblue", "orange", "purple"
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
}

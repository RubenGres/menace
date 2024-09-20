let all_states_dict

fetch('all_states.json')
    .then((response) => all_states_dict = response.json())

let move_color = ["#000000", "#000055", "#000099", "#0000FF"]

let current_state = [null, null, null, null, null, null, null, null, null]
let current_player = "X"

let board = document.getElementById("input_board")
board_rows = board.getElementsByTagName("tr")

let menace = document.getElementById("menace")

function setup_board() {
    // add event listeners for each cell of the board
    for(let i=0; i < board_rows.length; i++) {
        board_row = board_rows[i]
        board_cols = board_row.getElementsByTagName("td")
        
        for(let j=0; j < board_cols.length; j++) {
            let cell = board_cols[j]
    
            cell.id = i*3 + j
    
            cell.addEventListener("click", () => {
                cell_clicked(cell)
            })
        }
    }
}

function setup_menace() {
    for(let i=0; i < 38; i++) {
        let row = document.createElement("tr")
        for(let j=0; j < 8; j++) {
            let menace_box = document.createElement("td")
            menace_box.id = "menace_" + i*8+j
            menace_box.innerHTML = (i*8+j)+1
            row.appendChild(menace_box)
        }
        menace.appendChild(row)
    }
}

function cell_clicked(cell) {
    if(current_state[cell.id] == null) {
        current_state[cell.id] = current_player
        current_player = current_player == "X" ? "O" : "X"
    }

    display_board();
}

function display_board() {
    for(let i = 0; i < 9; i++) {
        document.getElementById(i).innerHTML = current_state[i]
    }
}

function reset() {
    current_state = [null, null, null, null, null, null, null, null, null]
    display_board()
}

function get_box_number(current_state) {
    symmetries = [
        [0,1,2,3,4,5,6,7,8],  // Indentity
        [2,5,8,1,4,7,0,3,6],  // Rotation 90°
        [8,7,6,5,4,3,2,1,0],  // Rotation 180°
        [6,3,0,7,4,1,8,5,2],  // Rotation 270°
        [2,1,0,5,4,3,8,7,6],  // Horizontal mirror
        [6,7,8,3,4,5,0,1,2],  // vertical mirror
        [8,5,2,7,4,1,6,3,0],  // diagonal mirror \
        [0,3,6,1,4,7,2,5,8],  // diagonal mirror /
    ]
}
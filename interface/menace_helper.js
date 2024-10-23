let all_states_dict
let move_color = ["#AAFFFF", "#FFFF77", "#FFFF99", "#FFFFDD"]

let circle_svg = `
    <svg class="svgicon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" stroke="#444444" stroke-width="10" fill="none" />
    </svg>
`

let cross_svg = `
<svg class="svgicon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="20" x2="80" y2="80" stroke="#444444" stroke-width="10" stroke-linecap="round" />
  <line x1="80" y1="20" x2="20" y2="80" stroke="#444444" stroke-width="10" stroke-linecap="round" />
</svg>
`

let current_state = ["_", "_", "_", "_", "_", "_", "_", "_", "_"]
let current_player = "X"

let board = document.getElementById("input_board")
board_rows = board.getElementsByTagName("tr")

let menace = document.getElementById("menace")

let matchboxes = []


all_states_dict = JSON.parse(jsonString);

setup_menace();
setup_board();

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

function clear_borders() {
    for(let matchbox of matchboxes) {
        matchbox.style.border = ""
    }
}

function get_state_by_id(id) {
    id--

    for(let move_number=0; move_number < Object.keys(all_states_dict).length; move_number++) {
        boards = all_states_dict[move_number];

        for (const [key, value] of Object.entries(boards)) {
            if(id.toString() == key.toString()) {
                return value
            }
        }
    }

    return null
}

function setup_menace() {
    for(let i=0; i < 38; i++) {
        let row = document.createElement("tr")
        for(let j=0; j < 8; j++) {
            let menace_box = document.createElement("td")

            menace_box.addEventListener('click', function() {
                document.getElementById('displayBackdrop').style.display = 'flex'
            });
            
            let menace_box_number = i*8+(j+1)
            menace_box.id = "menace_" + menace_box_number
            
            menace_box.innerHTML = menace_box_number

            matchboxes.push(menace_box)
            row.appendChild(menace_box)
        }
        menace.appendChild(row)
    }

    let matchbox_id = 0;
    for(let move_number=0; move_number < Object.keys(all_states_dict).length; move_number++) {
        for(let j=0; j < Object.keys(all_states_dict[move_number]).length; j++) {
            matchboxes[matchbox_id].style.backgroundColor = move_color[move_number];
            matchbox_id ++
        }
    }
}

function cell_clicked(cell) {
    if(current_state[cell.id] == "_") {
        current_state[cell.id] = current_player
        current_player = current_player == "X" ? "O" : "X"
    }

    display_board();
    [next_box_id, next_box_state] = get_box_number(current_state);

    if(next_box_id != -1) {
        document.getElementById("menace_"+next_box_id).style.border = "4px solid red"
        document.getElementById("menace_"+next_box_id).style.boxSizing = "border-box"
        document.getElementById("next_box_number").innerHTML = next_box_id

        let state_grid = create_box_hint(next_box_state)

        document.getElementById("next_box_hint").innerHTML = ""
        document.getElementById("next_box_hint").appendChild(state_grid)
    }
}

function create_box_hint(next_box_state) {
    let table = document.createElement("table");

    for (let i = 0; i < next_box_state.length; i++) {
        if (i % 3 === 0) {
            var row = document.createElement("tr");
            table.appendChild(row);
        }

        let cell = document.createElement("td");
        
        if(next_box_state[i] != "_") {
            if(next_box_state[i] == "O") {
                cell.innerHTML = circle_svg
            } else {
                cell.innerHTML = cross_svg
            }
        }

        row.appendChild(cell);
    }

    return table;
}

function display_board() {
    console.log(current_state)
    for(let i = 0; i < 9; i++) {
        if(current_state[i] != "_") {
            if(current_state[i] == "O") {
                document.getElementById(i).innerHTML = circle_svg
            } else {
                document.getElementById(i).innerHTML = cross_svg
            }
        } else {
            document.getElementById(i).innerHTML = ""
        }
    }
}

function reset() {
    location.reload()
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

    for(let indices of symmetries) {
        let symmetry = []
        for(indice of indices) {
            symmetry.push(current_state[indice])
        }

        for(let move_number=0; move_number < Object.keys(all_states_dict).length; move_number++) {
                boards = all_states_dict[move_number];

                for (const [key, value] of Object.entries(boards)) {
                    
                    if(value.toString() == symmetry.toString()) {
                        return [parseInt(key), value]
                    }
                }
            }
    }

    return [-1, null]
}

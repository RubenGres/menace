# %% [markdown]
# # Get all board states used in menace

# %% [markdown]
# There should be should be 304 states used in menace, if you account for symetries and the fact that you only account for states where it's X (menac e) turn.  
# This script generates a all_states json with the move count, state id and the board state itself.  
# You can create all the labels files using the create_labels_svg notebook and the state json.

# %%
import itertools

def is_winner(board):
    win_conditions = [
        [0,1,2], [3,4,5], [6,7,8],  # lines
        [0,3,6], [1,4,7], [2,5,8],  # columns
        [0,4,8], [2,4,6],           # diagonals
    ]

    for player in ['X', 'O']:
        for condition in win_conditions:
            if all(board[i] == player for i in condition):
                return True
    
    return False

def generate_symmetries(board):
    indices_list = [
        [0,1,2,3,4,5,6,7,8],  # Indentity
        [2,5,8,1,4,7,0,3,6],  # Rotation 90°
        [8,7,6,5,4,3,2,1,0],  # Rotation 180°
        [6,3,0,7,4,1,8,5,2],  # Rotation 270°
        [2,1,0,5,4,3,8,7,6],  # Horizontal mirror
        [6,7,8,3,4,5,0,1,2],  # vertical mirror
        [8,5,2,7,4,1,6,3,0],  # diagonal mirror \
        [0,3,6,1,4,7,2,5,8],  # diagonal mirror /
    ]
    
    symmetries = set()
    for indices in indices_list:
        transformed = tuple(board[i] for i in indices)
        symmetries.add(transformed)
        
    return symmetries

def remove_symmetries(board_list):
    unique_boards = []
    visited_boards = set()

    for board in board_list:
        symmetries = generate_symmetries(board)
        
        chosen_board = max(symmetries)
        
        if chosen_board not in visited_boards:
            unique_boards.append(chosen_board)
            visited_boards.update(symmetries)

    return unique_boards


def print_board(board):
    print('\n'.join([''.join(board[i:i+3]) for i in range(0,9,3)]))


def next_states(board):
    next_player = 'O'
    if board.count('X') == board.count('O'):
        next_player = 'X'
    
    states = []
    for i, square in enumerate(board):
        if square == "_":
            next_board = board.copy()
            next_board[i] = next_player
            states.append(next_board)

    return states

# %%
def generate_all_states(board, visited_states):
    if is_winner(board):
        return

    for next_board in next_states(board):
        symmetries = generate_symmetries(next_board)
        if not any(symmetry in visited_states for symmetry in symmetries):
            visited_states.add(tuple(next_board))
            generate_all_states(next_board, visited_states)

# valid to be a box in menace
def is_valid_state(board):
    if is_winner(board):
        return False
    
    return board.count('X') == board.count('O')

starting_board = ['_'] * 9

visited_states = set()
visited_states.add(tuple(starting_board))

generate_all_states(starting_board, visited_states)

all_unique_states = list(visited_states)

x_turn_states = list(filter(is_valid_state, all_unique_states))
no_last_move = list(filter(lambda board: board.count('_') != 1, x_turn_states))
no_last_move_unique = remove_symmetries(no_last_move)

print(f"Unique states: {len(all_unique_states)}")
print(f"x_turn_states states: {len(x_turn_states)}")
print(f"no_last_move states: {len(no_last_move_unique)}")

# %% [markdown]
# # Divide all boards by move count

# %%
all_states = [x[::-1] for x in no_last_move_unique]
all_states.sort()
all_states.reverse()

# %%
from collections import defaultdict

def split_by_moves(board_list):
    split_dict = defaultdict(list)
    for board in board_list:
        move_count = board.count('X')
        split_dict[move_count].append(board)
    return split_dict

split_boards = split_by_moves(all_states)

for move_count, boards in split_boards.items():
    print(f"Move count {move_count}: {len(boards)} boards")


# %% [markdown]
# ## Assign unique id to each state to label the box

# %%
def assign_ids(split_boards):
    unique_id = 0
    board_with_ids = {}
    
    # Sort the split_boards dictionary by move count (keys)
    for move_count in sorted(split_boards.keys()):
        board_with_ids_count = {}
        for board in split_boards[move_count]:
            board_with_ids_count[unique_id] = board
            unique_id += 1
        board_with_ids[move_count] = board_with_ids_count
            
    return board_with_ids

board_with_ids = assign_ids(split_boards)

# %% [markdown]
# # Save as JSON

# %%
import json

split_boards[0]

with open("all_states.json", "w") as outfile: 
    json.dump(board_with_ids, outfile, indent=4)



# %% [markdown]
# # Create the svg to print menace labels

# %% [markdown]
# Using the all_states.json file generated with the get_states notebook, create the svg file that will be used to print the labels for each box.   
# 
# The labels are split in 4 files, each representing a move. For better results print each of theses in a different color! :)  
# 
# Each label is 36mm x 11mm to fit the matchbox

# %%
import json
import os

# %%
# load file
with open('all_states.json', 'r') as f:
    states = json.load(f)

# %%
def draw_board(board, x_offset, y_offset, cell_size, item_scale=0.5, stroke_width=2):
    svg_elements = []

    grid_size = cell_size * 3

    # drawing the board grid
    for i in range(1, 3):
        x = x_offset + i * cell_size
        svg_elements.append(f'<line x1="{x}" y1="{y_offset}" x2="{x}" y2="{y_offset + grid_size}" stroke="black" />')
    
    for i in range(1, 3):
        y = y_offset + i * cell_size
        svg_elements.append(f'<line x1="{x_offset}" y1="{y}" x2="{x_offset + grid_size}" y2="{y}" stroke="black" />')

    # drawing the X and O
    for idx, val in enumerate(board):
        col = idx % 3
        row = idx // 3
        
        # center of the cell
        cx = x_offset + col * cell_size + cell_size / 2
        cy = y_offset + row * cell_size + cell_size / 2

        # draw X 
        if val == 'X':
            x1 = cx - (cell_size/2) * item_scale
            y1 = cy - (cell_size/2) * item_scale
            x2 = cx + (cell_size/2) * item_scale
            y2 = cy + (cell_size/2) * item_scale
            
            svg_elements.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="black" stroke-width="{stroke_width}"/>')
            svg_elements.append(f'<line x1="{x1}" y1="{y2}" x2="{x2}" y2="{y1}" stroke="black" stroke-width="{stroke_width}"/>')
        
        # draw O
        elif val == 'O':
            r = item_scale/2 * cell_size
            svg_elements.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="black" fill="none" stroke-width="2"/>')

    return '\n'.join(svg_elements)

# %%
def draw_label(board, state_id, x_offset, y_offset, cell_size, font_size=27, width_px=136, height_px=41):
    svg_elements = []
    
    # padding and margins in px
    label_padding_x = 10
    label_padding_y = 2
    text_margin_x = 40
    text_margin_y = font_size / 3

    # draw board
    board_svg = draw_board(board, label_padding_x + x_offset, label_padding_y + y_offset, cell_size)
    svg_elements.append(board_svg)

    # draw handle placeholder
    r = cell_size/2
    cx = x_offset + width_px/2
    cy = label_padding_y + y_offset + (cell_size*3)/2
    svg_elements.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="black" fill="none" stroke-width="2"/>')

    # draw text
    grid_size = cell_size * 3
    
    text_x = x_offset + grid_size + text_margin_x
    text_y = y_offset + grid_size / 2 + text_margin_y
    
    text_x += label_padding_x
    text_y += label_padding_y
    
    svg_elements.append(f'<text x="{text_x}" y="{text_y}" font-size="{font_size}" fill="black" font-family="Consolas, Courier New, monospace">{state_id}</text>')

    # draw label rectangle
    rect_x = x_offset
    rect_y = y_offset
    svg_elements.append(
        f'<rect x="{rect_x}" y="{rect_y}" width="{width_px}" height="{height_px}" stroke="red" fill="none" rx="10" ry="10"/>'
    )

    return '\n'.join(svg_elements)

# %%
import math

mm_to_px = 96 / 25.4 # at 96 DPI
label_width_px = 36 * mm_to_px
label_height_px = 11 * mm_to_px
cell_size = 12
num_columns = math.floor(210 * mm_to_px / label_width_px) # A4 paper is 210mm across
num_columns

# %%
for move_number, states in states.items():
    svg_elements = []   

    num_states = len(states)
    num_rows = (num_states + num_columns - 1) // num_columns
    
    total_width = num_columns * label_width_px
    total_height = num_rows * label_height_px
    
    # SVG header
    svg_header = f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_width}" height="{total_height}">'
    svg_elements.append(svg_header)

    idx = 0
    for state_id, board in states.items():
        col = idx % num_columns
        row = idx // num_columns
        
        x_offset = col * label_width_px
        y_offset = row * label_height_px

        label_text = int(state_id) + 1

        svg_code = draw_label(board, label_text, x_offset, y_offset, cell_size)
        svg_elements.append(svg_code)
        idx += 1

    svg_elements.append('</svg>')

    svg_content = '\n'.join(svg_elements)

    # save the svg in the ./svg/ directory
    os.makedirs("./svg", exist_ok=True)
    filename = f'svg/move_{move_number}.svg'
    with open(filename, 'w') as f:
        f.write(svg_content)

# %%




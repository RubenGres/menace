# ❌ MENACE✨ ⭕


[MENACE](https://en.wikipedia.org/wiki/Matchbox_Educable_Noughts_and_Crosses_Engine) (Matchbox Educable Noughts and Crosses Engine) is a tic-tac-toe *mechanical* artificial intelligence invented by Donald Michie in 1960. It uses reinforcement learning in the form of colored beads and matchboxes.

This repository contains my implementation, including:
- Code to generate the 304 states for every matchbox
- All files necessary to recreate the physical box
- A web interface to help identify the correct matchbox for a given state

<br>
<center>
<img src="media/menca_photo.png" alt="Image" width="300"/>
</center>

## Video Presentation
TODO

## How It Works
MENACE learns by adjusting the number of beads in each matchbox based on game outcomes, mimicking reinforcement learning principles:
- **Loss:** Each bead used in the game is removed from the corresponding box.
- **Win:** Three beads of the used color are added to each box involved in the game.
- **Draw:** One bead is added to each box involved.

## Building Materials
- 5mm planks for the outer structure
- 3mm planks for the inner structure
- 304x matchboxes (dimensions: 36.5 x 53 x 11.6 mm)
- ??x colored beads
- 4x hinges
- Paper for printing the box labels

## Dimensions
The main box has dimensions **(311 x 472 x 46) mm**. It contains vertical and horizontal planks that provide structure and hold the 304 matchboxes in place. There are two boxes between each vertical plank and five between each horizontal plank. The whole structure is assembled using box joints.

Matchboxes are divided into four categories, corresponding to the turn MENACE plays:
- **Move count 3:** 183 boards
- **Move count 2:** 108 boards
- **Move count 0:** 1 board
- **Move count 1:** 12 boards

A tic-tac-toe board and game pieces are also laser-cut for participants to play physically.

### Box Construction (5mm Planks)
- **1x Backpane:** (311 x 472) mmm
- **2x Top/Bottom Pane:** (311 x 46) mm

### Inner Structure (3mm Planks)
- **3x Vertical Planks:** (301mm x 3mm)
- **7x Horizontal Planks:** (461.8mm x 3mm)

## Web Interface
A web interface is available to determine the correct matchbox for a given state.

To use it, open `interface/index.html` in your browser or visit [rubengr.es/menace](https://rubengr.es/menace).

<center>
<img src="media/menca_ui.png" alt="Web UI of the helper"/>
</center>

## Training Statistics
By monitoring the changes in the first matchbox, we can analyze MENACE's performance, similar to tracking loss in a machine learning model.

TODO: Add stats once training is complete.


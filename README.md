# Advanced Chess-Like Game

## Overview
This project is the implementation of a board game using HTML, CSS, and JavaScript. It provides a web-based interface for playing a strategic board game with drag-and-drop functionality for piece placement and WebSocket communication for real-time updates.

## Requirements:
```
Python 3.12.5
```

## Setup
### Clone the repository:
```
git clone https://github.com/raghuttamapadakandla/raghuttama-padakandla-21bcy10170.git
```
### Navigate to the repository and Setup Virtual Environment
```
python -m venv venv
```
### Activate the Virtual Environment
```
.\venv\Scripts\activate
```
### Install Dependencies:
```
pip install requirements.txt
```
### Establish Websocket communication
```
python app.py
```
### Run the Flask Server to Render Frontend:
```
python server.py
```
### The frontend rendered can be used to play the two-player game

## Features
- **WebSocket Communication**: Establishes a connection with the server for real-time game updates and player interactions.
- **Drag-and-Drop Functionality**: Allows players to drag and drop game pieces onto the board.
- **Game Initialization**: Enables players to start the game with a default lineup or custom placements.
- **Game Logic**: Handles piece movement, game rules, and win conditions.
- **Event Handling**: Manages user interactions for submitting moves and lineups.

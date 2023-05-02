# Word Hunt Solver

A Word Hunt Solver web application that helps users find words in a 4x4 grid. The solver uses a depth-first search algorithm and a trie data structure to efficiently find valid words.

It is designed for the iMessage "Game Pigeon" game "Word Hunt". 

![Screenshot of Word Hunt Solver](https://raw.githubusercontent.com/0mlml/wordhunt/main/img/screenshot.png)

## Live Demo

You can try the live demo of the application at [https://0mlml.github.io/wordhunt](https://0mlml.github.io/wordhunt)

## Features

- Interactive UI to input a 4x4 grid of letters
- Displays found words with their positions in the grid
- Highlights the path of each word in the grid with a gradient from light to dark green
- Trie data structure for efficient word lookup
- Depth-first search algorithm to find valid words in the grid
- Heuristically finds the best solutions by prioritizing longer words

## How to Use

1. Visit the [live demo site](https://0mlml.github.io/wordhunt)
2. Input a 16 character string of letters into the relevant field
3. Click the "Solve" button to find all valid words in the grid
4. Browse the list of found words, and click on any word to highlight its path in the grid
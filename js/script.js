const inputElement = document.getElementById('grid-input');
const solveElement = document.getElementById('solve-button');

const gridElement = document.getElementById('grid');
const resultsElement = document.getElementById('results-list');
const nodesElement = document.getElementById('nodes');

const solver = new Solver(gridElement, resultsElement, nodesElement);
solver.updateInput('catdwofoirdgnoas');

solveElement.addEventListener('click', () => {
  solver.updateInput(inputElement.value);
  solver.startSolving();
});
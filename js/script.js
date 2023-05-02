const inputElement = document.getElementById('grid-input');
const solveElement = document.getElementById('solve-button');

const gridElement = document.getElementById('grid');
const resultsElement = document.getElementById('results-list');
const nodesElement = document.getElementById('nodes');

const solver = new Solver(gridElement, resultsElement, nodesElement);
solver.updateInput('catdwofoirdgnoas');
solver.startSolving();

solveElement.addEventListener('click', () => {
  if (!solver.stopped) {
    solver.stopSolving();
    return;
  }
  if (inputElement.value.length !== 16) {
    alert('Input must be 16 characters long');
    return;
  }
  solver.updateInput(inputElement.value);
  solver.startSolving();
});
const inputElement = document.getElementById('grid-input');
const solveElement = document.getElementById('solve-button');

const gridElement = document.getElementById('grid');
const gridOverlayElement = document.getElementById('grid-overlay');
const resultsElement = document.getElementById('results-list');

const solver = new Solver(gridElement, gridOverlayElement, resultsElement);
solver.updateInput('catdwofoirdgnoas');
solver.startSolving();

solveElement.addEventListener('click', () => {
	if (!solver.stopped) {
		solver.stopSolving();
	}
	if (inputElement.value.length !== 16) {
		alert('Input must be 16 characters long');
		return;
	}
	solver.updateInput(inputElement.value);
	solver.startSolving();
});

const showGradientElement = document.getElementById('show-gradient');
const showLineElement = document.getElementById('show-line');

const optionChangeListener = () => {
	solver.displayLastSolution();
}

showGradientElement.addEventListener('change', optionChangeListener);
showLineElement.addEventListener('change', optionChangeListener);
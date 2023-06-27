const inputElement = document.getElementById("grid-input");
const solveElement = document.getElementById("solve-button");

const gridElement = document.getElementById("grid");
const gridOverlayElement = document.getElementById("grid-overlay");
const resultsElement = document.getElementById("results-list");

const solver = new Solver(gridElement, gridOverlayElement, resultsElement);

const params = new URLSearchParams(window.location.search);
let gridString = params.has("grid") ? params.get("grid").toLowerCase() : null;

if (gridString && gridString.replace(/\W/g, "") !== gridString) {
	console.error("Invalid URL 'grid' parameter. (Non-alphabetical characters present)");
} else if (gridString && !layouts.find(e => e.tiles === gridString.length)) {
	console.error("Invalid URL 'grid' parameter. (Length not any of existing layouts)");
	gridString = null;
}

if (!gridString) {
	gridString = "catdwofoirdgnoas";
}

solver.updateInput(gridString);
solver.startSolving();


const updateURLParams = () => {
	const url = new URL(window.location.href);
	url.searchParams.set("grid", solver.input);
	window.history.replaceState(null, null, url);
}

solveElement.addEventListener("click", () => {
	if (!solver.stopped) {
		solver.stopSolving();
	}
	if (!layouts.find(e => e.tiles === gridString.length)) {
		alert(`Input length must be any of: ${layouts.map(e => e.tiles).join(", ")}`);
		return;
	}
	solver.updateInput(inputElement.value);
	updateURLParams();
	solver.startSolving();
});

const showGradientElement = document.getElementById("show-gradient");
const showLineElement = document.getElementById("show-line");
const darkThemeElement = document.getElementById("dark-theme-toggle");

const optionChangeListener = () => {
	solver.displayLastSolution();
};

showGradientElement.addEventListener("change", optionChangeListener);
showLineElement.addEventListener("change", optionChangeListener);
darkThemeElement.addEventListener("change", optionChangeListener);

const darkThemeLink = document.getElementById("dark-theme");

if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	darkThemeLink.disabled = false;
	darkThemeElement.checked = true;
}

darkThemeElement.addEventListener("change", () => {
	darkThemeLink.disabled = !darkThemeElement.checked;
});
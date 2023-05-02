class TrieNode {
	constructor() {
		this.children = {};
		this.terminal = false;
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode();
	}

	insert(word) {
		let currentNode = this.root;
		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			if (!currentNode.children[char]) {
				currentNode.children[char] = new TrieNode();
			}
			currentNode = currentNode.children[char];
		}
		currentNode.terminal = true;
	}

	search(word) {
		let currentNode = this.root;
		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			if (!currentNode.children[char]) {
				return false;
			}
			currentNode = currentNode.children[char];
		}
		return currentNode.terminal;
	}

	startsWith(prefix) {
		let currentNode = this.root;
		for (let i = 0; i < prefix.length; i++) {
			const char = prefix[i];
			if (!currentNode.children[char]) {
				return false;
			}
			currentNode = currentNode.children[char];
		}
		return true;
	}
}

class Solver {
	constructor(grid, overlay, results) {
		this.gridElement = grid;
		this.overlayElement = overlay;
		this.resultsElement = results;

		this.#resizeOverlayElement();
		this.overlayCtx = this.overlayElement.getContext('2d');

		this.lastShown = null;

		this.dictionary = new Trie();
		WORDLIST.forEach(word => this.dictionary.insert(word));

		this.input = '';

		this.results = [];
		this.stopped = false;
		this.nodes = 0;
	}

	#resetGridElement() {
		for (const idx in this.gridElement.children) {
			if (isNaN(idx)) {
				continue;
			}
			this.gridElement.children[idx].innerText = this.input[idx];
			this.gridElement.children[idx].style.backgroundColor = '#ccc';
		}
	}

	#drawSolutionOverlay(solution) {
		this.overlayCtx.clearRect(0, 0, this.overlayElement.width, this.overlayElement.height);

		const showLineElement = document.getElementById('show-line');
		if (showLineElement && !showLineElement.checked) {
			return;
		}

		this.#resizeOverlayElement();


		this.overlayCtx.beginPath();
		this.overlayCtx.lineWidth = 4;
		this.overlayCtx.strokeStyle = 'red';

		const cellWidth = this.gridElement.children[0].offsetWidth;
		const cellHeight = this.gridElement.children[0].offsetHeight;

		const getCellCenter = (cellIdx) => {
			const row = Math.floor(cellIdx / 4);
			const col = cellIdx % 4;
			const x = col * cellWidth + cellWidth / 2;
			const y = row * cellHeight + cellHeight / 2;
			return { x, y };
		};

		const firstCellCenter = getCellCenter(solution[0]);
		this.overlayCtx.moveTo(firstCellCenter.x, firstCellCenter.y);

		for (let i = 1; i < solution.length; i++) {
			const cellCenter = getCellCenter(solution[i]);
			this.overlayCtx.lineTo(cellCenter.x, cellCenter.y);
		}

		this.overlayCtx.stroke();

		const drawArrow = (fromX, fromY, toX, toY) => {
			const headLength = 20;
			const angle = Math.atan2(toY - fromY, toX - fromX);

			this.overlayCtx.beginPath();
			this.overlayCtx.moveTo(toX, toY);
			this.overlayCtx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
			this.overlayCtx.moveTo(toX, toY);
			this.overlayCtx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));

			this.overlayCtx.stroke();
		};

		const lastCellCenter = getCellCenter(solution[solution.length - 1]);
		const prevLastCellCenter = getCellCenter(solution[solution.length - 2]);
		drawArrow(prevLastCellCenter.x, prevLastCellCenter.y, lastCellCenter.x, lastCellCenter.y);
	}


	#highlightGridElements(solution) {
		const showGradientElement = document.getElementById('show-gradient');

		const getColor = (idx, total) => {
			const hue = 120;

			if (showGradientElement && !showGradientElement.checked) {
				return `hsl(${hue}, 100%, 90%)`;
			}

			const lightness = 90 - (idx / total) * 60;
			return `hsl(${hue}, 100%, ${lightness}%)`;
		};

		for (const [idx, cellIdx] of solution.entries()) {
			const color = getColor(idx, solution.length);
			this.gridElement.children[cellIdx].style.backgroundColor = color;
		}
	}

	#showSolution(solution) {
		this.#highlightGridElements(solution);
		this.#drawSolutionOverlay(solution);
		this.lastShown = solution;
	}

	displayLastSolution() {
		if (this.lastShown) {
			this.#showSolution(this.lastShown);
		}
	}

	#resizeOverlayElement() {
		const gridRect = this.gridElement.getBoundingClientRect();

		this.overlayElement.style.width = gridRect.width + 'px';
		this.overlayElement.style.height = gridRect.height + 'px';

		this.overlayElement.width = gridRect.width;
		this.overlayElement.height = gridRect.height;

		this.overlayElement.style.top = window.scrollY + gridRect.top + 'px';
		this.overlayElement.style.left = window.scrollX + gridRect.left + 'px';
	}


	getSolutionWord(solution) {
		const word = solution.map(idx => this.input[idx]).join('');
		return word;
	}

	getSolutionByIndex(idx) {
		return this.results[idx];
	}

	#pruneDuplicateResults() {
		const uniqueResults = [];
		const seen = new Set();

		for (const result of this.results) {
			const key = this.getSolutionWord(result);

			if (!seen.has(key)) {
				uniqueResults.push(result);
				seen.add(key);
			}
		}

		this.results = uniqueResults;
	}

	updateInput(input) {
		this.input = input;
		this.#resetGridElement();
		this.results = [];
		this.nodes = 0;
	}

	getMatrixFromInput() {
		const matrix = [];
		for (let i = 0; i < 4; i++) {
			matrix.push(this.input.slice(i * 4, (i + 1) * 4));
		}
		return matrix;
	}

	#resetResultsElement() {
		this.resultsElement.innerHTML = '';
	}

	#updateResultsElement() {
		const sortedResults = this.results.sort((a, b) => {
			const wordA = this.getSolutionWord(a);
			const wordB = this.getSolutionWord(b);
			return wordB.length - wordA.length;
		});

		for (const result of sortedResults) {
			const li = document.createElement('li');
			li.innerText = this.getSolutionWord(result);
			li.addEventListener('click', () => {
				this.#resetGridElement();
				this.#showSolution(result);
				const currentWordElement = document.getElementById('current-word');
				if (currentWordElement) {
					currentWordElement.innerText = this.getSolutionWord(result);
				}
			});
			this.resultsElement.appendChild(li);
		}
	}

	#updateNodesElement() {
		const nodesElement = document.getElementById('nodes');
		if (nodesElement) {
			nodesElement.innerText = this.nodes;
		}
	}

	#updateTimeElement(start) {
		const timeElement = document.getElementById('time');
		if (timeElement) {
			timeElement.innerText = `${(performance.now() - start)}ms`;
		}
	}

	startSolving() {
		this.stopped = false;
		this.results = [];
		this.nodes = 0;
		this.#resetGridElement();
		this.overlayCtx.clearRect(0, 0, this.overlayElement.width, this.overlayElement.height);
		this.#resetResultsElement();
		this.#solve();
	}

	stopSolving() {
		this.stopped = true;
	}

	#solve() {
		const start = performance.now();

		const directions = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1],
			[1, -1], [1, 0], [1, 1]
		];

		const visited = new Set();

		const dfs = (i, j, path) => {
			if (this.stopped) return;

			const key = `${i},${j}`;
			if (visited.has(key)) return;

			path.push(i * 4 + j);
			visited.add(key);

			const currentWord = this.getSolutionWord(path);
			if (currentWord.length >= 3 && this.dictionary.search(currentWord) && !this.results.some(result => result.toString() === path.toString())) {
				this.results.push([...path]);
			}

			if (this.dictionary.startsWith(currentWord)) {
				for (const [di, dj] of directions) {
					const ni = i + di;
					const nj = j + dj;

					if (ni >= 0 && ni < 4 && nj >= 0 && nj < 4) {
						dfs(ni, nj, path);
						this.nodes++;
					}
				}
			}

			visited.delete(key);
			path.pop();
		};

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				dfs(i, j, []);
			}
		}

		this.#resetResultsElement();
		this.#updateNodesElement();
		this.#pruneDuplicateResults();
		this.#updateResultsElement();

		this.#updateTimeElement(start);
	}
}
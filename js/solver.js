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
  constructor(grid, results, nodes) {
    this.gridElement = grid;
    this.resultsElement = results;
    this.nodesElement = nodes;

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

  #highlightGridElements(solution) {
    for (const idx of solution) {
      this.gridElement.children[idx].style.backgroundColor = 'green';
    }
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
      const key = result.toString();

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
  }

  getMatrixFromInput() {
    const matrix = [];
    for (let i = 0; i < 4; i++) {
      matrix.push(this.input.slice(i * 4, (i + 1) * 4));
    }
    return matrix;
  }

  #resetResultsElement() {
    for (const child of this.resultsElement.children) {
      child.remove();
    }
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
        this.#highlightGridElements(result);
        const currentWordElement = document.getElementById('current-word');
        if (currentWordElement) {
          currentWordElement.innerText = this.getSolutionWord(result);
        }
      });
      this.resultsElement.appendChild(li);
    }
  }

  #updateNodesElement() {
    this.nodesElement.innerText = this.nodes;
  }

  startSolving() {
    this.stopped = false;
    this.results = [];
    this.nodes = 0;
    this.#resetGridElement();
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
            this.#updateNodesElement();
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
    this.#pruneDuplicateResults();
    this.#updateResultsElement();

    const end = performance.now();
    const time = end - start;

    const timeElement = document.getElementById('time');
    if (timeElement) {
      timeElement.innerText = `${time.toFixed(2)} ms`;
    }
  }
}
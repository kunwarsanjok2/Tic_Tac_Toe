 const WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let board, current, over, scores, mode, cpuThinking;
  scores = { X: 0, O: 0, D: 0 };
  mode = 'pvp';

  function setMode(m) {
    mode = m;
    document.getElementById('btn-pvp').classList.toggle('active', m === 'pvp');
    document.getElementById('btn-cpu').classList.toggle('active', m === 'cpu');
    resetGame();
  }

  function resetGame() {
    board = Array(9).fill('');
    current = 'X';
    over = false;
    cpuThinking = false;
    render();
    setStatus("X's turn");
  }

  function resetScore() {
    scores = { X: 0, O: 0, D: 0 };
    updateScore();
  }

  function setStatus(msg) {
    document.getElementById('status').textContent = msg;
  }

  function render(winLine = []) {
    const b = document.getElementById('board');
    b.innerHTML = '';
    board.forEach((v, i) => {
      const c = document.createElement('div');
      c.className = 'cell' +
        (v ? ' taken ' + v.toLowerCase() : '') +
        (winLine.includes(i) ? ' win' : '');
      c.textContent = v;
      c.onclick = () => play(i);
      b.appendChild(c);
    });
  }

  function updateScore() {
    document.getElementById('sx').textContent = scores.X;
    document.getElementById('so').textContent = scores.O;
    document.getElementById('sd').textContent = scores.D;
  }

  function checkWin(b, p) {
    return WINS.find(l => l.every(i => b[i] === p)) || null;
  }

  function isDraw(b) {
    return b.every(v => v);
  }

  function play(i) {
    if (over || board[i] || cpuThinking) return;
    board[i] = current;
    const line = checkWin(board, current);
    render(line || []);
    if (line) {
      scores[current]++;
      updateScore();
      setStatus(current + ' wins! 🎉');
      over = true;
    } else if (isDraw(board)) {
      scores.D++;
      updateScore();
      setStatus("It's a draw!");
      over = true;
    } else {
      current = current === 'X' ? 'O' : 'X';
      setStatus(current + "'s turn");
      if (mode === 'cpu' && current === 'O') doCPU();
    }
  }

  function doCPU() {
    cpuThinking = true;
    setTimeout(() => {
      const move = getBestMove();
      cpuThinking = false;
      play(move);
    }, 380);
  }

  function getBestMove() {
    // Try to win
    for (const l of WINS) {
      const own = l.filter(i => board[i] === 'O');
      const empty = l.filter(i => !board[i]);
      if (own.length === 2 && empty.length === 1) return empty[0];
    }
    // Block player
    for (const l of WINS) {
      const opp = l.filter(i => board[i] === 'X');
      const empty = l.filter(i => !board[i]);
      if (opp.length === 2 && empty.length === 1) return empty[0];
    }
    // Take center
    if (!board[4]) return 4;
    // Take a corner
    const corners = [0, 2, 6, 8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    // Take a side
    const sides = [1, 3, 5, 7].filter(i => !board[i]);
    if (sides.length) return sides[Math.floor(Math.random() * sides.length)];
    return board.findIndex(v => !v);
  }

  resetGame();
(function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 270; // suitable for 580x580 canvas with border

    const numbersOrder = [
      0, 32, 15, 19, 4, 21, 2, 25,
      17, 34, 6, 27, 13, 36, 11, 30,
      8, 23, 10, 5, 24, 16, 33, 1,
      20, 14, 31, 9, 22, 18, 29, 7,
      28, 12, 35, 3, 26
    ];

    const secteurs = {
      'Voisins du Zéro': [0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35],
      'Tiers du Cylindre': [5,8,10,11,13,16,23,24,27,30,33,36],
      'Orphelins': [1,6,9,14,17,20,31,34],
      'Jeu Zero': [12,15,18,19,22,25,32]
    };

    const sectorColors = {
      'Voisins du Zéro': '#3c8dbc',
      'Tiers du Cylindre': '#d9534f',
      'Orphelins': '#f0ad4e',
      'Jeu Zero': '#5cb85c',
      'Zero': '#27ae60',
      'None': '#ccc'
    };

    const redNumbers = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];

    function getSector(num) {
      if (num === 0) return 'Zero';
      if (secteurs['Voisins du Zéro'].includes(num)) return 'Voisins du Zéro';
      if (secteurs['Tiers du Cylindre'].includes(num)) return 'Tiers du Cylindre';
      if (secteurs['Orphelins'].includes(num)) return 'Orphelins';
      if (secteurs['Jeu Zero'].includes(num)) return 'Jeu Zero';
      return 'None';
    }

    let selectedIndices = [];
    let historyNumbers = [];

    const addHistoryToggleBtn = document.getElementById('addHistoryToggle');
    const resetSelectionBtn = document.getElementById('resetSelectionBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyContainer = document.getElementById('historyContainer');
    const historyList = document.getElementById('historyList');

    let isAddHistoryMode = false;

    function updateHistoryDisplay() {
      if(historyNumbers.length === 0) {
        historyContainer.style.display = 'none';
        historyList.innerHTML = '';
        return;
      }
      historyContainer.style.display = 'block';
      historyList.innerHTML = '';

      historyNumbers.forEach(num => {
        const span = document.createElement('span');
        span.className = 'history-number';
        span.textContent = num;

        // color text to match roulette number
        if(num === 0) span.classList.add('zero'); // green zero
        else if(redNumbers.includes(num)) span.classList.add('red'); // red numbers
        else span.classList.add('black'); // black numbers

        span.title = 'Double-click to remove from history';
        span.style.cursor = 'pointer';
        span.addEventListener('dblclick', () => {
          historyNumbers = historyNumbers.filter(n => n !== num);
          updateHistoryDisplay();
          drawWheel();
        });
        historyList.appendChild(span);
      });
    }

    function drawWheel() {
      const total = numbersOrder.length;
      const anglePerSegment = (2 * Math.PI) / total;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for(let i = 0; i < total; i++) {
        const num = numbersOrder[i];
        const sector = getSector(num);
        const sectorColor = sectorColors[sector] || sectorColors['None'];

        const startAngle = i * anglePerSegment - Math.PI / 2;
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = sectorColor;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();

        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.75;
        const x = centerX + Math.cos(midAngle) * textRadius;
        const y = centerY + Math.sin(midAngle) * textRadius;

        let numColorBG = 'black';
        if(num === 0) numColorBG = sectorColors['Zero'];
        else if (redNumbers.includes(num)) numColorBG = '#c0392b';
        else numColorBG = 'black';

        ctx.beginPath();
        ctx.fillStyle = numColorBG;
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num.toString(), x, y);
      }

      // Draw selection borders
      for(let i = 0; i < total; i++) {
        if(selectedIndices.includes(i)) {
          const startAngle = i * anglePerSegment - Math.PI / 2;
          const endAngle = startAngle + anglePerSegment;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.strokeStyle = 'aqua';
          ctx.lineWidth = 60;
          ctx.stroke();
        }
      }

      // Draw history icons
      for(let i = 0; i < total; i++) {
        const num = numbersOrder[i];
        if(historyNumbers.includes(num)) {
          const startAngle = i * anglePerSegment - Math.PI / 2;
          const endAngle = startAngle + anglePerSegment;
          const midAngle = (startAngle + endAngle) / 2;
          const textRadius = radius * 0.75;
          const x = centerX + Math.cos(midAngle) * textRadius;
          const y = centerY + Math.sin(midAngle) * textRadius;

          const iconRadius = 7;
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / dist;
          const uy = dy / dist;
          const iconDistance = 240 + iconRadius + 4;
          const iconX = centerX + ux * iconDistance;
          const iconY = centerY + uy * iconDistance;

          ctx.beginPath();
          ctx.fillStyle = 'yellow';
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.arc(iconX, iconY, iconRadius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#333';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('H', iconX, iconY);
        }
      }
    }

    function getSegmentFromClick(x, y) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist > radius) return null;

      let angle = Math.atan2(dy, dx);
      angle += Math.PI / 2;
      if(angle < 0) angle += 2 * Math.PI;

      const total = numbersOrder.length;
      const anglePerSegment = (2 * Math.PI) / total;
      let index = Math.floor(angle / anglePerSegment);

      if(index < 0) index = 0;
      else if(index >= total) index = total - 1;

      return index;
    }

    function toggleSelection(index) {
      const pos = selectedIndices.indexOf(index);
      if(pos > -1) selectedIndices.splice(pos, 1);
      else selectedIndices.push(index);
    }

    function addNumberToHistory(num) {
      if(!historyNumbers.includes(num)) {
        historyNumbers.push(num);
        updateHistoryDisplay();
      }
    }

    addHistoryToggleBtn.addEventListener('click', () => {
      isAddHistoryMode = !isAddHistoryMode;
      addHistoryToggleBtn.classList.toggle('active', isAddHistoryMode);
      addHistoryToggleBtn.textContent = '';
      const iconSpan = document.createElement('span');
      iconSpan.id = 'addHistoryIcon';
      addHistoryToggleBtn.appendChild(iconSpan);
      addHistoryToggleBtn.appendChild(document.createTextNode(isAddHistoryMode ? 'History Add: On' : 'History Add: Off'));
      addHistoryToggleBtn.setAttribute('aria-pressed', isAddHistoryMode.toString());
    });

    resetSelectionBtn.addEventListener('click', () => {
      selectedIndices = [];
      drawWheel();
    });

    clearHistoryBtn.addEventListener('click', () => {
      historyNumbers = [];
      updateHistoryDisplay();
      drawWheel();
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const clickedIndex = getSegmentFromClick(cx, cy);
      if(clickedIndex === null) return;

      const clickedNum = numbersOrder[clickedIndex];

      if(isAddHistoryMode) {
        addNumberToHistory(clickedNum);
      } else {
        toggleSelection(clickedIndex);
      }
      drawWheel();
    });

    function init() {
      isAddHistoryMode = false;
      addHistoryToggleBtn.classList.remove('active');
      addHistoryToggleBtn.textContent = '';
      const iconSpan = document.createElement('span');
      iconSpan.id = 'addHistoryIcon';
      addHistoryToggleBtn.appendChild(iconSpan);
      addHistoryToggleBtn.appendChild(document.createTextNode('Add to History: Off'));
      addHistoryToggleBtn.setAttribute('aria-pressed', 'false');

      updateHistoryDisplay();
      drawWheel();
    }

    init();
  })();
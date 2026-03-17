let currentExpression = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let isShift = false;
let isAlpha = false;

const expressionEl = document.getElementById('expression');
const resultEl     = document.getElementById('result');
const displayEl    = document.getElementById('display');
const keyboardEl   = document.getElementById('keyboard');

const buttons = [
    // Row 1
    {label:'SHIFT',  val:'shift',  cls:'special'},
    {label:'ALPHA',  val:'alpha',  cls:'alpha'},
    {label:'MODE',   val:'mode',   cls:'text-xs'},
    {label:'ON',     val:'on',     cls:'text-xs bg-green-600 text-white'},
    {label:'MENU',   val:'menu',   cls:'text-xs'},
    {label:'◄',      val:'left',   cls:'text-2xl'},
    {label:'►',      val:'right',  cls:'text-2xl'},

    // Row 2
    {label:'sin',    val:'sin',    shift:'sin⁻¹', alpha:'A'},
    {label:'cos',    val:'cos',    shift:'cos⁻¹', alpha:'B'},
    {label:'tan',    val:'tan',    shift:'tan⁻¹', alpha:'C'},
    {label:'x²',     val:'²',      shift:'√'},
    {label:'log',    val:'log',    shift:'10ˣ'},
    {label:'ln',     val:'ln',     shift:'eˣ'},
    {label:'x⁻¹',    val:'⁻¹',     cls:'text-lg'},

    // Row 3
    {label:'(',      val:'('},
    {label:')',      val:')'},
    {label:'∫dx',    val:'∫',      cls:'text-lg'},
    {label:'d/dx',   val:"d'",     cls:'text-lg'},
    {label:'×10ˣ',   val:'×10^',   cls:'text-sm'},
    {label:'DEL',    val:'del',    cls:'operator text-red-400 font-bold'},
    {label:'AC',     val:'ac',     cls:'operator text-red-600 font-bold'},

    // Row 4 – numbers start
    {label:'7',      val:'7'},
    {label:'8',      val:'8'},
    {label:'9',      val:'9'},
    {label:'÷',      val:'/',      cls:'operator text-3xl'},
    {label:'x!',     val:'!',      cls:''},
    {label:'π',      val:'π'},
    {label:'Ans',    val:'Ans'},

    // Row 5
    {label:'4',      val:'4'},
    {label:'5',      val:'5'},
    {label:'6',      val:'6'},
    {label:'×',      val:'*',      cls:'operator text-3xl'},
    {label:'□',      val:'matrix', cls:'text-xs'},   // Matrix
    {label:'VCT',    val:'vector', cls:'text-xs'},
    {label:'STAT',   val:'stat',   cls:'text-xs'},

    // Row 6
    {label:'1',      val:'1'},
    {label:'2',      val:'2'},
    {label:'3',      val:'3'},
    {label:'−',      val:'-',      cls:'operator text-3xl'},
    {label:'MATRIX', val:'mat',    cls:'text-xs'},
    {label:'VARIABLE',val:'var',   cls:'text-xs'},
    {label:'≡',      val:'const',  cls:'text-xs'},

    // Row 7
    {label:'0',      val:'0',      cls:'wide'},
    {label:'.',      val:'.'},
    {label:'+',      val:'+',      cls:'operator text-3xl'},
    {label:'=',      val:'=',      cls:'equals wide'}
];

function createKeyboard() {
    keyboardEl.innerHTML = '';
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `calc-btn ${b.cls || ''}`;
        btn.innerHTML = b.label;
        btn.dataset.val   = b.val;
        if (b.shift) btn.dataset.shift = b.shift;
        if (b.alpha) btn.dataset.alpha = b.alpha;
        btn.addEventListener('click', () => handlePress(b, btn));
        keyboardEl.appendChild(btn);
    });
}

function handlePress(config, el) {
    const val = isShift && config.shift ? config.shift :
                isAlpha && config.alpha ? config.alpha : config.val;

    if (val === 'shift') { isShift = !isShift; isAlpha = false; el.classList.toggle('!bg-amber-300'); return; }
    if (val === 'alpha') { isAlpha = !isAlpha; isShift = false; el.classList.toggle('!bg-blue-400'); return; }

    if (val === 'ac')     { currentExpression = ''; resultEl.textContent = ''; updateDisplay(); return; }
    if (val === 'del')    { currentExpression = currentExpression.slice(0,-1); updateDisplay(); return; }
    if (val === 'menu')   { alert('Main Menu: 1 Calculate  2 Statistics  3 Spreadsheet  4 Matrix  5 Vector ...'); return; }
    if (val === 'mode')   { alert('Angle: Degree / Radian / Gradian\nDisplay: MathI/MathO  etc.'); return; }
    if (val === '=')      { calculate(); return; }

    let append = val;
    if (val === '²')       append = '**2';
    if (val === '√')       append = 'Math.sqrt(';
    if (val === '10ˣ')     append = '10**(';
    if (val === 'eˣ')      append = 'Math.exp(';
    if (['sin','cos','tan','sin⁻¹','cos⁻¹','tan⁻¹','log','ln'].includes(val)) append += '(';

    currentExpression += append;
    updateDisplay();

    isShift = isAlpha = false;
}

function updateDisplay() {
    expressionEl.textContent = currentExpression || '0';
}

function calculate() {
    try {
        let expr = currentExpression
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/\²/g, '**2')
            .replace(/√/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/×10\^/g, '*10**');

        let res = eval(expr);
        resultEl.textContent = Number(res).toPrecision(10).replace(/\.?0+$/, '');

        history.unshift({ expr: currentExpression, res });
        if (history.length > 20) history.pop();
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();

        currentExpression = '';
    } catch {
        resultEl.textContent = 'Error';
    }
    updateDisplay();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800';
        div.innerHTML = `<div class="text-emerald-300 text-sm break-all">${item.expr}</div><div class="text-2xl mt-1">${item.res}</div>`;
        div.onclick = () => { currentExpression = item.expr; updateDisplay(); toggleHistory(); };
        list.appendChild(div);
    });
}

function toggleHistory() {
    document.getElementById('history-sidebar').classList.toggle('translate-x-full');
}

function clearHistory() {
    history = [];
    localStorage.clear();
    renderHistory();
}

// Init
window.onload = () => {
    displayEl.classList.add('powered');
    createKeyboard();
    updateDisplay();
    renderHistory();
};
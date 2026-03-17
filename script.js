let expression = '';
let angleMode = 'deg';
let isShift = false;
let lastResult = 0;

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const keyboardEl = document.getElementById('keyboard');

const buttons = [
    // Row 1
    { label: 'AC', val: 'ac', cls: 'delete' },
    { label: 'DEL', val: 'del', cls: 'delete' },
    { label: 'SHIFT', val: 'shift', cls: 'shift-btn' },
    { label: 'MODE', val: 'mode', cls: 'mode' },
    { label: '(', val: '(', cls: '' },
    { label: ')', val: ')', cls: '' },
    { label: '%', val: '%', cls: 'function' },

    // Row 2
    { label: 'sin', val: 'sin', shift: 'asin', cls: 'function' },
    { label: 'cos', val: 'cos', shift: 'acos', cls: 'function' },
    { label: 'tan', val: 'tan', shift: 'atan', cls: 'function' },
    { label: 'π', val: Math.PI, cls: 'function' },
    { label: 'e', val: Math.E, cls: 'function' },
    { label: '÷', val: '/', cls: 'operator' },
    { label: '×', val: '*', cls: 'operator' },

    // Row 3
    { label: 'log', val: 'log', shift: 'exp', cls: 'function' },
    { label: 'ln', val: 'ln', shift: 'exp', cls: 'function' },
    { label: 'log₂', val: 'log2', cls: 'function' },
    { label: 'x²', val: '**2', shift: 'sqrt', cls: 'function' },
    { label: 'x³', val: '**3', shift: 'cbrt', cls: 'function' },
    { label: 'xʸ', val: '**', cls: 'function' },
    { label: '−', val: '-', cls: 'operator' },

    // Row 4
    { label: '7', val: '7', cls: 'number' },
    { label: '8', val: '8', cls: 'number' },
    { label: '9', val: '9', cls: 'number' },
    { label: 'x!', val: 'fact', cls: 'function' },
    { label: '1/x', val: 'inv', cls: 'function' },
    { label: 'Ans', val: 'ans', cls: 'function' },
    { label: '+', val: '+', cls: 'operator' },

    // Row 5
    { label: '4', val: '4', cls: 'number' },
    { label: '5', val: '5', cls: 'number' },
    { label: '6', val: '6', cls: 'number' },
    { label: 'sinh', val: 'sinh', cls: 'function' },
    { label: 'cosh', val: 'cosh', cls: 'function' },
    { label: 'tanh', val: 'tanh', cls: 'function' },
    { label: '=', val: '=', cls: 'equals' },

    // Row 6
    { label: '1', val: '1', cls: 'number' },
    { label: '2', val: '2', cls: 'number' },
    { label: '3', val: '3', cls: 'number' },
    { label: 'Rnd', val: 'rnd', cls: 'function' },
    { label: 'EXP', val: 'E', cls: 'function' },
    { label: '|x|', val: 'abs', cls: 'function' },
    { label: 'STO', val: 'sto', cls: 'function' },

    // Row 7
    { label: '0', val: '0', cls: 'number' },
    { label: '.', val: '.', cls: 'number' },
    { label: '±', val: 'neg', cls: 'function' },
    { label: '⌊', val: 'floor', cls: 'function' },
    { label: '⌈', val: 'ceil', cls: 'function' },
    { label: 'MOD', val: 'mod', cls: 'function' },
    { label: 'RCL', val: 'rcl', cls: 'function' }
];

function createKeyboard() {
    keyboardEl.innerHTML = '';
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = `calc-btn ${b.cls}`;
        btn.textContent = b.label;
        btn.addEventListener('click', () => handleButton(b));
        keyboardEl.appendChild(btn);
    });
}

function handleButton(btn) {
    const val = btn.val;

    if (val === 'shift') {
        isShift = !isShift;
        updateButtons();
        return;
    }

    if (val === 'mode') {
        angleMode = angleMode === 'deg' ? 'rad' : 'deg';
        updateDisplay();
        return;
    }

    if (val === 'ac') {
        expression = '';
        isShift = false;
        updateDisplay();
        return;
    }

    if (val === 'del') {
        expression = expression.slice(0, -1);
        updateDisplay();
        return;
    }

    if (val === '=') {
        calculate();
        return;
    }

    // Handle shift functions
    if (isShift && btn.shift) {
        handleShiftFunction(btn.shift);
        isShift = false;
        updateButtons();
        return;
    }

    // Handle special functions
    if (typeof val === 'number') {
        expression += val.toString();
    } else if (val === 'ans') {
        expression += lastResult;
    } else if (val === 'rnd') {
        expression += Math.random();
    } else if (val === 'sin' || val === 'cos' || val === 'tan') {
        expression += val + '(';
    } else if (val === 'sinh' || val === 'cosh' || val === 'tanh') {
        expression += val + '(';
    } else if (val === 'log') {
        expression += 'Math.log10(';
    } else if (val === 'ln') {
        expression += 'Math.log(';
    } else if (val === 'log2') {
        expression += 'Math.log2(';
    } else if (val === 'sqrt') {
        expression += 'Math.sqrt(';
    } else if (val === 'cbrt') {
        expression += 'Math.cbrt(';
    } else if (val === 'abs') {
        expression += 'Math.abs(';
    } else if (val === 'floor') {
        expression += 'Math.floor(';
    } else if (val === 'ceil') {
        expression += 'Math.ceil(';
    } else if (val === 'fact') {
        expression += 'factorial(';
    } else if (val === 'inv') {
        expression += '1/(';
    } else if (val === 'neg') {
        expression += '-';
    } else if (val === 'mod') {
        expression += '%';
    } else if (val === 'E') {
        expression += 'e';
    } else {
        expression += val;
    }

    isShift = false;
    updateDisplay();
    updateButtons();
}

function handleShiftFunction(fn) {
    if (fn === 'asin') expression += 'asin(';
    else if (fn === 'acos') expression += 'acos(';
    else if (fn === 'atan') expression += 'atan(';
    else if (fn === 'exp') expression += 'Math.exp(';
    else if (fn === 'sqrt') expression += 'Math.sqrt(';
    else if (fn === 'cbrt') expression += 'Math.cbrt(';

    updateDisplay();
}

function factorial(n) {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function calculate() {
    try {
        let expr = expression;
        
        // Replace custom functions
        expr = expr.replace(/asin/g, 'Math.asin');
        expr = expr.replace(/acos/g, 'Math.acos');
        expr = expr.replace(/atan/g, 'Math.atan');
        expr = expr.replace(/Math\.sin/g, angleMode === 'deg' ? '(x=>Math.sin(x*Math.PI/180))' : 'Math.sin');
        expr = expr.replace(/Math\.cos/g, angleMode === 'deg' ? '(x=>Math.cos(x*Math.PI/180))' : 'Math.cos');
        expr = expr.replace(/Math\.tan/g, angleMode === 'deg' ? '(x=>Math.tan(x*Math.PI/180))' : 'Math.tan');
        expr = expr.replace(/sin/g, angleMode === 'deg' ? '(x=>Math.sin(x*Math.PI/180))' : 'Math.sin');
        expr = expr.replace(/cos/g, angleMode === 'deg' ? '(x=>Math.cos(x*Math.PI/180))' : 'Math.cos');
        expr = expr.replace(/tan/g, angleMode === 'deg' ? '(x=>Math.tan(x*Math.PI/180))' : 'Math.tan');
        expr = expr.replace(/sinh/g, 'Math.sinh');
        expr = expr.replace(/cosh/g, 'Math.cosh');
        expr = expr.replace(/tanh/g, 'Math.tanh');
        expr = expr.replace(/π/g, Math.PI);
        expr = expr.replace(/e(?![a-z])/g, Math.E);
        expr = expr.replace(/factorial/g, 'factorial');
        
        lastResult = eval(expr);
        resultEl.textContent = formatResult(lastResult);
        expression = '';
    } catch (e) {
        resultEl.textContent = 'Error';
    }
}

function formatResult(num) {
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-5 && num !== 0)) {
        return num.toExponential(5);
    }
    return Math.round(num * 1e10) / 1e10;
}

function updateDisplay() {
    expressionEl.textContent = expression;
    if (!expression) resultEl.textContent = '0';
    const mode = angleMode === 'deg' ? 'DEG' : 'RAD';
    document.title = `Calc - ${mode}`;
}

function updateButtons() {
    document.querySelectorAll('.shift-btn').forEach(btn => {
        btn.classList.toggle('active', isShift);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        expression += e.key;
        updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        expression += e.key;
        updateDisplay();
    } else if (e.key === 'Enter') {
        calculate();
    } else if (e.key === 'Backspace') {
        expression = expression.slice(0, -1);
        updateDisplay();
    } else if (e.key === 'Escape') {
        expression = '';
        updateDisplay();
    } else if (e.key === '(') {
        expression += '(';
        updateDisplay();
    } else if (e.key === ')') {
        expression += ')';
        updateDisplay();
    }
});

// Result click to copy
resultEl.addEventListener('click', () => {
    if (resultEl.textContent !== '0') {
        navigator.clipboard.writeText(resultEl.textContent);
        alert('Copied: ' + resultEl.textContent);
    }
});

window.addEventListener('load', () => {
    createKeyboard();
    updateDisplay();
});
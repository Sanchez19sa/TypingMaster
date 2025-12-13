export const javascriptSnippets = {
  easy: [
    `const greet = (name) => {
  return "Hello, " + name;
};`,
    `let count = 0;
while (count < 5) {
  console.log(count++);
}`,
    `const numbers = [1, 2, 3];
numbers.push(4);
console.log(numbers);`,
    `function isEven(num) {
  return num % 2 === 0;
}`,
    `const user = {
  name: "Alice",
  age: 25
};`,
    `const add = (a, b) => a + b;
const result = add(5, 10);`,
    `if (isValid) {
  submitForm();
} else {
  showError();
}`,
    `const colors = ['red', 'blue'];
const first = colors[0];`
  ],
  medium: [
    `const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true }
];
const activeUsers = users.filter(user => user.active)
                         .map(user => user.id);
console.log(activeUsers);`,
    `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}`,
    `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  get area() {
    return this.width * this.height;
  }
}`,
    `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};`,
    `document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('submit-btn');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Form submitted');
  });
});`,
    `const factorial = (n) => {
  if (n < 0) return -1;
  if (n === 0) return 1;
  return n * factorial(n - 1);
};
console.log(factorial(5));`,
    `const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
matrix.forEach(row => {
  row.forEach(cell => console.log(cell));
});`,
    `const mergedConfig = {
  ...defaultConfig,
  ...userConfig,
  debug: true
};
Object.keys(mergedConfig).forEach(key => {
  console.log(key, mergedConfig[key]);
});`
  ],
  hard: [
    `class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }
  
  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listenerToRemove);
  }
}`,
    `const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const clonedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);`,
    `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let resultArray = [], leftIndex = 0, rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
    `const calculateStats = (data) => {
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / data.length;
  
  const squareDiffs = data.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  
  const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / data.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  return {
    mean: parseFloat(mean.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    min: Math.min(...data),
    max: Math.max(...data)
  };
}`,
    `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
    `const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  
  if (password.length < minLength) return false;
  if (!hasUpperCase || !hasLowerCase) return false;
  if (!hasNumbers) return false;
  if (!hasNonalphas) return false;
  
  return true;
};
console.log(validatePassword("SecurePass123!"));`,
    `const flattenArray = (arr) => {
  return arr.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val);
  }, []);
};

const nested = [1, [2, [3, 4], 5], 6];
console.log(flattenArray(nested)); // [1, 2, 3, 4, 5, 6]

// Alternative utilizing modern JS
const flatModern = nested.flat(Infinity);`,
    `const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

window.addEventListener('resize', throttle(() => {
  console.log('Resize event throttled');
}, 1000));`
  ]
};


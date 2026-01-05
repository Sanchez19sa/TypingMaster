export const typescriptSnippets = {
  easy: [
    `interface User {
  id: number;
  name: string;
}`,
    `const add = (a: number, b: number): number => {
  return a + b;
};`,
    `type Status = 'idle' | 'loading' | 'success';
let currentStatus: Status = 'idle';`,
    `function logMessage(msg: string): void {
  console.log(msg);
}`,
    `const numbers: number[] = [1, 2, 3];
numbers.push(4);`,
    `interface Point {
  x: number;
  y: number;
}`,
    `const isDone: boolean = false;
const decimal: number = 6;`,
    `const greet = (person: string): string => {
  return "Hello " + person;
};`
  ],
  medium: [
    `interface Config {
  apiKey: string;
  timeout?: number;
  retries?: number;
}

const defaultConfig: Config = {
  apiKey: 'default-key',
  timeout: 5000
};`,
    `function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);`,
    `enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

function move(dir: Direction) {
  console.log('Moving in direction:', dir);
}`,
    `interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fields: Partial<Todo>) {
  return { ...todo, ...fields };
}`,
    `type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}`,
    `interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}`,
    `abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void;
}`,
    `type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Item {
  name: string;
}

const item: ReadOnly<Item> = { name: "Book" };
// item.name = "Pen"; // Error`
  ],
  hard: [
    `interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { data, status: response.status };
  } catch (err) {
    return { 
      data: {} as T, 
      status: 500, 
      error: (err as Error).message 
    };
  }
}`,
    `type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' };

interface State {
  count: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.payload };
    case 'DECREMENT':
      return { count: state.count - action.payload };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}`,
    `class GenericQueue<T> {
  private data: T[] = [];

  push(item: T) {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }

  get size(): number {
    return this.data.length;
  }
}

const queue = new GenericQueue<number>();
queue.push(10);
queue.push(20);`,
    `interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person;

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person: Person = { name: "Alice", age: 30, location: "NY" };
const age = getProperty(person, "age");
const nameStr = getProperty(person, "name");`,
    `type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, Exclude<keyof T, FunctionPropertyNames<T>>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type PartState = NonFunctionProperties<Part>;`,
    `class Handler {
  info: string;
  
  constructor(info: string) {
      this.info = info;
  }
  
  // 'this' parameter for type safety in callbacks
  onClickBad(this: Handler, e: Event) {
      this.info = e.type;
  }
  
  onClickGood = (e: Event) => {
      this.info = e.type;
  }
}

const h = new Handler('data');
// uiElement.addEventListner('click', h.onClickGood);`,
    `interface Dictionary<T> {
  [key: string]: T;
}

function mapDict<T, U>(dict: Dictionary<T>, fn: (val: T) => U): Dictionary<U> {
  const result: Dictionary<U> = {};
  for (const key in dict) {
    if (Object.prototype.hasOwnProperty.call(dict, key)) {
      result[key] = fn(dict[key]);
    }
  }
  return result;
}

const scores: Dictionary<number> = { math: 90, science: 85 };
const grades = mapDict(scores, (s) => s > 80 ? 'A' : 'B');`,
    `// Utility Types Implementation
type MyPartial<T> = { [P in keyof T]?: T[P] };
type MyRequired<T> = { [P in keyof T]-?: T[P] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

interface User {
  id: number;
  name: string;
  email?: string;
}

const userUpdate: MyPartial<User> = { name: "Bob" };
const userView: MyPick<User, 'id' | 'name'> = { id: 1, name: "Bob" };`
  ]
};


export const pythonSnippets = {
  easy: [
    `def greet(name):
    print(f"Hello, {name}")`,
    `for i in range(5):
    if i % 2 == 0:
        print(i)`,
    `fruits = ["apple", "banana", "cherry"]
for x in fruits:
    print(x)`,
    `x = 10
y = 5
print(x + y)`,
    `def square(n):
    return n * n
print(square(4))`,
    `try:
    print(10 / 0)
except ZeroDivisionError:
    print("Error")`,
    `my_dict = {"name": "John", "age": 30}
print(my_dict["name"])`,
    `numbers = [1, 2, 3, 4, 5]
print(len(numbers))`
  ],
  medium: [
    `def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

result = factorial(5)
print(f"Factorial of 5 is {result}")`,
    `squares = [x**2 for x in range(10) if x % 2 == 0]
print(squares)

names = ["Alice", "Bob", "Charlie"]
lengths = {name: len(name) for name in names}`,
    `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        print(f"{self.name} says Woof!")

buddy = Dog("Buddy", 3)
buddy.bark()`,
    `with open("example.txt", "w") as file:
    file.write("Hello World")

with open("example.txt", "r") as file:
    content = file.read()
    print(content)`,
    `import random

def guess_number():
    target = random.randint(1, 10)
    guess = int(input("Guess a number: "))
    return "Correct" if guess == target else "Wrong"`,
    `data = [10, 20, 30, 40]
avg = sum(data) / len(data)

filtered = list(filter(lambda x: x > avg, data))
print(f"Average: {avg}, Above Average: {filtered}")`,
    `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(8)))`,
    `import json

data = {"name": "Dave", "admin": False}
json_str = json.dumps(data)
parsed = json.loads(json_str)

print(parsed["name"])`
  ],
  hard: [
    `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"Deposited {amount}")

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            print(f"Withdrew {amount}")
        else:
            print("Insufficient funds")

    def __str__(self):
        return f"Account({self.owner}, {self._balance})"`,
    `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

sample = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(sample))`,
    `import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f}s")
        return result
    return wrapper

@timer_decorator
def heavy_computation():
    total = 0
    for i in range(1000000):
        total += i
    return total

heavy_computation()`,
    `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node

    def print_list(self):
        curr = self.head
        while curr:
            print(curr.data, end=" -> ")
            curr = curr.next
        print("None")`,
    `def binary_search(arr, low, high, x):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] > x:
            return binary_search(arr, low, mid - 1, x)
        else:
            return binary_search(arr, mid + 1, high, x)
    else:
        return -1

arr = [2, 3, 4, 10, 40]
result = binary_search(arr, 0, len(arr)-1, 10)
print(f"Element found at index {result}")`,
    `import threading

def worker(num):
    print(f"Worker {num} starting")
    # Simulate work
    total = 0 
    for i in range(1000000):
        total += i
    print(f"Worker {num} finished")

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
print("All threads completed")`,
    `class ContextManager:
    def __init__(self, name):
        self.name = name
    
    def __enter__(self):
        print(f"Entering context: {self.name}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Exiting context: {self.name}")
        if exc_type:
            print(f"Error occurred: {exc_val}")
        return True # Suppress exception

with ContextManager("Test") as cm:
    print("Inside the block")
    # raise ValueError("Something went wrong")`,
    `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14 * self.radius`
  ]
};


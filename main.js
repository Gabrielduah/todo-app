
const todoText = document.querySelector('.input-todo');
const listContainer = document.querySelector('.todo-container');
const add = document.querySelector('.addTask');
const toggle = document.querySelector('.moon');
const body = document.querySelector('body');
const infoContainer = document.querySelector('.todo-info');
const inputText = document.querySelector('.input-text');
const container = document.querySelector('.container');
const itemCounter = document.querySelector('.item-counter');
const activeFilter = document.querySelector('.active-filter');
const completedFilter = document.querySelector('.completed-filter');
const clearComplete = document.querySelector('.clear-complete')
const todoStatus = document.querySelector('.todo-status')

let itemleft = 0;
let todos = [];

// Function to save todos in local storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to load todos from local storage
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    todos.forEach(function (todo) {
      createTodoElement(todo.text, todo.completed);
    });
  }
}

// Function to handle drag start event
function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.innerHTML);
  event.currentTarget.style.opacity = '0.4';
}

// Function to handle drag over event
function handleDragOver(event) {
  event.preventDefault();
}

// Function to handle drop event
function handleDrop(event) {
  event.preventDefault();
  const sourceId = event.dataTransfer.getData('text/plain');
  const targetId = event.target.dataset.id;

  // Swap the positions of the dragged item and the drop target item
  todos.forEach(function (todo) {
    if (todo.id === sourceId) {
      todo.id = targetId;
    } else if (todo.id === targetId) {
      todo.id = sourceId;
    }
  });

  event.currentTarget.style.opacity = '1';
  saveTodos();
}


// CREATING THE FUNCTION TO CREATE TODO ELEMENT
function createTodoElement(text, completed) {
  let li = document.createElement('li');
  li.innerHTML = text;
  li.draggable = true;
  if (completed) {
    li.classList.add('checked');
  }
  listContainer.appendChild(li);

  let span = document.createElement('span');
  span.innerHTML = '\u00d7';
  li.appendChild(span);
  itemleft++;

    // Add the "dragging" class when the element is being dragged
    li.addEventListener('dragstart', function(event) {
      setTimeout(() => {
        li.classList.add('dragging');
      }, 0);
    });
    li.addEventListener('dragend', function(event) {
      li.classList.remove('dragging');
    });
  

    const iniSortable = (e) => {
      const draggingItem = listContainer.querySelector('.dragging');
      const siblingItems = [...listContainer.querySelectorAll('li:not(.dragging)')];
      const nextSibling = siblingItems.find((sibling) => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });
    
      if (draggingItem && nextSibling) {
        listContainer.insertBefore(draggingItem, nextSibling);
      }
    };
    
    listContainer.addEventListener('dragover', iniSortable);
    
}



// CREATING THE FUNCTION TO ADD A TODO
function addTodo() {
  if (todoText.value == '') {
    alert('Write a todo');
  } else {
    createTodoElement(todoText.value, false);
    todos.push({ text: todoText.value, completed: false });
    saveTodos();
  }

  todoText.value = '';
  updateItem();
}

// Function to handle item completion and deletion
function handleItemClick(event) {
  if (event.target.tagName === 'LI') {
    event.target.classList.toggle('checked');
    if (event.target.classList.contains('checked')) {
      itemleft--;
      todos.forEach(function (todo) {
        if (todo.text === event.target.innerHTML) {
          todo.completed = true;
        }
      });
    } else {
      itemleft++;
      todos.forEach(function (todo) {
        if (todo.text === event.target.innerHTML) {
          todo.completed = false;
        }
      });
    }
    saveTodos();
    updateItem();
  } else if (event.target.tagName === 'SPAN') {
    event.target.parentElement.remove();
    todos = todos.filter(function (todo) {
      return todo.text !== event.target.parentElement.innerHTML;
    });
    saveTodos();
    updateItem();
  }
}

// Function to update the item count
function updateItem() {
  const itemCount = listContainer.getElementsByTagName('li').length;
  const itemLeft = itemleft >= 0 ? itemleft : 0;
  itemCounter.textContent = `${itemLeft} item${itemLeft !== 1 ? 's' : ''}`;
}


toggle.addEventListener('click', toggleImage);


// Function to toggle theme
function toggleImage() {
  if (toggle.src.match('images/icon-moon.svg')) {
    toggle.src = 'images/icon-sun.svg'
    body.style.backgroundColor = 'hsl(235, 21%, 11%)';
    listContainer.style.backgroundColor = 'hsl(235, 24%, 19%)';
    infoContainer.style.backgroundColor = 'hsl(235, 24%, 19%)';
    inputText.style.backgroundColor = 'hsl(235, 24%, 19%)';
    todoText.style.backgroundColor = 'hsl(235, 21%, 11%)';
    todoText.style.color = 'white';
    todoStatus.style.backgroundColor = 'hsl(235, 24%, 19%)';

    // Change background image based on viewport width
    if (window.innerWidth < 375) {
      container.style.backgroundImage = "url('images/bg-mobile-dark.jpg')";
    } else {
      container.style.backgroundImage = "url('images/bg-desktop-dark.jpg')";
    }
  } else {
    toggle.src = 'images/icon-moon.svg';
    body.style.backgroundColor = 'white';
    listContainer.style.backgroundColor = 'white';
    infoContainer.style.backgroundColor = 'white';
    todoText.style.backgroundColor = 'white';
    todoText.style.color = 'black';
    infoContainer.style.backgroundColor = 'white'
    todoStatus.style.backgroundColor = 'white'

    // Change background image based on viewport width
    if (window.innerWidth < 375) {
      container.style.backgroundImage = "url('images/bg-mobile-light.jpg')";
    } else {
      container.style.backgroundImage = "url('images/bg-desktop-light.jpg')";
    }
  }
}

// Function to filter active todos
function filterActive() {
  const todoItems = listContainer.querySelectorAll('li');
  todoItems.forEach(function (item) {
    if (item.classList.contains('checked')) {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }
  });

  activeFilter.classList.add('active');
  completedFilter.classList.remove('active');
}

// Function to filter completed todos
function filterCompleted() {
  const todoItems = listContainer.querySelectorAll('li');
  todoItems.forEach(function (item) {
    if (item.classList.contains('checked')) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  activeFilter.classList.remove('active');
  completedFilter.classList.add('active');
}

// Adding event listeners
add.addEventListener('click', addTodo);
todoText.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});
listContainer.addEventListener('click', handleItemClick);
activeFilter.addEventListener('click', filterActive);
completedFilter.addEventListener('click', filterCompleted);
toggle.addEventListener('click', toggleImage);

// Add event listeners for drag and drop functionality
// listContainer.addEventListener('dragstart', handleDragStart);
// listContainer.addEventListener('dragover', handleDragOver);
// listContainer.addEventListener('drop', handleDrop);

// Invoke the updateItem function initially to set the item count
updateItem();

// Load todos from local storage on page load
loadTodos();




// Function to clear completed todos
function clearCompleted() {
  const completedItems = listContainer.querySelectorAll('.checked');
  completedItems.forEach(function (item) {
    item.remove();
    todos = todos.filter(function (todo) {
      return todo.text !== item.innerHTML;
    });
  });
  saveTodos();
  updateItem();
}

// Add event listener to clear complete button
clearComplete.addEventListener('click', clearCompleted);


// Function to show active todos
function showActiveTodos() {
  const todoItems = listContainer.querySelectorAll('li');
  todoItems.forEach(function (item) {
    if (item.classList.contains('checked')) {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }
  });

  activeFilter.classList.add('active');
  completedFilter.classList.remove('active');
}

// Function to show completed todos
function showCompletedTodos() {
  const todoItems = listContainer.querySelectorAll('li');
  todoItems.forEach(function (item) {
    if (item.classList.contains('checked')) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  activeFilter.classList.remove('active');
  completedFilter.classList.add('active');
}

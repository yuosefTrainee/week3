const todos = ["wake up", "eat breakfast", "code"];

const header = $("<h1>Todo List</h1>");
const input = $('<input type="text" placeholder="Enter a task">');
const addButton = $("<button>Add Task</button>");
const list = $("<ul></ul>");

$("body").append(header, input, addButton, list);

function renderList() {
    list.empty();

    todos.forEach(function(todo, index) {
        const li = $("<li></li>");
        const updateButton = $("<button>Update</button>");
        const deleteButton = $("<button>Delete</button>");

        li.text(todo + " ");

        updateButton.on("click", function() {
            updateListItem(index);
        });

        deleteButton.on("click", function() {
            deleteListItem(index);
        });

        li.append(updateButton, deleteButton);
        list.append(li);
    });
}

function addToList() {
    const todo = input.val().trim();

    if (todo === "") {
        return;
    }

    todos.push(todo);
    input.val("");

    renderList();
}

function updateListItem(index) {
    const newTodo = prompt("Enter the new task:");

    if (newTodo === null || newTodo.trim() === "") {
        return;
    }

    todos[index] = newTodo.trim();

    renderList();
}

function deleteListItem(index) {
    todos.splice(index, 1);

    renderList();
}

addButton.on("click", addToList);

renderList();
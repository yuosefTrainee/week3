// const header = document.createElement("h1");
// header.innerText = "Todo List";

// const list1 = document.createElement("ul");

// document.body.append(header, list1);

const todos = ["wake up", "eat breakfast", "code"];

const header = document.createElement("h1");
header.innerText = "Todo List";

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Enter a new task";

const addButton = document.createElement("button");
addButton.innerText = "Add Task";

const list = document.createElement("ul");

document.body.append(header, input, addButton, list);


function renderList() {
    list.innerHTML = "";

    todos.forEach((todo, index) => {
        const li = document.createElement("li");

        li.innerText = todo + " ";

        const updateButton = document.createElement("button");
        updateButton.innerText = "Update";

        updateButton.addEventListener("click", () => {
            updateListItem(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteListItem(index);
        });

        li.append(updateButton, deleteButton);
        list.append(li);
    });
}


function addToList() {
    const todo = input.value.trim();

    if (todo === "") {
        return;
    }

    todos.push(todo);

    input.value = "";

    renderList();
}


function deleteListItem(index) {
    todos.splice(index, 1);

    renderList();
}


function updateListItem(index) {
    const newTodo = prompt("Enter the new task:", todos[index]);

    if (newTodo === null || newTodo.trim() === "") {
        return;
    }

    todos[index] = newTodo.trim();

    renderList();
}


addButton.addEventListener("click", addToList);


renderList();
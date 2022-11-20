// Selecionar Elementos
const todolistForm = document.querySelector('#todolist-form')
const todolistInput = document.querySelector('#todolist-input')
const todoListComplet = document.querySelector('#todolist')
const editForm = document.querySelector('#edit-form')
const editInput = document.querySelector('#edit-input')
const cancelEditBtn = document.querySelector('#cancel-edit-btn')

const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('#erase-button')
const filterBtn = document.querySelector('#filter-select')

let oldInputValue;


// Funções
const saveTodoList = (text, done=0, save=1) =>{
    const todoList = document.createElement('div')
    todoList.classList.add('todolist')

    const todolistTitle = document.createElement('h3')
    todolistTitle.innerText = text
    todoList.appendChild(todolistTitle)

    const doneBtn = document.createElement('button')
    doneBtn.classList.add('finish-todolist')
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todoList.appendChild(doneBtn)

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todolist')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todoList.appendChild(editBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('remove-todolist')
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todoList.appendChild(deleteBtn)


    if(done){
        todoList.classList.add('done')
    }
    if(save){
        savetodolistLocalStorage({text, done})
    }


    todoListComplet.appendChild(todoList)

    todolistInput.value = "";
    todolistInput.focus();

}
const toggleForms = () => {
    editForm.classList.toggle('hide');
    todolistForm.classList.toggle('hide');
    todoListComplet.classList.toggle('hide');
}

const updateTodoList = (text) =>{
    const todoLists = document.querySelectorAll('.todolist');
    todoLists.forEach((todo)=>{
        let todoTitle = todo.querySelector("h3")
        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;
            updatetodolistLocalStorage(oldInputValue, text);
        }
    })
}

const getSearchTodoLists = (search) =>{
    const todolists = document.querySelectorAll('.todolist');
    todolists.forEach((todolist) =>{
        let todoTitle = todolist.querySelector('h3').innerText.toLowerCase();
        const normalizeSearch = search.toLowerCase();
        console.log(todoTitle, normalizeSearch)
        todolist.style.display = "flex";
        todolist.style.flexDirection = "row";

        if(!todoTitle.includes(normalizeSearch)){
            todolist.style.display = "none";
        }
    })
}

const filterTodoLists = (filterValue) =>{
    const todolists = document.querySelectorAll('.todolist');
    switch(filterValue){
        case "all":
            todolists.forEach((todolist) => (todolist.style.display = "flex"))
            break

        case "done":
            todolists.forEach((todolist) => todolist.classList.contains("done") ? todolist.style.display = "flex" : todolist.style.display = "none")
            break
        
        case "todolist":
            todolists.forEach((todolist) => !todolist.classList.contains("done") ? todolist.style.display = "flex" : todolist.style.display = "none")

        default:
            break
    }

}

const loadTodoLists = () =>{
    const todolists = gettodolistLocalStorage();
    todolists.forEach((todolist)=>{
        saveTodoList(todolist.text, todolist.done, 0)
    })
}

const removetodolistLocalStorage = (todolistText) =>{
    const todolists = gettodolistLocalStorage();
    const filtertodolists = todolists.filter((todolist)=> todolist.text !== todolistText)
    localStorage.setItem('todolists', JSON.stringify(filtertodolists));
}
const updatetodoliststatusLocalStorage = (todolistText) =>{
    const todolists = gettodolistLocalStorage();
    todolists.map((todolist)=> todolist.text === todolistText ? todolist.done = !todolist.done : null);
    
    localStorage.setItem('todolists', JSON.stringify(todolists));
}
const updatetodolistLocalStorage = (todolistOldText, todolistNewText) =>{
    const todolists = gettodolistLocalStorage();
    todolists.map((todolist)=> todolist.text === todolistOldText ? todolist.text = todolistNewText : null);
    
    localStorage.setItem('todolists', JSON.stringify(todolists));
}

// Eventos
todolistForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    
    const inputValue = todolistInput.value;
    if(inputValue){
        saveTodoList(inputValue);
    }
})



document.addEventListener('click', (event) =>{
    const targetElement = event.target;
    const parentElement = targetElement.closest("div");
    let todolistTitle;

    if(parentElement && parentElement.querySelector('h3')){
        todolistTitle = parentElement.querySelector('h3').innerText;
    }

    // FINISH
    if(targetElement.classList.contains('finish-todolist')){
        parentElement.classList.toggle('done');

        updatetodoliststatusLocalStorage(todolistTitle);
    }

    // EDIT
    if(targetElement.classList.contains('edit-todolist')){
        toggleForms();

        editInput.value = todolistTitle;
        oldInputValue = todolistTitle;

        updateTodoList(oldInputValue)
        
       
    }

    // REMOVE
    if(targetElement.classList.contains('remove-todolist')){
        parentElement.remove();
        removetodolistLocalStorage(todolistTitle);
    }
})


cancelEditBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    toggleForms();
})

editForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    const editInputValue = editInput.value;
    if(editInputValue){
        updateTodoList(editInputValue);
    }

    toggleForms();
    
})


searchInput.addEventListener('keyup', (event)=>{
    const search = event.target.value;
    
    getSearchTodoLists(search);
    
    
})

eraseBtn.addEventListener('click', (event) =>{
    event.preventDefault();

    searchInput.value = '';
    searchInput.dispatchEvent(new Event('keyup'));
})

filterBtn.addEventListener('change', (event) =>{
    const filterValue = event.target.value;
    filterTodoLists(filterValue);
})

// Local Storage
const gettodolistLocalStorage = () =>{
    const todolists = JSON.parse(localStorage.getItem("todolists")) || []; 
    return todolists
}
const savetodolistLocalStorage = (todolist) =>{
    const todolists = gettodolistLocalStorage();
    todolists.push(todolist);
    localStorage.setItem('todolists', JSON.stringify(todolists));
}

loadTodoLists();

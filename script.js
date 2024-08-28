// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId = nextId + 1;
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // template literals
    let card = $(`
        <div class="card" id="${task.id}">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text">${dayjs(task.dueDate).format("DD/MM/YYYY")}</p>
            <button class="btn btn-danger delete-btn">Delete</button>
          </div>
        </div>
    `);

    let today = dayjs();
    let dueDateFormat = dayjs(task.dueDate);

    if(dueDateFormat.isBefore(today, 'day')) {
        card.addClass("bg-red");
    } else if(dueDateFormat.isSame(today, 'day')) {
        card.addClass("bg-yellow");
    }

    if(task.status == "to-do") {
        $("#todo-cards").append(card);
    } else if(task.status == "in-progress") {
        $("#in-progress-cards").append(card)
    } else if(task.status == "done") {
        $("#done-cards").append(card);
    }

    card.draggable({
        revert: "invalid",
        helper: "clone",
        start: function(event, ui) {
            $(this).hide()
        }
       
    });

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
    taskList.forEach(createTaskCard);
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let taskTitle = $("#taskTitle").val();
    let taskDueDate = $("#taskDueDate").val();
    let taskDescription = $("#taskDescription").val();

    let newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: "to-do"
    }

    taskList.push(newTask);
    // javascrtipt array is not readable in localstorage, so you have to convert it into JSON format

    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    $("#modal").hide();

    renderTaskList();


}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".card").attr("id");

    taskList = taskList.filter(task => task.id != taskId);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();

    let taskId = ui.draggable.attr("id");
    
    let task = taskList.find(task => task.id === parseInt(taskId));

    task.status = event.target.id;

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $(".card" ).droppable({
        accept: ".card",
        drop: handleDrop
      });
   
    $('#formModal').submit(handleAddTask)
    $(document).on("click", ".delete-btn", handleDeleteTask);

    $("#taskDueDate").datepicker({
        showButtonPanel: true
    });
    
});
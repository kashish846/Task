$(document).ready(function () {
    $("#weatherBtn").click(function () {
        $("#weatherSection").show();
        $("#todoSection").hide();
        $("#weatherBtn").addClass("btn-secondary").removeClass("btn-primary");
        $("#todoBtn").addClass("btn-primary").removeClass("btn-secondary");
    });

    $("#todoBtn").click(function () {
        $("#todoSection").show();
        $("#weatherSection").hide();
        $("#todoBtn").addClass("btn-secondary").removeClass("btn-primary");
        $("#weatherBtn").addClass("btn-primary").removeClass("btn-secondary");
    });
    function fetchWeather(city) {
        let apiKey = "910d616329233452fc18b93325456da6";
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; 

        $.getJSON(url, function (data) {
            let weatherHtml = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Conditions: ${data.weather[0].description}</p>
        `;
            $("#weatherInfo").html(weatherHtml);
        }).fail(function () {
            alert("City not found!");
        });

    }


    fetchWeather("Delhi");

    $("#getWeather").click(function () {
        let city = $("#cityInput").val().trim();
        if (city === "") {
            alert("Please enter a city name!");
            return;
        }
        fetchWeather(city);
    });

});

let taskCount = 0;

let savedTasks = localStorage.getItem("todoTasks");
if (savedTasks) {
    let tasks = JSON.parse(savedTasks);
    tasks.forEach(function (task) {
        taskCount += task.completed ? 0 : 1;
        let taskHtml = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.text}</span>
                <div>
                    <button class="btn btn-sm ${task.completed ? 'btn-warning undoTask' : 'btn-success completeTask'}">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-danger btn-sm deleteTask">Delete</button>
                </div>
            </li>
        `;
        $("#taskList").append(taskHtml);
    });
    $("#taskCount").text(taskCount);
}

$("#addTask").click(function () {
    let taskText = $("#taskInput").val().trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    taskCount++;
    updateTaskCount();

    let taskHtml = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${taskText}</span>
            <div>
                <button class="btn btn-success btn-sm completeTask">Complete</button>
                <button class="btn btn-danger btn-sm deleteTask">Delete</button>
            </div>
        </li>
    `;

    $("#taskList").append(taskHtml);
    $("#taskInput").val("");

    let tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
});

$(document).on("click", ".completeTask", function () {
    $(this).parent().siblings("span").css("text-decoration", "line-through");
    $(this).removeClass("btn-success completeTask").addClass("btn-warning undoTask").text("Undo");
    taskCount--;
    updateTaskCount();

    let tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    let taskText = $(this).parent().siblings("span").text();
    let task = tasks.find(t => t.text === taskText);
    if (task) task.completed = true;
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
});
$(document).on("click", ".undoTask", function () {
    $(this).parent().siblings("span").css("text-decoration", "none");
    $(this).removeClass("btn-warning undoTask").addClass("btn-success completeTask").text("Complete");
    taskCount++;
    updateTaskCount();

    let tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    let taskText = $(this).parent().siblings("span").text();
    let task = tasks.find(t => t.text === taskText);
    if (task) task.completed = false;
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
});

$(document).on("click", ".deleteTask", function () {
    let taskText = $(this).parent().siblings("span").text();
    let isCompleted = $(this).siblings(".undoTask").length > 0;
    if (!isCompleted) taskCount--;
    $(this).closest("li").remove();
    updateTaskCount();

    let tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
});

function updateTaskCount() {
    $("#taskCount").text(taskCount);
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.add("ms-5")
}
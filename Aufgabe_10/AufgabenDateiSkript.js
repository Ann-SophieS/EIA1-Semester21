window.addEventListener("load", function () {
    var btnVoice = document.querySelector(".Aufnahme");
    var artyom = new Artyom();
    artyom.addCommands({
        indexes: ["erstelle Aufgabe *"],
        smart: true,
        action: function (i, wildcard) {
            console.log("Neue Aufgabe wird erstellt: " + wildcard);
            addTodo(wildcard);
            artyom.fatality();
        }
    });
    function startContinuousArtyom() {
        artyom.fatality();
        setTimeout(function () {
            artyom
                .initialize({
                lang: "de-DE",
                continuous: true,
                listen: true,
                interimResults: true,
                debug: true
            })
                .then(function () {
                console.log("Bereit");
            });
        }, 250);
    }
    btnVoice.addEventListener("click", function (e) {
        startContinuousArtyom();
    });
    var inputDOMElement;
    var addButtonDOMElement;
    var todosDOMElement;
    var counterDOMElement;
    var openDOMElement;
    var closedDOMElement;
    var toDoArray = [
        {
            todosText: "Einkaufen",
            todosChecked: false
        },
        {
            todosText: "Aufraumen",
            todosChecked: true
        },
    ];
    inputDOMElement = document.querySelector("#inputTodo");
    addButtonDOMElement = document.querySelector("#addButton");
    todosDOMElement = document.querySelector("#todos");
    counterDOMElement = document.querySelector("#counter");
    openDOMElement = document.querySelector("#open");
    closedDOMElement = document.querySelector("#closed");
    addButtonDOMElement.addEventListener("click", function () {
        addTodo(inputDOMElement.value);
    });
    drawListToDOM();
    function drawListToDOM() {
        todosDOMElement.innerHTML = "";
        var _loop_1 = function (index) {
            var todo = document.createElement("div");
            todo.classList.add("todo");
            todo.innerHTML =
                "<span class='check " +
                    toDoArray[index].todosChecked +
                    "'><i class='fas fa-check'></i></span>" +
                    toDoArray[index].todosText +
                    "<span class='trash fas fa-trash-alt'></span>";
            todo.querySelector(".check").addEventListener("click", function () {
                toggleCheckState(index);
            });
            todo.querySelector(".trash").addEventListener("click", function () {
                deleteTodo(index);
            });
            todosDOMElement.appendChild(todo);
        };
        for (var index = 0; index < toDoArray.length; index++) {
            _loop_1(index);
        }
        updateCounter();
    }
    function updateCounter() {
        counterDOMElement.innerHTML = toDoArray.length + " in total";
        var closedTasks = toDoArray.filter(function (todo) {
            return todo.todosChecked;
        });
        closedDOMElement.innerHTML = closedTasks.length + " closed";
        var openTasks = toDoArray.filter(function (todo) {
            return todo.todosChecked === false;
        });
        openDOMElement.innerHTML = openTasks.length + " open";
    }
    function addTodo(aufgabenText) {
        if (aufgabenText != "") {
            toDoArray.unshift({
                todosText: aufgabenText,
                todosChecked: false
            });
            aufgabenText = "";
            drawListToDOM();
        }
    }
    function toggleCheckState(index) {
        toDoArray[index].todosChecked = !toDoArray[index].todosChecked;
        drawListToDOM();
    }
    function deleteTodo(index) {
        toDoArray.splice(index, 1);
        drawListToDOM();
    }
});

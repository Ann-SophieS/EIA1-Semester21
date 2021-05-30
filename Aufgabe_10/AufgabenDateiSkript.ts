declare var Artyom: any;

window.addEventListener("load", function (): void {

  const btnVoice: HTMLElement = document.querySelector(".Aufnahme");

  const artyom: any = new Artyom();

  artyom.addCommands({
    indexes: ["erstelle Aufgabe *"],
    smart: true,
    action: function (i: any, wildcard: string): void {
 
      console.log("Neue Aufgabe wird erstellt: " + wildcard);
      addTodo(wildcard);

      artyom.fatality();
    },
  });

  function startContinuousArtyom(): void {
    artyom.fatality();

    setTimeout(function (): void {
      artyom
        .initialize({
          lang: "de-DE",
          continuous: true,
          listen: true,
          interimResults: true,
          debug: true,
        })
        .then(function (): void {
          console.log("Bereit");
        });
    }, 250);
  }

  btnVoice.addEventListener("click", (e) => {

    startContinuousArtyom();
  });

  var inputDOMElement: HTMLInputElement;
  var addButtonDOMElement: HTMLElement;
  var todosDOMElement: HTMLElement;
  var counterDOMElement: HTMLElement;
  var openDOMElement: HTMLElement;
  var closedDOMElement: HTMLElement;


  interface ToDo {
    todosText: string;
    todosChecked: boolean;
  }

  let toDoArray: ToDo[] = [
    {
      todosText: "Einkaufen",
      todosChecked: false,
    },
    {
      todosText: "Aufraumen",
      todosChecked: true,
    },
  ];

  inputDOMElement = document.querySelector("#inputTodo");
  addButtonDOMElement = document.querySelector("#addButton");
  todosDOMElement = document.querySelector("#todos");
  counterDOMElement = document.querySelector("#counter");
  openDOMElement = document.querySelector("#open");
  closedDOMElement = document.querySelector("#closed");


  addButtonDOMElement.addEventListener("click", () => {
    addTodo(inputDOMElement.value);
  });

  drawListToDOM();

  function drawListToDOM(): void {

    todosDOMElement.innerHTML = "";


    for (let index: number = 0; index < toDoArray.length; index++) {

      let todo: HTMLElement = document.createElement("div");
      todo.classList.add("todo");

      todo.innerHTML =
        "<span class='check " +
        toDoArray[index].todosChecked +
        "'><i class='fas fa-check'></i></span>" +
        toDoArray[index].todosText +
        "<span class='trash fas fa-trash-alt'></span>";

      todo.querySelector(".check").addEventListener("click", function (): void {

        toggleCheckState(index);
      });
      todo.querySelector(".trash").addEventListener("click", function (): void {

        deleteTodo(index);
      });

      todosDOMElement.appendChild(todo);
    }

    updateCounter();
  }

  function updateCounter(): void {

    counterDOMElement.innerHTML = toDoArray.length + " in total";

    const closedTasks = toDoArray.filter((todo) => {
      return todo.todosChecked;
    });

    closedDOMElement.innerHTML = `${closedTasks.length} closed`;

    const openTasks = toDoArray.filter((todo) => {
      return todo.todosChecked === false;
    });

    openDOMElement.innerHTML = `${openTasks.length} open`;
  }

  function addTodo(aufgabenText: string): void {

    if (aufgabenText != "") {

      toDoArray.unshift({
        todosText: aufgabenText,
        todosChecked: false,
      });
      aufgabenText = "";

      drawListToDOM();
    }
  }

 
  function toggleCheckState(index: number): void {

    toDoArray[index].todosChecked = !toDoArray[index].todosChecked;

    drawListToDOM();
  }

  function deleteTodo(index: number): void {
  
    toDoArray.splice(index, 1);

    drawListToDOM();
  }
});
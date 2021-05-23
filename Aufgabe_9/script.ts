let counting: number = 0;
let userTask: any = document.getElementById("newTask");
let clickBool: boolean = false;
let preventEventBool: boolean = false;

document.addEventListener("keydown", function (event: KeyboardEvent): void {
  if (event.code === "Enter" && clickBool === true && userTask.value !== "") {
    createNewTask();
    setTimeout(function (): void {
      clearInput();
    }, 100);
    preventEventBool = false;
  }
});

document.addEventListener("click", function (): void {
  if (preventEventBool === false) {
    clickBool = false;
  }
});

userTask.addEventListener("click", function (): void {
  clickBool = true;
  preventEventBool = true;
});

function createNewTask(): void {
  let container: HTMLElement = document.createElement("li");
  container.className = "task";
  let divText: HTMLElement = document.createElement("div");
  divText.className = "divText";
  let icon01: HTMLElement = document.createElement("i");
  icon01.className = "far fa-circle";
  let icon02: HTMLElement = document.createElement("i");
  icon02.className = "far fa-check-circle isHidden";
  let text: HTMLElement = document.createElement("p");
  text.className = "task-text";
  text.innerHTML = userTask.value;
  let icon03: HTMLElement = document.createElement("i");
  icon03.className = "fas fa-trash-alt";

  console.log(document.getElementById("tasks"));

  document.getElementById("tasks").appendChild(container);
  container.appendChild(divText);
  divText.appendChild(icon01);
  divText.appendChild(icon02);
  divText.appendChild(text);
  container.appendChild(icon03);

  counting++;
  tocounter();

  icon01.addEventListener("click", function (): void {
    icon01.classList.add("isHidden");
    icon02.classList.remove("isHidden");
    text.setAttribute("style", "text-decoration: " + "line-through");
  });

  icon02.addEventListener("click", function (): void {
    icon02.classList.add("isHidden");
    icon01.classList.remove("isHidden");
    text.setAttribute("style", "text-decoration: " + "none");
  });

  icon03.addEventListener("click", function (): void {
    document.querySelector("#tasks").removeChild(container);
    console.log(container);
    counting--;
    tocounter();
  });
}

function tocounter(): void {
  document.querySelector("#Zähler").innerHTML = counting + " tasks";
}

function clearInput(): void {
  userTask.value = "";
}
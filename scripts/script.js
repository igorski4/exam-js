const gridEmoji = document.querySelector(".main__grid");
const count = document.querySelector(".header__count-post");
const button = document.querySelector(".header__button");
const input = document.querySelector(".header__input");

const getData = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7"
  );
  return await response.json();
};

let data = [...(await getData())];
let countPost = 0;
const dataFromLocalStorage = JSON.parse(localStorage.getItem("exam"));

const setURL = () => {
  const inputText = input.value.trim().toLowerCase();
  let url = new URL("http://127.0.0.1:5500");
  if (inputText) url.searchParams.set("search", inputText);
  window.history.replaceState(null, null, url.href);
};

const initialRender = () => {
  if (dataFromLocalStorage.length) {
    for (let elem of data) {
      let indexElement = dataFromLocalStorage.findIndex(
        (el) => el.index === elem.id
      );
      if (~indexElement) {
        render(elem);
        if (dataFromLocalStorage[indexElement].condition === true) {
          gridEmoji.lastElementChild.classList.add("item__dark");
          gridEmoji.lastElementChild.querySelector(
            ".item__checkbox"
          ).checked = true;
          countPost++;
        }
      }
    }
    count.textContent = `Количество выбранных постов: ${countPost}`;
    input.value = localStorage.getItem("findString");
    setURL();
  } else for (let elem of data) render(elem);
};

const render = (elem) => {
  let divEmoji = document.createElement("div");

  divEmoji.className = "grid__item item";
  divEmoji.innerHTML = `
                        <h2 class="item__title">${elem.title}</h2>
                        <p class="item__body">${elem.body}</p>
                        <input class="item__checkbox"
                            type="checkbox" />`;

  gridEmoji.append(divEmoji);
};

const handlerCheckbox = (event) => {
  if (event.target.checked) {
    event.target.parentElement.classList.add("item__dark");
    countPost++;
  } else {
    event.target.parentElement.classList.remove("item__dark");
    countPost--;
  }
  count.textContent = `Количество выбранных постов: ${countPost}`;
};

const handlerClickItem = (event) => {
  let tempParent = event.target;
  if (!tempParent.classList.contains("grid__item"))
    tempParent = tempParent.parentElement;
  const tempCheckbox = tempParent.querySelector(".item__checkbox");
  if (!tempCheckbox.checked) {
    tempParent.classList.add("item__dark");
    countPost++;
  } else {
    tempParent.classList.remove("item__dark");
    countPost--;
  }
  tempCheckbox.checked = !tempCheckbox.checked;
  count.textContent = `Количество выбранных постов: ${countPost}`;
};

const handlerButton = () => {
  const inputText = input.value.trim().toLowerCase();
  gridEmoji.innerHTML = "";
  data.filter((el) => el.title.toLowerCase().includes(inputText) && render(el));
  countPost = 0;
  count.textContent = `Количество выбранных постов: ${countPost}`;
  setURL();
};

initialRender();

button.addEventListener("click", handlerButton);

window.addEventListener("click", (event) => {
  if ([...document.querySelectorAll(".item__checkbox")].includes(event.target))
    handlerCheckbox(event);
  else if (
    [...document.querySelectorAll(".grid__item")].includes(
      event.target.parentElement
    ) ||
    [...document.querySelectorAll(".grid__item")].includes(event.target)
  )
    handlerClickItem(event);
});

window.addEventListener("unload", () => {
  let arr = [];
  const lengthArr = gridEmoji.children.length;
  let index;
  let condition;
  for (let i = 0; i < lengthArr; i++) {
    index =
      data[
        data.findIndex(
          (el) =>
            el.title ===
            gridEmoji.querySelectorAll(".item__title")[i].textContent
        )
      ].id;
    condition = gridEmoji.querySelectorAll(".item__checkbox")[i].checked;
    arr.push({ index, condition });
  }
  localStorage.setItem("exam", JSON.stringify(arr));
  localStorage.setItem("findString", input.value);
});

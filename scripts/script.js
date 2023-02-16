const gridEmoji = document.querySelector(".main__grid");
const count = document.querySelector(".header__count-post");
const button = document.querySelector(".header__button");
const input = document.querySelector(".header__input");

let data = [];
let countPost = 0;

const getData = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7"
  );
  return await response.json();
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

const handlerButton = () => {
  const inputText = input.value.trim().toLowerCase();
  input.value = "";
  gridEmoji.innerHTML = "";
  data.filter((el) => el.title.toLowerCase().includes(inputText) && render(el));
  countPost = 0;
  count.textContent = `Количество выбранных постов: ${countPost}`;
};

data = [...(await getData())];
for (let elem of data) render(elem);

button.addEventListener("click", handlerButton);

window.addEventListener("click", (event) => {
  if ([...document.querySelectorAll(".item__checkbox")].includes(event.target))
    handlerCheckbox(event);
});

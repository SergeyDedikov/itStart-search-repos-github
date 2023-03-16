/**
 * HTML Elements
*/
const form = document.getElementById('search');
const result = document.getElementById('search-result');
const list = document.getElementById('repos');

/**
 * API
*/
const BASE_URL = 'https://api.github.com';
const PATH_NAME = '/search/repositories';
const HEADERS = {
  'Accept': 'application/vnd.github+json'
};

const url = new URL(PATH_NAME, BASE_URL);

// создание строки для поиска
function createSearchString(url, query) {
  url.searchParams.set('q', query);
  return url.href + '+in:name'; // ищем по именам
}

let repositories = [];

// создаём карточку репозитория
function createCard(data) {

  let card = document.createElement('li');
  card.className = 'repo flex';

  card.insertAdjacentHTML(
    'afterbegin',
    `<div>
      <img
        class="repo__avatar"
        alt="Аватар владельца"
        src=${data.owner.avatar_url}>
    </div>
    <div class="flex column">
      <p>Владелец: <b>${data.owner.login}</b></p>
      <nav>
        <a
          class="repo__name"
          href=${data.html_url}
          target="_blank">
          ${data.name}
        </a>
      </nav>
      <p>&starf; ${(data.stargazers_count) ? data.stargazers_count : '0'}</p>
      <p>${(data.description) ? data.description : ''}</p>
      <p>Последние изменения: <b>${(data.updated_at).slice(0, 10)}</b></p>
    </div>`
  );

  return card;
}

// вставляем карточку в разметку
function insertCard(container, card) {
  container.append(card);
}

// очищаем разметку
function clearList(container) {
  if (!container.children.length == 0) {
    container.innerHTML = '';
  }
}

// отправка запроса
function formSubmit(e) {

  e.preventDefault();

  // тут валидация

  // очищаем предыдущий результат
  clearList(list);

  // получаем строку из поля ввода и создаём url поиска
  let searchUrl = createSearchString(url, this.query.value)

  // отправляем запрос на сервер
  fetch(searchUrl,
    {
      method: "GET",
      headers: HEADERS,
    })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        const data = await res.json();
        const message = data.message || "Что-то пошло не так!";
        return await Promise.reject(message);
      }
    })
    .then(data => {
      // получаем данные с сервера
      // берём первые 10
      repositories = data.items.slice(0, 10);
      console.log(repositories);
      // создаём карточки и вставляем в разметку
      repositories.forEach((item) => insertCard(list, createCard(item)));
      // снимаем фокус с инпута
      this.query.blur();
      // очищаем поле ввода
      this.reset();
    })
    .catch(err => console.log(err));

}

/**
 * Event Listeners
*/
form.addEventListener('submit', formSubmit);

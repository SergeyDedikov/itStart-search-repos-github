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
  url.searchParams.set('q', `${query} in:name,description`);  // ищем в имени или описании
  // сортируем по количеству звёзд
  url.searchParams.set('sort', 'stars');
  return url.href;
}

let repositories = [];

// создаём карточку репозитория
function createCard(data) {

  let card = document.createElement('li');
  card.className = 'repo';

  card.insertAdjacentHTML(
    'afterbegin',
    `<div>
      <img
        class="repo__avatar"
        alt="Аватар владельца"
        src=${data.owner.avatar_url}>
    </div>
    <div class="repo__info flex column">
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
      <p class="repo__description">${(data.description) ? data.description : 'Нет описания'}</p>
      <p>Последние изменения: <b>${(data.updated_at).slice(0, 10)}</b></p>
    </div>`
  );

  return card;
}

// вставляем карточку в разметку
function insertCard(container, card) {
  container.append(card);
}

// изменяем сообщение о результате
function changeResultMessage(message, isHidden) {
  result.textContent = message;
  result.hidden = isHidden;
}

// отправка запроса
function formSubmit(e) {

  e.preventDefault();

  // очищаем предыдущий результат
  list.innerHTML = '';

  // показываем сообщение о поиске
  changeResultMessage('Идёт поиск...', false);

  // получаем строку из поля ввода и создаём url поиска
  let searchUrl = createSearchString(url, this.query.value);

  // снимаем фокус с инпутов
  for (let elem of this.elements) elem.blur();

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

      // если массив пустой
      if (repositories.length == 0) {
        // показываем сообщение
        changeResultMessage('Ничего не найдено', false);
      } else {
        // иначе создаём карточки и вставляем в разметку
        changeResultMessage('', true);
        repositories.forEach((item) => insertCard(list, createCard(item)));
      }

      // сброс полей формы
      this.reset();
    })
    .catch(err => {
      changeResultMessage(err, false);
    });
}

/**
 * Event Listeners
*/
form.addEventListener('submit', formSubmit);

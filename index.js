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
const HEADERS_ACCEPT = 'application/vnd.github+json';

const url = new URL(PATH_NAME, BASE_URL);

// создание строки для поиска
function createSearchString(url, query) {
  url.searchParams.set('q', query);
  return url.href + '+in:name'; // ищем по именам
}

let repositories = [];

// отправка запроса
function sendQuery(e) {

  e.preventDefault();

  // тут валидация

  // получаем строку из поля ввода и создаём url поиска
  let searchUrl = createSearchString(url, this.query.value)
  
  // отправляем запрос на сервер
  fetch(searchUrl,
    {
      method: "GET",
      headers: {
        'Accept': HEADERS_ACCEPT
      },
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
    })
    .catch(err => console.log(err));

}

/**
 * Event Listeners
*/
form.addEventListener('submit', sendQuery);

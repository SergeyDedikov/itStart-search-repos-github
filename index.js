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

console.log(createSearchString(url, 'yopta'));

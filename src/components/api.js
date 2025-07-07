// api.js
const cohortId = 'wff-cohort-41'; // идентификатор группы
const token = '9af08a72-2ba7-47da-bc5b-b5434f72eda0'; // токен

const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${cohortId}`,
  headers: {
    authorization: token,
    'Content-Type': 'application/json'
  }
};

function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Ошибка: ${res.status} ${res.statusText}`));
}

export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, { headers: config.headers })
    .then(handleResponse);
}

export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, { headers: config.headers })
    .then(handleResponse);
}

export function editUserProfile({ name, about }) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(handleResponse);
}

export function addNewCard({ name, link }) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(handleResponse);
}

export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(handleResponse);
}

export function putLike(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
    method: 'PUT',
    headers: config.headers,
  }).then(handleResponse);
}

export function removeLike(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(handleResponse);
}

export function updateUserAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(handleResponse);
}

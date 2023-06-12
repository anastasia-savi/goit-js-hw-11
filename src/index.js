const { default: axios } = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector(".search-form input[name='searchQuery']"),
  cart: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
const BASE_URL = 'https://pixabay.com/api/';
const API = '37163644-8110db8e34b19fc01c5b102a4';

let pageToFetch = 1;
let queryToFetch = '';

async function fetchEvents(keyword, page) {
  try {
    const response = await axios(BASE_URL, {
      params: {
        key: API,
        q: keyword,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page: 40,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getEvents(query, page) {
  const data = await fetchEvents(query, page);
  if (data.data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  renderCards(data.data.hits);
  //   if (!data.data.hits) {
  //     refs.button.classList.remove('.invisible');
  //   }
}

function renderCards(data) {
  const markup = data
    .map(hit => {
      return `<div class="photo-card card ">
    <img src= ${hit.previewURL} alt="${hit.tags} class="card-img-top" loading="lazy" />
    <div class="info card-body">
      <p class="info-item card-text">
      Likes 
        <b>${hit.likes}</b>
      </p>
      <p class="info-item card-text">
      Views 
        <b>${hit.views}</b>
      </p>
      <p class="info-item card-text">
      Comments 
        <b>${hit.comments}</b>
      </p>
      <p class="info-item card-text">
      Downloads 
        <b>${hit.downloads}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  refs.cart.insertAdjacentHTML('beforeend', markup);
}

function onSubmit(e) {
  e.preventDefault();
  queryToFetch = refs.searchInput.value;

  pageToFetch = 1;
  refs.cart.innerHTML = '';
  getEvents(queryToFetch, pageToFetch);
  refs.button.classList.remove('invisible');
}

refs.button.addEventListener('click', loadMore);

function loadMore() {
  pageToFetch += 1;
  getEvents(queryToFetch, pageToFetch);
}

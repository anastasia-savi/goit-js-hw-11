const { default: axios } = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
let totelH;
let res;
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
  if (data.data.hits.length !== 0) {
    refs.button.classList.remove('invisible');
  }

  renderCards(data.data.hits);
  totelH = data.data.totalHits;
  if (res < 0) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.button.classList.add('invisible');
  }
  if (page === 1) {
    Notify.success(`Hooray! We found ${totelH} images.`);
  }
  let galleryModal = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: '250ms',
    captionPosition: 'bottom',
  });
}

function renderCards(data) {
  const markup = data
    .map(hit => {
      return `<div class="photo-card card ">
      <a href="${hit.largeImageURL}">
    <img src= ${hit.previewURL} alt="${hit.tags}"  class="card-img-top" loading="lazy" data-source="${hit.largeImageURL}"/></a>
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
}

refs.button.addEventListener('click', loadMore);

function loadMore() {
  pageToFetch += 1;
  res = totelH - pageToFetch * 40;
  galleryModal.refresh();
  getEvents(queryToFetch, pageToFetch);
}

/* eslint-disable max-len */
import {
  updatePost, getPost, /* auth, */
  logOut, savePost, onGetPost,
  deletePost, getDataWithFilters,
} from '../lib/firebaseAuth.js';
// eslint-disable-next-line import/no-cycle
import { onNavigate } from '../main.js';

export const Feed = () => {
  const feedDiv = document.createElement('div');
  const containerFeed = `
    <header class= "navFeed">
      <nav class="topFeed headerReset">
        <img src="images/logotype/Full-logo.png" alt="Binge Worthy logo" class="logoFeed">
        <input type="button" id="logOutMobile" value="Log out" class="button logOut">
      </nav>
    </header>

    <form id="postForm" class="modal inactive">
      <div class="gridColum mtop">
        <p id="originalPost" class="purple originalPost"></p>
        <select class="select" id="tag">
          <option disabled selected >Type</option>
          <option value="Movie">Movie</option>
          <option value="Book">Book</option>
          <option value="TV Show">TV Show</option>
        </select>
      </div>
      <textarea id="postDescription" placeholder="Write your recommendation here"></textarea>
      <div class="post">
        <input type="button" id="cancelUpload" value="Cancel" class="button gray">
        <input type="submit" id="postBtn" value="Post" class="button">
      </div>
    </form>

    <div id="overlay" class="inactive"></div>
    <div id="deleteDiv" class="inactive modal">
      <h3 class="margin purple" >Are you sure to delete?</h3>
      <div class="flexDlt">
        <input type="button" id="cancelDelete" value="Cancel" class="button gray">
        <input type="button" id="confirmDelete" value="Delete" class="button">
      </div>
    </div>
    <div id="overlayDelete" class="inactive"></div>

    <div id="postContainer"></div>

    <footer>
      <nav id= "footerMobile">
        <ul class="footerFeed darkPurple">
          <div class="listItem" id="home">
            <li class="icon-home sidebarIcon"></li>
            <p class="iconLabel">Home</p>
          </div>
          <div class="listItem" id="BookFilter">
            <li class="icon-books sidebarIcon"></li>
            <p class="iconLabel">Books</p>
          </div>
          <div class="listItem">
            <li><img src="images/mobile/upload post icon.png" id="uploadPost"></li>
          </div>
          <div class="listItem" id="MovieFilter">
            <li class="icon-video-camera sidebarIcon"></li>
            <p class="iconLabel">Movies</p>
          </div>
          <div class="listItem" id="tvShowFilter">
            <li class="icon-tv sidebarIcon"></li>
            <p class="iconLabel">TV Shows</p>
          </div>
          <div class="listItem">
            <li><input type="button" id="logOutDesktop" value="Log out" class="button logOut"></li>
          </div>
        </ul>
      </nav>
    </footer>
    `;
  feedDiv.innerHTML = containerFeed;

  const logOutBtns = feedDiv.querySelectorAll('.logOut');
  const postDescription = feedDiv.querySelector('#postDescription');
  const postBtn = feedDiv.querySelector('#postBtn');
  const postForm = feedDiv.querySelector('#postForm');
  const postContainer = feedDiv.querySelector('#postContainer');
  const tag = feedDiv.querySelector('#tag');

  const openModalPost = feedDiv.querySelector('#uploadPost');
  const closeModalBtn = feedDiv.querySelector('#cancelUpload');
  const overlay = feedDiv.querySelector('#overlay');
  let id = '';
  let editStatus = false;
  function changeToEditingStatus() {
    postBtn.value = 'Update';
  }
  function changeToPostingStatus() {
    postBtn.value = 'Post';
  }

  // Funciones de la ventana modal
  function openPostModal() {
    postForm.classList.add('active');
    overlay.classList.add('active');
    postForm.classList.remove('inactive');
    overlay.classList.remove('inactive');
  }
  function closePostModal() {
    postForm.classList.add('inactive');
    overlay.classList.add('inactive');
    postForm.classList.remove('active');
    overlay.classList.remove('active');
  }

  openModalPost.addEventListener('click', openPostModal);
  postBtn.addEventListener('click', closePostModal);
  closeModalBtn.addEventListener('click', () => {
    closePostModal();
    postForm.reset();
    changeToPostingStatus();
  });
  // Funciones de la ventana modal de delete
  const cancelDelete = feedDiv.querySelectorAll('#cancelDelete');
  const overlayDelete = feedDiv.querySelector('#overlayDelete');
  const deleteDiv = feedDiv.querySelector('#deleteDiv');
  const confirmDelete = feedDiv.querySelector('#confirmDelete');
  let deleteId = '';

  function openDeleteModal() {
    deleteDiv.classList.add('active');
    overlayDelete.classList.add('active');
    deleteDiv.classList.remove('inactive');
    overlayDelete.classList.remove('inactive');
  }
  function closeDeleteModal() {
    deleteDiv.classList.add('inactive');
    overlayDelete.classList.add('inactive');
    deleteDiv.classList.remove('active');
    overlayDelete.classList.remove('active');
  }

  const movieFilter = feedDiv.querySelector('#MovieFilter');
  const BookFilter = feedDiv.querySelector('#BookFilter');
  const tvShowFilter = feedDiv.querySelector('#tvShowFilter');
  const home = feedDiv.querySelector('#home');

  const fetchPosts = () => {
    onGetPost((querySnapshot) => {
      let posts = '';
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        posts += `
          <div id="postFormContainer" id="postForm">
            <div class="usersEmail">
              <p id="userName" class="darkPurple">example@gmail.com</p>
              <p id="tagSelected">${postData.tag}</p>
            </div>
            <p id="postBody">${postData.post}</p>
            <div class="interact">
              <i class="icon-heart likeButton" id></i>
              <button class="btnEdit" data-id=${doc.id}>
                <i class="icon-pencil"></i>Edit
              </button>
              <button class="deleteBtns" data-id="${doc.id}">
                <i class="icon-bin"></i>Delete
              </button>
            </div>
          </div>
          `;
        postContainer.innerHTML = posts;

        const btnLike = feedDiv.querySelectorAll('.likeButton');
        btnLike.forEach((btn) => {
          btn.addEventListener('click', () => {
            if (btn.classList.contains('icon-like-red')) {
              btn.classList.remove('icon-like-red');
            } else {
              btn.classList.add('icon-like-red');
            }
          });
        });
      });

      const deleteBtns = feedDiv.querySelectorAll('.deleteBtns');
      deleteBtns.forEach((btn) => {
        btn.addEventListener('click', ({ target: { dataset } }) => {
          deleteId = dataset.id;
          openDeleteModal();
        });
      });
      cancelDelete.forEach((btn) => {
        btn.addEventListener('click', () => {
          closeDeleteModal();
        });
      });

      const editBtns = feedDiv.querySelectorAll('.btnEdit');
      editBtns.forEach((btn) => {
        btn.addEventListener('click', async ({ target: { dataset } }) => {
          editStatus = true;
          changeToEditingStatus();
          openPostModal();
          const doc = await getPost(dataset.id);
          const postDoc = doc.data();
          postDescription.value = postDoc.post;
          tag.value = postDoc.tag;
          id = dataset.id;
        });
      });
    });
  };
  fetchPosts();

  confirmDelete.addEventListener('click', () => {
    deletePost(deleteId)
      .then(() => {
        deleteDiv.classList.add('inactive');
        overlayDelete.classList.add('inactive');
        deleteDiv.classList.remove('active');
        overlayDelete.classList.remove('active');
      });
  });

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editStatus) {
      savePost(postDescription, tag);
    } else {
      updatePost(id, {
        post: postDescription.value,
        tag: tag.value,
      });
      changeToPostingStatus();
      editStatus = false;
    }
    postForm.reset();
  });

  logOutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      logOut()
        .then(() => {
          onNavigate('/');
        });
    });
  });

  // Filtro tag según: movie, book, tvShow
  movieFilter.addEventListener('click', () => {
    getDataWithFilters('Movie', (querySnapshot) => {
      let posts = '';
      postContainer.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        posts += `
        <div id="postFormContainer" id="postForm">
          <div class="usersEmail">
            <p id="userName" class="darkPurple">example@gmail.com</p>
            <p id="tagSelected">${postData.tag}</p>
          </div>
          <p class="postBody">${postData.post}</p>
        </div>
        `;
      });
      postContainer.innerHTML = posts;
    });
  });
  BookFilter.addEventListener('click', () => {
    getDataWithFilters('Book', (querySnapshot) => {
      let posts = '';
      postContainer.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        posts += `
        <div id="postFormContainer" id="postForm">
          <div class="usersEmail">
            <p id="userName" class="darkPurple">example@gmail.com</p>
            <p id="tagSelected">${postData.tag}</p>
          </div>
          <p class="postBody">${postData.post}</p>
        </div>
        `;
      });
      postContainer.innerHTML = posts;
    });
  });
  tvShowFilter.addEventListener('click', () => {
    getDataWithFilters('TV Show', (querySnapshot) => {
      let posts = '';
      postContainer.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        posts += `
        <div id="postFormContainer" id="postForm">
          <div class="usersEmail">
            <p id="userName" class="darkPurple">example@gmail.com</p>
            <p id="tagSelected">${postData.tag}</p>
          </div>
          <p class="postBody">${postData.post}</p>
        </div>
        `;
      });
      postContainer.innerHTML = posts;
    });
  });
  // home recarga la pantalla
  home.addEventListener('click', () => {
    onNavigate('/feed');
  });
  return feedDiv;
};

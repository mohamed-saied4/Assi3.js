// تعريف المتغيرات
const inputSiteName = document.getElementById("siteName");
const inputSiteURL = document.getElementById("siteURL");
const addButton = document.getElementById("addButton");
const bookmarksTable = document.getElementById("bookmarksTable");
const closeButton = document.getElementById("closeButton");
const modalBox = document.querySelector(".modal-box");
let deleteButtons;
let visitButtons;
let bookmarksList = [];

// استرجاع العلامات المرجعية من التخزين المحلي إذا كانت موجودة
if (localStorage.getItem("bookmarksList")) {
  bookmarksList = JSON.parse(localStorage.getItem("bookmarksList"));
  bookmarksList.forEach((bookmark, index) => {
    displayBookmark(index);
  });
}

// دالة عرض العلامة المرجعية
function displayBookmark(index) {
  const userURL = bookmarksList[index].url;
  const httpsRegex = /^https?:\/\//g;
  let fixedURL, validURL;

  if (httpsRegex.test(userURL)) {
    validURL = userURL;
    fixedURL = validURL.slice(validURL.match(httpsRegex)[0].length);
  } else {
    fixedURL = userURL;
    validURL = `https://${userURL}`;
  }

  const newBookmark = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmarksList[index].name}</td>              
      <td><button class="btn btn-visit" data-index="${index}"><i class="fa-solid fa-eye pe-2"></i>Visit</button></td>
      <td><button class="btn btn-delete pe-2" data-index="${index}"><i class="fa-solid fa-trash-can"></i>Delete</button></td>
    </tr>
  `;
  bookmarksTable.insertAdjacentHTML("beforeend", newBookmark);
}

// دالة إضافة علامة مرجعية جديدة
function addBookmark() {
  const name = inputSiteName.value.trim();
  const url = inputSiteURL.value.trim();

  if (name && url) {
    const bookmark = { name: name, url: url };
    bookmarksList.push(bookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
    displayBookmark(bookmarksList.length - 1);
    clearInputs();
  } else {
    modalBox.classList.remove("d-none");
  }
}

// دالة حذف علامة مرجعية
function deleteBookmark(index) {
  bookmarksTable.innerHTML = "";
  bookmarksList.splice(index, 1);
  bookmarksList.forEach((bookmark, index) => {
    displayBookmark(index);
  });
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
}

// دالة زيارة علامة مرجعية
function visitBookmark(index) {
  const websiteURL = bookmarksList[index].url;
  const httpsRegex = /^https?:\/\//;
  const fullURL = httpsRegex.test(websiteURL) ? websiteURL : `https://${websiteURL}`;
  open(fullURL);
}

// دالة تنظيف حقول الإدخال
function clearInputs() {
  inputSiteName.value = "";
  inputSiteURL.value = "";
}

// معالجات الأحداث
addButton.addEventListener("click", addBookmark);

closeButton.addEventListener("click", () => {
  modalBox.classList.add("d-none");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalBox.classList.add("d-none");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-box")) {
    modalBox.classList.add("d-none");
  }
});

bookmarksTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const index = parseInt(e.target.dataset.index);
    deleteBookmark(index);
  } else if (e.target.classList.contains("btn-visit")) {
    const index = parseInt(e.target.dataset.index);
    visitBookmark(index);
  }
});

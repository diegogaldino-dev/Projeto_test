window.onload = () => {
  noResults();
  hideLoader();
};

const overlay = document.querySelector(".overlay");
const form = document.querySelector("#filterForm");
const imageNoResults = document.querySelector("#imageNoResults");
const generarNoResult = document.querySelector("#generarNoResult");
const generarResultContent = document.querySelector("#generarResultContent");
const isNoResultDiv = document.querySelector(".no-result");
const isResultContentDiv = document.querySelector(".result-content");
const btnTop = document.querySelector("#btnTop");

btnTop.addEventListener(
  "click",
  function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  false
);

form.addEventListener("change", (event) => {
  event.preventDefault();
  var selects = document.getElementById("filterForm").elements;

  if (
    selects.filterSunlight.value !== "" &&
    selects.filterWater.value !== "" &&
    selects.filterPet.value !== ""
  ) {
    getResponse(
      selects.filterSunlight.value,
      selects.filterWater.value,
      selects.filterPet.value
    );
    showLoader();
  } else {
    noResults();
  }
});

function getResponse(sunlight, water, pet) {
  const url = `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sunlight}&water=${water}&pets=${pet}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      hideLoader();
      resultHtmlResponse(data);
    });
}

function resultHtmlResponse(responseApi) {
  if (responseApi.error) {
    noResults(responseApi.error);
  } else {
    resultContent(responseApi);
  }
}

function noResults(error) {
  isNoResult();
  addImage();

  let spanText = "";

  if (error) {
    spanText = `
    <h1>We are sorry!!</h1>
    <div class="result-text">
        <span>${error} :(</span>
    </div>
    `;
  } else {
    spanText = `
    <h1>No Results yet...</h1>
    <div class="result-text">
        <span
            >Use the filters above to find the plant that best fits your
            environment :)</span
        >
    </div>

    `;
  }
  generarNoResult.innerHTML = `
    <div class="result-empty">
        ${spanText}
    </div>

    `;
}

function resultContent(obj) {
  obj.sort((a, b) =>
    a.staff_favorite === true ? -1 : b.staff_favorite === true ? 1 : 0
  );
  isResultContent();
  removeImage();

  let resultContentDiv = [];
  obj.forEach((element, i) => {
    resultContentDiv.push(`
        <div class="card"> 
          <div id="staffFavorite" class="staff-favorite">
            <span>Staff favorite</span>
          </div>
          <div class="card-header">
              <img class="plant-img" src="${element.url}">
          </div>
          <div class="card-body">
            <span> ${element.name} </span>
            <div class="card-info">
              <span> $${element.price} </span>  
              <div class="icon-align">              
                <div id="generarIcons"> ${defineIcon(element.toxicity)} </div>
                <div id="generarIcons"> ${defineIcon(element.sun)} </div>
                <div id="generarIcons"> ${defineIcon(element.water)} </div>
              </div>
            </div>
          </div>
        </div>
    `);
  });

  generarResultContent.innerHTML = resultContentDiv.join("");
  const firstChild = generarResultContent.firstElementChild;
  firstChild.classList.add("first-card");
  if (window.matchMedia("(max-width: 850px)").matches) {
    firstChild.classList.remove("first-card");
  }
  setStaffFavorite(obj);
}

function setStaffFavorite(obj) {
  let isntStaffFavorite = [];

  obj.forEach((element, i) => {
    if (element.staff_favorite !== true) {
      isntStaffFavorite.push(i);
    }
  });

  isntStaffFavorite.forEach((element) => {
    const isntFavorite = generarResultContent.children[element];
    isntFavorite.children[0].style.display = "none";
  });
}

function defineIcon(icon) {
  if (icon === true) {
    return `
      <img src="https://imgur.com/bBZy3JL.png" />
    `;
  }
  if (icon === false) {
    return `
      <img src="https://imgur.com/zIdGdBL.png" />
    `;
  }
  if (icon === "regularly") {
    return `
      <img src="https://imgur.com/VnfIhoO.png"/>
    `;
  }
  if (icon === "daily") {
    return `
      <img src="https://imgur.com/irAnGMd.png" />
    `;
  }
  if (icon === "rarely") {
    return `
      <img src="https://imgur.com/rdi2mqT.png" />
    `;
  }
  if (icon === "no") {
    return `
      <img src="https://imgur.com/qcxWGvM.png" />
    `;
  }
  if (icon === "low" || icon === "high") {
    return `
      <img src="https://imgur.com/IrUEqmb.png" />
    `;
  }
}  
function removeImage() {
  imageNoResults.classList.add("d-none");
}

function addImage() {
  imageNoResults.classList.remove("d-none");
}

function showLoader() {
  overlay.style.display = "flex";
}

function hideLoader() {
  overlay.style.display = "none";
}

function isNoResult() {
  isNoResultDiv.style.display = "grid";
  isResultContentDiv.classList.add("d-none");
  btnTop.style.display = "none";
}

function isResultContent() {
  isNoResultDiv.style.display = "none";
  isResultContentDiv.classList.remove("d-none");
  btnTop.style.display = "flex";
}

window.addEventListener("resize", function () {
  const firstChild = generarResultContent.firstElementChild;
  if (firstChild !== null) {
    if (window.matchMedia("(max-width: 850px)").matches) {
      firstChild.classList.remove("first-card");
    } else {
      firstChild.classList.add("first-card");
    }
  }
});
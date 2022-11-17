"use strict";

window.addEventListener("DOMContentLoaded", start);

// Student JSON Data
const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodJsonURL = "https://petlatkea.dk/2021/hogwarts/families.json";

// Global Student Array
let allStudents = [];
let enrolledStudents = [];
let expelledStudents = [];

let studentList;

// Student Prototype Object
const Student = {
  firstName: "-unknown-",
  lastName: "-unknown-",
  middleName: "-unknown-",
  nickName: "-unknown-",
  gender: "",
  image: ".png",
  house: "",
  blood: "",
  isPrefect: 0,
  isInqSquad: 0,
};

const settings = {
  filterBy: "allStudents",
  sortBy: "firstName",
  sortDir: "asc",
};

function start() {
  console.log("Ready to start!");
  loadJSON();
  registerButtons();
}
async function loadJSON() {
  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function registerButtons() {
  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  displayList(allStudents);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);

  let fullName = jsonObject.fullname.trim(); // Student full name with no space before or after
  let house = jsonObject.house.trim(); // Student house with no space before or after
  let gender = jsonObject.gender.trim(); // Student gender with no space before or after

  //? Name prep

  // First name cleaning & selecting
  if (fullName.includes(" ")) {
    // Make first char upper case and rest lower case
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1, fullName.indexOf(" ")).toLowerCase();
  } else {
    // if only first name is know make first char upper case and rest lower case
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1).toLowerCase();
  }

  // Last name cleaning & selecting
  if (fullName.includes(" ")) {
    student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2).toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
  }

  // middle name

  if (fullName.split(" ").length > 2) {
    student.middleName = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
  }
  // nickname
  if (fullName.includes('"')) {
    student.nickName = fullName.substring(fullName.indexOf('"') + 1, fullName.lastIndexOf('"'));
    student.middleName = "";
  }

  // gender
  student.gender = gender.substring(1, 0).toUpperCase() + gender.substring(1).toLowerCase();

  // image
  student.image = `${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;

  // house
  student.house = house.substring(1, 0).toUpperCase() + house.substring(1).toLowerCase();

  // Blood
  loadBloodJSON();

  async function loadBloodJSON() {
    const response = await fetch(bloodJsonURL);
    const bloodFamilyList = await response.json();

    student.blood = updateBlood(bloodFamilyList);

    function updateBlood(bloodFamilyList) {
      if (bloodFamilyList.pure.includes(student.lastName) === true) return "Pure Blood";
      else if (bloodFamilyList.half.includes(student.lastName) === true) return "Half Blood";
      return "Muggle";
    }
  }

  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    // Filtered list of only gryffindor
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    // Filtered list of only hufflepuff
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    // Filtered list of only Ravenclaw
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    // Filtered list of only Slytherin
    filteredList = allStudents.filter(isSlytherin);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find prior sortBy element & remove sortBy class
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // Highlight active sort
  event.target.classList.add("sortby");

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //   let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  // console.table(sortedList);
  displayList(sortedList);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find prior sortBy element & remove sortBy class
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // Highlight active sort
  event.target.classList.add("sortby");

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //   let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  // console.table(sortedList);
  displayList(sortedList);
}
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  // console.table(sortedList);

  return sortedList;
}

function displayList(activeArray) {
  document.querySelector("#studentListBody").innerHTML = ""; // clear list
  activeArray.forEach(displayStudent);
}

function displayStudent(student) {
  let clone = document.querySelector("#studentTemplate").content.cloneNode(true); // create clone

  clone.querySelector('[data-field="firstName"]').textContent = student.firstName;
  clone.querySelector('[data-field="lastName"]').textContent = student.lastName;
  clone.querySelector('[data-field="house"]').textContent = student.house;
  clone.querySelector("[data-field=prefect]").addEventListener("click", (event) => {
    student.isPrefect = !student.isPrefect;

    if (student.isPrefect) {
      event.target.classList.add("isPrefect");
    } else {
      event.target.classList.remove("isPrefect");
    }
  });
  clone.querySelector("[data-field=inqSquad]").addEventListener("click", (event) => {
    student.isInqSquad = !student.isInqSquad;

    if (student.isInqSquad) {
      event.target.classList.add("isInqSquad");
    } else {
      event.target.classList.remove("isInqSquad");
    }
  });

  clone.querySelector(".modalButton").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("hidden");
    console.log("clicked");
    if (student.nickName === "-unknown-") {
      document.querySelector("#studentFullName").textContent = student.firstName + " " + student.lastName;
    } else {
      document.querySelector("#studentFullName").textContent = student.firstName + " " + student.lastName + ' | "' + student.nickName + '"';
    }
    document.querySelector("#studentGender").textContent = student.gender;
    document.querySelector("#studentHouse").textContent = student.house;
    document.querySelector("#studentImage").src = `assets/images/${student.image}`;
    document.querySelector("#studentBloodStatus").textContent = student.blood;
  });

  // append clone to list
  document.querySelector("#studentListBody").appendChild(clone);

  updateStatistics();
}

function updateStatistics() {
  let gryffindorList = allStudents.filter(isGryffindor).length;
  let slytherinList = allStudents.filter(isSlytherin).length;
  let ravenclawList = allStudents.filter(isRavenclaw).length;
  let hufflepuffList = allStudents.filter(isHufflepuff).length;

  document.querySelector("#totalStudents").textContent = allStudents.length;
  document.querySelector("#enrolledStudents").textContent = expelledStudents.length;
  document.querySelector("#expelledStudents").textContent = expelledStudents.length;
  document.querySelector("#gryffindorStudents").textContent = gryffindorList;
  document.querySelector("#slytherinStudents").textContent = slytherinList;
  document.querySelector("#ravenclawStudents").textContent = ravenclawList;
  document.querySelector("#hufflepuffStudents").textContent = hufflepuffList;
}

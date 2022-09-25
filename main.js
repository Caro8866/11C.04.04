"use strict";

window.addEventListener("DOMContentLoaded", start);

// Student JSON Data
const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";

// Global Student Array
let allStudents = [];

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
  isPrefect: 0,
  isInqSquad: 0,
};

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

function start() {
  console.log("Ready to start!");
  loadJSON();
}
async function loadJSON() {
  const response = await fetch(jsonURL);
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
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

  return student;
}

function displayList(students) {
  document.querySelector("#studentListBody").innerHTML = ""; // clear list
  allStudents.forEach(displayStudent);
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

  // append clone to list
  document.querySelector("#studentListBody").appendChild(clone);
}

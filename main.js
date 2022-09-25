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
  return student;
}

function displayList(students) {
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {}

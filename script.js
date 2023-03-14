const addStudentModalWrapper = document.getElementById("add-student");
const confirmDeletionModalWrapper = document.getElementById("confirm-deletion");
const addStudentModal = addStudentModalWrapper?.querySelector(".modal");
const confirmDeletionModal = confirmDeletionModalWrapper?.querySelector(".modal");

const addStudentForm = document.getElementById("add-student-form");
const addStudentButton = document.getElementById("add-student-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const studentsTable = document.getElementById("students-table");




const students = [
  {id: 0, group: "PZ-22", name: "Amy", surname: "Lio", birthday: "2023-03-07", gender: "F", active: false},
  {id: 1, group: "PZ-23", name: "Someone", surname: "111", birthday: "2020-03-07", gender: "M", active: false}
];

students.forEach(el => createStudent(el));

// Create student modal events

addStudentButton.onclick = showStudentModal;
closeModalButton.onclick = e => {
  e.preventDefault();
  hideStudentModal();
};

addStudentForm.onsubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const student = {...Object.fromEntries(formData), id: students.length};
  students.push(student);
  createStudent(student);
  hideStudentModal();
};

document.addEventListener("mousedown", (e) => {
  handleClickOutside(e, addStudentModal, hideStudentModal);
  handleClickOutside(e, confirmDeletionModal, hideConfirmationModal);
});

function validateStudentForm(student) {
  const makeInputInvalid = className => document.getElementById(className).classList.add("invalid");

  if (!student.group || student.group === "") {
    makeInputInvalid("group");
    return false;
  }

  
  if (!student.name?.trim().length || student.name.length < 3) {
    makeInputInvalid("name");
    return false;
  }


}

function onStudentEdit(e, id) {
  const formData = new FormData(e.target);
  const student = {...Object.fromEntries(formData), id};
  if (!validateStudentForm(student)) return;
  students[students.findIndex(el => el.id === id)] = student;
  createStudent(student, true);
  hideStudentModal();
}

function onStudentCreate(e) {
  const formData = new FormData(e.target);
  const student = {...Object.fromEntries(formData), id: students.length};
  if (!validateStudentForm(student)) return;
  students.push(student);
  createStudent(student);
  hideStudentModal();
}


function createStudent({id, group, name, surname, birthday, gender, active}, replace) {
  const tr = document.createElement("tr");
  tr.id = `student-${id}`;
  const checkbox = document.createElement("input");
  const checkBoxTd = document.createElement("td");
  checkbox.type = "checkbox";
  checkBoxTd.appendChild(checkbox);
  tr.appendChild(checkBoxTd);

  const cells = [group, `${name} ${surname}`, gender, birthday];
  
  for (let cellContent of cells) {
    const td = document.createElement("td");
    td.textContent = cellContent;
    tr.appendChild(td);  
  }

  const activeTd = document.createElement("td");
  const activeDiv = document.createElement("div");
  activeDiv.classList.add("status");
  active && activeDiv.classList.add("active");
  activeTd.appendChild(activeDiv);
  tr.appendChild(activeTd);

  const optionsTd = document.createElement("td");
  const editButton = document.createElement("button");
  const removeButton = document.createElement("button");
  editButton.onclick = () => onStudentEditModal(id);
  removeButton.onclick = () => confirmDeletion(id);

  const editButtonIcon = document.createElement("i");
  editButtonIcon.classList.add("fa", "fa-edit");
  const removeButtonIcon = document.createElement("i");
  removeButtonIcon.classList.add("fa", "fa-remove");

  editButton.appendChild(editButtonIcon);
  removeButton.appendChild(removeButtonIcon);

  optionsTd.appendChild(editButton);
  optionsTd.appendChild(removeButton);
  tr.appendChild(optionsTd);

  if (replace) {
    document.getElementById(`student-${id}`).replaceWith(tr);
  } else {
    studentsTable.querySelector("tbody").appendChild(tr);
  }
  return tr;
}

function confirmDeletion(id) {
  showConfirmationModal();
  const confirmDeletionButton = document.getElementById("confirm-deletion-btn");
  const cancelDeletionButton = document.getElementById("cancel-deletion-btn");
  const student = students.find(el => el.id === id);
  document.getElementById("confirm-question")
    .textContent = `Are you sure you want to delete ${student.name} ${student.surname}?`;

  confirmDeletionButton.onclick = () => {
    removeStudent(id);
    hideConfirmationModal();
  };
  cancelDeletionButton.onclick = hideConfirmationModal;
}

function removeStudent(id) {
  document.getElementById(`student-${id}`)?.remove();
  students.filter(el => el.id !== id);
}

function onStudentEditModal(id) {
  showStudentModal("edit", id);
  const student = students.find(el => el.id === id);
  if (!student) return;
  const group = document.getElementById("group");
  const name = document.getElementById("name");
  const surname = document.getElementById("surname");
  const gender = document.getElementById("gender");
  const birthday = document.getElementById("birthday");
  group.value = student.group;
  name.value = student.name;
  surname.value = student.surname;
  gender.value = student.gender;
  birthday.value = student.birthday;
}

function hideStudentModal() {
  addStudentModalWrapper.classList.add("hidden");
}

function showStudentModal(mode, id) {
  if (mode === "edit") {
    document.getElementById("modal-title").textContent = "Edit student";
    addStudentForm.onsubmit = (e) => {
      e.preventDefault();
      onStudentEdit(e, id);
    };   
  } else {
    document.getElementById("modal-title").textContent = "Create student"
    addStudentForm.onsubmit = (e) => {
      e.preventDefault();
      onStudentCreate(e);
    }
  }
  addStudentModalWrapper.classList.remove("hidden");
}

function hideConfirmationModal() {
  confirmDeletionModalWrapper.classList.add("hidden")
}

function showConfirmationModal() {
  confirmDeletionModalWrapper.classList.remove("hidden");
}

function handleClickOutside({target}, element, callback) {
  if (element && target instanceof HTMLElement && !element.contains(target)) {
    callback();
  }
}

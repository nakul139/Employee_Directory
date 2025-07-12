const mockEmployees = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    department: "HR",
    role: "Manager",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    department: "IT",
    role: "Developer",
  },
  {
    id: 3,
    firstName: "Charlie",
    lastName: "Lee",
    email: "charlie@example.com",
    department: "Finance",
    role: "Analyst",
  },
];

let employees = [...mockEmployees];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = "";
let searchTerm = "";

const employeeListContainer = document.getElementById(
  "employee-list-container"
);
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const showSelect = document.getElementById("show-select");
const addEmployeeBtn = document.getElementById("add-employee-btn");
const formModal = document.getElementById("employee-form-modal");
const employeeForm = document.getElementById("employee-form");
const formTitle = document.getElementById("form-title");
const formErrors = document.getElementById("form-errors");
const cancelBtn = document.getElementById("cancel-btn");

function renderEmployees() {
  let filtered = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm)
    );
  });

  if (currentSort === "name") {
    filtered.sort((a, b) =>
      (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
    );
  } else if (currentSort === "department") {
    filtered.sort((a, b) => a.department.localeCompare(b.department));
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filtered.slice(start, end);

  employeeListContainer.innerHTML = "";
  paginated.forEach((emp) => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.setAttribute("data-employee-id", emp.id);
    card.innerHTML = `
      <strong>${emp.firstName} ${emp.lastName}</strong><br>
      <b>Email:</b> ${emp.email}<br>
      <b>Department:</b> ${emp.department}<br>
      <b>Role:</b> ${emp.role}<br>
      <button class="edit-btn" data-id="${emp.id}">Edit</button>
      <button class="delete-btn" data-id="${emp.id}">Delete</button>
    `;
    employeeListContainer.appendChild(card);
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => openForm("edit", btn.dataset.id);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => deleteEmployee(btn.dataset.id);
  });
}

function openForm(mode, id) {
  formModal.classList.remove("hidden");
  formErrors.innerText = "";
  employeeForm.reset();

  if (mode === "edit") {
    formTitle.innerText = "Edit Employee";
    const emp = employees.find((e) => e.id == id);
    document.getElementById("employee-id").value = emp.id;
    document.getElementById("first-name").value = emp.firstName;
    document.getElementById("last-name").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("role").value = emp.role;
  } else {
    formTitle.innerText = "Add Employee";
    document.getElementById("employee-id").value = "";
  }
}

function closeForm() {
  formModal.classList.add("hidden");
  employeeForm.reset();
  formErrors.innerText = "";
}

function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter((e) => e.id != id);
    renderEmployees();
  }
}

function validateForm() {
  let valid = true;
  let errors = [];
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const role = document.getElementById("role").value.trim();

  if (!firstName) errors.push("First name is required.");
  if (!lastName) errors.push("Last name is required.");
  if (!email) errors.push("Email is required.");
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email format.");
  if (!department) errors.push("Department is required.");
  if (!role) errors.push("Role is required.");

  if (errors.length > 0) {
    formErrors.innerText = errors.join(" ");
    return false;
  }
  return true;
}

employeeForm.onsubmit = function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const id = document.getElementById("employee-id").value;
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const role = document.getElementById("role").value.trim();

  if (id) {
    const emp = employees.find((e) => e.id == id);
    emp.firstName = firstName;
    emp.lastName = lastName;
    emp.email = email;
    emp.department = department;
    emp.role = role;
  } else {
    const newId = employees.length
      ? Math.max(...employees.map((e) => e.id)) + 1
      : 1;
    employees.push({
      id: newId,
      firstName,
      lastName,
      email,
      department,
      role,
    });
  }
  closeForm();
  renderEmployees();
};

cancelBtn.onclick = closeForm;
addEmployeeBtn.onclick = () => openForm("add");

searchInput.oninput = function () {
  searchTerm = this.value.toLowerCase();
  currentPage = 1;
  renderEmployees();
};

sortSelect.onchange = function () {
  currentSort = this.value;
  renderEmployees();
};

showSel;

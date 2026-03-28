let btnAdd = document.getElementById("btnAdd");
let AllDelete = document.getElementById("AllDelete");
let form = document.getElementById("form");
let modal = document.getElementById("modal");
let btnReset = document.getElementById("btnReset");
let btnsubmit = document.getElementById("submit");



let research = document.getElementById("research");
let sect2 = document.getElementById("sect2");
let mat = document.getElementById("mat");
let name = document.getElementById("name");
let age = document.getElementById("age");
let surname = document.getElementById("surname");
let sexe = document.getElementById("sexe");
let email = document.getElementById("email");
let totalCount = document.getElementById("totalCount");



// Erreurs
let errorMsg = document.getElementById("errorMsg");
let matError = document.getElementById("matError");
let nameError = document.getElementById("nameError");
let ageError = document.getElementById("ageError");
let surnameError = document.getElementById("surnameError");
let sexeError = document.getElementById("sexeError");
let emailError = document.getElementById("emailError");



// Photo
let photoInput = document.getElementById("photoInput");
let imgPreview = document.getElementById("imgPreview");
let imageBase64 = "";
let editIndex = -1;


// Données depuis localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];
displayStudentsCard(students);


// ============================================================
//  GESTION DU MODAL
// ============================================================
btnAdd.addEventListener("click", () => {
    modal.classList.add("show");
    document.getElementById("formTitle").textContent = "Nouvel Étudiant";
    imgPreview.src = "./image/default.png";
    imageBase64 = "";
    editIndex = -1;
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

btnReset.addEventListener("click", closeModal);

function closeModal() {
    modal.classList.remove("show");
    form.reset();
    resetErrors();
    errorMsg.textContent = "";
    editIndex = -1;
}

// ============================================================
//  SOUMISSION DU FORMULAIRE
// ============================================================
form.addEventListener("submit", function (e) {
    e.preventDefault();
    resetErrors();
    errorMsg.textContent = "";

    let isValid = true;

    if (mat.value.trim() === "") {
        matError.textContent = "Matricule obligatoire";
        mat.classList.add("input-error");
        isValid = false;
    }

    if (name.value.trim() === "") {
        nameError.textContent = "Nom obligatoire";
        name.classList.add("input-error");
        isValid = false;
    }

    if (surname.value.trim() === "") {
        surnameError.textContent = "Prénom obligatoire";
        surname.classList.add("input-error");
        isValid = false;
    }

    if (age.value === "" || Number(age.value) < 0) {
        ageError.textContent = "Âge invalide";
        age.classList.add("input-error");
        isValid = false;
    }

    if (!verifierEmail(email.value)) {
        emailError.textContent = "Email invalide (doit être @gmail.com)";
        email.classList.add("input-error");
        isValid = false;
    }

    if (!isValid) return;

    let exist = students.some(function (student, i) {
        if (editIndex !== -1 && i === editIndex) return false;
        return (
            student.mat.toLowerCase().trim() === mat.value.toLowerCase().trim() &&
            student.name.toLowerCase().trim() === name.value.toLowerCase().trim() &&
            student.surname.toLowerCase().trim() === surname.value.toLowerCase().trim() &&
            student.sexe.toLowerCase().trim() === sexe.value.toLowerCase().trim() &&
            student.age == age.value &&
            student.email.toLowerCase().trim() === email.value.toLowerCase().trim()
        );
    });

    if (exist) {
        errorMsg.textContent = "Cet étudiant existe déjà !";
        return;
    }

    let student = {
        img: imageBase64 || "./image/default.png",
        mat: mat.value.trim(),
        name: name.value.trim(),
        age: age.value,
        surname: surname.value.trim(),
        sexe: sexe.value,
        email: email.value.trim()
    };

    if (editIndex !== -1) {
        // Conserver l'ancienne image si pas de nouvelle
        if (!imageBase64) {
            student.img = students[editIndex].img;
        }
        students[editIndex] = student;
        editIndex = -1;
    } else {
        students.push(student);
    }

    localStorage.setItem("students", JSON.stringify(students));
    displayStudentsCard(students);
    closeModal();
});



// ============================================================
//  AFFICHAGE DES CARTES
// ============================================================
function displayStudentsCard(list) {
    if (totalCount) totalCount.textContent = list.length;

    if (list.length === 0) {
        sect2.innerHTML = `
            <div class="empty">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                </div>
                <h3>Aucun étudiant trouvé</h3>
                <p>Cliquez sur "Add Student" pour commencer</p>
            </div>`;
        return;
    }

    sect2.innerHTML = "";

    list.forEach((student, index) => {
        let card = `
            <div class="card">
                <img src="${student.img}" alt="photo">
                <span class="card-mat">${student.mat}</span>
                <h3>${student.name} ${student.surname}</h3>
                <div class="card-info">
                    <p>${student.age} ans·${student.sexe}</p>
                    <p class="card-email">${student.email}</p>
                </div>
                <div class="boutons">
                    <button class="action-btn edit-btn" onclick="EditStudent(${index})" title="Modifier">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" onclick="DeleteStudent(${index})" title="Supprimer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                        </svg>
                    </button>
                    <button class="action-btn download-btn" title="Télécharger">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                </div>
            </div>`;

        sect2.innerHTML += card;
    });
}

// ============================================================
//  MODIFIER UN ÉTUDIANT
// ============================================================
function EditStudent(index) {
    let student = students[index];

    mat.value = student.mat;
    name.value = student.name;
    age.value = student.age;
    surname.value = student.surname;
    sexe.value = student.sexe;
    email.value = student.email;

    imgPreview.src = student.img;
    imageBase64 = student.img;
    editIndex = index;

    modal.classList.add("show");
}

// ============================================================
//  SUPPRIMER UN ÉTUDIANT
// ============================================================
function DeleteStudent(index) {
    if (confirm("Supprimer cet étudiant ?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        displayStudentsCard(students);
    }
}

// ============================================================
//  SUPPRIMER TOUS
// ============================================================
AllDelete.addEventListener("click", function () {
    if (confirm("Voulez-vous vraiment supprimer tous les étudiants ?")) {
        students = [];
        localStorage.removeItem("students");
        displayStudentsCard(students);
    }
});

// ============================================================
//  PHOTO PROFIL
// ============================================================
photoInput.addEventListener("change", function () {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            imgPreview.src = e.target.result;
            imageBase64 = e.target.result;
        };
    }
});

// ============================================================
//  RECHERCHE EN TEMPS RÉEL
// ============================================================
research.addEventListener("input", function () {
    let value = this.value.toLowerCase().trim();
    let filtered = students.filter(s =>
        s.name.toLowerCase().includes(value) ||
        s.surname.toLowerCase().includes(value) ||
        s.mat.toLowerCase().includes(value) ||
        s.email.toLowerCase().includes(value)
    );
    displayStudentsCard(filtered);
});

// ============================================================
//  TÉLÉCHARGER CARTE (download-btn)
// ============================================================
document.addEventListener("click", function (e) {
    let btn = e.target.closest(".download-btn");
    if (btn) {
        let card = btn.closest(".card");
        let boutons = card.querySelector(".boutons");
        boutons.style.visibility = "hidden";

        html2canvas(card).then(canvas => {
            boutons.style.visibility = "visible";
            let link = document.createElement("a");
            link.download = "student_card.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }
});

// ============================================================
//  FONCTIONS UTILITAIRES
// ============================================================
function resetErrors() {
    [matError, nameError, ageError, surnameError, sexeError, emailError].forEach(el => el.textContent = "");
    [mat, name, age, surname, sexe, email].forEach(el => el.classList.remove("input-error"));
}

function verifierEmail(val) {
    return /^[^\s@]+@gmail\.com$/.test(val);
}

function MatriculeValide(matricule) {
    return /^[a-zA-Z0-9]{1,7}$/.test(matricule);
}


// ============================================================
// compteur d`etudiants au total
// ===========================================================
function updateTotal(){
    totalStudent.textContent = students.length + " Etudiants";
}


document.getElementById("Export").addEventListener("click", function () {
    if (students.length === 0) {
        alert("Aucun étudiant à exporter !");
        return;
    }

    // Préparer les données sans l'image (base64 trop lourde pour Excel)
    let data = students.map(s => ({
        Matricule: s.mat,
        Nom:       s.name,
        Prénom:    s.surname,
        Âge:       s.age,
        Sexe:      s.sexe,
        Email:     s.email
    }));

    // Créer le fichier Excel
    let worksheet  = XLSX.utils.json_to_sheet(data);
    let workbook   = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Étudiants");

    // Télécharger
    XLSX.writeFile(workbook, "liste_etudiants.xlsx");
});
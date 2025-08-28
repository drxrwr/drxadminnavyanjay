const columnsContainer = document.getElementById("columnsContainer");
const fillNamesBtn = document.getElementById("fillNames");
const clearNamesBtn = document.getElementById("clearNames");
const clearNumbersBtn = document.getElementById("clearNumbers");
const roleSelect = document.getElementById("roleSelect");
const orderSelect = document.getElementById("orderSelect");
const startCount = document.getElementById("startCount");
const globalName = document.getElementById("globalName");

const totalColumns = 20;

// buat 20 kolom
for (let i = 1; i <= totalColumns; i++) {
  const col = document.createElement("div");
  col.className = "column";

  col.innerHTML = `
    <input type="text" class="fileName" placeholder="Nama File ${i}">
    <textarea class="numbers" placeholder="Masukkan nomor, satu per baris"></textarea>
    <button class="download-btn">Download VCF</button>
    <button class="delete-btn">Hapus Nama File</button>
  `;

  columnsContainer.appendChild(col);
}

// isi otomatis nama file
fillNamesBtn.addEventListener("click", () => {
  document.querySelectorAll(".fileName").forEach((input, idx) => {
    input.value = `${globalName.value || "File"}_${idx + 1}`;
  });
});

// hapus semua nama file
clearNamesBtn.addEventListener("click", () => {
  document.querySelectorAll(".fileName").forEach(input => {
    input.value = "";
  });
});

// hapus semua isi box nomor
clearNumbersBtn.addEventListener("click", () => {
  document.querySelectorAll(".numbers").forEach(area => {
    area.value = "";
  });
});

// event tombol di tiap kolom
columnsContainer.addEventListener("click", (e) => {
  const col = e.target.closest(".column");
  if (!col) return;

  const fileNameInput = col.querySelector(".fileName");
  const numbersArea = col.querySelector(".numbers");

  // hapus nama file (per kolom)
  if (e.target.classList.contains("delete-btn")) {
    fileNameInput.value = "";
    numbersArea.value = ""; // opsional sekalian hapus nomor juga
  }

  // download VCF
  if (e.target.classList.contains("download-btn")) {
    const fileName = fileNameInput.value.trim() || "output";
    const numbers = numbersArea.value.split("\n").map(n => n.trim()).filter(n => n.length > 0);

    if (numbers.length === 0) {
      alert("Nomor kosong!");
      return;
    }

    const role = roleSelect.value;
    const order = orderSelect.value;
    const start = parseInt(startCount.value) || 1;

    let formattedContacts = [];
    let index = 0;

    if (role === "admin") {
      if (order === "top") {
        numbers.forEach((num, i) => {
          const name = `${globalName.value || "Admin"} ${start + i}`;
          formattedContacts.push(makeVCF(name, num));
        });
      } else {
        numbers.slice().reverse().forEach((num, i) => {
          const name = `${globalName.value || "Admin"} ${start + i}`;
          formattedContacts.push(makeVCF(name, num));
        });
      }
    } else {
      if (order === "top") {
        numbers.forEach((num, i) => {
          const name = `${globalName.value || "Navy"} ${start + i}`;
          formattedContacts.push(makeVCF(name, num));
        });
      } else {
        numbers.slice().reverse().forEach((num, i) => {
          const name = `${globalName.value || "Navy"} ${start + i}`;
          formattedContacts.push(makeVCF(name, num));
        });
      }
    }

    const blob = new Blob([formattedContacts.join("\n")], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ADMIN NAVY ${fileName}.vcf`;
    a.click();
  }
});

function makeVCF(name, number) {
  return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${formatNumber(number)}
END:VCARD`;
}

function formatNumber(num) {
  num = num.replace(/\D/g, "");
  if (!num.startsWith("+") && !num.startsWith("0")) {
    return "+" + num;
  }
  return num;
}

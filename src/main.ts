import type { Bejegyzes, NewBejegyzes } from "./Bejegyzes";
import "bootstrap/dist/css/bootstrap.min.css";

export const URL = "https://retoolapi.dev/WJgP6b/data";

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("content")) {
    await Load();
  }

  const szerkesztesBtn = document.getElementById("szerkesztesSubmit") as HTMLButtonElement | null;

  document.getElementById("hangulatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    Hozzaadas();
  });

  if (szerkesztesBtn) {
    szerkesztesBtn.disabled = true;
  }
});


async function Load() {
  const response = await fetch(URL);
  const data: Bejegyzes[] = await response.json();
  
  if (!response.ok) {
    console.error("Nem sikerült lekérdezni");
    return;
  }

  const table = document.getElementById("content") as HTMLTableElement;
  table.innerText = "";
  
  for (const bejegyzes of data) {
    const row = document.createElement("tr");

    const date = document.createElement("td");
    date.textContent = bejegyzes.date.toString();
    
    const hangulat = document.createElement("td");
    hangulat.textContent = bejegyzes.emoji;
    
    const desc = document.createElement("td");
    desc.textContent = bejegyzes.description.toString();
    
    const muveletek = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Szerkesztés";
    editBtn.classList.add("btn");
    editBtn.classList.add("btn-primary");
    editBtn.addEventListener("click", () => Edit(bejegyzes.id))
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Törlés";
    deleteBtn.classList.add("btn");
    deleteBtn.classList.add("btn-danger");
    deleteBtn.addEventListener("click", () => Delete(bejegyzes.id));
    muveletek.appendChild(editBtn);
    muveletek.appendChild(deleteBtn);

    row.appendChild(date);
    row.appendChild(hangulat);
    row.appendChild(desc);
    row.appendChild(muveletek);
    table.appendChild(row);
  }

  const hozzaadRow = document.createElement("tr");
  const hozzaadCell = document.createElement("td");
  const hozzaadBtn = document.createElement("button");
  hozzaadBtn.textContent = "Új bejegyzés hozzáadása";
  hozzaadBtn.addEventListener("click", () => { window.location.href = "add.html" });
  hozzaadBtn.classList.add("btn");
  hozzaadBtn.classList.add("btn-primary");
  hozzaadCell.appendChild(hozzaadBtn);
  hozzaadRow.appendChild(hozzaadCell);
  table.appendChild(hozzaadRow);
}

async function Hozzaadas() {
  const form = document.getElementById("hangulatForm") as HTMLFormElement;
  const data = new FormData(form);

  const bejegyzes: NewBejegyzes = {
    date: new Date().toDateString(),
    emoji: data.get("hangulat") as string,
    description: data.get("description") as string
  };

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bejegyzes)
  });

  if (!response.ok) {
    console.error("Nem sikerült hozzáadni");
    return;
  }

  form.reset();
  alert("Sikeres mentés");
}

async function Delete(id: number) {
  const c = confirm("Biztosan törölni szeretné?");
  if (c) {
    const response = await fetch(`${URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      console.error("Nem sikerült törölni");
      return;
    }

    Load();
    alert("Sikeres törlés");
  }
  else {
    alert("Nem lett törölve");
  }
}

async function Edit(id: number) {
  window.location.href = "index.html#szerkeszto";

  const getResponse = await fetch(`${URL}/${id}`);
  if (!getResponse.ok) {
    console.error("Nem sikerült lekérdezni a bejegyzést");
    return;
  }
  const bejegyzes: Bejegyzes = await getResponse.json();

  const szerkesztForm = document.getElementById("szerkeszto") as HTMLFormElement;
  const szerkesztData = new FormData(szerkesztForm);

  szerkesztData.append("hangulatSzerkeszto", bejegyzes.emoji);
  szerkesztData.append("descriptionSzerkeszto", bejegyzes.description);
  (document.getElementById("hangulatSelectSzerkeszto") as HTMLInputElement).value = bejegyzes.emoji;
  (document.getElementById("descriptionSzerkeszto") as HTMLInputElement).value = bejegyzes.description;


  const bejegyzesDate = bejegyzes.date;

  document.getElementById("szerkeszto")?.addEventListener("submit", (event) => {
    event.preventDefault();
    EditRequest(id, bejegyzesDate);
  });

  (document.getElementById("szerkesztesSubmit") as HTMLButtonElement).disabled = false;
}

async function EditRequest(id: number, date: string) {
  const szerkesztForm = document.getElementById("szerkeszto") as HTMLFormElement;
  const szerkesztData = new FormData(szerkesztForm);

  const szerkesztettBejegyzes: Bejegyzes = {
    id: id,
    date: date,
    emoji: szerkesztData.get("hangulatSzerkeszto") as string,
    description: szerkesztData.get("descriptionSzerkeszto") as string
  }

  const response = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(szerkesztettBejegyzes)
  });

  if (!response.ok) {
    console.error("Nem sikerült szerkeszteni");
    return;
  }

  (document.getElementById("szerkesztesSubmit") as HTMLButtonElement).disabled = true;
  szerkesztForm.reset();
  Load();
  alert("Sikeresen szerkesztve");
}


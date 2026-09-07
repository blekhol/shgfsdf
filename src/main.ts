import type { Bejegyzes, NewBejegyzes } from "./Bejegyzes";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = "https://retoolapi.dev/WJgP6b/data";

document.addEventListener("DOMContentLoaded", async () => {
  Load();
  document.getElementById("hangulatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    Hozzaadas();
  });
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
  Load();
}

async function Delete(id: number) {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    console.error("Nem sikerült törölni");
    return;
  }

  Load();
}

async function Edit(id: number) {
  
}
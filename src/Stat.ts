import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "chart.js/auto";
import { URL } from "./main";
import type { Bejegyzes } from "./Bejegyzes";

const hangulatValues: string[] = [];
const db: number[] = [];

const ctx = document.getElementById("hangulatChart") as HTMLCanvasElement;

const chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: hangulatValues,
        datasets: [
            {
                data: db,
            }
        ]
    },
    options: {
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Hangulat eloszlása",
                font: { size: 16 },
            }
        }
    }
});

async function Load() {
    const response = await fetch(URL);
    if (!response.ok) {
        console.error("Nem sikerült lekérdezni");
        return;
    }
    const data: Bejegyzes[] = await response.json();

    for (const bejegyzes of data) {
        if (!hangulatValues.includes(bejegyzes.emoji)) {
            hangulatValues.push(bejegyzes.emoji);
            db.push(1);
        } else {
            const index = hangulatValues.indexOf(bejegyzes.emoji);
            db[index]++;
        }
    }

    chart.update();
}

document.addEventListener("DOMContentLoaded", Load);
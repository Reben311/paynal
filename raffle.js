// This script now only handles raffle-specific logic.
// The 3D background and other UI is handled by the main script.js file.

document.addEventListener('DOMContentLoaded', () => {
    setupCountdown();
    fetchPastWinners();
});

// --- Raffle Countdown ---
function setupCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    // Set the date for the next raffle (e.g., the 1st of next month)
    const now = new Date();
    const nextRaffleDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const interval = setInterval(() => {
        const today = new Date().getTime();
        const distance = nextRaffleDate - today;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "<p class='text-xl text-gold-400'>The winner has been announced!</p>";
        }
    }, 1000);
}

// --- Fetch Past Winners from Sanity.io ---
async function fetchPastWinners() {
    const winnersListElement = document.getElementById('past-winners-list');
    if (!winnersListElement) return;

    // Replace with your actual Sanity project ID and dataset
    const projectId = 'jbuh6e9h';
    const dataset = 'production';
    const query = encodeURIComponent('*[_type == "winner"] | order(drawingDate desc) {name, "drawingDate": drawingDate}');
    const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`;
    
    // Placeholder while loading
    winnersListElement.innerHTML = `<div class="text-center text-zinc-400">Loading winners...</div>`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const { result } = await response.json();

        if (result && result.length > 0) {
            winnersListElement.innerHTML = result.map(winner => `
                <div class="flex justify-between items-center text-white p-3 bg-white/5 rounded-lg">
                    <span>${winner.name}</span>
                    <span class="text-sm text-zinc-400">${new Date(winner.drawingDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Winner</span>
                </div>
            `).join('');
        } else {
            winnersListElement.innerHTML = `<div class="text-center text-zinc-400">No past winners to display yet.</div>`;
        }
    } catch (error) {
        console.error("Failed to fetch winners:", error);
        winnersListElement.innerHTML = `<div class="text-center text-red-400">Could not load winner information.</div>`;
        // As a fallback, you can show dummy data so the design doesn't look broken
        winnersListElement.innerHTML += ` 
            <div class="flex justify-between items-center text-white p-3 bg-white/5 rounded-lg mt-4">
                <span>John D. (Sample)</span>
                <span class="text-sm text-zinc-400">May 2024 Winner</span>
            </div>
            <div class="flex justify-between items-center text-white p-3 bg-white/5 rounded-lg mt-2">
                <span>Jane S. (Sample)</span>
                <span class="text-sm text-zinc-400">April 2024 Winner</span>
            </div>
        `;
    }
}

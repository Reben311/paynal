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
async function loadWinnerList() {
    const listContainer = document.getElementById('past-winners-list');
    if (!listContainer) return;

    // --- No changes needed to the Sanity fetch logic ---
    const projectId = 'jbuh6e9h';
    const dataset = 'production';
    // This is the corrected line
    const query = encodeURIComponent('*[_type == "raffleWinner"] | order(winDate desc)');
    const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

    try {
        const response = await fetch(url);
        const { result } = await response.json();

        listContainer.innerHTML = '';

        if (result && result.length > 0) {
            result.forEach((winner, index) => {
                const winnerItem = document.createElement('div');
                
                // 1. UPDATED STYLING FOR EACH WINNER ITEM
                // This creates a cleaner look with a border, designed to be inside the main glass card.
                // It adds a border to all items except the last one.
                let classes = 'pt-4';
                if (index > 0) {
                    classes += ' border-t border-zinc-700/50';
                }
                winnerItem.className = classes;

                // 2. UPDATED HTML STRUCTURE FOR EACH ITEM
                winnerItem.innerHTML = `
                    <p class="text-xl font-semibold text-white">${winner.name}</p>
                    <p class="text-sm text-violet-300">${winner.month}</p>
                `;

                listContainer.appendChild(winnerItem);
            });
        } else {
            listContainer.innerHTML = '<p class="text-zinc-400 text-center">Past winners will be shown here!</p>';
        }
    } catch (error) {
        console.error("Could not load winner list:", error);
        listContainer.innerHTML = '<p class="text-red-500 text-center">Error loading winner list.</p>';
    }
}
// Make sure you are calling the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // ... your other functions
    loadWinnerList();
});

// ==========================================
// 1. STATE VARIABLES (Game Memory)
// ==========================================
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

// Helper function to update messages easily
const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

// ==========================================
// 2. THE GAME LOOP (Check Button Click)
// ==========================================
document.querySelector(".btn-check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess-input").value);

  // When there is no input
  if (!guess) {
    displayMessage("⛔ No number entered!");

    // When player wins
  } else if (guess === secretNumber) {
    displayMessage("🎉 Correct Number!");
    document.querySelector(".number").textContent = secretNumber;

    // UI Style changes upon winning
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "20rem";

    // Update session highscore
    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }

    // --- FULL-STACK LEADERBOARD DATA TRANSFER ---
    setTimeout(() => {
      const playerName = prompt(
        "You won! Enter your name for the global leaderboard:",
      );

      if (playerName) {
        const gameData = {
          username: playerName,
          score: score,
        };

        // Send score payload to backend database handler
        fetch("save_score.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Awesome! Your score is saved.");
              displayLeaderboard(); // Refresh table columns immediately!
            } else {
              console.error("Server Error:", data.message);
            }
          })
          .catch((error) => console.error("Fetch Error:", error));
      }
    }, 1000);

    // When guess is incorrect
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "📈 Too high!" : "📉 Too low!");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      displayMessage("💥 You lost the game!");
      document.querySelector(".score").textContent = 0;
      document.querySelector("body").style.backgroundColor = "#b34747";
    }
  }
});

// ==========================================
// 3. RESET SYSTEM (Again Button Click)
// ==========================================
document.querySelector(".btn-reset").addEventListener("click", function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  displayMessage("Start guessing...");
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess-input").value = "";

  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "12rem";
});

// ==========================================
// 4. DYNAMIC LEADERBOARD API HOOKS
// ==========================================

// Function to pull top scores from PHP script and render them onto the page
function displayLeaderboard() {
  fetch("get_scores.php")
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        const tableBody = document.getElementById("leaderboard-body");
        tableBody.innerHTML = ""; // Clear out old matching records

        // Build HTML table rows dynamically based on the database rows returned
        result.data.forEach((row, index) => {
          const htmlRow = `
            <tr>
              <td>#${index + 1}</td>
              <td>${row.username}</td>
              <td>${row.score}</td>
            </tr>
          `;
          tableBody.insertAdjacentHTML("beforeend", htmlRow);
        });
      }
    })
    .catch((err) => console.error("Leaderboard fetch error:", err));
}

// Automatically request scores and display them as soon as the page loads
window.onload = displayLeaderboard;

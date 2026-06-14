// 1. STATE VARIABLES: Stores the real-time application memory
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

// Helper utility function to change tracking text values cleanly
const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

// 2. THE GAME LOOP CONTROL LOGIC ('Check!' Click Handler)
document.querySelector(".btn-check").addEventListener("click", function () {
  // Pull value from UI text field input and enforce numerical evaluation
  const guess = Number(document.querySelector(".guess-input").value);

  // Validation Check: Handle instances when input field empty
  if (!guess) {
    displayMessage("⛔ No number entered!");

    // Win State Handler
  } else if (guess === secretNumber) {
    displayMessage("🎉 Correct Number!");
    document.querySelector(".number").textContent = secretNumber;

    // Style Adjustments via DOM for Success UI states
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "20rem";

    // Record highest session score inside system storage state
    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    }

    // --- FULL-STACK DATA FETCH INITIATION ---
    // Trigger prompt window to trap user identity after short UI animation pause
    setTimeout(() => {
      const playerName = prompt(
        "You won! Enter your name for the global leaderboard:",
      );

      if (playerName) {
        const gameData = {
          username: playerName,
          score: score,
        };

        // Post structured raw object string payload down to the server endpoint
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
              alert(
                "Awesome! Your score is saved to the leaderboard database.",
              );
            } else {
              console.error("Server Error Response:", data.message);
            }
          })
          .catch((error) =>
            console.error("Fetch Network Failure Call:", error),
          );
      }
    }, 1000);

    // Lose state / Incorrect Guess Handler
  } else if (guess !== secretNumber) {
    if (score > 1) {
      // Dynamic Ternary Conditional operation to assign guidance hints
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

// 3. APPLICATION INITIALIZATION LAYER ('Again!' Click Handler)
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

import { CountUp } from "/src/js/countup.js";

const JsonUrl = "https://raw.githubusercontent.com/wernisch/mati-games-stats/main/public/games.json";

let PlayerCountDisplay, VisitsCountDisplay, GamesCreatedDisplay, AverageRatingDisplay;

function InitializeCountUp(GamesCreated) {
  PlayerCountDisplay = new CountUp("player-count", 0, { duration: 2, separator: "," });
  VisitsCountDisplay = new CountUp("visits-count", 0, { duration: 2, separator: "," });
  GamesCreatedDisplay = new CountUp("games-created", 0, { duration: 2, separator: ",", suffix: "+" });
  AverageRatingDisplay = new CountUp("average-rating", 0, { duration: 1, decimalPlaces: 0, suffix: "%" });

  PlayerCountDisplay.start();
  VisitsCountDisplay.start();
  GamesCreatedDisplay.start();
  AverageRatingDisplay.start();

  GamesCreatedDisplay.update(GamesCreated);
}

function UpdateCountDisplays(PlayerCount, VisitsCount, AvgRating) {
  PlayerCountDisplay?.update(PlayerCount);
  VisitsCountDisplay?.update(VisitsCount);
  AverageRatingDisplay?.update(AvgRating);

  const heroGamesEl = document.getElementById("hero-games");
  const heroPlayersEl = document.getElementById("hero-players");
  const heroRatingEl = document.getElementById("hero-rating");

  if (heroGamesEl)   heroGamesEl.textContent = `${GamesCreatedDisplay ? "" : ""}${GamesCreatedDisplay ? "" : ""}`; // no-op; set below
  if (heroPlayersEl) heroPlayersEl.textContent = PlayerCount.toLocaleString();
  if (heroRatingEl)  heroRatingEl.textContent = `${AvgRating}%`;
}

async function FetchJsonWithRetry(url, retries = 3, delayMs = 600) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
}

async function LoadGameStats() {
  try {
    const data = await FetchJsonWithRetry(JsonUrl);
    const games = Array.isArray(data?.games) ? data.games : [];

    const TotalPlayers = games.reduce((sum, g) => sum + (Number(g.playing) || 0), 0);
    const TotalVisits  = games.reduce((sum, g) => sum + (Number(g.visits)  || 0), 0);

    const ValidRatings = games
      .map(g => Number(g.likeRatio))
      .filter(v => Number.isFinite(v) && v >= 0);

    const AverageRating = ValidRatings.length
      ? Math.round(ValidRatings.reduce((s, v) => s + v, 0) / ValidRatings.length)
      : 0;

    InitializeCountUp(games.length);
    UpdateCountDisplays(TotalPlayers, TotalVisits, AverageRating);

    const heroGamesEl = document.getElementById("hero-games");
    if (heroGamesEl) heroGamesEl.textContent = `${games.length}+`;
  } catch (error) {
    console.error("Error loading game stats:", error);
  }
}

let HasLoadedStats = false;
const StatsSection = document.getElementById("stats");

function TriggerLoad() {
  if (HasLoadedStats) return;
  HasLoadedStats = true;
  LoadGameStats();
}

if (StatsSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, ob) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        TriggerLoad();
        ob.unobserve(StatsSection);
      }
    });
  }, { threshold: 0.4 });
  observer.observe(StatsSection);
} else {
  TriggerLoad();
}

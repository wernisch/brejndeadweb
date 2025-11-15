import { CountUp } from "/src/js/countup.js";

const JsonUrl = "https://raw.githubusercontent.com/wernisch/brejndead-stats/refs/heads/main/public/games.json";

let Totals = { GamesCount: 0, TotalPlayers: 0, TotalVisits: 0, AverageRating: 0 };
let TotalsPromise = null;

let PlayerCountDisplay, VisitsCountDisplay, GamesCreatedDisplay, AverageRatingDisplay;
let HeroGamesDisplay, HeroPlayersDisplay, HeroVisitsDisplay;
let GridInitialized = false;

function abbreviate(n) {
  const num = Number(n) || 0;
  if (num >= 1e9) return (num / 1e9).toFixed(num % 1e9 ? 1 : 0) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(num % 1e6 ? 1 : 0) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(num % 1e3 ? 1 : 0) + "K";
  return String(Math.floor(num));
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

async function LoadTotalsOnce() {
  if (TotalsPromise) return TotalsPromise;

  TotalsPromise = (async () => {
    const data = await FetchJsonWithRetry(JsonUrl);
    const games = Array.isArray(data?.games) ? data.games : [];

    const TotalPlayers = games.reduce(
      (sum, g) => sum + (Number(g.playing) || 0),
      0
    );
    const TotalVisits = games.reduce(
      (sum, g) => sum + (Number(g.visits) || 0),
      0
    );

    const ValidRatings = games
      .map(g => Number(g.likeRatio))
      .filter(v => Number.isFinite(v) && v >= 0);

    const AverageRating = ValidRatings.length
      ? Math.round(
          ValidRatings.reduce((s, v) => s + v, 0) / ValidRatings.length
        )
      : 0;

    Totals = {
      GamesCount: games.length,
      TotalPlayers,
      TotalVisits,
      AverageRating
    };
    return Totals;
  })();

  return TotalsPromise;
}

function RenderHero(t) {
  const heroGamesEl = document.getElementById("hero-games");
  const heroPlayersEl = document.getElementById("hero-players");
  const heroVisitsEl = document.getElementById("hero-visits");

  if (heroGamesEl && !HeroGamesDisplay) {
    HeroGamesDisplay = new CountUp(heroGamesEl, t.GamesCount, {
      duration: 1.6,
      separator: ",",
      suffix: "+"
    });
    HeroGamesDisplay.start();
  } else if (HeroGamesDisplay) {
    HeroGamesDisplay.update(t.GamesCount);
  }

  if (heroPlayersEl && !HeroPlayersDisplay) {
    HeroPlayersDisplay = new CountUp(heroPlayersEl, t.TotalPlayers, {
      duration: 1.6,
      separator: ","
    });
    HeroPlayersDisplay.start();
  } else if (HeroPlayersDisplay) {
    HeroPlayersDisplay.update(t.TotalPlayers);
  }

  if (heroVisitsEl && !HeroVisitsDisplay) {
    HeroVisitsDisplay = new CountUp(heroVisitsEl, t.TotalVisits, {
      duration: 1.6,
      separator: "",
      formattingFn: abbreviate
    });
    HeroVisitsDisplay.start();
  } else if (HeroVisitsDisplay) {
    HeroVisitsDisplay.update(t.TotalVisits);
  }
}

function InitializeCountUp(GamesCreated) {
  if (GridInitialized) return;
  GridInitialized = true;

  const visitsEl = document.getElementById("visits-count");
  const visitsAbbrev = visitsEl && (visitsEl.getAttribute("data-abbrev") === "true");

  PlayerCountDisplay = new CountUp("player-count", 0, {
    duration: 2,
    separator: ","
  });
  VisitsCountDisplay = new CountUp("visits-count", 0, {
    duration: 2,
    separator: ",",
    formattingFn: visitsAbbrev ? abbreviate : undefined
  });
  GamesCreatedDisplay = new CountUp("games-created", 0, {
    duration: 2,
    separator: ",",
    suffix: "+"
  });
  AverageRatingDisplay = new CountUp("average-rating", 0, {
    duration: 1,
    decimalPlaces: 0,
    suffix: "%"
  });

  PlayerCountDisplay.start();
  VisitsCountDisplay.start();
  GamesCreatedDisplay.start();
  AverageRatingDisplay.start();

  GamesCreatedDisplay.update(GamesCreated);
}

function RenderGrid(t) {
  InitializeCountUp(t.GamesCount);
  PlayerCountDisplay?.update(t.TotalPlayers);
  VisitsCountDisplay?.update(t.TotalVisits);
  AverageRatingDisplay?.update(t.AverageRating);
}

LoadTotalsOnce()
  .then(RenderHero)
  .catch(err => console.error("Error loading hero stats:", err));

let HasLoadedGrid = false;
const StatsSection = document.getElementById("stats");

function TriggerGridLoad() {
  if (HasLoadedGrid) return;
  HasLoadedGrid = true;
  LoadTotalsOnce()
    .then(RenderGrid)
    .catch(err => console.error("Error loading grid stats:", err));
}

if (StatsSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, ob) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        TriggerGridLoad();
        ob.unobserve(StatsSection);
      }
    });
  }, { threshold: 0.4 });
  observer.observe(StatsSection);
} else {
  TriggerGridLoad();
}

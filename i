<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brejndead Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <style>
        html {
            scroll-behavior: smooth;
        }

        .glass-bg {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        ::selection {
            background: white;
            color: black;
        }

        .bg-white ::selection {
            background: black;
            color: white;
        }

        .glass-bg ::selection {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }

        header ::selection {
            background: white;
            color: black;
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
        }
    </style>
</head>

<body class="bg-black text-white font-sans">
    <header class="fixed w-full top-0 z-50 bg-black/70 backdrop-blur-lg shadow-lg">
        <div class="max-w-7xl mx-auto flex justify-between items-center p-6">
            <h1 class="text-2xl font-bold tracking-wider hover:text-gray-300 transition">Brejndead</h1>
            <nav class="space-x-6 hidden md:flex items-center">
                <a href="#about" class="relative group">
                    <span class="group-hover:underline">About</span>
                    <span class="block w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a href="#projects" class="relative group">
                    <span class="group-hover:underline">Projects</span>
                    <span class="block w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a href="https://discord.com/users/your-discord-id" target="_blank"
                    class="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300 transition">Contact</a>
            </nav>
        </div>
    </header>

    <section class="h-screen flex items-center justify-center text-center relative overflow-hidden" id="home">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 blur-3xl"></div>

        <div class="glass-bg p-12 md:p-24 relative z-10 opacity-0 animate-fade-in">
            <h2 class="text-5xl md:text-7xl font-bold mb-6">Hello, I'm <span class="text-white">Brejndead</span></h2>
            <p class="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">Roblox Scripter & Web Developer for Roblox
                Studios</p>
        </div>

        <a href="#about"
            class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white opacity-70 hover:opacity-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </a>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-24" id="about" data-aos="fade-up">
        <h3 class="text-4xl font-bold mb-8">About Me</h3>
        <p class="text-gray-400 leading-relaxed text-lg">
            I'm a passionate Roblox scripter and web developer who loves crafting sleek websites, creating intuitive
            user experiences, and building beautiful digital products for Roblox game studios. Let's create something
            amazing together.
        </p>
    </section>

    <section class="bg-white text-black py-24" id="projects" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-6">
            <h3 class="text-4xl font-bold mb-12">Projects</h3>

            <h4 class="text-2xl font-semibold mb-6">Games</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div class="flex flex-col items-center">
                    <img src="/src/img/parkourRushBanner.png" alt="Game 1" class="rounded-xl mb-4 shadow-lg">
                    <p class="font-medium">Parkour Rush</p>
                </div>
                <div class="flex flex-col items-center">
                    <img src="/src/img/FindtheDucks2.png" alt="Game 2" class="rounded-xl mb-4 shadow-lg">
                    <p class="font-medium">Find the Ducks</p>
                </div>
                <div class="flex flex-col items-center">
                    <img src="/src/img/SquidGames.png" alt="Game 3" class="rounded-xl mb-4 shadow-lg">
                    <p class="font-medium">Squid Game</p>
                </div>
            </div>
            <div class="text-center mb-8">
                <p class="text-gray-600">and many more...</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                <div class="bg-black text-white p-2 rounded-xl text-center shadow-md text-xs">
                    <p class="font-bold">Active Players</p>
                    <p id="player-count" class="text-lg mt-1">0</p>
                </div>
                <div class="bg-black text-white p-2 rounded-xl text-center shadow-md text-xs">
                    <p class="font-bold">Total Visits</p>
                    <p id="visits-count" class="text-lg mt-1">0</p>
                </div>
                <div class="bg-black text-white p-2 rounded-xl text-center shadow-md text-xs">
                    <p class="font-bold">Group Members</p>
                    <p id="group-members" class="text-lg mt-1">0</p>
                </div>
                <div class="bg-black text-white p-2 rounded-xl text-center shadow-md text-xs">
                    <p class="font-bold">Total Games</p>
                    <p id="games-created" class="text-lg mt-1">0</p>
                </div>
            </div>

            <h4 class="text-2xl font-semibold mb-6">Websites</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="border border-black rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition">
                    <img src="/src/img/MouseclickStudio.png" alt="Mouseclick Studio" class="rounded-lg mb-4">
                    <p class="font-medium mb-2">mouseclick.games</p>
                    <a href="https://mouseclick.games" target="_blank"
                        class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">Visit</a>
                </div>
                <div class="border border-black rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition">
                    <img src="/src/img/MatiGamesStudio.png" alt="MatiGames Studio" class="rounded-lg mb-4">
                    <p class="font-medium mb-2">matigames.com</p>
                    <a href="https://matigames.com" target="_blank"
                        class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">Visit</a>
                </div>
                <div class="border border-black rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition">
                    <img src="/src/img/FlorizWIP.png" alt="FlorizGames Studio" class="rounded-lg mb-4">
                    <p class="font-medium mb-2">florizgames.com</p>
                    <a href="https://florizgames.com" target="_blank"
                        class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">Visit</a>
                </div>
            </div>
        </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 py-24" id="pricing" data-aos="fade-up">
        <h3 class="text-4xl font-bold mb-12">Pricing</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
                class="bg-black text-white p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition">
                <h4 class="text-2xl font-bold mb-4">Scripting</h4>
                <p class="text-gray-400 mb-6">Roblox Lua scripting, systems, game mechanics, tools, and more.</p>
                <p class="text-3xl font-bold mb-2">$25–$45/hour</p>
                <p class="text-gray-400 text-sm">≈ 7,150–12,850 Robux/hour</p>
            </div>
            <div
                class="bg-white text-black p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition">
                <h4 class="text-2xl font-bold mb-4">Web Development</h4>
                <p class="text-gray-600 mb-6">Custom websites, Roblox API integrations, and more.</p>
                <p class="text-3xl font-bold mb-2">$35–$55/hour</p>
                <p class="text-gray-400 text-sm">≈ 10,000–15,750 Robux/hour</p>
            </div>
        </div>
    </section>


    <section class="bg-white text-black py-24" id="contact" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-6">
            <h3 class="text-4xl font-bold mb-8">Contact</h3>
            <p class="text-gray-600 mb-8">Feel free to reach out for collaborations or just a friendly hello 👋</p>
            <a href="https://discord.com/users/222446629117100033" target="_blank"
                class="inline-block border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">
                Message Me
            </a>
        </div>
    </section>

    <footer class="text-center text-gray-500 text-sm p-8">
        ❤️ if you read this ur rlly cool ❤️
    </footer>

    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>

    <script type="module">
        import { gameIds } from "https://matigames.com/ids.js";

        window.gameIds = gameIds;
        window.groupIds = [34806351, 33520712, 10431859, 10235287, 8283107, 35286510, 35667253, 35742480, 34070796, 35707907, 10170332, 35749225];
    </script>

    <script type="module" src="/src/js/stats.js"></script>
    <script>
        AOS.init({
            duration: 1000,
            once: true,
        });
    </script>
</body>

</html>
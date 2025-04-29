import { CountUp } from "/src/js/countup.js";

let proxyUrl = "https://billowing-frog-ed5c.bloxyhdd.workers.dev/?url=";
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let gameIds = window.gameIds || [];
let groupIds = window.groupIds || [];

async function getGameData(universeId) {
    try {
        let apiUrl = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
        let response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (response.ok) {
            let json = await response.json();
            if (json.data && json.data.length > 0) {
                let game = json.data[0];
                return {
                    id: game.id,
                    playing: game.playing || 0,
                    visits: game.visits || 0
                };
            }
        } else if (response.status === 429) {
            await wait(500);
            return getGameData(universeId);
        }
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
    return { id: universeId, playing: 0, visits: 0 };
}

async function getGroupMembers(groupId) {
    try {
        let apiUrl = `https://groups.roblox.com/v1/groups/${groupId}`;
        let response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (response.ok) {
            let json = await response.json();
            return json.memberCount || 0;
        } else if (response.status === 429) {
            await wait(500);
            return getGroupMembers(groupId);
        }
    } catch (error) {
        console.error("Error fetching group data:", error);
    }
    return 0;
}

let playerCountDisplay = new CountUp("player-count", 0, { duration: 2, separator: "," });
let visitsCountDisplay = new CountUp("visits-count", 0, { duration: 2, separator: "," });
let gamesCreatedDisplay = new CountUp("games-created", gameIds.length, { duration: 2, separator: ",", suffix: "+" });
let groupMembersDisplay = new CountUp("group-members", 0, { duration: 2, separator: ",",  suffix: "+"});

async function getTotalData() {
    let totalPlayers = 0;
    let totalVisits = 0;
    let allGroupMembers = 0;

    let allGameData = await Promise.all(gameIds.map(id => getGameData(id)));
    for (let game of allGameData) {
        totalPlayers += game.playing;
        totalVisits += game.visits;
    }

    let allGroupData = await Promise.all(groupIds.map(id => getGroupMembers(id)));
    for (let members of allGroupData) {
        allGroupMembers += members;
    }

    playerCountDisplay.update(totalPlayers);
    visitsCountDisplay.update(totalVisits);
    groupMembersDisplay.update(allGroupMembers);
    gamesCreatedDisplay.update(gameIds.length);
}

getTotalData();
    

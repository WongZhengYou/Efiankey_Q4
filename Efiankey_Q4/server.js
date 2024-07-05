'use strict';
const http = require('http');

const itemTierRarity = [1, 2, 3, 4, 5];
const vipRanks = ['v1', 'v2', 'v3', 'v4', 'v5'];

const vipProbabilities = {
    'v1': [0.6, 0.3, 0.1, 0.1, 0.1],
    'v2': [0.4, 0.3, 0.2, 0.1, 0.1],
    'v3': [0.3, 0.3, 0.2, 0.1, 0.1],
    'v4': [0.2, 0.3, 0.2, 0.2, 0.1],
    'v5': [0.1, 0.2, 0.3, 0.3, 0.1],
};

function rollItem(vipRank) {
    const probabilities = vipProbabilities[vipRank];
    const cumulativeProbabilities = [];
    probabilities.reduce((acc, prob, index) => {
        cumulativeProbabilities[index] = acc + prob;
        return cumulativeProbabilities[index];
    }, 0);

    const random = Math.random();
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
        if (random < cumulativeProbabilities[i]) {
            return itemTierRarity[i];
        }
    }
}

function simulateRolls() {
    const results = {};
    vipRanks.forEach(rank => {
        results[rank] = itemTierRarity.reduce((acc, tier) => {
            acc[tier] = 0;
            return acc;
        }, {});
    });

    vipRanks.forEach(rank => {
        for (let i = 0; i < 100; i++) {
            const item = rollItem(rank);
            results[rank][item]++;
        }
    });

    return results;
}

function printResults(results) {
    let output = '';
    for (const rank in results) {
        output += `${rank} player item distribution:\n`;
        for (const tier in results[rank]) {
            output += `  Tier ${tier}: ${results[rank][tier]} items\n`;
        }
        output += '\n';
    }
    return output;
}

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Run the simulation
    const results = simulateRolls();
    const output = printResults(results);

    res.end(output);
});

const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
    console.log(`Server running at http://localhost:${serverPort}/`);
});

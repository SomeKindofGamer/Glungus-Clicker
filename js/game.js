    const state = {
        glungus: new Decimal(0),
        totalGlungus: new Decimal(0), // for achievements & prestige
        glungDust: new Decimal(0), // prestige currency
        clickPower: new Decimal(1),
        glungusPerSecond: new Decimal(0),
        clicks: 0,
        prestigedOnce: false,
        theme: 'light',
        animationsEnabled: true,
        popupsEnabled: true,
        glungLapses: 0,
        cards: {
            golden_kibble: 0,
            hyper_boop: 0,
            dust_storm: 0,
            glung_bank: 0,
            turbo_shenanigans: 0,
            meme_overload: 0,
            cosmic_glungus: 0,
            prestige_synergy: 0,
            floppy_ear_mastery: 0,
            glungulator_prime: 0,
            glung_dust_dividend: 0,
            the_final_glung: 0
        }
    };

    const cardsData = [
        { id: 'golden_kibble', name: 'Golden Kibble', desc: 'Passive GPS is multiplied by a % of Click Power' },
        { id: 'hyper_boop', name: 'Hyper-Boop', desc: 'Permanent multiplier to Click Power' },
        { id: 'dust_storm', name: 'Dust Storm', desc: 'Glung-dust gain multiplier' },
        { id: 'glung_bank', name: 'Glung-Bank', desc: 'Start resets with bonus Glung-Dust' },
        { id: 'turbo_shenanigans', name: 'Turbo Shenanigans', desc: 'Reduce upgrade cost scaling' },
        { id: 'meme_overload', name: 'Meme Overload', desc: 'Big Powers effect is increased' },
        { id: 'cosmic_glungus', name: 'Cosmic Glungus', desc: 'Global multiplier to all generation' },
        { id: 'prestige_synergy', name: 'Prestige Synergy', desc: 'Glung-dust boosts Click Power' },
        { id: 'floppy_ear_mastery', name: 'Floppy Ear Mastery', desc: 'Bonus click triggers more often' },
        { id: 'glungulator_prime', name: 'Glungulator Prime', desc: 'Increases Glungulator base power' },
        { id: 'glung_dust_dividend', name: 'Glung-Dust Dividend', desc: 'Passively generate Dust per second' },
        { id: 'the_final_glung', name: 'The Final Glung', desc: 'Achievement & Prestige requirements are reduced' }
    ];

    // ui elements
    const glungusCounter = document.getElementById('glungus-counter');
    const glungusPerSecDisplay = document.getElementById('glungus-per-sec');
    const glungDustCounter = document.getElementById('glung-dust-counter');
    const glungusBtn = document.getElementById('glungus-btn');
    const mainArea = document.getElementById('main-area');
    const upgradesList = document.getElementById('upgrades-list');
    const prestigeUpgradesList = document.getElementById('prestige-upgrades-list');
    const prestigeTitle = document.getElementById('prestige-title');
    const achievementList = document.getElementById('achievement-list');
    const deglungulatorBtn = document.getElementById('de-glungulator-btn');
    const prestigeInfo = document.getElementById('prestige-info');

    // upgrades
    const upgrades = [
        {
            id: 'glungulator',
            name: 'the glungulator',
            desc: 'gives more glungus per click',
            icon: '🐾',
            baseCost: new Decimal(15),
            costMult: new Decimal(1.5),
            effectType: 'click',
            effectValue: new Decimal(1),
            owned: 0
        },
        {
            id: 'awesomekibble',
            name: 'awesome kibble generator',
            desc: 'gives you glungus per sec',
            icon: '🥣',
            baseCost: new Decimal(100),
            costMult: new Decimal(1.15),
            effectType: 'gps',
            effectValue: new Decimal(5),
            owned: 0
        },
        {
            id: 'powered',
            name: 'powered glung',
            desc: 'get chance for bonus glungus on click',
            icon: '🎧',
            baseCost: new Decimal(50),
            costMult: new Decimal(2),
            effectType: 'bonus_click',
            effectValue: new Decimal(5),
            owned: 0
        },
        {
            id: 'meme_power',
            name: 'big powers',
            desc: 'multiply all glung power by 2x',
            icon: '🌟',
            baseCost: new Decimal(500),
            costMult: new Decimal(5),
            effectType: 'global_mult',
            effectValue: new Decimal(2),
            owned: 0
        }
    ];

    // prestige upgrades
    const prestigeUpgrades = [
        {
            id: 'dusty_paws',
            name: 'dusty paws',
            desc: 'multiply base glung power by 3x',
            icon: '✨',
            baseCost: new Decimal(1),
            costMult: new Decimal(2.5),
            effectType: 'prestige_click_mult',
            effectValue: new Decimal(3),
            owned: 0
        },
        {
            id: 'photosynthesis',
            name: 'photosynthesis',
            desc: 'multiply passive GPS by 5x',
            icon: '🌱',
            baseCost: new Decimal(5),
            costMult: new Decimal(4),
            effectType: 'prestige_gps_mult',
            effectValue: new Decimal(5),
            owned: 0
        },
        {
            id: 'glungus_replication',
            name: 'glungus replication',
            desc: 'reduce upgrade cost scaling',
            icon: '🧬',
            baseCost: new Decimal(20),
            costMult: new Decimal(10),
            effectType: 'cost_reduction',
            effectValue: new Decimal(0.05), // subtract from costMult
            owned: 0
        }
    ];

    // achievements
    function getAchReq(val) {
        if (state.cards && state.cards.the_final_glung > 0) {
            return val * (1 - state.cards.the_final_glung * 0.1);
        }
        return val;
    }

    const achievements = [
        { id: 'boop', name: 'boop!', desc: 'click glungus.', req: () => state.totalGlungus.gte(getAchReq(1)), icon: '👆', unlocked: false },
        { id: 'manyglungus', name: 'wow so many glungus!', desc: 'get 1,000 glunguses', req: () => state.totalGlungus.gte(getAchReq(1000)), icon: '😺', unlocked: false },
        { id: 'alotofglungus', name: 'woah thats alot!', desc: 'get 1,000,000 glunguses', req: () => state.totalGlungus.gte(getAchReq(1000000)), icon: '🚀', unlocked: false },
        { id: 'prestige_time', name: 'im de-glungulating!!', desc: 'use the de-glungulator for the first time.', req: () => state.prestigedOnce, icon: '⚛️', unlocked: false },
        
        // clicking milestones
        { id: 'click_100', name: 'finger workout', desc: 'click glungus 100 times.', req: () => state.clicks >= getAchReq(100), icon: '💪', unlocked: false },
        { id: 'click_1000', name: 'carpal tunnel', desc: 'click glungus 1,000 times.', req: () => state.clicks >= getAchReq(1000), icon: '🤏', unlocked: false },
        
        // total glungus milestones
        { id: 'glung_1b', name: 'billionaire biter', desc: 'get 1 billion total glungus.', req: () => state.totalGlungus.gte(getAchReq(1e9)), icon: '💰', unlocked: false },
        { id: 'glung_1t', name: 'trillionaire tail', desc: 'get 1 trillion total glungus.', req: () => state.totalGlungus.gte(getAchReq(1e12)), icon: '💎', unlocked: false },
        { id: 'glung_1q', name: 'quadrillion quiff', desc: 'get 1 quadrillion total glungus.', req: () => state.totalGlungus.gte(getAchReq(1e15)), icon: '👑', unlocked: false },
        
        // dust milestones
        { id: 'dust_100', name: 'dust collector', desc: 'have 100 glung-dust.', req: () => state.glungDust.gte(getAchReq(100)), icon: '🧹', unlocked: false },
        { id: 'dust_10k', name: 'stardust crusader', desc: 'have 10,000 glung-dust.', req: () => state.glungDust.gte(getAchReq(10000)), icon: '✨', unlocked: false },
        
        // gps milestones
        { id: 'gps_100', name: 'passive purrer', desc: 'reach 100 GPS.', req: () => state.glungusPerSecond.gte(getAchReq(100)), icon: '💤', unlocked: false },
        { id: 'gps_1m', name: 'automated meow', desc: 'reach 1 million GPS.', req: () => state.glungusPerSecond.gte(getAchReq(1e6)), icon: '🤖', unlocked: false },
        
        // lapse milestones
        { id: 'lapse_1', name: 'first collapse', desc: 'perform your first total glung-lapse.', req: () => state.glungLapses >= 1, icon: '🌌', unlocked: false },
        { id: 'lapse_5', name: 'multi-universal', desc: 'perform 5 total glung-lapses.', req: () => state.glungLapses >= 5, icon: '🌟', unlocked: false },
        
        // card milestones
        { id: 'card_index_10', name: 'card collector', desc: 'have 10 total tiers across all glung-cards.', req: () => Object.values(state.cards).reduce((a, b) => a + b, 0) >= getAchReq(10), icon: '🎴', unlocked: false },
        
        // upgrade milestones
        { id: 'upgrades_all', name: 'shenanigan master', desc: 'buy every standard upgrade at least once.', req: () => upgrades.every(u => u.owned > 0), icon: '🃏', unlocked: false }
    ];

    // formatting helper
    function formatNumber(num) {
        if (num.lt(1000)) return num.toNumber().toFixed(0);
        if (num.lt(1000000)) return (num.toNumber() / 1000).toFixed(1) + 'k';
        if (num.lt(1e9)) return (num.toNumber() / 1000000).toFixed(2) + 'M';
        if (num.lt(1e12)) return (num.toNumber() / 1e9).toFixed(2) + 'B';
        
        // big numbers
        return num.toExponential(2).replace('e+', 'e');
    }

    // update ui
    function updateUI() {
        glungusCounter.innerText = `Glungus: ${formatNumber(state.glungus)}`;
        glungusPerSecDisplay.innerText = `${formatNumber(state.glungusPerSecond)} Glungus/sec`;
        
        if (state.prestigedOnce || state.glungDust.gt(0)) {
            glungDustCounter.style.display = 'block';
            glungDustCounter.innerText = `Glung-Dust: ${formatNumber(state.glungDust)}`;
            prestigeTitle.style.display = 'block';
            prestigeUpgradesList.style.display = 'flex';
        }
        
        // glung-lapse logic
        const lapseContainer = document.getElementById('glung-lapse-container');
        const lapseInfo = document.getElementById('glung-lapse-info');
        const lapseBtn = document.getElementById('glung-lapse-btn');
        const cardIndexBtn = document.getElementById('card-index-btn');
        
        const lapseCost = new Decimal(100).mul(Decimal.pow(10, state.glungLapses)).mul(1e9);
        
        if (state.totalGlungus.gte(1e10) || state.glungLapses > 0) {
            lapseContainer.style.display = 'block';
            lapseInfo.innerText = `Requires ${formatNumber(lapseCost)} Total Glungus`;
            
            if (state.totalGlungus.gte(lapseCost)) {
                lapseBtn.classList.remove('disabled');
            } else {
                lapseBtn.classList.add('disabled');
            }
        }
        
        if (state.glungLapses > 0) {
            cardIndexBtn.style.display = 'block';
        }

        if (state.glungus.gte(1000000)) {
            document.body.classList.add('space-ascension');
        } else {
            document.body.classList.remove('space-ascension');
        }
        
        // standard upgrades
        upgrades.forEach(upg => {
            const btn = document.getElementById(`upg-${upg.id}`);
            const cost = getUpgradeCost(upg);
            
            if (state.glungus.gte(cost)) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
            
            const costEl = btn.querySelector('.upgrade-cost');
            costEl.innerText = `Cost: ${formatNumber(cost)}`;
            
            const descEl = btn.querySelector('.upgrade-desc');
            if (upg.effectType === 'click') {
                descEl.innerText = `*Increases Glungus per click (Currently ${formatNumber(state.clickPower)} Glungus/click)`;
            }
        });

        // prestige upgrades
        prestigeUpgrades.forEach(upg => {
            const btn = document.getElementById(`prestige-${upg.id}`);
            if (!btn) return;
            
            const cost = upg.baseCost.mul(upg.costMult.pow(upg.owned));
            
            if (state.glungDust.gte(cost)) {
                btn.classList.remove('disabled');
            } else {
                btn.classList.add('disabled');
            }
            
            const costEl = btn.querySelector('.upgrade-cost');
            costEl.innerText = `Cost: ${formatNumber(cost)} Dust`;
        });

        // prestige button
        const potentialDust = calculatePrestigeDust();
        if (potentialDust.gte(1)) {
            prestigeInfo.innerText = `Reset for ${formatNumber(potentialDust)} Glung-Dust`;
            deglungulatorBtn.style.filter = 'grayscale(0%)';
            deglungulatorBtn.style.cursor = 'pointer';
        } else {
            let threshold = 100000;
            if (state.cards.the_final_glung > 0) threshold *= (1 - state.cards.the_final_glung * 0.1);
            prestigeInfo.innerText = `Requires ${formatNumber(new Decimal(threshold))} Total Glungus`;
            deglungulatorBtn.style.filter = 'grayscale(100%)';
            deglungulatorBtn.style.cursor = 'not-allowed';
        }
    }

    // calc costs and effects
    function getUpgradeCost(upg) {
        let costMult = upg.costMult;
        
        // Card: Turbo Shenanigans
        if (state.cards.turbo_shenanigans > 0) {
            costMult = costMult.sub(state.cards.turbo_shenanigans * 0.05);
        }

        // apply prestige cost reduction
        const costReduxUpg = prestigeUpgrades.find(p => p.id === 'glungus_replication');
        if (costReduxUpg.owned > 0) {
            const reduction = costReduxUpg.effectValue.mul(costReduxUpg.owned);
            costMult = costMult.sub(reduction);
            if (costMult.lt(1.01)) costMult = new Decimal(1.01); // Minimum scaling
        }
        
        return upg.baseCost.mul(costMult.pow(upg.owned));
    }

    function recalculateStats() {
        let baseClick = new Decimal(1);
        let globalMult = new Decimal(1);
        let gps = new Decimal(0);
        
        // Card: Glungulator Prime
        if (state.cards.glungulator_prime > 0) {
            baseClick = baseClick.add(state.cards.glungulator_prime * 20);
        }

        let prestigeClickMult = new Decimal(1);
        let prestigeGpsMult = new Decimal(1);

        // upgrades
        upgrades.forEach(upg => {
            if (upg.owned > 0) {
                if (upg.effectType === 'click') {
                    baseClick = baseClick.add(upg.effectValue.mul(upg.owned));
                } else if (upg.effectType === 'gps') {
                    gps = gps.add(upg.effectValue.mul(upg.owned));
                } else if (upg.effectType === 'global_mult') {
                    let mult = upg.effectValue;
                    // Card: Meme Overload
                    if (upg.id === 'meme_power' && state.cards.meme_overload > 0) {
                        mult = mult.add(state.cards.meme_overload); // x2 -> x3, x4...
                    }
                    globalMult = globalMult.mul(mult.pow(upg.owned));
                }
            }
        });

        // prestige upgrades
        prestigeUpgrades.forEach(upg => {
            if (upg.owned > 0) {
                if (upg.effectType === 'prestige_click_mult') {
                    prestigeClickMult = prestigeClickMult.mul(upg.effectValue.pow(upg.owned));
                } else if (upg.effectType === 'prestige_gps_mult') {
                    prestigeGpsMult = prestigeGpsMult.mul(upg.effectValue.pow(upg.owned));
                }
            }
        });

        // Card: Hyper-Boop
        if (state.cards.hyper_boop > 0) {
            globalMult = globalMult.mul(1 + state.cards.hyper_boop * 4); // x5, x9, x13...
        }
        
        // Card: Cosmic Glungus
        if (state.cards.cosmic_glungus > 0) {
            globalMult = globalMult.mul(Decimal.pow(10, state.cards.cosmic_glungus)); // x10, x100...
        }

        state.clickPower = baseClick.mul(globalMult).mul(prestigeClickMult);
        
        // Card: Prestige Synergy
        if (state.cards.prestige_synergy > 0) {
            const synergy = state.glungDust.mul(state.cards.prestige_synergy * 0.01).add(1);
            state.clickPower = state.clickPower.mul(synergy);
        }

        // Card: Golden Kibble
        if (state.cards.golden_kibble > 0) {
            const kibbleBonus = state.clickPower.mul(state.cards.golden_kibble * 0.1);
            gps = gps.add(kibbleBonus);
        }

        state.glungusPerSecond = gps.mul(globalMult).mul(prestigeGpsMult);
    }

    // buying stuff
    function buyUpgrade(id) {
        const upg = upgrades.find(u => u.id === id);
        const cost = getUpgradeCost(upg);

        if (state.glungus.gte(cost)) {
            state.glungus = state.glungus.sub(cost);
            upg.owned += 1;
            
            // visual effect
            const btn = document.getElementById(`upg-${id}`);
            if (btn) {
                btn.classList.remove('flash-white');
                void btn.offsetWidth;
                btn.classList.add('flash-white');
                const rect = btn.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    spawnFlyingGlungus(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }

            recalculateStats();
            updateUI();
        }
    }

    function buyPrestigeUpgrade(id) {
        const upg = prestigeUpgrades.find(u => u.id === id);
        const cost = upg.baseCost.mul(upg.costMult.pow(upg.owned));

        if (state.glungDust.gte(cost)) {
            state.glungDust = state.glungDust.sub(cost);
            upg.owned += 1;
            
            // visual effect
            const btn = document.getElementById(`prestige-${id}`);
            if (btn) {
                btn.classList.remove('flash-white');
                void btn.offsetWidth;
                btn.classList.add('flash-white');
                const rect = btn.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    spawnFlyingGlungus(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            }

            recalculateStats();
            updateUI();
        }
    }

    // prestige logic
    function calculatePrestigeDust() {
        // (total / threshold) ^ 0.5
        let threshold = 100000;
        if (state.cards.the_final_glung > 0) threshold *= (1 - state.cards.the_final_glung * 0.1); // -10% per tier

        if (state.totalGlungus.lt(threshold)) return new Decimal(0);
        let dust = state.totalGlungus.div(threshold).pow(0.5).floor();
        
        // Card: Dust Storm
        if (state.cards.dust_storm > 0) {
            dust = dust.mul(1 + state.cards.dust_storm); // x2, x3, x4, x5, x6
        }
        
        return dust;
    }

    deglungulatorBtn.addEventListener('click', () => {
        const potentialDust = calculatePrestigeDust();
        if (potentialDust.gte(1)) {
            if(confirm(`Are you sure you want to molecularly disassemble Glungus?\nYou will lose all Glungus and standard upgrades, but gain ${formatNumber(potentialDust)} Glung-Dust!`)) {
                state.glungDust = state.glungDust.add(potentialDust);
                state.prestigedOnce = true;
                
                // reset
                state.glungus = new Decimal(0);
                state.totalGlungus = new Decimal(0);
                state.clicks = 0;
                
                upgrades.forEach(u => u.owned = 0);
                
                // Card: Glung-Bank
                if (state.cards.glung_bank > 0) {
                    state.glungDust = state.glungDust.add(state.cards.glung_bank * 100);
                }

                recalculateStats();
                renderPrestigeUpgrades();
                checkAchievements();
                updateUI();
            }
        }
    });

    // check achievements
    function checkAchievements() {
        let changed = false;
        achievements.forEach(ach => {
            if (!ach.unlocked && ach.req()) {
                ach.unlocked = true;
                changed = true;
                showAchievementPopup(ach);
            }
        });
        if (changed) renderAchievements();
    }

    function showAchievementPopup(ach) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="popup-icon">${ach.icon}</div>
            <div class="popup-content">
                <h3>Achievement Unlocked!</h3>
                <p>${ach.name}</p>
            </div>
        `;
        document.body.appendChild(popup);
        
        // trigger anim
        setTimeout(() => popup.classList.add('show'), 100);
        
        // remove after 3s
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }

    // render ui
    function renderUpgrades() {
        upgradesList.innerHTML = '';
        upgrades.forEach(upg => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn disabled';
            btn.id = `upg-${upg.id}`;
            
            let descText = upg.desc;
            if (upg.effectType === 'click') descText = `*Increases Glungus per click (Currently ${formatNumber(state.clickPower)} Glungus/click)`;

            btn.innerHTML = `
                <div class="upgrade-icon">${upg.icon}</div>
                <div class="upgrade-info">
                    <h3>${upg.name}</h3>
                    <p class="upgrade-desc">${descText}</p>
                    <div class="upgrade-cost">Cost: ${formatNumber(getUpgradeCost(upg))}</div>
                </div>
            `;
            
            btn.addEventListener('click', () => buyUpgrade(upg.id));
            upgradesList.appendChild(btn);
        });
    }

    function renderPrestigeUpgrades() {
        prestigeUpgradesList.innerHTML = '';
        prestigeUpgrades.forEach(upg => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn prestige-btn disabled';
            btn.id = `prestige-${upg.id}`;

            const cost = upg.baseCost.mul(upg.costMult.pow(upg.owned));

            btn.innerHTML = `
                <div class="upgrade-icon">${upg.icon}</div>
                <div class="upgrade-info">
                    <h3>${upg.name} <small>(Lvl ${upg.owned})</small></h3>
                    <p class="upgrade-desc">${upg.desc}</p>
                    <div class="upgrade-cost">Cost: ${formatNumber(cost)} Dust</div>
                </div>
            `;
            
            btn.addEventListener('click', () => buyPrestigeUpgrade(upg.id));
            prestigeUpgradesList.appendChild(btn);
        });
    }

    function renderAchievements() {
        achievementList.innerHTML = '';
        achievements.forEach(ach => {
            const div = document.createElement('div');
            div.className = `achievement ${ach.unlocked ? 'unlocked' : ''}`;
            div.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-info">
                    <h4>${ach.name}</h4>
                    <p>${ach.unlocked ? '(Unlocked)' : '(Locked)'}</p>
                    <p>${ach.desc}</p>
                </div>
            `;
            achievementList.appendChild(div);
        });
    }

    // click effects
    function createClickEffect(e, amount, isBonus = false) {
        if (!state.popupsEnabled) return;
        
        const containerRect = mainArea.getBoundingClientRect();
        
        // floating text
        const text = document.createElement('div');
        text.className = 'floating-text';
        text.innerText = `+${formatNumber(amount)}`;
        if (isBonus) {
            text.innerText = `BONUS +${formatNumber(amount)}!`;
            text.style.color = '#ff69b4';
            text.style.fontSize = '2.5rem';
        }
        
        // slight offset
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        
        text.style.left = `${e.clientX - containerRect.left + offsetX}px`;
        text.style.top = `${e.clientY - containerRect.top + offsetY}px`;
        
        mainArea.appendChild(text);
        setTimeout(() => text.remove(), 1000);

        // sparkles
        for(let i=0; i<3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerText = '✨';
            
            const sOffsetX = (Math.random() - 0.5) * 100;
            const sOffsetY = (Math.random() - 0.5) * 100;
            
            sparkle.style.left = `${e.clientX - containerRect.left + sOffsetX}px`;
            sparkle.style.top = `${e.clientY - containerRect.top + sOffsetY}px`;
            
            mainArea.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }
        
        // mini glungus
        spawnFlyingGlungus(e.clientX, e.clientY + 50);
    }

    function spawnFlyingGlungus(x, y) {
        if (!state.popupsEnabled) return;
        
        const mini = document.createElement('img');
        mini.src = 'images/glungus.webp';
        mini.className = 'mini-glungus';
        
        const angle = (Math.random() * Math.PI) - (Math.PI / 2);
        const distance = 150 + Math.random() * 150;
        const tx = Math.sin(angle) * distance;
        const ty = -Math.cos(angle) * distance - (Math.random() * 100);
        const rot = (Math.random() - 0.5) * 360;
        
        mini.style.setProperty('--tx', `${tx}px`);
        mini.style.setProperty('--ty', `${ty}px`);
        mini.style.setProperty('--rot', `${rot}deg`);
        
        mini.style.left = `${x}px`;
        mini.style.top = `${y}px`;
        
        document.body.appendChild(mini);
        setTimeout(() => mini.remove(), 800);
    }

    let lastClickTime = 0;

    // main click
    glungusBtn.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime < 100) {
            return; // block auto-clickers
        }
        lastClickTime = now;

        state.clicks++;
        let currentClickPower = state.clickPower;
        let isBonus = false;

        // get powered bonus stuffs
        const powered = upgrades.find(u => u.id === 'powered');
        let triggerRate = 10;
        if (state.cards.floppy_ear_mastery > 0) {
            triggerRate -= state.cards.floppy_ear_mastery; // 9, 8, 7, 6, 5
        }

        if (powered.owned > 0 && state.clicks % triggerRate === 0) {
            const multiplier = powered.effectValue.mul(powered.owned);
            currentClickPower = currentClickPower.mul(multiplier);
            isBonus = true;
        }

        state.glungus = state.glungus.add(currentClickPower);
        state.totalGlungus = state.totalGlungus.add(currentClickPower);
        
        // visual effects
        createClickEffect(e, currentClickPower, isBonus);
        
        if (state.animationsEnabled) {
            glungusBtn.classList.remove('wobbling');
            void glungusBtn.offsetWidth; // trigger reflow
            glungusBtn.classList.add('wobbling');
        }
        
        checkAchievements();
        updateUI();
    });

    // remove wobbling class
    glungusBtn.addEventListener('animationend', (e) => {
        if (e.animationName === 'wobble') {
            glungusBtn.classList.remove('wobbling');
        }
    });

    // game loop
    let lastTime = Date.now();
    function gameLoop() {
        const now = Date.now();
        const dt = (now - lastTime) / 1000; // dt in seconds
        lastTime = now;

        if (state.glungusPerSecond.gt(0)) {
            const gen = state.glungusPerSecond.mul(dt);
            state.glungus = state.glungus.add(gen);
            state.totalGlungus = state.totalGlungus.add(gen);
            checkAchievements();
        }

        if (state.cards.glung_dust_dividend > 0) {
            const dustGen = new Decimal(state.cards.glung_dust_dividend).mul(0.5).mul(dt); // 0.05, 0.1...
            state.glungDust = state.glungDust.add(dustGen);
        }

        if (state.glungus.gte(1000000) && state.animationsEnabled && Math.random() < 0.02) {
            spawnSpaceGlungus();
        }

        updateUI();
        requestAnimationFrame(gameLoop);
    }

    function spawnSpaceGlungus() {
        const mini = document.createElement('img');
        mini.src = 'images/glungus.webp';
        mini.className = 'space-glungus';
        
        const size = 30 + Math.random() * 60;
        const left = Math.random() * 100;
        
        mini.style.width = `${size}px`;
        mini.style.height = 'auto';
        mini.style.left = `${left}vw`;
        mini.style.bottom = `-100px`;
        
        const duration = 10 + Math.random() * 15;
        mini.style.animation = `float-up-space ${duration}s linear forwards`;
        
        document.body.appendChild(mini);
        setTimeout(() => mini.remove(), duration * 1000);
    }

    // save and load
    function saveGame() {
        const saveData = {
            glungus: state.glungus.toString(),
            totalGlungus: state.totalGlungus.toString(),
            glungDust: state.glungDust.toString(),
            clicks: state.clicks,
            prestigedOnce: state.prestigedOnce,
            theme: state.theme,
            animationsEnabled: state.animationsEnabled,
            popupsEnabled: state.popupsEnabled,
            upgrades: upgrades.map(u => u.owned),
            prestigeUpgrades: prestigeUpgrades.map(u => u.owned),
            achievements: achievements.map(a => a.unlocked),
            glungLapses: state.glungLapses,
            cards: state.cards
        };
        localStorage.setItem('glungusSave', JSON.stringify(saveData));
    }

    function loadGame() {
        const saved = localStorage.getItem('glungusSave');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                state.glungus = new Decimal(data.glungus || 0);
                state.totalGlungus = new Decimal(data.totalGlungus || 0);
                state.glungDust = new Decimal(data.glungDust || 0);
                state.clicks = data.clicks || 0;
                state.prestigedOnce = !!data.prestigedOnce;
                state.theme = data.theme || 'light';
                state.animationsEnabled = data.animationsEnabled !== undefined ? data.animationsEnabled : true;
                state.popupsEnabled = data.popupsEnabled !== undefined ? data.popupsEnabled : true;
                state.glungLapses = data.glungLapses || 0;
                state.cards = data.cards || state.cards;
                
                if (state.theme === 'dark') {
                    document.body.classList.add('dark-theme');
                    const themeBtn = document.getElementById('theme-toggle-btn');
                    if(themeBtn) themeBtn.innerText = 'night';
                }
                
                const animBtn = document.getElementById('anim-toggle-btn');
                if (animBtn) animBtn.innerText = state.animationsEnabled ? 'enabled' : 'disabled';
                
                const popupBtn = document.getElementById('popup-toggle-btn');
                if (popupBtn) popupBtn.innerText = state.popupsEnabled ? 'enabled' : 'disabled';
                
                if (data.upgrades) {
                    upgrades.forEach((u, i) => u.owned = data.upgrades[i] || 0);
                }
                if (data.prestigeUpgrades) {
                    prestigeUpgrades.forEach((u, i) => u.owned = data.prestigeUpgrades[i] || 0);
                }
                if (data.achievements) {
                    achievements.forEach((a, i) => a.unlocked = !!data.achievements[i]);
                }
            } catch (e) {
                console.error("Save file corrupted");
            }
        }
    }

    // init
    function init() {
        loadGame();
        renderUpgrades();
        renderPrestigeUpgrades();
        renderAchievements();
        recalculateStats();
        updateUI();
        gameLoop();
        
        // auto-save
        setInterval(saveGame, 5000);
    }

    // tab switching
    function switchTab(tabId) {
        const mainArea = document.getElementById('main-area');
        const upgradesPanel = document.getElementById('upgrades-panel');
        const shenanigansPanel = document.getElementById('shenanigans-panel');
        
        const tabBoop = document.getElementById('tab-boop');
        const tabUpgrades = document.getElementById('tab-upgrades');
        const tabShenanigans = document.getElementById('tab-shenanigans');

        // Hide all on mobile
        mainArea.classList.add('mobile-hidden');
        upgradesPanel.classList.add('mobile-hidden');
        shenanigansPanel.classList.add('mobile-hidden');
        
        if (tabBoop) tabBoop.classList.remove('active');
        if (tabUpgrades) tabUpgrades.classList.remove('active');
        if (tabShenanigans) tabShenanigans.classList.remove('active');

        if (tabId === 'boop') {
            mainArea.classList.remove('mobile-hidden');
            if (tabBoop) tabBoop.classList.add('active');
        } else if (tabId === 'upgrades') {
            upgradesPanel.classList.remove('mobile-hidden');
            if (tabUpgrades) tabUpgrades.classList.add('active');
        } else if (tabId === 'shenanigans') {
            shenanigansPanel.classList.remove('mobile-hidden');
            if (tabShenanigans) tabShenanigans.classList.add('active');
        }
    }
    window.switchTab = switchTab;

    // settings
    function toggleSettings() {
        const modal = document.getElementById('settings-modal');
        modal.classList.toggle('show');
    }
    window.toggleSettings = toggleSettings;

    function toggleTheme() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (state.theme === 'light') {
            state.theme = 'dark';
            document.body.classList.add('dark-theme');
            themeBtn.innerText = 'night';
        } else {
            state.theme = 'light';
            document.body.classList.remove('dark-theme');
            themeBtn.innerText = 'daytime';
        }
        saveGame();
    }
    window.toggleTheme = toggleTheme;

    function toggleAnimations() {
        state.animationsEnabled = !state.animationsEnabled;
        const btn = document.getElementById('anim-toggle-btn');
        btn.innerText = state.animationsEnabled ? 'enabled' : 'disabled';
        saveGame();
    }
    window.toggleAnimations = toggleAnimations;

    function togglePopups() {
        state.popupsEnabled = !state.popupsEnabled;
        const btn = document.getElementById('popup-toggle-btn');
        btn.innerText = state.popupsEnabled ? 'enabled' : 'disabled';
        saveGame();
    }
    window.togglePopups = togglePopups;

    function hardReset() {
        if(confirm("are you sure you want to wipe your save? you will lose anything and this can't be undone.")) {
            localStorage.removeItem('glungusSave');
            location.reload();
        }
    }
    window.hardReset = hardReset;

    // glung-lapse logic
    const glungLapseBtn = document.getElementById('glung-lapse-btn');
    glungLapseBtn.addEventListener('click', () => {
        const lapseCost = new Decimal(100).mul(Decimal.pow(10, state.glungLapses)).mul(1e9);
        if (state.totalGlungus.gte(lapseCost)) {
            performGlungLapse();
        }
    });

    function performGlungLapse() {
        document.body.classList.add('glung-lapse-active');
        glungusBtn.classList.add('exploding');
        
        setTimeout(() => {
            document.getElementById('flash-overlay').classList.add('active');
            setTimeout(() => {
                // reset game
                state.glungus = new Decimal(0);
                state.totalGlungus = new Decimal(0);
                state.glungDust = new Decimal(0);
                state.clicks = 0;
                state.prestigedOnce = false;
                upgrades.forEach(u => u.owned = 0);
                prestigeUpgrades.forEach(u => u.owned = 0);
                achievements.forEach(a => a.unlocked = false);
                
                state.glungLapses++;
                
                recalculateStats();
                renderUpgrades();
                renderPrestigeUpgrades();
                renderAchievements();
                
                document.body.classList.remove('glung-lapse-active');
                glungusBtn.classList.remove('exploding');
                document.getElementById('flash-overlay').classList.remove('active');
                
                showCardSelection();
            }, 500);
        }, 1500);
    }

    function showCardSelection() {
        const modal = document.getElementById('card-selection-modal');
        const container = document.getElementById('card-options');
        container.innerHTML = '';
        
        // pick 3 random non-maxed cards
        const available = cardsData.filter(c => state.cards[c.id] < 5);
        if (available.length === 0) {
            alert("ALL CARDS MAXED! YOU ARE THE ULTIMATE GLUNGUS.");
            modal.classList.remove('show');
            return;
        }

        const shuffled = available.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        selected.forEach(card => {
            const div = document.createElement('div');
            div.className = 'card';
            div.onclick = () => selectCard(card.id);
            div.innerHTML = `
                <div class="card-tier">Tier ${state.cards[card.id] + 1}/5</div>
                <div class="card-name">${card.name}</div>
                <div class="card-desc">${card.desc}</div>
            `;
            container.appendChild(div);
        });
        
        modal.classList.add('show');
    }

    function selectCard(cardId) {
        state.cards[cardId]++;
        document.getElementById('card-selection-modal').classList.remove('show');
        saveGame();
        updateUI();
        recalculateStats();
    }
    window.selectCard = selectCard;

    function toggleCardIndex() {
        const modal = document.getElementById('card-index-modal');
        if (!modal.classList.contains('show')) {
            renderCardIndex();
        }
        modal.classList.toggle('show');
    }
    window.toggleCardIndex = toggleCardIndex;

    function renderCardIndex() {
        const container = document.getElementById('card-index-grid');
        container.innerHTML = '';
        
        cardsData.forEach(card => {
            const tier = state.cards[card.id];
            const div = document.createElement('div');
            div.className = `card ${tier > 0 ? 'owned' : ''}`;
            div.innerHTML = `
                <div class="card-tier">${tier}/5</div>
                <div class="card-name">${card.name}</div>
                <div class="card-desc">${card.desc}</div>
            `;
            container.appendChild(div);
        });
    }

    init();

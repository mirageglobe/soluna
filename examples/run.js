/**
 * Test Runner for YALC (Yet Another Lunar Calendar)
 *
 * Uncomment any example below to test different date conversions
 */

const { solarToLunar, lunarToSolar } = require('./yalc.js');

// ===== HELPER FUNCTIONS TO DISPLAY RESULTS =====

function pad(num) {
    return String(num).padStart(2, '0');
}

function displaySolarToLunar(result) {
    const timeStr = result.solar.time ? ` ${pad(result.solar.time.hour)}:${pad(result.solar.time.minute)}:${pad(result.solar.time.second)}` : '';

    console.log('\n--- Solar to Lunar Conversion ---');
    console.log(`Solar: ${result.solar.year}-${result.solar.month}-${result.solar.day}${timeStr}`);
    console.log(`Lunar: ${result.lunar.year}-${result.lunar.month}-${result.lunar.day} (${result.lunar.dayName})`);
    console.log(`Zodiac Animal: ${result.lunar.zodiac}`);

    if (result.baZi) {
        console.log('\n🏮 BaZi (Eight Characters):');
        console.log(`   Year:  ${result.baZi.year.stem}${result.baZi.year.branch}`);
        console.log(`   Month: ${result.baZi.month.stem}${result.baZi.month.branch}`);
        console.log(`   Day:   ${result.baZi.day.stem}${result.baZi.day.branch}`);
        if (result.baZi.hour) {
            console.log(`   Hour:  ${result.baZi.hour.stem}${result.baZi.hour.branch}`);
        }
    }

    if (result.festivals) {
        console.log('\n✨ Festivals:');
        if (result.festivals.solar) console.log(`   Solar: ${result.festivals.solar.name}`);
        if (result.festivals.lunar) console.log(`   Lunar: ${result.festivals.lunar.name}`);
        if (result.festivals.sanniangSha) console.log('   ⚠️  Sanniang Sha Day (Inauspicious for weddings)');
    }
}

function displayLunarToSolar(result) {
    const timeStr = result.solar.time ? ` ${pad(result.solar.time.hour)}:${pad(result.solar.time.minute)}:${pad(result.solar.time.second)}` : '';

    console.log('\n--- Lunar to Solar Conversion ---');
    console.log(`Lunar: ${result.lunar.year}-${result.lunar.month}-${result.lunar.day}`);
    console.log(`Solar: ${result.solar.year}-${result.solar.month}-${result.solar.day}${timeStr}`);
    console.log(`Week Day: ${result.solar.weekDay}`);
}

// ===== TEST EXAMPLES - UNCOMMENT TO RUN =====

// Example 1: 3-Day View (Yesterday, Today, Tomorrow)
console.log('\n=== 📅 3-DAY CALENDAR VIEW ===');
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const dayTitles = ['YESTERDAY', 'TODAY', 'TOMORROW'];
[yesterday, today, tomorrow].forEach((date, i) => {
    console.log(`\n>>> ${dayTitles[i]} <<<`);
    const result = solarToLunar(date);
    displaySolarToLunar(result);
});

// Example 2: Basic solar to lunar conversion
// const result1 = solarToLunar(new Date('2021-01-01'));
// displaySolarToLunar(result1);

// ... (remaining examples could be kept or cleaned, but I'll add the new BaZi/3-day view first)
console.log('\n✓ Run script completed');

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'assets', 'test-scenes');
const ink = '#34455d';
const blue = '#508cdb';
const trousers = '#555f9f';
const skin = '#f5bd95';

const stroke = (d, color = ink, width = 12) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const face = (x, y, mood = 'smile') => `<g stroke="${ink}" stroke-width="2.5" stroke-linecap="round">
  <circle cx="${x}" cy="${y}" r="25" fill="${skin}"/>
  <path d="M${x - 23} ${y - 7} Q${x - 22} ${y - 31} ${x + 4} ${y - 27} Q${x + 25} ${y - 25} ${x + 22} ${y - 6} Q${x + 9} ${y - 17} ${x - 1} ${y - 15} Q${x - 10} ${y - 9} ${x - 23} ${y - 7}" fill="#5a4051"/>
  ${mood === 'sleep' ? `<path d="M${x - 13} ${y + 3}q5 5 10 0 M${x + 5} ${y + 3}q5 5 10 0" fill="none"/>` : `<circle cx="${x - 9}" cy="${y + 2}" r="2.5" fill="${ink}" stroke="none"/><circle cx="${x + 10}" cy="${y + 2}" r="2.5" fill="${ink}" stroke="none"/>`}
  <path d="${mood === 'sleep' ? `M${x - 5} ${y + 13}q5 2 10 0` : `M${x - 7} ${y + 13}q7 8 14 0`}" fill="none"/>
</g>`;
const scene = (id, sky, art) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200" role="img">
  <defs><linearGradient id="bg-${id}" x2="0" y2="1"><stop stop-color="${sky}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="280" height="200" rx="20" fill="url(#bg-${id})"/>
  <ellipse cx="140" cy="177" rx="116" ry="10" fill="#b9d8d0" opacity=".55"/>
  ${art}
</svg>
`;

const scenes = {
  run: scene('run', '#e3f7ff', `
    ${stroke('M31 83h29 M23 105h33 M35 128h21', '#86bddc', 5)}
    ${stroke('M128 94l22 30', blue, 29)}
    ${stroke('M135 96l-35 14-17-14', skin, 13)}
    ${stroke('M143 101l28-21 17 7', skin, 13)}
    ${stroke('M151 126l-37 26-28-4', trousers, 17)}
    ${stroke('M151 126l26 29 30-2', trousers, 17)}
    ${stroke('M81 149h-16 M207 153h14', '#ffae6d', 8)}
    ${face(125, 63)}
    <path d="M210 66l7-12m-17 4 8-7" stroke="#ffc768" stroke-width="5" stroke-linecap="round"/>
  `),
  eat: scene('eat', '#fff2dc', `
    <rect x="40" y="139" width="200" height="13" rx="6" fill="#c38b6e"/><path d="M58 152v28m164-28v28" stroke="#8e6680" stroke-width="9" stroke-linecap="round"/>
    <path d="M119 97q20-14 41 0l7 43h-61z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${stroke('M115 109l-21 30', skin, 13)} ${stroke('M154 108l27-19-15-12', skin, 13)}
    <circle cx="156" cy="75" r="13" fill="#ec5d58" stroke="#b94145" stroke-width="3"/><circle cx="146" cy="68" r="6" fill="#fff2dc"/><path d="M156 62q4-9 11-8" fill="none" stroke="#579c57" stroke-width="5"/>
    ${face(136, 64)}
    <path d="M181 140h35" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  `),
  drink: scene('drink', '#e3f4ff', `
    <path d="M109 100q24-11 47 0l8 67h-63z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${stroke('M109 116l-18 25', skin, 13)} ${stroke('M153 111l25-17-18-16', skin, 13)}
    <path d="M153 58l30 6-7 30-28-6z" fill="#ffd36c" stroke="${ink}" stroke-width="3"/>
    <path d="M168 60l9-12" stroke="#e77e7f" stroke-width="4" stroke-linecap="round"/>
    ${face(130, 63)}
    <path d="M58 145q13 9 26 0" fill="none" stroke="#9fd7ed" stroke-width="5"/>
  `),
  read: scene('read', '#eee9ff', `
    <path d="M108 93q26-12 51 1l13 77h-78z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${face(132, 57)}
    <path d="M72 107q25-12 57 5v52q-28-18-57-7zM129 112q30-20 64-7v53q-35-7-64 6z" fill="#fff8df" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M86 120h25m-25 11h27m31-10h31m-31 11h28" stroke="#8e9cb3" stroke-width="3" stroke-linecap="round"/>
    ${stroke('M99 101l-25 31', skin, 12)} ${stroke('M166 100l26 29', skin, 12)}
  `),
  write: scene('write', '#fff1df', `
    <rect x="40" y="139" width="202" height="13" rx="6" fill="#bf9474"/><path d="M59 152v27m163-27v27" stroke="#8c687f" stroke-width="9" stroke-linecap="round"/>
    <path d="M95 96q22-10 45 2l12 42H88z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${face(113, 61)}
    <path d="M149 126l56 2-5 17h-55z" fill="#fff" stroke="#829bbb" stroke-width="2"/>
    ${stroke('M136 104l35 23', skin, 13)}
    <path d="M166 118l15 17" stroke="#f2a75e" stroke-width="5" stroke-linecap="round"/>
    <path d="M69 123h29" stroke="#b6c4d9" stroke-width="4"/>
  `),
  sleep: scene('sleep', '#e8e8ff', `
    <circle cx="222" cy="46" r="19" fill="#ffe394"/><circle cx="229" cy="39" r="19" fill="#e8e8ff"/>
    <path d="M42 89v91m0-13h196v13" stroke="#8f6b86" stroke-width="11" stroke-linecap="round"/>
    <rect x="51" y="103" width="185" height="63" rx="14" fill="#b8d8ef" stroke="${ink}" stroke-width="3"/>
    <rect x="62" y="98" width="77" height="34" rx="14" fill="#fff"/>
    ${face(103, 107, 'sleep')}
    <path d="M127 116q59-24 103 8v41H125z" fill="#6a9bd3" stroke="${ink}" stroke-width="3"/>
    <path d="M155 127q17 8 30 0" fill="none" stroke="#a9c9ea" stroke-width="4"/>
  `),
  swim: scene('swim', '#dcf7ff', `
    <circle cx="219" cy="42" r="19" fill="#ffcf72"/>
    ${stroke('M104 91l-25-28-22 8', skin, 13)} ${stroke('M142 97l33-24 21 9', skin, 13)}
    <path d="M105 86q23-9 40 10l-8 19h-37z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${face(125, 59)}
    <path d="M0 119q20-12 40 0t40 0t40 0t40 0t40 0t40 0t40 0v81H0z" fill="#64c4e8"/>
    <path d="M0 137q20-12 40 0t40 0t40 0t40 0t40 0t40 0t40 0 M0 159q20-12 40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke="#d2f8ff" stroke-width="6"/>
  `),
  dance: scene('dance', '#fff0f2', `
    <path d="M111 94q25-12 47 3l2 31h-50z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${stroke('M116 101L86 68 69 59', skin, 12)} ${stroke('M151 101l32-34 17-5', skin, 12)}
    <path d="M109 127l50 1 20 21h-86z" fill="#ffae79" stroke="${ink}" stroke-width="3"/>
    ${stroke('M120 149l-24 24-18-5', trousers, 15)} ${stroke('M152 149l25 24 20-5', trousers, 15)}
    ${face(133, 62)}
    <path d="M56 97v-19l12-5v17m121-46V25l12-5v17" fill="none" stroke="#ba75b4" stroke-width="5" stroke-linecap="round"/><circle cx="52" cy="99" r="5" fill="#ba75b4"/><circle cx="185" cy="46" r="5" fill="#ba75b4"/>
  `),
  cook: scene('cook', '#fff0da', `
    <rect x="148" y="134" width="101" height="18" rx="7" fill="#6b8ea2"/><path d="M164 152v28m67-28v28" stroke="#61768b" stroke-width="9"/>
    <path d="M161 127q32-15 61 0l-6 17h-49z" fill="#f08f69" stroke="${ink}" stroke-width="3"/>
    <path d="M192 126q-9-14-5-23m19 20q8-15 4-24" fill="none" stroke="#b6d5d5" stroke-width="5" stroke-linecap="round"/>
    <path d="M80 102q26-11 52 0l10 63H70z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${stroke('M123 112l35 24', skin, 13)} <path d="M155 118l19 19" stroke="#c38b55" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 44q-5-20 14-22 8-16 21-4 18-10 23 6 19 5 12 23z" fill="#fff" stroke="${ink}" stroke-width="3"/>
    ${face(105, 66)}
  `),
  wash: scene('wash', '#e7f9f8', `
    <path d="M121 36h67v35h-15V52h-39v49" fill="none" stroke="#66869b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M164 69v18" stroke="#65c8e8" stroke-width="7" stroke-linecap="round"/>
    <path d="M118 119h119l-15 42h-89z" fill="#d9eff3" stroke="${ink}" stroke-width="3"/>
    <path d="M69 90q23-10 44 3l7 69H61z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${face(88, 57)}
    ${stroke('M109 105l39 27 19-8', skin, 12)} ${stroke('M98 109l43 37 25-17', skin, 12)}
    <circle cx="158" cy="111" r="7" fill="#fff" opacity=".9"/><circle cx="181" cy="100" r="5" fill="#fff" opacity=".9"/><circle cx="199" cy="113" r="4" fill="#fff" opacity=".9"/>
  `),
  cycle: scene('cycle', '#e8f7e9', `
    <circle cx="75" cy="147" r="34" fill="none" stroke="${ink}" stroke-width="6"/><circle cx="207" cy="147" r="34" fill="none" stroke="${ink}" stroke-width="6"/>
    <path d="M75 147l49-52 35 52H75l49-52m35 52 48-52m-60 0h29m-71 0h37" fill="none" stroke="#e5786b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M99 92q22-14 45-4l9 34h-55z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${stroke('M108 115l29 24-12 17', trousers, 15)} ${stroke('M126 117l-20 28-23 0', trousers, 15)}
    ${stroke('M137 96l30-1 14 10', skin, 11)}
    ${face(119, 54)}
    <path d="M97 39q22-23 44 0" fill="none" stroke="#ffb461" stroke-width="9" stroke-linecap="round"/>
  `),
  water: scene('water', '#eaf8e5', `
    <path d="M198 171v-56m0 27q-19-33-38-25 0 24 38 28m1-13q15-38 36-29 4 27-36 31" fill="#5bba72" stroke="#39815b" stroke-width="4" stroke-linejoin="round"/>
    <path d="M172 166h52l-7 18h-39z" fill="#d48166" stroke="${ink}" stroke-width="3"/>
    <path d="M64 100q26-13 51 0l11 67H54z" fill="${blue}" stroke="${ink}" stroke-width="3"/>
    ${face(87, 64)}
    ${stroke('M112 108l30 10', skin, 12)}
    <path d="M133 106l35-3 10 15-37 9z" fill="#ffcb68" stroke="${ink}" stroke-width="3"/><path d="M139 106q-6-26 16-26 16 0 12 25" fill="none" stroke="${ink}" stroke-width="4"/>
    <path d="M178 122l9 15m3-18 8 13m6-15 5 11" stroke="#72c6e8" stroke-width="5" stroke-linecap="round"/>
  `)
};

await mkdir(output, { recursive: true });
await Promise.all(Object.entries(scenes).map(([id, svg]) => writeFile(path.join(output, `${id}.svg`), svg)));
console.log(`Created ${Object.keys(scenes).length} test scenes.`);

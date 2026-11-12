'use strict';
const APP_VERSION = '19';
const $ = s => document.querySelector(s);

// [혼자] = only when one child is the focus, [단체] = only when several kids are on screen.
// lines with {이름} are treated as [혼자]. untagged lines fit anywhere.
// common captions must fit ANY class (no kicks, jumps or forms here).
const DEFAULT_PHRASES = [
  '[혼자] 멋진 {이름}!', '[혼자] {이름} 화이팅!', '[혼자] 우리 {이름} 최고 👍', '[혼자] I CAN DO IT!',
  '[혼자] 눈빛만큼은 검은띠', '[혼자] 이 정도면 국가대표 아님?', '[혼자] 조금씩 늘고 있어요',
  '[단체] 다같이 신나게!', '[단체] 우리 반 최고 👍', '[단체] 친구랑 같이 화이팅', '[단체] 함께라서 더 즐거워',
  '[단체] 모두 집중 모드 ON', '[단체] 팀워크 최고', '[단체] 우리 반 에너지 실화?',
  '열심히 따라하는 중!', '집중 모드 ON', '땀방울은 거짓말 안 함', '이 맛에 태권도 하지',
  '포기란 없다', '오늘도 한 뼘 성장', '마무리까지 힘차게!', 'Go go go!'
];
const V7_GENERAL = [
  '[혼자] 멋진 {이름}!', '[혼자] {이름} 화이팅!', '[혼자] 우리 {이름} 최고 👍', '[혼자] I CAN DO IT!',
  '[혼자] 눈빛만큼은 검은띠', '[혼자] 이 정도면 국가대표 아님?', '[혼자] 조금씩 늘고 있어요', '[혼자] 흔들려도 다시 일어서기',
  '[단체] 다같이 신나게!', '[단체] 우리 반 최고 👍', '[단체] 친구랑 같이 화이팅', '[단체] 함께라서 더 즐거워',
  '[단체] 다같이 기합!', '[단체] 모두 집중 모드 ON', '[단체] 팀워크 최고', '[단체] 우리 반 에너지 실화?',
  '열심히 따라하는 중!', '오늘도 기합 넣고 시작!', '집중 모드 ON', '사범님 눈빛 따라가기', '땀방울은 거짓말 안 함',
  '기합 소리 들리시나요?', '하나! 둘! 셋!', '숨 고르기 타임', '이 맛에 태권도 하지', '포기란 없다',
  '오늘도 한 뼘 성장', '사범님 시범 집중!', '마무리까지 힘차게!', '오늘도 수고했어요 👏', 'Go go go!'
];

const CLASS_PHRASES = {
  rope: [
    '[혼자] {이름} 줄넘기 장인', '[혼자] 몇 개 했게? 🤔', '[혼자] 줄넘기 신기록 각', '[혼자] 이단뛰기 도전!',
    '[단체] 다같이 점프 점프!', '[단체] 단체 줄넘기 호흡 척척', '[단체] 박자 맞춰 하나 둘!', '[단체] 한 명도 안 걸렸다!',
    '줄넘기 쌩쌩!', '쉬지 않고 점프 점프', '줄이 안 보여요 ㅋㅋ', '리듬 타는 중 🎵', '발이 가벼워요',
    '걸려도 다시 시작!', '깡총깡총 점프왕', '한 번만 더!', 'Nice jump!'
  ],
  poomsae: [
    '[혼자] {이름} 품새 장인', '[혼자] 눈빛까지 품새', '[혼자] 품새 대회 나가도 될 듯', '[혼자] 흔들림 없는 자세',
    '[단체] 다같이 맞춰서 품새!', '[단체] 칼군무 품새', '[단체] 동작이 딱딱 맞아요', '[단체] 모두 한 몸처럼',
    '품새 집중 모드', '동작 하나하나 정확하게', '기합! 마무리 자세', '천천히, 하지만 힘있게', '순서 외우는 중… 🧠',
    '절도 있는 동작!', '바른 자세가 기본', '태극 품새 시작!', '자세 잡는 중… 진지함 100%', '균형 잡기 챌린지'
  ],
  kick: [
    '[혼자] {이름} 발차기 클라쓰', '[혼자] 이 발차기 실화?', '[혼자] 돌려차기 각도 미쳤다', '[혼자] 다리가 하늘까지',
    '[단체] 다같이 발차기 팡팡!', '[단체] 줄 맞춰 발차기', '[단체] 단체 기합 발차기', '[단체] 발차기 군단 출동',
    '발차기 슝!', '앞차기 팡팡!', '미트 터지는 소리', '균형 잡고 뻥!', '옆차기 도전!', '힘 있게 한 번 더',
    '타격감 최고 💥', '높이높이 발차기', '발차기 각도 실화냐', '앞차기 연습 중', '오늘의 목표: 다리 더 높이!'
  ]
};
// earlier default lists; phones that still have one of these untouched get the new lists
const V6_GENERAL = [
  '멋진 {이름}!', '{이름} 화이팅!', '우리 {이름} 최고 👍', 'I CAN DO IT!', 'Go go go!',
  '열심히 따라하는 중!', '오늘도 기합 넣고 시작!', '집중 모드 ON', '이 정도면 국가대표 아님?',
  '사범님 눈빛 따라가기', '땀방울은 거짓말 안 함', '기합 소리 들리시나요?', '하나! 둘! 셋!',
  '흔들려도 다시 일어서기', '눈빛만큼은 검은띠', '조금씩 늘고 있어요', '숨 고르기 타임',
  '이 맛에 태권도 하지', '포기란 없다', '오늘도 한 뼘 성장', '친구랑 같이 화이팅',
  '사범님 시범 집중!', '마무리까지 힘차게!', '오늘도 수고했어요 👏'
];
const V6_CLASS = {
  rope: [
    '줄넘기 쌩쌩!', '쉬지 않고 점프 점프', '이단뛰기 도전!', '줄이 안 보여요 ㅋㅋ', '리듬 타는 중 🎵',
    '{이름} 줄넘기 장인', '발이 가벼워요', '몇 개 했게? 🤔', '줄넘기 신기록 각', '걸려도 다시 시작!',
    '깡총깡총 점프왕', '한 번만 더!', 'Nice jump!'
  ],
  poomsae: [
    '품새 집중 모드', '동작 하나하나 정확하게', '눈빛까지 품새', '기합! 마무리 자세', '{이름} 품새 장인',
    '천천히, 하지만 힘있게', '순서 외우는 중… 🧠', '흔들림 없는 자세', '절도 있는 동작!', '품새 대회 나가도 될 듯',
    '바른 자세가 기본', '태극 품새 시작!', '자세 잡는 중… 진지함 100%', '균형 잡기 챌린지'
  ],
  kick: [
    '발차기 슝!', '앞차기 팡팡!', '돌려차기 각도 미쳤다', '다리가 하늘까지', '{이름} 발차기 클라쓰',
    '미트 터지는 소리', '균형 잡고 뻥!', '옆차기 도전!', '힘 있게 한 번 더', '이 발차기 실화?',
    '타격감 최고 💥', '높이높이 발차기', '발차기 각도 실화냐', '앞차기 연습 중', '오늘의 목표: 다리 더 높이!'
  ]
};
const OLD_DEFAULTS = {
  general: ['멋진 {이름}!', '{이름} 화이팅!', '우리 {이름} 최고 👍', 'I CAN DO IT!', 'Nice jump!', 'Go go go!', '열심히 따라하는 중!', '오늘도 기합 넣고 시작!', '집중 모드 ON', '발차기 각도 실화냐', '이 정도면 국가대표 아님?', '사범님 눈빛 따라가기', '땀방울은 거짓말 안 함', '앞차기 연습 중', '자세 잡는 중… 진지함 100%', '기합 소리 들리시나요?', '오늘의 목표: 다리 더 높이!', '하나! 둘! 셋!', '흔들려도 다시 일어서기', '품새 외우는 중', '눈빛만큼은 검은띠', '조금씩 늘고 있어요', '숨 고르기 타임', '이 맛에 태권도 하지', '포기란 없다', '오늘도 한 뼘 성장', '균형 잡기 챌린지', '친구랑 같이 화이팅', '사범님 시범 집중!', '마무리까지 힘차게!', '오늘도 수고했어요 👏'].join('\n'),
  rope: ['줄넘기 쌩쌩!', '쉬지 않고 점프 점프', '이단뛰기 도전!', '줄이 안 보여요 ㅋㅋ', '리듬 타는 중 🎵', '{이름} 줄넘기 장인', '발이 가벼워요', '몇 개 했게? 🤔', '줄넘기 신기록 각', '걸려도 다시 시작!', '깡총깡총 점프왕', '한 번만 더!'].join('\n'),
  poomsae: ['품새 집중 모드', '동작 하나하나 정확하게', '눈빛까지 품새', '기합! 마무리 자세', '{이름} 품새 장인', '천천히, 하지만 힘있게', '순서 외우는 중… 🧠', '흔들림 없는 자세', '절도 있는 동작!', '품새 대회 나가도 될 듯', '바른 자세가 기본', '태극 품새 시작!'].join('\n'),
  kick: ['발차기 슝!', '앞차기 팡팡!', '돌려차기 각도 미쳤다', '다리가 하늘까지', '{이름} 발차기 클라쓰', '미트 터지는 소리', '균형 잡고 뻥!', '옆차기 도전!', '힘 있게 한 번 더', '이 발차기 실화?', '타격감 최고 💥', '높이높이 발차기'].join('\n')
};
for (const k of ['general', 'rope', 'poomsae', 'kick']) {
  OLD_DEFAULTS[k] = [OLD_DEFAULTS[k], (k === 'general' ? V6_GENERAL : V6_CLASS[k]).join('\n')];
  if (k === 'general') OLD_DEFAULTS[k].push(V7_GENERAL.join('\n'));
}
// solo scene + a name typed in → "{활동}하는 {이름}" style captions
const OPENERS = {
  general: ['오늘도 기합 넣고 시작!', '오늘의 태권도 시작!', '준비됐나요? 시작!'],
  rope: ['줄넘기 시작!', '오늘의 줄넘기 타임', '줄넘기 준비 완료!'],
  poomsae: ['품새 시작!', '오늘의 품새 타임', '바른 자세로 시작!'],
  kick: ['발차기 시작!', '오늘의 발차기 타임', '발차기 준비 완료!']
};
const NAME_COMMON = [
  '{이름} 화이팅!', '멋지다 {이름}!', '우리 {이름} 최고 👍', '{이름} 집중 모드 ON', '{이름} 오늘도 열일 중',
  '{이름} 표정 진지함 100%', '역시 {이름}!', '{이름} 엄지 척 👍', '{이름} 오늘 컨디션 최고', '{이름} 할 수 있다!'
];
const NAME_TEMPLATES = {
  general: ['열심히 하는 {이름}', '집중하는 {이름}', '멋지게 해내는 {이름}', '최선을 다하는 {이름}', '땀 흘리는 {이름}'],
  rope: ['줄넘기하는 {이름}', '점프하는 {이름}', '쌩쌩 줄넘기하는 {이름}', '리듬 타는 {이름}', '{이름} 줄넘기 장인',
    '{이름} 점프 점프!', '줄 안 걸리는 {이름}', '{이름} 줄넘기 신기록 도전'],
  poomsae: ['품새하는 {이름}', '자세 잡는 {이름}', '기합 넣는 {이름}', '절도 있게 품새하는 {이름}', '{이름} 품새 장인',
    '{이름} 눈빛까지 품새', '흔들림 없는 {이름}', '{이름} 동작 딱딱!'],
  kick: ['발차기하는 {이름}', '앞차기하는 {이름}', '힘차게 차는 {이름}', '높이 차는 {이름}', '{이름} 발차기 클라쓰',
    '{이름} 다리가 하늘까지', '{이름} 발차기 슝!', '미트 팡팡 터뜨리는 {이름}']
};
// class lines ~60%, cheers ~40%
const nameTemplatesFor = cls => {
  const own = NAME_TEMPLATES[cls] || NAME_TEMPLATES.general;
  return Math.random() < 0.6 ? own : NAME_COMMON;
};
const CLASSES = [
  { id: 'general', label: '일반' }, { id: 'rope', label: '줄넘기' },
  { id: 'poomsae', label: '품새' }, { id: 'kick', label: '발차기' }
];
const clsLabel = id => (CLASSES.find(c => c.id === id) || CLASSES[0]).label;
const defaultSets = () => ({
  general: DEFAULT_PHRASES.join('\n'),
  rope: CLASS_PHRASES.rope.join('\n'), poomsae: CLASS_PHRASES.poomsae.join('\n'), kick: CLASS_PHRASES.kick.join('\n')
});
function guessCls(name) {
  if (/줄넘기|rope|jump/i.test(name)) return 'rope';
  if (/품새|poomsae|pumsae|form/i.test(name)) return 'poomsae';
  if (/발차기|차기|kick/i.test(name)) return 'kick';
  return null;
}

const FONTS = [
  { id: 'Black Han Sans', label: '검은고딕', w: 400, k: 1.0 },
  { id: 'Do Hyeon', label: '도현', w: 400, k: 1.0 },
  { id: 'Jua', label: '주아', w: 400, k: 1.0 },
  { id: 'Gamja Flower', label: '감자꽃', w: 400, k: 1.12 },
  { id: 'Nanum Pen Script', label: '나눔펜', w: 400, k: 1.3 },
  { id: 'Noto Sans KR', label: '노토 산스', w: 700, k: 0.95 }
];

// colors each style may use when "색 랜덤" is on (index 0 = the original look)
const PALETTE = {
  variety: ['#FFD43B', '#FFFFFF', '#FF8FB1', '#7CF0C5', '#FFB347', '#8FD3FF'],
  bar: ['rgba(0,0,0,0.62)', 'rgba(215,38,61,0.85)', 'rgba(12,68,124,0.85)', 'rgba(8,80,65,0.85)', 'rgba(60,52,137,0.85)'],
  sticker: ['#FFFFFF', '#FFF3B0', '#FFD6E5', '#D6F5E8', '#DCEBFF']
};
const STYLE_LABEL = { variety: '예능형', bar: '자막바형', sticker: '스티커형' };
const DEFAULT_POS = { variety: 84, bar: 88, sticker: 20 };
const DEFAULT_FONT = { variety: 'Black Han Sans', bar: 'Do Hyeon', sticker: 'Jua' };

const KEY = 'tkd-caption-settings-v1';
const defaults = {
  style: 'variety',
  font: { ...DEFAULT_FONT },
  size: 100,
  pos: { ...DEFAULT_POS },
  showTag: true,
  tag: '오늘의 수업',
  tagAuto: true,
  group: '',
  titleCaps: false,
  mixFonts: false,
  mixStyles: false,
  styleList: ['variety', 'sticker'],
  randColor: false,
  randPos: false,
  people: true,
  mixList: ['Black Han Sans', 'Jua', 'Do Hyeon'],
  showDate: false,
  music: 'beat',
  musicVol: 70,
  origVol: 40,
  names: '',
  target: 120,
  seg: 6,
  smart: true,
  sets: defaultSets(),
  defCls: 'general',
  editSet: 'general'
};
let S = loadSettings();
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (s.phrases && !s.sets) s.sets = { general: s.phrases };
    if (s.sets) for (const k in OLD_DEFAULTS) if (OLD_DEFAULTS[k].includes((s.sets[k] || '').trim())) delete s.sets[k];
    return { ...defaults, ...s, sets: { ...defaultSets(), ...(s.sets || {}) }, font: { ...DEFAULT_FONT, ...(s.font || {}) }, pos: { ...DEFAULT_POS, ...(s.pos || {}) } };
  } catch (e) { return { ...defaults }; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

// ---------- elements ----------
const video = $('#src');
const canvas = $('#stage');
const ctx = canvas.getContext('2d');
let outBlob = null, outURL = null;
let sources = [], curSrc = -1, OUT = { W: 720, H: 1280 };
let plan = [], total = 0, captions = [], selCap = -1;
let busy = false, cancelled = false, analyzing = false;

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}
const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

// ---------- UI binding ----------
function buildFontChips() {
  $('#fonts').innerHTML = FONTS.map(f =>
    `<button class="chip" data-v="${f.id}"><div class="fx" style="font-family:'${f.id}';font-weight:${f.w}">${f.label}</div></button>`).join('');
}
function syncUI() {
  document.querySelectorAll('#styles .chip').forEach(b => {
    b.classList.toggle('on', S.mixStyles ? S.styleList.includes(b.dataset.v) : b.dataset.v === S.style);
    b.classList.toggle('edit', S.mixStyles && b.dataset.v === S.style);
  });
  $('#mixStyles').checked = S.mixStyles; $('#randColor').checked = S.randColor; $('#randPos').checked = S.randPos;
  $('#styleHint').textContent = S.mixStyles
    ? `${S.styleList.map(x => STYLE_LABEL[x]).join(' → ')} 순서로 장면마다 번갈아 나와요. 아래 폰트·크기·위치는 밑줄 친 ${STYLE_LABEL[S.style]}에 적용돼요 (한 번 더 누르면 빼기).`
    : '';
  document.querySelectorAll('#fonts .chip').forEach(b => b.classList.toggle('on', S.mixFonts ? S.mixList.includes(b.dataset.v) : b.dataset.v === S.font[S.style]));
  $('#mixFonts').checked = S.mixFonts;
  $('#fontHint').textContent = S.mixFonts ? `섞을 폰트를 2개 이상 골라주세요 (지금 ${S.mixList.length}개). 장면마다 돌아가며 바뀌어요.` : '';
  document.querySelectorAll('#segs .chip').forEach(b => b.classList.toggle('on', +b.dataset.v === S.seg));
  $('#size').value = S.size; $('#sizeV').textContent = S.size + '%';
  $('#pos').value = S.pos[S.style]; $('#posV').textContent = S.pos[S.style] < 35 ? '위쪽' : S.pos[S.style] > 65 ? '아래쪽' : '가운데';
  $('#showTag').checked = S.showTag; $('#tag').value = S.tag; $('#tagRow').classList.toggle('hidden', !S.showTag);
  $('#tagAuto').checked = S.tagAuto; $('#tag').classList.toggle('hidden', S.tagAuto); $('#titleCaps').checked = S.titleCaps;
  document.querySelectorAll('#groups .chip').forEach(b => b.classList.toggle('on', b.dataset.v === S.group));
  $('#showDate').checked = S.showDate; $('#names').value = S.names; $('#smart').checked = S.smart; $('#people').checked = S.people;
  $('#target').value = S.target; $('#targetV').textContent = fmt(S.target);
  if ($('#phrases') !== document.activeElement) $('#phrases').value = S.sets[S.editSet] || '';
  document.querySelectorAll('#sets .chip').forEach(b => b.classList.toggle('on', b.dataset.v === S.editSet));
  document.querySelectorAll('#allCls .chip').forEach(b => b.classList.toggle('on', b.dataset.v === S.defCls));
}
function onChange(replan) { save(); syncUI(); if (replan) rebuildPlan(true); preview(); }

$('#styles').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return; const v = b.dataset.v;
  if (S.mixStyles) {
    if (S.styleList.includes(v) && S.style === v) {
      if (S.styleList.length <= 2) { toast('최소 2개는 골라야 해요'); return; }
      S.styleList = S.styleList.filter(x => x !== v); S.style = S.styleList[0];
    } else { if (!S.styleList.includes(v)) S.styleList = [...S.styleList, v]; S.style = v; }
    save(); syncUI(); assignFonts(); ensureFont().then(preview); return;
  }
  S.style = v; onChange(); assignFonts(); ensureFont().then(preview);
});
$('#mixStyles').onchange = e => { S.mixStyles = e.target.checked; if (S.mixStyles && !S.styleList.includes(S.style)) S.style = S.styleList[0]; save(); syncUI(); assignFonts(); ensureFont().then(preview); };
$('#randColor').onchange = e => { S.randColor = e.target.checked; save(); assignFonts(); };
$('#randPos').onchange = e => { S.randPos = e.target.checked; save(); assignFonts(); };
$('#fonts').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return; const v = b.dataset.v;
  if (S.mixFonts) {
    if (S.mixList.includes(v)) { if (S.mixList.length <= 2) { toast('최소 2개는 골라야 해요'); return; } S.mixList = S.mixList.filter(x => x !== v); }
    else S.mixList = [...S.mixList, v];
    save(); syncUI(); assignFonts(); ensureFont().then(preview); return;
  }
  S.font[S.style] = v; onChange(); ensureFont().then(preview);
});
$('#mixFonts').onchange = e => { S.mixFonts = e.target.checked; save(); syncUI(); assignFonts(); ensureFont().then(preview); };
// per-caption look: font, style, color and a small position wobble, decided once so preview == video
const rnd = (a, b) => a + Math.random() * (b - a);
function assignFonts() {
  const fonts = S.mixList.filter(id => FONTS.some(f => f.id === id));
  const styles = S.mixStyles ? S.styleList.filter(x => STYLE_LABEL[x]) : [S.style];
  let lastColor = -1;
  captions.forEach((c, i) => {
    c.font = fonts.length ? fonts[i % fonts.length] : null;
    const style = styles.length ? styles[i % styles.length] : S.style;
    let color = 0;
    if (S.randColor) { const n = PALETTE[style].length; do { color = Math.random() * n | 0; } while (n > 1 && color === lastColor); }
    lastColor = color;
    c.look = {
      style, color,
      dy: S.randPos ? rnd(-6, 6) : 0,
      dx: S.randPos ? (style === 'sticker' ? rnd(-0.14, 0.14) : rnd(-0.04, 0.04)) : 0,
      rot: style === 'sticker' ? (S.randPos ? (Math.random() < 0.5 ? -1 : 1) * rnd(0.04, 0.13) : -0.09) : 0
    };
  });
  preview();
}
$('#segs').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; S.seg = +b.dataset.v; onChange(true); });
$('#size').addEventListener('input', e => { S.size = +e.target.value; onChange(); });
$('#pos').addEventListener('input', e => { S.pos[S.style] = +e.target.value; onChange(); });
$('#posReset').onclick = () => { S.pos[S.style] = DEFAULT_POS[S.style]; onChange(); };
$('#showTag').onchange = e => { S.showTag = e.target.checked; onChange(); };
$('#tag').oninput = e => { S.tag = e.target.value; save(); preview(); };
$('#tagAuto').onchange = e => { S.tagAuto = e.target.checked; onChange(); };
$('#titleCaps').onchange = e => { S.titleCaps = e.target.checked; save(); fillCaptions(false); };
$('#groups').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; S.group = b.dataset.v; save(); syncUI(); fillCaptions(false); });
$('#showDate').onchange = e => { S.showDate = e.target.checked; onChange(); };
// names apply as you type (iPhone doesn't always fire 'change' before the next tap)
let namesTimer = null;
$('#names').addEventListener('input', e => {
  S.names = e.target.value; save();
  clearTimeout(namesTimer); namesTimer = setTimeout(refreshNames, 400);
});
$('#names').addEventListener('change', () => refreshNames());
let namesUsed = null;
function refreshNames() {
  clearTimeout(namesTimer);
  if (namesUsed === S.names) return;
  if (sources.length) fillCaptions(true);
}
$('#people').onchange = async e => {
  S.people = e.target.checked; save();
  if (S.people && sources.length) { await detectPeople(); $('#make').disabled = !sources.length; }
  rebuildPlan(true); refreshPreview();
};
$('#smart').onchange = async e => { S.smart = e.target.checked; save(); await analyzeAll(); rebuildPlan(true); refreshPreview(); };
$('#target').addEventListener('input', e => { S.target = +e.target.value; $('#targetV').textContent = fmt(S.target); });
$('#target').addEventListener('change', e => { S.target = +e.target.value; onChange(true); });
$('#phrases').addEventListener('input', e => { S.sets[S.editSet] = e.target.value; save(); });
$('#sets').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; S.editSet = b.dataset.v; save(); syncUI(); });
$('#allCls').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  S.defCls = b.dataset.v; sources.forEach(s => s.cls = S.defCls); save(); syncUI(); renderClips(); fillCaptions(false);
  if (sources.length) toast(`모든 영상을 ${clsLabel(S.defCls)} 수업으로 맞췄어요`);
});
$('#phrases').addEventListener('change', () => fillCaptions(true));
$('#phrasesReset').onclick = () => { S.sets[S.editSet] = defaultSets()[S.editSet]; $('#phrases').value = S.sets[S.editSet]; save(); fillCaptions(true); toast(`${clsLabel(S.editSet)} 문구를 기본으로 되돌렸어요`); };
$('#reroll').onclick = () => { fillCaptions(true); toast('자막을 다시 섞었어요'); };

// ---------- captions ----------
const nameList = () => S.names.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
const hasBatchim = ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const callName = n => n + (hasBatchim(n[n.length - 1]) ? '이' : '');
// '[혼자] text' / '[단체] text' / 'text'  →  { aud: 'solo' | 'group' | null, text }
function parseLine(p) {
  const m = p.match(/^\[(혼자|단체)\]\s*(.*)$/);
  const aud = m ? (m[1] === '혼자' ? 'solo' : 'group') : (p.includes('{이름}') ? 'solo' : null);
  return { aud, text: (m ? m[2] : p).trim() };
}
// aud: 'any' (detection off) → everything; 'solo'/'group' → untagged + that tag; null (unsure) → untagged only
const audOk = (lineAud, aud) => aud === 'any' || lineAud === null || lineAud === aud;
const linesOf = (key, aud = 'any') => (S.sets[key] || '').split('\n').map(s => s.trim()).filter(Boolean)
  .map(parseLine).filter(l => l.text && (nameList().length || !l.text.includes('{이름}')) && audOk(l.aud, aud)).map(l => l.text);
const rawPhrases = () => linesOf('general');
const fillName = p => { const ns = nameList(); return ns.length ? p.replace(/\{이름\}/g, () => callName(ns[Math.random() * ns.length | 0])) : p; };
const phraseList = () => rawPhrases();
function shuffled(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
// a clip tagged with a class only ever gets that class's captions; common ones are for '일반' clips
// lines written specifically for this audience ([혼자]/[단체]) win ~65% of the time
const taggedOf = (key, aud) => (S.sets[key] || '').split('\n').map(s => s.trim()).filter(Boolean)
  .map(parseLine).filter(l => l.text && l.aud === aud && (nameList().length || !l.text.includes('{이름}'))).map(l => l.text);
function poolFor(cls, aud = 'any') {
  const key = cls && cls !== 'general' && linesOf(cls, aud).length ? cls : 'general';
  const all = linesOf(key, aud);
  if (aud === 'solo' || aud === 'group') {
    const tagged = taggedOf(key, aud);
    if (tagged.length && tagged.length < all.length && Math.random() < 0.65) return tagged;
  }
  return all;
}
function clsAt(t) {
  if (!plan.length || !sources.length) return 'general';
  const p = outToSrc(Math.min(total - 0.01, t));
  return (sources[p.src] && sources[p.src].cls) || 'general';
}
function pickPhrase(avoid, cls, aud) {
  const list = poolFor(cls, aud); if (!list.length) return '';
  const pool = list.filter(p => !avoid.includes(p));
  const src = pool.length ? pool : list;
  return fillName(src[Math.random() * src.length | 0]);
}
// one caption per scene; long uncut scenes get a new caption every ~9s.
// each caption disappears a bit before its scene ends, so it never spills into the next cut.
function captionSlots() {
  const slots = []; let acc = 0;
  plan.forEach(seg => {
    const L = seg.end - seg.start;
    const cls = (sources[seg.src] && sources[seg.src].cls) || 'general';
    if (L >= 1) {
      const n = L < 13 ? 1 : Math.round(L / 9), chunk = L / n;
      for (let k = 0; k < n; k++) {
        const t = acc + k * chunk;
        const tail = k === n - 1 ? 0.35 : 0.8;
        const show = Math.min(chunk - tail, n > 1 ? 6 : Math.max(chunk * 0.9, chunk - tail));
        if (show < 0.7) continue;
        const a = seg.start + k * chunk;
        slots.push({ t, end: t + show, cls, aud: S.people && !detectorFailed ? audFor(seg.src, a, a + chunk) : 'any', key: `${seg.src}|${seg.start.toFixed(1)}|${k}` });
      }
    }
    acc += L;
  });
  return slots;
}
function titleFor(cls) {
  const parts = [S.group, cls && cls !== 'general' ? clsLabel(cls) : ''].filter(Boolean);
  return parts.length ? parts.join(' ') + ' 수업' : '오늘의 수업';
}
const tagText = t => S.tagAuto ? titleFor(clsAt(t)) : S.tag.trim();
const AUD_ICON = { solo: '👤', group: '👥' };
const audLabel = a => a === 'solo' ? '👤 혼자' : a === 'group' ? '👥 단체' : '공통';
// majority vote over the detection samples inside [a, b] of a clip
function audFor(src, a, b) {
  const s = sources[src]; if (!s || !s.people) return null;
  let pts = s.people.filter(p => p.t >= a && p.t <= b);
  if (!pts.length) { const mid = (a + b) / 2; pts = [s.people.reduce((x, y) => Math.abs(y.t - mid) < Math.abs(x.t - mid) ? y : x, s.people[0])].filter(Boolean); }
  if (!pts.length) return null;
  const solo = pts.filter(p => p.label === 'solo').length, group = pts.filter(p => p.label === 'group').length;
  if (solo > pts.length / 2) return 'solo';
  if (group > pts.length / 2) return 'group';
  if (solo > 0 && solo >= group) return 'solo';
  if (group >= 2 * solo && group > 0) return 'group';
  return null;
}
const capAt = t => captions.find(c => t >= c.t && t < c.end) || null;
function fillCaptions(reshuffle) {
  namesUsed = S.names;
  const bags = {};
  const used = new Set();
  // shuffled bags per pool, and never the same caption twice in one video while unused ones remain
  const next = (cls, aud) => {
    const list = poolFor(cls, aud); const key = list.join('\n');
    if (!bags[key] || !bags[key].length) bags[key] = shuffled(list.length ? list : ['']);
    const bag = bags[key];
    let idx = -1;
    for (let j = bag.length - 1; j >= 0; j--) if (!used.has(bag[j])) { idx = j; break; }
    if (idx < 0) { const fresh = list.filter(x => !used.has(x)); if (fresh.length) { bags[key] = shuffled(fresh); return next(cls, aud); } idx = bag.length - 1; }
    const raw = bag.splice(idx, 1)[0]; used.add(raw);
    return fillName(raw);
  };
  const nameBags = {};
  let lastName = '';
  const nextName = cls => {
    const list = nameTemplatesFor(cls), k = list[0];
    if (!nameBags[k] || !nameBags[k].length) nameBags[k] = shuffled(list);
    let t = fillName(nameBags[k].pop());
    if (t === lastName && nameBags[k].length) t = fillName(nameBags[k].pop());
    return (lastName = t);
  };
  const oldByKey = new Map(captions.map(c => [c.key, c]));
  let lastCls = null;
  captions = captionSlots().map(sl => {
    const prev = oldByKey.get(sl.key);
    if (prev && prev.audManual && S.people) { sl.aud = prev.aud; sl.audManual = true; }
    const isTitle = S.titleCaps && !(S.showTag && S.tagAuto) && sl.cls !== lastCls; lastCls = sl.cls;
    if (prev && prev.edited) return { ...sl, text: prev.text, edited: true };
    if (isTitle) return { ...sl, text: titleFor(sl.cls) + (sl.cls === 'general' && !S.group ? ' 시작!' : ' 🥋'), edited: false, title: true };
    const keep = !reshuffle && prev && !prev.title && prev.cls === sl.cls && prev.aud === sl.aud;
    if (keep) return { ...sl, text: prev.text, edited: false };
    if (sl.aud === 'solo' && nameList().length) return { ...sl, text: nextName(sl.cls), edited: false };
    if (sl.aud === 'any' && nameList().length && Math.random() < 0.4) return { ...sl, text: nextName(sl.cls), edited: false };
    if (sl.t === 0) { const o = OPENERS[sl.cls] || OPENERS.general; return { ...sl, text: o[Math.random() * o.length | 0], edited: false }; }
    return { ...sl, text: next(sl.cls, sl.aud), edited: false };
  });
  assignFonts(); renderCapList(); preview(); warmFonts();
}
function renderCapList() {
  const box = $('#caplist');
  $('#audHelp').classList.toggle('hidden', !S.people || !captions.length);
  $('#clsNudge').classList.toggle('hidden', !sources.length || sources.some(s => s.cls !== 'general'));
  if (!captions.length) { box.innerHTML = '<p class="hint">영상을 고르면 자막 순서가 만들어져요.</p>'; return; }
  box.innerHTML = captions.map((c, i) => `
    <div class="cap${i === selCap ? ' sel' : ''}" data-i="${i}">
      <span class="t">${fmt(c.t)}${c.cls && c.cls !== 'general' ? `<em>${clsLabel(c.cls)}</em>` : ''}</span>
      <input type="text" value="${c.text.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" placeholder="(자막 없음)">
      ${S.people ? `<button data-a="aud" class="aud aud-${c.aud || 'any'}${c.audManual ? ' manual' : ''}" aria-label="혼자/단체/공통 바꾸기">${audLabel(c.aud)}</button>` : ''}
      <button data-a="dice" aria-label="다시 뽑기">🎲</button>
    </div>`).join('');
}
$('#caplist').addEventListener('input', e => {
  const row = e.target.closest('.cap'); if (!row) return;
  const c = captions[+row.dataset.i]; c.text = e.target.value; c.edited = true; previewAt(+row.dataset.i); warmFonts();
});
$('#caplist').addEventListener('focusin', e => { const row = e.target.closest('.cap'); if (row && e.target.tagName === 'INPUT') previewAt(+row.dataset.i); });
$('#caplist').addEventListener('click', e => {
  const row = e.target.closest('.cap'); if (!row) return; const i = +row.dataset.i;
  if (e.target.dataset.a === 'dice') {
    const near = captions.slice(Math.max(0, i - 3), i + 4).map(c => c.text);
    const c = captions[i];
    if (c.aud === 'solo' && nameList().length && Math.random() < 0.7) {
      const tpl = nameTemplatesFor(c.cls).map(fillName).filter(x => !near.includes(x));
      c.text = tpl.length ? tpl[Math.random() * tpl.length | 0] : pickPhrase(near, c.cls, c.aud);
    } else c.text = pickPhrase(near, c.cls, c.aud);
    c.edited = true;
    row.querySelector('input').value = captions[i].text;
  }
  if (e.target.dataset.a === 'aud') {
    const c = captions[i], order = ['solo', 'group', null];
    c.aud = order[(order.indexOf(c.aud) + 1) % order.length]; c.audManual = true;
    if (!c.title) {
      const near = captions.slice(Math.max(0, i - 3), i + 4).map(x => x.text);
      const tpl = nameTemplatesFor(c.cls);
      c.text = c.aud === 'solo' && nameList().length ? fillName(tpl[Math.random() * tpl.length | 0]) : pickPhrase(near, c.cls, c.aud);
      c.edited = false;
    }
    e.target.textContent = audLabel(c.aud); e.target.className = `aud aud-${c.aud || 'any'} manual`; row.querySelector('input').value = c.text;
    toast(c.aud === 'solo' ? '혼자 나오는 장면으로 바꿨어요' : c.aud === 'group' ? '단체 장면으로 바꿨어요' : '혼자/단체 상관없는 자막으로 바꿨어요');
  }
  if (e.target.dataset.a === 'dice' || e.target.dataset.a === 'aud') warmFonts();
  if (e.target.dataset.a === 'dice' || e.target.dataset.a === 'aud' || e.target.classList.contains('t')) previewAt(i);
});

// ---------- planning ----------
function meanScore(s, a, b) {
  if (!s.scores || !s.scores.length) return 1;
  const i0 = Math.max(0, Math.floor(a / s.dt)), i1 = Math.min(s.scores.length - 1, Math.ceil(b / s.dt));
  let sum = 0, n = 0; for (let i = i0; i <= i1; i++) { sum += s.scores[i]; n++; }
  return n ? sum / n : 0;
}
function evenPlan(L, target, totalDur) {
  const out = [];
  sources.forEach((s, i) => {
    const budget = target * s.dur / totalDur;
    if (s.dur <= Math.max(L * 1.4, budget + 1)) { if (budget >= L * 0.4 || s.dur <= L * 1.4) out.push({ src: i, start: 0, end: Math.min(s.dur, Math.max(budget, L)) }); return; }
    const n = Math.max(1, Math.round(budget / L)), len = budget / n;
    const margin = Math.min(1, s.dur * 0.02), step = (s.dur - 2 * margin) / n;
    for (let k = 0; k < n; k++) {
      const c = margin + step * (k + 0.5), st = Math.min(Math.max(0, c - len / 2), s.dur - len);
      out.push({ src: i, start: st, end: st + len });
    }
  });
  return out;
}
function smartPlan(L, target) {
  const cands = [];
  sources.forEach((s, i) => {
    if (s.dur <= L * 1.4) { cands.push({ src: i, start: 0, end: s.dur, score: meanScore(s, 0, s.dur) }); return; }
    const step = Math.max(0.5, L / 3);
    for (let st = Math.min(0.5, s.dur * 0.02); st + L <= s.dur - 0.05; st += step)
      cands.push({ src: i, start: st, end: st + L, score: meanScore(s, st, st + L) });
  });
  const chosen = []; let used = 0;
  const overlaps = c => chosen.some(x => x.src === c.src && c.start < x.end + 0.3 && c.end > x.start - 0.3);
  const near = c => chosen.some(x => x.src === c.src && Math.abs(c.start - x.start) < L * 3);
  const take = c => { chosen.push(c); used += c.end - c.start; };
  const goal = target - L * 0.5;
  const bestPer = sources.map((_, i) => cands.filter(c => c.src === i).sort((a, b) => b.score - a.score)[0])
    .filter(Boolean).sort((a, b) => b.score - a.score);
  for (const c of bestPer) { if (used >= goal) break; take(c); }
  while (used < goal) {
    let best = null, bs = -1;
    for (const c of cands) { if (overlaps(c)) continue; const sc = c.score * (near(c) ? 0.8 : 1); if (sc > bs) { bs = sc; best = c; } }
    if (!best) break; take(best);
  }
  // merge touching pieces from the same clip so cuts look natural
  chosen.sort((a, b) => a.src - b.src || a.start - b.start);
  const merged = [];
  for (const c of chosen) {
    const p = merged[merged.length - 1];
    if (p && p.src === c.src && c.start - p.end < 0.6) p.end = Math.max(p.end, c.end); else merged.push({ src: c.src, start: c.start, end: c.end });
  }
  return merged;
}
function makePlan() {
  const L = S.seg, target = S.target;
  const totalDur = sources.reduce((a, s) => a + s.dur, 0);
  if (totalDur <= target + 5) return sources.map((s, i) => ({ src: i, start: 0, end: s.dur }));
  return S.smart ? smartPlan(L, target) : evenPlan(L, target, totalDur);
}
function rebuildPlan(keepEdits) {
  if (!sources.length) { plan = []; total = 0; captions = []; renderCapList(); return; }
  plan = makePlan();
  total = plan.reduce((a, s) => a + s.end - s.start, 0);
  const totalDur = sources.reduce((a, s) => a + s.dur, 0);
  const usedClips = new Set(plan.map(p => p.src)).size;
  let msg;
  if (totalDur <= S.target + 5) msg = `영상 ${sources.length}개, 총 ${fmt(totalDur)}이라 자르지 않고 이어붙여서 자막만 넣어요.`;
  else msg = `영상 ${sources.length}개 (총 ${fmt(totalDur)}) → ${plan.length}개 장면을 골라 약 ${fmt(total)} 영상으로 만들어요.`;
  if (usedClips < sources.length) msg += ` 움직임이 적은 영상 ${sources.length - usedClips}개는 빠졌어요.`;
  $('#planInfo').textContent = msg;
  fillCaptions(!keepEdits);
}
function outToSrc(t) {
  let acc = 0;
  for (const s of plan) { const L = s.end - s.start; if (t < acc + L) return { src: s.src, t: s.start + (t - acc) }; acc += L; }
  const l = plan[plan.length - 1]; return l ? { src: l.src, t: l.end - 0.05 } : { src: 0, t: 0 };
}

// ---------- drawing ----------
function fontInfo(cap) {
  const id = S.mixFonts && cap && cap.font ? cap.font : S.font[(cap && cap.look && cap.look.style) || S.style];
  return FONTS.find(f => f.id === id) || FONTS[0];
}
// Korean web fonts download in pieces per character, so ask for exactly the characters we'll draw;
// otherwise canvas silently falls back to the phone's default font for missing glyphs.
function ensureFont(waitMs = 4000) {
  const ids = new Set([S.font[S.style], ...(S.mixStyles ? S.styleList.map(x => S.font[x]) : []), ...(S.mixFonts ? S.mixList : [])]);
  const fs = FONTS.filter(f => ids.has(f.id));
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const chars = [...new Set(captions.map(c => c.text).join('') + '태권도 수업 화이팅 0123456789!?')].join('');
  const tagChars = [...new Set([S.tag, titleFor('rope'), titleFor('poomsae'), titleFor('kick'), titleFor('general'), todayLabel()].join(''))].join('');
  return Promise.race([
    Promise.all([...fs.map(f => document.fonts.load(`${f.w} 60px "${f.id}"`, chars)), document.fonts.load('700 40px "Noto Sans KR"', tagChars)]),
    new Promise(r => setTimeout(r, waitMs))
  ]).catch(() => {});
}
// after captions change, fetch any new characters and redraw the preview once they arrive
let fontPending = null;
function warmFonts() { clearTimeout(fontPending); fontPending = setTimeout(() => ensureFont().then(preview), 150); }
function rr(c, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function wrap(c, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean); const lines = []; let cur = '';
  const push = w => {
    if (c.measureText(w).width <= maxW) return w;
    let part = '';
    for (const ch of w) { if (c.measureText(part + ch).width > maxW && part) { lines.push(part); part = ch; } else part += ch; }
    return part;
  };
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (c.measureText(t).width <= maxW) cur = t;
    else { if (cur) lines.push(cur); cur = push(w); }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
const easeBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const todayLabel = () => { const d = new Date(); return `${d.getMonth() + 1}.${d.getDate()} 수업`; };

function drawOverlay(c, W, H, tOut, opts = {}) {
  const U = Math.min(W, H);
  const cur = opts.cap !== undefined ? opts.cap : capAt(tOut);
  const f = fontInfo(cur);
  const local = opts.local != null ? opts.local : (cur ? tOut - cur.t : 0);
  const show = cur ? cur.end - cur.t : 0;
  const cap = (cur && cur.text) || '';

  // top tag
  const tag = S.showTag ? tagText(tOut) : '';
  if (tag) {
    const fs = U * 0.042; c.save(); c.font = `700 ${fs}px "Noto Sans KR"`;
    const tw = c.measureText(tag).width, px = fs * 0.6, x = U * 0.04, y = U * 0.04, h = fs * 1.7;
    c.fillStyle = '#D7263D'; rr(c, x, y, tw + px * 2, h, fs * 0.35); c.fill();
    c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(tag, x + px, y + h / 2 + fs * 0.04); c.restore();
  }
  if (S.showDate) {
    const fs = U * 0.036, txt = todayLabel(); c.save(); c.font = `700 ${fs}px "Noto Sans KR"`;
    const tw = c.measureText(txt).width, px = fs * 0.7, h = fs * 1.8, x = W - U * 0.04 - tw - px * 2, y = U * 0.04;
    c.fillStyle = '#1D9E75'; rr(c, x, y, tw + px * 2, h, h / 2); c.fill();
    c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(txt, x + px, y + h / 2 + fs * 0.04); c.restore();
  }
  if (!cap.trim() || local > show) return;

  const look = (cur && cur.look) || { style: S.style, color: 0, dy: 0, dx: 0, rot: -0.09 };
  const st = look.style, col = PALETTE[st][look.color] || PALETTE[st][0];
  const k = (S.size / 100) * f.k;
  const cy = H * Math.min(94, Math.max(6, S.pos[st] + look.dy)) / 100;
  const cx = W / 2 + W * look.dx;
  const fadeOut = Math.min(1, (show - local) / 0.2);
  c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';

  if (st === 'variety') {
    const fs = U * 0.095 * k; c.font = `${f.w} ${fs}px "${f.id}"`;
    const lines = wrap(c, cap, W * 0.88), lh = fs * 1.18;
    const pop = local < 0.28 ? 1 + 0.4 * (1 - local / 0.28) : 1;
    c.globalAlpha = fadeOut; c.translate(cx, cy); c.scale(pop, pop);
    const y0 = -(lines.length - 1) * lh / 2;
    lines.forEach((l, i) => {
      const y = y0 + i * lh;
      c.lineWidth = fs * 0.24; c.strokeStyle = '#1f1f1f'; c.strokeText(l, 0, y);
      c.fillStyle = col; c.fillText(l, 0, y);
    });
  } else if (st === 'bar') {
    const fs = U * 0.062 * k; c.font = `${f.w} ${fs}px "${f.id}"`;
    const lines = wrap(c, cap, W * 0.82), lh = fs * 1.3;
    const tw = Math.max(...lines.map(l => c.measureText(l).width));
    const pad = fs * 0.7, bh = lines.length * lh + pad * 0.9, bw = tw + pad * 2;
    const a = Math.min(1, local / 0.2) * fadeOut, slide = (1 - Math.min(1, local / 0.2)) * fs * 0.5;
    c.globalAlpha = a; c.translate(cx, cy + slide);
    c.fillStyle = col; rr(c, -bw / 2, -bh / 2, bw, bh, fs * 0.3); c.fill();
    c.fillStyle = '#fff';
    lines.forEach((l, i) => c.fillText(l, 0, -(lines.length - 1) * lh / 2 + i * lh + fs * 0.04));
  } else {
    const fs = U * 0.066 * k; c.font = `${f.w} ${fs}px "${f.id}"`;
    const lines = wrap(c, cap, W * 0.72), lh = fs * 1.25;
    const tw = Math.max(...lines.map(l => c.measureText(l).width));
    const px = fs * 0.85, py = fs * 0.5, bw = tw + px * 2, bh = lines.length * lh + py * 2;
    const sc = local < 0.4 ? Math.max(0.01, easeBack(local / 0.4)) : 1;
    // keep the tilted sticker fully on screen
    const half = bw / 2 + fs * 0.3, sx = Math.min(W - half, Math.max(half, cx));
    c.globalAlpha = fadeOut; c.translate(sx, cy); c.rotate(look.rot); c.scale(sc, sc);
    c.fillStyle = col; rr(c, -bw / 2, -bh / 2, bw, bh, lines.length > 1 ? fs * 0.6 : bh / 2); c.fill();
    c.lineWidth = Math.max(2, U * 0.008); c.strokeStyle = '#1f1f1f'; c.stroke();
    c.fillStyle = '#1f1f1f';
    lines.forEach((l, i) => c.fillText(l, 0, -(lines.length - 1) * lh / 2 + i * lh + fs * 0.04));
  }
  c.restore();
}

function outSize(w, h, maxSide) {
  const s = Math.min(1, maxSide / Math.max(w, h));
  return { W: Math.round(w * s / 2) * 2, H: Math.round(h * s / 2) * 2 };
}

// ---------- preview ----------
let previewT = 1;
function drawVideo(c, W, H) {
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); return; }
  const contain = Math.min(W / vw, H / vh), cover = Math.max(W / vw, H / vh);
  // fill the frame when aspect ratios are close, otherwise letterbox
  const s = cover / contain < 1.12 ? cover : contain;
  const dw = vw * s, dh = vh * s;
  if (s === contain) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
  c.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
}
function computeOut() {
  if (!sources.length) return;
  const portrait = sources.filter(s => s.h > s.w).length;
  const wantPortrait = portrait * 2 > sources.length;
  const pool = sources.filter(s => (s.h > s.w) === wantPortrait);
  const ref = (pool.length ? pool : sources).reduce((a, b) => (b.w * b.h > a.w * a.h ? b : a));
  OUT = outSize(ref.w, ref.h, 1280);
}
function preview() {
  if (busy || analyzing || !video.videoWidth || !sources.length) return;
  const { W, H } = OUT;
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  drawVideo(ctx, W, H);
  const cur = capAt(previewT) || captions.find(c => c.t >= previewT) || captions[captions.length - 1] || null;
  drawOverlay(ctx, W, H, previewT, { local: cur ? Math.min(1.2, (cur.end - cur.t) / 2) : 0, cap: cur });
}
function waitEvt(el, names, ms) {
  return new Promise(res => {
    const done = () => { names.forEach(n => el.removeEventListener(n, done)); clearTimeout(to); res(); };
    const to = setTimeout(done, ms); names.forEach(n => el.addEventListener(n, done));
  });
}
async function useSrc(i) {
  if (curSrc === i && video.readyState >= 2) return;
  curSrc = i;
  video.src = sources[i].url; video.load();
  await waitEvt(video, ['loadedmetadata', 'error'], 15000);
  if (video.readyState < 2) {
    const p = video.play(); if (p) await p.catch(() => {}); video.pause();
    if (video.readyState < 2) await waitEvt(video, ['loadeddata', 'canplay'], 5000);
  }
}
function seekTo(t) {
  return new Promise(res => {
    t = Math.max(0, Math.min(t, (video.duration || 0) - 0.05));
    if (Math.abs(video.currentTime - t) < 0.01 && video.readyState >= 2) return res();
    const done = () => { video.removeEventListener('seeked', done); clearTimeout(to); res(); };
    const to = setTimeout(done, 3000);
    video.addEventListener('seeked', done); video.currentTime = t;
  });
}
let seekQ = Promise.resolve();
function refreshPreview() {
  if (busy || analyzing || !plan.length) return;
  const p = outToSrc(previewT);
  seekQ = seekQ.then(() => useSrc(p.src)).then(() => seekTo(p.t)).then(preview).catch(() => {});
}
function previewAt(i) {
  selCap = i;
  document.querySelectorAll('#caplist .cap').forEach(r => r.classList.toggle('sel', +r.dataset.i === i));
  previewT = captions[i] ? captions[i].t + Math.min(1.2, (captions[i].end - captions[i].t) / 2) : 1;
  refreshPreview();
}

// ---------- loading overlay ----------
// steps: load → motion → model → people → ready. Shown in the middle of the screen so it never looks frozen.
const LOAD_STEPS = [['load', '영상 불러오기'], ['motion', '활동 장면 찾기'], ['model', 'AI 준비'], ['people', '혼자/단체 찾기'], ['ready', '자막 만들기']];
let loaderDepth = 0;
const paint = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
function showLoader() {
  if (loaderDepth++ === 0) {
    $('#loader').classList.remove('hidden');
    $('#loaderSteps').innerHTML = LOAD_STEPS
      .filter(([id]) => (id !== 'motion' || S.smart) && ((id !== 'model' && id !== 'people') || (S.people && !detectorFailed)))
      .map(([id, label]) => `<li data-s="${id}">${label}</li>`).join('');
  }
}
function setLoader(step, text, pct) {
  let passed = true;
  document.querySelectorAll('#loaderSteps li').forEach(li => {
    if (li.dataset.s === step) { li.className = 'now'; passed = false; } else li.className = passed ? 'done' : '';
  });
  $('#loaderText').textContent = text || '';
  const bar = $('#loaderBar');
  bar.classList.toggle('indet', pct == null);
  bar.firstElementChild.style.width = pct == null ? '' : Math.round(Math.min(1, Math.max(0, pct)) * 100) + '%';
}
function hideLoader(force) { loaderDepth = force ? 0 : Math.max(0, loaderDepth - 1); if (!loaderDepth) $('#loader').classList.add('hidden'); }

// ---------- clips ----------
$('#pick').onclick = () => $('#file').click();
$('#add').onclick = () => $('#file').click();
$('#file').onchange = async e => {
  const files = Array.from(e.target.files || []); e.target.value = '';
  if (!files.length || busy || analyzing) return;
  $('#result').classList.add('hidden');
  $('#info').textContent = '영상 불러오는 중…';
  video.muted = true;
  showLoader();
  let bad = 0, n = 0;
  for (const f of files) {
    setLoader('load', `영상 ${++n} / ${files.length} 불러오는 중… 큰 영상은 조금 걸려요`, (n - 1) / files.length); await paint();
    const url = URL.createObjectURL(f);
    const s = { name: f.name, url, dur: 0, w: 0, h: 0, scores: null, dt: 1, cls: guessCls(f.name) || S.defCls };
    sources.push(s);
    try {
      curSrc = -1; await useSrc(sources.length - 1);
      if (!video.duration || !isFinite(video.duration) || !video.videoWidth) throw new Error('bad');
      s.dur = video.duration; s.w = video.videoWidth; s.h = video.videoHeight;
    } catch (err) { sources.pop(); URL.revokeObjectURL(url); bad++; }
  }
  curSrc = -1;
  if (bad) toast(`열 수 없는 영상 ${bad}개는 뺐어요`);
  try { await clipsChanged(); } finally { hideLoader(); }
};
function renderClips() {
  const box = $('#clips');
  $('#pick').classList.toggle('hidden', sources.length > 0);
  $('#add').classList.toggle('hidden', sources.length === 0);
  if (!sources.length) { box.innerHTML = ''; $('#info').textContent = '앨범에서 수업 영상을 골라주세요. 여러 개 한 번에 골라도 돼요.'; return; }
  const totalDur = sources.reduce((a, s) => a + s.dur, 0);
  $('#info').textContent = `영상 ${sources.length}개 · 총 ${fmt(totalDur)} · 순서대로 이어붙여요`;
  box.innerHTML = sources.map((s, i) => `
    <div class="clip" data-i="${i}">
      <span class="no">${i + 1}</span>
      <span class="nm">${s.name.replace(/</g, '&lt;')}</span>
      <span class="du">${fmt(s.dur)}</span>
      <select class="cls" aria-label="수업 종류">${CLASSES.map(c => `<option value="${c.id}"${c.id === s.cls ? ' selected' : ''}>${c.label}</option>`).join('')}</select>
      <button data-a="up" aria-label="위로" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button data-a="down" aria-label="아래로" ${i === sources.length - 1 ? 'disabled' : ''}>↓</button>
      <button data-a="del" aria-label="빼기">✕</button>
    </div>`).join('');
}
$('#clips').addEventListener('change', e => {
  if (!e.target.classList.contains('cls')) return;
  const i = +e.target.closest('.clip').dataset.i; sources[i].cls = e.target.value;
  fillCaptions(false); toast(`${i + 1}번 영상: ${clsLabel(e.target.value)} 자막으로 바꿨어요`);
});
$('#clips').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b || busy || analyzing) return;
  const i = +b.closest('.clip').dataset.i;
  if (b.dataset.a === 'up' && i > 0) [sources[i - 1], sources[i]] = [sources[i], sources[i - 1]];
  if (b.dataset.a === 'down' && i < sources.length - 1) [sources[i + 1], sources[i]] = [sources[i], sources[i + 1]];
  if (b.dataset.a === 'del') { URL.revokeObjectURL(sources[i].url); sources.splice(i, 1); }
  curSrc = -1;
  showLoader();
  try { await clipsChanged(); } finally { hideLoader(); }
});
async function clipsChanged() {
  renderClips();
  if (!sources.length) {
    canvas.classList.add('hidden'); $('#empty').classList.remove('hidden'); $('#make').disabled = true;
    $('#planInfo').textContent = '여러 영상에서 움직임이 많은 장면 위주로 골라 이어붙여요.';
    rebuildPlan(false); return;
  }
  computeOut();
  canvas.classList.remove('hidden'); $('#empty').classList.add('hidden');
  await analyzeAll();
  await detectPeople();
  setLoader('ready', '자막 만들고 미리보기 준비 중…', null); await paint();
  rebuildPlan(false);
  await ensureFont();
  previewT = 1.2; refreshPreview(); await seekQ;
  $('#make').disabled = false;
}

// motion analysis: compare small grayscale frames ~1s apart
async function analyzeAll() {
  if (!S.smart) return;
  const todo = sources.filter(s => !s.scores);
  if (!todo.length) return;
  analyzing = true; $('#make').disabled = true;
  showLoader(); setLoader('motion', '움직임이 많은 장면을 찾는 중…', 0); await paint();
  const totalDur = todo.reduce((a, s) => a + s.dur, 0);
  const dt = Math.max(0.75, totalDur / 400);
  const c = document.createElement('canvas'); const cx = c.getContext('2d', { willReadFrequently: true });
  let doneDur = 0;
  try {
    for (const s of todo) {
      const i = sources.indexOf(s); if (i < 0) continue;
      await useSrc(i);
      c.width = 48; c.height = Math.max(16, Math.round(48 * s.h / s.w));
      const scores = []; let prev = null;
      for (let t = 0.05; t < s.dur; t += dt) {
        await seekTo(t);
        cx.drawImage(video, 0, 0, c.width, c.height);
        let d; try { d = cx.getImageData(0, 0, c.width, c.height).data; } catch (err) { d = null; }
        if (!d) { scores.push(1); continue; }
        const g = new Float32Array(d.length / 4);
        for (let p = 0, q = 0; p < d.length; p += 4, q++) g[q] = d[p] * 0.3 + d[p + 1] * 0.59 + d[p + 2] * 0.11;
        let diff = 0; if (prev) { for (let q = 0; q < g.length; q++) diff += Math.abs(g[q] - prev[q]); diff /= g.length; }
        scores.push(diff); prev = g;
        const pm = Math.min(1, (doneDur + t) / totalDur);
        $('#planInfo').textContent = `활동 장면 찾는 중… ${Math.round(pm * 100)}%`;
        setLoader('motion', `움직임이 많은 장면을 찾는 중… ${Math.round(pm * 100)}%`, pm);
      }
      if (scores.length > 1) scores[0] = scores[1];
      s.scores = scores; s.dt = dt; doneDur += s.dur;
    }
  } finally { analyzing = false; curSrc = -1; hideLoader(); }
}

// ---------- solo / group detection (on-device person detector, bundled with the app) ----------
let detector = null, detectorFailed = false;
function addScript(src) {
  return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.onload = res; el.onerror = rej; document.head.appendChild(el); });
}
async function loadDetector() {
  if (detector || detectorFailed) return detector;
  try {
    if (!window.tf) await addScript('lib/tf.min.js');
    if (!window.cocoSsd) await addScript('lib/coco-ssd.min.js');
    // download the weights ourselves first so we can show real progress; cocoSsd then reads them from cache
    try {
      const mj = await (await fetch('models/coco-ssd/model.json')).json();
      const paths = mj.weightsManifest.flatMap(g => g.paths);
      let got = 0; const total = 18e6;
      for (const p of paths) {
        const res = await fetch('models/coco-ssd/' + p);
        if (res.body && res.body.getReader) {
          const rd = res.body.getReader();
          for (;;) { const { done, value } = await rd.read(); if (done) break; got += value.length; setLoader('model', `AI 모델 받는 중… ${(got / 1e6).toFixed(1)} / 18MB (처음 한 번만)`, got / total); }
        } else { got += (await res.arrayBuffer()).byteLength; setLoader('model', `AI 모델 받는 중… ${(got / 1e6).toFixed(1)} / 18MB (처음 한 번만)`, got / total); }
      }
    } catch (e) {}
    setLoader('model', 'AI 준비 중…', null); await paint();
    detector = await cocoSsd.load({ modelUrl: 'models/coco-ssd/model.json' });
  } catch (e) { console.error(e); detectorFailed = true; detector = null; }
  return detector;
}
// one frame → 'solo' (one kid clearly the focus), 'group' (3+ similar-size people) or null (can't tell)
// only people close to the biggest one count as "on stage"; small kids far behind are ignored
function frameLabel(preds, frameH) {
  const P = preds.filter(p => p.class === 'person' && p.score >= 0.5).map(p => p.bbox[3] / frameH).sort((a, b) => b - a);
  if (!P.length) return null;
  const main = P.filter(h => h >= P[0] * 0.65).length;
  if (main === 1 && P[0] >= 0.18) return 'solo';
  if (main >= 2 || P.length >= 3) return 'group';
  return null;
}
async function detectPeople() {
  if (!S.people) return;
  const todo = sources.filter(s => !s.people);
  if (!todo.length) return;
  analyzing = true; $('#make').disabled = true;
  showLoader();
  $('#planInfo').textContent = '혼자/단체 장면 찾는 중… (처음엔 AI 모델을 받느라 조금 걸려요)';
  setLoader('model', 'AI 준비 중…', null); await paint();
  const det = await loadDetector();
  if (!det) {
    analyzing = false; hideLoader();
    toast(location.protocol === 'file:' ? '파일로 열어서 혼자/단체 감지가 꺼졌어요' : '혼자/단체 감지를 못 했어요. 자막 옆 버튼으로 직접 바꿀 수 있어요');
    todo.forEach(s => s.people = []); return;
  }
  const c = document.createElement('canvas'); const cx = c.getContext('2d');
  const totalDur = todo.reduce((a, s) => a + s.dur, 0); let doneDur = 0;
  try {
    for (const s of todo) {
      const i = sources.indexOf(s); if (i < 0) continue;
      await useSrc(i);
      c.width = 320; c.height = Math.round(320 * s.h / s.w);
      const dt = Math.max(1.5, s.dur / 40), people = [];
      for (let t = Math.min(0.5, s.dur / 2); t < s.dur; t += dt) {
        await seekTo(t);
        cx.drawImage(video, 0, 0, c.width, c.height);
        let label = null;
        try { label = frameLabel(await det.detect(c, 20, 0.4), c.height); } catch (e) {}
        people.push({ t, label });
        const pp = Math.min(1, (doneDur + t) / totalDur);
        $('#planInfo').textContent = `혼자/단체 장면 찾는 중… ${Math.round(pp * 100)}%`;
        setLoader('people', `한 명인지 여럿인지 보는 중… ${Math.round(pp * 100)}%`, pp);
      }
      s.people = people; doneDur += s.dur;
    }
  } finally { analyzing = false; curSrc = -1; hideLoader(); }
}

// ---------- audio / music ----------
let actx = null, srcNode = null, audDest = null, origGain = null, musicGain = null, musicBuf = null, musicName = '';
let musicNodes = [];
function setupAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    if (!actx) {
      actx = new AC();
      audDest = actx.createMediaStreamDestination();
      srcNode = actx.createMediaElementSource(video);
      origGain = actx.createGain(); musicGain = actx.createGain();
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.2;
      const master = actx.createGain(); master.gain.value = 0.9;
      srcNode.connect(origGain).connect(comp);
      musicGain.connect(comp);
      comp.connect(master).connect(audDest);
    }
    actx.resume && actx.resume();
    return audDest.stream.getAudioTracks()[0] || null;
  } catch (e) { return null; }
}
$('#musicFile').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const tmp = actx || new AC();
    const ab = await f.arrayBuffer();
    musicBuf = await new Promise((res, rej) => { const p = tmp.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    musicName = f.name; S.music = 'file'; save(); syncMusic(); toast('음악을 넣었어요');
  } catch (err) { toast('이 음악 파일은 열 수 없어요'); }
};
$('#musics').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  if (b.dataset.v === 'file') { $('#musicFile').click(); return; }
  S.music = b.dataset.v; save(); syncMusic();
});
$('#musicVol').addEventListener('input', e => { S.musicVol = +e.target.value; save(); syncMusic(); });
$('#origVol').addEventListener('input', e => { S.origVol = +e.target.value; save(); syncMusic(); });
function syncMusic() {
  if (S.music === 'file' && !musicBuf) S.music = 'beat';
  document.querySelectorAll('#musics .chip').forEach(b => b.classList.toggle('on', b.dataset.v === S.music));
  $('#musicFileName').textContent = S.music === 'file' && musicName ? '♪ ' + musicName : '';
  $('#musicVolRow').classList.toggle('hidden', S.music === 'none');
  $('#musicVol').value = S.musicVol; $('#musicVolV').textContent = S.musicVol + '%';
  $('#origVol').value = S.origVol; $('#origVolV').textContent = S.origVol + '%';
}

// original upbeat loop, synthesized live (no copyright issues)
function startBeat(t0, dur) {
  const bpm = 124, b = 60 / bpm, bar = b * 4;
  const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am F C G
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const out = actx.createGain(); out.gain.value = 0.5; out.connect(musicGain); musicNodes.push(out);
  const noise = actx.createBuffer(1, actx.sampleRate * 0.3, actx.sampleRate);
  const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const env = (node, t, a, peak, d) => { node.gain.setValueAtTime(0.0001, t); node.gain.exponentialRampToValueAtTime(peak, t + a); node.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const kick = t => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); env(g, t, 0.003, 0.9, 0.25); o.connect(g).connect(out); o.start(t); o.stop(t + 0.3); };
  const hat = (t, v) => { const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain(); s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7000; env(g, t, 0.002, v, 0.04); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + 0.08); };
  const clap = t => { const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain(); s.buffer = noise; f.type = 'bandpass'; f.frequency.value = 1500; env(g, t, 0.003, 0.5, 0.14); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + 0.2); };
  const tone = (t, m, d, v, type) => { const o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter(); o.type = type; o.frequency.value = hz(m); f.type = 'lowpass'; f.frequency.value = 2200; env(g, t, 0.01, v, d); o.connect(f).connect(g).connect(out); o.start(t); o.stop(t + d + 0.05); };
  const bars = Math.ceil(dur / bar) + 1;
  // schedule in chunks to keep node count low
  let k = 0;
  const sched = () => {
    const until = actx.currentTime + 6;
    for (; k < bars && t0 + k * bar < until; k++) {
      const t = t0 + k * bar, ch = chords[k % 4];
      for (let q = 0; q < 4; q++) { kick(t + q * b); hat(t + q * b + b / 2, 0.25); hat(t + q * b + b / 4, 0.08); }
      clap(t + b); clap(t + 3 * b);
      for (let q = 0; q < 8; q++) tone(t + q * b / 2, ch[0] - 24 + (q % 2 ? 12 : 0), b / 2 * 0.8, 0.28, 'triangle');
      [0, 1.5, 2.5, 3].forEach(p => ch.forEach(m => tone(t + p * b, m + 12, b * 0.4, 0.07, 'square')));
    }
    if (k < bars) beatTimer = setTimeout(sched, 2000);
  };
  sched();
}
let beatTimer = null;
function startMusic(dur) {
  stopMusic();
  if (!actx || S.music === 'none') return;
  const t0 = actx.currentTime + 0.05, v = S.musicVol / 100;
  musicGain.gain.cancelScheduledValues(0);
  musicGain.gain.setValueAtTime(0.0001, t0);
  musicGain.gain.linearRampToValueAtTime(v, t0 + 0.8);
  musicGain.gain.setValueAtTime(v, Math.max(t0 + 0.9, t0 + dur - 2.5));
  musicGain.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  if (S.music === 'file' && musicBuf) {
    const s = actx.createBufferSource(); s.buffer = musicBuf; s.loop = true; s.connect(musicGain); s.start(t0); musicNodes.push(s);
  } else startBeat(t0, dur);
}
function stopMusic() {
  clearTimeout(beatTimer);
  musicNodes.forEach(n => { try { n.stop ? n.stop() : 0; } catch (e) {} try { n.disconnect(); } catch (e) {} });
  musicNodes = [];
}

// ---------- render ----------
function pickMime() {
  const list = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  if (!window.MediaRecorder) return null;
  return list.find(t => { try { return MediaRecorder.isTypeSupported(t); } catch (e) { return false; } }) || '';
}
function setProg(done) {
  const p = Math.min(1, done / total);
  $('#progBar').style.width = (p * 100).toFixed(1) + '%';
  $('#progText').textContent = `만드는 중… ${Math.round(p * 100)}% (${fmt(done)} / ${fmt(total)})`;
}

$('#make').onclick = async () => {
  if (busy || analyzing || !plan.length) return;
  S.names = $('#names').value; refreshNames();
  const mime = pickMime();
  if (mime === null || !canvas.captureStream) { alert('이 브라우저는 영상 저장을 지원하지 않아요. iOS 15 이상 사파리에서 열어주세요.'); return; }

  // must happen synchronously inside the tap (iOS)
  const wantAudio = S.origVol > 0 || S.music !== 'none';
  const audioTrack = wantAudio ? setupAudio() : null;
  if (origGain) origGain.gain.value = S.origVol / 100;
  video.muted = !audioTrack;
  const unlock = video.play().then(() => video.pause()).catch(() => {});

  busy = true; cancelled = false;
  $('#make').disabled = true; $('#progWrap').classList.remove('hidden'); $('#result').classList.add('hidden');
  let wake = null; try { wake = await navigator.wakeLock?.request('screen'); } catch (e) {}
  canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });

  try {
    await unlock; await ensureFont(10000);
    const { W, H } = OUT;
    canvas.width = W; canvas.height = H;
    const stream = canvas.captureStream(30);
    if (audioTrack) stream.addTrack(audioTrack);
    const rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), videoBitsPerSecond: 5000000, audioBitsPerSecond: 128000 });
    const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise(r => rec.onstop = r);

    let offset = 0;
    await useSrc(plan[0].src); await seekTo(plan[0].start);
    drawVideo(ctx, W, H); drawOverlay(ctx, W, H, 0);
    if (actx) startMusic(total);
    // the recorder (and music clock) only run while a segment is really playing,
    // so seeking and the start-up delay of play() never end up in the video as frozen frames
    holdRecording(rec);
    for (let i = 0; i < plan.length && !cancelled; i++) {
      const seg = plan[i];
      if (i > 0) {
        await useSrc(seg.src); await seekTo(seg.start);
        drawVideo(ctx, W, H); drawOverlay(ctx, W, H, offset);
      }
      await playSegment(seg, offset, W, H, rec);
      holdRecording(rec);
      offset += seg.end - seg.start;
    }
    video.pause();
    if (rec.state === 'inactive') { rec.start(); }
    rec.stop(); await stopped;
    stopMusic();
    if (cancelled) { toast('취소했어요'); return; }

    const type = (chunks[0] && chunks[0].type) || mime || 'video/mp4';
    outBlob = new Blob(chunks, { type: type.split(';')[0] });
    if (outURL) URL.revokeObjectURL(outURL);
    outURL = URL.createObjectURL(outBlob);
    $('#out').src = outURL;
    $('#result').classList.remove('hidden');
    $('#result').scrollIntoView({ behavior: 'smooth' });
    toast('완성!');
  } catch (err) {
    console.error(err);
    alert('만드는 중 문제가 생겼어요: ' + (err && err.message || err));
  } finally {
    busy = false; video.pause(); video.muted = true; stopMusic();
    try { wake && wake.release(); } catch (e) {}
    $('#make').disabled = false; $('#progWrap').classList.add('hidden');
    refreshPreview();
  }
};
$('#cancel').onclick = () => { cancelled = true; video.pause(); };

// pause/resume must be synchronous: awaiting the audio clock here let whole scenes slip past unrecorded
function holdRecording(rec) {
  if (rec.state === 'recording' && rec.pause) try { rec.pause(); } catch (e) {}
  if (actx && actx.state === 'running' && actx.suspend) actx.suspend().catch(() => {});
}
function releaseRecording(rec) {
  if (rec.state === 'inactive') rec.start(1000);      // first real frame of the first scene
  else if (rec.state === 'paused') try { rec.resume(); } catch (e) {}
}
// draw on every new decoded video frame (requestVideoFrameCallback) instead of on screen refresh,
// falling back to requestAnimationFrame where it isn't supported
const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
function playSegment(seg, offset, W, H, rec) {
  return new Promise((resolve, reject) => {
    let finished = false, started = false, lastT = -1, stall = 0;
    const end = () => { if (finished) return; finished = true; video.pause(); resolve(); };
    const draw = () => {
      const t = video.currentTime;
      const tOut = offset + Math.max(0, t - seg.start);
      drawVideo(ctx, W, H);
      drawOverlay(ctx, W, H, tOut);
      setProg(tOut);
      return t;
    };
    const tick = () => {
      if (finished) return;
      if (cancelled) return end();
      const t = draw();
      if (!started) { started = true; releaseRecording(rec); }
      if (t >= seg.end - 0.02 || video.ended) return end();
      if (t === lastT) { if (++stall > 300) return end(); } else { stall = 0; lastT = t; }
      next();
    };
    const next = () => hasRVFC ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    // safety net for stalls: frame callbacks stop firing when playback stops, so watch the clock too
    let lastSeen = -1, still = 0;
    const guard = setInterval(() => {
      if (finished) return clearInterval(guard);
      const t = video.currentTime;
      if (!started && t > seg.start + 0.05) { started = true; releaseRecording(rec); }
      if (video.ended || t >= seg.end - 0.02) { draw(); clearInterval(guard); return end(); }
      if (t === lastSeen) { if (++still >= 10) { clearInterval(guard); return end(); } } else { still = 0; lastSeen = t; }
    }, 500);
    const resumeAudio = actx && actx.state !== 'running' ? actx.resume().catch(() => {}) : Promise.resolve();
    resumeAudio.then(() => video.play())
      .catch(() => { video.muted = true; return video.play(); })
      .then(() => next()).catch(err => { clearInterval(guard); reject(err); });
  });
}

// ---------- save ----------
$('#save').onclick = async () => {
  if (!outBlob) return;
  const ext = outBlob.type.includes('webm') ? 'webm' : 'mp4';
  const d = new Date();
  const name = `태권도_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.${ext}`;
  const file = new File([outBlob], name, { type: outBlob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = outURL; a.download = name; document.body.appendChild(a); a.click(); a.remove();
};

// ---------- init ----------
buildFontChips(); syncUI(); syncMusic(); renderClips();
$('#ver').textContent = 'v' + APP_VERSION;
if (location.protocol === 'file:') $('#fileWarn').classList.remove('hidden');
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
  // a newer version just took over: reload once, but only if nothing is loaded yet
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded || sources.length || busy) return; reloaded = true; location.reload();
  });
}

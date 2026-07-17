import React, { useState, useMemo } from 'react';
import { Shuffle, RotateCcw, Trophy, Skull } from 'lucide-react';

const PUZZLE = {
  title: 'Tangled Words',
  subtitle: 'Four hidden categories. Sixteen tempting words. Two of them are wearing disguises.',
  groups: [
    {
      id: 'whiskey',
      label: 'Whiskey varieties',
      tone: 'amber',
      words: ['BOURBON', 'RYE', 'SCOTCH', 'IRISH'],
    },
    {
      id: 'bread',
      label: 'Types of bread',
      tone: 'wheat',
      words: ['NAAN', 'PITA', 'WHEAT', 'BAGEL'],
    },
    {
      id: 'tape',
      label: '___ tape',
      tone: 'sage',
      words: ['MASKING', 'DUCT', 'WASHI', 'ELECTRICAL'],
    },
    {
      id: 'scottish',
      label: 'Iconic Scottish things',
      tone: 'plum',
      words: ['TARTAN', 'KILT', 'BAGPIPE', 'LOCH'],
    },
  ],
};

const TONE = {
  amber: {
    solved: 'bg-amber-200/80 border-amber-700/40 text-amber-950',
    chip: 'bg-amber-700',
  },
  wheat: {
    solved: 'bg-orange-200/70 border-orange-700/40 text-orange-950',
    chip: 'bg-orange-700',
  },
  sage: {
    solved: 'bg-emerald-200/70 border-emerald-800/40 text-emerald-950',
    chip: 'bg-emerald-800',
  },
  plum: {
    solved: 'bg-purple-200/70 border-purple-800/40 text-purple-950',
    chip: 'bg-purple-800',
  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TangledWords() {
  const allWords = useMemo(
    () =>
      PUZZLE.groups.flatMap((g) =>
        g.words.map((w) => ({ word: w, groupId: g.id }))
      ),
    []
  );

  const [board, setBoard] = useState(() => shuffle(allWords));
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null); // 'wrong' | 'oneaway' | null
  const [won, setWon] = useState(false);

  const MAX_MISTAKES = 4;
  const lost = mistakes >= MAX_MISTAKES && !won;
  const groupById = (id) => PUZZLE.groups.find((g) => g.id === id);

  function isSolved(word) {
    return solved.some((g) => g.words.includes(word));
  }

  function toggle(item) {
    if (won || lost) return;
    if (isSolved(item.word)) return;
    const exists = selected.find((s) => s.word === item.word);
    if (exists) {
      setSelected(selected.filter((s) => s.word !== item.word));
    } else if (selected.length < 4) {
      setSelected([...selected, item]);
    }
  }

  function submit() {
    if (selected.length !== 4 || won || lost) return;
    const groupIds = selected.map((s) => s.groupId);
    const allSame = groupIds.every((g) => g === groupIds[0]);

    if (allSame) {
      const group = groupById(groupIds[0]);
      const newSolved = [...solved, group];
      setSolved(newSolved);
      setBoard(board.filter((b) => !selected.find((s) => s.word === b.word)));
      setSelected([]);
      if (newSolved.length === 4) setWon(true);
    } else {
      const counts = groupIds.reduce(
        (acc, g) => ({ ...acc, [g]: (acc[g] || 0) + 1 }),
        {}
      );
      const max = Math.max(...Object.values(counts));
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setMistakes((m) => m + 1);
      setFlash(max === 3 ? 'oneaway' : 'wrong');
      setTimeout(() => setFlash(null), 1600);
    }
  }

  function reshuffle() {
    setBoard(shuffle(board));
    setSelected([]);
  }

  function deselect() {
    setSelected([]);
  }

  function reset() {
    setBoard(shuffle(allWords));
    setSelected([]);
    setSolved([]);
    setMistakes(0);
    setWon(false);
  }

  // For game-end reveal, expose un-solved groups in order
  const unsolvedGroups = PUZZLE.groups.filter(
    (g) => !solved.find((s) => s.id === g.id)
  );

  return (
    <div
      className="min-h-screen w-full font-serif"
      style={{
        background:
          'radial-gradient(ellipse at top, #f6efe1 0%, #ece1c8 55%, #d9c9a3 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* paper grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(120,80,30,0.08) 0px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(120,80,30,0.06) 0px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(120,80,30,0.05) 0px, transparent 2px)',
          backgroundSize: '7px 7px, 11px 11px, 13px 13px',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-5 py-10 sm:py-14">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block">
            <div className="text-[0.7rem] tracking-[0.4em] uppercase text-stone-600 mb-3">
              A Word Puzzle · Volume I
            </div>
            <h1
              className="text-5xl sm:text-6xl text-stone-900 leading-none"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {PUZZLE.title}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-12 bg-stone-700/40" />
              <div className="text-stone-700 italic text-sm">
                untangle the four
              </div>
              <div className="h-px w-12 bg-stone-700/40" />
            </div>
          </div>
          <p className="mt-5 text-stone-700 text-[0.95rem] max-w-md mx-auto leading-relaxed italic">
            {PUZZLE.subtitle}
          </p>
        </header>

        {/* Solved banners */}
        {solved.length > 0 && (
          <div className="space-y-2 mb-3">
            {solved.map((g) => (
              <div
                key={g.id}
                className={`rounded-md border-2 px-4 py-3 ${TONE[g.tone].solved} flex items-center gap-3`}
                style={{
                  animation: 'slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${TONE[g.tone].chip}`}
                />
                <span className="font-semibold tracking-wide text-sm uppercase">
                  {g.label}
                </span>
                <span className="ml-auto text-xs tracking-wider opacity-80">
                  {g.words.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Game-end reveal of remaining groups */}
        {(won || lost) && unsolvedGroups.length > 0 && (
          <div className="space-y-2 mb-3 opacity-70">
            {unsolvedGroups.map((g) => (
              <div
                key={g.id}
                className={`rounded-md border-2 px-4 py-3 ${TONE[g.tone].solved} flex items-center gap-3`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${TONE[g.tone].chip}`}
                />
                <span className="font-semibold tracking-wide text-sm uppercase">
                  {g.label}
                </span>
                <span className="ml-auto text-xs tracking-wider opacity-80">
                  {g.words.join(' · ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Board */}
        <div
          className={`grid grid-cols-4 gap-2 sm:gap-3 mb-5 ${shake ? 'animate-shake' : ''}`}
          style={{
            animation: shake ? 'shake 0.55s' : 'none',
          }}
        >
          {board.map((item) => {
            const isSel = selected.find((s) => s.word === item.word);
            return (
              <button
                key={item.word}
                onClick={() => toggle(item)}
                disabled={won || lost}
                className={`
                  aspect-[5/4] rounded-md border-2 flex items-center justify-center
                  px-1 text-center font-bold tracking-tight
                  text-[0.72rem] sm:text-sm select-none
                  transition-all duration-150
                  ${
                    isSel
                      ? 'bg-stone-800 border-stone-900 text-amber-50 scale-[0.96] shadow-inner'
                      : 'bg-stone-100/80 border-stone-400/60 text-stone-900 hover:bg-stone-200 hover:border-stone-500 hover:scale-[1.02] active:scale-[0.97]'
                  }
                  ${won || lost ? 'cursor-default opacity-60' : 'cursor-pointer'}
                `}
                style={{
                  fontFamily:
                    '"Helvetica Neue", "Arial", sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                {item.word}
              </button>
            );
          })}
        </div>

        {/* Status line */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.25em] uppercase text-stone-600">
              Mistakes
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < mistakes
                      ? 'bg-stone-800'
                      : 'bg-stone-400/40 border border-stone-500/40'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs tracking-[0.25em] uppercase text-stone-600">
            {solved.length} / 4 solved
          </div>
        </div>

        {/* Flash messages */}
        <div className="h-7 mb-2 text-center">
          {flash === 'oneaway' && (
            <div className="inline-block px-3 py-1 rounded-full bg-stone-800 text-amber-50 text-xs tracking-widest uppercase">
              One away…
            </div>
          )}
          {flash === 'wrong' && (
            <div className="inline-block px-3 py-1 rounded-full bg-red-900/80 text-red-50 text-xs tracking-widest uppercase">
              Not quite
            </div>
          )}
          {won && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800 text-emerald-50 text-sm tracking-wide">
              <Trophy size={14} />
              <span>
                Solved with {mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}
              </span>
            </div>
          )}
          {lost && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-stone-100 text-sm tracking-wide">
              <Skull size={14} />
              <span>Tangled. Better luck next round.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!won && !lost && (
            <>
              <button
                onClick={reshuffle}
                className="px-4 py-2 rounded-full border-2 border-stone-700/50 text-stone-800 text-xs uppercase tracking-widest hover:bg-stone-800 hover:text-amber-50 hover:border-stone-800 transition-colors flex items-center gap-2"
              >
                <Shuffle size={13} />
                Shuffle
              </button>
              <button
                onClick={deselect}
                disabled={selected.length === 0}
                className="px-4 py-2 rounded-full border-2 border-stone-700/50 text-stone-800 text-xs uppercase tracking-widest hover:bg-stone-800 hover:text-amber-50 hover:border-stone-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-800"
              >
                Deselect all
              </button>
              <button
                onClick={submit}
                disabled={selected.length !== 4}
                className="px-6 py-2 rounded-full bg-stone-900 text-amber-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </>
          )}
          {(won || lost) && (
            <button
              onClick={reset}
              className="px-6 py-2 rounded-full bg-stone-900 text-amber-50 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={13} />
              Play again
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-stone-700/30" />
            <span className="text-[0.65rem] tracking-[0.4em] uppercase text-stone-600">
              Built for Kyle · A Claude Original
            </span>
            <div className="h-px w-8 bg-stone-700/30" />
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(7px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(1px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

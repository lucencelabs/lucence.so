import { ACCENT, INK, InkFilter } from './InkDefs';

// A phone mid-call, its voice turning into checked-off actions on a clipboard.
export const VoiceSketch = () => {
  const bars = [10, 22, 34, 18, 40, 26, 14];
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="img" aria-label="A phone call turning into completed tasks">
      <InkFilter id="ink-voice" seed={7} />
      <g filter="url(#ink-voice)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* phone */}
        <rect x="78" y="46" width="92" height="170" rx="16" />
        <rect x="88" y="60" width="72" height="140" rx="6" strokeWidth="1.6" />
        <rect x="111" y="52" width="26" height="5" rx="2.5" fill={INK} />
        {/* caller dot */}
        <circle cx="124" cy="86" r="9" fill={INK} />
        <path d="M108 104 h32" strokeWidth="1.6" />
        {/* hang-up button */}
        <circle cx="124" cy="182" r="8" fill={INK} />

        {/* voice line out of the phone */}
        <path className="ink-flow" d="M172 132 C 205 112, 218 150, 248 128" strokeDasharray="3 7" strokeWidth="2" />

        {/* clipboard */}
        <rect x="252" y="62" width="96" height="140" rx="6" />
        <rect x="280" y="54" width="40" height="16" rx="4" fill={INK} />
        {[96, 128, 160].map((y) => (
          <g key={y}>
            <rect x="266" y={y - 9} width="16" height="16" rx="2" strokeWidth="2" />
            <path d={`M292 ${y} h42`} strokeWidth="1.8" />
          </g>
        ))}

        {/* scratchy ground shadows */}
        <path d="M72 226 l12 -3 M92 228 l16 -2 M150 227 l18 -3" strokeWidth="1.4" />
        <path d="M250 212 l14 -2 M300 213 l18 -3 M330 212 l10 -2" strokeWidth="1.4" />
      </g>

      {/* live waveform on the phone screen */}
      <g fill={ACCENT}>
        {bars.map((h, i) => (
          <rect
            key={i}
            className="ink-bar"
            style={{ animationDelay: `${i * 0.12}s` }}
            x={98 + i * 8.4}
            y={150 - h / 2}
            width="4.6"
            height={h}
            rx="2.3"
          />
        ))}
      </g>

      {/* checks, drawn in one after another */}
      <g filter="url(#ink-voice)" fill="none" stroke={ACCENT} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {[96, 128, 160].map((y, i) => (
          <path
            key={y}
            className="ink-check"
            style={{ animationDelay: `${i * 0.6}s` }}
            d={`M268 ${y - 1} l5 6 l12 -15`}
            pathLength={1}
          />
        ))}
      </g>
    </svg>
  );
};

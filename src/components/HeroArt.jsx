// Original superhero-flavored SVG art (no copyrighted characters).
// Used as built-in visuals; real photos in /public override them automatically.

export function CityBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0f16" />
          <stop offset="0.45" stopColor="#12101f" />
          <stop offset="1" stopColor="#080a14" />
        </linearGradient>
        <radialGradient id="heroGlowRed" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#d4342a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#d4342a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heroGlowGold" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e8b341" stopOpacity="0.65" />
          <stop offset="1" stopColor="#e8b341" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#heroSky)" />
      <circle cx="1150" cy="240" r="430" fill="url(#heroGlowRed)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="190" r="370" fill="url(#heroGlowGold)">
        <animate attributeName="opacity" values="1;0.6;1" dur="12s" repeatCount="indefinite" />
      </circle>
      {/* skyline */}
      <path
        d="M0 780 h55 v-150 h48 v65 h66 v-230 h38 v85 h58 v150 h86 v-270 h52 v95 h62 v175 h76 v-125 h44 v-85 h58 v215 h96 v-165 h48 v62 h66 v-245 h44 v135 h58 v112 h90 v-185 h48 v185 h86 v-95 h52 v95 h113 V900 H0 Z"
        fill="#04060d"
      />
      {/* lit windows */}
      <g fill="#e8b341">
        <rect x="120" y="680" width="7" height="10" opacity="0.55" />
        <rect x="138" y="700" width="7" height="10" opacity="0.3" />
        <rect x="230" y="600" width="7" height="10" opacity="0.5" />
        <rect x="248" y="630" width="7" height="10" opacity="0.35" />
        <rect x="380" y="560" width="7" height="10" opacity="0.55" />
        <rect x="398" y="590" width="7" height="10" opacity="0.3" />
        <rect x="416" y="620" width="7" height="10" opacity="0.45" />
        <rect x="560" y="640" width="7" height="10" opacity="0.5" />
        <rect x="640" y="580" width="7" height="10" opacity="0.35" />
        <rect x="658" y="610" width="7" height="10" opacity="0.55" />
        <rect x="800" y="640" width="7" height="10" opacity="0.4" />
        <rect x="900" y="560" width="7" height="10" opacity="0.55" />
        <rect x="918" y="590" width="7" height="10" opacity="0.3" />
        <rect x="1050" y="620" width="7" height="10" opacity="0.5" />
        <rect x="1160" y="580" width="7" height="10" opacity="0.4" />
        <rect x="1250" y="660" width="7" height="10" opacity="0.55" />
        <rect x="1340" y="700" width="7" height="10" opacity="0.35" />
      </g>
    </svg>
  )
}

const bannerCls = 'absolute inset-0 w-full h-full'

export function ArtToday() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="tdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c0b10" />
          <stop offset="1" stopColor="#3a0f12" />
        </linearGradient>
        <radialGradient id="tdSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd76a" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#e8b341" stopOpacity="0.5" />
          <stop offset="1" stopColor="#d4342a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="300" fill="url(#tdSky)" />
      <g opacity="0.22">
        {Array.from({ length: 13 }).map((_, i) => (
          <rect
            key={i}
            x="397"
            y="-60"
            width="6"
            height="420"
            fill="#e8b341"
            transform={`rotate(${i * 15 - 90} 400 330)`}
          />
        ))}
      </g>
      <circle cx="400" cy="330" r="190" fill="url(#tdSun)">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="6s" repeatCount="indefinite" />
      </circle>
      <path
        d="M0 262 h70 v-52 h48 v22 h58 v-72 h40 v40 h62 v62 h84 v-92 h48 v34 h62 v58 h86 v-46 h44 v-30 h56 v76 h142 V300 H0 Z"
        fill="#120609"
      />
    </svg>
  )
}

export function ArtJava() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="jvBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#160a0d" />
          <stop offset="1" stopColor="#26090b" />
        </linearGradient>
        <linearGradient id="jvRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8b341" />
          <stop offset="1" stopColor="#d4342a" />
        </linearGradient>
        <radialGradient id="jvCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3d0" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#e8b341" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e8b341" stopOpacity="0" />
        </radialGradient>
        <filter id="jvBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#jvBg)" />
      <circle cx="560" cy="150" r="96" fill="none" stroke="url(#jvRing)" strokeWidth="6" opacity="0.5" filter="url(#jvBlur)" />
      <circle cx="560" cy="150" r="96" fill="none" stroke="url(#jvRing)" strokeWidth="10" strokeDasharray="500 104">
        <animateTransform attributeName="transform" type="rotate" from="0 560 150" to="360 560 150" dur="14s" repeatCount="indefinite" />
      </circle>
      <circle cx="560" cy="150" r="52" fill="url(#jvCore)">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* coffee silhouette */}
      <g transform="translate(150 96) scale(2.1)" fill="#0d0507">
        <path d="M18 24h22v14a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9V24z" stroke="#e8b341" strokeWidth="1.6" />
        <path d="M40 27h4a5 5 0 0 1 0 10h-4v-4h4a1 1 0 0 0 0-2h-4v-4z" stroke="#e8b341" strokeWidth="1.6" />
        <path d="M24 14c0 3 3 3 3 6M31 14c0 3 3 3 3 6" stroke="#e8b341" strokeWidth="2" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  )
}

export function ArtStats() {
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="stBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07130a" />
          <stop offset="1" stopColor="#0d2211" />
        </linearGradient>
        <filter id="stGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#stBg)" />
      <g stroke="#7ed957" strokeWidth="4" fill="none" strokeLinejoin="round">
        <polyline points="120,10 165,110 130,115 200,240" opacity="0.9" filter="url(#stGlow)">
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="4s" repeatCount="indefinite" />
        </polyline>
        <polyline points="620,0 585,95 625,100 545,235" opacity="0.7" filter="url(#stGlow)">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="5s" repeatCount="indefinite" />
        </polyline>
      </g>
      <g fill="#0a2a13" stroke="#2e7d32" strokeWidth="2">
        <rect x="280" y="170" width="44" height="130" rx="6" />
        <rect x="340" y="130" width="44" height="170" rx="6" />
        <rect x="400" y="90" width="44" height="210" rx="6" />
        <rect x="460" y="150" width="44" height="150" rx="6" />
      </g>
      <g fill="#7ed957">
        <rect x="280" y="170" width="44" height="8" rx="4" />
        <rect x="340" y="130" width="44" height="8" rx="4" />
        <rect x="400" y="90" width="44" height="8" rx="4" />
        <rect x="460" y="150" width="44" height="8" rx="4" />
      </g>
    </svg>
  )
}

export function ArtHabits() {
  const orbs = ['#4fa9f5', '#d4342a', '#7e57c2', '#e65100', '#2e7d32', '#e8b341']
  return (
    <svg className={bannerCls} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hbBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0e0818" />
          <stop offset="1" stopColor="#1d0f30" />
        </linearGradient>
        <filter id="hbBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="hbOrb" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="800" height="300" fill="url(#hbBg)" />
      <circle cx="170" cy="80" r="90" fill="#7e57c2" opacity="0.5" filter="url(#hbBlur)">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="220" r="110" fill="#3b1f66" opacity="0.7" filter="url(#hbBlur)" />
      <g opacity="0.8" fill="#cbb6ff">
        <circle cx="90" cy="200" r="2" />
        <circle cx="250" cy="40" r="1.6" />
        <circle cx="380" cy="70" r="2.2" />
        <circle cx="520" cy="30" r="1.5" />
        <circle cx="700" cy="90" r="2" />
        <circle cx="750" cy="40" r="1.4" />
      </g>
      {orbs.map((c, i) => (
        <g key={c} transform={`translate(${215 + i * 75} 190)`}>
          <circle r="17" fill={c} opacity="0.55" filter="url(#hbOrb)">
            <animate attributeName="opacity" values="0.4;0.85;0.4" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle r="10" fill={c} />
          <circle r="4" cx="-3" cy="-3" fill="#ffffff" opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}

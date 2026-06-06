import React from 'react';

const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

export const DashboardIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"]} />
);

export const TransactionIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M20 12V22H4V12", "M22 7H2v5h20V7z", "M12 22V7", "M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z", "M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"]} />
);

export const BudgetIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z", "M12 6v6l4 2"]} />
);

export const InsightIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2H10a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z", "M10 21h4"]} />
);

export const LogoutIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"]} />
);

export const MenuIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M3 12h18", "M3 6h18", "M3 18h18"]} />
);

export const CloseIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M18 6L6 18", "M6 6l12 12"]} />
);

export const ChevronLeftIcon = ({ size, color }) => (
  <Icon size={size} color={color} d="M15 18l-6-6 6-6" />
);

export const ChevronRightIcon = ({ size, color }) => (
  <Icon size={size} color={color} d="M9 18l6-6-6-6" />
);

export const PlusIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M12 5v14", "M5 12h14"]} />
);

export const TrashIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M3 6h18", "M19 6l-1 14H6L5 6", "M8 6V4h8v2"]} />
);

export const IncomeIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M12 19V5", "M5 12l7-7 7 7"]} />
);

export const ExpenseIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M12 5v14", "M19 12l-7 7-7-7"]} />
);

export const SavingsIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", "M17 21v-8H7v8", "M7 3v5h8"]} />
);

export const RateIcon = ({ size, color }) => (
  <Icon size={size} color={color} d={["M18 20V10", "M12 20V4", "M6 20v-6"]} />
);

export const LogoIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="#6c63ff" />
    <path d="M7 14h14M14 7v14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="14" cy="14" r="4" stroke="white" strokeWidth="2" />
  </svg>
);

export const RefreshIcon = ({ size, color }) => (
  <Icon size={size} color={color} d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
);

export const BrainIcon = ({ size, color }) => (
  <Icon size={size} color={color} d="M9.5 2A2.5 2.5 0 017 4.5v1A2.5 2.5 0 014.5 8H4a2 2 0 000 4h.5A2.5 2.5 0 017 14.5v1A2.5 2.5 0 009.5 18h5a2.5 2.5 0 002.5-2.5v-1a2.5 2.5 0 012.5-2.5H20a2 2 0 000-4h-.5A2.5 2.5 0 0117 5.5v-1A2.5 2.5 0 0014.5 2h-5z" />
);

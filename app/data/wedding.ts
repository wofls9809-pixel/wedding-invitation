export type Account = {
  bank: string;
  number: string;
  display: string;
  holder: string;
};

export const WEDDING = {
  groom: "이재린",
  bride: "조미연",
  date: new Date("2026-08-15T17:00:00+09:00"),
  dateLabel: "2026.08.15 SAT",
  timeLabel: "2026년 8월 15일 토요일 오후 5시",
  venue: "산하춘",
  address: "충청북도 청주시 흥덕구 강내면 월탄1길 15-11",
  groomPhone: "01048229809",
  groomPhoneLabel: "010-4822-9809",
  bridePhone: "01032510080",
  bridePhoneLabel: "010-3251-0080",
} as const;

export const GROOM_ACCOUNTS: Account[] = [
  { bank: "우리은행", number: "1002860492685", display: "1002-860-492685", holder: "이재린" },
  { bank: "농협", number: "3561049893303", display: "356-1049-8933-03", holder: "이재린" },
];

export const BRIDE_ACCOUNTS: Account[] = [
  { bank: "농협", number: "3510501620403", display: "351-0501-6204-03", holder: "조미연" },
  { bank: "카카오뱅크", number: "3333050736895", display: "3333-05-0736895", holder: "조미연" },
];

export type Tradition = 'public' | 'buddhist' | 'taoist' | 'folk';

export interface FestivalOptions {
  traditions?: Tradition[];
  /** Fixed UTC offset in hours (e.g. 8 for CST, -5 for EST). When provided, the Date argument
   *  is interpreted at this offset rather than the runtime's local timezone. */
  utcOffset?: number;
}

export interface Festival {
  name: string;
  isHoliday: boolean;
  english: string;
  traditions: Tradition[];
  extra?: string;
}

export interface StemBranchPair {
  stem: string;
  branch: string;
}

export interface TimePeriod {
  name: string;
  zodiac: string;
  period: string;
  branch: string;
  description: string;
}

export interface SolarTime {
  hour: number;
  minute: number;
  second: number;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  weekDay: string;
  time: SolarTime;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  monthName: string;
  dayName: string;
  zodiac: string;
}

export interface StemBranch {
  year: string;
  month: string;
  day: string;
  time: string | null;
}

export interface BaZi {
  year: StemBranchPair;
  month: StemBranchPair;
  day: StemBranchPair;
  hour: StemBranchPair | null;
}

export interface Festivals {
  solar: Festival | null;
  lunar: Festival | null;
  sanniangSha: boolean;
}

export interface CalendarResult {
  solar: SolarDate;
  lunar: LunarDate;
  stemBranch: StemBranch;
  baZi: BaZi;
  timePeriod: TimePeriod | null;
  festivals: Festivals;
  solarTerms: string;
}

export interface LunarInfo {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

export interface SolarInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface SolarTerm {
  nameZh: string;
  month: number;
  day: number;
}

// solarToLunar — Date form
export function solarToLunar(date: Date, options?: FestivalOptions): CalendarResult;
// solarToLunar — numeric form
export function solarToLunar(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number,
  second?: number,
  options?: FestivalOptions
): CalendarResult;

// lunarToSolar — Date form
export function lunarToSolar(lunarDate: Date, isLeapMonth?: boolean, options?: FestivalOptions): CalendarResult;
// lunarToSolar — numeric form
export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth?: boolean,
  hour?: number,
  minute?: number,
  second?: number,
  options?: FestivalOptions
): CalendarResult;

export function getTimePeriod(date: Date): TimePeriod | null;

export function getSolarTermsForYear(year: number): SolarTerm[];

export function calculateLunarFromSolar(date: Date): LunarInfo;

export function calculateSolarFromLunar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth?: boolean,
  hour?: number,
  minute?: number,
  second?: number
): SolarInfo;

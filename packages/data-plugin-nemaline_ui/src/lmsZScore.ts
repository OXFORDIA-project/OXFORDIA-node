import reference from './ukWhoGrowthReference.json';

// Port of sitar::LMS2z(x, y, sex, measure, ref = "ukwhopt", toz = TRUE).
//
// ukWhoGrowthReference.json is the height ("ht") and weight ("wt") part of
// sitar's `ukwhopt` dataset: the UK-WHO growth reference (Wright et al. 2010)
// summarised as L, M and S by sex from 26 weeks gestation to 20 years. Rows are
// exported exactly as LMS2z prepares them (na.omit(unique(...)) per sex).
//
// As in sitar, L, M and S are interpolated with a natural cubic spline
// (R's spline(method = "natural")). Repeated ages split the table into
// segments, each splined separately; an age on a segment boundary takes the
// later segment. Ages outside the reference range give no Z-score.

export type GrowthMeasure = 'ht' | 'wt';
export type GrowthSex = 'male' | 'female';

interface LmsTable {
  years: number[];
  L: number[];
  M: number[];
  S: number[];
}

interface Segment {
  start: number;
  end: number;
  L: NaturalSpline;
  M: NaturalSpline;
  S: NaturalSpline;
}

class NaturalSpline {
  /** Second derivatives at each knot; zero at both ends. */
  private readonly m: number[];

  constructor(
    private readonly x: number[],
    private readonly y: number[],
  ) {
    const n = x.length;
    this.m = new Array<number>(n).fill(0);
    if (n < 3) return;
    // Tridiagonal system for interior second derivatives (Thomas algorithm).
    const diag = new Array<number>(n).fill(0);
    const rhs = new Array<number>(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
      const h0 = x[i] - x[i - 1];
      const h1 = x[i + 1] - x[i];
      diag[i] = 2 * (h0 + h1);
      rhs[i] = 6 * ((y[i + 1] - y[i]) / h1 - (y[i] - y[i - 1]) / h0);
    }
    for (let i = 2; i < n - 1; i++) {
      const h0 = x[i] - x[i - 1];
      const w = h0 / diag[i - 1];
      diag[i] -= w * h0;
      rhs[i] -= w * rhs[i - 1];
    }
    for (let i = n - 2; i >= 1; i--) {
      const h1 = x[i + 1] - x[i];
      this.m[i] = (rhs[i] - h1 * this.m[i + 1]) / diag[i];
    }
  }

  at(u: number): number {
    const { x, y, m } = this;
    const n = x.length;
    if (n === 1) return y[0];
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (x[mid] <= u) lo = mid;
      else hi = mid;
    }
    const h = x[hi] - x[lo];
    const a = x[hi] - u;
    const b = u - x[lo];
    return (
      (m[lo] * a * a * a + m[hi] * b * b * b) / (6 * h) +
      (y[lo] / h - (m[lo] * h) / 6) * a +
      (y[hi] / h - (m[hi] * h) / 6) * b
    );
  }
}

function buildSegments(table: LmsTable): Segment[] {
  const { years } = table;
  const ends: number[] = [];
  for (let i = 0; i < years.length - 1; i++) {
    if (years[i + 1] === years[i]) ends.push(i);
  }
  ends.push(years.length - 1);

  const segments: Segment[] = [];
  let start = 0;
  for (const end of ends) {
    const xs = years.slice(start, end + 1);
    const spline = (values: number[]) => new NaturalSpline(xs, values.slice(start, end + 1));
    segments.push({ start: years[start], end: years[end], L: spline(table.L), M: spline(table.M), S: spline(table.S) });
    start = end + 1;
  }
  return segments;
}

const segmentCache = new Map<string, Segment[]>();

function segmentsFor(measure: GrowthMeasure, sex: GrowthSex): Segment[] {
  const key = `${measure}:${sex}`;
  let segments = segmentCache.get(key);
  if (!segments) {
    segments = buildSegments((reference as Record<GrowthMeasure, Record<GrowthSex, LmsTable>>)[measure][sex]);
    segmentCache.set(key, segments);
  }
  return segments;
}

/** UK-WHO Z-score for a measurement, or undefined outside 26 weeks gestation – 20 years. */
export function ukWhoZScore(
  measure: GrowthMeasure,
  sex: GrowthSex,
  ageYears: number,
  value: number,
): number | undefined {
  let segment: Segment | undefined;
  for (const s of segmentsFor(measure, sex)) {
    if (ageYears >= s.start && ageYears <= s.end) segment = s;
  }
  if (!segment) return undefined;

  const L = segment.L.at(ageYears) || 1e-7;
  const M = segment.M.at(ageYears);
  const S = segment.S.at(ageYears);
  const z = (Math.pow(value / M, L) - 1) / L / S;
  return Number.isFinite(z) ? z : undefined;
}

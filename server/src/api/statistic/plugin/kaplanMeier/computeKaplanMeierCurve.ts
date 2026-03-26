export interface KaplanMeierObservationRow {
  time: number;
  /** true = event occurred, false = censored */
  event: boolean;
  group?: string;
}

export interface KaplanMeierSurvivalPoint {
  time: number;
  survivalProbability: number;
  atRisk: number;
  events: number;
  censored: number;
}

export interface KaplanMeierCurve {
  group: string | null;
  points: KaplanMeierSurvivalPoint[];
  observations: number;
}

/**
 * Compute Kaplan-Meier survival curves from raw observation rows.
 * If observations include a group field, one curve per group is returned.
 * Otherwise a single curve with group=null is produced.
 */
export function computeKaplanMeierCurves(
  rows: KaplanMeierObservationRow[],
): KaplanMeierCurve[] {
  const grouped = new Map<string | null, KaplanMeierObservationRow[]>();
  for (const row of rows) {
    const key = row.group ?? null;
    let bucket = grouped.get(key);
    if (!bucket) {
      bucket = [];
      grouped.set(key, bucket);
    }
    bucket.push(row);
  }

  const curves: KaplanMeierCurve[] = [];
  for (const [group, observations] of grouped) {
    curves.push({
      group,
      points: computeSingleCurve(observations),
      observations: observations.length,
    });
  }

  curves.sort((a, b) => {
    if (a.group === null) return -1;
    if (b.group === null) return 1;
    return a.group.localeCompare(b.group);
  });
  return curves;
}

/**
 * Standard KM estimator for a single group.
 *
 * At each distinct event time t_i:
 *   S(t_i) = S(t_{i-1}) * (n_i - d_i) / n_i
 *
 * Censored observations at time t are removed from the at-risk pool
 * after events at time t are processed (right-censoring convention).
 * Times where only censoring occurs do not produce a step.
 */
function computeSingleCurve(
  rows: KaplanMeierObservationRow[],
): KaplanMeierSurvivalPoint[] {
  const sorted = [...rows].sort((a, b) => a.time - b.time);
  const points: KaplanMeierSurvivalPoint[] = [];
  let atRisk = sorted.length;
  let survival = 1.0;
  let i = 0;

  while (i < sorted.length) {
    const currentTime = sorted[i].time;
    let events = 0;
    let censored = 0;

    while (i < sorted.length && sorted[i].time === currentTime) {
      if (sorted[i].event) {
        events++;
      } else {
        censored++;
      }
      i++;
    }

    if (events > 0) {
      survival = survival * ((atRisk - events) / atRisk);
      points.push({
        time: currentTime,
        survivalProbability: survival,
        atRisk,
        events,
        censored,
      });
    }

    atRisk -= events + censored;
  }

  return points;
}

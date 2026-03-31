const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

export function computeFoldScore({
  curvature,
  energy,
  coherence,
  ethics,
  instability,
}) {
  const raw =
    0.25 * curvature +
    0.25 * energy +
    0.2 * coherence +
    0.15 * (coherence * ethics) -
    0.3 * instability;

  return clamp(raw, 0, 1);
}

export function computeFoldAperture(score, coherence) {
  return clamp(score * coherence, 0, 1);
}

export function classifyFold(score) {
  if (score < 0.3) return "NO FOLD";
  if (score < 0.6) return "LOCAL DISTORTION";
  if (score < 0.85) return "STABLE CORRIDOR";
  return "FULL FOLD";
}

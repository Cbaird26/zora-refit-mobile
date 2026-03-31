export function computeGammaEffective({
  instability,
  coherence,
  aperture,
  eta = 0,
}) {
  const A = 1.0e9;
  const B = 2.5e8;
  const C = 1.5e8;
  const D = 1.0e8;
  return A * instability + B * (1 - coherence) + C * aperture + D * Math.abs(eta);
}

export function computeVisibility({
  Gamma,
  T,
  dx,
}) {
  return Math.exp(-Gamma * T * dx * dx);
}

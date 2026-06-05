/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AHPResult, TOPSISResult, Criteria, SupplierMetrics } from './types';

// Random Inconsistency Index (RI) from Thomas L. Saaty
const RI_VALUES: Record<number, number> = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/**
 * Initializes a default pairwise matrix for 5 criteria
 */
export function getDefaultPairwiseMatrix(): number[][] {
  return [
    [1,   3,   5,   4,   2],   // C1: Harga Penawaran
    [1/3, 1,   3,   2,   1/2], // C2: Kualitas Berkelanjutan
    [1/5, 1/3, 1,   1/2, 1/4], // C3: Ketepatan Pengiriman
    [1/4, 1/2, 2,   1,   1/3], // C4: Ketersediaan Stok
    [1/2, 2,   4,   3,   1],   // C5: Akurasi Pengadaan
  ];
}

/**
 * Solves AHP and returns weights and consistency parameters
 */
export function calculateAHP(pairwise: number[][]): AHPResult {
  const n = pairwise.length;
  
  // Step 1: Column sum
  const colSums = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += pairwise[i][j];
    }
  }

  // Step 2: Normalization
  const normalizedMatrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    normalizedMatrix.push(Array(n).fill(0));
  }
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      normalizedMatrix[i][j] = pairwise[i][j] / colSums[j];
    }
  }

  // Step 3: Priority Vector (weights) - Row averagings
  const weights = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += normalizedMatrix[i][j];
    }
    weights[i] = rowSum / n;
  }

  // Step 4: Consistency ratio calculation
  // Matrix multiplication: pairwise * weights
  const weightedSum = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      weightedSum[i] += pairwise[i][j] * weights[j];
    }
  }

  // Ratio elements
  const consistencyRatios = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    consistencyRatios[i] = weightedSum[i] / weights[i];
  }

  // Lambda Max
  const lambdaMax = consistencyRatios.reduce((a, b) => a + b, 0) / n;

  // Consistency Index
  const ci = (lambdaMax - n) / (n - 1);

  // Consistency Ratio
  const ri = RI_VALUES[n] || 1.12;
  const cr = ci / ri;

  return {
    pairwiseMatrix: pairwise,
    normalizedMatrix,
    weights,
    lambdaMax: parseFloat(lambdaMax.toFixed(4)),
    ci: parseFloat(ci.toFixed(4)),
    cr: parseFloat(cr.toFixed(4)),
    isConsistent: cr < 0.10,
  };
}

/**
 * Solve TOPSIS based on AHP weights and supplier metrics
 */
export function calculateTOPSIS(
  suppliers: SupplierMetrics[],
  criteriaList: Criteria[]
): TOPSISResult {
  const alternatives = suppliers.map(s => s.displayName);
  const nCriteria = criteriaList.length;
  const mAlternatives = suppliers.length;

  // Step 1: Decision Matrix (X)
  // Rows are suppliers, columns are criteria (Harga, Kualitas, Lead Time, Ketersediaan, Inspeksi)
  const decisionMatrix: number[][] = [];
  for (let i = 0; i < mAlternatives; i++) {
    const s = suppliers[i];
    decisionMatrix.push([
      s.price,
      s.qualityScore,
      s.leadTime,
      s.availability,
      s.inspectionPassRate
    ]);
  }

  // Step 2: Calculate sum of squares for normalization
  const sumOfSquares = Array(nCriteria).fill(0);
  for (let j = 0; j < nCriteria; j++) {
    let sumSqr = 0;
    for (let i = 0; i < mAlternatives; i++) {
      sumSqr += decisionMatrix[i][j] * decisionMatrix[i][j];
    }
    sumOfSquares[j] = Math.sqrt(sumSqr);
  }

  // Normalized Decision Matrix (R)
  const normalizedMatrix: number[][] = [];
  for (let i = 0; i < mAlternatives; i++) {
    normalizedMatrix.push(Array(nCriteria).fill(0));
    for (let j = 0; j < nCriteria; j++) {
      normalizedMatrix[i][j] = sumOfSquares[j] > 0 ? decisionMatrix[i][j] / sumOfSquares[j] : 0;
    }
  }

  // Step 3: Weighted Normalized Matrix (Y)
  const weightedMatrix: number[][] = [];
  for (let i = 0; i < mAlternatives; i++) {
    weightedMatrix.push(Array(nCriteria).fill(0));
    for (let j = 0; j < nCriteria; j++) {
      weightedMatrix[i][j] = normalizedMatrix[i][j] * criteriaList[j].weight;
    }
  }

  // Step 4: Determine Positives and Negatives Ideal Solutions (A+ and A-)
  const idealPositive = Array(nCriteria).fill(0);
  const idealNegative = Array(nCriteria).fill(0);

  for (let j = 0; j < nCriteria; j++) {
    const isBenefit = criteriaList[j].type === 'benefit';
    const columnValues = weightedMatrix.map(row => row[j]);
    
    if (isBenefit) {
      idealPositive[j] = Math.max(...columnValues);
      idealNegative[j] = Math.min(...columnValues);
    } else {
      idealPositive[j] = Math.min(...columnValues); // For cost, lower value is ideal
      idealNegative[j] = Math.max(...columnValues);
    }
  }

  // Step 5: Distance calculations (D+ and D-)
  const distancePositive = Array(mAlternatives).fill(0);
  const distanceNegative = Array(mAlternatives).fill(0);

  for (let i = 0; i < mAlternatives; i++) {
    let dPlusSum = 0;
    let dMinSum = 0;
    for (let j = 0; j < nCriteria; j++) {
      dPlusSum += Math.pow(weightedMatrix[i][j] - idealPositive[j], 2);
      dMinSum += Math.pow(weightedMatrix[i][j] - idealNegative[j], 2);
    }
    distancePositive[i] = Math.sqrt(dPlusSum);
    distanceNegative[i] = Math.sqrt(dMinSum);
  }

  // Step 6: Preference values (V)
  const preferences = Array(mAlternatives).fill(0);
  for (let i = 0; i < mAlternatives; i++) {
    const totalDist = distancePositive[i] + distanceNegative[i];
    preferences[i] = totalDist > 0 ? distanceNegative[i] / totalDist : 0;
  }

  // Build ranking output
  const rankings = suppliers.map((s, idx) => ({
    supplierName: s.displayName,
    score: parseFloat(preferences[idx].toFixed(4)),
    rank: 1, // Will compute below
  }));

  // Assign ranks
  const sorted = [...rankings].sort((a, b) => b.score - a.score);
  sorted.forEach((item, index) => {
    const originalItem = rankings.find(r => r.supplierName === item.supplierName);
    if (originalItem) {
      originalItem.rank = index + 1;
    }
  });

  return {
    alternatives,
    decisionMatrix,
    normalizedMatrix,
    weightedMatrix,
    idealPositive: idealPositive.map(v => parseFloat(v.toFixed(4))),
    idealNegative: idealNegative.map(v => parseFloat(v.toFixed(4))),
    distancePositive: distancePositive.map(v => parseFloat(v.toFixed(4))),
    distanceNegative: distanceNegative.map(v => parseFloat(v.toFixed(4))),
    preferences: preferences.map(v => parseFloat(v.toFixed(4))),
    ranking: rankings.sort((a, b) => a.rank - b.rank),
  };
}

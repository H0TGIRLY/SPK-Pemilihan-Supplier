/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DatasetRow {
  productType: string;
  sku: string;
  price: number;
  availability: number;
  productsSold: number;
  revenue: number;
  customerDemographics: string;
  stockLevels: number;
  leadTimeDays: number;
  orderQuantities: number;
  shippingTimes: number;
  shippingCarrier: string;
  shippingCosts: number;
  supplierName: string;
  location: string;
  leadTime: number;
  productionVolumes: number;
  mfgLeadTime: number;
  mfgCosts: number;
  inspectionResults: string;
  defectRate: number;
  transportMode: string;
  route: string;
  costs: number;
}

export interface SupplierMetrics {
  supplierName: string; // "Supplier 1", etc.
  displayName: string;  // "PT. Indo Sarana", etc.
  address: string;
  phone: string;
  price: number;        // Avg Price (Cost)
  defectRate: number;   // Avg Defect Rate
  leadTime: number;     // Avg Lead Time (Cost)
  availability: number; // Avg Availability (Benefit)
  inspectionPassRate: number; // Avg Inspection Pass Rate
  qualityScore: number; // Benefit score
  efficiencyScore: number; // composite value
  phoneCode: string;
}

export interface Criteria {
  id: string; // "C1", "C2", etc
  name: string;
  type: 'benefit' | 'cost';
  weight: number;
  description: string;
}

export interface AHPResult {
  pairwiseMatrix: number[][];
  normalizedMatrix: number[][];
  weights: number[];
  lambdaMax: number;
  ci: number;
  cr: number;
  isConsistent: boolean;
}

export interface TOPSISResult {
  alternatives: string[];
  decisionMatrix: number[][];
  normalizedMatrix: number[][];
  weightedMatrix: number[][];
  idealPositive: number[];
  idealNegative: number[];
  distancePositive: number[];
  distanceNegative: number[];
  preferences: number[];
  ranking: {
    supplierName: string;
    score: number;
    rank: number;
  }[];
}

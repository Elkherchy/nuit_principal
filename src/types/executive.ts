export type ExecutiveScenario = {
  pcCount: number;
  linuxTarget: number;
  licenseCost: number;
  cloudSpend: number;
  supportSpend: number;
  hardwareReplacementRate: number;
  hardwareCost: number;
  energyPerPc: number;
  carbonPerPc: number;
};

export type ExecutiveProjection = {
  licenseSavings: number;
  cloudSavings: number;
  supportSavings: number;
  hardwareSavings: number;
  energySavings: number;
  totalSavings: number;
  avoidedCO2: number;
};



export interface CreateWdioConfig {
  platform: string;
  deviceName: string;
  port: number;
  featureFile: string;
  scriptId: string;
  driver: string;
  appActivity: string;
  appPackage: string;
  bundleId: string;
  reportType: string;
  testId: string;
  xcodeOrgId: string;
}

declare module "virtual:pwa-register" {
  type RegisterSWOptions = {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  };
  export function registerSW(opts?: RegisterSWOptions): (() => Promise<void>) | void;
  export default registerSW;
}

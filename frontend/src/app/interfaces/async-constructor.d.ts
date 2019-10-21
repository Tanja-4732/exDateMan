/**
 * A design pattern for classes which need to perform async/await operatons in
 * their constructors
 */
export interface AsyncConstructor {
  /**
   * This promise needs to be awaited everywhere once, before an instance of the
   * class is used.
   */
  ready: Promise<null>;

  /**
   * This method prepares the instantiated class for operaton by performing and
   * awaiting (where applicable) operations and resolves the this.ready promise
   * when done.
   */
  // private prepare(): void;
  // 'PrivaTe' MoDIfIer cAnNoT APPeAr On a TyPe MEMbEr.ts(1070)
}

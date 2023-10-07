export default class Registry {
  /**
   * https://dev.to/walosha/registry-pattern-revolutionize-your-object-creation-and-management-lms-as-a-case-study-58km
   *
   * "The Registry pattern is a design pattern that provides a centralized location
   * for managing and creating instances of objects."
   * "(...) can simplify object creation and management by providing a single point of access
   * for creating and retrieving instances of those objects."
   *
   * @class
   */
  dependencies: any = {};

  constructor() {}

  provide(name: string, value: any) {
    this.dependencies[name] = value;
  }

  inject(name: string) {
    return this.dependencies[name];
  }
}

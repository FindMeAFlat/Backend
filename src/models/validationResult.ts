export default class ValidationResult {
  private isValid: boolean;
  private errorMessages: string[];

  constructor() {
    this.isValid = true;
    this.errorMessages = [];
  }

  get valid(): boolean { return this.isValid; }
  get errors(): string[] { return this.errorMessages; }

  addErrorMessage = (errorMessage) => {
    this.isValid = false;
    this.errorMessages.push(errorMessage);
  }

}
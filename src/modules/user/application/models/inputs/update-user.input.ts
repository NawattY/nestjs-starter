export class UpdateUserInput {
  constructor(input: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    this.userId = input.userId;
    this.email = input.email;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
  }

  readonly userId!: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}
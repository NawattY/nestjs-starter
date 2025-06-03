export class UserAuthException {
  static userNotFound() {
    return new Error('Username or password is incorrect');
  }

  static credentialMismatch() {
    return new Error('Username or password is incorrect');
  }
}

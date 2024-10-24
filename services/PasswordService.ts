import fs from "fs";

interface PasswordUsed {
  password: string;
  dateUsed: Date;
}

//1 dia
const millisecondsInDay = 86400000;

export class PasswordService {
  public passwordsUsed: Array<PasswordUsed>;

  constructor() {
    this.passwordsUsed = this.getPasswordsStored().map((element) => {
      return {
        password: element.password,
        dateUsed: new Date(element.dateUsed),
      };
    });
  }

  addPassword(password: string) {
    this.passwordsUsed.push({ password, dateUsed: new Date() });
  }

  isValidPassword(password: string): boolean {
    const isValid =
      this.isValidFormat(password) &&
      (!this.isUsedPassword(password) ||
        (this.isUsedPassword(password) && !this.isPasswordOutDate(password)));
    const saveRequired =
      this.isValidFormat(password) && !this.isUsedPassword(password);
    if (saveRequired) {
      this.addPassword(password);
      this.setPasswordsStored();
    }
    return isValid;
  }

  isUsedPassword(password: string): boolean {
    const usedPassword = this.passwordsUsed.find(
      (element) => element.password === password
    );
    return !!usedPassword;
  }

  isPasswordOutDate(password: string): boolean {
    const usedPassword = this.passwordsUsed.find(
      (element) => element.password === password
    );
    const nowInMilliseconds = Date.now();
    const usedPasswordDateMilliseconds = usedPassword?.dateUsed.getTime();
    const millisecondsDiff = nowInMilliseconds - usedPasswordDateMilliseconds!;
    return millisecondsDiff > millisecondsInDay;
  }

  isValidFormat(password: string): boolean {
    //1. Debe contener al menos dos letras "e".
    //2. Debe contener el número "2".
    //3. Debe contener al menos tres caracteres especiales, como "!@#$%^&*".
    const passwordRegex = /(?=(.*[e]){2})(?=.*2)(?=.*[!@#$%^&*]{3})/;
    const isValidFormat = passwordRegex.test(password);
    return isValidFormat;
  }

  getPasswordError(password: string): string {
    if (!this.isValidFormat(password)) {
      return "Formato invalido";
    }
    if (this.isUsedPassword(password) && this.isPasswordOutDate(password)) {
      return "El password ya se ha utilizado";
    }
    return "";
  }

  getPasswordsStored(): Array<PasswordUsed> {
    return JSON.parse(
      fs.readFileSync("./services/store.json", "utf8")
    ) as Array<PasswordUsed>;
  }

  setPasswordsStored() {
    try {
      fs.writeFileSync(
        "./services/store.json",
        JSON.stringify(this.passwordsUsed, null, 2),
        "utf8"
      );
      console.log("Data successfully saved to disk");
    } catch (error) {
      console.log("An error has occurred ", error);
    }
  }
}

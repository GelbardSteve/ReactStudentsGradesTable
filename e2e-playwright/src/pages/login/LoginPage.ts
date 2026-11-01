import { Page } from "@playwright/test";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export interface IUser {
    email: string
    password: string
    dataTag: string
}

export class LoginPageClass {
    private page: Page;
    emailInput: Input;
    passwordInput: Input;
    loginTabButton: Button;
    signUpTabButton: Button;
    submitButton: Button;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = new Input('usernameInput', page);
        this.passwordInput = new Input('passwordInput', page);
        this.loginTabButton = new Button('login-to-admin-button', page);
        this.signUpTabButton = new Button('signup-tab-button', page);
        this.submitButton = new Button('submitButton', page);
    }

    public async login(user: IUser) {
        await this.page.goto('/');
        await this.loginTabButton.click();
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.submitButton.click();
        return this;
    }
}

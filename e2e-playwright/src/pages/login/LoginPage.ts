import { Page } from "@playwright/test";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";


interface IUser {
    name: string
    password: string
    isAdmin: boolean
    dataTag: string
}

export class LoginPageClass {
    private page: Page;
    usernameInput: Input;
    passwordInput: Input;
    loginButton: Button;
    submitButton: Button;
    studentNumberInput: Input;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = new Input('usernameInput', page);
        this.passwordInput = new Input('passwordInput', page);
        this.studentNumberInput = new Input('studentNumberInput', page);
        this.loginButton = new Button('login-to-admin-button', page);
        this.submitButton = new Button('submitButton', page);
    }

    public async loginAsAdmin(isAdmin: boolean) {
        if (isAdmin) {
            await this.loginButton.click();
        }
    }

    public async login(user: IUser) {
        await this.page.goto('/');

        if (user.isAdmin) {
            await this.loginAsAdmin(true);
            await this.usernameInput.fill(user.name);
            await this.passwordInput.fill(user.password);
        }

        await this.submitButton.click();
        return this;
    }

    public async toUser(studentNumber: number) {
        await this.page.goto('/');
        await this.studentNumberInput.fill(String(studentNumber));
        await this.submitButton.click();
        return this;
    }
}
import { Page } from "@playwright/test";
import { Button } from "../../components/Button";
import { Search } from "./Search";

export class AdminTable {
    search: Search;
    logOutButton: Button;
    
    constructor(private page: Page) {
        this.search = new Search(page);
        this.logOutButton = new Button('logoutButton', page);
    }

    async logout() {
        await this.logOutButton.click();
    }
}
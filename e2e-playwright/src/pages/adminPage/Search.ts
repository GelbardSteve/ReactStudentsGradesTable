import { Page } from "@playwright/test";
import { Input } from "../../components/Input";

export class Search {
    input: Input;

    constructor(page: Page) {
        this.input = new Input('search-input', page);
    }
}
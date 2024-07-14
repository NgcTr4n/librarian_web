import { Item } from "./Item";

export class Customer {
    id?: string;
    name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    imageUrl?: string;
    borrowedItems?: Item[]=[];
    showDetails: boolean; 

    constructor(
        name?: string,
        email?: string,
        phone_number?: string,
        address?: string,
        imageUrl?: string,
        borrowedItems: Item[] = [],
        showDetails: boolean = false // Initialize showDetails here
    ) {
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
        this.address = address;
        this.imageUrl = imageUrl;
        this.borrowedItems = borrowedItems;
        this.showDetails = showDetails; // Assign showDetails in the constructor
    }
}

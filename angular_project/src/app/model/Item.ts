export class Item {
  id?: string;
  author?: string;
  title?: string;
  category?: string;
  opportunities?: string;
  quantity?: number;
  status?: string;
  imageUrl?: string;
  showDetails: boolean = false; 

  constructor(init?: Partial<Item>) {
    Object.assign(this, init);
  }
}

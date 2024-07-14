import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../model/Item';
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  http: HttpClient = inject(HttpClient)
  constructor() { }

  getItems():Observable<Item[]>{
    return this.http.get<Item[]>("http://localhost:8000/api/items/")
  }
  insertItem(item:Item): Observable<Item>{
    return this.http.post<Item>("http://localhost:8000/api/insert/",item)
  }
  deleteItem(id: string): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/books/${id}`);
  }
  updateItem(id: string, updatedBook: Item): Observable<Item> {
    return this.http.put<Item>(`http://localhost:8000/api/books/${id}`, updatedBook);
  }
  updateItemQuantity(itemId: string, newQuantity: number): Observable<Item> {
    const updatedBook: Partial<Item> = { quantity: newQuantity };
    return this.http.patch<Item>(`http://localhost:8000/api/items/${itemId}`, updatedBook);
  }
}

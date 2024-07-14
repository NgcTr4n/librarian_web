import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/Customer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  http: HttpClient = inject(HttpClient)

  
  getCustomers():Observable<Customer[]>{
    return this.http.get<Customer[]>("http://localhost:8000/api/customers/")
  }
  insertCustomer(customer:Customer): Observable<Customer>{
    return this.http.post<Customer>("http://localhost:8000/api/customers/",customer)
  }
  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/customers/${id}`);
  }
  updateCustomer(id: string, updatedCustomer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`http://localhost:8000/api/customers/${id}`, updatedCustomer);
  }
  
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`http://localhost:8000/api/customers/${id}`);
  }
}

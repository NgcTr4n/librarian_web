import { Component, inject, Injectable, OnInit } from '@angular/core';
// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
// import { doc, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from '@angular/fire/firestore';
import { FormGroup, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule, Time } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemService } from '../../app/services/item.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../app/model/Item';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Customer } from '../../app/model/Customer';
import { CustomerService } from '../../app/services/customer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//export interface Item { id: string; assigned:string; name: string; priority: string; budget: string }
// export interface Item { id?: string; student_name?: string; student_email?: string; student_phone?: string; student_address?: string; student_dob?: string; student_gender?: string;course?: { course_id?: string; course_name?: string; enrollment_date?:string; course_price?: string; enrollment_status
// ?:string; course_duration?:string; course_description?:string};   showDetails?: boolean; // Define showDetails property
//}

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})

export class ContainerComponent implements OnInit {
  items: Item[] = [];
  customers: Customer[] = [];
  borrowFrm: FormGroup;
  categories: string[] = [];
  selectedBook: Item | null = null;
  file: any = {};
  config: any = {
    itemsPerPage: 8,
    currentPage: 1,
    totalItems: 0
  };
  filteredItems = this.items;
  searchTerm: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private itemSrv: ItemService,
    private cusSrv: CustomerService,
    private storage: Storage
  ) {
    this.borrowFrm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {

    this.loadItems();

  }

  onSearch() {
    if (this.searchTerm) {
      this.filteredItems = this.items.filter(item =>
        item.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredItems = this.items;
    }
  }
  loadItems() {
    this.itemSrv.getItems().subscribe(data => {
      this.items = data;
      this.categories = this.getUniqueCategories();
      this.filteredItems = data;
      this.config.totalItems = this.items.length;
    });
  }
  getUniqueCategories(): string[] {
    const uniqueCategories = Array.from(new Set(this.items.map(item => item.category ?? '')));
    return uniqueCategories;
  }
  filterByCategory(category: string) {
    if (category === 'All') {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter(item => item.category === category);
    }
    this.config.totalItems = this.filteredItems.length;
    this.config.currentPage = 1;
  }
  pageChanged(event: any) {
    this.config.currentPage = event;
  }
  openBorrowModal(content: any, item: Item) {
    this.selectedBook = item;
    this.borrowFrm.reset();
    this.modalService.open(content, { centered: true });
  }

  chooseFile(event: any) {
    this.file = event.target.files[0];
    const storageRef = ref(this.storage, `images/${this.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, this.file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.borrowFrm.controls['imageUrl'].setValue(downloadURL);
        });
      }
    );
  }

  onSubmit(modal: any) {
    if (this.borrowFrm.valid && this.selectedBook) {
      const newCustomer = new Customer(
        this.borrowFrm.controls['name'].value,
        this.borrowFrm.controls['email'].value,
        this.borrowFrm.controls['phone_number'].value,
        this.borrowFrm.controls['address'].value,
        this.borrowFrm.controls['imageUrl'].value,
        [this.selectedBook],
        false,
      );
  
      this.cusSrv.insertCustomer(newCustomer).subscribe(insertedCustomer => {
        console.log("Inserted Customer:", insertedCustomer);
  
        this.customers.push(insertedCustomer);
        if (this.selectedBook?.quantity) {
          this.selectedBook.quantity--;
        }
        if (this.selectedBook?.id && this.selectedBook?.quantity !== undefined) {
          this.itemSrv.updateItemQuantity(this.selectedBook.id, this.selectedBook.quantity).subscribe(() => {
            console.log('Item quantity updated successfully.');
          });
        }
        this.borrowFrm.reset();
        modal.close();
      });
    } else {
      console.error('Form is invalid or no book selected.');
    }
  }
  

}  
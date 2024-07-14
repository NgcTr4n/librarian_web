import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../app/model/Item';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { CustomerService } from '../../app/services/customer.service';
import { Customer } from '../../app/model/Customer';
import { ItemService } from '../../app/services/item.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, HttpClientModule, ReactiveFormsModule,NgbModalModule, FormsModule,],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit{
 // firestore: Firestore = inject(Firestore)
  // items: Observable<any[]>;
  // items2: Item[] = []
  // aCollection = collection(this.firestore, 'items')
  // config: any
  // constructor() {

  //   this.items = collectionData(this.aCollection);
  //   this.items.subscribe(data => {
  //     this.items2 = data
  //     console.log(data)
  //   });
  //   this.config = {
  //     itemsPerPage: 5,
  //     currentPage: 1,
  //     totalItems: this.items2.length
  //   };
  // }
  // pageChanged(event: any) {
  //   this.config.currentPage = event;
  // }
  // async add() {
  //   let it: Item = {};
  //   it.id = '1'
  //   it.student_name = "abc"

  //   //Them 1 item vào collection với docid tự động tạo
  //   const newDocRef = await addDoc(this.aCollection, it);
  //   console.log('New document added with ID:', newDocRef.id);


  //   //Lay thong tin 1 item theo docid
  //   let itemDoc = doc(this.firestore, "items/u8cr2BspJo0ww2VljZ4R");
  //   console.log("thong tin item id:", itemDoc)
  // }
  // async update() {
  //   //lay thong tin 1 item theo docid
  //   let itemDoc = doc(this.firestore, "items/IX7LFlOIBbXa4DV3a8hP");

  //   //cap nhat va them thuoc tinh moi neu khong ton tai
  //   await setDoc(itemDoc, { student_name: "add new", id: "id new", job: "abcmmmmm" })

  //   //cap nhat du lieu cua 1 item
  //   await updateDoc(itemDoc, { student_name: "ten update" })

  //   // Xoa field cua 1 item
  //   await updateDoc(itemDoc, { student_name: "ten update  de de abc", id: deleteField() });

  // }
  // async delete() {
  //   //lay thong tin 1 item theo docid
  //   let itemDoc = doc(this.firestore, "items/IX7LFlOIBbXa4DV3a8hP");
  //   await deleteDoc(itemDoc)
  // }
  // toggleDetails(item: Item){
  //   item.showDetails=!item.showDetails;
  // }
  // abc(){
  //   let it=0;
  // }
  public file: any={}

  constructor(public storage: Storage,
  ) {
  }

  
  cusSrv: CustomerService =  inject(CustomerService)
  itemSrv: ItemService = inject(ItemService)
  fb: FormBuilder = inject(FormBuilder)
  items: any
  // customers: any
  insertFrm: any
  updateFrm: any
  isEditing: boolean = false
  config : any
  customers: any[] = []; 
  filteredCus: any[] = [];
    searchTerm: string = '';
  selectedCustomer: Customer | null = null;
  

  
  
  ngOnInit(): void {
    // this.filteredCus = [...this.customers];
    this.insertFrm = this.fb.group({
      // id:['',Validators.required], 
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      borrowItems: [[]], 
      imageUrl: ['']
      /*
      password:['', Validators.required],
      confirmpassword:['', Validators.required]
      },{
      validator: MustMatch('password', 'confirmpassword')}//hàm tự viết SV có thể bỏ qua không kiểm tra cũng được
      */
    });
    this.loadCustomers();
    this.loadItems();
  }
  // toggleDetails(itemId: string): void {
  //   this.showDetailsMap[itemId] = !this.showDetailsMap[itemId];
  // }

  // isDetailsVisible(itemId: string): boolean {
  //   return this.showDetailsMap[itemId] || false;
  // }


  toggleBorrowedItems(customer: Customer) {
      this.selectedCustomer = customer; 
  }


//   toggleBorrowedItems(customer: any) {
//     customer.showBorrowedItems = !customer.showBorrowedItems;
// }
returnBook(customer: Customer, itemId: string) {
  const borrowedItem = customer.borrowedItems?.find(item => item.id === itemId);
  
    if (borrowedItem) {
      borrowedItem.quantity = borrowedItem.quantity ? borrowedItem.quantity + 1 - 1 : 1;

      this.itemSrv.updateItemQuantity(itemId, borrowedItem.quantity).subscribe(() => {
        alert("Book returned successfully!")
        this.closeForm()
      });
    }
  
}
onSearch() {
  this.filteredCus = this.customers.filter(cus => 
      cus.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cus.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      cus.phone_number.includes(this.searchTerm) ||
      cus.address.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}



  closeForm() {
    this.selectedCustomer = null;
  

}
  pageChanged(event: any) {
    this.config.currentPage = event;
  }
  chooseFile(event:any){
    this.file = event.target.files[0];
    const storageRef = ref(this.storage, `customers/${this.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, this.file);
    uploadTask.on('state_changed', 
      (snapshot) =>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
      },
      (error) => {
        console.log(error.message)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          console.log('File avaiable at', downloadURL)
          this.insertFrm.controls['imageUrl'].setValue(downloadURL);
        })
      }
    )
  }




  onSubmit() {
    let customer = new Customer()

    //lay thông tin dữ liệu nhập trên form
    // item.id = this.insertFrm.controls["id"].value;//hoặc item.id = this.insertFrm.controls.id.value;
    customer.name = this.insertFrm.controls["name"].value;//hoặc item.id = this.insertFrm.controls.id.value;
    customer.address = this.insertFrm.controls["address"].value;//hoặc item.id = this.insertFrm.controls.id.value;
    customer.phone_number = this.insertFrm.controls["phone_number"].value;//hoặc item.id = this.insertFrm.controls.id.value;
    customer.email = this.insertFrm.controls["email"].value;//hoặc item.id = this.insertFrm.controls.id.value;
    // customer.imageUrl = this.insertFrm.controls["imageUrl"].value;


    // Nếu có tập tin được chọn, thêm tập tin vào FormData

    this.cusSrv.insertCustomer(customer).subscribe(data => {
      console.log("Insert Form:", data);
      this.customers.push(data); // Thêm item mới vào danh sách hiện tại
      this.insertFrm.reset(); // Reset form sau khi thêm
    }
    )

  };
  loadCustomers() {
    this.cusSrv.getCustomers().subscribe(data => {
      this.customers = data;
      this.filteredCus = [...this.customers];
      this.filteredCus = data
      this.config = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: this.filteredCus.length
      };
    });
  }
 
  loadItems() {
    this.itemSrv.getItems().subscribe(data => {
      this.items = data.map(item => ({
        ...item,
        showDetails: false 
      }));
    });
  }
  deleteCustomer(id: string) {
    this.cusSrv.deleteCustomer(id).subscribe(() => {
      this.customers = this.customers.filter((customer: any) => customer.id !== id);
      this.filteredCus = [...this.customers];
    });
  }
 

  editCustomer(customer: any) {
    this.isEditing = true;
    this.updateFrm = this.fb.group({
      imageUrl: [customer.imageUrl, Validators.required],
      name: [customer.name, Validators.required],
      email: [customer.email, Validators.required],
      phone_number: [customer.phone_number, Validators.required],
      address: [customer.address, Validators.required],
      borrowItems: [customer.borrowItems],
      id: customer.id
    });
  }

  chooseNewImage(event: any) {
    const file = event.target.files[0]; 
    this.updateFrm.patchValue({ imageUrl: file }); 
}
updateItem() {
  const updatedCustomer = this.updateFrm.value;
  if (updatedCustomer.imageUrl instanceof File) {
    const file = updatedCustomer.imageUrl;
    const storageRef = ref(this.storage, `customers/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updatedCustomer.imageUrl = downloadURL;
          this.updateCustomerData(updatedCustomer);
        });
      }
    );
  } else {
    this.updateCustomerData(updatedCustomer);
  }
}

private updateCustomerData(updatedCustomer: any) {
  this.cusSrv.updateCustomer(updatedCustomer.id, updatedCustomer).subscribe(() => {
    const index = this.customers.findIndex((customer: any) => customer.id === updatedCustomer.id);
    if (index !== -1) {
      this.customers[index] = updatedCustomer;
      this.filteredCus = [...this.customers];
        }
    this.isEditing = false;
  });
}

}

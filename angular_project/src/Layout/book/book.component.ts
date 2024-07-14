  import { Component, OnInit, inject } from '@angular/core';

  import { CommonModule } from '@angular/common';
  import { NgxPaginationModule } from 'ngx-pagination';
  import { HttpClientModule } from '@angular/common/http';
  import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Item } from '../../app/model/Item';
  import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
  import { ItemService } from '../../app/services/item.service';
import { Router } from '@angular/router';
  @Component({
    selector: 'app-book',
    standalone: true,
    imports: [CommonModule, NgxPaginationModule, HttpClientModule, ReactiveFormsModule, FormsModule],
    templateUrl: './book.component.html',
    styleUrl: './book.component.css'
  })
  export class BookComponent implements OnInit {
    public file: any = {};
  public items: any[] =[];
  public insertFrm: any;
  public updateFrm: any;
  public isEditing: boolean = false;
  public sortedAscending: boolean = true;
  public config: any;
  public filteredItems = this.items;
  showAdvancedFilters: boolean = false;

  searchTerm: string = ''; 
  public filters: any = {
    title: '',
    author: '',
    category: '',
    opportunities: ''
  };
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
    constructor( public storage: Storage,
      private itemSrv: ItemService,
      private fb: FormBuilder) {

    }
    // filteredItems = this.items;


    

        ngOnInit(): void {
          this.insertFrm = this.fb.group({
            author: ['', [Validators.required]],
            title: ['', [Validators.required]],
            quantity: ['', [Validators.required]],

            category: ['', [Validators.required]],
            opportunities: ['', [Validators.required]],
            imageUrl: ['']
          });
          this.fetchItems();
          this.config = {
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: 0 
          };
    }

fetchItems(){
  this.itemSrv.getItems().subscribe(data => {
    this.items = data;
    this.filteredItems = data;
    this.applyFilters();
    this.config.totalItems = this.items.length;
  });   
  // this.config = {
  //   itemsPerPage: 5,
  //   currentPage: 1,
  //   totalItems: this.items.length
  // };

    }
    clearSearch(): void {
      this.searchTerm = '';
      this.filters = {
        title: '',
        author: '',
        category: '',
        opportunities: ''
      };
      this.fetchItems(); 
    }
  
    onSearch() {
      if (this.searchTerm) {
        this.filteredItems = this.items.filter(item =>
          item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredItems = this.items;
      }
      this.config.totalItems = this.filteredItems.length;
      this.config.currentPage = 1;
    }
  
  
    // sortAscending() {
    //   this.items.sort((a, b) => a.title.localeCompare(b.title));
    //   this.sortedAscending = true; 
    // }
  
    // sortDescending() {
    //   this.items.sort((a, b) => b.title.localeCompare(a.title));
    //   this.sortedAscending = false; 
    // }
  
    applyFilters(): void {
      this.filteredItems = this.items.filter(item => {
        return (
          (item.title.toLowerCase().includes(this.filters.title.toLowerCase()) || this.filters.title === '') &&
          (item.author.toLowerCase().includes(this.filters.author.toLowerCase()) || this.filters.author === '') &&
          (item.category === this.filters.category || this.filters.category === '') &&
          (item.opportunities === this.filters.opportunities || this.filters.opportunities === '')
        );
      });
      this.config.totalItems = this.filteredItems.length;
      this.config.currentPage = 1;
    }
    toggleAdvancedFilters() {
      this.showAdvancedFilters = !this.showAdvancedFilters;
      if (!this.showAdvancedFilters) {
        this.filters = {
          title: '',
          author: '',
          category: '',
          opportunities: ''
        };
      }}
    pageChanged(event: any) {
      this.config.currentPage = event;
    }
    chooseFile(event:any){
      this.file = event.target.files[0];
      const storageRef = ref(this.storage, `images/${this.file.name}`);
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
      let item = new Item()

      //lay thông tin dữ liệu nhập trên form
      // item.id = this.insertFrm.controls["id"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      item.author = this.insertFrm.controls["author"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      item.quantity = this.insertFrm.controls["quantity"].value;
      item.title = this.insertFrm.controls["title"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      // item.status = this.insertFrm.controls["status"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      item.category = this.insertFrm.controls["category"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      item.opportunities = this.insertFrm.controls["opportunities"].value;//hoặc item.id = this.insertFrm.controls.id.value;
      item.imageUrl = this.insertFrm.controls["imageUrl"].value;


      // Nếu có tập tin được chọn, thêm tập tin vào FormData

      this.itemSrv.insertItem(item).subscribe(data => {
        console.log("Insert Form:", data);
        this.items.push(data); // Thêm item mới vào danh sách hiện tại
        this.applyFilters(); 
        this.insertFrm.reset(); // Reset form sau khi thêm
        // this.config.currentPage = event;

      }
      )

    };
    deleteItem(id: string) {
      this.itemSrv.deleteItem(id).subscribe(() => {
        this.items = this.items.filter((item: any) => item.id !== id);
        this.applyFilters(); 
      });
      // this.config.currentPage = event;


    }

    editItem(item: any) {
      this.isEditing = true;
      this.updateFrm = this.fb.group({
        imageUrl: [item.imageUrl, Validators.required],
        author: [item.author, Validators.required],
        title: [item.title, Validators.required],
        quantity: [item.quantity, Validators.required],

        // status: [item.status, Validators.required],
        category: [item.category, Validators.required],
        opportunities: [item.opportunities, Validators.required],
        id: item.id
      });
      // this.config.currentPage = event;

    }

    chooseNewImage(event: any) {
      const file = event.target.files[0]; 
      this.updateFrm.patchValue({ imageUrl: file }); 
  }
  updateItem(): void {
    const updatedItem = this.updateFrm.value;
    if (updatedItem.imageUrl instanceof File) {
      const file = updatedItem.imageUrl;
      const storageRef = ref(this.storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updatedItem.imageUrl = downloadURL;
            this.itemSrv.updateItem(updatedItem.id, updatedItem).subscribe(() => {
              const index = this.items.findIndex((item: any) => item.id === updatedItem.id);
              if (index !== -1) {
                this.items[index] = updatedItem;
                this.applyFilters(); 
              }
              this.isEditing = false;
            });
          });
        }
      );
    } else {
      this.itemSrv.updateItem(updatedItem.id, updatedItem).subscribe(() => {
        const index = this.items.findIndex((item: any) => item.id === updatedItem.id);
        if (index !== -1) {
          this.items[index] = updatedItem;
          this.applyFilters(); 
        }
        this.isEditing = false;
      });
    }
  }



  }

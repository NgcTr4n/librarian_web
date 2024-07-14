const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./angular-demo-3e4d9-firebase-adminsdk-ds7zk-5f06516790.json');

const url = 'https://angular-demo-3e4d9.firebaseio.com';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: url
});

const db = admin.firestore();

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.listen(8000, () => {
    console.log('Server started on port 8000');
});

// Lấy danh sách items
app.get('/api/items', async (req, res) => {
    try {
        const snapshot = await db.collection('books').get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//customers
app.get('/api/customers', async (req, res) => {
    try {
        const snapshot = await db.collection('customers').get();
        const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Thêm item mới
app.post('/api/insert', async (req, res) => {
    try {
        const newItem = req.body;        
        const docRef = await db.collection('books').add(newItem);
        const newItemWithId = { id: docRef.id, ...newItem };
        res.status(201).send(newItemWithId);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const newCustomer = req.body;
        const docRef = await db.collection('customers').add(newCustomer);
        const newCustomerWithId = { id: docRef.id, ...newCustomer };
        res.status(201).send(newCustomerWithId);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = req.body;

        const customerRef = db.collection('customers').doc(customerId);

        // Check if document exists
        const doc = await customerRef.get();
        if (!doc.exists) {
            return res.status(404).send({ message: 'Customer not found' });
        }

        await customerRef.update(updatedCustomer);

        res.status(200).send({ id: customerId, ...updatedCustomer });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
});
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const { bookId, dueDate } = req.body;

        const customerRef = db.collection('customers').doc(customerId);
        await customerRef.update({
            borrowedBooks: admin.firestore.FieldValue.arrayUnion({ bookId, dueDate })
        });

        res.status(200).send({ id: customerId });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Xóa sách
app.delete('/api/books/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('books').doc(id).delete();
        res.status(200).send({ id: id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('customers').doc(id).delete();
        res.status(200).send({ id: id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.patch('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { quantity } = req.body;

        const itemRef = db.collection('books').doc(itemId);
        await itemRef.update({ quantity: quantity });

        res.status(200).send({ id: itemId });
    } catch (error) {
        res.status(500).send(error.message);
    }});
// Cập nhật sách
app.put('/api/books/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBook = req.body;
        await db.collection('books').doc(id).update(updatedBook);
        res.status(200).send({ id: id, ...updatedBook });
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}
);

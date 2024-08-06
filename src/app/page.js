'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from './firebaseConfig.js'; // Adjust the path to your firebaseConfig file
import {
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  collection
} from 'firebase/firestore';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(query(collection(firestore, 'inventory')));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async (item, Quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + Quantity });
    } else if (Quantity != 0) {
      await setDoc(docRef, { quantity: Quantity });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(value);
    } else {
      setQuantity(0); // Optional: Reset to 0 if the value is not a number
    }
    updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toUpperCase().includes(searchInput.toUpperCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="200px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Stack direction={'column'} spacing={2} alignItems={'center'}>
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
            <TextField
              id="search"
              label="Search"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchInputChange}
              sx={{ width: 500 }}
            />
            
          </Stack>
        </Box>
        <Stack width="800px" height="500px" spacing={0.7} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="1px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" justifyContent={"center"}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <Stack width="100%" direction={'column'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                fullWidth
                value={quantity}
                onChange={handleQuantityChange}
              />
            </Stack>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, quantity);
                setItemName('');
                setQuantity(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

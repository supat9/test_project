<template>
    <div class="q-pa-md">
      <div class="q-py-md">
        <q-btn icon="add" @click="onCreate" label="Add Order Detail" />
      </div>
  
      <!-- Order Details Table -->
      <q-table :rows="orderDetails" :columns="columns" row-key="order_detail_id">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="edit" @click="onEdit(props.row)" label="Edit" />
            <q-btn flat dense round icon="delete" @click="confirmDelete(props.row.order_detail_id)" label="Delete" />
          </q-td>
        </template>
      </q-table>
  
      <!-- Confirmation Dialog for Delete -->
      <q-dialog v-model="deleteDialogVisible">
        <q-card>
          <q-card-section>
            Are you sure you want to delete this order detail?
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Cancel" color="secondary" @click="deleteDialogVisible = false" />
            <q-btn flat label="Delete" color="negative" @click="onDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- Modal for Create or Edit Order Detail -->
      <q-dialog v-model="dialogVisible">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Edit Order Detail' : 'Create Order Detail' }}</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="form.order_id" label="Order ID" type="number" />
            <q-input v-model="form.product_id" label="Product ID" type="number" />
            <q-input v-model="form.quantity" label="Quantity" type="number" />
            <q-input v-model="form.unit_price" label="Unit Price" type="number" />
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Cancel" color="secondary" @click="dialogVisible = false" />
            <q-btn flat label="Save" @click="onSave" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const columns = [
    { name: 'order_detail_id', label: 'Order Detail ID', align: 'left', field: 'order_detail_id', sortable: true },
    { name: 'order_id', label: 'Order ID', align: 'left', field: 'order_id', sortable: true },
    { name: 'product_id', label: 'Product ID', align: 'left', field: 'product_id', sortable: true },
    { name: 'quantity', label: 'Quantity', align: 'left', field: 'quantity', sortable: true },
    { name: 'unit_price', label: 'Unit Price', align: 'left', field: 'unit_price', sortable: true },
    { name: 'actions', label: 'Actions', align: 'center' },
  ]
  
  const orderDetails = ref([])
  const dialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const isEditing = ref(false)
  const orderDetailIdToDelete = ref(null)
  
  const form = ref({
    order_detail_id: null,
    order_id: '',
    product_id: '',
    quantity: '',
    unit_price: '',
  })
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/v1/orderdetails')
      const result = await response.json()
      orderDetails.value = result.orderDetails || []
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }
  
  onMounted(fetchData) // Fetch data when component is mounted
  
  // Open modal for creating a new order detail
  const onCreate = () => {
    form.value = { order_detail_id: null, order_id: '', product_id: '', quantity: '', unit_price: '' }
    isEditing.value = false
    dialogVisible.value = true
  }
  
  // Open modal for editing an existing order detail
  const onEdit = (orderDetail) => {
    form.value = { ...orderDetail }
    isEditing.value = true
    dialogVisible.value = true
  }
  
  // Save the order detail (either create or update)
  const onSave = async () => {
  // แปลงค่าให้เป็น Integer หรือ Float ก่อนส่ง
  const formData = {
    order_id: Number(form.value.order_id), // แปลงเป็น Integer
    product_id: Number(form.value.product_id), // แปลงเป็น Integer
    quantity: Number(form.value.quantity), // แปลงเป็น Integer
    unit_price: parseFloat(form.value.unit_price), // แปลงเป็น Float
  }

  if (isEditing.value) {
    // Update order detail
    try {
      const response = await fetch(`http://localhost:8800/api/v1/orderdetails/${form.value.order_detail_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchData() // Refresh order details list
        dialogVisible.value = false
      } else {
        const errorText = await response.text()
        console.error('Error updating order detail:', errorText)
      }
    } catch (error) {
      console.error('Error updating order detail:', error)
    }
  } else {
    // Create new order detail
    try {
      const response = await fetch('http://localhost:8800/api/v1/orderdetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchData() // Refresh order details list
        dialogVisible.value = false
      } else {
        const errorText = await response.text()
        console.error('Error creating order detail:', errorText)
      }
    } catch (error) {
      console.error('Error creating order detail:', error)
    }
  }
}


  
  // Open confirmation dialog for deleting order detail
  const confirmDelete = (orderDetailId) => {
    orderDetailIdToDelete.value = orderDetailId // Store the order detail ID to be deleted
    deleteDialogVisible.value = true // Show the confirmation dialog
  }
  
  // Handle delete action
  const onDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8800/api/v1/orderdetails/${orderDetailIdToDelete.value}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchData() // Refresh order details list
        deleteDialogVisible.value = false // Close the dialog
      }
    } catch (error) {
      console.error('Error deleting order detail:', error)
    }
  }
  </script>
  
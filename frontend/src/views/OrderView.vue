<template>
    <div class="q-pa-md">
      <div class="q-py-md">
        <q-btn icon="add" @click="onCreate" label="Add Order" />
      </div>
  
      <!-- Orders Table -->
      <q-table :rows="orders" :columns="columns" row-key="order_id">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="edit" @click="onEdit(props.row)" label="Edit" />
            <q-btn flat dense round icon="delete" @click="confirmDelete(props.row.order_id)" label="Delete" />
          </q-td>
        </template>
      </q-table>
  
      <!-- Confirmation Dialog for Delete -->
      <q-dialog v-model="deleteDialogVisible">
        <q-card>
          <q-card-section>
            Are you sure you want to delete this order?
          </q-card-section>
          <q-card-actions>
            <q-btn flat label="Cancel" color="secondary" @click="deleteDialogVisible = false" />
            <q-btn flat label="Delete" color="negative" @click="onDelete" />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- Modal for Create or Edit Order -->
      <q-dialog v-model="dialogVisible">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ isEditing ? 'Edit Order' : 'Create Order' }}</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="form.user_id" label="User ID" />
            <q-input v-model="form.total_amount" label="Total Amount" type="number" />
            
            <!-- Dropdown for Order Status -->
            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="Status"
              emit-value
              map-options
            />
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
    { name: 'order_id', label: 'Order ID', align: 'left', field: 'order_id', sortable: true },
    { name: 'user_id', label: 'User ID', align: 'left', field: 'user_id', sortable: true },
    { name: 'total_amount', label: 'Total Amount', align: 'left', field: 'total_amount', sortable: true },
    { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true },
    { name: 'actions', label: 'Actions', align: 'center' },
  ]
  
  const orders = ref([])
  const dialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const isEditing = ref(false)
  const orderIdToDelete = ref(null)
  
  const form = ref({
    order_id: null,
    user_id: '',
    total_amount: '',
    status: 'processing', // Default value is 'processing'
  })
  
  const statusOptions = [
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/v1/orders')
      const result = await response.json()
      orders.value = result.orders || []
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }
  
  onMounted(fetchData) // Fetch data when component is mounted
  
  // Open modal for creating a new order
  const onCreate = () => {
    form.value = { order_id: null, user_id: '', total_amount: '', status: 'processing' }
    isEditing.value = false
    dialogVisible.value = true
  }
  
  // Open modal for editing an existing order
  const onEdit = (order) => {
    form.value = { ...order }
    isEditing.value = true
    dialogVisible.value = true
  }
  
  // Save the order (either create or update)
  const onSave = async () => {
    if (isEditing.value) {
      // Update order
      try {
        const response = await fetch(`http://localhost:8800/api/v1/orders/${form.value.order_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value),
        })
        if (response.ok) {
          fetchData() // Refresh orders list
          dialogVisible.value = false
        }
      } catch (error) {
        console.error('Error updating order:', error)
      }
    } else {
      // Create new order
      try {
        const response = await fetch('http://localhost:8800/api/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value),
        })
        if (response.ok) {
          fetchData() // Refresh orders list
          dialogVisible.value = false
        } else {
          console.error('Error:', await response.text()) // Check server response if POST fails
        }
      } catch (error) {
        console.error('Error creating order:', error)
      }
    }
  }
  
  // Open confirmation dialog for deleting order
  const confirmDelete = (orderId) => {
    orderIdToDelete.value = orderId // Store the orderId to be deleted
    deleteDialogVisible.value = true // Show the confirmation dialog
  }
  
  // Handle delete action
  const onDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8800/api/v1/orders/${orderIdToDelete.value}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchData() // Refresh orders list
        deleteDialogVisible.value = false // Close the dialog
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }
  </script>
  
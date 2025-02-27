<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="onCreate" label="Add Product" />
    </div>

    <q-table :rows="products" :columns="columns" row-key="product_id">
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img :src="props.row.image_url" alt="product-image" style="width: 50px; height: 50px; object-fit: cover;" />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" @click="onEdit(props.row)" label="Edit" />
          <q-btn flat dense round icon="delete" @click="onDelete(props.row.product_id)" label="Delete" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal for Create or Edit Product -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Product' : 'Create Product' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.name" label="Product Name" />
          <q-input v-model="form.price" label="Price" type="number" />
          <q-input v-model="form.category" label="Category" />
          <q-input v-model="form.image_url" label="Image URL" />
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
  { name: 'product_id', label: 'ID', align: 'left', field: 'product_id', sortable: true },
  { name: 'name', label: 'Product Name', align: 'left', field: 'name', sortable: true },
  { name: 'price', label: 'Price', align: 'left', field: 'price', sortable: true },
  { name: 'category', label: 'Category', align: 'left', field: 'category', sortable: true },
  { name: 'image_url', label: 'Image', align: 'center', field: 'image_url' },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const products = ref([])
const dialogVisible = ref(false)
const isEditing = ref(false)
const form = ref({
  product_id: null,
  name: '',
  price: '',
  category: '',
  image_url: '',
})

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/v1/products')
    const result = await response.json()
    products.value = result.products || [] // Make sure it's an array
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(fetchData) // Fetch products when component is mounted

// Open modal for creating a new product
const onCreate = () => {
  form.value = { product_id: null, name: '', price: '', category: '', image_url: '' }
  isEditing.value = false
  dialogVisible.value = true
}

// Open modal for editing an existing product
const onEdit = (product) => {
  form.value = { ...product }
  isEditing.value = true
  dialogVisible.value = true
}

// Save the product (either create or update)
const onSave = async () => {
  if (isEditing.value) {
    // Update product
    try {
      const response = await fetch(`http://localhost:8800/api/v1/products/${form.value.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (response.ok) {
        fetchData() // Refresh products list
        dialogVisible.value = false
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  } else {
    // Create new product
    try {
      const response = await fetch('http://localhost:8800/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (response.ok) {
        fetchData() // Refresh products list
        dialogVisible.value = false
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }
}

// Confirm delete before performing action
const confirmDelete = async (productId) => {
  const confirm = window.confirm('Are you sure you want to delete this product?')
  if (confirm) {
    await onDelete(productId)
  }
}

// Delete product
const onDelete = async (productId) => {
  try {
    const response = await fetch(`http://localhost:8800/api/v1/products/${productId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      fetchData() // Refresh products list
    }
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}
</script>

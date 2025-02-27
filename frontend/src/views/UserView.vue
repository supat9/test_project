<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" @click="onCreate" label="Add User" />
    </div>

    <!-- Users Table -->
    <q-table :rows="rows" :columns="columns" row-key="user_id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" @click="onEdit(props.row)" label="Edit" />
          <q-btn flat dense round icon="delete" @click="confirmDelete(props.row.user_id)" label="Delete" />
        </q-td>
      </template>
    </q-table>

    <!-- Confirmation Dialog for Delete -->
    <q-dialog v-model="deleteDialogVisible">
      <q-card>
        <q-card-section>
          Are you sure you want to delete this user?
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancel" color="secondary" @click="deleteDialogVisible = false" />
          <q-btn flat label="Delete" color="negative" @click="onDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal for Create or Edit User -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit User' : 'Create User' }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="form.username" label="Username" />
          <q-input v-model="form.email" label="Email" />
          <!-- Added Password Field -->
          <q-input v-model="form.password" label="Password" type="password" />
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
  { name: 'user_id', label: 'ID', align: 'left', field: 'user_id', sortable: true },
  { name: 'username', label: 'Username', align: 'left', field: 'username', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const rows = ref([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEditing = ref(false)
const userIdToDelete = ref(null)

const form = ref({
  user_id: null,
  username: '',
  email: '',
  password: '', // Added password field to the form
})

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/v1/users')
    const result = await response.json()
    rows.value = result.users || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(fetchData) // Fetch data when component is mounted

// Open modal for creating a new user
const onCreate = () => {
  form.value = { user_id: null, username: '', email: '', password: '' } // Added password in the initial form
  isEditing.value = false
  dialogVisible.value = true
}

// Open modal for editing an existing user
const onEdit = (user) => {
  form.value = { ...user }
  isEditing.value = true
  dialogVisible.value = true
}

// Save the user (either create or update)
const onSave = async () => {
  if (isEditing.value) {
    // Update user
    try {
      const response = await fetch(`http://localhost:8800/api/v1/users/${form.value.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (response.ok) {
        fetchData() // Refresh users list
        dialogVisible.value = false
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  } else {
    // Create new user - remove user_id from the form data
    const { user_id, ...newUser } = form.value;  // Remove user_id from form data
    try {
      const response = await fetch('http://localhost:8800/api/v1/register', {  // Changed from /register to /users
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),  // Only send the data without user_id
      })
      if (response.ok) {
        fetchData() // Refresh users list
        dialogVisible.value = false
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }
}

// Open confirmation dialog for deleting user
const confirmDelete = (userId) => {
  userIdToDelete.value = userId // Store the userId to be deleted
  deleteDialogVisible.value = true // Show the confirmation dialog
}

// Handle delete action
const onDelete = async () => {
  try {
    const response = await fetch(`http://localhost:8800/api/v1/users/${userIdToDelete.value}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      fetchData() // Refresh users list
      deleteDialogVisible.value = false // Close the dialog
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>

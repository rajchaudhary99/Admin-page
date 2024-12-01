// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db, auth } from '../firebase';
// import {
//   collection,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from 'firebase/firestore';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import './Home.css';

// const Home = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [showEditUserModal, setShowEditUserModal] = useState(false);
//   const [newUser, setNewUser] = useState({ name: '', role: 'author', status: 'active', email: '' });
//   const [editUser, setEditUser] = useState(null);

//   const usersCollectionRef = collection(db, 'users');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const data = await getDocs(usersCollectionRef);
//       const usersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//       setUsers(usersData);
//       setFilteredUsers(usersData);
//     };
//     fetchUsers();

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user || null);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLoginClick = () => {
//     navigate('/login');
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     filterUsers(query, sortOrder);
//   };

//   const handleSortChange = (e) => {
//     const order = e.target.value;
//     setSortOrder(order);
//     filterUsers(searchQuery, order);
//   };

//   const filterUsers = (query, order) => {
//     const filtered = users
//       .filter((user) => {
//         const lowerQuery = query.toLowerCase();
//         return (
//           user.name.toLowerCase().includes(lowerQuery) ||
//           user.role.toLowerCase().includes(lowerQuery) ||
//           user.status.toLowerCase().includes(lowerQuery) ||
//           user.email.toLowerCase().includes(lowerQuery)
//         );
//       })
//       .sort((a, b) => {
//         const nameA = a.name.toLowerCase();
//         const nameB = b.name.toLowerCase();
//         return order === 'asc'
//           ? nameA.localeCompare(nameB)
//           : nameB.localeCompare(nameA);
//       });

//     setFilteredUsers(filtered);
//   };

//   const toggleAddUserModal = () => {
//     setShowAddUserModal(!showAddUserModal);
//   };

//   const handleAddUserChange = (e) => {
//     const { name, value } = e.target;
//     setNewUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddUserSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const docRef = await addDoc(usersCollectionRef, newUser);
//       const addedUser = { ...newUser, id: docRef.id };
//       setUsers((prev) => [...prev, addedUser]);
//       setFilteredUsers((prev) => [...prev, addedUser]);
//       toggleAddUserModal();
//       setNewUser({ name: '', role: 'author', status: 'active', email: '' });
//     } catch (error) {
//       console.error('Error adding user:', error);
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       await deleteDoc(doc(db, 'users', id));
//       setUsers((prev) => prev.filter((user) => user.id !== id));
//       setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   const handleEditUser = (user) => {
//     setEditUser(user);
//     setShowEditUserModal(true);
//   };

//   const handleEditUserChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditUserSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userDoc = doc(db, 'users', editUser.id);
//       await updateDoc(userDoc, editUser);
//       setUsers((prev) =>
//         prev.map((user) => (user.id === editUser.id ? editUser : user))
//       );
//       setFilteredUsers((prev) =>
//         prev.map((user) => (user.id === editUser.id ? editUser : user))
//       );
//       setShowEditUserModal(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   return (
//     <div className="home">
//       <div className="top-nav">
//         {currentUser ? (
//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>
//         ) : (
//           <button className="login-btn" onClick={handleLoginClick}>
//             Login
//           </button>
//         )}
//       </div>

//       <h1>Welcome to the User Management System</h1>

//       <div className="search-filter-row">
//         <input
//           type="text"
//           placeholder="Search by Name, Role, Status, or Email"
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <select value={sortOrder} onChange={handleSortChange}>
//           <option value="asc">Sort by Name (Asc)</option>
//           <option value="desc">Sort by Name (Desc)</option>
//         </select>
//       </div>

//       {currentUser && <button onClick={toggleAddUserModal}>Add User</button>}

//       <UserList
//         users={filteredUsers}
//         currentUser={currentUser}
//         onEdit={handleEditUser}
//         onDelete={handleDeleteUser}
//       />

//       {showAddUserModal && (
//         <Modal title="Add User" onClose={toggleAddUserModal}>
//           <form onSubmit={handleAddUserSubmit}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={newUser.name}
//               onChange={handleAddUserChange}
//               required
//             />
//             <select
//               name="role"
//               value={newUser.role}
//               onChange={handleAddUserChange}
//               required
//             >
//               <option value="author">Author</option>
//               <option value="admin">Admin</option>
//               <option value="viewer">Viewer</option>
//             </select>
//             <select
//               name="status"
//               value={newUser.status}
//               onChange={handleAddUserChange}
//               required
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={newUser.email}
//               onChange={handleAddUserChange}
//               required
//             />
//             <button type="submit">Add</button>
//             <button type="button" onClick={toggleAddUserModal}>
//               Cancel
//             </button>
//           </form>
//         </Modal>
//       )}

// {showEditUserModal && (
//   <Modal title="Edit User" onClose={() => setShowEditUserModal(false)}>
//     <form onSubmit={handleEditUserSubmit}>
//       <input
//         type="text"
//         name="name"
//         placeholder="Name"
//         value={editUser.name}
//         onChange={handleEditUserChange}
//         required
//       />
//       <select
//         name="role"
//         value={editUser.role}
//         onChange={handleEditUserChange}
//         required
//       >
//         <option value="author">Author</option>
//         <option value="admin">Admin</option>
//         <option value="viewer">Viewer</option>
//       </select>
//       <select
//         name="status"
//         value={editUser.status}
//         onChange={handleEditUserChange}
//         required
//       >
//         <option value="active">Active</option>
//         <option value="inactive">Inactive</option>
//       </select>
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={editUser.email}
//         onChange={handleEditUserChange}
//         required
//       />
//       <button type="submit">Save</button>
      
//     </form>
 
//   </Modal>
// )}

//     </div>
//   );
// };

// const UserList = ({ users, currentUser, onEdit, onDelete }) => (
//   <div className="user-list">
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Role</th>
//           <th>Status</th>
//           <th>Email</th>
//           {currentUser && <th>Actions</th>}
//         </tr>
//       </thead>
//       <tbody>
//         {users.length === 0 ? (
//           <tr>
//             <td colSpan="5">No users found</td>
//           </tr>
//         ) : (
//           users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.role}</td>
//               <td>{user.status}</td>
//               <td>{user.email}</td>
//               {currentUser && (
//                 <td>
//                   <button onClick={() => onEdit(user)}>Edit</button>
//                   <button onClick={() => onDelete(user.id)}>Delete</button>
//                 </td>
//               )}
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// const Modal = ({ title, children, onClose }) => (
//   <div className="modal">
//     <div className="modal-content">
//       <h2>{title}</h2>
//       {children}
//       {/* <button onClick={onClose} className="modal-close-btn">
//         Close
//       </button> */}
//     </div>
//   </div>
// );

// export default Home;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import  'react-toastify/dist/ReactToastify.css';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'author', status: 'active', email: '' });
  const [editUser, setEditUser] = useState(null);

  const usersCollectionRef = collection(db, 'users');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      const usersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    };
    fetchUsers();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
    toast.success('Logged in successfully!', {
      position: 'top-right',
      autoClose: 1500,
      theme: 'colored',
      hideProgressBar: true,
      closeButton: false,
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'colored',
        hideProgressBar: true,
        closeButton: false,
      });
    } catch (err) {
      toast.error('Error logging out!', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
      });
      console.log(err);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterUsers(query, sortOrder);
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    filterUsers(searchQuery, order);
  };

  const filterUsers = (query, order) => {
    const filtered = users
      .filter((user) => {
        const lowerQuery = query.toLowerCase();
        return (
          user.name.toLowerCase().includes(lowerQuery) ||
          user.role.toLowerCase().includes(lowerQuery) ||
          user.status.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
        );
      })
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return order === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

    setFilteredUsers(filtered);
  };

  const toggleAddUserModal = () => {
    setShowAddUserModal(!showAddUserModal);
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(usersCollectionRef, newUser);
      const addedUser = { ...newUser, id: docRef.id };
      setUsers((prev) => [...prev, addedUser]);
      setFilteredUsers((prev) => [...prev, addedUser]);
      toggleAddUserModal();
      setNewUser({ name: '', role: 'author', status: 'active', email: '' });
      toast.success('User added successfully!', {
        position: 'top-right',
        autoClose: 1600,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
      });
    } catch (error) {
      toast.error('Error adding user!', {
        position: 'top-right',
        autoClose: 1600,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
      });
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully!', {
        position: 'top-right',
        autoClose: 1600,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
    
      });
    } catch (error) {
      toast.error('Error deleting user!', {
        position: 'top-right',
        autoClose: 1600,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
      });
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditUserModal(true);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDoc = doc(db, 'users', editUser.id);
      await updateDoc(userDoc, editUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === editUser.id ? editUser : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user.id === editUser.id ? editUser : user))
      );
      setShowEditUserModal(false);
      toast.success('User updated successfully!', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'colored',
        hideProgressBar: true,
        closeButton: false,
      });
    } catch (error) {
      toast.error('Error updating user!', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'dark',
        hideProgressBar: true,
        closeButton: false,
      });
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="home">
      <div className="top-nav">
        {currentUser ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>

      <h1>Welcome to the User Management System</h1>

      <div className="search-filter-row">
        <input
          type="text"
          placeholder="Search by Name, Role, Status, or Email"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Sort by Name (Asc)</option>
          <option value="desc">Sort by Name (Desc)</option>
        </select>
      </div>

      {currentUser && <button onClick={toggleAddUserModal}>Add User</button>}

      <UserList
        users={filteredUsers}
        currentUser={currentUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {showAddUserModal && (
        <Modal title="Add User" onClose={toggleAddUserModal}>
          <form onSubmit={handleAddUserSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleAddUserChange}
              required
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleAddUserChange}
              required
            >
              <option value="author">Author</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              name="status"
              value={newUser.status}
              onChange={handleAddUserChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleAddUserChange}
              required
            />
            <button type="submit">Add User</button>
          </form>
        </Modal>
      )}

      {showEditUserModal && (
        <Modal title="Edit User" onClose={() => setShowEditUserModal(false)}>
          <form onSubmit={handleEditUserSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editUser.name}
              onChange={handleEditUserChange}
              required
            />
            <select
              name="role"
              value={editUser.role}
              onChange={handleEditUserChange}
              required
            >
              <option value="author">Author</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              name="status"
              value={editUser.status}
              onChange={handleEditUserChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editUser.email}
              onChange={handleEditUserChange}
              required
            />
            <button type="submit">Save</button>
          </form>
        </Modal>
      )}

<ToastContainer
        position="top-center"  // Set position to "top-center" for horizontal alignment
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
     
      />

    </div>
  );
};

const UserList = ({ users, currentUser, onEdit, onDelete }) => (
  <div className="user-list">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Email</th>
          {currentUser && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="5">No users found</td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{user.email}</td>
              {currentUser && (
                <td>
                  <button onClick={() => onEdit(user)}>Edit</button>
                  <button onClick={() => onDelete(user.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

export default Home;

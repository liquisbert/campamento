import React from 'react';
import QRDisplay from './QRDisplay';
import './UserManagement.css';

const UserManagement = ({ users, onUpdateRole }) => {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [filterRole, setFilterRole] = React.useState('all');

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`¿Cambiar rol a "${newRole}"?`)) {
      onUpdateRole(userId, newRole);
    }
  };

  return (
    <div className="user-management">
      <div className="management-controls">
        <div className="filter-group">
          <label>Filtrar por Rol:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Todos</option>
            <option value="participant">Participantes</option>
            <option value="staff">Personal</option>
          </select>
        </div>
        <div className="stats">
          <span>👥 Total: {filteredUsers.length}</span>
          <span>🧑 Participantes: {users.filter(u => u.role === 'participant').length}</span>
          <span>👨‍💼 Staff: {users.filter(u => u.role === 'staff').length}</span>
        </div>
      </div>

      {selectedUser && (
        <div className="user-detail-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedUser(null)}>✕</button>
            <h2>{selectedUser.name}</h2>
            <QRDisplay userData={selectedUser} />
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Desayunos</th>
              <th>Almuerzos</th>
              <th>Cenas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.uid} className={`user-row role-${user.role}`}>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-role">
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'staff' ? '👨‍💼 Personal' : '👤 Participante'}
                    </span>
                  </td>
                  <td className="meal-count">{user.mealCheckIns?.breakfast?.length || 0}</td>
                  <td className="meal-count">{user.mealCheckIns?.lunch?.length || 0}</td>
                  <td className="meal-count">{user.mealCheckIns?.dinner?.length || 0}</td>
                  <td className="actions">
                    <button 
                      className="btn-action btn-view"
                      onClick={() => setSelectedUser(user)}
                      title="Ver QR"
                    >
                      📱
                    </button>
                    {user.role === 'participant' ? (
                      <button 
                        className="btn-action btn-promote"
                        onClick={() => handleRoleChange(user.uid, 'staff')}
                        title="Promover a Staff"
                      >
                        ⬆️
                      </button>
                    ) : (
                      <button 
                        className="btn-action btn-demote"
                        onClick={() => handleRoleChange(user.uid, 'participant')}
                        title="Cambiar a Participante"
                      >
                        ⬇️
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">No hay usuarios con este rol</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

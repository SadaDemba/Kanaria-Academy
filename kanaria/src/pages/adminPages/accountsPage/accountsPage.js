import React, { useState, useEffect } from 'react';
import UserService from '../../../services/UserService';

import { FaEdit, FaTrash, FaUserPlus, FaKey, FaToggleOn, FaToggleOff, FaRedo } from 'react-icons/fa';
import { Role } from '../../../models/enums';
import { useAuth } from '../../../contexts';
import './accountsPage.css';

// Composants
import AddUserModal from '../../../components/accountPageModals/AddUserModal';
import EditUserModal from '../../../components/accountPageModals/EditUserModal';
import ChangePasswordModal from '../../../components/accountPageModals/ChangePasswordModal';
import DeleteUserModal from '../../../components/accountPageModals/DeleteUserModal';
import ConfirmModal from '../../../components/accountPageModals/ConfirmModal';

const AccountsPage = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // États pour les modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showToggleActiveModal, setShowToggleActiveModal] = useState(false);
    const [newActiveState, setNewActiveState] = useState(false);

    const userService = new UserService();

    // Charger les utilisateurs
    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Ouvrir la modale d'édition
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    // Ouvrir la modale de changement de mot de passe
    const handleChangePassword = (user) => {
        setSelectedUser(user);
        setShowPasswordModal(true);
    };

    // Ouvrir la modale de suppression
    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Ouvrir la modale de réinitialisation de mot de passe
    const handleResetPassword = (user) => {
        setSelectedUser(user);
        setShowResetPasswordModal(true);
    };

    // Ouvrir la modale d'activation/désactivation
    const handleToggleActive = (user, newState) => {
        setSelectedUser(user);
        setNewActiveState(newState);
        setShowToggleActiveModal(true);
    };

    // Réinitialiser le mot de passe
    const confirmResetPassword = async () => {
        try {
            await userService.resetPassword(selectedUser.id);
            setShowResetPasswordModal(false);
            loadUsers();
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error);
            setError('Erreur lors de la réinitialisation du mot de passe');
        }
    };

    // Activer/désactiver l'utilisateur
    const confirmToggleActive = async () => {
        try {
            await userService.toggleUserActive(selectedUser.id, newActiveState);
            setShowToggleActiveModal(false);
            loadUsers();
        } catch (error) {
            console.error('Erreur lors de la modification du statut d\'activation:', error);
            setError('Erreur lors de la modification du statut d\'activation');
        }
    };

    // Après les actions sur les utilisateurs
    const handleUserUpdated = () => {
        loadUsers();
    };

    // Vérifier si l'utilisateur est un super admin
    const isSuperAdmin = currentUser && currentUser.role === Role.SUPER_ADMIN;

    return (
        <div className="accounts-page">
            <div className="accounts-header">
                <h1>Gestion des comptes</h1>

                {isSuperAdmin && (
                    <button
                        className="btn btn-success add-user-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FaUserPlus /> Ajouter un utilisateur
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Chargement des comptes...</p>
                    </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th>Date de création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={!user.isActive ? 'inactive-user' : ''}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role === Role.SUPER_ADMIN ? 'role-super-admin' : 'role-admin'}`}>
                                            {user.role === Role.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                                            {user.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions-col">
                                        {/* Options d'édition pour tous les utilisateurs */}
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(user)}
                                            disabled={!isSuperAdmin && user.id !== currentUser.id}
                                            title={isSuperAdmin || user.id === currentUser.id ? "Modifier" : "Vous ne pouvez pas modifier cet utilisateur"}
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            className="action-btn password-btn"
                                            onClick={() => handleChangePassword(user)}
                                            disabled={user.id !== currentUser.id}
                                            title={user.id === currentUser.id ? "Changer de mot de passe" : "Vous ne pouvez pas changer le mot de passe d'un autre utilisateur"}
                                        >
                                            <FaKey />
                                        </button>

                                        {isSuperAdmin && (
                                            <>
                                                {/* Réinitialisation du mot de passe */}
                                                <button
                                                    className="action-btn reset-btn"
                                                    onClick={() => handleResetPassword(user)}
                                                    title="Réinitialiser le mot de passe"
                                                >
                                                    <FaRedo />
                                                </button>

                                                {/* Activer/Désactiver */}
                                                {user.id !== currentUser.id && (
                                                    <button
                                                        className={`action-btn ${user.isActive ? 'deactivate-btn' : 'activate-btn'}`}
                                                        onClick={() => handleToggleActive(user, !user.isActive)}
                                                        title={user.isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
                                                    >
                                                        {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                                    </button>
                                                )}

                                                {/* Suppression uniquement pour les autres utilisateurs */}
                                                {user.id !== currentUser.id && (
                                                    <button
                                                        className="action-btn del-btn"
                                                        onClick={() => handleDelete(user)}
                                                        title="Supprimer"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="no-users-message">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modales */}
            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onUserAdded={handleUserUpdated}
                />
            )}

            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onUserUpdated={handleUserUpdated}
                    isSuperAdmin={isSuperAdmin}
                />
            )}

            {showPasswordModal && selectedUser && (
                <ChangePasswordModal
                    userId={selectedUser.id}
                    onClose={() => setShowPasswordModal(false)}
                    onPasswordChanged={() => setShowPasswordModal(false)}
                />
            )}

            {showDeleteModal && selectedUser && (
                <DeleteUserModal
                    user={selectedUser}
                    onClose={() => setShowDeleteModal(false)}
                    onUserDeleted={handleUserUpdated}
                />
            )}

            {showResetPasswordModal && selectedUser && (
                <ConfirmModal
                    title="Réinitialiser le mot de passe"
                    message={`Êtes-vous sûr de vouloir réinitialiser le mot de passe de l'utilisateur ${selectedUser.username} ? Le mot de passe sera réinitialisé à "WelcomeToKA2025".`}
                    confirmLabel="Réinitialiser"
                    onClose={() => setShowResetPasswordModal(false)}
                    onConfirm={confirmResetPassword}
                />
            )}

            {showToggleActiveModal && selectedUser && (
                <ConfirmModal
                    title={newActiveState ? "Activer l'utilisateur" : "Désactiver l'utilisateur"}
                    message={
                        newActiveState
                            ? `Êtes-vous sûr de vouloir activer l'utilisateur ${selectedUser.username} ?`
                            : `Êtes-vous sûr de vouloir désactiver l'utilisateur ${selectedUser.username} ? Il ne pourra plus se connecter ni effectuer d'actions.`
                    }
                    confirmLabel={newActiveState ? "Activer" : "Désactiver"}
                    confirmClass={newActiveState ? "activate" : "deactivate"}
                    onClose={() => setShowToggleActiveModal(false)}
                    onConfirm={confirmToggleActive}
                />
            )}
        </div>
    );
};

export default AccountsPage;
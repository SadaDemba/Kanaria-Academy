import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Notification {
    /**
     * Affiche une notification
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, info, warning)
     * @param {Object} options - Options supplémentaires pour la notification
     */
    static notify(message, type = 'info', options = {}) {
        const defaultOptions = {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        };

        const toastOptions = { ...defaultOptions, ...options };

        switch (type.toLowerCase()) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'error':
                toast.error(message, toastOptions);
                break;
            case 'warning':
                toast.warning(message, toastOptions);
                break;
            case 'info':
            default:
                toast.info(message, toastOptions);
                break;
        }
    }

    /**
     * Affiche une notification de succès
     * @param {string} message - Le message à afficher
     * @param {Object} options - Options supplémentaires
     */
    static success(message, options = {}) {
        this.notify(message, 'success', options);
    }

    /**
     * Affiche une notification d'erreur
     * @param {string} message - Le message à afficher
     * @param {Object} options - Options supplémentaires
     */
    static error(message, options = {}) {
        this.notify(message, 'error', options);
    }

    /**
     * Affiche une notification d'information
     * @param {string} message - Le message à afficher
     * @param {Object} options - Options supplémentaires
     */
    static info(message, options = {}) {
        this.notify(message, 'info', options);
    }

    /**
     * Affiche une notification d'avertissement
     * @param {string} message - Le message à afficher
     * @param {Object} options - Options supplémentaires
     */
    static warning(message, options = {}) {
        this.notify(message, 'warning', options);
    }
}

export default Notification;
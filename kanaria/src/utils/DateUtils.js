export const formatLong = (dateString) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatShortDate = (dateString) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const formatIsoReadable = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return `${date.toLocaleDateString('fr-CA')} à ${date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
};

export const formatTime = (dateString) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDayLongDate = (dateString) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const formatNumericWithTime = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}h:${minutes}`;
};


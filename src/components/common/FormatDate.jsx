
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
        // Ensure dateString is parsed correctly, especially for YYYY-MM-DD
        return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', options); // Using 'id-ID' for Indonesian locale date format
    } catch (error) {
        console.error("Invalid date string for formatDate:", dateString, error);
        return dateString; // Return original if invalid or for debugging
    }
};
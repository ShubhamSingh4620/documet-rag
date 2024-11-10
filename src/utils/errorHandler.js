export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.detail || 'An error occurred';
  }
  return 'Network error occurred';
};

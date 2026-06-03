export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const statusClass = (status) => {
  if (status === 'paid' || status === 'approved' || status === 'active') return 'bg-emerald-100 text-emerald-800';
  if (status === 'pending' || status === 'inquiry' || status === 'in-progress') return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
};

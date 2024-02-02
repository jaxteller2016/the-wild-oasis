import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isLoading: isDeletingBooking, mutate: deleteBooking } = useMutation({
    // mutationFn: (id) => deleteBooking(id)
    mutationFn: (id) => deleteBookingApi(id),
    onSuccess: () => {
      toast.success('Booking sucessfully deleted');
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
    },
    onError: (err) => toast.error(err.message)
  });

  return { isDeletingBooking, deleteBooking };
}

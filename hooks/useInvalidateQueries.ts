import { useQueryClient } from '@tanstack/react-query'

export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  const invalidateScreenings = () => {
    queryClient.invalidateQueries({ queryKey: ['screenings'] })
    queryClient.invalidateQueries({ queryKey: ['screenings-completed'] })
    queryClient.invalidateQueries({ queryKey: ['screenings-all'] })
  }

  const invalidateAmounts = () => {
    queryClient.invalidateQueries({ queryKey: ['amounts'] })
  }

  const invalidateStaff = () => {
    queryClient.invalidateQueries({ queryKey: ['staff'] })
  }

  const invalidateAll = () => {
    queryClient.invalidateQueries() // Invalidate semua
  }

  return {
    invalidateScreenings,
    invalidateAmounts,
    invalidateStaff,
    invalidateAll,
  }
}
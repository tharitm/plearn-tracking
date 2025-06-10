import { useGlobalErrorStore } from '@/stores/globalErrorStore';

// Define a generic type for an API service function
type ApiServiceFunction<T extends any[], R> = (...args: T) => Promise<R>;

export function withErrorHandling<T extends any[], R>(
  fn: ApiServiceFunction<T, R>
): ApiServiceFunction<T, R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      // Accessing Zustand store outside of React component/hook:
      // https://github.com/pmndrs/zustand#readingwriting-state-outside-of-components
      useGlobalErrorStore.getState().setError(errorMessage);

      console.error('API Error (handled by withErrorHandling):', error);
      throw error; // Re-throw the error so the caller can also handle it if needed
    }
  };
}

// Example of how you might wrap and export existing services later:
// import { fetchParcels, updateParcelStatus } from './parcelService'; // Assuming original services
//
// export const fetchParcelsWithHandling = withErrorHandling(fetchParcels);
// export const updateParcelStatusWithHandling = withErrorHandling(updateParcelStatus);

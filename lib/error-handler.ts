import { toast } from 'react-hot-toast';

export const handleApiError = (err: any) => {
  let message = 'An unknown error occurred.';

  if (err.error && Array.isArray(err.error) && err.error.length > 0) {
    const errorMessages = err.error.map((e: any) => {
        if (e.loc && e.msg) {
            const field = e.loc.length > 1 ? e.loc[1] : 'Error';
            return `${field}: ${e.msg}`;
        } else if (e.type === 'http_exception' && e.detail) {
            return e.detail;
        }
        return null;
    }).filter(Boolean);

    if (errorMessages.length > 0) {
        message = errorMessages.join('\n');
    } else if (err.message) {
        message = err.message;
    }
  } else if (err.message) {
    message = err.message;
  } else if (err.detail) {
    message = err.detail;
  }

  toast.error(message);
};

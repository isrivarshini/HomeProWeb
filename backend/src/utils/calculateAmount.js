// Calculate booking total amount
export const calculateBookingAmount = (hourlyRate, estimatedHours) => {
  const amount = hourlyRate * estimatedHours;
  return parseFloat(amount.toFixed(2));
};

// Validate estimated hours
export const validateEstimatedHours = (hours) => {
  const MIN_HOURS = 0.5;
  const MAX_HOURS = 8.0;
  
  if (hours < MIN_HOURS || hours > MAX_HOURS) {
    return {
      valid: false,
      message: `Estimated hours must be between ${MIN_HOURS} and ${MAX_HOURS}`
    };
  }
  
  return { valid: true };
};
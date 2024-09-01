export const calculateAmount = (
  subscriptionType: string,
  includeThermometer: boolean,
): string => {
  let amount = subscriptionType === 'monthly' ? 9.9 : 79.9
  if (includeThermometer) amount += 14.9
  return amount.toFixed(2)
}

export const calculateSubscriptionEnd = (subscriptionType: string): Date => {
  const now = new Date()
  if (subscriptionType === 'monthly') {
    return new Date(now.setMonth(now.getMonth() + 1))
  } else {
    return new Date(now.setFullYear(now.getFullYear() + 1))
  }
}
export const calculateDaysRemaining = (subscriptionEnd: Date): number => {
  const now = new Date()
  const expiry = new Date(subscriptionEnd)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

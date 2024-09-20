export enum ProcessNames {
  ORDER_FINISH = 'order.finish',
  ORDER_RATE = 'order.rate',
  PARTNER_UPDATE = 'partner.update',
  PARTNER_UPDATE_TEMPORARY_LEAVE = 'partner.update.temporary-leave',
  PARTNER_LOGOUT = 'partner.logout',
  PARTNER_UPDATE_WALLET = 'partner.update.wallet',
  PARTNER_UPDATE_ESCROW_WALLET = 'partner.update.escrow-wallet',

  USER_UPDATE_WALLET = 'user.update.wallet',
  USER_UPDATE_ESCROW_WALLET = 'user.update.escrow-wallet',

  USER_LOGOUT = 'user.logout',
  USER_NOTIFICATION_OTP = 'user.notification.otp',

  PARTNER_NOTIFICATION_OTP = 'partner.notification.otp',
  PARTNER_UPDATE_DISCOUNT = 'partner.update.discount',
  PARTNER_UPDATE_WALLET_BY_USER = 'partner.update.wallet.by_user',

  PARTNER_TRANSACTION_DISCOUNT = 'partner.transaction.discount',
  PARTNER_TRANSACTION_RECEIVE_FROM_USER = 'partner.transaction.receive.from_user',
}

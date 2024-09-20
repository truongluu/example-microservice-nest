import { IInternalUser } from '../interfaces/internal-user.interface';

export const internalUserMapper = (userItem: IInternalUser) => {
  const { status, userActive, deleted, secret, token, password, ...restProps } =
    userItem;
  return {
    ...restProps,
  };
};

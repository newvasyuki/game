import { NextFunction, Response, Request } from 'express';
import axios from 'axios';
import { User } from '../../utils/shared/types';
import { YANDEX_API } from '../../utils/shared/constants';
import { ForbiddenError } from '../../utils/error/ForbiddenError';
import { findUserById } from '../collections/users';

interface Query {
  userId?: string;
}

const mockedUser = {
  first_name: 'Test',
  second_name: 'User',
  display_name: 'Testing user',
  login: 'Bla',
  avatar: '',
  email: 'string',
  phone: 'string',
};

export async function authorizeUser(
  req: Request<unknown, unknown, unknown, Query>,
  res: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV === 'development' && parseInt(process.env.SKIP_FORUM_AUTH, 10)) {
    const userId = parseInt(req.query.userId, 10);
    if (Number.isNaN(userId)) {
      return next(new Error('User id cannot be read'));
    }
    const storedUser = await findUserById(userId);
    req.session.user = storedUser
      ? {
          first_name: storedUser.firstName,
          second_name: storedUser.secondName,
          display_name: storedUser.displayName,
          ...storedUser.get({ plain: true }),
        }
      : { ...mockedUser, id: userId };
    // для дев среды без форума пропускаем реальную авторизацию
    return next();
  }
  if (req.session.user) {
    // юзер уже авторизован, пропускаем дальше
    return next();
  }
  if (!req.headers.cookie) {
    return next(new ForbiddenError('User cannot be authorized'));
  }
  // Просим яндекс провeрить юзера по куке
  try {
    const opts = {
      headers: {
        Accept: 'application/json',
        cookie: req.headers.cookie, // пробрасываем куку яндекса (authCookie)
      },
    };
    const { data } = await axios.get<User>(`${YANDEX_API}/auth/user`, opts);
    req.session.user = data;
    next();
  } catch (err) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      return next(new ForbiddenError('User cannot be authorized'));
    }
    return next(err);
  }
  return false;
}

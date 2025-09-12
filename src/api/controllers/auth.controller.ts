import { Request, Response } from 'express';
import httpStatus from 'http-status';
import User from '../../database/models/user.model';
import Role from '../../database/models/role.model';
import tokenService from '../../services/token.service';

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, password } = req.body;

    if (await User.findOne({ phoneNumber })) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'Phone number already taken' });
    }

    const userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      // This is a server error, the 'User' role should always exist after seeding
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Default user role not found' });
    }

    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      password,
      role: userRole._id,
    });

    // It's good practice to not return the password hash, even though it's selected false in the model.
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(httpStatus.CREATED).send(userResponse);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Incorrect phone number or password' });
    }

    const token = tokenService.generateAuthToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.send({ user: userResponse, token });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export default {
  register,
  login,
};

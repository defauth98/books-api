import Users from '../entities/User';

export default {
  render(users: Users) {
    return {
      id: users.id,
      email: users.email,
    };
  },
};

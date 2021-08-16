import Users from '../entities/User';

type Error =  {
  path: string;
  errors: string[];
}

export default {
  render(error: Error) {

    return {
      [error.path] : String(error.errors),
    };
  },
};
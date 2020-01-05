import JWT from 'jsonwebtoken';
import * as Yup from 'yup';

import User from './../Models/User';
import configAuth from './../../Config/Auth';

class SessionControler {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'dados invalidos' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuario nao encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'sua senha nao confere' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: JWT.sign({ id }, configAuth.secret, {
        expiresIn: configAuth.expiresIn,
      }),
    });
  }
}

export default new SessionControler();

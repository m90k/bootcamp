import { unlink } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

import File from './../Models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    return res.json(file);
  }

  async delete(req, res) {
    const { id } = req.params;

    const file = await File.findByPk(id);

    if (!file) {
      return res.status(400).json({
        error: 'Arquivo nao encontrado',
      });
    }

    const filePath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'Uploads',
      file.path
    );
    const unlinkAsync = promisify(unlink);

    await Promise.all([file.destroy(), unlinkAsync(filePath)]);

    return res.json();
  }
}

export default new FileController();

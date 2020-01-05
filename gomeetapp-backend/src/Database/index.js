import Sequelize from 'sequelize';

import configDatabase from './../Config/Database';

import User from './../App/Models/User';
import Meetup from './../App/Models/Meetup';
import File from './../App/Models/File';
import Subscription from './../App/Models/Subscription';

const Models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);

    Models.map(model => model.init(this.connection)).map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();

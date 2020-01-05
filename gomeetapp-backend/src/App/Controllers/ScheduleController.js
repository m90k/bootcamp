import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from './../Models/Meetup';
import File from './../Models/File';
import User from './../Models/User';

class ScheduleController {
  async index(req, res) {
    const { date, page } = req.query;
    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: [['date']],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'title', 'description', 'date', 'location'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'url', 'path'],
        },
        {
          model: User,
          as: 'organizer',
          attributes: ['name'],
        },
      ],
    });

    const validMeetups = meetups.filter(meetup => meetup.past === false);

    return res.json(validMeetups);
  }
}

export default new ScheduleController();

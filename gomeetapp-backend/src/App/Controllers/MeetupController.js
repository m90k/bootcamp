import * as Yup from 'yup';
import { startOfHour, isBefore, parseISO } from 'date-fns';

import Meetup from './../Models/Meetup';
import File from './../Models/File';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { organizer_id: req.userId },
      order: ['date'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
        },
      ],
      attributes: ['id', 'title', 'description', 'location', 'date'],
    });

    const validMeetups = meetups.filter(meetup => meetup.past === false);

    return res.json(validMeetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;
    const startDate = startOfHour(parseISO(date));

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past date is not allowed' });
    }

    req.body.organizer_id = req.userId;
    req.body.date = startDate;

    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (meetup.organizer_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'User is not the meetup organizer' });
    }

    const { past } = meetup;

    if (past) {
      return res.status(401).json({ error: 'Cannot update past events' });
    }

    const data = await meetup.update(req.body);

    return res.json(data);
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (meetup.organizer_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'User is not the meetup organizer' });
    }

    const { past } = meetup;

    if (past) {
      return res.status(401).json({ error: 'Cannot delete past events' });
    }

    await meetup.destroy();

    return res.json();
  }
}

export default new MeetupController();

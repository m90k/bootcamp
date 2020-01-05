import { Router } from 'express';
import Multer from 'multer';

import authMiddleware from './App/Middlewares/Auth';
import multerConfig from './Config/Multer';

import UserController from './App/Controllers/UserController';
import SessionController from './App/Controllers/SessionController';
import MeetupController from './App/Controllers/MeetupController';
import FileController from './App/Controllers/FileController';
import ScheduleController from './App/Controllers/ScheduleController';
import SubscriptionController from './App/Controllers/SubscriptionController';

const Routes = new Router();

const Upload = Multer(multerConfig);

// Sign up
Routes.post('/users', UserController.store);
// Sign in
Routes.post('/sessions', SessionController.store);

// Requisição token
Routes.use(authMiddleware);

// User
Routes.put('/users', UserController.update);

// File
Routes.post('/files', Upload.single('file'), FileController.store);
Routes.delete('/files/:id', FileController.delete);

// Meetup
Routes.get('/meetups', MeetupController.index);
Routes.post('/meetups', MeetupController.store);
Routes.put('/meetups/:id', MeetupController.update);
Routes.delete('/meetups/:id', MeetupController.delete);

// Schedule
Routes.get('/schedules', ScheduleController.index);

// Subscription
Routes.get('/subscriptions', SubscriptionController.index);
Routes.post('/subscriptions', SubscriptionController.store);
Routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default Routes;

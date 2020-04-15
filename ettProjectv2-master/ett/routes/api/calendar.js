const router = require('express').Router();
const auth = require('../../middleware/auth');
const moment = require('moment-timezone');
const { check, validationResult } = require('express-validator');
const settings = require('../../config/settings');
const CalendarAPI = require('node-google-calendar');
const cal = new CalendarAPI(settings);
const nodemailer = require('nodemailer');

const Request = require('../../models/Request');

// Insert event
router.post(
  '/',
  [
    auth,
    [
      check('calendarId', 'Calendar Id is required').exists(),
      check('requestId', 'Request Id is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { calendarId, requestId } = req.body;
      let request = await Request.findById(requestId).populate('category', [
        'title',
      ]);

      if (!request) {
        return res.status(400).json({ msg: 'Request not found' });
      }

      params = {
        start: {
          dateTime: moment(request.dateS).tz('America/Toronto'),
        },
        end: {
          dateTime: moment(request.dateE).tz('America/Toronto'),
        },
        summary: request.category.title,
        description: request.isConfirmed ? 'Confirmed' : 'Pending',
        colorId: 3,
      };

      if (
        moment(request.dateS).tz('America/Toronto').format('HH:mm') ===
          '00:00' &&
        moment(request.dateE).tz('America/Toronto').format('HH:mm') === '23:59'
      ) {
        params = {
          ...params,
          start: {
            date: moment(request.dateS)
              .tz('America/Toronto')
              .format('YYYY-MM-DD'),
          },
          end: {
            date: moment(request.dateE)
              .tz('America/Toronto')
              .add(1, 'days')
              .format('YYYY-MM-DD'),
          },
        };
      }

      cal.Events.insert(calendarId, params)
        .then(async (result) => {
          const newRequest = {
            user: request.user,
            dateS: request.dateS,
            dateE: request.dateE,
            category: request.category,
            isConfirmed: request.isConfirmed,
            googleEventId: result.id,
          };

          request = await Request.findByIdAndUpdate(
            requestId,
            { $set: newRequest },
            { new: true }
          );
          res.json(request);
        })
        .catch((err) => {
          res.json({ error: 'Create event error' });
        });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// Delete event
router.delete('/:calendarId/:googleEventId', auth, async (req, res) => {
  params = {
    sendNotifications: true,
  };
  cal.Events.delete(req.params.calendarId, req.params.googleEventId, params)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ error: 'Delete event error' });
    });
});

module.exports = router;

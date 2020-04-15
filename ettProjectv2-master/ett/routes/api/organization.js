const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Organization = require('../../models/Organization');
const Employee = require('../../models/Employee');

// @route   POST api/organization
// @desc    Create organization
// @access  private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').exists(),
      check('level', 'Level is required').exists(),
      check('email', 'Head email is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, level, email } = req.body;
    try {
      let organization = await Organization.findOne({ title, level });
      if (organization) {
        return res.status(400).json({ msg: 'Organization already exists' });
      }

      const head = await Employee.findOne({ email });
      if (!head) return res.status(400).json({ msg: 'Head not found' });

      organization = new Organization({
        title,
        level,
        head,
      });

      await organization.save();

      // Add Head to Org
      const newOrg = {
        title: title,
        level: level,
        head: head,
        members: [head],
      };

      organization = await Organization.findByIdAndUpdate(
        organization._id,
        { $set: newOrg },
        { new: true }
      );

      res.json(organization);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/organization/:id
// @desc    Get all organization
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    if (!organizations) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/organization/:id
// @desc    Get organization by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/organization/:level
// @desc    Get organization by level
// @access  private
router.get('/level/:lvl', auth, async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    const filteredOrganizations = organizations.filter(
      (org) => org.level.title === req.params.lvl
    );
    if (!filteredOrganizations) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    res.json(filteredOrganizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/organization/:title
// @desc    Get organization by title
// @access  private
router.get('/title/:title', auth, async (req, res) => {
  try {
    const organization = await Organization.findOne({
      title: req.params.title,
    })
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/organization/:headId
// @desc    Get organization by head
// @access  private
router.get('/head/:headId', auth, async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    const filteredOrganizations = organizations.filter((org) =>
      org.head._id.equals(req.params.headId)
    );
    if (!filteredOrganizations) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    res.json(filteredOrganizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/organization/:email
// @desc    Get organization by member
// @access  private
router.get('/member/:email', auth, async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('head', ['id', 'firstName', 'lastName', 'email'])
      .populate('level', ['id', 'title'])
      .populate({
        path: 'members',
        populate: { path: 'employee', model: 'employee' },
      });
    const employee = await Employee.findOne({ email: req.params.email });
    if (!employee) {
      return res.status(400).json({ msg: 'Employee not found' });
    }

    let filteredOrganizations = [];
    organizations.map((org) =>
      org.members.map(
        (m) => m.email === employee.email && filteredOrganizations.push(org)
      )
    );

    res.json(filteredOrganizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/organization/:orgId
// @desc    Delete organization
// @access  private
router.delete('/:orgId', auth, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }
    await organization.remove();
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/organization/:orgId
// @desc    Update organization
// @access  private
router.put('/:orgId', auth, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }

    const { title, level, email } = req.body;

    const head = await Employee.findOne({ email });
    if (!head) {
      return res.status(400).json({ msg: 'Head not found' });
    }

    const newOrg = {
      title: title,
      level: level ? level : organization.level,
      head: head,
      members: !organization.members.includes(head._id)
        ? [...organization.members, head]
        : organization.members,
    };

    organization = await Organization.findByIdAndUpdate(
      req.params.orgId,
      { $set: newOrg },
      { new: true }
    );
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/organization/:orgId
// @desc    Update organization(Add member)
// @access  private
router.put('/:orgId/add-member', auth, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }

    const { member } = req.body;

    const newOrg = {
      title: organization.title,
      level: organization.level,
      head: organization.head,
      members: !organization.members.includes(member._id)
        ? [...organization.members, member]
        : organization.members,
    };

    organization = await Organization.findByIdAndUpdate(
      req.params.orgId,
      { $set: newOrg },
      { new: true }
    );
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/organization/:orgId/:email
// @desc    Update organization(Delete member)
// @access  private
router.put('/:orgId/:email', auth, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(400).json({ msg: 'Organization not found' });
    }

    const member = await Employee.findOne({ email: req.params.email });

    const newOrg = {
      title: organization.title,
      level: organization.level,
      head: organization.head,
      members: organization.members.filter((m) => !m.equals(member._id)),
    };

    organization = await Organization.findByIdAndUpdate(
      req.params.orgId,
      { $set: newOrg },
      { new: true }
    );
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

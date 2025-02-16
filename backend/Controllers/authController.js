const register = async (req, res) => {
  try {
    const { name, email, password, role, age, contact, adresse, photo, ...otherData } = req.body;

    // Basic validation
    if (!name || !email || !password || !role || !age || !contact || !adresse) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields: Object.entries({ name, email, password, role, age, contact, adresse })
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      });
    }

    // Validate babysitter specific fields
    if (role === 'babysitter') {
      const { tarif, experience } = otherData;
      if (!tarif || !experience) {
        return res.status(400).json({
          success: false,
          message: 'Missing required babysitter fields',
          missingFields: Object.entries({ tarif, experience })
            .filter(([_, value]) => !value)
            .map(([key]) => key)
        });
      }
    }

    // ... existing validation code ...

    if (role === 'parent') {
      const parent = new Parent({
        name,
        email,
        password,
        photo
      });
      await parent.save();
      // ... rest of parent registration code
    } else {
      const babysitter = new BabySitter({
        name,
        email,
        password,
        photo
      });
      await babysitter.save();
      // ... rest of babysitter registration code
    }

    // ... rest of registration code
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
}; 
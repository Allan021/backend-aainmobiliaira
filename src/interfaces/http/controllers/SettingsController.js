class SettingsController {
  constructor(settingsUseCases) {
    this.settingsUseCases = settingsUseCases;
  }

  get = async (req, res, next) => {
    try {
      const settings = await this.settingsUseCases.getSettings();
      return res.json(settings);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const settings = await this.settingsUseCases.updateSettings(req.body);
      return res.json(settings);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = SettingsController;

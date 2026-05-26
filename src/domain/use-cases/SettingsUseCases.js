class SettingsUseCases {
  constructor(settingsRepo) {
    this.settingsRepo = settingsRepo;
  }

  async getSettings() {
    return this.settingsRepo.get();
  }

  async updateSettings(data) {
    if (!data.whatsapp_phone) {
      throw new Error('El número de WhatsApp es requerido');
    }
    // Keep only numbers and plus sign
    const cleanedPhone = data.whatsapp_phone.replace(/[^\d+]/g, '');
    if (cleanedPhone.length < 8) {
      throw new Error('El número de teléfono es inválido');
    }
    return this.settingsRepo.update({ whatsapp_phone: cleanedPhone });
  }
}

module.exports = SettingsUseCases;

const supabase = require('../../config/supabase');
const SettingsRepository = require('../../domain/repositories/SettingsRepository');

class SupabaseSettingsRepository extends SettingsRepository {
  async get() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.warn('[DB] Failed to fetch settings, returning default:', error.message);
      return { id: 1, whatsapp_phone: '50499383699' };
    }
    return data;
  }

  async update(settingsData) {
    const { whatsapp_phone } = settingsData;
    const { data, error } = await supabase
      .from('site_settings')
      .update({ whatsapp_phone, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = SupabaseSettingsRepository;

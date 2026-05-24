const supabase = require('../../config/supabase');
const LeadRepository = require('../../domain/repositories/LeadRepository');

class SupabaseLeadRepository extends LeadRepository {
  async findAll({ status, page = 1, limit = 20 } = {}) {
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findById(id) {
    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(leadData) {
    const { data, error } = await supabase.from('leads').insert(leadData).select().single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  }
}

module.exports = SupabaseLeadRepository;

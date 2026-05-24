const supabase = require('../../config/supabase');
const SaleRepository = require('../../domain/repositories/SaleRepository');

class SupabaseSaleRepository extends SaleRepository {
  async findAll({ page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('sales')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })
      .range(from, from + limit - 1);
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findById(id) {
    const { data, error } = await supabase.from('sales').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(saleData) {
    const { data, error } = await supabase.from('sales').insert(saleData).select().single();
    if (error) throw error;
    return data;
  }

  async getMetrics() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    const [current, previous] = await Promise.all([
      supabase.from('sales').select('price').gte('date', thisMonth),
      supabase.from('sales').select('price').gte('date', lastMonth).lte('date', lastMonthEnd),
    ]);

    const currentTotal = (current.data || []).reduce((s, r) => s + r.price, 0);
    const previousTotal = (previous.data || []).reduce((s, r) => s + r.price, 0);
    const delta = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return { currentMonth: currentTotal, previousMonth: previousTotal, deltaPercent: Math.round(delta) };
  }
}

module.exports = SupabaseSaleRepository;

const supabase = require('../../config/supabase');

class SupabaseLoteRepository {
  async findByLotification(lotificationId) {
    const { data, error } = await supabase
      .from('lotes')
      .select('*, pagos(id, monto, fecha, concepto, numero_recibo)')
      .eq('lotification_id', lotificationId)
      .order('numero', { ascending: true });
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('lotes')
      .select('*, pagos(id, monto, fecha, concepto, numero_recibo, metodo_pago, notas, created_at)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(lotificationId, loteData) {
    const { data, error } = await supabase
      .from('lotes')
      .insert({ ...loteData, lotification_id: lotificationId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from('lotes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // Sync available_lots count on parent lotification
    await this._syncAvailableLots(data.lotification_id);
    return data;
  }

  async delete(id) {
    const { data: lote } = await supabase.from('lotes').select('lotification_id').eq('id', id).single();
    const { error } = await supabase.from('lotes').delete().eq('id', id);
    if (error) throw error;
    if (lote?.lotification_id) await this._syncAvailableLots(lote.lotification_id);
  }

  async _syncAvailableLots(lotificationId) {
    const { count: available } = await supabase
      .from('lotes')
      .select('*', { count: 'exact', head: true })
      .eq('lotification_id', lotificationId)
      .eq('status', 'disponible');

    const { count: total } = await supabase
      .from('lotes')
      .select('*', { count: 'exact', head: true })
      .eq('lotification_id', lotificationId);

    await supabase
      .from('properties')
      .update({ available_lots: available || 0, total_lots: total || 0 })
      .eq('id', lotificationId);
  }

  async addPago(loteId, pagoData) {
    const { count } = await supabase
      .from('pagos')
      .select('*', { count: 'exact', head: true })
      .eq('lote_id', loteId);

    const numero_recibo = pagoData.numero_recibo || `REC-${Date.now()}`;

    const { data, error } = await supabase
      .from('pagos')
      .insert({ ...pagoData, lote_id: loteId, numero_recibo })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deletePago(loteId, pagoId) {
    const { error } = await supabase
      .from('pagos')
      .delete()
      .eq('id', pagoId)
      .eq('lote_id', loteId);
    if (error) throw error;
  }
}

module.exports = SupabaseLoteRepository;

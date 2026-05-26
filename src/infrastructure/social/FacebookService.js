class FacebookService {
  constructor(pageId, accessToken) {
    this.pageId = pageId;
    this.accessToken = accessToken;
    this.apiBase = 'https://graph.facebook.com/v19.0';
  }

  async postProperty(property) {
    if (!this.pageId || !this.accessToken) return null;
    const message = this._buildMessage(property);
    const images = (property.images || []).filter(img => img.url).slice(0, 10);

    if (images.length > 0) {
      return this._postWithPhotos(message, images);
    }
    return this._postFeed(message);
  }

  async postSold(property) {
    if (!this.pageId || !this.accessToken) return null;
    const message = [
      `✅ ¡Propiedad Vendida!`,
      ``,
      `"${property.title}" ya encontró dueño.`,
      `Gracias por confiar en A&A Inmobiliaria.`,
      ``,
      `#Vendido #AaInmobiliaria #ElProgreso #Yoro #BienesRaices`,
    ].join('\n');
    return this._postFeed(message);
  }

  _buildMessage(property) {
    const emoji = (property.type === 'Casa' || property.type === 'Propiedad') ? '🏡' : property.type === 'Comercial' ? '🏢' : '🏗️';
    const price = property.price
      ? `L ${Number(property.price).toLocaleString('es-HN')}`
      : null;
    const area = property.area_varas ? `${property.area_varas} varas²` : null;
    const location = [property.municipio, property.departamento].filter(Boolean).join(', ');

    // Use facebook_title if provided, else fall back to default header format
    const title = property.facebook_title || property.title;
    const lines = [`${emoji} Nueva Propiedad Disponible`, ``, title];
    
    if (location) lines.push(`📍 ${location}`);
    if (price) lines.push(`💰 ${price}`);
    if (area) lines.push(`📐 ${area}`);

    if (property.financing && property.financing_prima) {
      lines.push(``, `💳 Financiamiento disponible`);
      const fin = [];
      if (property.financing_prima) fin.push(`Prima: ${property.financing_prima}%`);
      if (property.financing_plazo_meses) fin.push(`Plazo: ${property.financing_plazo_meses} meses`);
      if (property.financing_tasa_anual) fin.push(`Tasa: ${property.financing_tasa_anual}% anual`);
      if (fin.length) lines.push(`   ${fin.join(' · ')}`);
    }

    // Append facebook_description if provided, else fall back to web description
    const desc = property.facebook_description || property.description;
    if (desc) {
      lines.push(``, desc);
    }

    const waText = encodeURIComponent(
      `Hola, me interesa la propiedad: "${property.title}"` +
      (location ? ` en ${location}` : '') +
      (price ? `, precio ${price}` : '') +
      `. ¿Pueden darme más información?`
    );
    const waLink = `https://wa.me/50499383699?text=${waText}`;

    lines.push(
      ``,
      `Ver propiedad: https://www.aabienes.com/propiedad/${property.id}`,
      ``,
      `¿Interesado? Escríbenos por WhatsApp:`,
      waLink,
      ``,
      `#AaInmobiliaria #ElProgreso #Yoro #BienesRaices #Honduras`
    );

    return lines.join('\n');
  }

  async _postWithPhotos(message, images) {
    const photoIds = [];
    for (const img of images) {
      try {
        const res = await fetch(`${this.apiBase}/${this.pageId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: img.url, published: false, access_token: this.accessToken }),
        });
        const data = await res.json();
        if (data.id) photoIds.push({ media_fbid: data.id });
        else console.warn('[Facebook] Photo upload skipped:', data.error?.message);
      } catch (err) {
        console.warn('[Facebook] Photo upload failed:', err.message);
      }
    }
    if (photoIds.length === 0) return this._postFeed(message);
    return this._postFeed(message, photoIds);
  }

  async _postFeed(message, attachedMedia = null) {
    const body = { message, access_token: this.accessToken };
    if (attachedMedia && attachedMedia.length > 0) body.attached_media = attachedMedia;

    const res = await fetch(`${this.apiBase}/${this.pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  }

  async deletePost(postId) {
    if (!this.pageId || !this.accessToken) return null;
    const res = await fetch(`${this.apiBase}/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: this.accessToken }),
    });
    const data = await res.json();
    if (data.error) console.warn('[Facebook] Delete post failed:', data.error.message);
    return data;
  }
}

module.exports = FacebookService;

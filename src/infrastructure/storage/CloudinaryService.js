const cloudinary = require('../../config/cloudinary');

class CloudinaryService {
  async upload(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'aa-inmobiliaria/properties',
          format: 'webp',
          transformation: [
            { width: 1200, height: 900, crop: 'limit', quality: 'auto' },
          ],
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height });
        }
      );
      stream.end(fileBuffer);
    });
  }

  async destroy(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }
}

module.exports = CloudinaryService;

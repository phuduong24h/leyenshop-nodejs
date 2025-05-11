/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('web_info')
    .insert([
      {
        id: 1,
        name: 'Lê Yên Shop',
        logo: 'https://minio.windduong.com/leyenshop-dev/logo.png',
        phone: '09.123.456.78',
        address: 'Thành phố Hồ Chí Minh',
        zalo: 'Lê Yên Shop',
        zaloLink: 'https://zalo.me/123456789',
        facebook: 'Lê Yên Shop',
        facebookLink: 'https://facebook.com/123456789',
        contact:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
        aboutUs:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
        shippingPolicy:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
        returnPolicy:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
        termOfService:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
    .onConflict('id')
    .merge();
};

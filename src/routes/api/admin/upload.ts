import { Request, Response, Router } from 'express';

import { minioClient } from 'configs/minio';
import objection from 'models/objection';
import uploadService from 'services/upload-service';
import { IFileType } from 'types/common';
import { getExtension, responseError, responseSuccess } from 'utils';

const router = Router();

router.post('/', uploadService.upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, size, mimetype } = req.file || {};

    const fileName = `${Date.now()}_${originalname}`;
    const bucketName = process.env.MINIO_BUCKET;
    const fileUrl = `https://${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    await minioClient.putObject(bucketName, fileName, buffer, size, { 'Content-Type': mimetype });

    const result = await objection.File.query().insertAndFetch({
      url: fileUrl,
      name: fileName,
      fileType: getExtension(originalname) as IFileType,
      mimeType: mimetype
    });

    res.status(200).json(responseSuccess({ message: 'Uploaded', data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/multiple', uploadService.upload.fields([{ name: 'files' }]), async (req: Request, res: Response) => {
  const { files } = req.files as { files: Express.Multer.File[] };

  const trx = await objection.File.startTransaction();

  try {
    if (!files || !Array.isArray(files) || !files.length) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const bucketName = process.env.MINIO_BUCKET;
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    const uploadedFiles = await Promise.all(
      files.map(async file => {
        const { originalname, buffer, size, mimetype } = file;
        const fileName = `${Date.now()}_${originalname}`;
        const fileUrl = `https://${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;

        await minioClient.putObject(bucketName, fileName, buffer, size, { 'Content-Type': mimetype });

        return {
          url: fileUrl,
          name: fileName,
          fileType: getExtension(originalname) as IFileType,
          mimeType: mimetype
        };
      })
    );

    const result = await objection.File.query(trx).insertAndFetch(uploadedFiles);

    await trx.commit();

    res.status(200).json(responseSuccess({ message: 'Files uploaded successfully', data: result }));
  } catch (error) {
    await trx.rollback();

    files.forEach(async file => {
      const fileName = `${Date.now()}_${file.originalname}`;
      await minioClient.removeObject(process.env.MINIO_BUCKET, fileName);
    });

    res.status(400).json(responseError({ error }));
  }
});

export default router;

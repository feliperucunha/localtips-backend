import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import poiView from '../views/pois_view';
import POI from '../models/POI';

export default {
  async index(request: Request, response: Response) {
    const poiRepository = getRepository(POI);

    const pois = await poiRepository.find({
      relations: ['images']
    });

    return response.json(poiView.renderMany(pois));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const poiRepository = getRepository(POI);

    const orphanage = await poiRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(poiView.render(orphanage));
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      whatsapp,
      opening_hours,
      open_on_weekends,
    } = request.body;

    const poiRepository = getRepository(POI);

    const requestImages = request.files as Express.Multer.File[];
    var images = requestImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      whatsapp,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      whatsapp: Yup.string(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = poiRepository.create(data);

    await poiRepository.save(orphanage);

    return response.status(201).json(orphanage);
  }
};

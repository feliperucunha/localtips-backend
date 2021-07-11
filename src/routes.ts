import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import POIController from './controllers/POIController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/pointofinterest', POIController.index);
routes.get('/pointofinterest/:id', POIController.show);
routes.post('/pointofinterest', upload.array('images'), POIController.create);

//Para teste

routes.get('/', (request, response) => {
  const log = {
    "query params": request.query,
    "route params": request.params,
    "body": request.body,
  };

  return response.status(418).json({
    message: "REST API: OK",
    respose: log,
  });
});

export default routes;

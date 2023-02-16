import { RepositoryEnum } from '.';
import { IModel } from '../../types/entities/model';
import { getRepository } from './Repository';

//TODO: should have a transaction passed in?
const StagingModel = () =>
  getRepository<IModel>(RepositoryEnum.models);

export default StagingModel;
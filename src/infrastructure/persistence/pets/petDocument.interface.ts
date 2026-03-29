import { IDocumentRootEntity } from '@infrastructure/_shared/persistence/interfaces/doc.root';

export interface IPetDocument extends IDocumentRootEntity {
  name: string;
  birthDate: Date;
  breed: string;
}

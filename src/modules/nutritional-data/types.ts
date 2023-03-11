export interface CreateNutritionalDataParams {
  description: string;
  file: Express.Multer.File;
  patientId: string;
  nutritionistId: string;
}

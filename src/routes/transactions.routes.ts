import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository, getRepository } from 'typeorm';

import UploadConfig from '../config/multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import Category from '../models/Category';

const transactionsRouter = Router();
const upload = multer(UploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);

  const transactionsAll = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance(transactionsAll);

  const transactionsPromise = transactionsAll.map(async transaction => ({
    id: transaction.id,
    title: transaction.title,
    value: transaction.value,
    type: transaction.type,
    category: await categoriesRepository.findOne(transaction.category_id),
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  }));

  const transactions = await Promise.all(transactionsPromise);

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.json({ message: 'Delete success!!' });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const importTransactionsService = new ImportTransactionsService();

    const requestFilePath = request.file.path;

    const transactions = await importTransactionsService.execute(
      requestFilePath,
    );

    return response.json(transactions);
  },
);

export default transactionsRouter;

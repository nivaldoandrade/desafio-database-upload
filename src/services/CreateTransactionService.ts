import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CreateTransiction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransiction): Promise<Transaction> {
    // TODO
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionsAll = await transactionsRepository.find();

    const balance = await transactionsRepository.getBalance(transactionsAll);

    if (type === 'outcome') {
      if (balance.total - value < 0) {
        throw new AppError('Impossible, not enough balance');
      }
    }

    let transactionCategory = await categoriesRepository.findOne({
      title: category,
    });

    if (!transactionCategory) {
      transactionCategory = await categoriesRepository.save({
        title: category,
      });
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

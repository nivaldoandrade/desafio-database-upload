import fs from 'fs';
import csv from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionsObject {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(requestFilePath: string): Promise<Transaction[]> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const transactions: TransactionsObject[] = [];
    const categories: string[] = [];

    const contactsReadStream = fs.createReadStream(requestFilePath);

    const parses = csv({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parses);

    parseCSV.on('data', async row => {
      const [title, type, value, category] = row.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value || !category) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategoriesBD = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitles = existentCategoriesBD.map(
      category => category.title,
    );

    const newCategories = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const createCategories = categoriesRepository.create(
      newCategories.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(createCategories);

    const finalCategories = [...existentCategoriesBD, ...createCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => transaction.category === category.title,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    fs.promises.unlink(requestFilePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;

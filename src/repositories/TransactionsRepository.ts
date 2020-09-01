import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    // TODO
    const income: number[] = [];
    const outcome: number[] = [];
    const initialValue = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income.push(transaction.value);
      } else if (transaction.type === 'outcome') {
        outcome.push(transaction.value);
      }
    });

    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const incomeTotal = income.reduce(reducer, initialValue);
    const outcomeTotal = outcome.reduce(reducer, initialValue);
    const balanceTotal = incomeTotal - outcomeTotal;

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: balanceTotal,
    };

    return balance;
  }
}

export default TransactionsRepository;

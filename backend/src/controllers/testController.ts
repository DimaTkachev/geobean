import { sequelize } from '../config/sequelize';

import type { Request, Response } from 'express';

interface QueryResult {
  message: string;
}

export const getTestMessage = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [results] = await sequelize.query(
      'SELECT "Hello from MySQL!" as message',
    );
    const typedResults = results as QueryResult[];

    res.json({
      apiMessage: 'Hello from Express API!',
      dbMessage: typedResults[0].message,
    });
  } catch (error) {
    console.error('Test controller error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middleware/auth';
import {
  CoffeeLot,
  Country,
  ProcessingMethod,
  Region,
  Roasting,
  Supplier,
  Weight,
} from '../models';

export const getCoffeeLots = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const coffeeLots = await CoffeeLot.findAll({
      attributes: ['lotID', 'name', 'image'],
      include: [
        { model: Roasting, attributes: ['name'] },
        { model: Weight, attributes: ['value'] },
        { model: Supplier, attributes: ['name'] },
      ],
    });

    const formattedCoffeeLots = coffeeLots.map((lot) => ({
      coffeeLotID: lot.lotID,
      name: lot.name,
      roasting: lot.Roasting?.name,
      weight: lot.Weight?.value,
      supplier: lot.Supplier?.name,
      imageFilename: lot.image,
    }));

    res.json(formattedCoffeeLots);
  } catch (error) {
    console.error('Error fetching coffee lots:', error);
    res.status(500).json({ message: 'Failed to fetch coffee lots', error });
  }
};

export const getCoffeeLotById = async (req: Request, res: Response) => {
  const { lotID } = req.params;
  try {
    const lot = await CoffeeLot.findOne({
      where: { lotID },
      include: [
        { model: Roasting, attributes: ['name'] },
        { model: Weight, attributes: ['value'] },
        { model: Supplier, attributes: ['name', 'url'] },
        {
          model: Region,
          attributes: ['name', 'countryID'],
          include: [{ model: Country, attributes: ['name'] }],
        },
        { model: ProcessingMethod, attributes: ['name'] },
      ],
    });
    if (!lot) return res.status(404).json({ message: 'Not found' });

    res.json({
      lotID: lot.lotID,
      name: lot.name,
      image: lot.image,
      supplier: lot.Supplier?.name,
      supplierLink: lot.Supplier?.url,
      country: lot.Region?.Country?.name,
      region: lot.Region?.name,
      height: lot.height,
      qRate: lot.qRate,
      processingMethod: lot.ProcessingMethod?.name,
      flavorNotes: lot.taste ? lot.taste.split(',') : [],
      description: lot.description,
      weight: lot.Weight?.value,
      roasting: lot.Roasting?.name,
    });
  } catch (e) {
    res.status(500).json({ message: 'Error', error: e });
  }
};

export const getAttributeInfo = (_req: Request, res: Response) => {
  res.json({
    type: 'Тип зерна: описание...',
    supplier: 'Поставщик: описание...',
    country:
      'Кофе выращивают в разных странах мира, каждая из которых обладает уникальным климатом, почвами и традициями производства. Страна происхождения влияет на базовый профиль кофе — от ярких фруктовых нот Эфиопии до шоколадно-ореховых оттенков Бразилии.',
    region:
      'Внутри каждой страны кофе растёт в различных регионах, отличающихся микроклиматом, высотой над уровнем моря и методами фермерства. Например, в Колумбии Уила даёт ягодно-шоколадные профили, а Кения Ньери — интенсивные смородиновые.',
    qRate:
      'Q Rate (Q-грейдер) — профессиональная оценка качества кофе по стандартам Ассоциации спешелти кофе (SCA). Шкала от 0 до 100 баллов, где оценка свыше 80 — спешелти (превосходное качество, сложный вкус), 85+ — исключительные лоты (редкие, с уникальным профилем). Ниже 80 — коммерческий кофе (стандартное качество).',
    processingMethod:
      'Способ обработки определяет базовый профиль кофе: мытая даёт чистую кислотность, натуральная — насыщенную сладость, а экспериментальные методы создают уникальные оттенки. Однако результат зависит от мастерства фермера и погодных условий. Даже в рамках одного метода вкус может существенно варьироваться.',
    height:
      'Чем выше растёт кофе, тем спокойнее его вкус благодаря медленному созреванию зерна. Но в высокогорье зёрна имеют местный микроклимат, перепады температур и состав почвы. Одинаковая высота в разных регионах даёт совершенно разный вкусовой результат.',
    roasting:
      'Степень прожарки зерна напрямую определяет его вкусовой профиль: светлая обжарка сохраняет кислотность и фруктовые ноты, средняя даёт баланс сладости и сложности, а тёмная усиливает плотность тела и шоколадно-ореховые тона. Каждый метод заваривания требует своей оптимальной обжарки — фильтру подходит более светлая, а эспрессо традиционно обжаривают темнее. Контроль температуры и времени обжарки позволяет раскрыть лучшие качества конкретного лота, подчеркнув его уникальность.',
    flavorNotes: 'Вкусовые ноты: описание...',
    weight: 'Вес: описание...',
  });
};

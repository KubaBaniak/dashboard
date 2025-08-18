import { Prisma } from "@prisma/client";

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    _count: { select: { products: true } };
  };
}>;

export type FindPagedResult = { rows: CategoryWithCount[]; total: number };

export type CategoryOptionRow = { id: number; name: string };

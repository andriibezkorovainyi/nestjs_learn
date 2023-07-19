import { TopLevelCategory } from '../top-page/top-page.model/top-page.model';

type RoutemapType = Record<TopLevelCategory, string>;

export const CATEGORY_URL: RoutemapType = {
  courses: '/courses',
  services: '/services',
  books: '/books',
  products: '/products',
};

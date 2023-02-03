export interface MenuItems {
  title: string;
  route: string;
  icon: string;
}

export const Menus: MenuItems[] = [
  {
    title: 'Dashboard',
    route: 'dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Dataset',
    route: 'dataset',
    icon: 'collections',
  },
  {
    title: 'Prediksi',
    route: 'prediksi',
    icon: 'batch_prediction',
  },
  // {
  //   title: 'History',
  //   route: 'history',
  //   icon: 'history',
  // },
];

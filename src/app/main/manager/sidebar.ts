export interface ManagerNavigationItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
      title?: string;
      translate?: string;
      bg?: string;
      fg?: string;
  };
  permission?: string,
  children?: ManagerNavigationItem[];
}

export interface ManagerNavigation extends ManagerNavigationItem {
  children?: ManagerNavigationItem[];
}

export const navigationSidebar: ManagerNavigation[] = [
  {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      icon: 'home',
      url: '/manager/dashboards',
      permission: 'read-dashboard'
  },
  {
      id: 'Clan',
      title: 'Clan',
      type: 'group',
      icon: 'ballot',
      permission: 'read-clan',
      // children: [
      //     {
      //         id: 'sku-generator',
      //         title: 'Sku Generator',
      //         type: 'item',
      //         url: '/apps/sku-generator',
      //         icon: 'email',
      //         exactMatch: true,
      //         permission: 'create-sku_generator'
      //     },
      // ],

  },
  {
      id: 'administration',
      title: 'Amministrazione',
      type: 'group',
      icon: 'ballot',
      permission: 'read-administration',
      children: [{
        id: 'general',
        title: 'Generale',
        type: 'item',
        url: '/manager/administration/general',
        icon: 'dashboard',
        exactMatch: true,
      }],
  }
];
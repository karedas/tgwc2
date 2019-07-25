export interface NavigationItem {
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
  permission?: string;
  children?: NavigationItem[];
}


export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

// export const gameNavigation: ManagerNavigation[] = [
//   {
//     id: 'client',
//     title: 'Client',
//     type: 'group',
//     children: [
//       {
//         id: 'log',
//         title: 'Log di gioco',
//         type: 'item'
//       },
//       {
//         id: 'preferences',
//         title: 'Preferenze',
//         type: 'item'
//       }
//     ]
//   },
// ];


export const baseNavigationSidebar: NavigationItem[] = [

];


export const navigationSidebar: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: '/manager/dashboard',
    permission: 'read-dashboard'
  },

  {
    id: 'Clan',
    title: 'Clan',
    type: 'group',
    icon: 'ballot',
    url: '/manager/clan',
    permission: 'read-clan',
  },
];

export const gameNavigationSideBar: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: '/manager/dashboard',
  },

  {
    id: 'Clan',
    title: 'Clan',
    type: 'group',
    icon: 'ballot',
    url: '/manager/clan',
  },
]
export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
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


export const baseNavigationSidebar: NavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'item',
    icon: 'home',
    url: '/',
  },
  {
    id: 'forum',
    title: 'Forum',
    type: 'item',
    icon: 'forum',
    externalUrl: true,
    openInNewTab: true,
    url: 'http://forum.thegatemud.it'
  },
  {
    id: 'news',
    title: 'Novità',
    type: 'item',
    icon: 'library_books',
    url: '/novita',
  },
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
    id: 'client',
    title: 'Client',
    type: 'group',
    children: [
      {
        id: 'log',
        title: 'Log di gioco',
        type: 'item'
      },
      {
        id: 'preferences',
        title: 'Preferenze',
        type: 'item'
      },
      {
        id: 'disconnectCharacter',
        title: 'Disconnetti personaggio',
        type: 'item'
      }
    ]
  },
  {
    id: 'game',
    title: 'Gioco',
    type: 'group',
    children: [
      {
        id: 'openInfo',
        title: 'Apri informazioni',
        type: 'item'
      },
      {
        id: 'openEquip',
        title: 'Apri Equipaggiamento',
        type: 'item'
      },
      {
        id: 'openInventory',
        title: 'Apri Inventario',
        type: 'item'
      },
      {
        id: 'showSkills',
        title: 'Visualizza Abilità',
        type: 'item'
      },
      {
        id: 'changeCharDescription',
        title: 'Cambia la descrizione personale',
        type: 'item'
      }
    ]
  },
  {
    id: 'help',
    title: 'Aiuto',
    type: 'group',
  },

  // {
  //   id: 'Clan',
  //   title: 'Clan',
  //   type: 'group',
  //   icon: 'ballot',
  //   url: '/manager/clan',
  // },
];

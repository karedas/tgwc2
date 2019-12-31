export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  do?: string;
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
];

export const gameNavigationSideBar: NavigationItem[] = [
  {
    id: 'game',
    title: 'Gioco',
    type: 'group',
    children: [
      {
        id: 'openInfo',
        title: 'Informazioni',
        type: 'item',
        do: 'info'
      },
      {
        id: 'openEquip',
        title: 'Equipaggiamento',
        type: 'item',
        do: 'equip'
      },
      {
        id: 'openInventory',
        title: 'Inventario',
        type: 'item',
        do: 'inventario'
      },
      {
        id: 'showSkills',
        title: 'Abilità conosciute',
        type: 'item',
        do: 'abilita'
      },
      {
        id: 'changeCharDescription',
        title: 'Cambia la descrizione personale',
        type: 'item',
        do: 'cambia desc'
      }
    ]
  },
  {
    id: 'client',
    title: 'Client',
    type: 'group',
    children: [
      {
        id: 'log',
        title: 'Log di gioco',
        type: 'item',
        do: 'log'
      },
      {
        id: 'preferences',
        title: 'Preferenze',
        type: 'item',
        do: 'preferences'
      },
      {
        id: 'disconnectCharacter',
        title: 'Disconnetti',
        type: 'item',
        do: 'disconnect'
      }
    ]
  },
  {
    id: 'help',
    title: 'Aiuto',
    type: 'group',
    children: [
      {
        id: 'commandslist',
        title: 'Comandi',
        type: 'item',
        do: 'comandi'
      },
      {
        id: 'serverStats',
        title: 'Statistiche Server',
        type: 'item',
        do: 'server'
      },
    ]
  },

  // {
  //   id: 'Clan',
  //   title: 'Clan',
  //   type: 'group',
  //   icon: 'ballot',
  //   url: '/manager/clan',
  // },
];

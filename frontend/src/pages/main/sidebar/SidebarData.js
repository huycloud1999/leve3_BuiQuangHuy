import { faHouse,faRightFromBracket, faPaperPlane,faRightToBracket,faLocationDot, faUser, faHeartCircleCheck, faUsers, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';

export const sidebarData = [
  {
    User: [
      {
        path: '/home',
        name: 'Home',
        icon: faHouse,
      },
      {
        path: '/location',
        name: 'Location',
        icon: faLocationDot,
      },
      {
        path: '/profile',
        name: 'Profile',
        icon: faUser,
      },
      {
        path: '/favorite',
        name: 'Favorite',
        icon: faHeartCircleCheck,
      },
      {
        // path: '/signin',
        name: 'Log out',
        icon: faRightFromBracket,
      },
    ],
  },
  {
    Admin: [
      {
        path: '/admin/users',
        name: 'Users',
        icon: faUsers,
      },
      {
        path: '/admin/locations',
        name: 'Locations',
        icon: faLocationCrosshairs,
      },
    ],
  },
];
export const sidebarDataNoUser = [
  {
    User: [
      {
        path: '/home',
        name: 'Home',
        icon: faHouse,
      },
      {
        path: '/Signin',
        name: 'Sign in',
        icon: faRightToBracket,
      },
      {
        path: '/Signup',
        name: 'Sign up',
        icon: faPaperPlane,
      }
    ]
  }
];

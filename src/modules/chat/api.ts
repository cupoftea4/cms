import type { ApiChat, ApiMessage } from "@/shared/types";

const CHATS: ApiChat[] = [
  {
    id: "1",
    avatar: "https://avatars.githubusercontent.com/u/263315",
    name: 'Frens',
    isPrivate: false,
    users: [],
    lastMessage: {
      id: "1",
      text: 'How are you doing? Long time no see! FFFFFFFFFFFFFFFFFFF',
      timestamp: Date.now().toString()
    },
  },
  {
    id: "2",
    avatar: "https://avatars.githubusercontent.com/u/583231",
    name: 'Katie Smith',
    isPrivate: true,
    users: [],
    lastMessage: {
      id: "2",
      text: 'Just walking my dog in the park.',
      timestamp: Date.now().toString()
    },
  },
  {
    id:" 3",
    avatar: "https://avatars.githubusercontent.com/u/207085",
    name: 'Bestie VEEEEEEY LONG NAME',
    isPrivate: true,
    users: [],
    lastMessage: {
      id: "3",
      text: 'Let\'s go to the cinema tonight!',
      timestamp: Date.now().toString()
    },
  },
];

const MESSAGES: ApiMessage[] = [
  {
    id: "8",
    text: 'Hello',
    timestamp: Date.now().toString(),
    sender: {
      id: 1,
      name: 'User 1',
      avatar: 'https://via.placeholder.com/50',
    }
  },
  {
    id: "7",
    text: 'Hey',
    timestamp: Date.now().toString(),
    sender: {
      id: 2,
      name: 'User 2',
      avatar: 'https://via.placeholder.com/51',
    }
  },
  {
    id: "1",
    text: 'Cats are the best!',
    timestamp: Date.now().toString(),
    isRead: true,
    sender: {
      id: 1,
      name: 'User 1',
      avatar: 'https://via.placeholder.com/50',
    }
  },
  {
    id: "2",
    text: 'Dzien dobry',
    timestamp: Date.parse("05 May 2023 00:03:05 GMT").toString(),
    sender: {
      id: 3,
      name: 'User 3',
      avatar: 'https://via.placeholder.com/52',
    }
  },
  {
    id: "5",
    text: 'Dzien dobry',
    timestamp: Date.parse("05 May 2023 02:15:05 GMT").toString(),
    sender: {
      id: 3,
      name: 'User 3',
      avatar: 'https://via.placeholder.com/52',
    }
  },
  {
    id: "3",
    text: 'Dzien dobry',
    timestamp: Date.parse("05 May 2023 02:03:04 GMT").toString(),
    sender: {
      id: 3,
      name: 'User 3',
      avatar: 'https://via.placeholder.com/52',
    }
  },
  {
    id: "6",
    text: 'Quite a long message, isn\'t it? AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    timestamp: Date.parse("05 May 2023 01:03:04 GMT").toString(),
    sender: {
      id: 10,
      name: 'User 10',
      avatar: 'https://via.placeholder.com/52',
    }
  }, 
];


export function getChats() {
  return new Promise((resolve, reject) => setTimeout(() => resolve(CHATS), 1000)) as Promise<ApiChat[]>
}


export function getMessagesByChatId(id: string) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(MESSAGES), 1000)) as Promise<ApiMessage[]>
}


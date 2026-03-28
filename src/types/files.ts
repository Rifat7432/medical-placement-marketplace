export type TFile = {
     fieldname: string;
     originalname: string;
     encoding: string;
     mimetype: string;
     destination: string;
     filename: string;
     path: string;
     size: number;
};
export type TFiles = {
     image: TFile[];
};


type TChat = {
  _id: string;
  isGroup: boolean;
  name?: string;
  participants: string[];
  messages: {
    _id: string;
    sender: string;
    type: 'text' | 'image' | 'file' | 'video';
    content: string;
    timestamp: Date;
  }[];
  lastMessage?: {
    sender: string;
    type: 'text' | 'image' | 'file' | 'video';
    content: string;
    timestamp: Date;
  };
  createdAt: Date;
};

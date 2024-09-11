type ThreadCategory = "THREAD" | "QNA";

type User = {
	userName: string;
	password: string;
	isModerator: boolean;
}

type ThreadTag = {
	id: number;
	name: string;
  };
  
  type Thread = {
	id: number;
	title: string;
	category: ThreadCategory;
	creationDate: string;
	description: string;
	creator: User;
	commentCount: number;
	isLocked: boolean;
	tags: ThreadTag[];
  };

type QNAThread = Thread & {
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}

type ThreadComment = {
	id: number;
	thread: number;
	content: string;
	creator: User
	creationDate: string;
}
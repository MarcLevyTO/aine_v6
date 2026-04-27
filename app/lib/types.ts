export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type StoredState = {
  version: 1;
  todos: Todo[];
};
